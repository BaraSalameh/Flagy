import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import sessionReducer from "@/features/game-shell/model/session-slice";
import { GameDifficultyMenu } from "./GameDifficultyMenu";

describe("GameDifficultyMenu", () => {
    it("stores the chosen difficulty and starts through its side effect", async () => {
        const store = configureStore({ reducer: { general: sessionReducer } });
        const sideEffect = vi.fn();
        render(
            <Provider store={store}>
                <GameDifficultyMenu sideEffect={sideEffect} />
            </Provider>,
        );
        await userEvent.click(
            screen.getByRole("button", { name: /advanced/i }),
        );
        expect(store.getState().general.difficulty).toBe("Advanced");
        expect(sideEffect).toHaveBeenCalledOnce();
    });
});
