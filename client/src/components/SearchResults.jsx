import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EverythingCard from './EverythingCard';
import Loader from './Loader';

const api = '6d26f431cbb1415cbe1a2dec2554ccbf';

function SearchResults() {
  const { query } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use a proxy server to bypass CORS error or move API calls to the backend
        const response = await fetch(`http://localhost:3000/api/search?q=${query}&page=${page}&pageSize=9`); // Backend proxy URL
        const data = await response.json();

        if (data.status !== 'ok') {
          throw new Error(data.message || 'Error fetching search results');
        }

        console.log("API Response:", data);
        setSearchResults(data.articles);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError('Failed to fetch search results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page]);

  return (
    <div>
      <Link to="/" className="back-button">Back to Home</Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <>
          {searchResults.length === 0 && <div>No results found for "{query}".</div>}
          <div className='my-10 cards grid lg:place-content-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3'>
            {searchResults.map((element, index) => (
              <EverythingCard
                title={element.title}
                description={element.description}
                imgUrl={element.urlToImage}
                publishedAt={element.publishedAt}
                url={element.url}
                author={element.author}
                source={element.source.name}
                key={index}
              />
            ))}
          </div>
          <div className="pagination-controls">
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchResults;
