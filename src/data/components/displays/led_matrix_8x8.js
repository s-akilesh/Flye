export const led_matrix_8x8 = {
  "name": "8x8 LED Matrix",
  "slug": "led_matrix_8x8",
  "category": "Displays",
  "description": "An 8x8 grid of 64 light-emitting diodes packaged in a single module. Typically driven by a MAX7219 driver IC to display characters, symbols, and scrolling text.",
  "status": "completed",
  "measures": "Scrolling Characters & Icons",
  "outputType": "Visual Patterns",
  "operatingVoltage": "5V",
  "logicLevel": "5V tolerant",
  "powerConsumption": "150mA maximum (all LEDs on)",
  "mission": "Learn to manage scrolling text animations using SPI serial signals.",
  "prerequisites": ["voltage", "current", "seven_segment"],
  "learningOutcomes": [
    "Cascade multiple matrix modules in sequence for wider screen dimensions",
    "Interface MAX7219 register buffers using SPI clock logic",
    "Design 8x8 binary bit-map arrays representing letters and symbols"
  ],
  "typicalValue": "MAX7219 Module",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "overview": {
    "displayType": "LED Matrix Display",
    "controllerIC": "MAX7219",
    "communicationInterface": ["SPI", "Shift Register"],
    "displayCapabilities": ["Text", "Icons", "Animations", "Patterns"],
    "operatingVoltage": "5V"
  },
  "symbolSvg": `
    <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2" fill="none">
      <rect x="10" y="10" width="40" height="40" rx="2" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      <circle cx="25" cy="16" r="1.5" fill="currentColor" />
      <circle cx="34" cy="16" r="1.5" fill="currentColor" />
      <circle cx="43" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="25" r="1.5" fill="currentColor" />
      <circle cx="25" cy="25" r="1.5" fill="currentColor" />
      <circle cx="34" cy="25" r="1.5" fill="currentColor" />
      <circle cx="43" cy="25" r="1.5" fill="currentColor" />
      <circle cx="16" cy="34" r="1.5" fill="currentColor" />
      <circle cx="25" cy="34" r="1.5" fill="currentColor" />
      <circle cx="34" cy="34" r="1.5" fill="currentColor" />
      <circle cx="43" cy="34" r="1.5" fill="currentColor" />
      <circle cx="16" cy="43" r="1.5" fill="currentColor" />
      <circle cx="25" cy="43" r="1.5" fill="currentColor" />
      <circle cx="34" cy="43" r="1.5" fill="currentColor" />
      <circle cx="43" cy="43" r="1.5" fill="currentColor" />
    </svg>
  `,
  "specs": [
    { "label": "LED Count", "value": "64 LEDs" },
    { "label": "Matrix Grid", "value": "8 x 8 Rows & Columns" },
    { "label": "Controller IC", "value": "MAX7219" },
    { "label": "Logic Voltage", "value": "5V DC" },
    { "label": "Interface Type", "value": "SPI Serial Protocol" },
    { "label": "Cascading", "value": "Supports series linking" }
  ],
  "parts": [
    {
      "id": "grid",
      "name": "Plastic Matrix Mask",
      "description": "Black plastic divider framing the 64 individual LED light channels.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "80px",
        "height": "80px",
        "borderRadius": "4px",
        "background": "#111",
        "border": "1.5px solid #000",
        "assembledY": -80,
        "explodedY": -160,
        "zIndex": 4
      }
    },
    {
      "id": "matrix",
      "name": "64 LED Emitter Grid",
      "description": "Rows and columns of mini LED junctions wired in common cathode configuration.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "76px",
        "height": "76px",
        "background": "radial-gradient(circle, #ef4444 30%, #000 100%)",
        "border": "1px dashed rgba(255,255,255,0.2)",
        "assembledY": -80,
        "explodedY": -100,
        "zIndex": 3
      }
    },
    {
      "id": "controller",
      "name": "MAX7219 Driver IC",
      "description": "An integrated circuit that handles high-frequency row/column scanning to offload CPU tasks.",
      "connectorY": 220,
      "labelSide": "left",
      "labelY": 220,
      "visual": {
        "width": "48px",
        "height": "16px",
        "background": "#1e293b",
        "border": "1px solid #4b5563",
        "assembledY": 15,
        "explodedY": -30,
        "zIndex": 2
      }
    },
    {
      "id": "pcb",
      "name": "FR4 Carrier Board",
      "description": "Double-sided board containing pull-ups, logic traces, and output pins for daisy-chaining panels.",
      "connectorY": 280,
      "labelSide": "right",
      "labelY": 280,
      "visual": {
        "width": "90px",
        "height": "90px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #166534, #14532d)",
        "border": "1.5px solid #15803d",
        "assembledY": 45,
        "explodedY": 35,
        "zIndex": 1
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "VCC", "direction": "Power Input", "voltage": "5V", "description": "Positive power supply input." },
      { "name": "GND", "direction": "Power Ground", "voltage": "0V", "description": "System ground reference." },
      { "name": "DIN", "direction": "SPI Data Input", "voltage": "5V max", "description": "Serial Data Input pin (connects to MOSI or digital pin)." },
      { "name": "CS / LOAD", "direction": "SPI Select", "voltage": "5V max", "description": "Chip Select latch pin." },
      { "name": "CLK", "direction": "SPI Clock", "voltage": "5V max", "description": "Serial Clock input pin." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A matrix indicator array driven by a serial chip.",
    "whyNeeded": "Outputs scrolling message text displays, custom smileys, or scrolling arcade graphics using minimal pins.",
    "howItWorks": "The MAX7219 uses a high-speed multiplexing routine. It rapidly switches row transistors on and off sequentially. It updates the columns accordingly at over 800Hz, ensuring the human eye sees solid, flicker-free graphics through persistence of vision.",
    "svgDiagram": `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <rect x="10" y="10" width="80" height="80" fill="#14532d" rx="4" />
        <rect x="15" y="15" width="70" height="70" fill="#000" rx="2" />
        <text x="25" y="55" fill="#ef4444" font-family="monospace" font-weight="bold" font-size="28px">HI</text>
      </svg>
    `
  },
  "circuitSymbol": {
    "meaning": "Schematic block showing 5 input pins on one side, and 5 daisy-chain output pins on the opposite side.",
    "usage": "Link the DOUT, LOAD, and CLK pins of the first module directly to DIN, LOAD, and CLK pins of the second module to cascade."
  },
  "advantages": [
    "Uses only 3 digital pins to control all 64 LEDs",
    "Modules can be chained together (daisy-chained) to form wide tickers",
    "Requires zero external current-limiting resistors (built into MAX7219)"
  ],
  "limitations": [
    "High current spike profiles when all 64 LEDs are active",
    "Limited to a single color (typically red, green, or blue)",
    "Requires active SPI code libraries to manage buffer formatting"
  ],
  "engineeringTips": [
    "Always place a 10µF electrolytic capacitor and a 0.1µF ceramic capacitor across VCC and GND close to the display module to filter out massive current spikes.",
    "Adjust display intensity in software (e.g. `lc.setIntensity(0, 4)`) to save battery power; setting brightness to max is rarely necessary."
  ],
  "commonMistakes": [
    {
      "question": "The display lights up with random, erratic dots on startup",
      "answer": "This happens if you do not send the initialization startup sequence in your code. Ensure display is taken out of shutdown mode using shutdown(false)."
    }
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹150 - ₹250",
    "availability": "High",
    "recommendedAccessories": ["5-pin Dupont Cables", "Electrolytic Capacitors (10µF)"]
  },
  "bestFor": ["Scrolling text banners", "Simple arcade game screens", "Scoreboard indicators"],
  "notRecommendedFor": ["Color icon layouts", "Text telemetry with high character count", "High-resolution charts"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 }
  ],
  "compatibleComponents": ["fixed-resistor", "shift-register", "capacitor"],
  "nextLearningPath": ["shift-register"],
  "commonProjects": ["Scrolling News Ticker Display", "Arcade Pong Game Screen", "LED Matrix Equalizer Visualizer"],
  "comparisonSensors": [],
  "comparisonSpecs": {},
  "quiz": [
    {
      "question": "How many control/data pins does a MAX7219 LED Matrix module require from a microcontroller?",
      "options": ["3 pins", "8 pins", "16 pins", "64 pins"],
      "answer": 0,
      "explanation": "By utilizing SPI protocol, the MAX7219 drives all 64 LEDs using only 3 interface pins (DIN, CS, CLK)."
    },
    {
      "question": "What is the purpose of cascading (daisy-chaining) LED Matrix modules?",
      "options": [
        "To increase display brightness",
        "To link modules in series to create a wider scrolling message screen",
        "To change the display colors",
        "To reduce operating voltage"
      ],
      "answer": 1,
      "explanation": "Cascading routes DOUT from one matrix module to DIN of the next, allowing multiple boards to act as one long display."
    }
  ],
  "buildChallenge": {
    "objective": "Build a scrolling text banner display that prints a custom message across an 8x8 LED Matrix.",
    "estimatedTime": "20 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "8x8 LED Matrix (MAX7219)", "slug": "led_matrix_8x8" },
      { "name": "Arduino UNO", "slug": "arduino-uno" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect LED Matrix VCC to Arduino 5V, and GND to GND.",
        "expectedResult": "Display receives power lines."
      },
      {
        "stepNum": 2,
        "text": "Connect Matrix DIN to Arduino D11 (MOSI), CS to D10 (SS), and CLK to D13 (SCK).",
        "expectedResult": "SPI serial connections active."
      }
    ],
    "expectedOutput": "The matrix displays a scrolling text banner showing 'FLYEN PLATFORM' continuously.",
    "troubleshooting": [
      {
        "symptom": "LEDs turn on but characters are scrambled or backwards",
        "causes": ["Incorrect matrix orientation mapping set in library code"],
        "fixSteps": ["Update the matrix rotation parameter (e.g. setRotation(1) or setRotation(3)) inside your setup sketch."]
      }
    ],
    "experiments": [
      {
        "title": "Heartbeat pulse animation",
        "description": "Create two alternating binary bit-maps (big heart and small heart) and toggle them every 500ms to animate a pulse."
      }
    ],
    "verificationChecklist": [
      "LedControl or MD_Parola library is installed",
      "DIN, CS, CLK pins match code constructor mapping"
    ],
    "reflectionQuestions": [
      "How does persistence of vision work in LED multiplexing?",
      "What is the maximum number of matrix modules you can chain together?"
    ],
    "relatedProjects": ["Stock Ticker Console", "Arcade Game Display Board"],
    "xpReward": 100,
    "badge": "Matrix Ticker Badge"
  }
};
