# Aqsa's Learning Garden

A responsive test version of a daily learning app for Grades 1 and 2. It includes Math, English, and Science practice, typed and Apple Pencil-friendly answers, automatic scoring, speech-based spelling prompts, and a parent progress dashboard.

## Test locally

Open `index.html` directly, or serve the folder with any static web server.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Current MVP

- One five-question daily activity per subject
- Grade 1 and Grade 2 question banks
- Type, multiple-choice, and handwriting modes
- Spoken spelling questions using the browser speech engine
- Score screen with another-exercise option
- Daily, monthly, and yearly progress charts
- Local browser storage for test data
- Responsive iPad and desktop layout

## Important test-version limitation

Typed and multiple-choice answers are scored automatically. Handwritten answers are drawn on a canvas and checked by a grown-up. Automatic handwriting recognition, child accounts, cloud synchronization, parent authentication, and Grades 3-8 are planned for later phases.

## Suggested next phases

1. Add child and parent accounts with cloud progress storage.
2. Expand the curriculum from Grade 3 through Grade 8.
3. Add printable worksheets, badges, weekly goals, and adaptive difficulty.
4. Add handwriting recognition and teacher-reviewed open responses.
5. Package as an installable Progressive Web App and deploy.
