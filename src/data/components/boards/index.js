import { arduinoUno } from './arduino-uno';
import { arduinoNano } from './arduino-nano';
import { esp8266Nodemcu } from './esp8266-nodemcu';
import { esp32Devkit } from './esp32-devkit';
import { raspberryPiPico } from './raspberry-pi-pico';

export const boardFamily = {
  "id": "board",
  "name": "Development Boards",
  "category": "Development Boards",
  "variants": [
    arduinoUno,
    arduinoNano,
    esp8266Nodemcu,
    esp32Devkit,
    raspberryPiPico
  ]
};
