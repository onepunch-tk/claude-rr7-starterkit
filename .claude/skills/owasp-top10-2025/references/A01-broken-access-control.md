# A01 Broken Access Control

## Background (배경)

Broken Access Control은 OWASP Top 10:2025에서 **1위**를 유지하고 있습니다. 테스트된 애플리케이션의 **100%**에서 어떤 형태로든 접근 제어 실패가 발견되었습니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 40개 |
| 최대 발생률 | 20.15% |
| 평균 발생률 | 3.74% |
| 최대 커버리지 | 100% |
| 평균 커버리지 | 42.93% |
| 총 발생 건수 | 1,839,701건 |
| 총 CVE | 32,654개 |

### 주요 관련 취약점
- CWE-200: 민감 정보 노출
- CWE-201: 전송 데이터를 통한 정보 노출
- CWE-918: 서버 사이드 요청 위조 (SSRF)
- CWE-352: 크로스 사이트 요청 위조 (CSRF)

## Description (설명)

접근 제어는 사용자가 허가된 권한 범위를 벗어나 작동하지 못하도록 정책을 시행합니다. 실패 시 일반적으로 무단 데이터 공개, 수정, 파괴 또는 승인되지 않은 비즈니스 기능 실행을 초래합니다.

### 일반적인 취약점 유형

1. **최소 권한 원칙 위반**: 특정 기능, 역할 또는 사용자 대신 누구에게나 접근 권한 부여
2. **접근 제어 우회**: URL, 애플리케이션 상태, HTML 또는 API 요청 수정을 통한 검사 우회
3. **안전하지 않은 직접 객체 참조 (IDOR)**: 고유 식별자를 통해 다른 사용자 계정에 접근
4. **API 접근 제어 누락**: POST, PUT, DELETE 작업에 대한 불충분한 제한
5. **권한 상승**: 로그인 없이 무단 접근 또는 허용된 권한 수준 초과
6. **메타데이터 조작**: JWT 변조, 쿠키 악용 또는 토큰 남용
7. **CORS 설정 오류**: 승인되지 않은 출처에서의 API 접근
8. **강제 브라우징**: 인증 또는 권한이 필요한 페이지에 URL 추측으로 접근

## How to Prevent (예방법)

1. **기본 거부 원칙**: 공개 리소스가 아닌 경우 "기본 거부" 정책 시행
2. **중앙 집중식 접근 제어**: 최소한의 CORS 사용으로 중앙 집중식 접근 제어 메커니즘 구현
3. **레코드 소유권 모델**: 무제한 데이터 작업 허용 대신 레코드 소유권 모델 사용
4. **비즈니스 제한 요구사항**: 도메인 모델을 통한 비즈니스 제한 요구사항 시행
5. **웹 서버 디렉토리 목록 비활성화**: 메타데이터와 백업 파일을 웹 루트에서 제거
6. **접근 실패 로깅**: 접근 실패를 로깅하고 관리자에게 적절히 알림
7. **속도 제한**: API에 속도 제한을 구현하여 자동화된 공격 완화
8. **세션 식별자 무효화**: 로그아웃 시 서버 측 세션 식별자 무효화; 단기 JWT 토큰 사용
9. **선언적 접근 제어 도구**: 선언적 접근 제어를 제공하는 확립된 툴킷 배포
10. **기능적 접근 제어 테스트**: 단위 및 통합 테스트에 기능적 접근 제어 테스트 포함

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 검증되지 않은 SQL 매개변수
```java
pstmt.setString(1, request.getParameter("acct"));
ResultSet results = pstmt.executeQuery();
```
공격자가 브라우저 매개변수를 수정합니다:
```
https://example.com/app/accountInfo?acct=notmyacct
```
적절한 검증 없이 무단 계정에 접근할 수 있습니다.

### 시나리오 #2 - 강제 브라우징
```
https://example.com/app/admin_getappInfo
```
관리자 접근 페이지가 인증되지 않은 사용자나 비관리자에게 직접 URL 접근으로 노출됩니다.

### 시나리오 #3 - 프론트엔드 전용 접근 제어
JavaScript 제한에도 불구하고, 공격자가 직접 curl 명령으로 보호를 우회합니다:
```bash
$ curl https://example.com/app/admin_getappInfo
```

## References (참고자료)

