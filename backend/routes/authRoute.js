import express from 'express';
import { loginController, registerController } from '../controller/authController.js';
import {updateCartController} from '../controller/updateCartController.js'

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginController(username, password);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const result = await registerController(email, username, password);
    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

router.put("/update-cart", async (req, res) => {
  try {
    const { username, items } = req.body;
    const result = await updateCartController(username, items);

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during cart update',
      error: error.message
    });
  }
});


export default router