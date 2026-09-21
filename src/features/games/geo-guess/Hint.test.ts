import { describe, expect, it } from "vitest";
import type { InfoData } from "@/shared/types/country";
import { fillHint } from "./Hint";

const country: InfoData = {
    countryCode: "JO",
    countryName: "Jordan",
    currencyCode: "JOD",
    population: "11000000",
    capital: "Amman",
    continentName: "Asia",
    region: "Western Asia",
    area: 89342,
    borders: ["IRQ", "SAU"],
    languages: ["Arabic"],
    flag: "",
};
describe("Geo Guess hint sequence", () => {
    it("reveals beginner clues at the intended counters", () => {
        expect(fillHint("Beginner", 15, country)).toBe("Population: 11M");
        expect(fillHint("Beginner", 11, country)).toBe("Continent: Asia");
        expect(fillHint("Beginner", 3, country)).toBe("Capital: Amman");
        expect(fillHint("Beginner", 2, country)).toBeUndefined();
    });
    it("reveals fewer expert clues", () => {
        expect(fillHint("Expert", 7, country)).toBe("Population: 11M");
        expect(fillHint("Expert", 1, country)).toBe("Region: Western Asia");
    });
});
