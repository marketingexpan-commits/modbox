import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  AppRole, 
  ContainerModel, 
  Collaborator, 
  SaleOrder, 
  CashFlowEntry, 
  ProductionStatus,
  OperationalNote,
  AdminUser,
  ProjectExpense,
  ProjectPhoto
} from '../types';
import { 
  INITIAL_CONTAINERS, 
  INITIAL_COLLABORATORS, 
  INITIAL_SALES, 
  INITIAL_CASH_FLOW,
  INITIAL_ADMINS
} from '../data/mockData';
import {
  subscribeToCollection,
  setFirestoreDoc,
  deleteFirestoreDoc
} from '../services/firestoreSync';

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
  addProjectExpense: (saleId: string, expense: Omit<ProjectExpense, 'id'>) => void;
  deleteProjectExpense: (saleId: string, expenseId: string) => void;
  addProjectPhoto: (saleId: string, photo: Omit<ProjectPhoto, 'id'>) => void;
  deleteProjectPhoto: (saleId: string, photoId: string, storagePath: string) => void;

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
const SESSION_STORAGE_KEY = 'modbox_auth_session_v1';
const DEFAULT_PIN = '123456';
const DEFAULT_ADMIN_PIN = '000000';
const onlyDigits = (v: string) => v.replace(/\D/g, '');

const getSavedSession = () => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.loggedIn) {
        return parsed;
      }
    }
  } catch {}
  return null;
};

const ModBoxContext = createContext<ModBoxContextType | undefined>(undefined);

