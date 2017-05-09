<template>

    <div style="width: 80%;">
        Uporabnik:
        <input type="text" v-model="user_name" @keyup.prevent.enter="update_user" />
        Novo geslo:
        <input type="password" v-model="password" @keyup.prevent.enter="update_user" />
        Potrditev gesla:
        <input type="password" v-model="confirm_password" @keyup.prevent.enter="update_user" />
        <a class="button" @click="update_user">Confirm</a>
    </div>

</template>

<style lang="scss">

</style>


<script type="text/babel">

    const update_user = function () {
        console.info("Pritisnjen gumb AAA.");
        
        if (this.password != this.confirm_password){
            console.info("Napačna potrditev gesla.");
            return;
        }
        console.info("Uspesna potrditev gesla.");
        
        var user_update_data = {"user_name" : this.user_name,
                                "user_password" : this.password};
                                      
        var user_JSON = JSON.stringify(user_update_data);
        console.info(user_JSON);
        console.log(this.user_name,this.password,this.confirm_password)
    };

    export default {
        name: 'Change password',

        data: () => {
            return {
                geslo: '',
                uname: ''
            }
        },

        methods: {
            update_user
        }

    }

</script>
