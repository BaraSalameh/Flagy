"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    LocateFixed,
    MousePointer2,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import {
    type KeyboardEvent,
    type PointerEvent,
    type WheelEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { gameDefinitions } from "./game-registry";

type Position = [number, number];
type PolygonCoordinates = Position[][];
type WorldFeature = {
    properties: { ISO2?: string };
    geometry: {
        type: "Polygon" | "MultiPolygon";
        coordinates: PolygonCoordinates | PolygonCoordinates[];
    };
};
type WorldAtlas = {
    features: WorldFeature[];
    continents: Record<string, string>;
};
type Camera = { longitude: number; latitude: number; zoom: number };

const continentGames = [
    {
        continent: "Africa",
        coordinates: "08° N · 21° E",
        longitude: 21,
        latitude: 8,
        color: "#d8ff52",
    },
    {
        continent: "Asia",
        coordinates: "34° N · 100° E",
        longitude: 100,
        latitude: 34,
        color: "#ff8059",
    },
    {
        continent: "Oceania",
        coordinates: "25° S · 134° E",
        longitude: 134,
        latitude: -25,
        color: "#b9a1ff",
    },
    {
        continent: "Americas",
        coordinates: "15° N · 80° W",
        longitude: -80,
        latitude: 15,
        color: "#63dfca",
    },
    {
        continent: "Europe",
        coordinates: "54° N · 15° E",
        longitude: 15,
        latitude: 54,
        color: "#7c9cff",
    },
] as const;

const wrapIndex = (index: number) =>
    (index + continentGames.length) % continentGames.length;
const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
const normalizeLongitude = (value: number) =>
    ((((value + 180) % 360) + 360) % 360) - 180;
const continentName = (value?: string) =>
    value === "North America" || value === "South America" ? "Americas" : value;

function project(
    [longitude, latitude]: Position,
    camera: Camera,
    centerX: number,
    centerY: number,
    radius: number,
) {
    const radians = Math.PI / 180;
    const lambda = (longitude - camera.longitude) * radians;
    const phi = latitude * radians;
    const phi0 = camera.latitude * radians;
    const cosPhi = Math.cos(phi);
    const visible =
        Math.sin(phi0) * Math.sin(phi) +
        Math.cos(phi0) * cosPhi * Math.cos(lambda);
    return {
        x: centerX + radius * cosPhi * Math.sin(lambda),
        y:
            centerY -
            radius *
                (Math.cos(phi0) * Math.sin(phi) -
                    Math.sin(phi0) * cosPhi * Math.cos(lambda)),
        visible: visible > 0.01,
    };
}

function traceLine(
    context: CanvasRenderingContext2D,
    points: Position[],
    camera: Camera,
    centerX: number,
    centerY: number,
    radius: number,
) {
    let drawing = false;
    for (const point of points) {
        const projected = project(point, camera, centerX, centerY, radius);
        if (!projected.visible) {
            drawing = false;
            continue;
        }
        if (drawing) context.lineTo(projected.x, projected.y);
        else context.moveTo(projected.x, projected.y);
        drawing = true;
    }
}

function drawGlobe(
    canvas: HTMLCanvasElement,
    atlas: WorldAtlas | null,
    camera: Camera,
    activeContinent: string,
    accent: string,
) {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, bounds.width, bounds.height);
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const radius = Math.min(bounds.width, bounds.height) * 0.455 * camera.zoom;

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();
    const ocean = context.createRadialGradient(
        centerX - radius * 0.36,
        centerY - radius * 0.42,
        radius * 0.05,
        centerX,
        centerY,
        radius * 1.12,
    );
    ocean.addColorStop(0, "#2b92c9");
    ocean.addColorStop(0.44, "#075e98");
    ocean.addColorStop(1, "#062b4f");
    context.fillStyle = ocean;
    context.fillRect(0, 0, bounds.width, bounds.height);

    context.beginPath();
    for (let latitude = -60; latitude <= 60; latitude += 30) {
        const points: Position[] = [];
        for (let longitude = -180; longitude <= 180; longitude += 3)
            points.push([longitude, latitude]);
        traceLine(context, points, camera, centerX, centerY, radius);
    }
    for (let longitude = -150; longitude <= 180; longitude += 30) {
        const points: Position[] = [];
        for (let latitude = -89; latitude <= 89; latitude += 3)
            points.push([longitude, latitude]);
        traceLine(context, points, camera, centerX, centerY, radius);
    }
    context.strokeStyle = "rgb(178 224 244 / 0.14)";
    context.lineWidth = 0.75;
    context.stroke();

    if (atlas) {
        for (const feature of atlas.features) {
            const featureContinent = continentName(
                atlas.continents[feature.properties.ISO2 ?? ""],
            );
            const isActive = featureContinent === activeContinent;
            const polygons =
                feature.geometry.type === "Polygon"
                    ? [feature.geometry.coordinates as PolygonCoordinates]
                    : (feature.geometry.coordinates as PolygonCoordinates[]);
            for (const polygon of polygons) {
                context.beginPath();
                for (const ring of polygon)
                    traceLine(context, ring, camera, centerX, centerY, radius);
                context.fillStyle = isActive ? accent : "#75a879";
                context.strokeStyle = isActive
                    ? "rgb(255 255 255 / 0.78)"
                    : "rgb(12 52 48 / 0.62)";
                context.lineWidth = isActive ? 0.85 : 0.45;
                context.fill("evenodd");
                context.stroke();
            }
        }
    }

    const shade = context.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.34,
        radius * 0.18,
        centerX + radius * 0.08,
        centerY + radius * 0.08,
        radius * 1.15,
    );
    shade.addColorStop(0, "rgb(255 255 255 / 0.16)");
    shade.addColorStop(0.55, "rgb(0 0 0 / 0)");
    shade.addColorStop(1, "rgb(0 8 24 / 0.58)");
    context.fillStyle = shade;
    context.fillRect(0, 0, bounds.width, bounds.height);
    context.restore();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.strokeStyle = "rgb(168 224 255 / 0.5)";
    context.lineWidth = 1.3;
    context.shadowBlur = 22;
    context.shadowColor = "rgb(63 174 255 / 0.45)";
    context.stroke();
}

