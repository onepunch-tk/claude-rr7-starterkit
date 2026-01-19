# A07 Authentication Failures

## Background (배경)

Authentication Failures는 36개의 매핑된 CWE와 함께 정제된 이름으로 **7위**를 유지했습니다. 주요 취약점에는 하드코딩된 비밀번호, 인증서 유효성 검사 실패, 부적절한 인증, 세션 고정 및 자격 증명 오용이 포함됩니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 36개 |
| 최대 발생률 | 15.80% |
| 평균 발생률 | 2.92% |
| 총 발생 건수 | 1,120,673건 |
| 총 CVE | 7,147개 |

## Description (설명)

### 취약점 조건

애플리케이션은 다음과 같은 경우 취약합니다:

1. **자동화된 공격 허용**: 공격자가 유효한 사용자 이름과 비밀번호의 유출된 목록을 가지고 있는 크리덴셜 스터핑과 같은 자동화된 공격 허용, 또는 하이브리드 비밀번호 스프레이 변형(Password1!, Password2! 등)
2. **속도 제한 부재**: 빠른 차단 없이 무차별 대입 또는 스크립트 공격 허용
3. **약한 자격 증명 수락**: "admin/admin" 또는 "Password1"과 같은 기본/약한 비밀번호 허용
4. **침해된 자격 증명으로 계정 생성 허용**: 알려진 침해된 자격 증명을 사용한 가입 허용
5. **약한 비밀번호 복구**: 지식 기반 답변과 같은 비효과적인 프로세스 사용
6. **열악한 자격 증명 저장**: 비밀번호를 평문, 암호화 또는 약한 해시 형식으로 저장
7. **불충분한 MFA**: 다중 인증 구현 누락 또는 비효과적
8. **약한 MFA 대체**: MFA를 사용할 수 없을 때 비효과적인 대안
9. **안전하지 않은 세션 관리**: URL에 세션 ID 노출 또는 로그인 후 식별자 재사용
10. **부적절한 세션 무효화**: 로그아웃 또는 비활성 시 토큰을 올바르게 무효화하지 않음
11. **자격 증명 범위 문제**: 자격 증명의 의도된 청중/범위를 주장하지 않음

## How to Prevent (예방법)

### 인증 강화

1. **다중 인증 구현**: 크리덴셜 스터핑 및 재사용 공격을 차단하기 위한 다중 인증 구현
2. **비밀번호 관리자 장려**: 더 강력한 사용자 선택을 위한 비밀번호 관리자 장려
3. **기본 자격 증명으로 배포 금지**: 특히 관리자 계정의 기본 자격 증명으로 배포하지 않음

### 비밀번호 정책 개선

4. **약한 비밀번호 검사 구현**: 상위 10,000개 최악의 비밀번호 목록에 대해 새로운 또는 변경된 비밀번호 테스트
5. **침해된 자격 증명 데이터베이스 검증**: haveibeenpwned.com에 대해 새 비밀번호 검증
6. **NIST 가이드라인 준수**: NIST 800-63b 가이드라인에 정책 맞춤
7. **강제 교체 제거**: 침해가 의심되지 않는 한 강제 교체 제거; 침해된 경우 즉시 재설정

### 계정 보호

8. **등록/복구 경로 강화**: 일관된 메시징을 사용하여 열거에 대해 등록/복구 경로 강화: "잘못된 사용자 이름 또는 비밀번호."
9. **실패한 로그인 시도 제한/지연**: 서비스 거부를 피하면서 제한/지연

### 세션 관리

10. **서버 측 세션 관리자 사용**: 로그인 후 높은 엔트로피의 새 무작위 세션 ID를 생성하는 서버 측, 안전한, 내장 세션 관리자 사용
11. **쿠키에 세션 안전하게 저장**: URL이 아닌 쿠키에 세션 저장
12. **로그아웃, 유휴 타임아웃 및 절대 타임아웃 후 무효화**

### 리스크 이전

13. **확립되고 잘 테스트된 인증 시스템 활용**: 직접 구축하기보다 구매
14. **JWT 클레임 검증**: `aud`, `iss` 및 스코프 포함

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 하이브리드 크리덴셜 스터핑
```
공격자가 패턴에 따라 알려진 비밀번호를 조정합니다
(Winter2025→Winter2026, ILoveMyDog6→ILoveMyDog7).
자동화된 위협 방어 없이 애플리케이션은
자격 증명을 검증하고 무단 접근을 가능하게 하는
"비밀번호 오라클" 역할을 합니다.
```

### 시나리오 #2 - 다중 인증 격차
```
"대부분의 성공적인 인증 공격은
비밀번호를 유일한 인증 요소로 계속 사용하기 때문에 발생합니다."
NIST는 비밀번호 재사용을 장려하는 교체/복잡성 요구사항을
포기하고 대신 MFA를 시행할 것을 권장합니다.
```

### 시나리오 #3 - 세션 타임아웃 실패
```
사용자가 공용 컴퓨터에서 로그아웃하지 않고 브라우저를 닫습니다.
적절한 Single Logout(SLO)에 실패한 Single Sign-On(SSO) 시스템은
사용자를 여러 서비스에서 인증된 상태로 유지하여
동료/공격자가 잠금 해제된 시스템에 접근할 수 있게 합니다.
```

