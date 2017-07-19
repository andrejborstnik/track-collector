import * as config from 'config';
const request = require('request-promise-native');

export default class GroupsStorage {
    constructor(str) {
        this.store = str;
    }

    getGroups() {
        let path = `/group/list`;
        //this.startLoading();
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                token: this.store.user.token,
            }
        }).then((body) => {
            //this.endLoading();
            if (body.status == "OK") {
                this.updateGroups(body.groups);
            }
        });
    }

    updateGroups(groups) {
        let old = this.store.user.groups;
        this.store.user.groups = this.initializeGroups(groups);
        this.updateOrInitializeGroups(old);
    };

    updateOrInitializeGroups(groups) {
        if (groups == null) {
            return;
        }
        // initializes non-initialized groups
        let toGroupNew = new Map();
        let toUserInGroupNew = new Map();
        for (let grp of this.$storage.user.groups) {
            toGroupOld.set(grp.groupId, grp);
            let tmpMap = new Map();
            toUserInGroupNew.set(grp.groupId, tmpMap);
            for (let usr of grp.users) {
                tmpMap.set(usr.userId, usr);
            }
        }
        for (let grp of groups) {
            let targetGroup = toGroupOld.get(grp.groupId);
            if (targetGroup == null) continue;
            targetGroup.visible = grp.visible;
            let tmpMap = toUserInGroupNew.get(grp.groupId);
            if (tmpMap == null) continue;
            for (usr of grp.users) {
                let targetUser = tmpMap.get(usr.userId);
                if (targetUser == null) continue;
                targetUser.visible = usr.visible;
                targetUser.style = usr.style;
            }
        }
    };

    initializeGroups(groups) {
        for (let grp of groups) {
            grp.visible = false;
            for (let user of grp.users) {
                if (grp.personalGroupUserId === user.userId) {
                    user.visible = true;
                    grp.withVisibleUser = true;
                } else {
                    user.visible = false;
                }
                user.style = {color: this.store.pallete.next()};
            }
        }
        return groups;
    }
}
