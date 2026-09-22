# Aqsa's Learning Garden

A daily learning app for Grades 1 and 2, with Math, English and Science, separate Learn and Exercises views, spoken reading, typed/multiple-choice answers, a handwriting canvas and a grown-up progress dashboard.

## A full year of learning

- **365 daily sets per subject per grade**, with 10 questions per set: 30 daily question slots, 10,950 across a year at one grade, or 21,900 across both grades.
- Each day includes a matching mini-lesson, a worked example or reading passage, a visual text model, answer explanations, a scored final challenge and an optional grown-up-guided activity.
- Thirteen topic blocks cover number sense through multi-step problems; phonics through reading evidence; and living things through simple scientific investigations.
- Science has 48 weekly concepts followed by four project weeks. Daily tasks move through observation, modeling, explanation, sorting, prediction, application and reflection.
- Grade 2 uses larger numbers and additional language skills, including digraphs, silent-e vowels, proper nouns, irregular plurals and subject–verb agreement.
- Day 365 is a year-finale activity. Earlier skills deliberately recur for reinforcement. These are distinct daily sets generated from teaching templates and data, **not 21,900 individually authored, unrelated questions**. Some foundational questions recur.
- The first visit starts Day 1. Subsequent local calendar dates advance the path automatically, including weekends. A day selector supports catch-up and exploration. The start date is editable in Grown-up View.
- The regular set remains the same after refresh. “Try another 10 questions” creates a separate bonus variant without replacing the daily set.
- After Day 365, the path stays at the finale and remains browsable. It does not silently repeat as a second-year curriculum.

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

This checks all 2,190 daily sheets and two bonus variants each: deterministic output, distinct daily sets, no within-sheet duplicate prompts, valid choices, answer metadata, arithmetic cases and date boundaries (including leap days and daylight-saving changes).

For the browser checks, install the development dependency and Chromium, start the server above, then run:

```bash
npm install --prefix tests
npm exec --prefix tests -- playwright install chromium
node tests/ui.test.cjs
```

The browser checks (included for a browser-capable environment) cover navigation, scoring, stable daily/bonus sets, legacy score preservation, grade changes, Day 365, handwriting mode and mobile overflow.

## Storage and limitations

Progress, start date, grade and bonus counters are stored in this browser's local storage. Existing scores are retained. Different browsers/devices do not synchronize, and clearing browser data removes saved progress. Handwritten answers and open activities need a grown-up to check them; they are not recognized or scored automatically. Speech depends on the device's browser and installed voices.

The path is a learning resource, not a claim of alignment with a particular school district's curriculum. It does not include embedded videos or cloud accounts.

DOM integration checks can run without launching a browser: `node tests/dom.test.cjs` after installing the test dependencies.
