const commonTypos = require('../data/common-typos.json');

class ValidationService {
    
    validateRequest(body) {
        const { cart, campaigns } = body;
        if (!cart || !campaigns || !Array.isArray(cart) || !Array.isArray(campaigns)) {
            return { isValid: false, message: 'Invalid request body. "cart" and "campaigns" arrays are required.' };
        }
        if (cart.length === 0) {
            return { isValid: false, message: 'Cart cannot be empty.' };
        }
        return { isValid: true };
    }

    correctTyposInCart(cart) {
        return cart.map(item => {
            const correctedName = commonTypos[item.name] || item.name;
            return { ...item, name: correctedName };
        });
    }
}

module.exports = new ValidationService();
