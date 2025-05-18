// GreenERA Horticulture - Shopping Cart Functionality

// Inizializzazione del carrello
let cart = [];

// Carica il carrello dal localStorage se esiste
function loadCart() {
    const savedCart = localStorage.getItem('greenERACart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartIcon();
    }
}

// Salva il carrello nel localStorage
function saveCart() {
    localStorage.setItem('greenERACart', JSON.stringify(cart));
    updateCartIcon();
}

// Aggiorna l'icona del carrello con il numero di articoli
function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        // Mostra o nascondi il contatore in base al numero di articoli
        if (itemCount > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Aggiungi un prodotto al carrello
function addToCart(id, name, price, image) {
    // Controlla se il prodotto è già nel carrello
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // Incrementa la quantità se il prodotto è già nel carrello
        existingItem.quantity += 1;
    } else {
        // Aggiungi un nuovo prodotto al carrello
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Salva il carrello e mostra una notifica
    saveCart();
    showNotification(`${name} aggiunto al carrello`);
}

// Rimuovi un prodotto dal carrello
function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCart();
        renderCartItems();
        updateCartTotal();
        return removedItem.name;
    }
    return null;
}

// Aggiorna la quantità di un prodotto nel carrello
function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(id);
        } else {
            item.quantity = quantity;
            saveCart();
            renderCartItems();
            updateCartTotal();
        }
    }
}

// Incrementa la quantità di un prodotto
function incrementQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        updateQuantity(id, item.quantity + 1);
    }
}

// Decrementa la quantità di un prodotto
function decrementQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        updateQuantity(id, item.quantity - 1);
    } else if (item && item.quantity === 1) {
        removeFromCart(id);
    }
}

// Svuota il carrello
function clearCart() {
    cart = [];
    saveCart();
    renderCartItems();
    updateCartTotal();
    closeCart();
}

// Mostra una notifica temporanea
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    // Nascondi la notifica dopo 3 secondi
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Apri il pannello del carrello
function openCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.add('open');
    renderCartItems();
    updateCartTotal();
    document.body.style.overflow = 'hidden'; // Impedisce lo scorrimento della pagina
}

// Chiudi il pannello del carrello
function closeCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.remove('open');
    document.body.style.overflow = ''; // Ripristina lo scorrimento della pagina
}

// Renderizza gli articoli nel carrello
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Il tuo carrello è vuoto</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrement" onclick="decrementQuantity('${item.id}')">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn increment" onclick="incrementQuantity('${item.id}')">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Aggiorna il totale del carrello
function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('€', '').replace(',', '.')) * item.quantity), 0);
    cartTotal.textContent = `€${total.toFixed(2)}`;
}

// Procedi al checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Il carrello è vuoto');
        return;
    }
    
    // Qui si implementerebbe la logica di checkout
    alert('Funzionalità di checkout in fase di sviluppo. Grazie per il tuo ordine!');
    clearCart();
}

// Inizializza il carrello al caricamento della pagina
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Aggiungi listener per chiudere il carrello quando si clicca fuori
    document.addEventListener('click', function(event) {
        const cartPanel = document.getElementById('cart-panel');
        const cartIcon = document.getElementById('cart-icon-container');
        
        if (cartPanel.classList.contains('open') && 
            !cartPanel.contains(event.target) && 
            !cartIcon.contains(event.target)) {
            closeCart();
        }
    });
});
