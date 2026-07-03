export const mq2GasSensor = {
  "name": "MQ2 Gas Sensor",
  "slug": "mq2-gas-sensor",
  "category": "Sensors",
  "description": "A metal oxide semiconductor gas sensor that detects concentrations of LPG, smoke, carbon monoxide, propane, methane, and hydrogen in the air.",
  "status": "completed",
  "measures": "Gas & Smoke Concentrations",
  "outputType": "Analog Voltage + Digital Output (Trigger)",
  "operatingVoltage": "5V",
  "logicLevel": "5V logic (Requires divider for 3.3V boards)",
  "powerConsumption": "150mA (Heater active)",
  "mission": "Learn to calibrate and read gas concentration levels using analog inputs.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Read raw analog voltages representing gas density",
    "Calibrate detection thresholds using the onboard comparator potentiometer",
    "Understand chemical heating elements in gas sensors"
  ],
  "typicalValue": "MQ-2",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "30 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <circle cx=\"30\" cy=\"30\" r=\"20\" />\n      <circle cx=\"30\" cy=\"30\" r=\"16\" stroke-dasharray=\"2,2\" />\n      <circle cx=\"30\" cy=\"30\" r=\"4\" fill=\"currentColor\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"27\" y1=\"45\" x2=\"27\" y2=\"50\" />\n      <line x1=\"33\" y1=\"45\" x2=\"33\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "5V DC" },
    { "label": "Heater Resistance", "value": "31Ω ±10% (at room temp)" },
    { "label": "Heater Consumption", "value": "< 800mW" },
    { "label": "Sensing Resistance", "value": "2kΩ - 20kΩ (in 2000ppm Isobutane)" },
    { "label": "Concentration Range", "value": "300 - 10000 ppm (Liquefied gas, Propane, Methane, Smoke)" }
  ],
  "parts": [
    {
      "id": "mesh",
      "name": "Stainless Steel Double Mesh",
      "description": "Explosion-proof steel mesh cover. Prevents igniting flammable gases while letting gas circulate inside.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "46px",
        "height": "46px",
        "borderRadius": "50%",
        "background": "radial-gradient(circle, #94a3b8 30%, #475569 100%)",
        "border": "2px solid #64748b",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 4
      }
    },
    {
      "id": "sensor",
      "name": "Tin Dioxide (SnO2) Ceramic Tube",
      "description": "Sensory element heated internally. SnO2 conductivity rises in presence of combustible gases.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "30px",
        "height": "30px",
        "borderRadius": "2px",
        "background": "#f59e0b",
        "border": "1.5px solid #d97706",
        "assembledY": -30,
        "explodedY": -85,
        "zIndex": 3
      }
    },
    {
      "id": "heater",
      "name": "Ni-Cr Heating Coil",
      "description": "Internal micro-heater element that heats the tin dioxide tube to its active working temperature (~300°C).",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "12px",
        "height": "20px",
        "background": "linear-gradient(0deg, #dc2626, #b91c1c)",
        "assembledY": -30,
        "explodedY": -50,
        "zIndex": 4
      }
    },
    {
      "id": "pcb",
      "name": "Round Breakout PCB",
      "description": "Board carrying the LM393 comparator chip, power LEDs, and adjustment potentiometers.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "74px",
        "height": "74px",
        "borderRadius": "50%",
        "background": "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
        "border": "1px solid #1d4ed8",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "potentiometer",
      "name": "Digital Output Sensitivity Pot",
      "description": "Potentiometer used to calibrate the exact gas level threshold that flips the digital output (D0) high.",
      "connectorY": 330,
      "labelSide": "left",
      "labelY": 330,
      "visual": {
        "width": "20px",
        "height": "20px",
        "background": "#000",
        "border": "1px solid #ea580c",
        "assembledY": 65,
        "explodedY": 60,
        "zIndex": 3
      }
    },
    {
      "id": "pins",
      "name": "4-pin Output Block",
      "description": "VCC, GND, D0, and A0 pins.",
      "connectorY": 360,
      "labelSide": "right",
      "labelY": 360,
      "visual": {
        "width": "30px",
        "height": "16px",
        "background": "#000",
        "assembledY": 100,
        "explodedY": 110,
        "zIndex": 1
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "VCC", "direction": "Power Input", "voltage": "5V", "description": "Positive power pin. Must connect to 5V to run the internal heater." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground connection." },
      { "name": "D0", "direction": "Digital Output (Trigger)", "voltage": "5V TTL", "description": "Flips High/Low based on potentiometer comparison limit." },
      { "name": "A0", "direction": "Analog Output", "voltage": "0V - 5V", "description": "Analog voltage representing gas density (higher gas = higher voltage)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A heated metal oxide gas sensor.",
    "whyNeeded": "Essential for detecting gas leaks, combustible gases, and smoke emissions inside homes or labs.",
    "howItWorks": "In clean air, Tin Dioxide (SnO2) has low conductivity. When combustible gases are present, they react with oxygen adsorbed on the heated SnO2 surface, releasing electrons and lowering the sensor's electrical resistance. The output voltage on the A0 pin increases proportionally as resistance drops.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <circle cx=\"50\" cy=\"50\" r=\"35\" fill=\"#1e3a8a\" />\n        <circle cx=\"50\" cy=\"50\" r=\"28\" fill=\"#94a3b8\" stroke-dasharray=\"2,2\" />\n        <line x1=\"30\" y1=\"50\" x2=\"70\" y2=\"50\" stroke=\"#ef4444\" stroke-width=\"4\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating analog and digital trigger outputs.",
    "usage": "Use A0 to log exact PPM values, or connect D0 directly to digital input pins for instant threshold alerts."
  },
  "advantages": [
    "Detects a wide variety of gases including LPG, propane, alcohol, and smoke",
    "Dual output: logs raw analog values or triggers simple digital thresholds",
    "Cheap, simple to interface, and highly responsive"
  ],
  "limitations": [
    "Requires high operating current (~150mA) to run the heater, making battery power difficult",
    "Requires a warm-up time of 24-48 hours before first use to stabilize values",
    "Non-specific; cannot differentiate between smoke and propane gases"
  ],
  "engineeringTips": [
    "Power the sensor for at least 5 minutes before taking measurements. The sensor body gets warm during use - this is normal behavior for the heater coil.",
    "If using a 3.3V board like ESP32, pass the A0 pin through a resistor divider to scale the 0-5V analog voltage down to 0-3.3V."
  ],
  "commonMistakes": [
    {
      "question": "Sensor outputs a constant high reading immediately on startup",
      "answer": "This is normal during the first 1-2 minutes. The heater needs to warm up SnO2 before the resistance stabilizes."
    }
  ],
  "safetyNotes": [
    "Never test the sensor by releasing high concentrations of butane directly from a lighter, which can permanently contaminate the SnO2 layer."
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹120 - ₹180",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "Divider Resistors", "Solderless Breadboard"]
  },
  "bestFor": ["Gas Leak Detectors", "Smoke Alarms", "Industrial Safety Telemetry"],
  "notRecommendedFor": ["Battery-powered nodes", "Differentiating between specific gas components"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["buzzer", "relay", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["buzzer", "arduino-uno"],
  "commonProjects": ["Smoke Alarm System", "LPG Gas Leak Detector", "Automated Exhaust Fan Controller"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "Metal Oxide Semiconductor Gas Detector",
    "operatingVoltage": "5V",
    "measurementRange": "300 to 10000 ppm (LPG, Smoke, Methane)",
    "accuracy": "Relative analog output (Calibrated via ppm slope)",
    "interface": "Analog Output (0-5V) + Digital Output (LM393 Comparator)",
    "responseTime": "< 10s (Requires preheating)",
    "typicalPrice": "₹120 - ₹180",
    "bestUseCases": "Gas leak alarms, smoke detection, combustible gas safety thresholds"
  },
  "quiz": [
    {
      "question": "Why does the MQ2 sensor require a high current (~150mA)?",
      "options": ["To power the communication chip", "To run an internal heating element", "To boost the output signal", "To charge internal capacitors"],
      "answer": 1,
      "explanation": "The MQ2 uses an internal heating coil to heat SnO2 to around 300°C, which is required for the chemical reaction to detect gases."
    }
  ],
  "buildChallenge": {
    "objective": "Build a gas leakage alarm that beeps a buzzer when smoke or gas levels cross a safe threshold.",
    "estimatedTime": "20 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "MQ2 Gas Sensor", "slug": "mq2-gas-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "Buzzer", "slug": "buzzer" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect MQ2 VCC to Arduino 5V, and GND to GND.",
        "expectedResult": "Sensor heater starts warming up."
      },
      {
        "stepNum": 2,
        "text": "Connect MQ2 A0 pin to Arduino Analog Input Pin A0.",
        "expectedResult": "Analog telemetry connected."
      },
      {
        "stepNum": 3,
        "text": "Connect a buzzer from Arduino Pin 8 to GND.",
        "expectedResult": "Alarm buzzer ready."
      }
    ],
    "expectedOutput": "The Arduino reads A0 voltage. When a gas source is brought near the sensor, the voltage climbs. If it exceeds a set threshold (e.g. 2.5V), the buzzer sounds an alert.",
    "troubleshooting": [
      {
        "symptom": "Buzzer sounds constantly on startup",
        "causes": ["Sensor is not pre-heated", "Threshold set too low in code"],
        "fixSteps": ["Allow the sensor to pre-heat for at least 5 minutes. Adjust the threshold variable in code."]
      }
    ],
    "experiments": [
      {
        "title": "Trigger adjustment",
        "description": "Adjust the onboard potentiometer on the MQ2 back, and wire the D0 pin to digital pin 2. Check if the D0 LED triggers at the same threshold."
      }
    ],
    "verificationChecklist": [
      "VCC connected to 5V",
      "Sensor becomes warm to the touch",
      "Buzzer alarms on high concentrations"
    ],
    "reflectionQuestions": [
      "Why is SnO2 heated to a high temperature during gas detection?",
      "Explain why MQ2 cannot differentiate between methane and LPG."
    ],
    "relatedProjects": ["Kitchen Fire Alarm", "Gas Logging Node"],
    "xpReward": 85,
    "badge": "Gas Safety Badge"
  }
};
