export const lcd1602 = {
  "name": "16x2 Character LCD",
  "slug": "lcd1602",
  "category": "Displays",
  "description": "A character liquid crystal display module capable of showing 16 characters per row across 2 rows. Widely used for simple alphanumeric text outputs in projects.",
  "status": "completed",
  "measures": "Alphanumeric Text",
  "outputType": "Visual Text",
  "operatingVoltage": "5V",
  "logicLevel": "5V (Requires level shifting or 5V tolerant pins on 3.3V boards)",
  "powerConsumption": "120mA (with backlight)",
  "mission": "Learn to display dynamic text messages and sensor readings visually.",
  "prerequisites": ["voltage", "current"],
  "learningOutcomes": [
    "Interface HD44780 controller protocols via parallel pin logic",
    "Configure custom characters and symbols inside LCD RAM",
    "Adjust display contrast using analog voltage adjustment inputs"
  ],
  "typicalValue": "1602A",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "15 min",
  "overview": {
    "displayType": "Character LCD",
    "controllerIC": "HD44780",
    "communicationInterface": ["Parallel", "I²C (with backpack)"],
    "displayCapabilities": ["Text", "Numbers", "Custom Characters"],
    "operatingVoltage": "5V"
  },
  "symbolSvg": `
    <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2" fill="none">
      <rect x="5" y="15" width="50" height="30" rx="3" />
      <rect x="9" y="19" width="42" height="14" rx="1" />
      <line x1="9" y1="38" x2="51" y2="38" stroke-dasharray="2 2" />
      <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      <circle cx="52" cy="10" r="1.5" fill="currentColor" />
    </svg>
  `,
  "specs": [
    { "label": "Display Capacity", "value": "16 x 2 Characters" },
    { "label": "Character Size", "value": "2.95 x 4.35 mm" },
    { "label": "Controller", "value": "HD44780 / KS0066" },
    { "label": "Operating Voltage", "value": "4.7V - 5.3V" },
    { "label": "Backlight Color", "value": "Yellow-Green or Blue" },
    { "label": "Interface", "value": "4-bit / 8-bit Parallel" }
  ],
  "parts": [
    {
      "id": "screen",
      "name": "LCD Glass Panel",
      "description": "The liquid crystal pane containing character matrix grids.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "110px",
        "height": "32px",
        "borderRadius": "2px",
        "background": "linear-gradient(135deg, #1e40af, #1d4ed8)",
        "border": "1.5px solid #2563eb",
        "assembledY": -80,
        "explodedY": -160,
        "zIndex": 4
      }
    },
    {
      "id": "backlight",
      "name": "LED Backlight Unit",
      "description": "An LED diffuser board that lights up the screen from behind.",
      "connectorY": 150,
      "labelSide": "right",
      "labelY": 150,
      "visual": {
        "width": "110px",
        "height": "32px",
        "borderRadius": "2px",
        "background": "rgba(96, 165, 250, 0.4)",
        "border": "1px dashed rgba(255,255,255,0.2)",
        "assembledY": -80,
        "explodedY": -100,
        "zIndex": 3
      }
    },
    {
      "id": "controller",
      "name": "HD44780 Driver IC",
      "description": "The microcontroller chip driving row/column character matrices.",
      "connectorY": 210,
      "labelSide": "left",
      "labelY": 210,
      "visual": {
        "width": "24px",
        "height": "24px",
        "borderRadius": "50%",
        "background": "#000000",
        "border": "1px solid #111",
        "assembledY": 10,
        "explodedY": -30,
        "zIndex": 2
      }
    },
    {
      "id": "pcb",
      "name": "Main Carrier PCB",
      "description": "FR4 board containing contrast logic and header routing lines.",
      "connectorY": 270,
      "labelSide": "right",
      "labelY": 270,
      "visual": {
        "width": "130px",
        "height": "65px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #065f46, #064e3b)",
        "border": "1.5px solid #047857",
        "assembledY": 45,
        "explodedY": 30,
        "zIndex": 1
      }
    },
    {
      "id": "pins",
      "name": "16-pin Header Strip",
      "description": "Power, control, and data pins connecting the display.",
      "connectorY": 330,
      "labelSide": "left",
      "labelY": 330,
      "visual": {
        "width": "100px",
        "height": "10px",
        "background": "repeating-linear-gradient(90deg, #fbbf24, #fbbf24 4px, #1e293b 4px, #1e293b 8px)",
        "assembledY": 85,
        "explodedY": 95,
        "zIndex": 0
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "VSS", "direction": "Power Ground", "voltage": "0V", "description": "Ground negative power supply terminal." },
      { "name": "VDD", "direction": "Power Input", "voltage": "5V", "description": "Positive power supply terminal." },
      { "name": "VO", "direction": "Contrast Input", "voltage": "0V - 5V", "description": "Liquid crystal contrast adjust input pin (controlled via pot)." },
      { "name": "RS", "direction": "Digital Input", "voltage": "5V max", "description": "Register Select pin (High = Data, Low = Instruction)." },
      { "name": "RW", "direction": "Digital Input", "voltage": "5V max", "description": "Read/Write Select (High = Read, Low = Write)." },
      { "name": "E", "direction": "Digital Input", "voltage": "5V max", "description": "Enable signal latch trigger pin." },
      { "name": "D0-D3", "direction": "Data Bus (Low)", "voltage": "5V max", "description": "Lower 4-bits data pins (used in 8-bit mode only)." },
      { "name": "D4-D7", "direction": "Data Bus (High)", "voltage": "5V max", "description": "Upper 4-bits data pins (used in both 4-bit and 8-bit modes)." },
      { "name": "A", "direction": "Backlight Anode", "voltage": "5V", "description": "Positive supply pin for backlight LED (requires series resistor)." },
      { "name": "K", "direction": "Backlight Cathode", "voltage": "0V", "description": "Negative supply pin for backlight LED." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A character grid liquid crystal display.",
    "whyNeeded": "Outputs real-time text warnings, sensor telemetry, and user setup parameters without an active computer connection.",
    "howItWorks": "The HD44780 controller translates digital codes (ASCII text characters) sent from a microcontroller into electrical commands. These commands trigger tiny liquid crystal pixel groups inside the 16x2 grids to change optical polarization, either blocking or letting the backlight shine through to draw the alphanumeric letters.",
    "svgDiagram": `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <rect x="10" y="30" width="80" height="40" fill="#047857" rx="3" />
        <rect x="15" y="35" width="70" height="30" fill="#1e40af" rx="1" />
        <text x="20" y="55" fill="#fff" font-family="monospace" font-size="12px">TEMP: 24 C</text>
      </svg>
    `
  },
  "circuitSymbol": {
    "meaning": "Parallel block representing VSS, VDD, RS, E, and data connections.",
    "usage": "Connect RS, EN, D4, D5, D6, D7 to digital GPIO pins to operate in 4-bit savings mode."
  },
  "advantages": [
    "Extremely easy to program using standard libraries (LiquidCrystal)",
    "Durable, rugged screen case housing",
    "Visible under bright direct sunlight conditions"
  ],
  "limitations": [
    "High pin count required (at least 6 GPIO pins in 4-bit mode)",
    "Cannot render custom graphics, images, or animations",
    "Consumes significant current when LED backlight is enabled"
  ],
  "engineeringTips": [
    "Solder an I²C adapter backpack directly onto the 16-pin connector strip to reduce required microcontroller connections from 6 pins to just 2 pins (SDA, SCL).",
    "Always connect a 10kΩ potentiometer to the VO contrast pin; if the screen shows solid white blocks or nothing at all, rotate the dial to adjust voltage."
  ],
  "commonMistakes": [
    {
      "question": "Display shows solid white boxes on the first row",
      "answer": "This indicates the display has power but is not initialized. Check that the RS, E, and data pin alignments match your code."
    }
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹120 - ₹200",
    "availability": "High",
    "recommendedAccessories": ["I²C Backpack Adapter", "10kΩ Potentiometer", "Header Pins"]
  },
  "bestFor": ["System monitors", "Settings menus", "Attendance counters"],
  "notRecommendedFor": ["Plotting graphs", "Gaming engines", "Full graphic dashboard interfaces"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 }
  ],
  "compatibleComponents": ["dht11", "fixed-resistor", "potentiometer"],
  "nextLearningPath": ["dht11"],
  "commonProjects": ["Digital Temperature Monitor", "Industrial Safety Alert System", "Stopwatch Timer Console"],
  "comparisonSensors": [],
  "comparisonSpecs": {},
  "quiz": [
    {
      "question": "What controller IC is the industry standard for character LCDs like the 16x2?",
      "options": ["SSD1306", "HD44780", "ILI9341", "MAX7219"],
      "answer": 1,
      "explanation": "The Hitachi HD44780 is the standard controller protocol used to drive alphanumeric liquid crystal characters."
    },
    {
      "question": "How many pins can be saved by using an I2C backpack with a 16x2 LCD?",
      "options": ["2 pins", "4 pins", "10 pins or more", "No pins are saved"],
      "answer": 2,
      "explanation": "A standard parallel connection requires at least 6 control/data pins plus power. An I2C backpack drives the display using only 2 pins (SDA and SCL), saving over 10 connections."
    }
  ],
  "buildChallenge": {
    "objective": "Build a real-time temperature display monitor that reads a sensor and outputs the temperature onto a 16x2 LCD.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "16x2 LCD Screen", "slug": "lcd1602" },
      { "name": "DHT11 Sensor", "slug": "dht11" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "10kΩ Potentiometer", "slug": "potentiometer" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect LCD Pin 1 (VSS) and Pin 16 (K) to GND. Connect Pin 2 (VDD) and Pin 15 (A) to 5V.",
        "expectedResult": "Screen backlight lights up."
      },
      {
        "stepNum": 2,
        "text": "Connect Pin 3 (VO) to the center wiper terminal of a 10kΩ potentiometer.",
        "expectedResult": "Contrast control is active."
      },
      {
        "stepNum": 3,
        "text": "Connect RS to D12, Enable to D11, D4 to D5, D5 to D4, D6 to D3, and D7 to D2.",
        "expectedResult": "Data communication lanes linked."
      },
      {
        "stepNum": 4,
        "text": "Connect the DHT11 signal pin to Arduino Analog A0.",
        "expectedResult": "Temperature readings mapped."
      }
    ],
    "expectedOutput": "The LCD displays the current room temperature, updating every 2 seconds.",
    "troubleshooting": [
      {
        "symptom": "Backlight works but no text is visible",
        "causes": ["VO Contrast pin voltage is too high/low"],
        "fixSteps": ["Rotate the 10k potentiometer slowly until character grids become sharp and visible."]
      }
    ],
    "experiments": [
      {
        "title": "Humid alarm blinker",
        "description": "Add code to make the backlight flash or warn the user if humidity exceeds 70%."
      }
    ],
    "verificationChecklist": [
      "Potentiometer sweeps contrast correctly",
      "Parallel pin array matches the LiquidCrystal lcd(12, 11, 5, 4, 3, 2) instantiation"
    ],
    "reflectionQuestions": [
      "What happens if you disconnect the potentiometer VO pin?",
      "Can this setup operate without a backlight?"
    ],
    "relatedProjects": ["Weather Hub Console", "Thermostat Controller Panel"],
    "xpReward": 100,
    "badge": "LCD Builder Badge"
  }
};
