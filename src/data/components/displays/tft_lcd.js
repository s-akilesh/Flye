export const tft_lcd = {
  "name": "TFT LCD Display",
  "slug": "tft_lcd",
  "category": "Displays",
  "description": "A high-resolution active matrix color liquid crystal display screen using Thin Film Transistor technology. Typically includes touch screen input capability.",
  "status": "completed",
  "measures": "Full Color Graphics",
  "outputType": "Visual Full Color",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V (Requires level converters on 5V Arduino boards)",
  "powerConsumption": "80mA typical (with backlight)",
  "mission": "Learn to draw color graphical dashboards and interactive touch layouts.",
  "prerequisites": ["voltage", "current"],
  "learningOutcomes": [
    "Manage active pixel rendering buffers on a color grid",
    "Configure high-speed SPI serial communication lines",
    "Process analog resistive touch coordinates into digital screen hits"
  ],
  "typicalValue": "2.4 inch ILI9341",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "25 min",
  "overview": {
    "displayType": "Graphic TFT",
    "controllerIC": "ILI9341",
    "communicationInterface": ["SPI", "Parallel"],
    "displayCapabilities": ["Text", "Graphics", "Images", "Touch UI", "Animation"],
    "operatingVoltage": "3.3V–5V"
  },
  "symbolSvg": `
    <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2" fill="none">
      <rect x="6" y="8" width="48" height="38" rx="2" />
      <rect x="10" y="12" width="40" height="26" rx="1" />
      <line x1="10" y1="46" x2="50" y2="46" stroke-dasharray="2 2" />
    </svg>
  `,
  "specs": [
    { "label": "Resolution", "value": "320 x 240 Pixels" },
    { "label": "Color Depth", "value": "16-bit (65k Colors)" },
    { "label": "Driver IC", "value": "ILI9341" },
    { "label": "Touch Screen", "value": "Resistive Touch Option" },
    { "label": "Interface", "value": "SPI Serial" },
    { "label": "Operating Logic", "value": "3.3V Only" }
  ],
  "parts": [
    {
      "id": "glass",
      "name": "Front Resistive Touch Panel",
      "description": "Outer glass layer embedded with resistive trace layers that detect touch touch positions.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "110px",
        "height": "65px",
        "borderRadius": "4px",
        "background": "rgba(255, 255, 255, 0.08)",
        "border": "1px solid rgba(255,255,255,0.2)",
        "assembledY": -80,
        "explodedY": -160,
        "zIndex": 4
      }
    },
    {
      "id": "tft",
      "name": "Thin Film Transistor Layer",
      "description": "Active silicon matrix grid where each pixel is controlled by an individual transistor.",
      "connectorY": 150,
      "labelSide": "right",
      "labelY": 150,
      "visual": {
        "width": "106px",
        "height": "60px",
        "borderRadius": "2px",
        "background": "linear-gradient(135deg, #4338ca, #3730a3)",
        "border": "1.5px solid #4f46e5",
        "assembledY": -80,
        "explodedY": -100,
        "zIndex": 3
      }
    },
    {
      "id": "filters",
      "name": "RGB Color Filter Array",
      "description": "Microscopic red, green, and blue optical filters that color the backlight illumination.",
      "connectorY": 210,
      "labelSide": "left",
      "labelY": 210,
      "visual": {
        "width": "106px",
        "height": "60px",
        "background": "repeating-linear-gradient(45deg, rgba(239,68,68,0.2), rgba(239,68,68,0.2) 10px, rgba(16,185,129,0.2) 10px, rgba(16,185,129,0.2) 20px, rgba(59,130,246,0.2) 20px, rgba(59,130,246,0.2) 30px)",
        "assembledY": -50,
        "explodedY": -40,
        "zIndex": 2
      }
    },
    {
      "id": "pcb",
      "name": "Controller Board PCB",
      "description": "FR4 board containing ILI9341 controller chip, logic level shifter circuits, and an SD card reader slot.",
      "connectorY": 270,
      "labelSide": "right",
      "labelY": 270,
      "visual": {
        "width": "120px",
        "height": "80px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e293b, #0f172a)",
        "border": "1.5px solid #475569",
        "assembledY": 30,
        "explodedY": 35,
        "zIndex": 1
      }
    },
    {
      "id": "backlight",
      "name": "LED Backlight Panel",
      "description": "High-brightness white LEDs that illuminate the liquid crystal stack from the bottom.",
      "connectorY": 330,
      "labelSide": "left",
      "labelY": 330,
      "visual": {
        "width": "106px",
        "height": "60px",
        "background": "rgba(255, 255, 255, 0.65)",
        "border": "1px dashed rgba(255,255,255,0.4)",
        "assembledY": -20,
        "explodedY": 95,
        "zIndex": 0
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Display power supply pin." },
      { "name": "GND", "direction": "Power Ground", "voltage": "0V", "description": "System common ground." },
      { "name": "CS", "direction": "SPI Select", "voltage": "3.3V", "description": "TFT Chip Select line (active low)." },
      { "name": "RESET", "direction": "Digital Input", "voltage": "3.3V", "description": "TFT reset pin (pull low to reset display)." },
      { "name": "DC/RS", "direction": "Digital Input", "voltage": "3.3V", "description": "Data/Command selection line (High = Data, Low = Command)." },
      { "name": "SDI/MOSI", "direction": "SPI Data Input", "voltage": "3.3V", "description": "Master Out Slave In data line." },
      { "name": "SCK", "direction": "SPI Clock", "voltage": "3.3V", "description": "Serial Clock input line." },
      { "name": "LED", "direction": "Backlight Power", "voltage": "3.3V - 5V", "description": "LED Backlight supply pin (requires series resistor)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A high-resolution colored liquid crystal display.",
    "whyNeeded": "Outputs advanced colored icons, real-time gauges, and buttons with interactive touchscreen layouts.",
    "howItWorks": "Backlight shines through the display stack. Polarizers and liquid crystals control the quantity of light that passes through. Sub-pixels containing red, green, and blue color filters color this light. Active Thin Film Transistors at each pixel ensure fast refresh rates to draw colored animations and menus.",
    "svgDiagram": `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <rect x="5" y="15" width="90" height="70" fill="#1e293b" rx="4" />
        <rect x="10" y="20" width="80" height="50" fill="#2563eb" rx="2" />
        <circle cx="50" cy="45" r="15" fill="none" stroke="#fbbf24" stroke-width="4" />
        <line x1="50" y1="45" x2="50" y2="35" stroke="#fbbf24" stroke-width="2.5" />
      </svg>
    `
  },
  "circuitSymbol": {
    "meaning": "SPI connector interface block representing SPI and power pins.",
    "usage": "Use logic level converter ICs (like HEF4050) when linking 3.3V TFT pins with a 5V Arduino."
  },
  "advantages": [
    "Supports full color profiles (up to 65,000 colors)",
    "Resistive touch layer enables clean button UI menus",
    "High refresh speed allowing smooth chart updates"
  ],
  "limitations": [
    "Logic lines operate strictly at 3.3V; 5V signals will damage the ILI9341 chip",
    "High pin count required (at least 5 control pins for SPI)",
    "Consumes significant current due to the color backlight panel"
  ],
  "engineeringTips": [
    "Always check if your TFT board has a built-in 3.3V regulator; even if the VCC accepts 5V, control pins like CS, SCK, and MOSI must be restricted to 3.3V.",
    "Use hardware SPI pins (D13/D11 on Uno) rather than software bit-bang pins to achieve maximum speed redraw rates."
  ],
  "commonMistakes": [
    {
      "question": "Display shows a solid white screen on startup",
      "answer": "This shows the backlight is on but the controller IC is not initializing. Verify SCLK, MOSI, and Reset connection lanes are level-shifted."
    }
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹450 - ₹650",
    "availability": "High",
    "recommendedAccessories": ["CD4050 Level Shifter", "Stylus Pen", "SD Card"]
  },
  "bestFor": ["Color dashboards", "Mini graphical terminals", "Touch keyboard panels"],
  "notRecommendedFor": ["Ultra low power smart tags", "Simple binary indicator setups", "Direct direct sun viewing"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 3.5 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 }
  ],
  "compatibleComponents": ["potentiometer", "dht11", "ultrasonic-sensor"],
  "nextLearningPath": ["esp32-devkit"],
  "commonProjects": ["Embedded Home Climate Terminal", "Touch Drawing Canvas Pad", "Mini Photo Album Slideshow Viewer"],
  "comparisonSensors": [],
  "comparisonSpecs": {},
  "quiz": [
    {
      "question": "What logic voltage do the control lines of the ILI9341 TFT display expect?",
      "options": ["1.2V", "3.3V", "5V", "12V"],
      "answer": 1,
      "explanation": "The ILI9341 runs strictly on 3.3V logic. Connecting directly to 5V Arduino pins without level shifters will burn out the chip."
    },
    {
      "question": "Which interface protocol is typically used to drive high-resolution TFT screens?",
      "options": ["Analog", "SPI Serial", "OneWire", "I²C"],
      "answer": 1,
      "explanation": "SPI Serial is commonly used due to its high clock speeds, which are required to transmit large color buffer sizes."
    }
  ],
  "buildChallenge": {
    "objective": "Build a color touch button control panel that turns an LED on and off via touch screen presses.",
    "estimatedTime": "25 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "TFT LCD (ILI9341)", "slug": "tft_lcd" },
      { "name": "ESP32 Board", "slug": "esp32-devkit" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "CD4050 Level Shifter", "slug": "fixed-resistor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect TFT VCC and LED backlight to ESP32 3.3V pin. Connect GND to GND.",
        "expectedResult": "TFT backlight glows white."
      },
      {
        "stepNum": 2,
        "text": "Connect TFT SCK, MOSI, CS, D/C, and RST to ESP32 hardware SPI pins (GPIO 18, 23, 5, 2, 4).",
        "expectedResult": "Data line links active."
      },
      {
        "stepNum": 3,
        "text": "Connect Touch SPI pins (T_CLK, T_CS, T_DIN, T_DOUT, T_IRQ) to the secondary hardware SPI lines.",
        "expectedResult": "Touch inputs mapped."
      },
      {
        "stepNum": 4,
        "text": "Connect an LED through a current-limiting resistor to ESP32 Pin 27.",
        "expectedResult": "Indicator ready."
      }
    ],
    "expectedOutput": "The TFT display draws a red button labeled 'OFF'. Tapping the button switches it to green and turns on the physical LED.",
    "troubleshooting": [
      {
        "symptom": "Touch coordinates are inverted or completely incorrect",
        "causes": ["Touch screen calibration coefficients missing in code"],
        "fixSteps": ["Run a calibration sketch to fetch the X/Y min/max touch boundaries, and map coordinates in code."]
      }
    ],
    "experiments": [
      {
        "title": "Color palette drawer",
        "description": "Create three color circles (Red, Green, Blue) at the top of the display and draw pixels matching the touched color."
      }
    ],
    "verificationChecklist": [
      "Adafruit_ILI9341 library is imported",
      "Touch screen coordinates are mapped using map() logic"
    ],
    "reflectionQuestions": [
      "Why is resistive touch slower than capacitive?",
      "Why does a color display require more memory than an OLED?"
    ],
    "relatedProjects": ["Smart Home Thermostat Interface", "Keypad Access Panel"],
    "xpReward": 100,
    "badge": "Color Alchemist Badge"
  }
};
