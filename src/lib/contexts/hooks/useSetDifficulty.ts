import { useContext } from "react";
import { DifficultyContext } from "../DifficultyProvider";

export const useSetDifficulty = () => useContext(DifficultyContext).setDifficulty;