## References (참고자료)

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Secure Coding Practices Quick Reference Guide](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [NIST SP 800-63b: Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html)

## List of Mapped CWEs (관련 CWE 목록)

### 자격 증명 및 비밀번호 문제
| CWE ID | 설명 |
|--------|------|
| [CWE-258](https://cwe.mitre.org/data/definitions/258.html) | 설정 파일에 빈 비밀번호 |
| [CWE-259](https://cwe.mitre.org/data/definitions/259.html) | 하드코딩된 비밀번호 |
| [CWE-521](https://cwe.mitre.org/data/definitions/521.html) | 약한 비밀번호 요구사항 |
| [CWE-798](https://cwe.mitre.org/data/definitions/798.html) | 하드코딩된 자격 증명 |
| [CWE-1391](https://cwe.mitre.org/data/definitions/1391.html) | 약한 자격 증명 사용 |
| [CWE-1392](https://cwe.mitre.org/data/definitions/1392.html) | 기본 자격 증명 사용 |
| [CWE-1393](https://cwe.mitre.org/data/definitions/1393.html) | 기본 비밀번호 사용 |

### 인증 우회
| CWE ID | 설명 |
|--------|------|
| [CWE-287](https://cwe.mitre.org/data/definitions/287.html) | 부적절한 인증 |
| [CWE-288](https://cwe.mitre.org/data/definitions/288.html) | 대체 경로/채널을 사용한 우회 |
| [CWE-289](https://cwe.mitre.org/data/definitions/289.html) | 대체 이름을 사용한 우회 |
| [CWE-290](https://cwe.mitre.org/data/definitions/290.html) | 스푸핑을 사용한 우회 |
| [CWE-302](https://cwe.mitre.org/data/definitions/302.html) | 불변으로 가정된 데이터를 사용한 우회 |
| [CWE-305](https://cwe.mitre.org/data/definitions/305.html) | 기본 취약점을 사용한 우회 |

### 인증 메커니즘
| CWE ID | 설명 |
|--------|------|
| [CWE-304](https://cwe.mitre.org/data/definitions/304.html) | 중요 단계 누락 |
| [CWE-306](https://cwe.mitre.org/data/definitions/306.html) | 중요 기능에 대한 인증 누락 |
| [CWE-307](https://cwe.mitre.org/data/definitions/307.html) | 과도한 시도의 부적절한 제한 |
| [CWE-308](https://cwe.mitre.org/data/definitions/308.html) | 단일 요소 인증 |
| [CWE-309](https://cwe.mitre.org/data/definitions/309.html) | 기본 인증으로서의 비밀번호 시스템 |
| [CWE-1390](https://cwe.mitre.org/data/definitions/1390.html) | 약한 인증 |

### 인증서 및 채널 검증
| CWE ID | 설명 |
|--------|------|
| [CWE-295](https://cwe.mitre.org/data/definitions/295.html) | 부적절한 인증서 유효성 검사 |
| [CWE-297](https://cwe.mitre.org/data/definitions/297.html) | 호스트 불일치를 가진 인증서 유효성 검사 |
| [CWE-298](https://cwe.mitre.org/data/definitions/298.html) | 부적절한 인증서 만료 유효성 검사 |
| [CWE-299](https://cwe.mitre.org/data/definitions/299.html) | 인증서 취소 확인 부적절 |
| [CWE-300](https://cwe.mitre.org/data/definitions/300.html) | 비종단점에 의해 접근 가능한 채널 |
| [CWE-346](https://cwe.mitre.org/data/definitions/346.html) | 출처 유효성 검사 오류 |
| [CWE-350](https://cwe.mitre.org/data/definitions/350.html) | 보안을 위한 역방향 DNS에 의존 |
| [CWE-940](https://cwe.mitre.org/data/definitions/940.html) | 통신 채널의 부적절한 검증 |
| [CWE-941](https://cwe.mitre.org/data/definitions/941.html) | 잘못 지정된 목적지 |

### 세션 및 복구 문제
| CWE ID | 설명 |
|--------|------|
| [CWE-291](https://cwe.mitre.org/data/definitions/291.html) | 인증을 위한 IP 주소에 의존 |
| [CWE-293](https://cwe.mitre.org/data/definitions/293.html) | 인증을 위한 Referer 필드 사용 |
| [CWE-294](https://cwe.mitre.org/data/definitions/294.html) | 캡처-리플레이를 사용한 우회 |
| [CWE-303](https://cwe.mitre.org/data/definitions/303.html) | 잘못된 알고리즘 구현 |
| [CWE-384](https://cwe.mitre.org/data/definitions/384.html) | 세션 고정 |
| [CWE-613](https://cwe.mitre.org/data/definitions/613.html) | 불충분한 세션 만료 |
| [CWE-620](https://cwe.mitre.org/data/definitions/620.html) | 미검증 비밀번호 변경 |
| [CWE-640](https://cwe.mitre.org/data/definitions/640.html) | 약한 비밀번호 복구 메커니즘 |