export function GameGlobe() {
    const reduceMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const atlasRef = useRef<WorldAtlas | null>(null);
    const cameraRef = useRef<Camera>({ longitude: 21, latitude: 8, zoom: 1 });
    const dragRef = useRef({
        active: false,
        x: 0,
        y: 0,
        time: 0,
        velocityX: 0,
        velocityY: 0,
    });
    const animationRef = useRef<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const activeIndexRef = useRef(activeIndex);
    const activeGame = gameDefinitions[activeIndex];
    const activeContinent = continentGames[activeIndex];
    const Icon = activeGame.icon;

    useEffect(() => {
        activeIndexRef.current = activeIndex;
    }, [activeIndex]);

    const paint = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const selected = continentGames[activeIndexRef.current];
        drawGlobe(
            canvas,
            atlasRef.current,
            cameraRef.current,
            selected.continent,
            selected.color,
        );
    }, []);

    const syncClosestGame = useCallback(() => {
        const camera = cameraRef.current;
        const radians = Math.PI / 180;
        let closest = 0;
        let bestScore = -Infinity;
        continentGames.forEach((item, index) => {
            const latitude = item.latitude * radians;
            const cameraLatitude = camera.latitude * radians;
            const score =
                Math.sin(latitude) * Math.sin(cameraLatitude) +
                Math.cos(latitude) *
                    Math.cos(cameraLatitude) *
                    Math.cos((item.longitude - camera.longitude) * radians);
            if (score > bestScore) {
                bestScore = score;
                closest = index;
            }
        });
        if (closest !== activeIndexRef.current) {
            activeIndexRef.current = closest;
            setActiveIndex(closest);
        }
    }, []);

    const cancelAnimation = () => {
        if (animationRef.current !== null)
            window.cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
    };

    const focusContinent = useCallback(
        (index: number) => {
            cancelAnimation();
            const target = continentGames[index];
            activeIndexRef.current = index;
            setActiveIndex(index);
            const start = { ...cameraRef.current };
            const longitudeDelta = normalizeLongitude(
                target.longitude - start.longitude,
            );
            if (reduceMotion) {
                cameraRef.current = {
                    ...start,
                    longitude: target.longitude,
                    latitude: target.latitude,
                };
                paint();
                return;
            }
            const startedAt = performance.now();
            const animate = (now: number) => {
                const progress = clamp((now - startedAt) / 620, 0, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                cameraRef.current = {
                    ...start,
                    longitude: normalizeLongitude(
                        start.longitude + longitudeDelta * eased,
                    ),
                    latitude:
                        start.latitude +
                        (target.latitude - start.latitude) * eased,
                };
                paint();
                if (progress < 1)
                    animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        },
        [paint, reduceMotion],
    );

    useEffect(() => {
        let disposed = false;
        Promise.all([
            fetch("/data/countries.geo.json").then((response) =>
                response.json(),
            ),
            fetch("/data/countries.info.json").then((response) =>
                response.json(),
            ),
        ]).then(([geoData, countryData]) => {
            if (disposed) return;
            atlasRef.current = {
                features: geoData.features,
                continents: Object.fromEntries(
                    Object.entries<{ continentName: string }>(countryData).map(
                        ([code, info]) => [code, info.continentName],
                    ),
                ),
            };
            setIsLoaded(true);
            paint();
        });
        const observer = new ResizeObserver(paint);
        if (canvasRef.current) observer.observe(canvasRef.current);
        paint();
        return () => {
            disposed = true;
            observer.disconnect();
            cancelAnimation();
        };
    }, [paint]);

    useEffect(() => {
        paint();
    }, [activeIndex, paint]);

    const updateCamera = (deltaX: number, deltaY: number) => {
        const camera = cameraRef.current;
        camera.longitude = normalizeLongitude(
            camera.longitude - deltaX * (0.32 / camera.zoom),
        );
        camera.latitude = clamp(
            camera.latitude + deltaY * (0.26 / camera.zoom),
            -75,
            75,
        );
        syncClosestGame();
        paint();
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest("button, a")) return;
        cancelAnimation();
        dragRef.current = {
            active: true,
            x: event.clientX,
            y: event.clientY,
            time: performance.now(),
            velocityX: 0,
            velocityY: 0,
        };
        setIsDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag.active) return;
        const now = performance.now();
        const elapsed = Math.max(now - drag.time, 8);
        const deltaX = event.clientX - drag.x;
        const deltaY = event.clientY - drag.y;
        drag.velocityX = deltaX / elapsed;
        drag.velocityY = deltaY / elapsed;
        drag.x = event.clientX;
        drag.y = event.clientY;
        drag.time = now;
        updateCamera(deltaX, deltaY);
    };

    const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag.active) return;
        drag.active = false;
        setIsDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        if (reduceMotion) return;
        let velocityX = drag.velocityX * 18;
        let velocityY = drag.velocityY * 18;
        const coast = () => {
            velocityX *= 0.92;
            velocityY *= 0.92;
            if (Math.abs(velocityX) + Math.abs(velocityY) < 0.08) return;
            updateCamera(velocityX, velocityY);
            animationRef.current = requestAnimationFrame(coast);
        };
        animationRef.current = requestAnimationFrame(coast);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            focusContinent(
                wrapIndex(activeIndex + (event.key === "ArrowRight" ? 1 : -1)),
            );
        }
        if (event.key === "+" || event.key === "=") {
            cameraRef.current.zoom = clamp(
                cameraRef.current.zoom + 0.08,
                0.82,
                1.12,
            );
            paint();
        }
        if (event.key === "-") {
            cameraRef.current.zoom = clamp(
                cameraRef.current.zoom - 0.08,
                0.82,
                1.12,
            );
            paint();
        }
    };

    const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        cameraRef.current.zoom = clamp(
            cameraRef.current.zoom - event.deltaY * 0.0008,
            0.82,
            1.12,
        );
        paint();
    };

    const adjustZoom = (amount: number) => {
        cameraRef.current.zoom = clamp(
            cameraRef.current.zoom + amount,
            0.82,
            1.12,
        );
        paint();
    };

    return (
        <section
            aria-labelledby="games-heading"
            className="earth-panel relative flex min-h-[42rem] flex-col overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_90px_-55px_var(--shadow)] lg:min-h-[calc(100dvh-8.25rem)]"
        >
            <div className="relative z-20 flex items-center justify-between px-5 pt-5 text-white sm:px-7 sm:pt-7">
                <div>
                    <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/48">
                        Interactive earth / game navigator
                    </p>
                    <h2
                        id="games-heading"
                        className="mt-1 text-lg font-black tracking-[-0.035em]"
                    >
                        Explore the world
                    </h2>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-white/12 bg-black/20 px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/58 backdrop-blur-md sm:flex">
                    <MousePointer2 aria-hidden="true" className="size-3.5" />{" "}
                    Drag · scroll to zoom
                </div>
            </div>

            <div className="relative flex flex-1 flex-col items-center justify-center px-3 pb-4 pt-1 sm:px-7">
                <div
                    className={`earth-stage relative grid aspect-square w-full max-w-[34rem] touch-none select-none place-items-center rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7ec8ff]/50 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                    role="group"
                    aria-label={`Rotating game globe. ${activeContinent.continent} selected for ${activeGame.title}. Drag in any direction or use arrow keys.`}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onWheel={handleWheel}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <div
                        aria-hidden="true"
                        className="earth-atmosphere absolute inset-[3%] rounded-full"
                    />
                    <canvas
                        ref={canvasRef}
                        className="relative z-10 size-full"
                        aria-hidden="true"
                    />
                    {!isLoaded ? (
                        <div className="absolute z-20 rounded-full border border-white/10 bg-[#081523]/70 px-4 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/65 backdrop-blur-md">
                            Mapping the world…
                        </div>
                    ) : null}
                    <div className="earth-controls absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-white/15 bg-[#07131f]/72 text-white shadow-xl backdrop-blur-md sm:right-4">
                        <button
                            type="button"
                            onClick={() => adjustZoom(0.08)}
                            className="earth-control"
                            aria-label="Zoom in"
                        >
                            <ZoomIn aria-hidden="true" className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => adjustZoom(-0.08)}
                            className="earth-control border-t border-white/10"
                            aria-label="Zoom out"
                        >
                            <ZoomOut aria-hidden="true" className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => focusContinent(activeIndex)}
                            className="earth-control border-t border-white/10"
                            aria-label={`Center ${activeContinent.continent}`}
                        >
                            <LocateFixed
                                aria-hidden="true"
                                className="size-4"
                            />
                        </button>
                    </div>
                </div>

                <div className="relative z-20 -mt-7 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/12 bg-[#081523]/86 p-3.5 text-white shadow-[0_24px_70px_-30px_rgb(0_0_0_/_0.85)] backdrop-blur-xl sm:gap-4 sm:p-4">
                    <span
                        className="grid size-11 shrink-0 place-items-center rounded-xl text-[#07131f] sm:size-12"
                        style={{ backgroundColor: activeContinent.color }}
                    >
                        <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.6rem] font-black uppercase tracking-[0.16em] text-white/50">
                            {activeContinent.continent} ·{" "}
                            {activeContinent.coordinates}
                        </p>
                        <h3 className="mt-0.5 text-xl font-black tracking-[-0.045em] sm:text-2xl">
                            {activeGame.title}
                        </h3>
                        <p className="mt-0.5 hidden truncate text-xs font-medium text-white/58 sm:block">
                            {activeGame.description}
                        </p>
                    </div>
                    <Link
                        href={`/map/${activeGame.slug}`}
                        aria-label={`Play now: ${activeGame.title}`}
                        className="group flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 text-xs font-black text-[#081523] transition hover:bg-[#d8ff52] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7ec8ff]/50 sm:px-4"
                    >
                        <span className="hidden sm:inline">Play</span>
                        <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </Link>
                </div>

                <div
                    className="relative z-20 mt-3 flex max-w-full gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-black/15 p-1.5 backdrop-blur-sm"
                    aria-label="Choose a continent"
                >
                    {continentGames.map((item, index) => (
                        <button
                            key={item.continent}
                            type="button"
                            onClick={() => focusContinent(index)}
                            aria-label={`Select ${item.continent}: ${gameDefinitions[index].title}`}
                            aria-pressed={index === activeIndex}
                            className={`shrink-0 rounded-xl px-2.5 py-2 text-[0.62rem] font-black uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7ec8ff]/50 sm:px-3 ${index === activeIndex ? "bg-white text-[#081523]" : "text-white/52 hover:bg-white/10 hover:text-white"}`}
                        >
                            {item.continent}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
