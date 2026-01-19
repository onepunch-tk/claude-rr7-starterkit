# A10 Mishandling of Exceptional Conditions

## Background (배경)

이것은 **2025년의 새로운 카테고리**로, 부적절한 오류 처리와 논리적 실패에 초점을 맞춘 24개의 CWE를 포함합니다. 이 카테고리는 애플리케이션이 비정상적인 조건을 방지, 감지 또는 적절하게 대응하지 못하는 상황을 다룹니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 24개 |
| 총 발생 건수 | 769,581건 |
| 총 CVE | 3,416개 |
| 평균 익스플로잇 난이도 | 7.11 |
| 평균 영향 점수 | 3.81 |

### 주목할 만한 취약점
- 오류 메시지를 통한 민감 정보 공개
- NULL 포인터 역참조
- "실패 시 열림(Fail Open)" 방식의 시스템

## Description (설명)

애플리케이션이 비정상적인 상황을 효과적으로 관리할 수 없을 때 예외 조건을 잘못 처리하며, 이는 잠재적인 충돌, 예측할 수 없는 동작 및 취약점을 초래합니다.

### 핵심 실패 차원

1. **예방 격차**: 애플리케이션에 비정상적인 상황에 대한 보호 장치 부재
2. **감지 실패**: 시스템이 발생하는 비정상적인 조건을 인식하지 못함
3. **대응 결함**: 감지된 문제에 대한 부적절하거나 부재한 대응

### 근본 원인

- 불충분한 입력 유효성 검사
- 늦은 단계의 오류 처리
- 예상치 못한 환경 상태 (메모리, 권한, 네트워크 문제)
- 시스템을 불안정한 상태로 두는 처리되지 않은 예외

### 보안 영향

로직 버그, 오버플로우, 레이스 컨디션, 사기 거래, 인증/권한 부여 실패에 이르기까지 시스템 기밀성, 가용성 및 데이터 무결성에 영향을 미칩니다.

## How to Prevent (예방법)

### 핵심 전략

#### 사전 예방적 예외 관리
1. **잠재적 실패 예측 및 원점에서 시스템 오류 포착**
2. **문제를 해결하고 복구를 가능하게 하는 의미 있는 오류 처리 구현**
3. **사용자 친화적인 오류 알림 및 이벤트 로깅 제공**
4. **안전망으로 전역 예외 핸들러 배포**

#### 트랜잭션 무결성
5. **다단계 트랜잭션에 대한 완전한 롤백 절차 구현 (실패 시 닫힘)**
6. **복구 불가능한 오류를 생성하는 부분 트랜잭션 복구 방지**

#### 리소스 관리
7. **속도 제한, 할당량, 스로틀링 및 리소스 제약 적용**
8. **서비스 거부 공격을 가능하게 하는 무제한 리소스 소비 방지**
9. **개별 로깅 대신 반복 오류에 대한 통계적 보고 구현**

#### 구조적 개선
10. **일관성을 위해 조직 전체의 오류 처리 중앙화**
11. **적절한 삭제와 함께 엄격한 입력 유효성 검사 수행**
12. **위협 모델링 및 보안 설계 검토 수행**
13. **코드 검토, 정적 분석, 스트레스 테스트 및 침투 테스트 실행**
14. **예외 처리를 위한 조직 보안 표준 수립**

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 리소스 고갈 (DoS)
```
애플리케이션이 파일 업로드 예외를 잡지만
잠긴 리소스를 해제하지 못합니다.
각 예외가 모든 리소스가 고갈될 때까지 문제를 악화시켜
서비스 불가능을 초래합니다.
```

### 시나리오 #2 - 정보 공개
```
데이터베이스 오류가 사용자에게 민감한 시스템 정보를 노출합니다.
공격자는 정찰 데이터를 수집하기 위해 의도적으로 오류를 트리거하고,
공개된 세부 정보를 사용하여 정교한 SQL 인젝션 공격을 만듭니다.
```

