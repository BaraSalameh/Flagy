import { useContext } from "react";
import { DifficultyContext } from "../DifficultyProvider";

export const useGetDifficulty = () => useContext(DifficultyContext).difficulty;