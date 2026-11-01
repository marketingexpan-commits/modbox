import { ContainerModel, Collaborator, SaleOrder, CashFlowEntry, AdminUser } from '../types';

export const INITIAL_CONTAINERS: ContainerModel[] = [
  {
    id: 'cnt-01',
    name: 'ModBox Office Executive 20ft',
    code: 'MBX-OFF-20',
    category: 'escritorio',
    dimensions: {
      length: 6.05,
      width: 2.44,
      height: 2.59
    },
    areaM2: 14.76,
    volumeM3: 38.23,
    specs: {
      insulation: '',
      lining: 'Drywall acústico com acabamento massa corrida e pintura premium',
      floor: 'Piso estrutural com acabamento vinílico amadeirado de alto tráfego',
      doors: '01 Porta frontal de correr blindex temperado 8mm (2.10x1.60m)',
      windows: '02 Janelas blindex maxim-ar com proteção UV (1.20x0.60m)',
      electrical: '08 Pontos de tomadas 110/220V, 04 spots LED embutidos, infraestrutura de A/C',
      plumbing: 'Lavabo completo com cuba sobreposta, torneira monocomando e vaso sanitário',
      externalFinish: 'Fundo anticorrosivo epóxi + Pintura poliuretano industrial Preto Fosco com detalhes Dourados'
    },
    baseCost: 28500,
    suggestedPrice: 46900,
    productionDaysEstimate: 18,
    description: 'Ambiente executivo perfeito para escritórios de engenharia, imobiliárias, plantões de venda e consultórios compactos com acabamento de alto padrão.',
    badge: 'Mais Vendido'
  },
  {
    id: 'cnt-02',
    name: 'ModBox Living Residence 40ft High Cube',
    code: 'MBX-RES-40HC',
    category: 'habitacional',
    dimensions: {
      length: 12.19,
      width: 2.44,
      height: 2.89
    },
    areaM2: 29.74,
    volumeM3: 85.95,
    specs: {
      insulation: '',
      lining: 'Painéis ripados decorativos e forro em gesso acartonado com sanca iluminada',
      floor: 'Porcelanato acetinado retificado com impermeabilização técnica',
      doors: '01 Porta pivotante de alumínio preto fosco + 01 porta balcão blindex',
      windows: '04 Grandes painéis de vidro fixo e esquadrias de correr pretas com persiana integrada',
      electrical: 'Quadro de disjuntores com DR, circuitos independentes, 16 tomadas, iluminação cênica LED',
      plumbing: 'Banheiro completo com box blindex, nicho embutido, tubulação Tigre PPR água quente/fria',
      externalFinish: 'Tratamento jateado abrasivo + Pintura em poliuretano industrial automotivo preto fosco e filetes dourados'
    },
    baseCost: 58000,
    suggestedPrice: 94500,
    productionDaysEstimate: 30,
    description: 'Residência moderna ou casa de hóspedes estilo loft industrial com pé direito ampliado (High Cube) e conforto térmico de excelência.',
    badge: 'Linha Premium'
  },
  {
    id: 'cnt-03',
    name: 'ModBox Gourmet PopUp 20ft',
    code: 'MBX-POP-20',
    category: 'comercial',
    dimensions: {
      length: 6.05,
      width: 2.44,
      height: 2.59
    },
    areaM2: 14.76,
    volumeM3: 38.23,
    specs: {
      insulation: '',
      lining: 'Inox escovado na área de cocção e PVC especial lavável no restante',
      floor: 'Chapa xadrez de alumínio antiderrapante lavável com ralo linear',
      doors: 'Abertura lateral estilo escotilha pneumática com pistões a gás',
      windows: 'Balcão de atendimento dobrável em inox com iluminação focal',
      electrical: 'Entrada trifásica 380/220V, tomadas industriais de alta potência, coifa',
      plumbing: 'Caixa de gordura integrada, 2 pias de higienização em inox com acionamento por pedal',
      externalFinish: 'Pintura industrial preta com logomarca e frisos dourados metálicos'
    },
    baseCost: 34000,
    suggestedPrice: 53900,
    productionDaysEstimate: 22,
    description: 'Solução completa e ágil para cafeterias, hamburguerias, quiosques de praia, feiras e pontos gastronômicos itinerantes ou fixos.',
    badge: 'Alta Rentabilidade'
  },
  {
    id: 'cnt-04',
    name: 'ModBox Canteiro & Almoxarifado Seguro 10ft',
    code: 'MBX-SEC-10',
    category: 'almoxarifado',
    dimensions: {
      length: 3.00,
      width: 2.44,
      height: 2.59
    },
    areaM2: 7.32,
    volumeM3: 18.96,
    specs: {
      insulation: '',
      lining: 'Estrutura original em aço corten 2.5mm reforçada',
      floor: 'Piso estrutural reforçado para carga pesada',
      doors: 'Portas originais do contêiner com tranca tetra e barra anti-arrombamento',
      windows: 'Sem janelas para máxima segurança patrimonial',
      electrical: '02 Pontos de luz LED blindada e 02 tomadas blindadas IP65',
      plumbing: 'Não aplicável',
      externalFinish: 'Pintura industrial sintética anticorrosiva preta fosca com faixas de destaque douradas'
    },
    baseCost: 12500,
    suggestedPrice: 19800,
    productionDaysEstimate: 10,
    description: 'Módulo ultracompacto e blindado para guarda de ferramentas, maquinários, estoque de canteiro de obras e eventos.',
    badge: 'Entrega Rápida'
  },
  {
    id: 'cnt-05',
    name: 'ModBox Duplex Lounge Showroom 2x40ft',
    code: 'MBX-DUP-80',
    category: 'especial',
    dimensions: {
      length: 12.19,
      width: 4.88,
      height: 5.78
    },
    areaM2: 59.48,
    volumeM3: 171.9,
    specs: {
      insulation: '',
      lining: 'Forro acústico modular com iluminação linear em perfis de LED dourados',
      floor: 'Deck de madeira ecológica no andar superior e porcelanato no térreo',
      doors: 'Portas de correr panorâmicas com folhas quádruplas de vidro laminado 10mm',
      windows: 'Paredes envidraçadas frontais com proteção solar refletiva',
      electrical: 'Automação residencial/comercial via app, 30 pontos de energia, sonorização embutida',
      plumbing: 'Dois banheiros completos e copa com bancada de granito preto São Gabriel',
      externalFinish: 'Pintura texturizada preta e escada helicoidal metálica em pintura dourada ouro velho'
    },
    baseCost: 115000,
    suggestedPrice: 189000,
    productionDaysEstimate: 45,
    productType: 'modular',
    description: 'Projeto modular de 2 andares para estandes de vendas imobiliárias de luxo, restaurantes sofisticados e sedes corporativas modulares.',
    badge: 'Projeto Exclusivo'
  },
  {
    id: 'cnt-cob-01',
    name: 'ModBox Cobertura Duas Águas Galvanizada',
    code: 'MBX-COB-01',
    productType: 'cobertura_metalica',
    category: 'comercial',
    dimensions: {
      length: 10.00,
      width: 6.00,
      height: 3.50
    },
    areaM2: 60.00,
    volumeM3: 210.00,
    specs: {
      roofTileType: 'Telha termoacústica sanduíche PIR/EPS 30mm trapézio',
      trussStructure: 'Treliça metálica estrutural em duas águas perfil Ue',
      columnsSupport: 'Pilares tubulares/perfil W com sapatas chumbadas ao solo',
      drainageGutters: 'Calhas galvanizadas corte 33 com rufos e descidas pluviais',
      roofPainting: 'Galvanização a quente + esmalte sintético anticorrosivo',
      clearSpan: 'Vão livre total com telhas translúcidas em policarbonato'
    },
    baseCost: 22000,
    suggestedPrice: 38500,
    productionDaysEstimate: 14,
    description: 'Cobertura metálica robusta para galpões, áreas comerciais, garagens e centros operacionais com proteção solar e pluvial de alta resistência.',
    badge: 'Coberturas'
  },
  {
    id: 'cnt-est-01',
    name: 'ModBox Portão Basculante Industrial',
    code: 'MBX-EST-01',
    productType: 'estrutura_metalica',
    category: 'comercial',
    dimensions: {
      length: 5.00,
      width: 0.20,
      height: 2.80
    },
    areaM2: 14.00,
    volumeM3: 2.80,
    specs: {
      structureType: 'Portão basculante industrial articulado',
      steelPlates: 'Chapa lambril búzios galvanizada cal. 18',
      metalProfiles: 'Tubos quadrados 80x80mm com reforço interno cruzado',
      hardwareMechanism: 'Caixa de contrapeso embutida com cabo de aço duplo e trava tetra',
      steelFinish: 'Fundo convertedor de ferrugem + pintura eletrostática preta',
      anchoringAssembly: 'Chumbadores químicos parabolt de alta resistência'
    },
    baseCost: 6800,
    suggestedPrice: 13500,
    productionDaysEstimate: 7,
    description: 'Serralheria pesada com fabricação sob medida de portão basculante ou articulado para empresas, condomínios e indústrias.',
    badge: 'Serralheria'
  }
];

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'col-01',
    name: 'Carlos Eduardo Oliveira',
    cpf: '124.872.938-44',
    pin: '123456',
    mustChangePin: true,
    rg: '14.892.301-8 SSP/SP',
    birthDate: '1988-06-14',
    phone: '(11) 98741-2309',
    email: 'carlos.oliveira@modbox.com.br',
    role: 'Líder Geral de Montagem e Obras',
    skills: ['Içamento com Munck', 'Nivelamento a Laser', 'Coordenação de Campo', 'Solda MIG/TIG', 'Leitura de Projetos'],
    address: {
      street: 'Rua das Palmeiras',
      number: '420',
      complement: 'Casa 2',
      neighborhood: 'Jardim Alvorada',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04821-120',
      landmark: 'Próximo à Paróquia São José'
    },
    admissionDate: '2023-02-15',
    status: 'em_montagem',
    dailyRate: 350,
    completedInstallations: 38
  },
  {
    id: 'col-02',
    name: 'Marcos Vinícius Santos',
    cpf: '289.412.871-05',
    pin: '123456',
    mustChangePin: true,
    rg: '21.045.678-2 SSP/SP',
    birthDate: '1992-11-20',
    phone: '(11) 97654-9982',
    email: 'marcos.santos@modbox.com.br',
    role: 'Serralheiro Mestre & Soldador Estrutural',
    skills: ['Corte a Plasma', 'Reforço Estrutural de Aço Corten', 'Fixação e Ancoragem', 'Instalação de Esquadrias'],
    address: {
      street: 'Avenida Industrial',
      number: '1250',
      complement: 'Bloco C, Apto 42',
      neighborhood: 'Vila Metalúrgica',
      city: 'Santo André',
      state: 'SP',
      zipCode: '09220-400',
      landmark: 'Em frente ao terminal de ônibus'
    },
    admissionDate: '2023-05-10',
    status: 'em_montagem',
    dailyRate: 280,
    completedInstallations: 42
  },
  {
    id: 'col-03',
    name: 'Rafael Lima Bezerra',
    cpf: '341.982.112-90',
    pin: '123456',
    mustChangePin: true,
    rg: '33.109.452-1 SSP/SP',
    birthDate: '1995-03-08',
    phone: '(11) 99123-4567',
    email: 'rafael.eletrica@modbox.com.br',
    role: 'Técnico em Eletroeletrônica & Automação',
    skills: ['Instalações 110/220/380V', 'Quadro de Disjuntores', 'Iluminação LED Dimerizável', 'Infraestrutura de Rede e A/C'],
    address: {
      street: 'Rua Santa Catarina',
      number: '88',
      neighborhood: 'Centro',
      city: 'São Bernardo do Campo',
      state: 'SP',
      zipCode: '09710-180',
      landmark: 'Atrás do Mercado Municipal'
    },
    admissionDate: '2023-08-01',
    status: 'disponivel',
    dailyRate: 290,
    completedInstallations: 29
  },
  {
    id: 'col-04',
    name: 'Rodrigo Mendonça Prado',
    cpf: '402.156.789-32',
    pin: '123456',
    mustChangePin: true,
    rg: '29.873.112-0 SSP/SP',
    birthDate: '1990-09-17',
    phone: '(11) 98456-1123',
    email: 'rodrigo.montagem@modbox.com.br',
    role: 'Montador Especialista de Esquadrias & Drywall',
    skills: ['Colocação de Blindex', 'Forro Termoacústico', 'Vedação PU Industrial', 'Piso Vinílico'],
    address: {
      street: 'Rua Bento Gonçalves',
      number: '315',
      neighborhood: 'Paulicéia',
      city: 'São Bernardo do Campo',
      state: 'SP',
      zipCode: '09690-000',
      landmark: 'Próximo à Rodovia Anchieta'
    },
    admissionDate: '2024-01-12',
    status: 'em_montagem',
    dailyRate: 260,
    completedInstallations: 21
  },
  {
    id: 'col-05',
    name: 'Alexandre Souza Freitas',
    cpf: '510.334.612-88',
    pin: '123456',
    mustChangePin: true,
    rg: '18.992.405-7 SSP/SP',
    birthDate: '1985-12-03',
    phone: '(11) 97321-8890',
    email: 'alexandre.pintura@modbox.com.br',
    role: 'Pintor Técnico & Preparador Industrial',
    skills: ['Pintura Poliuretânica Industrial', 'Jateamento Abrasivo', 'Filetes Metálicos Dourados', 'Impermeabilização'],
    address: {
      street: 'Estrada dos Alvarengas',
      number: '2100',
      neighborhood: 'Alvarenga',
      city: 'São Bernardo do Campo',
      state: 'SP',
      zipCode: '09850-550',
      landmark: 'Próximo à represa Billings'
    },
    admissionDate: '2023-04-20',
    status: 'disponivel',
    dailyRate: 270,
    completedInstallations: 35
  }
];

