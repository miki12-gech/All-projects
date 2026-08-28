/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse ከ Bundle ውጭ እንዲሆን የግድ ያስፈልጋል
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;