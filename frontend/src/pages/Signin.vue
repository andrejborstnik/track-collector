<template>
    <v-container fluid class="text-xs-center">
        <v-dialog v-model="showAlert" persistent lazy>
            <v-card>
                <v-card-row>
                    <v-card-title>{{errorTitle}}</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>{{errorMessage}}</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showAlert=false">Ok</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
        <v-layout align-center justify-center>
            <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="login">
                <v-layout column>
                    <h5>Sign-in</h5>
                    <v-text-field
                            name="username"
                            label="Username"
                            id="username"
                            v-model="user_mail"
                            class="ma-0"
                    ></v-text-field>

                    <v-text-field
                            name="password"
                            label="Password"
                            id="password"
                            v-model="password"
                            type="password"
                            class="ma-0"
                    ></v-text-field>

                    <!--COMMENT
                    Animacija pri Auth provider je zelo cudna.
                    Vsaj ob prvem kliku na mojem brovserju meni
                    kar prileti iz leve strani.
                    Verjetno bo treba to popraviti.
                    COMMENT-->


                    <v-select
                            label="Auth provider"
                            v-model="provider"
                            :items="this.$store.providers"
                            max-height="auto"
                            overflow
                            class="ma-0 pa-0"
                    ></v-select>
                    <v-flex xm4 class="ma-0">

                        <v-btn
                                @click.native="login">Login
                        </v-btn>

                        <table style="width:100%">
                          <tr>
                            <td><router-link to="resetPassword">Forgot password?</router-link></td>
                          </tr>
                          <tr>
                            <td><router-link to="registration">New account.</router-link></td>
                          </tr>
                        </table>
                    </v-flex>
                </v-layout>
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

    import {activate_mixin} from 'common/activate-mixin';

    const login = function () {
        let user_mail = this.user_mail; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let password = this.password;
        let provider = this.provider == null || this.provider.text == this.systemProvider ? null : this.provider.text;

        if (!password || !user_mail) {
            this.errorTitle = "Sign in failure";
            this.errorMessage = "Please fill all the fields.";
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
                this.$router.push(`${config.url_prefix}/track`);
            }
            else {
                cookies.remove_session_cookie();
                this.errorTitle = "Authentication failure";
                this.errorMessage = "Wrong username, password or provider.";
                this.showAlert = true;
                // todo react on error
            }

        }).catch((err) => {
            this.errorTitle = "Authentication failure";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
    };

    const getProviders = function () {
        let path = `/authentication/providers/list`;
        request({
            method: "GET",
            json: true,
            uri: config.paths_api_prefix + path,
        }).then((body) => {
            if (body.status == "OK") {
                let providers = [{text: this.systemProvider, value: this.systemProvider}];
                for (let p of body.providers) {
                    providers.push({text: p, value: p});
                }
                this.$store.providers = providers;
            } else {
                this.$store.providers = [];
            }
        });
    };

    const activate = function () {
        // Se izvede vsakic, ko se stran aktivira. Mounted se izvede le, ko se komponenta prvic skreira (in v Vue nikoli ne umre, razen, ce ji reces).
        // Na primer, ce se odlogiras in nazaj logiras z drugim racunom, bi ti z mounted kazalo providerje prvega uporabnika.
        this.getProviders();
    };

    export default {
        name: 'Signin',

        mixins: [activate_mixin],

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
            getProviders,
            activate
        }
    }

</script>
