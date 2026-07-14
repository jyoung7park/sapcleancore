"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Box, ChevronDown, CircleHelp, Database, GitCompareArrows, Menu, Search, ShieldCheck, Sparkles } from "lucide-react";
import { ObjectDetail } from "./object-detail";
import { StatusBadge } from "./status-badge";
import type { SapObject } from "@/types/object";

const quickTerms = ["판매오더", "구매오더", "자재 이동", "회계전표", "메일"];

export function Explorer() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("ALL");
  const [items, setItems] = useState<SapObject[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<SapObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [system, setSystem] = useState("S/4HANA 2025");
  const [product, setProduct] = useState("Private Edition");

  useEffect(() => {
    const urlQuery = new URLSearchParams(window.location.search).get("q");
    if (urlQuery) runSearch(urlQuery);
  }, []);

  async function runSearch(value: string, nextLevel = level) {
    setQuery(value); setLoading(true);
    const params = new URLSearchParams({ q: value, level: nextLevel });
    const response = await fetch(`/api/v1/objects/search?${params}`);
    const data = await response.json();
    setItems(data.items); setExpanded(data.expandedTerms); setSearched(true); setLoading(false);
    window.history.replaceState(null, "", `?q=${encodeURIComponent(value)}`);
  }

  function submit(event: FormEvent) { event.preventDefault(); runSearch(query); }
  function changeLevel(value: string) { setLevel(value); if (searched) runSearch(query, value); }

  return <div className="app-shell">
    <header><a className="brand" href="/"><span className="brand-mark"><Box size={19} /></span><span><b>CCOE</b><small>Clean Core Object Explorer</small></span></a><nav className={mobileOpen ? "open" : ""}><button className="active" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}>객체 검색</button><button onClick={() => { runSearch("Successor"); setMobileOpen(false); }}>Successor</button><button onClick={() => { runSearch(""); setMobileOpen(false); }}>릴리스 비교</button><button onClick={() => { setHelpOpen(true); setMobileOpen(false); }}>Clean Core 가이드</button></nav><div className="header-actions"><span className="data-live"><i /> PCE 2025</span><button className="icon-button" onClick={() => setHelpOpen(true)} aria-label="도움말 열기"><CircleHelp size={19} /></button><button className="mobile-menu" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label="메뉴 열기"><Menu size={20} /></button></div></header>

    <main>
      <section className={`hero ${searched ? "compact" : ""}`}>
        <div className="eyebrow"><ShieldCheck size={14} /> SAP CLOUDIFICATION REPOSITORY</div>
        <h1>SAP 객체, <span>더 이상 추측하지 마세요.</span></h1>
        <p>Released 상태부터 Clean Core Level, 대체 API까지<br />하나의 검색으로 확인하세요.</p>
        <form className="search-box" onSubmit={submit}><Search size={23} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="VBAK, CL_BCS, BAPI, 판매오더 생성 등을 검색하세요" autoFocus /><button type="submit">검색 <ArrowRight size={17} /></button></form>
        <div className="selectors"><label>시스템 <span className="select-wrap"><select value={system} onChange={(event) => setSystem(event.target.value)}><option>S/4HANA 2025</option><option>S/4HANA 2023</option><option>S/4HANA 2022</option></select><ChevronDown size={14} /></span></label><label>제품 <span className="select-wrap"><select value={product} onChange={(event) => setProduct(event.target.value)}><option>Private Edition</option><option>Public Edition</option></select><ChevronDown size={14} /></span></label></div>
        {!searched && <div className="quick"><span>빠른 검색</span>{quickTerms.map((term) => <button key={term} onClick={() => runSearch(term)}>{term}</button>)}</div>}
      </section>

      {!searched ? <>
        <section className="summary"><div><span className="metric-label level-a">A</span><p><strong>32,140</strong><small>Released APIs</small></p></div><div><span className="metric-label level-b">B</span><p><strong>8,420</strong><small>Classic APIs</small></p></div><div><span className="metric-label level-c">C</span><p><strong>41,230</strong><small>Internal Objects</small></p></div><div className="source"><Database size={19} /><p><strong>2026. 07. 14.</strong><small>데이터 업데이트</small></p></div></section>
        <section className="how"><div><span>01</span><Search /><h3>객체 또는 업무용어 검색</h3><p>ObjectKey, 객체명, 한글 업무용어를 모두 검색합니다.</p></div><div><span>02</span><ShieldCheck /><h3>Clean Core 상태 확인</h3><p>릴리스 상태를 Level A부터 D까지 명확하게 구분합니다.</p></div><div><span>03</span><Sparkles /><h3>Successor로 전환</h3><p>대체 가능한 CDS, RAP BO, Remote API를 비교합니다.</p></div></section>
      </> : <section className="results">
        <div className="result-head"><div><span>SEARCH RESULTS</span><h2>“{query}” <small>{items.length}개 객체</small></h2>{expanded.length > 0 && <p>검색 확장: {expanded.slice(0, 4).join(" · ")}</p>}</div><div className="filters"><select value={level} onChange={(event) => changeLevel(event.target.value)}><option value="ALL">모든 Level</option><option value="A">Level A</option><option value="B">Level B</option><option value="C">Level C</option></select><button onClick={() => items[0] && setSelected(items[0])} disabled={!items.length}><GitCompareArrows size={15} /> 릴리스 비교</button></div></div>
        {loading ? <div className="loading">Repository를 검색하고 있습니다...</div> : items.length ? <div className="object-list">{items.map((object) => <article className="object-card" key={object.objectKey} onClick={() => setSelected(object)}><div className="object-icon">{object.objectType}</div><div className="object-main"><div className="object-title"><h3>{object.objectName}</h3><StatusBadge state={object.state} level={object.level} /></div><p>{object.descriptionEn}</p><small>{object.descriptionKo} · {object.applicationComponent} · {object.softwareComponent}</small>{object.successors.length > 0 && <div className="successor-preview"><b>SUCCESSOR</b>{object.successors.map((successor) => <span key={successor.name}>{successor.name} <em>A</em></span>)}</div>}</div><ArrowRight className="card-arrow" size={19} /></article>)}</div> : <div className="no-results"><BookOpen size={30} /><h3>일치하는 객체가 없습니다.</h3><p>ObjectKey, TADIR 객체명 또는 다른 업무용어로 검색해 보세요.</p></div>}
      </section>}
    </main>
    <footer><div><b>CCOE</b><span>본 서비스는 SAP SE와 제휴하거나 SAP SE의 보증을 받지 않습니다.</span></div><div><a href="https://github.com/SAP/abap-atc-cr-cv-s4hc" target="_blank">Source: SAP Cloudification Repository</a><span>Apache License 2.0</span></div></footer>
    {selected && <ObjectDetail object={selected} onClose={() => setSelected(null)} />}
    {helpOpen && <div className="help-backdrop" onMouseDown={() => setHelpOpen(false)}><section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title" onMouseDown={(event) => event.stopPropagation()}><button className="help-close" onClick={() => setHelpOpen(false)} aria-label="닫기">×</button><span>QUICK GUIDE</span><h2 id="help-title">Clean Core Level 안내</h2><div className="guide-level"><b className="level-a">A</b><p><strong>Released API</strong>신규 개발에 우선 사용하는 공개 계약 API입니다.</p></div><div className="guide-level"><b className="level-b">B</b><p><strong>Classic API</strong>기존 사용은 가능하지만 Released API 전환을 검토하세요.</p></div><div className="guide-level"><b className="level-c">C</b><p><strong>Internal Object</strong>업그레이드 안정성이 보장되지 않는 내부 객체입니다.</p></div><button className="primary-action" onClick={() => setHelpOpen(false)}>확인</button></section></div>}
  </div>;
}
