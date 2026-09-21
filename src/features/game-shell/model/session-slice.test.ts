import { describe, expect, it } from "vitest";
import reducer, {
    clearGeneral,
    initialSessionState,
    selectDifficulty,
    selectGameStatus,
    setDifficulty,
    setGameStarted,
    setResult,
    updateCounter,
} from "./session-slice";
describe("session state", () => {
    it("moves through a game session and resets safely", () => {
        let state = reducer(undefined, setDifficulty("Advanced"));
        state = reducer(state, setGameStarted(true));
        state = reducer(state, updateCounter(4));
        expect(state).toMatchObject({
            difficulty: "Advanced",
            status: "playing",
            gameStarted: true,
            counter: 4,
        });
        state = reducer(state, setResult(true));
        expect(state.status).toBe("won");
        expect(reducer(state, clearGeneral())).toEqual(initialSessionState);
    });
    it("exposes typed selectors", () => {
        const root = {
            general: {
                ...initialSessionState,
                difficulty: "Expert" as const,
                status: "playing" as const,
            },
        };
        expect(selectDifficulty(root)).toBe("Expert");
        expect(selectGameStatus(root)).toBe("playing");
    });
});
