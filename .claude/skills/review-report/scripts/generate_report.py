#!/usr/bin/env python3
"""
리뷰 리포트 JSON 파일 생성 스크립트

사용법:
    # stdin 방식 (권장 - 특수 문자 이스케이프 문제 없음)
    echo '<JSON>' | python generate_report.py --output <디렉토리>
    cat issues.json | python generate_report.py --output <디렉토리>

    # CLI 인자 방식 (하위 호환)
    python generate_report.py --output <디렉토리> --issues '<JSON 문자열>'

예시:
    # stdin 방식 (권장)
    echo '[{"file":"example.tsx","location":"23:5","severity":"high","category":"type-safety","problem":"any 타입 사용","suggestion":"unknown으로 변경"}]' | python generate_report.py --output reports/code-review

    # heredoc 사용
    python generate_report.py --output reports/code-review << 'EOF'
    [{"file":"example.tsx","location":"23:5","severity":"high","category":"type-safety","problem":"any 타입 사용","suggestion":"unknown으로 변경"}]
    EOF

    # 파일에서 읽기
    cat issues.json | python generate_report.py --output reports/code-review

    # CLI 인자 방식 (하위 호환)
    python generate_report.py --output reports/code-review --issues '[...]'

    # 이슈 없는 경우
    echo '[]' | python generate_report.py --output reports/code-review
"""

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import TypedDict


class SeverityCount(TypedDict):
    critical: int
    high: int
    medium: int
    low: int


class Metadata(TypedDict):
    createdAt: str
    totalIssues: int
    severityCount: SeverityCount


class Issue(TypedDict, total=False):
    file: str
    location: str
    severity: str
    category: str
    problem: str
    suggestion: str
    references: list[str]


class ReviewReport(TypedDict):
    metadata: Metadata
    issues: list[Issue]


VALID_SEVERITIES = {"critical", "high", "medium", "low"}


def read_issues_json(issues_arg: str | None) -> str:
    """
    이슈 JSON 읽기 - stdin 또는 CLI 인자에서

    Args:
        issues_arg: --issues 인자 값 (None, "-", 또는 JSON 문자열)

    Returns:
        JSON 문자열
    """
    if issues_arg is None or issues_arg == "-":
        return sys.stdin.read()
    return issues_arg


def generate_hash() -> str:
    """8자리 랜덤 해시 생성"""
    timestamp = datetime.now(timezone.utc).isoformat()
    return hashlib.sha256(timestamp.encode()).hexdigest()[:8]


def get_date_string() -> str:
    """YYYYMMDD 형식 날짜 문자열 반환"""
    return datetime.now(timezone.utc).strftime("%Y%m%d")


def calculate_severity_count(issues: list[Issue]) -> SeverityCount:
    """이슈 목록에서 심각도별 개수 계산"""
    count: SeverityCount = {"critical": 0, "high": 0, "medium": 0, "low": 0}

    for issue in issues:
        severity = issue.get("severity", "").lower()
        if severity in count:
            count[severity] += 1  # type: ignore[literal-required]

    return count


def validate_issues(issues: list[Issue]) -> tuple[bool, str]:
    """이슈 데이터 유효성 검사"""
    required_fields = {"file", "location", "severity", "category", "problem", "suggestion"}

    for idx, issue in enumerate(issues):
        # 필수 필드 확인
        missing = required_fields - set(issue.keys())
        if missing:
            return False, f"이슈 #{idx + 1}: 필수 필드 누락 - {missing}"

        # 심각도 값 확인
        severity = issue.get("severity", "").lower()
        if severity not in VALID_SEVERITIES:
            return False, f"이슈 #{idx + 1}: 잘못된 심각도 '{severity}' (허용: {VALID_SEVERITIES})"

    return True, ""


def create_report(issues: list[Issue]) -> ReviewReport:
    """리뷰 리포트 생성"""
    severity_count = calculate_severity_count(issues)

    return {
        "metadata": {
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "totalIssues": len(issues),
            "severityCount": severity_count,
        },
        "issues": issues,
    }


def save_report(report: ReviewReport, output_dir: str) -> str:
    """리포트를 JSON 파일로 저장하고 파일 경로 반환"""
    output_path = Path(output_dir)

    # 디렉토리 존재 확인 및 생성
    output_path.mkdir(parents=True, exist_ok=True)

    # 파일명 생성: {8자리_해시}_{YYYYMMDD}.json
    filename = f"{generate_hash()}_{get_date_string()}.json"
    file_path = output_path / filename

    # JSON 파일 저장 (한국어 지원을 위해 ensure_ascii=False)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return str(file_path)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="리뷰 리포트 JSON 파일 생성",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
예시:
    # stdin 방식 (권장)
    echo '[{"file":"example.tsx",...}]' | python generate_report.py --output reports/code-review

    # heredoc 사용
    python generate_report.py --output reports/code-review << 'EOF'
    [{"file":"example.tsx","location":"23:5","severity":"high",...}]
    EOF

    # CLI 인자 방식 (하위 호환)
    python generate_report.py --output reports/code-review --issues '[...]'
        """,
    )
    parser.add_argument(
        "--output",
        required=True,
        help="출력 디렉토리 경로 (예: reports/code-review, reports/security-review)",
    )
    parser.add_argument(
        "--issues",
        default=None,
        help="이슈 목록 JSON 문자열 (생략 시 stdin에서 읽음, '-'도 stdin으로 처리)",
    )

    args = parser.parse_args()

    # JSON 읽기 (stdin 또는 CLI 인자에서)
    issues_json = read_issues_json(args.issues)

    # JSON 파싱
    try:
        issues: list[Issue] = json.loads(issues_json)
    except json.JSONDecodeError as e:
        print(f"오류: JSON 파싱 실패 - {e}", file=sys.stderr)
        sys.exit(1)

    # 배열 타입 확인
    if not isinstance(issues, list):
        print("오류: issues는 배열이어야 합니다", file=sys.stderr)
        sys.exit(1)

    # 이슈 유효성 검사 (빈 배열은 허용)
    if issues:
        is_valid, error_msg = validate_issues(issues)
        if not is_valid:
            print(f"오류: {error_msg}", file=sys.stderr)
            sys.exit(1)

    # 리포트 생성 및 저장
    report = create_report(issues)
    file_path = save_report(report, args.output)

    # 결과 출력
    print(f"리포트 생성 완료: {file_path}")
    print(f"총 이슈: {report['metadata']['totalIssues']}개")

    severity_count = report["metadata"]["severityCount"]
    if report["metadata"]["totalIssues"] > 0:
        print(
            f"심각도: critical({severity_count['critical']}), "
            f"high({severity_count['high']}), "
            f"medium({severity_count['medium']}), "
            f"low({severity_count['low']})"
        )


if __name__ == "__main__":
    main()
