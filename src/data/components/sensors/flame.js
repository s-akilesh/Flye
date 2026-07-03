export const flameSensor = {
  "name": "Flame Detection Sensor",
  "slug": "flame-sensor",
  "category": "Sensors",
  "description": "An infrared-sensitive receiver module designed to detect fire sources by monitoring light wavelengths between 760nm and 1100nm.",
  "status": "completed",
  "measures": "Fire / Flame Presence (Infrared Light)",
  "outputType": "Analog Voltage + Digital Output (Trigger)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V / 5V Compatible",
  "powerConsumption": "15mA",
  "mission": "Learn to detect fire sources by monitoring infrared wavelengths.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Detect flame wavelengths in the infrared spectrum",
    "Calibrate detection threshold sensitivity using trimmers",
    "Implement high-speed digital fire alarm alerts"
  ],
  "typicalValue": "YG-1006 / KY-026",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <path d=\"M30,15 C40,25 45,35 30,45 C15,35 20,25 30,15 Z\" fill=\"none\" />\n      <circle cx=\"30\" cy=\"35\" r=\"4\" fill=\"currentColor\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"30\" y1=\"45\" x2=\"30\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.3V - 5V" },
    { "label": "Sensor Chip", "value": "YG-1006 Phototransistor" },
    { "label": "Spectrum Range", "value": "760nm - 1100nm (Infrared)" },
    { "label": "Detection Angle", "value": "60 degrees" },
    { "label": "Outputs", "value": "Analog A0 + Digital D0" }
  ],
  "parts": [
    {
      "id": "receiver",
      "name": "Infrared Receiver (Phototransistor)",
      "description": "Black epoxy-packaged phototransistor highly sensitive to infrared wavelengths emitted by open flames.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "18px",
        "height": "28px",
        "borderRadius": "50% 50% 0 0",
        "background": "#000",
        "border": "1.5px solid #334155",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 4
      }
    },
    {
      "id": "comparator",
      "name": "LM393 Comparator IC",
      "description": "LM393 comparator comparing voltage levels to trigger digital alarms.",
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
      "name": "KY-026 Breakout PCB",
      "description": "Board providing reference resistors, trigger LED indicators, and pins.",
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
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Positive power input pin." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "D0", "direction": "Digital Output (Trigger)", "voltage": "3.3V / 5V TTL", "description": "Flips High/Low based on potentiometer flame infrared threshold limit." },
      { "name": "A0", "direction": "Analog Output", "voltage": "VCC - 0V", "description": "Analog voltage (dry/no flame = high voltage, flame present = voltage drops toward 0V)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "An infrared flame receiver sensor.",
    "whyNeeded": "Used in fire suppression robots, industrial safety shutoffs, and residential fire alarms.",
    "howItWorks": "Open fire flames emit high levels of shortwave infrared light. The black receiver phototransistor conducts electricity when exposed to wavelengths in the 760nm - 1100nm spectrum. The breakout board outputs this as an analog voltage. If the concentration exceeds the trimmer limit, the digital output D0 triggers.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"25\" y=\"30\" width=\"50\" height=\"50\" fill=\"#1e3a8a\" rx=\"4\" />\n        <path d=\"M50,10 C58,25 64,30 50,45 C36,30 42,25 50,10 Z\" fill=\"#ea580c\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating analog and digital flame sensor ports.",
    "usage": "Connect A0 to analog input pin, or link D0 to digital alarm trigger lines."
  },
  "advantages": [
    "High sensitivity specifically for fire emissions wavelength range",
    "Provides immediate, microsecond-level speed response",
    "Dual output outputs allow logging fire severity range"
  ],
  "limitations": [
    "Highly sensitive to sunlight or standard incandescent lights which emit similar infrared wavelengths",
    "Requires direct line of sight; cannot detect flames through thick solid barriers",
    "Limited detection range (typically up to 80cm for lighter flame)"
  ],
  "engineeringTips": [
    "Always place the phototransistor receiver at a safe distance (at least 20cm) from open flames during test runs to avoid melting the black epoxy package.",
    "Use software thresholds or comparator trimmers to filter out ambient room lighting reflections."
  ],
  "commonMistakes": [
    {
      "question": "Sensor triggers constantly when placed near windows",
      "answer": "Sunlight contains high levels of infrared light. Sunlight shifts will trigger the sensor. Calibrate threshold limits or install light filters."
    }
  ],
  "safetyNotes": [
    "Never bring the sensor housing directly inside open fire lines."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹60 - ₹110",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "Buzzer or LED", "Breadboard"]
  },
  "bestFor": ["Fire Alarm Panels", "Flame-Fighting Robotics", "Industrial Safety shutoffs"],
  "notRecommendedFor": ["Detecting heat without open flames (use Thermistor instead)"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["buzzer", "arduino-uno"],
  "commonProjects": ["Flame Guard Alarm Console", "Fire-Fighting Mini Robot", "Industrial Furnace Flame Monitor"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "Infrared Flame Phototransistor Receiver",
    "operatingVoltage": "3.3V - 5V",
    "measurementRange": "Detects flame infrared spectrum (760nm - 1100nm) up to 80cm",
    "accuracy": "High speed relative analog response",
    "interface": "Analog Output (VCC-0V) + Digital Output (LM393)",
    "responseTime": "< 10µs",
    "typicalPrice": "₹60 - ₹110",
    "bestUseCases": "Fire alarms, flame extinguishing robots, industrial safety switches"
  },
  "quiz": [
    {
      "question": "What range of light wavelengths is the flame sensor designed to detect?",
      "options": ["300nm - 400nm (UV)", "400nm - 700nm (Visible)", "760nm - 1100nm (Infrared)", "10GHz - 12GHz (Microwave)"],
      "answer": 2,
      "explanation": "Open hydrocarbon fire flames emit strong light in the shortwave infrared spectrum (760nm to 1100nm)."
    }
  ],
  "buildChallenge": {
    "objective": "Build a fire warning console that activates a warning buzzer when a flame is detected.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "Flame Sensor", "slug": "flame-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "Buzzer", "slug": "buzzer" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "Controlled lighter source (safety supervised)"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect Flame Sensor VCC to 5V, GND to GND, and D0 to Arduino Pin 2.",
        "expectedResult": "Sensor is powered."
      },
      {
        "stepNum": 2,
        "text": "Connect a buzzer from Arduino Pin 8 to GND.",
        "expectedResult": "Buzzer connected."
      }
    ],
    "expectedOutput": "The Arduino monitors Pin 2. Igniting a lighter 30cm away causes Pin 2 to trigger, sounding the warning buzzer alarm.",
    "troubleshooting": [
      {
        "symptom": "Buzzer alarms constantly under normal indoor lighting",
        "causes": ["Ambient incandescent light is too close", "Potentiometer sensitivity too high"],
        "fixSteps": ["Turn the onboard potentiometer trimmer counter-clockwise to reduce sensitivity. Avoid direct line to incandescent bulbs."]
      }
    ],
    "experiments": [
      {
        "title": "Analog range log",
        "description": "Wire the A0 pin to Arduino A0 pin. Print raw values on the serial plotter to measure how signal strength changes with distance."
      }
    ],
    "verificationChecklist": [
      "VCC connected to 5V",
      "D0 wired to Pin 2",
      "Buzzer sounds on lighter ignition"
    ],
    "reflectionQuestions": [
      "Why is visible light not a reliable indicator for fire detection systems?",
      "How can sunlight reflections trigger false fire alarms?"
    ],
    "relatedProjects": ["Fire Sentinel Console", "Flame Alert Node"],
    "xpReward": 80,
    "badge": "Fireguard Badge"
  }
};
