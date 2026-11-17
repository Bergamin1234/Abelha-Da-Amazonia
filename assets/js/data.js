/**
 * Abelha da Amazônia - Dados Iniciais de Produtos
 * Produtos naturais, sustentáveis e de colheita consciente na região amazônica.
 */
const DEFAULT_PRODUCTS = [
    {
        id: "prod-1",
        name: "Favo de Mel Puro da Amazônia 400g",
        category: "favos",
        categoryName: "Favos Naturais",
        price: 45.00,
        originalPrice: 52.00,
        stock: 28,
        rating: 4.9,
        reviewsCount: 34,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
        badge: "Mais Vendido",
        description: "Puro mel colhido direto do favo natural, preservando traços benéficos de cera de abelha, própolis e pólen florido da floresta amazônica.",
        details: {
            origin: "Porto Velho - Rondônia / Floresta Amazônica",
            volume: "400g",
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
        image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
        badge: "Destaque",
        description: "Mel 100% puro e cru de floradas silvestres nativas da Amazônia. Sabor encorpado, notas florais suaves e aroma irresistível.",
        details: {
            origin: "Região do Rio Madeira, RO",
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
        image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80",
        badge: null,
        description: "Mel com textura aveludada e coloração dourada intensa. Extraído artesanalmente sem aquecimento industrial para preservar todas as propriedades.",
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
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
        badge: "Imunidade",
        description: "Extrato de alta concentração (mínimo 15% de extrato seco). Poderoso fortalecedor do sistema imunológico com compostos bioativos exclusivos.",
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
        name: "Extrato de Própolis Marrom Concentrado 30ml",
        category: "propolis",
        categoryName: "Extratos & Própolis",
        price: 25.00,
        originalPrice: 28.00,
        stock: 40,
        rating: 4.7,
        reviewsCount: 21,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
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
        name: "Super Combo Imunidade: Mel 1kg + 2 Própolis",
        category: "kits",
        categoryName: "Kits Especiais",
        price: 105.00,
        originalPrice: 125.00,
        stock: 20,
        rating: 5.0,
        reviewsCount: 47,
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
        badge: "Economia de R$ 20",
        description: "Nosso kit campeão com melhor custo-benefício: 1 Pote de 1kg do nosso Mel Silvestre + 1 Própolis Verde + 1 Própolis Marrom com desconto imperdível.",
        details: {
            origin: "Produção Integrada Abelha da Amazônia",
            volume: "Kit com 3 itens (1kg + 30ml + 30ml)",
            ingredients: "Produtos 100% puros e naturais da Amazônia",
            conservation: "Guardar em local fresco.",
            benefits: ["Tratamento imunológico completo para toda a família", "Melhor valor por grama"]
        }
    },
    {
        id: "prod-7",
        name: "Pólen Apícola Desidratado 150g",
        category: "favos",
        categoryName: "Favos Naturais",
        price: 38.00,
        originalPrice: 44.00,
        stock: 25,
        rating: 4.8,
        reviewsCount: 18,
        image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80",
        badge: "Superalimento",
        description: "Concentrado natural de proteínas vegetais, aminoácidos essenciais e vitaminas do complexo B coletadas pelas abelhas nativas.",
        details: {
            origin: "Reserva Apícola de Porto Velho, RO",
            volume: "150g em pote lacrado",
            ingredients: "100% grãos de pólen apícola selecionado e desidratado a frio",
            conservation: "Após aberto, recomenda-se conservar sob refrigeração.",
            benefits: ["Combate a fadiga física e mental", "Rico em carotenoides e fitoesteróis", "Perfeito para frutas, iogurtes e shakes"]
        }
    },
    {
        id: "prod-8",
        name: "Mel Nobre de Abelha Nativa Sem Ferrão (Melípona) 250g",
        category: "mel",
        categoryName: "Mel Puro",
        price: 85.00,
        originalPrice: 95.00,
        stock: 15,
        rating: 5.0,
        reviewsCount: 31,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        badge: "Raridade",
        description: "Extraído de abelhas nativas sem ferrão (Meliponíneos da Amazônia). Possui acidez nobre, textura mais fluida, notas cítricas únicas e alto valor medicinal.",
        details: {
            origin: "Meliponário Sustentável da Amazônia Ocidental",
            volume: "250g em vidro especial",
            ingredients: "100% Mel de abelhas sem ferrão (Melipona sp.)",
            conservation: "Recomenda-se manter refrigerado após aberto para preservar aromas finos.",
            benefits: ["Propriedades antimicrobianas superiores", "Menor índice glicêmico", "Experiência gastronômica gourmet única"]
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
    email: "paulocbergamin@hotmail.com",
    address: "Porto Velho - Rondônia, Amazônia - Brasil",
    pixKey: "paulocbergamin@hotmail.com",
    pixName: "Paulo Cesar Bergamin - Abelha da Amazonia",
    freeShippingThreshold: 200.00
};
