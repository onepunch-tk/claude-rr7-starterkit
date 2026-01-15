#!/bin/bash
# ============================================================================
# Ralph-Loop Playwright 디버깅 루프 실행 스크립트
# ============================================================================
#
# 사용법:
#   ./ralph-loop.sh --goal "<목표>" [옵션들]
#
# 필수 파라미터:
#   --goal "<목표>"              해결하고자 하는 문제 또는 달성 목표
#
# 선택 파라미터:
#   --max <숫자>                 최대 루프 횟수 (기본: 무한)
#   --url "<URL>"                테스트 대상 URL
#   --email "<이메일>"           로그인 이메일
#   --password "<비밀번호>"       로그인 비밀번호
#   --username "<유저네임>"       로그인 유저네임
#   --otp "<OTP코드>"            2FA OTP 코드
#   --credentials-file "<파일>"   credentials JSON 파일 경로
#
# 예시:
#   # 기본 사용
#   ./ralph-loop.sh --goal "메인 페이지 렌더링 에러 해결" --url "http://localhost:3000"
#
#   # 로그인 테스트
#   ./ralph-loop.sh --goal "로그인 에러 해결" \
#     --url "http://localhost:3000/login" \
#     --email "test@example.com" \
#     --password "testPassword123!" \
#     --max 3
#
#   # credentials 파일 사용
#   ./ralph-loop.sh --goal "회원 로그인 테스트" \
#     --url "http://localhost:3000/login" \
#     --credentials-file "./test-credentials.json"
#
# credentials 파일 형식 (JSON):
#   {
#     "email": "test@example.com",
#     "password": "testPassword123!",
#     "username": "testuser",
#     "otp": "123456",
#     "custom": {
#       "memberId": "MEMBER001",
#       "pin": "1234"
#     }
#   }
#
# ============================================================================
# 이 스크립트는 Claude Code에서 참조용으로 제공됩니다.
# 실제 실행은 Claude가 MCP 도구를 통해 수행합니다.
# ============================================================================

set -e

# ============================================================================
# 기본값 설정
# ============================================================================
GOAL=""
MAX_LOOPS=0          # 0 = 무한
URL=""
EMAIL=""
PASSWORD=""
USERNAME=""
OTP=""
CREDENTIALS_FILE=""

# ============================================================================
# 인자 파싱
# ============================================================================
while [[ $# -gt 0 ]]; do
  case $1 in
    --goal)
      GOAL="$2"
      shift 2
      ;;
    --max)
      MAX_LOOPS="$2"
      shift 2
      ;;
    --url)
      URL="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
      ;;
    --password)
      PASSWORD="$2"
      shift 2
      ;;
    --username)
      USERNAME="$2"
      shift 2
      ;;
    --otp)
      OTP="$2"
      shift 2
      ;;
    --credentials-file)
      CREDENTIALS_FILE="$2"
      shift 2
      ;;
    --help|-h)
      head -80 "$0" | tail -70
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# ============================================================================
# 필수 파라미터 확인
# ============================================================================
if [ -z "$GOAL" ]; then
  echo "Error: --goal is required"
  echo "Use --help for usage information"
  exit 1
fi

# ============================================================================
# credentials 파일 로드 (있는 경우)
# ============================================================================
if [ -n "$CREDENTIALS_FILE" ] && [ -f "$CREDENTIALS_FILE" ]; then
  echo "Loading credentials from: $CREDENTIALS_FILE"
  
  # jq가 설치되어 있으면 사용
  if command -v jq &> /dev/null; then
    [ -z "$EMAIL" ] && EMAIL=$(jq -r '.email // empty' "$CREDENTIALS_FILE")
    [ -z "$PASSWORD" ] && PASSWORD=$(jq -r '.password // empty' "$CREDENTIALS_FILE")
    [ -z "$USERNAME" ] && USERNAME=$(jq -r '.username // empty' "$CREDENTIALS_FILE")
    [ -z "$OTP" ] && OTP=$(jq -r '.otp // empty' "$CREDENTIALS_FILE")
  else
    echo "Warning: jq not installed, cannot parse credentials file"
  fi
fi

# ============================================================================
# 설정 출력
# ============================================================================
echo ""
echo "╔════════════════════════════════════════════════════════════════════════╗"
echo "║                    RALPH-LOOP PLAYWRIGHT DEBUGGER                      ║"
echo "╠════════════════════════════════════════════════════════════════════════╣"
echo "║ Goal: $GOAL"
echo "║ URL: ${URL:-<auto-detect>}"
echo "║ Max Loops: ${MAX_LOOPS:-unlimited}"
if [ -n "$EMAIL" ] || [ -n "$USERNAME" ]; then
  echo "╠════════════════════════════════════════════════════════════════════════╣"
  echo "║ Credentials:"
  [ -n "$EMAIL" ] && echo "║   Email: $EMAIL"
  [ -n "$USERNAME" ] && echo "║   Username: $USERNAME"
  [ -n "$PASSWORD" ] && echo "║   Password: ********"
  [ -n "$OTP" ] && echo "║   OTP: $OTP"
fi
echo "╚════════════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# 루프 실행
# ============================================================================
LOOP_COUNT=0
SUCCESS=false

