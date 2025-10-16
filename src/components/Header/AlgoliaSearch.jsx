import React, { useEffect } from 'react';
import docsearch from '@docsearch/js';
import '@docsearch/css';
import { ALGOLIA } from '../../consts';

const AlgoliaSearch = () => {
  useEffect(() => {
    console.log("Initializing DocSearch...");
    try {
      docsearch({
        appId: ALGOLIA.appId,
        apiKey: ALGOLIA.apiKey,
        indexName: ALGOLIA.indexName,
        container: '#docsearch',
      });
      console.log("DocSearch initialized successfully.");
    } catch (error) {
      console.error("Error initializing DocSearch:", error);
    }
  }, []);

  return (
    <div id="docsearch"></div>
  );
};

export default AlgoliaSearch;
