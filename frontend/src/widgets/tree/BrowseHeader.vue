<template>

    <section class="a-header" :style="headerStyle">

        <div class="row expanded">
            <div class="shrink columns">
                <a class="" data-toggle="offCanvasLeft1" v-if="isMobile"><span style="color: white;">+</span></a>
            </div>

            <div style="text-align: center; color: orange">
                <span>GPS</span>
            </div>
        </div>

   </section>
</template>

<script type="text/babel">
    export default {
        name: "BrowseHeader",

        mounted: function () {
            window.onresize = function(event) {
                this.isMobile = window.innerWidth <= 640;
            }.bind(this);
        },

        watch: {
            headerStyle: function () {
                if (this.headerStyle && !this.headerStyle['z-index'])
                    this.headerStyle['z-index'] = 5;
            }
        },

        data () {
            return {
                // Foundation default: medium: 640px
                isMobile: window.innerWidth <= 640
            }
        },

        props: {
            revealForMedium: {
                default: true
            },
            headerStyle: {
                default: () => {return {'z-index': 5}}
            }
        }
    }
</script>
