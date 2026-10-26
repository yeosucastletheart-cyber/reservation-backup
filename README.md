# CASTLE THE ART 예약 자동 백업

캐슬디아트가 소유하는 예약 전용 백업 실행 코드입니다. 백엔드 개발 저장소는
`wrongstory/room-management-system-backend`에 유지합니다.

이 공개 저장소에는 코드와 비민감 운영 상태만 저장합니다. 실제 예약 자료는 암호화해
기존 복구 Supabase의 비공개 Storage에 저장하며, 인증키와 DB 비밀번호는 GitHub 환경
Secrets 또는 복구 Supabase Secrets에만 등록합니다.

## 현재 상태

2026-10-27 확인: [첫 정기 실행](https://github.com/yeosucastletheart-cyber/reservation-backup/actions/runs/40220823907)이
2026-10-26 03:21 KST에 main `b945e6d`에서 성공했습니다. 10월 26일 예약 28건을 새 암호화 사본으로
저장하고 재조회·복호화·예약 참조 검증을 통과했습니다(`verified-new`, 삭제 0건).
사본은 65,926 bytes이며 10월 25일 성공본도 보존했습니다. 운영 DB 전체 복원을 의미하지 않습니다.

실제 미실행·정상 복구 알림을 캐슬디아트 GitHub 알림함에서 확인한 뒤 새 저장소의 매일 03:00 KST
백업과 복구 감시를 활성화했습니다. 기존 wrongstory 저장소의 백업은 비활성입니다.
첫 정기 백업과 실제 정기 감시 검증을 완료했습니다. 정상 상태가 계속되면 알림 이슈의 마지막
전환 날짜는 갱신하지 않으므로 최신 성공 날짜는 Actions와 사본 날짜를 함께 확인합니다.
완료 근거는 [이슈 #1](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/1),
현장 PC 설치·인계는 [별도 후속 #6](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/6)에서 관리합니다.
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