export const INITIAL_SALES: SaleOrder[] = [
  {
    id: 'sale-001',
    orderNumber: 'MBX-2026-081',
    createdAt: '2026-10-10',
    client: {
      name: 'Studio Arquitetura & Design Nova Era Ltda',
      document: '38.921.405/0001-92',
      phone: '(11) 98112-9090',
      email: 'contato@novaeraarquitetura.com.br',
      contactPerson: 'Dra. Mariana Azevedo'
    },
    installationAddress: {
      street: 'Avenida Brigadeiro Faria Lima',
      number: '3477',
      complement: 'Térreo - Espaço Garden',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04538-133',
      landmark: 'Acesso lateral pela Alameda dos Ipês - Portão de Carga'
    },
    containerModelId: 'cnt-01',
    containerName: 'ModBox Office Executive 20ft',
    customizations: [
      'Janela adicional blindex fumê',
      'Ar condicionado Inverter 12.000 BTUs instalado',
      'Pintura preta com logotipo do cliente em relevo dourado'
    ],
    financials: {
      totalAmount: 49800,
      downPayment: 25000,
      balanceDue: 24800,
      paymentMethod: 'PIX (50% entrada + 50% na entrega)',
      paymentStatus: 'parcial',
      productionCost: 29800,
      grossProfit: 20000
    },
    schedule: {
      scheduledDate: '2026-10-28', // Amanhã!
      scheduledTime: '08:30',
      estimatedDurationHours: 6,
      estimatedDurationDays: 2,
      endDate: '2026-10-29'
    },
    assignedCollaboratorIds: ['col-01', 'col-02', 'col-04'],
    status: 'montagem_local',
    checklist: {
      'nivelamento_sapatas': true,
      'descarregamento_munck': true,
      'fixacao_estrutural': true,
      'conexao_eletrica_geral': false,
      'ligacao_hidraulica_esgoto': false,
      'vedacao_silicone_pu': false,
      'limpeza_e_higienizacao': false,
      'termo_entrega_assinado': false
    },
    notes: [
      {
        id: 'note-1',
        author: 'Carlos Eduardo Oliveira',
        timestamp: '2026-10-27 10:15',
        text: 'Caminhão munck posicionado na Faria Lima sem restrições de trânsito. Contêiner descarregado sobre as 4 sapatas de concreto com nivelamento a laser 100% calibrado.'
      },
      {
        id: 'note-2',
        author: 'Marcos Vinícius Santos',
        timestamp: '2026-10-27 13:40',
        text: 'Fixação das sapatas metálicas ancoradas com chumbadores químicos parabolt. Estrutura 100% rígida e segura.'
      }
    ],
    expenses: [
      {
        id: 'exp-01',
        description: '100 Parafusos autobrocantes e arruelas de vedação EPDM',
        amount: 180,
        category: 'serralheria',
        date: '2026-10-18',
        notes: 'Comprado na Casa do Parafuso para fixação do telhado e vedação',
        cashFlowEntryId: 'cf-exp-01'
      },
      {
        id: 'exp-02',
        description: 'Barras de ferro estrutural 50x50mm e cantoneiras',
        amount: 850,
        category: 'materia_prima',
        date: '2026-10-20',
        notes: 'Aço adicional para reforço dos vãos de esquadrias',
        cashFlowEntryId: 'cf-exp-02'
      },
      {
        id: 'exp-03',
        description: 'Tinta esmalte sintético e primer antiferrugem',
        amount: 320,
        category: 'outros',
        date: '2026-10-22',
        notes: 'Acabamento das áreas soldadas',
        cashFlowEntryId: 'cf-exp-03'
      }
    ]
  },
  {
    id: 'sale-002',
    orderNumber: 'MBX-2026-082',
    createdAt: '2026-10-15',
    client: {
      name: 'Cafeteria & Gelateria Terra Roxa',
      document: '42.110.873/0001-44',
      phone: '(19) 99823-1100',
      email: 'compras@cafeteriaterraroxa.com.br',
      contactPerson: 'Sr. Roberto Meneghetti'
    },
    installationAddress: {
      street: 'Rua Coronel Quirino',
      number: '1420',
      complement: 'Esquina com Rua Maria Monteiro',
      neighborhood: 'Cambuí',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13025-002',
      landmark: 'Próximo à Praça Imprensa Fluminense'
    },
    containerModelId: 'cnt-03',
    containerName: 'ModBox Gourmet PopUp 20ft',
    customizations: [
      'Balcão retrátil adicional com acabamento dourado',
      'Ponto elétrico trifásico para máquina de café espresso italiana de 3 grupos',
      'Piso em inox xadrez escovado'
    ],
    financials: {
      totalAmount: 56500,
      downPayment: 30000,
      balanceDue: 26500,
      paymentMethod: 'Transferência Bancária TED/PIX',
      paymentStatus: 'parcial',
      productionCost: 35200,
      grossProfit: 21300
    },
    schedule: {
      scheduledDate: '2026-10-30',
      scheduledTime: '07:00',
      estimatedDurationHours: 8,
      estimatedDurationDays: 1,
      endDate: '2026-10-30'
    },
    assignedCollaboratorIds: ['col-01', 'col-03', 'col-04'],
    status: 'acabamento_pintura',
    checklist: {
      'nivelamento_sapatas': false,
      'descarregamento_munck': false,
      'fixacao_estrutural': false,
      'conexao_eletrica_geral': false,
      'ligacao_hidraulica_esgoto': false,
      'vedacao_silicone_pu': false,
      'limpeza_e_higienizacao': false,
      'termo_entrega_assinado': false
    },
    notes: [
      {
        id: 'note-3',
        author: 'Alexandre Souza Freitas',
        timestamp: '2026-10-26 16:00',
        text: 'Pintura externa preto acetinado e aplicação dos frisos dourados finalizada na cabine de pintura. Secagem UV em andamento.'
      }
    ]
  },
  {
    id: 'sale-003',
    orderNumber: 'MBX-2026-083',
    createdAt: '2026-10-18',
    client: {
      name: 'Construtora & Incorporadora Horizonte SP',
      document: '19.452.880/0001-11',
      phone: '(11) 3290-7700',
      email: 'obras@horizonteincorporadora.com.br',
      contactPerson: 'Engº Bruno Caldas'
    },
    installationAddress: {
      street: 'Avenida Giovanni Gronchi',
      number: '5800',
      neighborhood: 'Morumbi',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05724-002',
      landmark: 'Canteiro de Obras do Empreendimento Residencial Parque Morumbi'
    },
    containerModelId: 'cnt-04',
    containerName: 'ModBox Canteiro & Almoxarifado Seguro 10ft',
    customizations: [
      'Prateleiras reforçadas internas em aço galvanizado',
      'Reforço de fechadura antifurto com proteção para cadeado blindado'
    ],
    financials: {
      totalAmount: 21400,
      downPayment: 21400,
      balanceDue: 0,
      paymentMethod: 'Boleto Bancário à Vista',
      paymentStatus: 'pago',
      productionCost: 13000,
      grossProfit: 8400
    },
    schedule: {
      scheduledDate: '2026-11-03',
      scheduledTime: '09:00',
      estimatedDurationHours: 4,
      estimatedDurationDays: 2,
      endDate: '2026-11-04'
    },
    assignedCollaboratorIds: ['col-02', 'col-05'],
    status: 'transporte',
    checklist: {
      'nivelamento_sapatas': false,
      'descarregamento_munck': false,
      'fixacao_estrutural': false,
      'conexao_eletrica_geral': false,
      'ligacao_hidraulica_esgoto': false,
      'vedacao_silicone_pu': false,
      'limpeza_e_higienizacao': false,
      'termo_entrega_assinado': false
    },
    notes: [
      {
        id: 'note-4',
        author: 'Carlos Eduardo Oliveira',
        timestamp: '2026-10-27 11:00',
        text: 'Contêiner carregado na carreta prancha e amarrado com catracas reforçadas. Agendamento com o canteiro confirmado para entrega.'
      }
    ]
  },
  {
    id: 'sale-004',
    orderNumber: 'MBX-2026-084',
    createdAt: '2026-10-20',
    client: {
      name: 'Dr. Leonardo Vasconcelos',
      document: '215.890.341-20',
      phone: '(12) 99182-3344',
      email: 'leonardo.vasconcelos@hospitalvales.com.br',
      contactPerson: 'Leonardo Vasconcelos'
    },
    installationAddress: {
      street: 'Condomínio Reserva da Praia - Lote 14, Quadra B',
      number: 'S/N',
      neighborhood: 'Praia da Baleia',
      city: 'São Sebastião',
      state: 'SP',
      zipCode: '11600-000',
      landmark: 'Subida da colina ao lado da guarita principal'
    },
    containerModelId: 'cnt-02',
    containerName: 'ModBox Living Residence 40ft High Cube',
    customizations: [
      'Deck em madeira plástica superior para observatório',
      'Esquadrias antirruído e vidros termoacústicos duplos',
      'Pintura ultraresistente anticorrosiva e acabamento premium'
    ],
    financials: {
      totalAmount: 98000,
      downPayment: 49000,
      balanceDue: 49000,
      paymentMethod: 'Cartão de Crédito 10x sem juros',
      paymentStatus: 'parcial',
      productionCost: 59000,
      grossProfit: 39000
    },
    schedule: {
      scheduledDate: '2026-11-10',
      scheduledTime: '08:00',
      estimatedDurationHours: 12,
      estimatedDurationDays: 3,
      endDate: '2026-11-12'
    },
    assignedCollaboratorIds: ['col-01', 'col-02', 'col-03', 'col-04', 'col-05'],
    status: 'isolamento',
    checklist: {
      'nivelamento_sapatas': false,
      'descarregamento_munck': false,
      'fixacao_estrutural': false,
      'conexao_eletrica_geral': false,
      'ligacao_hidraulica_esgoto': false,
      'vedacao_silicone_pu': false,
      'limpeza_e_higienizacao': false,
      'termo_entrega_assinado': false
    },
    notes: [
      {
        id: 'note-5',
        author: 'Marcos Vinícius Santos',
        timestamp: '2026-10-25 14:00',
        text: 'Cortes estruturais para as portas de correr de 4 metros e janelas executados com solda de reforço em tubos industriais 100x100mm.'
      }
    ]
  },
  {
    id: 'sale-005',
    orderNumber: 'MBX-2026-079',
    createdAt: '2026-09-28',
    client: {
      name: 'Alpha Hub Coworking & Inovação',
      document: '29.338.190/0001-76',
      phone: '(11) 97100-2211',
      email: 'contato@alphahub.com.br',
      contactPerson: 'Beatriz Fontes'
    },
    installationAddress: {
      street: 'Alameda Rio Negro',
      number: '500',
      complement: 'Área externa Garden',
      neighborhood: 'Alphaville',
      city: 'Barueri',
      state: 'SP',
      zipCode: '06454-000',
      landmark: 'Ao lado do Centro Comercial Alphaville'
    },
    containerModelId: 'cnt-01',
    containerName: 'ModBox Office Executive 20ft',
    customizations: [
      'Piso elevado para cabeamento de fibra óptica',
      'Divisória acústica interna para sala de reunião'
    ],
    financials: {
      totalAmount: 48500,
      downPayment: 48500,
      balanceDue: 0,
      paymentMethod: 'PIX à Vista',
      paymentStatus: 'pago',
      productionCost: 28900,
      grossProfit: 19600
    },
    schedule: {
      scheduledDate: '2026-10-15',
      scheduledTime: '09:00',
      estimatedDurationHours: 6
    },
    assignedCollaboratorIds: ['col-01', 'col-03', 'col-04'],
    status: 'concluido',
    checklist: {
      'nivelamento_sapatas': true,
      'descarregamento_munck': true,
      'fixacao_estrutural': true,
      'conexao_eletrica_geral': true,
      'ligacao_hidraulica_esgoto': true,
      'vedacao_silicone_pu': true,
      'limpeza_e_higienizacao': true,
      'termo_entrega_assinado': true
    },
    notes: [
      {
        id: 'note-6',
        author: 'Carlos Eduardo Oliveira',
        timestamp: '2026-10-15 15:30',
        text: 'Montagem 100% finalizada, testada na presença da cliente Beatriz Fontes. Termo de entrega e garantia assinado com elogios.'
      }
    ]
  }
];

