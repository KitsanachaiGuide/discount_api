const CategoryService = require('../../../src/services/CategoryService');

describe('CategoryService', () => {
    it('should correctly categorize a "T-Shirt"', () => {
        const cart = [{ name: 'A classic T-Shirt', price: 350 }];
        const categorizedCart = CategoryService.categorizeCartItems(cart);
        expect(categorizedCart[0].category).toBe('Clothing');
    });

    it('should correctly categorize a "Hat"', () => {
        const cart = [{ name: 'Baseball Hat', price: 250 }];
        const categorizedCart = CategoryService.categorizeCartItems(cart);
        expect(categorizedCart[0].category).toBe('Accessories');
    });

    it('should handle items with no matching keywords', () => {
        const cart = [{ name: 'Some unknown item', price: 100 }];
        const categorizedCart = CategoryService.categorizeCartItems(cart);
        expect(categorizedCart[0].category).toBe('Uncategorized');
    });
});