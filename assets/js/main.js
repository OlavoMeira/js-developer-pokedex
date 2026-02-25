const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;
let allPokemons = []; 

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="openModal(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        allPokemons.push(...pokemons); 
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)



function openModal(pokemonNumber) {
    
    const pokemon = allPokemons.find(p => p.number === pokemonNumber);
    
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

  
    content.className = `modal-content ${pokemon.type}`; 
    
    content.innerHTML = `
        <div class="modal-header" style="padding: 20px; color: white; position: relative;">
            <button onclick="closeModal()" style="position: absolute; top: 10px; right: 20px; background:none; border:none; color:white; font-size:30px; cursor:pointer">&times;</button>
            <span style="font-weight: bold; font-size: 1.2rem;">#${pokemon.number}</span>
            <h2 style="text-transform: capitalize; margin: 5px 0;">${pokemon.name}</h2>
            <div class="detail">
                <ul class="types" style="display: flex; list-style: none; padding: 0;">
                    ${pokemon.types.map(t => `<li class="type ${t}" style="margin-right: 5px;">${t}</li>`).join('')}
                </ul>
            </div>
            <img src="${pokemon.photo}" alt="${pokemon.name}" style="width: 150px; height: 150px; display: block; margin: 0 auto; position: relative; bottom: -30px; z-index: 10;">
        </div>

        <div class="modal-body" style="background: white; border-radius: 2rem 2rem 0 0; padding: 40px 20px 20px; margin-top: -10px;">
            <h3 style="color: #333;">Base Stats</h3>
            ${pokemon.stats.map(s => `
                <div class="stat-row" style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span class="stat-name" style="width: 100px; text-transform: capitalize; color: #777;">${s.name}</span>
                    <span style="width: 40px; font-weight: bold; color: #333;">${s.base_stat}</span>
                    <div class="stat-bar-bg" style="flex-grow: 1; background: #eee; height: 8px; border-radius: 4px;">
                        <div class="stat-bar-fill" style="width: ${s.base_stat}%; background: ${s.base_stat >= 50 ? '#4caf50' : '#ff5252'}; height: 100%; border-radius: 4px;"></div>
                    </div>
                </div>
            `).join('')}
            
            <div style="margin-top: 20px; display: flex; justify-content: space-around; text-align: center;">
                <div>
                    <strong style="display: block;">${pokemon.weight}kg</strong>
                    <span style="color: #999; font-size: 0.8rem;">Weight</span>
                </div>
                <div>
                    <strong style="display: block;">${pokemon.height}m</strong>
                    <span style="color: #999; font-size: 0.8rem;">Height</span>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-container').style.display = 'none';
}


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})