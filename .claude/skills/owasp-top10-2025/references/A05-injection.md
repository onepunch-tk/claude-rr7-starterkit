# A05 Injection

## Background (배경)

Injection 취약점은 2025년 순위에서 **3위에서 5위**로 하락했습니다. 그러나 이 카테고리는 **100%의 애플리케이션**이 어떤 형태로든 인젝션에 대해 테스트되면서 관련성을 유지합니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 37개 |
| 최대 발생률 | 13.77% |
| 평균 발생률 | 3.08% |
| 최대 커버리지 | 100% |
| 평균 커버리지 | 42.93% |
| 평균 가중 익스플로잇 | 7.15 |
| 평균 가중 영향 | 4.32 |
| 총 발생 건수 | 1,404,249건 |
| 총 CVE | 62,445개 |

### 주요 취약점
- **CWE-79 (XSS)**: 30,000개 이상의 CVE
- **CWE-89 (SQL Injection)**: 14,000개 이상의 CVE (낮은 빈도/높은 영향)

## Description (설명)

인젝션 결함은 **"신뢰할 수 없는 사용자 입력이 인터프리터(예: 브라우저, 데이터베이스, 명령줄)에 전송되어 인터프리터가 해당 입력의 일부를 명령으로 실행하도록 하는 것"**입니다.

### 취약점 조건

애플리케이션은 다음과 같은 경우 취약해집니다:

1. **사용자 제공 데이터의 유효성 검사, 필터링 또는 삭제 부재**
2. **컨텍스트 인식 이스케이핑 없이 인터프리터에서 직접 사용되는 동적 쿼리 또는 비매개변수화된 호출**
3. **ORM 검색 매개변수에서 삭제되지 않은 데이터가 추가 민감 레코드를 추출**
4. **SQL, 명령 또는 저장 프로시저에서 적대적 데이터가 직접 사용되거나 연결됨**

### 일반적인 인젝션 유형
- SQL
- NoSQL
- OS 명령
- ORM
- LDAP
- Expression Language (EL)
- OGNL

## How to Prevent (예방법)

### 기본 접근 방식

**최적의 솔루션은 데이터를 명령 및 쿼리에서 분리하는 것입니다.**

1. **안전한 API 사용**: 인터프리터를 완전히 피하거나, 매개변수화된 인터페이스를 제공하거나, ORM(Object Relational Mapping) 도구를 구현하는 안전한 API 사용

### 보조 조치 (분리가 불가능한 경우)

2. **긍정적 서버 측 입력 유효성 검사**: 긍정적 서버 측 입력 유효성 검사 구현 (특수 문자가 필요한 경우 완전한 방어가 아님)
3. **특수 문자 이스케이프**: 인터프리터별 이스케이프 구문을 사용하여 특수 문자 이스케이프

### 중요 참고사항
> **SQL 구조 요소(테이블 및 열 이름 등)는 이스케이프할 수 없으므로 사용자 제공 구조 이름은 본질적으로 위험합니다.**

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - SQL Injection
```java
String query = "SELECT * FROM accounts WHERE custID='" + request.getParameter("id") + "'";
```

공격자가 'id' 매개변수를 수정합니다: `' OR '1'='1`

URL 예시:
```
http://example.com/app/accountView?id=' OR '1'='1
```

이렇게 하면 accounts 테이블의 모든 레코드가 반환됩니다. 더 정교한 공격은 데이터를 수정, 삭제하거나 저장 프로시저를 호출할 수 있습니다.

### 시나리오 #2 - ORM/Hibernate Query Language (HQL) Injection
```java
Query HQLQuery = session.createQuery("FROM accounts WHERE custID='" + request.getParameter("id") + "'");
```

공격자가 제공: `' OR custID IS NOT NULL OR custID='`

이렇게 하면 필터를 우회하고 모든 계정을 반환합니다. 더 적은 위험한 함수를 가진 프레임워크도 연결된 사용자 입력에 취약합니다.

### 시나리오 #3 - OS Command Injection
```java
String cmd = "nslookup " + request.getParameter("domain");
Runtime.getRuntime().exec(cmd);
```

공격자가 제공: `example.com; cat /etc/passwd`

이렇게 하면 서버에서 임의의 명령이 실행되어 민감한 시스템 파일에 접근합니다.

## References (참고자료)

