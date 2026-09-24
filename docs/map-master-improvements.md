# Map Master quality pass

## Rules

Start at 10 points. Reach 20 points within 15 guesses to win. A score of zero or
using all 15 guesses without reaching 20 ends the challenge. A winning fifteenth
guess takes precedence over the guess limit. Scores stay between 0 and 20.

| Difficulty   | Correct answer | Wrong answer | Target eligibility    |
| ------------ | -------------: | -----------: | --------------------- |
| Beginner     |             +4 |           −1 | Area over 200,000 km² |
| Intermediate |             +3 |           −2 | Area over 100,000 km² |
| Advanced     |             +2 |           −2 | Area over 20,000 km²  |
| Expert       |             +2 |           −3 | Any size              |

Correct answers advance to the next named country. Wrong answers keep the current
target and mark the selected country. Repeating a wrong guess for that target is
free. A second click on the previous correct answer is ignored before a new
country is attempted, preventing accidental penalties from double clicks.

Targets come from a shuffled deck of eligible countries that exist in both atlas
datasets. They do not repeat until that deck is exhausted. Replay avoids starting
with the previous final target when alternatives exist. A one-country pool can
reuse its sole target. The real atlas has multiple targets at every difficulty.

## Changes

- Replaced separate target-selection and counter effects with a single reducer
  transition for scoring, guess history, result, and target advancement.
- Removed the obsolete Map Master random-country hook and counter actions;
  their previous implementations remain recoverable through Git history.
- Initialized each replay explicitly, including when difficulty is unchanged.
- Matched answers by ISO2 country code instead of display names.
- Replaced the misleading Time counter with score and guesses remaining.
- Explained rewards, penalties, and country eligibility before play and kept
  scoring visible during the challenge.
- Retained feedback after correct answers, plus a readable guess history.
- Kept incorrect guesses marked until the target is solved and correct answers
  highlighted during the session. Color is accompanied by text feedback.
- Replaced discouraging result messages with results and an answer-exploration
  option that highlights the final target.
- Added usable loading and retry inside onboarding and cleared session state
  when leaving the game.
- Shared map selection, keyboard interaction, zoom, and answer framing with
  Geo Guess instead of maintaining duplicate implementations.

## Suggested next iterations

1. **Continent practice:** choose a region for a shorter, more approachable
   country pool. Preserve separate best results for each pool and difficulty.
2. **Learning mode:** allow an explicit reveal, show the country and capital,
   and revisit missed countries after a few questions. Keep it separate from
   scored play so players can learn without repeated losses.
3. **Short sessions and personal bests:** offer five- or ten-country runs with
   accuracy and streak records. Store records locally before adding accounts.
4. **Better difficulty calibration:** country size alone does not capture how
   recognizable a country is. Playtest the rebalanced rewards and penalties,
   then consider curated pools only if completion data shows a need.
5. **Map usability and data:** provide a fair small-island interaction design,
   measure mobile rendering of the roughly 11.2 MB GeoJSON, and document country
   data sources and territory policy. The existing dataset has undated facts
   and inconsistent names; code-based identity fixes matching, not data freshness.

## Verification

Unit coverage checks all four scoring rules, target progression, duplicate
selection protection, country aliases, score clamping, win/loss freezes, a win
on guess 15, positive-score exhaustion at guess 15, replay, empty pools, and
eligible deck selection.

The production-browser suite checks desktop and mobile scoring, a second win
after same-difficulty replay, correct-answer feedback, map aliases, score-zero
loss and answer reveal, navigation reset, loading recovery, accessibility, and
320px layout. Geo Guess regressions also run against the shared map component.

Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run test:e2e`.
