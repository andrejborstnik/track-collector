<template>
    <v-app id="example-2" standalone>
        <v-navigation-drawer temporary hide-overlay v-model="drawerLeft" v-bind:close-on-click="false" light>
            <v-list class="pa-0">
                    <v-list-tile avatar tag="div">
                        <v-list-tile-avatar>
                            <v-icon :class="['amber white--text']">{{ 'call_to_action' }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>Groups</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon dark @click.native.stop="toggleLeftMenu">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
            </v-list>
            <v-list class="pa-0">
                    <v-list-tile avatar tag="div">
                      <v-text-field
                        name="input-1-3"
                        autofocus
                        label="Search..."
                        single-line
                        v-model="groupFilter"
                      ></v-text-field>
                    </v-list-tile>
            </v-list>

            <v-list>
                <v-list-group v-for="group in $store.user.groups" :key="group.groupId" group="group.groupId" v-if="!group.filteredOut" v-model="group.active">
                    <v-list-tile slot="item">
                        <v-list-tile-content>
                            <v-list-tile-title style="font-weight: normal;" v-if="!group.withVisibleUser">{{ group.groupId }}</v-list-tile-title>
                            <v-list-tile-title style="font-weight: bold;" v-if="group.withVisibleUser">{{ group.groupId }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon v-on:click.native="toggleGroupVisibility(group)">
                              <v-icon>keyboard_arrow_down</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-for="user in group.users" :key="user.userId" v-if="!user.filteredOut">
                        <v-list-tile-content>
                            <v-list-tile-title
                            >{{ user.userId }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn icon v-on:click.native="toggleVisibility(user)">
                              <v-icon v-if="user.visible" light>visibility</v-icon>
                              <v-icon v-if="!user.visible" light>visibility_off</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer temporary hide-overlay v-model="drawerRight" :close-on-click="false" right light>
            <v-list class="pa-0">
                    <v-list-tile avatar tag="div">
                        <v-list-tile-avatar>
                            <v-icon v-bind:class="['amber white--text']">{{ 'call_to_action' }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{$store.user.email}}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon dark v-on:click.native.stop="toggleRightMenu">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
            </v-list>
            <v-list class="pt-0" dense>
                <v-divider></v-divider>

                    <v-list-tile v-on:click.native="logout">
                        <v-list-tile-action>
                            <!--COMMENT
                            <v-icon>question_answer</v-icon>
                            COMMENT-->
                            <v-icon>eject</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Logout</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-on:click.native="edit_TEMPLATE_ACTION">
                        <v-list-tile-action>
                            <v-icon>notifications</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Notification</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-on:click.native="profile">
                        <v-list-tile-action>
                            <!--COMMENT
                            <v-icon>dashboard</v-icon>
                            COMMENT-->
                            <!--COMMENT
                            <v-icon>perm_identity</v-icon>
                            COMMENT-->
                            <v-icon>person</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Profile</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-on:click.native="groups">
                        <v-list-tile-action>
                            <v-icon>group</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Groups</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-on:click.native="go_to_map">
                        <v-list-tile-action>
                            <v-icon>explore</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Map</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>

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
            </v-list>
        </v-navigation-drawer>
        <v-toolbar dark class="primary" >
            <v-toolbar-side-icon @click.native.stop="toggleLeftMenu" v-if="$store.user.leftMenuEnabled"></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">Tracker</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native.stop="toggleRightMenu" v-if="$store.user.rightMenuEnabled">
                <v-icon >account_circle</v-icon>
            </v-btn>
        </v-toolbar>
        <main>
                <router-view></router-view>
        </main>
        <v-bottom-nav absolute value="true"
            :class="{'white': true}"
            v-if="$store.user.bottomNavigation.length > 0"
        >
          <v-btn v-for="btn in $store.user.bottomNavigation"
            :value="btn.value"
            :key="btn.key"
            flat dark class="teal--text" @click.native="btn.action"
            style="width: 96px"
            >
            <span>{{btn.text}}</span>
            <v-icon>{{btn.icon}}</v-icon>

          </v-btn>
        </v-bottom-nav>

    </v-app>
</template>


<style lang="scss">
    @import "static/vendor/vuetify/dist/vuetify.min.css"
</style>


<script type="text/babel">

    //
    // EXPORT
    //
    import * as cookies from 'common/cookies';

    const logout = function () {
        cookies.remove_session_cookie();
        this.$router.go(0);
    };

    const profile = function () {
        console.info("Profile function.");
        //this.$router.go('profile');
        this.$router.push('profile');
    };

    const groups = function () {
        console.info("Groups function.");
        this.$router.push('groups');
    };

    const go_to_map = function () {
        this.$router.push('track');
    };

    const edit_TEMPLATE_ACTION = function () {
        console.info("EDIT_TEMPLATE spremeni vse te oblike za nov meni.");
    };

    const toggleVisibility = function(userInGroup) {
        for(let group of this.$store.user.groups) {
            let visibleUserGroup = false;
            for(let user of group.users) {
                if(user == userInGroup) {
                    let current = userInGroup.visible;
                    userInGroup.visible = !current;
                    let tmpStr = this.$store.user.trackStorage.registerUser(userInGroup.userId, userInGroup.style.color);
                    tmpStr.visible = userInGroup.visible;
                    if(userInGroup.visible) {
                        visibleUserGroup = true;
                    }
                } else {
                    if(user.visible) {
                        let current = user.visible;
                        user.visible = !current;
                        let tmpStr = this.$store.user.trackStorage.registerUser(user.userId, user.style.color);
                        tmpStr.visible = user.visible;
                    }
                }
            }
            group.withVisibleUser = visibleUserGroup;
        }
    };

    const toggleGroupVisibility = function(group) {
            let current = group.active;
            group.active = !current;
    };


    const toggleLeftMenu = function() {
        if(this.$store.user.leftMenuEnabled) {
            this.drawerLeft = !this.drawerLeft;
        } else {
            this.drawerLeft = false;
        }
    };

    const toggleRightMenu = function() {
      if(this.$store.user.rightMenuEnabled) {
          this.drawerRight = !this.drawerRight;
      } else {
          this.drawerRight = false;
      }
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

                    {title: 'Logout', icon: 'question_answer', action: "logout"},
                    {title: 'Notification', icon: 'perm_identity', action: "edit_TEMPLATE_ACTION"},
                    {title: 'Profile', icon: 'perm_identity', action: "profile"},
                    {title: 'Groups', icon: 'perm_identity', action: "groups"},
                    {title: 'Map', icon: 'explore', action: "go_to_map"},
                    {title: 'Edit_TEMPLATE', icon: 'mode_edit', action: "edit_TEMPLATE_ACTION"}
                ],
                mini: true,
                right: null,
                groupFilter: ''
            }
        },
        methods: {
            profile,
            logout,
            groups,
            edit_TEMPLATE_ACTION,
            toggleVisibility,
            toggleGroupVisibility,
            toggleLeftMenu,
            toggleRightMenu
        },
        watch: {
            groupFilter: function() {
                    let filterString = this.groupFilter.toLowerCase();
                    let activateAll = filterString == null || filterString.length == 0;
                    console.log(filterString);
                    let firstGroup = null;
                    for(let group of this.$store.user.groups) {
                        group.active = false;
                        let isActivated = activateAll || group.groupId.toLowerCase().indexOf(filterString) >= 0;
                        for(let user of group.users) {
                            if(activateAll) {
                                user.filteredOut = false;
                            } else {
                                if(user.userId.toLowerCase().indexOf(filterString) >= 0) {
                                    user.filteredOut = false;
                                    isActivated = true;
                                } else {
                                    user.filteredOut = true;
                                }
                            }
                        }
                        group.filteredOut = !isActivated;
                        if(isActivated && firstGroup == null) {
                            firstGroup = group;
                        }
                    }
                    if(firstGroup) {
                        firstGroup.active = true;
                    }
                  }
        }
    }

</script>
