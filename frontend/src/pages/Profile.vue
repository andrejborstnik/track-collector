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
            <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="update_user">
                <v-layout column>
                    <h5>Change Password</h5>
                    <v-text-field
                            name="old_username"
                            label="Old password"
                            id="username"
                            v-model="old_password"
                            type="password"
                            class="ma-0"
                    ></v-text-field>

                    <v-text-field
                            name="new_password"
                            label="New password"
                            id="password"
                            v-model="password"
                            type="password"
                            class="ma-0"
                    ></v-text-field>

                    <v-text-field
                            name="repeat_password"
                            label="Repeat password"
                            id="password"
                            v-model="confirm_password"
                            type="password"
                            class="ma-0"
                    ></v-text-field>

                    <v-flex xm4 class="ma-0">
                        <v-btn
                                @click.native="update_user">Change password
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-layout>
    </v-container>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';

    const update_user = function () {
        if (this.password != this.confirm_password){
            this.errorTitle = "Password change failed.";
            this.errorMessage = "Passwords do not match.";
            this.showAlert = true;
            return;
        }
        
        let user_update_data = {
            oldPassword : this.old_password,
            newPassword : this.password,
            token: this.$store.user.token,
            userId: this.$store.user.email
        };

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/authentication/update`,
            json: user_update_data
        }).then((body) => {
            if (body.status == "OK") {
                this.errorTitle = "Password changed.";
                this.errorMessage = "";
                this.showAlert = true;
            }
            else {
                this.errorTitle = "Password change failed.";
                this.errorMessage = "Wrong or invaild password.";
                this.showAlert = true;
            }

        }).catch((err) => {
            this.errorTitle = "Authentication failure";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
    };

    export default {
        name: 'Profile',

        data: () => {
            return {
                password: null,
                old_password: null,
                confirm_password: null,
                showAlert: null
            }
        },

        methods: {
            update_user
        }

    }

</script>
