import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.jsx";
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(), // Apollo client uses this to cache query results after fetching them
  // Apollo client sends cookies along with every request to the server.
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </StrictMode>
);
