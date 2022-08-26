// Defining initialization function. 
function init() {
    d3.json("data/samples.json").then(d => {
    const names = d.names; 

    let dropDown = d3.select('#selDataset')

    names.forEach(name => {
        dropDown.append('option').text(name).property('value');
    });

    // // Run metadata and plot functions for the first element
    const sampleOne = names[0]
    buildPlots(sampleOne);
    buildMetadata(sampleOne);
})
}

// Running initialization function.
init()

// Collecting the metadata
function buildMetadata(id) {
    d3.json("data/samples.json").then((d)=> {
        let metadata = d.metadata;
        let result = metadata.filter(meta => meta.id.toString() === id)[0];
        let demographics = d3.select("#sample-metadata");
        demographics.html("");

        Object.entries(result).forEach((key) => {   
                demographics.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Constructing the plots
function buildPlots(id) {

    // Selecting the data to be used in the plots
    d3.json("data/samples.json").then((d)=> {
        let samples = d.samples.filter(s => s.id.toString() === id)[0];
        let samplevalues = samples.sample_values.slice(0, 10).reverse();
        let OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        let OTU_id = OTU_top.map(d => "OTU " + d)
        let labels = samples.otu_labels.slice(0, 10);
        
        // Bar plot
        let trace1 = {
            x: samplevalues,
            y: OTU_id,
            type:"bar",
            orientation: "h",
            width: 0.8,
            text: labels,
            marker: {color: 'rgb(42,113,230)'},

        };

        let bar_data = [trace1];

        let bar_layout = {
            title: "Top 10 OTU",
            yaxis:{tickmode:"linear"},
            margin: {t:35, l: 95, r: 20, b: 35,}
        };

        Plotly.newPlot("bar", bar_data, bar_layout);

        // Bubble plot
        let trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids},
            text: samples.otu_labels
        };

        let bubble_data = [trace2];

        Plotly.newPlot("bubble", bubble_data);
    });
} 

// Tracking changes function
function optionChanged(id) {
    buildPlots(id);
    buildMetadata(id);
}