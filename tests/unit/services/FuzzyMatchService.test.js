const FuzzyMatchService = require('../../../src/services/FuzzyMatchService');
const productKeywords = require('../../../src/data/product-keywords.json');

describe('FuzzyMatchService', () => {
  it('should find the best match for a clear keyword', () => {
    const searchString = 'T-Shirt';
    const bestMatch = FuzzyMatchService.findBestMatch(searchString, productKeywords);
    expect(bestMatch).not.toBeNull();
    expect(bestMatch.category).toBe('Clothing');
  });

  it('should find the best match even if the keyword is part of a longer string', () => {
    const searchString = 'A very nice blue Hoodie';
    const bestMatch = FuzzyMatchService.findBestMatch(searchString, productKeywords);
    expect(bestMatch).not.toBeNull();
    expect(bestMatch.category).toBe('Clothing');
  });

  it('should return null if no relevant keyword is found', () => {
    const searchString = 'A random piece of furniture';
    const bestMatch = FuzzyMatchService.findBestMatch(searchString, productKeywords);
    expect(bestMatch).toBeNull();
  });

  it('should handle items that could belong to multiple categories like "Watch"', () => {
    const searchString = 'A digital Watch';
    const bestMatch = FuzzyMatchService.findBestMatch(searchString, productKeywords);
    expect(bestMatch).not.toBeNull();

    expect(['Accessories', 'Electronics']).toContain(bestMatch.category);
  });
});