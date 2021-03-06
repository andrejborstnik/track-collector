import * as config from 'config';
const request = require('request-promise-native');

export default class GroupsStorage {
    constructor(str) {
        this.store = str;
    }

    getGroups(funcPreReq = null, funcPosReq = null, funcSetVis = null) {
        let path = `/group/list`;
        if (funcPreReq != null){
                funcPreReq();
        }
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                token: this.store.user.token,
            }
        }).then((body) => {
            if (funcPosReq != null){
                funcPosReq();
            }
            if (body.status == "OK") {
                this.updateGroups(body.groups);
                if(funcSetVis) {
                    this.setVisibleCallback(funcSetVis);
                }
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
        for (let grp of this.store.user.groups) {
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
                    this.store.user.selectedUser = {"username": user.userId, "groupId": grp.groupId, "name":user.name};
                } else {
                    user.visible = false;
                }
                user.style = {color: this.store.pallete.next()};
            }
        }
        return groups;
    };

    setVisibleCallback(fun) {
      let groups = this.store.user.groups;
      for (let grp of groups) {
          for (let user of grp.users) {
              user.visibleCallback = fun;
          }
      }
    };

    setAllVisible() { //set of drivers logged in user can see
        let usersArray = [];
        for (let grp of this.store.user.groups) {
            grp.withVisibleUser = false;
            for (let user of grp.users) {
                if (usersArray.indexOf(user.userId) == -1) usersArray.push(user.userId);
                user.visible = true;
            }
        }
        return usersArray;
    };

    setSelectedUserVisibleOnly(selectedUser) { // when switching from LIVE to HISTORY mode
        for (let grp of this.store.user.groups) {
            grp.visible = false
            for (let user of grp.users) {
                if (selectedUser.groupId == grp.groupId && selectedUser.username === user.userId) {
                    user.visible = true;
                    grp.withVisibleUser = true;
                } else {
                    user.visible = false;
                }
            }
        }
    };

    setGroupWithVisibleUser(groupId, historyMode, username) { // set group with visible user, also set user visible in history mode
        for (let grp of this.store.user.groups) {
            grp.visible = false
            if(groupId && grp.groupId == groupId) {
                grp.withVisibleUser = true;
                if(historyMode) {
                    let tmp = grp.users.map((user) => { user.visible = (username == user.userId) ? true : false; return user; })
                    grp.users = tmp;
                }             
            } else {
                grp.withVisibleUser = false;
                if(historyMode) {
                    let tmp = grp.users.map((user) => { user.visible = false; return user; })
                    grp.users = tmp;
                }
            }
        }
    };

}
