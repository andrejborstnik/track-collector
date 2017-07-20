<template>
    <v-container fluid class="text-xs-center">
        <v-tabs dark fixed centered>
            <v-tabs-bar slot="activators" class="blue">
                <v-tabs-slider class="orange"></v-tabs-slider>
                <v-tabs-item
                        href="listgroups"
                        ripple>
                    List groups
                </v-tabs-item>
                <v-tabs-item
                        href="infogroups"
                        ripple>
                    Info groups
                </v-tabs-item>

                <v-tabs-item
                        href="searchgroups"
                        ripple>
                    Search groups
                </v-tabs-item>
            </v-tabs-bar>


            <v-tabs-content id="listgroups">

                <v-flex xs4>
                    <v-layout xs6>
                        <v-flex xs3>
                            <v-btn @click.native.stop="openCPW = !openCPW" class="button">Create new group</v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-dialog v-model="openCPW" hide-overlay scrollable>
                    <v-flex xs8>
                        <v-layout align-center justify-center v-if="openCPW">
                            <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="create_group">
                                <v-layout column>
                                    <h5>Create new group</h5>
                                    <v-text-field
                                            name="group_name"
                                            label="Group name"
                                            id="group_name"
                                            v-model="group_name"
                                            type="text"
                                            class="ma-0"
                                    ></v-text-field>

                                    <v-text-field
                                            name="group_description"
                                            label="Description"
                                            id="group_description"
                                            v-model="group_description"
                                            type="text"
                                            class="ma-0"
                                    ></v-text-field>

                                    <v-flex xm4 class="ma-0">
                                        <v-btn
                                                @click.native.stop="create_group">Create
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-layout>
                    </v-flex>
                </v-dialog>
                <v-dialog v-model="showAlert" persistent lazy>
                    <v-card>
                        <v-card-title>{{errorTitle}}</v-card-title>
                        <v-card-text>{{errorMessage}}</v-card-text>
                        <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showAlert=false">Ok</v-btn>
                        <!--COMMENT  
                        <v-card-row>
                            <v-card-title>{{errorTitle}}</v-card-title>
                        </v-card-row>
                        <v-card-row>
                            <v-card-text>{{errorMessage}}</v-card-text>
                        </v-card-row>
                        <v-card-row actions>
                            <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showAlert=false">Ok</v-btn>
                        </v-card-row>
                        COMMENT -->
                    </v-card>
                </v-dialog>

                <v-card flat>
                    <v-card-text>Prvi text</v-card-text>
                </v-card>

                <v-card flat>
                    <v-card-text>
                        <v-list-tile twoline v-for="group in $store.user.groups" v-bind:key="group.groupId">
                            <v-list-tile-avatar>
                                <v-icon>group</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="group.groupId"></v-list-tile-title>
                                <v-list-tile-sub-title>{{ group.creatorId }} </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="is_admin(group)">
                                <v-btn icon v-on:click.native.stop="admin_action(group)">
                                    <v-icon>bubble_chart</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="leave_group">
                                    <v-icon>directions_run</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>

                        </v-list-tile>
                    </v-card-text>
                </v-card>
            </v-tabs-content>

            <v-tabs-content id="infogroups">
                <v-card flat>
                    <v-card-text>Drugi text</v-card-text>
                </v-card>
                {{ $store.user.groups }}


            </v-tabs-content>

            <v-tabs-content id="searchgroups">
                <v-card flat>
                    <v-card-text>Tretji text</v-card-text>
                </v-card>

                <v-card flat>
                    <v-card-text>
                        <input v-model="search" placeholder="search">
                        <v-list-tile twoline v-for="group in filteredList" v-bind:key="group.groupId">
                            <v-list-tile-avatar>
                                <v-icon>group</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="group.groupId"></v-list-tile-title>
                                <v-list-tile-sub-title>{{ group.creatorId }} </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="is_admin(group)">
                                <v-btn icon v-on:click.native.stop="admin_action(group)">
                                    <v-icon>bubble_chart</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="leave_group">
                                    <v-icon>directions_run</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>

                        </v-list-tile>
                    </v-card-text>
                </v-card>

                <!--COMMENT                                    
                <v-card flat>
                    <v-card-text>
                        <v-list-group v-for="group in $store.user.groups" :value="group.active" :key="group.groupId">
                            <v-list-tile slot="item">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ group.groupId }}</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-avatar>
                                    <v-btn icon v-on:click.native="edit_TEMPLATE_ACTION">
                                        <v-icon>label</v-icon>
                                    </v-btn>
                                    COMMENT
                                    ##prva za admin, ta pa za klasicnega uporabnika
                                    ##tole vseskupaj izgleda cudno (kako bo link na grupo v resnici?)
                                    <v-btn icon v-on:click.native="edit_TEMPLATE_ACTION">
                                        <v-icon>label_outline</v-icon>
                                    </v-btn>
                                    COMMENT
                                </v-list-tile-avatar>
                            </v-list-tile>
                        </v-list-group>
                    </v-card-text>
                </v-card>
                COMMENT-->
            </v-tabs-content>

        </v-tabs>

        <v-dialog v-model="UserAddAppVisible" hide-overlay width="800" scrollable>
            <v-card>
                <UserAddApp :group="UserAddAppGroup"></UserAddApp>
            </v-card>
        </v-dialog>
    </v-container>


