# 설정 및 활성화 계획

## 확인된 식별자

| 항목 | 값 |
|---|---|
| GitHub 소유자 | yeosucastletheart-cyber |
| 공개 코드 저장소 | yeosucastletheart-cyber/reservation-backup |
| 저장소 ID | 1432846595 |
| 초기 README commit | a56be89c7b11d04284b392fdcfce211bac7b509d |
| 비공개 App | castle-reservation-backup |
| App ID | 5463163 |
| 설치 ID | 175017271 |
| 운영 예약 원본 프로젝트 | aodikrxcczbogjpsjwjt |
| 복구 전용 프로젝트 | matalcofimnhuzslfhdd |
| 비공개 Storage bucket | reservation-backups |

앱 권한은 단일 저장소의 Issues read/write와 Metadata read-only입니다.
코드 게시·저장소 관리 권한을 이 알림 앱에 추가하지 않습니다.

## 실행 전 단계

1. 추출 코드의 전체 합성 테스트·타입·빌드·Edge 검사와 독립 QA를 완료합니다.
2. 캐슬디아트 계정의 코드 게시 권한으로 작업 브랜치에서 PR을 만들고 CI·독립 리뷰를 확인합니다.
   기본 브랜치 직접 push와 보호 규칙 우회는 하지 않습니다. 기존 개인 계정에 권한을 임의로 추가하지 않습니다.
3. main 전용 `reservation-backup` 환경과 보호 규칙을 설정합니다. 백업 변수는 비활성으로 둡니다.
   환경 Secrets에는 승인된 원본 연결·기존 암호화 키·복구 Storage 키를 안전하게 등록합니다.
   공개 CA와 알림 이슈 번호는 비밀과 구분합니다.
4. 실제 App private key를 안전하게 확보하고 단일 저장소 설치 토큰의 이름·ID·권한을 검증합니다.
   App ID·설치 ID·private key와 감시용 설정은 복구 Supabase에만 등록합니다.
5. 검토된 `ops/reservation-backup-monitor/install.sql`의 실행 승인을 받은 뒤 복구 프로젝트에만 설치합니다.
   확장·비공개 함수·Vault 키·비활성 Cron을 추가하며 기존 업무 데이터는 유지합니다.
6. 감시 Edge를 복구 프로젝트에 배포하고 signed-v1 인증, 비인가 거부, 실제 알림을 검증합니다.
7. 기존 개인 저장소의 백업이 비활성임을 확인하고 새 저장소만 활성화합니다. 1회 실제 백업·재조회와
   감시 상태를 확인한 후 Cron을 활성화하고 첫 정기 실행을 확인합니다.

업무 DB migration·DB reset·백엔드 API/Swagger 배포·태그/Release 발행은 이 설정의 실행 대상이 아닙니다.
기존 v0.9.10 백엔드 릴리스 후보와 그 전체 DB 검증 승인을 새 저장소에서 사용한 것으로 처리하지 않습니다.
새 저장소의 검사는 운영 원본 스키마 전체 검증을 대신하지 않습니다.

## 안전한 전환과 중단

신규 실행 성공 전 기존 암호화 사본·기존 키·복구 bucket을 삭제하거나 교체하지 않습니다.
동시에 두 저장소의 정기 실행을 켜지 않습니다. 장애 시 신규 backup 변수·monitor 변수·해당 Cron만
비활성화하고 이전 성공 사본을 보존합니다.

## 현재 진행

2026-10-25: 저장소/App 생성, 단일 저장소 설치와 캐슬디아트 GitHub CLI 인증을 완료했습니다.
main/dev에 PR·strict application CI·관리자 적용·대화 해결·force/delete 금지를 설정했습니다.
코드 분리와 독립 QA(123 Node 테스트·2 Deno 테스트)는 PASS입니다.

사용자가 저장한 App 키 파일은 Windows 계정 전용으로 보호 저장했으나, 등록된 공개 키 지문과
일치하지 않고 실제 인증이 거부됐습니다. 올바른 파일 확인 전까지 이 키를 배포 설정에 등록하지 않습니다.
키 내용·인증 응답 원문은 출력하지 않았습니다. 원격 코드 게시·Secrets 등록·복구 SQL·Edge 배포·
실제 알림·정기 실행은 아직 미완료입니다.
