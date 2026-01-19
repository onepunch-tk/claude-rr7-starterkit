# A06 Insecure Design

## Background (배경)

Insecure Design은 Security Misconfiguration과 Supply Chain Failures의 부상으로 인해 **4위에서 6위**로 이동했습니다. 2021년에 도입된 이 카테고리는 구현 결함이 아닌 **"설계 및 아키텍처 결함"**을 다룹니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 39개 |
| 최대 발생률 | 22.18% |
| 최대 커버리지 | 88.76% |
| 총 발생 건수 | 729,882건 |
| 총 CVE | 7,647개 |

### 주요 취약 영역
- 보호되지 않은 자격 증명 저장
- 부적절한 권한 관리
- 무제한 파일 업로드
- 신뢰 경계 위반
- 불충분하게 보호된 자격 증명

## Description (설명)

Insecure Design은 **"누락되거나 비효과적인 제어 설계"**를 나타냅니다.

### 중요한 구분
> 보안 설계가 있지만 구현이 불량한 경우와 보안 설계 자체가 없는 경우는 다릅니다. 후자는 완벽한 코딩으로도 해결할 수 없습니다. 보호 제어가 처음부터 설계되지 않았기 때문입니다.

### 세 가지 기초 요소

#### 1. 요구사항 및 리소스 관리
비즈니스는 기밀성, 무결성, 가용성 및 진위성에 대한 보호 요구사항을 명시해야 합니다. 계획에는 테넌트 분리, 기술 사양 및 보안 활동을 포함한 설계부터 운영까지의 예산을 포함해야 합니다.

#### 2. 보안 설계
개발 주기에 통합된 지속적인 위협 평가가 필요합니다. 팀은 데이터 흐름, 접근 제어, 사용자 스토리 흐름 및 실패 상태를 분석해야 합니다. 보안은 애드온 도구가 아닌 방법론입니다.

#### 3. 보안 개발 수명주기
조직은 위협 모델링, 설계 패턴, 컴포넌트 라이브러리, 도구 및 사후 분석을 포함한 확립된 관행이 필요합니다. OWASP SAMM(Software Assurance Maturity Model)이 보안 개발 노력에 대한 구조를 제공합니다.

## How to Prevent (예방법)

1. **보안 개발 수명주기 수립**: 보안 제어를 평가하는 AppSec 전문가와 함께 보안 개발 수명주기 수립
2. **보안 설계 패턴 및 표준화된 컴포넌트 라이브러리 생성**
3. **위협 모델링 적용**: 인증, 접근 제어, 비즈니스 로직 및 중요 흐름에 위협 모델링 적용
4. **교육 도구로 위협 모델링 사용**: 보안 사고방식을 촉진하기 위한 교육 도구로 위협 모델링 사용
5. **사용자 스토리에 보안 언어 통합**
6. **모든 애플리케이션 계층에 타당성 검사 구현**
7. **위협 모델에 대한 중요 흐름을 위한 단위 및 통합 테스트 개발**
8. **노출 및 보호 필요에 따라 시스템 계층 분리**
9. **모든 계층에서 설계에 의한 강력한 테넌트 분리 구현**

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1: 보안 질문을 사용한 자격 증명 복구
```
자격 증명 복구에 보안 질문을 사용하는 것은
NIST 800-63b, OWASP ASVS 및 Top 10 표준을 위반합니다.
여러 사람이 답을 알 수 있으므로
이 메커니즘은 더 강력한 대안으로 대체해야 합니다.
```

### 시나리오 #2: 영화관 체인 그룹 예약
```
영화관 체인이 보증금 없이 15명 제한으로 그룹 예약을 허용합니다.
공격자는 비즈니스 로직을 악용하여 여러 위치에서
동시에 600석을 예약할 수 있어
결함 있는 애플리케이션 설계로 상당한 수익 손실을 초래합니다.
```

### 시나리오 #3: 전자상거래 사이트 봇 보호
```
봇 보호가 없는 전자상거래 사이트는
스캘퍼가 제한된 재고(고급 비디오 카드)를 구매할 수 있게 하여
소매업체 평판과 소비자 호의를 손상시킵니다.
안티봇 로직과 의심스러운 빠른 구매를 식별하는
도메인 규칙이 완화를 제공합니다.
```

## References (참고자료)

