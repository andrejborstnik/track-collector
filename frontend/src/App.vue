<template>
  <v-app id="example-2">
     <v-navigation-drawer temporary hide-overlay v-model="drawer" v-bind:close-on-click="false" light>
       <v-list class="pa-0">
         <v-list-item>
           <v-list-tile avatar tag="div">
             <v-list-tile-avatar>
               <img src="https://randomuser.me/api/portraits/men/85.jpg" />
             </v-list-tile-avatar>
             <v-list-tile-content>
               <v-list-tile-title>John Leider</v-list-tile-title>
             </v-list-tile-content>
             <v-list-tile-action>
               <v-btn icon dark @click.native.stop="drawer = !drawer">
                 <v-icon>chevron_left</v-icon>
               </v-btn>
             </v-list-tile-action>
           </v-list-tile>
         </v-list-item>
       </v-list>
       <v-list class="pt-0" dense>
         <v-divider></v-divider>
         <v-list-item v-for="item in items" :key="item">
           <v-list-tile>
             <v-list-tile-action>
               <v-icon>{{ item.icon }}</v-icon>
             </v-list-tile-action>
             <v-list-tile-content>
               <v-list-tile-title>{{ item.title }}</v-list-tile-title>
             </v-list-tile-content>
           </v-list-tile>
         </v-list-item>
       </v-list>
     </v-navigation-drawer>
     <v-toolbar fixed class="deep-orange" light>
       <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
       <v-toolbar-title>Toolbar</v-toolbar-title>
     </v-toolbar>
     <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>


<style lang="scss">

</style>


<script type="text/babel">

    //
    // EXPORT
    //


    export default {
        name: 'App',
        data () {
              return {
                drawer: null,
                items: [
                  { title: 'Home', icon: 'dashboard' },
                  { title: 'About', icon: 'question_answer' }
                ],
                mini: true,
                right: null
              }
            }
    }

</script>
