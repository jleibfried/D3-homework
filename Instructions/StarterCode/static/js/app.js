
console.log("here 0");

// Code straight off Slack from Terrence Cummings.
// I was struggling to make this work and when he posted it 
// I took full advantage of it in this code.  I thanked him personally
// and am crediting it here so I hope that is okay
d3.json("../../samples.json").then((data) => {
sortedMetaData = data.metadata;
for (i = 0; i < sortedMetaData.length; i++) {        // Get the ID for the individual
    let addID = sortedMetaData[i].id;        // get reference to select element
    let sel = document.getElementById('selDataset');        // create new option element
    let opt = document.createElement('option');        // create text node to add to option element (opt)
    opt.appendChild(document.createTextNode(addID));        // set value property of opt
    opt.value = addID;        // add opt to end of select box (sel)
    sel.appendChild(opt);};


});



d3.selectAll("#selDataset").on("changed", optionChanged);


// I don't like how this function does everything.  I wish I knew
// how to write the JSON file into var which I could use instead of 
// a read every time a new selection is used.
// Though inefficient it works, even if it does make me a little sad
function optionChanged() {
   
  
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var dataset = dropdownMenu.property("value");
    let metadataset = dataset;
    // console.log(dataset);
      
  
  


// Reading the JSON file
d3.json("../../samples.json").then((data) => {
    // console.log(dataset);
    // console.log(data.samples);
    let e;
    for (e of data.samples) {
        if (e.id === dataset) {
          found = e;
          break;
        }
      }
      // console.log(e)

    // setting up data for the Bar chart
    sampleData = data.samples;
    
    sliceOTUs = e.otu_ids.slice(0, 10);
    strArrOTU = sliceOTUs.map((x => "OTU " + x ))
    revsliceOTUs = strArrOTU.reverse();

    sliceSamps = e.sample_values.slice(0, 10);
    revsliceSamps = sliceSamps.reverse();


    // setting up the bubble chart
    xVal = e.otu_ids;
    yVal = e.sample_values;
    xvalOTU= xVal.map((x => "OTU " + x ));


    // setting up data for the Demo chart
    // console.log(data.metadata);
    let f;
    for (f of data.metadata) {
      if (f.id == metadataset) {
          found = f;
          break;
        }
      };
    tableData = f;

    tableId = tableData.id;
    tableBb = tableData.bbtype;
    tableEth = tableData.ethnicity;
    tableGender = tableData.gender;
    tableLoc  = tableData.location;
    tableAge = tableData.age;
    tableWFreq = tableData.wfreq;

    keyArr = ["ID: ", "BB Type: ", "Ethnicity: ", "Gender: ", "Location: ", "Age: ", "WFreq: "];
    valueArr = [tableId, tableBb, tableEth, tableGender, tableLoc, tableAge, tableWFreq];




    // graphing 
    barGraphing();
    bubbleGraphing();
    demoTabling();
    gaugeGraphing();
});

};


function barGraphing() {
    //console.log("BAR NOT DONE");
    
var trace1 = {
    x: revsliceSamps,
    y: revsliceOTUs,
    text: revsliceOTUs,
    name: "Greek",
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: "Greek gods search results",
  };

  var data = [trace1];
  Plotly.newPlot("bar", data, layout);
};




function bubbleGraphing(){
    //console.log("BUBBLE NOT DONE");

    var trace1 = {
        x: xVal,
        y: yVal,
        text: xvalOTU,
        mode: 'markers',
        marker: {
            color: xVal,
          size: yVal
        }
      };
      
      var data = [trace1];
      
      var layout = {
        title: 'OTU by Bubble Distibution',
        showlegend: false,
        xaxis: {
            title: 'OTU # of Bacteria',
            titlefont: {
              family: 'Arial, sans-serif',
              size: 18
            },
            showticklabels: true,
            tickangle: 'auto',
            tickfont: {
              family: 'Old Standard TT, serif',
              size: 14,
              color: 'black'
            },
            exponentformat: 'e',
            showexponent: 'all'
          },
          yaxis: {
            title: '# of Bacteria Found',
            },

        height: 600,
        width: 600
      };
      
      Plotly.newPlot('bubble', data, layout);

};


function demoTabling(){
    //  console.log("TABLE NOT DONE");
    
    //  After searching for way to long finally found out how to write to html from javascript
    //    https://stackoverflow.com/questions/19438895/add-a-new-line-in-innerhtml
    document.getElementById('sample-metadata').innerHTML = keyArr[0] + valueArr[0] + "<br />" +
    keyArr[1] + valueArr[1] + "<br />" + 
    keyArr[2] + valueArr[2] + "<br />" +
    keyArr[3] + valueArr[3] + "<br />" +
    keyArr[4] + valueArr[4] + "<br />" +
    keyArr[5] + valueArr[5] + "<br />" +
    keyArr[6] + valueArr[6] + "<br />" ;


};


function gaugeGraphing() {
    // console.log("GAUGE NOT DONE");

    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: tableWFreq,
        title: { text: "Weekly Cleanings" },
        type: "indicator",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "red" },
            { range: [1, 4], color: "pink" },
            { range: [7, 9], color: "lightblue" }
          ]
        },

        mode: "gauge+number"
        
      }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    

    Plotly.newPlot('gauge', data, layout);
};