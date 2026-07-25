// Tüm kategori modüllerini dışa aktar
export { BOAT_BRANDS, MOTOR_BRANDS } from './brands';
export { CategoryNode, createSlug } from './types';
export { denizAraclari } from './denizAraclari';
export { denizAraciEkipmanlari } from './denizAraciEkipmanlari';
export { teknikServisler } from './teknikServisler';
export { yedekParca } from './yedekParca';
export { marinaVeLimanlar } from './marinaVeLimanlar';
export { karaParkVeKislama } from './karaParkVeKislama';
export { transferVeMurettebat } from './transferVeMurettebat';
export { panayir } from './panayir';
export { sigorta } from './sigorta';
export { ekspertiz } from './ekspertiz';

// Tüm kategorileri bir array olarak dışa aktar
import { denizAraclari } from './denizAraclari';
import { denizAraciEkipmanlari } from './denizAraciEkipmanlari';
import { teknikServisler } from './teknikServisler';
import { yedekParca } from './yedekParca';
import { marinaVeLimanlar } from './marinaVeLimanlar';
import { karaParkVeKislama } from './karaParkVeKislama';
import { transferVeMurettebat } from './transferVeMurettebat';
import { panayir } from './panayir';
import { sigorta } from './sigorta';
import { ekspertiz } from './ekspertiz';
import type { CategoryNode } from './types';

export const ALL_CATEGORIES: CategoryNode[] = [
  denizAraclari,
  denizAraciEkipmanlari,
  teknikServisler,
  yedekParca,
  marinaVeLimanlar,
  karaParkVeKislama,
  transferVeMurettebat,
  panayir,
  sigorta,
  ekspertiz,
];
