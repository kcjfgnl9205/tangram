# 36. 모션 & 인터랙션 (움직임)

> **쉽게 말하면:** 움직임은 장식이 아니라 **"무엇이 어디서 왔는지"를 알려 주는 신호**다.
> 짧게, 일관되게, 끌 수 있게 만든다.

토스트가 올라오고, 모달이 떠오르고, 아코디언이 펼쳐지고, 스위치가 미끄러지는 것 — 이 문서는
그 움직임을 **어떤 말로 부르고, 어떤 값으로, 어디에 쓰는지**를 한 곳에 정한다. 접근성은
`35-accessibility`, 디자인 원본 대조는 `37-figma-to-code`와 함께 읽는다.

## 0. 용어

**움직임을 설명하는 말**

| 용어                             | 쉽게 말하면                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| 전환 (transition)                | A 상태 → B 상태로 **값이 변할 때** 부드럽게 잇는 것. 호버·체크 같은 토글에 쓴다    |
| 애니메이션 (animation)           | 키프레임으로 **정해진 각본**을 재생. 나타남/사라짐처럼 상태가 아닌 등장에 쓴다     |
| 진입/퇴장 (enter / exit, in/out) | 화면에 **들어올 때** / **나갈 때**. 둘은 값이 다르다(퇴장이 더 짧다)               |
| 지속시간 (duration)              | 움직임이 걸리는 시간. 우리 기준은 120·150·200·300ms                                |
| 이징 (easing)                    | 속도 곡선. `ease-out`=빨리 나와 부드럽게 멈춤, `ease-in`=천천히 시작해 빨리 사라짐 |
| 키프레임 (`@keyframes`)          | 0%→100% 각본을 CSS로 적어 둔 것. **`main.css` 한 곳에만** 둔다                     |
| 변형 (transform)                 | 이동·확대·회전. **레이아웃을 다시 계산하지 않아 싸다**                             |
| 불투명도 (opacity)               | 투명도. transform과 함께 **이 둘만 애니메이트한다**                                |
| 리플로우 (reflow)                | `height`·`top`·`margin`을 건드려 브라우저가 레이아웃을 다시 재는 것 — 끊긴다       |
| 변환 원점 (transform-origin)     | 확대/축소가 **어느 점에서** 일어나는지. 드롭다운은 트리거 쪽이 원점이다            |
| 스크림 / 오버레이 (scrim)        | 모달 뒤를 덮는 반투명 검은 막(딤). 뒤쪽이 못 쓰는 상태임을 알린다                  |
| 포털 (portal)                    | 모달·토스트를 DOM 맨 끝으로 옮겨 띄우는 것. 부모의 `overflow`에 잘리지 않는다      |
| 스태거 (stagger)                 | 목록 항목을 조금씩 시차를 두고 등장시키는 것. **기본으로는 쓰지 않는다**           |
| 리듀스드 모션                    | 사용자가 OS에서 "동작 줄이기"를 켠 상태. 반드시 존중한다                           |

**컴포넌트를 부르는 말** — 비슷해 보이는 것들의 구분이 핵심이다.

| 용어                     | 무엇                                                         | 우리 컴포넌트          |
| ------------------------ | ------------------------------------------------------------ | ---------------------- |
| 토스트 (toast)           | 스스로 사라지는 짧은 알림. 작업을 막지 않는다                | `Toast` / `useToast`   |
| 모달·다이얼로그 (dialog) | 화면 가운데서 **작업을 막고** 답을 요구한다                  | `Modal` / `useModal`   |
| 드로어·시트 (drawer)     | 가장자리에서 밀려 들어오는 패널. 모바일 내비에 쓴다          | `widgets/admin-layout` |
| 팝오버 / 드롭다운        | 트리거에 **붙어서** 뜨는 작은 패널(메뉴·선택지)              | `Dropdown` / `Select`  |
| 툴팁 (tooltip)           | 호버/포커스에 붙는 **설명 한 줄**. 조작할 내용을 넣지 않는다 | `Tooltip`              |
| 아코디언 (accordion)     | 제목을 눌러 본문을 펼치는 목록                               | `Accordion`            |
| 탭 (tabs)                | 같은 자리에서 내용을 **바꿔 끼우는** 전환                    | `Tabs`                 |
| 스위치 (switch)          | 켜짐/꺼짐이 **즉시 반영**되는 토글                           | `Switch`               |
| 체크박스 (checkbox)      | 선택만 하고 **저장 버튼으로 반영**되는 것                    | `Checkbox`             |
| 스켈레톤 (skeleton)      | 로딩 중 들어올 내용의 회색 자리표시                          | (필요 시 추가)         |

