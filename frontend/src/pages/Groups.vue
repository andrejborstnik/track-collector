<template>
    <v-container fluid class="text-xs-center">
        <v-tabs dark fixed centered>
            <v-tabs-bar slot="activators" class="blue">
                <v-tabs-slider class="orange"></v-tabs-slider>
                <v-tabs-item
                        href="aau"
                        ripple>
                    List groups
                </v-tabs-item>
                <v-tabs-item
                        href="ei"
                        ripple>
                    Extended invitations
                </v-tabs-item>

                <v-tabs-item
                        href="pr"
                        ripple>
                    Pending requests
                </v-tabs-item>
            </v-tabs-bar>


            <v-tabs-content id="aau">
                <v-card flat>
                    <v-card-text>
                        <input v-model="search" placeholder="search">
                        <v-list-tile twoline v-for="group in $store.user.groups" v-bind:key="group.groupId">
                            <v-list-tile-avatar>
                                <v-icon>person</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="group.groupId"></v-list-tile-title>
                                <v-list-tile-sub-title>{{ group.creatorId }} {{ group.isAdmin }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="is_admin()">
                                <v-btn icon v-on:click.native.stop="admin_action">
                                    <v-icon>transfer_within_a_station</v-icon>
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

            <v-tabs-content id="ei">
                <v-card flat>
                    <v-card-text>Drugi text</v-card-text>
                </v-card>
                {{ $store.user.groups }}


            </v-tabs-content>

            <v-tabs-content id="pr">
                <v-card flat>
                    <v-card-text>Tretji text</v-card-text>
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
            <UserAddApp></UserAddApp>
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

    const activate = function () {
        this.$store.user.leftMenuEnabled = false;
        this.$store.user.bottomNavigation = [];
    };

    const is_admin = function () {
        return true;
    };

    const leave_group = function () {
        console.info("you left group");
    };

    const admin_action = function () {
        console.info("admin_action");
        this.UserAddAppVisible = !this.UserAddAppVisible;
    };

    export default {
        name: 'Groups',

        mixins: [activate_mixin],


        data () {
            return {
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
                UserAddAppVisible: false

            }
        },
        computed: {
            filteredList() {
                /*
                 return this.dummyList.filter(item => {
                 return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1

                 }
                 )
                 /*/
                this.activate()
                console.info("AAAA");
                console.info(this.$store.user.email);
                console.info(this.$store.user.token);
                console.info(this.$store.user.groups);
                console.info("BBBBB");
                return this.dummyList.filter(item => {
                        return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1

                    }
                )
                //*/
            }
        },

        methods: {
            activate,
            is_admin,
            leave_group,
            admin_action
        },
        components: {
            UserAddApp
        }
    }

</script>
