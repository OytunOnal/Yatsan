"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
// CUID oluşturma fonksiyonu
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
exports.generateId = generateId;
