<template>
    <v-container fluid class="text-xs-center">
        <div class="display-1">Managing group:</div>
        <br>
        <div class="headline">{{group.groupId}}</div>
        <v-tabs dark fixed centered>
            <v-tabs-bar slot="activators" class="blue">
                <v-tabs-slider class="orange"></v-tabs-slider>
                <v-tabs-item
                        href="aau"
                        ripple>
                    Add a User
                </v-tabs-item>
                <v-tabs-item
                        href="mu"
                        ripple>
                    Manage Users
                </v-tabs-item>
                <v-tabs-item
                        href="ei"
                        ripple>
                    Extended invitations
                </v-tabs-item>

                <v-tabs-item
                        href="pr"
                        ripple
                >
                    Pending requests
                </v-tabs-item>
                <v-tabs-item
                        href="updategroup"
                        ripple
                >
                    Update group
                </v-tabs-item>
            </v-tabs-bar>
            <v-tabs-content id="aau">
                <v-flex xs12>
                    <v-card flat>
                        <v-card-text>
                            <!-- ADD A USER -->
                            <!--Mozne ikone se pogleda na https://material.io/icons/-->

                            <!--COMMENT
                            <input v-model="searchAdd" placeholder="search (at least 3 letters)" @keyup.enter="getSearchResultsAdd">
                            <v-btn icon v-on:click.native.stop="getSearchResultsAdd">
                                <v-icon>search</v-icon>
                            </v-btn>
                            COMMENT-->

                            <v-text-field
                            name="inputSRCusr"
                            autofocus
                            label="Search (at least 3 letters)"
                            single-line
                            v-model="userQueryStr"
                            ></v-text-field>

                            <v-list-tile twoline v-for="user in searchResults" v-bind:key="user.name">
                                <v-list-tile-avatar>
                                    <v-icon>person</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="user.userId"></v-list-tile-title>
                                </v-list-tile-content>
                                <!--<v-list-tile-avatar v-if="user.inGroup==false">-->
                                <!--<v-btn icon-->
                                <!--v-on:click.native.stop="inviteUserVisible = true ; userToInvite=user ;">-->
                                <!--<v-icon>add</v-icon>-->
                                <!--</v-btn>-->
                                <!--</v-list-tile-avatar>-->
                                <v-menu v-if="user.inGroup==false" offset-y>
                                    <v-btn primary dark slot="activator">Invite</v-btn>
                                    <v-list>
                                        <v-list-tile v-on:click.native.stop="createNewInvite(user,'ADMIN')">
                                            <v-list-tile-title>As Admin</v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile v-on:click.native.stop="createNewInvite(user,'USER')">
                                            <v-list-tile-title>As User</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                                <v-btn v-if="user.inGroup==true" primary dark>Member</v-btn>
                            </v-list-tile>
                            <div v-if="!searchResults">
                                No results.
                            </div>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-tabs-content>

            <v-tabs-content id="mu">
                <v-flex xs12>
                    <v-card flat>
                        <v-card-text>
                            <!-- ADD A USER -->
                            <!--Mozne ikone se pogleda na https://material.io/icons/-->
                            <input v-model="searchManage" placeholder="filter">
                            <v-list-tile twoline v-for="user in filteredUserList" v-bind:key="user.name">
                                <v-list-tile-avatar>
                                    <v-icon>person</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{user.userId}}</v-list-tile-title>
                                    <v-list-tile-sub-title v-if="user.isAdmin"> Admin </v-list-tile-sub-title>
                                    <v-list-tile-sub-title v-if="!user.isAdmin"> User </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-avatar v-if="!user.isAdmin">
                                    <v-btn icon>
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </v-list-tile-avatar>
                            </v-list-tile>
                            <div v-if="filteredUserList.length==0">
                                No results.
                            </div>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-tabs-content>

            <v-tabs-content id="ei">
                <v-flex xs12>
                    <v-card flat>
                        <v-list-tile twoline v-for="invite in extendedInvitations">
                            <v-list-tile-avatar>
                                    <v-icon>person</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{invite.userId}}</v-list-tile-title>
                                    <v-list-tile-sub-title> Role: {{invite.groupRole}} </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-avatar>
                                    <v-btn icon>
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </v-list-tile-avatar>
                        </v-list-tile>
                        <div v-if="extendedInvitations">
                            No Extended Invitations
                        </div>
                    </v-card>
                </v-flex>
            </v-tabs-content>

            <v-tabs-content id="pr">
                <v-flex xs12>
                    <v-card v-for="request in pendingRequests">
                        <v-card-title>
                            <div>
                                User: {{request.userId}}<br>
                                From: {{request.fromDate == null ? "Beginning" : request.fromDate}}<br>
                                To:   {{request.untilDate == null ? "Forever" : request.untilDate}}<br>
                                Requested role: {{request.groupRole}}<br>
                                Timestamp: {{ request.timestamp }}<br>
                            </div>
                        </v-card-title>
                        <v-card-actions center>
                            <v-btn flat v-on:click.native.stop="handlePendingRequest(request,true)">Accept</v-btn>
                            <v-btn flat v-on:click.native.stop="handlePendingRequest(request,true)">Deny</v-btn>
                        </v-card-actions>
                    </v-card>
                    <div v-if="pendingRequests">
                        No Pending Requests
                    </div>
                </v-flex>

            </v-tabs-content>

            <v-tabs-content id="updategroup">
                <v-flex xs12>
                    <v-dialog v-model="showAlert" persistent lazy>
                        <v-card>
                            <v-card-title>{{errorTitle}}</v-card-title>
                            <v-card-text>{{errorMessage}}</v-card-text>
                            <v-btn class="green--text darken-1" flat="flat" v-on:click.native="potrditevSporocila">Ok</v-btn>
                        </v-card>
                    </v-dialog>

                    <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="updateGroup">
                        <v-layout column>
                            <h5>Update group</h5>

                            <v-text-field
                                    name="group_description"
                                    label="New group description"
                                    id="group_description"
                                    v-model="groupDescription"
                                    type="text"
                                    class="ma-0"
                            ></v-text-field>

                            <v-flex xm4 class="ma-0">
                                <v-btn
                                        @click.native.stop="updateGroup">Update
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-tabs-content>


        </v-tabs>
        <!--<v-dialog v-model="inviteUserVisible" hide-overlay width="1000" content-class="z-index: 100">-->
        <!--<v-card>-->
        <!--<v-card-title>Inviting user {{userToInvite}} to group {{group.groupId}}. </v-card-title>-->
        <!--</v-card>-->
        <!--</v-dialog>-->


    </v-container>

