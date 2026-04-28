document.addEventListener('DOMContentLoaded', () => {
    const PRODUCTOS_URL = 'data/productos.json';
    const CART_KEY = 'dulce_cart';
    const ADMIN_DRAFT_KEY = 'dulce_admin_draft';
    const CODIGO_SOCIOS = 'dulce@12345&des';

    const TELEFONO_PROVEEDOR = '5491100000000';

    const pageId = document.body.id;

    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
    }

    function formatPrice(value) {
        return `$${Number(value || 0).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    function normalizeText(text) {
        return String(text || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    async function getProducts() {
        try {
            const res = await fetch(PRODUCTOS_URL + '?t=' + Date.now());
            if (!res.ok) throw new Error('No se pudo cargar productos.json');
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getAdminDraft() {
        try {
            return JSON.parse(localStorage.getItem(ADMIN_DRAFT_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveAdminDraft(products) {
        localStorage.setItem(ADMIN_DRAFT_KEY, JSON.stringify(products));
    }

    function downloadJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'productos.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function productImage(producto) {
        return producto.imagen && producto.imagen.trim()
            ? producto.imagen
            : 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?auto=format&fit=crop&w=800&q=80';
    }

    async function initLista() {
        if (pageId !== 'page-lista') return;

        const searchInput = document.getElementById('price-search');
        const total = document.getElementById('price-total');
        const tableBody = document.querySelector('#price-table tbody');

        const productos = await getProducts();

        function render(list) {
            total.textContent = `${list.length} productos`;
            tableBody.innerHTML = '';

            if (!list.length) {
                tableBody.innerHTML = '<tr><td colspan="3">No hay productos cargados.</td></tr>';
                return;
            }

            list.forEach(p => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${p.nombre}</td>
                    <td>${p.descripcion || '-'}</td>
                    <td>${formatPrice(p.precio)}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        function applySearch() {
            const q = normalizeText(searchInput.value);
            const result = productos.filter(p =>
                normalizeText(`${p.nombre} ${p.descripcion}`).includes(q)
            );
            render(result);
        }

        render(productos);
        searchInput.addEventListener('input', applySearch);
    }

    async function initPedidos() {
        if (pageId !== 'page-pedidos') return;

        const productGrid = document.getElementById('product-grid');
        const searchInput = document.getElementById('product-search');
        const total = document.getElementById('product-total');
        const cartButton = document.getElementById('cart-button');
        const cartModal = document.getElementById('cart-modal');
        const checkoutModal = document.getElementById('checkout-modal');
        const closeCart = document.getElementById('close-cart-modal');
        const closeCheckout = document.getElementById('close-checkout-modal');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        const emptyCartBtn = document.getElementById('empty-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');
        const customerForm = document.getElementById('customer-form');

        const productos = await getProducts();
        let carrito = getCart();

        function renderProducts(list) {
            total.textContent = `${list.length} productos`;
            productGrid.innerHTML = '';

            if (!list.length) {
                productGrid.innerHTML = '<p>No hay productos cargados.</p>';
                return;
            }

            list.forEach(p => {
                const card = document.createElement('article');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${productImage(p)}" alt="${p.nombre}">
                    </div>
                    <div class="product-content">
                        <h3>${p.nombre}</h3>
                        <p>${p.descripcion || ''}</p>
                        <div class="product-price">${formatPrice(p.precio)}</div>
                        <div class="product-actions">
                            <input type="number" min="1" value="1" id="qty-${p.id}">
                            <button class="btn btn-primary add-to-cart" data-id="${p.id}">Agregar</button>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            });
        }

        function updateCart() {
            saveCart(carrito);

            const count = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            const totalPrice = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

            cartCount.textContent = count;
            cartTotal.textContent = formatPrice(totalPrice);
            cartItems.innerHTML = '';

            if (!carrito.length) {
                cartItems.innerHTML = '<p>Tu carrito está vacío.</p>';
                return;
            }

            carrito.forEach(item => {
                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
                    <strong>${item.nombre}</strong>
                    <span>${formatPrice(item.precio)} c/u</span>
                    <div>
                        <button class="quantity-btn" data-id="${item.id}" data-action="minus">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="plus">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">x</button>
                `;
                cartItems.appendChild(row);
            });
        }

        function addToCart(id, cantidad) {
            const producto = productos.find(p => String(p.id) === String(id));
            if (!producto) return;

            const qty = Number(cantidad);
            if (!qty || qty < 1) return alert('Ingresá una cantidad válida.');

            const existing = carrito.find(item => String(item.id) === String(id));

            if (existing) {
                existing.cantidad += qty;
            } else {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: Number(producto.precio),
                    cantidad: qty
                });
            }

            updateCart();
        }

        function applySearch() {
            const q = normalizeText(searchInput.value);
            const result = productos.filter(p =>
                normalizeText(`${p.nombre} ${p.descripcion}`).includes(q)
            );
            renderProducts(result);
        }

        productGrid.addEventListener('click', e => {
            if (e.target.classList.contains('add-to-cart')) {
                const id = e.target.dataset.id;
                const input = document.getElementById(`qty-${id}`);
                addToCart(id, input.value);
            }
        });

        cartItems.addEventListener('click', e => {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;

            if (e.target.classList.contains('quantity-btn')) {
                const item = carrito.find(i => String(i.id) === String(id));
                if (!item) return;

                if (action === 'plus') item.cantidad++;
                if (action === 'minus') item.cantidad--;

                if (item.cantidad <= 0) {
                    carrito = carrito.filter(i => String(i.id) !== String(id));
                }

                updateCart();
            }

            if (e.target.classList.contains('remove-item-btn')) {
                carrito = carrito.filter(i => String(i.id) !== String(id));
                updateCart();
            }
        });

        cartButton.addEventListener('click', () => cartModal.style.display = 'block');
        closeCart.addEventListener('click', () => cartModal.style.display = 'none');
        closeCheckout.addEventListener('click', () => checkoutModal.style.display = 'none');

        emptyCartBtn.addEventListener('click', () => {
            carrito = [];
            updateCart();
        });

        checkoutBtn.addEventListener('click', () => {
            if (!carrito.length) return alert('Tu carrito está vacío.');
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'block';
        });

        customerForm.addEventListener('submit', e => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const apellido = document.getElementById('apellido').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const email = document.getElementById('email').value.trim();
            const direccion = document.getElementById('direccion').value.trim();
            const entreCalles = document.getElementById('entre-calles').value.trim();
            const localidad = document.getElementById('localidad').value.trim();
            const fecha = document.getElementById('fecha-entrega').value;
            const horario = document.getElementById('horario').value.trim();
            const dedicatoria = document.getElementById('dedicatoria').value.trim();
            const foto = document.getElementById('foto').files[0];

            let detalle = '';
            let total = 0;

            carrito.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;
                detalle += `\n- ${item.nombre} x${item.cantidad}: ${formatPrice(subtotal)}`;
            });

            const mensaje = `*Pedido - Dulce Desayunos y Meriendas*

*Cliente:* ${nombre} ${apellido}
*Teléfono:* ${telefono}
*Email:* ${email}
*Dirección:* ${direccion}
*Entre calles:* ${entreCalles}
*Localidad:* ${localidad}
*Fecha de entrega:* ${fecha}
*Horario:* ${horario}
*Dedicatoria:* ${dedicatoria || 'Sin dedicatoria'}
*Foto:* ${foto ? `El cliente desea agregar foto (${foto.name}). Debe enviarla aparte por WhatsApp.` : 'No agrega foto'}

*Detalle del pedido:*${detalle}

*Total:* ${formatPrice(total)}

Gracias por confiar en Dulce Desayunos y Meriendas.`;

            const compradorPhone = telefono.replace(/\D/g, '');
            const urlComprador = `https://wa.me/${compradorPhone}?text=${encodeURIComponent(mensaje)}`;
            const urlProveedor = `https://wa.me/${TELEFONO_PROVEEDOR}?text=${encodeURIComponent(mensaje)}`;

            window.open(urlProveedor, '_blank');
            setTimeout(() => window.open(urlComprador, '_blank'), 800);

            carrito = [];
            updateCart();
            customerForm.reset();
            checkoutModal.style.display = 'none';
        });

        searchInput.addEventListener('input', applySearch);

        renderProducts(productos);
        updateCart();
    }

    function initSocios() {
        if (pageId !== 'page-socios') return;

        const loginSection = document.getElementById('login-section');
        const adminPanel = document.getElementById('admin-panel');
        const loginForm = document.getElementById('login-form');
        const codigoInput = document.getElementById('codigo-acceso');

        const productForm = document.getElementById('product-form');
        const nombreInput = document.getElementById('admin-nombre');
        const descripcionInput = document.getElementById('admin-descripcion');
        const precioInput = document.getElementById('admin-precio');
        const imagenInput = document.getElementById('admin-imagen');

        const preview = document.getElementById('admin-preview');
        const generateBtn = document.getElementById('generate-json-btn');
        const clearBtn = document.getElementById('clear-admin-products-btn');

        let productosAdmin = getAdminDraft();

        function renderPreview() {
            preview.innerHTML = '';

            if (!productosAdmin.length) {
                preview.innerHTML = '<p>No hay productos cargados.</p>';
                return;
            }

            productosAdmin.forEach(p => {
                const item = document.createElement('div');
                item.className = 'admin-preview-item';
                item.innerHTML = `
                    <div>
                        <strong>${p.nombre}</strong>
                        <p>${p.descripcion}</p>
                        <span>${formatPrice(p.precio)}</span>
                    </div>
                    <button class="remove-item-btn" data-id="${p.id}">x</button>
                `;
                preview.appendChild(item);
            });
        }

        loginForm.addEventListener('submit', e => {
            e.preventDefault();

            if (codigoInput.value !== CODIGO_SOCIOS) {
                alert('Código incorrecto.');
                return;
            }

            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            renderPreview();
        });

        productForm.addEventListener('submit', e => {
            e.preventDefault();

            const producto = {
                id: Date.now(),
                nombre: nombreInput.value.trim(),
                descripcion: descripcionInput.value.trim(),
                precio: Number(precioInput.value),
                imagen: imagenInput.value.trim()
            };

            productosAdmin.push(producto);
            saveAdminDraft(productosAdmin);
            renderPreview();
            productForm.reset();
        });

        preview.addEventListener('click', e => {
            if (e.target.classList.contains('remove-item-btn')) {
                productosAdmin = productosAdmin.filter(p => String(p.id) !== String(e.target.dataset.id));
                saveAdminDraft(productosAdmin);
                renderPreview();
            }
        });

        generateBtn.addEventListener('click', () => {
            if (!productosAdmin.length) {
                alert('No hay productos para generar.');
                return;
            }

            downloadJSON(productosAdmin);

            alert(
                'Archivo productos.json generado.\n\n' +
                'Ahora reemplazalo en data/productos.json, hacé commit y push para actualizar la web online.'
            );
        });

        clearBtn.addEventListener('click', () => {
            if (confirm('¿Querés borrar la lista cargada en este navegador?')) {
                productosAdmin = [];
                saveAdminDraft(productosAdmin);
                renderPreview();
            }
        });
    }

    initLista();
    initPedidos();
    initSocios();
});