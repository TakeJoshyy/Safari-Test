let pokemonNames = [];
let tmNames = [];
let moveTutorNames = []; // Added to prevent errors

const areaData = {
    Tuesday: [
        { location: '36', levels: '54', rate: '20%' },
        { location: '36', levels: '54', rate: '20%' },
        { location: '38', levels: '48', rate: '10%' },
        { location: '39', levels: '54', rate: '10%' },
        { location: '39', levels: '54', rate: '10%' },
        { location: '41', levels: '42', rate: '5%' },
        { location: '41', levels: '42', rate: '5%' },
        { location: '41', levels: '45', rate: '5%' },
        { location: '41', levels: '45', rate: '5%' },
        { location: '41', levels: '51', rate: '10%' }
    ],
    Thursday: [
        { location: '36', levels: '54', rate: '20%' },
        { location: '36', levels: '54', rate: '10%' },
        { location: '38', levels: '48', rate: '5%' },
        { location: '39', levels: '54', rate: '20%' },
        { location: '39', levels: '54', rate: '10%' },
        { location: '41', levels: '42', rate: '5%' },
        { location: '41', levels: '42', rate: '5%' },
        { location: '41', levels: '45', rate: '10%' },
        { location: '41', levels: '45', rate: '10%' },
        { location: '41', levels: '51', rate: '5%' }
    ],
    Saturday: [
        { location: '36', levels: '54', rate: '20%' },
        { location: '36', levels: '54', rate: '10%' },
        { location: '38', levels: '48', rate: '5%' },
        { location: '39', levels: '54', rate: '20%' },
        { location: '39', levels: '54', rate: '10%' },
        { location: '41', levels: '42', rate: '5%' },
        { location: '41', levels: '42', rate: '5%' },
        { location: '41', levels: '45', rate: '10%' },
        { location: '41', levels: '45', rate: '10%' },
        { location: '41', levels: '51', rate: '5%' }
    ],
};

const items = [
    'Rare Candy', 'Big Mushroom', 'Tiny Mushroom', 'Dawn Stone', 'Dusk Stone', 'Fire Stone', 'Ice Stone', 'Leaf Stone',
    'Moon Stone', 'Shiny Stone', 'Sun Stone', 'Thunder Stone', 'Water Stone', 'Dubious Disc', 'Up-Grade', 'Razer Fang',
    'Razer Claw', 'Deep Sea Scale', 'Deep Sea Tooth', 'Dragon Scale', 'Kings Rock', 'Metal Coat', 'Linking Cord'
];

// Initialize Pokémon tables
function initializePokemonTables() {
    // Map area names to HTML data-area attributes
    const areaMap = {
        Tuesday: 'center',
        Thursday: 'north',
        Saturday: 'south' 
    };
    Object.keys(areaMap).forEach(area => {
        const table = document.querySelector(`table[data-area="${areaMap[area]}"] tbody`);
        if (!table) return;
        table.innerHTML = '';
        areaData[area].forEach((rowData, idx) => {
            addPokemonRow(table, area, rowData.location, rowData.levels, rowData.rate);
        });
    });
}

// Add a row to Pokémon table
function addPokemonRow(tbody, area, locationType, levels, rate) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${locationType}</td>
        <td class="datalist-container">
            <input type="text" class="pokemon-input" list="pokemon-list-${area}-${tbody.children.length}">
            <datalist id="pokemon-list-${area}-${tbody.children.length}">
                ${pokemonNames.map(name => `<option value="${name}">`).join('')}
            </datalist>
        </td>
        <td>${levels}</td>
        <td>${rate}</td>
        <td><input type="checkbox" class="scout-checkbox"></td>
        <td>
            <select name="considering" onchange="toggleRowColor(this)">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
            </select>
        </td>
    `;
    tbody.appendChild(row);
}

// Toggle row color based on Considering
function toggleRowColor(select) {
    const row = select.closest('tr');
    if (select.value === 'Yes') {
        row.classList.add('considering-yes');
    } else {
        row.classList.remove('considering-yes');
    }
}

// Initialize Items table
function initializeItemsTable() {
    const tbody = document.querySelector('#items-table tbody');
    tbody.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item}</td>
            <td><input type="number" name="quantity" min="0"></td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize TMs table
function initializeTmsTable() {
    const tbody = document.querySelector('#tms-table tbody');
    tbody.innerHTML = ''; // Clear previous rows
    addTmRow(tbody);
}

function addTmRow(tbody) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="datalist-container">
            <input type="text" list="tm-list-${tbody.children.length}" oninput="addNewTmRow(this)">
            <datalist id="tm-list-${tbody.children.length}">
                ${tmNames.map(tm => `<option value="${tm}">`).join('')}
            </datalist>
        </td>
    `;
    tbody.appendChild(row);
}

