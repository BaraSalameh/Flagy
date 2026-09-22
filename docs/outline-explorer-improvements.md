# Outline Explorer quality pass

## Rules

Identify the highlighted country by selecting its name. Start with 10 points and
reach 20 within 20 guesses. A score of zero or exhausting the guess allowance
without reaching 20 ends the session. A winning final guess still wins. There is
no timer.

| Difficulty   | Correct | Incorrect | Choices | Target eligibility    |
| ------------ | ------: | --------: | ------: | --------------------- |
| Beginner     |      +4 |        −1 | Up to 4 | Area over 200,000 km² |
| Intermediate |      +3 |        −2 | Up to 5 | Area over 100,000 km² |
| Advanced     |      +2 |        −3 | Up to 5 | Area over 20,000 km²  |
| Expert       |      +1 |        −4 | Up to 6 | Any size              |

A wrong choice costs points once and becomes disabled. A correct answer freezes
the choices, shows the country's name, capital, and region, and offers **Next
country**. Players control when to continue. The score stays between 0 and 20.

Replay initializes a fresh session even at the same difficulty and avoids the
previous target as the opener when alternatives exist. Targets are shuffled and
do not repeat until the eligible pool is exhausted. Choice sets contain distinct
countries and the answer exactly once. Pools with fewer than two eligible
countries cannot start; small pools use fewer choices.

## Fixed and improved

- Replaced target, choice, and score effects with explicit start, guess, and
  next-challenge actions. All consequences of a guess update together.
- Centralized difficulty settings and precomputed choices outside reducers,
  keeping state transitions deterministic and easy to test.
- Switched map highlighting and answer identity to ISO2 codes, fixing cases
  such as Vatican/Vatican City where display names differ.
- Replaced the misleading Time counter with score and guesses remaining.
- Disabled tried choices and protected solved/finished challenges from extra
  scoring, including accidental double clicks.
- Kept feedback visible after correct guesses and added a guess history.
- Increased the outline map's zoom range, framed answers around the controls,
  and added **Center outline**. Resizing reframes the current outline.
- Added loading/retry to onboarding, end-of-session answer exploration, and
  cleanup when leaving the game.
- Removed the obsolete shared session slice, counter hook, timer, old modals,
  and unused random-country helper after confirming all three games use their
  own round models. Previous implementations are recoverable through Git.

## Suggested next iterations

1. **Silhouette-only challenge:** optionally hide surrounding countries to test
   shape recognition without location clues. Keep the contextual map as a
   separate learning mode.
2. **More useful distractors:** compare random choices with countries of similar
   shape or from the same region. Playtest difficulty before making this default.
3. **Revisit mistakes:** offer a short review of missed outlines after a session,
   then repeat them later to reinforce learning.
4. **Short sessions and personal bests:** track accuracy and streaks by difficulty
   for five- or ten-outline runs. Distinguish these from the current score race.
5. **Data and geometry quality:** refresh undated geography facts and document
   territory handling. Countries spread across overseas territories can require
   very wide framing; consider a clearly labeled primary-landmass view while
   preserving a way to inspect the whole country.

## Verification

Unit coverage includes all difficulty scores, duplicate/invalid choices, explicit
advance, frozen results, final-guess wins, positive-score exhaustion, replay,
empty pools, distinct choices, and answer inclusion.

Production browser tests exercise a second win after replay, choice disabling,
keyboard focus on **Next country**, tiny-country rendering, aliases, score-zero
loss, answer exploration, navigation reset, atlas retry, accessibility, and
320px layouts. The complete suite also covers Geo Guess and Map Master.

Commands: `npm test`, `npm run typecheck`, `npm run lint`, `npm run test:e2e`.
