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
    <!--COMMENT    
        <v-layout align-center justify-center>
    COMMENT-->
    

            <v-card raised class="pt-4 pl-5 pr-5 pb-3">
                <v-layout column>
                    <h5>Change password</h5>
                    
                    <h6><span>User: {{ this.$store.user.email }}</span></h6>
                    
                    <v-text-field
                            name="current_password"
                            label="Current password"
                            id="current_password"
                            v-model="current_password"
                            type="password"
                            @keydown.enter.prevent="change_password"
                            class="ma-0"
                    ></v-text-field>
                    
                    <v-text-field
                            name="new_password"
                            label="New password"
                            id="new_password"
                            v-model="new_password"
                            type="password"
                            @keydown.enter.prevent="change_password"
                            class="ma-0"
                    ></v-text-field>

                    <v-text-field
                            name="confirm_new_password"
                            label="Confirm new password"
                            id="confirm_new_password"
                            v-model="confirm_new_password"
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

    import * as cookies from 'common/cookies';

    const change_password = function () {
        let current_password = this.current_password; // zadeve v this se lahko spremenijo sredi izvajanja funkcije, zato si jih zapomnimo.
        let new_password = this.new_password;
        let confirm_new_password = this.confirm_new_password;
        
        console.info("Korak 1.");
        console.info(new_password);
        console.info(confirm_new_password);
        console.info(this.password);
        console.info(this);
        console.info(this.provider);

        if (new_password.length < 3) {
            this.errorTitle = "Failure";
            this.errorMessage = "Password is to short.";
            this.showAlert = true;
            return;
        }

        if (new_password != confirm_new_password) {
            this.errorTitle = "Failure";
            this.errorMessage = "New password is not same as confirm password.";
            this.showAlert = true;
            return;
        }
        
        const user_change_password_data = {
            "oldPassword": current_password,
            "newPassword": new_password
        };
        
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/user_update`,
            //TREBA POPRAVIT NA post /authentication/update 
            json: user_change_password_data
        }).then((body) => {
            if (body.status == "OK") {
                console.info("Korak A.");
                //TO DO: Javiti uspesno spremembo gesla
                //na enak nacin kot this.errorTitle in this.errorMessage (showAlert)
                this.$router.push(`${config.path_prefix}/profile`);
            }
            else {
                console.info("Korak B.");
                cookies.remove_session_cookie();
                this.errorTitle = "Authentication failure";
                this.errorMessage = "Wrong current password, please login again.";
                this.showAlert = true;
            }
        }).catch((err) => {
            console.info("Korak C.");
            //cookies.remove_session_cookie();
            this.errorTitle = "Authentication failure";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
        
        //TO DO: Po uspesni potrditvi gesla redirect sem in tu 
        //sporocilo da geslo uspesno spremenjeno
        //this.$router.push(`${config.path_prefix}/profile`);

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
    





