# AsyncPair — Demo Video Script

> **For the AI / editor making this video.** This is a complete shot-by-shot
> script for a ~3-minute product demo. Each scene gives you the visual, the
> on-screen action, and the exact voiceover line. Narration is English. The
> demo is built around a real, deployed web app and CLI — ideally you record
> the live product; if you generate visuals instead, the **Visual** blocks
> describe each frame closely enough to render.

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
a globe) for the two cities. No stock photos.

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

## 3. Scenes

### Scene 1 — Our Story  (~35s)

**Visual**
The AsyncPair landing page hero. A bold headline reads
*"Async Pair Programming Across Time Zones."* Below it, a time-zone visual:
☀️ **Boston 9:00 AM** — *13 hours apart* — 🌙 **Seoul 10:00 PM**, shown as two
clocks or a globe. Calm, spacious, gradient background.

**On-screen action / camera**
Open the landing page. Hold on the hero. A very slight slow drift or gentle
zoom — let the headline and the two cities breathe.

**Voiceover**
> "Two years ago, in Boston, we met. We kept showing up — ten hackathons, side
> by side, one laptop next to another. Then last week, my teammate flew home to
> Korea. Now thirteen hours sit between us. When I'm coding, he's asleep. When
> he's coding, I'm asleep. But we still want to build together — so we built a
> way to."

**Mood:** slow, warm, sincere.

---

### Scene 2 — The Problem  (~20s)

**Visual**
The landing page "The Problem" section. Four cards reveal one by one as the
page scrolls: **Never Online Together**, **Context Lost**, **24-Hour Feedback
Loops**, **Blocked & Frustrated**.

**On-screen action / camera**
Scroll down slowly from the hero. Each of the four cards animates into view in
sequence.

**Voiceover**
> "Async collaboration sounds easy — until you try it. A git commit tells you
> what changed, never why. A question sent at midnight waits a full day for an
> answer. The handoff itself becomes the bottleneck."

---

### Scene 3 — Capture: building the handoff with one command  (~35s)

**Visual**
A clean, full-screen terminal, large monospace font, dark theme. The developer
has just finished a coding session in Boston.

**On-screen action / camera**
1. In a git repository, type `asyncpair capture` and press Enter.
2. The CLI reads the commit the developer just made and **generates two
   questions specific to that exact change** — show the brief
   `🔍 Reading the commit…` beat.
3. The developer types short answers to both questions.
4. Let the `✓ Handoff captured successfully!` line land, then hold.

**Example terminal output** (the questions are generated live, so wording
varies each run — this is representative):
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

**Voiceover**
> "This is AsyncPair. I've just finished my session in Boston. Instead of
> writing a long handoff doc, I run one command — asyncpair capture. It reads
> the commit I just made, and asks me two questions about that exact change —
> while everything is still fresh in my head. Twenty seconds. It becomes a
> structured handoff — then I push, and log off."

---

### Scene 4 — Pick Up: receiving the handoff in Seoul  (~30s)

**Visual**
The AsyncPair web app. A shared top navigation bar. The developer moves from
the **Handoff** list to a handoff detail view.

**On-screen action / camera**
1. Click **Handoff** in the navigation.
2. In the list, click the **"feature/notifications"** handoff card
   (*from Hyoungseo Son · pending*).
3. In the detail view, scroll slowly through: **Git Activity** (4 commits),
   **Developer Notes**, and **4 Scenarios**, each with a suggested approach.
4. Click the **Accept Handoff** button.

**Voiceover**
> "Thirteen hours later, my teammate wakes up in Seoul. The handoff is already
> waiting — what I did, what's still unfinished, and the exact situations he's
> most likely to run into, each with a suggested approach. He accepts it, and
> starts not from zero, but from where I stopped."

---

### Scene 5 — The Stand-in: asking a teammate who's asleep  (~50s)

This is the centerpiece. It shows two kinds of answers: one the **handoff**
already contains, and one the stand-in draws from the **absent developer's
other repositories**.

**Visual**
The `/pairing` chat screen of the web app. A clean chat UI. Answers stream in
from a real AI (Google Gemini) — show the loading dots before each reply.

**On-screen action / camera**
1. Click **Pairing** in the navigation; select the notifications handoff.
2. **Question 1** — something the handoff already covers. Type and send:
   *"I'm getting a 500 from the notification preferences endpoint — any idea
   why?"*
   The stand-in answers with the original developer's exact reasoning (the
   POST handler saves to the DB with no validation).
