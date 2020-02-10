<template>
  <svg width="500" height="270">
    <g style="transform: translate(0, 10px)">
      <path :d="line" />
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: 'vue-line-chart',
  data: () => ({
      // data: [99, 71, 78, 25, 36, 92],
      // line: '',
    }),
  mounted() {
    this.calculatePath();
  },
  methods: {
    getScales() {
      const x = d3.scaleTime().range([0, 430]);
      const y = d3.scaleLinear().range([210, 0]);
      d3.axisLeft().scale(x);
      d3.axisBottom().scale(y);
      x.domain(d3.extent(this.data, (d, i) => i));
      y.domain([0, d3.max(this.data, d => d)]);
      return { x, y };
    },
    calculatePath() {
      var data = [140, 108, 2800, 170, 230, 242];

      var Largeur_graphe = 500, Hauteur_graphe = 400, Espacement_barres = 10;
      var Largeur_barres = (Largeur_graphe / data.length);

      var margeX = 20;
      // var margeY = 10;

      var AxeY = d3.scaleLinear().domain(data).range([0,Hauteur_graphe]);

      var AxeX = d3.scalePoint().domain(["Zone 1","Zone 2","Zone 3","Zone 4","Zone 5","Zone 6"])
                                .range([0,Largeur_graphe])
                                .padding(.45);


      /*FAUT QUE JE TROUVE LE MOYEN DE GÉNÉRER LA BALISE SVG DEPUIS LE JS (c'est un truc spécial apparemment)*/
      /* C'est un début ...
      var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      s.setAttribute("class", "chart");
      s.innerHTML = data;
      document.body.appendChild(s);*/

      var svg = d3.select('svg')
          .attr("width", Largeur_graphe)
          .attr("height", Hauteur_graphe);


      svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("fill", function(d) {
            if (d <= 300) {
              return "steelblue";
            }
            return "red";
          })
          .attr("y", function(d) {
               return Hauteur_graphe - d;
          })
          .attr("height", function(d) {
              return d - margeX;
          })
          .attr("width", Largeur_barres - Espacement_barres)
          .attr("transform", function (d, i) {
              var translate = [Largeur_barres * i, 0];
              return "translate("+ translate +")";
          });


      svg
      .append("g")
      .call(d3.axisLeft(AxeY));

      svg
      .append("g")
      .attr("transform", "translate(0,"+(Hauteur_graphe-margeX)+")")
      .call(d3.axisBottom(AxeX));
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