- [OWASP Proactive Controls: 안전한 데이터베이스 접근](https://owasp.org/www-project-proactive-controls/)
- [OWASP ASVS: V5 입력 유효성 검사 및 인코딩](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Testing Guide: SQL Injection, Command Injection, ORM Injection](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Cheat Sheet: Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet: SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP Cheat Sheet: Injection Prevention in Java](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_in_Java_Cheat_Sheet.html)
- [OWASP Cheat Sheet: Query Parameterization](https://cheatsheetseries.owasp.org/cheatsheets/Query_Parameterization_Cheat_Sheet.html)
- [OWASP Automated Threats to Web Applications – OAT-014](https://owasp.org/www-project-automated-threats-to-web-applications/)
- [PortSwigger: Server-side template injection](https://portswigger.net/web-security/server-side-template-injection)
- [Awesome Fuzzing: 퍼징 리소스 목록](https://github.com/secfigo/Awesome-Fuzzing)

### 관련 리소스
> LLM의 인젝션 취약점은 OWASP LLM Top 10의 **LLM01:2025 Prompt Injection**에서 별도로 논의됩니다.

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-20](https://cwe.mitre.org/data/definitions/20.html) | 부적절한 입력 유효성 검사 |
| [CWE-74](https://cwe.mitre.org/data/definitions/74.html) | 출력에서 특수 요소의 부적절한 중화 |
| [CWE-76](https://cwe.mitre.org/data/definitions/76.html) | 동등한 특수 요소의 부적절한 중화 |
| [CWE-77](https://cwe.mitre.org/data/definitions/77.html) | 명령에서 특수 요소의 부적절한 중화 |
| [CWE-78](https://cwe.mitre.org/data/definitions/78.html) | OS 명령에서 특수 요소의 부적절한 중화 |
| [CWE-79](https://cwe.mitre.org/data/definitions/79.html) | 웹 페이지 생성 중 입력의 부적절한 중화 (XSS) |
| [CWE-80](https://cwe.mitre.org/data/definitions/80.html) | 스크립트 관련 HTML 태그의 부적절한 중화 (기본 XSS) |
| [CWE-83](https://cwe.mitre.org/data/definitions/83.html) | 속성의 스크립트 부적절한 중화 |
| [CWE-86](https://cwe.mitre.org/data/definitions/86.html) | 식별자의 유효하지 않은 문자 부적절한 중화 |
| [CWE-88](https://cwe.mitre.org/data/definitions/88.html) | 인수 구분자의 부적절한 중화 (인수 인젝션) |
| [CWE-89](https://cwe.mitre.org/data/definitions/89.html) | SQL 명령의 특수 요소 부적절한 중화 (SQL Injection) |
| [CWE-90](https://cwe.mitre.org/data/definitions/90.html) | LDAP 쿼리의 특수 요소 부적절한 중화 |
| [CWE-91](https://cwe.mitre.org/data/definitions/91.html) | XML Injection (Blind XPath Injection) |
| [CWE-93](https://cwe.mitre.org/data/definitions/93.html) | CRLF 시퀀스의 부적절한 중화 |
| [CWE-94](https://cwe.mitre.org/data/definitions/94.html) | 코드 생성의 부적절한 제어 (Code Injection) |
| [CWE-95](https://cwe.mitre.org/data/definitions/95.html) | 동적 평가 코드의 지시문 부적절한 중화 (Eval Injection) |
| [CWE-96](https://cwe.mitre.org/data/definitions/96.html) | 정적 저장 코드의 지시문 부적절한 중화 |
| [CWE-97](https://cwe.mitre.org/data/definitions/97.html) | 서버 측 포함의 부적절한 중화 (SSI) |
| [CWE-98](https://cwe.mitre.org/data/definitions/98.html) | PHP Include/Require의 파일명 부적절한 제어 (PHP RFI) |
| [CWE-99](https://cwe.mitre.org/data/definitions/99.html) | 리소스 식별자의 부적절한 제어 (Resource Injection) |
| [CWE-103](https://cwe.mitre.org/data/definitions/103.html) | Struts: 불완전한 validate() 메서드 정의 |
| [CWE-104](https://cwe.mitre.org/data/definitions/104.html) | Struts: Form Bean이 Validation 클래스를 확장하지 않음 |
| [CWE-112](https://cwe.mitre.org/data/definitions/112.html) | 누락된 XML 유효성 검사 |
| [CWE-113](https://cwe.mitre.org/data/definitions/113.html) | HTTP 헤더의 CRLF 부적절한 중화 (HTTP Response Splitting) |
| [CWE-114](https://cwe.mitre.org/data/definitions/114.html) | 프로세스 제어 |
| [CWE-115](https://cwe.mitre.org/data/definitions/115.html) | 출력의 잘못된 해석 |
| [CWE-116](https://cwe.mitre.org/data/definitions/116.html) | 출력의 부적절한 인코딩 또는 이스케이핑 |
| [CWE-129](https://cwe.mitre.org/data/definitions/129.html) | 배열 인덱스의 부적절한 유효성 검사 |
| [CWE-159](https://cwe.mitre.org/data/definitions/159.html) | 특수 요소의 잘못된 사용 부적절한 처리 |
| [CWE-470](https://cwe.mitre.org/data/definitions/470.html) | 클래스 선택을 위한 외부 제어 입력 사용 (Unsafe Reflection) |
| [CWE-493](https://cwe.mitre.org/data/definitions/493.html) | Final 수정자 없는 중요 공개 변수 |
| [CWE-500](https://cwe.mitre.org/data/definitions/500.html) | Final로 표시되지 않은 Public Static 필드 |
| [CWE-564](https://cwe.mitre.org/data/definitions/564.html) | SQL Injection: Hibernate |
| [CWE-610](https://cwe.mitre.org/data/definitions/610.html) | 다른 영역의 리소스에 대한 외부 제어 참조 |
| [CWE-643](https://cwe.mitre.org/data/definitions/643.html) | XPath 표현식 내 데이터의 부적절한 중화 (XPath Injection) |
| [CWE-644](https://cwe.mitre.org/data/definitions/644.html) | 스크립팅 구문을 위한 HTTP 헤더의 부적절한 중화 |
| [CWE-917](https://cwe.mitre.org/data/definitions/917.html) | Expression Language 문의 요소 부적절한 중화 |