3. **Question 2** — something the handoff does **not** cover. Type and send:
   *"There's no validation library in this project — what would you reach
   for?"*
   Show the loading dots, then the stand-in answers by referencing how the
   original developer solved this in **their other repositories** — a small
   `requireFields` helper — and answers in that developer's style.

**Voiceover**
> "Then he hits something the notes didn't cover. Normally, that's a lost day.
> Instead, he asks the AI stand-in. For the questions my handoff already
> answers, it replies with my exact reasoning. And for the ones it doesn't —
> like which validation approach to use — the stand-in looks at how I've solved
> it across my other repositories, and answers in my style. He stays
> unblocked. The pair never breaks, even though one of us is always asleep."

**Note for the editor:** the answers are generated live, so exact wording will
differ each take — that's fine, it proves it's real AI. The key beat is that
**Question 2's answer comes from the developer's past work, not the handoff.**

---

### Scene 6 — Zoom Out: this isn't just our story  (~20s)

**Visual**
The landing page closing / call-to-action section ("Ready to Bridge the Time
Zone Gap?"), or a clean closing text slide. Music swells gently here.

**Voiceover**
> "This isn't just our story. It's every team split across time zones. Every
> developer with a different rhythm — early risers, night owls, parents, remote
> teammates half a world apart. They've all been told real collaboration needs
> a shared clock. It doesn't."

**Mood:** widening, hopeful.

---

### Scene 7 — Closing  (~10s)

**Visual**
The AsyncPair logo on a clean end card. Optionally flash the live URL
`ibm-bob-hackathon-two.vercel.app` for a moment to show it's a real, deployed
product.

**Voiceover**
> "AsyncPair. Async pair programming, across any distance. Built with IBM Bob."

---

## 4. Full Voiceover Script (continuous — for a single TTS pass)

> Two years ago, in Boston, we met. We kept showing up — ten hackathons, side
> by side, one laptop next to another. Then last week, my teammate flew home to
> Korea. Now thirteen hours sit between us. When I'm coding, he's asleep. When
> he's coding, I'm asleep. But we still want to build together — so we built a
> way to.
>
> Async collaboration sounds easy — until you try it. A git commit tells you
> what changed, never why. A question sent at midnight waits a full day for an
> answer. The handoff itself becomes the bottleneck.
>
> This is AsyncPair. I've just finished my session in Boston. Instead of
> writing a long handoff doc, I run one command — asyncpair capture. It reads
> the commit I just made, and asks me two questions about that exact change —
> while everything is still fresh in my head. Twenty seconds. It becomes a
> structured handoff — then I push, and log off.
>
> Thirteen hours later, my teammate wakes up in Seoul. The handoff is already
> waiting — what I did, what's still unfinished, and the exact situations he's
> most likely to run into, each with a suggested approach. He accepts it, and
> starts not from zero, but from where I stopped.
>
> Then he hits something the notes didn't cover. Normally, that's a lost day.
> Instead, he asks the AI stand-in. For the questions my handoff already
> answers, it replies with my exact reasoning. And for the ones it doesn't —
> like which validation approach to use — the stand-in looks at how I've solved
> it across my other repositories, and answers in my style. He stays unblocked.
> The pair never breaks, even though one of us is always asleep.
>
> This isn't just our story. It's every team split across time zones. Every
> developer with a different rhythm — early risers, night owls, parents, remote
> teammates half a world apart. They've all been told real collaboration needs
> a shared clock. It doesn't.
>
> AsyncPair. Async pair programming, across any distance. Built with IBM Bob.

---

## 5. Production Notes

- **Pace.** Leave a pause between each click so the narration can catch up.
  It's easy to trim silence in editing, hard to stretch it.
- **Cursor.** Move it slowly and deliberately toward each target so viewers can
  follow.
- **Emotion.** Scenes 1, 6, 7 — slow and sincere. Scenes 3–5 (the demo) — clear
  and confident.
- **Live AI (Scene 5).** Stand-in replies take a few seconds; keep the loading
  dots in — they signal "real AI," not a canned clip.
- **Readability.** 1080p or higher; browser zoom 100–110%; make sure terminal
  and UI text is legible in the final frame.
- **Music.** One soft background layer; let it swell slightly at Scene 6.
- **If it runs long.** Submission videos are usually 2–4 minutes. This script
  is ~3. To shorten, trim Scenes 2 and 6 first — the demo (3–5) is the core.
- **Scenes are independent.** Terminal scenes and browser scenes can be
  recorded separately and stitched; the narration is the connective tissue.
