<template>
    <v-container fluid class="text-xs-center">
        <v-subheader>{{group.groupId}}</v-subheader>
        <v-tabs dark fixed centered>
            <v-tabs-bar slot="activators" class="blue">
                <v-tabs-slider class="orange"></v-tabs-slider>
                <v-tabs-item
                        href="aau"
                        ripple>
                    Add a user
                </v-tabs-item>
                <v-tabs-item
                        href="ei"
                        ripple>
                    Extended invitations
                </v-tabs-item>

                <v-tabs-item
                        href="pr"
                        ripple
                        v-on:click.native.stop="getPendingRequests(group)">
                    Pending requests
                </v-tabs-item>
            </v-tabs-bar>
            <v-tabs-content id="aau">
                <v-card flat>
                    <v-card-text>
                        <!-- ADD A USER -->
                        <!--Mozne ikone se pogleda na https://material.io/icons/-->
                        <input v-model="search" placeholder="search">
                        <v-list-tile twoline v-for="user in filteredList" v-bind:key="user.name">
                            <v-list-tile-avatar>
                                <v-icon>person</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="user.name"></v-list-tile-title>
                                <v-list-tile-sub-title>{{user.status}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="user.status=='Nothing'">
                                <v-btn icon>
                                    <v-icon>group_add</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Participating'">
                                <v-btn icon>
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Requested'">
                                <v-btn icon>
                                    <v-icon>done</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Invited' || user.status=='Requested'">
                                <v-btn icon>
                                    <v-icon>clear</v-icon>
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

    const getPendingRequests = function (group) {
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/list`,
            json: {
                "forGroupId": group.groupId,
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
                this.getPendingRequests(this.group);
                return;
            }).catch((err) => {
                console.log("Error with handling pending requst");
            });

        }
    ;

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
                search: "",
                pendingRequests: null
            }
        },
        computed: {
            filteredList() {
                return this.dummyList.filter(item => {
                        return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1

                    }
                )
            }
        },
        methods: {
            getPendingRequests,
            handlePendingRequest
        }


    }

</script>
