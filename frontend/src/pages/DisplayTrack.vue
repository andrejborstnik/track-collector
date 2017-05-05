<template>
    <section>
        <MyMap :mydata="{points, connections}" source="OSM" width="100%" height="700px" style="padding-top: 1rem; padding-bottom: 1rem;"></MyMap>
    </section>
</template>


<script type="text/babel">

    //
    // LIBRARIES
    //

    // Async
    // import async from 'co';

    // Import mixins.
    import {activate_mixin} from 'common/activate-mixin';

    // Components
    import MyMap from 'widgets/Map.vue';

    // Vue
    import Vue from 'vue';


    //
    // FUNCTIONS
    //

    const activate = function () {
        this.getData();
    };

    const myParseFloat = function (str, delimeter = ',') {
        return parseFloat(str.split(delimeter).join('.'));
    };

    const getData = function () {
        let points = [];
        let connections = [];
        let tracks = JSON.parse(decodeURIComponent(this.$route.params.tracks));

        for (let track of tracks) {
            let prevpoint;
            for (let point of track.points) {
                points.push({
                    longitude: myParseFloat(point.longitude),
                    latitude: myParseFloat(point.latitude),
                    name: point.name,
                    color: point.color || 'blue'
                });
                if (prevpoint) {
                    connections.push({
                        'A': {
                            longitude: myParseFloat(prevpoint.longitude),
                            latitude: myParseFloat(prevpoint.latitude),
                            name: prevpoint.name
                        },
                        'B': {
                            longitude: myParseFloat(point.longitude),
                            latitude: myParseFloat(point.latitude),
                            name: point.name
                        },
                        color: track.color || 'grey'
                    });
                }
                prevpoint = point;
            }
        }
        this.points = points;
        this.connections = connections;
    };


    //
    // EXPORT
    //


    export default {
        name: "DisplayTrack",

        mixins: [activate_mixin],

        methods: {
            activate,
            getData
        },

        data () {
            return {
                companies: [],
                points: []
            }
        },

        components: {
            MyMap
        }

    }
</script>