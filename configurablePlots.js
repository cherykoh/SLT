class BoxplotFiltering extends HTMLElement {


        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.columnNames = [];
            this.dataFilters = [];
            this.additionalFilters = [];
            this.filters = [];
        }
    
        setDataColumns(columnNames) {
            this.columnNames = columnNames;
            this.updateCategoryFilterOptions();
    
        }
    
        async connectedCallback() {
            await this.render(); // Attach shadow DOM before accessing elements
            this.setupEventListeners();
8
        }
    
        async render() {
    
            // Fetch the HTML content from a separate file
            const template = document.createElement('template');
            const res = await fetch('./boxplotTemplate.html');
    
            const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    
            // Get the template content based on its id
            template.innerHTML = doc.getElementById('boxplot-template').innerHTML;
    
            // Append the template content to the Shadow DOM
            this.shadowRoot.appendChild(template.content.cloneNode(true));
    
            // Update category fields options
            await this.updateCategoryFilterOptions();
        }
    
        setupEventListeners() {
            console.log('Setting up event listeners...');
            this.shadowRoot.querySelector('#applyButton1').addEventListener('click', this.onApplyClick1.bind(this));
            this.shadowRoot.querySelector('#applyButton2').addEventListener('click', this.onApplyClick2.bind(this));
            this.shadowRoot.querySelector('#clearButton1').addEventListener('click', this.onClearClick1.bind(this));
            this.shadowRoot.querySelector('#clearButton2').addEventListener('click', this.onClearClick2.bind(this));
            
        }
    
        async updateCategoryFilterOptions() {
    
            const xVariable = this.shadowRoot.querySelector('#xVariable');
            const yVariable = this.shadowRoot.querySelector('#yVariable');
            const cluster = this.shadowRoot.querySelector('#cluster');
            const group = this.shadowRoot.querySelector('#group');
            const categoryFilter2 = this.shadowRoot.querySelector("#categoryFilter2")
           
            // Check if the categoryFilter element is not null before updating its content
            xVariable.innerHTML = this.generateOptions(this.columnNames);
            yVariable.innerHTML = this.generateOptions(this.columnNames);
            cluster.innerHTML = this.generateOptions(this.columnNames);
            categoryFilter2.innerHTML = this.generateOptions(this.columnNames);

            cluster.insertAdjacentHTML('afterbegin', '<option value="NONE" selected>NONE</option>');
            }
        
        generateOptions(columnNames) {
            return columnNames.map(columnNames =>
                `<option value="${columnNames}">${columnNames}</option>`
            ).join('');
        }
        

        onApplyClick1(event) {
            event.preventDefault();
    
            const categoryFilter1Value = this.shadowRoot.querySelector('#categoryFilter1').value;
            const textFilter1Value = this.shadowRoot.querySelector('#textFilter1').value;
    
            const filterString = `${categoryFilter1Value} ="${textFilter1Value}"`;
            if (!this.additionalFilters.includes(filterString)) {
                this.additionalFilters.push(filterString);
                this.renderAdditionalFilters();
            }
        }
    
    
            onApplyClick2(event) {
            event.preventDefault();
    
            const categoryFilter2Value = this.shadowRoot.querySelector('#categoryFilter2').value;
            const comparisonFilterValue = this.shadowRoot.querySelector('#comparisonFilter').value;
            const textFilter2Value = this.shadowRoot.querySelector('#textFilter2').value;
    
            const filterString = `${categoryFilter2Value} ${comparisonFilterValue}${textFilter2Value}`;

            if (!this.dataFilters.includes(filterString)) {
                this.dataFilters.push(filterString);
                this.renderDataFilters();
        }
    }
  
        onClearClick1() {
            if (this.additionalFilters.length > 0) {
                this.additionalFilters.pop();
                this.renderAdditionalFilters();
            }
        }

        onClearClick2() {
            if (this.dataFilters.length > 0) {
                this.dataFilters.pop();
                this.renderDataFilters();
            }
        }

        renderDataFilters() {
            const filterOutput = this.shadowRoot.querySelector('#filterOutput2');
            if (filterOutput) {
                filterOutput.innerHTML = this.dataFilters.join('<br>');
            }
        }
    
        renderAdditionalFilters() {
            const filterOutput = this.shadowRoot.querySelector('#filterOutput1');
            if (filterOutput) {
                filterOutput.innerHTML = this.additionalFilters.join('<br>');
            }
        }

        renderAllFilters() {
            const filterOutput = this.shadowRoot.querySelector('#dataOutput');
            if (filterOutput) {
                filterOutput.innerHTML = this.filters.join('<br>');
            }
        }
        
    
        getDataFilters() {
            const filtersDictionary = {};
            for (const filter of this.dataFilters) {
                const [filterName, filterValue] = filter.split(' '); // Split at most two parts
                filtersDictionary[filterName.trim()] = filterValue.trim().replace(/^\"|\"$/g, '');
            }
        console.log(filtersDictionary);
            return filtersDictionary;
        }

        getAdditionalFilters() {
            const filtersDictionary = {};
        
            for (const filter of this.additionalFilters) {
                const [filterName, filterValue] = filter.split('='); // Split by the equal sign
                filtersDictionary[filterName.trim()] = filterValue.trim().replace(/^\"|\"$/g, '');
            }
        
            return filtersDictionary;
        }
        

        getConfiguration() {
            const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
            const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
            const clusterValue = this.shadowRoot.querySelector('#cluster').value;
            const orderValue = this.shadowRoot.querySelector('#order').value;
            const showStatisticsValue = this.shadowRoot.querySelector('#showStatistics').checked;
            const horizontalLineValue = this.shadowRoot.querySelector('#horizontalLine').value;

            const dataFiltersDictionary = this.getDataFilters();
            const additionalFiltersDictionary = this.getAdditionalFilters();
    
            return {
                X: xVariableValue,
                Y: yVariableValue,
                Cluster: clusterValue,
                Order: orderValue,
                HorizontalLine: horizontalLineValue,
                ShowStatistics: showStatisticsValue,
                AdditionalConfigurations: additionalFiltersDictionary,
                DataConfigurations: dataFiltersDictionary              
            };
        }
    }
    
    window.customElements.define('boxplot-filtering', BoxplotFiltering);

class LineplotFiltering extends HTMLElement {


    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.columnNames = [];
        this.dataFilters = [];
        this.additionalFilters = [];
        this.filters = [];
    }

    async setDataColumns(columnNames) {
        this.columnNames = columnNames;
        await this.updateCategoryFilterOptions();

    }

    async connectedCallback() {
        await this.render(); // Attach shadow DOM before accessing elements
        this.setupEventListeners();

    }

    async render() {

        // Fetch the HTML content from a separate file
        const template = document.createElement('template');
        const res = await fetch('./lineplotTemplate.html');

        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

        // Get the template content based on its id
        template.innerHTML = doc.getElementById('lineplot-template').innerHTML;

        // Append the template content to the Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Update category fields options
        await this.updateCategoryFilterOptions();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        this.shadowRoot.querySelector('#applyButton1').addEventListener('click', this.onApplyClick1.bind(this));
        this.shadowRoot.querySelector('#applyButton2').addEventListener('click', this.onApplyClick2.bind(this));
        this.shadowRoot.querySelector('#clearButton1').addEventListener('click', this.onClearClick1.bind(this));
        this.shadowRoot.querySelector('#clearButton2').addEventListener('click', this.onClearClick2.bind(this));
        
    }

    async updateCategoryFilterOptions() {

        const xVariable = this.shadowRoot.querySelector('#xVariable');
        const yVariable = this.shadowRoot.querySelector('#yVariable');
        const group = this.shadowRoot.querySelector('#group');
        const categoryFilter2 = this.shadowRoot.querySelector("#categoryFilter2")
        
        // Check if the categoryFilter element is not null before updating its content
        xVariable.innerHTML = this.generateOptions(this.columnNames);
        yVariable.innerHTML = this.generateOptions(this.columnNames);
        group.innerHTML = this.generateOptions(this.columnNames);
        categoryFilter2.innerHTML = this.generateOptions(this.columnNames);

        group.insertAdjacentHTML('afterbegin', '<option value="NONE" selected>NONE</option>');

        }
    
    generateOptions(columnNames) {
        return columnNames.map(columnNames =>
            `<option value="${columnNames}">${columnNames}</option>`
        ).join('');
    }

    onApplyClick1(event) {
    event.preventDefault();

    const categoryFilter1Value = this.shadowRoot.querySelector('#categoryFilter1').value;
    const textFilter1Value = this.shadowRoot.querySelector('#textFilter1').value;

    const filterString = `${categoryFilter1Value} ="${textFilter1Value}"`;
    if (!this.additionalFilters.includes(filterString)) {
        this.additionalFilters.push(filterString);
        this.renderAdditionalFilters();
    }
}


    onApplyClick2(event) {
    event.preventDefault();

    const categoryFilter2Value = this.shadowRoot.querySelector('#categoryFilter2').value;
    const comparisonFilterValue = this.shadowRoot.querySelector('#comparisonFilter').value;
    const textFilter2Value = this.shadowRoot.querySelector('#textFilter2').value;

    const filterString = `${categoryFilter2Value} ${comparisonFilterValue}${textFilter2Value}`;

    if (!this.dataFilters.includes(filterString)) {
        this.dataFilters.push(filterString);
        this.renderDataFilters();
    }
}

  

    onClearClick1() {
        if (this.additionalFilters.length > 0) {
            this.additionalFilters.pop();
            this.renderAdditionalFilters();
        }
    }

    onClearClick2() {
        if (this.dataFilters.length > 0) {
            this.dataFilters.pop();
            this.renderDataFilters();
        }
    }

    renderDataFilters() {
        const filterOutput = this.shadowRoot.querySelector('#filterOutput2');
        if (filterOutput) {
            filterOutput.innerHTML = this.dataFilters.join('<br>');
        }
    }

    renderAdditionalFilters() {
        const filterOutput = this.shadowRoot.querySelector('#filterOutput1');
        if (filterOutput) {
            filterOutput.innerHTML = this.additionalFilters.join('<br>');
        }
    }

    renderAllFilters() {
        const filterOutput = this.shadowRoot.querySelector('#dataOutput');
        if (filterOutput) {
            filterOutput.innerHTML = this.filters.join('<br>');
        }
    }
    

  
    getDataFilters() {
        const filtersDictionary = {};
        for (const filter of this.dataFilters) {
            const [filterName, filterValue] = filter.split(' '); // Split at most two parts
            filtersDictionary[filterName.trim()] = filterValue.trim().replace(/^\"|\"$/g, '');
        }
    console.log(filtersDictionary);
        return filtersDictionary;
    }

    getAdditionalFilters() {
        const filtersDictionary = {};
    
        for (const filter of this.additionalFilters) {
            const [filterName, filterValue] = filter.split('='); // Split by the equal sign
            filtersDictionary[filterName.trim()] = filterValue.trim().replace(/^\"|\"$/g, '');
        }
    
        return filtersDictionary;
    }

    getConfiguration() {
        const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
        const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
        const groupValue = this.shadowRoot.querySelector('#group').value;
        const functionValue = this.shadowRoot.querySelector('#function').value;

        const dataFiltersDictionary = this.getDataFilters();
        const additionalFiltersDictionary = this.getAdditionalFilters();


        return {
            X: xVariableValue,
            Y: yVariableValue,
            Group: groupValue,
            Function: functionValue,
            AdditionalConfigurations: additionalFiltersDictionary,
            DataConfigurations: dataFiltersDictionary 
        };
    }
}
    
window.customElements.define('lineplot-filtering', LineplotFiltering);

class ScatterplotFiltering extends HTMLElement {

    #xVariable
        #yVariable
        #cluster
        #categoryFilter1
        #categoryFilter2
    
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.columnNames = [];
                this.dataFilters = [];
                this.additionalFilters = [];
                this.filters = [];
            }
        
            async setDataColumns(columnNames) {
                this.columnNames = columnNames;
                await this.updateCategoryFilterOptions();
        
            }
        
            async connectedCallback() {
                await this.render(); // Attach shadow DOM before accessing elements
                this.setupEventListeners();

            }
        
            async render() {
        
                // Fetch the HTML content from a separate file
                const template = document.createElement('template');
                const res = await fetch('./scatterplotTemplate.html');
        
                const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        
                // Get the template content based on its id
                template.innerHTML = doc.getElementById('scatterplot-template').innerHTML;
        
                // Append the template content to the Shadow DOM
                this.shadowRoot.appendChild(template.content.cloneNode(true));
        
                // Update category fields options
                await this.updateCategoryFilterOptions();
            }
        
            setupEventListeners() {
                console.log('Setting up event listeners...');
                this.shadowRoot.querySelector('#applyButton1').addEventListener('click', this.onApplyClick1.bind(this));
                this.shadowRoot.querySelector('#applyButton2').addEventListener('click', this.onApplyClick2.bind(this));
                this.shadowRoot.querySelector('#clearButton1').addEventListener('click', this.onClearClick1.bind(this));
                this.shadowRoot.querySelector('#clearButton2').addEventListener('click', this.onClearClick2.bind(this));
              
            }
        
            async updateCategoryFilterOptions() {
        
                const xVariable = this.shadowRoot.querySelector('#xVariable');
                const yVariable = this.shadowRoot.querySelector('#yVariable');
                const cluster = this.shadowRoot.querySelector('#cluster');
                const categoryFilter2 = this.shadowRoot.querySelector("#categoryFilter2")
                
                // Check if the categoryFilter element is not null before updating its content
                xVariable.innerHTML = this.generateOptions(this.columnNames);
                yVariable.innerHTML = this.generateOptions(this.columnNames);
                cluster.innerHTML = this.generateOptions(this.columnNames);
                categoryFilter2.innerHTML = this.generateOptions(this.columnNames);
    
                cluster.insertAdjacentHTML('afterbegin', '<option value="NONE" selected>NONE</option>');
    
                }
            
            generateOptions(columnNames) {
                return columnNames.map(columnNames =>
                    `<option value="${columnNames}">${columnNames}</option>`
                ).join('');
            }
    
            onApplyClick1(event) {
            event.preventDefault();
    
            const categoryFilter1Value = this.shadowRoot.querySelector('#categoryFilter1').value;
            const textFilter1Value = this.shadowRoot.querySelector('#textFilter1').value;
    
            const filterString = `${categoryFilter1Value} ="${textFilter1Value}"`;
            if (!this.additionalFilters.includes(filterString)) {
                this.additionalFilters.push(filterString);
                this.renderAdditionalFilters();
            }
        }
    
    
            onApplyClick2(event) {
            event.preventDefault();
    
            const categoryFilter2Value = this.shadowRoot.querySelector('#categoryFilter2').value;
            const comparisonFilterValue = this.shadowRoot.querySelector('#comparisonFilter').value;
            const textFilter2Value = this.shadowRoot.querySelector('#textFilter2').value;
    
            const filterString = `${categoryFilter2Value} ${comparisonFilterValue}${textFilter2Value}`;

            if (!this.dataFilters.includes(filterString)) {
                this.dataFilters.push(filterString);
                this.renderDataFilters();
        }
    }
    onClearClick1() {
        if (this.additionalFilters.length > 0) {
            this.additionalFilters.pop();
            this.renderAdditionalFilters();
        }
    }

    onClearClick2() {
        if (this.dataFilters.length > 0) {
            this.dataFilters.pop();
            this.renderDataFilters();
        }
    }
    
            renderDataFilters() {
                const filterOutput = this.shadowRoot.querySelector('#filterOutput2');
                if (filterOutput) {
                    filterOutput.innerHTML = this.dataFilters.join('<br>');
                }
            }
        
            renderAdditionalFilters() {
                const filterOutput = this.shadowRoot.querySelector('#filterOutput1');
                if (filterOutput) {
                    filterOutput.innerHTML = this.additionalFilters.join('<br>');
                }
            }
    
            renderAllFilters() {
                const filterOutput = this.shadowRoot.querySelector('#dataOutput');
                if (filterOutput) {
                    filterOutput.innerHTML = this.filters.join('<br>');
                }
            }
            

            getDataFilters() {
                const filtersDictionary = {};
                for (const filter of this.dataFilters) {
                    const [filterName, filterValue] = filter.split(' '); // Split at most two parts
                    filtersDictionary[filterName.trim()] = filterValue.trim().replace(/^\"|\"$/g, '');
                }
            console.log(filtersDictionary);
                return filtersDictionary;
            }
    
            getAdditionalFilters() {
                const filtersDictionary = {};
            
                for (const filter of this.additionalFilters) {
                    const [filterName, filterValue] = filter.split('='); // Split by the equal sign
                    filtersDictionary[filterName.trim()] = filterValue.trim().replace(/^\"|\"$/g, '');
                }
            
                return filtersDictionary;
            }
    
            getConfiguration() {
                const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
                const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
                const clusterValue = this.shadowRoot.querySelector('#cluster').value;
                const verticalLineValue = this.shadowRoot.querySelector('#verticalLine').value;
                const horizontalLineValue = this.shadowRoot.querySelector('#horizontalLine').value;
                const showRegLineValue = this.shadowRoot.querySelector('#showRegLine').checked;
                const showXYLineValue = this.shadowRoot.querySelector('#showXYLine').checked;

                const dataFiltersDictionary = this.getDataFilters();
                const additionalFiltersDictionary = this.getAdditionalFilters();
    
        
                return {
                    X: xVariableValue,
                    Y: yVariableValue,
                    Cluster: clusterValue,
                    VerticalLine: verticalLineValue,
                    HorizontalLine: horizontalLineValue,
                    ShowRegression: showRegLineValue,
                    ShowOTO: showXYLineValue,
                    AdditionalConfigurations: additionalFiltersDictionary,
                    DataConfigurations: dataFiltersDictionary 
                };
            }
        }
        
        window.customElements.define('scatterplot-filtering', ScatterplotFiltering);

class DynamicPlotConfiguration extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.plotType = ''; // Default plot type is initially empty (unselected)
        this.dataSet = null;
        this.headers = null;
    }
    
    async connectedCallback() {
        await this.render();
        this.setupEventListeners();
        // this.shadowRoot.addEventListener('plotRequested', this.generatePlot.bind(this));

    }
    
    async render() {
        
        const template = document.createElement('template');
        const res = await fetch('./dynamicPlotTemplate.html');
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        template.innerHTML = doc.getElementById('dynamic-plot-template').innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    
        // Set up event listeners to change plot type and update configurations
        const plotTypeSelect = this.shadowRoot.querySelector('#plotTypeSelect');
        const selectedPlotType = this.shadowRoot.querySelector('#selectedPlotType');
        const selectLabel = this.shadowRoot.querySelector('#selectLabel');

        // Initially hide these elements
        this.shadowRoot.querySelector("#plotTypeSelect").style.display = 'none';
        this.shadowRoot.querySelector("#selectedPlotType").style.display = 'none';
        this.shadowRoot.querySelector("#selectLabel").style.display = 'none';

        plotTypeSelect.addEventListener('change', this.updatePlotType.bind(this));
        const csvInput = this.shadowRoot.querySelector('#csvInput');
        csvInput.addEventListener('change', this.handleFileUpload.bind(this));        
        this.updatePlotType(); // Call once to set the initial state

    }

    setupEventListeners() {
        this.shadowRoot.querySelector('#GenerateBoxPlot').addEventListener('click', this.generatePlot.bind(this));
    }
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const fileText = await this.readFile(file);
            console.log("File Content:", fileText);
            this.dataSet = this.csvToDict(fileText);
        }
        if (this.dataSet) { // If dataset has been successfully parsed
    
            // Show these elements
            this.shadowRoot.querySelector("#plotTypeSelect").style.display = 'block';
            this.shadowRoot.querySelector("#selectedPlotType").style.display = 'block';
            this.shadowRoot.querySelector("#selectLabel").style.display = 'block';
        }
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => resolve(event.target.result);
            reader.onerror = error => reject(error);
            reader.readAsText(file);
        });
    }
    
    csvToDict(csvText) {
        const rows = csvText.trim().split('\r').map(row => this.csvRowSplit(row));
    
        const headers = rows[0];
        console.log("Headers:", headers);
        this.headers = headers;
        const data = {};
        headers.forEach(header => data[header] = []);
    
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i];
            headers.forEach((header, index) => {
                data[header].push(cells[index]);
            });
        }
        console.log("Parsed Data:", data);
        return data;


    }
    
    csvRowSplit(row) {
        const result = [];
        let start = 0;
        let insideQuote = false;
    
        for (let i = 0; i < row.length; i++) {
            if (row[i] === '"') {
                insideQuote = !insideQuote;
            }
            if (row[i] === ',' && !insideQuote) {
                result.push(row.substring(start, i).trim().replace(/^"|"$/g, ''));
                start = i + 1;
            }
        }
    
        result.push(row.substring(start).trim().replace(/^"|"$/g, ''));
        return result;
    }
    
    generatePlot() {
        // Get all the configuration
        const configuration = this.getAllConfiguration();
        const plotContainer = this.shadowRoot.querySelector('#plotContainer');
        plotContainer.innerHTML = '';
        let dynamicPlotElement;

        switch(this.plotType) {
            case 'box':
                dynamicPlotElement = document.createElement('boxplot-card');
                break;
            case 'scatter':
                dynamicPlotElement = document.createElement('scatterplot-card');
                break;
            case 'line':
                dynamicPlotElement = document.createElement('lineplot-card');
                break;
        }
        plotContainer.appendChild(dynamicPlotElement);
        dynamicPlotElement.pendingDataset = this.dataSet;
        dynamicPlotElement.pendingConfiguration = configuration;

    }
    
         
    updatePlotType() {
        const plotTypeSelect = this.shadowRoot.querySelector('#plotTypeSelect');
        this.plotType = plotTypeSelect.value;

        // Display the selected plot type
        const selectedPlotType = this.shadowRoot.querySelector('#selectedPlotType');
        selectedPlotType.textContent = this.plotType;

        // Clear previous plot configuration
        const plotConfigContainer = this.shadowRoot.querySelector('#plotConfigContainer');
        plotConfigContainer.innerHTML = '';

        // Create a variable to store the configuration element
        let plotConfigElement;

        // Render the corresponding plot configuration based on the selected plot type
        switch(this.plotType) {
            case 'box':
                plotConfigElement = document.createElement('boxplot-filtering');
                break;
            case 'scatter':
                plotConfigElement = document.createElement('scatterplot-filtering');
                break;
            case 'line':
                plotConfigElement = document.createElement('lineplot-filtering');
                break;
        }

        if (plotConfigElement) {
            plotConfigContainer.appendChild(plotConfigElement);
            plotConfigElement.setDataColumns(this.headers);
        }
    } 
            
    getAllConfiguration() {
        let plotElement;
        
        switch(this.plotType) {
            case 'box':
                plotElement = this.shadowRoot.querySelector('boxplot-filtering');
                break;
            case 'scatter':
                plotElement = this.shadowRoot.querySelector('scatterplot-filtering');
                break;
            case 'line':
                plotElement = this.shadowRoot.querySelector('lineplot-filtering');
                break;
        }

        if (plotElement) {
            const configuration = plotElement.getConfiguration();
            console.log(configuration);
            return configuration;
        }
    }
        
    }
    
    // Define custom elements
