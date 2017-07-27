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
                        v-on:click.native.stop="getPendingRequests">
                    Pending requests
                </v-tabs-item>
            </v-tabs-bar>
            <v-tabs-content id="aau">
                <v-card flat>
                    <v-card-text>
                        <!-- ADD A USER -->
                        <!--Mozne ikone se pogleda na https://material.io/icons/-->
                        <input v-model="searchAdd" placeholder="search" @keyup.enter="getSearchResultsAdd">
                        <v-btn icon v-on:click.native.stop="getSearchResultsAdd">
                            <v-icon>search</v-icon>
                        </v-btn>
                        <v-list-tile twoline v-for="user in this.searchResults" v-bind:key="user.name">
                            <v-list-tile-avatar>
                                <v-icon>person</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="user.userId"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>


                    </v-card-text>
                </v-card>
            </v-tabs-content>

            <v-tabs-content id="mu">
                <v-card flat>
                    <v-card-text>
                        <!-- ADD A USER -->
                        <!--Mozne ikone se pogleda na https://material.io/icons/-->
                        <input v-model="searchManage" placeholder="search">
                        <v-list-tile twoline v-for="user in filteredUserList" v-bind:key="user.name">
                            <v-list-tile-avatar>
                                <v-icon>person</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="user.userId"></v-list-tile-title>
                                <v-list-tile-sub-title> Timestamp: {{user.timestamp}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="user.isAdmin==false">
                                <v-btn icon>
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                        </v-list-tile>


                    </v-card-text>
                </v-card>
            </v-tabs-content>

            <v-tabs-content id="ei">
                <v-card flat>
                    <v-list-tile twoline v-for="user in group.users" v-bind:key="user.name">
                        <v-list-tile-avatar>
                            <v-icon>person</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title v-html="user.userId"></v-list-tile-title>
                            <v-list-tile-sub-title>{{user.isAdmin}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-card>
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
                </v-flex>

            </v-tabs-content>

        </v-tabs>
    </v-container>
</template>


<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';

    const getPendingRequests = function () {
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/list`,
            json: {
                "forGroupId": this.group.groupId,
                "pendingOnly": false,
                "token": this.$store.user.token
            }
        }).then((body) => {
            this.pendingRequests = body.assignments;
            return;
        }).catch((err) => {
            console.log("Error with pending requsts");
        });
    };

    const getSearchResultsAdd = function () {
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/authentication/list`,
            json: {
                "queryString": this.searchAdd,
                "token": this.$store.user.token
            }
        }).then((body) => {
            this.searchResults = body.users;
            return;
        }).catch((err) => {
            console.log("Error with pending requsts");
        });
    };


    const handlePendingRequest = function (req, accepted) {
            var req_json = {
                "forUserId": this.$store.user.userId,
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
                this.getPendingRequests();
                return;
            }).catch((err) => {
                console.log("Error with handling pending requst");
            });

    };


    export default {
        name: 'UserAddApp',

        props: ['group'],


        data () {
            return {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                dummyList: [
                    {
                        name: "Alen",
                        status: "Participating"
                    },
                    {
                        name: "Alja",
                        status: "Invited"
                    },
                    {
                        name: "Ales",
                        status: "Requested"
                    },
                    {
                        name: "Joze",
                        status: "Nothing"
                    }
                ],
                searchAdd: "",
                searchManage: "",
                pendingRequests: null,
                searchResults: null
            }
        },
        computed: {
            filteredDummyList() {
                return this.dummyList.filter(item => {
                        return item.name.toLowerCase().indexOf(this.searchAdd.toLowerCase()) > -1

                    }
                )
            },
            filteredUserList(){
                return this.group.users.filter(item => {
                    return item.userId.toLowerCase().indexOf(this.searchManage.toLowerCase()) > -1

                    }
                )
            }
        }

        ,
        methods: {
            getPendingRequests,
            getSearchResultsAdd,
            handlePendingRequest
        }


    }

</script>
