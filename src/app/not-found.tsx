import { MapPinOff } from "lucide-react";
import { ButtonLink, Card } from "@/shared/ui";
export default function NotFound() {
    return (
        <main className="grid min-h-dvh place-items-center p-4">
            <Card className="max-w-lg p-8 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-coral/15 text-coral">
                    <MapPinOff className="size-8" />
                </span>
                <h1 className="mt-5 text-3xl font-black">
                    That route is off the map
                </h1>
                <p className="mt-3 leading-7 text-muted">
                    The game or page you requested does not exist. Head back to
                    the atlas and choose another adventure.
                </p>
                <ButtonLink href="/" className="mt-6">
                    Back to game hub
                </ButtonLink>
            </Card>
        </main>
    );
}
