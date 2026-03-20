/**
 * APP.JS - Lógica de Interfaz y Navegación SPA (Versión Completa y Actualizada)
 */
const Router = {
    app: document.getElementById('app'),

    // Controlador de Rutas
    go(view) {
        const currentUser = localStorage.getItem(DB.KEYS.CURRENT_USER);
        const nav = document.getElementById('bottom-nav');
        const logoutBtn = document.getElementById('logout-btn');

        // Protección de rutas: Si no hay sesión, solo permite Login o Registro
        if (!currentUser) {
            nav.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            if (view === 'register') {
                return this.renderRegister();
            }
            return this.renderLogin();
        }

        // Si hay sesión, mostrar navegación
        nav.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');

        switch(view) {
            case 'inventory': this.renderInventory(); break;
            case 'new-sale': this.renderNewSale(); break;
            case 'wallet': this.renderWallet(); break;
            default: this.renderInventory();
        }
    },

    // --- VISTAS DE AUTENTICACIÓN ---

    renderLogin() {
        this.app.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-lg mt-10">
                <h2 class="text-2xl font-bold mb-6 text-center text-indigo-600">Iniciar Sesión</h2>
                <form id="login-form" class="space-y-4">
                    <input type="text" id="user" placeholder="Usuario" class="w-full p-3 border rounded-lg" required>
                    <input type="password" id="pass" placeholder="Contraseña" class="w-full p-3 border rounded-lg" required>
                    <button class="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700">Entrar</button>
                </form>
                <p class="mt-4 text-center text-sm">¿No tienes cuenta? <a href="#" onclick="Router.go('register')" class="text-indigo-600 underline">Regístrate aquí</a></p>
            </div>
        `;
        document.getElementById('login-form').onsubmit = (e) => {
            e.preventDefault();
            const u = DB.login(document.getElementById('user').value, document.getElementById('pass').value);
            u ? this.go('inventory') : alert('Usuario o contraseña incorrectos');
        };
    },

    renderRegister() {
        this.app.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-lg mt-10">
                <h2 class="text-2xl font-bold mb-6 text-center text-green-600">Crear Cuenta</h2>
                <form id="register-form" class="space-y-4">
                    <input type="text" id="reg-user" placeholder="Nombre de Usuario" class="w-full p-3 border rounded-lg" required>
                    <input type="password" id="reg-pass" placeholder="Contraseña" class="w-full p-3 border rounded-lg" required>
                    <input type="password" id="reg-pass-confirm" placeholder="Confirmar Contraseña" class="w-full p-3 border rounded-lg" required>
                    <button class="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700">Registrarme</button>
                </form>
                <p class="mt-4 text-center text-sm">¿Ya tienes cuenta? <a href="#" onclick="Router.go('login')" class="text-indigo-600 underline">Inicia sesión</a></p>
            </div>
        `;
        document.getElementById('register-form').onsubmit = (e) => {
            e.preventDefault();
            const user = document.getElementById('reg-user').value;
            const pass = document.getElementById('reg-pass').value;
            const confirm = document.getElementById('reg-pass-confirm').value;

            if (pass !== confirm) return alert('Las contraseñas no coinciden');
            
            DB.register({ username: user, password: pass });
            alert('Registro exitoso. Ahora puedes ingresar.');
            this.go('login');
        };
    },

    // --- VISTAS OPERATIVAS ---

    renderInventory() {
        const products = DB.getProducts();
        this.app.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Inventario de Productos</h2>
            <div class="bg-white p-4 rounded-xl shadow mb-6 border-t-4 border-indigo-500">
                <h3 class="font-bold text-sm text-gray-500 mb-3 uppercase">Agregar al Stock</h3>
                <div class="grid grid-cols-2 gap-2">
                    <input id="p-name" placeholder="Nombre del producto" class="p-2 border rounded text-sm">
                    <input id="p-price" type="number" placeholder="Precio ($)" class="p-2 border rounded text-sm">
                    <input id="p-stock" type="number" placeholder="Cantidad Inicial" class="p-2 border rounded col-span-2 text-sm">
                    <button onclick="UI.handleAddProduct()" class="bg-indigo-600 text-white p-2 rounded col-span-2 font-bold text-sm">Guardar en Inventario</button>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-3">
                ${products.map(p => `
                    <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border-l-4 ${p.stock < 3 ? 'border-red-500' : 'border-green-500'}">
                        <div>
                            <p class="font-bold text-gray-800">${p.name}</p>
                            <p class="text-xs text-gray-500">Precio: $${p.price.toLocaleString()} | Stock: ${p.stock}</p>
                        </div>
                        <div class="text-right">
                            ${p.stock < 3 ? '<span class="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">STOCK BAJO</span>' : ''}
                        </div>
                    </div>
                `).join('') || '<p class="text-center text-gray-400 py-10 italic">No hay productos registrados.</p>'}
            </div>
        `;
    },

    renderNewSale() {
        const products = DB.getProducts();
        this.app.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                <h2 class="text-xl font-bold mb-4 text-blue-600">Registrar Venta</h2>
                <form id="sale-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Producto</label>
                        <select id="s-prod" class="w-full p-3 border rounded-lg bg-gray-50" required>
                            <option value="">Seleccione un producto...</option>
                            ${products.map(p => `<option value="${p.id}" data-price="${p.price}">${p.name} (Disp: ${p.stock})</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Cantidad</label>
                            <input id="s-qty" type="number" class="w-full p-3 border rounded-lg" min="1" required>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Modo Pago</label>
                            <select id="s-mode" class="w-full p-3 border rounded-lg" onchange="UI.toggleInitialPay(this.value)">
                                <option value="completo">Pago Completo</option>
                                <option value="fiado">Fiado (A crédito)</option>
                            </select>
                        </div>
                    </div>

                    <div id="init-pay-container" class="hidden">
                        <label class="block text-xs font-bold text-gray-500 mb-1 uppercase">Abono Inicial ($)</label>
                        <input id="s-init" type="number" class="w-full p-3 border rounded-lg" value="0">
                    </div>

                    <div class="pt-4 border-t">
                        <p class="text-xs font-bold text-gray-400 mb-3 uppercase">Información del Cliente</p>
                        <div class="space-y-2">
                            <input id="c-name" placeholder="Nombre Completo" class="w-full p-2 border rounded" required>
                            <input id="c-phone" placeholder="Celular / WhatsApp" class="w-full p-2 border rounded">
                            <input id="c-doc" placeholder="Cédula / Documento" class="w-full p-2 border rounded">
                        </div>
                    </div>
                    
                    <button class="w-full bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">Finalizar Venta</button>
                </form>
            </div>
        `;

        document.getElementById('sale-form').onsubmit = (e) => {
            e.preventDefault();
            UI.handleSale();
        };
    },

    renderWallet() {
        const creditSales = DB.getSales().filter(s => s.paymentMode === 'fiado' && s.balance > 0);
        this.app.innerHTML = `
            <h2 class="text-xl font-bold mb-4">Cartera de Clientes</h2>
            <div class="space-y-4">
                ${creditSales.map(s => `
                    <div class="bg-white p-5 rounded-xl shadow-md border-r-4 border-orange-500">
                        <div class="flex justify-between items-start border-b pb-2 mb-3">
                            <div>
                                <h3 class="font-bold text-gray-800 uppercase text-sm">${s.client.name}</h3>
                                <p class="text-[10px] text-gray-400">${s.id} | ${new Date(s.date).toLocaleDateString()}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-gray-400 uppercase">Saldo Pendiente</p>
                                <p class="text-lg font-black text-orange-600">$${s.balance.toLocaleString()}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="pay-${s.id}" type="number" placeholder="Monto a abonar" class="flex-1 p-2 border rounded-lg text-sm bg-orange-50">
                            <button onclick="UI.handleAbono('${s.id}')" class="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow hover:bg-orange-600">Abonar</button>
                        </div>
                    </div>
                `).join('') || '<div class="text-center py-20 bg-white rounded-xl"><i class="fas fa-check-circle text-green-400 text-4xl mb-2"></i><p class="text-gray-400">No hay cuentas pendientes.</p></div>'}
            </div>
        `;
    }
};

/**
 * UI - Controladores de Eventos y Lógica Intermedia
 */
const UI = {
    handleAddProduct() {
        const name = document.getElementById('p-name').value;
        const price = document.getElementById('p-price').value;
        const stock = document.getElementById('p-stock').value;
        if(!name || !price || !stock) return alert('Completa todos los campos del producto');
        
        DB.saveProduct({ name, price: parseFloat(price), stock: parseInt(stock) });
        Router.renderInventory();
    },

    toggleInitialPay(mode) {
        const container = document.getElementById('init-pay-container');
        mode === 'fiado' ? container.classList.remove('hidden') : container.classList.add('hidden');
    },

    handleSale() {
        try {
            const select = document.getElementById('s-prod');
            const qty = parseInt(document.getElementById('s-qty').value);
            
            const sale = {
                productId: select.value,
                productName: select.options[select.selectedIndex].text.split(' (')[0],
                price: select.options[select.selectedIndex].dataset.price,
                quantity: qty,
                paymentMode: document.getElementById('s-mode').value,
                initialPayment: parseFloat(document.getElementById('s-init').value) || 0,
                date: new Date().toISOString(),
                client: {
                    name: document.getElementById('c-name').value,
                    phone: document.getElementById('c-phone').value,
                    doc: document.getElementById('c-doc').value
                }
            };

            DB.processSale(sale);
            alert('¡Venta registrada con éxito!');
            Router.go('inventory');
        } catch (err) {
            alert(err.message);
        }
    },

    handleAbono(id) {
        const input = document.getElementById(`pay-${id}`);
        const amount = parseFloat(input.value);
        if(isNaN(amount) || amount <= 0) return alert('Ingresa un monto válido');
        
        DB.addCreditPayment(id, amount);
        alert('Abono registrado correctamente');
        Router.renderWallet();
    }
};

// Logout Global
document.getElementById('logout-btn').onclick = () => {
    if(confirm('¿Cerrar sesión?')) {
        localStorage.removeItem(DB.KEYS.CURRENT_USER);
        Router.go('login');
    }
};

// Inicializar Aplicación
window.onload = () => Router.go('inventory');