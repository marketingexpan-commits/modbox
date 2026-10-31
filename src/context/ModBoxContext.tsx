import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AppRole, 
  ContainerModel, 
  Collaborator, 
  SaleOrder, 
  CashFlowEntry, 
  ProductionStatus,
  OperationalNote,
  AdminUser
} from '../types';
import { 
  INITIAL_CONTAINERS, 
  INITIAL_COLLABORATORS, 
  INITIAL_SALES, 
  INITIAL_CASH_FLOW,
  INITIAL_ADMINS
} from '../data/mockData';

interface ModBoxContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  activeCollaboratorId: string | null;
  setActiveCollaboratorId: (id: string | null) => void;
  activeAdminId: string | null;
  setActiveAdminId: (id: string | null) => void;

  admins: AdminUser[];
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateAdmin: (id: string, admin: Partial<AdminUser>) => void;
  deleteAdmin: (id: string) => void;
  
  containers: ContainerModel[];
  addContainer: (container: Omit<ContainerModel, 'id'>) => void;
  updateContainer: (id: string, container: Partial<ContainerModel>) => void;
  deleteContainer: (id: string) => void;

  collaborators: Collaborator[];
  addCollaborator: (collaborator: Omit<Collaborator, 'id'>) => void;
  updateCollaborator: (id: string, collaborator: Partial<Collaborator>) => void;
  deleteCollaborator: (id: string) => void;

  sales: SaleOrder[];
  addSale: (sale: Omit<SaleOrder, 'id' | 'orderNumber' | 'createdAt'>) => void;
  updateSale: (id: string, sale: Partial<SaleOrder>) => void;
  updateSaleStatus: (id: string, status: ProductionStatus) => void;
  toggleChecklistItem: (saleId: string, itemKey: string) => void;
  addNoteToSale: (saleId: string, noteText: string, authorName: string) => void;
  deleteSale: (id: string) => void;

  cashFlow: CashFlowEntry[];
  addCashFlowEntry: (entry: Omit<CashFlowEntry, 'id'>) => void;
  deleteCashFlowEntry: (id: string) => void;

  resetToDemoData: () => void;

  // Autenticação
  authenticateCollaborator: (cpf: string, pin: string) => Collaborator | null;
  changeCollaboratorPin: (id: string, newPin: string) => void;
  authenticateAdmin: (adminId: string, pin: string) => AdminUser | null;
  changeAdminPin: (adminId: string, newPin: string) => void;

  // KPIs
  stats: {
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
    profitMargin: number;
    activeProductionCount: number;
    scheduledMontagensCount: number;
    completedCount: number;
    totalCollaborators: number;
  };
}

const STORAGE_KEY = 'modbox_app_state_v1';
const DEFAULT_PIN = '123456';
const DEFAULT_ADMIN_PIN = '000000';
const onlyDigits = (v: string) => v.replace(/\D/g, '');

const ModBoxContext = createContext<ModBoxContextType | undefined>(undefined);