export const INITIAL_CASH_FLOW: CashFlowEntry[] = [
  {
    id: 'cf-01',
    type: 'receita',
    category: 'venda_conteiner',
    amount: 48500,
    description: 'Recebimento integral Venda MBX-2026-079 (Alpha Hub Coworking)',
    date: '2026-09-28',
    saleOrderId: 'sale-005',
    clientOrSupplier: 'Alpha Hub Coworking'
  },
  {
    id: 'cf-02',
    type: 'despesa',
    category: 'materia_prima',
    amount: 14200,
    description: 'Aquisição de Módulo Estrutural em Aço Industrial',
    date: '2026-10-02',
    clientOrSupplier: 'Porto Logística Containers Santos'
  },
  {
    id: 'cf-03',
    type: 'despesa',
    category: 'serralheria',
    amount: 4800,
    description: 'Perfis estruturais de aço galvanizado, tubos e chapas corten',
    date: '2026-10-05',
    clientOrSupplier: 'AçoForte Distribuidora'
  },
  {
    id: 'cf-04',
    type: 'receita',
    category: 'venda_conteiner',
    amount: 25000,
    description: 'Entrada 50% Venda MBX-2026-081 (Studio Arquitetura Nova Era)',
    date: '2026-10-10',
    saleOrderId: 'sale-001',
    clientOrSupplier: 'Studio Arquitetura Nova Era'
  },
  {
    id: 'cf-05',
    type: 'despesa',
    category: 'eletrica_hidraulica',
    amount: 5300,
    description: 'Materiais elétricos, cabos antichamas 10mm, tomadas e disjuntores Steck',
    date: '2026-10-12',
    clientOrSupplier: 'Elétrica São Paulo'
  },
  {
    id: 'cf-06',
    type: 'receita',
    category: 'venda_conteiner',
    amount: 30000,
    description: 'Entrada Venda MBX-2026-082 (Cafeteria Terra Roxa)',
    date: '2026-10-15',
    saleOrderId: 'sale-002',
    clientOrSupplier: 'Cafeteria Terra Roxa'
  },
  {
    id: 'cf-07',
    type: 'despesa',
    category: 'transporte_munck',
    amount: 3200,
    description: 'Locação de Caminhão Munck 30 toneladas com operador para içamento Faria Lima',
    date: '2026-10-17',
    clientOrSupplier: 'Munck Express Guindastes'
  },
  {
    id: 'cf-08',
    type: 'receita',
    category: 'venda_conteiner',
    amount: 21400,
    description: 'Pagamento à Vista Venda MBX-2026-083 (Construtora Horizonte SP)',
    date: '2026-10-18',
    saleOrderId: 'sale-003',
    clientOrSupplier: 'Construtora Horizonte SP'
  },
  {
    id: 'cf-09',
    type: 'receita',
    category: 'venda_conteiner',
    amount: 49000,
    description: 'Entrada 50% Venda MBX-2026-084 (Dr. Leonardo Vasconcelos)',
    date: '2026-10-20',
    saleOrderId: 'sale-004',
    clientOrSupplier: 'Dr. Leonardo Vasconcelos'
  },
  {
    id: 'cf-10',
    type: 'despesa',
    category: 'mao_de_obra_montagem',
    amount: 8600,
    description: 'Folha de pagamento de diárias operacionais e montagens técnicas de campo',
    date: '2026-10-25',
    clientOrSupplier: 'Equipe Operacional ModBox'
  },
  {
    id: 'cf-exp-01',
    type: 'despesa',
    category: 'serralheria',
    amount: 180,
    description: '[Obra: Studio Arquitetura Nova Era] 100 Parafusos autobrocantes e arruelas de vedação EPDM',
    date: '2026-10-18',
    saleOrderId: 'sale-001',
    clientOrSupplier: 'Studio Arquitetura Nova Era'
  },
  {
    id: 'cf-exp-02',
    type: 'despesa',
    category: 'materia_prima',
    amount: 850,
    description: '[Obra: Studio Arquitetura Nova Era] Barras de ferro estrutural 50x50mm e cantoneiras',
    date: '2026-10-20',
    saleOrderId: 'sale-001',
    clientOrSupplier: 'Studio Arquitetura Nova Era'
  },
  {
    id: 'cf-exp-03',
    type: 'despesa',
    category: 'outros',
    amount: 320,
    description: '[Obra: Studio Arquitetura Nova Era] Tinta esmalte sintético e primer antiferrugem',
    date: '2026-10-22',
    saleOrderId: 'sale-001',
    clientOrSupplier: 'Studio Arquitetura Nova Era'
  }
];

