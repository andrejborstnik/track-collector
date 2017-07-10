//
// LIBRARIES
//


// Global app configuration.
import * as config from 'config';

// vue.js web framework library.
import Vue from 'vue';

// i18n library.
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

//
// i18n
//

// Import all widget locales.
import { messages } from 'i18n-locales';

let locale = config.language;
let fallbackLocale = config.fallback_language;

// Vue router.
const i18n = new VueI18n({
    locale,
    fallbackLocale,
    messages

});

export default i18n;