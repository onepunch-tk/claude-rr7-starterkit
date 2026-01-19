# A02 Security Misconfiguration

## Background (배경)

Security Misconfiguration은 OWASP Top 10:2025에서 **5위에서 2위**로 상승했습니다. 테스트된 애플리케이션의 **100%**에서 어떤 형태로든 설정 오류가 발견되었습니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 16개 |
| 최대 발생률 | 27.70% |
| 평균 발생률 | 3.00% |
| 최대 커버리지 | 100% |
| 평균 커버리지 | 52.35% |
| 총 발생 건수 | 719,084건 |
| 총 CVE | 1,375개 |

### 주요 관련 취약점
- CWE-16: 설정
- CWE-611: 부적절한 XML 외부 엔티티 참조 처리

## Description (설명)

보안 설정 오류는 시스템, 애플리케이션 또는 클라우드 서비스의 부적절한 설정을 나타냅니다. 반복 가능한 애플리케이션 보안 설정 강화 프로세스 없이는 시스템이 더 높은 위험에 노출됩니다.

### 취약점 지표

1. **보안 강화 누락**: 애플리케이션 스택 전반에 걸친 보안 강화 누락
2. **클라우드 서비스 권한 오류**: 부적절하게 구성된 클라우드 서비스 권한
3. **불필요한 기능 활성화**: 불필요한 포트, 서비스, 테스팅 프레임워크 활성화
4. **기본 계정/비밀번호**: 기본 계정과 비밀번호가 여전히 활성화되고 변경되지 않음
5. **부적절한 오류 메시지 필터링**: 스택 트레이스를 노출하는 부적절한 오류 메시지 필터링
6. **업그레이드 시스템의 보안 기능 비활성화**: 업그레이드된 시스템에서 보안 기능이 비활성화됨
7. **서버/프레임워크/라이브러리의 안전하지 않은 설정**: 서버, 프레임워크, 라이브러리, 데이터베이스의 안전하지 않은 설정
8. **보안 헤더 누락 또는 안전하지 않음**: 보안 헤더 누락 또는 안전하지 않은 설정

## How to Prevent (예방법)

### 강화 프로세스
1. **반복 가능한 강화 절차**: 빠르고 안전한 환경 배포를 위한 반복 가능한 강화 절차 구현
2. **환경 간 동일한 설정**: 개발, QA, 프로덕션 환경에서 환경별 자격 증명으로 동일한 설정 유지
3. **설정 자동화**: 수동 작업을 최소화하기 위한 설정 자동화

### 최소화
4. **최소한의 플랫폼 배포**: 불필요한 기능이나 컴포넌트 없이 최소한의 플랫폼 배포
5. **미사용 프레임워크 및 문서 제거**: 사용하지 않는 프레임워크와 문서 제거

### 패치 관리
6. **모든 보안 노트, 업데이트, 패치에 적합한 설정 검토 및 업데이트**
7. **클라우드 스토리지 권한 감사**: S3 버킷 등의 클라우드 스토리지 권한 감사

### 아키텍처 및 보안
8. **세그먼트화된 아키텍처**: 컨테이너화 또는 클라우드 보안 그룹으로 세그먼트화된 아키텍처 구현
9. **보안 헤더를 통한 보안 지시문 전송**: 보안 헤더를 통해 클라이언트에 보안 지시문 전송
10. **ID 페더레이션 및 단기 자격 증명 사용**: 내장된 정적 키 대신 ID 페더레이션과 단기 자격 증명 사용

### 검증
11. **자동화된 설정 효과성 검증**: 모든 환경에서 설정 효과성을 자동으로 검증
12. **중앙 집중식 오류 메시지 차단**: 중앙 집중식 오류 메시지 차단 구현
13. **최소 연간 수동 검증**: 자동화가 불가능한 경우 최소 연간 수동 검증

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1: 제거되지 않은 샘플 애플리케이션
프로덕션 서버에 알려진 취약점이 있는 샘플 애플리케이션이 남아있습니다. 공격자는 특히 변경되지 않은 기본 자격 증명이 있는 관리 콘솔을 악용하여 서버를 완전히 제어할 수 있습니다.

