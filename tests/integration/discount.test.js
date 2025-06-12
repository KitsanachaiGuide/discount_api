const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/discounts/calculate', () => {
    it('should correctly calculate discounts based on the example from the PDF', async () => {

        const payload = {
            "cart": [
                { "name": "T-Shirt", "price": 350 },
                { "name": "Hoodie", "price": 700 },
                { "name": "Watch", "price": 850 },
                { "name": "Bag", "price": 640 }
            ],
            "campaigns": [
                {
                    "name": "15% Off Clothing",
                    "type": "category_percentage",
                    "category": "On Top",
                    "params": {
                        "category": "Clothing",
                        "amount": 15
                    }
                }
            ]
        };

        const response = await request(app)
            .post('/api/discounts/calculate')
            .send(payload);
        expect(response.status).toBe(200);
        // Initial Price = 350+700+850+640 = 2540
        // Clothing Total = 350+700 = 1050
        // Discount = 1050 * 0.15 = 157.5
        // Final Price = 2540 - 157.5 = 2382.5
        expect(response.body.finalPrice).toBe(2382.5);
        expect(response.body.appliedCampaigns.length).toBe(1);
    });

    it('should handle multiple campaigns in the correct order', async () => {
        const payload = {
            "cart": [
                { "name": "T-Shirt", "price": 1000 }
            ],
            "campaigns": [
                // Seasonal: 100 off every 500
                {
                    "name": "Summer Sale",
                    "type": "seasonal",
                    "category": "Seasonal",
                    "params": { "everyXTHB": 500, "discountYTHB": 100 }
                },
                // Coupon: 10% off
                 {
                    "name": "New User Coupon",
                    "type": "percentage",
                    "category": "Coupon",
                    "params": { "percentage": 10 }
                }
            ]
        };

        const response = await request(app)
            .post('/api/discounts/calculate')
            .send(payload);
        
        // Logic:
        // 1. Initial price: 1000
        // 2. Apply Coupon (10% off): 1000 * 0.9 = 900
        // 3. Apply Seasonal (100 off every 500 on 900): floor(900/500) * 100 = 1 * 100 = 100
        // 4. Final Price: 900 - 100 = 800
        expect(response.status).toBe(200);
        expect(response.body.finalPrice).toBe(800);
    });
});