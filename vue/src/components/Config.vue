<template>
  <v-container text-center>
    <v-card>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="config"
        :search="search"
        :single-select="false"
        item-key="_id"
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
                        <v-text-field v-model="editedItem.nom" label="Nom"></v-text-field>
                      </v-col>
                      <v-col v-for="nom in nom_zone_chauffe" v-bind:key=nom col="12" sm="6" md="4">
                        <v-text-field v-model="editedItem[nom]" :label="nom"></v-text-field>
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
    </v-card>
  </v-container>
</template>

<script>
  export default {
    props: ['ip'],
    data: function(){
      return {
        ipAd: this.ip,
        dialog: false,
        selected: [],
        search:'',
        headers: [],
        config: [],
        editedIndex: -1,
        editedItem: {

        },
        nom_zone_chauffe: undefined,
        defaultItem: {

        },
      }
    },

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
        fetch(this.ipAd,{
          method: 'post',
          headers,
          body: JSON.stringify(data_to_send)
        })
        .then(res=> res.json())
        .then(d => {
          // Création de la barre de titre
          this.nom_zone_chauffe = d[1].nom_zone_chauffe;
          this.headers = [{text: 'Nom', value: 'nom'}];
          this.headers = this.headers.concat(d[1].nom_zone_chauffe);
          for(let i=0; i<d[1].nb_zones; i++){
            this.headers.push({text: d[1].nom_zone_chauffe[i], value: d[1].nom_zone_chauffe[i]});
          }
          this.headers.push({ text: 'Actions', value: 'action', sortable: false });

          //Insertion des donnéee
          data_to_send = ["get_all_configurations"];
          fetch(this.ipAd, {
            method: 'post',
            headers,
            body: JSON.stringify(data_to_send)

          })
          .then(res=> res.json())
          .then(data => {
            let i;
            for(i=0; i<data[1].length; i++){
              this.config.push(data[1][i]);
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
        console.log(item);
        let data_to_send = ["supprimer_configuration", item];
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
          fetch(this.ipAd, {
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
          console.log("save");
          console.log(this.editedItem);
          let data_to_send = ["save_configuration", this.editedItem];
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
          .then(d => {
            console.log(d);
            this.config.push(d[1]);
          });
        }
        this.close()
      },
      chargerConfig(item){
        let d = {item};
        console.log(d);
        let data_to_send = ["set_configuration_courante",d];
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
        .then(() => {
          console.log(item._id);
        });
      }
    },
  }
</script>
