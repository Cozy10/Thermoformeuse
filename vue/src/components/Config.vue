<template>
  <v-data-table
    v-model="selected"
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
      <v-icon
        large
        @click="chargerConfig(item)"
      >
        mdi-upload
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
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

      },
      defaultItem: {

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
        confirm('Êtes-vous sûre de vouloir supprimer cet configuration') && this.selected.forEach((item) => {
          this.deleteItem(item)
        });
      },
      initialize () {
        let data_to_send = ["get_specifications_thermo"];
        let headers = {'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
              'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        fetch("http://localhost:3000",{
          method: 'post',
        headers,
        body: JSON.stringify(data_to_send)
        })
        .then(res=> res.json())
        .then(d => {
          console.log(d);
          // Création de la barre de titre
          this.headers = [{text: 'Nom', value: 'name'}];
          this.headers = this.headers.concat(d[1].nom_zone_chauffe);
          for(let i=0; i<d[1].nb_zones; i++){
            this.headers.push({text: d[1].nom_zone_chauffe[i], value: 't'+i});
          }
          this.headers.push({ text: 'Actions', value: 'action', sortable: false });

          //Insertion des données
          data_to_send = ["get_all_configurations"];
          fetch("http://localhost:3000", {
            method: 'post',
            headers,
            body: JSON.stringify(data_to_send)

          })
          .then(res=> res.json())
          .then(data => {
            console.log(data[1]);
            let i;
            for(i=0; i<data[1].length; i++){
              let d = {name: data[1][i].nom};
              for(let i2=0; i2<data[1][i].parametre.temperature_zone.length; i2++){
                let txt = 't'+(i2+1);
                d[txt] = data[1][i].parametre.temperature_zone[i2];
              }
              d.id = data[1][i]._id;
              this.config.push(d)
            }
          });
        });
      },

      editItem (item) {
        this.editedIndex = this.config.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        let data_to_send = ["supprimer_configuration", this.editedItem];
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
        .then(() => {
          const index = this.config.indexOf(item)
          this.config.splice(index, 1)
        });
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
          console.log(this.editedItem);
          let data_to_send = ["modifier_configuration", this.editedItem];
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
          .then(() => {
            console.log(this.editedItem);
            Object.assign(this.config[this.editedIndex], this.editedItem)
          });
        } else {
          let data_to_send = ["save_configuration", this.editedItem];
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
          .then(() => {
            console.log(this.editedItem);
            this.config.push(this.editedItem)
          });
        }
        this.close()
      },
      chargerConfig(item){
        let d = {};
        d._id = item.id;
        console.log(d);
        let data_to_send = ["set_configuration_courante",d];
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
        .then(() => {
          console.log(item.id);
        });
      }
    },
  }
</script>
