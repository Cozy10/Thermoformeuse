<template>
  <v-container text-center>
    <template>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="logs"
          :items-per-page="15"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          :item-key="name"
          show-expand
          :search="search"
          class="elevation-3"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Logs</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Rechercher"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:expanded-item="{ headers}">
            <td :colspan="headers.length">Temperatures</td>
          </template>
        </v-data-table>
      </v-card>
    </template>
  </v-container>
</template>

<script>
  export default {
    name: 'Logs',

    data: () => ({
      expanded: [],
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
          { text: '', value: 'data-table-expand' },
        ],
        logs: [],
      }),
      mounted() {
        this.initialize();
      },
      methods: {
        initialize() {
          let data_to_send = ["get_all_log"];
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
            console.log(data[1])
            this.logs = data[1];
          });
        }
      }
  }
</script>
