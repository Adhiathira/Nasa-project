#!/bin/bash

# Verification script for serve_adapted.py implementation
# Checks all files are present and shows implementation summary

echo "=============================================================================="
echo "BACKEND ADAPTATION VERIFICATION"
echo "=============================================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "serve_adapted.py" ]; then
    echo "❌ ERROR: Please run this script from actual-backend/scripts/"
    exit 1
fi

echo "✅ Current directory verified"
echo ""

# Check all required files exist
echo "Checking required files..."
echo "=============================================================================="

files=(
    "serve_adapted.py"
    "test_serve_adapted.py"
    "README_ADAPTED.md"
    "QUICKSTART_ADAPTED.md"
    "IMPLEMENTATION_CHECKLIST.md"
    "example_responses.json"
    "serve.py"
    "config.py"
    "build_index.py"
)

all_present=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        echo "✅ $file ($size)"
    else
        echo "❌ MISSING: $file"
        all_present=false
    fi
done

echo ""

if [ "$all_present" = false ]; then
    echo "❌ Some required files are missing!"
    exit 1
fi

echo "✅ All required files present"
echo ""

# Check ChromaDB index
echo "Checking ChromaDB index..."
echo "=============================================================================="

if [ -d "chroma_nasa" ]; then
    index_size=$(du -sh chroma_nasa | awk '{print $1}')
    echo "✅ ChromaDB index exists (size: $index_size)"
else
    echo "⚠️  WARNING: ChromaDB index not found (chroma_nasa/)"
    echo "   Run: python build_index.py"
fi

echo ""

# Check Python version
echo "Checking Python environment..."
echo "=============================================================================="

python_version=$(python3 --version 2>&1)
echo "Python: $python_version"

# Check if dependencies are installed
echo ""
echo "Checking Python dependencies..."

dependencies=(
    "flask"
    "flask_cors"
    "torch"
    "transformers"
    "langchain"
    "langchain_community"
    "chromadb"
)

for dep in "${dependencies[@]}"; do
    if python3 -c "import $dep" 2>/dev/null; then
        echo "✅ $dep"
    else
        echo "⚠️  Missing: $dep (install with: pip install $dep)"
    fi
done

echo ""

# Run unit tests
echo "Running unit tests..."
echo "=============================================================================="

if python3 test_serve_adapted.py; then
    echo ""
    echo "✅ All unit tests PASSED"
else
    echo ""
    echo "❌ Unit tests FAILED"
    exit 1
fi

echo ""

# Show implementation summary
echo "=============================================================================="
echo "IMPLEMENTATION SUMMARY"
echo "=============================================================================="
echo ""

# Count lines in serve_adapted.py
lines=$(wc -l serve_adapted.py | awk '{print $1}')
echo "📄 serve_adapted.py: $lines lines"

# Count API endpoints
endpoints=$(grep -c "@app.post\|@app.get" serve_adapted.py)
echo "🔌 API endpoints implemented: $endpoints"

# Check for UUID implementation
if grep -q "uuid.uuid5" serve_adapted.py; then
    echo "✅ UUID v5 generation implemented"
fi

if grep -q "PAPER_REGISTRY" serve_adapted.py; then
    echo "✅ Paper registry implemented"
fi

if grep -q "CORS(app" serve_adapted.py; then
    echo "✅ CORS enabled"
fi

echo ""
echo "=============================================================================="
echo "VERIFICATION COMPLETE"
echo "=============================================================================="
echo ""
echo "Next steps:"
echo "1. Build ChromaDB index: python build_index.py"
echo "2. Start backend: PORT=8000 python serve_adapted.py"
echo "3. Test health: curl http://localhost:8000/health"
echo "4. Configure frontend: VITE_API_BASE_URL=http://localhost:8000"
echo "5. Start frontend: cd ../../frontend && npm run dev"
echo ""
echo "See QUICKSTART_ADAPTED.md for detailed instructions."
echo ""
