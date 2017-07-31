<template>
    <v-container fluid class="text-xs-center">
        <v-tabs dark fixed centered>
            <v-tabs-bar slot="activators" class="blue">
                <v-tabs-slider class="orange"></v-tabs-slider>
                <v-tabs-item
                        href="listgroups"
                        ripple>
                    List groups 
                    <!--COMMENT (my groups) COMMENT -->
                </v-tabs-item>
                <v-tabs-item
                        href="infogroups"
                        ripple>
                    Info groups 
                    <!--COMMENT (tega ne bo, je samo za debug) COMMENT -->
                </v-tabs-item>

                <v-tabs-item
                        href="creategroup"
                        ripple>
                    Create group
                    <!--COMMENT (to ne bo vec popout ampak svoj zavihtek, 
                    se mi zdi da je to vizualno bolje) COMMENT -->
                </v-tabs-item>

                <v-tabs-item
                        href="searchgroups"
                        ripple>
                    Search groups 
                    <!--COMMENT (join groups) COMMENT -->
                </v-tabs-item>

                <v-tabs-item
                        href="myinvitations"
                        ripple>
                    My invitations
                </v-tabs-item>

                <v-tabs-item
                        href="myrequest"
                        ripple>
                    My request
                </v-tabs-item>
            </v-tabs-bar>


            <v-tabs-content id="listgroups">



                

                <v-card flat>
                    <v-card-text>Prvi text</v-card-text>
                </v-card>

                <v-card flat>
                    <v-card-text>
                        <v-list-tile twoline v-for="group in $store.user.groups" v-bind:key="group.groupId">
                            <v-list-tile-avatar>
                                <v-icon>group</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="group.groupId"></v-list-tile-title>
                                <v-list-tile-sub-title>{{ group.description }} </v-list-tile-sub-title>
                                <!--COMMENT  
                                <v-list-tile-sub-title>{{ group.creatorId }} </v-list-tile-sub-title>
                                COMMENT -->
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="isAdmin(group)">
                                <v-btn icon v-on:click.native.stop="admin_action(group)">
                                    <v-icon>bubble_chart</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="leaveGroup">
                                    <v-icon>directions_run</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>

                        </v-list-tile>
                    </v-card-text>
                </v-card>
            </v-tabs-content>

            <v-tabs-content id="infogroups">
                <v-card flat>
                    <v-card-text>Drugi text</v-card-text>
                </v-card>
                {{ $store.user.groups }}
                AAAAAAAAAAAAAAAA___________________________groupLinkList___________________________AAAAAAAAAAAAAAAAAAA
                {{ groupLinkList }}
                AAAAAAAAAAAAAAAA___________________________filteredList___________________________AAAAAAAAAAAAAAAAAAA
                {{ filteredList }}


            </v-tabs-content>

            <v-tabs-content id="creategroup">
                <v-dialog v-model="showAlert" persistent lazy>
                    <v-card>
                        <v-card-title>{{errorTitle}}</v-card-title>
                        <v-card-text>{{errorMessage}}</v-card-text>
                        <v-btn class="green--text darken-1" flat="flat" v-on:click.native="potrditevSporocila">Ok</v-btn>
                    </v-card>
                </v-dialog>


                <v-card flat>
                    <v-card-text>Sesti tekst med23</v-card-text>
                </v-card>

                <v-card raised class="pt-4 pl-5 pr-5 pb-3" @keydown.enter.prevent="createGroup">
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
                                    @click.native.stop="createGroup">Create
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
                <!--COMMENT
                ko ustvarimo novo skupino se mora stran osveziti, 
                prav tako ko sprejemamo nova povabila 
                (dodatno tudi ko zavrnemo povabila ali koncamo prosnje)
                COMMENT -->


            </v-tabs-content>

            <v-tabs-content id="searchgroups">
                <v-card flat>
                    <v-card-text>Tretji text</v-card-text>
                </v-card>

                <!--COMMENT
                
                NOVA IDEJA:

                Samo izpisemo vse grupe. Potem pa mora uporabnik klikniti na 
                grupo in dobi vse njene informacije, torej ali je notri, 
                ali se caka, da bo sprejet noti, ali je zaprosil za vstop, 
                ali je uporabnik/admin.

                Ce je admin, tudi dodatne informacije, ki so sicer dostopne 
                pod list groups.
                COMMENT-->


                <v-card flat>
                    <v-card-text>
                        <v-text-field
                        name="inputSRCgrp"
                        autofocus
                        label="Search..."
                        single-line
                        v-model="groupQueryStr"
                        ></v-text-field>

                        <v-list-tile twoline v-for="group in filteredList" v-bind:key="group.groupId">
                            <v-list-tile-avatar>
                                <v-icon>group</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="group.groupId"></v-list-tile-title>
                                <v-list-tile-sub-title>{{ group.description }} </v-list-tile-sub-title>
                                <!--COMMENT  
                                <v-list-tile-sub-title>{{ group.creatorId }} </v-list-tile-sub-title>
                                COMMENT -->
                            </v-list-tile-content>


                            <!--COMMENT
                            Idealno bi bilo, ce bi za vsako grupo ze takoj
                            vedel ali je uporabnik notri ali ne
                            COMMENT-->

                            <div v-if="simpleInGroup(group.groupId)">
                                <v-list-tile-avatar v-if="isInAdminRole(group)">
                                    <v-btn icon v-on:click.native.stop="admin_action(group)">
                                        <v-icon>bubble_chart</v-icon>
                                    </v-btn>
                                </v-list-tile-avatar>

                                <v-list-tile-avatar v-else>
                                    <v-btn icon v-on:click.native.stop="leaveGroup">
                                        <v-icon>directions_run</v-icon>
                                    </v-btn>
                                </v-list-tile-avatar>
                            </div>
                            <div v-else>
                                <v-list-tile-avatar>
                                    <v-btn icon v-on:click.native.stop="joinGroup(group)">
                                        <!--COMMENT 
                                        <v-icon>foreword</v-icon>
                                        COMMENT-->
                                        
                                        <v-icon>transfer_within_a_station</v-icon>
                                        
                                    </v-btn>
                                </v-list-tile-avatar>
                            </div>

                            

                            <!--COMMENT 
                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="leaveGroup">
                                    <v-icon>directions_run</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            COMMENT-->

                        </v-list-tile>
                    </v-card-text>
                </v-card>

                <!--COMMENT                                    
                <v-card flat>
                    <v-card-text>
                        <v-list-group v-for="group in $store.user.groups" :value="group.active" :key="group.groupId">
                            <v-list-tile slot="item">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ group.groupId }}</v-list-tile-title>
                                </v-list-tile-content>
                                <v-list-tile-avatar>
                                    <v-btn icon v-on:click.native="edit_TEMPLATE_ACTION">
                                        <v-icon>label</v-icon>
                                    </v-btn>
                                    COMMENT
                                    ##prva za admin, ta pa za klasicnega uporabnika
                                    ##tole vseskupaj izgleda cudno (kako bo link na grupo v resnici?)
                                    <v-btn icon v-on:click.native="edit_TEMPLATE_ACTION">
                                        <v-icon>label_outline</v-icon>
                                    </v-btn>
                                    COMMENT
                                </v-list-tile-avatar>
                            </v-list-tile>
                        </v-list-group>
                    </v-card-text>
                </v-card>
                COMMENT-->
            </v-tabs-content>

            <v-tabs-content id="myinvitations">
                <v-card flat>
                    <v-card-text>Cetrti text</v-card-text>
                </v-card>


                <v-card flat>
                    <v-card-text>
                        <v-list-tile twoline v-for="assigData in invitationLinkList" v-bind:key="assigData.groupId">
                            <v-list-tile-avatar>
                                <v-icon>group</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="assigData.groupId"></v-list-tile-title>
                                <!--COMMENT 
                                <v-list-tile-sub-title>{{ assigData.groupUserId }} </v-list-tile-sub-title>
                                COMMENT-->
                                <v-list-tile-sub-title>Assinged status: {{ assigData.groupRole }} </v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="acceptInvitation(assigData)">
                                    <v-icon>done</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="declineInvitation(assigData)">
                                    <v-icon>clear</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                        </v-list-tile>
                    </v-card-text>
                </v-card>

            </v-tabs-content>

            <v-tabs-content id="myrequest">
                <v-card flat>
                    <v-card-text>Peti text</v-card-text>
                </v-card>

                <v-card flat>
                    <v-card-text>
                        <v-list-tile twoline v-for="assigData in requestLinkList" v-bind:key="assigData.groupId">
                            <v-list-tile-avatar>
                                <v-icon>group</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="assigData.groupId"></v-list-tile-title>
                                <!--COMMENT 
                                <v-list-tile-sub-title>{{ assigData.groupUserId }} </v-list-tile-sub-title>
                                COMMENT-->
                                <v-list-tile-sub-title>Requested status: {{ assigData.groupRole }} </v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-avatar>
                                <v-btn icon v-on:click.native="cancelRequest(assigData)">
                                    <v-icon>clear</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>

                        </v-list-tile>
                    </v-card-text>
                </v-card>

            </v-tabs-content>



        </v-tabs>
        <v-dialog v-model="UserAddAppVisible" hide-overlay width="800" scrollable>
            <v-card>                                   
                <UserAddApp :group="UserAddAppGroup"></UserAddApp>
            </v-card>
        </v-dialog>
    </v-container>


