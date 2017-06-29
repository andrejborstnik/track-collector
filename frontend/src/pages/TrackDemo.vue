<template>
    <v-container id="trackShow" fluid class="ma-0 pa-0">
      <v-expansion-panel>
        <v-expansion-panel-content v-model="panelOpen">
                  <div slot="header">Set time</div>


                        <v-layout row wrap class="ma-0 pa-3">
                              <v-menu
                                lazy
                                :close-on-content-click="false"
                                v-model="menuFromDate"
                                transition="v-scale-transition"
                                offset-y
                                :nudge-left="40"
                              >
                                <v-text-field
                                  slot="activator"
                                  label="Start date:"
                                  v-model="startDateText"
                                  prepend-icon="event"
                                  readonly
                                ></v-text-field>
                                <v-date-picker v-model="startDate" no-title scrollable actions>
                                </v-date-picker>
                              </v-menu>
                              <v-menu
                                lazy
                                :close-on-content-click="false"
                                v-model="menuFromTime"
                                transition="v-scale-transition"
                                offset-y
                                :nudge-left="40"
                              >
                                <v-text-field
                                  slot="activator"
                                  label="Start time:"
                                  v-model="startTime"
                                  prepend-icon="access_time"
                                  readonly
                                ></v-text-field>
                                <v-time-picker v-model="startTime" format="24hr"></v-time-picker>
                              </v-menu>
                              <v-menu
                                lazy
                                :close-on-content-click="false"
                                v-model="menuToDate"
                                transition="v-scale-transition"
                                offset-y
                                :nudge-left="40"
                              >
                                <v-text-field
                                  slot="activator"
                                  label="End date:"
                                  v-model="endDateText"
                                  prepend-icon="event"
                                  readonly
                                ></v-text-field>
                                <v-date-picker v-model="endDate" no-title scrollable actions>
                                </v-date-picker>
                              </v-menu>
                              <v-menu
                                lazy
                                :close-on-content-click="false"
                                v-model="menuToTime"
                                transition="v-scale-transition"
                                offset-y
                                :nudge-left="40"
                              >
                                <v-text-field
                                  slot="activator"
                                  label="End time:"
                                  v-model="endTime"
                                  prepend-icon="access_time"
                                  readonly
                                ></v-text-field>
                                <v-time-picker v-model="endTime" format="24hr"></v-time-picker>
                              </v-menu>
                              <v-btn primary light v-on:click.native="getTrack">Load tracks</v-btn>
                              <v-btn primary light v-on:click.native="zoomToExtent">Fit tracks</v-btn>

                        </v-layout>


                  </v-expansion-panel-content>
                </v-expansion-panel>


        <v-dialog persistent v-model="isLoading" lazy>
            <v-layout row justify-center>
                <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7"
                                     class="purple--text"></v-progress-circular>
            </v-layout>
        </v-dialog>
        <v-layout child-flex class="pl-3 pr-3">
            <v-btn xs1 icon v-on:click.native="timeZoomOut">
                <v-icon light>remove_circle_outline</v-icon>
            </v-btn >
            <v-btn icon v-on:click.native="timeZoom">
                  <v-icon light>add_circle_outline</v-icon>
            </v-btn>

        </v-layout>
        <v-layout child-flex class="pl-3 pr-3">
                <vue-slider ref="slider"
                  v-model="sliderValue"
                  :min="minDate"
                  :max="maxDate"
                  :interval=1000
                  :lazy=true
                  :dot-size=30
                  :formatter=formatterFunction
                  style="margin-left: 65px; margin-right: 50px;"
                ></vue-slider>
        </v-layout>
        <div v-if="connections"></div>
         <MyMap ref="map"
                :storageChanged="storageChanged"
                :timeInterval="sliderValue"
                source="OSM"
                ></MyMap>
    </v-container>
</template>


<style lang="scss">
    #rangeCard {
        padding: 0px
    }
</style>


