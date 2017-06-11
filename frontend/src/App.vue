<template>
    <v-app id="example-2">
        <v-navigation-drawer temporary hide-overlay v-model="drawerLeft" v-bind:close-on-click="false" light>
            <v-list class="pa-0">
                <v-list-item>
                    <v-list-tile avatar tag="div">
                        <v-list-tile-avatar>
                            <v-icon :class="['amber white--text']">{{ 'call_to_action' }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>Groups</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon dark @click.native.stop="drawerLeft = !drawerLeft">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-item>
            </v-list>
            <v-list>
                <v-list-group v-for="group in $store.groups" :value="group.active" :key="group.groupId">
                    <v-list-tile slot="item">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ group.groupId }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-item v-for="user in group.users" :key="user.userId">
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ user.userId }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer temporary hide-overlay v-model="drawerRight" :close-on-click="false" right light>
            <v-list class="pa-0">
                <v-list-item>
                    <v-list-tile avatar tag="div">
                        <v-list-tile-avatar>
                            <v-icon v-bind:class="['amber white--text']">{{ 'call_to_action' }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{$store.user.email}}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon dark v-on:click.native.stop="drawerRight = !drawerRight">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-item>
            </v-list>
            <v-list class="pt-0" dense>
                <v-divider></v-divider>

                <v-list-item>
                    <v-list-tile v-on:click.native="profile">
                        <v-list-tile-action>
                            <!--COMMENT
                            <v-icon>dashboard</v-icon>
                            COMMENT-->
                            <v-icon>perm_identity</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-item>

                <v-list-item>
                    <v-list-tile v-on:click.native="logout">
                        <v-list-tile-action>
                            <v-icon>question_answer</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Logout</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-item>

                <v-list-item>
                    <v-list-tile v-on:click.native="edit_TEMPLATE_ACTION">
                        <v-list-tile-action>
                            <!--COMMENT
                            <v-icon>dashboard</v-icon>
                            COMMENT-->
                            <v-icon>mode_edit</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Edit_TEMPLATE</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-item>


            </v-list>
        </v-navigation-drawer>
        <v-toolbar fixed light>
            <v-toolbar-side-icon light @click.native.stop="drawerLeft = !drawerLeft"></v-toolbar-side-icon>
            <v-toolbar-title>Tracker</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon light @click.native.stop="drawerRight = !drawerRight">
                <v-icon>account_circle</v-icon>
            </v-btn>
        </v-toolbar>
        <main>
                <router-view></router-view>
        </main>
    </v-app>
</template>


<style lang="scss">

</style>


<script type="text/babel">

    //
    // EXPORT
    //
    import * as cookies from 'common/cookies';

    const profile = function () {
        console.info("Profile function.");
        //this.$router.go('profile');
        this.$router.push('profile');
    };

    const logout = function () {
        cookies.remove_session_cookie();
        this.$router.go(0);
    };

    const edit_TEMPLATE_ACTION = function () {
        console.info("EDIT_TEMPLATE spremeni vse te oblike za nov meni.");
    };

    export default {
        name: 'App',
        data () {
            return {
                drawerLeft: null,
                drawerRight: null,
                leftItems: [
                    {title: 'Home', icon: 'dashboard'},
                    {title: 'About', icon: 'question_answer'}
                ],
                rightItems: [
                    //{title: 'Profile', icon: 'dashboard', action: "profile"},
                    {title: 'Profile', icon: 'perm_identity', action: "profile"},
                    {title: 'Logout', icon: 'question_answer', action: "logout"},
                    {title: 'Edit_TEMPLATE', icon: 'mode_edit', action: "edit_TEMPLATE_ACTION"}
                ],
                mini: true,
                right: null
            }
        },
        methods: {
            profile,
            logout,
            edit_TEMPLATE_ACTION
        }
    }

</script>
