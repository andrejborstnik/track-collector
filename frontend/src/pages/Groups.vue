<template>
    <v-container fluid class="text-xs-center">
        GROUPS LALLALLA
        <v-container>
            <v-layout>
                <v-flex xs8>
                    <v-layout row wrap v-for="(pretty, field) in showFields">
                        <v-flex xs2>
                            <v-subheader>{{pretty}}</v-subheader>
                        </v-flex>
                        <v-flex xs9>
                            <v-text-field
                                    :readonly="readonly[field]"
                                    type="text"
                                    v-model="userData[field]"
                                    @dblclick.native="setReadonly(field, false)"
                                    @keyup.enter.prevent="setReadonly(field, true)"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-flex>
                
                <v-list-group v-for="group in $store.groups" :value="group.active" :key="group.groupId">
                    <v-list-tile slot="item">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ group.groupId }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-item v-for="user in group.users" :key="user.userId">
                        <v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title>{{ user.userId }}</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-item>
                </v-list-group>

                <v-flex xs4>
                    <v-layout xs6>
                        <v-flex xs3>
                            <v-btn @click.native="openCPW = !openCPW" class="button">Create new group</v-btn>
                        </v-flex>

                        <v-flex xs8>
                            <v-layout align-center justify-center v-if="openCPW">
                                <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="create_group">
                                    <v-layout column>
                                        <h5>Create new group</h5>
                                        <v-text-field
                                                name="group_name"
                                                label="Group name"
                                                id="group_name"
                                                v-model="group_name"
                                                type="text"
                                                class="ma-0"
                                        ></v-text-field>

                                        <v-text-field
                                                name="group_description"
                                                label="Description"
                                                id="group_description"
                                                v-model="group_description"
                                                type="text"
                                                class="ma-0"
                                        ></v-text-field>

                                        <v-flex xm4 class="ma-0">
                                            <v-btn
                                                    @click.native="create_group">Create
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-card>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>


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

    </v-container>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';

    //import {activate_mixin} from 'common/activate-mixin';

    const create_group = function () {
        let new_group_data = {
            groupId: this.group_name,
            description: this.group_description,
            token: this.$store.user.token,
        };

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/create`,
            json: new_group_data
        }).then((body) => {
            if (body.status == "OK") {
                this.errorTitle = "New group created.";
                this.errorMessage = "";
                this.showAlert = true;
            }
            else {
                this.errorTitle = "Failed.";
                this.errorMessage = "Group creation faild.";
                this.showAlert = true;
            }

        }).catch((err) => {
            this.errorTitle = "Failed";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
    };

    /*
    const activate = function () {
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/authentication/profile`,
            json: {
                token: this.$store.user.token
            }
        }).then((body) => {
            if (body.status == "OK") {
                this.userData = body;
            }
        }).catch((err) => {
            this.errorTitle = "Authentication failure";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
    };
    */

    const setReadonly = function (field, bool) {
        this.readonly[field] = bool;
    };


    export default {
        name: 'Groups',

        //mixins: [activate_mixin],

        // todo same username on change
        data: () => {
            return {
                group_name: null,
                group_description: null,
                showAlert: null,
                openCPW: false,
                userData: {},
                showFields: {
                    userId: 'Username',
                    provider: 'Company',
                    personalGroup: 'Group',
                    primaryDevice: 'Primary Device',
                    devices: 'Devices'
                },
                readonly: {
                    userId: true,
                    provider: true,
                    personalGroup: true,
                    primaryDevice: true,
                    devices: true
                }
            }
        },

        methods: {
            create_group,
            //activate,
            setReadonly
        }

    }

</script>
