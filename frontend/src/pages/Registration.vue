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
       
        <v-dialog v-model="showSuccess" persistent lazy>
            <v-card>
                <v-card-row>
                    <v-card-title>{{this.successTitle}}</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>{{this.successMessage}}</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn class="green--text darken-1" flat="flat" v-on:click.native="showSuccess=false; $router.push('/signin');">Ok</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
        
        <!--COMMENT
        <v-layout align-center justify-center>
        COMMENT-->
        
            <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="login">
                <v-layout column>
                    <h5>Please fill the fields:</h5>
                    
                    <v-text-field
                            name="user_mail"
                            label="Mail"
                            id="user_mail"
                            v-model="user_mail"
                            type="text"
                            class="ma-0"
                    ></v-text-field>
                    
                    <v-text-field
                            name="user_name"
                            label="Name (SE NE UPORABIMO)"
                            id="user_name"
                            v-model="user_name"
                            type="text"
                            class="ma-0"
                    ></v-text-field>
                    
                    <v-text-field
                            name="user_surname"
                            label="Surname (SE NE UPORABIMO)"
                            id="user_surname"
                            v-model="user_surname"
                            type="text"
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

                    <v-text-field
                            name="confirm_password"
                            label="Confirm password"
                            id="confirm_password"
                            v-model="confirm_password"
                            type="password"
                            class="ma-0"
                    ></v-text-field>

                    <v-flex xm4 class="ma-0">
                        <v-btn
                                @click.native="register_user">Create account
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
    
    const register_user = function () {
        let user_mail = this.user_mail; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let user_name = this.user_name;
        let user_surname = this.user_surname;
        let password = this.password;
        let confirm_password = this.confirm_password;
        
        if (!user_mail || !user_name || !user_surname || !password || !confirm_password) {
            this.errorTitle = "Failure";
            this.errorMessage = "Please fill all the fields.";
            this.showAlert = true;
            return;
        }
        else if (password.length < 5){
            this.errorTitle = "Failure";
            this.errorMessage = "Password is to short.";
            this.showAlert = true;
            return;
        }
        else if (password != confirm_password){
            this.errorTitle = "Failure";
            this.errorMessage = "New password is not same as confirm password.";
            this.showAlert = true;
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
            successful_registration = true
            this.successTitle = "Succes";
            this.successMessage = "Registration was successful";
            this.showSuccess = true;
            return;
        }).catch((err) => {
            this.errorTitle = "Failure";
            this.errorMessage = "Connection unavailable try again after 5 minutes. If this repeats please contact admin.";
            this.showAlert = true;
            return;
        });
    };
    
    export default {
        name: 'Registaration',
        
        data: () => {
            return {
                password: null,
                confirm_password: null,
                user_mail: null,
                user_name: null,
                user_surename: null,
                showAlert: false,
                errorTitle: '',
                errorMessage: '',
                showSuccess: false,
                successTitle: '',
                successMessage: ''
            }
        },
        
        methods: {
            register_user
        }
    }
</script>
