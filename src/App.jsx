import React, { useEffect, useState } from "react";
import TokenTableContainer from "./TokenTableContainer"; // Import the container component.
import "./App.css"
function App() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/services/SecureStore/getAllSecureTokens",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1cmFuZ2FzYWkiLCJleHAiOjE3MzUxOTg5NTIsInVzZXJfaWQiOiJkODI2YTg4ZGVjN2U0ZjkwYjAyZjg2YTI2ZTFiZTA3OCIsImVtYWlsIjoic2FpZ3VwdGhhX3ZAc3JtYXAuZWR1LmluIn0.59ESmR-TOY2sfz2jwN2E8ifqRB-rCI2vXQkhn9jReXo",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const formattedTokens = data.map((token) => ({
          ...token,
          expire_date_time: new Date(token.expire_date_time),
        }));
        setTokens(formattedTokens);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <TokenTableContainer tokens={tokens} />
    </div>
  );
}

export default App;
