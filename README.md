# CASTLE THE ART 예약 자동 백업

캐슬디아트가 소유하는 예약 전용 백업 실행 코드입니다. 백엔드 개발 저장소는
`wrongstory/room-management-system-backend`에 유지합니다.

이 공개 저장소에는 코드와 비민감 운영 상태만 저장합니다. 실제 예약 자료는 암호화해
기존 복구 Supabase의 비공개 Storage에 저장하며, 인증키와 DB 비밀번호는 GitHub 환경
Secrets 또는 복구 Supabase Secrets에만 등록합니다.

## 현재 상태

2026-10-25: 전용 저장소와 비공개 GitHub App을 생성하고 단일 저장소 설치를 완료했습니다.
코드 분리와 독립 QA를 마쳤으며 정기 백업과 감시는 아직 활성화하지 않았습니다.
새 저장소의 원격 CI·실제 실행·인계는 [이슈 #1](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/1)에서 추적합니다.
기존 백엔드에서 검증한 실제 백업 성공을 새 저장소의 실행 성공으로 표시하지 않습니다.

## 동작

- 매일 03:00 KST에 GitHub Actions가 운영 예약 자료를 읽기 전용으로 조회합니다.
- AES-256-GCM 암호화 후 원격 저장·재조회·복호화 및 예약 참조 관계를 확인합니다.
- 같은 날 성공본은 덮어쓰지 않습니다. 새 성공본 검증 전에는 이전 성공본을 삭제하지 않습니다.
- 최소 15일 보존, 저장 공간 부족 시 성공본을 임의로 지우지 않고 실패로 알립니다.
- 복구 Supabase의 별도 감시는 매시 17분에 실행 기록·사본 상태를 확인하도록 준비합니다.
- 알림에는 오류 분류·날짜·실행 링크만 포함하며 예약 내용·비밀번호·키를 포함하지 않습니다.

자동 실행은 클라우드에서 이루어집니다. 캐슬디아트 PC를 계속 켜두거나 Docker를 설치할
필요는 없습니다. PC의 관리·복구 도구 설치는 [인계 안내](docs/PC_HANDOVER.md)를 따릅니다.

## 개발 검증

Node.js 22 이상에서 `npm ci`, `npm run typecheck`, `npm test`, `npm run build`를 사용합니다.
실제 백업 실행과 복구 DB 감시 설치는 [설정 계획](docs/SETUP_PLAN.md)의 검증·승인 경계를 따릅니다.
업무 API, 사진, Auth, PIN, 청소, 주급을 이 저장소에서 배포하거나 백업하지 않습니다.

GitHub 예약 실행 지연·무활동 중지와 Supabase Free의 Pause 가능성이 있습니다.
두 서비스가 동시에 중단된 경우 알림 도착을 보장하지 않습니다.

소스 출처와 이전 검증 범위는 [추출 근거](docs/PROVENANCE.md)에 기록합니다.
