"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CATEGORIES = exports.ekspertiz = exports.sigorta = exports.panayir = exports.transferVeMurettebat = exports.karaParkVeKislama = exports.marinaVeLimanlar = exports.yedekParca = exports.teknikServisler = exports.denizAraciEkipmanlari = exports.denizAraclari = exports.createSlug = exports.MOTOR_BRANDS = exports.BOAT_BRANDS = void 0;
// Tüm kategori modüllerini dışa aktar
var brands_1 = require("./brands");
Object.defineProperty(exports, "BOAT_BRANDS", { enumerable: true, get: function () { return brands_1.BOAT_BRANDS; } });
Object.defineProperty(exports, "MOTOR_BRANDS", { enumerable: true, get: function () { return brands_1.MOTOR_BRANDS; } });
var types_1 = require("./types");
Object.defineProperty(exports, "createSlug", { enumerable: true, get: function () { return types_1.createSlug; } });
var denizAraclari_1 = require("./denizAraclari");
Object.defineProperty(exports, "denizAraclari", { enumerable: true, get: function () { return denizAraclari_1.denizAraclari; } });
var denizAraciEkipmanlari_1 = require("./denizAraciEkipmanlari");
Object.defineProperty(exports, "denizAraciEkipmanlari", { enumerable: true, get: function () { return denizAraciEkipmanlari_1.denizAraciEkipmanlari; } });
var teknikServisler_1 = require("./teknikServisler");
Object.defineProperty(exports, "teknikServisler", { enumerable: true, get: function () { return teknikServisler_1.teknikServisler; } });
var yedekParca_1 = require("./yedekParca");
Object.defineProperty(exports, "yedekParca", { enumerable: true, get: function () { return yedekParca_1.yedekParca; } });
var marinaVeLimanlar_1 = require("./marinaVeLimanlar");
Object.defineProperty(exports, "marinaVeLimanlar", { enumerable: true, get: function () { return marinaVeLimanlar_1.marinaVeLimanlar; } });
var karaParkVeKislama_1 = require("./karaParkVeKislama");
Object.defineProperty(exports, "karaParkVeKislama", { enumerable: true, get: function () { return karaParkVeKislama_1.karaParkVeKislama; } });
var transferVeMurettebat_1 = require("./transferVeMurettebat");
Object.defineProperty(exports, "transferVeMurettebat", { enumerable: true, get: function () { return transferVeMurettebat_1.transferVeMurettebat; } });
var panayir_1 = require("./panayir");
Object.defineProperty(exports, "panayir", { enumerable: true, get: function () { return panayir_1.panayir; } });
var sigorta_1 = require("./sigorta");
Object.defineProperty(exports, "sigorta", { enumerable: true, get: function () { return sigorta_1.sigorta; } });
var ekspertiz_1 = require("./ekspertiz");
Object.defineProperty(exports, "ekspertiz", { enumerable: true, get: function () { return ekspertiz_1.ekspertiz; } });
// Tüm kategorileri bir array olarak dışa aktar
const denizAraclari_2 = require("./denizAraclari");
const denizAraciEkipmanlari_2 = require("./denizAraciEkipmanlari");
const teknikServisler_2 = require("./teknikServisler");
const yedekParca_2 = require("./yedekParca");
const marinaVeLimanlar_2 = require("./marinaVeLimanlar");
const karaParkVeKislama_2 = require("./karaParkVeKislama");
const transferVeMurettebat_2 = require("./transferVeMurettebat");
const panayir_2 = require("./panayir");
const sigorta_2 = require("./sigorta");
const ekspertiz_2 = require("./ekspertiz");
exports.ALL_CATEGORIES = [
    denizAraclari_2.denizAraclari,
    denizAraciEkipmanlari_2.denizAraciEkipmanlari,
    teknikServisler_2.teknikServisler,
    yedekParca_2.yedekParca,
    marinaVeLimanlar_2.marinaVeLimanlar,
    karaParkVeKislama_2.karaParkVeKislama,
    transferVeMurettebat_2.transferVeMurettebat,
    panayir_2.panayir,
    sigorta_2.sigorta,
    ekspertiz_2.ekspertiz,
];
