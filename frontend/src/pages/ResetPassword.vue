<template>
    <v-container v-if="missingToken" fluid class="text-xs-center">
       <v-dialog v-model="emailAlert" persistent lazy>
            <v-card>
                <v-card-row>
                    <v-card-title>Success</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>Password reset email succesfully sent</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="emailAlert=false">Ok</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
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
                    <v-alert warning v-model="emailWarningAlert">
                        Please enter a valid email address.
                    </v-alert>
                    <v-alert error v-model="emailErrorAlert">
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
    </v-container>

    <v-container v-else fluid class="text-xs-center">
           <v-dialog v-model="passAlert" persistent lazy>
            <v-card>
                <v-card-row>
                    <v-card-title>Success</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>Password succesfully reset.</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="passAlert=false">Ok</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
            <v-card raised class="pt-4 pl-5 pr-5 pb-3">
                <v-layout column>
                    <h5>Reset password</h5>

                    <v-text-field
                            name="newPassword1"
                            label="new password"
                            id="newPassword1"
                            v-model="newPassword1"
                            type="password"
                            class="ma-0"
                    ></v-text-field>
                    <v-text-field
                            name="newPassword2"
                            label="confirm password"
                            id="newPassword2"
                            v-model="newPassword2"
                            type="password"
                            @keydown.enter.prevent="resetPasswordStep2"
                            class="ma-0"
                    ></v-text-field>
                    <v-alert warning v-model="passwordWarningAlert">
                        Passwords must match.
                    </v-alert>
                    <v-alert error v-model="passwordErrorAlert">
                        Passwords must match.
                    </v-alert>                    
                    <v-alert success v-model="passOK">
                        Passwords match.
                    </v-alert>
                    <v-alert warning v-model="passwordTooShort">
                        Password is too short.
                    </v-alert>
                    

                    <v-flex xm4 class="ma-0">
                        <v-btn
                                @click.native="resetPasswordStep2">Reset password
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
            var resetPasswordData = {"email": email}
            request({
                method: "POST",
                uri: `${config.paths_api_prefix}/resetPassword`,
                json: resetPasswordData
            }).then((body) => {
                // todo login with api
                this.emailAlert = true;

            }).catch((err) => {
                // todo show different reasons
                alert(`There was an error. (${err})`);
            });
        }else {
            this.emailErrorAlert=true
        }
    };

    const resetPasswordStep2 = function () {
        var pass1 = this.newPassword1;
        var pass2 = this.newPassword2;

        if (pass1==pass2 && pass1.length>5){
            var resetPasswordData = {"password": pass1, "resetToken": this.resetToken}
            request({
                method: "POST",
                uri: `${config.paths_api_prefix}/resetPassword`,
                json: resetPasswordData
            }).then((body) => {
                // todo login with api
                this.passAlert = true;

            }).catch((err) => {
                // todo show different reasons
                alert(`There was an error. (${err})`);
            });
        }else if (pass1.length>5){
            this.passwordErrorAlert=true
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
                emailAlert: false,
                passAlert: false,
                emailErrorAlert: false,
                passwordErrorAlert : false,
                newPassword1: "",
                newPassword2: null,
                resetToken: null
            }
        },

        methods: {
            resetPassword,
            validateEmail,
            resetPasswordStep2
        },
        mounted: function () {
            console.log(this.$route.query.resetToken);
            this.resetToken = this.$route.query.resetToken;
        },

        computed: {
            mailOK: function () {
                this.emailErrorAlert=false
                return validateEmail(this.mail)
            },
            emailWarningAlert: function () {
                if (this.emailErrorAlert) {
                    return false
                } else {
                    return !this.mailOK
                }
            },
            hasToken: function(){
                if (typeof this.resetToken != 'undefined'){
                    return true
                }else{
                    return false
                }
            },
            missingToken: function(){
                return !this.hasToken
            },
            passOK: function() {
                this.passwordErrorAlert=false
                return (this.newPassword1==this.newPassword2 && !this.passwordTooShort)
            },
            passwordWarningAlert: function () {
                if (this.passwordErrorAlert) {
                    return false
                } else {
                    return (!this.passOK && !this.passwordTooShort)
                }
            },
            passwordTooShort: function(){
                return this.newPassword1.length>5 ? false : true
            }
        }

    }

</script>
