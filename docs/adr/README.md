# Architecture Decision Records

이 프로젝트의 중요한 기술 결정들을, 결정 하나당 파일 하나로 기록합니다. 프로세스는
[0001](0001-record-architecture-decisions.md), 템플릿은
[0000-template.md](0000-template.md)를 참고하세요.

다음 레코드는 `new-adr` Claude 스킬로 만들거나, 템플릿을 복사해 번호를 올려서 작성하세요.

| #    | 결정                                                                                | 상태                                                       |
| ---- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 0001 | [아키텍처 결정 기록하기](0001-record-architecture-decisions.md)                     | accepted                                                   |
| 0002 | [Feature-Sliced Design 사용](0002-use-feature-sliced-design.md)                     | accepted                                                   |
| 0003 | [서버 상태에 TanStack Vue Query](0003-use-tanstack-vue-query-for-server-state.md)   | accepted                                                   |
| 0004 | [클라이언트 상태에 Pinia](0004-use-pinia-for-client-state.md)                       | accepted                                                   |
| 0005 | [API 타입에 openapi-typescript](0005-use-openapi-typescript-for-api-types.md)       | accepted                                                   |
| 0006 | [런타임 스키마 검증 라이브러리 미사용](0006-skip-runtime-schema-validation-lib.md)  | accepted                                                   |
| 0007 | [TypeScript strict 옵션](0007-typescript-strict-options.md)                         | accepted                                                   |
| 0008 | [Tailwind CSS 사용](0008-use-tailwind-css.md)                                       | accepted                                                   |
| 0009 | [컴포넌트 Props/variant 컨벤션](0009-component-props-and-variants.md)               | accepted                                                   |
| 0010 | [Token Studio export에서 디자인 토큰 생성](0010-design-tokens-from-token-studio.md) | superseded by [0013](0013-design-tokens-from-figma-mcp.md) |
| 0011 | [다국어에 vue-i18n](0011-use-vue-i18n-for-internationalization.md)                  | accepted                                                   |
| 0012 | [공유 UI는 Reka UI + VueUse](0012-use-reka-ui-and-vueuse.md)                        | accepted                                                   |
| 0013 | [Figma MCP로 디자인 토큰 스냅샷 동기화](0013-design-tokens-from-figma-mcp.md)       | accepted                                                   |
