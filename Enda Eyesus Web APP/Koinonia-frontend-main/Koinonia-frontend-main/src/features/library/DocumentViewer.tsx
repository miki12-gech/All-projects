//src/features/library/DocumentViewer.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, AlertCircle, Loader2 } from "lucide-react";

interface DocumentViewerProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isBroken?: boolean;
}

export default function DocumentViewer({ url, title, isOpen, onClose, isBroken = false }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const isPdf = url.includes(".pdf");
  const isGoogleDrive = url.includes("drive.google.com");

  const getEmbeddedUrl = (googleUrl: string) => {
    const fileIdMatch = googleUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
    if (fileIdMatch) return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    return googleUrl;
  };

  const embedUrl = isGoogleDrive ? getEmbeddedUrl(url) : url;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0E0E0F]/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 z-[120]"
      >
        <motion.div 
          initial={{ scale: 0.98, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white dark:bg-[#161618] rounded-2xl w-full h-[95vh] max-w-[1400px] overflow-hidden flex flex-col shadow-2xl border border-[#ddd8d0]/20 dark:border-white/10"
        >
          {/* Glassmorphic Theater Header */}
          <div className="relative flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#161618]/80 backdrop-blur-md border-b border-[#ddd8d0] dark:border-white/5 z-10">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent" />
            
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a] dark:text-gray-100 truncate tracking-wide">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#faf8f5] hover:bg-[#C9A227]/10 dark:bg-[#232326] dark:hover:bg-[#C9A227]/20 rounded-lg transition-colors text-sm font-medium text-[#7A1C1C] dark:text-[#D4AF37]"
                title="Download Origin File">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </a>
              <button onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#232326] dark:hover:bg-[#323235] text-gray-600 dark:text-gray-300 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative bg-[#e5e5e5] dark:bg-[#09090A] overflow-hidden">
            {isBroken ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f5] dark:bg-[#161618]">
                <div className="text-center max-w-md p-8">
                  <div className="w-20 h-20 bg-red-100/50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-500" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-3">Tether Broken</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    The connection to this manuscript has been lost or the original source is no longer accessible.
                  </p>
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A1C1C] hover:bg-[#5e1515] text-white rounded-xl transition-all font-medium shadow-lg">
                    Attempt External Retrieval
                  </a>
                </div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf8f5] dark:bg-[#09090A] z-0">
                    <Loader2 className="w-12 h-12 text-[#C9A227] animate-spin mb-4" />
                    <p className="text-sm font-medium tracking-widest text-gray-500 dark:text-gray-400 uppercase">Summoning Document...</p>
                  </div>
                )}

                {(isGoogleDrive || isPdf) ? (
                  <iframe
                    src={isPdf ? `${url}#toolbar=1&navpanes=0&scrollbar=1` : embedUrl}
                    title={title}
                    className="w-full h-full border-0 relative z-10"
                    onLoad={() => setIsLoading(false)}
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f5] dark:bg-[#161618]">
                    <div className="text-center p-8">
                      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">Browser Preview Unavailable</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">This specific scroll format requires external viewing.</p>
                      <a href={url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A1C1C] hover:bg-[#5e1515] text-white rounded-xl transition-all font-medium">
                        <Download className="w-5 h-5" /> Download Origin
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}