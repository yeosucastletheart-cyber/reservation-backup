# 예약 백업 저장소 작업 규칙

- 최신 사용자 결정과 README, docs/SETUP_PLAN.md, docs/PC_HANDOVER.md를 먼저 확인한다.
- 백엔드 개발 저장소는 wrongstory/room-management-system-backend에 유지한다. 이곳은 캐슬디아트 소유의 예약 백업 전용 코드다.
- 실제 예약·키·DB 비밀번호·원본 응답을 Git, 로그, 공개 이슈, CI artifact에 넣지 않는다.
- 운영 원본은 고정 읽기 전용 transaction으로 조회한다. Auth/PIN/사진/청소/주급은 이 백업 범위가 아니다.
- 기존 백업 형식, 프로젝트 경계, 단일 저장소·최소 권한 검증, 원격 재조회, 이전 성공본 보호와 최소 15일 보존을 유지한다.
- 로컬/CI/원격의 DB migration·reset·재구축은 실행 전에 매번 명시 승인을 받는다. 자동 진행 승인은 이를 대체하지 않는다.
- 일반 테스트는 합성 데이터로 실행한다. 실제 백업·복구 SQL·Secrets 등록·정기 활성화 결과를 합성 PASS와 구분한다.
- 작업 브랜치는 codex/* → dev, 릴리스는 release/vX.Y.Z → main. main/dev 직접 push·관리자 보호 우회·force push·기존 이력 재작성 금지.
- 초기 README 이후 기능은 PR/CI와 독립 QA를 통해 반영한다. 실제 설정 전 원격 보호 규칙을 확인한다.
- 변경 뒤 npm run typecheck, npm test, npm run build와 관련 Edge/비밀 검사를 실행한다. 실행하지 않은 검사를 PASS로 표시하지 않는다.
- Docker는 이 저장소의 일반 합성 검증에 필요하지 않다. 별도 필요 시 Windows Safe Start만 사용하며 데이터 삭제·Factory Reset은 하지 않는다.
- 새 계정·현장 PC 인계는 원본 암호화 키의 안전한 전달을 포함한다. DPAPI 파일을 다른 PC에 복사만 하고 인계 완료로 표시하지 않는다.
