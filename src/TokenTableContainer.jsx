import React from "react";
import TokensTable from "./TokenTable"; // Import the TokensTable component.

const TokenTableContainer = ({ tokens }) => {
  return (
    <div className="token-table-container">
      <TokensTable tokens={tokens} />
    </div>
  );
};

export default TokenTableContainer;
