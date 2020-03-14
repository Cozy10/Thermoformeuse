<template>
  <v-container text-center>
    <v-row>
      <v-col cols="3">
      </v-col>
      <v-col cols="6">
        <v-card outlined>
          <h1>Nom du Preset</h1>
        </v-card>
      </v-col>
      <v-col cols="3">
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
      </v-col>
      <v-col cols="6">
        <Graphe/>
      </v-col>
      <v-col cols="2">
      </v-col>
      <v-col cols="3">
        <v-btn dark x-large fab right color="green" @click="start()">
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
      </v-col>
      <v-col cols="6">
        <v-card outlined>
          <h1>Statut</h1>
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
    name: 'HelloWorld',
    components: {
      Graphe,
    },
    data: () => ({
      timer: undefined,
      statut: "Arrêt",
    }
    ),
    mounted() {
      this.timer = setInterval(this.get_statut, 1000);
    },
    destroyed: function(){
      clearInterval(this.timer);
    },
    methods:{
      start(){
        let data_to_send = {"type": "set"};
        let headers = {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
              'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        fetch("http://localhost:3000/start", {
          method: 'post',
          headers,
          body: JSON.stringify(data_to_send)

        })
        .then(res=> res.json())
        .then(data => {
          console.log(JSON.stringify(data));
          
        });
      },
      get_statut(){
        let data_to_send = ["get_statut"];
        let headers = {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
              'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        fetch("http://localhost:3000", {
          method: 'post',
          headers,
          body: JSON.stringify(data_to_send)

        })
        .then(res=> res.json())
        .then(data => {
          console.log(JSON.stringify(data));
          if(data.statut == 1)
            this.statut = "En cours";
          else 
            this.statut = "Arrêt";
        });
      }
    }
  }
</script>
