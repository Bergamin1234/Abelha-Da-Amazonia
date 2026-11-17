/**
 * Abelha da Amazônia - Gerenciamento do Carrinho de Compras
 */

const Cart = {
    items: [],
    shipping: 0,
    shippingMethod: null,
    coupon: null,
    discount: 0,

    init() {
        this.loadCart();
        this.updateUI();
        this.bindEvents();
    },

    loadCart() {
        try {
            this.items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
        } catch (e) {
            this.items = [];
        }
    },

    saveCart() {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.items));
        this.updateUI();
    },

    addItem(productId, quantity = 1, openDrawer = true) {
        const product = Store.getProductById(productId);
        if (!product) {
            this.showToast('Produto não encontrado.', 'error');
            return false;
        }

        if (product.stock <= 0) {
            this.showToast('Desculpe, este produto está temporariamente sem estoque.', 'warning');
            return false;
        }

        const existingIndex = this.items.findIndex(item => String(item.id) === String(productId));
        if (existingIndex > -1) {
            const currentQty = this.items[existingIndex].quantity;
            if (currentQty + quantity > product.stock) {
                this.showToast(`Limite em estoque atingido (${product.stock} un disponíveis).`, 'warning');
                return false;
            }
            this.items[existingIndex].quantity += quantity;
        } else {
            if (quantity > product.stock) {
                this.showToast(`Apenas ${product.stock} unidades disponíveis em estoque.`, 'warning');
                return false;
            }
            this.items.push({
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
                quantity: quantity,
                categoryName: product.categoryName || ''
            });
        }

        this.saveCart();
        this.showToast(`"${product.name}" adicionado ao carrinho! 🍯`, 'success');

        if (openDrawer) {
            this.openDrawer();
        }
        return true;
    },

    updateQuantity(productId, newQty) {
        const product = Store.getProductById(productId);
        const index = this.items.findIndex(item => String(item.id) === String(productId));
        
        if (index === -1) return;

        if (newQty <= 0) {
            this.removeItem(productId);
            return;
        }

        if (product && newQty > product.stock) {
            this.showToast(`Estoque máximo atingido: ${product.stock} unidades.`, 'warning');
            this.items[index].quantity = product.stock;
        } else {
            this.items[index].quantity = newQty;
        }

        this.saveCart();
    },

    removeItem(productId) {
        const item = this.items.find(i => String(i.id) === String(productId));
        this.items = this.items.filter(i => String(i.id) !== String(productId));
        this.saveCart();
        if (item) {
            this.showToast(`"${item.name}" removido do carrinho.`, 'info');
        }
    },

    clearCart() {
        this.items = [];
        this.coupon = null;
        this.discount = 0;
        this.shipping = 0;
        this.shippingMethod = null;
        localStorage.removeItem(STORAGE_KEYS.CART);
        this.updateUI();
    },

    getCount() {
        return this.items.reduce((total, item) => total + (item.quantity || 0), 0);
    },

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = this.discount || 0;
        const shipping = this.shipping || 0;
        return Math.max(0, subtotal - discount + shipping);
    },

    applyCoupon(code) {
        const subtotal = this.getSubtotal();
        const result = Store.validateCoupon(code, subtotal);
        if (result.valid) {
            this.coupon = result.coupon;
            this.discount = result.discount;
            if (result.freeShipping) {
                this.shipping = 0;
                this.shippingMethod = "Frete Grátis (Cupom)";
            }
            this.showToast(result.message, 'success');
        } else {
            this.coupon = null;
            this.discount = 0;
            this.showToast(result.message, 'error');
        }
        this.updateUI();
        return result;
    },

    calculateShipping(cep) {
        const cleanCep = (cep || '').replace(/\D/g, '');
        if (cleanCep.length !== 8) {
            this.showToast('Por favor, informe um CEP válido com 8 dígitos.', 'warning');
            return null;
        }

        const subtotal = this.getSubtotal();
        const isRO = cleanCep.startsWith('768') || cleanCep.startsWith('769'); // Rondônia
        
        // Simulação realista baseada na região
        let pacCost = isRO ? 12.00 : 26.50;
        let sedexCost = isRO ? 22.00 : 48.00;
        let pacDays = isRO ? "2 a 4 dias úteis" : "5 a 9 dias úteis";
        let sedexDays = isRO ? "1 a 2 dias úteis" : "2 a 4 dias úteis";

        // Frete grátis acima do limite configurado
        const settings = Store.getSettings();
        const freeLimit = settings.freeShippingThreshold || 200;
        if (subtotal >= freeLimit || (this.coupon && this.coupon.freeShipping)) {
            pacCost = 0.00;
        }

        return [
            { id: 'pac', name: 'PAC Econômico', cost: pacCost, prazo: pacDays },
            { id: 'sedex', name: 'SEDEX Expresso', cost: sedexCost, prazo: sedexDays },
            ...(isRO ? [{ id: 'retirada', name: 'Retirada em Porto Velho (Loja/Apiário)', cost: 0.00, prazo: 'Imediato' }] : [])
        ];
    },

    setShipping(methodId, cost, name) {
        this.shipping = Number(cost);
        this.shippingMethod = `${name} (${cost === 0 ? 'Grátis' : Store.formatCurrency(cost)})`;
        this.updateUI();
    },

    // UI Updates
    updateUI() {
        const count = this.getCount();
        const subtotal = this.getSubtotal();
        const total = this.getTotal();

        // Atualizar badges de quantidade
        document.querySelectorAll('.cart-count-badge').forEach(el => {
            el.textContent = count;
            el.classList.toggle('hidden', count === 0);
        });

        // Atualizar Drawer se presente na página
        const drawerContainer = document.getElementById('cart-drawer-items');
        if (drawerContainer) {
            if (this.items.length === 0) {
                drawerContainer.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-16 text-center px-4">
                        <div class="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 text-3xl">
                            <i class="fas fa-shopping-basket"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-800 mb-1">Seu carrinho está vazio</h4>
                        <p class="text-sm text-gray-500 mb-6">Que tal experimentar nosso mel silvestre 100% puro direto da Amazônia?</p>
                        <button onclick="Cart.closeDrawer()" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full text-sm transition">
                            Explorar Produtos
                        </button>
                    </div>
                `;
            } else {
                drawerContainer.innerHTML = this.items.map(item => `
                    <div class="flex items-center gap-3 p-3 bg-amber-50/40 rounded-xl border border-amber-100 hover:border-amber-200 transition">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <h5 class="text-sm font-semibold text-gray-800 truncate">${item.name}</h5>
                            <p class="text-xs text-amber-700 font-bold mb-2">${Store.formatCurrency(item.price)}</p>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                                    <button onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})" class="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs">
                                        <i class="fas fa-minus text-[10px]"></i>
                                    </button>
                                    <span class="px-2 text-xs font-semibold text-gray-800">${item.quantity}</span>
                                    <button onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})" class="px-2 py-0.5 text-gray-600 hover:bg-gray-100 text-xs">
                                        <i class="fas fa-plus text-[10px]"></i>
                                    </button>
                                </div>
                                <button onclick="Cart.removeItem('${item.id}')" class="text-gray-400 hover:text-red-500 text-xs p-1 transition" title="Remover item">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Totais no Drawer
        const subtotalEl = document.getElementById('cart-drawer-subtotal');
        if (subtotalEl) subtotalEl.textContent = Store.formatCurrency(subtotal);

        const discountRow = document.getElementById('cart-drawer-discount-row');
        const discountEl = document.getElementById('cart-drawer-discount');
        if (discountRow && discountEl) {
            if (this.discount > 0) {
                discountRow.classList.remove('hidden');
                discountEl.textContent = `- ${Store.formatCurrency(this.discount)}`;
            } else {
                discountRow.classList.add('hidden');
            }
        }

        const shippingEl = document.getElementById('cart-drawer-shipping');
        if (shippingEl) {
            shippingEl.textContent = this.shipping === 0 ? (this.shippingMethod ? 'Grátis' : 'Calcule o frete') : Store.formatCurrency(this.shipping);
        }

        const totalEl = document.getElementById('cart-drawer-total');
        if (totalEl) totalEl.textContent = Store.formatCurrency(total);

        const checkoutBtn = document.getElementById('cart-drawer-checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.items.length === 0;
            if (this.items.length === 0) {
                checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    },

    openDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if (drawer && overlay) {
            drawer.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        }
    },

    closeDrawer() {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if (drawer && overlay) {
            drawer.classList.add('translate-x-full');
            overlay.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    },

    showToast(message, type = 'info') {
        let toast = document.getElementById('global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'global-toast';
            toast.className = 'fixed bottom-5 right-5 z-[9999] max-w-sm px-4 py-3 rounded-xl shadow-xl transform transition-all duration-300 translate-y-20 opacity-0 flex items-center gap-3 text-sm font-medium';
            document.body.appendChild(toast);
        }

        const icons = {
            success: 'fa-check-circle text-emerald-400',
            error: 'fa-exclamation-circle text-red-400',
            warning: 'fa-exclamation-triangle text-amber-400',
            info: 'fa-info-circle text-blue-400'
        };

        const bgColors = {
            success: 'bg-gray-900 text-white border-l-4 border-emerald-500',
            error: 'bg-gray-900 text-white border-l-4 border-red-500',
            warning: 'bg-gray-900 text-white border-l-4 border-amber-500',
            info: 'bg-gray-900 text-white border-l-4 border-blue-500'
        };

        toast.className = `fixed bottom-5 right-5 z-[9999] max-w-sm px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 flex items-center gap-3 text-sm font-medium ${bgColors[type] || bgColors.info}`;
        toast.innerHTML = `<i class="fas ${icons[type] || icons.info} text-lg"></i> <span>${message}</span>`;

        // Mostrar
        setTimeout(() => {
            toast.classList.remove('translate-y-20', 'opacity-0');
        }, 10);

        // Ocultar após 3.5s
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3500);
    },

    bindEvents() {
        // Atalho de teclado para fechar drawer com Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDrawer();
            }
        });
    }
};

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