export const PRODUCTION_STAGES_CONFIG: {
  id: SaleOrder['status'];
  label: string;
  stepNumber: number;
  description: string;
}[] = [
  { id: 'orcamento', label: 'Orçamento', stepNumber: 1, description: 'Negociação comercial e especificações' },
  { id: 'projeto_aprovado', label: 'Projeto Aprovado', stepNumber: 2, description: 'Planta executiva e liberação técnica' },
  { id: 'serralheria_corte', label: 'Serralheria & Corte', stepNumber: 3, description: 'Aberturas, reforços e esquadrias' },
  { id: 'isolamento', label: 'Isolamento', stepNumber: 4, description: 'Aplicação de lã de rocha/EPS e forro' },
  { id: 'eletrica_hidraulica', label: 'Elétrica & Hidráulica', stepNumber: 5, description: 'Passagem de cabos, tubos e quadros' },
  { id: 'acabamento_pintura', label: 'Pintura & Acabamento', stepNumber: 6, description: 'Pintura industrial, piso e vidros' },
  { id: 'transporte', label: 'Transporte / Logística', stepNumber: 7, description: 'Em trânsito para o local da obra' },
  { id: 'montagem_local', label: 'Montagem no Local', stepNumber: 8, description: 'Nivelamento, içamento e instalação' },
  { id: 'concluido', label: 'Concluído & Entregue', stepNumber: 9, description: 'Termo de entrega e garantia assinado' },
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'adm-01',
    name: 'Humberto Jr',
    cpf: '000.000.000-00',
    pin: '000000',
    createdAt: '2026-01-15'
  }
];

