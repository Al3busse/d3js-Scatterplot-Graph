var height = 500;
var width = 900;

var svgContainer = d3
  .select(".graphContainer")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 100);

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

    var xAxisGroup = svgContainer
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

    // ylabel
    svgContainer
      .append("text")
      .attr("class", "y label")
      .attr("y", 18)
      .attr("x", -350)
      .style("font-size", 18)
      .attr("transform", "rotate(-90)")
      .text("Time in Minutes");

    // tooltip

    var tooltip = d3
      .select(".graphContainer")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

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
      .attr("transform", "translate(60,50)")
      .on("mouseover", function (d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .attr("data-year", d.Year)
          .html(
            d.Name +
              ": " +
              d.Nationality +
              "<br/>" +
              "Year: " +
              d.Year +
              ", Time: " +
              d.Time +
              (d.Doping
                ? "<br/><br/>" +
                  d.Doping +
                  "<br />" +
                  "Source: " +
                  "<a href=" +
                  d.URL +
                  " target=`_blank`>" +
                  d.URL +
                  "</a>"
                : "")
          )

          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.style("opacity", 0);
      });

    // legend

    var legendContainer = svgContainer.append("g").attr("id", "legend");

    legendContainer
      .append("circle")
      .attr("cx", width - 131)
      .attr("cy", 128)
      .attr("r", 6)
      .style("fill", "green")
      .style("stroke", "#000");
    legendContainer
      .append("circle")
      .attr("cx", width - 131)
      .attr("cy", 158)
      .attr("r", 6)
      .style("fill", "red")
      .style("stroke", "#000");
    legendContainer
      .append("text")
      .attr("x", width - 120)
      .attr("y", 130)
      .text("No doping allegations")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    legendContainer
      .append("text")
      .attr("x", width - 120)
      .attr("y", 160)
      .text("Riders with doping allegations")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  }
);
