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
                            <v-btn icon @click.native.stop="toggleLeftMenu">
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
                            <v-list-tile-title style="font-weight: normal;" v-if="!group.withVisibleUser">{{ formatGroupName(group.groupId) }}</v-list-tile-title>
                            <v-list-tile-title style="font-weight: bold;" v-if="group.withVisibleUser">{{ formatGroupName(group.groupId) }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action style="display: flex; justify-content: flex-end">
                            <v-btn icon @click.native.stop="toggleGroupMessages(group)">
                              <v-icon>message</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action style="display: flex; justify-content: flex-end">
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
                    <v-list-tile @click.native.stop="toggleUserMessages">
                        <v-list-tile-action>
                            <v-icon>message</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Messages</v-list-tile-title>
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
                    <v-list-tile v-on:click.native.stop="toggleSettings">
                        <v-list-tile-action>
                            <v-icon>settings</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Settings</v-list-tile-title>
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
        <v-dialog v-model="this.$store.user.showAlert" persistent lazy>
            <v-card>
                    <v-card-title>{{this.$store.user.errorTitle}}</v-card-title>
                    <v-card-text>{{this.$store.user.errorMessage}}</v-card-text>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="$store.user.showAlert=false">Ok</v-btn>
            </v-card>
        </v-dialog>

        <v-dialog v-model="messageBox" fullscreen transition="dialog-bottom-transition" :overlay=false>
             <v-layout row wrap>
               <v-toolbar dark class="primary">
                 <v-btn icon @click.native.stop="toggleMessages" dark>
                   <v-icon>close</v-icon>
                 </v-btn>
                 <v-toolbar-title>{{messagesTitle}}</v-toolbar-title>
                 <v-spacer></v-spacer>
                 <v-toolbar-items>
                   <v-btn dark flat @click.native="toggleSendMessages">Send</v-btn>
                 </v-toolbar-items>
               </v-toolbar>
               <div style="position: absolute; top: 64px; bottom: 0px; left: 0px; right: 0px; ">
                     <v-card class="ml-2 mr-2 mt-2 mb-2 pa-2" v-if="sendMessages">
                       <v-layout v-if="sendingType=='EMAIL_TEXT'">
                            <v-text-field
                                     name="messageTitle"
                                     label="Subject:"
                                     single-line
                                     v-model="$store.user.messageTitle"
                            ></v-text-field>
                      </v-layout>

                       <v-layout row>
                            <v-text-field
                                     name="messageTo"
                                     label="To:"
                                     single-line
                                     v-model="$store.user.messageTo"
                            ></v-text-field>
                            <v-btn icon @click.native="sendMessage">
                                      <v-icon>send</v-icon>
                            </v-btn>

                      </v-layout>
                       <v-text-field
                         name="send_message"
                         label="Message"
                         value="Write message ..."
                         v-model="$store.user.messageText"
                         multi-line
                       ></v-text-field>
                        <v-radio-group v-model="sendingType" :mandatory="false">
                           <v-layout row>
                             <v-radio label="Mobile notification" value="NOTIFICATION"></v-radio>
                             <v-radio label="Email" value="EMAIL_TEXT"></v-radio>
                             <v-radio label="For group admins" value="GROUP_NOTIFICATION"></v-radio>
                           </v-layout>
                        </v-radio-group>
                     </v-card>
                     <div style="overflow-y: scroll;">
                         <v-flex xs12 v-for="message in $store.user.messages">
                              <MessageCallout :message="message"></MessageCallout>
                         </v-flex>
                    </div>
                  </div>
             </v-layout>
        </v-dialog>
        <v-dialog v-model="settingsBox" fullscreen transition="dialog-bottom-transition" :overlay=false>
          <v-layout column>
            <v-toolbar dark class="primary">
              <v-btn icon @click.native.stop="toggleSettings" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat @click.native="toggleSettings">Close</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-flex>
              <v-card>
                <v-card-title>
                    <span class="title mb-0">Point analysis type</span>
                </v-card-title>
                <v-radio-group v-model="pointAnalysisType" :mandatory="false">
                    <v-layout row>
                        <v-radio class="ml-5" label="Speed" value="SPEED"></v-radio>
                        <v-radio label="Delay" value="DELAY"></v-radio>
                        <v-radio label="Battery" value="BATTERY"></v-radio>
                    </v-layout>
                </v-radio-group>
              </v-card>
            </v-flex>
           </v-layout>
        </v-dialog>
        <main>
                <router-view></router-view>
        </main>
        <v-toolbar dark class="primary">
            <v-toolbar-side-icon @click.native.stop="toggleLeftMenu" v-if="$store.user.leftMenuEnabled"></v-toolbar-side-icon>
            <v-toolbar-title class="white--text">{{$store.user.toolbarTitle}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn-toggle mandatory class="white"  v-model="$store.user.operationMode" @change='toggleLiveHistoryMode'>
                <v-btn v-for="btn in operationModeChoices"
                :value="btn.value"
                >
                <v-icon class="blue--text">{{btn.icon}}</v-icon>
                </v-btn>
            </v-btn-toggle>
            <v-btn icon @click.native.stop="toggleRightMenu" v-if="$store.user.rightMenuEnabled">
                <v-icon >account_circle</v-icon>
            </v-btn>
        </v-toolbar>
        <v-bottom-nav absolute value="true" :active.sync='$store.user.bottomNavState'
            :class="{'white': true}"
            v-if="$store.user.bottomNavigation.length > 0"
        >
          <v-btn v-for="btn in $store.user.bottomNavigation"
            :value="btn.key"
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
    @import "static/vendor/vuetify/dist/vuetify.min.css";
</style>


<script type="text/babel">

    //
    // EXPORT
    //
    import GroupsStorage from 'common/GroupsStorage'
    import MessageCallout from 'widgets/MessageCallout.vue';
    import * as cookies from 'common/cookies';

    import moment from 'moment-timezone';
    const request = require('request-promise-native');
    import * as config from 'config';

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
                    if(!userInGroup.visible) {  // will become visible
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
        // set visibility only once per layer
        this.$store.user.toolbarTitle = userInGroup.userId;
        let current = userInGroup.visible;
        userInGroup.visible = !current;
        let tmpStr = this.$store.user.trackStorage.registerUser(userInGroup.userId, userInGroup.style.color);
        tmpStr.visible = userInGroup.visible;
        if(userInGroup.visibleCallback) {
            userInGroup.visibleCallback(userInGroup.userId);
        }
        this.toggleLeftMenu()
        // tmpStr.setPointAnalysisType(this.$store.user.pointAnalysisType);
    };

    const toggleGroupVisibility = function(group) {
            let current = group.active;
            group.active = !current;
    };

    const toggleGroupMessages = function(group) {
            if(group) {
                this.$store.user.messageBaseGroup = group.groupId;
                this.messagesTitle = this.formatGroupName(group.groupId);
            }
            this.toggleLeftMenu();
            this.toggleMessages();
    };

    const toggleUserMessages = function() {
            this.$store.user.messageBaseGroup = null;
            this.messagesTitle = this.$store.user.email;
            this.toggleRightMenu();
            this.toggleMessages();
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

    const toggleMessages = function() {
      if(this.$store.user.messagesEnabled) {
          this.messageBox = !this.messageBox;
          if(this.messageBox) {
              this.getMessages();
          }
      } else {
          this.messageBox = false;
      }
    };

    const toggleSendMessages = function() {
          this.sendMessages = !this.sendMessages;
    };

    const toggleSettings = function() {
          this.settingsBox = !this.settingsBox;
          this.toggleRightMenu();
    };

    const formatGroupName = function(group) {
        return group.replace(/^([^#]*)#([^#]*)$/, "#$2").replace(/^([^#]*)$/, "#$1");
    };

    const getMessages = function () {
        let path = `/notifications/list `;
        // this.startLoading();
        let json = {
            token: this.$store.user.token,
            fromDate: moment().subtract(30, "days").toISOString()
        }
        if(this.$store.user.messageBaseGroup) {
            json.forGroup = this.$store.user.messageBaseGroup
        }
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: json
        }).then((body) => {
            // this.endLoading();
            if (body.status == "OK") {
                this.processMessages(body);
            } else {
                this.triggerAlert("Service error", body.errorMessage);
            }
        }).catch((err) => {
            this.triggerAlert("Network error", err);
        });
    };

    const processMessages = function(body) {
        let res = [];
        if(body.sent) {
            for(let mes of body.sent) {
                mes.isSent = true;
                res.push(mes);
            }
        }
        if(body.received) {
          for(let mes of body.received) {
              mes.isSent = false;
              res.push(mes);
          }
        }
        res.sort((a,b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0));
        this.$store.user.messages = res;
    }

    const triggerAlert = function(title, message) {
          this.$store.user.errorTitle = title;
          this.$store.user.errorMessage = message;
          this.$store.user.showAlert = true;
    }

    const sendMessage = function() {
          let path = `/notifications/notify `;
          // this.startLoading();
          let json = {token: this.$store.user.token};
          json.type = this.sendingType;
          switch(this.sendingType) {
              case "NOTIFICATION":
                  json.recipients = [
                        {
                          provider: this.$store.user.provider,
                          userId: this.$store.user.messageTo
                        }
                  ];
                  json.messageType = "TEXT";
                  break;
              case "GROUP_NOTIFICATION":
                  if(!this.$store.user.messageTo.startsWith("#")) {
                      this.triggerAlert("Sending error.", "Group name must start with '#' character.");
                      return;
                  }
                  json.toGroup = this.$store.user.messageTo;
                  json.messageType = "TEXT";
                  break;
              case "EMAIL_TEXT":
                  json.to = this.$store.user.messageTo;
                  json.title = this.$store.user.messageTitle;
                  json.messageType = "TEXT";
                  break;
              default:
                  this.triggerAlert("Sending error.", "Wrong sending type: " + this.sendingType);
                  return;
          }
          if(this.$store.user.messageBaseGroup != null) {
              json.fromGroup = this.$store.user.messageBaseGroup;
          }
          json.message = this.$store.user.messageText;

          request({
              method: "POST",
              uri: config.paths_api_prefix + path,
              json: json
          }).then((body) => {
              // this.endLoading();
              if (body.status == "OK" && body.notificationStatus[0].status == "OK") {
                  this.getMessages();
                  this.$store.user.messageText = null;
                  this.$store.user.messageTo = null;
                  this.toggleSendMessages();
              } else {
                  if(body.status == "OK") {
                      this.triggerAlert(body.notificationStatus[0].status, body.notificationStatus[0].errorMessage)
                  } else {
                      this.triggerAlert("Message failed", "Error while sending a notification.");
                  }
              }
          }).catch((err) => {
              this.triggerAlert("Network error", err);
          });
    };

    const toggleLiveHistoryMode = function (event) {
        var grpStor = new GroupsStorage(this.$store);
        var usersLive = this.$store.user.trackStorage.setHistoryMode(event, this.$store);
        if(event == 'LIVE') {
            this.liveModeRun(this.$store.user.token, usersLive);
            this.$store.user.intervalLiveLoad = setInterval(() => {
                this.liveModeRun(this.$store.user.token, usersLive);
            }, this.liveTracksUpdateInterval);
        }
    };

    const liveModeRun = function(token, users) {
        this.$store.user.trackStorage.setStartDateTime(moment().format("YYYY-MM-DD"), "00:00", 'Europe/Berlin'); // set dates for today
        this.$store.user.trackStorage.setEndDateTime(moment().format("YYYY-MM-DD"), "23:59", 'Europe/Berlin'); // set dates for today
        this.$store.user.trackStorage.getTrack(token, null, null, users);
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
                groupFilter: '',
                messageBox: false,
                sendMessages: false,
                messagesTitle: "Messages",
                sendingType: "NOTIFICATION",
                settingsBox: false,
                pointAnalysisType: "SPEED",
                operationModeChoices: [
                          { icon: 'timeline', value: 'HISTORY', key: 'historyMode' },
                          { icon: 'tv', value: 'LIVE', key: 'liveMode' }
                        ],
                liveTracksUpdateInterval: 5000,
            }
        },
        methods: {
            profile,
            logout,
            groups,
            go_to_map,
            edit_TEMPLATE_ACTION,
            toggleVisibility,
            toggleGroupVisibility,
            toggleLeftMenu,
            toggleRightMenu,
            toggleMessages,
            toggleSendMessages,
            sendMessage,
            toggleGroupMessages,
            toggleUserMessages,
            formatGroupName,
            getMessages,
            processMessages,
            triggerAlert,
            toggleSettings,
            toggleLiveHistoryMode,
            liveModeRun
        },
        watch: {
            groupFilter: function() {
                    let filterString = this.groupFilter.toLowerCase();
                    let activateAll = filterString == null || filterString.length == 0;
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
            },
            pointAnalysisType: function() {
                  this.$store.user.pointAnalysisType = this.pointAnalysisType;
                  this.$store.user.trackStorage.setPointAnalysisType(this.pointAnalysisType);
                  this.$store.user.trackStorage.runAnalysis();
            },
        },
        components: {
            'MessageCallout': MessageCallout
        },
        beforeDestroy() {
            clearInterval(this.$store.user.intervalLiveLoad);
        }
    }

</script>
