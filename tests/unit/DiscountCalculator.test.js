
const DiscountCalculator = require('../../src/services/DiscountCalculator');

describe('DiscountCalculator', () => {
    // 1. Fixed Amount Strategy
    it('should apply a fixed amount coupon correctly', () => {
        const cart = [{ name: 'T-Shirt', price: 350 }, { name: 'Hat', price: 250 }]; // Total 600
        const campaigns = [{
            name: '50 THB off',
            type: 'fixed_amount',
            category: 'Coupon',
            params: { amount: 50 }
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        expect(result.finalPrice).toBe(550);
        expect(result.initialPrice).toBe(600);
        expect(result.totalDiscount).toBe(50);
    });

    // 2. Points Strategy
    it('should respect the 20% cap for points discount', () => {
        const cart = [{ name: 'Hoodie', price: 1000 }]; // Total 1000
        const campaigns = [{
            name: 'Points Redemption',
            type: 'points',
            category: 'On Top',
            params: { customerPoints: 300 } // 300 points = 300 THB discount
        }];

        // 20% cap of 1000 is 200. So discount should be 200, not 300.
        const result = DiscountCalculator.calculate(cart, campaigns);
        expect(result.finalPrice).toBe(800);
        expect(result.totalDiscount).toBe(200);
    });

    // 3. Percentage Strategy
    it('should apply percentage discount correctly', () => {
        const cart = [{ name: 'Shoes', price: 2000 }, { name: 'Socks', price: 200 }]; // Total 2200
        const campaigns = [{
            name: '10% Off',
            type: 'percentage',
            category: 'Coupon',
            params: { percentage: 10 }
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        expect(result.finalPrice).toBe(1980); // 2200 - (2200 * 0.10)
        expect(result.totalDiscount).toBe(220);
    });

    // 4. Category Discount Strategy
    it('should apply category discount only to specified categories', () => {
        const cart = [
            { name: 'T-Shirt', price: 500, category: 'clothing', quantity: 1 },
            { name: 'Phone', price: 10000, category: 'electronics', quantity: 1 }
        ]; // Total 10500
        
        const campaigns = [{
            name: 'Clothing 20% Off',
            type: 'category_percentage',
            category: 'Coupon',
            applicable_categories: ['clothing'],
            discount_percentage: 20
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        // Only clothing items (500) get 20% discount = 100 THB discount
        expect(result.finalPrice).toBe(10400); // 10500 - 100
        expect(result.totalDiscount).toBe(100);
    });

    // 5. Seasonal Discount Strategy - Old Format (Every X THB get Y THB discount)
    it('should apply seasonal discount with every X THB format', () => {
        const cart = [{ name: 'Winter Jacket', price: 2500 }]; // Total 2500
        const campaigns = [{
            name: 'Winter Sale',
            type: 'seasonal',
            category: 'Coupon',
            params: { 
                everyXTHB: 1000,
                discountYTHB: 100
            }
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        // 2500 / 1000 = 2 (floor), so 2 * 100 = 200 THB discount
        expect(result.finalPrice).toBe(2300); // 2500 - 200
        expect(result.totalDiscount).toBe(200);
    });

    // 6. Seasonal Discount Strategy - New Format (Percentage with date validation)
    it('should apply seasonal discount with percentage format when in valid date range', () => {
        const cart = [{ name: 'Summer Shirt', price: 1000 }]; // Total 1000
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        
        const campaigns = [{
            name: 'Summer Sale',
            type: 'seasonal',
            category: 'Coupon',
            discount_percentage: 15,
            start_date: new Date().toISOString(),
            end_date: futureDate.toISOString()
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        expect(result.finalPrice).toBe(850); // 1000 - (1000 * 0.15)
        expect(result.totalDiscount).toBe(150);
    });

    // 7. Test multiple campaigns together
    it('should apply multiple campaigns correctly', () => {
        const cart = [
            { name: 'Shirt', price: 800, category: 'clothing', quantity: 1 },
            { name: 'Pants', price: 1200, category: 'clothing', quantity: 1 }
        ]; // Total 2000
        
        const campaigns = [
            {
                name: 'Clothing 10% Off',
                type: 'category_percentage',
                category: 'Coupon',
                applicable_categories: ['clothing'],
                discount_percentage: 10
            },
            {
                name: 'Extra 50 THB Off',
                type: 'fixed_amount',
                category: 'On Top',
                params: { amount: 50 }
            }
        ];

        const result = DiscountCalculator.calculate(cart, campaigns);
        // First: 10% off clothing = 200 THB discount → 1800
        // Then: 50 THB off → 1750
        expect(result.finalPrice).toBe(1750);
        expect(result.totalDiscount).toBe(250);
    });

    // 8. Test minimum amount condition
    it('should not apply discount if minimum amount is not met', () => {
        const cart = [{ name: 'Small Item', price: 300 }]; // Total 300
        const campaigns = [{
            name: '10% Off for 500+ purchases',
            type: 'percentage',
            category: 'Coupon',
            discount_percentage: 10,
            minimum_amount: 500
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        expect(result.finalPrice).toBe(300); // No discount applied
        expect(result.totalDiscount).toBe(0);
    });

    // 9. Test maximum discount cap
    it('should respect maximum discount limit', () => {
        const cart = [{ name: 'Expensive Item', price: 5000 }]; // Total 5000
        const campaigns = [{
            name: '20% Off (Max 500 THB)',
            type: 'percentage',
            category: 'Coupon',
            discount_percentage: 20,
            maximum_discount: 500
        }];

        const result = DiscountCalculator.calculate(cart, campaigns);
        // 20% of 5000 = 1000, but capped at 500
        expect(result.finalPrice).toBe(4500); // 5000 - 500
        expect(result.totalDiscount).toBe(500);
    });

    it('DEBUG: should apply category discount only to specified categories', () => {
        const cart = [
            { name: 'T-Shirt', price: 500, category: 'clothing', quantity: 1 },
            { name: 'Phone', price: 10000, category: 'electronics', quantity: 1 }
        ]; // Total 10500
        
        const campaigns = [{
            name: 'Clothing 20% Off',
            type: 'category_percentage',
            category: 'Coupon',
            applicable_categories: ['clothing'],
            discount_percentage: 20
        }];
    
        console.log('DEBUG - Cart:', JSON.stringify(cart, null, 2));
        console.log('DEBUG - Campaigns:', JSON.stringify(campaigns, null, 2));
        
        const result = DiscountCalculator.calculate(cart, campaigns);
        
        console.log('DEBUG - Result:', JSON.stringify(result, null, 2));
        
        // Only clothing items (500) get 20% discount = 100 THB discount
        expect(result.finalPrice).toBe(10400); // 10500 - 100
        expect(result.totalDiscount).toBe(100);
    });
    
    // Test debug สำหรับ multiple campaigns
    it('DEBUG: should apply multiple campaigns correctly', () => {
        const cart = [
            { name: 'Shirt', price: 800, category: 'clothing', quantity: 1 },
            { name: 'Pants', price: 1200, category: 'clothing', quantity: 1 }
        ]; // Total 2000
        
        const campaigns = [
            {
                name: 'Clothing 10% Off',
                type: 'category_percentage',
                category: 'Coupon',
                applicable_categories: ['clothing'],
                discount_percentage: 10
            },
            {
                name: 'Extra 50 THB Off',
                type: 'fixed_amount',
                category: 'On Top',
                params: { amount: 50 }
            }
        ];
    
        console.log('DEBUG - Cart:', JSON.stringify(cart, null, 2));
        console.log('DEBUG - Campaigns:', JSON.stringify(campaigns, null, 2));
        
        const result = DiscountCalculator.calculate(cart, campaigns);
        
        console.log('DEBUG - Result:', JSON.stringify(result, null, 2));
        
        // First: 10% off clothing = 200 THB discount → 1800
        // Then: 50 THB off → 1750
        expect(result.finalPrice).toBe(1750);
        expect(result.totalDiscount).toBe(250);
    });
});