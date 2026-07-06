export const seven_segment = {
  "name": "Seven Segment Display",
  "slug": "seven_segment",
  "category": "Displays",
  "description": "A basic numeric display module containing 7 individual LED segments arranged in a figure-8 pattern. Used for displaying single digits and limited characters.",
  "status": "completed",
  "measures": "Single Digits",
  "outputType": "Visual Numeric",
  "operatingVoltage": "2.0V - 3.3V",
  "logicLevel": "Current limited logic (Requires series resistors)",
  "powerConsumption": "15mA per segment",
  "mission": "Learn to multiplex LED channels to display numbers.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Identify difference between Common Anode and Common Cathode displays",
    "Calculate current limiting resistor sizes for individual segments",
    "Develop binary digit encoding lookup tables for segment mapping"
  ],
  "typicalValue": "5161AS",
  "polarity": "Polarized LEDs",
  "difficulty": "Beginner",
  "learningTime": "10 min",
  "overview": {
    "displayType": "Numeric Display",
    "controllerIC": "None (Direct drive / multiplexed)",
    "communicationInterface": ["Parallel"],
    "displayCapabilities": ["Numbers", "Limited Characters"],
    "operatingVoltage": "2.0V–3.3V"
  },
  "symbolSvg": `
    <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2" fill="none">
      <rect x="15" y="10" width="30" height="40" rx="2" />
      <line x1="22" y1="15" x2="38" y2="15" stroke-width="2.5" />
      <line x1="22" y1="30" x2="38" y2="30" stroke-width="2.5" />
      <line x1="22" y1="45" x2="38" y2="45" stroke-width="2.5" />
      <line x1="20" y1="17" x2="20" y2="28" stroke-width="2.5" />
      <line x1="40" y1="17" x2="40" y2="28" stroke-width="2.5" />
      <line x1="20" y1="32" x2="20" y2="43" stroke-width="2.5" />
      <line x1="40" y1="32" x2="40" y2="43" stroke-width="2.5" />
      <circle cx="44" cy="45" r="1.5" fill="currentColor" />
    </svg>
  `,
  "specs": [
    { "label": "Digit Count", "value": "1 Digit" },
    { "label": "Segment Count", "value": "7 Segments + Decimal Point" },
    { "label": "Pin Type", "value": "Common Anode or Cathode" },
    { "label": "Voltage Drop", "value": "2.0V (Red LED typical)" },
    { "label": "Max Segment Current", "value": "25mA" },
    { "label": "Character Height", "value": "0.56 inch (14.22 mm)" }
  ],
  "parts": [
    {
      "id": "faceplate",
      "name": "Plastic Mask Housing",
      "description": "Outer plastic shell isolating light segments so characters remain sharp.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "80px",
        "height": "110px",
        "borderRadius": "4px",
        "background": "#000",
        "border": "1.5px solid #111",
        "assembledY": -80,
        "explodedY": -160,
        "zIndex": 4
      }
    },
    {
      "id": "segments",
      "name": "7 LED Emitters Array",
      "description": "Individual bar-shaped LEDs (labeled a through g) forming the figure-8 shape.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "60px",
        "height": "90px",
        "background": "repeating-linear-gradient(45deg, rgba(239,68,68,0.3), rgba(239,68,68,0.3) 10px, rgba(0,0,0,0.8) 10px, rgba(0,0,0,0.8) 20px)",
        "border": "1px solid rgba(239,68,68,0.4)",
        "assembledY": -80,
        "explodedY": -100,
        "zIndex": 3
      }
    },
    {
      "id": "decimal",
      "name": "Decimal Point LED",
      "description": "A separate circular dot LED (DP) used for decimal display positions.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "12px",
        "height": "12px",
        "borderRadius": "50%",
        "background": "#ef4444",
        "border": "1px solid rgba(255,255,255,0.2)",
        "assembledY": -10,
        "explodedY": -40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "10-pin Terminal Array",
      "description": "Interface legs at top and bottom of display module.",
      "connectorY": 320,
      "labelSide": "right",
      "labelY": 320,
      "visual": {
        "width": "76px",
        "height": "16px",
        "background": "repeating-linear-gradient(90deg, #94a3b8, #94a3b8 4px, #000 4px, #000 12px)",
        "assembledY": 30,
        "explodedY": 80,
        "zIndex": 1
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "Pin 3, 8", "direction": "Common Pin", "voltage": "VCC or GND", "description": "Common Anode (VCC) or Common Cathode (GND) reference pin." },
      { "name": "Pin 1", "direction": "Segment E Input", "voltage": "2.0V max", "description": "Input for segment E (bottom-left vertical bar)." },
      { "name": "Pin 2", "direction": "Segment D Input", "voltage": "2.0V max", "description": "Input for segment D (bottom horizontal bar)." },
      { "name": "Pin 4", "direction": "Segment C Input", "voltage": "2.0V max", "description": "Input for segment C (bottom-right vertical bar)." },
      { "name": "Pin 5", "direction": "DP Pin Input", "voltage": "2.0V max", "description": "Input for decimal point LED." },
      { "name": "Pin 6", "direction": "Segment B Input", "voltage": "2.0V max", "description": "Input for segment B (top-right vertical bar)." },
      { "name": "Pin 7", "direction": "Segment A Input", "voltage": "2.0V max", "description": "Input for segment A (top horizontal bar)." },
      { "name": "Pin 9", "direction": "Segment F Input", "voltage": "2.0V max", "description": "Input for segment F (top-left vertical bar)." },
      { "name": "Pin 10", "direction": "Segment G Input", "voltage": "2.0V max", "description": "Input for segment G (middle horizontal bar)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A basic numeric visual indicator module.",
    "whyNeeded": "Outputs simple counters, clocks, or status codes under dark/distant environments.",
    "howItWorks": "The display is constructed from 8 individual LEDs sharing a common ground (Common Cathode) or common power source (Common Anode). By applying voltage to select pins while keeping others grounded, specific segment groups illuminate to construct numbers from 0 to 9.",
    "svgDiagram": `
      <svg viewBox="0 0 100 100" width="80" height="80">
        <rect x="25" y="10" width="50" height="80" fill="#000" rx="3" />
        <line x1="35" y1="18" x2="65" y2="18" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
        <line x1="35" y1="48" x2="65" y2="48" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
        <line x1="35" y1="78" x2="65" y2="78" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
        <line x1="68" y1="22" x2="68" y2="44" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
        <line x1="68" y1="52" x2="68" y2="74" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
      </svg>
    `
  },
  "circuitSymbol": {
    "meaning": "Schematic block showing 8 LEDs inside a shared common-pin envelope.",
    "usage": "Always put a series resistor (e.g. 220Ω) on every individual segment line to prevent overcurrent."
  },
  "advantages": [
    "High brightness and contrast makes it highly readable from distances",
    "Extremely low cost and simple control requirements",
    "Rugged physical case architecture"
  ],
  "limitations": [
    "Requires high pin count (at least 7 pins to display one digit)",
    "Cannot display alphanumeric characters cleanly (e.g. X, M, W are impossible)",
    "Requires multiplexing code configurations to control multi-digit panels"
  ],
  "engineeringTips": [
    "Never connect a single resistor to the common pin instead of separate resistors on the segment pins. If you do, segments will change brightness depending on how many segments are illuminated (e.g., '1' will look much brighter than '8').",
    "Use BCD-to-Seven-Segment decoder driver chips (like CD4511 or MAX7219) to control multi-digit displays using just a few SPI pins."
  ],
  "commonMistakes": [
    {
      "question": "Illuminated segments are dim or flicker constantly",
      "answer": "This happens when resistors are too large or scan frequency is below 50Hz. Ensure your display refresh multiplex loop executes fast enough."
    }
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹20 - ₹50",
    "availability": "High",
    "recommendedAccessories": ["220Ω Resistors", "CD4511 Decoder IC", "Breadboard"]
  },
  "bestFor": ["Industrial counters", "Elevator floor panels", "Scoreboards"],
  "notRecommendedFor": ["Plotting graphs", "Sensor telemetry tags", "Detailed alphanumeric labels"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 }
  ],
  "compatibleComponents": ["fixed-resistor", "shift-register"],
  "nextLearningPath": ["shift-register"],
  "commonProjects": ["0-9 Digit Loop Counter", "Manual Scorekeeper Indicator", "Stopwatch Timer Module"],
  "comparisonSensors": [],
  "comparisonSpecs": {},
  "quiz": [
    {
      "question": "What is the difference between Common Anode and Common Cathode displays?",
      "options": [
        "Common Anode segments require ground to light; Common Cathode segments require positive voltage",
        "Common Anode uses red LEDs; Common Cathode uses green LEDs",
        "Common Anode has more segments",
        "Common Cathode uses higher voltage"
      ],
      "answer": 0,
      "explanation": "In Common Anode, the positive terminals are tied together to VCC, so pins must go LOW (grounded) to turn LEDs on. In Common Cathode, negative terminals are tied to GND, so pins must go HIGH."
    },
    {
      "question": "Why is it incorrect to place a single current limiting resistor only on the common pin?",
      "options": ["The LED segments will burn out", "Brightness will drop as more segments turn on, resulting in uneven light", "The decimal point will fail", "The display will turn blue"],
      "answer": 1,
      "explanation": "The current splits among active segments. If they share one resistor, the total current is limited, so digit '1' (2 segments) will look much brighter than '8' (7 segments)."
    }
  ],
  "buildChallenge": {
    "objective": "Build a digital segment counter that increases from 0 to 9 when a button is pressed.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "7-Segment Display", "slug": "seven_segment" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "7x 220Ω Resistors", "slug": "fixed-resistor" },
      { "name": "Push Button", "slug": "button" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect the display common pin (Pin 3 or 8) to Arduino GND (if Common Cathode).",
        "expectedResult": "Common ground reference established."
      },
      {
        "stepNum": 2,
        "text": "Connect pins A, B, C, D, E, F, G through separate 220Ω resistors to Arduino Pins 2, 3, 4, 5, 6, 7, 8.",
        "expectedResult": "Segment channels mapped."
      },
      {
        "stepNum": 3,
        "text": "Connect a push button to Arduino Pin 12 with pull-down resistor.",
        "expectedResult": "Input trigger ready."
      }
    ],
    "expectedOutput": "The display outputs '0' on start. Pressing the button increments the digit up to '9', then wraps back to '0'.",
    "troubleshooting": [
      {
        "symptom": "Individual segments light up in wrong sequence when counting",
        "causes": ["Pins swapped or mapped incorrectly in setup"],
        "fixSteps": ["Check your pin array indices against the digital pins map to ensure Segment A connects to Pin 2, B to Pin 3, etc."]
      }
    ],
    "experiments": [
      {
        "title": "Countdown timer",
        "description": "Modify the code to perform a countdown sequence from 9 to 0, flashing a warning dot when reaching zero."
      }
    ],
    "verificationChecklist": [
      "Common pin goes to GND",
      "Resistors are wired on all active segments",
      "Digit transitions cleanly on button press"
    ],
    "reflectionQuestions": [
      "How would you connect this display if it was Common Anode instead?",
      "How many total pins are saved by using a decoder chip?"
    ],
    "relatedProjects": ["Elevator Display Mockup", "Score Tracker Panel"],
    "xpReward": 100,
    "badge": "Segment Master Badge"
  }
};
