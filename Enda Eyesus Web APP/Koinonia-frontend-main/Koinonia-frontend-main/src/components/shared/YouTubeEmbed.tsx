import React from "react";

interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    className?: string;
}

export function YouTubeEmbed({ videoId, title = "YouTube video player", className = "" }: YouTubeEmbedProps) {
    // Parameters:
    // autoplay=0: Disable autoplay
    // rel=0: Restrict related videos to the same channel
    // modestbranding=1: Minimal YouTube branding
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;

    return (
        <div className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-sm ${className}`}>
            <iframe
                src={embedUrl}
                title={title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
    );
}
