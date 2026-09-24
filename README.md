# Aqsa's Learning Garden

An offline-first daily learning app for Grades 1–8 and supported VE 6, VE 7 and VE 8 pathways. It includes Math, English and Science lessons, mixed practice, games, read-aloud support, handwriting, year preview, date-wise progress and optional cross-device score synchronization.

## Learning levels

- Grades 1–5: elementary foundations and progressive skill growth.
- Grades 6–8: middle-school ratios, algebra, geometry, statistics, literature, writing, life science, physical science, Earth/space science and scientific reasoning.
- VE 6, VE 7 and VE 8: the official grade label is retained, but Math and English use a supported instructional band with shorter directions, familiar language, smaller steps and repeated practice. Science keeps age-appropriate grade-level topics with simplified explanations and evidence prompts.
- VE materials use community, school, technology, budgeting, safety and life-skill contexts rather than childish labels or themes.

## Complete 365-day program

- Every level has 365 deterministic days for all three subjects. This provides 12,045 daily lesson/exercise sheets across the 11 pathways.
- Grades 1–2 contain 14 mixed questions per subject each day. Grades 3–8 and VE contain 15.
- Daily sets spiral skills instead of repeating one question pattern. Math includes operations, fractions, decimals or money, number lines or integers, patterns, equations, geometry, measurement, data and real-world problems. Difficulty grows by level.
- English combines a fresh passage with main idea, details, sequence, cause and effect, inference, evidence, vocabulary, grammar, punctuation, sentence combining, transitions, purpose and summary.
- Science combines the current unit with spiral review, vocabulary, models, variables, data, claims, safety, engineering and a daily application challenge.
- Each level and subject has 13 four-week units plus a Day 365 finale. Bonus attempts create a separate deterministic variant rather than repeating the regular set.

## Rich learning pages

Each daily lesson now includes:

1. What to know
2. Steps to use
3. A worked example
4. Vocabulary or visual model
5. A common mistake
6. A real-world connection
7. A quick check
8. A hands-on or explanation challenge

The complete lesson library exposes all 13 yearly units for each subject and level. Learners can hear the lesson, study the example, browse the full-year sequence and then open that day’s mixed practice.

## Games and accessibility

The Play & Learn area includes eight level-aware games:

- Number-line Hop
- Smart Shopping
- Word Builder
- Science Sorter
- Fraction Match
- Equation Quest
- Context Clue Detective
- Lab Sequence

Games give immediate feedback, retries and stars without changing exercise scores. The app also supports typed or multiple-choice answers, an Apple Pencil/touch writing canvas, selectable English device voices and adjustable reading speed.

## Full-year family and teacher review

Year Preview opens every day, lesson and question for any level. Answers and explanations can be revealed, a selected day can be printed, and the exact set can be practiced. Previewing does not change scores.

The first visit starts Day 1. Local calendar dates advance the path, and the start date can be changed in Grown-up View. After Day 365 the path remains on the finale while all earlier days stay available.

## Scores and cross-device synchronization

Completed exercises are saved immediately in browser storage with date, time, level, subject, learning day, score, correct count and total. The app continues working offline.

Optional Supabase synchronization lets one username and 6–12 digit parent PIN access the same score history on multiple devices. Existing local scores upload after sign-in, cloud records download, and later results retry automatically when online. PIN hashes remain in Supabase; the browser receives only an expiring session token.

For a new Supabase project:

1. Run `supabase-schema.sql` in Supabase SQL Editor.
2. Put the project URL and public publishable/anon key in `cloud-config.js`.
3. Deploy, create the profile once, then use the same username and PIN on other devices.

For the existing Aqsa project upgrading from Grades 1–2, run `supabase-grade8-ve-migration.sql` once after deployment. It preserves all profiles, sessions and scores while allowing the new Grade 3–8 and VE level IDs.

Do not put a Supabase service-role key in this repository. The public key has no direct table access; profile and score operations pass through validation functions.

## Run locally

Serve the repository as a static site:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`. No build step, runtime AI service or paid question API is required.

## Validation

Install the test dependencies and run the complete deterministic and DOM suite:

```bash
npm install --prefix tests
npm test --prefix tests
```

The release suite verifies:

- all 12,045 daily sheets;
- regular plus two bonus variants;
- 535,455 generated question instances;
- deterministic output and fresh day/bonus fingerprints;
- answer/choice integrity and no duplicate prompts within a sheet;
- all 11 level selectors, enriched lesson sections and 13-unit libraries;
- Grade 1–8 and VE exercise rendering;
- all eight games;
- scoring, handwriting, voice, date changes and legacy-score preservation;
- Grade 1–8 and VE cloud upload/download merge behavior.

`tests/ui.test.cjs` provides an additional Playwright browser check when Chromium can run in the host environment.

## Important notes

The app is a broad learning and practice resource, not a claim of alignment with one school district’s pacing guide. VE content is scaffolded instructional material, not an individualized education plan or a replacement for teacher judgment. Handwritten work and open-ended challenges require adult or teacher review. Speech quality depends on the voices installed on the device.
