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
                              <v-btn primary light v-on:click.native="getTrack">Show your tracks</v-btn>
                              <v-btn primary light v-on:click.native="zoomToData">Zoom</v-btn>
                        </v-layout>


                  </v-expansion-panel-content>
                </v-expansion-panel>


        <v-dialog persistent v-model="loading" lazy>
            <v-layout row justify-center>
                <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7"
                                     class="purple--text"></v-progress-circular>
            </v-layout>
        </v-dialog>
        <v-layout child-flex class="pl-3 pr-3">
            <vue-slider ref="slider" v-model="value"
              :min="minDate"
              :max="maxDate"
              :interval=1000
              :dot-size=30
              :formatter=formatterFunction
            ></vue-slider>
        </v-layout>
        <div v-if="connections"></div>

        <MyMap v-if="points"
               ref="map"
               :mydata="mydata"
               :timeInterval="value"
               source="OSM" width="100%" height="700px"
               style="padding-top: 1rem; padding-bottom: 1rem;"></MyMap>
    </v-container>

</template>


<style lang="scss">
    #rangeCard {
        padding: 0px
    }
</style>


<script type="text/babel">

    import async from 'co';
    const request = require('request-promise-native');
    import * as config from 'config';

    import moment from 'moment-timezone';

    import vueSlider from 'vue-slider-component/src/vue2-slider.vue';

    import _ from 'lodash';

    import MyMap from 'widgets/Map.vue';

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

    const formatterFunction = function(v) {
        if(v == null) return "";
        return moment(v).format("YYYY-MM-DD k:mm:ss");
    }.bind(this);

    const formatterFunction2 = function(v) {
        let x = v ? v : 0;
        return moment(now).add(tomorrow.diff(now, "seconds")*v, 'seconds').format("YYYY-MM-DD k:mm:ss");
    }.bind(this);

    const setDate = function () {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.startDate = "2017-05-07";
        this.endDate = "2017-05-14";
        this.startTime = "08:00";
        this.endTime = "13:00";
        // ALEN - začasno zakomentirano
        // this.startDate = moment(yesterday).format("YYYY-MM-DD")
        // this.endDate = moment(today).format("YYYY-MM-DD")
    };

    const buildTimestamp = function(date, time) {
        return date + "T" + time + ":00"
    };

    const getTrack = function () {
        let path = `/track`;
        this.loading = true;
        console.log("time string test:", moment(buildTimestamp(this.startDate, this.startTime)).tz('Europe/Berlin').toISOString())
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                endDate: moment(buildTimestamp(this.endDate, this.endTime)).tz('Europe/Berlin').toISOString(),
                groupId: "string",
                requiredAccuracy: 0,
                singlePointStops: true,
                startDate: moment(buildTimestamp(this.startDate, this.startTime)).tz('Europe/Berlin').toISOString(),
                token: this.$store.user.token,
                userIds: [
                    "string"
                ]
            }
        }).then((body) => {
            console.log(body);
            this.loading = false;
            this.output = body.tracks;
        });


    };

    const getGroups = function () {
        let path = `/group/list`;
        this.loading = true;
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                token: this.$store.user.token,
            }
        }).then((body) => {
            this.loading = false;
            if (body.status == "OK") {
                this.$store.groups = body.groups;
            }
        });
    };

    const zoomToData = function () {
        this.$refs.map.zoomToVectorLayerExtent()
    };

    const activate = function () {
        this.setDate();
        this.getGroups();
    };

    //
    // EXPORT
    //


    export default {
        name: 'TrackDemo',

        methods: {
            getTrack,
            zoomToData,
            setDate,
            getGroups,
            activate,
            formatterFunction
        },

        mixins: [activate_mixin],

        components: {
            MyMap,
            vueSlider
        },
        computed: {
            points: function () {
                let points = [];
                let j = 0;
                for (let el of this.output) {
                    let color = this.colors[j % this.colors.length];
                    j++;
                    for (let o of el.samples) {
                        points.push({
                            longitude: o.longitude,
                            latitude: o.latitude,
                            name: moment(o.timestamp).format('DD MMM YY HH:mm:ss'),
                            marker: "CIRCLE",
                            color
                        });
                    }
                }
                return points;
            },
            connections: function () {
                if (!this.output)
                    return [];
                let conn = [];
                let j = 0;
                for (let el of this.output) {
                    let color = this.colors[j % this.colors.length];
                    j++;
                    let x = el.samples;
                    let last = null;
                    for (let current of x) {
                        if (last == null) {
                            last = current;
                            continue
                        }
                        let A = last;
                        let B = current;
                        last = current;
                        conn.push({
                            'A': {
                                longitude: A.longitude,
                                latitude: A.latitude,
                                timestamp: moment(A.timestamp).valueOf(),
                                name: 'test'
                            },
                            'B': {
                                longitude: B.longitude,
                                latitude: B.latitude,
                                timestamp: moment(B.timestamp).valueOf(),
                                name: 'test'
                            },
                            color
                        });
                    }
                }
                return conn;
            },
            mydata: function () {
                return {
                    points: this.points,
                    connections: this.connections
                };
            },
            startDateText: function() {
                return moment(this.startDate).format("D MMM YYYY");
            },
            endDateText: function() {
                return moment(this.endDate).format("D MMM YYYY");
            },
            minDate: function() {
                if(this.startDate == null) return 0;
                let x = moment(buildTimestamp(this.startDate, this.startTime)).valueOf();
                console.log("min", x);
                return x;
            },
            maxDate: function() {
                if(this.endDate == null) return 1;
                let x = moment(buildTimestamp(this.endDate, this.endTime)).valueOf();
                console.log("max", x);
                return x;
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
                value: [0, Number.MAX_VALUE],
                panelOpen: true
            }
        }
    }

</script>
