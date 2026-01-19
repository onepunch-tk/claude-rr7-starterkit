---
name: owasp-top10-2025
description: OWASP Top 10:2025 웹 보안 취약점 가이드. 보안 전문가 서브에이전트가 코드 리뷰, 보안 감사, 취약점 분석 시 참조하는 스킬. A01 Broken Access Control부터 A10 Mishandling of Exceptional Conditions까지 10가지 주요 웹 보안 위협에 대한 배경, 설명, 예방법, 공격 시나리오, 관련 CWE 정보 제공.
model: opus
allowed-tools:
  - Read
  - Glob
  - Grep
---

# OWASP Top 10:2025 웹 보안 가이드

## 개요

이 스킬은 **OWASP Top 10:2025** 웹 애플리케이션 보안 위험에 대한 종합적인 지침을 제공합니다. 보안 전문가 서브에이전트가 코드 리뷰, 보안 감사, 취약점 분석 시 활용할 수 있습니다.

## 사용 시점

- 코드 보안 리뷰 수행 시
- 보안 취약점 분석 및 평가 시
- 보안 요구사항 정의 시
- 개발자 보안 교육 시
- 침투 테스트 계획 수립 시

## OWASP Top 10:2025 요약

| 순위 | 카테고리 | 설명 | 상세 문서 |
|------|----------|------|-----------|
| **A01** | Broken Access Control | 접근 제어 실패로 인한 무단 데이터 접근, 수정, 삭제 | [상세 보기](./references/A01-broken-access-control.md) |
| **A02** | Security Misconfiguration | 시스템, 애플리케이션, 클라우드 서비스의 보안 설정 오류 | [상세 보기](./references/A02-security-misconfiguration.md) |
| **A03** | Software Supply Chain Failures | 소프트웨어 빌드, 배포, 업데이트 과정의 공급망 침해 | [상세 보기](./references/A03-software-supply-chain-failures.md) |
| **A04** | Cryptographic Failures | 암호화 부재, 약한 암호화, 키 유출 등 암호화 관련 실패 | [상세 보기](./references/A04-cryptographic-failures.md) |
| **A05** | Injection | SQL, NoSQL, OS 명령, LDAP 등 인젝션 공격 | [상세 보기](./references/A05-injection.md) |
| **A06** | Insecure Design | 설계 및 아키텍처 수준의 보안 결함 | [상세 보기](./references/A06-insecure-design.md) |
| **A07** | Authentication Failures | 인증 메커니즘의 약점 및 세션 관리 실패 | [상세 보기](./references/A07-authentication-failures.md) |
| **A08** | Software or Data Integrity Failures | 소프트웨어/데이터 무결성 검증 실패 | [상세 보기](./references/A08-software-data-integrity-failures.md) |
| **A09** | Security Logging & Alerting Failures | 보안 로깅, 모니터링, 알림 메커니즘 부재 | [상세 보기](./references/A09-security-logging-alerting-failures.md) |
| **A10** | Mishandling of Exceptional Conditions | 예외 조건의 부적절한 처리 (2025년 신규) | [상세 보기](./references/A10-mishandling-exceptional-conditions.md) |

## 카테고리별 핵심 요약

### A01: Broken Access Control (접근 제어 실패)
- **발생률**: 테스트된 애플리케이션의 100%에서 발견
- **주요 위협**: IDOR, 권한 상승, CORS 오류, 강제 브라우징
- **핵심 예방**: 기본 거부 원칙, 중앙 집중식 접근 제어, 레코드 소유권 모델

### A02: Security Misconfiguration (보안 설정 오류)
- **5위에서 2위로 상승**
- **주요 위협**: 기본 계정/비밀번호, 불필요한 기능 활성화, 스택 트레이스 노출
- **핵심 예방**: 반복 가능한 강화 절차, 최소한의 플랫폼 배포, 자동화된 검증

