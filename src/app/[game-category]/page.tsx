import { notFound, redirect } from "next/navigation";
export default async function CategoryPage({
    params,
}: {
    params: Promise<{ "game-category": string }>;
}) {
    const category = (await params)["game-category"];
    if (category === "map") redirect("/");
    notFound();
}
