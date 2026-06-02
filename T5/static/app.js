

// ────────────────────────────────────────
// HANDLEKURV
// ────────────────────────────────────────

const cart = {};

function addToCart(button) {
    const card  = button.closest('.card');
    const id    = card.dataset.id;
    const name  = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const image = card.dataset.image;

    if (!cart[id]) {
        cart[id] = { name, price, image, qty: 0 };
    }

    cart[id].qty = cart[id].qty + 1;

    updateCart();
    openCart();
}

function changeQty(id, change) {
    cart[id].qty = cart[id].qty + change;
    if (cart[id].qty < 0) {
        cart[id].qty = 0;
    }
    updateCart();
}

function updateCart() {
    let html       = '';
    let totalPrice = 0;
    let totalItems = 0;

    for (const id in cart) {
        const item = cart[id];
        if (item.qty === 0) continue;

        totalPrice = totalPrice + (item.price * item.qty);
        totalItems = totalItems + item.qty;

        html = html + `
            <div class="cart-row">
                <img src="/static/images/${item.image}" alt="${item.name}">
                <div class="cart-row-info">
                    <div class="cart-row-name">${item.name}</div>
                    <div class="cart-row-price">${item.price} kr × ${item.qty}</div>
                </div>
                <div class="cart-row-qty">
                    <button onclick="changeQty('${id}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty('${id}', 1)">+</button>
                </div>
            </div>`;
    }

    if (html === '') {
        html = '<p class="empty-msg">Kurven er tom.</p>';
    }

    document.getElementById('cartItems').innerHTML   = html;
    document.getElementById('cartTotal').textContent = totalPrice.toFixed(0) + ' kr';

    const badge = document.getElementById('cartBadge');
    badge.textContent = totalItems;
    if (totalItems === 0) {
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
    }
}













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
// HANDLEKURV-SKUFF
// ────────────────────────────────────────

function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('userDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.add('open');
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('drawerOverlay').classList.remove('open');
}

document.getElementById('cartBtn').addEventListener('click', openCart);

// Oppdater overlay-klikk til å lukke begge
document.getElementById('drawerOverlay').addEventListener('click', function() {
    closeUser();
    closeCart();
});

// ────────────────────────────────────────
// CHECKOUT
// ────────────────────────────────────────

async function doCheckout() {
    if (!window.LOGGED_IN) {
        closeCart();
        openUser();
        return;
    }

    const items = [];
    for (const id in cart) {
        if (cart[id].qty > 0) {
            items.push({
                id:    id,
                name:  cart[id].name,
                price: cart[id].price,
                qty:   cart[id].qty
            });
        }
    }

    if (items.length === 0) return;

    const response = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ items })
    });

    const result = await response.json();

    if (!result.ok) {
        alert(result.error);
        return;
    }

    for (const id in cart) {
        delete cart[id];
    }

    updateCart();
    closeCart();
    alert('Bestilling #' + result.order_id + ' er lagt inn!');
}






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