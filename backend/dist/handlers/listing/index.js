"use strict";
/**
 * Listing Handlers Module
 *
 * This module exports all listing type handlers and the registry.
 * New listing types can be added by:
 * 1. Creating a new handler class implementing IListingHandler
 * 2. Importing and registering it in this file
 *
 * No changes needed in the controller!
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceListingHandler = exports.ExpertiseListingHandler = exports.InsuranceListingHandler = exports.StorageListingHandler = exports.ServiceListingHandler = exports.EquipmentListingHandler = exports.CrewListingHandler = exports.MarinaListingHandler = exports.PartListingHandler = exports.YachtListingHandler = exports.ListingHandlerRegistry = exports.registry = void 0;
const ListingHandlerRegistry_1 = __importDefault(require("./ListingHandlerRegistry"));
const YachtListingHandler_1 = require("./YachtListingHandler");
const PartListingHandler_1 = require("./PartListingHandler");
const MarinaListingHandler_1 = require("./MarinaListingHandler");
const CrewListingHandler_1 = require("./CrewListingHandler");
const EquipmentListingHandler_1 = require("./EquipmentListingHandler");
const ServiceListingHandler_1 = require("./ServiceListingHandler");
const StorageListingHandler_1 = require("./StorageListingHandler");
const InsuranceListingHandler_1 = require("./InsuranceListingHandler");
const ExpertiseListingHandler_1 = require("./ExpertiseListingHandler");
const MarketplaceListingHandler_1 = require("./MarketplaceListingHandler");
// Get the singleton registry instance
const registry = ListingHandlerRegistry_1.default.getInstance();
exports.registry = registry;
// Register all listing type handlers
// Base 4 handlers
registry.register(new YachtListingHandler_1.YachtListingHandler());
registry.register(new PartListingHandler_1.PartListingHandler());
registry.register(new MarinaListingHandler_1.MarinaListingHandler());
registry.register(new CrewListingHandler_1.CrewListingHandler());
// New 6 handlers (expansion)
registry.register(new EquipmentListingHandler_1.EquipmentListingHandler());
registry.register(new ServiceListingHandler_1.ServiceListingHandler());
registry.register(new StorageListingHandler_1.StorageListingHandler());
registry.register(new InsuranceListingHandler_1.InsuranceListingHandler());
registry.register(new ExpertiseListingHandler_1.ExpertiseListingHandler());
registry.register(new MarketplaceListingHandler_1.MarketplaceListingHandler());
var ListingHandlerRegistry_2 = require("./ListingHandlerRegistry");
Object.defineProperty(exports, "ListingHandlerRegistry", { enumerable: true, get: function () { return __importDefault(ListingHandlerRegistry_2).default; } });
__exportStar(require("./IListingHandler"), exports);
// Export individual handlers (useful for testing)
var YachtListingHandler_2 = require("./YachtListingHandler");
Object.defineProperty(exports, "YachtListingHandler", { enumerable: true, get: function () { return YachtListingHandler_2.YachtListingHandler; } });
var PartListingHandler_2 = require("./PartListingHandler");
Object.defineProperty(exports, "PartListingHandler", { enumerable: true, get: function () { return PartListingHandler_2.PartListingHandler; } });
var MarinaListingHandler_2 = require("./MarinaListingHandler");
Object.defineProperty(exports, "MarinaListingHandler", { enumerable: true, get: function () { return MarinaListingHandler_2.MarinaListingHandler; } });
var CrewListingHandler_2 = require("./CrewListingHandler");
Object.defineProperty(exports, "CrewListingHandler", { enumerable: true, get: function () { return CrewListingHandler_2.CrewListingHandler; } });
var EquipmentListingHandler_2 = require("./EquipmentListingHandler");
Object.defineProperty(exports, "EquipmentListingHandler", { enumerable: true, get: function () { return EquipmentListingHandler_2.EquipmentListingHandler; } });
var ServiceListingHandler_2 = require("./ServiceListingHandler");
Object.defineProperty(exports, "ServiceListingHandler", { enumerable: true, get: function () { return ServiceListingHandler_2.ServiceListingHandler; } });
var StorageListingHandler_2 = require("./StorageListingHandler");
Object.defineProperty(exports, "StorageListingHandler", { enumerable: true, get: function () { return StorageListingHandler_2.StorageListingHandler; } });
var InsuranceListingHandler_2 = require("./InsuranceListingHandler");
Object.defineProperty(exports, "InsuranceListingHandler", { enumerable: true, get: function () { return InsuranceListingHandler_2.InsuranceListingHandler; } });
var ExpertiseListingHandler_2 = require("./ExpertiseListingHandler");
Object.defineProperty(exports, "ExpertiseListingHandler", { enumerable: true, get: function () { return ExpertiseListingHandler_2.ExpertiseListingHandler; } });
var MarketplaceListingHandler_2 = require("./MarketplaceListingHandler");
Object.defineProperty(exports, "MarketplaceListingHandler", { enumerable: true, get: function () { return MarketplaceListingHandler_2.MarketplaceListingHandler; } });
