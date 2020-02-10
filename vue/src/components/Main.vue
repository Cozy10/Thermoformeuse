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
        <v-btn dark x-large fab right color="green">
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
      //
    }
    ),
  }
</script>
