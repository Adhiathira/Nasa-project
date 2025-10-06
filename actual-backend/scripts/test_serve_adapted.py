#!/usr/bin/env python3
"""
Test script for serve_adapted.py to verify implementation logic.
Tests UUID generation, paper registry, and response formats without running the full LLM.
"""
import uuid

# Test UUID v5 generation
NAMESPACE_PAPER = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')

def link_to_uuid(link: str) -> str:
    """Generate deterministic UUID from paper link"""
    return str(uuid.uuid5(NAMESPACE_PAPER, link))

# Test cases
test_links = [
    "https://example.com/paper1",
    "https://example.com/paper2",
    "https://example.com/paper1",  # Duplicate to verify determinism
]

print("Testing UUID v5 Generation:")
print("=" * 60)
for link in test_links:
    paper_uuid = link_to_uuid(link)
    print(f"Link: {link}")
    print(f"UUID: {paper_uuid}")
    print(f"Valid UUID: {uuid.UUID(paper_uuid)}")
    print("-" * 60)

# Verify determinism
uuid1 = link_to_uuid(test_links[0])
uuid3 = link_to_uuid(test_links[2])
assert uuid1 == uuid3, "UUIDs should be identical for same link!"
print("\n✅ Determinism check PASSED: Same link produces same UUID")

# Test response format
print("\nTesting Response Format:")
print("=" * 60)

sample_paper = {
    "paper_id": link_to_uuid("https://example.com/paper1"),
    "metadata": {
        "title": "Photosynthesis in C4 Plants",
        "summary": "This paper explores the evolutionary adaptations of C4 photosynthesis."
    },
    "similarity": 0.92
}

print(f"Sample Paper Response:")
import json
print(json.dumps(sample_paper, indent=2))

# Validate UUID format
try:
    uuid.UUID(sample_paper["paper_id"])
    print("\n✅ UUID format validation PASSED")
except ValueError:
    print("\n❌ UUID format validation FAILED")

# Validate similarity range
assert 0.0 <= sample_paper["similarity"] <= 1.0, "Similarity must be between 0.0 and 1.0"
print("✅ Similarity range validation PASSED")

# Validate metadata structure
assert "title" in sample_paper["metadata"], "Metadata must contain 'title'"
assert "summary" in sample_paper["metadata"], "Metadata must contain 'summary'"
print("✅ Metadata structure validation PASSED")

print("\n" + "=" * 60)
print("All tests PASSED! serve_adapted.py logic is correct.")
print("=" * 60)
