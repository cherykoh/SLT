class BoxplotFiltering extends HTMLElement {


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
            this.setDataColumns(['DOMAIN', 'TEST_TEMPERATURE', 'PMM', 'TEST_POINT', 'LOT_ID',
            'DIAGNOSTICS', 'TEST_PROGRAM', 'TEST_CODE', 'CORE_WGP_CONF']);
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
            this.shadowRoot.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
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
            group.innerHTML = this.generateOptions(this.columnNames);
            cluster.innerHTML = this.generateOptions(this.columnNames);
            categoryFilter2.innerHTML = this.generateOptions(this.columnNames);

            cluster.insertAdjacentHTML('afterbegin', '<option value="NONE" selected>NONE</option>');
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
    
            const filterString = `${categoryFilter2Value} ${comparisonFilterValue}"${textFilter2Value}"`;

            if (!this.dataFilters.includes(filterString)) {
                this.dataFilters.push(filterString);
                this.renderDataFilters();
        }
    }
    
        onSubmit(event) {
            event.preventDefault();
            console.log('hello');
            const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
            const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
            const clusterValue = this.shadowRoot.querySelector('#cluster').value;
            const groupValue = this.shadowRoot.querySelector('#group').value;
            const orderValue = this.shadowRoot.querySelector('#order').value;
            const showStatisticsValue = this.shadowRoot.querySelector('#showStatistics').checked;
            const horizontalLineValue = this.shadowRoot.querySelector('#horizontalLine').value;

            const dataFiltersString = this.dataFilters.join(",");
            const additionalFiltersString = this.additionalFilters.join(",");
    
            const filterString = `X: ${xVariableValue}\n Y: ${yVariableValue}\n Cluster: ${clusterValue}\n 
            Group: ${groupValue}\n Order: ${orderValue} \n Horizontal Line: ${horizontalLineValue} \n 
            Show Statistics: ${showStatisticsValue} \n Data Filters: ${dataFiltersString} \n
            Additional Filters: ${additionalFiltersString}`;

            if (!this.filters.some(existingFilter => existingFilter === filterString)) {
                this.filters.pop();
                this.filters.push(filterString);
                this.renderAllFilters();
            }
        }
    
        onClearClick1() {
            if (this.dataFilters.length > 0) {
                this.dataFilters.pop();
                this.renderDataFilters();
            }
        }

        onClearClick2() {
            if (this.additionalFilters.length > 0) {
                this.additionalFilters.pop();
                this.renderAdditionalFilters();
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
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString;
            }
        
            return filtersDictionary;
        }

        getAdditionalFilters() {
            const filtersDictionary = {};
        
            for (const filter of this.additionalFilters) {
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString.slice(1);
            }
        
            return filtersDictionary;
    }
        

        getConfiguration() {
            const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
            const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
            const clusterValue = this.shadowRoot.querySelector('#cluster').value;
            const groupValue = this.shadowRoot.querySelector('#group').value;
            const orderValue = this.shadowRoot.querySelector('#order').value;
            const showStatisticsValue = this.shadowRoot.querySelector('#showStatistics').checked;
            const horizontalLineValue = this.shadowRoot.querySelector('#horizontalLine').value;

            const dataFiltersDictionary = this.getDataFilters();
            const additionalFiltersDictionary = this.getAdditionalFilters();
    
            return {
                X: xVariableValue,
                Y: yVariableValue,
                Cluster: clusterValue,
                Group: groupValue,
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
        this.setDataColumns(['DOMAIN', 'TEST_TEMPERATURE', 'PMM', 'TEST_POINT', 'LOT_ID',
        'DIAGNOSTICS', 'TEST_PROGRAM', 'TEST_CODE', 'CORE_WGP_CONF']);
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
        this.shadowRoot.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
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

    const filterString = `${categoryFilter2Value} ${comparisonFilterValue}"${textFilter2Value}"`;

    if (!this.dataFilters.includes(filterString)) {
        this.dataFilters.push(filterString);
        this.renderDataFilters();
    }
}

    onSubmit(event) {
        event.preventDefault();
        console.log('hello');
        const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
        const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
        const groupValue = this.shadowRoot.querySelector('#group').value;
        const functionValue = this.shadowRoot.querySelector('#function').value;


        const dataFiltersString = this.dataFilters.join(",");
        const additionalFiltersString = this.additionalFilters.join(",");

        const filterString = `X: ${xVariableValue}\n Y: ${yVariableValue}\n 
        Group: ${groupValue}\n  Function: ${functionValue} \n Data Filters: ${dataFiltersString} \n
        Additional Filters: ${additionalFiltersString}`;

        if (!this.filters.some(existingFilter => existingFilter === filterString)) {
            this.filters.pop();
            this.filters.push(filterString);
            this.renderAllFilters();
        }
    }

    onClearClick1() {
        if (this.dataFilters.length > 0) {
            this.dataFilters.pop();
            this.renderDataFilters();
        }
    }

    onClearClick2() {
        if (this.additionalFilters.length > 0) {
            this.additionalFilters.pop();
            this.renderAdditionalFilters();
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
            const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
            filtersDictionary[filterName] = restOfString;
        }
    
        return filtersDictionary;
    }     


    getAdditionalFilters() {
        const filtersDictionary = {};
        
            for (const filter of this.additionalFilters) {
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString.slice(1);
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
        #group
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
                this.setDataColumns(['DOMAIN', 'TEST_TEMPERATURE', 'PMM', 'TEST_POINT', 'LOT_ID',
                'DIAGNOSTICS', 'TEST_PROGRAM', 'TEST_CODE', 'CORE_WGP_CONF']);
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
                this.shadowRoot.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
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
                group.innerHTML = this.generateOptions(this.columnNames);
                cluster.innerHTML = this.generateOptions(this.columnNames);
                categoryFilter2.innerHTML = this.generateOptions(this.columnNames);
    
                cluster.insertAdjacentHTML('afterbegin', '<option value="NONE" selected>NONE</option>');
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
    
            const filterString = `${categoryFilter2Value} ${comparisonFilterValue}"${textFilter2Value}"`;

            if (!this.dataFilters.includes(filterString)) {
                this.dataFilters.push(filterString);
                this.renderDataFilters();
        }
    }
        
            onSubmit(event) {
                event.preventDefault();
                console.log('hello');
                const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
                const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
                const clusterValue = this.shadowRoot.querySelector('#cluster').value;
                const groupValue = this.shadowRoot.querySelector('#group').value;
                const verticalLineValue = this.shadowRoot.querySelector('#verticalLine').value;
                const horizontalLineValue = this.shadowRoot.querySelector('#horizontalLine').value;
                const showRegLineValue = this.shadowRoot.querySelector('#showRegLine').checked;
                const showXYLineValue = this.shadowRoot.querySelector('#showXYLine').checked;
    
                const dataFiltersString = this.dataFilters.join(",");
                const additionalFiltersString = this.additionalFilters.join(",");
        
                const filterString = `X: ${xVariableValue}\n Y: ${yVariableValue}\n Cluster: ${clusterValue}\n 
                Group: ${groupValue}\n  Horizontal Line: ${horizontalLineValue} \n 
                Vertical Line: ${verticalLineValue} \n Show Regression Line: ${showRegLineValue} \n 
                Show X=Y Line: ${showXYLineValue} \n Data Filters: ${dataFiltersString} \n
                Additional Filters: ${additionalFiltersString}`;
    
                if (!this.filters.some(existingFilter => existingFilter === filterString)) {
                    this.filters.pop();
                    this.filters.push(filterString);
                    this.renderAllFilters();
                }
            }
        
            onClearClick1() {
                if (this.dataFilters.length > 0) {
                    this.dataFilters.pop();
                    this.renderDataFilters();
                }
            }
    
            onClearClick2() {
                if (this.additionalFilters.length > 0) {
                    this.additionalFilters.pop();
                    this.renderAdditionalFilters();
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
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString;
            }
        
            return filtersDictionary;
            }
    
            getAdditionalFilters() {
                const filtersDictionary = {};
        
            for (const filter of this.additionalFilters) {
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString.slice(1);
            }
        
            return filtersDictionary;
            }
    
            getConfiguration() {
                const xVariableValue = this.shadowRoot.querySelector('#xVariable').value;
                const yVariableValue = this.shadowRoot.querySelector('#yVariable').value;
                const clusterValue = this.shadowRoot.querySelector('#cluster').value;
                const groupValue = this.shadowRoot.querySelector('#group').value;
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
                    Group: groupValue,
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
    }
    
    async connectedCallback() {
        await this.render();
    }
    
    async render() {
        const template = document.createElement('template');
        const res = await fetch('./dynamicPlotTemplate.html');
        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
        template.innerHTML = doc.getElementById('dynamic-plot-template').innerHTML;
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    
        // Set up event listeners to change plot type and update configurations
        const plotTypeSelect = this.shadowRoot.querySelector('#plotTypeSelect');
        plotTypeSelect.addEventListener('change', this.updatePlotType.bind(this));
    
        this.updatePlotType(); // Call once to set the initial state
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
    
        // Render the corresponding plot configuration based on the selected plot type
        if (this.plotType === 'box') {
        const boxplotConfig = document.createElement('boxplot-filtering');
        plotConfigContainer.appendChild(boxplotConfig);
        } else if (this.plotType === 'scatter') {
        const scatterplotConfig = document.createElement('scatterplot-filtering');
        plotConfigContainer.appendChild(scatterplotConfig);
        } else if (this.plotType === 'line') {
        const lineplotConfig = document.createElement('lineplot-filtering');
        plotConfigContainer.appendChild(lineplotConfig);
        }
    }

    getAllConfiguration() {
        if (this.plotType === 'box') {
        console.log('hello');
        const plotElement = this.shadowRoot.querySelector('boxplot-filtering');
        // Call a function from the BoxplotFiltering element
        if (plotElement) {
            console.log('hello');
          const configuration = plotElement.getConfiguration(); // Call the function you want
          console.log(configuration);
        }
      }
      else if (this.plotType === 'scatter') {
        // Access the BoxplotFiltering element within the shadow DOM
        const plotElement = this.shadowRoot.querySelector('scatterplot-filtering');
        // Call a function from the BoxplotFiltering element
        if (plotElement) {
          const configuration = plotElement.getConfiguration(); // Call the function you want
          console.log(configuration);

        }
      }
      else if (this.plotType === 'line') {
        // Access the BoxplotFiltering element within the shadow DOM
        const plotElement = this.shadowRoot.querySelector('lineplot-filtering');
        // Call a function from the BoxplotFiltering element
        if (plotElement) {
          const configuration = plotElement.getConfiguration(); // Call the function you want
          console.log(configuration);
        }
      }
    }
    }
    
    // Define custom elements
window.customElements.define('dynamic-plot-configuration', DynamicPlotConfiguration);
          