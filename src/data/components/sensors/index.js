import { ultrasonicSensor } from './distance';
import { dht11, dht22, bmp280 } from './environmental';
import { pirMotionSensor, mpu6050 } from './motion';
import { mq2GasSensor } from './gas';
import { soilMoistureSensor, rainSensor } from './water';
import { rfidRc522 } from './identification';
import { gpsModule } from './navigation';
import { hallEffectSensor } from './magnetic';
import { flameSensor } from './flame';

export const sensorFamily = {
  "id": "sensor",
  "name": "Sensors",
  "category": "Sensors",
  "variants": [
    ultrasonicSensor,
    dht11,
    dht22,
    bmp280,
    pirMotionSensor,
    mpu6050,
    mq2GasSensor,
    soilMoistureSensor,
    rainSensor,
    rfidRc522,
    gpsModule,
    hallEffectSensor,
    flameSensor
  ]
};
