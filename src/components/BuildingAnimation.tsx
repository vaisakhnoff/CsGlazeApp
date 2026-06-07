"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface BlueprintAnimationProps {
  onComplete?: () => void;
}

// Phase metadata shown in the camera HUD
const PHASES = [
  { id: "SITE_PREP",   label: "SITE PREPARATION",    time: "06:14:02" },
  { id: "FOUNDATION",  label: "FOUNDATION WORKS",     time: "07:38:55" },
  { id: "STRUCTURE",   label: "STRUCTURAL FRAME",     time: "09:12:20" },
  { id: "FLOORS",      label: "FLOOR SLABS",          time: "10:45:10" },
  { id: "ACP",         label: "ACP CLADDING",         time: "12:30:44" },
  { id: "GLASS",       label: "GLASS FACADE",         time: "14:18:09" },
  { id: "ROOF",        label: "ROOF & FINISHING",     time: "16:55:33" },
  { id: "COMPLETE",    label: "PROJECT COMPLETE",     time: "17:00:00" },
];

export const BlueprintAnimation = ({ onComplete }: BlueprintAnimationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [phase, setPhase]       = useState(0); // index into PHASES
  const [progress, setProgress] = useState(0); // 0-100
  const [recBlink, setRecBlink] = useState(true);

  // REC dot blink
  useEffect(() => {
    const id = setInterval(() => setRecBlink(v => !v), 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // ── helpers ──────────────────────────────────────────────────────────────
    const q  = <T extends Element>(sel: string) => svg.querySelectorAll<T>(sel);
    const qs = <T extends Element>(sel: string) => svg.querySelector<T>(sel);

    const setupDraw = (nodes: NodeListOf<SVGGeometryElement>) =>
      nodes.forEach(el => {
        const len = el.getTotalLength?.() ?? 300;
        gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
      });

    const draw = (nodes: NodeListOf<Element>, dur: number, stagger = 0.06) =>
      gsap.to(nodes, { strokeDashoffset: 0, duration: dur, stagger, ease: "power2.inOut" });

    // ── select layers ────────────────────────────────────────────────────────
    const gridLines   = q(".grid-line");
    const scanLine    = qs<SVGRectElement>(".scan-line");
    const glowEl      = qs<SVGRectElement>(".glow-overlay");
    const foundation  = q<SVGGeometryElement>(".foundation");
    const columns     = q<SVGGeometryElement>(".column");
    const floors      = q<SVGGeometryElement>(".floor");
    const acpFrames   = q<SVGGeometryElement>(".acp-frame");
    const glassLines  = q<SVGGeometryElement>(".glass-line");
    const roofLines   = q<SVGGeometryElement>(".roof-line");
    const detailLines = q<SVGGeometryElement>(".detail-line");
    const dimLines    = q<SVGGeometryElement>(".dim-line");
    const hudEls      = q(".hud-el");
    const cornerMks   = q(".corner-marker");
    const coordLbls   = q(".coord-label");

    // Hide everything initially
    gsap.set([gridLines, scanLine, glowEl, hudEls, cornerMks, coordLbls], { opacity: 0 });
    gsap.set(".phase-overlay", { opacity: 0 });

    // Setup self-drawing on geometry
    setupDraw(foundation);
    setupDraw(columns);
    setupDraw(floors);
    setupDraw(acpFrames);
    setupDraw(glassLines);
    setupDraw(roofLines);
    setupDraw(detailLines);
    setupDraw(dimLines);

    // ── progress helper ───────────────────────────────────────────────────
    const setPhaseHUD = (idx: number) => setPhase(idx);
    const setProgressHUD = (val: number) => setProgress(val);

    // ── main timeline  (target: ~3 s total) ─────────────────────────────
    const tl = gsap.timeline({ onComplete: () => onComplete?.() });

    // 0 — Grid & camera boot  (~0.35s)
    tl.to(gridLines, { opacity: 0.07, duration: 0.2, stagger: 0.004 })
      .to(cornerMks,  { opacity: 1,   duration: 0.12, stagger: 0.02 }, "<+0.1")
      .to(coordLbls,  { opacity: 0.6, duration: 0.12 }, "<+0.05")
      .to(hudEls,     { opacity: 1,   duration: 0.15, stagger: 0.02 }, "<")
      .call(() => setPhaseHUD(0))
      .call(() => setProgressHUD(5));

    // scanline boot sweep  (0.35s)
    tl.to(scanLine!, { opacity: 0.5, duration: 0.04 })
      .to(scanLine!, { attr: { y: 840 }, duration: 0.35, ease: "none" })
      .to(scanLine!, { opacity: 0, duration: 0.04 });

    // 1 — Dimension lines  (0.2s)
    tl.call(() => { setPhaseHUD(1); setProgressHUD(10); })
      .add(draw(dimLines, 0.18, 0.02))
      .to(dimLines, { opacity: 0.35, duration: 0.1 }, "<");

    // 2 — Foundation  (0.25s)
    tl.call(() => { setPhaseHUD(1); setProgressHUD(22); })
      .add(draw(foundation, 0.22, 0.04), "+=0.04");

    // 3 — Structural columns  (0.3s)
    tl.call(() => { setPhaseHUD(2); setProgressHUD(38); })
      .add(draw(columns, 0.28, 0.025), "+=0.04");

    // 4 — Floor slabs  (0.25s)
    tl.call(() => { setPhaseHUD(3); setProgressHUD(52); })
      .add(draw(floors, 0.22, 0.03), "+=0.04");

    // 5 — ACP cladding  (0.2s)
    tl.call(() => { setPhaseHUD(4); setProgressHUD(65); })
      .add(draw(acpFrames, 0.18, 0.015), "+=0.04");

    // 6 — Glass facade  (0.2s)
    tl.call(() => { setPhaseHUD(5); setProgressHUD(78); })
      .add(draw(glassLines, 0.18, 0.012), "+=0.04");

    // 7 — Details  (0.15s)
    tl.add(draw(detailLines, 0.14, 0.012), "+=0.03");

    // 8 — Roof  (0.2s)
    tl.call(() => { setPhaseHUD(6); setProgressHUD(90); })
      .add(draw(roofLines, 0.18, 0.03), "+=0.04");

    // 9 — Final scan + glow  (0.4s)
    tl.to(scanLine!, { opacity: 0.2, duration: 0.03 }, "+=0.05")
      .call(() => gsap.set(scanLine!, { attr: { y: 0 } }))
      .to(scanLine!, { attr: { y: 840 }, duration: 0.3, ease: "none" })
      .to(scanLine!, { opacity: 0, duration: 0.03 });

    tl.to(glowEl!,    { opacity: 0.1, duration: 0.3, ease: "power1.inOut" }, "-=0.15")
      .to(gridLines,  { opacity: 0.13, duration: 0.25 }, "<");

    // 10 — Complete
    tl.call(() => { setPhaseHUD(7); setProgressHUD(100); });

    return () => { tl.kill(); };
  }, [onComplete]);

  // ── geometry constants ────────────────────────────────────────────────────
  const W       = 1000;
  const H       = 840;
  const groundY = 740;
  const roofY   = 100;
  const leftX   = 160;
  const rightX  = 840;
  const buildW  = rightX - leftX;        // 680
  const numFloors = 9;
  const floorH  = (groundY - roofY) / numFloors; // ~71px

  // 6 column positions (edges + 4 interior)
  const colXs   = [leftX, leftX + buildW * 0.2, leftX + buildW * 0.4,
                   leftX + buildW * 0.6, leftX + buildW * 0.8, rightX];
  // floors array (y-position of each floor slab, from ground up)
  const floorYs = Array.from({ length: numFloors }, (_, i) => groundY - floorH * (i + 1));

  // glass bays: bay indices 1,2,3 (center); ACP: 0 and 4
  const glassBays = [1, 2, 3];

  // grid
  const vGrid = Array.from({ length: 21 }, (_, i) => (W / 20) * i);
  const hGrid = Array.from({ length: 18 }, (_, i) => (H / 17) * i);

  const phaseInfo = PHASES[phase];

  return (
    <div className="relative w-full h-full select-none">
      {/* ── SVG canvas ─────────────────────────────────────────────────── */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="ledGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="22" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0"/>
            <stop offset="50%" stopColor="#000" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </linearGradient>
        </defs>

        {/* ── BACKGROUND GRID ── */}
        {vGrid.map((x, i) => (
          <line key={`vg${i}`} className="grid-line" x1={x} y1={0} x2={x} y2={H}
            stroke="#000" strokeWidth="0.4"/>
        ))}
        {hGrid.map((y, i) => (
          <line key={`hg${i}`} className="grid-line" x1={0} y1={y} x2={W} y2={y}
            stroke="#000" strokeWidth="0.4"/>
        ))}

        {/* ── SCAN LINE ── */}
        <rect className="scan-line" x={0} y={0} width={W} height={6}
          fill="url(#scanGrad)" opacity={0}/>

        {/* ── GLOW OVERLAY ── */}
        <rect className="glow-overlay" x={leftX-30} y={roofY-30}
          width={buildW+60} height={groundY - roofY + 60}
          fill="black" filter="url(#softGlow)" opacity={0}/>

        {/* ── HUD: corner brackets ── */}
        {([
          [30, 30, 1,1], [W-30, 30, -1,1], [30, H-30, 1,-1], [W-30, H-30, -1,-1]
        ] as [number,number,number,number][]).map(([x,y,sx,sy], i) => (
          <g key={`hud${i}`} className="hud-el" opacity={0}>
            <line x1={x} y1={y} x2={x+sx*38} y2={y}   stroke="#000" strokeWidth="1.5"/>
            <line x1={x} y1={y} x2={x}       y2={y+sy*38} stroke="#000" strokeWidth="1.5"/>
            <circle cx={x} cy={y} r="2.5" fill="#000" opacity="0.5"/>
          </g>
        ))}

        {/* ── COORD LABELS ── */}
        <text className="coord-label" x={54} y={24} fontSize="9" fill="#000" fontFamily="monospace" opacity={0}>
          LAT 25.2048°N  LON 55.2708°E
        </text>
        <text className="coord-label" x={W-180} y={24} fontSize="9" fill="#000" fontFamily="monospace" opacity={0}>
          CS GLAZE  REV 4.2
        </text>
        <text className="coord-label" x={54} y={H-14} fontSize="9" fill="#000" fontFamily="monospace" opacity={0}>
          ELEV: FRONT  SCALE 1:100
        </text>
        <text className="coord-label" x={W-190} y={H-14} fontSize="9" fill="#000" fontFamily="monospace" opacity={0}>
          DRG-2025-CSG-FACADE
        </text>

        {/* ── CORNER CROSSHAIRS on building ── */}
        {([[leftX, roofY],[rightX, roofY],[leftX, groundY],[rightX, groundY]] as [number,number][])
          .map(([cx, cy], i) => (
            <g key={`cm${i}`} className="corner-marker" opacity={0}>
              <line x1={cx-10} y1={cy} x2={cx+10} y2={cy} stroke="#000" strokeWidth="1"/>
              <line x1={cx} y1={cy-10} x2={cx} y2={cy+10} stroke="#000" strokeWidth="1"/>
              <circle cx={cx} cy={cy} r="3" stroke="#000" strokeWidth="0.75" fill="none"/>
            </g>
        ))}

        {/* ══ SCENE 1: DIMENSION LINES ══════════════════════════════════════ */}
        {/* Vertical height indicator */}
        <path className="dim-line" d={`M${leftX-55} ${roofY} L${leftX-55} ${groundY}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 4"/>
        <path className="dim-line" d={`M${leftX-65} ${roofY} L${leftX-45} ${roofY}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3"/>
        <path className="dim-line" d={`M${leftX-65} ${groundY} L${leftX-45} ${groundY}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3"/>
        <text x={leftX-52} y={(roofY+groundY)/2 + 3} fontSize="8" fill="#000" fillOpacity="0.35"
          fontFamily="monospace" transform={`rotate(-90,${leftX-52},${(roofY+groundY)/2})`}>
          42.0 M HT
        </text>

        {/* Horizontal width indicator */}
        <path className="dim-line" d={`M${leftX} ${roofY-35} L${rightX} ${roofY-35}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 4"/>
        <path className="dim-line" d={`M${leftX} ${roofY-45} L${leftX} ${roofY-25}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3"/>
        <path className="dim-line" d={`M${rightX} ${roofY-45} L${rightX} ${roofY-25}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3"/>
        <text x={(leftX+rightX)/2 - 20} y={roofY-27} fontSize="8" fill="#000" fillOpacity="0.35"
          fontFamily="monospace">
          34.0 M WIDTH
        </text>

        {/* Bay width tick marks */}
        {colXs.map((x, i) => (
          <path key={`dimtick${i}`} className="dim-line"
            d={`M${x} ${groundY+45} L${x} ${groundY+55}`}
            stroke="#000" strokeWidth="0.6" strokeOpacity="0.3"/>
        ))}
        <path className="dim-line" d={`M${colXs[0]} ${groundY+50} L${colXs[5]} ${groundY+50}`}
          stroke="#000" strokeWidth="0.4" strokeOpacity="0.25" strokeDasharray="2 3"/>

        {/* ══ SCENE 2: FOUNDATION ══════════════════════════════════════════ */}
        {/* Ground line */}
        <path className="foundation"
          d={`M${leftX-40} ${groundY} L${rightX+40} ${groundY}`}
          stroke="#000" strokeWidth="2.5" filter="url(#ledGlow)"/>
        {/* Sub-grade baseline */}
        <path className="foundation"
          d={`M${leftX-20} ${groundY+18} L${rightX+20} ${groundY+18}`}
          stroke="#000" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="6 4"/>
        {/* Foundation pads under each column */}
        {colXs.map((x, i) => (
          <React.Fragment key={`fd${i}`}>
            <path className="foundation"
              d={`M${x-14} ${groundY} L${x-14} ${groundY+30} L${x+14} ${groundY+30} L${x+14} ${groundY}`}
              stroke="#000" strokeWidth="1.5"/>
            {/* Foundation cross hatch */}
            <path className="foundation"
              d={`M${x-14} ${groundY+8} L${x+14} ${groundY+22}`}
              stroke="#000" strokeWidth="0.5" strokeOpacity="0.3"/>
            <path className="foundation"
              d={`M${x+14} ${groundY+8} L${x-14} ${groundY+22}`}
              stroke="#000" strokeWidth="0.5" strokeOpacity="0.3"/>
          </React.Fragment>
        ))}

        {/* ══ SCENE 3: STRUCTURAL COLUMNS ═════════════════════════════════ */}
        {colXs.map((x, i) => (
          <React.Fragment key={`col${i}`}>
            {/* Main column */}
            <path className="column"
              d={`M${x} ${groundY} L${x} ${roofY}`}
              stroke="#000"
              strokeWidth={i === 0 || i === colXs.length-1 ? 2.5 : 1.8}
              filter="url(#ledGlow)"/>
            {/* Column flange detail (I-beam hint) */}
            <path className="column"
              d={`M${x-4} ${groundY-30} L${x+4} ${groundY-30}`}
              stroke="#000" strokeWidth="0.8" strokeOpacity="0.45"/>
            <path className="column"
              d={`M${x-4} ${roofY+30} L${x+4} ${roofY+30}`}
              stroke="#000" strokeWidth="0.8" strokeOpacity="0.45"/>
          </React.Fragment>
        ))}

        {/* ══ SCENE 4: FLOOR SLABS ════════════════════════════════════════ */}
        {floorYs.map((y, i) => (
          <React.Fragment key={`fl${i}`}>
            <path className="floor"
              d={`M${leftX} ${y} L${rightX} ${y}`}
              stroke="#000" strokeWidth={i === floorYs.length-1 ? 2 : 1.2}
              strokeOpacity={0.75}/>
            {/* Slab thickness hint */}
            <path className="floor"
              d={`M${leftX} ${y+6} L${rightX} ${y+6}`}
              stroke="#000" strokeWidth="0.4" strokeOpacity="0.25"/>
            {/* Floor number label */}
            <text x={leftX-32} y={y + floorH/2 + 3} fontSize="7" fill="#000" fillOpacity="0.3"
              fontFamily="monospace">
              {String(numFloors - i).padStart(2, "0")}F
            </text>
          </React.Fragment>
        ))}

        {/* ══ SCENE 5: ACP CLADDING ══════════════════════════════════════ */}
        {/* Bay 0 — left ACP */}
        {floorYs.map((y, fi) => {
          const x1 = colXs[0], x2 = colXs[1];
          const y2 = fi === 0 ? groundY : floorYs[fi-1];
          return (
            <React.Fragment key={`acpL${fi}`}>
              <path className="acp-frame"
                d={`M${x1+3} ${y+3} L${x2-3} ${y+3} L${x2-3} ${y2-3} L${x1+3} ${y2-3} Z`}
                stroke="#000" strokeWidth="0.9" strokeOpacity="0.5" fill="none"/>
              {/* Horizontal seam */}
              <path className="acp-frame"
                d={`M${x1+6} ${(y+y2)/2} L${x2-6} ${(y+y2)/2}`}
                stroke="#000" strokeWidth="0.4" strokeOpacity="0.22" strokeDasharray="4 5"/>
            </React.Fragment>
          );
        })}
        {/* Bay 4 — right ACP */}
        {floorYs.map((y, fi) => {
          const x1 = colXs[4], x2 = colXs[5];
          const y2 = fi === 0 ? groundY : floorYs[fi-1];
          return (
            <React.Fragment key={`acpR${fi}`}>
              <path className="acp-frame"
                d={`M${x1+3} ${y+3} L${x2-3} ${y+3} L${x2-3} ${y2-3} L${x1+3} ${y2-3} Z`}
                stroke="#000" strokeWidth="0.9" strokeOpacity="0.5" fill="none"/>
              <path className="acp-frame"
                d={`M${x1+6} ${(y+y2)/2} L${x2-6} ${(y+y2)/2}`}
                stroke="#000" strokeWidth="0.4" strokeOpacity="0.22" strokeDasharray="4 5"/>
            </React.Fragment>
          );
        })}

        {/* ══ SCENE 6: GLASS CURTAIN WALL ════════════════════════════════ */}
        {glassBays.map(bi => {
          const x1 = colXs[bi], x2 = colXs[bi+1];
          const midX = (x1+x2) / 2;
          return (
            <React.Fragment key={`gb${bi}`}>
              {/* Vertical mullions */}
              {[x1, x1 + (x2-x1)*0.33, x1 + (x2-x1)*0.66, x2].map((mx, mi) => (
                <path key={`vmul${bi}${mi}`} className="glass-line"
                  d={`M${mx} ${roofY} L${mx} ${groundY}`}
                  stroke="#000" strokeWidth="0.7" strokeOpacity="0.4"/>
              ))}
              {/* Horizontal transoms per floor */}
              {floorYs.map((y, fi) => (
                <path key={`trans${bi}${fi}`} className="glass-line"
                  d={`M${x1} ${y} L${x2} ${y}`}
                  stroke="#000" strokeWidth="0.7" strokeOpacity="0.35"/>
              ))}
              {/* Reflection diagonal */}
              <path className="glass-line"
                d={`M${x1+6} ${roofY+30} L${midX} ${groundY-20}`}
                stroke="#000" strokeWidth="0.4" strokeOpacity="0.1"/>
              {/* Glass panel spandrel fill hint */}
              {floorYs.map((y, fi) => {
                const y2 = fi === 0 ? groundY : floorYs[fi-1];
                return (
                  <path key={`spandrel${bi}${fi}`} className="glass-line"
                    d={`M${x1+8} ${y+8} L${x2-8} ${y2-8}`}
                    stroke="#000" strokeWidth="0.3" strokeOpacity="0.1"/>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* ══ SCENE 6b: DETAILS (balcony rails, louvers) ═════════════════ */}
        {/* Thin louvre lines on ACP bays, every other floor */}
        {floorYs.filter((_, i) => i % 2 === 0).map((y, i) => {
          return (
            <React.Fragment key={`louv${i}`}>
              {[3,5,7,9,11,13].map(k => (
                <path key={`lv${i}${k}`} className="detail-line"
                  d={`M${colXs[0]+k*4} ${y+12} L${colXs[1]-4} ${y+12}`}
                  stroke="#000" strokeWidth="0.35" strokeOpacity="0.2"/>
              ))}
            </React.Fragment>
          );
        })}
        {/* Entry canopy at ground level */}
        <path className="detail-line"
          d={`M${W/2-90} ${groundY-5} L${W/2-90} ${groundY-32} L${W/2+90} ${groundY-32} L${W/2+90} ${groundY-5}`}
          stroke="#000" strokeWidth="1.4" strokeOpacity="0.8"/>
        <path className="detail-line"
          d={`M${W/2-90} ${groundY-32} L${W/2} ${groundY-48} L${W/2+90} ${groundY-32}`}
          stroke="#000" strokeWidth="0.8" strokeOpacity="0.5"/>

        {/* ══ SCENE 7: ROOF ══════════════════════════════════════════════ */}
        {/* Main roof edge */}
        <path className="roof-line"
          d={`M${leftX-20} ${roofY} L${rightX+20} ${roofY}`}
          stroke="#000" strokeWidth="3" filter="url(#ledGlow)"/>
        {/* Parapet coping */}
        <path className="roof-line"
          d={`M${leftX} ${roofY-14} L${rightX} ${roofY-14}`}
          stroke="#000" strokeWidth="1" strokeOpacity="0.45"/>
        {/* Penthouse box */}
        <path className="roof-line"
          d={`M${leftX+buildW*0.28} ${roofY} L${leftX+buildW*0.28} ${roofY-52}
              L${leftX+buildW*0.72} ${roofY-52} L${leftX+buildW*0.72} ${roofY}`}
          stroke="#000" strokeWidth="1.6" strokeOpacity="0.75"/>
        {/* Penthouse louvre grill */}
        {Array.from({length:5},(_,i) => (
          <path key={`pgrill${i}`} className="roof-line"
            d={`M${leftX+buildW*0.28+i*24+10} ${roofY-14} L${leftX+buildW*0.28+i*24+10} ${roofY-46}`}
            stroke="#000" strokeWidth="0.5" strokeOpacity="0.35"/>
        ))}
        {/* Antenna mast */}
        <path className="roof-line"
          d={`M${W/2} ${roofY-52} L${W/2} ${roofY-100}`}
          stroke="#000" strokeWidth="1" strokeOpacity="0.55" strokeDasharray="4 3"/>
        {/* Antenna crossbar */}
        <path className="roof-line"
          d={`M${W/2-18} ${roofY-82} L${W/2+18} ${roofY-82}`}
          stroke="#000" strokeWidth="0.8" strokeOpacity="0.4"/>
        {/* Rooftop railing */}
        <path className="roof-line"
          d={`M${leftX+8} ${roofY-14} L${leftX+8} ${roofY-28} L${rightX-8} ${roofY-28} L${rightX-8} ${roofY-14}`}
          stroke="#000" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="5 5"/>
      </svg>

      {/* ── CAMERA HUD OVERLAY (HTML over SVG, responsive) ──────────────── */}
      {/* Top-left: REC + timestamp */}
      <div className="absolute top-0 left-0 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 pointer-events-none z-10">
        <span
          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 flex-shrink-0 transition-opacity duration-200"
          style={{ opacity: recBlink ? 1 : 0.15 }}
        />
        <span className="font-mono text-[9px] sm:text-[11px] text-black/70 tracking-widest">
          REC
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] text-black/50 tracking-wider ml-1">
          {phaseInfo.time}
        </span>
      </div>

      {/* Top-right: zoom + date */}
      <div className="absolute top-0 right-0 p-3 sm:p-4 flex flex-col items-end gap-0.5 pointer-events-none z-10">
        <span className="font-mono text-[9px] sm:text-[11px] text-black/55 tracking-wider">
          ZOOM  1×
        </span>
        <span className="font-mono text-[9px] sm:text-[11px] text-black/35 tracking-wider">
          2025-06-07
        </span>
      </div>

      {/* Bottom-left: phase label */}
      <div className="absolute bottom-10 sm:bottom-12 left-0 p-3 sm:p-4 pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-black/60 rounded-full flex-shrink-0" />
          <span className="font-mono text-[8px] sm:text-[10px] text-black/60 tracking-[0.18em] uppercase">
            {phaseInfo.label}
          </span>
        </div>
      </div>

      {/* Bottom: progress bar + percentage */}
      <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 px-3 sm:px-4 pointer-events-none z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bar track */}
          <div className="flex-1 h-[2px] bg-black/10 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-black/70 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Percentage */}
          <span className="font-mono text-[9px] sm:text-[11px] text-black/50 tabular-nums w-8 text-right">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
