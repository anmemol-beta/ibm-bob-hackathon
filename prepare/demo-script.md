# AsyncPair — Demo Video Production Script

> **For the AI / editor producing this video.** This is a locked, shot-by-shot
> production script for a ~3-minute demo. Follow it **exactly**. Do not
> interpret, improvise, summarize, reorder, or invent anything not written
> here. Read Section 0 before doing anything.

---

## 0. Hard Rules — read first

1. **Narration is LOCKED.** Use only the 32 lines in Section 4, word for word,
   in order. Do **not** paraphrase, shorten, expand, re-translate, or add new
   narration lines. Do not generate AI narration. Each line is bound to a
   specific shot in Section 5 — never move a line to a different shot.
2. **Two footage types only**, and each shot is tagged with exactly one:
   - **`AI-GENERATED`** — atmospheric story B-roll, created by a video-gen
     model from the prompt in that shot. Used only for the human story.
   - **`SCREEN RECORDING`** — a real recording of the actual AsyncPair product
     (its website, CLI, and app). Used for everything that shows the product.
3. **Never AI-generate the product.** The app UI, the CLI, the website, and any
   logo or screen must come from a real `SCREEN RECORDING`. Do not fabricate,
   redraw, or "enhance" product screens with a video model. This is a real,
   deployed product and the demo must show the real thing.
4. **AI-GENERATED clips must contain no readable text, no UI, no logos, no
   brand names.** They are mood/story only. They carry no on-screen words
   unless this script explicitly specifies a text overlay.
5. **Do not add** extra scenes, title cards, captions, lower-thirds, sound
   effects, or transitions beyond what each shot specifies.
6. If something is ambiguous, **stop and ask** — do not guess.

---

## 1. Specs

| | |
|---|---|
| Target length | ~3:00–3:20 |
| Aspect ratio | 16:9, 1080p or higher |
| Narration | English voiceover, one calm sincere voice — a developer telling a true story |
| Narration audio | A single VO track over the whole video. AI-GENERATED clips are silent (no model-generated speech or SFX) |
| Music | One soft, warm instrumental track under the whole video; swells gently at Scene 6; never louder than the VO |
| Product | **AsyncPair** — async pair programming for teams split across time zones |
| Live product URL | `https://ibm-bob-hackathon-two.vercel.app` |
| Built with | IBM Bob (hackathon project) |

---

## 2. The Story (context only — NOT narrated, do not put on screen)

Two developers met in Boston and spent two years going to hackathons together —
ten of them, side by side. Last week one flew home to Korea. Now a 13-hour time
zone gap sits between them: when one codes, the other sleeps. They still want to
build together, so they built AsyncPair — it captures a handoff at the moment of
a git commit, and puts an AI stand-in in the chair of whoever is asleep.

Emotional arc: **personal and warm** at the start and end (Scenes 1, 6, 7);
**crisp, confident, factual** in the middle product demo (Scenes 3–5).

---

## 3. Footage Type per Scene (the AI-gen vs real-clip decision)

| Scene | Content | Footage type | Why |
|---|---|---|---|
| 1 — Our Story | The backstory: meeting, hackathons, the flight, the time gap | **AI-GENERATED** B-roll, ending with one **SCREEN RECORDING** shot | No real footage exists of the backstory; generate it. The final shot reveals the real product. |
| 2 — The Problem | The product website's "The Problem" section | **SCREEN RECORDING** | It is a real page on the real site. |
| 3 — Capture | The `asyncpair` CLI capturing a handoff | **SCREEN RECORDING** | The CLI is real and must be shown working. |
| 4 — Pick Up | The web app's Handoff page | **SCREEN RECORDING** | Real product. |
| 5 — Stand-in | The web app's Pairing chat (live AI) | **SCREEN RECORDING** | Real product, real live AI answers. |
| 6 — Zoom Out | "Every team split across time zones" | **AI-GENERATED** B-roll, ending with one **SCREEN RECORDING** shot | The widening message needs people/places we cannot film; end on the real site. |
| 7 — Closing | AsyncPair end card | **SCREEN RECORDING** / simple graphic | Show the real logo and live URL. |

