import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueI18n from 'vue-i18n';

Vue.use(Vuetify);
Vue.use(VueI18n);

const messages = {
  en: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        pageText: '{0}-{1} of {2}',
      },
    },
  },
  fr: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Élements par page',
        pageText: 'Affiché : {0} à {1} sur {2} au total',
        noResultsText: "Aucune donnée trouvée",
      },
      dataTable: {
        itemsPerPageText: 'Élements par page',
        ariaLabel: {
          sortNone:""
        }
      },
      dataFooter: {
        pageText: 'Affiché : {0} à {1} sur {2} au total',
        itemsPerPageAll: 'Afficher les tous !',
        prevPage: "Page précédente",
        nextPage: "Page suivante",
      },
      noDataText:"Aucune donnée trouvée"
    },
  },
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'fr', // set locale
  messages, // set locale messages
})

export default new Vuetify({
  icons:{
    iconfont: 'mdi',
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
})
