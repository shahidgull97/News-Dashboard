/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "static01.nyt.com",
      "api.time.com",
      "www.theguardian.com",
      "media.npr.org",
      "i.guim.co.uk",
      "assets.bwbx.io",
      "media.cnn.com",
      "newsapi.org",
      "s.yimg.com",
      "static.foxnews.com",
      "cdn.cnn.com",
      "www.washingtonpost.com",
      "ichef.bbci.co.uk",
      "www.aljazeera.com",
      "media.cnn.com",
    ],
  },
};

export default nextConfig;