</template>


<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';
    import {activate_mixin} from 'common/activate-mixin';
    import UserAddApp from 'pages/UserAddApp.vue';
    import GroupsStorage from 'common/GroupsStorage';



    const activate = function () {
        this.$store.user.leftMenuEnabled = false;
        this.$store.user.rightMenuEnabled = true;
        this.$store.user.bottomNavigation = [];
        var grpStr = new GroupsStorage(this.$store);
        grpStr.getGroups();
    };

    const is_admin = function (group) {
        //console.info("GROUP ADMIN");
        for (let user of group.users) {
            //POZOR
            //tole je sedaj nekonsisteno
            //enkrat ..user.email enkrat pa userId
            //ko bo konsistentno drugje je treba se tu
            //console.info(user);
            //console.info(this.$store.user.email);
            //console.info(user.userId);
            if(this.$store.user.email == user.userId) {
                //console.info(user);
                //console.info(user.isAdmin);
                return user.isAdmin;
            }
        }
    };

    const leave_group = function () {
        console.info("you left group");
    };

    const admin_action = function (group) {
        console.info("admin_action");
        this.UserAddAppGroup = group;
        this.UserAddAppVisible = !this.UserAddAppVisible;
    };

    const create_group = function () {
        let new_group_data = {
            groupId: this.group_name,
            description: this.group_description,
            token: this.$store.user.token,
        };
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/register`,
            json: new_group_data
        }).then((body) => {
            if (body.status == "OK") {
                this.errorTitle = "New group created.";
                this.errorMessage = "";
                this.showAlert = true;
            }
            else {
                this.errorTitle = "Failed.";
                this.errorMessage = "Group creation faild: " + String(body.error_message);
                this.showAlert = true;
            }
        }).catch((err) => {
            this.errorTitle = "Failed";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
        console.info("create group end");
    };

    export default {
        name: 'Groups',

        mixins: [activate_mixin],

        data () {
            return {
                openCPW: false,
                showAlert: false,
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
                UserAddAppVisible: false,
                UserAddAppGroup: ""

            }
        },
        computed: {
            filteredList() {
                //console.info("AAAA");
                //console.info(this.$store.user.email);
                //console.info(this.$store.user.token);
                //console.info(this.$store.user.groups);
                console.info("filteredList");
                //POZOR
                //to je nujno treba narediti na backend tu nima smisla
                //bomo iskali tudi po grupah, ki se niso nase (nismo clani)
                if (this.$store.user.groups==null) {
                    return null;
                }
                return this.$store.user.groups.filter(group => {
                        return group.groupId.toLowerCase().indexOf(this.search.toLowerCase()) > -1
                    }
                )
                //*/
            }
        },

        methods: {
            activate,
            is_admin,
            leave_group,
            admin_action,
            create_group
        },
        components: {
            UserAddApp
        }
    }

</script>
