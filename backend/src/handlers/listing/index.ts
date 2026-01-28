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

import ListingHandlerRegistry from './ListingHandlerRegistry';
import { YachtListingHandler } from './YachtListingHandler';
import { PartListingHandler } from './PartListingHandler';
import { MarinaListingHandler } from './MarinaListingHandler';
import { CrewListingHandler } from './CrewListingHandler';
import { EquipmentListingHandler } from './EquipmentListingHandler';
import { ServiceListingHandler } from './ServiceListingHandler';
import { StorageListingHandler } from './StorageListingHandler';
import { InsuranceListingHandler } from './InsuranceListingHandler';
import { ExpertiseListingHandler } from './ExpertiseListingHandler';
import { MarketplaceListingHandler } from './MarketplaceListingHandler';

// Get the singleton registry instance
const registry = ListingHandlerRegistry.getInstance();

// Register all listing type handlers
// Base 4 handlers
registry.register(new YachtListingHandler());
registry.register(new PartListingHandler());
registry.register(new MarinaListingHandler());
registry.register(new CrewListingHandler());

// New 6 handlers (expansion)
registry.register(new EquipmentListingHandler());
registry.register(new ServiceListingHandler());
registry.register(new StorageListingHandler());
registry.register(new InsuranceListingHandler());
registry.register(new ExpertiseListingHandler());
registry.register(new MarketplaceListingHandler());

// Export the registry and types
export { registry };
export { default as ListingHandlerRegistry } from './ListingHandlerRegistry';
export * from './IListingHandler';

// Export individual handlers (useful for testing)
export { YachtListingHandler } from './YachtListingHandler';
export { PartListingHandler } from './PartListingHandler';
export { MarinaListingHandler } from './MarinaListingHandler';
export { CrewListingHandler } from './CrewListingHandler';
export { EquipmentListingHandler } from './EquipmentListingHandler';
export { ServiceListingHandler } from './ServiceListingHandler';
export { StorageListingHandler } from './StorageListingHandler';
export { InsuranceListingHandler } from './InsuranceListingHandler';
export { ExpertiseListingHandler } from './ExpertiseListingHandler';
export { MarketplaceListingHandler } from './MarketplaceListingHandler';
