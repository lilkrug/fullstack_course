import React, { useState } from 'react';

function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    props.onSearch(searchTerm);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
    </div>
  );
}

export default SearchBar;