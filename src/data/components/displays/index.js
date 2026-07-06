import { lcd1602 } from './lcd1602';
import { lcd2004 } from './lcd2004';
import { oled_ssd1306 } from './oled_ssd1306';
import { tft_lcd } from './tft_lcd';
import { seven_segment } from './seven_segment';
import { led_matrix_8x8 } from './led_matrix_8x8';

export const displaysFamily = {
  id: 'displays',
  name: 'Displays',
  category: 'Displays',
  variants: [
    lcd1602,
    lcd2004,
    oled_ssd1306,
    tft_lcd,
    seven_segment,
    led_matrix_8x8
  ]
};
