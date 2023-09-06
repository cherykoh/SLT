class BoxPlotCard extends HTMLElement {

    async connectedCallback() {
        const template = document.createElement('template');
        let res = await fetch( './components.html' );
        var parser = new DOMParser();
        var doc = parser.parseFromString(await res.text(), 'text/html');
        template.innerHTML = doc.getElementById("plot-card").innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#statsbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").addEventListener('click', this.takeshot.bind(this)); 
        this.shadowRoot.querySelector("#statsbtn").addEventListener('click', this.download_table_as_csv.bind(this));
        
    }
    
    constructor(groupAttributes, valueAttribute){
        super();
        this.groupAttributes = groupAttributes; //list[str]
        this.valueAttribute = valueAttribute; //str
        this.attachShadow({ mode: 'open'});
        this.summaryData = {};
        this.boxPlotConfig = {};
    }

    plotData(plotRoot, plot_data, x_column, y_column, groups, boxplotConfig, tickvals, ticktext) {
        const xVariable = boxplotConfig.X;
        const yVariable = boxplotConfig.Y;
        const clusterVariable = boxplotConfig.Cluster;
        const order = boxplotConfig.Order;
        const title = boxplotConfig.AdditionalConfiguration?.Title || `${xVariable} vs ${yVariable} clustered by ${clusterVariable}`;
        const xLabel = boxplotConfig.AdditionalConfiguration?.['X Label'] || xVariable;
        const yLabel = boxplotConfig.AdditionalConfiguration?.['Y Label'] || yVariable;
    

        let layout = {
            title: title,
            yaxis: {
                title: yLabel,
                zeroline: false
            },
            xaxis: {
                title: xLabel,
                tickvals: tickvals,
                ticktext: ticktext
            },
            boxmode: 'group',
            boxwidth: 10,
            boxgap: 0.3,
            boxgroupgap: 0.5,
            width: 1600,
            height: 400,
        };
    
        if (boxplotConfig.HorizontalLine) {
            layout.shapes = [{
                type: 'line',
                x0: 0,
                x1: 1,
                xref: 'paper',
                y0: boxplotConfig.HorizontalLine,
                y1: boxplotConfig.HorizontalLine,
                line: {
                    color: 'red',
                    width: 2,
                    dash: 'dash'
                }
            }];
        }
    
        Plotly.newPlot(plotRoot, plot_data, layout, { responsive: true });
    }
    

    getStandardDeviation(array){
        let n = array.length
        let mean = array.reduce((a, b) => a + b) / n
        return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    }

    getMedian(array){
        let mid = Math.floor(array.length / 2),
          nums = [...array].sort((a, b) => a - b);
        return array.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }

    getMean(array){
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    asc(array){
        return array.sort((a, b) => a - b);
    }

    getQuantile(array, q){
        let sorted = this.asc(array);
        let pos = (sorted.length - 1) * q;
        let base = Math.floor(pos);
        let rest = pos - base;
        if (sorted[base + 1] !== undefined) {
            return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
        } else {
            return sorted[base];
        }
    };

    createTable(tableRoot, summary_data, group_column, x_column, boxPlotConfig) {
        
        //Creating the main table
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);
        table.style = "width:100%; border: 1px solid black; border-collapse: collapse;";

        // Adding the entire table to the body tag
        tableRoot.appendChild(table);

        let sortedKeys = Object.keys(summary_data);
        if (boxPlotConfig.Order === 'ascending') {
            sortedKeys.sort();
        } else if (boxPlotConfig.Order === 'descending') {
            sortedKeys.sort((a, b) => b.localeCompare(a));
        }

        // Similarly, sort the sub-keys
        let sortedSubKeys = {};
        for (let key of sortedKeys) {
            sortedSubKeys[key] = Object.keys(summary_data[key]);
            if (boxPlotConfig.Order === 'ascending') {
                sortedSubKeys[key].sort();
            } else if (boxPlotConfig.Order === 'descending') {
                sortedSubKeys[key].sort((a, b) => b.localeCompare(a));
            }
        }

        if (group_column !== 'NONE') {
        //Creating Frequency Row
        let row_1 = document.createElement('tr');
        let heading = document.createElement('th');
        heading.innerHTML = x_column;
        heading.style = "border: 1px solid black;";
        row_1.appendChild(heading);
        for(let key of sortedKeys){
            let heading = document.createElement('th');
            heading.innerHTML = key;
            heading.colSpan = Object.keys(summary_data[key]).length;
            heading.style = "border: 1px solid black; font-weight:normal;";
            row_1.appendChild(heading);
        }
        row_1.style = "border: 1px solid black;";
        thead.appendChild(row_1);
        
        //Creating Split Row
        let row_2 = document.createElement('tr');
        let row_2_data = document.createElement('th');
        row_2_data.innerHTML = group_column;
        row_2_data.style = "border: 1px solid black;";
        row_2.appendChild(row_2_data);
        for(let key of sortedKeys){
            for(let grp of sortedSubKeys[key]){
                let row_2_data = document.createElement('th');
                row_2_data.innerHTML = grp;
                row_2_data.style = "border: 1px solid black; font-weight:normal;";
                row_2.appendChild(row_2_data);
            }
        }
        row_2.style = "border: 1px solid black;";
        tbody.appendChild(row_2);

        //Creating Statistics Row
        var stats_row = ['count', 'min', 'mean', 'median', 'max', 'stddev', '95th percentile', '5th percentile']
        for (let i = 0; i < stats_row.length; i++){
            let current_stats = stats_row[i];
            let row_3 = document.createElement('tr');
            let row_3_data = document.createElement('th');
            row_3_data.innerHTML = current_stats;
            row_3_data.style = "border: 1px solid black;";
            row_3.appendChild(row_3_data);
            for(let key of sortedKeys){
                let temp_dict = summary_data[key];
                for(let grp of sortedSubKeys[key]){
                    let row_3_data = document.createElement('th');
                    row_3_data.innerHTML = temp_dict[grp][current_stats];
                    row_3_data.style = "border: 1px solid black; font-weight:normal;";
                    row_3.appendChild(row_3_data);
                }
            }
            row_3.style = "border: 1px solid black;";
            tbody.appendChild(row_3);
        }
    }
    else {
// Modified logic to create the table without Cluster columns
let headerRow = document.createElement('tr');
let xHeader = document.createElement('th');
xHeader.innerHTML = x_column;
xHeader.style = "border: 1px solid black;";
headerRow.appendChild(xHeader);
let sortedKeys = Object.keys(summary_data);
    if (boxPlotConfig.Order === 'ascending') {
        sortedKeys.sort();
    } else if (boxPlotConfig.Order === 'descending') {
        sortedKeys.sort((a, b) => b.localeCompare(a));
    }

for(let key of sortedKeys){
    let heading = document.createElement('th');
    heading.innerHTML = key; // This refers to unique x values now
    heading.style = "border: 1px solid black; font-weight:normal;";
    headerRow.appendChild(heading);
}

thead.appendChild(headerRow);

let stats_row = ['count', 'min', 'mean', 'median', 'max', 'stddev', '95th percentile', '5th percentile'];

for (let i = 0; i < stats_row.length; i++){
    let current_stats = stats_row[i];
    let statsRow = document.createElement('tr');
    
    let statsHeader = document.createElement('th');
    statsHeader.innerHTML = current_stats;
    statsHeader.style = "border: 1px solid black;";
    statsRow.appendChild(statsHeader);
    
    for(let key of sortedKeys){
        let cell = document.createElement('th');
        cell.innerHTML = summary_data[key][current_stats];
        cell.style = "border: 1px solid black; font-weight:normal;";
        statsRow.appendChild(cell);
    }
    
    tbody.appendChild(statsRow);
}
    }
}
    
    sortOnKeys(dict, sorted) {
        let tempDict = {};
        for(let i = 0; i < sorted.length; i++) {
            tempDict[sorted[i]] = dict[sorted[i]];
        }
    
        return tempDict;
    }

    toggleStatsButton(shouldShow) {
        if (shouldShow) {
            this.shadowRoot.querySelector("#statsbtn").style.display = 'block';
        } else {
            this.shadowRoot.querySelector("#statsbtn").style.display = 'none';
        }
    }

    plot(dataset, boxPlotConfig) {
        // Extract the relevant data from the dataset
        const group_column_key = boxPlotConfig.Cluster ; 
        const x_column_key = boxPlotConfig.X ; 
        const y_column_key = boxPlotConfig.Y ; 

        const group_column = dataset[group_column_key];
        const x_column = dataset[x_column_key] ;
        const y_column = dataset[y_column_key] ;

        const groups = dataset[group_column];
        const x = dataset[x_column];
        const y = dataset[y_column];

        this.toggleStatsButton(config.ShowStatistics);
    
        // Remove all previous elements
        for (let elem of Array.from(this.children)) {
            elem.remove();
        }
    
        // Attach new elements
        const titleRoot = document.createElement('div');
        const plotRoot = document.createElement('div');
        const summaryRoot = document.createElement('div');
    
        titleRoot.slot = 'title';
        plotRoot.slot = 'plot';
        summaryRoot.slot = 'summary';
    
        titleRoot.innerText = `${x_column} vs ${y_column}`;
        summaryRoot.innerText = `${x_column} vs ${y_column} Summary`;
    
        this.appendChild(titleRoot);
        this.appendChild(plotRoot);
        this.appendChild(summaryRoot);
    
        var graph_x_order = [];
        let compiled_data = {};
        
        if (group_column_key !== 'NONE'){
        for (let i = 0; i < groups.length; i++) {
            let grp_temp = groups[i];
            let x_temp = x[i];
            let y_temp = y[i];
    
            if (compiled_data[grp_temp] == undefined) {
                compiled_data[grp_temp] = {};
            }
    
            let temp_dict = compiled_data[grp_temp];
    
            if (temp_dict[x_temp] == undefined) {
                temp_dict[x_temp] = [y_temp];
            } else {
                temp_dict[x_temp].push(y_temp);
            }
    
            if (!graph_x_order.includes(grp_temp)) {
                graph_x_order.push(grp_temp);
            }
        }}
        else{
            for (let i = 0; i < x.length; i++) {
                let x_temp = x[i];
                let y_temp = y[i];
        
                if (!compiled_data[x_temp]) {
                    compiled_data[x_temp] = [];
                }
        
                compiled_data[x_temp].push(y_temp);
        
                if (!graph_x_order.includes(x_temp)) {
                    graph_x_order.push(x_temp);
                }
            }
        }
    
        let plot_data = [];
        let tickvals = [];
        let ticktext = [];
        let currentXOffset = 0; 

        let sortedClusters = Object.keys(compiled_data);
        if (boxPlotConfig.Cluster === 'NONE') {
            if (boxPlotConfig.Order === 'ascending') {
                sortedClusters.sort();
            } else if (boxPlotConfig.Order === 'descending') {
                sortedClusters.sort((a, b) => b.localeCompare(a)); // This will sort strings in descending order
            }
        
            for (let x_value of sortedClusters) {
                // Add individual points
                plot_data.push({
                    y: compiled_data[x_value],
                    x: Array(compiled_data[x_value].length).fill(currentXOffset),
                    mode: 'markers',
                    type: 'scatter',
                    marker: {size: 2},
                    name: `${x_value}-points`,
                    showlegend: false
                });
        
                // Add box plots without fill color
                plot_data.push({
                    y: compiled_data[x_value],
                    x: Array(compiled_data[x_value].length).fill(currentXOffset),
                    type: 'box',
                    boxpoints: false,
                    name: x_value,
                    showlegend: false
                });
        
                tickvals.push(currentXOffset);
                ticktext.push(x_value); // Labels are simply the x values
                currentXOffset++;
            }
        }  else {
    
            if (boxPlotConfig.Order === 'ascending') {
                sortedClusters.sort();
            } else if (boxPlotConfig.Order === 'descending') {
                sortedClusters.sort((a, b) => b.localeCompare(a)); // This will sort strings in descending order
            }
    for (let cluster of sortedClusters) {
        const groupData = compiled_data[cluster];
        const sortedXValues = Object.keys(groupData);
        if (boxPlotConfig.Order === 'ascending') {
            sortedXValues.sort();
        } else if (boxPlotConfig.Order === 'descending') {
            sortedXValues.sort((a, b) => b.localeCompare(a));
        }
        for (let x_value of sortedXValues) {
            // // Add individual points
            plot_data.push({
                y: groupData[x_value],
                x: Array(groupData[x_value].length).fill(currentXOffset),
                mode: 'markers',
                type: 'scatter',
                marker: {size: 2},
                name: `${x_value}-points`,
                showlegend: false
            });

            // Add box plots without fill color
            plot_data.push({
                y: groupData[x_value],
                x: Array(groupData[x_value].length).fill(currentXOffset),
                type: 'box',
                boxpoints: false,
                name: x_value,
                showlegend: false
            });

            tickvals.push(currentXOffset); // Corresponding tick value for x-axis
            ticktext.push(`${cluster}-${x_value}`); // Corresponding label for x-axis
            currentXOffset++;
        }
    }
        }

    
        if (boxPlotConfig.Cluster === 'NONE') {
        
            for (let x_val in compiled_data) {
                let y_temp = compiled_data[x_val];
        
                compiled_data[x_val] = {
                    count: y_temp.length,
                    min: Math.min(...y_temp).toFixed(2),
                    mean: this.getMean(y_temp).toFixed(2),
                    median: this.getMedian(y_temp).toFixed(2),
                    max: Math.max(...y_temp).toFixed(2),
                    stddev: this.getStandardDeviation(y_temp).toFixed(2),
                    '95th percentile': this.getQuantile(y_temp, 0.95).toFixed(2),
                    '5th percentile': this.getQuantile(y_temp, 0.05).toFixed(2)
                };
            }
        } else {
    
        for (let key in compiled_data) {
            let temp_dict = compiled_data[key];
            for (let val in temp_dict) {
                let y_temp = temp_dict[val];
                temp_dict[val] = {
                    count: y_temp.length,
                    min: Math.min(...y_temp).toFixed(2),
                    mean: this.getMean(y_temp).toFixed(2),
                    median: this.getMedian(y_temp).toFixed(2),
                    max: Math.max(...y_temp).toFixed(2),
                    stddev: this.getStandardDeviation(y_temp).toFixed(2),
                    '95th percentile': this.getQuantile(y_temp, 0.95).toFixed(2),
                    '5th percentile': this.getQuantile(y_temp, 0.05).toFixed(2)
                };
            }
        }}
    
        compiled_data = this.sortOnKeys(compiled_data, graph_x_order);
        this.summaryData = compiled_data;
        this.boxPlotConfig = boxPlotConfig;
        this.plotData(plotRoot, plot_data, group_column, y_column, groups, boxPlotConfig, tickvals, ticktext);
        if (boxPlotConfig.ShowStatistics) {
        this.createTable(summaryRoot, compiled_data, group_column_key, x_column, boxPlotConfig);}
    }

    hasClusters(data) {
        // Get the value of the first key in the object
        const firstKeyVal = data[Object.keys(data)[0]];
      
        // If the value itself has a 'count' key, then it's directly a statistics object
        if(firstKeyVal.hasOwnProperty('count')) {
          return false;
        }
      
        // Otherwise, it's pointing to another set of objects and there are clusters
        return true;
      }

    download_table_as_csv() {
        let isClustered = this.hasClusters(this.summaryData);
        let boxPlotConfig = this.boxPlotConfig;
     
    
if(isClustered) {

    let uniqueGroups = Object.keys(this.summaryData);
    if (boxPlotConfig.Order === 'ascending') {
        uniqueGroups.sort();
    } else if (boxPlotConfig.Order === 'descending') {
        uniqueGroups.sort((a, b) => b.localeCompare(a));
    }

    let uniqueXValues = [];

    // Determine unique x values from the data
    for (let group in this.summaryData) {
        
        for (let x in this.summaryData[group]) {
            if (uniqueXValues.indexOf(x) === -1) {
                uniqueXValues.push(x);
            }
        }
    }
    if (boxPlotConfig.Order === 'ascending') {
        uniqueXValues.sort();
    } else if (boxPlotConfig.Order === 'descending') {
        uniqueXValues.sort((a, b) => b.localeCompare(a));
    }
    let csv = [];
    // Construct the header: ['Statistic', ...groups...]
    let header = ['X'];
     for (let group of uniqueGroups){
        for (let x of uniqueXValues)    {
            header.push(group + ' (' + x + ')');
        }
    }
    csv.push(header.join(","));

    // Rows represent statistics
    let stats = ['count', 'min', 'mean', 'median', 'max', 'stddev', '95th percentile', '5th percentile'];
    for (let stat of stats) {
        let row = [stat];
        for (let group of uniqueGroups) {
            for (let x of uniqueXValues) {
                row.push(this.summaryData[group][x] ? this.summaryData[group][x][stat] || '' : '');
            }
        }
        csv.push(row.join(","));
    }
        console.log(csv);
        var csv_string = csv.join('\n');
        // Download it
        var filename = 'export_statistics_' + new Date().toLocaleDateString() + '.csv';
        var link = document.createElement('a');
        link.style.display = 'none';
        link.setAttribute('target', '_blank');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
} else {
    let uniqueXValues = Object.keys(this.summaryData);
    if (boxPlotConfig.Order === 'ascending') {
        uniqueXValues.sort();
    } else if (boxPlotConfig.Order === 'descending') {
        uniqueXValues.sort((a, b) => b.localeCompare(a));
    }
    let csv = [];
    // Construct the header
    let header = ['Statistic'].concat(uniqueXValues); // The header will be 'Statistic' followed by unique x-values
    csv.push(header.join(","));

    // Rows represent statistics
    let stats = ['count', 'min', 'mean', 'median', 'max', 'stddev', '95th percentile', '5th percentile'];
    for (let stat of stats) {
        let row = [stat];
        for (let x of uniqueXValues) {
            row.push(this.summaryData[x][stat]);
        }
        csv.push(row.join(","));
    }

    console.log(csv);
    var csv_string = csv.join('\n');

    // Download it
    var filename = 'export_statistics_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }
} 

    takeshot(){
        let div =
            this;
        console.log(div);

        // Use the html2canvas function to take a screenshot and download
        html2canvas(div,{ 
            scrollX: -window.scrollX, 
            scrollY: -window.scrollY,
            allowTaint: true,
            useCORS: true
        })
        .then(canvas => {
            canvas.style.display = 'none'
            document.body.appendChild(canvas)
            return canvas
        })
        .then(canvas => {
            const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
            const a = document.createElement('a')
            a.setAttribute('download', 'plot.png')
            a.setAttribute('href', image)
            a.click()
            canvas.remove()
        })
    }

    
}

window.customElements.define('box-plot-card', BoxPlotCard);
