<template>
  <v-app>
    <v-app-bar app color="green" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <img alt="Graphe temp" src="./assets/logo.png" height=80%/>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content>
        <Main v-if="activePage === 'Main'"/>
        <Logs v-else-if="activePage === 'Logs'"/>
        <Config v-else-if="activePage === 'Config'"/>
        <ChangePwd v-else />

    </v-content>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group active-class="green--text text--accent-4">
          <v-list-item v-on:click="activePage = 'Main'" v-model="active[0]">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Accueil</v-list-item-title>
          </v-list-item>

          <v-list-item v-on:click="changePage('Config')" v-model="active[1]">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Configuration</v-list-item-title>
          </v-list-item>

          <v-list-item @click="changePage('Logs')" v-model="active[2]">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logs</v-list-item-title>
          </v-list-item>
          <v-list-item @click="changePage('')" v-model="active[3]">
            <v-list-item-icon>
              <v-icon>mdi-account-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Changer le mot de passe</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-dialog
      v-model="dialog"
    >
      <v-card>
        <v-card-title class="headline">Saisissez le mot de passe administrateur</v-card-title>
        <v-form @submit="checkPwd" onSubmit="return false;">
          <v-layout text-center wrap>
            <v-flex offset-md-3 xs6>
              <v-text-field
                :error=pwdError
                autocomplete="current-password"
                :value="pwd"
                label="Saisissez le mot de passe"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (show = !show)"
                :type="show ? 'password' : 'text'"
                @input="_=>pwd=_"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="checkPwd()"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>
<script>
  import Main from './components/Main';
  import Logs from './components/Logs';
  import Config from './components/Config';
  import ChangePwd from './components/changePwd.vue';
  export default {
    name: 'App',

    components: {
      Main,
      Logs,
      Config,
      ChangePwd
    },

    data: () => ({
      dialog: false,
      show: true,
      active: [false, false, false, false],
      drawer: false,
      activePage: 'Main',
      askPage: '',
      pwd: '',
      pwdServ: 'bonjourn',
      pwdError: false,
    }),
    watch: {
      activePage: function() {
        this.drawer = false;
      },
      drawer: function(){
        this.active[0] = false;
        this.active[1] = false;
        this.active[2] = false;
        this.active[3] = false;
      },
      pwd: function(){
        this.pwdError = false;
      }
    },
    methods: {
      changePage(name) {
        this.askPage = name;
        this.dialog = true;
      },
      checkPwd(){
        console.log("checkPwd");
        if(this.pwd === this.pwdServ){
          this.dialog = false;
          this.activePage = this.askPage;
          this.pwd = '';
        }
        else{
          this.pwdError = true;
        }
      }

    }
  };
</script>
