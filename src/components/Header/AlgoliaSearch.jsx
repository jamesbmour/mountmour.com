import React from 'react';
import DocSearch from '@docsearch/react';
import '@docsearch/css';
import { ALGOLIA } from '../../consts';

export default function AlgoliaSearch() {
  return (
    <DocSearch
      appId={ALGOLIA.appId}
      apiKey={ALGOLIA.apiKey}
      indexName={ALGOLIA.indexName}
    />
  );
}
