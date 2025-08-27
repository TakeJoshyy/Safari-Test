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

function getSharedDataFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('SharedData');
    if (shared) {
        try {
            const decoded = LZString.decompressFromEncodedURIComponent(shared);
            localStorage.setItem('safariZoneData', decoded);
            return true;
        } catch (e) {
            alert('Invalid shared data!');
        }
    }
    return false;
}

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
        c: [], // center
        n: [], // north
        w: [], // west
        e: [], // east
        i: [], // items
        t: [], // tms
        f: [], // favorites
        p: [], // pivots
        m: []  // moveTutors
    };

    ['center', 'north', 'west', 'east'].forEach((area, idx) => {
        const rows = document.querySelectorAll(`table[data-area="${area}"] tbody tr`);
        rows.forEach(row => {
            data[['c','n','w','e'][idx]].push([
                row.querySelector('.pokemon-input').value,
                row.querySelector('.scout-checkbox').checked ? 1 : 0,
                row.querySelector('select[name="considering"]').value === 'Yes' ? 1 : 0
            ]);
        });
    });

    // Items
    document.querySelectorAll('#items-table tbody tr').forEach(row => {
        const qty = row.querySelector('input[name="quantity"]').value;
        if (qty && qty !== "0") data.i.push([row.children[0].textContent, qty]);
    });

    // TMs
    document.querySelectorAll('#tms-table tbody tr').forEach(row => {
        const tm = row.querySelector('input').value;
        if (tm) data.t.push(tm);
    });

    // Favorites
    document.querySelectorAll('#favorites-table .pokemon-input').forEach(input => {
        if (input.value) data.f.push(input.value);
    });

    // Pivots
    document.querySelectorAll('#pivots-table tbody tr').forEach(row => {
        const nameInput = row.querySelector('.pokemon-input');
        const optionInput = row.querySelector('input[type="text"]:not(.pokemon-input)');
        const tickedInput = row.querySelector('input[type="checkbox"]');
        if (nameInput && nameInput.value) {
            data.p.push([
                nameInput.value,
                optionInput ? optionInput.value : '',
                tickedInput ? (tickedInput.checked ? 1 : 0) : 0
            ]);
        }
    });

    // Move Tutors
    document.querySelectorAll('#moveTutors-table tbody tr').forEach(row => {
        const tm = row.querySelector('.tm-select').value;
        if (tm) data.m.push(tm);
    });

    localStorage.setItem('safariZoneData', JSON.stringify(data));
    const saveBtn = document.querySelector('.data-btn[onclick="saveData()"]');
    if (saveBtn) {
        saveBtn.classList.add('saved');
        setTimeout(() => saveBtn.classList.remove('saved'), 5000);
    }
}

// Load data from local storage
function loadData() {
    const data = JSON.parse(localStorage.getItem('safariZoneData'));
    if (!data) return;

    // Load Pokémon tables (center, north, west, east)
    ['c', 'n', 'w', 'e'].forEach((key, idx) => {
        const area = ['center', 'north', 'west', 'east'][idx];
        const tbody = document.querySelector(`table[data-area="${area}"] tbody`);
        tbody.innerHTML = '';
        areaData[area].forEach((rowData, i) => {
            addPokemonRow(tbody, area, rowData.location, rowData.levels, rowData.rate);
        });
        // Fill in saved data
        if (Array.isArray(data[key])) {
            const rows = tbody.querySelectorAll('tr');
            data[key].forEach((rowData, i) => {
                if (rows[i]) {
                    rows[i].querySelector('.pokemon-input').value = rowData[0] || '';
                    rows[i].querySelector('.scout-checkbox').checked = !!rowData[1];
                    const select = rows[i].querySelector('select[name="considering"]');
                    select.value = rowData[2] ? 'Yes' : 'No';
                    toggleRowColor(select);
                }
            });
        }
    });

    // Load Items
    const itemsTbody = document.querySelector('#items-table tbody');
    itemsTbody.innerHTML = '';
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item}</td>
            <td><input type="number" name="quantity" min="0"></td>
        `;
        itemsTbody.appendChild(row);
    });
    if (Array.isArray(data.i)) {
        data.i.forEach(savedItem => {
            const idx = items.findIndex(name => name === savedItem[0]);
            if (idx !== -1) {
                itemsTbody.children[idx].querySelector('input[name="quantity"]').value = savedItem[1];
            }
        });
    }

    // Load TMs
    const tmsTbody = document.querySelector('#tms-table tbody');
    tmsTbody.innerHTML = '';
    if (Array.isArray(data.t)) {
        data.t.forEach(tm => {
            addTmRow(tmsTbody);
            tmsTbody.lastChild.querySelector('input').value = tm;
        });
    }
    addTmRow(tmsTbody); // Always add an empty row

    // Load Favorites
    const favoriteInputs = document.querySelectorAll('#favorites-table .pokemon-input');
    if (Array.isArray(data.f)) {
        data.f.forEach((fav, i) => {
            if (favoriteInputs[i]) favoriteInputs[i].value = fav;
        });
    }

    // Load Pivots
    const pivotRows = document.querySelectorAll('#pivots-table tbody tr');
    if (Array.isArray(data.p)) {
        data.p.forEach((pivot, i) => {
            if (pivotRows[i]) {
                pivotRows[i].querySelector('.pokemon-input').value = pivot[0] || '';
                const optionInput = pivotRows[i].querySelector('input[type="text"]:not(.pokemon-input)');
                if (optionInput) optionInput.value = pivot[1] || '';
                const tickedInput = pivotRows[i].querySelector('input[type="checkbox"]');
                if (tickedInput) tickedInput.checked = !!pivot[2];
            }
        });
    }

    // Load Move Tutors
    const moveTutorRows = document.querySelectorAll('#moveTutors-table tbody tr');
    if (Array.isArray(data.m)) {
        data.m.forEach((tm, i) => {
            if (moveTutorRows[i]) {
                const select = moveTutorRows[i].querySelector('.tm-select');
                if (select) select.value = tm;
            }
        });
    }
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

function shareData() {
    saveData();
    const data = localStorage.getItem('safariZoneData');
    if (!data) {
        alert('No data to share!');
        return;
    }
    
    const compressed = LZString.compressToEncodedURIComponent(data);
    const url = `${location.origin}${location.pathname}?SharedData=${compressed}`;
    navigator.clipboard.writeText(url)
        .then(() => alert('Share link copied to clipboard!'))
        .catch(() => alert('Could not copy link.'));
}