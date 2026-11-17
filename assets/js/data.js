/**
 * Abelha da Amazônia - Dados Iniciais de Produtos
 * Fotos reais dos produtos e do apiário em Porto Velho - Rondônia
 */
const DEFAULT_PRODUCTS = [
    {
        id: "prod-1",
        name: "Favo de Mel Puro da Amazônia",
        category: "favos",
        categoryName: "Favos Naturais",
        price: 45.00,
        originalPrice: 52.00,
        stock: 28,
        rating: 4.9,
        reviewsCount: 34,
        image: "assets/img/products/mel-favo-real.jpg",
        badge: "Mais Vendido",
        description: "Puro mel colhido direto do favo natural no apiário amazônico, preservando traços benéficos de cera de abelha, própolis e pólen florido da floresta.",
        details: {
            origin: "Porto Velho - Rondônia / Floresta Amazônica",
            volume: "Favo natural in natura",
            ingredients: "100% Mel de abelha silvestre em favo operculado",
            conservation: "Manter em local fresco, arejado e ao abrigo da luz solar.",
            benefits: ["Ação antioxidante e anti-inflamatória", "Rico em enzimas vivas e minerais", "Auxilia na imunidade e digestão"]
        }
    },
    {
        id: "prod-2",
        name: "Mel Silvestre da Floresta 1kg",
        category: "mel",
        categoryName: "Mel Puro",
        price: 65.00,
        originalPrice: 75.00,
        stock: 45,
        rating: 5.0,
        reviewsCount: 68,
        image: "assets/img/products/mel-pote-1kg.jpg",
        badge: "Destaque",
        description: "Mel 100% puro e cru de floradas silvestres nativas da Amazônia. Sabor encorpado, notas florais e aroma autêntico da mata.",
        details: {
            origin: "Região do Rio Madeira, Porto Velho - RO",
            volume: "1.000g (1kg)",
            ingredients: "100% Mel de abelhas africanizadas da Amazônia",
            conservation: "Em temperatura ambiente. Se cristalizar, aquecer em banho-maria até 40°C.",
            benefits: ["Substituto natural do açúcar refinado", "Energia rápida e sustentada", "Alívio natural para garganta e tosse"]
        }
    },
    {
        id: "prod-3",
        name: "Mel de Flores Silvestres 480g",
        category: "mel",
        categoryName: "Mel Puro",
        price: 35.00,
        originalPrice: 40.00,
        stock: 36,
        rating: 4.8,
        reviewsCount: 29,
        image: "assets/img/products/mel-pote-480g.jpg",
        badge: null,
        description: "Mel puro com coloração dourada intensa. Extraído artesanalmente sem aquecimento industrial para preservar todas as propriedades nutritivas.",
        details: {
            origin: "Colmeias de manejo sustentável - RO",
            volume: "480g",
            ingredients: "100% Mel puro in natura",
            conservation: "Guardar em frasco bem vedado em local seco.",
            benefits: ["Rico em potássio, fósforo e ferro", "Promove o equilíbrio da flora intestinal"]
        }
    },
    {
        id: "prod-4",
        name: "Extrato de Própolis Verde Amazônica 30ml",
        category: "propolis",
        categoryName: "Extratos & Própolis",
        price: 28.00,
        originalPrice: 32.00,
        stock: 50,
        rating: 4.9,
        reviewsCount: 52,
        image: "assets/img/products/propolis-verde-frasco.jpg",
        badge: "Imunidade",
        description: "Extrato de alta concentração de própolis verde da flora amazônica. Poderoso fortalecedor do sistema imunológico com compostos bioativos exclusivos.",
        details: {
            origin: "Bioma Amazônico Brasileiro",
            volume: "30ml com conta-gotas",
            ingredients: "Própolis verde pura e álcool de cereais neutro grau alimentício",
            conservation: "Conserve ao abrigo da luz e do calor excessivo.",
            benefits: ["Potente antibiótico e antiviral natural", "Acelera a cicatrização", "Fortalece as defesas naturais do corpo"]
        }
    },
    {
        id: "prod-5",
        name: "Extrato de Própolis Tradicional Concentrado",
        category: "propolis",
        categoryName: "Extratos & Própolis",
        price: 25.00,
        originalPrice: 28.00,
        stock: 40,
        rating: 4.7,
        reviewsCount: 21,
        image: "assets/img/products/extrato-propolis-mesa.jpg",
        badge: null,
        description: "Fórmula tradicional das matas amazônicas. Excelente para uso diário em gargarejos, prevenção de gripes e fortalecimento geral da saúde.",
        details: {
            origin: "Porto Velho, RO",
            volume: "30ml",
            ingredients: "Resina de própolis marrom e álcool neutro",
            conservation: "Local seco e protegido da luz solar.",
            benefits: ["Ação antisséptica bucal", "Auxiliar no tratamento respiratório"]
        }
    },
    {
        id: "prod-6",
        name: "Super Combo Imunidade: Mel + Própolis",
        category: "kits",
        categoryName: "Kits Especiais",
        price: 85.00,
        originalPrice: 105.00,
        stock: 20,
        rating: 5.0,
        reviewsCount: 47,
        image: "assets/img/products/combo-produtos.jpg",
        badge: "Economia Especial",
        description: "Nosso kit campeão com melhor custo-benefício: Mel Puro Silvestre + Extrato de Própolis Verde Concentrado com desconto imperdível.",
        details: {
            origin: "Produção Integrada Abelha da Amazônia",
            volume: "Kit com Mel Silvestre + Própolis",
            ingredients: "Produtos 100% puros e naturais da Amazônia",
            conservation: "Guardar em local fresco.",
            benefits: ["Tratamento imunológico completo para toda a família", "Melhor valor por item"]
        }
    },
    {
        id: "prod-7",
        name: "Mel no Caixilho Rústico do Apiário",
        category: "favos",
        categoryName: "Favos Naturais",
        price: 95.00,
        originalPrice: 110.00,
        stock: 12,
        rating: 5.0,
        reviewsCount: 18,
        image: "assets/img/products/mel-caixilho-apiario.jpg",
        badge: "Exclusivo",
        description: "Experiência apícola autêntica: caixilho inteiro com favo 100% operculado pelas abelhas direto da colmeia na floresta amazônica.",
        details: {
            origin: "Apiário Abelha da Amazônia - Porto Velho, RO",
            volume: "Caixilho apícola integral",
            ingredients: "100% favo natural operculado com mel e cera pura",
            conservation: "Conservar em temperatura ambiente.",
            benefits: ["O mel mais fresco e inalterado possível", "Cera mastigável rica em pólen"]
        }
    },
    {
        id: "prod-8",
        name: "Favo de Mel em Embalagem Especial para Presente",
        category: "favos",
        categoryName: "Favos Naturais",
        price: 55.00,
        originalPrice: 65.00,
        stock: 22,
        rating: 4.9,
        reviewsCount: 31,
        image: "assets/img/products/favo-caixa.jpg",
        badge: "Presenteável",
        description: "Pedaço nobre de favo de mel selecionado e acondicionado em embalagem rígida higiênica, perfeito para consumo próprio ou presentear com saúde.",
        details: {
            origin: "Apiário Abelha da Amazônia",
            volume: "Embalagem individual selada",
            ingredients: "100% mel em favo",
            conservation: "Local seco e arejado.",
            benefits: ["Apresentação impecável", "Ideal para tábuas de queijos e café da manhã"]
        }
    }
];

const DEFAULT_COUPONS = [
    { code: "AMAZONIA10", discountPercent: 10, minPurchase: 50.00, active: true },
    { code: "PRIMEIRACOMPRA", discountPercent: 15, minPurchase: 70.00, active: true },
    { code: "FRETEGRATIS", freeShipping: true, minPurchase: 150.00, active: true }
];

const DEFAULT_SETTINGS = {
    companyName: "Abelha da Amazônia",
    phone: "(69) 9361-4393",
    whatsapp: "5569993614393",
    instagram: "https://www.instagram.com/abelhadaamazonia/",
    email: "paulocbergamin@hotmail.com",
    address: "Rua Abnatal Bentes de Lima, 687 - Porto Velho - RO",
    pixKey: "paulocbergamin@hotmail.com",
    pixName: "Paulo Cesar Bergamin - Abelha da Amazonia",
    freeShippingThreshold: 200.00
};