- [OWASP Proactive Controls: C1 - 접근 제어 구현](https://owasp.org/www-project-proactive-controls/)
- [OWASP ASVS: V8 권한 부여](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Testing Guide: 권한 부여 테스트](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [PortSwigger: CORS 설정 오류 악용](https://portswigger.net/web-security/cors)
- [OAuth 2.0: 접근 취소 표준](https://oauth.net/2/)

## List of Mapped CWEs (관련 CWE 목록)

### 경로 탐색 및 파일 접근
- [CWE-22](https://cwe.mitre.org/data/definitions/22.html): 경로 탐색
- [CWE-23](https://cwe.mitre.org/data/definitions/23.html): 상대 경로 탐색
- [CWE-36](https://cwe.mitre.org/data/definitions/36.html): 절대 경로 탐색
- [CWE-59](https://cwe.mitre.org/data/definitions/59.html): 심볼릭 링크 따라가기
- [CWE-61](https://cwe.mitre.org/data/definitions/61.html): UNIX 심볼릭 링크
- [CWE-65](https://cwe.mitre.org/data/definitions/65.html): Windows 하드 링크

### 정보 노출
- [CWE-200](https://cwe.mitre.org/data/definitions/200.html): 민감 정보 노출
- [CWE-201](https://cwe.mitre.org/data/definitions/201.html): 전송 데이터를 통한 정보 노출
- [CWE-219](https://cwe.mitre.org/data/definitions/219.html): 웹 루트 아래 민감 데이터 저장
- [CWE-359](https://cwe.mitre.org/data/definitions/359.html): 개인정보 침해
- [CWE-497](https://cwe.mitre.org/data/definitions/497.html): 시스템 데이터의 무단 클라이언트 노출
- [CWE-538](https://cwe.mitre.org/data/definitions/538.html): 파일 및 디렉토리 정보 삽입
- [CWE-540](https://cwe.mitre.org/data/definitions/540.html): 소스 코드에 민감 정보 포함
- [CWE-548](https://cwe.mitre.org/data/definitions/548.html): 디렉토리 목록을 통한 정보 노출
- [CWE-552](https://cwe.mitre.org/data/definitions/552.html): 외부 접근 가능한 파일/디렉토리
- [CWE-615](https://cwe.mitre.org/data/definitions/615.html): 주석에 민감 정보 포함
- [CWE-668](https://cwe.mitre.org/data/definitions/668.html): 잘못된 범위에 리소스 노출
- [CWE-922](https://cwe.mitre.org/data/definitions/922.html): 민감 정보의 안전하지 않은 저장

### 권한 및 소유권
- [CWE-276](https://cwe.mitre.org/data/definitions/276.html): 잘못된 기본 권한
- [CWE-281](https://cwe.mitre.org/data/definitions/281.html): 부적절한 권한 보존
- [CWE-282](https://cwe.mitre.org/data/definitions/282.html): 부적절한 소유권 관리
- [CWE-283](https://cwe.mitre.org/data/definitions/283.html): 미검증 소유권

### 접근 제어 및 권한 부여
- [CWE-284](https://cwe.mitre.org/data/definitions/284.html): 부적절한 접근 제어
- [CWE-285](https://cwe.mitre.org/data/definitions/285.html): 부적절한 권한 부여
- [CWE-352](https://cwe.mitre.org/data/definitions/352.html): 크로스 사이트 요청 위조 (CSRF)
- [CWE-425](https://cwe.mitre.org/data/definitions/425.html): 직접 요청 (강제 브라우징)
- [CWE-441](https://cwe.mitre.org/data/definitions/441.html): 의도하지 않은 프록시/중개자
- [CWE-566](https://cwe.mitre.org/data/definitions/566.html): SQL 클라이언트를 통한 사용자 제어 키 권한 부여 우회
- [CWE-601](https://cwe.mitre.org/data/definitions/601.html): 신뢰할 수 없는 사이트로의 URL 리디렉션
- [CWE-639](https://cwe.mitre.org/data/definitions/639.html): 사용자 제어 키를 통한 권한 부여 우회
- [CWE-749](https://cwe.mitre.org/data/definitions/749.html): 위험한 메서드/함수 노출
- [CWE-862](https://cwe.mitre.org/data/definitions/862.html): 누락된 권한 부여
- [CWE-863](https://cwe.mitre.org/data/definitions/863.html): 잘못된 권한 부여
- [CWE-918](https://cwe.mitre.org/data/definitions/918.html): 서버 사이드 요청 위조 (SSRF)

### 리소스 보안
- [CWE-377](https://cwe.mitre.org/data/definitions/377.html): 안전하지 않은 임시 파일
- [CWE-379](https://cwe.mitre.org/data/definitions/379.html): 잘못된 권한으로 임시 파일 생성
- [CWE-402](https://cwe.mitre.org/data/definitions/402.html): 다른 범위로 리소스 전송
- [CWE-424](https://cwe.mitre.org/data/definitions/424.html): 신뢰 경계의 부적절한 보호
- [CWE-732](https://cwe.mitre.org/data/definitions/732.html): 중요 리소스에 대한 잘못된 권한 할당
- [CWE-1275](https://cwe.mitre.org/data/definitions/1275.html): 민감 쿠키에 부적절한 SameSite 속성
