import React from "react";
import { Text } from "../ui";
import { card } from "@/styles";
import { ProgressProps } from "./types.shared";

export const ProgressTracker = ({ counter, maxCounter, content }: ProgressProps) => {
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
        <div className={card()}>
            <div className={card({ subComponent: true, padding: 'none' })}>
                <div
                    className={`h-4 rounded-full transition-all duration-300 ${
                        progress > 70
                        ? "bg-green-500"
                        : progress > 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <Text size='xs' position='center'>
                {status}
            </Text>
            <Text position='center' size='xs'>
                {counter} / {maxCounter} points
            </Text>
            {content}
        </div>
    );
};

export default ProgressTracker;
