import { useState, ChangeEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [searchMode, setSearchMode] = useState<'AND' | 'OR'>('AND');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    const finalQuery = [query, searchMode, '3'];
    console.log(finalQuery);
    onSearch(finalQuery);
  };

  const toggleSearchMode = (mode: 'AND' | 'OR') => {
    setSearchMode(mode);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search..."
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <div className="toggle-container">
          <button
            className={`toggle-button ${searchMode === 'AND' ? 'active' : ''}`}
            onClick={() => toggleSearchMode('AND')}
          >
            AND
          </button>
          <button
            className={`toggle-button ${searchMode === 'OR' ? 'active' : ''}`}
            onClick={() => toggleSearchMode('OR')}
          >
            OR
          </button>
        </div>
      </div>

      <style jsx>{`
        .search-bar-container {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .search-bar {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          flex: 1;
          color: white;
          background-color: rgba(0, 0, 0, 0);
        }

        .search-button {
          padding: 10px;
          background-color: var(--primary-color);
          color: white !important;
          border: 1px solid transparent;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, border-color 0.3s ease;
          flex-shrink: 0;
          margin-left: 10px;
          border-color: white !important;
        }

        .search-button:hover {
          background-color: var(--hover-color);
          border-color: white !important;
        }

        .toggle-container {
          display: flex;
          margin-left: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          overflow: hidden;
        }

        .toggle-button {
          flex: 1;
          padding: 10px 16px;
          cursor: pointer;
          background-color: #f0f0f0;
          border: none;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .toggle-button.active {
          background-color: #007bff;
          color: #fff;
        }

        @media (max-width: 600px) {
          .search-bar-container {
            flex-direction: column;
          }
          .search-bar {
            flex-direction: column;
          }
          .search-input,
          .search-button,
          .toggle-container {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .toggle-container {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
