/**
 * Abelha da Amazônia - Gerenciamento de Dados e Persistência Local (Store)
 */

const STORAGE_KEYS = {
    PRODUCTS: 'abz_products',
    ORDERS: 'abz_orders',
    SETTINGS: 'abz_settings',
    CART: 'abz_cart',
    COUPONS: 'abz_coupons',
    VERSION: 'abz_version_2'
};

const Store = {
    // Inicialização da base de dados local
    init() {
        const hasV2 = localStorage.getItem(STORAGE_KEYS.VERSION);
        if (!hasV2) {
            // Atualiza para os produtos com as fotos reais dos apiários
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
            localStorage.setItem(STORAGE_KEYS.VERSION, 'true');
        } else if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
            localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
            // Pedidos iniciais de demonstração para o painel de vendas já apresentar métricas reais
            const initialOrders = [
                {
                    id: "ABZ-2026-1042",
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
                    customer: {
                        name: "Mariana Albuquerque",
                        email: "mariana.albuquerque@email.com",
                        phone: "(69) 99234-5678",
                        cpf: "123.456.789-00",
                        address: {
                            cep: "76801-000",
                            street: "Av. Sete de Setembro",
                            number: "1420",
                            complement: "Apt 302",
                            neighborhood: "Centro",
                            city: "Porto Velho",
                            state: "RO"
                        }
                    },
                    items: [
                        { id: "prod-2", name: "Mel Silvestre da Floresta 1kg", price: 65.00, quantity: 2, image: DEFAULT_PRODUCTS[1].image },
                        { id: "prod-4", name: "Extrato de Própolis Verde Amazônica 30ml", price: 28.00, quantity: 1, image: DEFAULT_PRODUCTS[3].image }
                    ],
                    subtotal: 158.00,
                    discount: 0.00,
                    shipping: 15.00,
                    shippingMethod: "SEDEX Expresso",
                    total: 173.00,
                    paymentMethod: "pix",
                    paymentStatus: "Pago",
                    status: "Enviado",
                    trackingCode: "RO982347123BR",
                    notes: "Entregar no período da tarde."
                },
                {
                    id: "ABZ-2026-1043",
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
                    customer: {
                        name: "Carlos Eduardo Silva",
                        email: "carlos.silva@email.com",
                        phone: "(11) 98765-4321",
                        cpf: "987.654.321-11",
                        address: {
                            cep: "01310-100",
                            street: "Avenida Paulista",
                            number: "1000",
                            complement: "Conj 51",
                            neighborhood: "Bela Vista",
                            city: "São Paulo",
                            state: "SP"
                        }
                    },
                    items: [
                        { id: "prod-6", name: "Super Combo Imunidade: Mel 1kg + 2 Própolis", price: 105.00, quantity: 1, image: DEFAULT_PRODUCTS[5].image }
                    ],
                    subtotal: 105.00,
                    discount: 10.50,
                    coupon: "AMAZONIA10",
                    shipping: 24.50,
                    shippingMethod: "PAC Econômico",
                    total: 119.00,
                    paymentMethod: "cartao",
                    paymentStatus: "Pago",
                    status: "Em Separação",
                    notes: ""
                }
            ];
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
        }
    },

    // Produtos
    getProducts() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || DEFAULT_PRODUCTS;
        } catch (e) {
            return DEFAULT_PRODUCTS;
        }
    },

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => String(p.id) === String(id)) || null;
    },

    saveProduct(productData) {
        const products = this.getProducts();
        if (productData.id) {
            // Edição
            const index = products.findIndex(p => String(p.id) === String(productData.id));
            if (index !== -1) {
                products[index] = { ...products[index], ...productData };
            } else {
                products.push(productData);
            }
        } else {
            // Novo
            const newId = 'prod-' + Date.now();
            const newProduct = {
                id: newId,
                rating: 5.0,
                reviewsCount: 0,
                ...productData
            };
            products.push(newProduct);
        }
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return true;
    },

    deleteProduct(id) {
        let products = this.getProducts();
        products = products.filter(p => String(p.id) !== String(id));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return true;
    },

    // Abate de estoque automático na compra/venda
    reduceStock(cartItems) {
        const products = this.getProducts();
        cartItems.forEach(item => {
            const product = products.find(p => String(p.id) === String(item.id));
            if (product) {
                product.stock = Math.max(0, (product.stock || 0) - item.quantity);
            }
        });
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    },

    // Pedidos & Vendas
    getOrders() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
        } catch (e) {
            return [];
        }
    },

    getOrderById(id) {
        const orders = this.getOrders();
        return orders.find(o => String(o.id) === String(id)) || null;
    },

    saveOrder(orderData) {
        const orders = this.getOrders();
        orders.unshift(orderData); // mais recentes primeiro
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        
        // Atualiza estoque
        if (orderData.items && orderData.items.length) {
            this.reduceStock(orderData.items);
        }
        return orderData;
    },

    updateOrderStatus(orderId, newStatus, trackingCode = null) {
        const orders = this.getOrders();
        const order = orders.find(o => String(o.id) === String(orderId));
        if (order) {
            order.status = newStatus;
            if (newStatus === 'Pago' || newStatus === 'Em Separação' || newStatus === 'Enviado' || newStatus === 'Entregue') {
                order.paymentStatus = 'Pago';
            } else if (newStatus === 'Cancelado') {
                order.paymentStatus = 'Cancelado';
            }
            if (trackingCode !== null) {
                order.trackingCode = trackingCode;
            }
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            return true;
        }
        return false;
    },

    // Cupons
    getCoupons() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS)) || DEFAULT_COUPONS;
        } catch (e) {
            return DEFAULT_COUPONS;
        }
    },

    validateCoupon(code, subtotal) {
        if (!code) return { valid: false, message: "Insira um código de cupom." };
        const cleanCode = code.trim().toUpperCase();
        const coupons = this.getCoupons();
        const coupon = coupons.find(c => c.code === cleanCode && c.active);

        if (!coupon) {
            return { valid: false, message: "Cupom inválido ou expirado." };
        }

        if (subtotal < coupon.minPurchase) {
            return {
                valid: false,
                message: `Este cupom requer um valor mínimo de compra de R$ ${coupon.minPurchase.toFixed(2)}.`
            };
        }

        let discount = 0;
        let freeShipping = !!coupon.freeShipping;

        if (coupon.discountPercent) {
            discount = (subtotal * coupon.discountPercent) / 100;
        }

        return {
            valid: true,
            coupon: coupon,
            discount: discount,
            freeShipping: freeShipping,
            message: `Cupom aplicado! ${coupon.discountPercent ? coupon.discountPercent + '% OFF' : 'Frete Grátis'}`
        };
    },

    // Configurações
    getSettings() {
        this.init();
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    },

    saveSettings(newSettings) {
        const current = this.getSettings();
        const updated = { ...current, ...newSettings };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
    },

    // Formatadores úteis
    formatCurrency(value) {
        return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    formatDate(dateStr) {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
};

// Auto-inicializar ao carregar o script
Store.init();
