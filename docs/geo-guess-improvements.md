# Geo Guess quality pass

## Rules

Each round selects one country from the loaded atlas. Beginner, Intermediate,
Advanced, and Expert allow 12, 10, 8, and 6 guesses respectively. Area
eligibility, clue order, and reveal thresholds live in
`src/features/games/geo-guess/model/rules.ts`.

The first clue is visible immediately. Later clues unlock at guesses 1, 2, 3,
5, 7, and 9 for Beginner; 2, 4, 6, 8, and 9 for Intermediate; 2, 4, 6, and 7
for Advanced; and 2, 4, and 5 for Expert. Easier levels reveal more direct clues
earlier. All revealed clues remain available. Clicking a country or submitting
its name uses one guess. Repeating a country is free. A correct final guess still
wins. Completed rounds cannot accept more guesses.

Replay returns to difficulty selection, then starts a fresh round even if the
difficulty is unchanged. The previous target is excluded when another eligible
country exists. Leaving Geo Guess clears its session.

## Fixed

- Empty rounds on same-difficulty replay: target selection now runs from the
  start event, and the reducer initializes the whole round in one action.
- Name mismatches between map and clue data: selections use ISO2 country codes.
- Guesses consumed inconsistently by repeated clicks: distinct guesses are
  tracked explicitly and validated in the reducer.
- Disappearing clues: clue history is derived from the target and guess count.
- Misleading timer: the interface now states guesses remaining and the rules.
- Atlas retry hidden behind onboarding: loading and retry are handled inside
  the starting dialog; play waits for usable data.
- Mobile dialogs that can exceed the screen: dialogs have bounded scrolling.

## Experience improvements

- Difficulty choices explain attempts, clue counts, and eligible country size.
- Map highlighting retains incorrect guesses and reveals the answer at the end.
- Name selection provides keyboard and small-country access.
- Clue and guess history support deduction without relying on memory.
- Feedback names the incorrect guess and announces remaining attempts.
- Results include country, capital, and region, with an option to explore the map.

## Suggested next iterations

1. **Refresh and document the geography dataset.** The checked-in data has no
   source date and includes old country names and unresolved neighbor codes
   such as `UNK`. Add provenance, update dates, validation, and a documented
   territory policy before treating facts as current. Approximate population
   formatting does not solve stale source data.
2. **Playtest clue order and pacing.** The current progression starts Beginner
   with continent and capital while harder levels delay or omit direct clues.
   Measure completion rates before adding an optional paid clue reveal.
3. **Add short challenge sessions.** Five-round runs, difficulty-specific best
   results, and a daily seeded puzzle could give players a reason to return.
   Define scoring and fair comparison rules before adding leaderboards.
4. **Add optional directional feedback.** Distance and bearing can make wrong
   guesses informative. Define how islands and overseas territories are handled
   before selecting country centers.
5. **Optimize atlas delivery.** The current GeoJSON is about 11.2 MB uncompressed.
   Measure mobile loading/rendering, then simplify geometry while preserving
   small-country selection and accurate answer reveals.

These are proposals; this pass does not add accounts, analytics, leaderboards,
external services, or a new geography source.

## Verification

- `npm test`: round transitions, replay, final-attempt wins, frozen results,
  duplicate guesses, persistent clues, and difficulty eligibility.
- `npm run typecheck` and `npm run lint`.
- `npm run test:e2e`: builds the production app, tests desktop/mobile gameplay,
  same-difficulty replay through a second win, map aliases, clue retention,
  keyboard controls, accessibility, and atlas retry.
