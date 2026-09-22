# Aqsa's Learning Garden

A daily learning app for Grades 1 and 2, with Math, English and Science, separate Learn and Exercises views, spoken reading, typed/multiple-choice answers, a handwriting canvas and a grown-up progress dashboard.

## Mixed daily learning, full-year review and games

- **365 days for each grade and subject, with 14 questions per subject each day.** That is 42 daily question slots at one grade.
- Every math set includes addition, subtraction, multiplication, division, word problems, number lines and number words. Three additional types rotate from place value, comparisons, patterns, shapes, measurement, time, money, fractions, data, missing numbers and odd/even numbers. Four core types receive an extra question, selected daily. No type occupies more than two slots.
- Arithmetic uses two-digit values in Grade 1 and larger values in Grade 2, with gentle progression through the year. Multiplication and division use small exact groups. Column arithmetic, counter arrays, number lines, clocks, shapes, fraction bars and charts provide visual support.
- English mixes story comprehension, spelling, nouns, verbs, adjectives, opposites, punctuation and five rotating language skills. Science mixes six topic concepts with prediction, tools, measurements, fair tests, observation and safety.
- The regular set is deterministic for a grade and day. Bonus variants are separate. Core skills recur for reinforcement; these are generated mixed-practice sets, not a promise of zero repeated facts or question templates.
- **Year preview** shows all 365 days, both grades and all subjects. Families can inspect every question, reveal answers/explanations, print a selected day and practice the exact previewed set without first completing other days. Previewing does not change scores.
- **Play & learn** offers Number-line Hop, Coin Shop, Word Garden and Science Sorter. Games give feedback, retries and stars; they do not affect exercise scores. Game stars last for the current session.
- **Reading voice** in Grown-up View offers available English voices, speed choices, a sample and Stop. Automatic selection favors voices labeled natural/enhanced where available, uses normal pitch and defaults to 0.95 speed. This is device speech, not newly recorded or cloud-generated narration. Actual voice quality and available voices depend on the device/browser.
- Learn remains separate from Exercises and includes the daily focus, worked examples, optional activities and foundation lessons. The exercises combine skills across the curriculum from Day 1, as requested; they do not wait for the corresponding topic block.
- The first visit starts Day 1; local calendar dates advance the path. The year start date can be changed in Grown-up View. After Day 365 the path stays at the finale, and every day remains available for review.
- Prior scores are preserved. A revision marker prevents completed old single-topic sets from marking the new mixed sets complete.

## Score storage and device synchronization

Every completed exercise is saved immediately in browser storage with its date, time, grade, subject, learning day, score, correct count and total. The app remains usable offline.

Optional cloud synchronization lets the same profile see scores on multiple phones, tablets and computers. A profile uses a unique username plus a 6–12 digit private parent PIN. A username alone cannot open the records. Existing local scores upload after the first sign-in, records from other devices download, and later results sync automatically when online. The PIN is hashed in the database; the browser stores an opaque session token that expires after 90 days of inactivity. Five incorrect attempts lock sign-in for five minutes.

To activate cloud sync:

1. Create a Supabase project and run `supabase-schema.sql` in its SQL Editor.
2. Copy the project URL and public anon key into `cloud-config.js`.
3. Redeploy. Open **Grown-up View → Access scores on every device**, create the profile once, and use **Sign in and sync** on other devices.

The anon key is intentionally public. The database tables grant it no direct access; only the three validation functions in the schema can create a profile, sign in, and synchronize scores. Do not put the Supabase service-role key in this repository.

## Run locally

Serve this folder with any static web server:

```bash
python -m http.server 8080
```

Open http://localhost:8080. No build, API key, runtime AI service or paid question service is required.

## Validation

```bash
node tests/year.test.cjs
```

This checks all 2,190 daily sheets and two bonus variants each: deterministic output, distinct daily sets, no within-sheet duplicate prompts, at least ten skill types in every set, all seven required math types, a maximum of two questions per math type, valid choices, answer metadata, arithmetic cases and date boundaries (including leap days and daylight-saving changes).

For the browser checks, install the development dependency and Chromium, start the server above, then run:

```bash
npm install --prefix tests
npm exec --prefix tests -- playwright install chromium
node tests/ui.test.cjs
```

The browser checks (included for a browser-capable environment) cover navigation, scoring, stable daily/bonus sets, legacy score preservation, grade changes, Day 365, handwriting mode and mobile overflow.

## Storage and limitations

Progress, start date, grade and bonus counters are stored in this browser's local storage. Scores synchronize between browsers and devices only after cloud setup and profile sign-in. Clearing browser data signs out that device; signing in again restores cloud scores. Handwritten answers and open activities need a grown-up to check them; they are not recognized or scored automatically. Speech depends on the device's browser and installed voices.

The path is a learning resource, not a claim of alignment with a particular school district's curriculum. It does not include embedded videos or cloud accounts.

DOM integration checks cover scoring, previewing all 365 days, answer reveal, playing all four games, preserving old scores and selecting voices. They run without launching a browser: `node tests/dom.test.cjs` after installing the test dependencies.
