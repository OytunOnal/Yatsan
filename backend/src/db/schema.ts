// ============================================
// BACKWARD COMPATIBILITY WRAPPER
// ============================================
// Bu dosya eski importları desteklemek için yeni modüler yapıyı re-export eder.
// Yeni kodlar doğrudan modüler dosyaları import etmelidir:
// import { users, listings } from '../db/schema';  // OK - backward compatible
// import { users } from '../db/schema/core/users.schema';  // Tercih edilen
// ============================================

export * from './schema/index';