Net split: **Scenes 1 and 6 are AI-generated story B-roll** (each ending on a
real product shot). **Scenes 2–5 and 7 are real screen recordings** of the
product. Roughly 30% AI-generated, 70% real product footage.

---

## 4. Locked Narration — the exact 32 lines

Read verbatim, in this order. Line numbers are referenced by the shot list.

1. Two years ago, in Boston, we met.
2. We kept showing up — ten hackathons, side by side, one laptop next to another.
3. Then last week, my teammate flew home to Korea.
4. Now thirteen hours sit between us.
5. When I'm coding, he's asleep. When he's coding, I'm asleep.
6. But we still want to build together — so we built a way to.
7. Async collaboration sounds easy — until you try it.
8. A git commit tells you what changed, never why.
9. A question sent at midnight waits a full day for an answer.
10. The handoff itself becomes the bottleneck.
11. This is AsyncPair.
12. I've just finished my session in Boston.
13. Instead of writing a long handoff doc, I run one command — asyncpair capture.
14. It reads the commit I just made, and asks me two questions about that exact change — while everything is still fresh in my head.
15. Twenty seconds.
16. It becomes a structured handoff — then I push, and log off.
17. Thirteen hours later, my teammate wakes up in Seoul.
18. The handoff is already waiting — what I did, what's still unfinished, and the exact situations he's most likely to run into, each with a suggested approach.
19. He accepts it, and starts not from zero, but from where I stopped.
20. Then he hits something the notes didn't cover.
21. Normally, that's a lost day.
22. Instead, he asks the AI stand-in.
23. For the questions my handoff already answers, it replies with my exact reasoning.
24. And for the ones it doesn't — like which validation approach to use — the stand-in looks at how I've solved it across my other repositories, and answers in my style.
25. He stays unblocked.
26. The pair never breaks, even though one of us is always asleep.
27. This isn't just our story.
28. It's every team split across time zones.
29. Every developer with a different rhythm — early risers, night owls, parents, remote teammates half a world apart.
30. They've all been told real collaboration needs a shared clock.
31. It doesn't.
32. AsyncPair. Async pair programming, across any distance. Built with IBM Bob.

---

## 5. Shot List — shot by shot

13 shots. Each shot lists its footage type, duration, the exact narration line(s)
it carries, and full direction. **Cut to the next shot only when its narration
begins.**

---

### Shot 1A · `AI-GENERATED` · ~5s
- **Narration — line 1 (locked):** "Two years ago, in Boston, we met."
- **Visual:** Interior of a university hackathon at night. A large room, long
  tables, open laptops, soft string lights and monitor glow. Two young
  developers (mid-20s, casual hoodies) notice each other and settle in next to
  one another. Other participants are softly out of focus.
- **Camera:** slight side angle, shallow depth of field, gentle handheld drift.
- **Color/mood:** warm amber, nostalgic, hopeful.
- **AI video prompt (use verbatim):** *"Cinematic 5-second clip, warm amber
  lighting. Interior of a university hackathon at night: long tables, open
  laptops, soft string lights, monitor glow, blurred participants in the
  background. Two casually dressed developers in their mid-20s sit down side by
  side at one table. Shallow depth of field, gentle handheld camera, nostalgic
  mood. No text, no logos, no readable screens. Faces natural but not centered —
  emphasize posture and the shared space."*
- **On-screen text:** none.
- **Transition out:** soft cut.

### Shot 1B · `AI-GENERATED` · ~7s
- **Narration — line 2 (locked):** "We kept showing up — ten hackathons, side
  by side, one laptop next to another."
- **Visual:** a short montage feel — the same two developers working intently
  at different hackathon venues (a few quick beats: typing together, a whiteboard,
  a late-night energy-drink moment), always side by side, sharing one laptop.
- **Camera:** quick, warm, slightly energetic; small push-ins.
- **AI video prompt (use verbatim):** *"Cinematic 7-second warm montage: two
  developers in their mid-20s working side by side at hackathons across several
  different venues — typing together on one shared laptop, sketching on a
  whiteboard, a late-night moment with energy drinks. Quick gentle push-in cuts,
  amber nostalgic color grade, shallow depth of field. No text, no logos, no
  readable screens."*
