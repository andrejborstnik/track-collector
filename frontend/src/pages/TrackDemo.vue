<template>

     <v-container id="trackShow" fluid>
           <v-card raised>
                 <v-layout align-baseline justify-end style="border-width: 1">
                   <v-flex xs12 sm6>
                     <v-dialog
                       persistent
                       v-model="modalFrom"
                       lazy
                     >
                       <v-text-field
                         slot="activator"
                         label="From:"
                         v-model="startDate"
                         prepend-icon="event"
                         readonly
                       ></v-text-field>
                       <v-date-picker v-model="startDate" scrollable>
                         <template scope="{ save, cancel }">
                           <v-card-row actions>
                             <v-btn flat primary v-on:click.native.native="cancel()">Cancel</v-btn>
                             <v-btn flat primary v-on:click.native.native="save()">Save</v-btn>
                           </v-card-row>
                         </template>
                       </v-date-picker>
                     </v-dialog>
                   </v-flex>
                   <v-flex xs12 sm6>
                     <v-dialog
                       persistent
                       v-model="modalTo"
                       lazy
                     >
                       <v-text-field
                         slot="activator"
                         label="To:"
                         v-model="endDate"
                         prepend-icon="event"
                         readonly
                       ></v-text-field>
                       <v-date-picker v-model="endDate" scrollable>
                         <template scope="{ save, cancel }">
                           <v-card-row actions>
                             <v-btn flat primary v-on:click.native.native="cancel()">Cancel</v-btn>
                             <v-btn flat primary v-on:click.native.native="save()">Save</v-btn>
                           </v-card-row>
                         </template>
                       </v-date-picker>
                     </v-dialog>
                   </v-flex>

                   <!--
                   Od:
                       <input type="date" v-model="startDate"></input>

                   Do:
                       <input type="date" v-model="endDate"></input>
                          -->
                  <v-btn primary light
                       v-on:click.native="getTrack">Show your tracks</v-btn>
                 </v-layout>
          </v-card>
        <v-dialog persistent v-model="loading" lazy>
          <v-layout row justify-center>
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" class="purple--text"></v-progress-circular>
          </v-layout>
        </v-dialog>
        <div v-if="connections"></div>

        <MyMap v-if="points" :mydata="{points, connections}" source="OSM" width="100%" height="700px"
               style="padding-top: 1rem; padding-bottom: 1rem;"></MyMap>
     </v-container>

</template>


<style lang="scss">

</style>


<script type="text/babel">

    import async from 'co';
    const request = require('request-promise-native');
    import * as config from 'config';

    import moment from 'moment';


    import _ from 'lodash';

    import MyMap from 'widgets/Map.vue';

    //
    // Functions
    //

    const getTrack = function () {
//        async(function*() {
//                //        POST /group/list
//    //        {
//    //            "token": "string"
//    //        }
//
//
//
//
//        }.bind(this));

        let path = `/track`;
        this.loading = true;
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                endDate: this.endDate,
                groupId: "string",
                requiredAccuracy: 0,
                singlePointStops: true,
                startDate: this.startDate,
                token: this.$store.user.token,
                userIds: [
                    "string"
                ]
            }
        }).then((body) => {
            this.loading = false;
            this.output = body.tracks;
        });


    };

    //
    // EXPORT
    //


    export default {
        name: 'TrackDemo',

        methods: {
            getTrack
        },

        components: {
            MyMap
        },

        computed: {
            points: function () {
//                let points = [];
//                for (let j = 0; j < this.output.length; j++) {
//                    let color = this.colors[j % this.colors.length];
//                    let x = this.output[j].samples;
//                    for (let i = 0; i < x.length; i++) {
//                        let o = x[i];
//                        points.push({
//                            longitude: o.longitude,
//                            latitude: o.latitude,
//                            name: 'test',
//                            color
//                        });
//                    }
//                }
//                return points;
                return [];
            },
            connections: function () {
                if (!this.output)
                    return [];
                let conn = [];
                for (let j = 0; j < this.output.length; j++) {
                    let color = this.colors[j % this.colors.length];
                    let x = this.output[j].samples;
                    for (let i = 0; i < x.length - 1; i++) {
                        let A = x[i];
                        let B = x[i + 1];
                        conn.push({
                            'A': {
                                longitude: A.longitude,
                                latitude: A.latitude,
                                name: 'test'
                            },
                            'B': {
                                longitude: B.longitude,
                                latitude: B.latitude,
                                name: 'test'
                            },
                            color
                        });
                    }
                }
                return conn;
            }
        },

        data () {
            return {
                output: '',
                startDate: "2017-05-07",
                endDate: "2017-05-14",
                colors: ['red', 'green', 'grey', 'orange', 'yellow', 'blue', 'black'], // this colors or hex.
                modalFrom: false,
                modalTo: false,
                loading: false
            }
        }
    }

</script>
