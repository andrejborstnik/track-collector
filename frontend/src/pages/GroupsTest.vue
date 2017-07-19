<template>
    <v-container fluid class="text-xs-center">
        <v-tabs dark fixed centered>
            <v-tabs-bar slot="activators" class="blue">
                <v-tabs-slider class="orange"></v-tabs-slider>
                <v-tabs-item
                        href="aau"
                        ripple>
                    Add a user
                </v-tabs-item>
                <v-tabs-item
                        href="ei"
                        ripple>
                    Extended invitations
                </v-tabs-item>

                <v-tabs-item
                        href="pr"
                        ripple>
                    Pending requests
                </v-tabs-item>
            </v-tabs-bar>
            <v-tabs-content id="aau">
                <v-card flat>
                    <v-card-text>
                        <!-- ADD A USER -->
                        <!--Mozne ikone se pogleda na https://material.io/icons/-->
                        <input v-model="search" placeholder="search">
                        <v-list-tile twoline v-for="user in filteredList" v-bind:key="user.name">
                            <v-list-tile-avatar>
                                <v-icon>person</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="user.name"></v-list-tile-title>
                                <v-list-tile-sub-title>{{user.status}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="user.status=='Nothing'">
                                <v-btn icon>
                                    <v-icon>group_add</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Participating'">
                                <v-btn icon>
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Requested'">
                                <v-btn icon>
                                    <v-icon>done</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Invited' || user.status=='Requested'">
                                <v-btn icon>
                                    <v-icon>clear</v-icon>
                                </v-btn>
                            </v-list-tile-avatar>
                        </v-list-tile>


                    </v-card-text>
                </v-card>
            </v-tabs-content>

            <v-tabs-content id="ei">
                <v-card flat>
                    <v-card-text>Drugi text</v-card-text>
                </v-card>
                    

                <v-list-group v-for="group in $store.user.groups" :value="group.active" :key="group.groupId">
                    <v-list-tile slot="item">
                        <v-list-tile-content>
                            <v-list-tile-title>{{ group.groupId }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-list-tile v-for="user in group.users" :key="user.userId">
                        <v-list-tile-content>
                            <v-list-tile-title v-bind:style="user.style">{{ user.userId }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn icon v-on:click.native="toggleVisibility(user)">
                              <v-icon v-if="user.visible" light>visibility</v-icon>
                              <v-icon v-if="!user.visible" light>visibility_off</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list-group>
                babkdbadj $store.user.groups {{ $store.user.groups }}
            

            </v-tabs-content>

            <v-tabs-content id="pr">
                <v-card flat>
                    <v-card-text>Tretji text</v-card-text>
                </v-card>
            </v-tabs-content>

        </v-tabs>
    </v-container>
</template>


<style lang="scss">

</style>


<script type="text/babel">

    import request from 'request';
    import * as config from 'config';
    import {activate_mixin} from 'common/activate-mixin';
    
    const activate = function () {
        console.info("CCCCC");
        
    };

    export default {
        name: 'UserAddApp',

        mixins: [activate_mixin],


        data () {
            return {
                dummyList: [
                    {
                        name: "Alen",
                        status: "Participating"
                    },
                    {
                        name: "Alja",
                        status: "Invited"
                    },
                    {
                        name: "Ales",
                        status: "Requested"
                    },
                    {
                        name: "Joze",
                        status: "Nothing"
                    }
                ],
                search: ""
            }
        },
        computed: {
            filteredList() {
                this.activate()
                console.info("AAAA");
                console.info(this.$store.user.email);
                console.info(this.$store.user.token);
                console.info(this.$store.user.groups);
                console.info("BBBBB");
                return this.dummyList.filter(item => {
                        return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1

                    }
                )
            }
        },

        methods: {
            activate
        }
    }

</script>
