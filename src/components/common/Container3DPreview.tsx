import React, { useState } from 'react';
import { Box, Construction, Hammer } from 'lucide-react';
import { ContainerDimensions, ProductType } from '../../types';

interface Container3DPreviewProps {
  dimensions: ContainerDimensions;
  name?: string;
  category?: string;
  productType?: ProductType;
  doors?: string;
  windows?: string;
  showDetails?: boolean;
}

export const Container3DPreview: React.FC<Container3DPreviewProps> = ({
  dimensions,
  name = 'Produto ModBox',
  category,
  productType = 'modular',
  showDetails = true
}) => {
  const [viewAngle, setViewAngle] = useState<'iso' | 'front' | 'side'>('iso');

  const { length, width, height } = dimensions;
  const area = (length * width).toFixed(2);

  const SOLID_GOLD = '#D4AF37';

  // Configuração de ícone e título por frente
  const typeConfig = {
    modular: {
      label: 'Modular',
      icon: Box,
      badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    },
    cobertura_metalica: {
      label: 'Cobertura Metálica',
      icon: Construction,
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    },
    estrutura_metalica: {
      label: 'Estrutura Metálica',
      icon: Hammer,
      badgeClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    }
  }[productType || 'modular'];

  const IconComponent = typeConfig.icon;

  return (
    <div className="bg-dark-900 border border-gold-500/30 rounded-2xl p-4 sm:p-5 overflow-hidden relative">
      {/* Top Controls: Info horizontal above buttons */}
      <div className="flex flex-col gap-3 mb-4 relative z-10">
        {/* Horizontal product info */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-gold-500/15 text-gold-500 border border-gold-500/30 shrink-0">
            <IconComponent className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">{name}</h4>
          
          <span className={`text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${typeConfig.badgeClass}`}>
            {typeConfig.label}
          </span>

          {category && (
            <span className="text-[11px] text-gold-500 font-mono uppercase tracking-wider bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
              Categoria: {category}
            </span>
          )}
        </div>

        {/* View switcher buttons */}
        <div className="flex items-center gap-1 bg-dark-800 p-1 rounded-lg border border-white/5 text-xs w-full sm:w-fit">
          <button
            onClick={() => setViewAngle('iso')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded transition-colors text-center font-medium ${
              viewAngle === 'iso' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Isométrico
          </button>
          <button
            onClick={() => setViewAngle('front')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded transition-colors text-center font-medium ${
              viewAngle === 'front' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Frontal
          </button>
          <button
            onClick={() => setViewAngle('side')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded transition-colors text-center font-medium ${
              viewAngle === 'side' ? 'bg-gold-500 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Lateral
          </button>
        </div>
      </div>

      {/* Visual Mockup Rendering (Clean SVG with Solid Gold) */}
      <div className="relative h-72 sm:h-80 md:h-96 flex items-center justify-center bg-dark-950 rounded-xl border border-white/5 p-1 sm:p-2 my-2 overflow-hidden">
        <svg
          viewBox={viewAngle === 'iso' ? '82 32 365 205' : viewAngle === 'front' ? '125 28 250 220' : '40 30 410 215'}
          className="w-full h-full max-h-72 sm:max-h-80 md:max-h-96"
        >
          <defs>
            {/* Gradientes para Modular / Contêiner */}
            <linearGradient id="containerFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222228" />
              <stop offset="100%" stopColor="#101014" />
            </linearGradient>

            <linearGradient id="containerSide" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1c1c22" />
              <stop offset="100%" stopColor="#131317" />
            </linearGradient>

            <linearGradient id="containerRoof" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2a2a32" />
              <stop offset="100%" stopColor="#353540" />
            </linearGradient>

            {/* Gradientes para Cobertura Metálica */}
            <linearGradient id="roofSteelSlope" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b3b47" />
              <stop offset="50%" stopColor="#282832" />
              <stop offset="100%" stopColor="#191922" />
            </linearGradient>

            <linearGradient id="roofSteelSlopeFar" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#202028" />
              <stop offset="100%" stopColor="#2e2e38" />
            </linearGradient>

            <linearGradient id="steelColumnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2d2d38" />
              <stop offset="50%" stopColor="#3f3f4e" />
              <stop offset="100%" stopColor="#1e1e26" />
            </linearGradient>

            {/* Gradientes para Estrutura Metálica / Serralheria */}
            <linearGradient id="gatePanelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#282832" />
              <stop offset="50%" stopColor="#181820" />
              <stop offset="100%" stopColor="#0f0f15" />
            </linearGradient>

            <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>

          {/* ========================================================= */}
          {/* FRENTE 1: MODULAR (Contêineres)                          */}
          {/* ========================================================= */}
          {productType === 'modular' && (
            <>
              {viewAngle === 'iso' && (
                <g transform="translate(10, 15)">
                  {/* Ground Shadow */}
                  <ellipse cx="250" cy="205" rx="190" ry="16" fill="rgba(0,0,0,0.5)" />

                  {/* Roof */}
                  <polygon
                    points="160,50 350,30 420,70 230,95"
                    fill="url(#containerRoof)"
                    stroke={SOLID_GOLD}
                    strokeWidth="1.2"
                    strokeOpacity="0.5"
                  />

                  {/* Side Long Wall */}
                  <polygon
                    points="230,95 420,70 420,165 230,195"
                    fill="url(#containerSide)"
                    stroke="#18181f"
                    strokeWidth="1.5"
                  />

                  {/* Corrugations on Long Wall */}
                  <g opacity="0.6">
                    {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((f, i) => {
                      const xTop = 230 + (420 - 230) * f;
                      const yTop = 95 + (70 - 95) * f;
                      const xBot = 230 + (420 - 230) * f;
                      const yBot = 195 + (165 - 195) * f;
                      return (
                        <line
                          key={i}
                          x1={xTop}
                          y1={yTop}
                          x2={xBot}
                          y2={yBot}
                          stroke="#0d0d11"
                          strokeWidth="2.5"
                        />
                      );
                    })}
                  </g>

                  {/* Front Face (Doors) */}
                  <polygon
                    points="160,50 230,95 230,195 160,145"
                    fill="url(#containerFront)"
                    stroke="#2a2a34"
                    strokeWidth="1.5"
                  />

                  {/* Glass Door Details */}
                  {(() => {
                    const P = (u: number, v: number) => `${160 + 70 * u},${50 + 45 * u + 95 * v}`;
                    const poly = (pts: [number, number][]) => pts.map(([u, v]) => P(u, v)).join(' ');
                    const [mx] = P(0.5, 0.5).split(',').map(Number);
                    const [hx, hy] = P(0.12, 0.5).split(',').map(Number);
                    return (
                      <g>
                        <polygon points={poly([[0, 0], [1, 0], [1, 1], [0, 1]])} fill="#0b0b0e" stroke="#2a2a34" strokeWidth="1.5" />
                        <clipPath id="openingClip"><polygon points={poly([[0.07, 0.17], [0.93, 0.17], [0.93, 0.92], [0.07, 0.92]])} /></clipPath>
                        <g clipPath="url(#openingClip)">
                          <polygon points={poly([[0, 0], [1, 0], [1, 1], [0, 1]])} fill="#e9e6df" />
                          {(() => {
                            const D = [190, -25];
                            const sh = (u: number, v: number) => { const [x, y] = P(u, v).split(',').map(Number); return `${x + D[0]},${y + D[1]}`; };
                            const q = (pts: [number, number][], shifted: boolean[]) => pts.map(([u, v], i) => (shifted[i] ? sh(u, v) : P(u, v))).join(' ');
                            return (
                              <g>
                                <polygon points={[[0.07, 0.17], [0.93, 0.17], [0.93, 0.92], [0.07, 0.92]].map(([u, v]) => sh(u, v)).join(' ')} fill="#ece9e2" />
                                <polygon points={q([[0.07, 0.17], [0.07, 0.92], [0.07, 0.92], [0.07, 0.17]], [false, false, true, true])} fill="#d9d5cb" />
                                <polygon points={q([[0.93, 0.17], [0.93, 0.92], [0.93, 0.92], [0.93, 0.17]], [false, false, true, true])} fill="#c9c5ba" />
                                <polygon points={q([[0.07, 0.92], [0.93, 0.92], [0.93, 0.92], [0.07, 0.92]], [false, false, true, true])} fill="#b9814a" />
                              </g>
                            );
                          })()}
                        </g>
                        <polygon points={poly([[0.07, 0.17], [0.5, 0.17], [0.5, 0.92], [0.07, 0.92]])} fill="rgba(180,210,230,0.18)" stroke="#05050a" strokeWidth="1" />
                        <polygon points={poly([[0.5, 0.17], [0.93, 0.17], [0.93, 0.92], [0.5, 0.92]])} fill="rgba(180,210,230,0.28)" stroke="#05050a" strokeWidth="1" />
                        <line x1={mx} y1={Number(P(0.5, 0.15).split(',')[1])} x2={mx} y2={Number(P(0.5, 0.94).split(',')[1])} stroke="#050508" strokeWidth="2.5" />
                        <rect x={hx - 1.5} y={hy - 9} width="3" height="18" rx="1" fill="#050508" stroke="#3a3a44" strokeWidth="0.4" />
                        <polygon points={poly([[0.07, 0.17], [0.93, 0.17], [0.93, 0.92], [0.07, 0.92]])} fill="none" stroke="#050508" strokeWidth="2" />
                      </g>
                    );
                  })()}

                  {/* Corner Castings */}
                  <rect x="155" y="46" width="10" height="10" rx="1" fill={SOLID_GOLD} />
                  <rect x="225" y="90" width="10" height="10" rx="1" fill={SOLID_GOLD} />
                  <rect x="155" y="140" width="10" height="10" rx="1" fill={SOLID_GOLD} />
                  <rect x="225" y="190" width="10" height="10" rx="1" fill={SOLID_GOLD} />
                  <rect x="415" y="66" width="10" height="10" rx="1" fill={SOLID_GOLD} />
                  <rect x="415" y="160" width="10" height="10" rx="1" fill={SOLID_GOLD} />

                  {/* Stencil */}
                  <text
                    x="325" textAnchor="middle" y="132"
                    fill={SOLID_GOLD} fontSize="17" fontWeight="800" letterSpacing="4"
                    transform="rotate(-7.5 325 132)"
                  >
                    MODBOX
                  </text>

                  {/* Cotas */}
                  <line x1="140" y1="50" x2="140" y2="145" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="105" y="102" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">{height.toFixed(2)}m</text>
                  <line x1="240" y1="210" x2="425" y2="180" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="325" y="212" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">{length.toFixed(2)}m</text>
                  <line x1="150" y1="160" x2="215" y2="208" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="175" y="196" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">{width.toFixed(2)}m</text>
                </g>
              )}

              {viewAngle === 'front' && (
                <g transform="translate(130, 20)">
                  <ellipse cx="120" cy="195" rx="110" ry="12" fill="rgba(0,0,0,0.5)" />
                  <rect x="20" y="20" width="200" height="170" rx="4" fill="url(#containerFront)" stroke={SOLID_GOLD} strokeWidth="1.5" />
                  <rect x="18" y="18" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <rect x="206" y="18" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <rect x="18" y="176" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <rect x="206" y="176" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <text x="120" y="38" textAnchor="middle" fill={SOLID_GOLD} fontSize="10" fontWeight="bold" letterSpacing="3">MODBOX</text>
                  
                  {/* Interior & Glass */}
                  <rect x="32" y="48" width="176" height="130" fill="#e9e6df" />
                  <polygon points="32,48 208,48 180,76 60,76" fill="#f4f2ec" />
                  <polygon points="32,178 208,178 180,140 60,140" fill="#b9814a" />
                  <rect x="32" y="48" width="88" height="130" fill="rgba(180,210,230,0.18)" />
                  <rect x="120" y="48" width="88" height="130" fill="rgba(180,210,230,0.28)" />
                  <rect x="32" y="48" width="176" height="130" fill="none" stroke="#050508" strokeWidth="2" />
                  <line x1="120" y1="46" x2="120" y2="180" stroke="#050508" strokeWidth="3" />
                  <rect x="38" y="100" width="4" height="28" rx="1" fill="#050508" stroke="#3a3a44" strokeWidth="0.5" />

                  <text x="120" y="215" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                    Largura: {width.toFixed(2)}m × Altura: {height.toFixed(2)}m
                  </text>
                </g>
              )}

              {viewAngle === 'side' && (
                <g transform="translate(40, 25)">
                  <ellipse cx="210" cy="190" rx="190" ry="12" fill="rgba(0,0,0,0.5)" />
                  <rect x="10" y="25" width="400" height="160" rx="4" fill="url(#containerSide)" stroke={SOLID_GOLD} strokeWidth="1.5" />

                  {[...Array(19)].map((_, idx) => (
                    <line key={idx} x1={25 + idx * 20} y1={30} x2={25 + idx * 20} y2={180} stroke="#262630" strokeWidth="3" />
                  ))}

                  <rect x="8" y="23" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <rect x="386" y="23" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <rect x="8" y="171" width="16" height="16" rx="1" fill={SOLID_GOLD} />
                  <rect x="386" y="171" width="16" height="16" rx="1" fill={SOLID_GOLD} />

                  <text x="210" y="112" textAnchor="middle" fill={SOLID_GOLD} fontSize="18" fontWeight="800" letterSpacing="4">MODBOX</text>
                  <text x="210" y="210" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                    Comprimento: {length.toFixed(2)}m × Altura: {height.toFixed(2)}m
                  </text>
                </g>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* FRENTE 2: COBERTURA METÁLICA                              */}
          {/* ========================================================= */}
          {productType === 'cobertura_metalica' && (
            <>
              {viewAngle === 'iso' && (
                <g transform="translate(10, 15)">
                  {/* Ground Shadow & Covered Area */}
                  <ellipse cx="255" cy="205" rx="195" ry="18" fill="rgba(0,0,0,0.5)" />
                  <polygon points="160,195 235,218 425,185 350,165" fill="rgba(212,175,55,0.04)" stroke="rgba(212,175,55,0.2)" strokeDasharray="3 3" />

                  {/* Pilares Traseiros (desenhados ao fundo) */}
                  {/* Pilar Traseiro Esquerdo */}
                  <line x1="350" y1="65" x2="350" y2="165" stroke="#252530" strokeWidth="6" strokeLinecap="round" />
                  <rect x="345" y="161" width="10" height="5" rx="1" fill={SOLID_GOLD} />
                  
                  {/* Pilar Traseiro Direito */}
                  <line x1="420" y1="90" x2="420" y2="185" stroke="#252530" strokeWidth="6" strokeLinecap="round" />
                  <rect x="415" y="181" width="10" height="5" rx="1" fill={SOLID_GOLD} />

                  {/* Viga Longitudinal Superior Traseira */}
                  <line x1="350" y1="65" x2="420" y2="90" stroke="#1d1d24" strokeWidth="4" />

                  {/* Tesoura Traseira Treliçada (inclinada) */}
                  <polygon points="385,30 350,65 420,90" fill="none" stroke="#2a2a36" strokeWidth="2.5" />
                  <line x1="385" y1="30" x2="385" y2="78" stroke="#1e1e26" strokeWidth="1.5" />

                  {/* Viga Longitudinal Superior Esquerda */}
                  <line x1="160" y1="105" x2="350" y2="65" stroke="#333342" strokeWidth="4.5" />
                  {/* Viga Longitudinal Superior Direita (apoio da calha) */}
                  <line x1="235" y1="130" x2="420" y2="90" stroke="#333342" strokeWidth="4.5" />

                  {/* Viga Central Superior (Cumeeira de Aço) */}
                  <line x1="198" y1="65" x2="385" y2="30" stroke={SOLID_GOLD} strokeWidth="3" />

                  {/* Telhado: Água Traseira/Esquerda (menos visível) */}
                  <polygon
                    points="198,65 385,30 345,62 155,98"
                    fill="url(#roofSteelSlopeFar)"
                    stroke="#22222a"
                    strokeWidth="1"
                  />

                  {/* Telhado: Água Principal Frontal/Direita (voltada para o espectador) */}
                  <polygon
                    points="198,65 385,30 428,95 240,135"
                    fill="url(#roofSteelSlope)"
                    stroke={SOLID_GOLD}
                    strokeWidth="1.2"
                  />

                  {/* Nervuras Trapezoidais da Telha Metálica */}
                  {[0.12, 0.25, 0.38, 0.5, 0.63, 0.75, 0.88].map((f, i) => {
                    const xCume = 198 + (385 - 198) * f;
                    const yCume = 65 + (30 - 65) * f;
                    const xBeir = 240 + (428 - 240) * f;
                    const yBeir = 135 + (95 - 135) * f;
                    return (
                      <g key={i}>
                        <line x1={xCume} y1={yCume} x2={xBeir} y2={yBeir} stroke="#444455" strokeWidth="2.5" />
                        <line x1={xCume + 1} y1={yCume} x2={xBeir + 1} y2={yBeir} stroke="#101015" strokeWidth="1" />
                      </g>
                    );
                  })}

                  {/* Calha Perimétrica Lateral Direita */}
                  <line x1="240" y1="136" x2="428" y2="96" stroke={SOLID_GOLD} strokeWidth="3" />

                  {/* Testeira Frontal da Tesoura Metálica */}
                  <polygon
                    points="155,100 198,65 240,135 235,142 198,75 160,107"
                    fill="#181820"
                    stroke={SOLID_GOLD}
                    strokeWidth="1.5"
                  />

                  {/* Travamentos e Diagonais da Tesoura Frontal */}
                  <line x1="198" y1="75" x2="198" y2="120" stroke={SOLID_GOLD} strokeWidth="2" />
                  <line x1="178" y1="90" x2="198" y2="120" stroke="#3d3d4e" strokeWidth="1.8" />
                  <line x1="218" y1="105" x2="198" y2="120" stroke="#3d3d4e" strokeWidth="1.8" />

                  {/* Pilares Frontais (desenhados em primeiro plano) */}
                  {/* Pilar Frontal Esquerdo */}
                  <line x1="160" y1="105" x2="160" y2="195" stroke="url(#steelColumnGrad)" strokeWidth="7" strokeLinecap="round" />
                  <line x1="160" y1="105" x2="160" y2="195" stroke={SOLID_GOLD} strokeWidth="0.8" />
                  {/* Mão-francesa de reforço esquerdo */}
                  <line x1="160" y1="125" x2="185" y2="105" stroke={SOLID_GOLD} strokeWidth="2.5" />
                  {/* Sapata chumbada com parafusos dourados */}
                  <rect x="154" y="190" width="12" height="6" rx="1.5" fill={SOLID_GOLD} />

                  {/* Pilar Frontal Direito */}
                  <line x1="235" y1="130" x2="235" y2="218" stroke="url(#steelColumnGrad)" strokeWidth="7" strokeLinecap="round" />
                  <line x1="235" y1="130" x2="235" y2="218" stroke={SOLID_GOLD} strokeWidth="0.8" />
                  {/* Mão-francesa de reforço direito */}
                  <line x1="235" y1="150" x2="210" y2="130" stroke={SOLID_GOLD} strokeWidth="2.5" />
                  {/* Sapata chumbada com parafusos dourados */}
                  <rect x="229" y="213" width="12" height="6" rx="1.5" fill={SOLID_GOLD} />

                  {/* Letreiro MODBOX na Testeira Lateral */}
                  <text
                    x="335" y="122"
                    textAnchor="middle"
                    fill={SOLID_GOLD}
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="3"
                    transform="rotate(-11 335 122)"
                  >
                    MODBOX COBERTURAS
                  </text>

                  {/* Cotas */}
                  {/* Altura / Pé-direito livre */}
                  <line x1="140" y1="105" x2="140" y2="195" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="95" y="152" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">Pé-D: {height.toFixed(2)}m</text>

                  {/* Comprimento */}
                  <line x1="245" y1="228" x2="435" y2="195" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="340" y="222" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">Comp: {length.toFixed(2)}m</text>

                  {/* Largura frontal do vão livre */}
                  <line x1="152" y1="205" x2="225" y2="226" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="178" y="225" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">Larg: {width.toFixed(2)}m</text>
                </g>
              )}

              {viewAngle === 'front' && (
                <g transform="translate(130, 20)">
                  <ellipse cx="120" cy="195" rx="110" ry="12" fill="rgba(0,0,0,0.5)" />
                  {/* Vão Livre Sombreado */}
                  <rect x="30" y="70" width="180" height="120" fill="rgba(212,175,55,0.03)" stroke="rgba(212,175,55,0.15)" strokeDasharray="3 3" />

                  {/* Pilares Laterais */}
                  <line x1="30" y1="70" x2="30" y2="190" stroke="url(#steelColumnGrad)" strokeWidth="10" strokeLinecap="round" />
                  <line x1="210" y1="70" x2="210" y2="190" stroke="url(#steelColumnGrad)" strokeWidth="10" strokeLinecap="round" />
                  <rect x="23" y="185" width="14" height="6" rx="1" fill={SOLID_GOLD} />
                  <rect x="203" y="185" width="14" height="6" rx="1" fill={SOLID_GOLD} />

                  {/* Mãos-francesas de contraventamento */}
                  <line x1="30" y1="95" x2="65" y2="70" stroke={SOLID_GOLD} strokeWidth="3" />
                  <line x1="210" y1="95" x2="175" y2="70" stroke={SOLID_GOLD} strokeWidth="3" />

                  {/* Viga Tirante Horizontal Principal */}
                  <line x1="30" y1="70" x2="210" y2="70" stroke="#333342" strokeWidth="6" />

                  {/* Tesoura Metálica de Duas Águas (Treliça) */}
                  <polygon points="120,20 20,68 220,68" fill="#1b1b22" stroke={SOLID_GOLD} strokeWidth="2" />
                  
                  {/* Montantes e Diagonais da Treliça */}
                  <line x1="120" y1="20" x2="120" y2="68" stroke={SOLID_GOLD} strokeWidth="2" />
                  <line x1="70" y1="44" x2="70" y2="68" stroke="#444455" strokeWidth="2" />
                  <line x1="170" y1="44" x2="170" y2="68" stroke="#444455" strokeWidth="2" />
                  <line x1="70" y1="68" x2="120" y2="20" stroke="#444455" strokeWidth="1.5" />
                  <line x1="170" y1="68" x2="120" y2="20" stroke="#444455" strokeWidth="1.5" />

                  {/* Telhas com beiral e cumeeira */}
                  <line x1="14" y1="66" x2="120" y2="16" stroke="#454558" strokeWidth="5" strokeLinecap="round" />
                  <line x1="120" y1="16" x2="226" y2="66" stroke="#454558" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="120" cy="16" r="4" fill={SOLID_GOLD} />

                  {/* Calhas nos cantos */}
                  <rect x="14" y="64" width="8" height="6" rx="1" fill={SOLID_GOLD} />
                  <rect x="218" y="64" width="8" height="6" rx="1" fill={SOLID_GOLD} />

                  {/* Plaqueta Central */}
                  <rect x="75" y="75" width="90" height="18" rx="4" fill="#0c0c10" stroke={SOLID_GOLD} strokeWidth="1" />
                  <text x="120" y="87" textAnchor="middle" fill={SOLID_GOLD} fontSize="8" fontWeight="bold" letterSpacing="1.5">
                    MODBOX COBERTURA
                  </text>

                  {/* Cotas */}
                  <text x="120" y="140" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="500">
                    VÃO LIVRE ESTRUTURAL
                  </text>
                  <text x="120" y="215" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                    Vão Livre: {width.toFixed(2)}m × Pé-Direito: {height.toFixed(2)}m
                  </text>
                </g>
              )}

              {viewAngle === 'side' && (
                <g transform="translate(40, 25)">
                  <ellipse cx="210" cy="190" rx="190" ry="12" fill="rgba(0,0,0,0.5)" />

                  {/* 4 Pilares ao Longo do Comprimento */}
                  {[30, 150, 270, 390].map((xPilar, idx) => (
                    <g key={idx}>
                      <line x1={xPilar} y1="50" x2={xPilar} y2="185" stroke="url(#steelColumnGrad)" strokeWidth="8" strokeLinecap="round" />
                      <rect x={xPilar - 6} y="180" width="12" height="6" rx="1" fill={SOLID_GOLD} />
                    </g>
                  ))}

                  {/* Viga Longitudinal Principal */}
                  <line x1="20" y1="50" x2="400" y2="50" stroke="#333342" strokeWidth="6" />

                  {/* Contraventamentos em X entre os vãos */}
                  <line x1="30" y1="50" x2="150" y2="185" stroke="rgba(212,175,55,0.4)" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="150" y1="50" x2="30" y2="185" stroke="rgba(212,175,55,0.4)" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="270" y1="50" x2="390" y2="185" stroke="rgba(212,175,55,0.4)" strokeWidth="2" strokeDasharray="4 2" />
                  <line x1="390" y1="50" x2="270" y2="185" stroke="rgba(212,175,55,0.4)" strokeWidth="2" strokeDasharray="4 2" />

                  {/* Linha de Telha Inclinada Lateral com Beiral */}
                  <polygon
                    points="10,40 410,40 405,48 15,48"
                    fill="url(#roofSteelSlope)"
                    stroke={SOLID_GOLD}
                    strokeWidth="1.5"
                  />

                  {/* Calha Lateral Contínua com Descidas Pluviais */}
                  <line x1="10" y1="48" x2="410" y2="48" stroke={SOLID_GOLD} strokeWidth="3" />
                  <line x1="30" y1="48" x2="30" y2="180" stroke="#555566" strokeWidth="2" />
                  <line x1="390" y1="48" x2="390" y2="180" stroke="#555566" strokeWidth="2" />

                  {/* Placa Stencil */}
                  <rect x="155" y="75" width="110" height="24" rx="4" fill="#0d0d12" stroke={SOLID_GOLD} strokeWidth="1.2" />
                  <text x="210" y="91" textAnchor="middle" fill={SOLID_GOLD} fontSize="11" fontWeight="800" letterSpacing="3">
                    MODBOX
                  </text>

                  <text x="210" y="210" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                    Comprimento: {length.toFixed(2)}m × Altura: {height.toFixed(2)}m
                  </text>
                </g>
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* FRENTE 3: ESTRUTURA METÁLICA EM GERAL / SERRALHERIA       */}
          {/* ========================================================= */}
          {productType === 'estrutura_metalica' && (
            <>
              {viewAngle === 'iso' && (
                <g transform="translate(10, 15)">
                  {/* Ground Shadow */}
                  <ellipse cx="250" cy="205" rx="190" ry="16" fill="rgba(0,0,0,0.5)" />

                  {/* Pórtico e Estrutura de Serralheria Pesada */}
                  {/* Coluna Traseira Esquerda */}
                  <line x1="340" y1="65" x2="340" y2="165" stroke="#252530" strokeWidth="8" strokeLinecap="round" />
                  <rect x="335" y="161" width="10" height="5" rx="1" fill={SOLID_GOLD} />

                  {/* Coluna Traseira Direita */}
                  <line x1="410" y1="85" x2="410" y2="180" stroke="#252530" strokeWidth="8" strokeLinecap="round" />
                  <rect x="405" y="176" width="10" height="5" rx="1" fill={SOLID_GOLD} />

                  {/* Viga Superior de Travamento de Fundo */}
                  <line x1="340" y1="65" x2="410" y2="85" stroke="#1c1c24" strokeWidth="5" />

                  {/* Vigas Longitudinais de Ligação */}
                  <line x1="160" y1="105" x2="340" y2="65" stroke="#333342" strokeWidth="6" />
                  <line x1="230" y1="130" x2="410" y2="85" stroke="#333342" strokeWidth="6" />

                  {/* Contraventamentos Estruturais em X na Lateral */}
                  <line x1="230" y1="130" x2="410" y2="180" stroke="rgba(212,175,55,0.4)" strokeWidth="2.5" />
                  <line x1="410" y1="85" x2="230" y2="215" stroke="rgba(212,175,55,0.4)" strokeWidth="2.5" />

                  {/* Painel do Portão / Estrutura Frontal (Chapa Lambril Búzios) */}
                  <polygon
                    points="160,105 230,130 230,215 160,185"
                    fill="url(#gatePanelGrad)"
                    stroke={SOLID_GOLD}
                    strokeWidth="1.8"
                  />

                  {/* Lâminas Horizontais do Lambril */}
                  {[0.15, 0.28, 0.41, 0.54, 0.67, 0.8, 0.92].map((f, i) => {
                    const xL = 160;
                    const yL = 105 + (185 - 105) * f;
                    const xR = 230;
                    const yR = 130 + (215 - 130) * f;
                    return (
                      <g key={i}>
                        <line x1={xL} y1={yL} x2={xR} y2={yR} stroke="#09090e" strokeWidth="3" />
                        <line x1={xL} y1={yL - 1} x2={xR} y2={yR - 1} stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
                      </g>
                    );
                  })}

                  {/* Visor / Gradeado Superior de Ventilação */}
                  <polygon
                    points="165,110 225,131 225,138 165,116"
                    fill="#050508"
                    stroke={SOLID_GOLD}
                    strokeWidth="0.8"
                  />

                  {/* Colunas Frontais Robustas com Guia do Contrapeso */}
                  {/* Coluna Frontal Esquerda */}
                  <line x1="160" y1="100" x2="160" y2="190" stroke="url(#steelColumnGrad)" strokeWidth="9" strokeLinecap="round" />
                  <rect x="154" y="186" width="12" height="6" rx="1.5" fill={SOLID_GOLD} />

                  {/* Coluna Frontal Direita (com caixa de contrapeso destacada) */}
                  <line x1="230" y1="125" x2="230" y2="218" stroke="url(#steelColumnGrad)" strokeWidth="9" strokeLinecap="round" />
                  <rect x="224" y="214" width="12" height="6" rx="1.5" fill={SOLID_GOLD} />

                  {/* Braço Mecânico Basculante Articulado */}
                  <line x1="230" y1="155" x2="210" y2="175" stroke={SOLID_GOLD} strokeWidth="3" strokeLinecap="round" />
                  <circle cx="210" cy="175" r="3.5" fill="#ffffff" stroke={SOLID_GOLD} strokeWidth="1" />
                  <circle cx="230" cy="155" r="3.5" fill="#ffffff" stroke={SOLID_GOLD} strokeWidth="1" />

                  {/* Viga Superior Frontal do Pórtico */}
                  <line x1="155" y1="103" x2="235" y2="128" stroke="#3d3d4e" strokeWidth="7" />
                  <line x1="155" y1="103" x2="235" y2="128" stroke={SOLID_GOLD} strokeWidth="1.2" />

                  {/* Placa Stencil Lateral em Estrutura */}
                  <rect x="290" y="125" width="80" height="20" rx="3" fill="#0d0d12" stroke={SOLID_GOLD} strokeWidth="1" transform="rotate(-12 290 125)" />
                  <text
                    x="330" y="139"
                    textAnchor="middle"
                    fill={SOLID_GOLD}
                    fontSize="9"
                    fontWeight="800"
                    letterSpacing="2"
                    transform="rotate(-12 330 139)"
                  >
                    MODBOX SERRALHERIA
                  </text>

                  {/* Cotas */}
                  <line x1="140" y1="105" x2="140" y2="190" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="105" y="148" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">{height.toFixed(2)}m</text>

                  <line x1="240" y1="225" x2="420" y2="190" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="330" y="218" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">{length.toFixed(2)}m</text>

                  <line x1="150" y1="198" x2="220" y2="222" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="175" y="222" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">{width.toFixed(2)}m</text>
                </g>
              )}

              {viewAngle === 'front' && (
                <g transform="translate(130, 20)">
                  <ellipse cx="120" cy="195" rx="110" ry="12" fill="rgba(0,0,0,0.5)" />

                  {/* Quadro Principal do Portão / Estrutura */}
                  <rect x="20" y="25" width="200" height="165" rx="3" fill="#14141c" stroke={SOLID_GOLD} strokeWidth="2" />

                  {/* Colunas Laterais de Sustentação com Caixas de Contrapeso */}
                  <rect x="12" y="20" width="16" height="175" rx="2" fill="url(#steelColumnGrad)" stroke="#3d3d4e" strokeWidth="1.5" />
                  <rect x="212" y="20" width="16" height="175" rx="2" fill="url(#steelColumnGrad)" stroke="#3d3d4e" strokeWidth="1.5" />
                  <rect x="10" y="190" width="20" height="6" rx="1" fill={SOLID_GOLD} />
                  <rect x="210" y="190" width="20" height="6" rx="1" fill={SOLID_GOLD} />

                  {/* Frisos Horizontais Lambril Búzios */}
                  {[...Array(9)].map((_, idx) => (
                    <g key={idx}>
                      <line x1="32" y1={65 + idx * 13} x2="208" y2={65 + idx * 13} stroke="#09090d" strokeWidth="4" />
                      <line x1="32" y1={64 + idx * 13} x2="208" y2={64 + idx * 13} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
                    </g>
                  ))}

                  {/* Gradeado / Veneziana Superior */}
                  <rect x="32" y="32" width="176" height="26" fill="#0c0c10" stroke={SOLID_GOLD} strokeWidth="1" />
                  {[...Array(12)].map((_, idx) => (
                    <line key={idx} x1={44 + idx * 13} y1="34" x2={44 + idx * 13} y2="56" stroke={SOLID_GOLD} strokeWidth="1.5" />
                  ))}

                  {/* Portão Social Embutido Centralizado */}
                  <rect x="90" y="75" width="60" height="110" fill="none" stroke={SOLID_GOLD} strokeWidth="1.5" />
                  <circle cx="142" cy="130" r="3" fill={SOLID_GOLD} />
                  <line x1="138" y1="130" x2="146" y2="130" stroke="#000" strokeWidth="1" />

                  {/* Viga Superior de Travamento com Logo */}
                  <rect x="20" y="20" width="200" height="12" fill="#1f1f2a" stroke={SOLID_GOLD} strokeWidth="1" />
                  <text x="120" y="29" textAnchor="middle" fill={SOLID_GOLD} fontSize="8" fontWeight="bold" letterSpacing="2">
                    MODBOX ESTRUTURAS & SERRALHERIA
                  </text>

                  <text x="120" y="215" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                    Largura: {width.toFixed(2)}m × Altura: {height.toFixed(2)}m
                  </text>
                </g>
              )}

              {viewAngle === 'side' && (
                <g transform="translate(40, 25)">
                  <ellipse cx="210" cy="190" rx="190" ry="12" fill="rgba(0,0,0,0.5)" />

                  {/* Coluna Principal Lateral de Aço */}
                  <rect x="195" y="25" width="30" height="165" rx="3" fill="url(#steelColumnGrad)" stroke={SOLID_GOLD} strokeWidth="1.5" />
                  <rect x="185" y="185" width="50" height="8" rx="2" fill={SOLID_GOLD} />

                  {/* Sapatas / Gussets de Reforço Triangular na Base */}
                  <polygon points="185,185 195,150 195,185" fill={SOLID_GOLD} />
                  <polygon points="235,185 225,150 225,185" fill={SOLID_GOLD} />

                  {/* Braço Articulado Basculante Aberto */}
                  <line x1="210" y1="80" x2="150" y2="120" stroke={SOLID_GOLD} strokeWidth="4" strokeLinecap="round" />
                  <circle cx="210" cy="80" r="5" fill="#fff" stroke={SOLID_GOLD} strokeWidth="1.5" />
                  <circle cx="150" cy="120" r="5" fill="#fff" stroke={SOLID_GOLD} strokeWidth="1.5" />

                  {/* Guia com Roldana de Rolamento */}
                  <line x1="220" y1="35" x2="220" y2="175" stroke="#444455" strokeWidth="3" strokeDasharray="6 3" />
                  <circle cx="220" cy="95" r="7" fill={SOLID_GOLD} stroke="#000" strokeWidth="1" />

                  {/* Texto */}
                  <text x="210" y="15" textAnchor="middle" fill={SOLID_GOLD} fontSize="11" fontWeight="bold" letterSpacing="1">
                    PERFIL LATERAL DE SERRALHERIA
                  </text>
                  <text x="210" y="210" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                    Profundidade/Comprimento: {length.toFixed(2)}m × Altura: {height.toFixed(2)}m
                  </text>
                </g>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Dimensional Specs Pill Bar */}
      {showDetails && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
          <div className="bg-dark-850 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Comprimento</span>
            <span className="text-sm font-bold text-white font-mono">{length.toFixed(2)} m</span>
          </div>
          <div className="bg-dark-850 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Largura / Vão</span>
            <span className="text-sm font-bold text-white font-mono">{width.toFixed(2)} m</span>
          </div>
          <div className="bg-dark-850 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Altura / Pé-Direito</span>
            <span className="text-sm font-bold text-white font-mono">{height.toFixed(2)} m</span>
          </div>
          <div className="bg-dark-850 p-2 rounded-xl border border-gold-500/30">
            <span className="text-[10px] text-gold-500 uppercase tracking-wider block font-bold">Área Útil</span>
            <span className="text-sm font-bold text-gold-500 font-mono">{area} m²</span>
          </div>
        </div>
      )}
    </div>
  );
};
