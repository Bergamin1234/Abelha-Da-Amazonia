# 🐝 Abelha da Amazônia - E-commerce e Gestão de Vendas

Plataforma completa de comércio eletrônico e gestão administrativa para a **Abelha da Amazônia**, especializada em méis 100% puros, silvestres, extratos de própolis verde e derivados colhidos de forma sustentável na floresta amazônica (Porto Velho - Rondônia).

---

## 🌟 Funcionalidades Principais

### 🛒 1. Loja Virtual & Página Inicial de Compra (`index.html`)
- **Identidade Visual Premium**: Tons dourados de âmbar, favos de mel geométricos e verde floresta amazônica.
- **Catálogo Dinâmico**: Produtos com fotos reais em alta definição, selos de destaque (*Mais Vendido*, *Imunidade*, *Raridade*), avaliações e controle de estoque em tempo real.
- **Filtros por Categoria**: Mel Puro, Extratos & Própolis, Favos & Pólen e Kits Promocionais.
- **Busca em Tempo Real**: Localização instantânea de produtos por nome ou descrição.
- **Espiar Produto (Quick View)**: Modal interativo com ficha técnica, benefícios medicinais, ingredientes e seleção de quantidade.
- **Gaveta Lateral de Carrinho (Drawer Off-Canvas)**:
  - Adição rápida sem recarregar a página.
  - Controle de quantidade (`+` e `-`) e remoção de itens.
  - Simulador de frete por CEP (PAC, SEDEX e Retirada em Porto Velho).
  - Validador de cupons de desconto (ex: `AMAZONIA10`, `PRIMEIRACOMPRA`).
  - Totalizador em tempo real com botão direto para o checkout.

---

### 💳 2. Fluxo Completo de Compra & Checkout (`checkout.html` e `order-success.html`)
- **Identificação & Entrega**:
  - Busca automática de endereço pelo CEP via integração com a API pública do **ViaCEP**.
  - Máscaras dinâmicas de CPF, Telefone e CEP.
- **Formas de Pagamento**:
  - **PIX Instantâneo**: Desconto automático de 5% sobre a compra, QR Code gerado dinamicamente, chave copia-e-cola com um clique e simulador de aprovação imediata.
  - **Cartão de Crédito**: Preview 3D do cartão em tempo real, validação e parcelamento em até 6x sem juros.
  - **Boleto Bancário**: Geração de linha digitável com instruções de compensação.
- **Abate Automático de Estoque**: Cada compra finalizada reduz a quantidade do produto no estoque central.
- **Comprovante de Compra (`order-success.html`)**:
  - Resumo completo do pedido com número rastreável (`#ABZ-2026-XXXX`).
  - Botão para imprimir comprovante ou salvar em PDF formatado.
  - Botão para receber notificações e atualizações de entrega diretamente no WhatsApp.

---

### 🔒 3. Login para Administração Discreto (`admin-login.html`)
- **Acesso Reservado e Silencioso**:
  - Não há botões chamativos no cabeçalho para clientes comuns.
  - Acesso no rodapé (footer) através do link sutil **"Acesso Interno"** com ícone de cadeado.
  - **Atalho de Teclado Global**: Pressione `Ctrl + Shift + A` em qualquer página para abrir diretamente a tela de login administrativo.
- **Credenciais Padrão**:
  - **Usuário**: `admin`
  - **Senha**: `admin123`
  - *(Pode ser alterada a qualquer momento na aba Configurações do painel).*
- **Guarda de Rotas (`assets/js/auth.js`)**: Impede acesso não autorizado ao painel sem login ativo.

---

### 📊 4. Painel de Gestão e Venda do Produto (`admin.html`)
- **Visão Geral (Dashboard)**:
  - Métricas em tempo real: Faturamento total aprovado, número de pedidos, ticket médio e alerta de produtos com estoque baixo.
  - Tabela dos últimos pedidos recebidos com visualização rápida.
