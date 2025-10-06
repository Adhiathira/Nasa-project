/**
 * Tests for Graph Transformation Utilities
 */

import { describe, it, expect } from 'vitest';
import { transformPapersToGraph } from './graphTransform';
import type { Paper } from '../types/api';

describe('transformPapersToGraph', () => {
  it('should transform papers to nodes and links correctly', () => {
    const mockPapers: Paper[] = [
      {
        paper_id: '123e4567-e89b-12d3-a456-426614174000',
        metadata: {
          title: 'Test Paper 1',
          summary: 'This is a test summary for paper 1'
        },
        similarity: 0.85
      },
      {
        paper_id: '123e4567-e89b-12d3-a456-426614174001',
        metadata: {
          title: 'Test Paper 2',
          summary: 'This is a test summary for paper 2'
        },
        similarity: 0.65
      }
    ];

    const result = transformPapersToGraph(mockPapers);

    // Check nodes
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes[0]).toEqual({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Paper 1',
      summary: 'This is a test summary for paper 1',
      val: 8.5, // 0.85 * 10
      color: '#4a9eff'
    });

    expect(result.nodes[1]).toEqual({
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Test Paper 2',
      summary: 'This is a test summary for paper 2',
      val: 6.5, // 0.65 * 10
      color: '#4a9eff'
    });

    // Check links - should be empty for initial search results
    expect(result.links).toHaveLength(0);
  });

  it('should handle empty papers array', () => {
    const result = transformPapersToGraph([]);

    expect(result.nodes).toHaveLength(0);
    expect(result.links).toHaveLength(0);
  });

  it('should throw error if papers is not an array', () => {
    expect(() => transformPapersToGraph(null as any)).toThrow(
      'transformPapersToGraph: papers parameter must be an array'
    );

    expect(() => transformPapersToGraph(undefined as any)).toThrow(
      'transformPapersToGraph: papers parameter must be an array'
    );

    expect(() => transformPapersToGraph('not an array' as any)).toThrow(
      'transformPapersToGraph: papers parameter must be an array'
    );
  });

  it('should throw error if paper is missing paper_id', () => {
    const invalidPaper = {
      metadata: {
        title: 'Test',
        summary: 'Test summary'
      },
      similarity: 0.5
    } as any;

    expect(() => transformPapersToGraph([invalidPaper])).toThrow(
      'Paper at index 0 is missing required field: paper_id'
    );
  });

  it('should throw error if paper is missing metadata', () => {
    const invalidPaper = {
      paper_id: '123',
      similarity: 0.5
    } as any;

    expect(() => transformPapersToGraph([invalidPaper])).toThrow(
      'Paper at index 0 is missing required field: metadata'
    );
  });

  it('should throw error if paper is missing metadata.title', () => {
    const invalidPaper = {
      paper_id: '123',
      metadata: {
        summary: 'Test summary'
      },
      similarity: 0.5
    } as any;

    expect(() => transformPapersToGraph([invalidPaper])).toThrow(
      'Paper at index 0 is missing required field: metadata.title'
    );
  });

  it('should throw error if paper is missing metadata.summary', () => {
    const invalidPaper = {
      paper_id: '123',
      metadata: {
        title: 'Test'
      },
      similarity: 0.5
    } as any;

    expect(() => transformPapersToGraph([invalidPaper])).toThrow(
      'Paper at index 0 is missing required field: metadata.summary'
    );
  });

  it('should throw error if paper is missing similarity', () => {
    const invalidPaper = {
      paper_id: '123',
      metadata: {
        title: 'Test',
        summary: 'Test summary'
      }
    } as any;

    expect(() => transformPapersToGraph([invalidPaper])).toThrow(
      'Paper at index 0 is missing required field: similarity (must be a number)'
    );
  });

  it('should scale similarity correctly', () => {
    const testCases = [
      { similarity: 0, expected: 0 },
      { similarity: 0.5, expected: 5 },
      { similarity: 1, expected: 10 },
      { similarity: 0.123, expected: 1.23 }
    ];

    testCases.forEach(({ similarity, expected }) => {
      const paper: Paper = {
        paper_id: 'test',
        metadata: { title: 'Test', summary: 'Test' },
        similarity
      };

      const result = transformPapersToGraph([paper]);
      expect(result.nodes[0].val).toBe(expected);
    });
  });

  it('should assign cosmic blue color to all nodes', () => {
    const mockPapers: Paper[] = [
      {
        paper_id: '1',
        metadata: { title: 'Paper 1', summary: 'Summary 1' },
        similarity: 0.8
      },
      {
        paper_id: '2',
        metadata: { title: 'Paper 2', summary: 'Summary 2' },
        similarity: 0.6
      },
      {
        paper_id: '3',
        metadata: { title: 'Paper 3', summary: 'Summary 3' },
        similarity: 0.9
      }
    ];

    const result = transformPapersToGraph(mockPapers);

    result.nodes.forEach(node => {
      expect(node.color).toBe('#4a9eff');
    });
  });
});
