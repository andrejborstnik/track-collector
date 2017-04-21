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
    import http from 'http';
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
        http.get({
            path: config.paths_api_prefix + path
        }, function (res) {
            if (res.statusCode == 200) {
                let chunks = [];
                res.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                res.on('end', function () {
                    this.output = JSON.parse(chunks.join());
                }.bind(this));
            }
        }.bind(this));
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
