import type { SapObject } from "@/types/object";

export const objects: SapObject[] = [
  {
    objectKey: "VBAK", objectName: "VBAK", objectType: "TABL", tadirObject: "TABL", tadirObjName: "VBAK",
    descriptionEn: "Sales Document: Header Data", descriptionKo: "판매 문서 헤더 데이터", state: "INTERNAL", level: "C",
    product: "PCE", release: "2025", softwareComponent: "S4CORE", packageName: "VA", applicationComponent: "SD-SLS",
    warning: "직접 사용은 업그레이드 안정성이 보장되지 않습니다.",
    successors: [
      { name: "I_SalesOrder", type: "CDS View", level: "A", purpose: "판매오더 조회", capability: "Read", scope: "Local API", rap: true },
      { name: "API_SALES_ORDER_SRV", type: "OData API", level: "A", purpose: "외부 판매오더 연동", capability: "Read / Write", scope: "Remote API", rap: false }
    ],
    releaseHistory: { "2022": "INTERNAL", "2023": "INTERNAL", "2025": "INTERNAL", "Public": "NOT_AVAILABLE" }
  },
  {
    objectKey: "I_SALESORDER", objectName: "I_SalesOrder", objectType: "DDLS", tadirObject: "DDLS", tadirObjName: "I_SALESORDER",
    descriptionEn: "Sales Order", descriptionKo: "판매오더 조회 인터페이스 뷰", state: "RELEASED", level: "A",
    product: "PCE", release: "2025", softwareComponent: "S4CORE", packageName: "SD_SLS", applicationComponent: "SD-SLS",
    warning: "공개 계약이 있는 권장 로컬 API입니다.", successors: [],
    releaseHistory: { "2022": "RELEASED", "2023": "RELEASED", "2025": "RELEASED", "Public": "RELEASED" }
  },
  {
    objectKey: "BAPI_SALESORDER_CREATEFROMDAT2", objectName: "BAPI_SALESORDER_CREATEFROMDAT2", objectType: "FUNC", tadirObject: "FUGR", tadirObjName: "2032",
    descriptionEn: "Create Sales Order", descriptionKo: "판매오더 생성 BAPI", state: "CLASSIC_API", level: "B",
    product: "PCE", release: "2025", softwareComponent: "S4CORE", packageName: "VA", applicationComponent: "SD-SLS",
    warning: "기존 사용은 가능하지만 신규 개발은 Released API를 우선 검토하세요.",
    successors: [{ name: "API_SALES_ORDER_SRV", type: "OData API", level: "A", purpose: "판매오더 생성 및 변경", capability: "Read / Write", scope: "Remote API", rap: false }],
    releaseHistory: { "2022": "CLASSIC_API", "2023": "CLASSIC_API", "2025": "CLASSIC_API", "Public": "NOT_AVAILABLE" }
  },
  {
    objectKey: "CL_BCS", objectName: "CL_BCS", objectType: "CLAS", tadirObject: "CLAS", tadirObjName: "CL_BCS",
    descriptionEn: "Business Communication Services", descriptionKo: "메일 발송 비즈니스 커뮤니케이션 클래스", state: "CLASSIC_API", level: "B",
    product: "PCE", release: "2025", softwareComponent: "SAP_BASIS", packageName: "SBCOMS", applicationComponent: "BC-SRV-COM",
    warning: "Private Edition에서 Classic API로 사용할 수 있습니다.", successors: [],
    releaseHistory: { "2022": "CLASSIC_API", "2023": "CLASSIC_API", "2025": "CLASSIC_API", "Public": "NOT_AVAILABLE" }
  },
  {
    objectKey: "BAPI_GOODSMVT_CREATE", objectName: "BAPI_GOODSMVT_CREATE", objectType: "FUNC", tadirObject: "FUGR", tadirObjName: "MB_BUS2017",
    descriptionEn: "Post Goods Movement", descriptionKo: "자재 이동 및 자재문서 생성", state: "CLASSIC_API", level: "B",
    product: "PCE", release: "2025", softwareComponent: "S4CORE", packageName: "MB", applicationComponent: "MM-IM",
    warning: "기존 연동은 유지할 수 있으나 Released Business API를 검토하세요.", successors: [],
    releaseHistory: { "2022": "CLASSIC_API", "2023": "CLASSIC_API", "2025": "CLASSIC_API", "Public": "NOT_AVAILABLE" }
  }
];
