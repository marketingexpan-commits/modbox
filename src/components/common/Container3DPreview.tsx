import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { ContainerDimensions } from '../../types';

interface Container3DPreviewProps {
  dimensions: ContainerDimensions;
  name?: string;
  category?: string;
  doors?: string;
  windows?: string;
  showDetails?: boolean;
}

export const Container3DPreview: React.FC<Container3DPreviewProps> = ({
  dimensions,
  name = 'Contêiner ModBox',
  category,
  showDetails = true
}) => {
  const [viewAngle, setViewAngle] = useState<'iso' | 'front' | 'side'>('iso');

  const { length, width, height } = dimensions;
  const area = (length * width).toFixed(2);

  const SOLID_GOLD = '#D4AF37';


  return (
    <div className="bg-dark-900 border border-gold-500/30 rounded-2xl p-4 sm:p-5 overflow-hidden relative">
      {/* Top Controls: Info horizontal above buttons */}
      <div className="flex flex-col gap-3 mb-4 relative z-10">
        {/* Horizontal container info */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg bg-gold-500/15 text-gold-500 border border-gold-500/30 shrink-0">
            <Box className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide">{name}</h4>
          {category && (
            <span className="text-[11px] text-gold-500 font-mono uppercase tracking-wider bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
              Categoria: {category}
            </span>
          )}
        </div>

        {/* View switcher buttons below info */}
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

      {/* Visual Container Rendering (Clean SVG with Solid Gold) */}
      <div className="relative h-72 sm:h-80 md:h-96 flex items-center justify-center bg-dark-950 rounded-xl border border-white/5 p-1 sm:p-2 my-2 overflow-hidden">
        <svg
          viewBox={viewAngle === 'iso' ? '82 32 365 205' : viewAngle === 'front' ? '125 28 250 220' : '40 30 410 215'}
          className="w-full h-full max-h-72 sm:max-h-80 md:max-h-96"
        >
          <defs>
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
          </defs>

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

              {/* Front Container Doors Divide */}
              {(() => {
                const P = (u: number, v: number) => `${160 + 70 * u},${50 + 45 * u + 95 * v}`;
                const poly = (pts: [number, number][]) => pts.map(([u, v]) => P(u, v)).join(' ');
                const [mx, my] = P(0.5, 0.5).split(',').map(Number);
                const [hx, hy] = P(0.12, 0.5).split(',').map(Number);
                return (
                  <g>
                    {/* Black frame + header */}
                    <polygon points={poly([[0, 0], [1, 0], [1, 1], [0, 1]])} fill="#0b0b0e" stroke="#2a2a34" strokeWidth="1.5" />
                    {/* Interior (true iso depth: floor + inner walls, clipped to opening) */}
                    <clipPath id="openingClip"><polygon points={poly([[0.07, 0.17], [0.93, 0.17], [0.93, 0.92], [0.07, 0.92]])} /></clipPath>
                    <g clipPath="url(#openingClip)">
                      <polygon points={poly([[0, 0], [1, 0], [1, 1], [0, 1]])} fill="#e9e6df" />
                      {(() => {
                        const D = [190, -25];
                        const sh = (u: number, v: number) => { const [x, y] = P(u, v).split(',').map(Number); return `${x + D[0]},${y + D[1]}`; };
                        const q = (pts: [number, number][], shifted: boolean[]) => pts.map(([u, v], i) => (shifted[i] ? sh(u, v) : P(u, v))).join(' ');
                        return (
                          <g>
                            {/* far end wall */}
                            <polygon points={[[0.07, 0.17], [0.93, 0.17], [0.93, 0.92], [0.07, 0.92]].map(([u, v]) => sh(u, v)).join(' ')} fill="#ece9e2" />
                            {/* inner face of far-side long wall (left edge) */}
                            <polygon points={q([[0.07, 0.17], [0.07, 0.92], [0.07, 0.92], [0.07, 0.17]], [false, false, true, true])} fill="#d9d5cb" />
                            {/* inner face of near-side long wall (right edge) */}
                            <polygon points={q([[0.93, 0.17], [0.93, 0.92], [0.93, 0.92], [0.93, 0.17]], [false, false, true, true])} fill="#c9c5ba" />
                            {/* wood floor */}
                            <polygon points={q([[0.07, 0.92], [0.93, 0.92], [0.93, 0.92], [0.07, 0.92]], [false, false, true, true])} fill="#b9814a" />
                          </g>
                        );
                      })()}
                    </g>
                    {/* Glass panes (sliding) */}
                    <polygon points={poly([[0.07, 0.17], [0.5, 0.17], [0.5, 0.92], [0.07, 0.92]])} fill="rgba(180,210,230,0.18)" stroke="#05050a" strokeWidth="1" />
                    <polygon points={poly([[0.5, 0.17], [0.93, 0.17], [0.93, 0.92], [0.5, 0.92]])} fill="rgba(180,210,230,0.28)" stroke="#05050a" strokeWidth="1" />
                    {/* Glass reflection */}
                    <polygon points={poly([[0.14, 0.17], [0.26, 0.17], [0.16, 0.92], [0.07, 0.92]])} fill="rgba(255,255,255,0.12)" />
                    <polygon points={poly([[0.6, 0.17], [0.7, 0.17], [0.62, 0.92], [0.53, 0.92]])} fill="rgba(255,255,255,0.1)" />
                    {/* Central mullion (sliding overlap) */}
                    <line x1={mx} y1={Number(P(0.5, 0.15).split(',')[1])} x2={mx} y2={Number(P(0.5, 0.94).split(',')[1])} stroke="#050508" strokeWidth="2.5" />
                    {/* Black handle + lock */}
                    <rect x={hx - 1.5} y={hy - 9} width="3" height="18" rx="1" fill="#050508" stroke="#3a3a44" strokeWidth="0.4" />
                    {/* Frame outline over glass */}
                    <polygon points={poly([[0.07, 0.17], [0.93, 0.17], [0.93, 0.92], [0.07, 0.92]])} fill="none" stroke="#050508" strokeWidth="2" />
                  </g>
                );
              })()}

              {/* Solid Gold ISO Corner Castings */}
              <rect x="155" y="46" width="10" height="10" rx="1" fill={SOLID_GOLD} />
              <rect x="225" y="90" width="10" height="10" rx="1" fill={SOLID_GOLD} />
              <rect x="155" y="140" width="10" height="10" rx="1" fill={SOLID_GOLD} />
              <rect x="225" y="190" width="10" height="10" rx="1" fill={SOLID_GOLD} />
              <rect x="415" y="66" width="10" height="10" rx="1" fill={SOLID_GOLD} />
              <rect x="415" y="160" width="10" height="10" rx="1" fill={SOLID_GOLD} />

              {/* ModBox Stencil */}
              <text
                x="325" textAnchor="middle"
                y="132"
                fill={SOLID_GOLD}
                fontSize="17"
                fontWeight="800"
                letterSpacing="4"
                transform="rotate(-7.5 325 132)"
              >
                MODBOX
              </text>

              {/* Dimension indicators */}
              <line x1="140" y1="50" x2="140" y2="145" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="105" y="102" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">
                {height.toFixed(2)}m
              </text>

              <line x1="240" y1="210" x2="425" y2="180" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="325" y="212" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">
                {length.toFixed(2)}m
              </text>

              <line x1="150" y1="160" x2="215" y2="208" stroke={SOLID_GOLD} strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="175" y="196" fill={SOLID_GOLD} fontSize="11" fontWeight="bold">
                {width.toFixed(2)}m
              </text>
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

              {/* Black frame + header */}
              <rect x="20" y="20" width="200" height="170" rx="4" fill="#0b0b0e" stroke={SOLID_GOLD} strokeWidth="1.5" />
              <text x="120" y="38" textAnchor="middle" fill={SOLID_GOLD} fontSize="10" fontWeight="bold" letterSpacing="3">
                MODBOX
              </text>
              {/* Interior */}
              <rect x="32" y="48" width="176" height="130" fill="#e9e6df" />
              <polygon points="32,48 208,48 180,76 60,76" fill="#f4f2ec" />
              <polygon points="32,178 208,178 180,140 60,140" fill="#b9814a" />
              <polygon points="32,48 60,76 60,140 32,178" fill="#d6d2c8" />
              <polygon points="208,48 180,76 180,140 208,178" fill="#cfcbc0" />
              <rect x="108" y="56" width="24" height="4" fill="#fff" />
              {/* Glass panes */}
              <rect x="32" y="48" width="88" height="130" fill="rgba(180,210,230,0.18)" />
              <rect x="120" y="48" width="88" height="130" fill="rgba(180,210,230,0.28)" />
              <polygon points="46,48 70,48 46,178 32,178" fill="rgba(255,255,255,0.12)" />
              <polygon points="140,48 162,48 140,178 124,178" fill="rgba(255,255,255,0.1)" />
              <rect x="32" y="48" width="176" height="130" fill="none" stroke="#050508" strokeWidth="2" />
              <line x1="120" y1="46" x2="120" y2="180" stroke="#050508" strokeWidth="3" />
              {/* Handle */}
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
                <line
                  key={idx}
                  x1={25 + idx * 20}
                  y1={30}
                  x2={25 + idx * 20}
                  y2={180}
                  stroke="#262630"
                  strokeWidth="3"
                />
              ))}

              <rect x="8" y="23" width="16" height="16" rx="1" fill={SOLID_GOLD} />
              <rect x="386" y="23" width="16" height="16" rx="1" fill={SOLID_GOLD} />
              <rect x="8" y="171" width="16" height="16" rx="1" fill={SOLID_GOLD} />
              <rect x="386" y="171" width="16" height="16" rx="1" fill={SOLID_GOLD} />

              <text
                x="210"
                y="112"
                textAnchor="middle"
                fill={SOLID_GOLD}
                fontSize="18"
                fontWeight="800"
                letterSpacing="4"
              >
                MODBOX
              </text>

              <text x="210" y="210" textAnchor="middle" fill={SOLID_GOLD} fontSize="12" fontWeight="bold">
                Comprimento: {length.toFixed(2)}m × Altura: {height.toFixed(2)}m
              </text>
            </g>
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
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Largura</span>
            <span className="text-sm font-bold text-white font-mono">{width.toFixed(2)} m</span>
          </div>
          <div className="bg-dark-850 p-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Altura</span>
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



