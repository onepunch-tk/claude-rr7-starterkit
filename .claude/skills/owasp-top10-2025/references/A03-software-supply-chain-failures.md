# A03 Software Supply Chain Failures

## Background (배경)

Software Supply Chain Failures는 커뮤니티 설문조사에서 **50%의 응답자가 최고 위험으로 선정**하여 1위를 기록했습니다. 2013년 "A9 – 알려진 취약점이 있는 컴포넌트 사용"에서 진화하여 모든 공급망 침해 유형을 포함하도록 범위가 확장되었습니다.

### 통계 데이터
| 항목 | 수치 |
|------|------|
| 매핑된 CWE | 6개 |
| 최대 발생률 | 9.56% |
| 평균 발생률 | 5.72% |
| 총 발생 건수 | 215,248건 |
| 총 CVE | 11개 |

### 주요 특징
- 테스트 시 **평균 발생률 5.19%**로 가장 높은 발생률 기록
- 더 넓은 범위에도 불구하고 관련 CWE에 매핑된 CVE는 11개에 불과

## Description (설명)

**"소프트웨어 공급망 실패는 소프트웨어를 빌드, 배포 또는 업데이트하는 과정에서의 붕괴 또는 기타 침해입니다."**

### 취약점 조건

조직은 다음과 같은 경우 취약해집니다:

1. **컴포넌트 버전 추적 실패**: 직접 및 전이 종속성을 포함한 컴포넌트 버전을 종합적으로 추적하지 않음
2. **오래된 소프트웨어 배포**: 지원되지 않거나 오래된 소프트웨어(OS, 서버, 데이터베이스, 라이브러리, 런타임) 배포
3. **정기적인 취약점 스캔 부재**: 정기적인 취약점 스캔 또는 보안 게시판 구독 부재
4. **변경 관리 문서화 부재**: CI/CD, 저장소, IDE, 아티팩트 저장소에 대한 변경 관리 문서화 부재
5. **불충분한 접근 제어**: 공급망 전반에 걸친 불충분한 접근 제어 및 권한 제한
6. **누락된 직무 분리**: 코드 승격 워크플로우에서 누락된 직무 분리
7. **신뢰할 수 없는 소스 컴포넌트**: 프로덕션 환경에서 신뢰할 수 없는 소스 컴포넌트 사용
8. **지연된 패치**: 드물게 진행되는 변경 제어 주기(월간/분기별)로 인한 패치 지연
9. **호환성 테스트 생략**: 라이브러리 업데이트에 대한 호환성 테스트 생략
10. **약한 CI/CD 보안**: 프로덕션 시스템 대비 약한 CI/CD 보안

## How to Prevent (예방법)

### 패치 관리 프로세스

1. **중앙 집중식 SBOM 생성**: 중앙 집중식 소프트웨어 자재 명세서(SBOM) 생성
2. **전이 종속성 종합 추적**: 전이 종속성을 포함한 종합적인 추적
3. **미사용 컴포넌트 제거**: 미사용 컴포넌트 제거를 통한 공격 표면 감소
4. **버전 인벤토리 지속 관리**: OWASP Dependency Track, OWASP Dependency Check, retire.js 같은 도구를 사용하여 클라이언트/서버 컴포넌트 버전 지속적 인벤토리
5. **취약점 데이터베이스 모니터링**: CVE, NVD, Open Source Vulnerabilities(OSV) 데이터베이스 모니터링
6. **공식 신뢰할 수 있는 소스에서만 컴포넌트 조달**: 보안 링크를 통해 공식 신뢰할 수 있는 소스에서만 컴포넌트 조달
7. **서명된 패키지 우선 사용**: 악의적인 수정을 방지하기 위해 서명된 패키지 우선
8. **의도적인 종속성 버전 관리**: 필요한 경우에만 업그레이드
9. **유지보수되지 않는 라이브러리 모니터링**: 유지보수되지 않는 라이브러리 모니터링; 대안으로 가상 패칭 고려
10. **CI/CD 및 개발자 도구 정기 업데이트**
11. **단계별/카나리 배포 구현**: 노출을 제한하기 위한 단계별/카나리 배포 구현

### 변경 관리 추적

