class DataFilteringComponent extends HTMLElement {

    #categoryFilter
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.filterNames = [];
            this.filters = [];
        }
    
        async setFilterNames(filterNames) {
            this.filterNames = filterNames;
            await this.updateCategoryFilterOptions();
    
        }
    
        async connectedCallback() {
            await this.render(); // Attach shadow DOM before accessing elements
            this.setupEventListeners();
            const filteringComponent = document.querySelector('data-filtering');
            filteringComponent.setFilterNames(['DOMAIN', 'TEST_TEMPERATURE', 'PMM', 'TEST_POINT', 'LOT_ID',
            'DIAGNOSTICS', 'TEST_PROGRAM', 'TEST_CODE', 'CORE_WGP_CONF']);
        }
    
        async render() {
    
            // Fetch the HTML content from a separate file
            const template = document.createElement('template');
            const res = await fetch('./dataFilteringTemplate.html');
    
            const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    
            // Get the template content based on its id
            template.innerHTML = doc.getElementById('data-filtering-template').innerHTML;

            // Append the template content to the Shadow DOM
            this.shadowRoot.appendChild(template.content.cloneNode(true));
    
            // Update category fields options
            await this.updateCategoryFilterOptions();
    

        }
    
        setupEventListeners() {
            console.log('Setting up event listeners...');
            this.shadowRoot.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
            this.shadowRoot.querySelector('#clearButton').addEventListener('click', this.onClearClick.bind(this));
        }
    
        async updateCategoryFilterOptions() {
    
            const categoryFilter = this.shadowRoot.querySelector('#categoryFilter');
            console.log('categoryFilter:', categoryFilter); // Check if categoryFilter is null
            
            // Check if the categoryFilter element is not null before updating its content
            if (categoryFilter) {
                categoryFilter.innerHTML = this.generateOptions(this.filterNames);
            } else {
                 console.log('categoryFilter element not found');
            }
        }
        
    
        generateOptions(filterNames) {
            return filterNames.map(filterName =>
                `<option value="${filterName}">${filterName}</option>`
            ).join('');
        }
    
        onSubmit(event) {
            event.preventDefault();
    
            const categoryFilterValue = this.shadowRoot.querySelector('#categoryFilter').value;
            const comparisonFilterValue = this.shadowRoot.querySelector('#comparisonFilter').value;
            const textFilterValue = this.shadowRoot.querySelector('#textFilter').value;
    
            const filterString = `${categoryFilterValue} ${comparisonFilterValue}"${textFilterValue}"`;
            if (!this.filters.includes(filterString)) {
                this.filters.push(filterString);
                this.renderFilters();
            }
        }
    
        onClearClick() {
            if (this.filters.length > 0) {
                this.filters.pop();
                this.renderFilters();
            }
        }
        
    
        renderFilters() {
            const filterOutput = this.shadowRoot.querySelector('#filterOutput');
            if (filterOutput) {
                filterOutput.innerHTML = this.filters.join('<br>');
            }
        }
        
    
        getFilters() {
            const filtersDictionary = {};
        
            for (const filter of this.filters) {
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString;
            }
        
            return filtersDictionary;
        }
        
    }
    
    window.customElements.define('data-filtering', DataFilteringComponent);
    
class AdditionalConfiguration extends HTMLElement {

#categoryFilter
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.filterNames = [];
        this.filters = [];
    }

    async setFilterNames(filterNames) {
        this.filterNames = filterNames;
        await this.updateCategoryFilterOptions();

    }

    async connectedCallback() {
        await this.render(); // Attach shadow DOM before accessing elements
        this.setupEventListeners();
        const additionalFilteringComponent = document.querySelector('additional-configuration');
        additionalFilteringComponent.setFilterNames(['DOMAIN', 'TEST_TEMPERATURE', 'PMM', 'TEST_POINT', 'LOT_ID',
        'DIAGNOSTICS', 'TEST_PROGRAM', 'TEST_CODE', 'CORE_WGP_CONF']);
    }

    async render() {

        // Fetch the HTML content from a separate file
        const template = document.createElement('template');
        const res = await fetch('./additionalConfigurationTemplate.html');

        const doc = new DOMParser().parseFromString(await res.text(), 'text/html');

        // Get the template content based on its id
        template.innerHTML = doc.getElementById('additional-configuration-template').innerHTML;

        // Append the template content to the Shadow DOM
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    
        // Update category fields options
        await this.updateCategoryFilterOptions();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        this.shadowRoot.querySelector('form').addEventListener('submit', this.onSubmit.bind(this));
        this.shadowRoot.querySelector('#clearButton').addEventListener('click', this.onClearClick.bind(this));
    }

    async updateCategoryFilterOptions() {

        const categoryFilter = this.shadowRoot.querySelector('#categoryFilter');
        console.log('categoryFilter:', categoryFilter); // Check if categoryFilter is null
        
        // Check if the categoryFilter element is not null before updating its content
        if (categoryFilter) {
            categoryFilter.innerHTML = this.generateOptions(this.filterNames);
        } else {
             console.log('categoryFilter element not found');
        }
    }
    

    generateOptions(filterNames) {
        return filterNames.map(filterName =>
            `<option value="${filterName}">${filterName}</option>`
        ).join('');
    }

    onSubmit(event) {
            event.preventDefault();
    
            const categoryFilterValue = this.shadowRoot.querySelector('#categoryFilter').value;
            const textFilterValue = this.shadowRoot.querySelector('#textFilter').value;
    
            const filterString = `${categoryFilterValue} ="${textFilterValue}"`;
            if (!this.filters.includes(filterString)) {
                this.filters.push(filterString);
                this.renderFilters();
            }
        }

    onClearClick() {
        if (this.filters.length > 0) {
            this.filters.pop();
            this.renderFilters();
        }
    }
    

    renderFilters() {
        const filterOutput = this.shadowRoot.querySelector('#filterOutput');
        if (filterOutput) {
            filterOutput.innerHTML = this.filters.join('<br>');
        }
    }
    

    getFilters() {
        const filtersDictionary = {};
        
            for (const filter of this.filters) {
                const [filterName, restOfString] = filter.split(' ', 2); // Split at most two parts
                filtersDictionary[filterName] = restOfString.slice(1);
            }
        
            return filtersDictionary;
    }
}

window.customElements.define('additional-configuration', AdditionalConfiguration);


