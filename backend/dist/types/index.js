"use strict";
/**
 * Global Type Definitions
 *
 * This file contains shared type definitions for the Express app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
exports.assertAuthenticated = assertAuthenticated;
// ============================================
// TYPE GUARDS
// ============================================
/**
 * Type guard to check if req.user is defined
 * Use this in protected routes after auth middleware
 */
function isAuthenticated(req) {
    return req.user !== undefined;
}
/**
 * Assert that req.user is defined
 * Throws an error if user is not authenticated
 */
function assertAuthenticated(req) {
    if (!req.user) {
        throw new Error('User not authenticated');
    }
}
