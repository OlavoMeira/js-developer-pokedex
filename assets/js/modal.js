// ══════════════════════════════════════════════════════════
//  modal.js — modal de stats no estilo da imagem de referência
//  Layout: fundo colorido com imagem grande + painel branco
// ══════════════════════════════════════════════════════════

// Mapeamento: nome da stat na API → nome exibido
const STAT_NAMES = {
    hp:               "Hp",
    attack:           "Attack",
    defense:          "Defense",
    "special-attack": "Special-Attack",
    "special-defense":"Special-Defense",
    speed:            "Speed",
};


// ──────────────────────────────────────
//  ABRIR E FECHAR
// ──────────────────────────────────────

function openModal() {
    document.getElementById("modalOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);

// Fechar clicando no fundo colorido (mas não no painel branco)
document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modalOverlay") ||
        e.target === document.getElementById("modalBg")) {
        closeModal();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});


// ──────────────────────────────────────
//  BUSCA DE DADOS
// ──────────────────────────────────────

async function fetchPokemonFull(nameOrId) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    if (!res.ok) throw new Error("Não encontrado");
    return res.json();
}


// ──────────────────────────────────────
//  RENDERIZAR
// ──────────────────────────────────────

function renderModal(poke) {
    const primaryType = poke.types[0].type.name;

    // ── Cor de fundo ──
    document.getElementById("modalBg").className = `modal-bg ${primaryType}`;

    // ── Número e nome ──
    document.getElementById("modalNumber").textContent = `#${poke.id}`;
    document.getElementById("modalName").textContent   = poke.name;

    // ── Tipos ──
    document.getElementById("modalTypes").innerHTML =
        poke.types.map(t => `<li>${t.type.name}</li>`).join("");

    // ── Imagem ──
    document.getElementById("modalImg").src =
        poke.sprites.other?.["official-artwork"]?.front_default
        || poke.sprites.other?.dream_world?.front_default
        || poke.sprites.front_default;

    // ── Stats ──
    const statsHtml = poke.stats.map(s => {
        const name  = STAT_NAMES[s.stat.name] || s.stat.name;
        const val   = s.base_stat;
        const pct   = Math.min((val / 150) * 100, 100);
        const color = val < 50 ? "bar-low" : val < 80 ? "bar-mid" : "bar-high";
        return `
            <div class="stat-row">
                <span class="stat-name">${name}</span>
                <span class="stat-val">${val}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar ${color}" style="width:0%" data-width="${pct}%"></div>
                </div>
            </div>`;
    }).join("");

    document.getElementById("statsRows").innerHTML = statsHtml;

    // ── Peso e altura ──
    // A API retorna altura em decímetros (dm) e peso em hectogramas (hg)
    const heightM  = (poke.height / 10).toFixed(1);
    const weightKg = (poke.weight / 10).toFixed(1);

    document.getElementById("modalWeight").textContent = `${weightKg}kg`;
    document.getElementById("modalHeight").textContent = `${heightM}m`;

    // Anima as barras após renderizar
    setTimeout(animateBars, 100);
}


// ──────────────────────────────────────
//  ANIMAÇÃO DAS BARRAS
// ──────────────────────────────────────

function animateBars() {
    document.querySelectorAll(".stat-bar").forEach(b => b.style.width = "0%");
    setTimeout(() => {
        document.querySelectorAll(".stat-bar").forEach(b => {
            b.style.width = b.dataset.width;
        });
    }, 50);
}


// ──────────────────────────────────────
//  FUNÇÃO PRINCIPAL
// ──────────────────────────────────────

async function openPokemonModal(pokemonNameOrId) {
    openModal();
    showLoading(true);

    try {
        const poke = await fetchPokemonFull(pokemonNameOrId);
        showLoading(false);
        renderModal(poke);
    } catch (err) {
        console.error("Erro:", err);
        closeModal();
    }
}


// ──────────────────────────────────────
//  LOADING
// ──────────────────────────────────────

function showLoading(visible) {
    document.getElementById("modalLoading").classList.toggle("visible", visible);
}


// ──────────────────────────────────────
//  EVENT DELEGATION — clique na pokédex
//
//  Um único listener no <ol> pai captura
//  cliques em todos os cards, inclusive
//  os carregados depois pelo Load More
// ──────────────────────────────────────

document.getElementById("pokemonList").addEventListener("click", (event) => {
    const card = event.target.closest(".pokemon");
    if (!card) return;
    openPokemonModal(card.dataset.name);
});