- **Gestão de Vendas & Pedidos**:
  - Listagem completa de todos os pedidos realizados na loja online e no balcão.
  - Filtros por status (*Pendente*, *Pago*, *Em Separação*, *Enviado*, *Entregue*, *Cancelado*).
  - Modal com ficha detalhada do pedido, endereço de entrega e itens comprados.
  - Botão de notificação WhatsApp com mensagem personalizada pronta para o cliente.
- **Catálogo de Produtos & Controle de Estoque**:
  - Cadastro de novos produtos com upload de imagem ou URL, categoria, preço e estoque.
  - Edição completa e exclusão de produtos.
  - Ajuste rápido de estoque (+1 / -1) direto na tabela.
- **Ponto de Venda (PDV Balcão)**:
  - Módulo para o vendedor registrar vendas presenciais ou feitas por WhatsApp.
  - Seleção ágil de produtos, cálculo instantâneo e baixa automática de estoque.
- **Configurações & Backup**:
  - Edição da chave Pix oficial da empresa, telefone e dados de contato.
  - Alteração da senha administrativa.
  - Exportação de backup em formato JSON com todos os produtos e pedidos salvos.

---

## 📁 Estrutura do Projeto Reestruturado

```
Abelha-Da-Amazonia/
├── index.html              # Loja virtual, catálogo de produtos e carrinho drawer
├── checkout.html           # Página de finalização de compra (ViaCEP, Pix, Cartão, Boleto)
├── order-success.html      # Tela de confirmação e comprovante do pedido
├── admin-login.html        # Tela discreta de login administrativo
├── admin.html              # Painel de gestão de vendas, produtos, estoque e PDV
├── mobileconverter.html    # Redirecionador para a interface responsiva unificada
├── assets/
│   ├── css/
│   │   ├── style.css       # Estilos da loja, tema dourado/âmbar, animações de favo e mel
│   │   └── admin.css       # Estilos do painel de administração e badges de status
│   └── js/
│       ├── data.js         # Catálogo inicial de produtos da Amazônia e cupons
│       ├── store.js        # Gerenciador de persistência local (localStorage) e estoque
│       ├── cart.js         # Mecanismo do carrinho, cálculo de frete e cupons
│       ├── checkout.js     # Lógica do checkout, máscaras de dados e geração de pedidos
│       ├── auth.js         # Controle de sessão e segurança do administrador
│       └── admin.js        # Lógica do painel de administração, métricas e PDV
└── README.md               # Documentação completa do projeto
```

---

## 🚀 Como Executar

O projeto é 100% estático (HTML5, Tailwind CSS, JavaScript ES6+ e LocalStorage), sem necessidade de instalação de dependências pesadas ou servidores complexos.

1. **Abrir diretamente no navegador**:
   - Dê um duplo clique no arquivo `index.html` ou abra com seu navegador favorito (Chrome, Edge, Firefox).

2. **Utilizando Live Server (VSCode / IDE)**:
   - Abra a pasta do projeto no VS Code e clique em *"Go Live"*.

3. **Publicar no GitHub Pages**:
   - O repositório está pronto para o GitHub Pages. Basta acessar as configurações do repositório no GitHub (`Settings > Pages`) e selecionar o branch `main` na raiz (`/`).

---

## 🔑 Acesso Administrativo

| Campo | Valor Padrão |
| :--- | :--- |
| **URL de Acesso** | `admin-login.html` ou link no rodapé da loja |
| **Atalho Global** | Pressione `Ctrl + Shift + A` |
| **Usuário** | `admin` |
| **Senha** | `admin123` |

---

## 📞 Contato & Suporte
- **Produtor**: Paulo Cesar Bergamin
- **Telefone / WhatsApp**: (69) 9361-4393
- **E-mail**: paulocbergamin@hotmail.com
- **Origem**: Porto Velho - Rondônia, Amazônia, Brasil.