- **On-screen text:** none.
- **Transition out:** soft cut.

### Shot 1C · `AI-GENERATED` · ~5s
- **Narration — line 3 (locked):** "Then last week, my teammate flew home to
  Korea."
- **Visual:** an airport / departure — a developer with a backpack walking
  through a terminal, or an airplane lifting off at dusk. Quiet, a little
  bittersweet.
- **Camera:** wide, still or slow.
- **AI video prompt (use verbatim):** *"Cinematic 5-second clip, dusk: a young
  developer with a backpack walks alone through an airport terminal toward a
  gate; or an airplane lifting off into an evening sky. Quiet, bittersweet mood,
  cool blue evening tones. Wide framing, slow camera. No text, no logos."*
- **On-screen text:** none.
- **Transition out:** soft cut.

### Shot 1D · `AI-GENERATED` · ~8s
- **Narration — lines 4–5 (locked):** "Now thirteen hours sit between us." /
  "When I'm coding, he's asleep. When he's coding, I'm asleep."
- **Visual:** a split screen. **Left:** a bright morning city, blue sky, a
  developer at a sunlit desk, awake and working. **Right:** the same hour
  elsewhere — a dark night city skyline, lit windows, a developer asleep, a
  laptop closed. A subtle clock motif may divide the two halves.
- **Camera:** static split screen, very slow drift on each half.
- **AI video prompt (use verbatim):** *"Cinematic 8-second split-screen clip.
  Left half: a bright sunny morning, a developer working at a sunlit desk by a
  window, blue sky outside. Right half: the same moment on the other side of
  the world — a dark night city skyline with lit windows, a developer asleep,
  laptop closed. Calm, slightly melancholic. Very slow camera drift on each
  half. No text, no logos, no readable screens."*
- **On-screen text:** none.
- **Transition out:** soft cross-dissolve into Shot 1E.

### Shot 1E · `SCREEN RECORDING` (real product — the website) · ~9s
- **Narration — line 6 (locked):** "But we still want to build together — so we
  built a way to."
- **Record:** the real AsyncPair landing page hero at the live URL.
- **Exact actions:** open `https://ibm-bob-hackathon-two.vercel.app`. Hold on
  the hero: the headline *"Async Pair Programming Across Time Zones"* and the
  Boston ↔ Seoul time-zone visual (☀️ Boston 9:00 AM — *13 hours apart* —
  🌙 Seoul 10:00 PM). Let the page sit still, or a very slight slow scroll.
- **Framing:** full browser window, clean — no clutter in the address bar /
  bookmarks, browser zoom 100%.
