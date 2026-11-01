import React, { useState } from 'react';
import { 
  Box, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  Info, 
  Layers, 
  Maximize2,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useModBox } from '../../context/ModBoxContext';
import { ContainerModel, ContainerCategory, ProductType, ContainerSpecs } from '../../types';
import { Container3DPreview } from '../common/Container3DPreview';
import { Modal } from '../common/Modal';

interface ContainersManagerProps {
  isModalOpen?: boolean;
  setIsModalOpen?: (open: boolean) => void;
  /** Employee view: hides costs, prices, margins and edit/delete/create actions. */
  readOnly?: boolean;
}

export const ContainersManager: React.FC<ContainersManagerProps> = ({ readOnly = false }) => {
  const { containers, addContainer, updateContainer, deleteContainer } = useModBox();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<string>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<ContainerModel | null>(null);

  // Form State - Dados Básicos
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [productType, setProductType] = useState<ProductType>('modular');
  const [category, setCategory] = useState<ContainerCategory>('escritorio');
  const [length, setLength] = useState<number>(6.05);
  const [width, setWidth] = useState<number>(2.44);
  const [height, setHeight] = useState<number>(2.59);
  const [baseCost, setBaseCost] = useState<number>(28000);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(47000);
  const [productionDays, setProductionDays] = useState<number>(18);
  const [description, setDescription] = useState('');
  
  // Specs Form - 1. MODULAR (Contêineres)
  const [insulation, setInsulation] = useState('');
  const [lining, setLining] = useState('Drywall acústico ou PVC especial');
  const [floor, setFloor] = useState('Piso vinílico de alta resistência');
  const [doors, setDoors] = useState('01 Porta blindex temperado ou pivotante');
  const [windows, setWindows] = useState('02 Janelas de correr com proteção UV');
  const [electrical, setElectrical] = useState('Quadro de disjuntores, 6 tomadas, iluminação LED');
  const [plumbing, setPlumbing] = useState('Ponto para lavabo com pia e vaso');
  const [externalFinish, setExternalFinish] = useState('Pintura industrial preto fosco com detalhes dourados');

  // Specs Form - 2. COBERTURA METÁLICA
  const [roofTileType, setRoofTileType] = useState('Telha termoacústica sanduíche PIR/EPS 30mm trapézio');
  const [trussStructure, setTrussStructure] = useState('Treliça metálica estrutural em duas águas perfil Ue');
  const [columnsSupport, setColumnsSupport] = useState('Pilares tubulares/perfil W com sapatas chumbadas ao solo');
  const [drainageGutters, setDrainageGutters] = useState('Calhas galvanizadas corte 33 com rufos e descidas pluviais');
  const [roofPainting, setRoofPainting] = useState('Galvanização a quente + esmalte sintético anticorrosivo');
  const [clearSpan, setClearSpan] = useState('Vão livre total com telhas translúcidas em policarbonato');

  // Specs Form - 3. ESTRUTURA METÁLICA EM GERAL / SERRALHERIA
  const [structureType, setStructureType] = useState('Portão basculante industrial articulado');
  const [steelPlates, setSteelPlates] = useState('Chapa lambril búzios galvanizada cal. 18');
  const [metalProfiles, setMetalProfiles] = useState('Tubos quadrados 80x80mm com reforço interno cruzado');
  const [hardwareMechanism, setHardwareMechanism] = useState('Caixa de contrapeso embutida com cabo de aço duplo');
  const [steelFinish, setSteelFinish] = useState('Fundo convertedor de ferrugem + pintura eletrostática preta');
  const [anchoringAssembly, setAnchoringAssembly] = useState('Chumbadores químicos parabolt de alta resistência');

  const openNewModal = () => {
    setEditingContainer(null);
    setName('');
    setCode(`MBX-${Math.floor(100 + Math.random() * 900)}`);
    setProductType('modular');
    setCategory('escritorio');
    setLength(6.05);
    setWidth(2.44);
    setHeight(2.59);
    setBaseCost(28000);
    setSuggestedPrice(47000);
    setProductionDays(18);
    setDescription('');
    // Reset Modular
    setInsulation('');
    setLining('Drywall acústico ou PVC especial');
    setFloor('Piso vinílico de alta resistência');
    setDoors('01 Porta blindex temperado ou pivotante');
    setWindows('02 Janelas de correr com proteção UV');
    setElectrical('Quadro de disjuntores, 6 tomadas, iluminação LED');
    setPlumbing('Ponto para lavabo com pia e vaso');
    setExternalFinish('Pintura industrial preto fosco com detalhes dourados');
    // Reset Cobertura
    setRoofTileType('Telha termoacústica sanduíche PIR/EPS 30mm trapézio');
    setTrussStructure('Treliça metálica estrutural em duas águas perfil Ue');
    setColumnsSupport('Pilares tubulares/perfil W com sapatas chumbadas ao solo');
    setDrainageGutters('Calhas galvanizadas corte 33 com rufos e descidas pluviais');
    setRoofPainting('Galvanização a quente + esmalte sintético anticorrosivo');
    setClearSpan('Vão livre total com telhas translúcidas em policarbonato');
    // Reset Estrutura
    setStructureType('Portão basculante industrial articulado');
    setSteelPlates('Chapa lambril búzios galvanizada cal. 18');
    setMetalProfiles('Tubos quadrados 80x80mm com reforço interno cruzado');
    setHardwareMechanism('Caixa de contrapeso embutida com cabo de aço duplo');
    setSteelFinish('Fundo convertedor de ferrugem + pintura eletrostática preta');
    setAnchoringAssembly('Chumbadores químicos parabolt de alta resistência');

    setIsModalOpen(true);
  };

  const handleProductTypeChange = (type: ProductType) => {
    setProductType(type);
    if (!editingContainer) {
      if (type === 'cobertura_metalica') {
        setLength(10.00);
        setWidth(6.00);
        setHeight(3.50);
        setBaseCost(22000);
        setSuggestedPrice(38500);
        setProductionDays(14);
      } else if (type === 'estrutura_metalica') {
        setLength(5.00);
        setWidth(0.20);
        setHeight(2.80);
        setBaseCost(6800);
        setSuggestedPrice(13500);
        setProductionDays(7);
      } else {
        setLength(6.05);
        setWidth(2.44);
        setHeight(2.59);
        setBaseCost(28000);
        setSuggestedPrice(47000);
        setProductionDays(18);
      }
    }
  };

  const openEditModal = (c: ContainerModel) => {
    setEditingContainer(c);
    setName(c.name);
    setCode(c.code);
    const pType = (c.productType || 'modular') as ProductType;
    setProductType(pType);
    setCategory(c.category);
    setLength(c.dimensions.length);
    setWidth(c.dimensions.width);
    setHeight(c.dimensions.height);
    setBaseCost(c.baseCost);
    setSuggestedPrice(c.suggestedPrice);
    setProductionDays(c.productionDaysEstimate);
    setDescription(c.description);

    // Carrega dados de Modular
    setInsulation(c.specs.insulation || '');
    setLining(c.specs.lining || '');
    setFloor(c.specs.floor || '');
    setDoors(c.specs.doors || '');
    setWindows(c.specs.windows || '');
    setElectrical(c.specs.electrical || '');
    setPlumbing(c.specs.plumbing || '');
    setExternalFinish(c.specs.externalFinish || '');

    // Carrega dados de Cobertura
    setRoofTileType(c.specs.roofTileType || (pType === 'cobertura_metalica' ? c.specs.insulation : '') || 'Telha termoacústica sanduíche PIR/EPS 30mm trapézio');
    setTrussStructure(c.specs.trussStructure || (pType === 'cobertura_metalica' ? c.specs.lining : '') || 'Treliça metálica estrutural em duas águas perfil Ue');
    setColumnsSupport(c.specs.columnsSupport || (pType === 'cobertura_metalica' ? c.specs.floor : '') || 'Pilares tubulares/perfil W com sapatas chumbadas ao solo');
    setDrainageGutters(c.specs.drainageGutters || (pType === 'cobertura_metalica' ? c.specs.plumbing : '') || 'Calhas galvanizadas corte 33 com rufos e descidas pluviais');
    setRoofPainting(c.specs.roofPainting || (pType === 'cobertura_metalica' ? c.specs.externalFinish : '') || 'Galvanização a quente + esmalte sintético anticorrosivo');
    setClearSpan(c.specs.clearSpan || 'Vão livre total com telhas translúcidas em policarbonato');

    // Carrega dados de Estrutura
    setStructureType(c.specs.structureType || 'Portão basculante industrial articulado');
    setSteelPlates(c.specs.steelPlates || (pType === 'estrutura_metalica' ? c.specs.insulation : '') || 'Chapa lambril búzios galvanizada cal. 18');
    setMetalProfiles(c.specs.metalProfiles || (pType === 'estrutura_metalica' ? c.specs.lining : '') || 'Tubos quadrados 80x80mm com reforço interno cruzado');
    setHardwareMechanism(c.specs.hardwareMechanism || (pType === 'estrutura_metalica' ? c.specs.doors : '') || 'Caixa de contrapeso embutida com cabo de aço duplo');
    setSteelFinish(c.specs.steelFinish || (pType === 'estrutura_metalica' ? c.specs.externalFinish : '') || 'Fundo convertedor de ferrugem + pintura eletrostática preta');
    setAnchoringAssembly(c.specs.anchoringAssembly || 'Chumbadores químicos parabolt de alta resistência');

    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areaM2 = Number((length * width).toFixed(2));
    const volumeM3 = Number((length * width * height).toFixed(2));

    // Monta specs exclusivas de acordo com a frente escolhida
    const specs: ContainerSpecs = productType === 'cobertura_metalica' ? {
      roofTileType,
      trussStructure,
      columnsSupport,
      drainageGutters,
      roofPainting,
      clearSpan
    } : productType === 'estrutura_metalica' ? {
      structureType,
      steelPlates,
      metalProfiles,
      hardwareMechanism,
      steelFinish,
      anchoringAssembly
    } : {
      insulation,
      lining,
      floor,
      doors,
      windows,
      electrical,
      plumbing,
      externalFinish
    };

    const containerData: Omit<ContainerModel, 'id'> = {
      name,
      code,
      productType,
      category,
      dimensions: {
        length: Number(length),
        width: Number(width),
        height: Number(height)
      },
      areaM2,
      volumeM3,
      baseCost: Number(baseCost),
      suggestedPrice: Number(suggestedPrice),
      productionDaysEstimate: Number(productionDays),
      description,
      specs
    };

    if (editingContainer) {
      updateContainer(editingContainer.id, containerData);
    } else {
      addContainer(containerData);
    }
    setIsModalOpen(false);
  };

  const filteredContainers = containers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProductType = selectedProductType === 'todos' || (c.productType || 'modular') === selectedProductType;
    const matchesCategory = selectedCategory === 'todos' || c.category === selectedCategory;
    return matchesSearch && matchesProductType && matchesCategory;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-4 sm:p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white">Modelos e Dimensões</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Cadastre as medidas exatas, especificações técnicas e custos dos produtos.
          </p>
        </div>

        {!readOnly && (
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Cadastrar Novo Produto</span>
          </button>
        )}
      </div>

      {/* Product Type Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'todos', label: 'Todos os Produtos', icon: '📦' },
          { id: 'modular', label: 'Modular', icon: '🏗️' },
          { id: 'cobertura_metalica', label: 'Cobertura Metálica', icon: '🔩' },
          { id: 'estrutura_metalica', label: 'Estrutura Metálica em Geral', icon: '⚙️' },
        ].map(pt => (
          <button
            key={pt.id}
            onClick={() => setSelectedProductType(pt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedProductType === pt.id ? 'bg-gold-500 text-black font-bold' : 'bg-dark-850 text-gray-400 hover:text-white border border-white/5'}`}
          >
            <span>{pt.icon}</span>
            <span>{pt.label}</span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar modelo, código ou dimensão..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-dark-850 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'escritorio', label: 'Escritórios' },
            { id: 'habitacional', label: 'Habitacional' },
            { id: 'comercial', label: 'Comercial/Gourmet' },
            { id: 'almoxarifado', label: 'Almoxarifado' },
            { id: 'especial', label: 'Especiais/Duplex' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gold-500 text-black font-bold'
                  : 'bg-dark-850 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Containers Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredContainers.map(container => {
          const margin = container.suggestedPrice > 0 
            ? ((container.suggestedPrice - container.baseCost) / container.suggestedPrice) * 100 
            : 0;

          const pType = container.productType || 'modular';

          return (
            <div
              key={container.id}
              className="bg-dark-850 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with Title and Actions */}
                <div className="p-5 border-b border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                        {container.code}
                      </span>
                      {(pType === 'modular') && (<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Modular</span>)}
                      {(pType === 'cobertura_metalica') && (<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Cobertura Metálica</span>)}
                      {(pType === 'estrutura_metalica') && (<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">Estrutura Metálica</span>)}
                      {container.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {container.badge}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 capitalize">
                        • {container.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{container.name}</h3>
                  </div>

                  {!readOnly && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(container)}
                        title="Editar Produto"
                        className="p-2 text-gray-400 hover:text-gold-400 hover:bg-dark-750 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja excluir o produto ${container.name}?`)) {
                            deleteContainer(container.id);
                          }
                        }}
                        title="Excluir Produto"
                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-dark-750 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 3D / Isometric Container Visualizer */}
                <div className="p-5">
                  <Container3DPreview
                    dimensions={container.dimensions}
                    name={container.name}
                    productType={container.productType}
                    category={container.category}
                    doors={container.specs.doors}
                    windows={container.specs.windows}
                  />

                  <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                    {container.description}
                  </p>

                  {/* Technical Specs List - Exibição Dinâmica e Específica por Frente */}
                  {pType === 'cobertura_metalica' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Telhas & Cobertura</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.roofTileType || container.specs.insulation || 'Telha termoacústica / galvalume'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tesouras & Treliças</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.trussStructure || container.specs.lining || 'Treliça metálica estrutural'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Pilares & Sustentação</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.columnsSupport || container.specs.floor || 'Pilares metálicos com sapatas chumbadas'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Calhas & Escoamento</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.drainageGutters || container.specs.plumbing || 'Calhas e rufos galvanizados'}</span>
                      </div>
                    </div>
                  )}

                  {pType === 'estrutura_metalica' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Tipo de Estrutura</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.structureType || 'Portão / Mezanino / Serralheria'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Chapas & Fechamento</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.steelPlates || container.specs.insulation || 'Chapa lambril / xadrez reforçada'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Perfis & Vigamento</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.metalProfiles || container.specs.lining || 'Tubos quadrados e perfis laminados'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Ferragens & Mecanismos</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.hardwareMechanism || container.specs.doors || 'Contrapeso embutido e guias'}</span>
                      </div>
                    </div>
                  )}

                  {pType === 'modular' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Piso & Base</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.floor || 'Piso vinílico de alta resistência'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Forro & Revestimento</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.lining || '—'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Portas & Janelas</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.doors || container.specs.windows || '—'}</span>
                      </div>
                      <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase font-semibold">Instalações</span>
                        <span className="text-gray-200 mt-0.5 block">{container.specs.electrical || '—'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Financial Bar */}
              <div className="bg-dark-900 p-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                {!readOnly && (
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase block">Custo de Fabricação</span>
                      <span className="font-mono text-gray-300 font-bold">{formatCurrency(container.baseCost)}</span>
                    </div>
                    <div>
                      <span className="text-gold-400 text-[10px] uppercase block font-semibold">Preço Sugerido</span>
                      <span className="font-mono text-gold-400 font-extrabold text-sm">{formatCurrency(container.suggestedPrice)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {!readOnly && (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      {margin.toFixed(0)}% Margem Bruta
                    </span>
                  )}
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>~{container.productionDaysEstimate} dias produção</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Container */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContainer ? 'Editar Modelo de Produto' : 'Cadastrar Novo Modelo de Produto'}
        subtitle="Informe as dimensões precisas e as especificações técnicas da frente selecionada"
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Basic Data */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
              1. Identificação do Modelo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tipo de Produto - seletor destacado */}
              <div className="sm:col-span-3">
                <label className="text-xs text-gray-300 block mb-1">Frente de Atuação / Tipo de Produto *</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: 'modular', label: 'Modular', desc: 'Kitnet, escritório, banheiro...' },
                    { id: 'cobertura_metalica', label: 'Cobertura Metálica', desc: 'Galpões, garagens, quadras...' },
                    { id: 'estrutura_metalica', label: 'Estrutura Metálica em Geral', desc: 'Portões, mezaninos, ferragens...' },
                  ] as { id: ProductType; label: string; desc: string }[]).map(pt => (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => handleProductTypeChange(pt.id)}
                      className={`flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border text-left transition-all ${productType === pt.id ? 'bg-gold-500/15 border-gold-500/60 text-gold-300' : 'bg-dark-900 border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      <span className="text-xs font-bold block">{pt.label}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{pt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-gray-300 block mb-1">Nome do Produto / Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    productType === 'cobertura_metalica'
                      ? 'Ex: ModBox Cobertura Duas Águas Galvanizada'
                      : productType === 'estrutura_metalica'
                      ? 'Ex: ModBox Portão Basculante Industrial'
                      : 'Ex: ModBox Office Executive 20ft'
                  }
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Código do Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    productType === 'cobertura_metalica'
                      ? 'Ex: MBX-COB-01'
                      : productType === 'estrutura_metalica'
                      ? 'Ex: MBX-EST-01'
                      : 'Ex: MBX-OFF-20'
                  }
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white uppercase font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Categoria *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ContainerCategory)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option value="escritorio">Escritório Corporativo</option>
                  <option value="habitacional">Habitacional / Residencial</option>
                  <option value="comercial">Comercial / Gourmet</option>
                  <option value="almoxarifado">Almoxarifado & Canteiro</option>
                  <option value="especial">Especial / Sob Medida</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Prazo de Produção (Dias) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={productionDays}
                  onChange={e => setProductionDays(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Dimensions */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
              2. Dimensões Físicas (Metros)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  {productType === 'cobertura_metalica' ? 'Comprimento (m) *' : productType === 'estrutura_metalica' ? 'Comprimento / Vão (m) *' : 'Comprimento (m) *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {productType === 'cobertura_metalica'
                    ? 'Extensão longitudinal da cobertura'
                    : productType === 'estrutura_metalica'
                    ? 'Largura do portão ou vão estrutural'
                    : 'Padrão 20ft: 6.05m | 40ft: 12.19m'}
                </span>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  {productType === 'cobertura_metalica' ? 'Largura / Vão Livre (m) *' : productType === 'estrutura_metalica' ? 'Espessura / Profundidade (m) *' : 'Largura (m) *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={width}
                  onChange={e => setWidth(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {productType === 'cobertura_metalica'
                    ? 'Vão livre entre pilares (ex: 6.00m)'
                    : productType === 'estrutura_metalica'
                    ? 'Profundidade do perfil ou contrapeso'
                    : 'Largura padrão: 2.44m'}
                </span>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  {productType === 'cobertura_metalica' ? 'Altura / Pé-Direito (m) *' : 'Altura (m) *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">
                  {productType === 'cobertura_metalica'
                    ? 'Pé-direito livre útil (ex: 3.50m ou 4.50m)'
                    : productType === 'estrutura_metalica'
                    ? 'Altura útil do portão ou mezanino'
                    : 'Standard: 2.59m | High Cube: 2.89m'}
                </span>
              </div>
            </div>

            {/* Calculated Area and Volume indicators */}
            <div className="grid grid-cols-2 gap-3 mt-3 bg-dark-850 p-3 rounded-xl border border-gold-500/20">
              <div className="text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Área Útil Calculada</span>
                <span className="text-base font-bold text-gold-400 font-mono">
                  {(length * width).toFixed(2)} m²
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Volume Cúbico Calculado</span>
                <span className="text-base font-bold text-white font-mono">
                  {(length * width * height).toFixed(2)} m³
                </span>
              </div>
            </div>
          </div>

          {/* Section: Technical Specs - Renderização Condicional Específica por Frente */}
          <div className="pt-3 border-t border-white/5">
            {/* 1. SE MODULAR */}
            {productType === 'modular' && (
              <>
                <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" />
                  <span>3. Especificações Técnicas - Modular</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-300 block mb-1">Piso & Base</label>
                    <input
                      type="text"
                      value={floor}
                      onChange={e => setFloor(e.target.value)}
                      placeholder="Ex: Piso vinílico de alta resistência / porcelanato"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Forro e Revestimento Interno</label>
                    <input
                      type="text"
                      value={lining}
                      onChange={e => setLining(e.target.value)}
                      placeholder="Ex: Drywall acústico ou PVC especial"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>



                  <div>
                    <label className="text-gray-300 block mb-1">Portas</label>
                    <input
                      type="text"
                      value={doors}
                      onChange={e => setDoors(e.target.value)}
                      placeholder="Ex: 01 Porta blindex temperado ou pivotante"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Janelas e Esquadrias</label>
                    <input
                      type="text"
                      value={windows}
                      onChange={e => setWindows(e.target.value)}
                      placeholder="Ex: 02 Janelas de correr com proteção UV"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Instalações Elétricas</label>
                    <input
                      type="text"
                      value={electrical}
                      onChange={e => setElectrical(e.target.value)}
                      placeholder="Ex: Quadro disjuntores, 6 tomadas, iluminação LED"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Instalações Hidráulicas</label>
                    <input
                      type="text"
                      value={plumbing}
                      onChange={e => setPlumbing(e.target.value)}
                      placeholder="Ex: Ponto para lavabo com pia e vaso sanitário"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Acabamento Externo & Pintura</label>
                    <input
                      type="text"
                      value={externalFinish}
                      onChange={e => setExternalFinish(e.target.value)}
                      placeholder="Ex: Pintura industrial preto fosco com detalhes dourados"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 2. SE COBERTURA METÁLICA */}
            {productType === 'cobertura_metalica' && (
              <>
                <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-cyan-400">🔩</span>
                  <span>3. Especificações Técnicas - Cobertura Metálica</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-300 block mb-1">Tipo de Telha / Cobertura *</label>
                    <input
                      type="text"
                      value={roofTileType}
                      onChange={e => setRoofTileType(e.target.value)}
                      placeholder="Ex: Telha sanduíche termoacústica PIR/EPS 30mm trapézio"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Tesoura & Treliças Estruturais *</label>
                    <input
                      type="text"
                      value={trussStructure}
                      onChange={e => setTrussStructure(e.target.value)}
                      placeholder="Ex: Treliça duas águas em perfil Ue com contraventamento"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Pilares & Sustentação *</label>
                    <input
                      type="text"
                      value={columnsSupport}
                      onChange={e => setColumnsSupport(e.target.value)}
                      placeholder="Ex: Pilares tubulares ou perfil W com sapatas chumbadas"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Calhas & Escoamento Pluvial *</label>
                    <input
                      type="text"
                      value={drainageGutters}
                      onChange={e => setDrainageGutters(e.target.value)}
                      placeholder="Ex: Calhas galvanizadas corte 33 com rufos e descidas pluviais"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Tratamento & Pintura Estrutural</label>
                    <input
                      type="text"
                      value={roofPainting}
                      onChange={e => setRoofPainting(e.target.value)}
                      placeholder="Ex: Galvanização a quente + esmalte sintético anticorrosivo"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Vão Livre & Iluminação Zenital</label>
                    <input
                      type="text"
                      value={clearSpan}
                      onChange={e => setClearSpan(e.target.value)}
                      placeholder="Ex: Vão livre total com telhas translúcidas em policarbonato"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 3. SE ESTRUTURA METÁLICA EM GERAL */}
            {productType === 'estrutura_metalica' && (
              <>
                <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="text-orange-400">⚙️</span>
                  <span>3. Especificações Técnicas - Estrutura Metálica & Serralheria</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-300 block mb-1">Tipo de Estrutura / Projeto *</label>
                    <input
                      type="text"
                      value={structureType}
                      onChange={e => setStructureType(e.target.value)}
                      placeholder="Ex: Portão basculante articulado, mezanino, gradil"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Chapas & Fechamento *</label>
                    <input
                      type="text"
                      value={steelPlates}
                      onChange={e => setSteelPlates(e.target.value)}
                      placeholder="Ex: Chapa lambril búzios galvanizada cal. 18"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Perfis Estruturais & Vigamento *</label>
                    <input
                      type="text"
                      value={metalProfiles}
                      onChange={e => setMetalProfiles(e.target.value)}
                      placeholder="Ex: Tubos quadrados 80x80mm com reforço interno cruzado"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Ferragens & Mecanismos *</label>
                    <input
                      type="text"
                      value={hardwareMechanism}
                      onChange={e => setHardwareMechanism(e.target.value)}
                      placeholder="Ex: Caixa de contrapeso embutida, braço basculante, fechadura tetra"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Acabamento & Tratamento</label>
                    <input
                      type="text"
                      value={steelFinish}
                      onChange={e => setSteelFinish(e.target.value)}
                      placeholder="Ex: Fundo convertedor de ferrugem + pintura eletrostática preta"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 block mb-1">Fixação & Montagem no Local</label>
                    <input
                      type="text"
                      value={anchoringAssembly}
                      onChange={e => setAnchoringAssembly(e.target.value)}
                      placeholder="Ex: Chumbadores químicos parabolt de alta resistência"
                      className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Section: Costs & Pricing */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
              4. Custos e Formação de Preço
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Custo Base de Produção (R$) *</label>
                <input
                  type="number"
                  required
                  value={baseCost}
                  onChange={e => setBaseCost(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-xs text-gold-400 font-semibold block mb-1">Preço Sugerido de Venda (R$) *</label>
                <input
                  type="number"
                  required
                  value={suggestedPrice}
                  onChange={e => setSuggestedPrice(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-gold-500/40 rounded-xl px-3 py-2 text-sm text-gold-300 font-mono focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Descrição Comercial</label>
            <textarea
              rows={2}
              placeholder={
                productType === 'cobertura_metalica'
                  ? 'Descreva a aplicação ideal desta cobertura (ex: galpão industrial, garagem, quadra, centro de distribuição)...'
                  : productType === 'estrutura_metalica'
                  ? 'Descreva a aplicação desta estrutura ou ferragem sob medida (ex: portão para condomínio, mezanino de galpão)...'
                  : 'Descreva a aplicação ideal deste módulo (ex: escritório corporativo, kitnet, consultório ou moradia compacta)...'
              }
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingContainer ? 'Salvar Alterações' : 'Cadastrar Produto'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
