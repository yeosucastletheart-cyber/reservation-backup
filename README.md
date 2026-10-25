# CASTLE THE ART 예약 자동 백업

캐슬디아트가 소유하는 예약 전용 백업 실행 코드입니다. 백엔드 개발 저장소는
`wrongstory/room-management-system-backend`에 유지합니다.

이 공개 저장소에는 코드와 비민감 운영 상태만 저장합니다. 실제 예약 자료는 암호화해
기존 복구 Supabase의 비공개 Storage에 저장하며, 인증키와 DB 비밀번호는 GitHub 환경
Secrets 또는 복구 Supabase Secrets에만 등록합니다.

## 현재 상태

2026-10-25: [PR #5](https://github.com/yeosucastletheart-cyber/reservation-backup/pull/5)로
v0.1.0 코드를 main `a868e21`에 반영했습니다. 새 저장소의
[수동 실행](https://github.com/yeosucastletheart-cyber/reservation-backup/actions/runs/40168691919)은
당일 기존 암호화 사본의 예약 28건을 재조회·검증했습니다(`verified-existing`, 삭제 0건).
새 사본 업로드나 운영 DB 전체 복원을 완료했다는 뜻은 아닙니다.

실제 미실행·정상 복구 알림을 캐슬디아트 GitHub 알림함에서 확인한 뒤 새 저장소의 매일 03:00 KST
백업과 복구 감시를 활성화했습니다. 기존 wrongstory 저장소의 백업은 비활성입니다.
첫 정기 백업·감시 실행은 아직 확인 전이며
[이슈 #1](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/1)을 유지합니다.
다음 백업 예정은 2026-10-26 03:00 KST입니다. 현장 PC 설치·인계는 [별도 후속 #6](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/6)입니다.
상세 근거와 남은 단계는 [설정 기록](docs/SETUP_PLAN.md)을 확인하세요.

## 동작

- 매일 03:00 KST에 GitHub Actions가 운영 예약 자료를 읽기 전용으로 조회합니다.
- AES-256-GCM 암호화 후 원격 저장·재조회·복호화 및 예약 참조 관계를 확인합니다.
- 같은 날 성공본은 덮어쓰지 않습니다. 새 성공본 검증 전에는 이전 성공본을 삭제하지 않습니다.
- 최소 15일 보존, 저장 공간 부족 시 성공본을 임의로 지우지 않고 실패로 알립니다.
- 복구 Supabase의 별도 감시는 매시 17분에 실행 기록·사본 상태를 확인하도록 설정했습니다.
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
