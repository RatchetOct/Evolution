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











// ────────────────────────────────────────
// SKUFF-FUNKSJONER
// ────────────────────────────────────────

function openUser() {
    document.getElementById('userDrawer').classList.add('open');
    document.getElementById('drawerOverlay').classList.add('open');
}

function closeUser() {
    document.getElementById('userDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('open');
}

document.getElementById('userBtn').addEventListener('click', openUser);
document.getElementById('drawerOverlay').addEventListener('click', function() {
    closeUser();
});

// ────────────────────────────────────────
// INNLOGGING OG REGISTRERING
// ────────────────────────────────────────

function switchTab(tab) {
    if (tab === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    } else {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    }
}

async function doLogin() {
    const email    = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    const response = await fetch('/api/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.ok) {
        location.reload();
    } else {
        document.getElementById('loginError').textContent = result.error;
        document.getElementById('loginError').classList.remove('hidden');
    }
}

async function doRegister() {
    const name     = document.getElementById('regName').value;
    const email    = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;

    const response = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password })
    });

    const result = await response.json();

    if (result.ok) {
        location.reload();
    } else {
        document.getElementById('registerError').textContent = result.error;
        document.getElementById('registerError').classList.remove('hidden');
    }
}

async function doLogout() {
    await fetch('/api/logout', { method: 'POST' });
    location.reload();
}

// Vis profil eller innloggingsskjema
if (window.LOGGED_IN) {
    document.getElementById('authPanel').classList.add('hidden');
    document.getElementById('profilePanel').classList.remove('hidden');
    document.getElementById('profileName').textContent = 'Logget inn som: ' + window.USER_NAME;
}