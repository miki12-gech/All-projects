"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { HistoryAlbum, ThenAndNow } from "./history.types";

interface HistoryViewProps {
    albums: HistoryAlbum[];
    thenAndNow: ThenAndNow;
}

export default function HistoryView({ albums, thenAndNow }: HistoryViewProps) {
    const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; albumIndex: number; imageIndex: number } | null>(null);
    const [activeYear, setActiveYear] = useState<string>(albums[0]?.year || "");

    // Smooth scroll and active year tracking
    useEffect(() => {
        const handleScroll = () => {
            const sections = albums.map((album) => document.getElementById(`year-${album.year}`));
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            let currentYear = activeYear;
            for (const section of sections) {
                if (section && section.offsetTop <= scrollPosition) {
                    currentYear = section.id.replace("year-", "");
                }
            }
            setActiveYear(currentYear);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [albums, activeYear]);

    const openModal = (albumIndex: number, imageIndex: number) => {
        const album = albums[albumIndex];
        const image = album.images[imageIndex];
        setSelectedImage({ src: image.src, alt: image.alt, albumIndex, imageIndex });
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = "unset";
    };

    const navigateImage = (direction: "next" | "prev", e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedImage) return;

        let { albumIndex, imageIndex } = selectedImage;
        const album = albums[albumIndex];

        if (direction === "next") {
            if (imageIndex < album.images.length - 1) {
                imageIndex++;
            } else if (albumIndex < albums.length - 1) {
                albumIndex++;
                imageIndex = 0;
            }
        } else {
            if (imageIndex > 0) {
                imageIndex--;
            } else if (albumIndex > 0) {
                albumIndex--;
                imageIndex = albums[albumIndex].images.length - 1;
            }
        }

        const newAlbum = albums[albumIndex];
        if (newAlbum && newAlbum.images[imageIndex]) {
            const newImage = newAlbum.images[imageIndex];
            setSelectedImage({ src: newImage.src, alt: newImage.alt, albumIndex, imageIndex });
        }
    };

    return (
        <div className="bg-[#0E0E0F] min-h-screen text-[#F5F5F5] font-sans selection:bg-[#D4AF37] selection:text-[#0E0E0F]">
            {/* Back to Home Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1C1F]/70 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium backdrop-blur-sm hover:bg-[#1C1C1F] hover:border-[#D4AF37]/70 transition-all duration-300 group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Home
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/p1.png"
                        alt="Enda Eyesus Fellowship"
                        fill
                        className="object-cover opacity-30 object-center filter blur-sm transform scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0F]/40 via-[#0E0E0F]/80 to-[#0E0E0F]"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <div className="w-16 h-16 mb-6 rounded-full border border-[#D4AF37]/40 bg-[#1C1C1F]/80 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8.5" y="1" width="3" height="18" rx="1" fill="#D4AF37" />
                            <rect x="2" y="6" width="16" height="3" rx="1" fill="#D4AF37" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-[#D4AF37] mb-6 tracking-wide drop-shadow-lg">
                        Our Sacred Journey
                    </h1>
                    <p className="text-lg md:text-2xl text-[#F5F5F5]/90 max-w-2xl font-light leading-relaxed">
                        A digital museum preserving the spiritual legacy and cherished memories of the እንዳ ኢየሱስ ግቢ ጉባኤ fellowship.
                    </p>

                    <div className="mt-12 animate-bounce">
                        <ChevronDownIcon className="w-8 h-8 text-[#D4AF37]/70" />
                    </div>
                </div>
            </section>

            {/* Sticky Timeline Navigation */}
            <nav className="sticky top-0 z-40 bg-[#0E0E0F] border-b border-[#D4AF37]/20 py-4 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
                    <ul className="flex justify-start md:justify-center space-x-8 min-w-max">
                        {albums.map((album) => (
                            <li key={`nav-${album.year}`}>
                                <a
                                    href={`#year-${album.year}`}
                                    className={`text-lg font-serif transition-all duration-300 ${activeYear === album.year
                                        ? "text-[#D4AF37] scale-110 font-bold drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                                        : "text-[#F5F5F5]/60 hover:text-[#D4AF37]/80"
                                        }`}
                                >
                                    {album.year}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 py-16 space-y-32">
                {/* Years Sections */}
                {albums.map((album, albumIndex) => (
                    <section key={album.year} id={`year-${album.year}`} className="scroll-mt-40">
                        <div className="mb-12 border-l-4 border-[#8B2C2C] pl-6 py-2">
                            <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37] font-bold mb-4">
                                {album.year}: {album.title}
                            </h2>
                            <p className="text-[#F5F5F5]/80 text-lg md:text-xl max-w-3xl leading-relaxed">
                                {album.description}
                            </p>
                        </div>

                        {/* Masonry Grid */}
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {album.images.map((img, imageIndex) => (
                                <div
                                    key={`${album.year}-${imageIndex}`}
                                    className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-lg bg-[#1C1C1F] border border-[#D4AF37]/10"
                                    onClick={() => openModal(albumIndex, imageIndex)}
                                >
                                    <div className="relative w-full aspect-auto h-auto">
                                        {/* Using standard img for masonry to compute height naturally or object-cover with fixed aspect ratio. Let's use naturally for true masonry */}
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0F]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <p className="p-4 text-[#F5F5F5] font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                            {img.alt}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Then & Now Section */}
                <section className="py-20 border-t border-[#D4AF37]/20 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9B2323]/5 rounded-full blur-3xl -z-10"></div>

                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif text-[#D4AF37] font-bold mb-4">Then & Now</h2>
                        <p className="text-[#F5F5F5]/70 text-lg max-w-2xl mx-auto">
                            Witness the grace that has carried our fellowship from its humble beginnings to where we stand today.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                        {/* Then */}
                        <div className="bg-[#1C1C1F] p-4 pb-8 rounded-xl border border-[#D4AF37]/10 shadow-2xl relative group">
                            <div className="absolute top-4 left-4 bg-[#0E0E0F]/80 backdrop-blur-sm px-4 py-1 rounded text-[#D4AF37] font-bold z-10 font-serif">
                                {thenAndNow.then.year}
                            </div>
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-6">
                                <Image
                                    src={thenAndNow.then.src}
                                    alt="Then"
                                    fill
                                    className="object-cover filter sepia-[0.3] grayscale-[0.2]"
                                />
                            </div>
                            <p className="text-[#F5F5F5]/80 text-center px-4 italic text-lg leading-relaxed">
                                "{thenAndNow.then.description}"
                            </p>
                        </div>

                        {/* Now */}
                        <div className="bg-[#1C1C1F] p-4 pb-8 rounded-xl border border-[#D4AF37]/10 shadow-2xl relative group">
                            <div className="absolute top-4 right-4 bg-[#D4AF37] border border-[#D4AF37] px-4 py-1 rounded text-[#0E0E0F] font-bold z-10 font-serif">
                                {thenAndNow.now.year}
                            </div>
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-6 shadow-[0_0_30px_rgba(30,77,58,0.2)]">
                                <Image
                                    src={thenAndNow.now.src}
                                    alt="Now"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-[#F5F5F5]/80 text-center px-4 italic text-lg leading-relaxed">
                                "{thenAndNow.now.description}"
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Fullscreen Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-[#0E0E0F]/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    {/* Close Header */}
                    <button
                        className="absolute top-6 right-6 text-[#F5F5F5]/70 hover:text-[#D4AF37] transition-colors p-2 z-50 bg-[#1C1C1F]/50 rounded-full hover:bg-[#1C1C1F]"
                        onClick={closeModal}
                    >
                        <X size={32} />
                    </button>

                    {/* Navigation Area - Previous */}
                    <div
                        className="absolute left-0 inset-y-0 w-1/4 sm:w-32 flex items-center justify-start sm:justify-center p-4 sm:p-0 z-40 group cursor-w-resize"
                        onClick={(e) => navigateImage("prev", e)}
                    >
                        <div className="bg-[#1C1C1F]/60 text-[#F5F5F5] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform -translate-x-4 group-hover:translate-x-0 border border-[#D4AF37]/20">
                            <ChevronLeft size={32} />
                        </div>
                    </div>

                    {/* Image Container */}
                    <div
                        className="relative w-full max-w-6xl max-h-[85vh] h-full flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </div>
                        <p className="text-[#D4AF37] font-serif text-xl mt-6 text-center shadow-black drop-shadow-md">
                            {selectedImage.alt}
                        </p>
                    </div>

                    {/* Navigation Area - Next */}
                    <div
                        className="absolute right-0 inset-y-0 w-1/4 sm:w-32 flex items-center justify-end sm:justify-center p-4 sm:p-0 z-40 group cursor-e-resize"
                        onClick={(e) => navigateImage("next", e)}
                    >
                        <div className="bg-[#1C1C1F]/60 text-[#F5F5F5] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 border border-[#D4AF37]/20">
                            <ChevronRight size={32} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
