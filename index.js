d3
  .json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
  .then(function(data) {
    var res = data.data;
    getD3Elements(res);
  });

function getD3Elements(data) {
  var dataSet = [];
  //copy data obj
  data.map(function(element) {
    dataSet.push(element);
  });

  var yearsOnly = [];
  var GDPonly = [];
  var years = [];

  data.map(function(e) {
    GDPonly.push(e[1]);
  });

  data.map(function(e) {
    years.push(e[0]);
  });

  years.map(function(e) {
    yearsOnly.push(parseInt(e.slice(0, 4)));
  });

  var maxGDP = d3.max(GDPonly, function(d) {
    return d;
  });

  var margin = { top: 60, right: 60, bottom: 80, left: 70 };

  var chartWidth = 1100 - margin.left - margin.right;
  var chartHeight = 700 - margin.top - margin.bottom;

  //create svg

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("height", chartHeight + margin.left + margin.right)
    .attr("width", chartWidth + margin.bottom + margin.top)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //title

  svg
    .append("text")
    .text("United States GDP")
    .attr("class", "title")
    .attr("x", 340);

  var gdpDetail = svg
    .append("text")
    .text("Gross Domestic Product, USA")
    .attr("class", "gdp")
    .attr("transform", "rotate(-90)")
    .attr("x", -205)
    .attr("y", 30);

  //create scales

  xScale = d3
    .scaleTime()
    .domain([
      new Date(d3.min(years)).getFullYear(),
      new Date(d3.max(years)).getFullYear()
    ])
    .range([0, chartWidth]);

  var yScale = d3
    .scaleLinear()
    .domain([0, maxGDP])
    .range([chartHeight, 0]);

  var xAxis = d3
    .axisBottom(xScale)
    //removes comma from date values
    .tickFormat(d3.format("d"));

  //bind data and create bars

  var bars = svg
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * (chartWidth / dataSet.length);
    })
    .attr("y", function(d) {
      return yScale(d[1]);
    })
    .attr("width", chartWidth / dataSet.length)
    .attr("height", function(d) {
      return chartHeight - yScale(d[1]);
    })
    .attr("fill", "rgb(73, 153, 108)")

    //tooltips

    .on("mouseover", function(d) {
      d3.select(this).attr("fill", "rgb(214, 12, 188)");
      let year = d[0].slice(0, 4);
      let GDP = d[1].toFixed(2);
      let Q = d[0].slice(5, 7);
      let month = "";
      if (Q === "01") {
        month = "Jan";
      } else if (Q === "04") {
        month = "April";
      } else if (Q === "07") {
        month = "July";
      } else {
        month = "Oct";
      }

      d3
        .select("#tooltip")
        .style("opacity", "0.8")
        .style("left", d3.event.pageX - 200 + "px")
        .style("top", d3.event.pageY - 100 + "px")
        .style("display", "block")
        .html("$" + GDP + " " + "Billion" + "</br>" + year + " -  " + month);
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("display", "none");
      d3.select(this).attr("fill", "rgb(73, 153, 108)");
    });

  //create Axes

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + chartHeight + ")")

    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  svg
    .append("text")
    .text(
      "Units: Billions of Dollars Seasonal Adjustment: Seasonally Adjusted Annual Rate Notes: A Guide to the National Income and Product Accounts of the United States (NIPA)"
    )
    .attr("class", "info")
    .attr("y", chartHeight + margin.top - 10);
  svg
    .append("text")
    .text(" (http://www.bea.gov/national/pdf/nipaguid.pdf)")
    .attr("class", "info")
    .attr("y", chartHeight + margin.top + 5)
    .attr("x", 360);
}
