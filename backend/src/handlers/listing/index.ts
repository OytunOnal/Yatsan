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

// Get the singleton registry instance
const registry = ListingHandlerRegistry.getInstance();

// Register all listing type handlers
registry.register(new YachtListingHandler());
registry.register(new PartListingHandler());
registry.register(new MarinaListingHandler());
registry.register(new CrewListingHandler());

// Export the registry and types
export { registry };
export { default as ListingHandlerRegistry } from './ListingHandlerRegistry';
export * from './IListingHandler';

// Export individual handlers (useful for testing)
export { YachtListingHandler } from './YachtListingHandler';
export { PartListingHandler } from './PartListingHandler';
export { MarinaListingHandler } from './MarinaListingHandler';
export { CrewListingHandler } from './CrewListingHandler';
