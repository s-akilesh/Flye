import { resistorFamily } from './passive/resistor';
import { capacitorFamily } from './passive/capacitor';
import { ledFamily } from './semiconductors/led';
import { inductorFamily } from './passive/inductor';
import { diodeFamily } from './semiconductors/diode';
import { transistorFamily } from './semiconductors/transistor';
import { powerSwitchingFamily } from './semiconductors/power-switching';
import { boardFamily } from './boards/index';
import { sensorFamily } from './sensors/index';
import { displaysFamily } from './displays/index';

export const families = [
  capacitorFamily,
  resistorFamily,
  ledFamily,
  inductorFamily,
  diodeFamily,
  transistorFamily,
  powerSwitchingFamily,
  boardFamily,
  sensorFamily,
  displaysFamily
];
