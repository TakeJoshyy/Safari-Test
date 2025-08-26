let pokemonNames = [];
let tmNames = [];
const areaData = {
    center: [
        { location: 'Grass', levels: '33', rate: '20%' },
        { location: 'Grass', levels: '36-38', rate: '20%' },
        { location: 'Grass', levels: '38', rate: '20%' },
        { location: 'Grass', levels: '33', rate: '15%' },
        { location: 'Grass', levels: '47', rate: '10%' },
        { location: 'Grass', levels: '47', rate: '5%' },
        { location: 'Grass', levels: '45', rate: '5%' },
        { location: 'Grass', levels: '35', rate: '4%' },
        { location: 'Grass', levels: '35', rate: '1%' },
        { location: 'Rod', levels: '23-38', rate: '4%' },
        { location: 'Rod', levels: '30-45', rate: '15%' },
        { location: 'Rod', levels: '23-38', rate: '1%' },
        { location: 'Rod', levels: '23-53', rate: '40%' },
        { location: 'Rod', levels: '38-53', rate: '40%' }
    ],
    north: [
        { location: 'Grass', levels: '45', rate: '20%' },
        { location: 'Grass', levels: '38-41', rate: '20%' },
        { location: 'Grass', levels: '39', rate: '20%' },
        { location: 'Grass', levels: '35', rate: '15%' },
        { location: 'Grass', levels: '45', rate: '10%' },
        { location: 'Grass', levels: '45', rate: '5%' },
        { location: 'Grass', levels: '48', rate: '5%' },
        { location: 'Grass', levels: '39', rate: '4%' },
        { location: 'Grass', levels: '42', rate: '1%' },
        { location: 'Rod', levels: '23-38', rate: '4%' },
        { location: 'Rod', levels: '30-45', rate: '15%' },
        { location: 'Rod', levels: '23-38', rate: '1%' },
        { location: 'Rod', levels: '23-53', rate: '40%' },
        { location: 'Rod', levels: '38-53', rate: '40%' }
    ],
    west: [
        { location: 'Grass', levels: '33', rate: '20%' },
        { location: 'Grass', levels: '38-41', rate: '20%' },
        { location: 'Grass', levels: '39', rate: '20%' },
        { location: 'Grass', levels: '35', rate: '15%' },
        { location: 'Grass', levels: '45', rate: '10%' },
        { location: 'Grass', levels: '45', rate: '5%' },
        { location: 'Grass', levels: '48', rate: '5%' },
        { location: 'Grass', levels: '38', rate: '4%' },
        { location: 'Grass', levels: '42', rate: '1%' },
        { location: 'Rod', levels: '23-38', rate: '4%' },
        { location: 'Rod', levels: '30-45', rate: '15%' },
        { location: 'Rod', levels: '23-38', rate: '1%' },
        { location: 'Rod', levels: '23-53', rate: '40%' },
        { location: 'Rod', levels: '38-53', rate: '40%' }
    ],
    east: [
        { location: 'Grass', levels: '36', rate: '20%' },
        { location: 'Grass', levels: '35-38', rate: '20%' },
        { location: 'Grass', levels: '39', rate: '20%' },
        { location: 'Grass', levels: '33', rate: '15%' },
        { location: 'Grass', levels: '50', rate: '10%' },
        { location: 'Grass', levels: '36', rate: '5%' },
        { location: 'Grass', levels: '38', rate: '5%' },
        { location: 'Grass', levels: '38', rate: '4%' },
        { location: 'Grass', levels: '42', rate: '1%' },
        { location: 'Rod', levels: '23-38', rate: '4%' },
        { location: 'Rod', levels: '30-45', rate: '15%' },
        { location: 'Rod', levels: '23-38', rate: '1%' },
        { location: 'Rod', levels: '23-53', rate: '40%' },
        { location: 'Rod', levels: '38-53', rate: '40%' }
    ]
};

const items = [
    'Rare Candy', 'Big Mushroom', 'Tiny Mushroom', 'Dawn Stone', 'Dusk Stone', 'Fire Stone', 'Ice Stone', 'Leaf Stone',
    'Moon Stone', 'Shiny Stone', 'Sun Stone', 'Thunder Stone', 'Water Stone', 'Dubious Disc', 'Up-Grade', 'Razer Fang',
    'Razer Claw', 'Deep Sea Scale', 'Deep Sea Tooth', 'Dragon Scale', 'Kings Rock', 'Metal Coat', 'Linking Cord'
];

