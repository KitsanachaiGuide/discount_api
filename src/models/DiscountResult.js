class DiscountResult {
    constructor(initialPrice, finalPrice, appliedCampaigns = []) {
        this.initialPrice = initialPrice;
        this.finalPrice = finalPrice;
        this.totalDiscount = initialPrice - finalPrice;
        this.appliedCampaigns = appliedCampaigns;
    }
}

module.exports = DiscountResult;