- [OWASP Cheat Sheet: Secure Design Principles](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Product_Design_Cheat_Sheet.html)
- [OWASP SAMM: Design | Secure Architecture](https://owaspsamm.org/model/design/secure-architecture/)
- [OWASP SAMM: Design | Threat Assessment](https://owaspsamm.org/model/design/threat-assessment/)
- [NIST Guidelines on Minimum Standards for Developer Verification of Software](https://www.nist.gov/publications)
- [The Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/)
- [Awesome Threat Modeling (GitHub repository)](https://github.com/hysnsec/awesome-threat-modelling)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-73](https://cwe.mitre.org/data/definitions/73.html) | 파일 이름 또는 경로의 외부 제어 |
| [CWE-183](https://cwe.mitre.org/data/definitions/183.html) | 허용 목록 대 차단 목록 |
| [CWE-256](https://cwe.mitre.org/data/definitions/256.html) | 보호되지 않은 자격 증명 저장 |
| [CWE-266](https://cwe.mitre.org/data/definitions/266.html) | 잘못된 권한 할당 |
| [CWE-269](https://cwe.mitre.org/data/definitions/269.html) | 부적절한 권한 관리 |
| [CWE-286](https://cwe.mitre.org/data/definitions/286.html) | 잘못된 사용자 관리 |
| [CWE-311](https://cwe.mitre.org/data/definitions/311.html) | 민감 데이터 암호화 누락 |
| [CWE-312](https://cwe.mitre.org/data/definitions/312.html) | 민감 정보의 평문 저장 |
| [CWE-313](https://cwe.mitre.org/data/definitions/313.html) | 파일 또는 디스크에 평문 저장 |
| [CWE-316](https://cwe.mitre.org/data/definitions/316.html) | 메모리에 평문 저장 |
| [CWE-362](https://cwe.mitre.org/data/definitions/362.html) | 동시 실행 시 공유 리소스의 부적절한 동기화 (레이스 컨디션) |
| [CWE-382](https://cwe.mitre.org/data/definitions/382.html) | J2EE 나쁜 관행: finalize() 사용 |
| [CWE-419](https://cwe.mitre.org/data/definitions/419.html) | 보호되지 않은 기본 채널 |
| [CWE-434](https://cwe.mitre.org/data/definitions/434.html) | 위험 유형 파일의 무제한 업로드 |
| [CWE-436](https://cwe.mitre.org/data/definitions/436.html) | 해석 충돌 |
| [CWE-444](https://cwe.mitre.org/data/definitions/444.html) | HTTP 요청/응답 스머글링 |
| [CWE-451](https://cwe.mitre.org/data/definitions/451.html) | 보안 관련 정보의 오해를 유발하는 UI |
| [CWE-454](https://cwe.mitre.org/data/definitions/454.html) | 변수 또는 데이터 구조의 외부 초기화 |
| [CWE-472](https://cwe.mitre.org/data/definitions/472.html) | 가정된 불변 데이터의 외부 제어 |
| [CWE-501](https://cwe.mitre.org/data/definitions/501.html) | 신뢰 경계 위반 |
| [CWE-522](https://cwe.mitre.org/data/definitions/522.html) | 불충분하게 보호된 자격 증명 |
| [CWE-525](https://cwe.mitre.org/data/definitions/525.html) | 웹 브라우저 캐시 사용을 통한 민감 정보 사용 |
| [CWE-539](https://cwe.mitre.org/data/definitions/539.html) | 영구 쿠키 사용을 통한 민감 정보 사용 |
| [CWE-598](https://cwe.mitre.org/data/definitions/598.html) | GET 요청 쿼리 스트링 사용을 통한 정보 노출 |
| [CWE-602](https://cwe.mitre.org/data/definitions/602.html) | 서버 측 보안의 클라이언트 측 시행 |
| [CWE-628](https://cwe.mitre.org/data/definitions/628.html) | 잘못 지정된 인수로 함수 호출 |
| [CWE-642](https://cwe.mitre.org/data/definitions/642.html) | 중요 상태 데이터의 외부 제어 |
| [CWE-646](https://cwe.mitre.org/data/definitions/646.html) | 웹 폴더에 소스 코드에 대한 외부 접근에 의존 |
| [CWE-653](https://cwe.mitre.org/data/definitions/653.html) | 불충분한 구획화 |
| [CWE-656](https://cwe.mitre.org/data/definitions/656.html) | 모호함에 의한 보안에 의존 |
| [CWE-657](https://cwe.mitre.org/data/definitions/657.html) | 보안 관련 결정에서 도메인별 허용 목록 위반 |
| [CWE-676](https://cwe.mitre.org/data/definitions/676.html) | 잠재적으로 위험한 함수 사용 |
| [CWE-693](https://cwe.mitre.org/data/definitions/693.html) | 보호 메커니즘 실패 |
| [CWE-799](https://cwe.mitre.org/data/definitions/799.html) | 상호 작용 빈도의 부적절한 제어 |
| [CWE-807](https://cwe.mitre.org/data/definitions/807.html) | 보안 결정에서 신뢰할 수 없는 입력에 의존 |
| [CWE-841](https://cwe.mitre.org/data/definitions/841.html) | 행동 워크플로우의 부적절한 시행 |
| [CWE-1021](https://cwe.mitre.org/data/definitions/1021.html) | UI 계층 또는 프레임의 부적절한 제한 |
| [CWE-1022](https://cwe.mitre.org/data/definitions/1022.html) | Reverse Tabnabbing을 방지하기 위한 조치 부족 |
| [CWE-1125](https://cwe.mitre.org/data/definitions/1125.html) | 지나치게 작은 난수 공간 |
