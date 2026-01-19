# A09 Security Logging and Alerting Failures

## Background (배경)

이 취약점 카테고리는 OWASP Top 10:2025에서 **9위**를 유지하며, 이전 목록에서 해당 위치를 유지합니다. 보안 이벤트에 대한 대응을 트리거하는 알림의 역할을 강조하기 위해 이름이 업데이트되었습니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 5개 |
| 최대 발생률 | 11.33% |
| 평균 발생률 | 3.91% |
| 평균 가중 영향 | 2.65 |
| 총 CVE | 723개 |

### 특징
최소한의 CVE 대표성에도 불구하고 이 카테고리는 사고 감지 및 포렌식 기능에 상당한 영향을 미칩니다.

## Description (설명)

핵심 문제는 조직이 침해를 감지하고 효과적으로 대응하는 것을 방해하는 **부적절한 로깅, 모니터링 및 알림 메커니즘**입니다.

### 로깅 결함

1. **감사 가능한 이벤트의 일관성 없는 로깅**: 로그인, 실패한 인증 시도, 트랜잭션
2. **경고 및 오류에 대한 부적절하거나 불분명한 로그 메시지**
3. **변조에 취약한 보호되지 않은 로그 무결성**
4. **적절한 백업 없이 로컬에만 저장**

### 모니터링 및 감지 실패

5. **실시간 또는 거의 실시간 공격 감지 기능 없음**
6. **모니터링되지 않는 애플리케이션 및 API 로그**
7. **누락되거나 비효과적인 알림 임계값**
8. **침투 테스트 도구가 알림을 트리거하지 않음**

### 민감한 데이터 위험

9. **로깅해서는 안 되는 민감한 정보(PII 또는 PHI 등) 로깅**
10. **무단 사용자 또는 공격자에게 로그 가시성**

### 운영 문제

11. **불완전한 오류 및 예외 처리**
12. **오래되거나 누락된 알림 사용 사례**
13. **SOC 팀을 압도하는 과도한 오탐**
14. **불완전한 사고 플레이북**

## How to Prevent (예방법)

### 구현 제어

#### 로깅 기반
1. **모든 로그인 시도, 접근 제어 실패 및 유효성 검사 실패를 충분한 사용자 컨텍스트와 함께 로깅**
2. **보안 제어 결과(성공 및 실패) 문서화**
3. **로깅 또는 모니터링 시스템에 대한 인젝션 또는 공격을 방지하기 위해 로그 데이터가 올바르게 인코딩되었는지 확인**
4. **관리 솔루션과 호환되는 형식으로 로그 생성**

#### 데이터 무결성
5. **변조 또는 삭제를 방지하기 위한 무결성 제어가 있는 감사 추적 보장**: 추가 전용 데이터베이스 테이블 또는 유사한 방식
6. **실패한 트랜잭션에 대한 롤백 메커니즘 구현**

#### 알림 전략
7. **의심스러운 활동에 대한 행동 모니터링 수립**
8. **알림 구현을 위한 개발자 지침 개발**
9. **오탐 없이 공격자를 잡기 위한 허니토큰 생성**

#### 조직적 접근
10. **DevSecOps 팀이 문서화된 플레이북과 함께 효과적인 모니터링 사용 사례 수립**
11. **사고 대응 프레임워크 구현 또는 채택 (NIST 800-61r2 이상)**
12. **개발자에게 애플리케이션 공격 인식 교육**
13. **오탐을 줄이기 위한 AI/행동 분석 도구 고려**

### 기술 솔루션

사용 가능한 도구:
- OWASP ModSecurity Core Rule Set
- ELK Stack (Elasticsearch, Logstash, Kibana)
- 실시간 공격 대응을 지원하는 상용 관찰 가능성 플랫폼

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 아동 건강 계획 침해
```
건강 계획 운영자가 350만 명의 아동 기록에 영향을 미치는 대규모 침해를 경험했습니다.
모니터링과 로깅의 부재로 침해가
"2013년 이후, 7년 이상의 기간" 동안 감지되지 않고 지속되었을 수 있습니다.
사후 검토에서 개발자들이 중요한 취약점을 해결하지 않았음이 밝혀졌습니다.
```

### 시나리오 #2 - 항공사 데이터 노출
```
주요 인도 항공사가 서드파티 클라우드 제공업체에서
10년간의 승객 데이터(여권, 신용카드) 침해를 겪었습니다.
침해는 외부 알림 후에야 발견되었습니다.
```

### 시나리오 #3 - GDPR 위반
```
유럽 항공사가 400,000건 이상의 고객 결제 기록을 침해한
결제 애플리케이션 악용을 통해 GDPR 신고 대상 침해를 경험하여
2천만 파운드의 규제 벌금이 부과되었습니다.
```

## References (참고자료)

- [OWASP Proactive Controls: C9: 로깅 및 모니터링 구현](https://owasp.org/www-project-proactive-controls/)
- [OWASP ASVS: V16 보안 로깅 및 오류 처리](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet: Application Logging Vocabulary](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html)
- [OWASP Cheat Sheet: Logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [NIST SP 1800-11: 데이터 무결성—랜섬웨어로부터 복구](https://www.nccoe.nist.gov/projects/building-blocks/data-integrity/recover)
- [NIST SP 1800-25: 데이터 무결성—자산 식별 및 보호](https://www.nccoe.nist.gov/projects/building-blocks/data-integrity/identify-protect)
- [NIST SP 1800-26: 데이터 무결성—랜섬웨어 감지 및 대응](https://www.nccoe.nist.gov/projects/building-blocks/data-integrity/detect-respond)
- [Huntress Threat Library: 실제 Snowflake 침해 사례](https://www.huntress.com/threat-library)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-117](https://cwe.mitre.org/data/definitions/117.html) | 로그에 대한 부적절한 출력 중화 |
| [CWE-221](https://cwe.mitre.org/data/definitions/221.html) | 누락으로 인한 정보 손실 |
| [CWE-223](https://cwe.mitre.org/data/definitions/223.html) | 보안 관련 정보 누락 |
| [CWE-532](https://cwe.mitre.org/data/definitions/532.html) | 로그 파일에 민감 정보 삽입 |
| [CWE-778](https://cwe.mitre.org/data/definitions/778.html) | 불충분한 로깅 |
