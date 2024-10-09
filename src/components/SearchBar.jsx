import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./search-bar.css";
import { debounce } from "lodash";
import { API_KEY, transformSearchResults } from "./common";
export const SearchBar = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [dispayText, setDisplayText] = useState("");

  const handleBlur = () => {
    setIsDivVisible(false);
  };
  useEffect(() => {
    const debouncedSearch = debounce(async (term) => {
      try {
        const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${API_KEY}`;
        const response = await fetch(apiUrl);
        const results = await response.json();

        const data = transformSearchResults(results);
        setResults(data);
        data?.length === 0 && setDisplayText("No Data Found");
      } catch (error) {
        console.error("Error fetching data:", error);
        setDisplayText("No Data Found");
      }
    }, 1000);
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setResults([]);
      setIsDivVisible(false);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  // Handle search input change
  const handleChange = (e) => {
    setIsDivVisible(true);
    setDisplayText("Loading...");
    setSearchTerm(e.target.value);
    setSelected(null);
  };

  // Handle item click from dropdown
  const handleSelect = (result) => {
    setSearchTerm(null);
    setResults([]);
    const nameKey = "2. name";
    const symbolKey = "1. symbol";
    setSelected(result[nameKey]);
    props.setSymbolUpdate(result[symbolKey]);
    props.setStockName(result[nameKey]);
  };
  console.log("renderdewfe");
  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type=""
          value={selected}
          onChange={handleChange}
          className="search-input"
          placeholder="Search for anything..."
          onBlur={handleBlur}
        />

        {/* Search Icon */}
        <div className="search-icon">
          <FiSearch size={24} />
        </div>
      </div>

      {/* Dropdown with results */}
      {isDivVisible ? (
        results.length > 0 ? (
          <ul className={` results-dropdown`}>
            {results.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: selected === item ? "#f0f0f0" : "white",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                {item.name}
              </li>
            ))}
          </ul>
        ) : (
          <ul className={` results-dropdown`}>
            <li>{dispayText}</li>
          </ul>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
