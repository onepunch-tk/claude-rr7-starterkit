# A04 Cryptographic Failures

## Background (배경)

Cryptographic Failures는 OWASP Top 10:2025에서 **4위**로 이동했습니다. 이 취약점은 암호화 부재, 불충분하게 강력한 암호화, 암호화 키 유출 및 관련 오류와 관련된 실패에 중점을 둡니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 32개 |
| 최대 발생률 | 13.77% |
| 평균 발생률 | 3.80% |
| 총 발생 건수 | 1,665,348건 |
| 총 CVE | 2,185개 |

### 주요 관련 취약점
- CWE-327: 손상되거나 위험한 암호화 알고리즘
- CWE-331: 불충분한 엔트로피
- CWE-1241: 난수 생성기의 예측 가능한 알고리즘
- CWE-338: 약한 의사 난수 생성기

## Description (설명)

모든 전송 중인 데이터는 전송 계층 암호화를 사용해야 합니다. CPU 가속(AES 명령어)과 간소화된 인증서 관리(LetsEncrypt)를 통해 현대 솔루션은 이전의 장벽을 해결합니다.

전송 보안 외에도 조직은 다음을 암호화해야 합니다:
- 저장 중인 민감한 데이터
- 비밀번호, 신용카드 번호, 건강 기록
- GDPR 또는 PCI DSS 대상 개인 데이터

### 주요 우려 사항

1. **오래되거나 약한 암호화 알고리즘**
2. **약하거나 기본 암호화 키**
3. **소스 코드에 체크인된 키**
4. **누락된 보안 헤더**
5. **유효하지 않은 인증서 체인 검증**
6. **부적절한 초기화 벡터**
7. **비밀번호를 암호화 키로 사용**
8. **약한 무작위성 구현**
9. **사용 중단된 해시 함수 (MD5, SHA1)**
10. **악용 가능한 암호화 오류 메시지**
11. **알고리즘 다운그레이드 가능성**

## How to Prevent (예방법)

### 최소 보호 조치

1. **데이터 분류**: 개인정보 보호법 및 비즈니스 요구사항에 따라 민감한 데이터 식별
2. **키 저장**: 중요한 키에 대해 하드웨어 또는 클라우드 HSM 사용
3. **알고리즘 선택**: 신뢰할 수 있는 암호화 구현 사용
4. **데이터 최소화**: 불필요한 민감한 데이터 폐기 또는 PCI DSS 토큰화 사용
5. **암호화 표준**: TLS 1.2+ 시행, 순방향 비밀성 암호, CBC 지원 중단, 양자 내성 알고리즘 준비
6. **캐시 제어**: CDN 및 애플리케이션 계층에서 민감한 응답에 대한 캐싱 비활성화
7. **프로토콜 보안**: 암호화되지 않은 프로토콜(FTP, 암호화되지 않은 SMTP, STARTTLS) 사용 금지
8. **비밀번호 해싱**: 강력하고 솔트된 함수 사용 — Argon2, yescrypt, scrypt 또는 PBKDF2-HMAC-SHA-512
9. **초기화 벡터**: 암호학적으로 안전한 PRNG 사용; 고정 키로 IV 재사용 금지
10. **인증**: 항상 인증된 암호화 사용
11. **키 생성**: 키를 암호학적으로 무작위로 생성하고 바이트 배열로 저장
12. **무작위성**: 예측 가능한 시딩 없이 암호학적 무작위성 보장
13. **사용 중단된 함수**: MD5, SHA1, CBC 모드, PKCS 1 v1.5 제거
14. **포스트 양자 준비**: 2030년 말까지 포스트 양자 암호화 준비

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 세션 하이재킹
```
공격자가 안전하지 않은 무선 네트워크를 통해 트래픽을 모니터링하고,
HTTPS를 HTTP로 다운그레이드하고, 요청을 가로채고,
세션 쿠키를 훔치고, 인증된 세션을 하이재킹하여
개인 데이터나 거래 세부 정보에 접근하거나 수정합니다.
```

### 시나리오 #2 - 데이터베이스 침해
```
솔트되지 않거나 단순한 해시를 사용하는 비밀번호 데이터베이스가
파일 업로드 취약점을 통해 노출됩니다.
공격자는 미리 계산된 레인보우 테이블을 사용하거나
약한 함수로 생성된 솔트된 해시에 대해서도
GPU 가속 크래킹을 사용합니다.
```

## References (참고자료)

