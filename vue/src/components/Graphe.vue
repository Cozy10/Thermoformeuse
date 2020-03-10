<template>
  <svg>
  </svg>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'vue-line-chart',
  data: () => ({
      data: [300, 108, 280, 170, 230, 242],
      timer: undefined,
      nb_zones: undefined,
      temp_seuils: [300, 200, 300, 300, 300, 250],
      margeX: 30,
      margeY: 20,
      Largeur_graphe: undefined,
      Hauteur_graphe: undefined,
      Espacement_barres: 10,
      Largeur_barres: undefined,
      tab_zones: undefined,
      AxeX: undefined,
      AxeY: undefined,
      svg: undefined,
      temp_ok: undefined,
      temp_pas_ok: undefined,
      // line: '',
    }),
  mounted() {
    this.nb_zones = this.data.length;
    this.Largeur_graphe = this.nb_zones*100 + this.margeX;
    this.Hauteur_graphe = d3.max(this.temp_seuils) + 100;
    console.log("a");
    this.Largeur_barres = this.Largeur_graphe/this.nb_zones;
    this.tab_zones = this.creer_tab_zones();
    this.createGraph();
    // this.timer = setInterval(this.changeData, 1000);
  },
  destroyed: function(){
    clearInterval(this.timer);
  },
  watch:{
    data: function(){
      console.log('a');
      // this.createGraph();
    },
  },
  methods: {
    changeData(){
      console.log(this.data);
      // for (let i = 0; i<this.data.length; i++){
      //   this.data[i] = Math.floor((Math.random() * 100) + 100);
      // }
      this.data = [Math.floor((Math.random() * 200) + 100),Math.floor((Math.random() * 200) + 100),Math.floor((Math.random() * 200) + 100),Math.floor((Math.random() * 200) + 100),Math.floor((Math.random() * 200) + 100),Math.floor((Math.random() * 200) + 100)];

    },
    creer_tab_zones(){
      var tab = [];
      for(var i = 1; i <= this.nb_zones; i++){
        tab.push("zone " + i);
      }
      return tab;
    },
    createGraph(){
      var svg = this.svg;
      var Largeur_barres = this.Largeur_barres;
      var Largeur_graphe = this.Largeur_graphe;
      var margeX = this.margeX;
      var Hauteur_graphe = this.Hauteur_graphe;
      var margeY = this.margeY;
      var AxeX = this.AxeX;
      var AxeY = this.AxeY;
      var Espacement_barres = this.Espacement_barres;

      AxeY = d3.scaleLinear()
      .domain([Hauteur_graphe,0])
      .range([0,Hauteur_graphe]);


      AxeX = d3.scaleBand()
          .domain(this.tab_zones)
          .range([0,Largeur_graphe]);
      svg = d3.select('svg')
          .attr("width", Largeur_graphe+margeX)
          .attr("height", Hauteur_graphe);
      this.temp_ok = this.temp_bleues();
      this.temp_pas_ok = this.temp_rouges();
      svg
      .append("g")
      .attr("transform", "translate("+margeX+","+ -margeY +")")
      .call(d3.axisLeft(AxeY));

      svg
      .append("g")
      .attr("transform", "translate("+ margeX +","+(Hauteur_graphe-margeY)+")")
      .call(d3.axisBottom(AxeX));

      svg.selectAll("rect")
          .data(this.temp_pas_ok)
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
      console.log(this.temp_ok);

      svg.selectAll("graphe_rouge")
        .data(this.temp_ok)
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
