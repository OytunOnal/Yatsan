/**
 * Listing Controller - Backward Compatibility Wrapper
 * 
 * This file re-exports all listing controllers from the modular structure
 * for backward compatibility with existing imports.
 * 
 * @deprecated Import from './listing/index' instead
 */

export {
  // CRUD Operations
  createListing,
  getListingById,
  updateListing,
  deleteListing,
  
  // Query Operations
  getListings,
  
  // Schema Operations
  getFilterSchema,
  getListingTypes,
  getListingTypeSchema,
} from './listing/index';
