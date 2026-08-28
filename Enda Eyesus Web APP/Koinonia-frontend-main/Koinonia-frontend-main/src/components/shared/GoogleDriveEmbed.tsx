import React from "react";

interface GoogleDriveEmbedProps {
    fileId: string;
    title?: string;
    className?: string;
}

export function GoogleDriveEmbed({ fileId, title = "Document viewer", className = "" }: GoogleDriveEmbedProps) {
    // Google Drive iframe preview URL format
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    return (
        <div className={`relative w-full h-[600px] rounded-xl overflow-hidden shadow-sm border border-[#ddd8d0] dark:border-[#2a2a2d] bg-white dark:bg-[#1C1C1F] ${className}`}>
            <iframe
                src={embedUrl}
                title={title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="autoplay"
                allowFullScreen
            />
        </div>
    );
}
