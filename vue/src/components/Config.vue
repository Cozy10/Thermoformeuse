<template>
  <v-data-table
    v-model="selected"
    item-key="name"
    :headers="headers"
    :items="config"
    :search="search"
    :single-select="false"
    show-select
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Configurations</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Rechercher"
          single-line
          hide-details
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="green" dark @click="deleteItems()"><v-icon>mdi-delete</v-icon></v-btn>
            <v-btn color="green" dark v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="30">
                    <v-text-field v-model="editedItem.name" label="Nom"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.t1" label="T1"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.t2" label="T2"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.t3" label="T3"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.t4" label="T4"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.t5" label="T5"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.t6" label="T6"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green" text @click="close">Annuler</v-btn>
              <v-btn color="green" text @click="save">Sauvegarder</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        large
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <!-- <v-icon
        large
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon> -->
      <v-icon
        large
        @click="uploadItem(item)"
      >
        mdi-upload
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
<!--
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
  </v-container> -->
</template>

<script>
  // export default {
  //   data: () => ({
  //       selected: [],
  //       search: '',
  //       headers: [
  //           {
  //             text: 'Nom',
  //             value: 'name',
  //           },
  //           { text: 'T1', value: 't1' },
  //           { text: 'T2', value: 't2'},
  //           { text: 'T3', value: 't3'},
  //           { text: 'T4', value: 't4' },
  //           { text: 'T5', value: 't5'},
  //           { text: 'T6', value: 't6'},
  //         ],
  //         config: [
  //           {
  //             name: 'Pyrénés',
  //             t1: 200,
  //             t2: 210,
  //             t3: 200,
  //             t4: 220,
  //             t5: 230,
  //             t6: 190
  //           },
  //           {
  //             name: 'Alpes',
  //             t1: 200,
  //             t2: 230,
  //             t3: 180,
  //             t4: 220,
  //             t5: 210,
  //             t6: 190
  //           },
  //           {
  //             name: 'France',
  //             t1: 150,
  //             t2: 230,
  //             t3: 190,
  //             t4: 215,
  //             t5: 185,
  //             t6: 200
  //           },
  //           {
  //             name: 'Chili',
  //             t1: 250,
  //             t2: 190,
  //             t3: 230,
  //             t4: 180,
  //             t5: 230,
  //             t6: 210
  //           },
  //         ],
  //     }),
  //     methods: {
  //       changeData() {
  //         this.config
  //         .push({
  //           name: 'trolol',
  //           t1: 200,
  //           t2: 210,
  //           t3: 200,
  //           t4: 220,
  //           t5: 230,
  //           t6: 190
  //         });
  //       },
  //       deleteItem(item) {
  //         console.log(item);
  //         console.log("deleted");
  //       }
  //     },
  //     mounted() {
  //       setTimeout(this.changeData, 2000);
  //     },
  // }
  export default {
    data: () => ({
      dialog: false,
      selected: [],
      search:'',
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
        { text: 'Actions', value: 'action', sortable: false },
      ],
      config: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        t1:0,
        t2:0,
        t3:0,
        t4:0,
        t5:0,
        t6:0,
      },
      defaultItem: {
        name: 'Config',
        t1:0,
        t2:0,
        t3:0,
        t4:0,
        t5:0,
        t6:0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouvelle Configuration' : 'Éditer Configuration'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      deleteItems(){
        this.deleteItem(this.selected[0]);
      },
      initialize () {
        this.config = [
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
        ]
      },

      editItem (item) {
        this.editedIndex = this.config.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.config.indexOf(item)
        confirm('Êtes-vous sûre de vouloir supprimer cet configuration') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.config[this.editedIndex], this.editedItem)
        } else {
          this.config.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
