<template>

    <div style="width: 80%;">
        Uporabniško ime:
        <input type="text" v-model="uname" @keyup.prevent.enter="login" />
        Geslo:
        <input type="password" v-model="geslo" @keyup.prevent.enter="login" />
        <a class="button" @click="login">Login</a>
    </div>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    const login = function () {
        console.log(this.geslo, this.uname)
    };

    export default {
        name: 'Sign in',

        data: () => {
            return {
                geslo: '',
                uname: ''
            }
        },

        methods: {
            login
        }

    }

</script>
