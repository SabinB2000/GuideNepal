import React from 'react';

const RecentSearches = ({ searches }) => (
  <div className="searches-grid">
    {searches.map(search => (
      <div key={search._id} className="search-item">
        🔍 {search.query}
      </div>
    ))}
  </div>
);

export default RecentSearches;