export const ModBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSession = getSavedSession();
  const [role, setRole] = useState<AppRole>(() => (initialSession?.role === 'colaborador' ? 'colaborador' : 'admin'));
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string | null>(() => (initialSession?.role === 'colaborador' ? initialSession?.userId || 'col-01' : 'col-01'));
  const [activeAdminId, setActiveAdminId] = useState<string | null>(() => (initialSession?.role === 'admin' ? initialSession?.userId || 'adm-01' : 'adm-01'));

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admins`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
      if (saved) {
        const parsed: ContainerModel[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const withType = parsed.map(c => ({
            ...c,
            productType: c.productType || 'modular'
          }));
          const hasCobertura = withType.some(c => c.productType === 'cobertura_metalica');
          const hasEstrutura = withType.some(c => c.productType === 'estrutura_metalica');
          if (!hasCobertura || !hasEstrutura) {
            const missing = INITIAL_CONTAINERS.filter(ic => !withType.some(c => c.id === ic.id));
            return [...withType, ...missing];
          }
          return withType;
        }
      }
      return INITIAL_CONTAINERS;
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

  // Real-time synchronization with Firestore
  useEffect(() => {
    const unsubAdmins = subscribeToCollection<AdminUser>('admins', setAdmins, INITIAL_ADMINS);
    const unsubContainers = subscribeToCollection<ContainerModel>('containers', setContainers, INITIAL_CONTAINERS);
    const unsubCollaborators = subscribeToCollection<Collaborator>('collaborators', setCollaborators, INITIAL_COLLABORATORS);
    const unsubSales = subscribeToCollection<SaleOrder>('sales', setSales, INITIAL_SALES);
    const unsubCashFlow = subscribeToCollection<CashFlowEntry>('cashflow', setCashFlow, INITIAL_CASH_FLOW);

    return () => {
      unsubAdmins();
      unsubContainers();
      unsubCollaborators();
      unsubSales();
      unsubCashFlow();
    };
  }, []);

  // Containers actions
  const addContainer = (data: Omit<ContainerModel, 'id'>) => {
    const newContainer: ContainerModel = {
      ...data,
      id: `cnt-${Date.now()}`
    };
    setContainers(prev => [newContainer, ...prev]);
    setFirestoreDoc('containers', newContainer);
  };

  const updateContainer = (id: string, data: Partial<ContainerModel>) => {
    setContainers(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...data } : c);
      const target = updated.find(c => c.id === id);
      if (target) setFirestoreDoc('containers', target);
      return updated;
    });
  };

  const deleteContainer = (id: string) => {
    setContainers(prev => prev.filter(c => c.id !== id));
    deleteFirestoreDoc('containers', id);
  };

  // Collaborators actions
  const addCollaborator = (data: Omit<Collaborator, 'id'>) => {
    const newCollab: Collaborator = {
      ...data,
      id: `col-${Date.now()}`
    };
    setCollaborators(prev => [newCollab, ...prev]);
    setFirestoreDoc('collaborators', newCollab);
  };

  const updateCollaborator = (id: string, data: Partial<Collaborator>) => {
    setCollaborators(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...data } : c);
      const target = updated.find(c => c.id === id);
      if (target) setFirestoreDoc('collaborators', target);
      return updated;
    });
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
    deleteFirestoreDoc('collaborators', id);
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
    setCollaborators(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, pin: newPin, mustChangePin: false } : c);
      const target = updated.find(c => c.id === id);
      if (target) setFirestoreDoc('collaborators', target);
      return updated;
    });
  };

  // Admin actions
  const addAdmin = (data: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newAdmin: AdminUser = {
      ...data,
      id: `adm-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdmins(prev => [...prev, newAdmin]);
    setFirestoreDoc('admins', newAdmin);
  };

  const updateAdmin = (id: string, data: Partial<AdminUser>) => {
    setAdmins(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...data } : a);
      const target = updated.find(a => a.id === id);
      if (target) setFirestoreDoc('admins', target);
      return updated;
    });
  };

  const deleteAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    deleteFirestoreDoc('admins', id);
  };

  const authenticateAdmin = (adminId: string, pin: string): AdminUser | null => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return null;
    if (admin.pin !== pin) return null;
    return admin;
  };

  const changeAdminPin = (adminId: string, newPin: string) => {
    setAdmins(prev => {
      const updated = prev.map(a => a.id === adminId ? { ...a, pin: newPin } : a);
      const target = updated.find(a => a.id === adminId);
      if (target) setFirestoreDoc('admins', target);
      return updated;
    });
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
    setFirestoreDoc('sales', newSale);

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
      setFirestoreDoc('cashflow', cfEntry);
    }
  };

  const updateSale = (id: string, data: Partial<SaleOrder>) => {
    setSales(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...data } : s);
      const target = updated.find(s => s.id === id);
      if (target) setFirestoreDoc('sales', target);
      return updated;
    });
  };

  const updateSaleStatus = (id: string, status: ProductionStatus) => {
    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          if (status === 'concluido' && s.status !== 'concluido') {
            setCollaborators(cols => {
              const updatedCols = cols.map(c => {
                if (s.assignedCollaboratorIds.includes(c.id)) {
                  const uc: Collaborator = { ...c, completedInstallations: c.completedInstallations + 1, status: 'disponivel' };
                  setFirestoreDoc('collaborators', uc);
                  return uc;
                }
                return c;
              });
              return updatedCols;
            });
          }
          const us = { ...s, status };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
  };

  const toggleChecklistItem = (saleId: string, itemKey: string) => {
    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          const currentChecklist = s.checklist || {};
          const us = {
            ...s,
            checklist: {
              ...currentChecklist,
              [itemKey]: !currentChecklist[itemKey]
            }
          };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
  };

  const addNoteToSale = (saleId: string, noteText: string, authorName: string) => {
    const newNote: OperationalNote = {
      id: `note-${Date.now()}`,
      author: authorName,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      text: noteText
    };
    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          const us = {
            ...s,
            notes: [newNote, ...(s.notes || [])]
          };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
    deleteFirestoreDoc('sales', id);
  };

  // Centro de Custos por Obra / Pedido
  const addProjectExpense = (saleId: string, expenseData: Omit<ProjectExpense, 'id'>) => {
    const targetSale = sales.find(s => s.id === saleId);
    if (!targetSale) return;

    const expenseId = `exp-${Date.now()}`;
    const cfId = `cf-exp-${Date.now()}`;

    // 1. Gera lançamento automático no Fluxo de Caixa da ModBox
    const cfEntry: CashFlowEntry = {
      id: cfId,
      type: 'despesa',
      category: expenseData.category,
      amount: Number(expenseData.amount),
      description: `[Obra: ${targetSale.client.name}] ${expenseData.description}`,
      clientOrSupplier: targetSale.client.name,
      date: expenseData.date,
      saleOrderId: targetSale.id
    };

    setCashFlow(prev => [cfEntry, ...prev]);
    setFirestoreDoc('cashflow', cfEntry);

    // 2. Vincula a despesa à Obra / Pedido
    const newExpense: ProjectExpense = {
      ...expenseData,
      amount: Number(expenseData.amount),
      id: expenseId,
      cashFlowEntryId: cfId
    };

    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          const us = {
            ...s,
            expenses: [newExpense, ...(s.expenses || [])]
          };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
  };

  const deleteProjectExpense = (saleId: string, expenseId: string) => {
    const targetSale = sales.find(s => s.id === saleId);
    if (!targetSale) return;

    const expenseToDelete = (targetSale.expenses || []).find(e => e.id === expenseId);
    if (expenseToDelete?.cashFlowEntryId) {
      setCashFlow(prev => prev.filter(c => c.id !== expenseToDelete.cashFlowEntryId));
      deleteFirestoreDoc('cashflow', expenseToDelete.cashFlowEntryId);
    }

    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          const us = {
            ...s,
            expenses: (s.expenses || []).filter(e => e.id !== expenseId)
          };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
  };

  // Cashflow actions
  const addCashFlowEntry = (entry: Omit<CashFlowEntry, 'id'>) => {
    const newEntry: CashFlowEntry = {
      ...entry,
      id: `cf-${Date.now()}`
    };
    setCashFlow(prev => [newEntry, ...prev]);
    setFirestoreDoc('cashflow', newEntry);
  };

  const deleteCashFlowEntry = (id: string) => {
    setCashFlow(prev => prev.filter(c => c.id !== id));
    deleteFirestoreDoc('cashflow', id);
  };

  // Project Photos actions
  const addProjectPhoto = (saleId: string, photoData: Omit<ProjectPhoto, 'id'>) => {
    const newPhoto: ProjectPhoto = { ...photoData, id: `photo-${Date.now()}` };
    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          const us = { ...s, photos: [newPhoto, ...(s.photos || [])] };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
  };

  const deleteProjectPhoto = (saleId: string, photoId: string, storagePath: string) => {
    setSales(prev => {
      const updated = prev.map(s => {
        if (s.id === saleId) {
          const us = { ...s, photos: (s.photos || []).filter(p => p.id !== photoId) };
          setFirestoreDoc('sales', us);
          return us;
        }
        return s;
      });
      return updated;
    });
    // Fire-and-forget Storage deletion
    import('../services/firebaseStorage').then(({ deleteStoragePhoto }) => {
      deleteStoragePhoto(storagePath).catch(console.warn);
    });
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
      addProjectExpense,
      deleteProjectExpense,
      addProjectPhoto,
      deleteProjectPhoto,
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
