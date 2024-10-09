// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObject => sampleObject.id == 940);

    // Use d3 to select the panel with id of `#sample-metadata`
    const resultData = result[0];
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(resultData).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const desiredsample = samples.filter(sampleObject => sampleObject.id == 940)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = desiredsample.otu_ids;
    const otu_labels = desiredsample.otu_labels;
    const sample_values = desiredsample.sample_values;

    console.log("otu IDs:", otu_ids);
    console.log("otu Labels:", otu_labels);
    console.log("sample Values:", sample_values);

    // Build a Bubble Chart
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: {t: 50},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    const bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const top10Values = sample_values.slice(0, 10).reverse();
    const top10Ids = otu_ids.slice(0, 10).reverse();
    const top10Labels = otu_labels.slice(0, 10).reverse();

    const yticks = top10Ids.map(id => `OTU ${id}`);

    // Render the Bar Chart
    const barData = [{
      x: top10Values,
      y: yticks,
      text: top10Labels,
      type: "bar",
      orientation: "h"
    }];

    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: {t: 20, l: 160}, 
      xaxis: {title: "Number of Bacteria"},
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown
        .append("option")
        .text(sample)
        .property("value", sample)
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(firstSample);
  buildMetadata(firstSample);
}

// Initialize the dashboard
init();
