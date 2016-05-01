var margin_c = {top: 20, right: 20, bottom: 30, left: 70},
width_c = 720 - margin_c.left - margin_c.right,
height_c = 300 - margin_c.top - margin_c.bottom;

var parseDate_c = d3.time.format("%Y").parse,
formatPercent = d3.format(".0%");

var x_c= d3.time.scale()
.range([0, width_c]);

var y_c = d3.scale.linear()
.domain([0,1500000])
.range([height_c, 0]);

var color_c = d3.scale.category20();

var xAxis_c = d3.svg.axis()
.scale(x_c)
.orient("bottom");

var yAxis_c = d3.svg.axis()
.scale(y_c)
.orient("left");

var area_c = d3.svg.area()
.x(function(d) { return x_c(d.date); })
.y0(function(d) { return y_c(d.y0); })
.y1(function(d) { return y_c(d.y0 + d.y); });

var stack_c = d3.layout.stack()
.values(function(d) { return d.values; });

var categoryChart = d3.select("#taxcategory").append("svg")
.attr("width", width_c + margin_c.left + margin_c.right)
.attr("height", height_c + margin_c.top + margin_c.bottom)
.append("g")
.attr("transform", "translate(" + margin_c.left + "," + margin_c.top + ")");

d3.csv("categorydata.csv", function(error, data) {
  if (error) throw error;

  color_c.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate_c(d.date);
  });

  var browsers = stack_c(color_c.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        //Change this scaling factor to fit the data. 
        return {date: d.date, y: d[name] / 1 };
      })
    };
  }));

  x_c.domain(d3.extent(data, function(d) { return d.date; }));

  var browser = categoryChart.selectAll(".browser")
  .data(browsers)
  .enter().append("g")
  .attr("class", "browser");

  browser.append("path")
  .attr("class", "area")
  .attr("d", function(d) { return area_c(d.values); })
  .style("fill", function(d) { return color_c(d.name); });

  browser.append("text")
  .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
  .attr("transform", function(d) {return "translate(" + x_c(d.value.date) + "," + y_c(d.value.y0 + d.value.y / 2) + ")"; })
  .attr("x", -6)
  .attr("dy", ".35em")
  .text(function(d) {return d.name; });

  categoryChart.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height_c + ")")
  .call(xAxis_c);

  categoryChart.append("g")
  .attr("class", "y axis")
  .call(yAxis_c)
  .append("text")
    .attr("x", 70)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Tax in \u20B9 Crores");
});