## 1. 토큰 — 시간과 곡선을 코드에 흩뿌리지 않는다

값은 앱의 `src/app/styles/main.css` **한 곳**에서 정하고, 컴포넌트는 이름만 쓴다.
(컴포넌트 `<style>` 블록은 금지 — `rules/vue/code-style`.)

```css
@theme {
  /* 곡선: Tailwind v4 의 --ease-* 네임스페이스 → ease-soft 유틸이 생긴다 */
  --ease-soft: cubic-bezier(0.16, 1, 0.3, 1);

  /* 등장/퇴장 각본: --animate-* → animate-fade-in 유틸이 생긴다 */
  --animate-fade-in: fade-in 150ms ease-out;
  --animate-fade-out: fade-out 120ms ease-in;
  --animate-dialog-in: dialog-in 200ms var(--ease-soft);
  --animate-dialog-out: dialog-out 120ms ease-in;
  --animate-pop-in: pop-in 150ms var(--ease-soft);
  --animate-pop-out: pop-out 120ms ease-in;
  --animate-slide-in-right: slide-in-right 200ms var(--ease-soft);
  --animate-slide-out-right: slide-out-right 150ms ease-in;
  --animate-accordion-down: accordion-down 200ms var(--ease-soft);
  --animate-accordion-up: accordion-up 150ms ease-in;
}
```

**지속시간은 숫자 유틸(`duration-150`·`duration-200`)을 그대로 쓴다** — Tailwind v4 에는
duration 전용 테마 네임스페이스가 없어서 이름을 붙여도 유틸이 생기지 않는다. 대신 **쓰는 값을
세 개로 제한**한다: `duration-150`(작은 것) · `duration-200`(패널) · `duration-300`(드로어).

## 2. 네 가지 원칙

1. **150–250ms.** 100ms 미만은 안 보이고 300ms 초과는 느리다. 면적이 클수록(드로어·모달) 길게,
   작을수록(체크·호버) 짧게.
2. **`transform` 과 `opacity` 만 움직인다.** `height`·`width`·`top`·`margin` 은 리플로우를 일으켜
   끊긴다. **예외는 아코디언** — Reka UI 가 본문 높이를 `--reka-accordion-content-height` 로 재서
   넘겨 주므로 `height` 각본이 성립한다.
3. **퇴장은 진입보다 짧고 곡선이 반대다.** 진입 `ease-out` 200ms, 퇴장 `ease-in` 120ms.
   사용자는 나타나는 건 기다려도 사라지는 건 기다리지 않는다.
4. **방향은 출처를 따른다.** 오른쪽 아래에 뜨는 토스트는 오른쪽에서 밀려 들어오고, 드롭다운은
   트리거 쪽을 `transform-origin` 으로 잡아 거기서 자란다. 아무 데서나 튀어나오지 않는다.

## 3. 끌 수 있어야 한다 — `prefers-reduced-motion`

OS 에서 "동작 줄이기"를 켠 사용자에게 움직임은 **멀미와 통증**이다. 선택이 아니라 필수이고,
`main.css` 의 `@layer base` 에 한 번만 둔다.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 4. 거는 방법은 두 가지뿐이다

**(a) 상태가 바뀌는데 DOM 은 그대로** — 호버·포커스·체크·펼침 표시. `transition-*` 유틸.

```html
<!-- 버튼: 색만 부드럽게 -->
class="transition-colors duration-150 hover:bg-slate-50"

<!-- 스위치 손잡이: 위치만 — transform 이라 싸다 -->
class="transition-transform duration-150 data-[state=checked]:translate-x-[22px]"

<!-- 아코디언 화살표: 회전 -->
class="transition-transform duration-200 group-data-[state=open]:rotate-180"
```

**(b) 들어오고 나가는 것** — 토스트·모달·드롭다운. Reka UI 가 붙여 주는
`data-state="open|closed"` 에 `animate-*` 를 건다. Reka 의 Presence 가 **퇴장 애니메이션이 끝날
때까지 DOM 을 붙들어 주므로** 닫힘 각본도 끝까지 재생된다.

```html
class="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
```

Vue `<Transition>` 은 **Reka 를 쓰지 않는 자체 컴포넌트에서만** 쓴다. 둘을 한 요소에 겹치지 않는다.

