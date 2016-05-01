var margin2 = {top: 90, right: 100, bottom: 50, left: 80},
    width2 = 720 - margin2.left - margin2.right,
    height2 = 700 - margin2.top - margin2.bottom;

var x2 = d3.scale.ordinal()
    .rangeRoundBands([0, width2], .1);

var y2 = d3.scale.linear()
    .rangeRound([0,height2]);

var color2 = d3.scale.category10();

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("top");

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .ticks(10)
    .orient("left");

var smallStates = d3.select("#smallStates").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.csv("smallstatesdata.csv", function(error, data) {
  if (error) throw error;

  color2.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.ages[d.ages.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x2.domain(data.map(function(d) { return d.State; }));
  y2.domain([0, d3.max(data, function(d) { return d.total; })]);

  smallStates.append("g")
      .attr("class", "x axis")
      .call(xAxis2)
      .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(65)" 
                });

  smallStates.append("g")
      .attr("class", "y axis")
      .call(yAxis2)
    .append("text")
      .attr("x", -10)
      .attr("y",10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Tax in \u20B9 Crores");

  var state = smallStates.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x2(d.State) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.ages; })
    .enter().append("rect")
      .attr("width", x2.rangeBand())
      .attr("y", function(d) { return y2(d.y0); })
      .attr("height", function(d) { return y2(d.y0) + y2(d.y1); })
      .style("fill", function(d) { return color2(d.name); });

  var legend = smallStates.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width2 + 60)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width2 + 50)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});