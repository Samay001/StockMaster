import { updateUserCart } from '../service/updateCartService.js';

export const updateCartController = async (username, items) => {
  try {
    const result = await updateUserCart(username, items);
    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Error in cart controller',
      error: error.message
    };
  }
};
