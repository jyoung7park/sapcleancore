"use client";

import { getSapSourceUrls, mergeByLevel, type SapSourceObject, type SourceSelection } from "@/lib/sap-sources";

const columns = [
  { header: "Level", key: "level", width: 10 }, { header: "State", key: "state", width: 24 },
  { header: "Object Key", key: "objectKey", width: 38 }, { header: "TADIR Object", key: "tadirObject", width: 14 },
  { header: "TADIR Name", key: "tadirObjName", width: 38 }, { header: "Object Type", key: "objectType", width: 14 },
  { header: "Application Component", key: "applicationComponent", width: 24 },
  { header: "Software Component", key: "softwareComponent", width: 22 },
  { header: "Successor", key: "successor", width: 42 }, { header: "Labels (Official / Derived)", key: "labels", width: 52 },
  { header: "Label Source", key: "labelSource", width: 16 },
];

async function fetchSource(url: string, key: "objectReleaseInfo" | "objectClassifications") {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`SAP source request failed: ${response.status}`);
  const data = await response.json();
  return data[key] as SapSourceObject[];
}

function formatSuccessors(item: SapSourceObject) {
  if (item.successorConceptName) return item.successorConceptName;
  if (!item.successors?.length) return "N/A";
  return item.successors.map((successor) => {
    if (typeof successor === "string") return successor;
    const name = successor.objectKey ?? successor.tadirObjName ?? "Unknown";
    const type = successor.objectType ?? successor.tadirObject;
    return type ? `${name} (${type})` : name;
  }).join(" | ");
}

function formatLabels(item: SapSourceObject) {
  if (item.labels?.length) return { value: item.labels.join(", "), source: "SAP official" };
  const derived = [
    item.state ? `state:${item.state}` : null,
    item.objectType ? `type:${item.objectType}` : null,
    item.applicationComponent ? `component:${item.applicationComponent}` : null,
    item.softwareComponent ? `software:${item.softwareComponent}` : null,
    item.successorClassification ? `successor:${item.successorClassification}` : null,
  ].filter(Boolean);
  return { value: derived.join(", ") || "unclassified", source: "Derived" };
}

export async function downloadObjectsExcel(selection: SourceSelection, requestedLevel: "ALL" | "A" | "B" | "C") {
  const urls = getSapSourceUrls(selection);
  const [releaseItems, classificationItems, ExcelJS] = await Promise.all([
    fetchSource(urls.release, "objectReleaseInfo"), fetchSource(urls.classification, "objectClassifications"), import("exceljs"),
  ]);
  const all = mergeByLevel(releaseItems, classificationItems);
  const levels = requestedLevel === "ALL" ? ["A", "B", "C"] as const : [requestedLevel];
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CCOE / SAP Cloudification Repository";
  workbook.created = new Date();
  for (const level of levels) {
    const items = all.filter((item) => item.level === level);
    const sheet = workbook.addWorksheet(`Level ${level} (${items.length})`, { views: [{ state: "frozen", ySplit: 1 }] });
    sheet.columns = columns;
    items.forEach((item) => {
      const label = formatLabels(item);
      sheet.addRow({ ...item, successor: formatSuccessors(item), labels: label.value, labelSource: label.source });
    });
    sheet.autoFilter = { from: "A1", to: "K1" };
    sheet.getRow(1).height = 28;
    sheet.getRow(1).eachCell((cell) => { cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1677B8" } }; });
    sheet.eachRow((row, rowNumber) => { if (rowNumber > 1) { row.alignment = { vertical: "top", wrapText: true }; const cell = row.getCell(1); cell.font = { bold: true }; cell.alignment = { horizontal: "center" }; } });
  }
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url;
  anchor.download = `CCOE_${selection.product.replaceAll(" ", "_")}_${selection.system.replaceAll("/", "-").replaceAll(" ", "_")}_${requestedLevel}.xlsx`;
  anchor.click(); URL.revokeObjectURL(url);
}
