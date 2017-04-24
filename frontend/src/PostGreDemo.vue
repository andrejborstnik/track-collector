<template>

    <div>
        <span>Insert a query: <input v-model="query" @keyup.prevent.enter="queryDatabase" style="border: 1px solid gray;"></span><br>
        <span>Result: {{output}}</span>
    </div>

</template>


<style lang="scss">
    
</style>


<script type="text/babel">

    import async from 'co';
    const request = require('request-promise-native');
    import * as config from 'config';

    // 
    // Functions
    //

    const queryDatabase = function () {
        let query = this.query;
        let params = this.params;

        let path = `/queryDb/${query}`;
        if (params)
            path = path + `?params=${params}`;
        request({
            method: "POST",
            uri: config.paths_api_prefix + path
        }).then((body) => {
            this.output = JSON.parse(body);
        });
    };


    //
    // EXPORT
    //


    export default {
        name: 'PostGreDemo',

        methods: {
            queryDatabase
        },

        data () {
            return {
                query: '',
                output: ''
            }
        }
    }

</script>
