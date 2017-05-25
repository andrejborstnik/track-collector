<template>

    <div style="width: 80%;">
        Username:
        <input type="text" v-model="user_mail" @keyup.prevent.enter="login" />
        Password:
        <input type="password" v-model="password" @keyup.prevent.enter="login" />
        <a class="button" @click="login">Login</a>
    </div>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    import * as config from 'config';
    const request = require('request-promise-native');

    const login = function () {
        let user_mail = this.user_mail; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let password = this.password;

        if (!password || !user_mail) {
            alert("Please fill all the fields.");
            return;
        }

        const user_registration_data = {
            "password": password,
            "userId": user_mail
        };

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/signin`,
            json: user_registration_data
        }).then((body) => {
            // this.$router.push('/browse');
            console.log(body)
        }).catch((err) => {
            // todo show different reasons
            alert("There was an error.")
        });
    };

    export default {
        name: 'Signin',

        data: () => {
            return {
                password: '',
                user_mail: ''
            }
        },

        methods: {
            login
        }

    }

</script>
