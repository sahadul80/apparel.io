import { NextResponse } from "next/server";

export async function GET() {
    const heroData = {
        title: "Crafting Excellence in Every Stitch",
        subtitle: "Discover a wide range of premium textiles and apparel.",
        backgroundUrl: "/hero-bg.jpg", // Replace with your image URL
        videoUrl: "/apparel.mp4", // Replace with video URL if available
    };

    return NextResponse.json(heroData);
}