### A03: Software Supply Chain Failures (소프트웨어 공급망 실패)
- **커뮤니티 설문조사 1위**
- **주요 위협**: 컴포넌트 취약점, CI/CD 침해, 악성 패키지
- **핵심 예방**: SBOM 생성, 종속성 추적, 서명된 패키지 사용

### A04: Cryptographic Failures (암호화 실패)
- **주요 위협**: 약한 암호화, 키 유출, 하드코딩된 키, 평문 전송
- **핵심 예방**: TLS 1.2+, 강력한 해싱(Argon2/scrypt), HSM 사용

### A05: Injection (인젝션)
- **3위에서 5위로 하락**
- **주요 위협**: SQL, XSS, OS 명령, LDAP 인젝션
- **핵심 예방**: 매개변수화된 쿼리, 입력 유효성 검사, 컨텍스트 인식 이스케이핑

### A06: Insecure Design (안전하지 않은 설계)
- **주요 위협**: 보안 요구사항 누락, 위협 모델링 부재, 비즈니스 로직 결함
- **핵심 예방**: 보안 개발 수명주기, 위협 모델링, 설계 패턴 라이브러리

### A07: Authentication Failures (인증 실패)
- **주요 위협**: 크리덴셜 스터핑, 약한 비밀번호, MFA 부재, 세션 고정
- **핵심 예방**: MFA 구현, NIST 800-63b 준수, 안전한 세션 관리

### A08: Software or Data Integrity Failures (소프트웨어/데이터 무결성 실패)
- **주요 위협**: 서명되지 않은 업데이트, 안전하지 않은 역직렬화, 신뢰할 수 없는 소스
- **핵심 예방**: 디지털 서명, 무결성 검사, 신뢰할 수 있는 저장소

### A09: Security Logging & Alerting Failures (보안 로깅 및 알림 실패)
- **주요 위협**: 불충분한 로깅, 모니터링 부재, 로그 변조, 늦은 침해 감지
- **핵심 예방**: 감사 가능한 이벤트 로깅, 실시간 모니터링, SIEM 도입

### A10: Mishandling of Exceptional Conditions (예외 조건 처리 오류)
- **2025년 신규 카테고리**
- **주요 위협**: 오류 메시지를 통한 정보 노출, 리소스 고갈, 불완전한 트랜잭션
- **핵심 예방**: 전역 예외 핸들러, 완전한 롤백, 속도 제한

## 활용 가이드

### 코드 리뷰 시
1. 해당 코드가 관련된 취약점 카테고리 식별
2. 상세 레퍼런스 문서에서 취약점 패턴 확인
3. "How to Prevent" 섹션의 권장사항 적용 여부 검토
4. 관련 CWE 목록을 기반으로 추가 취약점 검사

### 보안 요구사항 정의 시
1. OWASP Top 10 전체 카테고리 검토
2. 각 카테고리의 예방법을 요구사항으로 변환
3. 관련 OWASP Cheat Sheet 참조

### 침투 테스트 계획 시
1. "Example Attack Scenarios" 섹션 활용
2. 각 카테고리별 테스트 케이스 도출
3. CWE 목록 기반 취약점 탐지 시나리오 수립

## 참고 자료

### 공식 OWASP 리소스
- [OWASP Top 10:2025 공식 페이지](https://owasp.org/Top10/2025/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP SAMM](https://owaspsamm.org/)

### CWE 데이터베이스
- [MITRE CWE](https://cwe.mitre.org/)
- [NVD - National Vulnerability Database](https://nvd.nist.gov/)

### 추가 표준
- [NIST SP 800-63b](https://pages.nist.gov/800-63-3/sp800-63b.html) - 디지털 ID 가이드라인
- [NIST SP 800-123](https://csrc.nist.gov/publications/detail/sp/800-123/final) - 서버 보안 가이드
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/) - 보안 설정 벤치마크

## 버전 정보

- **OWASP Top 10 버전**: 2025
- **스킬 생성일**: 2026-01-19
- **데이터 출처**: https://owasp.org/Top10/2025/
