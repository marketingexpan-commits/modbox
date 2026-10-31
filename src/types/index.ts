export type AppRole = 'admin' | 'colaborador';

export type ContainerCategory = 'escritorio' | 'comercial' | 'habitacional' | 'almoxarifado' | 'especial';

export interface ContainerDimensions {
  length: number; // metros (comprimento)
  width: number;  // metros (largura)
  height: number; // metros (altura)
}

export interface ContainerModel {
  id: string;
  name: string;
  code: string;
  category: ContainerCategory;
  dimensions: ContainerDimensions;
  areaM2: number;
  volumeM3: number;
  specs: {
    insulation: string;    // Isolamento (ex: EPS 50mm, Lã de Rocha)
    lining: string;        // Forro / Revestimento interno (ex: PVC especial, Drywall)
    floor: string;         // Piso (ex: Compensado naval com piso vinílico)
    doors: string;         // Portas (ex: 1 porta blindex + porta original contêiner)
    windows: string;       // Janelas (ex: 2 janelas de correr 1.20x1.00m)
    electrical: string;    // Elétrica (ex: 6 tomadas, 2 luminárias LED, quadro disjuntores)
    plumbing: string;      // Hidráulica (ex: Ponto para lavabo com pia e vaso)
    externalFinish: string;// Acabamento externo (ex: Pintura automotiva/naval preta/dourada)
  };
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
  containerName: string;
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
    scheduledDate: string; // YYYY-MM-DD
    scheduledTime: string; // HH:MM
    estimatedDurationHours: number;
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
