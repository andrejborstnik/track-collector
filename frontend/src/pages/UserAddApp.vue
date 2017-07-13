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
          <v-card-text>Prvi text</v-card-text>
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
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              }
            }

        // methods: {
        //     create_group,
        // }

    }

</script>
