const CategoryService = require('./CategoryService');
const FixedAmountStrategy = require('../strategies/FixedAmountStrategy');
const PercentageStrategy = require('../strategies/PercentageStrategy');
const CategoryDiscountStrategy = require('../strategies/CategoryDiscountStrategy');
const PointsDiscountStrategy = require('../strategies/PointsDiscountStrategy');
const SeasonalDiscountStrategy = require('../strategies/SeasonalDiscountStrategy');


const strategies = {
    'fixed_amount': FixedAmountStrategy,
    'percentage': PercentageStrategy,
    'category_percentage': CategoryDiscountStrategy,
    'points': PointsDiscountStrategy,
    'seasonal': SeasonalDiscountStrategy  
};

class DiscountCalculator {
    calculate(cart, campaigns) {
        if (!Array.isArray(cart) || cart.length === 0) {
            return {
                initialPrice: 0,
                finalPrice: 0,
                totalDiscount: 0,
                appliedCampaigns: []
            };
        }

        if (!Array.isArray(campaigns)) {
            campaigns = [];
        }

        let finalPrice = cart.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            return total + (price * quantity);
        }, 0);
        
        const initialPrice = finalPrice;
        const categorizedCart = CategoryService.categorizeCartItems(cart);
        const campaignOrder = ['Coupon', 'On Top', 'Seasonal'];
        const campaignsByCategory = {
            'Coupon': [],
            'On Top': [],
            'Seasonal': []
        };
        
        campaigns.forEach(c => {
            if (campaignsByCategory[c.category]) {
                campaignsByCategory[c.category].push(c);
            }
        });

        const appliedCampaigns = [];

        for (const category of campaignOrder) {
            const campaignsToApply = campaignsByCategory[category];

            if (category === 'Coupon' && campaignsToApply.length > 1) {
                campaignsToApply.splice(1);
            }
            
            for (const campaign of campaignsToApply) {
                const strategy = strategies[campaign.type];
                if (strategy) {
                    const priceBeforeDiscount = finalPrice;
                    const newPrice = strategy.apply(finalPrice, categorizedCart, campaign);
                    
                    if (!isNaN(newPrice) && newPrice >= 0) {
                        finalPrice = newPrice;
                        appliedCampaigns.push({
                            campaign: campaign.name,
                            discount: priceBeforeDiscount - finalPrice
                        });
                    }
                }
            }
        }

        if (isNaN(finalPrice) || finalPrice < 0) {
            finalPrice = initialPrice;
        }

        return {
            initialPrice: initialPrice,
            finalPrice: Math.round(finalPrice * 100) / 100,
            totalDiscount: Math.round((initialPrice - finalPrice) * 100) / 100,
            appliedCampaigns: appliedCampaigns
        };
    }
}

module.exports = new DiscountCalculator();