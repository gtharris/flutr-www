mapboxgl.accessToken = 'pk.eyJ1IjoiZW5qYWxvdCIsImEiOiJjaWhtdmxhNTIwb25zdHBsejk0NGdhODJhIn0.2-F2hS_oTZenAWc0BMf_uw'

//Setup mapbox-gl divamap
var divamap = new mapboxgl.Map({
    container: 'divamap', // container id
    style: 'mapbox://styles/enjalot/cihmvv7kg004v91kn22zjptsc',
    center: [-93.64011143,42.00894887],
    zoom: 18,
})
divamap.dragPan.disable();
divamap.scrollZoom.disable();

// Setup our svg layer that we can manipulate with d3
var container = divamap.getCanvasContainer()
var svg = d3.select(container).append("svg")

var active = true;
var circleControl = new circleSelector(svg)
    .projection(project)
    .inverseProjection(function(a) {
        return divamap.unproject({x: a[0], y: a[1]});
    })
    .activate(active);

d3.select("#circle").on("click", function() {
    active = !active;
    circleControl.activate(active)
    if(active) {
        divamap.dragPan.disable();
    } else {
        divamap.dragPan.enable();
    }
    d3.select(this).classed("active", active)
})

// Add zoom and rotation controls to the divamap.
divamap.addControl(new mapboxgl.Navigation());

function project(d) {
    return divamap.project(getLL(d));
}
function getLL(d) {
    return new mapboxgl.LngLat(+d.lng, +d.lat)
}

d3.csv("Breadcrumbs.csv", function(err, data) {
    //console.log(data[0], getLL(data[0]), project(data[0]))
    var dots = svg.selectAll("circle.dot")
        .data(data)

    dots.enter().append("circle").classed("dot", true)
        .attr("r", 1)
        .style({
            fill: "#0082a3",
            "fill-opacity": 0.6,
            stroke: "#004d60",
            "stroke-width": 1
        })
        .transition().duration(1000)
        .attr("r", 5)

    circleControl.on("update", function() {
        svg.selectAll("circle.dot").style({
            fill: function(d) {
                var thisDist = circleControl.distance(d);
                var circleDist = circleControl.distance()
                if(thisDist < circleDist) {
                    return "#ff8eec";
                } else {
                    return "#0082a3"
                }
            }
        })
    })
    circleControl.on("clear", function() {
        svg.selectAll("circle.dot").style("fill", "#0082a3")
    })

    function render() {
        dots.attr({
            cx: function(d) {
                var x = project(d).x;
                return x
            },
            cy: function(d) {
                var y = project(d).y;
                return y
            },
        })

        circleControl.update(svg)
    }

    // re-render our visualization whenever the view changes
    divamap.on("viewreset", function() {
        render()
    })
    divamap.on("move", function() {
        render()
    })

    // render our initial visualization
    render()
})

