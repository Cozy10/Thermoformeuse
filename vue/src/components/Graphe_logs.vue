<template>
  <v-container>
    <svg></svg>
  </v-container>
</template>

<script>
  import * as d3 from 'd3';
  export default {
    name: 'Graphe_logs',
    props: ['itemId'],
    data: function() {
      return {
        id: this.itemId,
        log: undefined,
        couleurs: ["#ff0000","#0000ff","#ffff00","#000000","#800000","#ffa500","#008000","#800080","#ffd700","#ff00ff","#00ffff","#ffc0cb","#00ffff","#f0ffff","#f5f5dc","#a52a2a","#00008b","#008b8b","#a9a9a9","#006400","#bdb76b","#8b008b","#556b2f","#ff8c00","#9932cc","#8b0000","#e9967a","#9400d3","#ff00ff","#4b0082","#f0e68c","#add8e6","#e0ffff","#90ee90","#d3d3d3","#ffb6c1","#ffffe0","#00ff00","#000080","#808000","#800080","#c0c0c0",],
        largeur_graphe: undefined,
        nom_zones: undefined,
      }
    },
    mounted() {
      this.largeur_graphe = Math.floor(window.innerWidth*.6);
      let data_to_send = ["get_detail_log", this.id];
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
        this.log = data[1];
        this.nom_zones = Object.keys(data[1].temperatures[0].values);
        this.tracerGraphe();
      });
    },
    methods: {
      tracerGraphe(){
        let abscisse = this.nuage_abscisse(this.log.temperatures);
        let data = new Array();
        for (const prop in this.log.temperatures[0].values) {
          let temps = new Array(this.log.temperatures.length);
          for(let i=0; i<this.log.temperatures.length; i++){
            temps[i] = this.log.temperatures[i].values[prop];
          }
          data.push(temps)
        }
        this.dessiner_nuage(data, abscisse);
      },
      temp_max(donnees){
        var nb_zones = donnees.length;
        var t_max = d3.max(donnees[0]);
        for(var i = 0; i < nb_zones; i++){
            if(t_max < d3.max(donnees[i])){
                t_max = d3.max(donnees[i]);
            }
        }
        return t_max;
      },
      nuage_abscisse(temps){
        let tab = new Array(temps.length);
        for(let i=0; i<temps.length; i++){
          tab[i] = Math.floor(temps[i].date/1000);
        }
        return tab;
      },
      grille_selon_Y(AxeY) {
        return d3.axisLeft(AxeY).ticks(10)
      },
      dessiner_nuage(data, tab_temps){
        var nb_zones = data.length;
        var nb_mesures = data[0].log;
        // var nb_mesures = data[0].length;
        var margeX = 30;
        var margeY = 20;
        var Hauteur_graphe = this.temp_max(data) + 50;
        var Largeur_graphe = this.largeur_graphe;

        var AxeY = d3.scaleLinear()
                .domain([this.temp_max(data)+100,0])
                .range([0,Hauteur_graphe])

        var AxeX = d3.scalePoint()
                    .domain(tab_temps)
                    .range([0,Largeur_graphe])



        var svg = d3.select("svg")
            .attr("width", Largeur_graphe+100+margeX)
            .attr("height", Hauteur_graphe+100);
        svg.append("g")
            .attr("transform", "translate("+margeX+","+ -margeY +")")
            .call(d3.axisLeft(AxeY));

        svg.append("g")
            .attr("class", "grille")
            .attr("transform", "translate("+margeX+","+ -margeY +")")
            .call(this.grille_selon_Y(AxeY)
                .tickSize(-Largeur_graphe)
                .tickFormat("")
            );

        svg.selectAll(".grille line").style("stroke", "lightgray");

        svg.append("g")
        .attr("transform", "translate("+ margeX +","+(Hauteur_graphe-margeY)+")")
        .call(d3.axisBottom(AxeX).tickFormat(function(d, i){
            if(Largeur_graphe/nb_mesures < 14){
                if(Largeur_graphe/nb_mesures < 3.5){
                    if(i%10 == 0){
                        return i;
                    }
                    return("");
                }
                if(i%5 == 0){
                    return i;
                }
                return("");
            }
            return i;
        }));

        let couleurs = this.couleurs;
        for(var n = 0; n < nb_zones; n++){
            svg.datum(data[n])
                .append("path")
                .attr("fill", "none")
                .attr("stroke", couleurs[n])
                .attr("stroke-width", 2)
                .attr("data-legend",function(d) {return d;})
                .attr("d", d3.line()
                        .x(function(d, i) {return margeX+AxeX(tab_temps[i]); })
                        .y(function(d) {return AxeY(d)-margeY; })
                    );

         svg.selectAll("cercle" + n)
            .data(data[n])
            .enter()
            .append("circle")
            .attr("fill", couleurs[n])
            .attr("r", 3.5)
            .attr("cx",function(d, i) {return margeX+AxeX(tab_temps[i]); })
            .attr("cy",function(d) {return AxeY(d)-margeY; });
        }

        var legend_keys = this.nom_zones;

        var Legende = svg.selectAll(".Legende").data(legend_keys)
                        .enter()
                        .append("g")
                        .attr("class","Legende")
                        .attr("transform", function (d,i) {
                            return "translate(" + (Largeur_graphe + 70) + "," + ((i*20)+margeY)+")";
                        });

        Legende.append("text")
                .text(function (d) {return d;})
                .attr("transform", "translate(15,9)"); //aligner le texte et les rect

        Legende.append("rect")
                .attr("fill", function (d, i) {return couleurs[i]; })
                .attr("width", 10).attr("height", 10);
      },
      random_couleur() {
        return "rgb(" + (20*Math.floor(Math.random()*13)) +"," + (20*Math.floor(Math.random()*13)) + ", " + (20*Math.floor(Math.random()*13)) + ")";
      }
    }
  }
</script>