다음에 대한 모든 수정 사항을 문서화:
- CI/CD 설정
- 코드 저장소
- 샌드박스
- 개발자 IDE
- SBOM 도구
- 로깅 시스템
- 서드파티 통합
- 아티팩트 저장소
- 컨테이너 레지스트리

### 강화 요구사항

- **코드 저장소**: 시크릿 체크인 비활성화, 브랜치 보호, 백업 활성화
- **개발자 워크스테이션**: 정기 패칭, MFA, 모니터링
- **빌드 서버/CI/CD**: 직무 분리 시행, 접근 제어, 서명된 빌드, 환경 범위 시크릿
- **아티팩트**: 출처, 서명, 타임스탬프를 통한 무결성 보장; 재빌드 대신 승격
- **Infrastructure as Code**: PR 및 버전 제어를 통한 관리

## Example Attack Scenarios (공격 시나리오 예시)

### 시나리오 #1 - 벤더 침해 (SolarWinds)
2019년 SolarWinds 침해는 신뢰할 수 있는 벤더가 소프트웨어 업데이트를 통해 맬웨어를 배포했을 때 약 **18,000개 조직을 감염**시켰습니다.
- 참조: [NPR 조사](https://www.npr.org/2021/04/16/985439655/a-worst-nightmare-cyberattack-the-untold-story-of-the-solarwinds-hack)

### 시나리오 #2 - 조건부 맬웨어 (Bybit)
2025년 Bybit **15억 달러 도난**은 특정 조건에서만 실행되는 악성 코드를 포함한 지갑 소프트웨어에서 비롯되었습니다.
- 참조: [Sygnia 조사](https://www.sygnia.co/blog/sygnia-investigation-bybit-hack/)

### 시나리오 #3 - 자기 전파 웜 (Shai-Hulud)
2025년 Shai-Hulud npm 공격은 post-install 스크립트를 사용하여 민감한 데이터를 수집하고 npm 토큰을 GitHub 저장소로 유출하는 악성 패키지 버전을 확산시켜, 중단되기 전까지 **500개 이상의 패키지 버전**에 도달했습니다.

### 시나리오 #4 - 알려진 취약점 악용
- **CVE-2017-5638**: Apache Struts 2 원격 코드 실행으로 임의의 서버 실행 가능
- **CVE-2021-44228 ("Log4Shell")**: Apache Log4j 제로데이로 랜섬웨어 및 크립토마이닝 캠페인 가능

## References (참고자료)

### OWASP 리소스
- [OWASP ASVS: V15](https://owasp.org/www-project-application-security-verification-standard/)
- [Dependency Graph SBOM Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Dependency_Graph_SBOM_Cheat_Sheet.html)
- [Vulnerable Dependency Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html)
- [OWASP Dependency-Track Project](https://owasp.org/www-project-dependency-track/)
- [OWASP CycloneDX Project](https://owasp.org/www-project-cyclonedx/)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Virtual Patching Best Practices](https://owasp.org/www-community/Virtual_Patching_Best_Practices)

### 외부 참고자료
- [MITRE CVE 검색](https://www.cve.org)
- [National Vulnerability Database](https://nvd.nist.gov)
- [Retire.js](https://retirejs.github.io/retire.js/)
- [GitHub Advisory Database](https://github.com/advisories)
- [SAFECode Software Integrity Controls](https://safecode.org/publication/SAFECode_Software_Integrity_Controls0610.pdf)

## List of Mapped CWEs (관련 CWE 목록)

| CWE ID | 설명 |
|--------|------|
| [CWE-447](https://cwe.mitre.org/data/definitions/447.html) | 구식 함수 사용 |
| [CWE-1035](https://cwe.mitre.org/data/definitions/1035.html) | 2017 Top 10 A9 - 알려진 취약점이 있는 컴포넌트 사용 |
| [CWE-1104](https://cwe.mitre.org/data/definitions/1104.html) | 유지보수되지 않는 서드파티 컴포넌트 사용 |
| [CWE-1329](https://cwe.mitre.org/data/definitions/1329.html) | 업데이트할 수 없는 컴포넌트에 대한 의존 |
| [CWE-1357](https://cwe.mitre.org/data/definitions/1357.html) | 신뢰성이 불충분한 컴포넌트에 대한 의존 |
| [CWE-1395](https://cwe.mitre.org/data/definitions/1395.html) | 취약한 서드파티 컴포넌트에 대한 의존 |
