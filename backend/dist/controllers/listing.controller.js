"use strict";
/**
 * Listing Controller - Backward Compatibility Wrapper
 *
 * This file re-exports all listing controllers from the modular structure
 * for backward compatibility with existing imports.
 *
 * @deprecated Import from './listing/index' instead
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingTypeSchema = exports.getListingTypes = exports.getFilterSchema = exports.getListings = exports.deleteListing = exports.updateListing = exports.getListingById = exports.createListing = void 0;
var index_1 = require("./listing/index");
// CRUD Operations
Object.defineProperty(exports, "createListing", { enumerable: true, get: function () { return index_1.createListing; } });
Object.defineProperty(exports, "getListingById", { enumerable: true, get: function () { return index_1.getListingById; } });
Object.defineProperty(exports, "updateListing", { enumerable: true, get: function () { return index_1.updateListing; } });
Object.defineProperty(exports, "deleteListing", { enumerable: true, get: function () { return index_1.deleteListing; } });
// Query Operations
Object.defineProperty(exports, "getListings", { enumerable: true, get: function () { return index_1.getListings; } });
// Schema Operations
Object.defineProperty(exports, "getFilterSchema", { enumerable: true, get: function () { return index_1.getFilterSchema; } });
Object.defineProperty(exports, "getListingTypes", { enumerable: true, get: function () { return index_1.getListingTypes; } });
Object.defineProperty(exports, "getListingTypeSchema", { enumerable: true, get: function () { return index_1.getListingTypeSchema; } });
