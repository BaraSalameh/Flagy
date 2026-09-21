export default function Loading() {
    return (
        <div className="grid min-h-dvh place-items-center" role="status">
            <div className="text-center">
                <div className="mx-auto size-12 animate-spin rounded-full border-4 border-surface-muted border-t-accent" />
                <p className="mt-4 font-bold text-muted">Charting the map…</p>
            </div>
        </div>
    );
}
