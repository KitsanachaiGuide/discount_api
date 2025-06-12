class PercentageStrategy {
  apply(currentPrice, cart, campaign) {
      // ตรวจสอบ input
      if (isNaN(currentPrice) || currentPrice < 0) {
          return currentPrice;
      }

      // รองรับทั้งสอง format
      let discountPercentage;
      
      if (campaign.params && campaign.params.percentage) {
          // Format เก่า: campaign.params.percentage
          discountPercentage = parseFloat(campaign.params.percentage) || 0;
      } else {
          // Format ใหม่: campaign.discount_percentage
          discountPercentage = parseFloat(campaign.discount_percentage) || 0;
      }

      // ตรวจสอบเงื่อนไขขั้นต่ำ (ถ้ามี)
      if (campaign.minimum_amount && currentPrice < campaign.minimum_amount) {
          return currentPrice;
      }

      // คำนวณส่วนลด
      const discountAmount = currentPrice * (discountPercentage / 100);
      
      // ตรวจสอบ maximum discount (ถ้ามี)
      const maxDiscount = campaign.maximum_discount ? parseFloat(campaign.maximum_discount) : null;
      const finalDiscountAmount = maxDiscount ? Math.min(discountAmount, maxDiscount) : discountAmount;
      
      // คำนวณราคาหลังหักส่วนลด
      const newPrice = currentPrice - finalDiscountAmount;
      
      // ไม่ให้ราคาติดลบ
      return Math.max(0, newPrice);
  }
}

module.exports = new PercentageStrategy();