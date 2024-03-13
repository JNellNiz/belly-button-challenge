const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function fetchData(url) {
  return d3.json(url);
}

function renderBarChart(filterValue) {
  const trace1 = {
    x: filterValue.sample_values.slice(0, 10).reverse(),
    y: filterValue.otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse(),
    text: filterValue.otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  };

  const barData = [trace1];

  const layout = {
    title: "Top 10 OTUs found",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  Plotly.newPlot("bar", barData, layout);
}

function renderBubbleChart(filterValue) {
  const trace2 = {
    x: filterValue.otu_ids,
    y: filterValue.sample_values,
    mode: 'markers',
    marker: {
      color: filterValue.otu_ids,
      colorscale: 'Earth',
      opacity: [1, 0.8, 0.6, 0.4],
      size: filterValue.sample_values
    }
  };

  const bubbleData = [trace2];

  const bubbleLayout = {
    title: "OTU IDs vs Sample Values",
    height: 600,
    width: 1000
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

function renderMetadata(filterData) {
  const metadataInfo = d3.select("#sample-metadata");

  // Clear existing content in metadataInfo
  metadataInfo.html("");

  // Append information from filterData to metadataInfo
  Object.entries(filterData).forEach(([key, value]) => {
    metadataInfo.append("p").text(`${key}: ${value}`);
  });
}

function init() {
  fetchData(url)
    .then(function (data) {
      const dropdownMenu = d3.select("#selDataset");
      const names = data.names;

      names.forEach((name) => {
        dropdownMenu.append("option").text(name).property("value", name);
      });

      dropdownMenu.on("change", function () {
        const selectedValue = dropdownMenu.property("value");
        const filterValue = data.samples.find((id) => id.id === selectedValue);
        const filterData = data.metadata.find((id) => id.id === parseInt(selectedValue));
        
        renderBarChart(filterValue);
        renderBubbleChart(filterValue);
        renderMetadata(filterData);
      });

      const initialValue = names[0];
      const initialFilterValue = data.samples.find((id) => id.id === initialValue);
      const initialFilterData = data.metadata.find((id) => id.id === parseInt(initialValue));

      renderBarChart(initialFilterValue);
      renderBubbleChart(initialFilterValue);
      renderMetadata(initialFilterData);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

init();