window.customElements.define('dynamic-plot-configuration', DynamicPlotConfiguration);
          
class BoxplotCard extends HTMLElement {

    async connectedCallback() {
        const template = document.createElement('template');
        let res = await fetch( './configurableComponents.html' );
        var parser = new DOMParser();
        var doc = parser.parseFromString(await res.text(), 'text/html');
        template.innerHTML = doc.getElementById("plot-card").innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#statsbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").addEventListener('click', this.takeshot.bind(this)); 
        this.shadowRoot.querySelector("#statsbtn").addEventListener('click', this.download_table_as_csv.bind(this));
        console.log('pendingdataset');
        this.plot(this.pendingDataset, this.pendingConfiguration);
    }
    
    constructor(groupAttributes, valueAttribute){
        super();
        this.groupAttributes = groupAttributes; //list[str]
        this.valueAttribute = valueAttribute; //str
        this.attachShadow({ mode: 'open'});
        this.summaryData = {};
        this.boxPlotConfig = {};
    }

    plotData(plotRoot, plot_data, boxplotConfig, tickvals, ticktext) {
        console.log('plotdata function', boxplotConfig)
        const xVariable = boxplotConfig.X;
        const yVariable = boxplotConfig.Y;
        const clusterVariable = boxplotConfig.Cluster;

        const title = boxplotConfig.AdditionalConfigurations?.Title || `${xVariable} vs ${yVariable} clustered by ${clusterVariable}`;
        const xLabel = boxplotConfig.AdditionalConfigurations?.['X Label'] || xVariable;
        const yLabel = boxplotConfig.AdditionalConfigurations?.['Y Label'] || yVariable;
    
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

            boxwidth: 0.6,
            boxgap: 0.5,
            width: 1500,
            height: 700,
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
        Plotly.newPlot(plotRoot, plot_data, layout,  { responsive: true });
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

        if (boxPlotConfig.Cluster !== 'NONE') {
        //Creating Frequency Row
        let row_1 = document.createElement('tr');
        let heading = document.createElement('th');
        heading.innerHTML = boxPlotConfig.Cluster;
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
        row_2_data.innerHTML = boxPlotConfig.X;
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
xHeader.innerHTML = boxPlotConfig.X;
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
        this.shadowRoot.querySelector("#ssbtn").style.display = 'block';
        // Extract the relevant data from the dataset
        const group_column_key = boxPlotConfig.Cluster ; 
        const x_column_key = boxPlotConfig.X ; 
        const y_column_key = boxPlotConfig.Y ; 

        let group_column = dataset[group_column_key];
        let x_column = dataset[x_column_key] ;
        let y_column = dataset[y_column_key] ;
        console.log(x_column);
        console.log(y_column);
        console.log('plot function',boxPlotConfig);

        this.toggleStatsButton(boxPlotConfig.ShowStatistics);
    
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
  
      titleRoot.innerText = `${x_column_key} vs ${y_column_key}`;
      if (boxPlotConfig.ShowStatistics) {
      summaryRoot.innerText = `${x_column_key} vs ${y_column_key} Summary`; }
  
      this.appendChild(titleRoot);
      this.appendChild(plotRoot);
      this.appendChild(summaryRoot);
    
        var graph_x_order = [];
        let compiled_data = {};

// Utility function to evaluate if a value satisfies a condition
function evaluateCondition(value, condition) {
    // Try to convert the value to a number
    let numValue = parseFloat(value);
    let isValueNumeric = !isNaN(numValue);

    let matchedOperators = condition.match(/[<=>]+/);
    if (!matchedOperators) {
        return true;  // default to not filtering if operator is invalid
    }

    let operator = matchedOperators[0];
    let threshold = condition.replace(operator, '').trim(); // Remove the operator to get the threshold value

    if (isValueNumeric) {
        threshold = parseFloat(threshold); // Convert threshold to number if value is numeric
        switch (operator) {
            case '>': return numValue > threshold;
            case '<': return numValue < threshold;
            case '>=': return numValue >= threshold;
            case '<=': return numValue <= threshold;
            case '=': return numValue === threshold;
            default: return true; // If operator is not recognized, return true (don't filter)
        }
    } else {
        // If the value is a string, only the '=' operator makes sense
        if (operator === '=') {
            return value === threshold;
        } else {
            return true; // If it's a string and the operator is not '=', don't filter
        }
    }
}
    

// Function to apply filters based on DataConfigurations
function applyGroupDataConfigurationsFilters(xData, yData, groupData, xFilter, yFilter, groupFilter) {
    let filteredXData = [];
    let filteredYData = [];
    let filteredGroupData = [];

    for (let i = 0; i < xData.length; i++) {
        if (evaluateCondition(xData[i], xFilter) && evaluateCondition(yData[i], yFilter) && evaluateCondition(groupData[i], groupFilter)) {
            filteredXData.push(xData[i]);
            filteredYData.push(yData[i]);
            filteredGroupData.push(groupData[i]);
        }
    }

    return [filteredXData, filteredYData, filteredGroupData];
}
// Function to apply filters based on DataConfigurations
function applyDataConfigurationsFilters(xData, yData, xFilter, yFilter) {
    let filteredXData = [];
    let filteredYData = [];

    for (let i = 0; i < xData.length; i++) {
        if (evaluateCondition(xData[i], xFilter) && evaluateCondition(yData[i], yFilter) ) {
            filteredXData.push(xData[i]);
            filteredYData.push(yData[i]);
        }
    }

    return [filteredXData, filteredYData];
}
let xFilter = boxPlotConfig.DataConfigurations[boxPlotConfig.X] || '';
let yFilter = boxPlotConfig.DataConfigurations[boxPlotConfig.Y] || '';
let groupFilter = boxPlotConfig.DataConfigurations[boxPlotConfig.Cluster] || '';
          
        if (group_column_key !== 'NONE'){
            [x_column, y_column, group_column] = applyGroupDataConfigurationsFilters(x_column, y_column, group_column, xFilter, yFilter, groupFilter);
 
        for (let i = 0; i < group_column.length; i++) {
            let grp_temp = group_column[i];
            let x_temp = x_column[i];
            let y_temp = y_column[i];

            
    
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
            [x_column, y_column] = applyDataConfigurationsFilters(x_column, y_column, xFilter, yFilter);
            for (let i = 0; i < x_column.length; i++) {
                let x_temp = x_column[i];
                let y_temp = y_column[i];

                
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
        let colorCounter = 0;

        function generateColor() {
            const colors = [
                "red", "blue", "green", "yellow", "purple", "orange", "cyan", "magenta",
                "lime", "pink", "teal", "lavender", "brown", "beige", "maroon", "navy",
                "olive", "turquoise", "silver", "gold", "coral", "salmon", "aubergine", 
                "tan", "royalblue", "plum", "peachpuff", "mediumseagreen", "lightcyan", 
                "darksalmon", "firebrick", "deepskyblue", "darkorchid", "cadetblue", 
                "burlywood", "aquamarine", "chartreuse", "dodgerblue", "fuchsia", 
                "goldenrod", "indigo", "khaki", "lightcoral", "mediumvioletred"
            ];            
            return colors[colorCounter++ % colors.length];
        }

        const colorMap = {};

        function getColorForXValue(x_value) {
            if (!colorMap[x_value]) {
                colorMap[x_value] = generateColor();
            }
            return colorMap[x_value];
        }

        let sortedClusters = Object.keys(compiled_data);
        if (boxPlotConfig.Cluster === 'NONE') {
            if (boxPlotConfig.Order === 'ascending') {
                sortedClusters.sort();
            } else if (boxPlotConfig.Order === 'descending') {
                sortedClusters.sort((a, b) => b.localeCompare(a)); // This will sort strings in descending order
            }
        
            for (let x_value of sortedClusters) {
               
        
                // Add box plots without fill color
                plot_data.push({
                    y: compiled_data[x_value],
                    x: Array(compiled_data[x_value].length).fill(currentXOffset),
                    type: 'box',
                    boxpoints: 'all',
                    jitter: 0.5,
                    name: x_value,
                    showlegend: false,
                    whiskerwidth: 0.6,
                });
        
                tickvals.push(currentXOffset);
                ticktext.push(x_value); // Labels are simply the x values
                currentXOffset ++;
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
            const currentColor = getColorForXValue(x_value);

            // Add box plots without fill color
            plot_data.push({
                y: groupData[x_value],
                x: Array(groupData[x_value].length).fill(currentXOffset),
                type: 'box',
                boxpoints: 'all',
                jitter: 0.5,
                line: { color: currentColor },
                name: x_value,
                showlegend: false
            });
        
        

            tickvals.push(currentXOffset); // Corresponding tick value for x-axis
            ticktext.push(`${cluster}-${x_value}`); // Corresponding label for x-axis
            currentXOffset += 0.1;
        }
        currentXOffset += 0.1;
    }
        
        }
    
        if (boxPlotConfig.Cluster === 'NONE') {
        
            for (let x_val in compiled_data) {
                let y_temp = this.convertToNumberArray(compiled_data[x_val]);
        
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
                let y_temp = this.convertToNumberArray(temp_dict[val]);
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
        this.plotData(plotRoot, plot_data, boxPlotConfig, tickvals, ticktext);
        if (boxPlotConfig.ShowStatistics) {
        this.createTable(summaryRoot, compiled_data, group_column_key, x_column, boxPlotConfig);}
    }
    convertToNumberArray(arr) {
        return arr.map(value => parseFloat(value));
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

window.customElements.define('boxplot-card', BoxplotCard);

class ScatterplotCard extends HTMLElement {

    async connectedCallback() {
        const template = document.createElement('template');
        let res = await fetch( './configurableComponents.html' );
        var parser = new DOMParser();
        var doc = parser.parseFromString(await res.text(), 'text/html');
        template.innerHTML = doc.getElementById("plot-card").innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#statsbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").addEventListener('click', this.takeshot.bind(this)); 
        console.log('pendingdataset');
        this.plot(this.pendingDataset, this.pendingConfiguration);
    }
    
    constructor(groupAttributes, valueAttribute){
        super();
        this.groupAttributes = groupAttributes; //list[str]
        this.valueAttribute = valueAttribute; //str
        this.attachShadow({ mode: 'open'});
        this.summaryData = {};
        this.scatterPlotConfig = {};
    }

   plotData(plotRoot, plot_data, scatterplotConfig) {
    console.log('plotdata function', scatterplotConfig)
    const xVariable = scatterplotConfig.X;
    const yVariable = scatterplotConfig.Y;
    const clusterVariable = scatterplotConfig.Cluster;

    const title = scatterplotConfig.AdditionalConfigurations?.Title || `${xVariable} vs ${yVariable} clustered by ${clusterVariable}`;
    const xLabel = scatterplotConfig.AdditionalConfigurations?.['X Label'] || xVariable;
    const yLabel = scatterplotConfig.AdditionalConfigurations?.['Y Label'] || yVariable;

    let layout = {
        title: title,
        yaxis: {
            title: yLabel,
            zeroline: false
        },
        xaxis: {
            title: xLabel,
            zeroline: false
        },
        width: 1500,
        height: 700,
        shapes: []  // Initialize the shapes array here
    };
    
    if (scatterplotConfig.HorizontalLine) {
        layout.shapes.push({
            type: 'line',
            x0: 0,
            x1: 1,
            xref: 'paper',
            y0: scatterplotConfig.HorizontalLine,
            y1: scatterplotConfig.HorizontalLine,
            line: {
                color: 'red',
                width: 2,
                dash: 'dash'
            }
        });
    }

    if (scatterplotConfig.VerticalLine) {
        layout.shapes.push({
            type: 'line',
            x0: scatterplotConfig.VerticalLine,
            x1: scatterplotConfig.VerticalLine,
            y0: 0,
            y1: 1,
            yref: 'paper',
            line: {
                color: 'red',
                width: 2,
                dash: 'dash'
            }
        });
    }

    if (scatterplotConfig.ShowOTO) {
        layout.shapes.push({
            type: 'line',
            x0: 0,
            x1: 1,
            xref: 'paper',
            y0: 0,
            y1: 1,
            yref: 'paper',
            line: {
                color: 'blue',
                width: 2
            }
        });
    }

    Plotly.newPlot(plotRoot, plot_data, layout, { responsive: true });

 
    
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

    plot(dataset, scatterPlotConfig) {
        this.shadowRoot.querySelector("#ssbtn").style.display = 'block';
        // Extract the relevant data from the dataset
        const group_column_key = scatterPlotConfig.Cluster ; 
        const x_column_key = scatterPlotConfig.X ; 
        const y_column_key = scatterPlotConfig.Y ; 

        let group_column = dataset[group_column_key];
        let x_column = dataset[x_column_key] ;
        let y_column = dataset[y_column_key] ;
        console.log(x_column);
        console.log(y_column);
        console.log('plot function',scatterPlotConfig);
    
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
    
        titleRoot.innerText = `${x_column_key} vs ${y_column_key}`;
    
        this.appendChild(titleRoot);
        this.appendChild(plotRoot);
        this.appendChild(summaryRoot);
 
    
        var graph_x_order = [];
        let compiled_data = {};

// Utility function to evaluate if a value satisfies a condition
function evaluateCondition(value, condition) {
    // Try to convert the value to a number
    let numValue = parseFloat(value);
    let isValueNumeric = !isNaN(numValue);

    let matchedOperators = condition.match(/[<=>]+/);
    if (!matchedOperators) {
        return true;  // default to not filtering if operator is invalid
    }

    let operator = matchedOperators[0];
    let threshold = condition.replace(operator, '').trim(); // Remove the operator to get the threshold value

    if (isValueNumeric) {
        threshold = parseFloat(threshold); // Convert threshold to number if value is numeric
        switch (operator) {
            case '>': return numValue > threshold;
            case '<': return numValue < threshold;
            case '>=': return numValue >= threshold;
            case '<=': return numValue <= threshold;
            case '=': return numValue === threshold;
            default: return true; // If operator is not recognized, return true (don't filter)
        }
    } else {
        // If the value is a string, only the '=' operator makes sense
        if (operator === '=') {
            return value === threshold;
        } else {
            return true; // If it's a string and the operator is not '=', don't filter
        }
    }
}
    

// Function to apply filters based on DataConfigurations
function applyGroupDataConfigurationsFilters(xData, yData, groupData, xFilter, yFilter, groupFilter) {
    let filteredXData = [];
    let filteredYData = [];
    let filteredGroupData = [];

    for (let i = 0; i < xData.length; i++) {
        if (evaluateCondition(xData[i], xFilter) && evaluateCondition(yData[i], yFilter) && evaluateCondition(groupData[i], groupFilter)) {
            filteredXData.push(xData[i]);
            filteredYData.push(yData[i]);
            filteredGroupData.push(groupData[i]);
        }
    }

    return [filteredXData, filteredYData, filteredGroupData];
}
// Function to apply filters based on DataConfigurations
function applyDataConfigurationsFilters(xData, yData, xFilter, yFilter) {
    let filteredXData = [];
    let filteredYData = [];

    for (let i = 0; i < xData.length; i++) {
        if (evaluateCondition(xData[i], xFilter) && evaluateCondition(yData[i], yFilter) ) {
            filteredXData.push(xData[i]);
            filteredYData.push(yData[i]);
        }
    }

    return [filteredXData, filteredYData];
}
let xFilter = scatterPlotConfig.DataConfigurations[scatterPlotConfig.X] || '';
let yFilter = scatterPlotConfig.DataConfigurations[scatterPlotConfig.Y] || '';
let groupFilter = scatterPlotConfig.DataConfigurations[scatterPlotConfig.Cluster] || '';
          
        if (group_column_key !== 'NONE'){
            [x_column, y_column, group_column] = applyGroupDataConfigurationsFilters(x_column, y_column, group_column, xFilter, yFilter, groupFilter);
 
        for (let i = 0; i < group_column.length; i++) {
            let grp_temp = group_column[i];
            let x_temp = x_column[i];
            let y_temp = y_column[i];

            
    
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
            [x_column, y_column] = applyDataConfigurationsFilters(x_column, y_column, xFilter, yFilter);
            for (let i = 0; i < x_column.length; i++) {
                let x_temp = x_column[i];
                let y_temp = y_column[i];

                
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
        let colorCounter = 0;

        function generateColor() {
            const colors = [
                "red", "blue", "green", "yellow", "purple", "orange", "cyan", "magenta",
                "lime", "pink", "teal", "lavender", "brown", "beige", "maroon", "navy",
                "olive", "turquoise", "silver", "gold", "coral", "salmon", "aubergine", 
                "tan", "royalblue", "plum", "peachpuff", "mediumseagreen", "lightcyan", 
                "darksalmon", "firebrick", "deepskyblue", "darkorchid", "cadetblue", 
                "burlywood", "aquamarine", "chartreuse", "dodgerblue", "fuchsia", 
                "goldenrod", "indigo", "khaki", "lightcoral", "mediumvioletred"
            ];            
            return colors[colorCounter++ % colors.length];
        }

        const colorMap = {};

        function getColorForXValue(x_value) {
            if (!colorMap[x_value]) {
                colorMap[x_value] = generateColor();
            }
            return colorMap[x_value];
        }

        let sortedClusters = Object.keys(compiled_data);
        if (scatterPlotConfig.Cluster === 'NONE') {
          
            plot_data.push({
                x: x_column,
                y: y_column,
                mode: 'markers',
                type: 'scatter',
                name: 'Data Points',
                marker: { color: 'blue', size: 4 }
                });
                
                if (scatterPlotConfig.ShowRegression) {

                    const [slope, intercept] = linearRegression(y_column, x_column);
                    // Generate y-values for the regression line
                    const regY = x_column.map(val => slope * val + intercept);
                    
                    // Add the regression line to the plot data
                    plot_data.push({
                        x: x_column,
                        y: regY,
                        mode: 'lines',
                        type: 'scatter',
                        line: { color: 'red' },
                        name: 'Regression Line'
                    });
                }
        }  else {
            const clusterSymbols = ['circle', 'cross', 'triangle-up', 'star','square',        // square
            'diamond',       // diamond
            'cross-open',    // an open X
            'triangle-down', // Triangle pointing down
            'hexagon',       // hexagon
            'star-open',     // open star
            'pentagon',      // pentagon
            'hourglass',     // hourglass shape
            'bowtie',        // bowtie shape
            'circle-open' ];
            const allClustersXValues = Object.keys(compiled_data).flatMap(cluster => Object.keys(compiled_data[cluster]));
            const minX = Math.min(...allClustersXValues);
            const maxX = Math.max(...allClustersXValues);
            const xRange = Array.from({length: maxX - minX + 1}, (_, i) => i + minX);
            for (let i = 0, len = sortedClusters.length; i < len; i++) {
                let cluster = sortedClusters[i];
                const groupData = compiled_data[cluster];
                const sortedXValues = Object.keys(groupData);
                
                const currentColor = getColorForXValue(cluster);
                const currentSymbol = clusterSymbols[i % clusterSymbols.length];  // Use modulo to avoid out-of-bounds
                
                let allYValues = [];
                let allXValues = [];
                
                for (let x_value of sortedXValues) {
                    allXValues.push(...Array(groupData[x_value].length).fill(x_value));
                    allYValues.push(...groupData[x_value]);
                    
                    plot_data.push({
                        x: Array(groupData[x_value].length).fill(x_value),
                        y: groupData[x_value],
                        mode: 'markers',
                        type: 'scatter',
                        marker: { 
                            color: currentColor,
                            size: 6,
                            symbol: currentSymbol  // Set the marker symbol here
                        },
                        showlegend: false
                    });
                }
                if (scatterPlotConfig.ShowRegression) {
                    // Compute regression parameters for the cluster
                    const [slope, intercept] = linearRegression(allYValues, allXValues);
                
                    // Generate y-values for the regression line over the entire x-range
                    const regY = xRange.map(val => slope * val + intercept);
                
                    // Add the regression line to the plot data
                    plot_data.push({
                        x: xRange,
                        y: regY,
                        mode: 'lines',
                        type: 'scatter',
                        line: { color: currentColor },
                        name: `${cluster} Regression`,
                        showlegend: false
                    });
                }
            }
}
function linearRegression(y, x) {
    // Convert string arrays to number arrays
    x = x.map(Number);
    y = y.map(Number);

    const n = y.length;
    let sum_x = 0;
    let sum_y = 0;
    let sum_xy = 0;
    let sum_xx = 0;

    for (let i = 0; i < n; i++) {
        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i] * y[i]);
        sum_xx += (x[i] * x[i]);
    }

    const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    const intercept = (sum_y - slope * sum_x) / n;

    return [slope, intercept];
}


           
    
        compiled_data = this.sortOnKeys(compiled_data, graph_x_order);
        this.summaryData = compiled_data;
        this.scatterPlotConfig = scatterPlotConfig;
        this.plotData(plotRoot, plot_data, scatterPlotConfig);
        
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

window.customElements.define('scatterplot-card', ScatterplotCard);

class LineplotCard extends HTMLElement {

    async connectedCallback() {
        const template = document.createElement('template');
        let res = await fetch( './configurableComponents.html' );
        var parser = new DOMParser();
        var doc = parser.parseFromString(await res.text(), 'text/html');
        template.innerHTML = doc.getElementById("plot-card").innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector("#statsbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").style.display = 'none';
        this.shadowRoot.querySelector("#ssbtn").addEventListener('click', this.takeshot.bind(this)); 
        console.log('pendingdataset');
        this.plot(this.pendingDataset, this.pendingConfiguration);
    }
    
    constructor(groupAttributes, valueAttribute){
        super();
        this.groupAttributes = groupAttributes; //list[str]
        this.valueAttribute = valueAttribute; //str
        this.attachShadow({ mode: 'open'});
        this.summaryData = {};
        this.linePlotConfig = {};
    }

   plotData(plotRoot, plot_data, linePlotConfig) {
    console.log('plotdata function', linePlotConfig)
    const xVariable = linePlotConfig.X;
    const yVariable = linePlotConfig.Y;
    const clusterVariable = linePlotConfig.Group;

    const title = linePlotConfig.AdditionalConfigurations?.Title || `${xVariable} vs ${yVariable} clustered by ${clusterVariable}`;
    const xLabel = linePlotConfig.AdditionalConfigurations?.['X Label'] || xVariable;
    const yLabel = linePlotConfig.AdditionalConfigurations?.['Y Label'] || yVariable;

    let layout = {
        title: title,
        yaxis: {
            title: yLabel,
            zeroline: false
        },
        xaxis: {
            title: xLabel
        },
        width: 1500,
        height: 700,
        shapes: []  // Initialize the shapes array here
    };
    

    Plotly.newPlot(plotRoot, plot_data, layout, {responsive: true});

    
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

    plot(dataset, linePlotConfig) {
        this.shadowRoot.querySelector("#ssbtn").style.display = 'block';
        // Extract the relevant data from the dataset
        const group_column_key = linePlotConfig.Group ; 
        const x_column_key = linePlotConfig.X ; 
        const y_column_key = linePlotConfig.Y ; 

        let group_column = dataset[group_column_key];
        let x_column = dataset[x_column_key] ;
        let y_column = dataset[y_column_key] ;
        console.log(x_column);
        console.log(y_column);
        console.log('plot function',linePlotConfig);

        this.toggleStatsButton(linePlotConfig.ShowStatistics);
    
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
    
        titleRoot.innerText = `${x_column_key} vs ${y_column_key}`;
    
        this.appendChild(titleRoot);
        this.appendChild(plotRoot);
        this.appendChild(summaryRoot);
    
        var graph_x_order = [];
        let compiled_data = {};

// Utility function to evaluate if a value satisfies a condition
function evaluateCondition(value, condition) {
    // Try to convert the value to a number
    let numValue = parseFloat(value);
    let isValueNumeric = !isNaN(numValue);

    let matchedOperators = condition.match(/[<=>]+/);
    if (!matchedOperators) {
        return true;  // default to not filtering if operator is invalid
    }

    let operator = matchedOperators[0];
    let threshold = condition.replace(operator, '').trim(); // Remove the operator to get the threshold value

    if (isValueNumeric) {
        threshold = parseFloat(threshold); // Convert threshold to number if value is numeric
        switch (operator) {
            case '>': return numValue > threshold;
            case '<': return numValue < threshold;
            case '>=': return numValue >= threshold;
            case '<=': return numValue <= threshold;
            case '=': return numValue === threshold;
            default: return true; // If operator is not recognized, return true (don't filter)
        }
    } else {
        // If the value is a string, only the '=' operator makes sense
        if (operator === '=') {
            return value === threshold;
        } else {
            return true; // If it's a string and the operator is not '=', don't filter
        }
    }
}
    

// Function to apply filters based on DataConfigurations
function applyGroupDataConfigurationsFilters(xData, yData, groupData, xFilter, yFilter, groupFilter) {
    let filteredXData = [];
    let filteredYData = [];
    let filteredGroupData = [];

    for (let i = 0; i < xData.length; i++) {
        if (evaluateCondition(xData[i], xFilter) && evaluateCondition(yData[i], yFilter) && evaluateCondition(groupData[i], groupFilter)) {
            filteredXData.push(xData[i]);
            filteredYData.push(yData[i]);
            filteredGroupData.push(groupData[i]);
        }
    }

    return [filteredXData, filteredYData, filteredGroupData];
}
// Function to apply filters based on DataConfigurations
function applyDataConfigurationsFilters(xData, yData, xFilter, yFilter) {
    let filteredXData = [];
    let filteredYData = [];

    for (let i = 0; i < xData.length; i++) {
        if (evaluateCondition(xData[i], xFilter) && evaluateCondition(yData[i], yFilter) ) {
            filteredXData.push(xData[i]);
            filteredYData.push(yData[i]);
        }
    }

    return [filteredXData, filteredYData];
}
let xFilter = linePlotConfig.DataConfigurations[linePlotConfig.X] || '';
let yFilter = linePlotConfig.DataConfigurations[linePlotConfig.Y] || '';
let groupFilter = linePlotConfig.DataConfigurations[linePlotConfig.Group] || '';
          
        if (group_column_key !== 'NONE'){
            [x_column, y_column, group_column] = applyGroupDataConfigurationsFilters(x_column, y_column, group_column, xFilter, yFilter, groupFilter);
 
        for (let i = 0; i < group_column.length; i++) {
            let grp_temp = group_column[i];
            let x_temp = x_column[i];
            let y_temp = y_column[i];

            
    
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
            [x_column, y_column] = applyDataConfigurationsFilters(x_column, y_column, xFilter, yFilter);
            for (let i = 0; i < x_column.length; i++) {
                let x_temp = x_column[i];
                let y_temp = y_column[i];

                
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
       
        let sortedClusters = Object.keys(compiled_data);

        if (linePlotConfig.Group === 'NONE') {
        
            plot_data.push({
                x: x_column,
                y: y_column,
                mode: 'lines',
                type: 'scattergl',
                name: 'Data Points',
                line: {
                    color: 'blue'
                }
            });
        
        } else {
            const colors = ['red', 'green', 'blue', 'yellow', 'purple', "orange", "cyan", "magenta",
            "lime", "pink", "teal", "lavender", "brown", "beige", "maroon", "navy",
            "olive", "turquoise", "silver", "gold", "coral", "salmon", "aubergine", 
            "tan", "royalblue", "plum", "peachpuff", "mediumseagreen", "lightcyan", 
            "darksalmon", "firebrick", "deepskyblue", "darkorchid", "cadetblue", 
            "burlywood", "aquamarine", "chartreuse", "dodgerblue"];
            for (let i = 0, len = sortedClusters.length; i < len; i++) {
                let cluster = sortedClusters[i];
                const groupData = compiled_data[cluster];
                const sortedXValues = Object.keys(groupData);
        
                const currentColor = colors[i % colors.length];  // Use modulo to avoid out-of-bounds
        
                let allYValues = [];
                let allXValues = [];
        
                for (let x_value of sortedXValues) {
                    allXValues.push(...Array(groupData[x_value].length).fill(x_value));
                    allYValues.push(...groupData[x_value]);
                }
        
                plot_data.push({
                    x: allXValues,
                    y: allYValues,
                    mode: 'lines',
                    type: 'scattergl',
                    line: { color: currentColor },
                    name: cluster  // setting name for legend
                });
            }
        }

        compiled_data = this.sortOnKeys(compiled_data, graph_x_order);
        this.summaryData = compiled_data;
        this.linePlotConfig = linePlotConfig;
        this.plotData(plotRoot, plot_data, linePlotConfig);
        
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

window.customElements.define('lineplot-card', LineplotCard);
