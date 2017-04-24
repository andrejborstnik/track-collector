<template>

    <div>
        <div style="width: 200px;">
            Od:
                <input type="date" v-model="startDate"></input>
            Do:
                <input type="date" v-model="endDate"></input>
        </div>
        <a class="button" @click="getTrack">Show Alen</a>

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


    import _ from 'lodash';

    import MyMap from 'widgets/Map.vue';

    //
    // Functions
    //

    const getTrack = function () {
        let query = 'test';

        let path = `/track/${query}`;
        request({
            method: "POST",
            uri: config.paths_api_prefix + path,
            json: {
                startDate: this.startDate,
                endDate: this.endDate
            }
        }).then((body) => {
            this.output = body;
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
                return _.map(this.output.samples, (o) => {
                    return {
                        longitude: o.longitude,
                        latitude: o.latitude,
                        name: 'test'
                    }
                })
            },
            connections: function () {
                if (!this.output)
                    return [];
                let conn = [];
                for (let i = 0; i < this.output.samples.length - 1; i++) {
                    let A = this.output.samples[i];
                    let B = this.output.samples[i + 1];
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
                        }
                    });
                }
                return conn;
            }
        },

        data () {
            return {
                output: '',
                startDate: '',
                endDate: ''
            }
        }
    }

</script>
