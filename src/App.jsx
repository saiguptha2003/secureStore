import React, { useEffect, useState } from "react";
import TokenTableContainer from "./TokenTableContainer"; // Import the container component.
import "./App.css"
import TokensTable from "./TokenTable";
function App() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5001/services/SecureStore/getAllSecureTokens",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFldGVzaCIsImV4cCI6MTczNTIyNjE4NywidXNlcl9pZCI6IjMwODVmMzZiZGEyNDQ5ODBhMjQyNzFlOGUyNDg5YzI4IiwiZW1haWwiOiJjaGFldGVzaEBnbWFpbC5jb20ifQ.hnBmUi_wbZwK9SueP6WEjMdBiS0NE6f7nbI7R6Y9zPk",
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
      <TokensTable tokens={tokens} />
    </div>
  );
}

export default App;
