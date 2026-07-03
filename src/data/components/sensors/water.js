export const soilMoistureSensor = {
  "name": "Soil Moisture Sensor",
  "slug": "soil-moisture-sensor",
  "category": "Sensors",
  "description": "A resistive soil moisture sensor that measures the volumetric water content in soil based on the electrical resistance between two probes.",
  "status": "completed",
  "measures": "Soil Moisture (Water Content)",
  "outputType": "Analog Voltage + Digital Output (Trigger)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V / 5V Compatible",
  "powerConsumption": "35mA",
  "mission": "Learn to monitor moisture levels for automated irrigation systems.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Measure resistive changes representing soil moisture",
    "Calibrate wet/dry analog limits",
    "Configure digital comparator outputs for water valves"
  ],
  "typicalValue": "YL-69",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"22\" y=\"10\" width=\"16\" height=\"8\" rx=\"2\" />\n      <line x1=\"25\" y1=\"18\" x2=\"25\" y2=\"48\" />\n      <line x1=\"35\" y1=\"18\" x2=\"35\" y2=\"48\" />\n      <line x1=\"25\" y1=\"48\" x2=\"28\" y2=\"50\" />\n      <line x1=\"35\" y1=\"48\" x2=\"32\" y2=\"50\" />\n      <line x1=\"15\" y1=\"14\" x2=\"10\" y2=\"14\" />\n      <line x1=\"45\" y1=\"14\" x2=\"50\" y2=\"14\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.3V - 5V" },
    { "label": "Output Interface", "value": "Analog (A0) and Digital (D0)" },
    { "label": "PCB Dimension", "value": "30mm x 16mm" },
    { "label": "Probe Dimension", "value": "60mm x 20mm" },
    { "label": "Comparator Chip", "value": "LM393" }
  ],
  "parts": [
    {
      "id": "probes",
      "name": "Resistive Probes",
      "description": "Two exposed copper traces inserted into the soil. Water in soil bridges the gap, altering resistance.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "40px",
        "height": "100px",
        "background": "linear-gradient(180deg, #cbd5e1, #fbbf24)",
        "border": "1.5px solid #94a3b8",
        "assembledY": -50,
        "explodedY": -120,
        "zIndex": 4
      }
    },
    {
      "id": "comparator",
      "name": "LM393 Comparator IC",
      "description": "Compares probe voltage against threshold set by potentiometer, switching digital out.",
      "connectorY": 200,
      "labelSide": "right",
      "labelY": 200,
      "visual": {
        "width": "30px",
        "height": "24px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1px solid #4b5563",
        "assembledY": 20,
        "explodedY": -40,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Amplifier Board PCB",
      "description": "Small conditioning board containing indicator LEDs and comparator logic.",
      "connectorY": 300,
      "labelSide": "left",
      "labelY": 300,
      "visual": {
        "width": "50px",
        "height": "60px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
        "assembledY": 60,
        "explodedY": 50,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "4-pin Output Block",
      "description": "VCC, GND, D0, and A0 pins.",
      "connectorY": 350,
      "labelSide": "right",
      "labelY": 350,
      "visual": {
        "width": "32px",
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
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Positive power terminal." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "D0", "direction": "Digital Output (Trigger)", "voltage": "3.3V / 5V TTL", "description": "Flips High/Low based on threshold comparison." },
      { "name": "A0", "direction": "Analog Output", "voltage": "0V - VCC", "description": "Analog voltage representing moisture (drier soil = higher voltage)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A resistive moisture measurement sensor.",
    "whyNeeded": "Essential for automatic plant watering, agriculture moisture telemetry, and smart soil monitoring.",
    "howItWorks": "Dry soil conducts electricity poorly, resulting in high electrical resistance. When moisture is present, water conducts electricity better, lowering resistance. The conditioning board translates this resistance change into an analog voltage: fully dry soil outputs near VCC, and wet soil outputs near 0V.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"35\" y=\"20\" width=\"30\" height=\"60\" fill=\"#78350f\" rx=\"2\" />\n        <line x1=\"42\" y1=\"30\" x2=\"42\" y2=\"75\" stroke=\"#fbbf24\" stroke-width=\"4\" />\n        <line x1=\"58\" y1=\"30\" x2=\"58\" y2=\"75\" stroke=\"#fbbf24\" stroke-width=\"4\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating resistive probes and digital comparator outputs.",
    "usage": "Power from a digital pin to prevent galvanic corrosion of probes when not reading."
  },
  "advantages": [
    "Extremely cheap and simple to construct",
    "Provides both digital threshold and analog range outputs",
    "Onboard comparator allows running without microcontrollers (direct relays)"
  ],
  "limitations": [
    "Copper traces on probes suffer from rapid corrosion due to electrolysis during active power",
    "Readings vary based on soil density and mineral salt concentrations",
    "Open probes can be easily bent or broken physically"
  ],
  "engineeringTips": [
    "To prevent rapid electrode corrosion, do not power the sensor constantly. Connect VCC to a microcontroller GPIO pin and pull it High only right before taking a reading.",
    "Perform software calibration by recording the raw A0 values in fully dry air vs submerged in water."
  ],
  "commonMistakes": [
    {
      "question": "Sensor readings slowly drift and probes turn green/black",
      "answer": "This is due to galvanic corrosion caused by leaving the probes powered constantly. Only power the sensor when taking measurements."
    }
  ],
  "safetyNotes": [
    "Do not submerge the conditioning amplifier module PCB in water; only the probes are waterproof."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹60 - ₹110",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "Irrigation Relay/Pump", "Breadboard"]
  },
  "bestFor": ["Smart Agriculture", "Automatic Plant Watering", "Soil Telemetry Logging"],
  "notRecommendedFor": ["Highly accurate scientific moisture content assays", "Long-term constant-power monitoring"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["relay", "oled", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["relay", "arduino-uno"],
  "commonProjects": ["Automatic Irrigation Plant Pot", "Greenhouse Soil Telemetry System", "Soil Moisture Logging Terminal"],
  "comparisonSensors": ["rain-sensor"],
  "comparisonSpecs": {
    "sensorType": "Resistive Soil Moisture Sensor",
    "operatingVoltage": "3.3V - 5V",
    "measurementRange": "0% to 100% relative moisture (analog scale)",
    "accuracy": "Relative analog output (Subject to soil density/composition)",
    "interface": "Analog Output (0-VCC) + Digital Output (LM393)",
    "responseTime": "< 1s",
    "typicalPrice": "₹60 - ₹110",
    "bestUseCases": "Smart agriculture, automatic plant watering, soil moisture indicators"
  },
  "quiz": [
    {
      "question": "What is the main drawback of resistive soil moisture sensors left powered constantly?",
      "options": ["High power consumption", "Galvanic corrosion of the probes", "Acoustic interference", "Voltage spikes"],
      "answer": 1,
      "explanation": "Electrolysis between the positive and negative probes corrodes the copper tracks rapidly if powered continuously. Only power the sensor when reading."
    }
  ],
  "buildChallenge": {
    "objective": "Build a smart plant monitor that lights an LED when soil becomes too dry.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "Soil Moisture Sensor", "slug": "soil-moisture-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "Plant Pot (Dry soil)"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect sensor VCC to Arduino 5V, and GND to GND.",
        "expectedResult": "Sensor is powered."
      },
      {
        "stepNum": 2,
        "text": "Connect sensor A0 pin to Arduino A0 pin.",
        "expectedResult": "Analog line mapped."
      },
      {
        "stepNum": 3,
        "text": "Connect LED through 220Ω resistor to Pin 6.",
        "expectedResult": "Warning LED ready."
      }
    ],
    "expectedOutput": "The Arduino reads moisture levels. When the probe is in dry soil, the warning LED turns on. Inserting it into moist soil turns the LED off.",
    "troubleshooting": [
      {
        "symptom": "LED does not turn off when soil is watered",
        "causes": ["Incorrect analog threshold value in code"],
        "fixSteps": ["Check Serial Monitor dry vs wet values. Modify the threshold value in your code accordingly."]
      }
    ],
    "experiments": [
      {
        "title": "Power switching",
        "description": "Wire the sensor VCC to Arduino Digital Pin 7. Modify the code to pull Pin 7 High only during readings, preventing corrosion."
      }
    ],
    "verificationChecklist": [
      "VCC wired to power rail",
      "Analog A0 values change dynamically when wet",
      "LED switches off in wet soil"
    ],
    "reflectionQuestions": [
      "Why does adding water to soil increase its electrical conductivity?",
      "How does software-based calibration help improve soil sensor accuracy?"
    ],
    "relatedProjects": ["Automated Planter pot", "Agricultural Telemetry Hub"],
    "xpReward": 80,
    "badge": "Agri Scout Badge"
  }
};

export const rainSensor = {
  "name": "Rain Sensor",
  "slug": "rain-sensor",
  "category": "Sensors",
  "description": "A resistive rain detection module utilizing nickel-plated boards to detect water droplets on their surface.",
  "status": "completed",
  "measures": "Precipitation / Rain Drops",
  "outputType": "Analog Voltage + Digital Output (Trigger)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V / 5V Compatible",
  "powerConsumption": "15mA",
  "mission": "Learn to detect weather changes using conductive grids.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Detect presence of water drops on flat surfaces",
    "Calibrate comparator logic states",
    "Implement automated roof-closing systems"
  ],
  "typicalValue": "FC-37",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <path d=\"M20,20 H40 M20,25 H40 M20,30 H40 M20,35 H40\" stroke-dasharray=\"2,2\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"30\" y1=\"45\" x2=\"30\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.3V - 5V" },
    { "label": "Rain Board Surface", "value": "5.0cm x 4.0cm nickel-plated" },
    { "label": "Sensing Board Material", "value": "Nickel alloy plate (high oxidation resist)" },
    { "label": "Comparator Chip", "value": "LM393" }
  ],
  "parts": [
    {
      "id": "board",
      "name": "Rain Board Plate",
      "description": "Flat nickel-plated grid. Raindrops bridge adjacent tracks, lowering resistance.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "64px",
        "height": "80px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #cbd5e1, #94a3b8)",
        "border": "1.5px solid #64748b",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 4
      }
    },
    {
      "id": "comparator",
      "name": "LM393 Comparator IC",
      "description": "Compares plate voltage against trimmer reference.",
      "connectorY": 200,
      "labelSide": "right",
      "labelY": 200,
      "visual": {
        "width": "30px",
        "height": "24px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1px solid #4b5563",
        "assembledY": 20,
        "explodedY": -40,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Control Board PCB",
      "description": "Conditioning board outputting digital D0 and analog A0 states.",
      "connectorY": 300,
      "labelSide": "left",
      "labelY": 300,
      "visual": {
        "width": "50px",
        "height": "60px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
        "assembledY": 60,
        "explodedY": 50,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "4-pin Output Block",
      "description": "Output pins VCC, GND, D0, A0.",
      "connectorY": 350,
      "labelSide": "right",
      "labelY": 350,
      "visual": {
        "width": "32px",
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
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Positive voltage terminal." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "D0", "direction": "Digital Output (Trigger)", "voltage": "3.3V / 5V TTL", "description": "Flips High/Low based on threshold comparison." },
      { "name": "A0", "direction": "Analog Output", "voltage": "0V - VCC", "description": "Analog voltage representing wetness (dry board = high voltage, wet = low voltage)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A conductive rain grid sensor.",
    "whyNeeded": "Used in smart home weather systems, automatic car wipers, and electronic greenhouses.",
    "howItWorks": "When the plate is dry, resistance between tracks is high, so A0 outputs near VCC. When raindrops hit the grid, they connect adjacent tracks electrically, lowering resistance. A0 drops toward 0V depending on how much water covers the board.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" fill=\"#64748b\" rx=\"4\" />\n        <path d=\"M50,10 L50,15 M30,12 L33,17 M70,12 L67,17\" stroke=\"#60a5fa\" stroke-width=\"4\" stroke-linecap=\"round\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block representing the conductive grid board connection.",
    "usage": "Interface A0 to analog input pin, or link D0 to interrupt pin."
  },
  "advantages": [
    "Nickel-plating resists oxidation compared to basic copper plates",
    "Sensitivity can be calibrated via onboard trimmer",
    "High responsiveness to initial drops"
  ],
  "limitations": [
    "Grid accumulates dust and debris, requiring regular cleaning to prevent false triggers",
    "Susceptible to corrosion if kept continuously powered in wet conditions",
    "Cannot determine exact rainfall volume"
  ],
  "engineeringTips": [
    "Angle the rain plate at 30-45 degrees so water slides off easily when rain stops, allowing the sensor to dry and return to normal state.",
    "Use a low power GPIO pin to power the board only during active measurements."
  ],
  "commonMistakes": [
    {
      "question": "Sensor reports rain constantly even when dry",
      "answer": "This occurs if there is a film of salt/minerals left on the plate after water evaporates. Wipe the grid clean with isopropyl alcohol."
    }
  ],
  "safetyNotes": [
    "Ensure the conditioning board is kept in a dry, weatherproof box; only the sensing plate can handle rain."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹70 - ₹120",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller Board", "Weatherproof housing", "Connecting leads"]
  },
  "bestFor": ["Smart Weather Terminals", "Automatic Window Shutters", "Car Wiper Automation"],
  "notRecommendedFor": ["Meteorological rainfall volume calculation"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["servo-motor", "relay", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["servo-motor", "arduino-uno"],
  "commonProjects": ["Automatic Window Shutters", "Smart Umbrella Alarm", "Weather Logging Hub"],
  "comparisonSensors": ["soil-moisture-sensor"],
  "comparisonSpecs": {
    "sensorType": "Conductive Rain Grid Detector",
    "operatingVoltage": "3.3V - 5V",
    "measurementRange": "Binary rain presence or surface wetness scale",
    "accuracy": "Relative analog output (depends on droplet size/coverage)",
    "interface": "Analog Output (0-VCC) + Digital Output (LM393)",
    "responseTime": "< 1s",
    "typicalPrice": "₹70 - ₹120",
    "bestUseCases": "Weather tracking, automatic roof closures, windshield wiper controls"
  },
  "quiz": [
    {
      "question": "Why should the rain sensing plate be mounted at an angle?",
      "options": ["To catch more drops", "To allow water to drain off after rain stops", "To protect from wind", "To look premium"],
      "answer": 1,
      "explanation": "Mounting at an angle allows water to drain off when the rain stops, helping the sensor dry out and return to a 'dry' reading quickly."
    }
  ],
  "buildChallenge": {
    "objective": "Build a smart awning system that rotates a servo to close a shutter when rain is detected.",
    "estimatedTime": "20 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "Rain Sensor", "slug": "rain-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "Servo Motor", "slug": "servo-motor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect Rain Sensor VCC to 5V, GND to GND, and A0 to Arduino A0 pin.",
        "expectedResult": "Sensor is powered."
      },
      {
        "stepNum": 2,
        "text": "Connect the Servo Motor control wire to Arduino Pin 9, power to 5V, and ground to GND.",
        "expectedResult": "Servo is wired."
      }
    ],
    "expectedOutput": "The Arduino reads the rain grid. When dry, the servo sits at 0 degrees. Placing a water drop on the plate causes the servo to rotate to 90 degrees.",
    "troubleshooting": [
      {
        "symptom": "Servo twitches constantly without water drops",
        "causes": ["Unstable power supply during servo movement", "Analog threshold too sensitive"],
        "fixSteps": ["Provide a dedicated power supply for the servo, or increase the threshold margin in code."]
      }
    ],
    "experiments": [
      {
        "title": "Closing delay calibration",
        "description": "Add a delay timer in code to keep the shutter closed for 1 minute after the sensor plate dries, ensuring all rain has stopped."
      }
    ],
    "verificationChecklist": [
      "Plates wired to conditioning board",
      "Servo responds to drop contact",
      "Awning indicator logs change"
    ],
    "reflectionQuestions": [
      "Why does a rain sensor need a separate conditioning board?",
      "How would you build a self-heating rain plate to dry water faster?"
    ],
    "relatedProjects": ["Retractable Roof Driver", "Weather Watcher Block"],
    "xpReward": 85,
    "badge": "Storm Scout Badge"
  }
};
