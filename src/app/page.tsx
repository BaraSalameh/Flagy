import { GuessCountryInXMoves } from "@/games";
import { DifficultyProvider } from "@/lib/contexts/DifficultyProvider";

const HomePage = () =>
    <div className="h-screen">
        <DifficultyProvider>
            <GuessCountryInXMoves />
        </DifficultyProvider>
    </div>

export default HomePage;