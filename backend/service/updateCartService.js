import StockMasterUser from '../model/userModel.js';

export const updateUserCart = async (username, items) => {
  try {
    const user = await StockMasterUser.findOne({ username });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Rebuild cart based on items array
    const newCart = {};
    for (const item of items) {
      newCart[item.id] = {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        productLink: item.productLink
      };
    }

    user.cart = newCart;
    user.updatedAt = new Date();
    await user.save();

    return {
      success: true,
      message: 'Cart updated successfully',
      cart: user.cart
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update cart',
      error: error.message
    };
  }
};