</template>


<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';
    import {activate_mixin} from 'common/activate-mixin';
    import UserAddApp from 'pages/UserAddApp.vue';
    import GroupsStorage from 'common/GroupsStorage';



    const activate = function () {
        this.$store.user.leftMenuEnabled = false;
        this.$store.user.rightMenuEnabled = true;
        this.$store.user.bottomNavigation = [];
        var grpStr = new GroupsStorage(this.$store);
        console.info(this.$store.user.groups);
        grpStr.getGroups();
    };

    const isAdmin = function (group) {

        for (let user of group.users) {
            //POZOR
            //tole je sedaj nekonsisteno
            //enkrat ..user.email enkrat pa userId
            //ko bo konsistentno drugje je treba se tu
            //console.info(user);
            //console.info(this.$store.user.email);
            //console.info(user.userId);
            if(this.$store.user.email == user.userId) {
                //console.info(user);
                //console.info(user.isAdmin);
                return user.isAdmin;
            }
        }
    };

    const isInAdminRole = function (group){
        //console.info("isInAdminRole");
        //console.info(group.groupRole);
        //console.info(group);
        //return group.groupRole=="ADMIN";

        //POZOR
        //to bo treba narediti ali na bazi ali pa lokalno
        return false;
    };

    const leaveGroup = function () {
        console.info("you left group TODO");
    };

    const joinGroup = function (group) {
        console.info("you join group TODO");

        let joinGroupData = {
            requests: [
                {
                    //fromDate: moment().toISOString(),
                    grant: "ALLOW",
                    groupId: group.groupId,
                    groupRole: "USER",
                    inviteType: "USER",
                    //untilDate: null,
                    userId: this.$store.user.email
                }
            ],
            token: this.$store.user.token
        }
        console.info("you join group TODO AAA");

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/register`,
            json: joinGroupData
        }).then((body) => {
            if (body.status == "OK") {
                console.info("joinGroup ok");
                console.info(body);
            }
            else {
                console.info("joinGroup failed");
            }
        }).catch((err) => {
            console.info("joinGroup error");
        });
    };

    const acceptInvitation = function (assigData) {
        console.info("declineInvitation");
        console.info("assigData.id");
        console.info(assigData.id);
        console.info(assigData);
        let acceptInvitationData = {
            confirmLinks: [assigData.id],//POZOR: nekaj smiselnega tu
            //forUserId: this.$store.user.email,
            //forUserIdProvider: "string",
            //rejectLinks: [0],
            token: this.$store.user.token
        }

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/update`,
            json: acceptInvitationData
        }).then((body) => {
            if (body.status == "OK") {
                console.info("acceptInvitation body ok");
            }
            else {
                console.info("acceptInvitation body failed");
                console.info(body);
                console.info(body.error_message);
            }
        }).catch((err) => {
            console.info("acceptInvitation error");
        });

        ////this.getUserGroupLinks();
    };

    const declineInvitation = function (assigData) {
        console.info("declineInvitation");
        console.info("assigData.id");
        console.info(assigData.id);
        console.info(assigData);
        let declineInvitationData = {
            //confirmLinks: [0],
            //forUserId: this.$store.user.email,
            //forUserIdProvider: "string",
            rejectLinks: [assigData.id],//POZOR: nekaj smiselnega tu
            token: this.$store.user.token
        }

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/update`,
            json: declineInvitationData
        }).then((body) => {
            if (body.status == "OK") {
                console.info("declineInvitation body ok");
            }
            else {
                console.info("declineInvitation body failed");
            }
        }).catch((err) => {
            console.info("declineInvitation error");
        });

        ////this.getUserGroupLinks();
    };

    const cancelRequest = function (assigData) {
        console.info("cancelRequest");
        console.info("assigData.id");
        console.info(assigData.id);
        console.info(assigData);
        console.info(assigData.groupUserId);
        console.info(assigData.userId);
        let cancelRequestData = {
            //confirmLinks: [0],
            //forUserId: this.$store.user.email,
            //forUserIdProvider: "string",
            rejectLinks: [assigData.id],//POZOR: nekaj smiselnega tu
            token: this.$store.user.token
        }

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/update`,
            json: cancelRequestData
        }).then((body) => {
            if (body.status == "OK") {
                console.info("cancelRequest body ok");
            }
            else {
                console.info("cancelRequest body failed");
            }
        }).catch((err) => {
            console.info("cancelRequest error");
        });

        ////this.getUserGroupLinks();
    };


    //POZOR
    //vse zgornje treba naresti
    //moram vprasati kaksen je request confirm/reject Link


    const time_delay_search_groups = function (searchStr) {
        let searchStrFix = String(searchStr);
        setTimeout(function(){ 
            if (this.groupQueryStr == searchStrFix) {
                this.search_groups(searchStrFix);
            }
        }.bind(this), 300);
    }

    const search_groups = function (searchStr) {
        console.info("Search string:");
        console.info(searchStr);

        let search_group_data = {
            //forUser: params.forUser,
            //forUserProvider: params.forUserProvider,
            queryString: searchStr,
            token: this.$store.user.token
        };

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/list`,
            json: search_group_data
        }).then((body) => {
            if (body.status == "OK") {
                //console.info("list body ok");
                this.filteredList = body.groups;
            }
            else {
                //console.info("list body failed");
            }
        }).catch((err) => {
            //console.info("list error");
        });
    };



    const getUserGroupLinks = function () {
        let userRequestData = {
            //accept: true,
            //forGroupId: "string",
            //forUserId: this.$store.user.email,
            //forUserIdProvider: "string",
            //## ker zelim samo tiste ki se niso razresene:
            pendingOnly: true, 
            token: this.$store.user.token
        }
        console.info("userRequestData");
        console.info(userRequestData);

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/link/list`,
            json: userRequestData
        }).then((body) => {
            if (body.status == "OK") {
                this.groupLinkList = body.assignments;
            }
            else {
                console.info("getUserGroupLinks failed");
                console.info(body);
            }
        }).catch((err) => {
            console.info("getUserGroupLinks error");
        });
    };