> **직접 언마운트하면 퇴장은 재생되지 않는다.** 배열에서 `v-for` 항목을 지우면 DOM 이 즉시
> 사라져 Presence 가 개입할 틈이 없다. 목록에서 하나를 닫을 때는 **`open` 을 먼저 `false` 로
> 내려 각본을 재생시키고, 제거는 그 뒤로 미룬다** — `Toaster.vue` 가 이 패턴의 본보기다.
> 기다리는 시간은 각본보다 조금 넉넉히 잡고 상수로 둔다.

## 5. 패턴별 레시피

| 패턴                 | 진입                                                         | 퇴장                      | 비고                                        |
| -------------------- | ------------------------------------------------------------ | ------------------------- | ------------------------------------------- |
| 토스트               | `animate-slide-in-right` (오른쪽에서 + 페이드)               | `animate-slide-out-right` | 스와이프로도 닫히게(`swipe-direction`)      |
| 모달 스크림          | `animate-fade-in`                                            | `animate-fade-out`        | `bg-black/40` — 완전 불투명으로 덮지 않는다 |
| 모달 패널            | `animate-dialog-in` (0.96→1 확대 + 페이드)                   | `animate-dialog-out`      | **아래 "가운데 정렬 함정" 참고**            |
| 드로어               | `translate-x-full` → `0`, `duration-300`                     | 역방향                    | 가장자리에서 들어오고 가장자리로 나간다     |
| 드롭다운/셀렉트/툴팁 | `animate-pop-in` + `origin-[--reka-popper-transform-origin]` | `animate-pop-out`         | 트리거 쪽에서 자란다                        |
| 아코디언             | `animate-accordion-down`                                     | `animate-accordion-up`    | `overflow-hidden` 필수                      |
| 탭                   | 내용은 **움직이지 않는다**                                   | —                         | 인디케이터만 `transition-all`               |
| 스위치/체크          | `transition-transform duration-150`                          | 동일                      | 즉시 반응이 중요 — 길게 끌지 않는다         |
| 로딩                 | 스켈레톤 `animate-pulse`                                     | —                         | 무한 반복은 **로딩 표시에만** 허용          |

**가운데 정렬 함정** — 모달 패널은 `-translate-x-1/2 -translate-y-1/2` 로 가운데를 잡는데,
`transform` 을 건드리는 키프레임이 그 유틸을 **덮어써서** 애니메이션 중 패널이 왼쪽 위로 튄다.
키프레임 안에 `translate(-50%, -50%)` 를 함께 적어 둔다.

```css
@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

## 6. 하지 말 것

- **페이지 전환 애니메이션을 라우트 전체에 기본으로 깔지 않는다.** 모든 이동이 느려진다.
- **무한 반복 애니메이션**은 로딩 표시 외에 금지. 시선을 계속 빼앗는다.
- **애니메이션 라이브러리(GSAP·motion 등)를 기본으로 들이지 않는다.** CSS 로 안 되는 것이
  증명되면 ADR 로 남기고 도입한다(`rules/10-guardrails`).
- **컴포넌트 `<style>` 블록에 키프레임을 숨기지 않는다.** 같은 각본이 여러 벌이 되면 끝이다.
- **스크롤 하이재킹·패럴랙스**는 어드민에 쓰지 않는다.
- **움직임만으로 상태를 알리지 않는다.** 펼침은 `aria-expanded`, 알림은 `role="status"` 가 함께
  말해 줘야 한다(`rules/35`).

## 7. 검증

- **유닛 스펙은 애니메이션을 테스트하지 않는다.** `data-state`·`aria-expanded` 같은 **상태**를
  확인한다. happy-dom 은 애니메이션을 실행하지 않는다.
- **E2E**: `expect(...).toBeVisible()` 은 자동 재시도라 애니메이션에 안전하다. 스크린샷 비교는
  `{ animations: 'disabled' }` 로 고정한다.
- 기능 하나를 마치기 전에 **OS "동작 줄이기"를 켜고 한 번 돌려 본다.**

## 8. 체크리스트

- [ ] 지속시간이 120/150/200/300 중 하나인가
- [ ] 퇴장이 진입보다 짧은가
- [ ] `transform`/`opacity` 만 움직이는가 (아코디언 `height` 는 예외)
- [ ] 키프레임이 `main.css` 에만 있는가
- [ ] `prefers-reduced-motion` 블록이 있는가
- [ ] 움직임 없이도 상태를 알 수 있는가 (ARIA)
