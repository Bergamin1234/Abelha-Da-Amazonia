/**
 * Abelha da Amazônia - Painel Administrativo Completo
 * Gestão de Vendas, Catálogo de Produtos, Estoque e PDV Balcão
 */

const Admin = {
    currentTab: 'dashboard',
    posCart: [],

    init() {
        Auth.protectAdminPage();
        this.updateAdminHeader();
        this.bindNavigation();
        this.renderDashboard();
        this.renderOrders();
        this.renderProducts();
        this.renderPOS();
        this.loadSettings();
    },

    updateAdminHeader() {
        const session = Auth.getSession();
        const userEl = document.getElementById('admin-logged-user');
        if (userEl && session) {
            userEl.textContent = session.name || session.username;
        }
    },

    bindNavigation() {
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    },

    switchTab(tabName) {
        this.currentTab = tabName;

        // Atualizar links
        document.querySelectorAll('.admin-nav-item').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-tab') === tabName);
        });

        // Atualizar seções
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.toggle('hidden', sec.id !== `section-${tabName}`);
        });

        // Fechar menu mobile se aberto
        const sidebar = document.getElementById('admin-sidebar');
        if (sidebar && window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
        }

        if (tabName === 'dashboard') this.renderDashboard();
        if (tabName === 'orders') this.renderOrders();
        if (tabName === 'products') this.renderProducts();
        if (tabName === 'pos') this.renderPOS();
    },

    // ==========================================
    // 1. DASHBOARD & MÉTRICAS
    // ==========================================
    renderDashboard() {
        const orders = Store.getOrders();
        const products = Store.getProducts();

        // Faturamento Total (pedidos pagos)
        const totalRevenue = orders
            .filter(o => o.paymentStatus === 'Pago' || o.status === 'Pago' || o.status === 'Enviado' || o.status === 'Entregue')
            .reduce((sum, o) => sum + (o.total || 0), 0);

        // Total de Pedidos Realizados
        const totalOrders = orders.length;

        // Ticket Médio
        const paidOrders = orders.filter(o => o.paymentStatus === 'Pago' || o.status === 'Pago' || o.status === 'Enviado' || o.status === 'Entregue');
        const avgTicket = paidOrders.length > 0 ? (totalRevenue / paidOrders.length) : 0;

        // Produtos com estoque baixo (< 15 unidades)
        const lowStockProducts = products.filter(p => p.stock <= 15);

        // Preencher no DOM
        document.getElementById('metric-revenue').textContent = Store.formatCurrency(totalRevenue);
        document.getElementById('metric-orders').textContent = totalOrders;
        document.getElementById('metric-avg-ticket').textContent = Store.formatCurrency(avgTicket);
        document.getElementById('metric-low-stock').textContent = lowStockProducts.length;

        // Renderizar Últimos Pedidos no Dashboard
        const recentOrdersContainer = document.getElementById('dashboard-recent-orders');
        if (recentOrdersContainer) {
            const recent = orders.slice(0, 5);
            if (recent.length === 0) {
                recentOrdersContainer.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-xs text-gray-400">Nenhum pedido registrado ainda.</td></tr>`;
            } else {
                recentOrdersContainer.innerHTML = recent.map(o => `
                    <tr class="border-b border-stone-100 hover:bg-stone-50/60 transition text-xs">
                        <td class="py-3 px-4 font-mono font-bold text-amber-700">#${o.id}</td>
                        <td class="py-3 px-4 font-medium text-gray-900">${o.customer.name}</td>
                        <td class="py-3 px-4 text-gray-500">${Store.formatDate(o.createdAt)}</td>
                        <td class="py-3 px-4 font-bold text-gray-900">${Store.formatCurrency(o.total)}</td>
                        <td class="py-3 px-4">${this.getStatusBadge(o.status)}</td>
                        <td class="py-3 px-4 text-right">
                            <button onclick="Admin.viewOrderDetails('${o.id}')" class="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition">
                                Detalhes
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        }
    },

    getStatusBadge(status) {
        const s = (status || 'Pendente').toLowerCase();
        if (s.includes('pago')) return `<span class="badge-status status-pago"><i class="fas fa-check-circle"></i> Pago</span>`;
        if (s.includes('envia')) return `<span class="badge-status status-enviado"><i class="fas fa-truck"></i> Enviado</span>`;
        if (s.includes('entreg')) return `<span class="badge-status status-entregue"><i class="fas fa-box"></i> Entregue</span>`;
        if (s.includes('cancela')) return `<span class="badge-status status-cancelado"><i class="fas fa-times-circle"></i> Cancelado</span>`;
        return `<span class="badge-status status-pendente"><i class="fas fa-clock"></i> Pendente</span>`;
    },

    // ==========================================
    // 2. PEDIDOS & VENDAS (HISTÓRICO COMPLETO)
    // ==========================================
    renderOrders(filterStatus = 'all', searchQuery = '') {
        let orders = Store.getOrders();

        if (filterStatus !== 'all') {
            orders = orders.filter(o => o.status === filterStatus);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            orders = orders.filter(o => 
                o.id.toLowerCase().includes(q) ||
                o.customer.name.toLowerCase().includes(q) ||
                (o.customer.phone && o.customer.phone.includes(q)) ||
                (o.customer.email && o.customer.email.toLowerCase().includes(q))
            );
        }

        const tbody = document.getElementById('orders-table-body');
        const countEl = document.getElementById('orders-count-label');
        if (countEl) countEl.textContent = `${orders.length} pedido${orders.length !== 1 ? 's' : ''}`;

        if (!tbody) return;

        if (orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-12 text-xs text-gray-400">
                        <i class="fas fa-inbox text-3xl mb-2 text-stone-300 block"></i>
                        Nenhum pedido encontrado para o filtro selecionado.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr class="border-b border-stone-100 hover:bg-stone-50/80 transition text-xs">
                <td class="py-3 px-4 font-mono font-bold text-amber-700">#${o.id}</td>
                <td class="py-3 px-4">
                    <div class="font-bold text-gray-900">${o.customer.name}</div>
                    <div class="text-[11px] text-gray-500">${o.customer.phone || o.customer.email}</div>
                </td>
                <td class="py-3 px-4 text-gray-600">${Store.formatDate(o.createdAt)}</td>
                <td class="py-3 px-4 text-gray-600 capitalize">
                    <span class="inline-flex items-center gap-1 font-semibold">
                        ${o.paymentMethod === 'pix' ? '<i class="fas fa-qrcode text-emerald-600"></i> Pix' : (o.paymentMethod === 'cartao' ? '<i class="fas fa-credit-card text-amber-600"></i> Cartão' : '<i class="fas fa-money-bill text-stone-600"></i> ' + o.paymentMethod)}
                    </span>
                </td>
                <td class="py-3 px-4 font-bold text-gray-900">${Store.formatCurrency(o.total)}</td>
                <td class="py-3 px-4">
                    <select onchange="Admin.changeOrderStatus('${o.id}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-amber-500">
                        <option value="Pendente" ${o.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                        <option value="Pago" ${o.status === 'Pago' ? 'selected' : ''}>Pago</option>
                        <option value="Em Separação" ${o.status === 'Em Separação' ? 'selected' : ''}>Em Separação</option>
                        <option value="Enviado" ${o.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="Entregue" ${o.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                        <option value="Cancelado" ${o.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
                <td class="py-3 px-4 text-right space-x-1">
                    <button onclick="Admin.viewOrderDetails('${o.id}')" class="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition" title="Ver Detalhes">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    ${o.customer.phone ? `
                        <button onclick="Admin.sendWhatsAppNotification('${o.id}')" class="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition" title="Notificar no WhatsApp">
                            <i class="fab fa-whatsapp text-xs"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    },

    changeOrderStatus(orderId, newStatus) {
        Store.updateOrderStatus(orderId, newStatus);
        Cart.showToast(`Status do pedido #${orderId} alterado para "${newStatus}".`, 'success');
        this.renderDashboard();
    },

    viewOrderDetails(orderId) {
        const order = Store.getOrderById(orderId);
        if (!order) return;

        const modal = document.getElementById('order-detail-modal');
        const content = document.getElementById('order-detail-content');

        const addr = order.customer.address || {};

        content.innerHTML = `
            <div class="space-y-6">
                
                <!-- Header -->
                <div class="flex items-center justify-between pb-4 border-b border-stone-200">
                    <div>
                        <span class="text-xs font-mono font-bold text-amber-600 block">Pedido #${order.id}</span>
                        <h3 class="text-lg font-bold font-serif text-gray-900">${order.customer.name}</h3>
                        <span class="text-xs text-gray-500">${Store.formatDate(order.createdAt)}</span>
                    </div>
                    <div>${this.getStatusBadge(order.status)}</div>
                </div>

                <!-- Customer & Delivery -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
                    <div>
                        <h5 class="font-bold text-gray-900 mb-1 text-[11px] uppercase tracking-wider text-amber-800">Cliente</h5>
                        <p class="font-medium text-gray-800">${order.customer.name}</p>
                        <p class="text-gray-600">WhatsApp: ${order.customer.phone || 'Não informado'}</p>
                        <p class="text-gray-600">E-mail: ${order.customer.email || 'Não informado'}</p>
                        <p class="text-gray-600">CPF: ${order.customer.cpf || 'Não informado'}</p>
                    </div>
                    <div>
                        <h5 class="font-bold text-gray-900 mb-1 text-[11px] uppercase tracking-wider text-amber-800">Endereço de Entrega</h5>
                        <p class="text-gray-800">${addr.street || ''}, ${addr.number || ''} ${addr.complement ? '- ' + addr.complement : ''}</p>
                        <p class="text-gray-600">${addr.neighborhood || ''} - ${addr.city || ''} / ${addr.state || ''}</p>
                        <p class="text-gray-600">CEP: ${addr.cep || ''}</p>
                        <p class="text-gray-500 mt-1">Forma de Envio: <strong>${order.shippingMethod || 'Padrão'}</strong></p>
                    </div>
                </div>

                <!-- Products Table -->
                <div>
                    <h5 class="font-bold text-xs text-gray-900 mb-2 uppercase tracking-wider">Itens Comprados</h5>
                    <div class="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                        ${order.items.map(item => `
                            <div class="flex items-center justify-between p-3 bg-white text-xs">
                                <div class="flex items-center gap-3">
                                    <img src="${item.image}" alt="${item.name}" class="w-10 h-10 object-cover rounded-lg border border-stone-200">
                                    <div>
                                        <div class="font-bold text-gray-900">${item.name}</div>
                                        <div class="text-[11px] text-gray-500">Qtd: ${item.quantity} un × ${Store.formatCurrency(item.price)}</div>
                                    </div>
                                </div>
                                <div class="font-bold text-gray-900">${Store.formatCurrency(item.price * item.quantity)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Totals -->
                <div class="space-y-1 text-xs text-gray-600 pt-2 border-t border-stone-200">
                    <div class="flex justify-between">
                        <span>Subtotal:</span>
                        <span class="font-bold text-gray-800">${Store.formatCurrency(order.subtotal)}</span>
                    </div>
                    ${order.discount > 0 ? `
                        <div class="flex justify-between text-emerald-600">
                            <span>Desconto:</span>
                            <span class="font-bold">- ${Store.formatCurrency(order.discount)}</span>
                        </div>
                    ` : ''}
                    <div class="flex justify-between">
                        <span>Frete:</span>
                        <span class="font-bold text-gray-800">${order.shipping === 0 ? 'Grátis' : Store.formatCurrency(order.shipping)}</span>
                    </div>
                    <div class="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-stone-200">
                        <span>Total Pago:</span>
                        <span class="text-amber-600 font-serif text-base">${Store.formatCurrency(order.total)}</span>
                    </div>
                </div>

                <!-- Observações -->
                ${order.notes ? `
                    <div class="text-xs bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900">
                        <strong>Observações do Cliente:</strong> ${order.notes}
                    </div>
                ` : ''}

                <!-- Actions -->
                <div class="flex flex-wrap items-center justify-end gap-3 pt-3">
                    <button onclick="Admin.sendWhatsAppNotification('${order.id}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                        <i class="fab fa-whatsapp"></i>
                        <span>Notificar WhatsApp</span>
                    </button>
                    <button onclick="Admin.closeOrderModal()" class="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition">
                        Fechar
                    </button>
                </div>

            </div>
        `;

        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    },

    closeOrderModal() {
        const modal = document.getElementById('order-detail-modal');
        if (modal) modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    },

    sendWhatsAppNotification(orderId) {
        const order = Store.getOrderById(orderId);
        if (!order || !order.customer.phone) {
            Cart.showToast('Telefone do cliente não cadastrado.', 'warning');
            return;
        }

        const cleanPhone = order.customer.phone.replace(/\D/g, '');
        const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

        const msg = encodeURIComponent(
            `Olá ${order.customer.name}! 🐝 Aqui é da Abelha da Amazônia.\n\n` +
            `Informamos que seu pedido *#${order.id}* está com status: *${order.status}*.\n` +
            `Valor Total: ${Store.formatCurrency(order.total)}.\n\n` +
            `Agradecemos pela confiança em nosso mel 100% puro da floresta!`
        );

        window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
    },

    // ==========================================
    // 3. CATÁLOGO DE PRODUTOS & ESTOQUE
    // ==========================================
    renderProducts() {
        const products = Store.getProducts();
        const tbody = document.getElementById('admin-products-table-body');
        const countEl = document.getElementById('admin-products-count');
        if (countEl) countEl.textContent = `${products.length} itens`;

        if (!tbody) return;

        tbody.innerHTML = products.map(prod => `
            <tr class="border-b border-stone-100 hover:bg-stone-50/80 transition text-xs">
                <td class="py-3 px-4">
                    <img src="${prod.image}" alt="${prod.name}" class="w-12 h-12 object-cover rounded-xl border border-stone-200">
                </td>
                <td class="py-3 px-4">
                    <div class="font-bold text-gray-900">${prod.name}</div>
                    <div class="text-[11px] text-amber-700 font-medium">${prod.categoryName || 'Natural'}</div>
                </td>
                <td class="py-3 px-4 font-bold text-gray-900">${Store.formatCurrency(prod.price)}</td>
                <td class="py-3 px-4">
                    <div class="inline-flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                        <button onclick="Admin.adjustStock('${prod.id}', -1)" class="px-2 py-1 text-gray-500 hover:bg-stone-100 text-xs font-bold">-</button>
                        <span class="px-3 text-xs font-bold ${prod.stock <= 10 ? 'text-red-600' : 'text-gray-800'}">${prod.stock}</span>
                        <button onclick="Admin.adjustStock('${prod.id}', 1)" class="px-2 py-1 text-gray-500 hover:bg-stone-100 text-xs font-bold">+</button>
                    </div>
                </td>
                <td class="py-3 px-4">
                    ${prod.stock > 0 
                        ? (prod.stock <= 10 
                            ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Estoque Baixo</span>`
                            : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Disponível</span>`)
                        : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Esgotado</span>`
                    }
                </td>
                <td class="py-3 px-4 text-right space-x-1">
                    <button onclick="Admin.openEditProductModal('${prod.id}')" class="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-800 transition" title="Editar">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button onclick="Admin.deleteProduct('${prod.id}')" class="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 text-stone-700 hover:text-red-600 transition" title="Excluir">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    adjustStock(productId, delta) {
        const prod = Store.getProductById(productId);
        if (prod) {
            prod.stock = Math.max(0, (prod.stock || 0) + delta);
            Store.saveProduct(prod);
            this.renderProducts();
            this.renderDashboard();
        }
    },

    openNewProductModal() {
        document.getElementById('product-modal-title').textContent = 'Cadastrar Novo Produto';
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('product-modal').classList.remove('hidden');
    },

    openEditProductModal(productId) {
        const prod = Store.getProductById(productId);
        if (!prod) return;

        document.getElementById('product-modal-title').textContent = 'Editar Produto';
        document.getElementById('prod-id').value = prod.id;
        document.getElementById('prod-name').value = prod.name;
        document.getElementById('prod-category').value = prod.category || 'mel';
        document.getElementById('prod-price').value = prod.price;
        document.getElementById('prod-original-price').value = prod.originalPrice || '';
        document.getElementById('prod-stock').value = prod.stock;
        document.getElementById('prod-image').value = prod.image;
        document.getElementById('prod-badge').value = prod.badge || '';
        document.getElementById('prod-description').value = prod.description || '';

        document.getElementById('product-modal').classList.remove('hidden');
    },

    closeProductModal() {
        document.getElementById('product-modal').classList.add('hidden');
    },

    saveProductForm(e) {
        e.preventDefault();
        const id = document.getElementById('prod-id').value;
        const name = document.getElementById('prod-name').value.trim();
        const category = document.getElementById('prod-category').value;
        const price = parseFloat(document.getElementById('prod-price').value);
        const originalPrice = parseFloat(document.getElementById('prod-original-price').value) || null;
        const stock = parseInt(document.getElementById('prod-stock').value, 10);
        const image = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80';
        const badge = document.getElementById('prod-badge').value.trim() || null;
        const description = document.getElementById('prod-description').value.trim();

        const categoryNames = {
            'mel': 'Mel Puro',
            'propolis': 'Extratos & Própolis',
            'favos': 'Favos Naturais',
            'kits': 'Kits Especiais'
        };

        const productData = {
            name,
            category,
            categoryName: categoryNames[category] || 'Natural',
            price,
            originalPrice,
            stock,
            image,
            badge,
            description
        };

        if (id) {
            productData.id = id;
        }

        Store.saveProduct(productData);
        this.closeProductModal();
        this.renderProducts();
        this.renderDashboard();
        Cart.showToast(`Produto "${name}" salvo com sucesso!`, 'success');
    },

    deleteProduct(productId) {
        const prod = Store.getProductById(productId);
        if (!prod) return;

        if (confirm(`Tem certeza que deseja excluir o produto "${prod.name}"?`)) {
            Store.deleteProduct(productId);
            this.renderProducts();
            this.renderDashboard();
            Cart.showToast('Produto excluído com sucesso.', 'info');
        }
    },

    // ==========================================
    // 4. PONTO DE VENDA (PDV / VENDA MANUAL)
    // ==========================================
    renderPOS() {
        const products = Store.getProducts();
        const grid = document.getElementById('pos-products-grid');
        if (!grid) return;

        grid.innerHTML = products.map(prod => `
            <div onclick="Admin.addToPOS('${prod.id}')" class="p-3 bg-white rounded-2xl border border-stone-200 hover:border-amber-500 shadow-2xs cursor-pointer transition flex flex-col justify-between group">
                <div class="h-24 rounded-xl overflow-hidden bg-stone-100 mb-2">
                    <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                </div>
                <div>
                    <h5 class="text-xs font-bold text-gray-900 leading-snug line-clamp-1">${prod.name}</h5>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-xs font-bold text-amber-700">${Store.formatCurrency(prod.price)}</span>
                        <span class="text-[10px] text-gray-500">Estoque: ${prod.stock}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.renderPOSCart();
    },

    addToPOS(productId) {
        const prod = Store.getProductById(productId);
        if (!prod || prod.stock <= 0) {
            Cart.showToast('Produto sem estoque disponível.', 'warning');
            return;
        }

        const existing = this.posCart.find(i => String(i.id) === String(productId));
        if (existing) {
            if (existing.quantity + 1 > prod.stock) {
                Cart.showToast('Limite de estoque atingido.', 'warning');
                return;
            }
            existing.quantity += 1;
        } else {
            this.posCart.push({
                id: prod.id,
                name: prod.name,
                price: prod.price,
                image: prod.image,
                quantity: 1
            });
        }
        this.renderPOSCart();
    },

    updatePOSQuantity(productId, delta) {
        const item = this.posCart.find(i => String(i.id) === String(productId));
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.posCart = this.posCart.filter(i => String(i.id) !== String(productId));
        }
        this.renderPOSCart();
    },

    renderPOSCart() {
        const container = document.getElementById('pos-cart-items');
        if (!container) return;

        if (this.posCart.length === 0) {
            container.innerHTML = `
                <div class="py-12 text-center text-gray-400 text-xs">
                    <i class="fas fa-cash-register text-3xl mb-2 text-stone-300 block"></i>
                    Selecione produtos ao lado para iniciar a venda.
                </div>
            `;
            document.getElementById('pos-total').textContent = 'R$ 0,00';
            return;
        }

        container.innerHTML = this.posCart.map(item => `
            <div class="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div class="flex-1 min-w-0 pr-2">
                    <h6 class="font-bold text-gray-900 truncate">${item.name}</h6>
                    <span class="text-[11px] text-gray-500">${Store.formatCurrency(item.price)} cada</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                        <button onclick="Admin.updatePOSQuantity('${item.id}', -1)" class="px-2 py-0.5 text-gray-600 hover:bg-stone-100 font-bold">-</button>
                        <span class="px-2 font-bold text-gray-800 text-[11px]">${item.quantity}</span>
                        <button onclick="Admin.updatePOSQuantity('${item.id}', 1)" class="px-2 py-0.5 text-gray-600 hover:bg-stone-100 font-bold">+</button>
                    </div>
                    <span class="font-bold text-gray-900 w-16 text-right">${Store.formatCurrency(item.price * item.quantity)}</span>
                </div>
            </div>
        `).join('');

        const total = this.posCart.reduce((s, i) => s + (i.price * i.quantity), 0);
        document.getElementById('pos-total').textContent = Store.formatCurrency(total);
    },

    finishPOSSale() {
        if (this.posCart.length === 0) {
            Cart.showToast('Adicione produtos para registrar a venda.', 'warning');
            return;
        }

        const customerName = document.getElementById('pos-customer-name').value.trim() || 'Cliente Balcão';
        const customerPhone = document.getElementById('pos-customer-phone').value.trim() || '';
        const paymentMethod = document.getElementById('pos-payment-method').value;

        const subtotal = this.posCart.reduce((s, i) => s + (i.price * i.quantity), 0);
        const orderId = `PDV-${Math.floor(1000 + Math.random() * 9000)}`;

        const newSale = {
            id: orderId,
            createdAt: new Date().toISOString(),
            customer: {
                name: customerName,
                phone: customerPhone,
                email: '',
                cpf: '',
                address: {
                    city: 'Porto Velho',
                    state: 'RO',
                    street: 'Venda Presencial / Balcão'
                }
            },
            items: [...this.posCart],
            subtotal: subtotal,
            discount: 0,
            shipping: 0,
            shippingMethod: 'Retirada Balcão',
            total: subtotal,
            paymentMethod: paymentMethod,
            paymentStatus: 'Pago',
            status: 'Entregue',
            notes: 'Venda direta registrada no PDV.'
        };

        Store.saveOrder(newSale);

        Cart.showToast(`Venda #${orderId} concluída com sucesso!`, 'success');

        // Limpar PDV
        this.posCart = [];
        document.getElementById('pos-customer-name').value = '';
        document.getElementById('pos-customer-phone').value = '';
        this.renderPOS();
        this.renderDashboard();
    },

    // ==========================================
    // 5. CONFIGURAÇÕES & BACKUP
    // ==========================================
    loadSettings() {
        const s = Store.getSettings();
        document.getElementById('set-company-name').value = s.companyName || '';
        document.getElementById('set-phone').value = s.phone || '';
        document.getElementById('set-email').value = s.email || '';
        document.getElementById('set-pix-key').value = s.pixKey || '';
        document.getElementById('set-pix-name').value = s.pixName || '';
        document.getElementById('set-address').value = s.address || '';
    },

    saveSettingsForm(e) {
        e.preventDefault();
        const updated = {
            companyName: document.getElementById('set-company-name').value.trim(),
            phone: document.getElementById('set-phone').value.trim(),
            email: document.getElementById('set-email').value.trim(),
            pixKey: document.getElementById('set-pix-key').value.trim(),
            pixName: document.getElementById('set-pix-name').value.trim(),
            address: document.getElementById('set-address').value.trim()
        };
        Store.saveSettings(updated);
        Cart.showToast('Configurações salvas com sucesso!', 'success');
    },

    changePassword(e) {
        e.preventDefault();
        const cur = document.getElementById('pwd-current').value;
        const nov = document.getElementById('pwd-new').value;

        const res = Auth.updatePassword(cur, nov);
        if (res.success) {
            Cart.showToast(res.message, 'success');
            document.getElementById('pwd-current').value = '';
            document.getElementById('pwd-new').value = '';
        } else {
            Cart.showToast(res.message, 'error');
        }
    },

    exportData() {
        const data = {
            products: Store.getProducts(),
            orders: Store.getOrders(),
            settings: Store.getSettings(),
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `abelha-da-amazonia-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});
