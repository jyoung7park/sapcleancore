"use client";

import type { SapObject } from "@/types/object";

const columns = [
  { header: "Level", key: "level", width: 10 },
  { header: "State", key: "state", width: 18 },
  { header: "Object Key", key: "objectKey", width: 34 },
  { header: "Object Name", key: "objectName", width: 34 },
  { header: "Type", key: "objectType", width: 12 },
  { header: "English Description", key: "descriptionEn", width: 38 },
  { header: "Korean Description", key: "descriptionKo", width: 34 },
  { header: "Application", key: "applicationComponent", width: 18 },
  { header: "Software Component", key: "softwareComponent", width: 20 },
  { header: "Package", key: "packageName", width: 16 },
  { header: "Product", key: "product", width: 12 },
  { header: "Release", key: "release", width: 12 },
  { header: "Successors", key: "successors", width: 46 },
  { header: "Warning", key: "warning", width: 46 },
];

export async function downloadObjectsExcel(objects: SapObject[]) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "CCOE";
  workbook.created = new Date();

  const groups = [
    { name: "All Objects", items: objects },
    { name: "Level A", items: objects.filter((item) => item.level === "A") },
    { name: "Level B", items: objects.filter((item) => item.level === "B") },
    { name: "Level C", items: objects.filter((item) => item.level === "C") },
  ];

  for (const group of groups) {
    const sheet = workbook.addWorksheet(group.name, { views: [{ state: "frozen", ySplit: 1 }] });
    sheet.columns = columns;
    group.items.forEach((item) => sheet.addRow({
      ...item,
      successors: item.successors.map((successor) => `${successor.name} (${successor.type}, Level ${successor.level})`).join(" | "),
    }));
    sheet.autoFilter = { from: "A1", to: "N1" };
    sheet.getRow(1).height = 28;
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1677B8" } };
      cell.alignment = { vertical: "middle" };
    });
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: "top", wrapText: true };
        row.height = 32;
        const levelCell = row.getCell(1);
        const colors: Record<string, string> = { A: "FFDCFCE7", B: "FFFEF3C7", C: "FFE5E7EB" };
        levelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors[String(levelCell.value)] ?? "FFFFFFFF" } };
        levelCell.font = { bold: true };
        levelCell.alignment = { horizontal: "center", vertical: "middle" };
      }
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `CCOE_Objects_${new Date().toISOString().slice(0, 10)}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
