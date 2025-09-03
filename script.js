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
        getSharedDataFromUrl();

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
        initializeMoveTutorsTable(); 
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
    let data = JSON.parse(localStorage.getItem('safariZoneData'));
    if (!data) return;

    // If compact format (array), expand to object
    if (Array.isArray(data)) {
        // Helper to get name from index
        const getName = (arr, idx) => arr[idx] || '';

        // Areas: c, n, w, e
        const areaKeys = ['c', 'n', 'w', 'e'];
        const areas = {};
        for (let i = 0; i < 4; i++) {
            let areaStr = data[i] || '';
            let base = 10;
            if (areaStr.startsWith('b36:')) {
                base = 36;
                areaStr = areaStr.slice(4);
            }
            areas[areaKeys[i]] = [];
            const expectedRows = areaData[['center', 'north', 'west', 'east'][i]].length;
            if (areaStr) {
                const rows = areaStr.split(';').map(row => {
                    if (!row) return ['', 0, 0];
                    const parts = row.split('|');
                    const pIdx = parts[0] ? parseInt(parts[0], base) : NaN;
                    const scout = parts[1] === '1' ? 1 : 0;
                    const considering = parts[2] === '1' ? 1 : 0;
                    return [getName(pokemonNames, pIdx), scout, considering];
                });
                // Pad with empty rows if needed
                while (rows.length < expectedRows) {
                    rows.push(['', 0, 0]);
                }
                areas[areaKeys[i]] = rows;
            } else {
                // Fill with empty rows if no data
                areas[areaKeys[i]] = Array(expectedRows).fill().map(() => ['', 0, 0]);
            }
        }

        // Items
        let itemsStr = data[4] || '';
        let itemsBase = 10;
        if (itemsStr.startsWith('b36:')) {
            itemsBase = 36;
            itemsStr = itemsStr.slice(4);
        }
        const itemsArr = [];
        if (itemsStr) {
            itemsStr.split(';').forEach(itemStr => {
                if (!itemStr) return;
                const [iIdx, qty] = itemStr.split('|');
                const itemIdx = parseInt(iIdx, itemsBase);
                const itemQty = parseInt(qty, itemsBase);
                if (!isNaN(itemIdx) && !isNaN(itemQty)) {
                    itemsArr.push([getName(items, itemIdx), itemQty]);
                }
            });
        }

        // TMs
        let tmsStr = data[5] || '';
        let tmsBase = 10;
        if (tmsStr.startsWith('b36:')) {
            tmsBase = 36;
            tmsStr = tmsStr.slice(4);
        }
        const tmsArr = [];
        if (tmsStr) {
            tmsStr.split(',').forEach(tmIdx => {
                if (tmIdx !== '') {
                    const idx = parseInt(tmIdx, tmsBase);
                    if (!isNaN(idx)) tmsArr.push(getName(tmNames, idx));
                }
            });
        }

        // Favorites
        let favsStr = data[6] || '';
        let favsBase = 10;
        if (favsStr.startsWith('b36:')) {
            favsBase = 36;
            favsStr = favsStr.slice(4);
        }
        const favArr = [];
        if (favsStr) {
            favsStr.split(',').forEach(favIdx => {
                if (favIdx !== '') {
                    const idx = parseInt(favIdx, favsBase);
                    if (!isNaN(idx)) favArr.push(getName(pokemonNames, idx));
                }
            });
        }

        // Pivots
        let pivotsStr = data[7] || '';
        let pivotsBase = 10;
        if (pivotsStr.startsWith('b36:')) {
            pivotsBase = 36;
            pivotsStr = pivotsStr.slice(4);
        }
        const pivArr = [];
        if (pivotsStr) {
            pivotsStr.split(';').forEach(pivotStr => {
                if (!pivotStr) return;
                const parts = pivotStr.split('|');
                const pIdx = parts[0] ? parseInt(parts[0], pivotsBase) : NaN;
                const option = parts[1] || '';
                const ticked = parts[2] === '1' ? 1 : 0;
                pivArr.push([getName(pokemonNames, pIdx), option, ticked]);
            });
        }

        // Move Tutors
        let movesStr = data[8] || '';
        let movesBase = 10;
        if (movesStr.startsWith('b36:')) {
            movesBase = 36;
            movesStr = movesStr.slice(4);
        }
        const moveArr = [];
        if (movesStr) {
            movesStr.split(',').forEach(tmIdx => {
                if (tmIdx !== '') {
                    const idx = parseInt(tmIdx, movesBase);
                    if (!isNaN(idx)) moveArr.push(getName(tmNames, idx));
                }
            });
        }

        // Rebuild object for compatibility with rest of code
        data = {
            c: areas.c,
            n: areas.n,
            w: areas.w,
            e: areas.e,
            i: itemsArr,
            t: tmsArr,
            f: favArr,
            p: pivArr,
            m: moveArr
        };
    }

    // Ensure all keys exist, default to empty arrays if missing
    const keys = ['c', 'n', 'w', 'e', 'i', 't', 'f', 'p', 'm'];
    keys.forEach(k => {
        if (!Array.isArray(data[k])) data[k] = [];
    });

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
        // Remove SharedData from URL
        const url = new URL(location.href);
        url.searchParams.delete('SharedData');
        history.replaceState(null, '', url.toString());
        location.reload();
    }
}

