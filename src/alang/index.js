import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

import lang from './lang.js';

let en = {};
let zh = {};
let ko = {};
for (let key in lang) {
  en[key] = lang[key]['en'];
  zh[key] = lang[key]['zh'];
  ko[key] = lang[key]['ko'];
}

let language = localStorage.getItem('language');
let langIndex = 0;
if (language) {
  if (language == 'en') {

  } else if (language == 'ko') {
    langIndex = 2;
  } else {
    langIndex = 1;
    language = 'zh';
  }
} else {
  language = navigator.language;
  if (language == null || language == '' || language.length == 0) {
    language = navigator.userLanguage;
  }
  if (language == null || language == '' || language.length == 0) {
    language = navigator.browserLanguage;
  }
  if (language == null || language == '' || language.length == 0) {
    language = navigator.systemLanguage;
  }
  if (!language) {
    language = 'en';
  }
  language = language.toLowerCase();
  if (language.indexOf('zh') >= 0 || language.indexOf('cn') >= 0) {
    language = 'zh';
    langIndex = 1;
  } else if (language.indexOf('ko') >= 0 || language.indexOf('kr') >= 0) {
    language = 'ko';
    langIndex = 2;
  } else {
    language = 'en';
    langIndex = 0;
  }
}

localStorage.setItem('language', language);

const i18n = new VueI18n({
  locale: language,
  messages: {
    'zh': zh,
    'en': en,
    'ko': ko
  }
});
i18n['langIndex'] = langIndex;
export default i18n;
