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

    let activate = function () {
        Vue.nextTick(function () {
            this.getData();
        }.bind(this));
    };

    let getData = function () {
        this.points = [{
            longitude: 15.5,
            latitude: 46,
            name: 'pointA'
        },
        {
            longitude: 15.7,
            latitude: 45.5,
            name: 'pointB'
        }];
        this.connections = [{
            'A': {
                longitude: 15.5,
                latitude: 46,
                name: 'pointA'
            },
            'B': {
                longitude: 15.7,
                latitude: 45.5,
                name: 'pointB'
            }
        }];


    };


    //
    // EXPORT
    //


    export default {
        name: "ExampleMap",

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
