/**
 * Usage examples for transformPapersToGraph utility
 *
 * This file demonstrates how to use the transformPapersToGraph function
 * to convert API Paper data into Graph3D component format.
 */

import { transformPapersToGraph } from './graphTransform';
import type { Paper } from '../types/api';

// Example 1: Basic usage with search results
export function exampleBasicUsage() {
  // Mock API response from /api/search endpoint
  const searchResults: Paper[] = [
    {
      paper_id: '123e4567-e89b-12d3-a456-426614174000',
      metadata: {
        title: 'Quantum Computing Applications in Machine Learning',
        summary: 'This paper explores the intersection of quantum computing and machine learning algorithms, demonstrating significant performance improvements in specific problem domains.'
      },
      similarity: 0.92
    },
    {
      paper_id: '223e4567-e89b-12d3-a456-426614174001',
      metadata: {
        title: 'Deep Learning for Natural Language Processing',
        summary: 'A comprehensive survey of deep learning techniques applied to NLP tasks including sentiment analysis, machine translation, and question answering systems.'
      },
      similarity: 0.87
    },
    {
      paper_id: '323e4567-e89b-12d3-a456-426614174002',
      metadata: {
        title: 'Reinforcement Learning in Robotics',
        summary: 'This work presents novel reinforcement learning approaches for robotic control tasks in both simulation and real-world environments.'
      },
      similarity: 0.75
    }
  ];

  // Transform to graph format
  const { nodes, links } = transformPapersToGraph(searchResults);

  console.log('Nodes:', nodes);
  // Output:
  // [
  //   { id: '123e...', name: 'Quantum Computing...', summary: '...', val: 9.2, color: '#4a9eff' },
  //   { id: '223e...', name: 'Deep Learning...', summary: '...', val: 8.7, color: '#4a9eff' },
  //   { id: '323e...', name: 'Reinforcement Learning...', summary: '...', val: 7.5, color: '#4a9eff' }
  // ]

  console.log('Links:', links);
  // Output: [] (empty for initial search results)

  return { nodes, links };
}

// Example 2: Using with React component
export function exampleReactUsage() {
  /*
  import { useQuery } from '@tanstack/react-query';
  import { searchPapers } from '../services/api';
  import { transformPapersToGraph } from '../utils/graphTransform';
  import Graph3D from '../components/Graph3D';

  function SearchResults({ query }: { query: string }) {
    // Fetch papers from API
    const { data: papers, isLoading } = useQuery({
      queryKey: ['search', query],
      queryFn: () => searchPapers(query)
    });

    // Transform to graph format
    const graphData = papers ? transformPapersToGraph(papers) : { nodes: [], links: [] };

    if (isLoading) return <div>Loading...</div>;

    return (
      <Graph3D
        nodes={graphData.nodes}
        links={graphData.links}
        onNodeClick={(node) => console.log('Clicked:', node.name)}
      />
    );
  }
  */
}

// Example 3: Handling empty results
export function exampleEmptyResults() {
  const emptyResults: Paper[] = [];
  const { nodes, links } = transformPapersToGraph(emptyResults);

  console.log('Nodes:', nodes); // Output: []
  console.log('Links:', links); // Output: []

  return { nodes, links };
}

// Example 4: Error handling
export function exampleErrorHandling() {
  try {
    // This will throw an error
    const result = transformPapersToGraph(null as any);
  } catch (error) {
    console.error('Error:', error.message);
    // Output: "transformPapersToGraph: papers parameter must be an array"
  }

  try {
    // This will throw an error for missing paper_id
    const invalidPaper = {
      metadata: { title: 'Test', summary: 'Test summary' },
      similarity: 0.5
    } as any;

    const result = transformPapersToGraph([invalidPaper]);
  } catch (error) {
    console.error('Error:', error.message);
    // Output: "Paper at index 0 is missing required field: paper_id"
  }
}

// Example 5: Understanding similarity scaling
export function exampleSimilarityScaling() {
  const papers: Paper[] = [
    {
      paper_id: '1',
      metadata: { title: 'High Similarity Paper', summary: 'Very relevant' },
      similarity: 1.0  // Will create node with val=10 (large sphere)
    },
    {
      paper_id: '2',
      metadata: { title: 'Medium Similarity Paper', summary: 'Somewhat relevant' },
      similarity: 0.5  // Will create node with val=5 (medium sphere)
    },
    {
      paper_id: '3',
      metadata: { title: 'Low Similarity Paper', summary: 'Less relevant' },
      similarity: 0.1  // Will create node with val=1 (small sphere)
    }
  ];

  const { nodes } = transformPapersToGraph(papers);

  nodes.forEach(node => {
    console.log(`${node.name}: size=${node.val}`);
  });
  // Output:
  // High Similarity Paper: size=10
  // Medium Similarity Paper: size=5
  // Low Similarity Paper: size=1
}
