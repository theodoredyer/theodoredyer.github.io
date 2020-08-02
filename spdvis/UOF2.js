/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// The first line defines an object with a field for each of the four sides being 10 for top, etc. The following lines define the width and height of the outer dimensions of the graphic, and they are offset by the size of the margins set before them. 
var margin = {top: 10, right: 100, bottom: 150, left: 150},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// SVG = scalable vector graphics. 
// The following code adds a new SVG element to the DOM, with width and height determined by the margin boundaries set above. 
// The append "g" groups all of the bars together so that the following transform applies to all of them. 
// The following "transform" line applies a SVG transformation: move the object in between the margin boundaries. 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// scaleBand creates a scaled based on input data with a continuous and numeric output range. 
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

// scaleLinear Creates a continuous linear scale where input data maps to specified output range, in this case the max value of our gdp data inputs
var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
// This Defines the x axis - the lower bound where our graphs start growing up, and the y axis where the graphs start growing right
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
// This sets the y axis to display increments of $5


/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// In the CSV file for 2020, our columns are labeled "country" and "gdp" for the respective key and value, this function reads those columns and pulls that data into our variables key and value for later use.
function rowConverter(data) {
    return {
        key : data.country,
        value : +data.gdp
    }
}

d3.csv("diversity.csv",rowConverter).then(function(data){
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // This code sets up our previously defined scale variables to actually be based on the input data, as it has been read in the line above, setting the domain of the scales to be appropriate values.
    // The previous work on "scales" simply set up the type of data it should be set to model, and the format in which it should be oriented - the following commands do more set up for later use in 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // The following code generates "rect"s, ie: rectanges which we are using to represent our data and adds them to svg. The first line selects all existing rects (at the start there are none, but with d3 we must do this selection first in order to act on those objects later). the data(data) command does the processing and brings in the data we set up earlier, which then passes it to enter() for processing which returns a placeholder selection for each data point in 'data'. The following append() inserts a rectangle into the DOM and the following lines define the transition that the rectanges make (the way they slide in from the side of the screen) and the dimensions of the rectangles ie width height and x/y coordinates. 
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
        .attr("x", function(d) {
            return xScale(d.key);
        })
        .attr("y", function(d) {
            return yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height- yScale(d.value);
        })
        .attr("fill", function(d) {
            return "rgb(50, 140, "+ Math.round(d.value * 15)+")";
        });
        // The above fill attr command creates a fill color of 0 red, 0 green, and a blue value dependant on the inpur data. 
    
    // The following code labels each of the bars with their gdp value, the set up is very similar to the bars, including their placement, except the setup is with "text" instead of "rect"s. Additionally the last few lines set up a different font and color so that the text is visible, as black on blue is difficult to see. 
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.value;
        })
        .attr("x", function(d) {
            return xScale(d.key) + 7;
        })
        .attr("y", function(d) {
            return yScale(d.value) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white");
  
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "6px");
    
        
    
    // Draw yAxis and position the label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(0," +0 + ")")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "8px");
    
    // The following code adds the y axis label "Trillions of US Dollars", by setting the position to be to the left of the axis, with a 90 degree rotation so it runs along the same parallel as the axis. 
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+75)
        .attr("x", -margin.top -40)
        .text("Percentage of Population")
      
});

d3.csv("UOFdata.csv",rowConverter).then(function(data){
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // This code sets up our previously defined scale variables to actually be based on the input data, as it has been read in the line above, setting the domain of the scales to be appropriate values.
    // The previous work on "scales" simply set up the type of data it should be set to model, and the format in which it should be oriented - the following commands do more set up for later use in 
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // The following code generates "rect"s, ie: rectanges which we are using to represent our data and adds them to svg. The first line selects all existing rects (at the start there are none, but with d3 we must do this selection first in order to act on those objects later). the data(data) command does the processing and brings in the data we set up earlier, which then passes it to enter() for processing which returns a placeholder selection for each data point in 'data'. The following append() inserts a rectangle into the DOM and the following lines define the transition that the rectanges make (the way they slide in from the side of the screen) and the dimensions of the rectangles ie width height and x/y coordinates. 
    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
        .attr("x", function(d) {
            return xScale(d.key);
        })
        .attr("y", function(d) {
            return yScale(d.value);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return height- yScale(d.value);
        })
        .attr("fill", function(d) {
            return "rgb(50, 140, "+ Math.round(d.value * 0.5)+")";
        });
        // The above fill attr command creates a fill color of 0 red, 0 green, and a blue value dependant on the inpur data. 
    
    // The following code labels each of the bars with their gdp value, the set up is very similar to the bars, including their placement, except the setup is with "text" instead of "rect"s. Additionally the last few lines set up a different font and color so that the text is visible, as black on blue is difficult to see. 
    svg2.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.value;
        })
        .attr("x", function(d) {
            return xScale(d.key) + 7;
        })
        .attr("y", function(d) {
            return yScale(d.value) + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white");
  
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "6px");
    
        
    
    // Draw yAxis and position the label
    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .attr("transform", "translate(0," +0 + ")")
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("font-size", "8px");
    
    // The following code adds the y axis label "Trillions of US Dollars", by setting the position to be to the left of the axis, with a 90 degree rotation so it runs along the same parallel as the axis. 
    svg2.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+75)
        .attr("x", -margin.top -40)
        .text("Use of Force Reports")
      
});
