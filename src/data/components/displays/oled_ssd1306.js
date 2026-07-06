export const oled_ssd1306 = {
  "name": "OLED Display (SSD1306)",
  "slug": "oled_ssd1306",
  "category": "Displays",
  "description": "A high-contrast graphical display utilizing self-illuminating Organic Light Emitting Diode technology. Ideal for compact wearables and mini user interfaces.",
  "status": "completed",
  "measures": "Graphics & Text",
  "outputType": "Visual Graphics",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V - 5V tolerant",
  "powerConsumption": "20mA typical",
  "mission": "Learn to draw shapes, icons, and animations on a micro display.",
  "prerequisites": ["voltage", "current"],
  "learningOutcomes": [
    "Program pixel coordinates and buffer rendering protocols",
    "Draw complex custom geometries, curves, and image bit-maps",
    "Configure I²C register addressing for SSD1306 controller"
  ],
  "typicalValue": "0.96 inch",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "overview": {
    "displayType": "Graphic OLED",
    "controllerIC": "SSD1306",
    "communicationInterface": ["I²C", "SPI"],
    "displayCapabilities": ["Text", "Graphics", "Icons", "Animation"],
    "operatingVoltage": "3.3V–5V"
  },
  "symbolSvg": `
    <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2" fill="none">
      <rect x="8" y="10" width="44" height="34" rx="2" />
      <rect x="12" y="14" width="36" height="20" rx="1" />
      <circle cx="20" cy="48" r="1" fill="currentColor" />
      <circle cx="26" cy="48" r="1" fill="currentColor" />
      <circle cx="32" cy="48" r="1" fill="currentColor" />
      <circle cx="38" cy="48" r="1" fill="currentColor" />
    </svg>
  `,
  "specs": [
    { "label": "Resolution", "value": "128 x 64 Pixels" },
    { "label": "Diagonal Size", "value": "0.96 inch" },
    { "label": "Controller IC", "value": "SSD1306" },
    { "label": "Technology", "value": "Self-Illuminating OLED" },
    { "label": "Viewing Angle", "value": "> 160 degrees" },
    { "label": "Interface", "value": "I²C / SPI (Configurable)" }
  ],
  "parts": [
    {
      "id": "glass",
      "name": "Protective Top Glass",
      "description": "Outer layer protecting the underlying organic pixel matrix.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "80px",
        "height": "40px",
        "borderRadius": "4px",
        "background": "rgba(255, 255, 255, 0.05)",
        "border": "1px solid rgba(255,255,255,0.2)",
        "assembledY": -80,
        "explodedY": -160,
        "zIndex": 4
      }
    },
    {
      "id": "panel",
      "name": "OLED Pixel Matrix",
      "description": "The self-illuminating organic emitter grid containing 8,192 pixels.",
      "connectorY": 150,
      "labelSide": "right",
      "labelY": 150,
      "visual": {
        "width": "76px",
        "height": "36px",
        "borderRadius": "2px",
        "background": "radial-gradient(circle, #3b82f6 20%, #000 100%)",
        "border": "1.5px solid #1e3a8a",
        "assembledY": -80,
        "explodedY": -100,
        "zIndex": 3
      }
    },
    {
      "id": "controller",
      "name": "SSD1306 IC",
      "description": "A flat silicon controller chip bonded directly to the glass substrate driving row/column charge lines.",
      "connectorY": 210,
      "labelSide": "left",
      "labelY": 210,
      "visual": {
        "width": "30px",
        "height": "8px",
        "background": "#000",
        "border": "1px solid #1e293b",
        "assembledY": -50,
        "explodedY": -40,
        "zIndex": 2
      }
    },
    {
      "id": "pcb",
      "name": "Carrier Board PCB",
      "description": "The support board containing pull-up resistors and voltage regulator circuitry.",
      "connectorY": 270,
      "labelSide": "right",
      "labelY": 270,
      "visual": {
        "width": "90px",
        "height": "60px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e293b, #0f172a)",
        "border": "1.5px solid #334155",
        "assembledY": 20,
        "explodedY": 30,
        "zIndex": 1
      }
    },
    {
      "id": "pins",
      "name": "4-pin Header Block",
      "description": "GND, VCC, SCL, and SDA input pins.",
      "connectorY": 330,
      "labelSide": "left",
      "labelY": 330,
      "visual": {
        "width": "32px",
        "height": "12px",
        "background": "#000",
        "assembledY": 70,
        "explodedY": 90,
        "zIndex": 0
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "GND", "direction": "Power Ground", "voltage": "0V", "description": "System common ground." },
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "System positive supply voltage input." },
      { "name": "SCL", "direction": "I²C Clock", "voltage": "3.3V - 5V", "description": "Serial Clock input pin (connects to SCL pin on MCU)." },
      { "name": "SDA", "direction": "I²C Data", "voltage": "3.3V - 5V", "description": "Serial Data input pin (connects to SDA pin on MCU)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A high-density self-illuminating graphical display module.",
    "whyNeeded": "Outputs compact graphs, menus, progress bars, and animations without consuming significant power.",
    "howItWorks": "The display does not use a backlight. Instead, each individual pixel contains a tiny organic chemical molecule that glows independently when electrical current is applied. The SSD1306 controller maps coordinates sent over I²C into columns and rows to control which pixels light up, rendering clear, high-contrast imagery.",
    "svgDiagram": `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <rect x="10" y="20" width="80" height="60" fill="#1e293b" rx="4" />
        <rect x="15" y="25" width="70" height="40" fill="#000" rx="2" />
        <polyline points="20,55 35,40 50,50 65,30 80,45" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
    `
  },
  "circuitSymbol": {
    "meaning": "I²C block representing GND, VCC, SCL, and SDA lines.",
    "usage": "Connect SCL to A5 and SDA to A4 on Arduino UNO, adding pull-up resistors if using long hookup lines."
  },
  "advantages": [
    "Infinite contrast ratio: pixels turn completely off for true pitch-blacks",
    "Very low power consumption (only draws power for glowing pixels)",
    "Wide viewing angles exceeding 160 degrees"
  ],
  "limitations": [
    "Risk of pixel burn-in if displaying static images for months",
    "Extremely small screen size (0.96 inch makes small text hard to read)",
    "Requires high memory storage for framebuffers on microcontrollers"
  ],
  "engineeringTips": [
    "Always use page rendering buffer updates (`display.clearDisplay()`, `display.display()`) inside loops rather than writing individual pixels directly to prevent screen flicker.",
    "If your microcontroller is low on RAM, use the lightweight 'SSD1306Ascii' library instead of 'Adafruit_SSD1306' to save up to 1KB of memory."
  ],
  "commonMistakes": [
    {
      "question": "Display shows nothing but connections are verified",
      "answer": "Make sure you call display.begin(SSD1306_SWITCHCAPVCC, 0x3C) in setup; the screen will not turn on if the correct address (0x3C or 0x3D) is missing."
    }
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹180 - ₹280",
    "availability": "High",
    "recommendedAccessories": ["Dupont Wires", "Level Shifters (optional)"]
  },
  "bestFor": ["Smart watches", "Battery level indicators", "Menu dashboards"],
  "notRecommendedFor": ["Color graphics", "Outdoor view under direct sun", "Very large wall displays"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 }
  ],
  "compatibleComponents": ["ultrasonic-sensor", "dht11", "buzzer"],
  "nextLearningPath": ["ultrasonic-sensor"],
  "commonProjects": ["Wearable Smart Watch Mockup", "Mini Game Console", "Digital Compass Indicator Panel"],
  "comparisonSensors": [],
  "comparisonSpecs": {},
  "quiz": [
    {
      "question": "Why do OLED displays consume less power than standard character LCDs?",
      "options": ["They operate at lower voltage", "They do not use a backlight; only active pixels draw current", "They have fewer pixels", "They use slower communication protocols"],
      "answer": 1,
      "explanation": "Because OLED pixels are self-illuminating, pixels showing black are completely turned off and consume zero current, saving massive power compared to always-on backlights."
    },
    {
      "question": "What is the typical screen resolution of the SSD1306 OLED display?",
      "options": ["16 x 2", "128 x 64", "320 x 240", "8 x 8"],
      "answer": 1,
      "explanation": "The standard SSD1306 0.96 inch display has a resolution of 128 horizontal pixels by 64 vertical pixels."
    }
  ],
  "buildChallenge": {
    "objective": "Build an ultrasonic distance display meter that outputs real-time distance on an OLED screen.",
    "estimatedTime": "20 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "SSD1306 OLED Display", "slug": "oled_ssd1306" },
      { "name": "Ultrasonic Sensor", "slug": "ultrasonic-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect OLED VCC to Arduino 5V, and GND to GND.",
        "expectedResult": "Display receives power."
      },
      {
        "stepNum": 2,
        "text": "Connect OLED SCL to Arduino Pin A5, and SDA to Pin A4.",
        "expectedResult": "I²C lines linked."
      },
      {
        "stepNum": 3,
        "text": "Connect Ultrasonic Sensor VCC to 5V, GND to GND, Trig to Pin 9, and Echo to Pin 10.",
        "expectedResult": "Sensor ready."
      }
    ],
    "expectedOutput": "The OLED screen displays a title 'DISTANCE METER' and outputs a live, clean numerical distance value in cm.",
    "troubleshooting": [
      {
        "symptom": "OLED screen is completely blank",
        "causes": ["Incorrect I2C address in code", "SDA and SCL pins swapped"],
        "fixSteps": ["Double check that SCL connects to A5 and SDA to A4. Verify display.begin() address is set to 0x3C."]
      }
    ],
    "experiments": [
      {
        "title": "Visual progress bar",
        "description": "Add a horizontal progress bar widget on the OLED screen that fills up as objects get closer."
      }
    ],
    "verificationChecklist": [
      "Adafruit_SSD1306 library is installed",
      "Screen displays startup splash logo correctly"
    ],
    "reflectionQuestions": [
      "What happens to the current draw when the screen is completely filled with white pixels?",
      "Can this screen show images?"
    ],
    "relatedProjects": ["Obstacle Radar Console", "Handheld Tape Measure Device"],
    "xpReward": 100,
    "badge": "OLED Artist Badge"
  }
};
