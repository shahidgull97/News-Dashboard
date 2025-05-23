// utils/newsApi.js
import axios from "axios";

// Base URLs for different APIs
const NEWS_API_BASE_URL = "https://newsapi.org/v2";
const GUARDIAN_API_BASE_URL = "https://content.guardianapis.com";

// Helper function to format article from News API
const formatNewsApiArticle = (article) => ({
  title: article.title,
  description: article.description,
  content: article.content,
  author: article.author,
  source: article.source,
  url: article.url,
  urlToImage: article.urlToImage,
  publishedAt: article.publishedAt,
  type: "news", // Add type for filtering
});

// Helper function to format article from Guardian API
const formatGuardianArticle = (article) => ({
  title: article.webTitle,
  description: article.fields?.trailText || "",
  content: article.fields?.bodyText || "",
  author: article.fields?.byline || "The Guardian",
  source: { id: "the-guardian", name: "The Guardian" },
  url: article.webUrl,
  urlToImage: article.fields?.thumbnail || null,
  publishedAt: article.webPublicationDate,
  type: article.type === "liveblog" ? "blog" : "news", // Map Guardian types to our types
});

// Fetch news from News API
// export const fetchFromNewsApi = async (query = "", page = 1) => {
//   try {
//     const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
//       params: {
//         country: "us",
//         q: query,
//         page,
//         pageSize: 20,
//         apiKey:
//           process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWS_API_KEY,
//       },
//     });

//     return {
//       articles: response.data.articles.map(formatNewsApiArticle),
//       totalResults: response.data.totalResults,
//     };
//   } catch (error) {
//     console.error("Error fetching from News API:", error);
//     throw new Error("Failed to fetch news");
//   }
// };

// Fetch news from Guardian API
export const fetchFromGuardian = async (query = "", page = 1) => {
  try {
    const response = await axios.get(
      `${GUARDIAN_API_BASE_URL}/search?api-key=${process.env.NEXT_PUBLIC_GUARDIAN_API_KEY}`
    );
    console.log(response.data.response.results);

    return {
      articles: response.data.response.results,
      totalResults: response.data.response.total,
    };
  } catch (error) {
    console.error("Error fetching from Guardian API:", error);
    throw new Error("Failed to fetch news");
  }
};

export const fetchNews = async (query = "", filters = {}, useMock = true) => {
  try {
    // Fetch from multiple sources and combine results

    const newsarticle = await fetchFromGuardian(query);

    // Combine and shuffle results for variety

    return {
      articles: newsarticle,
    };
  } catch (error) {
    console.error("Error fetching combined news:", error);
  }
};
