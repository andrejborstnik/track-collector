//
// VUE CUSTOM DIRECTIVES
//


//
// LIBRARIES
//


// vue.js web framework library.
import Vue from 'vue';

// Foundation.
import 'foundation-sites';

// Utilities.
import _ from 'lodash';


//
// DIRECTIVES
//


// Load foundation JS for specific element.
Vue.directive('load-foundation', {
    inserted: function (el) {
        $(el).foundation();
    }
});



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
