import { useCallback, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./search-bar.css";
import { debounce } from "lodash";
import { API_KEY, transformSearchRsults } from "./common";
export const SearchBar = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  // Async API call with debounced search
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      try {
        setLoading(true);
        const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${API_KEY}`;
        const response = await fetch(apiUrl);
        const results = await response.json();

        const data = transformSearchRsults(results);
        console.log("Searching for:", data);
        setResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, 500), // Debounce delay
    [API_KEY, setLoading, setResults] // Add all necessary dependencies here
  );

  // Watch for changes in searchTerm and trigger the debounced search
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setResults([]); // Clear results when search term is cleared
    }
  }, [searchTerm, debouncedSearch]);

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle search input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setSelected(null); // Clear selected when typing again
  };

  // Handle item click from dropdown
  const handleSelect = (result) => {
    setSearchTerm(null); // Set the selected result as the search term
    setResults([]); // Clear the dropdown after selection
    const nameKey = "2. name";
    const symbolKey = "1. symbol";
    setSelected(result[nameKey]); // Store the selected result
    props.setSymbolUpdate(result[symbolKey]);
    props.setStockName(result[nameKey]);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type=""
          value={selected}
          onChange={handleChange}
          className="search-input"
          placeholder="Search for anything..."
        />

        {/* Search Icon */}
        <div className="search-icon">
          <FiSearch size={24} />
        </div>
      </div>

      {/* Dropdown with results */}
      {!loading && results.length > 0 ? (
        <ul className="results-dropdown">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px",
                cursor: "pointer",
                backgroundColor: selected === item ? "#f0f0f0" : "white",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
            >
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="results-dropdown">
          <li>Loading....</li>
        </ul>
      )}
    </div>
  );
};