### 시나리오 #2: 디렉토리 목록 활성화
```
공격자가 단순히 디렉토리를 나열할 수 있다는 것을 발견합니다.
공격자는 컴파일된 Java 클래스를 찾아 다운로드하고,
디컴파일하고 리버스 엔지니어링하여 코드를 봅니다.
```
이 노출은 접근 제어 결함을 발견하는 데 이어집니다.

### 시나리오 #3: 상세한 오류 메시지
```
애플리케이션 서버 설정이 스택 트레이스와 같은
상세한 오류 메시지를 사용자에게 반환하도록 허용합니다.
```
이는 민감한 컴포넌트 버전과 기본 취약점을 노출합니다.

### 시나리오 #4: 클라우드 스토리지 노출
```
클라우드 서비스 제공업체(CSP)가 기본적으로 공유 권한을
인터넷에 열어 둡니다. 이로 인해 클라우드 스토리지 내에
저장된 민감한 데이터에 접근할 수 있습니다.
```

## References (참고자료)

- [OWASP Testing Guide: 설정 관리](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/)
- [OWASP Testing Guide: 오류 코드 테스트](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/08-Testing_for_Error_Handling/)
- [OWASP ASVS V13 설정](https://owasp.org/www-project-application-security-verification-standard/)
- [NIST 일반 서버 강화 가이드 (SP 800-123)](https://csrc.nist.gov/publications/detail/sp/800-123/final)
- [CIS 보안 설정 가이드/벤치마크](https://www.cisecurity.org/cis-benchmarks/)
- [Amazon S3 버킷 검색 및 열거](https://aws.amazon.com/blogs/security/how-to-use-bucket-policies-and-apply-defense-in-depth-to-help-secure-your-amazon-s3-data/)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-5](https://cwe.mitre.org/data/definitions/5.html) | J2EE 설정 오류 - 암호화 없이 데이터 전송 |
| [CWE-11](https://cwe.mitre.org/data/definitions/11.html) | ASP.NET 설정 오류 - 디버그 바이너리 생성 |
| [CWE-13](https://cwe.mitre.org/data/definitions/13.html) | ASP.NET 설정 오류 - 설정 파일에 비밀번호 |
| [CWE-15](https://cwe.mitre.org/data/definitions/15.html) | 시스템 또는 설정 설정의 외부 제어 |
| [CWE-16](https://cwe.mitre.org/data/definitions/16.html) | 설정 |
| [CWE-260](https://cwe.mitre.org/data/definitions/260.html) | 설정 파일에 비밀번호 |
| [CWE-315](https://cwe.mitre.org/data/definitions/315.html) | 쿠키에 민감 정보 평문 저장 |
| [CWE-489](https://cwe.mitre.org/data/definitions/489.html) | 활성 디버그 코드 |
| [CWE-526](https://cwe.mitre.org/data/definitions/526.html) | 환경 변수를 통한 민감 정보 노출 |
| [CWE-547](https://cwe.mitre.org/data/definitions/547.html) | 하드코딩된 보안 관련 상수 사용 |
| [CWE-611](https://cwe.mitre.org/data/definitions/611.html) | XML 외부 엔티티 참조의 부적절한 제한 |
| [CWE-614](https://cwe.mitre.org/data/definitions/614.html) | 'Secure' 속성 없는 HTTPS 세션의 민감 쿠키 |
| [CWE-776](https://cwe.mitre.org/data/definitions/776.html) | DTD에서 재귀 엔티티 참조의 부적절한 제한 |
| [CWE-942](https://cwe.mitre.org/data/definitions/942.html) | 신뢰할 수 없는 도메인과의 허용적인 크로스도메인 정책 |
| [CWE-1004](https://cwe.mitre.org/data/definitions/1004.html) | 'HttpOnly' 플래그 없는 민감 쿠키 |
| [CWE-1174](https://cwe.mitre.org/data/definitions/1174.html) | ASP.NET 설정 오류 - 부적절한 모델 유효성 검사 |
