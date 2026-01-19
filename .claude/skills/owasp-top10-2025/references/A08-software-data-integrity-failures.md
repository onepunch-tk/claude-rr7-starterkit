# A08 Software or Data Integrity Failures

## Background (배경)

이 취약점 카테고리는 소프트웨어 공급망 문제와 하위 수준의 무결성 우려 사항을 구분하는 정제된 이름으로 **8위**를 유지합니다. 초점은 소프트웨어 아티팩트 및 데이터의 신뢰 경계 유지 및 무결성 검증 실패에 있습니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 14개 |
| 최대 발생률 | 8.98% |
| 평균 커버리지 | 45.49% |
| 총 CVE | 3,331개 |

### 주요 취약점
- CWE-829: 신뢰할 수 없는 소스의 기능 포함
- CWE-915: 동적 객체 속성의 부적절한 제어 수정
- CWE-502: 신뢰할 수 없는 데이터의 역직렬화

## Description (설명)

이 취약점은 **애플리케이션이 유효하지 않거나 신뢰할 수 없는 코드/데이터가 정당한 것으로 취급되는 것을 보호하지 못할 때** 발생합니다.

### 일반적인 시나리오

1. **신뢰할 수 없는 소스의 플러그인, 라이브러리 또는 모듈에 의존**
2. **소프트웨어 무결성 검증이 부족한 안전하지 않은 CI/CD 파이프라인**
3. **충분한 무결성 검사 없는 자동 업데이트 기능**
4. **공격자가 수정한 객체의 안전하지 않은 역직렬화**

> "애플리케이션이 적절한 검증 메커니즘 없이 신뢰할 수 없는 소스의 플러그인, 라이브러리 또는 모듈에 의존합니다."

## How to Prevent (예방법)

1. **디지털 서명**: 소프트웨어 또는 데이터가 예상 소스에서 왔는지 확인하기 위해 디지털 서명 또는 유사한 메커니즘 사용

2. **신뢰할 수 있는 저장소**: 검증된 소스로 라이브러리 사용 제한; 고위험 프로필의 경우 내부 검증된 저장소 고려

3. **코드 검토 프로세스**: 악성 코드 주입을 최소화하기 위한 필수 검토 절차 구현

4. **CI/CD 보안**: 빌드/배포 프로세스 전반에 걸쳐 적절한 분리, 설정 및 접근 제어 보장

5. **직렬화 보호**: 신뢰할 수 없는 클라이언트의 서명되지 않거나 암호화되지 않은 직렬화된 데이터 거부; 무결성 검사 구현

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 신뢰할 수 없는 웹 기능
```
회사가 외부 지원 제공업체 인프라를 자체 도메인에 매핑하여
인증 쿠키가 제공업체에 전송됩니다.
침해된 제공업체 접근은 모든 사용자의 세션 하이재킹을 가능하게 합니다.
```

### 시나리오 #2 - 서명되지 않은 업데이트
```
가정용 라우터와 펌웨어에 업데이트 검증 메커니즘이 없습니다.
공격자는 다음 버전 릴리스까지 수정 경로 없이
악성 펌웨어를 배포합니다.
```

### 시나리오 #3 - 신뢰할 수 없는 패키지 소스
```
개발자가 신뢰할 수 있는 저장소 대신
비공식 웹사이트에서 패키지를 다운로드합니다.
검증되지 않은 패키지에 무결성 검증 없이 악성 코드가 포함되어 있습니다.
```

### 시나리오 #4 - 안전하지 않은 역직렬화
```java
// Spring Boot 마이크로서비스에 직렬화된 사용자 상태를 전달하는 React 애플리케이션
// 공격자가 Java 객체 서명을 식별하고
// 원격 코드 실행을 위해 역직렬화를 악용합니다.
```

## References (참고자료)

- [OWASP Software Supply Chain Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html)
- [OWASP Infrastructure as Code Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Infrastructure_as_Code_Security_Cheat_Sheet.html)
- [OWASP Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)
- [SAFECode Software Integrity Controls](https://safecode.org/publication/SAFECode_Software_Integrity_Controls0610.pdf)
- ["A 'Worst Nightmare' Cyberattack: The Untold Story Of The SolarWinds Hack" (NPR)](https://www.npr.org/2021/04/16/985439655/a-worst-nightmare-cyberattack-the-untold-story-of-the-solarwinds-hack)
- [CodeCov Bash Uploader Compromise](https://about.codecov.io/security-update/)
- [Securing DevOps by Julien Vehent](https://www.manning.com/books/securing-devops)
- [Insecure Deserialization by Tenendo](https://www.tenendo.com/blog/insecure-deserialization)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-345](https://cwe.mitre.org/data/definitions/345.html) | 데이터 진위성의 불충분한 검증 |
| [CWE-353](https://cwe.mitre.org/data/definitions/353.html) | 무결성 검사 지원 누락 |
| [CWE-426](https://cwe.mitre.org/data/definitions/426.html) | 신뢰할 수 없는 검색 경로 |
| [CWE-427](https://cwe.mitre.org/data/definitions/427.html) | 제어되지 않는 검색 경로 요소 |
| [CWE-494](https://cwe.mitre.org/data/definitions/494.html) | 무결성 검사 없이 코드 다운로드 |
| [CWE-502](https://cwe.mitre.org/data/definitions/502.html) | 신뢰할 수 없는 데이터의 역직렬화 |
| [CWE-506](https://cwe.mitre.org/data/definitions/506.html) | 내장된 악성 코드 |
| [CWE-509](https://cwe.mitre.org/data/definitions/509.html) | 복제 악성 코드 (바이러스 또는 웜) |
| [CWE-565](https://cwe.mitre.org/data/definitions/565.html) | 유효성 검사 및 무결성 검사 없이 쿠키에 의존 |
| [CWE-784](https://cwe.mitre.org/data/definitions/784.html) | 유효성 검사 없이 보안 결정에서 쿠키 사용 |
| [CWE-829](https://cwe.mitre.org/data/definitions/829.html) | 신뢰할 수 없는 제어 영역의 기능 포함 |
| [CWE-830](https://cwe.mitre.org/data/definitions/830.html) | 신뢰할 수 없는 소스의 웹 기능 포함 |
| [CWE-915](https://cwe.mitre.org/data/definitions/915.html) | 동적 속성의 부적절하게 제어된 수정 |
| [CWE-926](https://cwe.mitre.org/data/definitions/926.html) | Android 애플리케이션 컴포넌트의 부적절한 내보내기 |
