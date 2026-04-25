import { useEffect, useState } from 'react';

function SearchBar({ value, onSearch, placeholder = 'Search...' }) {
  const [query, setQuery] = useState(value || '');
  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timeout);
  }, [query, onSearch]);
  return <input className="form-control" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />;
}

export default SearchBar;
