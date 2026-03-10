import { NextResponse } from "next/server";

const MAX_ARTICLES = 10;

function formatTime(dateString) {
    const date = new Date(dateString);
    const diff = Date.now() - date.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

export async function GET() {
    try {

        const apiKey = process.env.GNEWS_API_KEY;

        const url =
            `https://gnews.io/api/v4/search?q=law OR court OR "supreme court" OR "high court"&lang=en&country=in&max=${MAX_ARTICLES}&apikey=${apiKey}`;

        const res = await fetch(url, {
            cache: "no-store"
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch news" },
                { status: 500 }
            );
        }

        const data = await res.json();

        const news = data.articles.map((article) => ({
            title: article.title,
            description: article.description || "No description available",
            link: article.url,
            image: article.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
            source: article.source?.name || "Legal News",
            time: formatTime(article.publishedAt)
        }));

        return NextResponse.json(news);

    } catch (error) {

        console.error("Legal news error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}