<template>
  <v-container text-center>
    <v-card>
      <template>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="15"
          class="elevation-3"
        ></v-data-table>
      </template>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'Logs',

    data: () => ({
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
        desserts: [
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
