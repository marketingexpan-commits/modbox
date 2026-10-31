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
import { ContainerModel, ContainerCategory } from '../../types';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContainer, setEditingContainer] = useState<ContainerModel | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ContainerCategory>('escritorio');
  const [length, setLength] = useState<number>(6.05);
  const [width, setWidth] = useState<number>(2.44);
  const [height, setHeight] = useState<number>(2.59);
  const [baseCost, setBaseCost] = useState<number>(25000);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(45000);
  const [productionDays, setProductionDays] = useState<number>(15);
  const [description, setDescription] = useState('');
  
  // Specs Form
  const [insulation, setInsulation] = useState('EPS termoacústico 50mm antichamas');
  const [lining, setLining] = useState('Drywall acústico ou PVC especial');
  const [floor, setFloor] = useState('Compensado naval 18mm com piso vinílico');
  const [doors, setDoors] = useState('01 Porta blindex temperado ou pivotante');
  const [windows, setWindows] = useState('02 Janelas de correr com proteção UV');
  const [electrical, setElectrical] = useState('Quadro de disjuntores, 6 tomadas, iluminação LED');
  const [plumbing, setPlumbing] = useState('Ponto para lavabo com pia e vaso');
  const [externalFinish, setExternalFinish] = useState('Pintura naval preto fosco com detalhes dourados');

  const openNewModal = () => {
    setEditingContainer(null);
    setName('');
    setCode(`MBX-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('escritorio');
    setLength(6.05);
    setWidth(2.44);
    setHeight(2.59);
    setBaseCost(28000);
    setSuggestedPrice(47000);
    setProductionDays(18);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: ContainerModel) => {
    setEditingContainer(c);
    setName(c.name);
    setCode(c.code);
    setCategory(c.category);
    setLength(c.dimensions.length);
    setWidth(c.dimensions.width);
    setHeight(c.dimensions.height);
    setBaseCost(c.baseCost);
    setSuggestedPrice(c.suggestedPrice);
    setProductionDays(c.productionDaysEstimate);
    setDescription(c.description);
    setInsulation(c.specs.insulation);
    setLining(c.specs.lining);
    setFloor(c.specs.floor);
    setDoors(c.specs.doors);
    setWindows(c.specs.windows);
    setElectrical(c.specs.electrical);
    setPlumbing(c.specs.plumbing);
    setExternalFinish(c.specs.externalFinish);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const areaM2 = Number((length * width).toFixed(2));
    const volumeM3 = Number((length * width * height).toFixed(2));

    const containerData: Omit<ContainerModel, 'id'> = {
      name,
      code,
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
      specs: {
        insulation,
        lining,
        floor,
        doors,
        windows,
        electrical,
        plumbing,
        externalFinish
      }
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
    const matchesCategory = selectedCategory === 'todos' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            Cadastre as medidas exatas, especificações técnicas e custos dos contêineres.
          </p>
        </div>

                {!readOnly && (
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Cadastrar Novo Contêiner</span>
        </button>
                )}
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
                      title="Editar Contêiner"
                      className="p-2 text-gray-400 hover:text-gold-400 hover:bg-dark-750 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir o contêiner ${container.name}?`)) {
                          deleteContainer(container.id);
                        }
                      }}
                      title="Excluir Contêiner"
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
                    category={container.category}
                    doors={container.specs.doors}
                    windows={container.specs.windows}
                  />

                  <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                    {container.description}
                  </p>

                  {/* Technical Specs List */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Isolamento Termoacústico</span>
                      <span className="text-gray-200 mt-0.5 block">{container.specs.insulation}</span>
                    </div>
                    <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Forro & Revestimento</span>
                      <span className="text-gray-200 mt-0.5 block">{container.specs.lining}</span>
                    </div>
                    <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Portas & Janelas</span>
                      <span className="text-gray-200 mt-0.5 block">{container.specs.doors}</span>
                    </div>
                    <div className="bg-dark-900 p-2.5 rounded-xl border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase font-semibold">Instalações</span>
                      <span className="text-gray-200 mt-0.5 block">{container.specs.electrical}</span>
                    </div>
                  </div>
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
        title={editingContainer ? 'Editar Modelo de Contêiner' : 'Cadastrar Novo Modelo de Contêiner'}
        subtitle="Informe as dimensões precisas e os acabamentos industriais do produto"
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Basic Data */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
              1. Identificação do Modelo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-300 block mb-1">Nome do Produto / Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ModBox Office Executive 20ft"
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
                  placeholder="Ex: MBX-OFF-20"
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
                  <option value="especial">Especial / Duplex / Sob Medida</option>
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
                <label className="text-xs text-gray-300 block mb-1">Comprimento (m) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">Padrão 20ft: 6.05m | 40ft: 12.19m</span>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Largura (m) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={width}
                  onChange={e => setWidth(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">Padrão naval: 2.44m</span>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Altura (m) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-gold-500"
                />
                <span className="text-[10px] text-gray-500 mt-0.5 block">Standard: 2.59m | High Cube: 2.89m</span>
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

          {/* Section: Technical Specs */}
          <div className="pt-3 border-t border-white/5">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
              3. Especificações Técnicas de Construção
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Isolamento Termoacústico</label>
                <input
                  type="text"
                  value={insulation}
                  onChange={e => setInsulation(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Forro e Revestimento Interno</label>
                <input
                  type="text"
                  value={lining}
                  onChange={e => setLining(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Portas</label>
                <input
                  type="text"
                  value={doors}
                  onChange={e => setDoors(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Janelas e Esquadrias</label>
                <input
                  type="text"
                  value={windows}
                  onChange={e => setWindows(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Instalações Elétricas</label>
                <input
                  type="text"
                  value={electrical}
                  onChange={e => setElectrical(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Acabamento Externo & Pintura</label>
                <input
                  type="text"
                  value={externalFinish}
                  onChange={e => setExternalFinish(e.target.value)}
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
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
              placeholder="Descreva a aplicação ideal deste contêiner..."
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
              <span>{editingContainer ? 'Salvar Alterações' : 'Cadastrar Contêiner'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

