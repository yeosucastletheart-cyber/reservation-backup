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

## 설정·전환 절차

아래는 초기 비활성 설정부터 활성화까지의 순서입니다. 실제 완료 근거와 남은 항목은 문서 하단에 기록합니다.

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

## 실행 근거 — 2026-10-25

- 코드 승격: [PR #5](https://github.com/yeosucastletheart-cyber/reservation-backup/pull/5),
  main `a868e21`, application CI [40168464263](https://github.com/yeosucastletheart-cyber/reservation-backup/actions/runs/40168464263) PASS.
  구현의 기존 123 Node·2 Deno 테스트와 독립 QA 근거는 동일합니다.
- 보호·인증: main/dev의 PR·strict application·관리자 적용·대화 해결·force/delete 금지를 유지합니다.
  App 키 지문·실제 설치 토큰의 단일 저장소 이름/ID·최소 권한 검증, DPAPI와 현재 Windows 사용자 전용 ACL 확인은 PASS입니다.
  main 전용 환경은 관리자 우회 불가이며 Secrets 3개와 공개 CA를 등록했고 기존 암호화 키를 유지했습니다.
- 복구 설치: 승인된 SQL(`b734` 식별 접두사)을 **2026-10-25T06:15:38Z에 1회** 복구 프로젝트에만 적용했습니다.
  Cron job 1은 매시 17분이며 invoker가 비공개인 것을 확인했습니다. 운영 업무 DB migration·reset·전체 복원은 실행하지 않았습니다.
- 감시 배포: Edge v1(`bbc42854`), `signed-v1`, 감시 환경 설정 7개를 반영했습니다.
  실제 인증 경계 검사 4건은 PASS입니다. 키 내용·인증 응답 원문은 기록하지 않습니다.
- 실제 수동 백업: [40168691919](https://github.com/yeosucastletheart-cyber/reservation-backup/actions/runs/40168691919)가
  main `a868e21`에서 성공했습니다. 검증 단계는 6초이며 2026-10-25 사본의 `verified-existing`, 예약 28건, 삭제 0건입니다.
  **기존 사본 재조회·검증 성공**이며 새 업로드나 운영 DB 전체 복원 성공을 의미하지 않습니다.
- 실제 알림: 감시 요청 1은 HTTP 503 `BACKUP_MISSING`과 봇 댓글 `6394310631`,
  요청 2는 HTTP 200 `HEALTHY`와 봇 댓글 `6394329200`을 확인했습니다.
  캐슬디아트 Chrome의 GitHub Notifications 알림함에서 두 알림의 실제 수신을 확인했습니다.
- 활성화: 정상 상태와 실제 알림 확인 후 새 저장소의 백업 변수는 true(매일 03:00 KST),
  기존 wrongstory 저장소의 백업 변수는 false, 복구 Cron job 1은 active=true로 설정했습니다.

## 남은 확인

- 첫 실제 정기 백업과 감시 Cron 실행은 **PENDING**입니다. 다음 백업 예정은 2026-10-26 03:00 KST이며
  실제 실행·사본 상태를 확인할 때까지 [이슈 #1](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/1)을 열어 둡니다.
- 현장 PC 설치·로그인·인증정보 인계는 [후속 #6](https://github.com/yeosucastletheart-cyber/reservation-backup/issues/6)으로 관리하며 아직 완료하지 않았습니다.
