import dynamic from "next/dynamic";

export const Map = dynamic(() => import('@/components/Map').then((mod) => mod.Map), {
    ssr: false
});