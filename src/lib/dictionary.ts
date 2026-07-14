export const koreanTerms: Record<string, string[]> = {
  "판매오더": ["sales order", "sales document", "customer order", "VBAK", "I_SalesOrder"],
  "수주": ["sales order", "sales document"],
  "구매오더": ["purchase order", "purchasing document", "BAPI_PO"],
  "자재이동": ["goods movement", "material document", "BAPI_GOODSMVT"],
  "자재 이동": ["goods movement", "material document", "BAPI_GOODSMVT"],
  "메일": ["mail", "email", "BCS", "CL_BCS", "SMTP"],
  "회계전표": ["accounting document", "journal entry", "BAPI_ACC"],
  "파일": ["file", "dataset", "stream"]
};

export function expandQuery(query: string) {
  const normalized = query.trim().toLowerCase();
  const expanded = new Set<string>([normalized]);
  for (const [term, synonyms] of Object.entries(koreanTerms)) {
    if (normalized.includes(term.toLowerCase())) synonyms.forEach((value) => expanded.add(value.toLowerCase()));
  }
  return [...expanded];
}
