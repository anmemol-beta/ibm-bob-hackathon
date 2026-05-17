# AsyncPair — Demo Video Script

> **For the AI / editor making this video.** This is a complete shot-by-shot
> script for a ~3-minute product demo. Narration is English.
>
> **CRITICAL — the narration moves across 7 different screens.** Do **not**
> place all narration over the landing page. **Section 5** is the line-by-line
> Narration → Screen map: every narration line has its own `Screen` value, and
> the video must cut to that screen for that line. Section 5 is the source of
> truth for editing; Sections 3–4 give the visual detail.

---

## 1. Specs

| | |
|---|---|
| Target length | ~3 minutes (2:40–3:10 is fine) |
| Aspect ratio | 16:9, 1080p or higher |
| Narration | English voiceover, calm and sincere — a developer telling a true story |
| Music | One soft, warm background track; swells gently at Scene 6 |
| Product | **AsyncPair** — async pair programming for teams split across time zones |
| Live app | `https://ibm-bob-hackathon-two.vercel.app` |
| Built with | IBM Bob (hackathon project) |

**Visual style of the product** (so generated frames match the real app):
clean, modern SaaS look; lots of whitespace; gradient accents running
blue → violet → magenta; rounded cards with soft shadows; strong modern
typography; inline SVG illustrations; a recurring time-zone motif (two clocks /
a globe). No stock photos.

---

## 2. The Story (emotional context — not narrated directly)

Two developers met in Boston and spent two years going to hackathons together —
ten of them, side by side. Last week one of them flew home to Korea. Now a
13-hour time zone gap sits between them: when one codes, the other sleeps. They
still want to build together, so they built AsyncPair — a tool that captures a
handoff at the moment of a git commit, and puts an AI stand-in in the chair of
whoever is currently asleep.

The video should feel **personal at the start and end** (Scenes 1, 6, 7) and
**crisp and confident in the middle** (Scenes 3–5, the product demo).

---

## 3. Screens (the 7 distinct screens — controlled vocabulary)

Every narration line in Section 5 uses exactly one of these `Screen` names.

| Screen name | What is on screen |
|---|---|
| `Landing — hero` | AsyncPair landing page, hero section: headline "Async Pair Programming Across Time Zones" + the Boston ↔ Seoul time-zone visual |
| `Landing — Problem` | Landing page "The Problem" section: 4 cards revealing on scroll |
| `Terminal` | A full-screen terminal running the `asyncpair capture` CLI |
| `App — Handoff` | The web app's **Handoff** page: handoff list, then a handoff detail view |
| `App — Pairing` | The web app's **Pairing** page: the AI stand-in chat |
| `Landing — CTA` | Landing page closing call-to-action section |
| `End card` | A clean end card with the AsyncPair logo |

---

## 4. Scenes (visual detail)

### Scene 1 — Our Story  (~35s) · Screen: `Landing — hero`
Open the landing page; hold on the hero with a slight slow drift. The headline
and the two cities (☀️ Boston 9:00 AM — *13 hours apart* — 🌙 Seoul 10:00 PM)
are visible. Mood: slow, warm, sincere.

### Scene 2 — The Problem  (~20s) · Screen: `Landing — Problem`
Scroll down slowly. Four cards reveal one by one: **Never Online Together**,
**Context Lost**, **24-Hour Feedback Loops**, **Blocked & Frustrated**.

### Scene 3 — Capture  (~35s) · Screen: `Terminal`
A clean, full-screen terminal, large monospace font, dark theme. Run
`asyncpair capture`. The CLI reads the commit just made and **generates two
questions specific to that change** (show the `🔍 Reading the commit…` beat).
Type short answers. Let `✓ Handoff captured successfully!` land.

Representative terminal output (questions are generated live — wording varies):
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

### Scene 4 — Pick Up  (~30s) · Screen: `App — Handoff`
The web app. Click **Handoff** in the nav → click the **"feature/notifications"**
card (*from Hyoungseo Son · pending*) → scroll the detail view (Git Activity:
4 commits; Developer Notes; 4 Scenarios) → click **Accept Handoff**.

### Scene 5 — The Stand-in  (~50s) · Screen: `App — Pairing`
The centerpiece. The `/pairing` chat screen; answers stream from a real AI
(Google Gemini) — keep the loading dots.
1. Click **Pairing**; select the notifications handoff.
2. **Question 1** (handoff already covers it) — type and send:
   *"I'm getting a 500 from the notification preferences endpoint — any idea
   why?"* → answered with the original developer's exact reasoning.
3. **Question 2** (handoff does NOT cover it) — type and send:
   *"There's no validation library in this project — what would you reach
   for?"* → the stand-in answers by referencing how the original developer
   solved it in **their other repositories**, in that developer's style.

Key beat: **Question 2's answer comes from the developer's past work, not the
handoff.**

### Scene 6 — Zoom Out  (~20s) · Screen: `Landing — CTA`
The landing page closing CTA section. Music swells gently. Mood: widening,
hopeful.

