class Campaign {
    /**
     * @param {string} name - The descriptive name of the campaign (e.g., "15% Off Clothing").
     * @param {string} type - The identifier for the calculation logic (e.g., "category_percentage").
     * @param {string} category - The campaign's application group ("Coupon", "On Top", "Seasonal"), which determines priority. 
     * @param {object} params - The parameters needed for the discount calculation (e.g., { category: "Clothing", amount: 15 }). 
     */
    constructor(name, type, category, params) {
        this.name = name;
        this.type = type;
        this.category = category;
        this.params = params;
    }
}

module.exports = Campaign;
