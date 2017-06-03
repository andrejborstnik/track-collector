<template>
  <v-container fluid class="text-xs-center">
    <v-layout align-center justify-center>
      <v-flex xs4>
        <v-card id="loginCard" raised>
          <v-layout column align-center>
                    <v-flex xs10>
                      <v-text-field
                        name="username"
                        label="Username"
                        id="username"
                        v-model="user_mail"
                        @keyup.prevent.enter="login"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs10>
                      <v-text-field
                        name="password"
                        label="Password"
                        id="password"
                        v-model="password"
                        @keyup.prevent.enter="login"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs10>
                        <v-btn dark primary
                        v-on:click.native="login">Login</v-btn>
                    </v-flex>
          </v-layout>
          <!--
          <div style="width: 80%;">
              Username:
              <input type="text" v-model="user_mail" @keyup.prevent.enter="login" />
              Password:
              <input type="password" v-model="password" @keyup.prevent.enter="login" />
              <a class="button" @click="login">Login</a>
          </div>
        -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss">
    #loginCard .card{
      color: 'red'
    }
</style>


<script type="text/babel">

    import * as config from 'config';

    const request = require('request-promise-native');

    import * as cookies from 'common/cookies';

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
            if (body.token) {
                this.$store.user.token = body.token;
                cookies.set_session_cookie(user_mail, body.token, false, true); // todo admin and cookies

                // Set directives cookie.
    //            if (user.cookies_accepted)
    //                cookies.set_directive_cookie();
                this.$router.push(`${config.path_prefix}track`);
            }
            else {
                cookies.remove_session_cookie();
                // todo react on error
            }

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
