const FuzzyMatchService = require('./FuzzyMatchService');
const productKeywords = require('../data/product-keywords.json');

class CategoryService {
    categorizeCartItems(cart) {
        return cart.map(item => {
            // ใช้ชื่อสินค้าในการค้นหาหมวดหมู่
            const bestMatch = FuzzyMatchService.findBestMatch(item.name, productKeywords);
            if (bestMatch) {
                item.category = bestMatch.category;
            } else {
                item.category = 'Uncategorized'; // หรือจัดการตามที่ต้องการ
            }
            return item;
        });
    }
}

module.exports = new CategoryService();