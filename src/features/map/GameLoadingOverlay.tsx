import { Globe2 } from "lucide-react";

const defaultMessage = "Preparing your game…";

export function GameLoadingOverlay({
    message = defaultMessage,
}: {
    message?: string;
}) {
    return (
        <div
            className="game-loading-overlay"
            role="status"
            aria-live="polite"
            aria-label={message}
            data-testid="game-loading-overlay"
        >
            <div className="game-loading-indicator" aria-hidden="true">
                <span className="game-loading-indicator__orbit game-loading-indicator__orbit--outer" />
                <span className="game-loading-indicator__orbit game-loading-indicator__orbit--inner" />
                <span className="game-loading-indicator__globe">
                    <Globe2 className="size-8" />
                </span>
            </div>
            <div className="game-loading-copy">
                <p>{message}</p>
                <span aria-hidden="true" className="game-loading-dots">
                    <i />
                    <i />
                    <i />
                </span>
            </div>
        </div>
    );
}