(async function () {
    try {
        // Fetch JSON files
        const pokemonResponse = await fetch('names.json');
        const tmResponse = await fetch('tms.json');
        const moveTutorResponse = await fetch('moveTutors.json');
        pokemonNames = await pokemonResponse.json();
        tmNames = await tmResponse.json();
        moveTutorNames = await moveTutorResponse.json();

        // Initialize tables
        initializePokemonTables();
        initializeItemsTable();
        initializeTmsTable();
        initializeMoveTutorsTable(); // <-- Add this line
        initializeFavoritesTable();
        initializePivotsTable();
        loadData();
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
})();

// Initialize Pokémon tables
function initializePokemonTables() {
    const areas = ['center', 'north', 'west', 'east'];
    areas.forEach(area => {
        const table = document.querySelector(`table[data-area="${area}"] tbody`);
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
        addTmRow(tbody);
    }
}

// Initialize Move Tutors table
function initializeMoveTutorsTable() {
    const tbody = document.querySelector('#moveTutors-table tbody');
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

// Save data to local storage
function saveData() {
    const data = {
        center: [],
        north: [],
        west: [],
        east: [],
        items: [],
        tms: [],
        favorites: [],
        pivots: [],
        moveTutors: []
    };

    // Save Pokémon tables
    ['center', 'north', 'west', 'east'].forEach(area => {
        const rows = document.querySelectorAll(`table[data-area="${area}"] tbody tr`);
        rows.forEach(row => {
            const rowData = {
                location: row.children[0].textContent,
                pokemon: row.querySelector('.pokemon-input').value,
                levels: row.children[2].textContent, // static
                rate: row.children[3].textContent,   // static
                scoutable: row.querySelector('.scout-checkbox').checked,
                considering: row.querySelector('select[name="considering"]').value
            };
            data[area].push(rowData);
        });
    });

    // Save Items
    const itemRows = document.querySelectorAll('#items-table tbody tr');
    itemRows.forEach(row => {
        data.items.push({
            item: row.children[0].textContent,
            quantity: row.querySelector('input[name="quantity"]').value
        });
    });

    // Save TMs
    const tmRows = document.querySelectorAll('#tms-table tbody tr');
    tmRows.forEach(row => {
        const tm = row.querySelector('input').value;
        if (tm) data.tms.push(tm);
    });

    // Save Favorites
    const favoriteInputs = document.querySelectorAll('#favorites-table .pokemon-input');
    favoriteInputs.forEach(input => {
        if (input.value) data.favorites.push(input.value);
    });

    // Save Pivots
    const pivotRows = document.querySelectorAll('#pivots-table tbody tr');
    pivotRows.forEach(row => {
        data.pivots.push({
            name: row.querySelector('.pokemon-input').value,
            option: row.querySelector('input[type="text"]:not(.pokemon-input)').value,
            ticked: row.querySelector('input[type="checkbox"]').checked
        });
    });

    // Save Move Tutors
    const moveTutorRows = document.querySelectorAll('#moveTutors-table tbody tr');
    moveTutorRows.forEach(row => {
        data.moveTutors.push({
            moveTutor: row.children[0].textContent,
            tm: row.querySelector('.tm-select').value
        });
    });

    localStorage.setItem('safariZoneData', JSON.stringify(data));
    alert('Data saved!');
}

// Load data from local storage
function loadData() {
    const data = JSON.parse(localStorage.getItem('safariZoneData'));
    if (!data) return;

    // Load Pokémon tables
    ['center', 'north', 'west', 'east'].forEach(area => {
        const tbody = document.querySelector(`table[data-area="${area}"] tbody`);
        tbody.innerHTML = '';
        areaData[area].forEach((rowData, idx) => {
            addPokemonRow(tbody, area, rowData.location, rowData.levels, rowData.rate);
        });
        // Fill in saved data
        if (data[area]) {
            const rows = tbody.querySelectorAll('tr');
            data[area].forEach((rowData, idx) => {
                if (rows[idx]) {
                    rows[idx].querySelector('.pokemon-input').value = rowData.pokemon || '';
                    rows[idx].querySelector('.scout-checkbox').checked = rowData.scoutable || false;
                    const select = rows[idx].querySelector('select[name="considering"]');
                    select.value = rowData.considering || 'No';
                    toggleRowColor(select);
                }
            });
        }
    });

    // Load Items
    const itemsTbody = document.querySelector('#items-table tbody');
    itemsTbody.innerHTML = '';
    data.items.forEach(item => {
        addItemRow(itemsTbody);
        const row = itemsTbody.lastChild;
        row.querySelector('input[name="quantity"]').value = item.quantity || '';
    });

    // Load TMs
    const tmsTbody = document.querySelector('#tms-table tbody');
    tmsTbody.innerHTML = '';
    data.tms.forEach(tm => {
        addTmRow(tmsTbody);
        tmsTbody.lastChild.querySelector('input').value = tm;
    });
    addTmRow(tmsTbody); // Add empty row for new input

    // Load Favorites
    const favoriteInputs = document.querySelectorAll('#favorites-table .pokemon-input');
    data.favorites.forEach((fav, i) => {
        if (favoriteInputs[i]) favoriteInputs[i].value = fav;
    });

    // Load Pivots
    const pivotRows = document.querySelectorAll('#pivots-table tbody tr');
    data.pivots.forEach((pivot, i) => {
        if (pivotRows[i]) {
            pivotRows[i].querySelector('.pokemon-input').value = pivot.name || '';
            pivotRows[i].querySelector('input[type="text"]:not(.pokemon-input)').value = pivot.option || '';
            pivotRows[i].querySelector('input[type="checkbox"]').checked = pivot.ticked || false;
        }
    });
}

// Toggle collapse/expand of area boxes
function toggleCollapse(btn) {
    const box = btn.closest('.area-box, .box');
    box.classList.toggle('collapsed');
    btn.textContent = box.classList.contains('collapsed') ? '+' : '−';
}

window.toggleCollapse = toggleCollapse;

function clearData() {
    if (confirm('Are you sure you want to clear all data?')) {
        localStorage.removeItem('safariZoneData');
        location.reload();
    }
}