# 06 · Device testing

**Status (2026-11-06): no physical-device testing has been done yet.** Everything marked ✅ below was verified automatically in headless Chrome 155 on Windows, with Android-like touch emulation where noted. Emulation is not a phone: it does not reproduce iOS Safari's engine, real touch physics, the dynamic toolbar, notches, the Instagram app hand-off, or real GPU and network limits. Every item marked ☐ needs a person and a real device.

Test on **Android Chrome** (a mid-range phone, not only a flagship), **iOS Safari** (iPhone, current iOS and one version older if possible), and **desktop Chrome**. An iPad (Safari) is a useful fourth device because it is touch at desktop width.

## Setting up a test build

Test a production build, not `pnpm dev`:

```bash
pnpm build && pnpm start     # listens on your network by default; then open http://<your-computer's-LAN-IP>:3000 on the phone
```

- **The clipboard needs HTTPS.** Over plain `http://<LAN-IP>`, browsers block "Copy message" on /contact and the page correctly shows its "Select the message and copy it instead" fallback. To test copying itself, use an HTTPS preview deployment or a tunnel.
- **Sample-content preview** (galleries and viewers with watermarked images): `pnpm preview:sample`, then open the same LAN address. With no real artwork yet, this is the only way to exercise image galleries, the artwork viewer and the photography viewer on a phone.
- **Reduced motion:**
  - iOS: Settings › Accessibility › Motion › Reduce Motion.
  - Android: Settings › Accessibility › Remove animations.
  - Desktop: OS animation settings.

Record each result as ✓ / ✗ plus a note, device, OS and browser version.

## Checklist

### 1. Homepage, navigation and mobile menu

| Check                                                                                  | Automated     | Device                                             |
| -------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------- |
| Header links all resolve (no 404s), no public link to /design-system                   | ✅ link crawl | —                                                  |
| Header hides on scroll down, returns on scroll up; never covers content when stopped   | ✅ desktop    | ☐ iOS: toolbar collapsing must not make it flicker |
| "Menu" opens the full-screen menu; focus moves to "Close"; page behind does not scroll | ✅ emulated   | ☐ iOS: try scrolling the page behind the open menu |
| Tapping a menu link closes the menu and navigates                                      | ✅            | ☐                                                  |
| Instagram link in the menu and footer opens Instagram (app if installed)               | —             | ☐                                                  |

### 2. Hero animation and page transitions

| Check                                                                         | Automated  | Device                                        |
| ----------------------------------------------------------------------------- | ---------- | --------------------------------------------- |
| Hero intro plays once (about 2s); content never stays hidden (3.5s failsafe)  | ✅ desktop | ☐ on a slow 4G connection: no long blank hero |
| Back to the homepage replays only a short fade                                | ✅ desktop | ☐                                             |
| No horizontal wobble while the intro plays                                    | ✅ 390px   | ☐                                             |
| Smoothness: the intro and scroll reveals don't stutter on a mid-range Android | —          | ☐                                             |

### 3. Pinned bookmarks and touch scrolling

The bookmark line pins and travels sideways **only with a mouse or trackpad on a screen ≥ 1024px** (`media.pinnable`). Touch devices of any size get a native swipe row (verified: iPad-landscape emulation shows no pin).

| Check                                                                                                                   | Automated      | Device             |
| ----------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------ |
| Phone: the bookmark row swipes sideways and snaps; vertical page scroll still works when the swipe starts on a bookmark | ✅ layout only | ☐                  |
| iPad landscape: the native row, no pinning, no judder                                                                   | ✅ emulated    | ☐                  |
| Desktop with trackpad: the section pins, the line travels, bookmarks sway, then the page continues                      | ✅ mouse       | ☐ trackpad inertia |
| Scrolling quickly past the section never leaves a blank gap or jumps                                                    | ✅ CLS 0       | ☐                  |

### 4. Artwork gallery and collections

| Check                                                                              | Automated | Device |
| ---------------------------------------------------------------------------------- | --------- | ------ |
| /artworks shelf and all five collections render; empty states read naturally       | ✅        | ☐      |
| Collection switcher scrolls sideways on phones; first chip isn't clipped           | ✅ 390px  | ☐      |
| Subject filter (sample preview): chips filter the wall; back button restores "All" | ✅        | ☐      |
| Tapping a work opens it; nothing needs hover to be understood                      | ✅        | ☐      |

### 5. Thumbnail-to-artwork transition

Uses the View Transitions API: Chrome/Android Chrome 111+, Safari 18+. Older browsers navigate normally with no morph; that is expected, not a failure.

