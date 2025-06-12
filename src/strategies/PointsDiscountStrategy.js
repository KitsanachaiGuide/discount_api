class PointsDiscountStrategy {
  apply(currentPrice, cart, campaign) {
      // ตรวจสอบ input
      if (isNaN(currentPrice) || currentPrice < 0) {
          return currentPrice;
      }

      // รองรับทั้งสอง format
      let customerPoints;
      
      if (campaign.params && campaign.params.customerPoints) {
          // Format เก่า: campaign.params.customerPoints
          customerPoints = parseInt(campaign.params.customerPoints) || 0;
      } else {
          // Format ใหม่: campaign.points_used
          customerPoints = parseInt(campaign.points_used) || 0;
      }

      // ตรวจสอบเงื่อนไขขั้นต่ำ (ถ้ามี)
      if (campaign.minimum_amount && currentPrice < campaign.minimum_amount) {
          return currentPrice;
      }

      // คำนวณส่วนลดจากคะแนน (1 point = 1 THB)
      const discountFromPoints = customerPoints;
      
      // จำกัดส่วนลดไม่เกิน 20% ของราคารวม
      const maxDiscount = currentPrice * 0.20;
      
      // เปรียบเทียบกับ maximum discount ที่กำหนดไว้ (ถ้ามี)
      const campaignMaxDiscount = campaign.maximum_discount ? parseFloat(campaign.maximum_discount) : null;
      const finalMaxDiscount = campaignMaxDiscount ? Math.min(maxDiscount, campaignMaxDiscount) : maxDiscount;
      
      const finalDiscountAmount = Math.min(discountFromPoints, finalMaxDiscount);
      
      // คำนวณราคาหลังหักส่วนลด
      const newPrice = currentPrice - finalDiscountAmount;
      
      // ไม่ให้ราคาติดลบ
      return Math.max(0, newPrice);
  }
}

module.exports = new PointsDiscountStrategy();