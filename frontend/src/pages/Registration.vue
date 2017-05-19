<template>

    <div style="width: 80%;">
        Email:
        <input type="text" v-model="user_mail" @keyup.prevent.enter="register_user" />
        Password:
        <input type="password" v-model="password" @keyup.prevent.enter="register_user" />
        Confirm password:
        <input type="password" v-model="confirm_password" @keyup.prevent.enter="register_user" />
        <a class="button" @click="register_user">Sign up</a>
    </div>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    const register_user = function () {
        
        if (this.password != this.confirm_password){
            console.info("Napačna potrditev gesla.");
            return;
        }
        console.info("Uspesna potrditev gesla.");
        
        const user_registration_data = {
            "user_mail" : this.user_mail,
            "user_password" : this.password
        };
                                      
        const user_JSON = JSON.stringify(user_registration_data);
        console.info(user_JSON);
        console.log(this.user_mail,this.password,this.confirm_password);

        let request = new XMLHttpRequest();
        request.onload = function () {
           let status = request.status;
           let data = request.responseText;
           console.log(status);
           console.log(data);
        };

        request.open("POST", "http://localhost:3102/register", true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(user_JSON);
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
