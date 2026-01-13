import { IListingHandler, ListingTypeSchema } from './IListingHandler';

/**
 * ListingHandlerRegistry
 * 
 * Singleton registry for managing listing type handlers.
 * New listing types can be registered without modifying the controller.
 */
class ListingHandlerRegistry {
  private static instance: ListingHandlerRegistry;
  private handlers: Map<string, IListingHandler> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance of the registry
   */
  static getInstance(): ListingHandlerRegistry {
    if (!ListingHandlerRegistry.instance) {
      ListingHandlerRegistry.instance = new ListingHandlerRegistry();
    }
    return ListingHandlerRegistry.instance;
  }

  /**
   * Register a new listing handler
   * @throws Error if a handler with the same type is already registered
   */
  register(handler: IListingHandler): void {
    if (this.handlers.has(handler.type)) {
      throw new Error(`Handler for listing type '${handler.type}' is already registered`);
    }
    this.handlers.set(handler.type, handler);
  }

  /**
   * Unregister a listing handler
   */
  unregister(type: string): boolean {
    return this.handlers.delete(type);
  }

  /**
   * Get a handler by listing type
   * @throws Error if no handler is registered for the given type
   */
  getHandler(type: string): IListingHandler {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new Error(`No handler registered for listing type: ${type}`);
    }
    return handler;
  }

  /**
   * Get a handler by listing type (safe version, returns null if not found)
   */
  getHandlerSafe(type: string): IListingHandler | null {
    return this.handlers.get(type) || null;
  }

  /**
   * Get all registered handlers
   */
  getAllHandlers(): IListingHandler[] {
    return Array.from(this.handlers.values());
  }

  /**
   * Get all registered listing type names
   */
  getAllTypes(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Get all listing type schemas (for frontend form generation)
   */
  getAllSchemas(): ListingTypeSchema[] {
    return this.getAllHandlers().map(h => h.getSchema());
  }

  /**
   * Check if a handler is registered for the given type
   */
  hasType(type: string): boolean {
    return this.handlers.has(type);
  }

  /**
   * Get the count of registered handlers
   */
  getHandlerCount(): number {
    return this.handlers.size;
  }

  /**
   * Clear all registered handlers (useful for testing)
   */
  clear(): void {
    this.handlers.clear();
  }
}

export default ListingHandlerRegistry;
