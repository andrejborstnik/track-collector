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
                        <input v-model="search" placeholder="search">
                        <v-list-tile twoline v-for="user in filteredList" v-bind:key="user.name">
                            <v-list-tile-avatar>
                                <v-icon>face</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="user.name"></v-list-tile-title>
                                <v-list-tile-sub-title>{{user.status}}</v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-avatar v-if="user.status=='Nothing'">
                                <v-icon>add</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Participating'">
                                <v-icon>delete</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Requested'">
                                <v-icon>done</v-icon>
                            </v-list-tile-avatar>
                            <v-list-tile-avatar v-if="user.status=='Invited' || user.status=='Requested'">
                                <v-icon>clear</v-icon>
                            </v-list-tile-avatar>
                        </v-list-tile>


                    </v-card-text>
                </v-card>
            </v-tabs-content>

            <v-tabs-content id="ei">
                <v-card flat>
                    <v-card-text>Drugi text</v-card-text>
                </v-card>
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


    export default {
        name: 'UserAddApp',


        data () {
            return {
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
                return this.dummyList.filter(item => {
                        return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1

                    }
                )
            }
        }

        // methods: {
        //     create_group,
        // }

    }

</script>
