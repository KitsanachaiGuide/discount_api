class SeasonalDiscountStrategy {
    apply(currentPrice, cart, campaign) {
        // ตรวจสอบ input
        if (isNaN(currentPrice) || currentPrice < 0) {
            return currentPrice;
        }
  
        // รองรับทั้งสอง format
        if (campaign.params && campaign.params.everyXTHB && campaign.params.discountYTHB) {
            // Format เก่า: everyXTHB และ discountYTHB
            const { everyXTHB, discountYTHB } = campaign.params;
            
            if (everyXTHB <= 0) {
                return currentPrice;
            }
            
            const discountMultiplier = Math.floor(currentPrice / everyXTHB);
            const totalDiscount = discountMultiplier * discountYTHB;
            
            return Math.max(0, currentPrice - totalDiscount);
        } else {
            // Format ใหม่: percentage-based discount
            // ตรวจสอบว่าแคมเปญยังใช้ได้อยู่หรือไม่
            if (campaign.start_date && campaign.end_date) {
                const now = new Date();
                const startDate = new Date(campaign.start_date);
                const endDate = new Date(campaign.end_date);
                
                if (now < startDate || now > endDate) {
                    return currentPrice; // แคมเปญหมดอายุหรือยังไม่เริ่ม
                }
            }
  
            const discountPercentage = parseFloat(campaign.discount_percentage) || 0;
            
            // ตรวจสอบเงื่อนไขขั้นต่ำ (ถ้ามี)
            if (campaign.minimum_amount && currentPrice < campaign.minimum_amount) {
                return currentPrice;
            }
  
            // ตรวจสอบว่าเป็นการลดราคาแบบ category หรือ overall
            let applicableAmount = currentPrice; // เริ่มต้นด้วย currentPrice
            
            if (campaign.applicable_categories && Array.isArray(campaign.applicable_categories) && campaign.applicable_categories.length > 0) {
                // ลดเฉพาะหมวดหมู่ที่กำหนด (เฉพาะเมื่อมีการระบุหมวดหมู่)
                applicableAmount = 0;
                cart.forEach(item => {
                    if (campaign.applicable_categories.includes(item.category)) {
                        const price = parseFloat(item.price) || 0;
                        const quantity = parseInt(item.quantity) || 1;
                        applicableAmount += price * quantity;
                    }
                });
            }
  
            // คำนวณส่วนลด
            const discountAmount = applicableAmount * (discountPercentage / 100);
            
            // ตรวจสอบ maximum discount (ถ้ามี)
            const maxDiscount = campaign.maximum_discount ? parseFloat(campaign.maximum_discount) : null;
            const finalDiscountAmount = maxDiscount ? Math.min(discountAmount, maxDiscount) : discountAmount;
            
            // คำนวณราคาหลังหักส่วนลด
            const newPrice = currentPrice - finalDiscountAmount;
            
            // ไม่ให้ราคาติดลบ
            return Math.max(0, newPrice);
        }
    }
  }
  
  module.exports = new SeasonalDiscountStrategy();