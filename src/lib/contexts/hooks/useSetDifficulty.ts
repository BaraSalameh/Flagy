import { useContext } from "react";
import { DifficultyContext } from "../DifficultyContext";

export const useSetDifficulty = () => useContext(DifficultyContext).setDifficulty;