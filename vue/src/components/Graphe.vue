<template>
  <v-container>

    <svg id="histogramme_temp">
    </svg>
  </v-container>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'vue-line-chart',
  props: ['ip'],
  data: function(){
    return {
      ipAd: this.ip,
      data: undefined,
      timer: undefined,
      nb_zones: undefined,
      temp_seuils: undefined,
      margeX: 30,
      margeY: 20,
      Largeur_graphe: 800,
      Hauteur_graphe: 500,
      Espacement_barres: 10,
      Largeur_barres: undefined,
      tab_zones: undefined,
    }
  },
  mounted() {
    console.log(window.innerWidth*.7);
    this.Hauteur_graphe = Math.floor(window.innerHeight*.6);
    this.Largeur_graphe = Math.floor(window.innerWidth*.45)+this.margeX;
    this.get_config();
    if(this.tab_zones === undefined){
      this.timer = setInterval(this.get_config, 1000);
    }
  },
  destroyed: function(){
    clearInterval(this.timer);
  },
  watch:{
    data: function(){
      // this.createGraph();
      this.update();
    },
    tab_zones: function(){
      clearInterval(this.timer);
      this.get_temp_seuil();
    },
    temp_seuils: function(){
      console.log("a");
      this.Largeur_barres = this.Largeur_graphe/this.nb_zones;
      this.changeData();
      this.timer = setInterval(this.changeData, 1000);
    }
  },
  methods: {
    get_temp_seuil(){
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
          this.temp_seuils = new Array(this.nb_zones);
          for(let i=0; i<this.nb_zones; i++){
            this.temp_seuils[i] = 100;
          }
        }
        else{
          console.log(data[1]);
          this.temp_seuils = new Array(this.nb_zones);
          for (let i=0; i<this.nb_zones; i++){
            this.temp_seuils[i] = data[1][this.tab_zones[i]];
          }
        }
      });
    },
    grille_selon_Y(AxeY) {
      return d3.axisLeft(AxeY).ticks(10)
    },
    get_config(){
      let data_to_send = ["get_specifications_thermo"];
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
        this.nb_zones = data[1].nb_zones;
        this.tab_zones = data[1].nom_zone_chauffe;
      });
    },
    changeData(){

      let data_to_send = ["get_temperature"];
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
        this.data = data[1].zone_chauffe;
      });
    },
    dessiner_histogramme(){
      var nb_zones = this.data.length;
      var margeX = this.margeX;
      var margeY = this.margeY;
      var Largeur_graphe = this.Largeur_graphe;
      var Hauteur_graphe = this.Hauteur_graphe;
      var Espacement_barres = this.Espacement_barres;
      var Largeur_barres = (Largeur_graphe / nb_zones);

      var tab_zones = this.tab_zones;

      var AxeY = d3.scaleLinear()
          .domain([d3.max(this.data)+150,0])
          .range([0,Hauteur_graphe])

      var AxeX = d3.scaleBand()
          .domain(tab_zones)
          .range([0,Largeur_graphe])

      var svg = d3.select('#histogramme_temp')
          .attr("width", Largeur_graphe+margeX)
          .attr("height", Hauteur_graphe);

      var temp_ok = this.temp_bleues();
      var temp_pas_ok = this.temp_rouges();
      for(var i = 0; i < nb_zones; i++){
        temp_pas_ok[i] = Hauteur_graphe - AxeY(temp_pas_ok[i]);
        temp_ok[i] = Hauteur_graphe - AxeY(temp_ok[i]);
      }

      svg.append("g")
          .attr("class", "grille")
          .attr("transform", "translate("+margeX+","+ -margeY +")")
          .call(this.grille_selon_Y(AxeY)
              .tickSize(-Largeur_graphe)
              .tickFormat("")
          );

      svg.selectAll(".grille line").style("stroke", "lightgray");


      svg
      .append("g")
      .attr("transform", "translate("+margeX+","+ -margeY +")")
      .call(d3.axisLeft(AxeY));

      svg
      .append("g")
      .attr("transform", "translate("+ margeX +","+(Hauteur_graphe-margeY)+")")
      .call(d3.axisBottom(AxeX));


      svg.selectAll("graphe_rouge")
                  .data(temp_pas_ok)
                  .enter()
                  .append("rect")
                  .attr("fill", "red")
                  .attr("y", function(d) {
                      return Hauteur_graphe - d;
                  })
                  .attr("x", function() {
                      return Espacement_barres;
                  })
                  .attr("height", function(d) {
                      return d;
                  })
                  .attr("width", Largeur_barres - Espacement_barres)
                  .attr("transform", function (d, i) {
                      var translate = [(Largeur_barres * i) + margeX, -margeY];
                      return "translate("+ translate +")";
                  });

      svg.selectAll("graphe_bleu")
                  .data(temp_ok)
                  .enter()
                  .append("rect")
                  .attr("fill", "steelblue")
                  .attr("y", function(d) {
                      return Hauteur_graphe - d;
                  })
                  .attr("x", function() {
                      return Espacement_barres;
                  })
                  .attr("height", function(d) {
                      return d;
                  })
                  .attr("width", Largeur_barres - Espacement_barres)
                  .attr("transform", function (d, i) {
                      var translate = [(Largeur_barres * i) + margeX, -margeY];
                      return "translate("+ translate +")";
                  });

    },
    temp_bleues(){
    var tab = [];
    for(var i = 0; i < this.nb_zones; i++){
        if(this.data[i] <= this.temp_seuils[i]){
            tab.push(this.data[i]);
        }
        else{
            tab.push(this.temp_seuils[i]);
        }
    }
    return tab;
    },
    temp_rouges(){
      var tab = [];
      for(var i = 0; i < this.nb_zones; i++){
          if(this.data[i] > this.temp_seuils[i]){
              tab.push(this.data[i]);
          }
          else{
              tab.push(0);
          }
      }
      return tab;
    },
    update(){
      var svg = d3.select("svg");
      svg.selectAll("*").remove();
      this.dessiner_histogramme();
    }
  },
};
</script>

<style scoped>
  svg{
    margin: 25px;
  }
  path{
    fill: none;
    stroke: #76BF8A;
    stroke-width: 3px;
  }
</style>
