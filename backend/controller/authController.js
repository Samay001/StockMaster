import {loginService,registerService} from "../service/authService.js";

export const loginController = async (username, password) => {
    try {
        const res = await loginService({ username, password });
        return res;
    }
    catch(e) {
        console.log(`error occurred in login controller: ${e.message}`);
        return {
            success: false,
            message: 'Login failed',
            error: e.message
        };
    }
}

export const registerController = async (email, username, password) => {
    try {
        // Call register service with user data
        const res = await registerService({ email, username, password });
        return res;
    }
    catch(e) {
        console.log(`error occurred in register controller: ${e.message}`);
        return {
            success: false,
            message: 'Registration failed',
            error: e.message
        };
    }
}