| Check                                                                | Automated             | Device                                |
| -------------------------------------------------------------------- | --------------------- | ------------------------------------- |
| Tapping a thumbnail morphs it into the artwork page image            | ✅ (transition fired) | ☐ Android Chrome · ☐ iOS 18+ Safari   |
| Back returns to the same scroll position in the gallery              | ✅ desktop            | ☐ iOS back swipe from the screen edge |
| Back swipe while a transition is running doesn't leave a ghost image | —                     | ☐ iOS                                 |
| With reduced motion, no morph, instant navigation                    | ✅ CSS                | ☐                                     |

### 6. Photography viewer

| Check                                                                           | Automated         | Device                                           |
| ------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------ |
| Tapping a photo opens the viewer; "Close" is focused; counter shows "n / total" | ✅                | ☐                                                |
| Swipe left/right changes photo; vertical swipe does nothing harmful             | ✅ emulated touch | ☐ real swipe feel                                |
| Pinch-zoom works on the photo                                                   | —                 | ☐ (enabled via `touch-action: pan-y pinch-zoom`) |
| Previous/next buttons are easy to hit (48px) and wrap around                    | ✅                | ☐                                                |
| Keyboard (desktop): ←/→ change photo, Esc closes, focus returns to the photo    | ✅                | ☐ Safari desktop                                 |
| The page behind doesn't scroll while the viewer is open                         | ✅ desktop        | ☐ iOS                                            |
| Category filter appears only with enough photos (sample preview has it)         | ✅                | ☐                                                |

### 7. Full-screen artwork viewing (artwork pages)

| Check                                                                                   | Automated  | Device              |
| --------------------------------------------------------------------------------------- | ---------- | ------------------- |
| "View full screen" fills the screen in the dark tone; Close and Esc work; focus returns | ✅         | ☐                   |
| Portrait/landscape works fit without cropping in both orientations                      | ✅ desktop | ☐ rotate while open |

### 8. Contact links and clipboard

| Check                                                                            | Automated                              | Device                                   |
| -------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| "@art.by.moon_" and "Open Instagram" open a DM (app or web) in a new tab         | ✅ link target 302 → instagram.com/m/… | ☐ app hand-off, logged in and logged out |
| "Copy message" shows "Copied ✓" and the text pastes into Instagram               | ✅ with permission                     | ☐ iOS & Android over **HTTPS**           |
| If copying is blocked, the fallback message appears and the text can be selected | ✅ simulated                           | ☐                                        |
| Radio choices are big enough to tap; the selection is clearly visible            | ✅                                     | ☐                                        |

### 9. Screen sizes, orientation and safe areas

The site does not use `viewport-fit=cover`, so iOS keeps content inside the safe areas automatically. Full-height UI uses `svh`/`dvh`, never `100vh`.

| Check                                                                      | Automated                  | Device                     |
| -------------------------------------------------------------------------- | -------------------------- | -------------------------- |
| 320, 375, 390, 414, 768, 1024, 1440px: no sideways scroll, no clipped text | ✅ 390 · 768 · 1024 · 1440 | ☐ 320 (small Android), 414 |
| Rotate phone mid-page: layout reflows, no stuck horizontal scroll          | —                          | ☐                          |
| iPhone landscape (notch): nothing hidden under the notch or home indicator | —                          | ☐                          |
| Menu and viewers fill the visible screen when the toolbar shows or hides   | —                          | ☐ iOS                      |

### 10. Reduced motion

| Check                                                                     | Automated | Device                   |
| ------------------------------------------------------------------------- | --------- | ------------------------ |
| No intro, reveals, parallax, pinning or morph; everything visible at once | ✅        | ☐ iOS & Android settings |
| Smooth scrolling (Lenis) off; native scrolling                            | ✅        | ☐                        |

### 11. Loading, images and scrolling performance

| Check                                                                            | Automated                     | Device                                          |
| -------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------- |
| No layout shift while pages load (CLS 0 on all routes)                           | ✅                            | ☐ slow 4G (DevTools throttling on a real phone) |
| Images below the fold load as you approach them, not all at once                 | ✅ next/image lazy by default | ☐                                               |
| Scrolling stays smooth on a mid-range Android, especially the homepage           | —                             | ☐                                               |
| Fonts: text is readable immediately (swap), with no big reflow when fonts arrive | ✅ fallback metrics           | ☐ slow connection                               |

## What automated tests cannot tell you

- Whether motion _feels_ right on a phone (stutter, too slow, too much).
- iOS Safari engine differences (WebKit): view transitions, dialog behaviour, scroll locking, toolbar resizing.
- The Instagram app hand-off from a link.
- Real touch: accidental swipes, tap target comfort, scrolling inside the bookmark row.
- Performance on modest hardware and networks.
- Screen-reader use (VoiceOver, TalkBack). Not yet tested at all.
