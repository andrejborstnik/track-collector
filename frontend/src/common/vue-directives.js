//
// VUE CUSTOM DIRECTIVES
//


//
// LIBRARIES
//


// vue.js web framework library.
import Vue from 'vue';

// Foundation.
// import 'foundation-sites';

// Utilities.
import _ from 'lodash';

// Require `PhoneNumberFormat`.
let PNF = require('google-libphonenumber').PhoneNumberFormat;

// Get an instance of `PhoneNumberUtil`.
let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

let target_number_format = PNF.INTERNATIONAL;
let number_format = 'si';

//
// DIRECTIVES
//


//  Phone number formatter
Vue.directive('pnf', {
    update: function(el, binding) {
        console.log('here', binding.value)
        if (binding.value) {
            let phoneNumber = phoneUtil.parse(binding.value, number_format);
            let paresdNumber = phoneUtil.format(phoneNumber, target_number_format);

        }
    },
    bind: function (el, binding) {
        if (binding.value) {
            Vue.nextTick(function () {
                let phoneNumber = phoneUtil.parse(binding.value, number_format);
                let paresdNumber = phoneUtil.format(phoneNumber, target_number_format);
            });
        }
    }
});


// Load foundation JS for specific element.
// Vue.directive('load-foundation', {
//     inserted: function (el) {
//         $(el).foundation();
//     }
// });


// Focuser
//
// Example:
//    v-focus="predicate"
// Where:
//    predicate - when we focus to this element
Vue.directive('focus', {
    update: function(el, binding) {
        if (binding.value) {
            el.focus();
        }
    },
    bind: function (el, binding) {
        if (binding.value) {
            Vue.nextTick(function () {
                el.focus();
            });
        }
    }
});