- **On-screen text:** none added (the page's own headline is the text).
- **Transition:** the cross-dissolve from 1D resolves onto this real page —
  this is the moment the story becomes the product.

---

### Shot 2A · `SCREEN RECORDING` (real product — the website) · ~20s
- **Narration — lines 7–10 (locked):** "Async collaboration sounds easy — until
  you try it." / "A git commit tells you what changed, never why." / "A question
  sent at midnight waits a full day for an answer." / "The handoff itself
  becomes the bottleneck."
- **Record:** the landing page "The Problem" section.
- **Exact actions:** from the hero, scroll down slowly into "The Problem"
  section. Four cards reveal one by one as you scroll: **Never Online
  Together**, **Context Lost**, **24-Hour Feedback Loops**, **Blocked &
  Frustrated**. Pace the scroll so each card is on screen as the matching idea
  is spoken.
- **Framing:** full browser window, zoom 100%.
- **On-screen text:** none added.
- **Transition out:** clean cut.

---

### Shot 3A · `SCREEN RECORDING` (real product — the CLI) · ~35s
- **Narration — lines 11–16 (locked):** "This is AsyncPair." / "I've just
  finished my session in Boston." / "Instead of writing a long handoff doc, I
  run one command — asyncpair capture." / "It reads the commit I just made, and
  asks me two questions about that exact change — while everything is still
  fresh in my head." / "Twenty seconds." / "It becomes a structured handoff —
  then I push, and log off."
- **Record:** a full-screen terminal on a real machine. Large monospace font
  (16pt+), dark theme.
- **Exact actions:**
  1. In a git repository, type `asyncpair capture` and press Enter.
  2. The CLI prints `🔍 Reading the commit to tailor the questions…`, then asks
     **two questions generated from that commit** (wording varies — it is live).
  3. Type a short answer to each question.
  4. Let `✓ Handoff captured successfully!` appear, then hold ~1s.
- **Representative output** (the questions are generated live — do NOT script
  them word-for-word, this is only to show the shape):
  ```
  $ asyncpair capture
  📝 Capturing handoff for commit: feat: deliver notifications over a WebSocket…
  🔍 Reading the commit to tailor the questions…
  ? Does the WebSocket channel still use the placeholder x-temp-token header
    for auth?  Yes — swap to getSession() before the demo.
  ? What's the next task on the notification preferences endpoint, and where?
    The POST handler in route.ts — add validation, it 500s on bad input.
  Generating handoff scenarios…
  ✓ Handoff captured successfully! — 4 scenarios
  ```
- **Framing:** terminal fills the frame; text must be legible at 1080p.
- **On-screen text:** none added.
- **Transition out:** clean cut.

---

### Shot 4A · `SCREEN RECORDING` (real product — the web app) · ~30s
- **Narration — lines 17–19 (locked):** "Thirteen hours later, my teammate
  wakes up in Seoul." / "The handoff is already waiting — what I did, what's
  still unfinished, and the exact situations he's most likely to run into, each
  with a suggested approach." / "He accepts it, and starts not from zero, but
  from where I stopped."
- **Record:** the web app at the live URL.
- **Exact actions:**
  1. Click **Handoff** in the top navigation.
  2. In the list, click the **"feature/notifications"** handoff card
     (*from Hyoungseo Son · pending*).
  3. In the detail view, scroll slowly through **Git Activity** (4 commits),
     **Developer Notes**, and the **4 Scenarios** (each with a suggested
     approach).
  4. Click the **Accept Handoff** button.
- **Framing:** full browser window, zoom 100%. Move the cursor slowly and
  deliberately to each target.
- **On-screen text:** none added.
- **Transition out:** clean cut.

---

### Shot 5A · `SCREEN RECORDING` (real product — live AI) · ~50s
This is the centerpiece. Two questions: one the **handoff** already answers,
one the stand-in answers from the **absent developer's other repositories**.
- **Narration — lines 20–26 (locked):** "Then he hits something the notes
  didn't cover." / "Normally, that's a lost day." / "Instead, he asks the AI
  stand-in." / "For the questions my handoff already answers, it replies with my
  exact reasoning." / "And for the ones it doesn't — like which validation
  approach to use — the stand-in looks at how I've solved it across my other
  repositories, and answers in my style." / "He stays unblocked." / "The pair
  never breaks, even though one of us is always asleep."
- **Record:** the `/pairing` chat screen of the web app. Answers stream from a
  real AI — keep the loading dots in.
- **Exact actions / beats:**
  1. Click **Pairing** in the navigation; select the notifications handoff.
  2. **Question 1** (handoff already covers it) — type and send:
     *"I'm getting a 500 from the notification preferences endpoint — any idea
     why?"* Wait for the stand-in's reply (the original developer's reasoning:
     the POST handler saves to the DB with no validation).
  3. **Question 2** (handoff does NOT cover it) — type and send:
     *"There's no validation library in this project — what would you reach
     for?"* Show the loading dots, then the reply — which references how the
     developer solved this **in their other repositories** (a small
     `requireFields` helper) and answers in that developer's style.
- **Framing:** full browser window, zoom 100%. Let each answer finish streaming
  before moving on.
- **On-screen text:** none added.
- **Editor note:** answers are live AI — exact wording differs every take, that
  is fine and proves it is real. The essential beat: **Question 2's answer comes
  from the developer's past work, not from the handoff.**
- **Transition out:** clean cut, then cross-dissolve into Shot 6A.

---

### Shot 6A · `AI-GENERATED` · ~6s
- **Narration — lines 27–28 (locked):** "This isn't just our story." / "It's
  every team split across time zones."
- **Visual:** a slow, wide view of the earth at the day/night terminator line,
  or a sweep across several lit cities at different times of day — conveying
  many places at once.
