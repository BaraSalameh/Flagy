# flagy.

An interactive geography game built with Next.js, React, Redux Toolkit, and Leaflet.
The game hub offers Geo Guess, Map Master, and Outline Explorer.

## Run locally

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a production build, run
`npm run build`, then `npm start`.

## Geo Guess

Find a mystery country using progressively revealed clues. Choose a difficulty,
then select countries on the map or use the country-name selector. There is no
timer: each distinct guess uses one attempt, and repeated guesses are free.

| Difficulty   | Guesses | Clues | Eligible area    |
| ------------ | ------: | ----: | ---------------- |
| Beginner     |      12 |     7 | Over 200,000 km² |
| Intermediate |      10 |     6 | Over 100,000 km² |
| Advanced     |       8 |     5 | Over 20,000 km²  |
| Expert       |       6 |     4 | Any size         |

The first clue appears immediately. Later clues unlock at guesses 1, 2, 3, 5,
7, and 9 for Beginner; 2, 4, 6, 8, and 9 for Intermediate; 2, 4, 6, and 7 for
Advanced; and 2, 4, and 5 for Expert. Beginner starts with continent and reveals
capital early, while the harder levels provide fewer, less direct clues. Previous
clues and guesses remain available. A correct selection wins, including on the
last attempt. At the end, explore the highlighted answer or play again.

Country identity uses ISO2 codes so differences in display names do not affect
correctness. Only countries present in both atlas datasets can be selected as
targets. Replay starts a fresh round and avoids the last target when possible.

## Map Master

Find each named country on the map. Start at 10 points and reach 20 within
15 guesses. There is no timer. Correct answers advance to the next country;
wrong answers keep the current target. A score of zero ends the challenge.

| Difficulty   | Correct | Incorrect |
| ------------ | ------: | --------: |
| Beginner     |      +4 |        −1 |
| Intermediate |      +3 |        −2 |
| Advanced     |      +2 |        −2 |
| Expert       |      +2 |        −3 |

Country-size eligibility matches Geo Guess. Repeated wrong guesses for the same
target are free, and accidental double clicks after a correct answer are ignored.
Score, remaining guesses, feedback, and guess history stay available. Explore the
last answer at the end or start a fresh challenge at any difficulty.

## Outline Explorer

Choose the name of the highlighted country. The score and guess limit match
Map Master; Beginner offers up to three choices, Intermediate four, Advanced
five, and Expert six. Intermediate prioritizes distractors from the same
continent; Advanced and Expert prioritize the same region, then continent.
Wrong choices are disabled after one attempt. Correct answers show feedback and
wait for **Next country** before advancing.

The outline is framed automatically. Zoom or use **Center outline** to inspect
small countries. At the end, explore the answer or replay at any difficulty.

## Code organization

- `src/features/games/geo-guess/model/rules.ts`: difficulty settings, clue
  formatting, and eligible-country selection.
- `src/features/games/geo-guess/model/geo-guess-slice.ts`: atomic round
  initialization, guesses, outcomes, and reset behavior.
- `src/features/games/geo-guess/GeoGuess.tsx`: onboarding, results, and game flow.
- `src/features/games/geo-guess/GuessPanel.tsx`: persistent clues and name entry.
- `src/features/games/map-master/model`: scoring, challenge decks, round state,
  and regression tests.
- `src/features/games/map-master/ChallengePanel.tsx`: target, score, and feedback.
- `src/features/games/outline-explorer/model`: choice generation, scoring, round
  state, and regression tests.
- `src/features/games/outline-explorer/OutlineMap.tsx`: highlighting and framing.
- `src/features/map/CountrySelectionMap.tsx`: shared Geo Guess/Map Master map
  selection, keyboard controls, highlighting, and answer reveal.
- `src/lib/contexts/MapProvider.tsx`: atlas loading and retry.
- `public/data`: bundled country information and map geometry.

The historical Palestine polygon and its adjoining Syrian, Lebanese,
Jordanian, and Egyptian boundaries in `countries.geo.json` come from GeoMolg's
Historical Palestine feature layer. Run
`node scripts/update-palestine-geometry.mjs` to refresh and dissolve those
source geometries for the game atlas while preserving shared border vertices.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

The browser suite builds and serves the production app on port 3010 using a
separate `.next-playwright` output directory. It covers desktop and mobile,
keyboard interaction, accessibility, data retry, and same-difficulty replay.

See the [Geo Guess roadmap](docs/geo-guess-improvements.md),
[Map Master roadmap](docs/map-master-improvements.md), and
[Outline Explorer roadmap](docs/outline-explorer-improvements.md) for changes,
design proposals, and outstanding geography-data limitations.
