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
    console.log(year);

    var xScale = d3
      .scaleLinear()
      .domain([d3.min(year) - 1, d3.max(year) + 1])

      .range([0, width]);

    var tickYears = () => d3.max(year) - d3.min(year);

    console.log(tickYears());

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

    console.log(time.length);

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
      .style("fill", "#000")
      .attr("transform", "translate(" + 60 + "," + 50 + ")");
  }
);