- **AI video prompt (use verbatim):** *"Cinematic 6-second clip: a slow wide
  view of planet Earth from space along the day-night line, city lights glowing
  on the night side; or a gentle sweep across several cities at different times
  of day. Calm, expansive, hopeful. Soft cinematic lighting. No text, no
  logos."*
- **On-screen text:** none.
- **Transition out:** soft cut.

### Shot 6B · `AI-GENERATED` · ~8s
- **Narration — line 29 (locked):** "Every developer with a different rhythm —
  early risers, night owls, parents, remote teammates half a world apart."
- **Visual:** a short montage of four different developers, each in their own
  setting: an early riser at a desk at sunrise; a night owl coding in a dark
  room lit by the screen; a parent working at a kitchen table with a child's
  drawing nearby; a remote worker in a cafe in another country.
- **AI video prompt (use verbatim):** *"Cinematic 8-second montage, four quick
  warm beats of different software developers in their own environments: (1) an
  early riser at a desk at sunrise, (2) a night owl coding in a dark room lit
  only by the screen, (3) a parent working at a kitchen table with a child's
  drawing pinned nearby, (4) a remote worker on a laptop in a cafe abroad. Warm,
  human, hopeful. Shallow depth of field. No text, no logos, no readable
  screens."*
- **On-screen text:** none.
- **Transition out:** soft cross-dissolve into Shot 6C.

### Shot 6C · `SCREEN RECORDING` (real product — the website) · ~7s
- **Narration — lines 30–31 (locked):** "They've all been told real
  collaboration needs a shared clock." / "It doesn't."
- **Record:** the landing page closing call-to-action section ("Ready to Bridge
  the Time Zone Gap?").
- **Exact actions:** rest on the CTA section; a very slight slow scroll or hold.
- **On-screen text:** none added.
- **Transition out:** clean cut.

---

### Shot 7A · `SCREEN RECORDING` / simple graphic · ~10s
- **Narration — line 32 (locked):** "AsyncPair. Async pair programming, across
  any distance. Built with IBM Bob."
- **Visual:** a clean end card with the real AsyncPair logo/wordmark (taken from
  the real site — do not redraw it). Hold steady. Optionally, for ~1–2s, show
  the live URL `ibm-bob-hackathon-two.vercel.app` in small text to prove it is
  a real, deployed product.
- **On-screen text:** the AsyncPair wordmark; optionally the live URL. Nothing
  else.
- **Transition out:** fade to black.

---

## 6. Production Notes

- **Screen cuts.** The screen/footage changes at the start of shots 1B, 1C, 1D,
  1E, 2A, 3A, 4A, 5A, 6A, 6B, 6C, 7A. If any narration line ends up over the
  wrong shot, it is wrong — re-align using Section 5.
- **Narration discipline.** If the voice model or editor is tempted to "smooth
  out" or add a connecting line — do not. The 32 lines in Section 4 are the
  whole script.
- **AI-GENERATED clips.** Keep faces de-emphasized (side angles, over-the-
  shoulder, hands, silhouettes, wide shots) to avoid uncanny results. They are
  silent — no model-generated speech or sound effects.
- **Pace.** Leave a short pause between clicks in screen recordings so the
  narration can catch up. Easy to trim silence later, hard to stretch it.
- **Emotion.** Shots 1A–1E and 6A–7A — slow and sincere. Shots 3A–5A (the
  product demo) — clear, confident, factual.
- **Live AI (Shot 5A).** Keep the loading dots; they signal real AI.
- **Readability.** 1080p+; browser zoom 100–110%; terminal and UI text legible
  in the final frame.
- **Music.** One soft instrumental track under everything; swell slightly at
  Scene 6; always below the VO.
- **If it runs long.** This script is ~3:00–3:20. To shorten, trim Shot 2A and
  Shot 6B first — the product demo (Shots 3A–5A) is the core and must stay.
- **Recording source.** Web scenes (1E, 2A, 4A, 5A, 6C, 7A) record from the
  live URL — it carries the seed handoff data and live AI. The CLI scene (3A)
  records on a local machine with the `asyncpair` CLI built and a Gemini key
  exported in that terminal.
