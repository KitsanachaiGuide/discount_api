class CartItem {
    constructor(name, price, quantity = 1) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.category = null; // จะถูกเติมโดย CategoryService
    }
}

module.exports = CartItem;