</template>


<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';
    import moment from 'moment-timezone';
    import {activate_mixin} from 'common/activate-mixin';

    const updateGroup = function () {
        console.info("Spreminjamo:");
        console.info(this.group.groupId);
        let groupNewData = {
            groupId: this.group.groupId,
            description: this.groupDescription,
            token: this.$store.user.token
        };
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/update`,
            json: groupNewData
        }).then((body) => {
            if (body.status == "OK") {
                this.errorTitle = "Group description updated.";
                this.errorMessage = "";
                this.showAlert = true;
            }
            else {
                this.errorTitle = "Failed.";
                this.errorMessage = "Group description update failed: " + String(body.error_message);
                this.showAlert = true;
            }
        }).catch((err) => {
            this.errorTitle = "Failed";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
    };

    const potrditevSporocila = function () {
        this.showAlert=false; 
        //tu mogoce to smiselno ali pa ne, oboje se kar ok
        this.$router.go(0);
    };

    const getGroupLinks = function () {
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/list`,
            json: {
                "forGroupId": this.group.groupId,
                "pendingOnly": true,
                "token": this.$store.user.token
            }
        }).then((body) => {
            this.groupLinks = body.assignments;
            console.log("group links:",this.groupLinks);
            return;
        }).catch((err) => {
            console.log("Error with get pending requsts");
        });
    };


    const timeDelaySearchResultsAdd = function () {
        let searchStrFix = String(this.userQueryStr);
        setTimeout(function(){ 
            if (this.userQueryStr == searchStrFix) {
                this.getSearchResultsAdd(searchStrFix);
            }
        }.bind(this), 300);
    }

    const getSearchResultsAdd = function (searchStrFix) {
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/authentication/list`,
            json: {
                "queryString": searchStrFix,//this.searchAdd,
                "token": this.$store.user.token
            }
        }).then((body) => {
            this.searchResults = body.users;
            for (let i of this.searchResults) {
                i.inGroup = this.group.users.some(function (el) {
                    return el.userId === i.userId;
                });
            }
            return;
        }).catch((err) => {
            console.log("Error with getSearchResultsAdd");
        });
    };

    const createNewInvite = function (user, role) {
        console.log("doing things", role);
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/register`,
            json:
                {
                    "requests": [
                        {
                            "fromDate": moment().toISOString(),
                            "grant": "ALLOW",
                            "groupId": this.group.groupId,
                            "groupRole": role,
                            "inviteType": "GROUP",
                            "untilDate": null,
                            "userId": user.userId
                        }
                    ],
                    "token": this.$store.user.token
                }
        }).then((body) => {
            this.getGroupLinks();
            console.log("greata - success", body);
            return;
        }).catch((err) => {
            console.log("Error with createNewInvite", err);
        });
    };

    const handlePendingRequest = function (req, accepted) {
        var req_json = {
            "forUserId": this.$store.user.email,
            "forUserIdProvider": this.$store.user.provider,
            "token": this.$store.user.token
        }
        if (accepted) {
            req.confirmLinks = [req.id];
        } else {
            req.rejectLinks = [req.id];
        }


        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/update`,
            json: req_json
        }).then((body) => {
            this.getGroupLinks();
            return;
        }).catch((err) => {
            console.log("Error with handling pending requst");
        });

    };


    export default {
        name: 'UserAddApp',

        props: ['group'],
        mixins: [activate_mixin],

        data() {
            return {
                //searchAdd: "",
                showAlert: false,
                searchManage: "",
                groupLinks: null,
                searchResults: null,
                userToInvite: null,
                inviteUserVisible: false,
                userQueryStr: "",
                groupDescription : ""
            }
        },
        computed: {
            filteredUserList() {
                if (this.group.users) {
                    return this.group.users.filter(item => {
                            return item.userId.toLowerCase().indexOf(this.searchManage.toLowerCase()) > -1

                        }
                    )
                } else return [];
            },
            extendedInvitations() {
                if (this.groupLinks) {
                    return this.groupLinks.filter(el => {
                        return el.groupId===this.group.groupId && el.inviteType==='GROUP'
                    });
                } else {
                    return [];
                }
            },
            pendingRequests() {
                if (this.groupLinks) {
                    return this.groupLinks.filter(el => {
                        return el.groupId===this.group.groupId && el.inviteType==='USER'
                    });
                } else {
                    return [];
                }
            }

        }

        ,
        methods: {
            getGroupLinks,
            getSearchResultsAdd,
            handlePendingRequest,
            createNewInvite,
            timeDelaySearchResultsAdd,
            updateGroup,
            potrditevSporocila
        },
        watch: {
            userQueryStr: function () {
                this.timeDelaySearchResultsAdd(this.userQueryStr);
            },

            group: function () {
                this.getGroupLinks();
                this.groupDescription = this.group.description;
            }
        }

    }

</script>