### Scene 7 — Closing  (~10s) · Screen: `End card`
The AsyncPair logo on a clean end card. Optionally flash the live URL
`ibm-bob-hackathon-two.vercel.app`.

---

## 5. Narration → Screen Map  (THE EDITING SOURCE OF TRUTH)

One row per narration line. **Show each line over the screen in its `Screen`
column** — the screen changes at lines 7, 11, 17, 20, 27 and 32. For a single
continuous TTS pass, read the `Voiceover` column straight down.

| # | Scene | Screen | Voiceover |
|---|---|---|---|
| 1 | 1 | `Landing — hero` | Two years ago, in Boston, we met. |
| 2 | 1 | `Landing — hero` | We kept showing up — ten hackathons, side by side, one laptop next to another. |
| 3 | 1 | `Landing — hero` | Then last week, my teammate flew home to Korea. |
| 4 | 1 | `Landing — hero` | Now thirteen hours sit between us. |
| 5 | 1 | `Landing — hero` | When I'm coding, he's asleep. When he's coding, I'm asleep. |
| 6 | 1 | `Landing — hero` | But we still want to build together — so we built a way to. |
| 7 | 2 | `Landing — Problem` | Async collaboration sounds easy — until you try it. |
| 8 | 2 | `Landing — Problem` | A git commit tells you what changed, never why. |
| 9 | 2 | `Landing — Problem` | A question sent at midnight waits a full day for an answer. |
| 10 | 2 | `Landing — Problem` | The handoff itself becomes the bottleneck. |
| 11 | 3 | `Terminal` | This is AsyncPair. |
| 12 | 3 | `Terminal` | I've just finished my session in Boston. |
| 13 | 3 | `Terminal` | Instead of writing a long handoff doc, I run one command — asyncpair capture. |
| 14 | 3 | `Terminal` | It reads the commit I just made, and asks me two questions about that exact change — while everything is still fresh in my head. |
| 15 | 3 | `Terminal` | Twenty seconds. |
| 16 | 3 | `Terminal` | It becomes a structured handoff — then I push, and log off. |
| 17 | 4 | `App — Handoff` | Thirteen hours later, my teammate wakes up in Seoul. |
| 18 | 4 | `App — Handoff` | The handoff is already waiting — what I did, what's still unfinished, and the exact situations he's most likely to run into, each with a suggested approach. |
| 19 | 4 | `App — Handoff` | He accepts it, and starts not from zero, but from where I stopped. |
| 20 | 5 | `App — Pairing` | Then he hits something the notes didn't cover. |
| 21 | 5 | `App — Pairing` | Normally, that's a lost day. |
| 22 | 5 | `App — Pairing` | Instead, he asks the AI stand-in. |
| 23 | 5 | `App — Pairing` | For the questions my handoff already answers, it replies with my exact reasoning. |
| 24 | 5 | `App — Pairing` | And for the ones it doesn't — like which validation approach to use — the stand-in looks at how I've solved it across my other repositories, and answers in my style. |
| 25 | 5 | `App — Pairing` | He stays unblocked. |
| 26 | 5 | `App — Pairing` | The pair never breaks, even though one of us is always asleep. |
| 27 | 6 | `Landing — CTA` | This isn't just our story. |
| 28 | 6 | `Landing — CTA` | It's every team split across time zones. |
| 29 | 6 | `Landing — CTA` | Every developer with a different rhythm — early risers, night owls, parents, remote teammates half a world apart. |
| 30 | 6 | `Landing — CTA` | They've all been told real collaboration needs a shared clock. |
| 31 | 6 | `Landing — CTA` | It doesn't. |
| 32 | 7 | `End card` | AsyncPair. Async pair programming, across any distance. Built with IBM Bob. |

---

## 6. Production Notes

- **Screen cuts.** The screen changes at lines 7, 11, 17, 20, 27, and 32 — make
  sure the visual actually cuts there. If a tool placed every line on one
  screen, that is wrong; re-map using the `Screen` column above.
- **Pace.** Leave a pause between each click so the narration can catch up.
  Easy to trim silence in editing, hard to stretch it.
- **Cursor.** Move it slowly and deliberately toward each target.
- **Emotion.** Lines 1–6 and 27–32 — slow and sincere. Lines 11–26 (the demo) —
  clear and confident.
- **Live AI (Scene 5).** Stand-in replies take a few seconds; keep the loading
  dots in — they signal "real AI," not a canned clip.
- **Readability.** 1080p or higher; browser zoom 100–110%; terminal and UI text
  must be legible in the final frame.
- **Music.** One soft background layer; let it swell slightly at Scene 6.
- **If it runs long.** This script is ~3 minutes. To shorten, trim Scenes 2 and
  6 first — the demo (Scenes 3–5) is the core.
- **Scenes are independent.** Terminal and browser scenes can be recorded
  separately and stitched; the narration is the connective tissue.
