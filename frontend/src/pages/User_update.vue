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
                <v-layout column>
                    <h5>Change password</h5>
                    
                    <v-text-field
                            name="username"
                            label="Username"
                            id="username"
                            v-model="user_mail"
                            @keydown.enter.prevent="change_password"
                            class="ma-0"
                    ></v-text-field>
                    <v-text-field
                            name="password"
                            label="Password"
                            id="password"
                            v-model="password"
                            type="password"
                            @keydown.enter.prevent="change_password"
                            class="ma-0"
                    ></v-text-field>
                    <v-text-field
                            name="confirm_password"
                            label="Confirm password"
                            id="password"
                            v-model="confirm_password"
                            type="password"
                            @keydown.enter.prevent="change_password"
                            class="ma-0"
                    ></v-text-field>

                    <v-flex xm4 class="ma-0">
                        <v-btn
                                @click.native="change_password">Change
                        </v-btn>
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

    const change_password = function () {
        let user_mail = this.user_mail; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let password = this.password;
        let confirm_password = this.confirm_password;
        let provider = this.provider == null || this.provider.text == this.systemProvider ? null : this.provider.text;

        console.info("Korak 1.");

        if (this.password.length < 3) {
            this.errorTitle = "Failure";
            this.errorMessage = "Password is to short.";
            this.showAlert = true;
            return;
        }
        if (this.password != this.confirm_password) {
            this.errorTitle = "Failure";
            this.errorMessage = "Password is not same as confirm password.";
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
            uri: `${config.paths_api_prefix}/signin`,//AAAAA
            json: user_registration_data
        }).then((body) => {
            console.info("Uspesna potrditev gesla.");
            this.$router.push(`${config.path_prefix}track`);
           });

    };
    export default {
        name: 'User_update',

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
            change_password
        }
    }

</script>
    





