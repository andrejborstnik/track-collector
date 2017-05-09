<template>

    <div style="width: 80%;">
        Uporabniško ime:
        <input type="text" v-model="user_name" @keyup.prevent.enter="register_user" />
        Elektronska pošta:
        <input type="text" v-model="user_mail" @keyup.prevent.enter="register_user" />
        Geslo:
        <input type="password" v-model="password" @keyup.prevent.enter="register_user" />
        Potrditev gesla:
        <input type="password" v-model="confirm_password" @keyup.prevent.enter="register_user" />
        <a class="button" @click="register_user">Sing up</a>
    </div>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    const register_user = function () {
        console.info("Pritisnjen gumb AAA.");
        
        if (this.password != this.confirm_password){
            console.info("Napačna potrditev gesla.");
            return;
        }
        console.info("Uspesna potrditev gesla.");
        
        var user_registration_data = {"user_name" : this.user_name,
                                      "user_mail" : this.user_mail,
                                      "user_password" : this.password};
                                      
        var user_JSON = JSON.stringify(user_registration_data);
        console.info(user_JSON);
        console.log(this.user_name,this.user_mail,this.password,this.confirm_password)
    };

    export default {
        name: 'Registaration',

        data: () => {
            return {
                geslo: '',
                uname: ''
            }
        },

        methods: {
            register_user
        }

    }

</script>
