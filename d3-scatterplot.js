var height = 500;
var width = 900;

var svgContainer = d3
  .select(".graphContainer")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 150);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function (err, data) {
    if (err) throw error;
    //x axis
    var year = data.map((d) => d.Year);

    var xScale = d3
      .scaleLinear()
      .domain([d3.min(year), d3.max(year) + 1])

      .range([0, width]);

    var tickYears = () => d3.max(year) - d3.min(year);

    var xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.format("d"))
      .tickValues(xScale.ticks(tickYears()).concat(xScale.domain()));

    xAxisGroup = svgContainer
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", "translate(60,550)");

    //y axis

    var time = data.map((d) => d3.timeParse("%M:%S")(d.Time));

    var yScale = d3.scaleTime().domain(d3.extent(time)).range([0, height]);

    var yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.timeFormat("%M:%S"))
      .tickValues(yScale.ticks(20).concat(yScale.domain()));

    var yAxisGroup = svgContainer
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60,50)");

    // graph

    d3.select("svg")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d3.timeParse("%M:%S")(d.Time)))
      .attr("r", 5)
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d3.timeParse("%M:%S")(d.Time).toISOString())
      .style("fill", function (d) {
        if (d.Doping == "") {
          return "green";
        }
        return "red";
      })
      .attr("transform", "translate(60,50)");

    // legend

    var legendContainer = svgContainer.attr("id", "legend");

    legendContainer
      .append("circle")
      .attr("cx", width - 131)
      .attr("cy", 128)
      .attr("r", 6)
      .style("fill", "green");
    legendContainer
      .append("circle")
      .attr("cx", width - 131)
      .attr("cy", 158)
      .attr("r", 6)
      .style("fill", "red");
    legendContainer
      .append("text")
      .attr("x", width - 120)
      .attr("y", 130)
      .text("Riders with doping allegations")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    legendContainer
      .append("text")
      .attr("x", width - 120)
      .attr("y", 160)
      .text("No doping allegations")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  }
);
