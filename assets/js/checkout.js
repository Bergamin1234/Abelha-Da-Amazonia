/**
 * Abelha da Amazônia - Lógica de Checkout e Conclusão de Compra
 */

const Checkout = {
    selectedPaymentMethod: 'pix',
    selectedShipping: {
        id: 'pac',
        name: 'PAC Econômico',
        cost: 26.50
    },

    init() {
        this.checkCart();
        this.renderOrderSummary();
        this.bindEvents();
        this.setupMasks();
    },

    checkCart() {
        Cart.loadCart();
        if (Cart.items.length === 0) {
            window.location.href = 'index.html#catalogo';
        }
    },

    renderOrderSummary() {
        const itemsContainer = document.getElementById('checkout-items-list');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = Cart.items.map(item => `
            <div class="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-stone-200 flex-shrink-0">
                <div class="flex-1 min-w-0">
                    <h5 class="text-xs font-bold text-gray-900 truncate">${item.name}</h5>
                    <p class="text-[11px] text-gray-500">Qtd: ${item.quantity} un</p>
                </div>
                <div class="text-right">
                    <span class="text-xs font-bold text-gray-900">${Store.formatCurrency(item.price * item.quantity)}</span>
                </div>
            </div>
        `).join('');

        this.updateFinancialSummary();
    },

    updateFinancialSummary() {
        const subtotal = Cart.getSubtotal();
        const discountCoupon = Cart.discount || 0;
        const shippingCost = this.selectedShipping.cost || 0;

        // Desconto Pix (5% extra sobre o subtotal com cupom)
        let pixDiscount = 0;
        if (this.selectedPaymentMethod === 'pix') {
            const baseForPix = Math.max(0, subtotal - discountCoupon);
            pixDiscount = baseForPix * 0.05;
        }

        const totalDiscount = discountCoupon + pixDiscount;
        const finalTotal = Math.max(0, subtotal - totalDiscount + shippingCost);

        document.getElementById('summary-subtotal').textContent = Store.formatCurrency(subtotal);

        const discountRow = document.getElementById('summary-discount-row');
        if (discountRow) {
            if (totalDiscount > 0) {
                discountRow.classList.remove('hidden');
                document.getElementById('summary-discount').textContent = `- ${Store.formatCurrency(totalDiscount)}`;
            } else {
                discountRow.classList.add('hidden');
            }
        }

        document.getElementById('summary-shipping').textContent = shippingCost === 0 ? 'Grátis' : Store.formatCurrency(shippingCost);
        document.getElementById('summary-total').textContent = Store.formatCurrency(finalTotal);

        // Atualiza parcelas no cartão
        const installmentsSelect = document.getElementById('card-installments');
        if (installmentsSelect) {
            const cardTotal = Math.max(0, subtotal - discountCoupon + shippingCost);
            installmentsSelect.innerHTML = [1, 2, 3, 4, 5, 6].map(i => {
                const part = (cardTotal / i).toFixed(2).replace('.', ',');
                return `<option value="${i}">${i}x de R$ ${part} sem juros (Total: ${Store.formatCurrency(cardTotal)})</option>`;
            }).join('');
        }
    },

    selectPayment(method) {
        this.selectedPaymentMethod = method;
        
        // Atualiza tabs visuais
        document.querySelectorAll('.payment-tab').forEach(tab => {
            tab.classList.remove('border-amber-500', 'bg-amber-50/50', 'text-amber-800');
            tab.classList.add('border-stone-200', 'bg-white', 'text-gray-700');
        });

        const activeTab = document.getElementById(`tab-${method}`);
        if (activeTab) {
            activeTab.classList.remove('border-stone-200', 'bg-white', 'text-gray-700');
            activeTab.classList.add('border-amber-500', 'bg-amber-50/50', 'text-amber-800');
        }

        // Mostra o formulário correspondente
        ['pix', 'cartao', 'boleto'].forEach(m => {
            const section = document.getElementById(`section-${m}`);
            if (section) section.classList.toggle('hidden', m !== method);
        });

        this.updateFinancialSummary();
    },

    async lookupCep(cep) {
        const cleanCep = (cep || '').replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        const statusEl = document.getElementById('cep-status');
        if (statusEl) {
            statusEl.textContent = 'Buscando CEP...';
            statusEl.className = 'text-[11px] text-amber-600 block mt-1';
        }

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await res.json();

            if (data.erro) {
                if (statusEl) {
                    statusEl.textContent = 'CEP não encontrado. Preencha manualmente.';
                    statusEl.className = 'text-[11px] text-red-500 block mt-1';
                }
                return;
            }

            document.getElementById('street').value = data.logradouro || '';
            document.getElementById('neighborhood').value = data.bairro || '';
            document.getElementById('city').value = data.localidade || '';
            document.getElementById('state').value = data.uf || '';
            document.getElementById('number').focus();

            if (statusEl) {
                statusEl.textContent = `${data.localidade} - ${data.uf}`;
                statusEl.className = 'text-[11px] text-emerald-600 block mt-1';
            }

            // Atualiza opções de frete baseadas no CEP
            this.updateShippingOptions(cleanCep);
        } catch (e) {
            if (statusEl) {
                statusEl.textContent = 'Serviço de CEP indisponível. Preencha os campos.';
                statusEl.className = 'text-[11px] text-stone-500 block mt-1';
            }
        }
    },

    updateShippingOptions(cep) {
        const options = Cart.calculateShipping(cep);
        const container = document.getElementById('shipping-methods-container');
        if (!container || !options) return;

        container.innerHTML = options.map((opt, idx) => `
            <label class="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-white cursor-pointer hover:border-amber-400 transition">
                <div class="flex items-center gap-3">
                    <input type="radio" name="shipping_method" value="${opt.id}" ${idx === 0 ? 'checked' : ''} onchange="Checkout.selectShipping('${opt.id}', ${opt.cost}, '${opt.name}')" class="text-amber-500 focus:ring-amber-400">
                    <div>
                        <div class="text-xs font-bold text-gray-900">${opt.name}</div>
                        <div class="text-[11px] text-gray-500">${opt.prazo}</div>
                    </div>
                </div>
                <div class="text-xs font-bold ${opt.cost === 0 ? 'text-emerald-600' : 'text-gray-900'}">
                    ${opt.cost === 0 ? 'Grátis' : Store.formatCurrency(opt.cost)}
                </div>
            </label>
        `).join('');

        this.selectShipping(options[0].id, options[0].cost, options[0].name);
    },

    selectShipping(id, cost, name) {
        this.selectedShipping = { id, cost: Number(cost), name };
        Cart.shipping = Number(cost);
        Cart.shippingMethod = name;
        this.updateFinancialSummary();
    },

    applyCheckoutCoupon() {
        const input = document.getElementById('checkout-coupon-input');
        if (!input) return;
        const res = Cart.applyCoupon(input.value);
        if (res.valid) {
            this.updateFinancialSummary();
        }
    },

    setupMasks() {
        // Máscara de CEP
        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5, 8);
                e.target.value = v;
                if (v.replace(/\D/g, '').length === 8) {
                    this.lookupCep(v);
                }
            });
        }

        // Máscara de Telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 10) {
                    v = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7, 11)}`;
                } else if (v.length > 6) {
                    v = `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6, 10)}`;
                } else if (v.length > 2) {
                    v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
                }
                e.target.value = v;
            });
        }

        // Máscara de CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 11);
                if (v.length > 9) v = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9)}`;
                else if (v.length > 6) v = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`;
                else if (v.length > 3) v = `${v.substring(0, 3)}.${v.substring(3)}`;
                e.target.value = v;
            });
        }

        // Máscara de Cartão de Crédito
        const cardNumInput = document.getElementById('card-number');
        if (cardNumInput) {
            cardNumInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 16);
                let formatted = '';
                for (let i = 0; i < v.length; i++) {
                    if (i > 0 && i % 4 === 0) formatted += ' ';
                    formatted += v[i];
                }
                e.target.value = formatted;

                const previewNum = document.getElementById('card-preview-number');
                if (previewNum) {
                    previewNum.textContent = formatted || '•••• •••• •••• ••••';
                }
            });
        }

        // Nome no Cartão Preview
        const cardHolderInput = document.getElementById('card-name');
        if (cardHolderInput) {
            cardHolderInput.addEventListener('input', (e) => {
                const previewHolder = document.getElementById('card-preview-holder');
                if (previewHolder) {
                    previewHolder.textContent = e.target.value.toUpperCase() || 'NOME DO TITULAR';
                }
            });
        }

        // Validade no Cartão
        const cardExpInput = document.getElementById('card-exp');
        if (cardExpInput) {
            cardExpInput.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (v.length > 2) v = `${v.substring(0, 2)}/${v.substring(2)}`;
                e.target.value = v;

                const previewExp = document.getElementById('card-preview-exp');
                if (previewExp) {
                    previewExp.textContent = v || 'MM/AA';
                }
            });
        }
    },

    bindEvents() {
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }
    },

    processOrder() {
        // Validação dos dados
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const cep = document.getElementById('cep').value.trim();
        const street = document.getElementById('street').value.trim();
        const number = document.getElementById('number').value.trim();
        const complement = document.getElementById('complement').value.trim();
        const neighborhood = document.getElementById('neighborhood').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const notes = document.getElementById('notes').value.trim();

        if (!name || !email || !phone || !cep || !street || !number || !city || !state) {
            Cart.showToast('Por favor, preencha todos os campos obrigatórios de entrega.', 'warning');
            return;
        }

        const subtotal = Cart.getSubtotal();
        const discountCoupon = Cart.discount || 0;
        let pixDiscount = 0;
        if (this.selectedPaymentMethod === 'pix') {
            pixDiscount = Math.max(0, subtotal - discountCoupon) * 0.05;
        }
        const totalDiscount = discountCoupon + pixDiscount;
        const shippingCost = this.selectedShipping.cost || 0;
        const totalFinal = Math.max(0, subtotal - totalDiscount + shippingCost);

        // Gerar ID único amigável do Pedido
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderId = `ABZ-2026-${randomNum}`;

        const newOrder = {
            id: orderId,
            createdAt: new Date().toISOString(),
            customer: {
                name,
                email,
                phone,
                cpf,
                address: {
                    cep,
                    street,
                    number,
                    complement,
                    neighborhood,
                    city,
                    state
                }
            },
            items: Cart.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal,
            discount: totalDiscount,
            coupon: Cart.coupon ? Cart.coupon.code : null,
            shipping: shippingCost,
            shippingMethod: this.selectedShipping.name,
            total: totalFinal,
            paymentMethod: this.selectedPaymentMethod,
            paymentStatus: this.selectedPaymentMethod === 'pix' ? 'Aguardando Pagamento' : (this.selectedPaymentMethod === 'cartao' ? 'Aprovado' : 'Aguardando Pagamento'),
            status: 'Pendente',
            notes
        };

        // Salvar Pedido no Store e abater do estoque
        Store.saveOrder(newOrder);

        // Salvar dados do pedido finalizado na sessão para a página de sucesso
        sessionStorage.setItem('abz_latest_order', JSON.stringify(newOrder));

        // Limpar carrinho
        Cart.clearCart();

        // Redirecionar para página de sucesso
        window.location.href = 'order-success.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Checkout.init();
});
