<template>
  <v-container text-center>
    <v-row>
      <v-col cols="3">
      </v-col>
      <v-col cols="6">
        <v-card outlined>
          <h1>{{configuration}}</h1>
        </v-card>
      </v-col>
      <v-col cols="3">
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
      </v-col>
      <v-col cols="6">
        <Graphe :ip="ipAd"/>
      </v-col>
      <v-col cols="2">
      </v-col>
      <v-col cols="3">
        <v-btn dark x-large fab right color="green" @click="start()" style="margin-top:200px">
          <v-img v-if="statut==='Prêt'"
            :src="require('../assets/start.jpg')"
            contain
            :width="largeur_btn"
          />
          <v-img v-else
            :src="require('../assets/start_inactive.jpg')"
            contain
            :width="largeur_btn"
          />
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
      </v-col>
      <v-col cols="6">
        <v-card v-if="statut === 'Prêt'" outlined color=green>
          <h1>{{statut}}</h1>
        </v-card>
        <v-card v-else-if="statut === 'Configuration non chargée'" outlined color=red>
          <h1>{{statut}}</h1>
        </v-card>
        <v-card v-else outlined color=orange>
          <h1>{{statut}}</h1>
        </v-card>
      </v-col>
      <v-col cols="3">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Graphe from './Graphe.vue'
  export default {
    name: 'Main',
    props: ['ip'],
    components: {
      Graphe,
    },
    data: function() {
      return {
        ipAd: this.ip,
        timer: undefined,
        statut: "Configuration non chargée",
        configuration: "Aucune",
        largeur_btn: undefined
      };
    },
    mounted() {
      console.log("ipAd" + this.ipAd);
      console.log(document.URL);
      this.largeur_btn = Math.floor(window.innerWidth*.2);
      this.timer = setInterval(this.get_statut, 1000);
      this.get_configuration();
    },
    destroyed: function(){
      clearInterval(this.timer);
    },
    methods:{
      start(){
        if(this.statut === 'Prêt'){
          let data_to_send = ["start"];
          let headers = {'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
          fetch(this.ip, {
            method: 'post',
            headers,
            body: JSON.stringify(data_to_send)

          })
          .then(res=> res.json())
          .then(data => {
            console.log(JSON.stringify(data));

          });
        }
      },
      get_statut(){
        let data_to_send = ["get_statut"];
        let headers = {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
              'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        fetch(this.ipAd, {
          method: 'post',
          headers,
          body: JSON.stringify(data_to_send)
        })
        .then(res=> res.json())
        .then(data => {
          if(data[1].statut == 1)
            this.statut = "En cours";
          else if (data[1].statut == 2) {
            this.statut = "Configuration non chargée";
          }
          else if (data[1].statut == 3){
            this.statut = "En chauffe"
          }
          else{
            this.statut = "Prêt";
          }
          // console.log(this.statut);
        });
      },
      get_configuration(){
        let data_to_send = ["get_configuration_courante"];
        let headers = {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
              'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        fetch(this.ipAd, {
          method: 'post',
          headers,
          body: JSON.stringify(data_to_send)
        })
        .then(res=> res.json())
        .then(data => {
          if(data[1] === null){
            this.configuration = "Aucune (Veuillez sélectionner une configuration)";
          }
          else{
            this.configuration = data[1].nom;
          }
        });
      }
    }
  }
</script>
