var w = 500,
    h = 500,
    m = 50;

var svg = d3.select("#d3demo").append("svg").attr("width", w).attr("height", h);
var x = d3.scale.linear().domain([0, 5]).range([m, w - m]);
var y = d3.scale.linear().domain([-10, 10]).range([h - m, m]);
var r = d3.scale.linear().domain([0, 500]).range([0, 20]);
var o = d3.scale.linear().domain([10000, 100000]).range([.5, 1]);
var c = d3.scale.category10().domain(["Africa", "America", "Asia", "Europe", "Oceania"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - m) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + m + ",0)")
    .call(yAxis);

svg.selectAll(".h").data(d3.range(-8, 10, 2)).enter()
    .append("line").classed("h", 1)
    .attr("x1", m).attr("x2", h - m)
    .attr("y1", y).attr("y2", y)

svg.selectAll(".v").data(d3.range(1, 5)).enter()
    .append("line").classed("v", 1)
    .attr("y1", m).attr("y2", w - m)
    .attr("x1", x).attr("x2", x)

d3.csv("data/dataford3.csv", function(csv) {
    // we first sort the data
    csv.sort(function(a, b) {
        return b.population - a.population;
    });

    // then we create the marks, which we put in an initial position

    svg.selectAll("circle").data(csv).enter()
        .append("circle")
        .attr("cx", function(d) {
            return x(0);
        })
        .attr("cy", function(d) {
            return y(0);
        })
        .attr("r", function(d) {
            return r(0);
        })

        .style("fill", function(d) {
            return c(d.continent);
        })
        .style("opacity", function(d) {
            return o(+d.GDPcap);
        })

        .append("title")
        .text(function(d) {
            return d.country;
        })

    // now we initiate - moving the marks to their position

    svg.selectAll("circle").transition().duration(1000)
        .attr("cx", function(d) {
            return x(+d.GERD);
        })
        .attr("cy", function(d) {
            return y(+d.growth);
        })
        .attr("r", function(d) {
            return r(Math.sqrt(+d.population));
        })
})
