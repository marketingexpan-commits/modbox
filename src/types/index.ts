export type AppRole = 'admin' | 'colaborador';

export type ProductType = 'modular' | 'cobertura_metalica' | 'estrutura_metalica';

export type ContainerCategory = 'escritorio' | 'comercial' | 'habitacional' | 'almoxarifado' | 'especial';

export interface ContainerDimensions {
  length: number; // metros (comprimento)
  width: number;  // metros (largura)
  height: number; // metros (altura)
}

export interface ContainerSpecs {
  // 1. Modular (Contêineres)
  insulation?: string;
  lining?: string;
  floor?: string;
  doors?: string;
  windows?: string;
  electrical?: string;
  plumbing?: string;
  externalFinish?: string;

  // 2. Cobertura Metálica
  roofTileType?: string;      // Tipo de Telha / Cobertura
  trussStructure?: string;    // Tesoura & Treliças
  columnsSupport?: string;    // Pilares & Sustentação
  drainageGutters?: string;   // Calhas & Escoamento Pluvial
  roofPainting?: string;      // Tratamento & Pintura
  clearSpan?: string;         // Vão Livre & Iluminação

  // 3. Estrutura Metálica em Geral / Serralheria
  structureType?: string;     // Tipo de Estrutura / Projeto
  steelPlates?: string;       // Chapas & Fechamento
  metalProfiles?: string;     // Perfis Estruturais & Vigamento
  hardwareMechanism?: string; // Ferragens & Mecanismos
  steelFinish?: string;       // Acabamento & Tratamento
  anchoringAssembly?: string; // Fixação & Montagem
}

export interface ContainerModel {
  id: string;
  name: string;
  code: string;
  productType?: ProductType;  // Tipo de produto: Modular, Cobertura Metálica, Estrutura Metálica
  category: ContainerCategory;
  dimensions: ContainerDimensions;
  areaM2: number;
  volumeM3: number;
  specs: ContainerSpecs;
  baseCost: number;       // Custo estimado de produção (R$)
  suggestedPrice: number; // Preço sugerido de venda (R$)
  productionDaysEstimate: number;
  description: string;
  badge?: string;
}

export type CollaboratorStatus = 'disponivel' | 'em_montagem' | 'ferias' | 'inativo';

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  birthDate?: string;
  address: Address;
  phone: string;
  email: string;
  role: string; // Cargo: Serralheiro Mestre, Eletricista, Montador de Campo, Líder de Obra, Pintor
  skills: string[];
  admissionDate: string;
  status: CollaboratorStatus;
  dailyRate?: number;
  completedInstallations: number;
  pin?: string;            // PIN de 6 dígitos para login (login = CPF)
  mustChangePin?: boolean; // força troca do PIN provisório no primeiro acesso
}

export interface AdminUser {
  id: string;
  name: string;
  cpf?: string;
  pin: string;            // PIN de 6 dígitos
  createdAt: string;
}

export type ProductionStatus = 
  | 'orcamento'
  | 'projeto_aprovado'
  | 'serralheria_corte'
  | 'isolamento'
  | 'eletrica_hidraulica'
  | 'acabamento_pintura'
  | 'transporte'
  | 'montagem_local'
  | 'concluido';

export interface OperationalNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface ProjectExpense {
  id: string;
  description: string;
  amount: number;
  category: CashFlowCategory;
  date: string;
  notes?: string;
  cashFlowEntryId?: string;
  createdBy?: string;
  collaboratorId?: string;
  daysCount?: number;
}

export interface SaleOrder {
  id: string;
  orderNumber: string; // MBX-001
  createdAt: string;
  client: {
    name: string;
    document: string; // CPF ou CNPJ
    phone: string;
    email: string;
    contactPerson?: string;
  };
  installationAddress: Address;
  containerModelId: string;
  containerName: string;   // Nome do produto (Modular, Cobertura Metálica ou Estrutura Metálica)
  productType?: ProductType; // Tipo de produto vinculado ao pedido
  customDimensions?: ContainerDimensions;
  customizations: string[];
  financials: {
    totalAmount: number;
    downPayment: number;
    balanceDue: number;
    paymentMethod: string;
    paymentStatus: 'pago' | 'parcial' | 'pendente';
    productionCost: number;
    grossProfit: number;
  };
  schedule: {
    scheduledDate: string; // YYYY-MM-DD (Data de Início)
    scheduledTime: string; // HH:MM
    estimatedDurationHours: number;
    estimatedDurationDays?: number; // Duração em dias (1, 2, 3...)
    endDate?: string; // YYYY-MM-DD (Data de Conclusão)
  };
  assignedCollaboratorIds: string[];
  status: ProductionStatus;
  checklist: Record<string, boolean>;
  notes: OperationalNote[];
  expenses?: ProjectExpense[];
}

export type CashFlowType = 'receita' | 'despesa';

export type CashFlowCategory = 
  | 'venda_conteiner'
  | 'locacao'
  | 'materia_prima'
  | 'serralheria'
  | 'eletrica_hidraulica'
  | 'mao_de_obra_montagem'
  | 'transporte_munck'
  | 'administrativo'
  | 'outros';

export interface CashFlowEntry {
  id: string;
  type: CashFlowType;
  category: CashFlowCategory;
  amount: number;
  description: string;
  date: string;
  saleOrderId?: string;
  clientOrSupplier?: string;
}
