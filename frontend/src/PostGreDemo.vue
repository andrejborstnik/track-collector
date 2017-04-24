<template>

    <div>
        <span>Insert a query: <input v-model="query" @keyup.prevent.enter="queryDatabase" style="border: 1px solid gray;"></span>
        <button v-on:click="queryDatabase">GO!</button>
        <br>
        <template v-if="output">
            <span>Result (raw): {{output}}</span>
            <br>
            <span> Result (table):</span>
            <br>
            <table>
                <tbody>
                    <tr>
                        <th>#</th>
                        <th v-for="(value,key,i) in output[0]">
                            {{key}}
                        </th> 
                    </tr>
                    <tr v-for="(x,idx) in output">
                        <td>{{idx}}</td>
                        <td v-for="(value,key) in x">
                            {{value}}
                        </td>
                    </tr>
                </tbody>
            </table> 
        </template>

    </div>

</template>


<style lang="scss">
button {
    background-color: #e0e0e0;
    border: none;
    color: black;
    padding: 5px 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

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
                query: 'select * from users',
                output: ''
            }
        }
    }

</script>