export const ModBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('admin');
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>('col-01');
  const [activeAdminId, setActiveAdminId] = useState<string | null>('adm-01');

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admins`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(a => a.name === 'Humberto Jr')) {
          return parsed;
        }
      }
      return INITIAL_ADMINS;
    } catch {
      return INITIAL_ADMINS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_admins`, JSON.stringify(admins));
    } catch (e) {
      console.error('Failed to save admins to localStorage', e);
    }
  }, [admins]);

  // Load stored state or initialize with mock data
  const [containers, setContainers] = useState<ContainerModel[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_containers`);
      return saved ? JSON.parse(saved) : INITIAL_CONTAINERS;
    } catch {
      return INITIAL_CONTAINERS;
    }
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_collaborators`);
      return saved ? JSON.parse(saved) : INITIAL_COLLABORATORS;
    } catch {
      return INITIAL_COLLABORATORS;
    }
  });

  const [sales, setSales] = useState<SaleOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sales`);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cashflow`);
      return saved ? JSON.parse(saved) : INITIAL_CASH_FLOW;
    } catch {
      return INITIAL_CASH_FLOW;
    }
  });

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_containers`, JSON.stringify(containers));
    } catch (e) {
      console.error('Failed to save containers to localStorage', e);
    }
  }, [containers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_collaborators`, JSON.stringify(collaborators));
    } catch (e) {
      console.error('Failed to save collaborators to localStorage', e);
    }
  }, [collaborators]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_sales`, JSON.stringify(sales));
    } catch (e) {
      console.error('Failed to save sales to localStorage', e);
    }
  }, [sales]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cashflow`, JSON.stringify(cashFlow));
    } catch (e) {
      console.error('Failed to save cashflow to localStorage', e);
    }
  }, [cashFlow]);

  // Containers actions
  const addContainer = (data: Omit<ContainerModel, 'id'>) => {
    const newContainer: ContainerModel = {
      ...data,
      id: `cnt-${Date.now()}`
    };
    setContainers(prev => [newContainer, ...prev]);
  };

  const updateContainer = (id: string, data: Partial<ContainerModel>) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteContainer = (id: string) => {
    setContainers(prev => prev.filter(c => c.id !== id));
  };

  // Collaborators actions
  const addCollaborator = (data: Omit<Collaborator, 'id'>) => {
    const newCollab: Collaborator = {
      ...data,
      id: `col-${Date.now()}`
    };
    setCollaborators(prev => [newCollab, ...prev]);
  };

  const updateCollaborator = (id: string, data: Partial<Collaborator>) => {
    setCollaborators(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
  };

  // Auth actions
  const authenticateCollaborator = (cpf: string, pin: string): Collaborator | null => {
    const digits = onlyDigits(cpf);
    const collab = collaborators.find(c => onlyDigits(c.cpf) === digits);
    if (!collab || collab.status === 'inativo') return null;
    const expected = collab.pin ?? DEFAULT_PIN;
    if (pin !== expected) return null;
    return collab.pin ? collab : { ...collab, mustChangePin: true };
  };

  const changeCollaboratorPin = (id: string, newPin: string) => {
    setCollaborators(prev => prev.map(c => c.id === id ? { ...c, pin: newPin, mustChangePin: false } : c));
  };

  // Admin actions
  const addAdmin = (data: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newAdmin: AdminUser = {
      ...data,
      id: `adm-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdmins(prev => [...prev, newAdmin]);
  };

  const updateAdmin = (id: string, data: Partial<AdminUser>) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  const authenticateAdmin = (adminId: string, pin: string): AdminUser | null => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return null;
    if (admin.pin !== pin) return null;
    return admin;
  };

  const changeAdminPin = (adminId: string, newPin: string) => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, pin: newPin } : a));
  };

  // Sales actions
  const addSale = (data: Omit<SaleOrder, 'id' | 'orderNumber' | 'createdAt'>) => {
    const count = sales.length + 85;
    const orderNumber = `MBX-2026-0${count}`;
    const newSale: SaleOrder = {
      ...data,
      id: `sale-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSales(prev => [newSale, ...prev]);

    // Automatically create income cash flow entry if downPayment > 0
    if (data.financials.downPayment > 0) {
      const cfEntry: CashFlowEntry = {
        id: `cf-${Date.now()}`,
        type: 'receita',
        category: 'venda_conteiner',
        amount: data.financials.downPayment,
        description: `Entrada Venda ${orderNumber} (${data.client.name})`,
        date: new Date().toISOString().split('T')[0],
        saleOrderId: newSale.id,
        clientOrSupplier: data.client.name
      };
      setCashFlow(prev => [cfEntry, ...prev]);
    }
  };

  const updateSale = (id: string, data: Partial<SaleOrder>) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const updateSaleStatus = (id: string, status: ProductionStatus) => {
    setSales(prev => prev.map(s => {
      if (s.id === id) {
        // If moved to completed, update collaborator counts
        if (status === 'concluido' && s.status !== 'concluido') {
          setCollaborators(cols => cols.map(c => {
            if (s.assignedCollaboratorIds.includes(c.id)) {
              return { ...c, completedInstallations: c.completedInstallations + 1, status: 'disponivel' };
            }
            return c;
          }));
        }
        return { ...s, status };
      }
      return s;
    }));
  };

  const toggleChecklistItem = (saleId: string, itemKey: string) => {
    setSales(prev => prev.map(s => {
      if (s.id === saleId) {
        const currentChecklist = s.checklist || {};
        return {
          ...s,
          checklist: {
            ...currentChecklist,
            [itemKey]: !currentChecklist[itemKey]
          }
        };
      }
      return s;
    }));
  };

  const addNoteToSale = (saleId: string, noteText: string, authorName: string) => {
    const newNote: OperationalNote = {
      id: `note-${Date.now()}`,
      author: authorName,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      text: noteText
    };
    setSales(prev => prev.map(s => {
      if (s.id === saleId) {
        return {
          ...s,
          notes: [newNote, ...(s.notes || [])]
        };
      }
      return s;
    }));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  // Cashflow actions
  const addCashFlowEntry = (entry: Omit<CashFlowEntry, 'id'>) => {
    const newEntry: CashFlowEntry = {
      ...entry,
      id: `cf-${Date.now()}`
    };
    setCashFlow(prev => [newEntry, ...prev]);
  };

  const deleteCashFlowEntry = (id: string) => {
    setCashFlow(prev => prev.filter(c => c.id !== id));
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_containers`);
    localStorage.removeItem(`${STORAGE_KEY}_collaborators`);
    localStorage.removeItem(`${STORAGE_KEY}_sales`);
    localStorage.removeItem(`${STORAGE_KEY}_cashflow`);
    localStorage.removeItem(`${STORAGE_KEY}_admins`);
    setContainers(INITIAL_CONTAINERS);
    setCollaborators(INITIAL_COLLABORATORS);
    setSales(INITIAL_SALES);
    setCashFlow(INITIAL_CASH_FLOW);
    setAdmins(INITIAL_ADMINS);
  };

  // Computed KPIs
  const stats = useMemo(() => {
    const totalRevenue = cashFlow
      .filter(item => item.type === 'receita')
      .reduce((sum, item) => sum + item.amount, 0);

    const totalCosts = cashFlow
      .filter(item => item.type === 'despesa')
      .reduce((sum, item) => sum + item.amount, 0);

    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const activeProductionCount = sales.filter(s => s.status !== 'concluido' && s.status !== 'orcamento').length;
    const scheduledMontagensCount = sales.filter(s => s.status === 'montagem_local' || s.status === 'transporte').length;
    const completedCount = sales.filter(s => s.status === 'concluido').length;

    return {
      totalRevenue,
      totalCosts,
      netProfit,
      profitMargin,
      activeProductionCount,
      scheduledMontagensCount,
      completedCount,
      totalCollaborators: collaborators.length
    };
  }, [cashFlow, sales, collaborators]);

  return (
    <ModBoxContext.Provider value={{
      role,
      setRole,
      activeCollaboratorId,
      setActiveCollaboratorId,
      activeAdminId,
      setActiveAdminId,
      admins,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      containers,
      addContainer,
      updateContainer,
      deleteContainer,
      collaborators,
      addCollaborator,
      updateCollaborator,
      deleteCollaborator,
      sales,
      addSale,
      updateSale,
      updateSaleStatus,
      toggleChecklistItem,
      addNoteToSale,
      deleteSale,
      cashFlow,
      addCashFlowEntry,
      deleteCashFlowEntry,
      resetToDemoData,
      authenticateCollaborator,
      changeCollaboratorPin,
      authenticateAdmin,
      changeAdminPin,
      stats
    }}>
      {children}
    </ModBoxContext.Provider>
  );
};

export const useModBox = () => {
  const context = useContext(ModBoxContext);
  if (!context) {
    throw new Error('useModBox must be used within a ModBoxProvider');
  }
  return context;
};
