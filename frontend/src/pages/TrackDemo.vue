<template>
    <v-container id="trackShow" fluid class="ma-0 pa-0"
                 style="display: flex; position: absolute; bottom: 56px">
        <v-dialog v-model="timeSettings" hide-overlay persistent>
            <v-layout row wrap class="ma-0 pa-3" style="background-color: white">
                <v-dialog v-model="menuFromDate">
                    <v-text-field
                            slot="activator"
                            label="Start date:"
                            v-model="startDateText"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker
                            v-model="startDate"
                            no-title
                            scrollable
                            actions
                            :allowed-dates="allowedStartDate"
                    >
                    </v-date-picker>
                </v-dialog>
                <v-dialog v-model="menuFromTime">
                    <v-text-field
                            slot="activator"
                            label="Start time:"
                            v-model="startTime"
                            prepend-icon="access_time"
                            readonly
                    ></v-text-field>
                    <v-time-picker v-model="startTime" format="24hr"></v-time-picker>
                </v-dialog>
                <v-dialog v-model="menuToDate">
                    <v-text-field
                            slot="activator"
                            label="End date:"
                            v-model="endDateText"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker
                            v-model="endDate"
                            no-title
                            scrollable
                            actions
                            :allowed-dates="allowedEndDate"
                    >
                    </v-date-picker>
                </v-dialog>
                <v-dialog v-model="menuToTime">
                    <v-text-field
                            slot="activator"
                            label="End time:"
                            v-model="endTime"
                            prepend-icon="access_time"
                            readonly
                    ></v-text-field>
                    <v-time-picker v-model="endTime" format="24hr"></v-time-picker>
                </v-dialog>
                <v-layout row>
                    <v-btn flat primary v-on:click.native="setYesterday">Yesterday</v-btn>
                    <v-btn flat primary v-on:click.native="setToday">Today</v-btn>
                </v-layout>
                <v-btn light v-on:click.native="getTrack">Load tracks</v-btn>

            </v-layout>
        </v-dialog>
        <v-dialog v-model="loading" hide-overlay persistent>
            <v-layout row justify-center>
                <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
            </v-layout>
        </v-dialog>

        <v-dialog v-model="zoomSettings" hide-overlay persistent>
            <v-layout column class="pl-3 pr-3" style="background-color: white">
                <v-list>
                    <v-list-tile v-on:click.native="zoomToExtent">
                        <v-list-tile-action>
                            <v-icon>filter</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Fit tracks</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-on:click.native="timeZoomOut">
                        <v-list-tile-action>
                            <v-icon>zoom_out</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Time zoom out</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-on:click.native="timeZoom">
                        <v-list-tile-action>
                            <v-icon>zoom_in</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Time zoom in</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-layout>
        </v-dialog>
        <div style="position: absolute; bottom: 0px; left: 0px; right: 0px">
            <v-layout v-if="sliderSettings" child-flex class="pl-3 pr-3">
                <vue-slider ref="slider"
                            v-model="sliderValue"
                            :min="minDate"
                            :max="maxDate"
                            :interval=1000
                            :lazy=true
                            :dot-size=44
                            :formatter=formatterFunction
                            style="margin-left: 12px; margin-right: 12px;"
                ></vue-slider>
            </v-layout>
        </div>
        <div style="display: flex; flex-grow: 1">
            <div v-if="connections"></div>
            <MyMap ref="map"
                   :storageChanged="storageChanged"
                   :timeInterval="sliderValue"
                   source="OSM"
                   style="display: flex; flex-grow: 1;"
            ></MyMap>
        </div>
        <v-dialog v-model="showAlert" persistent lazy>
            <v-card>
                <v-card-row>
                    <v-card-title>{{errorTitle}}</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>{{errorMessage}}</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showAlert=false">Ok</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
    </v-container>
</template>


<style lang="scss">
    // @import "vendor/vuetify/dist/vuetify.min.css";
</style>


