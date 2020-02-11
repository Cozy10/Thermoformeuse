<template>
  <v-container text-center>
    <template>
      <v-card>
        <v-card-title>
          Logs
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Rechercher"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="logs"
          :items-per-page="15"
          :search="search"
          class="elevation-3"
        ></v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
  export default {
    name: 'Logs',

    data: () => ({
      search: '',
      headers: [
          {
            text: 'Série',
            sortable: false,
            value: 'serie',
          },
          { text: 'Date', value: 'date' },
          { text: 'Action', value: 'action', sortable: false },
          { text: 'Préréglage', value: 'preset', sortable: false},
        ],
        logs: [
          {
            serie: '0012',
            date: '2020-02-09T20:10:15Z',
            action: 'Démarrer',
            preset: 'Pyrénés'
          },
          {
            serie: '0011',
            date: '2020-01-09T20:10:15Z',
            action: 'Démarrer',
            preset: 'Pyrénés'
          },
          {
            serie: '0012',
            date: '2020-02-09T20:10:15Z',
            action: 'Démarrer',
            preset: 'Pyrénés'
          },
          {
            serie: '0012',
            date: '2020-02-09T20:10:15Z',
            action: 'Démarrer',
            preset: 'Pyrénés'
          }
        ],
      }),
  }
</script>
