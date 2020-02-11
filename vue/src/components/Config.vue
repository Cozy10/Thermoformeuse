<template>
  <v-container text-right>
    <template>
    <v-card>
      <v-card-title>
        Préréglages
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Rechercher"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-data-table
        v-model="selected"
        item-key="name"
        :headers="headers"
        :items="config"
        :search="search"
        :single-select="false"
        show-select
      >
      </v-data-table>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
    </v-card>
  </template>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
        selected: [],
        search: '',
        headers: [
            {
              text: 'Nom',
              value: 'name',
            },
            { text: 'T1', value: 't1' },
            { text: 'T2', value: 't2'},
            { text: 'T3', value: 't3'},
            { text: 'T4', value: 't4' },
            { text: 'T5', value: 't5'},
            { text: 'T6', value: 't6'},
          ],
          config: [
            {
              name: 'Pyrénés',
              t1: 200,
              t2: 210,
              t3: 200,
              t4: 220,
              t5: 230,
              t6: 190
            },
            {
              name: 'Alpes',
              t1: 200,
              t2: 230,
              t3: 180,
              t4: 220,
              t5: 210,
              t6: 190
            },
            {
              name: 'France',
              t1: 150,
              t2: 230,
              t3: 190,
              t4: 215,
              t5: 185,
              t6: 200
            },
            {
              name: 'Chili',
              t1: 250,
              t2: 190,
              t3: 230,
              t4: 180,
              t5: 230,
              t6: 210
            },
          ],
      }),
      methods: {
        changeData() {
          this.config
          .push({
            name: 'trolol',
            t1: 200,
            t2: 210,
            t3: 200,
            t4: 220,
            t5: 230,
            t6: 190
          });
        }
      },
      mounted() {
        setTimeout(this.changeData, 2000);
      },
  }
</script>
