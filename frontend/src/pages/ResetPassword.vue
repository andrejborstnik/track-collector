<template>

    <v-container fluid class="text-xs-center">
       <v-dialog v-model="showAlert" persistent lazy>
            <v-card>
                <v-card-row>
                    <v-card-title>Success</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>Password reset email succesfully sent</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showAlert=false">Ok</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
    <!--COMMENT    
        <v-layout align-center justify-center>
    COMMENT-->
    

            <v-card raised class="pt-4 pl-5 pr-5 pb-3">
                <v-layout column>
                    <h5>Reset password</h5>
                    
                    
                    
                    <v-text-field
                            name="email"
                            label="Email"
                            id="email"
                            v-model="mail"
                            @keydown.enter.prevent="resetPassword"
                            class="ma-0"
                    ></v-text-field>
                    <v-alert warning v-model="warningAlert">
                        Please enter a valid email address.
                    </v-alert>
                    <v-alert error v-model="errorAlert">
                        Please enter a valid email address.
                    </v-alert>                    
                    <v-alert success v-model="mailOK">
                        Valid email address.
                    </v-alert>
                    

                    <v-flex xm4 class="ma-0">
                        <v-btn
                                @click.native="resetPassword">Reset password
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card>

    <!--COMMENT
        </v-layout>
    COMMENT-->
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
    const resetPassword = function () {       
        var email = this.mail
        if (validateEmail(email)){
            var resetPasswordData = {"email": email, "token": "haha"}
            request({
                method: "POST",
                uri: `${config.paths_api_prefix}/resetPassword`,
                json: resetPasswordData
            }).then((body) => {
                // todo login with api
                this.showAlert = true;

            }).catch((err) => {
                // todo show different reasons
                alert("There was an error.");
            });
        }else {
            this.errorAlert=true
        }
    };

    const validateEmail = function (email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        };
    export default {
        name: 'resetPassword',

        data: () => {
            return {

                mail: '',
                showAlert: false,
                errorAlert: false
            }
        },

        methods: {
            resetPassword,
            validateEmail
        },

        computed: {
            mailOK: function () {
                this.errorAlert=false
                return validateEmail(this.mail)
            },
            warningAlert: function () {
                if (this.errorAlert) {
                    return false
                } else {
                    return !this.mailOK
                }
            }
        }

    }

</script>
