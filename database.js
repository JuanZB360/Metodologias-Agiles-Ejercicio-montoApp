/**
 * DATABASE.JS - Motor de Persistencia y Reglas de Negocio
 */
const DB = {
    KEYS: {
        USERS: 'shop_users',
        PRODUCTS: 'shop_inventory',
        SALES: 'shop_sales',
        CURRENT_USER: 'shop_session'
    },

    // --- UTILIDADES ---
    _save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    _get: (key) => JSON.parse(localStorage.getItem(key)) || [],

    // --- GESTIÓN DE USUARIOS ---
    register(user) {
        const users = this._get(this.KEYS.USERS);
        users.push(user);
        this._save(this.KEYS.USERS, users);
    },
    login(username, password) {
        const users = this._get(this.KEYS.USERS);
        const user = users.find(u => u.username === username && u.password === password);
        if (user) localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
        return user;
    },

    // --- GESTIÓN DE INVENTARIO ---
    getProducts: () => DB._get(DB.KEYS.PRODUCTS),
    
    saveProduct(product) {
        const products = this.getProducts();
        product.id = Date.now();
        products.push(product);
        this._save(this.KEYS.PRODUCTS, products);
    },
    
    updateProductStock(productId, quantityToSubtract) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id == productId);
        if (index !== -1) {
            products[index].stock = parseInt(products[index].stock, 10) - parseInt(quantityToSubtract, 10);
            this._save(this.KEYS.PRODUCTS, products);
        }
    },

    // --- GESTIÓN DE VENTAS Y CARTERA ---
    getSales: () => DB._get(DB.KEYS.SALES),
    
    processSale(sale) {
        const products = this.getProducts();
        const product = products.find(p => p.id == sale.productId);

        // Validación de Stock
        if (!product || parseInt(product.stock, 10) < parseInt(sale.quantity, 10)) {
            throw new Error(`Stock insuficiente. Disponible: ${product ? product.stock : 0}`);
        }

        // Registrar Venta
        const sales = this.getSales();
        sale.id = `SALE-${Date.now()}`;
        sale.total = parseFloat(sale.price) * parseInt(sale.quantity, 10);
        sale.balance = sale.paymentMode === 'fiado' ? (sale.total - parseFloat(sale.initialPayment)) : 0;
        sale.history = [{ date: new Date().toISOString(), amount: sale.initialPayment || sale.total }];
        
        sales.push(sale);
        this._save(this.KEYS.SALES, sales);

        // Descontar Stock
        this.updateProductStock(sale.productId, sale.quantity);
        return true;
    },

    addCreditPayment(saleId, amount) {
        const sales = this.getSales();
        const index = sales.findIndex(s => s.id === saleId);
        if (index !== -1) {
            const pay = parseFloat(amount);
            sales[index].balance -= pay;
            sales[index].history.push({ date: new Date().toISOString(), amount: pay });
            this._save(this.KEYS.SALES, sales);
        }
    }
};