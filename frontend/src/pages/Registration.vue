<template>

    <div style="width: 80%;">
        Email:
        <input type="text" v-model="user_mail" @keyup.prevent.enter="register_user" />
        Password:
        <input type="password" v-model="password" @keyup.prevent.enter="register_user" />
        Confirm password:
        <input type="password" v-model="confirm_password" @keyup.prevent.enter="register_user" />
        <a class="button" @click="register_user">Sign up</a>
    </div>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    import * as config from 'config';
    const request = require('request-promise-native');

    const register_user = function () {
        let user_mail = this.user_mail; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let password = this.password;
        let confirm_password = this.confirm_password;

        if (!password || !user_mail) {
            alert("Please fill all the fields.");
            return;
        }
        else if (password != confirm_password){
            alert("Passwords do not match.");
            return;
        }
        
        const user_registration_data = {
            "user_mail" : user_mail,
            "user_password" : password
        };

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/register`,
            json: user_registration_data
        }).then((body) => {
            // todo login with api
            this.$router.push('/browse');
        }).catch((err) => {
            // todo show different reasons
            alert("There was an error.")
        });
    };

    export default {
        name: 'Registaration',

        data: () => {
            return {
                geslo: '',
                uname: ''
            }
        },

        methods: {
            register_user
        }

    }

</script>