function addNewTmRow(input) {
    if (input.value && tmNames.includes(input.value)) {
        const tbody = input.closest('tbody');
        // Only add if last row is filled
        if (input === tbody.lastElementChild.querySelector('input')) {
            addTmRow(tbody);
        }
    }
}

// Initialize Move Tutors table
function initializeMoveTutorsTable() {
    const tbody = document.querySelector('#moveTutors-table tbody');
    if (!tbody || !moveTutorNames.length) return;
    tbody.innerHTML = '';
    moveTutorNames.forEach((moveTutor, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${moveTutor}</td>
            <td>
                <select class="tm-select">
                    <option value="">Select TM</option>
                    ${tmNames.map(tm => `<option value="${tm}">${tm}</option>`).join('')}
                </select>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize Favorites table
function initializeFavoritesTable() {
    const inputs = document.querySelectorAll('#favorites-table .pokemon-input');
    inputs.forEach(input => {
        const datalist = document.createElement('datalist');
        datalist.id = `pokemon-list-fav-${Math.random().toString(36).substr(2, 9)}`;
        datalist.innerHTML = pokemonNames.map(name => `<option value="${name}">`).join('');
        input.setAttribute('list', datalist.id);
        input.parentElement.appendChild(datalist);
    });
}

// Initialize Pivots table
function initializePivotsTable() {
    const inputs = document.querySelectorAll('#pivots-table .pokemon-input');
    inputs.forEach(input => {
        const datalist = document.createElement('datalist');
        datalist.id = `pokemon-list-pivot-${Math.random().toString(36).substr(2, 9)}`;
        datalist.innerHTML = pokemonNames.map(name => `<option value="${name}">`).join('');
        input.setAttribute('list', datalist.id);
        input.parentElement.appendChild(datalist);
    });
}

// Toggle collapse/expand of area boxes
function toggleCollapse(btn) {
    const box = btn.closest('.area-box, .box');
    box.classList.toggle('collapsed');
    btn.textContent = box.classList.contains('collapsed') ? '+' : '−';
}

window.toggleCollapse = toggleCollapse;

// Attach autocomplete to all .pokemon-input fields
function attachPokemonAutocomplete() {
    document.querySelectorAll('.pokemon-input').forEach(input => {
        input.addEventListener('input', function () {
            showAutocomplete(this, pokemonNames);
        });
        input.addEventListener('blur', function () {
            setTimeout(() => removeAutocomplete(this), 100); // Delay to allow click
        });
    });
}

// Show autocomplete dropdown
function showAutocomplete(input, names) {
    removeAutocomplete(input);
    const value = input.value.toLowerCase();
    if (!value) return;
    const matches = names.filter(name => name.toLowerCase().includes(value)).slice(0, 10);
    if (matches.length === 0) return;

    const list = document.createElement('div');
    list.className = 'autocomplete-list';
    list.style.position = 'absolute';
    list.style.background = '#fff';
    list.style.border = '1px solid #ccc';
    list.style.zIndex = 1000;
    list.style.maxHeight = '150px';
    list.style.overflowY = 'auto';

    matches.forEach(name => {
        const item = document.createElement('div');
        item.textContent = name;
        item.className = 'autocomplete-item';
        item.style.padding = '2px 8px';
        item.style.cursor = 'pointer';
        item.addEventListener('mousedown', function () {
            input.value = name;
            removeAutocomplete(input);
        });
        list.appendChild(item);
    });

    input.parentElement.appendChild(list);
    list.style.width = input.offsetWidth + 'px';
    list.style.top = input.offsetTop + input.offsetHeight + 'px';
    list.style.left = input.offsetLeft + 'px';
}

// Remove autocomplete dropdown
function removeAutocomplete(input) {
    const list = input.parentElement.querySelector('.autocomplete-list');
    if (list) list.remove();
}

// Call this after initializing tables
function refreshAutocompletes() {
    attachPokemonAutocomplete();
}

// Update initialization to refresh autocompletes
document.addEventListener('DOMContentLoaded', () => {
    initializeItemsTable();
    initializeTmsTable();
    // initializeMoveTutorsTable(); // Uncomment if needed
    fetch('names.json')
        .then(res => res.json())
        .then(names => {
            pokemonNames = names;
            initializePokemonTables();
            initializeFavoritesTable();
            initializePivotsTable();
            refreshAutocompletes();
        });
});