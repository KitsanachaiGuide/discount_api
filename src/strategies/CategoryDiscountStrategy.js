class CategoryDiscountStrategy {
    apply(currentPrice, categorizedCart, campaign) {
        
        // ตรวจสอบ input
        if (isNaN(currentPrice) || currentPrice < 0) {
            return currentPrice;
        }
  
        // รองรับทั้งสอง format: ใหม่และเก่า
        let targetCategory, discountPercentage;
        
        if (campaign.params) {
            // Format เก่า: campaign.params.category และ campaign.params.amount
            targetCategory = [campaign.params.category];
            discountPercentage = parseFloat(campaign.params.amount) || 0;
        } else {
            // Format ใหม่: campaign.applicable_categories และ campaign.discount_percentage
            targetCategory = campaign.applicable_categories || [campaign.category_name];
            discountPercentage = parseFloat(campaign.discount_percentage) || 0;
        }
        
        // Convert target categories to lowercase for case-insensitive comparison
        const normalizedTargetCategories = targetCategory.map(cat => cat.toLowerCase());
        
        if (!targetCategory || targetCategory.length === 0) {
            return currentPrice;
        }
  
        // คำนวณราคารวมของสินค้าในหมวดหมู่ที่ต้องการ
        let applicableAmount = 0;
        categorizedCart.forEach(item => { 
            const itemCategory = (item.category || '').toLowerCase();
            
            if (normalizedTargetCategories.includes(itemCategory)) {
                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 1;
                const itemTotal = price * quantity;
                applicableAmount += itemTotal;
            } else {
            }
        });
          
        // ถ้าไม่มีสินค้าในหมวดหมู่ที่ระบุ
        if (applicableAmount === 0) {
            return currentPrice;
        }

        // ตรวจสอบเงื่อนไขขั้นต่ำ (ถ้ามี)
        if (campaign.minimum_amount && applicableAmount < campaign.minimum_amount) {
            return currentPrice;
        }
  
        // คำนวณส่วนลด - ต้องคำนวณจาก applicableAmount ไม่ใช่ currentPrice
        const discountAmount = applicableAmount * (discountPercentage / 100);        
        // ตรวจสอบ maximum discount (ถ้ามี)
        const maxDiscount = campaign.maximum_discount ? parseFloat(campaign.maximum_discount) : null;
        const finalDiscountAmount = maxDiscount ? Math.min(discountAmount, maxDiscount) : discountAmount;
        
        // คำนวณราคาหลังหักส่วนลด
        const newPrice = currentPrice - finalDiscountAmount;
        
        // ไม่ให้ราคาติดลบ
        const finalPrice = Math.max(0, newPrice);        
        return finalPrice;
    }
}

module.exports = new CategoryDiscountStrategy();