function compactDataForSharing(data) {
    // Helper to get index as base-36 string or empty
    const idx36 = (arr, val) => {
        const i = arr.indexOf(val);
        return i === -1 ? '' : i.toString(36);
    };

    // Areas: c, n, w, e
    const areas = ['c', 'n', 'w', 'e'];
    const compactAreas = areas.map((k, idx) => {
        const areaRows = data[k] || [];
        // Ensure we have the same number of rows as areaData[area]
        const expectedRows = areaData[['center', 'north', 'west', 'east'][idx]].length;
        const rows = Array(expectedRows).fill().map((_, i) => {
            const row = areaRows[i] || ['', 0, 0]; // Default to empty row if missing
            return [
                idx36(pokemonNames, row[0]), // Pokémon index in base-36
                row[1] ? 1 : '',
                row[2] ? 1 : ''
            ].join('|');
        });
        return rows.join(';');
    });
    // Prefix non-empty with 'b36:'
    compactAreas.forEach((str, i) => {
        if (str) compactAreas[i] = 'b36:' + str;
    });

    // Items: store index (base-36) and qty (base-36)
    let compactItems = (data.i || [])
        .filter(item => item[0] && item[1] && item[1] !== "0")
        .map(item => `${idx36(items, item[0])}|${Number(item[1]).toString(36)}`)
        .join(';');
    if (compactItems) compactItems = 'b36:' + compactItems;

    // TMs: store indices in base-36
    let compactTms = (data.t || [])
        .map(tm => idx36(tmNames, tm))
        .filter(i => i !== '')
        .join(',');
    if (compactTms) compactTms = 'b36:' + compactTms;

    // Favorites: Pokémon indices in base-36
    let compactFavs = (data.f || [])
        .map(fav => idx36(pokemonNames, fav))
        .filter(i => i !== '')
        .join(',');
    if (compactFavs) compactFavs = 'b36:' + compactFavs;

    // Pivots: Pokémon index (base-36)|option|ticked
    let compactPivots = (data.p || [])
        .map(pivot => [
            idx36(pokemonNames, pivot[0] || ''),
            pivot[1] || '',
            pivot[2] ? 1 : ''
        ].join('|'))
        .join(';');
    if (compactPivots) compactPivots = 'b36:' + compactPivots;

    // Move Tutors: TM indices in base-36
    let compactMoves = (data.m || [])
        .map(tm => idx36(tmNames, tm))
        .filter(i => i !== '')
        .join(',');
    if (compactMoves) compactMoves = 'b36:' + compactMoves;

    // Final compact array
    return [
        ...compactAreas,    // 0-3: areas
        compactItems,       // 4: items
        compactTms,         // 5: tms
        compactFavs,        // 6: favorites
        compactPivots,      // 7: pivots
        compactMoves        // 8: move tutors
    ];
}

function shareData() {
    saveData();
    const rawData = localStorage.getItem('safariZoneData');
    if (!rawData) {
        alert('No data to share!');
        return;
    }
    const compact = compactDataForSharing(JSON.parse(rawData));
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(compact));
    const url = `${location.origin}${location.pathname}?SharedData=${compressed}`;
    navigator.clipboard.writeText(url)
        .then(() => alert('Share link copied to clipboard!'))
        .catch(() => alert('Could not copy link.'));
}