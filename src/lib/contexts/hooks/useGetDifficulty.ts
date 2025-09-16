import { useContext } from "react";
import { DifficultyContext } from "../DifficultyContext";

export const useGetDifficulty = () => useContext(DifficultyContext).difficulty;