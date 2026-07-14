# SAP Clean Core Object Explorer

한국 SAP 개발자를 위한 ObjectKey, 릴리스 상태, Clean Core Level 및 Successor 통합 검색 MVP입니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열고 `VBAK`, `MB_BUS2017`, `판매오더 생성` 등을 검색합니다. URL의 `?q=ObjectKey`로 직접 검색할 수 있습니다.

## 현재 범위

- ObjectKey/TADIR/한글 동의어 통합 검색 API
- S/4HANA 2025 Private Edition 상태 및 Level 표시
- 릴리스 이력과 Successor 상세 패널
- PostgreSQL용 Prisma 모델
- SAP 공식 Viewer 딥링크

현재 UI는 구조 검증을 위한 샘플 데이터로 동작합니다. 실제 운영에서는 SAP Cloudification Repository 동기화 Worker가 staging 검증 후 Prisma 저장소를 교체해야 합니다.

## 주의

한글 설명과 추천은 참고용 비공식 정보입니다. 최종 판단은 대상 릴리스의 ADT API State와 ATC 검사 결과를 기준으로 해야 합니다. 이 서비스는 SAP SE와 제휴하거나 SAP SE의 보증을 받지 않습니다. 원본 데이터는 SAP Cloudification Repository의 Apache-2.0 라이선스를 따릅니다.
