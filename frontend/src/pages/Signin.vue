<template>
  <v-container fluid class="text-xs-center">
    <v-dialog v-model="showAlert" persistent lazy>
      <v-card>
        <v-card-row>
          <v-card-title>{{this.errorTitle}}</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>{{this.errorMessage}}</v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showAlert=!showAlert">Ok</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
    <v-layout align-center justify-center>
        <v-card raised class="pt-4 pl-5 pr-5 pb-3">
          <v-layout column >
                      <h5>Sign-in</h5>
                      <v-text-field
                        name="username"
                        label="Username"
                        id="username"
                        v-model="user_mail"
                        v-on:keydown.enter.prevent="login"
                        class="ma-0"
                      ></v-text-field>
                      <v-text-field
                        name="password"
                        label="Password"
                        id="password"
                        v-model="password"
                        type="password"
                        v-on:keydown.enter.prevent="login"
                        class="ma-0"
                      ></v-text-field>
                        <v-btn-dropdown
                        label="Auth provider"
                        v-model="provider"
                        v-bind:options="this.$store.providers"
                        max-height="auto"
                        overflow="overflow"
                        class="ma-0 pa-0"
                        ></v-btn-dropdown>
                        <v-flex xm4 class="ma-0">
                          <v-btn
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
    </v-layout>
  </v-container>
</template>

<style lang="scss">
    #loginCard {
      padding: 16px
    }
</style>


<script type="text/babel">

    import * as config from 'config';

    const request = require('request-promise-native');

    import * as cookies from 'common/cookies';

    const login = function () {
        let user_mail = this.user_mail; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let password = this.password;
        let provider = this.provider == null || this.provider.text == this.systemProvider ? null : this.provider.text

        if (!password || !user_mail) {
            this.errorTitle = "Sign in failure";
            this.errorMessage = "Please fill all the fields."
            this.showAlert = true;
            return;
        }
        const user_registration_data = {
            "password": password,
            "userId": user_mail,
            "provider": provider
        };

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/signin`,
            json: user_registration_data
        }).then((body) => {
            if (body.status == "OK") {
                this.$store.user.token = body.token;
                cookies.set_session_cookie(user_mail, body.token, false, true); // todo admin and cookies

                // Set directives cookie.
    //            if (user.cookies_accepted)
    //                cookies.set_directive_cookie();
                this.$router.push(`${config.path_prefix}/track`);
            }
            else {
                cookies.remove_session_cookie();
                this.errorTitle = "Authentication failure";
                this.errorMessage = "Wrong username, password or provider."
                this.showAlert = true;
                // todo react on error
            }

        }).catch((err) => {
          this.errorTitle = "Authentication failure";
          this.errorMessage = "System error."
          this.showAlert = true;
        });
    };

    const getProviders= function () {
        let path = `/authentication/providers/list`;
        request({
            method: "GET",
            json: true,
            uri: config.paths_api_prefix + path,
        }).then((body) => {
            if(body.status == "OK") {
                let providers = [{text: this.systemProvider, value: null}];
                for(let p of body.providers) {
                   providers.push({text: p, value: p});
                }
                this.$store.providers = providers;
            } else {
                this.$store.providers = [];
            }
        });
    };

    export default {
        name: 'Signin',

        data: () => {
            return {
                password: '',
                user_mail: '',
                showAlert: null,
                systemProvider: "System",
                provider: {text: "System"},
                errorTitle: '',
                errorMessage: ''
            }
        },

        methods: {
            login,
            getProviders
        },

        mounted(){
            this.getProviders();
        },


    }

</script>
