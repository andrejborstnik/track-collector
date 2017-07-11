<template>
    <section>
        The token you tried to use is expired. Please request a new link.
        <v-btn flat dark disabled>Disabled</v-btn>
    </section>
</template>

<script type="text/babel">

    //
    // LIBRARIES
    //

    // Cookies support.
    import * as cookies from 'common/cookies';

    // Common types.
    import * as config from 'config';

    // Import mixins.
    import {activate_mixin} from 'common/activate-mixin';

    const request = require('request-promise-native');


    //
    // FUNCTIONS
    //


    const activate = function () {
        this.token = this.$route.params.token;

        request({
            method: "POST",
            uri: `${config.paths_api_prefix}/authentication/oneTimeToken`,
            json: {
                oneTimeToken: this.token
            }
        }).then((body) => {
            console.log(body)
            if (body.status == "OK") {
                this.$store.user.token = body.token;

                // todo user data
                cookies.set_session_cookie(body.userId, body.token, false, true); // todo admin and cookies

                this.$router.push(`${config.url_prefix}/track`);
            }
            else {
                cookies.remove_session_cookie();
            }
        }).catch((err) => {
            // todo
        });
    };


    //
    // EXPORT
    //


    export default {
        name: "Follow",

        mixins: [activate_mixin],

        methods: {
            activate
        },

        data () {
            return {
                token: null
            }
        }

    }
</script>
