import { resistorFamily } from './passive/resistor';
import { capacitorFamily } from './passive/capacitor';
import { ledFamily } from './semiconductors/led';
import { inductorFamily } from './passive/inductor';
import { diodeFamily } from './semiconductors/diode';
import { transistorFamily } from './semiconductors/transistor';
import { specialSemiconductorFamily } from './semiconductors/special';

export const families = [
  capacitorFamily,
  resistorFamily,
  ledFamily,
  inductorFamily,
  diodeFamily,
  transistorFamily,
  specialSemiconductorFamily
];
