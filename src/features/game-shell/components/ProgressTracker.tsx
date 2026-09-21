import React from "react";
import type { ReactNode } from "react";
import { Card, Progress } from "@/shared/ui";

interface ProgressProps {
    counter: number;
    maxCounter: number;
    content?: ReactNode;
}

export const ProgressTracker = ({
    counter,
    maxCounter,
    content,
}: ProgressProps) => {
    const progress = (counter / maxCounter) * 100;

    let status = "";
    if (counter >= maxCounter) {
        status = "🎉 You reached the finish line!";
    } else if (progress > 70) {
        status = "🔥 You're very close!";
    } else if (progress > 40) {
        status = "👍 Keep going, you're making progress!";
    } else {
        status = "⚠️ Careful! You're falling behind!";
    }

    return (
        <Card className="absolute left-1/2 top-24 z-[700] w-[min(88vw,24rem)] -translate-x-1/2 rounded-2xl p-3.5 sm:top-5">
            <Progress
                value={counter}
                max={maxCounter}
                label="Journey progress"
            />
            <div className="mt-2 text-center text-sm font-bold">{content}</div>
            <p className="sr-only" aria-live="polite">
                {status}
            </p>
        </Card>
    );
};

export default ProgressTracker;
