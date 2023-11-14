import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery) {
      onSearch(searchQuery); // Call the onSearch prop with the search query
    }
  };

  return (
    <div>
      <div
        className="search"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: "3%",
        }}
      >
        <div className="searchIcon">
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search Client..."
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