/*
    {
      "accepted": true,
      "fromDate": "2017-07-28T10:27:59.784Z",
      "grant": "string",
      "groupAction": "2017-07-28T10:27:59.784Z",
      "groupId": "string",
      "groupRole": "string",
      "groupUserId": "string",
      "id": 0,
      "inviteType": "string",
      "periodic": "string",
      "repeatTimes": 0,
      "timestamp": "2017-07-28T10:27:59.784Z",
      "untilDate": "2017-07-28T10:27:59.784Z",
      "userAction": "2017-07-28T10:27:59.784Z",
      "userId": "string"
    }
*/

    const extractInvitations = function (grpLinkList) {
        let invitations = [];
        console.info("extractInvitations A");

        for (let assigData of grpLinkList) {
            //to najbrz ne bo potrebno
            //if (assigData.accetped == false){}

            if (assigData.inviteType=="GROUP"){
                console.info("extractInvitations B");
                invitations.push({
                    id: assigData.id,
                    accepted: assigData.accepted,
                    groupId: assigData.groupId,
                    groupRole: assigData.groupRole,
                    groupUserId: assigData.groupUserId,
                    userId: assigData.userId
                })
            }
        }
        return invitations;   
    };

    const extractRequest = function (grpLinkList) {
        let requests = [];
        console.info("extractRequest A");

        for (let assigData of grpLinkList) {
            //to najbrz ne bo potrebno
            //if (assigData.accetped == false){}

            if (assigData.inviteType=="USER"){
                console.info("extractRequest B");
                requests.push({
                    id: assigData.id,
                    accepted: assigData.accepted,
                    groupId: assigData.groupId,
                    groupRole: assigData.groupRole,
                    groupUserId: assigData.groupUserId,
                    userId: assigData.userId
                })                
            }
        }
        return requests;  
    };


    /*
    //to se ne splaca, tudi ce je zelo veliko grup
    //uporabnik ni v zelo veliko grupah
    //ce kaksen uporabnik bo v vec kot 50 grupah se splaca
    //ampak ali bo? ce bo lahko enkrat to popravimo na tole:

    const commpereGroups = function(group1,group2){
            if (group1.groupId < group2.groupId){
                return -1;
            }
            return 1;
            //enako ni nikoli, ker groupId unikaten
        };

    
    const listSortedDifference = function (allGroups, myGroups) {
        allGroups.sort(this.commpereGroups);
        myGroups.sort(this.commpereGroups);

        let filterdGroups = [];

        let i = 0;
        let j = 0;
        while (allGroups[i] < myGroups[j]){
            if (i >= allGroups.length){

            }
            if (j >= myGroups.length){
                
            }
        }


    }
    */

    const simpleInGroup = function (group) {
        //POZOR
        //ce bo to delalo prepocasi je treba popravit

        //super bi bilo ce bi se dalo imeti za vsako grupo se status
        //da se ve kako je z uporabnikom

        //console.info("simpleInGroup group");
        //console.info(group);
        for (let myGroup of this.$store.user.groups) {
            //console.info(myGroup.groupId);
            if (myGroup.groupId == group){
                return true;
            }                
        }
        return false;
    }



    const admin_action = function (group) {
        console.info("admin_action");
        this.UserAddAppGroup = group;
        this.UserAddAppVisible = !this.UserAddAppVisible;
    };

    const potrditevSporocila = function () {
        this.showAlert=false; 
        this.$router.go(0);
    };

    const createGroup = function () {
        let new_group_data = {
            groupId: this.group_name,
            description: this.group_description,
            token: this.$store.user.token
        };
        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/group/register`,
            json: new_group_data
        }).then((body) => {
            if (body.status == "OK") {
                this.errorTitle = "New group created.";
                this.errorMessage = "";
                this.showAlert = true;
            }
            else {
                this.errorTitle = "Failed.";
                this.errorMessage = "Group creation faild: " + String(body.error_message);
                this.showAlert = true;
            }
        }).catch((err) => {
            this.errorTitle = "Failed";
            this.errorMessage = "System error.";
            this.showAlert = true;
        });
        console.info("create group end");
        //this.$router.go(0);
        //to je ok, meni se zdi smiselno, da te prestavi na list groups
        //ampak sicer pa je treba vedeti, kako te lahko osvezi tudi na mestu,
        //da ostanes na istem zavihtku (to se najvrjetnej v tem kontekstu sploh ne da 
        //ampak ni pomembno ker se nebo rabilo, tu vedno zelimo iti na prvi zavihtek)

        //Oziroma mogoce lehko osvezim le ko se klikne na search ali na list groups
        //to je za premisliti

        //tu naredimo osvezitev ko se potrdi sporocilo
    };

    export default {
        name: 'Groups',

        mixins: [activate_mixin],

        data () {
            return {
                showAlert: false,
                UserAddAppVisible: false,
                UserAddAppGroup: "",
                filteredList: [],
                groupLinkList: [],
                invitationLinkList: [],
                requestLinkList: [],
                groupQueryStr: ""
            }
        },

        watch: {
            groupQueryStr: function () {
                this.time_delay_search_groups(this.groupQueryStr);
            },

            groupLinkList: function () {
                console.info("this.groupLinkList");
                console.info(this.groupLinkList);
                this.invitationLinkList = this.extractInvitations(this.groupLinkList);
                console.info("OK 1");
                // mogoce boljsa prakas ce se vrednost this.requestLinkList nastavi
                //znotraj funkcije this.extractRequest ponavadi ne, ampak tu je watch, zato ne vem.
                this.requestLinkList = this.extractRequest(this.groupLinkList);
                console.info("OK 2");
            }
        },

        computed: {

        },

        beforeMount(){
            this.getUserGroupLinks();
        },

        methods: {
            activate,
            isAdmin,
            leaveGroup,
            admin_action,
            createGroup,
            search_groups,
            time_delay_search_groups,
            getUserGroupLinks,
            extractInvitations,
            extractRequest,
            simpleInGroup,
            isInAdminRole,
            //leaveGroup,
            joinGroup,
            acceptInvitation,
            declineInvitation,
            cancelRequest,
            potrditevSporocila
        },
        components: {
            UserAddApp
        }
    }

</script>
