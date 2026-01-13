"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drizzle_orm_1 = require("drizzle-orm");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimit_1 = require("../middleware/rateLimit");
const auth_1 = require("../middleware/auth");
const schema_1 = require("../db/schema");
const types_1 = require("../types");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/verify-sms', auth_controller_1.verifySMS);
router.post('/check-email', auth_controller_1.checkEmail);
router.post('/check-phone', auth_controller_1.checkPhone);
router.post('/forgot-password', rateLimit_1.passwordResetRateLimit, auth_controller_1.forgotPassword);
router.get('/reset-password/validate/:token', auth_controller_1.validateResetToken);
router.post('/reset-password', auth_controller_1.resetPassword);
router.get('/confirm-email/:token', auth_controller_1.confirmEmail);
// Protected routes
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        (0, types_1.assertAuthenticated)(req);
        const foundUsers = await req.db.select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            firstName: schema_1.users.firstName,
            lastName: schema_1.users.lastName,
            userType: schema_1.users.userType
        }).from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, req.user.id))
            .limit(1);
        const user = foundUsers[0];
        res.json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
