<template>

    <section class="a-header" :style="headerStyle">

        <div class="row expanded">
            <div class="shrink columns">

                <!-- navigation -->
                <a class="" data-toggle="offCanvasLeft1" @click="test" v-if="isMobile && !revealForMedium"><span class="cursor-pointer icon-flower" style="color: white;"></span></a>

                <!-- back -->
                <a style="color: white;" v-if="isMobile && revealForMedium"><span class="cursor-pointer icon-chevron-left"></span></a>
            </div>

            <div class="a-header-logo columns a-sidenav-logo" style="text-align: center;">
                <a class="menu" >GPS</a>
            </div>
        </div>

   </section>
</template>

<script type="text/babel">
    export default {
        name: "BrowseHeader",

        methods: {
            test: function () {
                console.log('here')
            }
        },

        mounted: function () {
            window.onresize = function(event) {
                this.isMobile = window.innerWidth <= 640;
            }.bind(this);
        },

        data () {
            return {
                headerStyle: {
                    'z-index': 5
                },
                // Foundation default: medium: 640px
                isMobile: window.innerWidth <= 640
            }
        },

        props: {
            revealForMedium: {
                default: true
            }
        }
    }
</script>
