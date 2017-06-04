<template>

     <v-container id="trackShow" fluid>
           <v-card id="rangeCard" raised>
                 <v-layout row-sm column child-flex-sm align-center justify-space-between>
                   <v-flex xs4>
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
                       <v-date-picker v-model="startDate" scrollable></v-date-picker>
                     </v-dialog>
                   </v-flex>
                   <v-flex xs4>
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
                       <v-date-picker v-model="endDate" scrollable></v-date-picker>
                     </v-dialog>
                   </v-flex>
                   <v-flex xs4>
                     <v-btn primary light v-on:click.native="getTrack">Show your tracks</v-btn>
                   </v-flex>
                   <v-flex xs4>
                     <v-btn primary light v-on:click.native="zoomToData">Zoom</v-btn>
                   </v-flex>
                 </v-layout>
          </v-card>
        <v-dialog persistent v-model="loading" lazy>
          <v-layout row justify-center>
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" class="purple--text"></v-progress-circular>
          </v-layout>
        </v-dialog>
        <div v-if="connections"></div>

        <MyMap v-if="points"
              ref="map"
              :mydata="{points, connections}"
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


    const zoomToData = function () {
       this.$refs.map.zoomToVectorLayerExtent()
    }
    //
    // EXPORT
    //


    export default {
        name: 'TrackDemo',

        methods: {
            getTrack,
            zoomToData
        },

        components: {
            MyMap
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
                        if(last == null) {
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