<script type="text/babel">

    const request = require('request-promise-native');
    import * as config from 'config';

    import moment from 'moment-timezone';

    import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

    import _ from 'lodash';

    import * as cookies from 'common/cookies';

    import MyMap from 'widgets/Map2.vue';

    import {activate_mixin} from 'common/activate-mixin';

    //
    // Functions
    //

    // To se raje naredi s knjižnico 'moment'
    // Date.prototype.yyyymmdd = function() {
    //   var mm = this.getMonth() + 1; // getMonth() is zero-based
    //   var dd = this.getDate();
    //
    //   return [this.getFullYear(),
    //           (mm>9 ? '' : '0') + mm,
    //           (dd>9 ? '' : '0') + dd
    //          ].join('-');
    // };

    const now = moment();
    const tomorrow = moment().add(1, 'days');

    const formatterFunction = function (v) {
        if (v == null) return "";
        return moment(v).format("YYYY-MM-DD k:mm:ss");
    }.bind(this);

    const formatterFunction2 = function (v) {
        let x = v ? v : 0;
        return moment(now).add(tomorrow.diff(now, "seconds") * v, 'seconds').format("YYYY-MM-DD k:mm:ss");
    }.bind(this);

    const setDate = function () {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.startDate = "2017-05-07";
        this.endDate = "2017-05-14";
        this.startTime = "09:00";
        this.endTime = "13:00";
        // ALEN - začasno zakomentirano
        // this.startDate = moment(yesterday).format("YYYY-MM-DD")
        // this.endDate = moment(today).format("YYYY-MM-DD")
    };

    const buildTimestamp = function (date, time) {
        return date + "T" + time + ":00"
    };

    const getTrack = function () {
        this.$store.user.trackStorage.setStartDateTime(this.startDate, this.startTime, 'Europe/Berlin');
        this.$store.user.trackStorage.setEndDateTime(this.endDate, this.endTime, 'Europe/Berlin');
        this.sliderValue = [0, Number.MAX_VALUE];
        this.$store.user.trackStorage.getTrack(this.$store.user.token, this.startLoading, this.endLoading);
    };

    const startLoading = function () {
        this.loading++;
    };

    const endLoading = function () {
        this.loading--;
    };
    const getGroups = function () {
        let path = `/group/list`;
        this.startLoading();
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                token: this.$store.user.token,
            }
        }).then((body) => {
            this.endLoading();
            if (body.status == "OK") {
                this.updateGroups(body.groups);
            }
        });
    };

    const initializeGroups = function (groups) {
        for (let grp of groups) {
            grp.visible = false;
            for (let user of grp.users) {
                user.visible = grp.personalGroupUserId === user.userId;
                user.style = {color: this.$store.pallete.next()};
            }
        }
        return groups;
    }

    const updateOrInitializeGroups = function (groups) {
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
    const updateGroups = function (groups) {
        let old = this.$store.user.groups;
        this.$store.user.groups = this.initializeGroups(groups);
        updateOrInitializeGroups(old);
    };

    const zoomToExtent = function () {
        this.$refs.map.zoomToExtent();
    };

    const timeZoom = function () {
        this.minSliderDate = this.sliderValue[0];
        this.maxSliderDate = this.sliderValue[1];
        //this.$refs.map.zoomToExtent()
    };

    const timeZoomOut = function () {
        this.minSliderDate = this.startDateTime;
        this.maxSliderDate = this.endDateTime;
        //this.$refs.map.zoomToExtent()
    };

    const activate = function () {
        this.setDate();
        this.getGroups();
        this.$store.user.trackStorage.registerMap(this.$refs.map.map);
        let tmpStr = this.$store.user.trackStorage.registerUser(this.$store.user.email, this.$store.pallete.first());
        tmpStr.visible = true;
        // this.trackStorage = new MultiTrackStorage(this.$refs.map.map);
        // this.storageChanged += 1;
        let cookie = cookies.get_session_cookie();
        if(cookie) {
            this.startDate = cookie.startDate != null ? cookie.startDate : this.startDate;
            this.endDate = cookie.endDate != null ? cookie.endDate : this.endDate;
            this.startTime = cookie.startTime != null ? cookie.startTime : this.startTime;
            this.endTime = cookie.endTime != null ? cookie.endTime : this.endTime;
        }
    };

    //
    // EXPORT
    //

    export default {
        name: 'TrackDemo',

        methods: {
            getTrack,
            zoomToExtent,
            setDate,
            getGroups,
            activate,
            formatterFunction,
            updateGroups,
            initializeGroups,
            updateOrInitializeGroups,
            startLoading,
            endLoading,
            timeZoom,
            timeZoomOut
        },

        mixins: [activate_mixin],

        components: {
            MyMap,
            vueSlider
        },

        computed: {
            startDateText: function () {
                return moment(this.startDate).format("D MMM YYYY");
            },
            endDateText: function () {
                return moment(this.endDate).format("D MMM YYYY");
            },
            minDate: function() {
                if(this.startDate == null) return 0;
                let x = moment(buildTimestamp(this.startDate, this.startTime)).valueOf();
                if(this.minSliderDate != null && this.minSliderDate > x) {
                    x = this.minSliderDate;
                }
                return x;
            },
            maxDate: function() {
                if(this.endDate == null) return Number.MAX_VALUE;
                let x = moment(buildTimestamp(this.endDate, this.endTime)).valueOf();
                if(this.maxSliderDate != null && this.maxSliderDate < x) {
                  x = this.maxSliderDate;
                }
                return x;
            },
            isLoading: function () {
                return this.loading > 0;
            }
        },
        // mounted: function () {
        //         this.$store.user.trackStorage.registerMap(this.$refs.map.map);
        //         let tmpStr = this.$store.user.trackStorage.registerUser(this.$store.user.email, this.$store.pallete.first());
        //         tmpStr.visible = true;
        //         // this.trackStorage = new MultiTrackStorage(this.$refs.map.map);
        //         // this.storageChanged += 1;
        //         let cookie = cookies.get_session_cookie();
        //         console.log(cookie);
        //         if(cookie) {
        //             this.startDate = cookie.startDate != null ? cookie.startDate : this.startDate;
        //             this.endDate = cookie.endDate != null ? cookie.endDate : this.endDate;
        //             this.startTime = cookie.startTime != null ? cookie.startTime : this.startTime;
        //             this.endTime = cookie.endTime != null ? cookie.endTime : this.endTime;
        //         }
        // },
        watch: {
                startDate: function () {
                    cookies.update_session_cookie({startDate: this.startDate});
                },
                endDate: function() {
                    cookies.update_session_cookie({endDate: this.endDate});
                },
                startTime: function () {
                    cookies.update_session_cookie({startTime: this.startTime});
                },
                endTime: function() {
                    cookies.update_session_cookie({endTime: this.endTime});
                }
        },
        data () {
            return {
                output: '',
                startDate: null,
                endDate: null,
                startTime: null,
                endTime: null,
                colors: ['red', 'green', 'grey', 'orange', 'yellow', 'blue', 'black'], // this colors or hex.
                menuFromDate: false,
                menuToDate: false,
                menuFromTime: false,
                menuToTime: false,
                modalFrom: false,
                modalTo: false,
                loading: false,
                sliderValue: [0, Number.MAX_VALUE],
                panelOpen: true,
                storageChanged: 0,
                minSliderDate: null,
                maxSliderDate: null
            }
        }
    }

</script>
