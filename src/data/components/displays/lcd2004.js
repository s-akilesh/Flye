export const lcd2004 = {
  "name": "20x4 Character LCD",
  "slug": "lcd2004",
  "category": "Displays",
  "description": "An expanded character liquid crystal display module capable of showing 20 characters per row across 4 rows. Ideal for complex telemetry readings requiring more text space.",
  "status": "completed",
  "measures": "Alphanumeric Text",
  "outputType": "Visual Text",
  "operatingVoltage": "5V",
  "logicLevel": "5V (Requires level shifting or 5V tolerant pins on 3.3V boards)",
  "powerConsumption": "150mA (with backlight)",
  "mission": "Learn to organize multi-line data summaries on an LCD screen.",
  "prerequisites": ["voltage", "current", "lcd1602"],
  "learningOutcomes": [
    "Manage multi-line coordinate indexing on a 20x4 display",
    "Integrate I²C backpack chip communication to conserve pins",
    "Format dense telemetry summaries cleanly"
  ],
  "typicalValue": "2004A",
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
      <rect x="5" y="12" width="50" height="36" rx="3" />
      <rect x="9" y="16" width="42" height="20" rx="1" />
      <line x1="9" y1="40" x2="51" y2="40" stroke-dasharray="2 2" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="52" cy="8" r="1.5" fill="currentColor" />
    </svg>
  `,
  "specs": [
    { "label": "Display Capacity", "value": "20 x 4 Characters" },
    { "label": "Character Size", "value": "2.95 x 4.75 mm" },
    { "label": "Controller", "value": "HD44780 / KS0066" },
    { "label": "Operating Voltage", "value": "4.7V - 5.3V" },
    { "label": "Interface", "value": "Parallel / I²C Backpack" },
    { "label": "Backlight Current", "value": "120mA typical" }
  ],
  "parts": [
    {
      "id": "screen",
      "name": "20x4 LCD Glass Panel",
      "description": "The wide liquid crystal pane showing 80 total character grids.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "110px",
        "height": "40px",
        "borderRadius": "2px",
        "background": "linear-gradient(135deg, #0f766e, #0d9488)",
        "border": "1.5px solid #0d9488",
        "assembledY": -75,
        "explodedY": -160,
        "zIndex": 4
      }
    },
    {
      "id": "backlight",
      "name": "LED Diffuser Sheet",
      "description": "A wide LED light source that evenly diffuses backlight behind the glass panel.",
      "connectorY": 150,
      "labelSide": "right",
      "labelY": 150,
      "visual": {
        "width": "110px",
        "height": "40px",
        "borderRadius": "2px",
        "background": "rgba(45, 212, 191, 0.4)",
        "border": "1px dashed rgba(255,255,255,0.2)",
        "assembledY": -75,
        "explodedY": -100,
        "zIndex": 3
      }
    },
    {
      "id": "controller",
      "name": "Co-driver Chipsets",
      "description": "Helper ICs mounted directly onto the PCB that coordinate row scan pulses.",
      "connectorY": 210,
      "labelSide": "left",
      "labelY": 210,
      "visual": {
        "width": "30px",
        "height": "20px",
        "background": "#1e293b",
        "border": "1px solid #334155",
        "assembledY": 15,
        "explodedY": -30,
        "zIndex": 2
      }
    },
    {
      "id": "pcb",
      "name": "FR4 Base PCB",
      "description": "The underlying circuit board holding passive contrast elements and tracks.",
      "connectorY": 270,
      "labelSide": "right",
      "labelY": 270,
      "visual": {
        "width": "130px",
        "height": "75px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e3a8a, #1e40af)",
        "border": "1.5px solid #1d4ed8",
        "assembledY": 50,
        "explodedY": 35,
        "zIndex": 1
      }
    },
    {
      "id": "backpack",
      "name": "I²C Backpack Module",
      "description": "An optional daughterboard with PCF8574 chip converting I²C serial data to parallel display inputs.",
      "connectorY": 330,
      "labelSide": "left",
      "labelY": 330,
      "visual": {
        "width": "50px",
        "height": "24px",
        "borderRadius": "2px",
        "background": "#022c22",
        "border": "1px solid #115e59",
        "assembledY": 90,
        "explodedY": 95,
        "zIndex": 0
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "GND", "direction": "Power Ground", "voltage": "0V", "description": "System common ground." },
      { "name": "VCC", "direction": "Power Input", "voltage": "5V", "description": "System positive 5V supply input." },
      { "name": "SDA", "direction": "I²C Data", "voltage": "5V max", "description": "Serial Data input line (when I²C backpack is installed)." },
      { "name": "SCL", "direction": "I²C Clock", "voltage": "5V max", "description": "Serial Clock input line (when I²C backpack is installed)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A four-row liquid crystal alphanumeric panel.",
    "whyNeeded": "Outputs highly complex multi-parameter readings like GPS coordinates, multi-room temperatures, or debugging telemetry logs.",
    "howItWorks": "Commands enter via parallel or I²C connections and are latched by driver chips. The crystals manipulate backlight polarization inside the 20x4 character blocks, enabling readable characters across double the line density of a standard 16x2 panel.",
    "svgDiagram": `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <rect x="5" y="20" width="90" height="60" fill="#1e3a8a" rx="3" />
        <rect x="10" y="25" width="80" height="50" fill="#0d9488" rx="1" />
        <text x="15" y="42" fill="#fff" font-family="monospace" font-size="8px">CPU: 42% RAM: 64%</text>
        <text x="15" y="55" fill="#fff" font-family="monospace" font-size="8px">TEMP: 28.5 C</text>
        <text x="15" y="68" fill="#fff" font-family="monospace" font-size="8px">STATUS: OPERATIONAL</text>
      </svg>
    `
  },
  "circuitSymbol": {
    "meaning": "I²C serial block representing GND, VCC, SDA, and SCL pins.",
    "usage": "Connect SDA to A4 and SCL to A5 on Arduino UNO to execute double-wire commands."
  },
  "advantages": [
    "Twice the text capacity of a standard 16x2 LCD",
    "Uses only 2 pins when combined with I²C backpack modules",
    "Extremely clear display contrast"
  ],
  "limitations": [
    "Much larger footprint, requiring significant physical space",
    "Higher power consumption, requiring up to 150mA of current",
    "Not suitable for high-speed charts or graph plotting"
  ],
  "engineeringTips": [
    "Always check the default I²C hex address (typically 0x27 or 0x3F) using an I2C scanner sketch before writing code.",
    "Make sure your power supply can handle the 150mA display load, particularly when powering from standard USB lines."
  ],
  "commonMistakes": [
    {
      "question": "LCD displays old garbage characters or won't clear",
      "answer": "Make sure to call lcd.clear() regularly inside your loops when text formatting sizes change to wipe residual letters."
    }
  ],
  "buyingGuide": {
    "beginnerRating": 4.5,
    "priceRange": "₹250 - ₹380",
    "availability": "High",
    "recommendedAccessories": ["I²C Backpack (pre-soldered)", "Shield Bracket", "Breadboard"]
  },
  "bestFor": ["IoT Weather Stations", "GPS Loggers", "Multi-parameter control panels"],
  "notRecommendedFor": ["Ultra low power sleep devices", "Handheld gaming systems", "Graphic dashboards"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 }
  ],
  "compatibleComponents": ["dht11", "gpsModule", "bmp280"],
  "nextLearningPath": ["gpsModule"],
  "commonProjects": ["Embedded Server Diagnostics Monitor", "Multi-Room Climate Controller Console", "GPS Position Tracker Display"],
  "comparisonSensors": [],
  "comparisonSpecs": {},
  "quiz": [
    {
      "question": "What is the total character capacity of a 20x4 LCD Display?",
      "options": ["32 characters", "40 characters", "80 characters", "160 characters"],
      "answer": 2,
      "explanation": "A 20x4 display has 20 character grids per row across 4 rows, resulting in 80 total character slots."
    },
    {
      "question": "Which of these is the most common default I2C address for LCD backpack modules?",
      "options": ["0x00", "0x27", "0x77", "0xFF"],
      "answer": 1,
      "explanation": "Address 0x27 is the standard address configuration for most PCF8574 based I2C expanders."
    }
  ],
  "buildChallenge": {
    "objective": "Build a server status system monitor that displays multi-line telemetry readouts on a 20x4 LCD.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "20x4 LCD (I²C)", "slug": "lcd2004" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "DHT11 Sensor", "slug": "dht11" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect LCD VCC to Arduino 5V, and GND to GND.",
        "expectedResult": "Screen powers up."
      },
      {
        "stepNum": 2,
        "text": "Connect LCD SDA to Arduino Analog A4, and SCL to Analog A5.",
        "expectedResult": "I²C lines connected."
      },
      {
        "stepNum": 3,
        "text": "Connect DHT11 signal line to Arduino Pin 2.",
        "expectedResult": "Sensor telemetry is active."
      }
    ],
    "expectedOutput": "The 20x4 display prints system stats across 4 rows, showing: 1) System Up Time, 2) Temperature, 3) Humidity, and 4) System Status.",
    "troubleshooting": [
      {
        "symptom": "Display turns on but does not print any characters",
        "causes": ["Incorrect I²C address configured in code"],
        "fixSteps": ["Run an I2C scanner sketch to verify the exact hex address, and update LiquidCrystal_I2C lcd(ADDR, 20, 4) in your code."]
      }
    ],
    "experiments": [
      {
        "title": "Heartbeat character customizer",
        "description": "Create a custom pulsing heart character in RAM and flash it on row 4 to show system is running."
      }
    ],
    "verificationChecklist": [
      "I2C address matches address scanner output",
      "Wire.h library is included in sketch"
    ],
    "reflectionQuestions": [
      "Why is I2C communication slower than parallel?",
      "Can we drive multiple I2C displays on the same lines?"
    ],
    "relatedProjects": ["Smart Home Dashboard", "Energy Monitor Console"],
    "xpReward": 100,
    "badge": "Grid Master Badge"
  }
};
