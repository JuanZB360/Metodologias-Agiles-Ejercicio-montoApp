/**
 * APP.JS - Lógica de Interfaz y Navegación SPA
 */
const Router = {
    app: document.getElementById('app'),

    go(view) {
        const currentUser = localStorage.getItem(DB.KEYS.CURRENT_USER);
        const nav = document.getElementById('bottom-nav');
        const logoutBtn = document.getElementById('logout-btn');

        if (!currentUser) {
            nav.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            if (view === 'register') return this.renderRegister();
            return this.renderLogin();
        }

        nav.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');

        // Renderizado del contenido con una suave animación de entrada
        this.app.classList.add('opacity-0');
        
        setTimeout(() => {
            switch(view) {
                case 'inventory': this.renderInventory(); break;
                case 'new-sale': this.renderNewSale(); break;
                case 'wallet': this.renderWallet(); break;
                case 'history': this.renderHistory(); break; // NUEVA RUTA
                default: this.renderInventory();
            }
            this.app.classList.remove('opacity-0');
            this.app.classList.add('transition-opacity', 'duration-300');
        }, 50);
    },

    // --- VISTAS DE AUTENTICACIÓN ---
    renderLogin() {
        this.app.innerHTML = `
            <section class="bg-white p-8 md:p-10 rounded-3xl shadow-xl max-w-md mx-auto mt-12 border border-slate-100">
                <div class="text-center mb-8">
                    <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-user-lock text-2xl text-indigo-600"></i>
                    </div>
                    <h2 class="text-2xl font-extrabold text-slate-800">Bienvenido de nuevo</h2>
                    <p class="text-sm text-slate-500 mt-1">Ingresa tus credenciales para continuar</p>
                </div>
                <form id="login-form" class="space-y-5">
                    <div>
                        <input type="text" id="user" placeholder="Usuario" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required>
                    </div>
                    <div>
                        <input type="password" id="pass" placeholder="Contraseña" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" required>
                    </div>
                    <button type="submit" class="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">Ingresar al Sistema</button>
                </form>
                <p class="mt-6 text-center text-sm text-slate-500">¿No tienes cuenta? <a href="#" onclick="Router.go('register'); return false;" class="text-indigo-600 font-bold hover:underline">Regístrate aquí</a></p>
            </section>
        `;
        document.getElementById('login-form').onsubmit = (e) => {
            e.preventDefault();
            const u = DB.login(document.getElementById('user').value, document.getElementById('pass').value);
            u ? this.go('inventory') : alert('Usuario o contraseña incorrectos');
        };
    },

    renderRegister() {
        this.app.innerHTML = `
            <section class="bg-white p-8 md:p-10 rounded-3xl shadow-xl max-w-md mx-auto mt-12 border border-slate-100">
                <div class="text-center mb-8">
                    <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-user-plus text-2xl text-green-600"></i>
                    </div>
                    <h2 class="text-2xl font-extrabold text-slate-800">Crear Cuenta</h2>
                </div>
                <form id="register-form" class="space-y-4">
                    <input type="text" id="reg-user" placeholder="Nombre de Usuario" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" required>
                    <input type="password" id="reg-pass" placeholder="Contraseña" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" required>
                    <input type="password" id="reg-pass-confirm" placeholder="Confirmar Contraseña" class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all" required>
                    <button type="submit" class="w-full bg-green-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all mt-2">Registrarme</button>
                </form>
                <p class="mt-6 text-center text-sm text-slate-500">¿Ya tienes cuenta? <a href="#" onclick="Router.go('login'); return false;" class="text-indigo-600 font-bold hover:underline">Inicia sesión</a></p>
            </section>
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
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-extrabold text-slate-800">Mi Inventario</h2>
                <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">${products.length} Items</span>
            </div>
            
            <section class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h3 class="font-bold text-xs text-indigo-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <i class="fas fa-plus-circle"></i> Nuevo Producto
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input id="p-name" type="text" placeholder="Nombre del producto" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none md:col-span-2 transition-all">
                    <input id="p-price" type="number" placeholder="Precio venta ($)" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <input id="p-stock" type="number" placeholder="Stock Inicial" class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                    <button type="button" onclick="UI.handleAddProduct()" class="md:col-span-4 bg-indigo-600 text-white p-3 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors mt-1">Guardar Producto</button>
                </div>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${products.map(p => `
                    <article class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div class="absolute left-0 top-0 bottom-0 w-1 ${p.stock <= 3 ? 'bg-red-500' : 'bg-green-400'}"></div>
                        <div class="pl-2">
                            <h4 class="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">${p.name}</h4>
                            <p class="text-sm font-medium text-slate-500 mt-1">$${p.price.toLocaleString()} <span class="mx-2 text-slate-300">|</span> Stock: <span class="${p.stock <= 3 ? 'text-red-500 font-bold' : 'text-slate-700'}">${p.stock}</span></p>
                        </div>
                        <div class="text-right">
                            ${p.stock <= 3 ? '<span class="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-md font-bold uppercase tracking-wider">¡Bajo!</span>' : ''}
                        </div>
                    </article>
                `).join('') || `
                    <div class="md:col-span-2 text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <i class="fas fa-box-open text-slate-300 text-5xl mb-3"></i>
                        <p class="text-slate-500 font-medium">No tienes productos en tu inventario aún.</p>
                    </div>
                `}
            </section>
        `;
    },

    renderNewSale() {
        const products = DB.getProducts();
        this.app.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-extrabold text-slate-800">Registrar Venta</h2>
            </div>
            <section class="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                <form id="sale-form" class="space-y-6">
                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <label for="s-prod" class="block text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider">¿Qué vas a vender?</label>
                        <select id="s-prod" class="w-full p-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium transition-all" required>
                            <option value="">Seleccione un producto del inventario...</option>
                            ${products.map(p => `<option value="${p.id}" data-price="${p.price}" ${p.stock <= 0 ? 'disabled' : ''}>${p.name} - $${p.price} (Stock: ${p.stock})</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="s-qty" class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Cantidad</label>
                            <input id="s-qty" type="number" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" min="1" value="1" required>
                        </div>
                        <div>
                            <label for="s-mode" class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Modo de Pago</label>
                            <select id="s-mode" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" onchange="UI.toggleInitialPay(this.value)">
                                <option value="completo">Pago Completo (Contado)</option>
                                <option value="fiado">Fiado (A crédito / Pendiente)</option>
                            </select>
                        </div>
                    </div>

                    <div id="init-pay-container" class="hidden bg-orange-50 p-4 rounded-2xl border border-orange-100 transition-all">
                        <label for="s-init" class="block text-xs font-bold text-orange-600 mb-2 uppercase tracking-wider">Abono Inicial del Cliente ($)</label>
                        <input id="s-init" type="number" class="w-full p-3 bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0" value="0">
                        <p class="text-[10px] text-orange-500 mt-2 italic">* Si el cliente no deja abono, déjalo en 0.</p>
                    </div>

                    <div class="pt-4 border-t border-slate-100">
                        <label class="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider"><i class="far fa-address-card mr-1"></i> Datos del Cliente</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input id="c-name" type="text" placeholder="Nombre Completo" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all md:col-span-2" required>
                            <input id="c-phone" type="tel" placeholder="Celular / WhatsApp" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                            <input id="c-doc" type="text" placeholder="Cédula / NIT (Opcional)" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        </div>
                    </div>
                    
                    <button type="submit" class="w-full bg-blue-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mt-4">
                        <i class="fas fa-check-circle mr-2"></i> Procesar Venta
                    </button>
                </form>
            </section>
        `;

        document.getElementById('sale-form').onsubmit = (e) => {
            e.preventDefault();
            UI.handleSale();
        };
    },

    renderWallet() {
        const creditSales = DB.getSales().filter(s => s.paymentMode === 'fiado' && s.balance > 0);
        this.app.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-extrabold text-slate-800">Cartera Pendiente</h2>
                <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">${creditSales.length} Cuentas</span>
            </div>
            <section class="grid grid-cols-1 md:grid-cols-2 gap-5">
                ${creditSales.map(s => `
                    <article class="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 border-t-4 border-t-orange-500 relative overflow-hidden group">
                        <div class="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 class="font-extrabold text-slate-800 text-lg uppercase">${s.client.name}</h3>
                                <p class="text-xs font-medium text-slate-500 mt-1"><i class="fas fa-box text-slate-400 mr-1"></i> ${s.quantity}x ${s.productName}</p>
                                <p class="text-[10px] text-slate-400 mt-1">${new Date(s.date).toLocaleDateString()}</p>
                            </div>
                            <div class="text-right bg-orange-50 p-2 rounded-xl border border-orange-100">
                                <p class="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Deuda Actual</p>
                                <p class="text-xl font-black text-orange-600">$${s.balance.toLocaleString()}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="pay-${s.id}" type="number" placeholder="Monto a abonar..." class="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium">
                            <button type="button" onclick="UI.handleAbono('${s.id}')" class="bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors">Abonar</button>
                        </div>
                    </article>
                `).join('') || `
                    <div class="md:col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-3xl text-green-500"></i>
                        </div>
                        <h3 class="text-lg font-bold text-slate-800">¡Cartera limpia!</h3>
                        <p class="text-slate-500 font-medium">No tienes clientes con deudas pendientes.</p>
                    </div>
                `}
            </section>
        `;
    },

    // --- NUEVA VISTA: HISTORIAL DE VENTAS ---
    renderHistory() {
        // Obtenemos todas las ventas y las ordenamos de la más reciente a la más antigua
        const sales = DB.getSales().sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Calculamos estadísticas rápidas
        const totalIncome = sales.reduce((sum, s) => sum + (s.total - s.balance), 0);
        const pendingMoney = sales.reduce((sum, s) => sum + s.balance, 0);

        this.app.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-extrabold text-slate-800">Historial General</h2>
                <p class="text-sm text-slate-500 font-medium mt-1">Registro de todas las transacciones</p>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="bg-indigo-600 p-4 rounded-2xl text-white shadow-md">
                    <p class="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">Ingresos Reales</p>
                    <p class="text-xl font-black">$${totalIncome.toLocaleString()}</p>
                </div>
                <div class="bg-orange-500 p-4 rounded-2xl text-white shadow-md">
                    <p class="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">Dinero en Calle</p>
                    <p class="text-xl font-black">$${pendingMoney.toLocaleString()}</p>
                </div>
            </div>

            <section class="space-y-4">
                ${sales.map(s => {
                    const isPaid = s.balance <= 0;
                    return `
                    <article class="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div class="flex justify-between items-start mb-3">
                            <div>
                                <h3 class="font-bold text-slate-800 text-md flex items-center gap-2">
                                    ${s.productName} 
                                    <span class="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-bold">x${s.quantity}</span>
                                </h3>
                                <p class="text-xs text-slate-400 mt-1"><i class="far fa-calendar-alt mr-1"></i> ${new Date(s.date).toLocaleString()}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-black text-slate-800">$${s.total.toLocaleString()}</p>
                                <span class="inline-block mt-1 text-[9px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">
                                    ${isPaid ? '<i class="fas fa-check mr-1"></i> Pagado' : '<i class="fas fa-clock mr-1"></i> Pendiente'}
                                </span>
                            </div>
                        </div>
                        <div class="bg-slate-50 px-3 py-2 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                            <span class="text-slate-600 font-medium"><i class="fas fa-user-circle text-slate-400 mr-1"></i> ${s.client.name}</span>
                            <span class="text-slate-500">Ref: <span class="font-mono text-[10px]">${s.id.split('-')[1]}</span></span>
                        </div>
                    </article>
                    `;
                }).join('') || `
                    <div class="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
                        <i class="fas fa-receipt text-slate-300 text-5xl mb-3"></i>
                        <p class="text-slate-500 font-medium">Aún no hay ventas registradas.</p>
                    </div>
                `}
            </section>
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
        
        DB.saveProduct({ name, price: parseFloat(price), stock: parseInt(stock, 10) });
        Router.renderInventory(); // Recarga la vista para limpiar y mostrar
    },

    toggleInitialPay(mode) {
        const container = document.getElementById('init-pay-container');
        if(mode === 'fiado') {
            container.classList.remove('hidden');
            // Pequeña animación
            setTimeout(() => container.classList.add('opacity-100'), 10);
        } else {
            container.classList.add('hidden');
            document.getElementById('s-init').value = 0; // Resetea valor si cambia a completo
        }
    },

    handleSale() {
        try {
            const select = document.getElementById('s-prod');
            const qty = parseInt(document.getElementById('s-qty').value, 10);
            
            const sale = {
                productId: select.value,
                productName: select.options[select.selectedIndex].text.split(' - ')[0], // Ajustado por el nuevo formato del option
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
            alert('✅ ¡Venta registrada con éxito!');
            Router.go('history'); // Después de vender, lo llevamos al historial para que vea el éxito
        } catch (err) {
            alert('❌ Error: ' + err.message);
        }
    },

    handleAbono(id) {
        const input = document.getElementById(`pay-${id}`);
        const amount = parseFloat(input.value);
        if(isNaN(amount) || amount <= 0) return alert('Ingresa un monto válido mayor a 0');
        
        DB.addCreditPayment(id, amount);
        alert('💰 Abono registrado correctamente');
        Router.renderWallet(); // Recarga la cartera
    }
};

// Logout Global
document.getElementById('logout-btn').onclick = () => {
    if(confirm('¿Seguro que deseas cerrar sesión?')) {
        localStorage.removeItem(DB.KEYS.CURRENT_USER);
        Router.go('login');
    }
};

// Inicializar Aplicación
window.onload = () => Router.go('inventory');