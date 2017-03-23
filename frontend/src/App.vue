<template>

    <div>
        <!--<transition name="fade" mode="out-in">-->
            <!--<keep-alive>-->
                <!--<router-view class="animated"></router-view>-->
            <!--</keep-alive>-->
        <!--</transition>-->
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>

</template>


<style lang="scss">
    
</style>


<script type="text/babel">

    //
    // EXPORT
    //


    export default {
        name: 'App'
    }

</script>
