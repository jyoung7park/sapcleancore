import { ArrowUpRight, Check, Database, Layers3, X } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { SapObject } from "@/types/object";

export function ObjectDetail({ object, onClose }: { object: SapObject; onClose: () => void }) {
  return <div className="detail-backdrop" onMouseDown={onClose}>
    <aside className="detail" onMouseDown={(event) => event.stopPropagation()}>
      <div className="detail-head"><div><div className="eyebrow">OBJECT DETAIL · {object.objectType}</div><h2>{object.objectName}</h2><p>{object.descriptionEn}</p></div><button className="icon-button" onClick={onClose} aria-label="닫기"><X size={20} /></button></div>
      <StatusBadge state={object.state} level={object.level} rawState={object.rawState} />
      <p className="ko-description">{object.descriptionKo} <small>비공식 번역</small></p>

      <section><h3><Database size={16} /> 기본 정보</h3><dl className="facts">
        <div><dt>Object Key</dt><dd>{object.objectKey}</dd></div><div><dt>TADIR Object</dt><dd>{object.tadirObject} / {object.tadirObjName}</dd></div>
        <div><dt>Package</dt><dd>{object.packageName}</dd></div><div><dt>Application</dt><dd>{object.applicationComponent}</dd></div>
        <div><dt>Software Component</dt><dd>{object.softwareComponent}</dd></div><div><dt>Product / Release</dt><dd>{object.product} / {object.release}</dd></div>
      </dl></section>

      <section><h3><Layers3 size={16} /> 릴리스별 상태</h3><div className="release-grid">{Object.entries(object.releaseHistory).map(([release, state]) => <div key={release}><span>{release}</span><b className={state === "RELEASED" ? "green" : ""}>{state.replaceAll("_", " ")}</b></div>)}</div></section>

      <section><div className="section-title"><h3>Successor · {object.successors.length}</h3></div>{object.successors.length ? <div className="successor-list">{object.successors.map((successor) => <article key={successor.name}><div className="successor-top"><strong>{successor.name}</strong><span>Level {successor.level}</span></div><p>{successor.purpose}</p><div className="chips"><em>{successor.type}</em><em>{successor.capability}</em><em>{successor.scope}</em>{successor.rap && <em><Check size={12} /> RAP</em>}</div></article>)}</div> : <p className="empty">등록된 Successor 정보가 없습니다.</p>}</section>
      <div className="detail-note"><strong>판단 전 확인</strong><p>{object.warning} 최종 개발 판단은 대상 시스템의 ADT API State와 ATC 검사 결과를 기준으로 확인하세요.</p></div>
      <a className="external" href={`https://sap.github.io/abap-atc-cr-cv-s4hc/?q=${encodeURIComponent(object.objectKey)}`} target="_blank" rel="noreferrer">공식 Viewer에서 확인 <ArrowUpRight size={15} /></a>
    </aside>
  </div>;
}