### 시나리오 #3 - 금융 거래 남용
```
다단계 트랜잭션(계정 인출 → 목적지 입금 → 트랜잭션 로깅) 중
네트워크 중단이 부분 완료를 초래합니다.
적절한 롤백 메커니즘 없이 공격자는 시퀀스를 조작하여
레이스 컨디션을 통해 계정을 고갈시키거나 중복 이체를 실행합니다.
```

## References (참고자료)

### OWASP 리소스
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [OWASP ASVS V16.5 Error Handling](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x25-V16-Security-Logging-and-Error-Handling.md#v165-error-handling)
- [OWASP Web Security Testing Guide - Error Handling](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/08-Testing_for_Error_Handling/01-Testing_For_Improper_Error_Handling)

### 산업 리소스
- [Microsoft .NET Best Practices for Exceptions](https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)
- [Clean Code and Exception Handling (Toptal)](https://www.toptal.com/developers/abap/clean-code-and-the-art-of-exception-handling)
- [Google Developers - Error Handling Rules](https://developers.google.com/tech-writing/error-messages/error-handling)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-209](https://cwe.mitre.org/data/definitions/209.html) | 민감 정보를 포함한 오류 메시지 생성 |
| [CWE-215](https://cwe.mitre.org/data/definitions/215.html) | 디버깅 코드에 민감 정보 삽입 |
| [CWE-234](https://cwe.mitre.org/data/definitions/234.html) | 누락된 매개변수 처리 실패 |
| [CWE-235](https://cwe.mitre.org/data/definitions/235.html) | 추가 매개변수의 부적절한 처리 |
| [CWE-248](https://cwe.mitre.org/data/definitions/248.html) | 잡히지 않은 예외 |
| [CWE-252](https://cwe.mitre.org/data/definitions/252.html) | 검사되지 않은 반환 값 |
| [CWE-274](https://cwe.mitre.org/data/definitions/274.html) | 불충분한 권한의 부적절한 처리 |
| [CWE-280](https://cwe.mitre.org/data/definitions/280.html) | 불충분한 권한 또는 특권의 부적절한 처리 |
| [CWE-369](https://cwe.mitre.org/data/definitions/369.html) | 0으로 나누기 |
| [CWE-390](https://cwe.mitre.org/data/definitions/390.html) | 조치 없는 오류 조건 감지 |
| [CWE-391](https://cwe.mitre.org/data/definitions/391.html) | 검사되지 않은 오류 조건 |
| [CWE-394](https://cwe.mitre.org/data/definitions/394.html) | 예기치 않은 상태 코드 또는 반환 값 |
| [CWE-396](https://cwe.mitre.org/data/definitions/396.html) | 제네릭 예외에 대한 Catch 선언 |
| [CWE-397](https://cwe.mitre.org/data/definitions/397.html) | 제네릭 예외에 대한 Throws 선언 |
| [CWE-460](https://cwe.mitre.org/data/definitions/460.html) | 예외 발생 시 부적절한 정리 |
| [CWE-476](https://cwe.mitre.org/data/definitions/476.html) | NULL 포인터 역참조 |
| [CWE-478](https://cwe.mitre.org/data/definitions/478.html) | 다중 조건 표현식에서 기본 케이스 누락 |
| [CWE-484](https://cwe.mitre.org/data/definitions/484.html) | Switch에서 Break 문 누락 |
| [CWE-550](https://cwe.mitre.org/data/definitions/550.html) | 민감 정보를 포함한 서버 생성 오류 메시지 |
| [CWE-636](https://cwe.mitre.org/data/definitions/636.html) | 안전하게 실패하지 않음 ('실패 시 열림') |
| [CWE-703](https://cwe.mitre.org/data/definitions/703.html) | 예외 조건의 부적절한 검사 또는 처리 |
| [CWE-754](https://cwe.mitre.org/data/definitions/754.html) | 비정상적이거나 예외적인 조건에 대한 부적절한 검사 |
| [CWE-755](https://cwe.mitre.org/data/definitions/755.html) | 예외 조건의 부적절한 처리 |
| [CWE-756](https://cwe.mitre.org/data/definitions/756.html) | 사용자 정의 오류 페이지 누락 |
