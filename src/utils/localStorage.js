// Utility functions for localStorage management

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get item from localStorage with error handling and default value
export const getLocalStorageItem = (key, defaultValue = null) => {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Set item in localStorage with error handling
export const setLocalStorageItem = (key, value) => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available");
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

// Remove item from localStorage with error handling
export const removeLocalStorageItem = (key) => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

// Clear all items from localStorage with error handling
export const clearLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

// Get user settings from localStorage
export const getUserSettings = (userId) => {
  return getLocalStorageItem(`user_settings_${userId}`, {
    theme: "light",
    defaultFilters: {},
    preferredExportFormat: "pdf",
  });
};

// Save user settings to localStorage
export const saveUserSettings = (userId, settings) => {
  return setLocalStorageItem(`user_settings_${userId}`, settings);
};

// Get payout rates from localStorage
export const getPayoutRates = () => {
  return getLocalStorageItem("payout_rates", {
    news: 5.0,
    blog: 8.0,
  });
};

// Save payout rates to localStorage
export const savePayoutRates = (rates) => {
  return setLocalStorageItem("payout_rates", rates);
};

// Get recent searches from localStorage
export const getRecentSearches = (userId) => {
  return getLocalStorageItem(`recent_searches_${userId}`, []);
};

// Add a search term to recent searches
export const addRecentSearch = (userId, searchTerm) => {
  if (!searchTerm.trim()) return;

  const searches = getRecentSearches(userId);

  // Remove the term if it exists already (to avoid duplicates)
  const filteredSearches = searches.filter((term) => term !== searchTerm);

  // Add the new term at the beginning
  filteredSearches.unshift(searchTerm);

  // Keep only the 5 most recent searches
  const updatedSearches = filteredSearches.slice(0, 5);

  return setLocalStorageItem(`recent_searches_${userId}`, updatedSearches);
};

// Get saved articles from localStorage
export const getSavedArticles = (userId) => {
  return getLocalStorageItem(`saved_articles_${userId}`, []);
};

// Save an article to localStorage
export const saveArticle = (userId, article) => {
  const savedArticles = getSavedArticles(userId);

  // Check if article already exists
  const exists = savedArticles.some((a) => a.url === article.url);

  if (!exists) {
    const updatedArticles = [article, ...savedArticles];
    return setLocalStorageItem(`saved_articles_${userId}`, updatedArticles);
  }

  return false;
};

// Remove a saved article from localStorage
export const removeSavedArticle = (userId, articleUrl) => {
  const savedArticles = getSavedArticles(userId);
  const updatedArticles = savedArticles.filter(
    (article) => article.url !== articleUrl
  );
  return setLocalStorageItem(`saved_articles_${userId}`, updatedArticles);
};
