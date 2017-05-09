<template>

    <div class="paint-me">
        <p>I am a test 2 and I contain a test. Test.</p>

        <Test></Test>
    </div>

</template>


<style lang="scss">
    .paint-me {
        color: red
    }
</style>


<script type="text/babel">

    import Test from 'Test.vue';

    //
    // EXPORT
    //


    export default {
        name: 'Test2',

        components: {
            Test
        }
    }

</script>
