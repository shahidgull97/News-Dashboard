import React from "react";
import Image from "next/image";
import { format } from "date-fns";

export default function NewsCard({ article }) {
  // console.log(article);

  const {
    webTitle,
    description,
    urlToImage,
    author,
    pillarName,
    publishedAt,
    webPublicationDate,
    source,
    url,
    sectionName,
    type,
  } = article;

  const formattedDate = publishedAt
    ? format(new Date(publishedAt), "MMM dd, yyyy")
    : "Unknown date";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative top-0 right-0 bg-blue-400 text-white px-2 py-1 text-xs uppercase">
        {type || "News"}
      </div>

      <div className="p-4 flex justify-between">
        <div>
          {" "}
          <h3 className="text-lg font-semibold mb-2 text-black line-clamp-2">
            {webTitle}
          </h3>
          {/* <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {webTitle || "No description available"}
        </p> */}
          <div className="flex gap-10 items-center text-xs text-gray-500 ">
            <div className="flex items-center">
              <span className="font-bold text-xl">
                {sectionName || "Unknown author"}
              </span>
            </div>
            <div>
              <span className="font-bold text-xl">
                {new Date(article.webPublicationDate).toLocaleDateString(
                  "en-GB"
                )}
              </span>
              <span className="ml-2 text-gray-400 font-bold text-xl">
                | {pillarName || "Unknown source"}
              </span>
            </div>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
        >
          Read More
        </a>
      </div>
    </div>
  );
}
