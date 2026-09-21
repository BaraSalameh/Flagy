import { describe, expect, it } from "vitest";
import reducer, {
    clearMapMaster,
    setCounter,
    setCurrentCountry,
    updateCounter,
} from "./map-master-slice";
describe("map master state", () => {
    it("updates score and restores the explicit initial state", () => {
        let state = reducer(undefined, setCounter(10));
        state = reducer(state, setCurrentCountry("Jordan"));
        state = reducer(state, updateCounter(4));
        expect(state).toMatchObject({ counter: 14, currentCountry: "Jordan" });
        expect(reducer(state, clearMapMaster())).toMatchObject({
            counter: 10,
            currentCountry: "",
        });
    });
});