- [OWASP Proactive Controls: C2 (데이터 보호를 위한 암호화)](https://owasp.org/www-project-proactive-controls/)
- [OWASP ASVS: V11, V12, V14](https://owasp.org/www-project-application-security-verification-standard/)
- [Transport Layer Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
- [User Privacy Protection Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [HSTS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
- [OWASP Testing Guide: 약한 암호화 평가](https://owasp.org/www-project-web-security-testing-guide/)
- [ENISA: 포스트 양자 암호화 구현 로드맵](https://www.enisa.europa.eu/)
- [NIST: 포스트 양자 암호화 표준 (2024)](https://csrc.nist.gov/Projects/Post-Quantum-Cryptography)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-261](https://cwe.mitre.org/data/definitions/261.html) | 비밀번호의 약한 인코딩 |
| [CWE-296](https://cwe.mitre.org/data/definitions/296.html) | 인증서 신뢰 체인의 부적절한 따름 |
| [CWE-319](https://cwe.mitre.org/data/definitions/319.html) | 민감 정보의 평문 전송 |
| [CWE-320](https://cwe.mitre.org/data/definitions/320.html) | 키 관리 오류 |
| [CWE-321](https://cwe.mitre.org/data/definitions/321.html) | 하드코딩된 암호화 키 |
| [CWE-322](https://cwe.mitre.org/data/definitions/322.html) | 엔티티 인증 없는 키 교환 |
| [CWE-323](https://cwe.mitre.org/data/definitions/323.html) | 암호화에서 Nonce/키 쌍 재사용 |
| [CWE-324](https://cwe.mitre.org/data/definitions/324.html) | 만료 후 키 사용 |
| [CWE-325](https://cwe.mitre.org/data/definitions/325.html) | 필수 암호화 단계 누락 |
| [CWE-326](https://cwe.mitre.org/data/definitions/326.html) | 부적절한 암호화 강도 |
| [CWE-327](https://cwe.mitre.org/data/definitions/327.html) | 손상되거나 위험한 암호화 알고리즘 |
| [CWE-328](https://cwe.mitre.org/data/definitions/328.html) | 가역적인 단방향 해시 |
| [CWE-329](https://cwe.mitre.org/data/definitions/329.html) | CBC 모드에서 비무작위 IV |
| [CWE-330](https://cwe.mitre.org/data/definitions/330.html) | 불충분하게 무작위인 값 |
| [CWE-331](https://cwe.mitre.org/data/definitions/331.html) | 불충분한 엔트로피 |
| [CWE-332](https://cwe.mitre.org/data/definitions/332.html) | PRNG의 불충분한 엔트로피 |
| [CWE-334](https://cwe.mitre.org/data/definitions/334.html) | 작은 무작위 값 공간 |
| [CWE-335](https://cwe.mitre.org/data/definitions/335.html) | 잘못된 PRNG 시드 사용 |
| [CWE-336](https://cwe.mitre.org/data/definitions/336.html) | PRNG에서 동일한 시드 |
| [CWE-337](https://cwe.mitre.org/data/definitions/337.html) | 예측 가능한 PRNG 시드 |
| [CWE-338](https://cwe.mitre.org/data/definitions/338.html) | 약한 의사 난수 생성기 |
| [CWE-340](https://cwe.mitre.org/data/definitions/340.html) | 예측 가능한 숫자/식별자 생성 |
| [CWE-342](https://cwe.mitre.org/data/definitions/342.html) | 이전 값에서 예측 가능한 값 |
| [CWE-347](https://cwe.mitre.org/data/definitions/347.html) | 부적절한 암호화 서명 검증 |
| [CWE-523](https://cwe.mitre.org/data/definitions/523.html) | 보호되지 않은 자격 증명 전송 |
| [CWE-757](https://cwe.mitre.org/data/definitions/757.html) | 협상 중 알고리즘 다운그레이드 |
| [CWE-759](https://cwe.mitre.org/data/definitions/759.html) | 솔트 없는 단방향 해시 |
| [CWE-760](https://cwe.mitre.org/data/definitions/760.html) | 예측 가능한 솔트를 사용한 단방향 해시 |
| [CWE-780](https://cwe.mitre.org/data/definitions/780.html) | OAEP 없는 RSA 알고리즘 |
| [CWE-916](https://cwe.mitre.org/data/definitions/916.html) | 비밀번호 해시 계산 노력 부족 |
| [CWE-1240](https://cwe.mitre.org/data/definitions/1240.html) | 위험한 구현의 암호화 기본 요소 |
| [CWE-1241](https://cwe.mitre.org/data/definitions/1241.html) | 난수 생성기의 예측 가능한 알고리즘 |
