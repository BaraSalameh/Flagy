import dynamic from "next/dynamic";

export const Map = dynamic(() => import('@/components/shared/Map').then((mod) => mod.Map), {
    ssr: false
});

export { GameDifficultyMenu } from './GameDifficultyMenu';