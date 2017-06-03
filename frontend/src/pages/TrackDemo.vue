<template>

    <div>
        <div style="width: 200px;">
            Od:
                <input type="date" id="datum-od" v-model="startDate"></input>
            Do:
                <input type="date" id="datum-do" v-model="endDate"></input>
        </div>
        <a class="button" @click="getTrack">Show your tracks</a>
        <div v-if="connections"></div>

        <MyMap v-if="points" :mydata="{points, connections}" source="OSM" width="100%" height="700px"
               style="padding-top: 1rem; padding-bottom: 1rem;"></MyMap>
    </div>

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
    Date.prototype.yyyymmdd = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();

      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('-');
    };
    const setDate = function () {
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        this.startDate = yesterday.yyyymmdd();
        this.endDate = today.yyyymmdd();
    }

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
            this.output = body.tracks;
        });


    };

    //
    // EXPORT
    //


    export default {
        name: 'TrackDemo',

        methods: {
            getTrack,
            setDate
        },

        components: {
            MyMap
        },

        mounted(){
            this.setDate()
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
                startDate: '',
                endDate: '',
                colors: ['red', 'green', 'grey', 'orange', 'yellow', 'blue', 'black'] // this colors or hex.
            }
        }
    }

</script>