while true; do
  LOOP_COUNT=$((LOOP_COUNT + 1))
  
  echo ""
  echo "┌──────────────────────────────────────────────────────────────────────┐"
  echo "│                         LOOP #$LOOP_COUNT                                     │"
  echo "└──────────────────────────────────────────────────────────────────────┘"
  
  # Max 체크
  if [ "$MAX_LOOPS" -gt 0 ] && [ "$LOOP_COUNT" -gt "$MAX_LOOPS" ]; then
    echo ""
    echo "⚠️  Max loops ($MAX_LOOPS) reached. Exiting."
    echo ""
    exit 1
  fi
  
  # ══════════════════════════════════════════════════════════════════════════
  # Phase 0: Authentication (if credentials provided)
  # ══════════════════════════════════════════════════════════════════════════
  if [ "$LOOP_COUNT" -eq 1 ] && { [ -n "$EMAIL" ] || [ -n "$USERNAME" ]; }; then
    echo ""
    echo "  [0/4] 🔐 Authenticating..."
    echo "        ├── Navigate to login page"
    echo "        ├── browser_snapshot (get form refs)"
    echo "        ├── browser_type (email/username)"
    echo "        ├── browser_type (password)"
    echo "        ├── browser_click (submit)"
    echo "        └── Verify login success"
    
    # 실제 인증 로직 (Claude MCP가 수행)
    # { name: 'browser_navigate', arguments: { url: '<login-url>' } }
    # { name: 'browser_snapshot', arguments: {} }
    # { name: 'browser_type', arguments: { ref: '<email-ref>', text: '$EMAIL' } }
    # { name: 'browser_type', arguments: { ref: '<password-ref>', text: '$PASSWORD' } }
    # { name: 'browser_click', arguments: { ref: '<submit-ref>' } }
    # { name: 'browser_wait_for', arguments: { text: 'Welcome' } }
    
    if [ -n "$OTP" ]; then
      echo "        ├── 2FA detected"
      echo "        ├── browser_type (OTP: $OTP)"
      echo "        └── Verify 2FA success"
    fi
    
    echo ""
  fi
  
  # ══════════════════════════════════════════════════════════════════════════
  # Phase 1: Collect
  # ══════════════════════════════════════════════════════════════════════════
  echo "  [1/4] 📥 Collecting error information..."
  echo "        ├── browser_console_messages (errors only)"
  echo "        ├── browser_snapshot (accessibility tree)"
  echo "        ├── browser_take_screenshot (current state)"
  echo "        └── browser_network_requests (failed requests)"
  
  # 실제 수집 로직 (Claude MCP가 수행)
  # { name: 'browser_console_messages', arguments: { onlyErrors: true } }
  # { name: 'browser_snapshot', arguments: {} }
  # { name: 'browser_take_screenshot', arguments: { fullPage: true, filename: 'error-state.png' } }
  # { name: 'browser_network_requests', arguments: {} }
  
  # ══════════════════════════════════════════════════════════════════════════
  # Phase 2: Analyze
  # ══════════════════════════════════════════════════════════════════════════
  echo ""
  echo "  [2/4] 🔍 Analyzing root cause..."
  echo "        ├── Parse error messages"
  echo "        ├── Extract stack traces"
  echo "        ├── Identify affected files"
  echo "        └── Determine fix strategy"
  
  # 분석 로직 (Claude가 수행)
  # - 에러 메시지에서 파일/라인 추출
  # - 패턴 매칭으로 오류 유형 분류
  # - 관련 코드 파일 검토
  # - 수정 방향 결정
  
  # ══════════════════════════════════════════════════════════════════════════
  # Phase 3: Fix
  # ══════════════════════════════════════════════════════════════════════════
  echo ""
  echo "  [3/4] 🔧 Applying fix..."
  echo "        ├── Open affected files"
  echo "        ├── Apply code changes"
  echo "        └── Validate syntax"
  
  # 수정 로직 (Claude가 수행)
  # - 파일 열기
  # - 코드 수정 적용
  # - 문법 검증
  
  # ══════════════════════════════════════════════════════════════════════════
  # Phase 4: Test
  # ══════════════════════════════════════════════════════════════════════════
  echo ""
  echo "  [4/4] 🧪 Running tests..."
  echo "        ├── browser_navigate (reload page)"
  echo "        ├── browser_wait_for (page load)"
  echo "        ├── browser_console_messages (check errors)"
  echo "        ├── browser_verify_element_visible (UI check)"
  echo "        └── Evaluate test results"
  
  # 실제 테스트 로직 (Claude MCP가 수행)
  # { name: 'browser_navigate', arguments: { url: '<target-url>' } }
  # { name: 'browser_wait_for', arguments: { textGone: 'Loading' } }
  # { name: 'browser_console_messages', arguments: { onlyErrors: true } }
  # { name: 'browser_verify_element_visible', arguments: { role: '<role>', accessibleName: '<name>' } }
  
  # ══════════════════════════════════════════════════════════════════════════
  # 결과 판정
  # ══════════════════════════════════════════════════════════════════════════
  echo ""
  
  # 실제 구현에서는 테스트 결과를 기반으로 판정
  # 이 템플릿에서는 시뮬레이션
  if [ "$SUCCESS" = true ]; then
    echo "  ╔════════════════════════════════════════════════════════════════════╗"
    echo "  ║                        ✅ GOAL ACHIEVED                            ║"
    echo "  ╚════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "  Total iterations: $LOOP_COUNT"
    echo ""
    exit 0
  fi
  
  echo "  ❌ Test failed. Retrying..."
  sleep 1
done