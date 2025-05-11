// pages/dashboard.js
"use client"; // This is a client component

import { useState, useEffect } from "react";
import PayoutCalculator from "@/components/PayoutCalculator";
import Head from "next/head";
import SearchFilters from "../../components/SearchFilters";
import NewsList from "../../components/NewsList";
// import { fetchNews } from "../utils/newsApi";
import { fetchNews } from "../../utils/newsApi";
import { getLocalStorageItem, storeFilters } from "../../utils/localStorage";
// import { newDate } from "react-datepicker/dist/date_utils";
import Navbar from "../../components/Navbar";
import DashboardSidebar from "@/components/SideBar";
import DashboardBarChart from "@/components/DashboardBarChart";

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState(false);
  const [filters, setFilters] = useState({
    author: "",
    startDate: null,
    endDate: null,
    pillarName: "",
  });
  //   console.log(analytics);

  // Load news data
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        // Load saved filters from localStorage
        const savedFilters = getLocalStorageItem();
        if (savedFilters) {
          setFilters({
            ...filters,
            ...savedFilters,
            // Convert string dates back to Date objects
            startDate: savedFilters.startDate
              ? new Date(savedFilters.startDate)
              : null,
            endDate: savedFilters.endDate
              ? new Date(savedFilters.endDate)
              : null,
          });
        }

        const newsData = await fetchNews();
        console.log(newsData.articles.articles);

        if (newsData && newsData.articles) {
          // Add random type (news/blog) to articles for demo purposes
          const articlesWithType = newsData.articles.articles.map(
            (article) => ({
              ...article,
              type: Math.random() > 0.5 ? "news" : "blog",
            })
          );
          setArticles(newsData.articles.articles);
          applyFilters(newsData.articles.articles, "", savedFilters || filters);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const applyFilters = (articlesToFilter, search, filterOptions) => {
    let result = [...articlesToFilter];

    // Apply search term
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (article) =>
          article.webTitle?.toLowerCase().includes(searchLower) ||
          article.sectionName?.toLowerCase().includes(searchLower)
        //   article.content?.toLowerCase().includes(searchLower) ||
        //   article.author?.toLowerCase().includes(searchLower)
      );
    }

    // Apply author filter
    if (filterOptions.author) {
      const authorLower = filterOptions.author.toLowerCase();
      result = result.filter((article) =>
        article.author?.toLowerCase().includes(authorLower)
      );
    }

    // Apply date filters
    if (filterOptions.startDate) {
      result = result.filter(
        (article) =>
          article.publishedAt &&
          new Date(article.publishedAt) >= new Date(filterOptions.startDate)
      );
    }

    if (filterOptions.endDate) {
      result = result.filter(
        (article) =>
          article.publishedAt &&
          new Date(article.publishedAt) <= new Date(filterOptions.endDate)
      );
    }

    // Apply type filter
    if (filterOptions.type !== "all") {
      result = result.filter((article) => article.type === filterOptions.type);
    }

    setFilteredArticles(result);
  };

  const handleSearch = (term) => {
    console.log("Search term:", term);

    setSearchTerm(term);
    applyFilters(articles, term, filters);
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    // storeFilters(updatedFilters);
    applyFilters(articles, searchTerm, updatedFilters);
  };

  //   if (status === "loading") {
  //     return (
  //       <div className="flex justify-center items-center min-h-screen">
  //         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  //       </div>
  //     );
  //   }
  console.log("Filtered articles:", filteredArticles);

  return (
    <>
      {/* <Head>
        <title>Dashboard - News & Blogs</title>
        <meta name="description" content="View the latest news and blogs" />
      </Head> */}
      {/* <Navbar /> */}

      <div className="max-w-full mx-auto flex">
        <div className=" mr-2">
          <DashboardSidebar setAnalytics={setAnalytics} />
        </div>

        {/* <h1 className="text-3xl font-bold mb-8">News Dashboard</h1> */}
        <div className="flex-1 h-full overflow-y-auto mt-2">
          {!analytics ? (
            <>
              <PayoutCalculator articleCounts={articles} />
              <DashboardBarChart articles={articles} />
            </>
          ) : (
            <>
              <SearchFilters
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
              />
              <NewsList articles={filteredArticles} loading={loading} />
            </>
          )}

          {!loading && filteredArticles.length === 0 && analytics && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">
                No articles found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Protected route
// export async function getServerSideProps(context) {
//   return {
//     props: {},
//   };
// }
