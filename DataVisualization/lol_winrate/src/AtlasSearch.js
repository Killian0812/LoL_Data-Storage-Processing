import React, { useState } from 'react';
import axios from 'axios';
import { JsonViewer } from 'view-json-react';
import './AtlasSearch.css';  // Import the CSS file

const AtlasSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        const startTime = new Date();

        try {
            const response = await axios.post('http://localhost:8080/api/search', { query });

            const endTime = new Date();
            setMsg(`Time taken: ${endTime - startTime}ms. Total results: ${response.data.length}`)

            setResults(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error performing search', error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for match detail..."
                />
                <button type="submit" className={`${loading && 'loading'}`}>Search</button>
            </form>
            <p>{msg}</p>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <JsonViewer data={result} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AtlasSearch;
