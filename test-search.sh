#!/bin/bash

echo "Testing search index endpoint..."
echo ""

# Check if server is running
if curl -s http://localhost:4321/ > /dev/null 2>&1; then
    echo "✅ Server is running on http://localhost:4321/"
else
    echo "❌ Server is not running"
    exit 1
fi

echo ""
echo "Fetching search index..."

# Fetch and parse search index
RESPONSE=$(curl -s http://localhost:4321/search-index.json)

# Check if response is valid JSON
if echo "$RESPONSE" | jq . > /dev/null 2>&1; then
    echo "✅ Search index is valid JSON"
    
    # Check for required keys
    HAS_INDEX=$(echo "$RESPONSE" | jq 'has("index")')
    HAS_DOCS=$(echo "$RESPONSE" | jq 'has("documents")')
    DOC_COUNT=$(echo "$RESPONSE" | jq '.documents | length')
    
    echo ""
    echo "Structure check:"
    echo "  - Has 'index' key: $HAS_INDEX"
    echo "  - Has 'documents' key: $HAS_DOCS"
    echo "  - Document count: $DOC_COUNT"
    
    if [ "$HAS_INDEX" = "true" ] && [ "$HAS_DOCS" = "true" ] && [ "$DOC_COUNT" -gt 0 ]; then
        echo ""
        echo "✅ Search index structure is correct!"
        echo ""
        echo "Sample document:"
        echo "$RESPONSE" | jq '.documents[0]'
    else
        echo ""
        echo "❌ Search index structure is incorrect"
    fi
else
    echo "❌ Search index is not valid JSON"
    echo "Response preview:"
    echo "$RESPONSE" | head -c 500
fi