<script type="text/babel">

    const request = require('request-promise-native');
    import * as config from 'config';

    import moment from 'moment-timezone';

    import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

    import _ from 'lodash';

    import * as cookies from 'common/cookies';

    import MyMap from 'widgets/Map2.vue';

    import GroupsStorage from 'common/GroupsStorage'

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
        return moment(v).format("D[.]M[.] k:mm:ss");
    }.bind(this);

    const formatterFunction2 = function (v) {
        let x = v ? v : 0;
        return moment(now).add(tomorrow.diff(now, "seconds") * v, 'seconds').format("YYYY-MM-DD k:mm:ss");
    }.bind(this);

    const setDate = function () {
        // let today = new Date();
        // let yesterday = new Date();
        // yesterday.setDate(yesterday.getDate() - 1);
        // this.startDate = "2017-05-07";
        // this.endDate = "2017-05-14";
        // this.startTime = "09:00";
        // this.endTime = "13:00";
        // ALEN - začasno zakomentirano
        // this.startDate = moment(yesterday).format("YYYY-MM-DD")
        // this.endDate = moment(today).format("YYYY-MM-DD")
        this.startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        this.endDate = moment().format("YYYY-MM-DD");
        this.startTime = "00:00";
        this.endTime = "23:59";
    };

    const setToday = function () {
        this.startDate = moment().format("YYYY-MM-DD");
        this.endDate = this.startDate;
        this.startTime = "00:00";
        this.endTime = "23:59";
    };

    const setYesterday = function () {
        this.startDate = moment().subtract(1, "days").format("YYYY-MM-DD");
        this.endDate = this.startDate;
        this.startTime = "00:00";
        this.endTime = "23:59";
    };

    const buildTimestamp = function (date, time) {
        let res = date.slice(0, 10)
            + "T"
            + time.replace(/^(\d):/, '0$1:')
                .replace(/^(\d\d):(\d)([^\d]*)$/, '$1:0$2')
                .replace(/^(\d\d):(\d\d).*$/, '$1:$2') + ":00";
        return res;
    };

    const getTrack = function () {
        this.$store.user.trackStorage.setStartDateTime(this.startDate, this.startTime, 'Europe/Berlin');
        this.$store.user.trackStorage.setEndDateTime(this.endDate, this.endTime, 'Europe/Berlin');
        this.sliderValue = [0, Number.MAX_VALUE];
        this.$store.user.trackStorage.getTrack(this.$store.user.token, this.startLoading, this.endLoadingWithZoom);

        this.toggleTimeSettings();
    };

    const loadSeparateTrack = function(userId) {
      this.$store.user.trackStorage.setStartDateTime(this.startDate, this.startTime, 'Europe/Berlin');
      this.$store.user.trackStorage.setEndDateTime(this.endDate, this.endTime, 'Europe/Berlin');
      this.sliderValue = [0, Number.MAX_VALUE];
      this.$store.user.trackStorage.getTrackForUser(this.$store.user.token, userId, this.startLoading, this.endLoadingWithZoom);
    }

    const startLoading = function () {
        this.loading = true;
    };

    const endLoading = function () {
        this.loading = false;
    };

    const endLoadingWithZoom = function () {
        this.loading = false;
        this.$refs.map.zoomToExtent();
    };

    /*
     document.addEventListener('keydown', function(event) {
     if(event.keyCode == 37) {
     //alert("left press");
     console.info("left press");
     console.info(this.$refs.map);
     console.info(String(this.$refs.map.getView().getZoom()));
     alert('Left was pressed'+String(MyMap.getView().getZoom()));
     }
     else if(event.keyCode == 39) {
     console.info("right press");
     alert('Right was pressed');
     }
     else if(event.keyCode == 70) {
     console.info("f press");
     alert('f was pressed');
     this.zoomToExtent();
     }
     });
     */

    const zoomToExtent = function () {
        this.$refs.map.zoomToExtent();
        this.toggleZoomSettings();
    };

    const timeZoom = function () {
        this.minSliderDate = this.sliderValue[0];
        this.maxSliderDate = this.sliderValue[1];
        this.toggleZoomSettings();

        //this.$refs.map.zoomToExtent()
    };

    const timeZoomOut = function () {
        this.minSliderDate = this.startDateTime;
        this.maxSliderDate = this.endDateTime;
        this.toggleZoomSettings();

        //this.$refs.map.zoomToExtent()
    };

    const refreshBottomNavigation = function () {
        for (let el of this.$store.user.bottomNavigation) {
            switch (el.key) {
                case "timeSettings":
                    el.value = this.timeSettings;
                    break;
                case "zoomSettings":
                    el.value = this.zoomSettings;
                    break;
                case "sliderSettings":
                    el.value = this.sliderSettings;
                    break;
                default:
                    break;
            }
        }
        if(this.timeSettings) {
            this.$store.user.bottomNavState = "timeSettings";
        } else if (this.zoomSettings) {
            this.$store.user.bottomNavState = "zoomSettings";
        } else if(this.sliderSettings) {
            this.$store.user.bottomNavState = "sliderSettings";
        } else {
            this.$store.user.bottomNavState = null;
        }
    };

    const toggleTimeSettings = function () {
        this.timeSettings = !this.timeSettings;
        this.zoomSettings = false;
        this.refreshBottomNavigation();
        this.$store.user.operationMode = 'HISTORY';
        this.$store.user.trackStorage.setHistoryMode(this.$store.user.operationMode);
    };

    const toggleZoomSettings = function () {
        this.zoomSettings = !this.zoomSettings;
        this.timeSettings = false;
        this.refreshBottomNavigation();
        // this.$store.user.bottomNavigation[1].value = this.zoomSettings;
    };

    const toggleSliderSettings = function () {
        this.sliderSettings = !this.sliderSettings;
        this.zoomSettings = false;
        this.timeSettings = false;
        this.refreshBottomNavigation();
        // this.$store.user.bottomNavigation[1].value = this.zoomSettings;
    };

    const allowedStartDate = function (date) {
        return true;
        // return moment(date).isAfter(moment())
    };

    const allowedEndDate = function (date) {
        return moment(date).isAfter(moment(this.startDate));
    };

    const activate = function () {
        this.$store.user.leftMenuEnabled = true;
        this.$store.user.rightMenuEnabled = true;
        this.$store.user.messagesEnabled = true;
        this.$store.user.historyEnabled = true;
        this.setDate();
        var grpStor = new GroupsStorage(this.$store);
        grpStor.getGroups(this.startLoading, this.endLoading, this.loadSeparateTrack);
        //this.getGroups();
        this.$store.user.trackStorage.registerMap(this.$refs.map.map);
        let tmpStr = this.$store.user.trackStorage.registerUser(this.$store.user.email, this.$store.pallete.first());
        tmpStr.visible = true;
        tmpStr.setPointAnalysisType(this.$store.user.pointAnalysisType);
        this.$store.user.toolbarTitle = this.$store.user.email;
        // this.trackStorage = new MultiTrackStorage(this.$refs.map.map);
        // this.storageChanged += 1;
        let cookie = cookies.get_session_cookie();
        if (cookie) {
            this.startDate = cookie.startDate != null ? cookie.startDate : this.startDate;
            this.endDate = cookie.endDate != null ? cookie.endDate : this.endDate;
            this.startTime = cookie.startTime != null ? cookie.startTime : this.startTime;
            this.endTime = cookie.endTime != null ? cookie.endTime : this.endTime;
        }
        let bottomNavigation = [
            {
                action: this.toggleTimeSettings.bind(this),
                text: "Time interval",
                icon: "schedule",
                key: "timeSettings",
                value: false
            },
            {
                action: this.toggleZoomSettings.bind(this),
                text: "Zoom",
                icon: "search",
                key: "zoomSettings",
                value: false
            },
            {
                action: this.toggleSliderSettings.bind(this),
                text: "Time slider",
                icon: "settings_ethernet",
                key: "sliderSettings",
                value: false
            }
        ];
        this.$store.user.bottomNavigation = bottomNavigation;
        setTimeout(function () {
            this.$refs.map.map.updateSize();
        }.bind(this), 300);
    };

    //
    // EXPORT
    //

    export default {
        name: 'TrackDemo',

        methods: {
            getTrack,
            loadSeparateTrack,
            zoomToExtent,
            setDate,
            //getGroups,
            activate,
            formatterFunction,
            //updateGroups,
            //initializeGroups,
            //updateOrInitializeGroups,
            startLoading,
            endLoading,
            endLoadingWithZoom,
            timeZoom,
            timeZoomOut,
            toggleTimeSettings,
            toggleZoomSettings,
            toggleSliderSettings,
            refreshBottomNavigation,
            allowedStartDate,
            allowedEndDate,
            setToday,
            setYesterday
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
            minDate: function () {
                if (this.startDate == null) return 0;
                let x = moment(buildTimestamp(this.startDate, this.startTime)).valueOf();
                if (this.minSliderDate != null && this.minSliderDate > x) {
                    x = this.minSliderDate;
                }
                return x;
            },
            maxDate: function () {
                if (this.endDate == null) return Number.MAX_VALUE;
                let x = moment(buildTimestamp(this.endDate, this.endTime)).valueOf();
                if (this.maxSliderDate != null && this.maxSliderDate < x) {
                    x = this.maxSliderDate;
                }
                return x;
            },
            isLoading: function () {
                return this.loading > 0;
            }
        },
        watch: {
            '$store.event': function (event) {
                switch (event.keyCode) {
                    case 37:
                        console.info('left');
                        break;
                    case 38:
                        console.info('up');
                        break;
                    case 39:
                        console.info('right');
                        break;
                    case 40:
                        console.info('down');
                        break;
                    case 17:
                        console.info('ctrl');
                        this.zoomToExtent();
                        break;
                    case 33:
                        console.info('PgUp');
                        this.timeZoomOut();
                        break;
                    case 34:
                        console.info('PgDn');
                        this.timeZoom();
                        break;
                }
            },
            startDate: function () {
                if (moment(this.endDate).isBefore(moment(this.startDate))) {
                    this.endDate = this.startDate;
                    if (this.startTime > this.endTime) {
                        this.endTime = this.startTime;
                    }
                }
                cookies.update_session_cookie({startDate: this.startDate});
            },
            endDate: function () {
                cookies.update_session_cookie({endDate: this.endDate});
            },
            startTime: function () {
                cookies.update_session_cookie({startTime: this.startTime});
            },
            endTime: function () {
                let startTM = moment(buildTimestamp(this.startDate, this.startTime));
                let endTM = moment(buildTimestamp(this.endDate, this.endTime));

                if (endTM.isBefore(startTM)) {
                    this.errorTitle = "Time error.";
                    this.errorMessage = "End time too early.";
                    this.showAlert = true;

                    let cookie = cookies.get_session_cookie();
                    if (cookie) {
                        this.endTime = cookie.endTime != null ? cookie.endTime : this.endTime;
                    } else {
                        this.endTime = this.startTime;
                    }

                }
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
                maxSliderDate: null,
                timeSettings: false,
                zoomSettings: false,
                sliderSettings: false,
                showAlert: null,
                errorTitle: '',
                errorMessage: ''
            }
        }
    }

</script>
