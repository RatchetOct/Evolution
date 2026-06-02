// ────────────────────────────────────────
// SØKEFUNKSJON
// ────────────────────────────────────────

function search() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    let found = 0;

    document.querySelectorAll('.card').forEach(function(card) {
        const name = card.dataset.name.toLowerCase();
        if (name.includes(input)) {
            card.classList.remove('hidden');
            found = found + 1;
        } else {
            card.classList.add('hidden');
        }
    });

    if (found === 0) {
        document.getElementById('noResults').classList.remove('hidden');
    } else {
        document.getElementById('noResults').classList.add('hidden');
    }
}

document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('searchInput').addEventListener('input', search);