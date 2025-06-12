const DiscountCalculator = require('../services/DiscountCalculator');
const ValidationService = require('../services/ValidationService');

class DiscountController {
    calculateDiscount(req, res) {
        const validationResult = ValidationService.validateRequest(req.body);
        if (!validationResult.isValid) {
            return res.status(400).json({ error: validationResult.message });
        }

        let { cart, campaigns } = req.body;

        cart = ValidationService.correctTyposInCart(cart);

        try {
            const result = DiscountCalculator.calculate(cart, campaigns);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error calculating discount:', error);
            res.status(500).json({ error: 'An internal server error occurred.' });
        }
    }
}

module.exports = new DiscountController();