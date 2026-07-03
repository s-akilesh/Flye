export const hallEffectSensor = {
  "name": "Hall Effect Magnetic Sensor",
  "slug": "hall-effect-sensor",
  "category": "Sensors",
  "description": "A magnetic sensor that detects the presence and polarity of magnetic fields using the Hall effect principle.",
  "status": "completed",
  "measures": "Magnetic Field Presence & Polarity",
  "outputType": "Analog Voltage + Digital Output (Trigger)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V / 5V Compatible",
  "powerConsumption": "10mA",
  "mission": "Learn to detect magnetic field proximity and polarities.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Detect presence of magnetic fields",
    "Identify North and South magnetic poles",
    "Calculate rotational speed (RPM) using magnets"
  ],
  "typicalValue": "KY-024 / 3144",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <line x1=\"20\" y1=\"20\" x2=\"40\" y2=\"40\" />\n      <line x1=\"40\" y1=\"20\" x2=\"20\" y2=\"40\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"30\" y1=\"45\" x2=\"30\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3V - 5.5V" },
    { "label": "Sensor Chip", "value": "A3144 / KY-024" },
    { "label": "Outputs", "value": "Analog A0 + Digital D0" },
    { "label": "Magnetic sensitivity", "value": "High (Detects standard magnets up to 2cm)" }
  ],
  "parts": [
    {
      "id": "element",
      "name": "Hall Effect Transducer",
      "description": "Small 3-pin transistor-like component containing a thin semiconductor wafer. Generates voltage difference across wafer when magnet approaches.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "20px",
        "height": "24px",
        "borderRadius": "1px",
        "background": "#1e293b",
        "border": "1.5px solid #4b5563",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 4
      }
    },
    {
      "id": "comparator",
      "name": "LM393 Comparator IC",
      "description": "Compares output voltage against trimmer reference, flipping the D0 digital output.",
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
      "name": "KY-024 Breakout PCB",
      "description": "Breakout board containing reference resistors, indicator LEDs, and pins.",
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
      { "name": "D0", "direction": "Digital Output (Trigger)", "voltage": "3.3V / 5V TTL", "description": "Flips High/Low based on potentiometer magnetic threshold limit." },
      { "name": "A0", "direction": "Analog Output", "voltage": "0V - VCC", "description": "Analog voltage representing magnetic field intensity and direction." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A magnetic Hall effect sensor.",
    "whyNeeded": "Crucial for proximity switches, door sensors, brush-less motor control, and tachometers.",
    "howItWorks": "When a magnetic field is applied perpendicular to the sensor wafer, a voltage difference (Hall voltage) is generated across the wafer. The sensor amplifies this signal: A0 voltage shifts up or down depending on the magnetic pole (North vs South) brought near.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"25\" y=\"25\" width=\"50\" height=\"50\" fill=\"#1e3a8a\" rx=\"4\" />\n        <path d=\"M20,50 L80,50\" stroke=\"#fbbf24\" stroke-width=\"4\" />\n        <path d=\"M50,20 L50,80\" stroke=\"#60a5fa\" stroke-width=\"4\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating analog and digital trigger outputs.",
    "usage": "Interface A0 to log magnetic intensity, or D0 to trigger interrupt pins."
  },
  "advantages": [
    "Contactless operation ensures zero mechanical wear",
    "Highly responsive, allowing rotational speed calculations up to thousands of RPM",
    "Compact and easily integrated into small enclosures"
  ],
  "limitations": [
    "Short detection range (typically under 2cm for standard magnets)",
    "Can be affected by nearby heavy electric motors or transformers",
    "Needs a magnet on the target to function"
  ],
  "engineeringTips": [
    "Verify the magnet polarity. If the sensor is not reacting, flip the magnet over to present the opposite pole.",
    "Use a Schmitt trigger digital output for clean bounce-free state transitions in speed measurement."
  ],
  "commonMistakes": [
    {
      "question": "Sensor fails to trigger when magnet approaches",
      "answer": "Most Hall sensors are unipolar, meaning they only trigger on a specific magnetic pole (e.g. South). Flip the magnet over and retry."
    }
  ],
  "safetyNotes": [
    "Do not place very strong neodymium magnets directly touching the sensor body, as this can physically distort the leads."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹50 - ₹100",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "Magnets pack", "Breadboard"]
  },
  "bestFor": ["Speed Tachometers", "Contactless Proximity Switches", "Magnetic Door Locks"],
  "notRecommendedFor": ["Distance measurements over 2cm", "Detecting non-magnetic objects"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["buzzer", "arduino-uno"],
  "commonProjects": ["Digital RPM Tachometer", "Magnetic Security Window Alarm", "Rotational Speed Logger"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "Hall Effect Magnetic Proximity Sensor",
    "operatingVoltage": "3.0V - 5.5V",
    "measurementRange": "Detects magnets up to 20mm (depends on field strength)",
    "accuracy": "Relative analog intensity / high speed binary trigger",
    "interface": "Analog Output (0-VCC) + Digital Output (LM393)",
    "responseTime": "< 10µs (Very fast)",
    "typicalPrice": "₹50 - ₹100",
    "bestUseCases": "Rotational speed (RPM) calculation, contactless switches, limit triggers"
  },
  "quiz": [
    {
      "question": "What happens when a magnetic field is applied to a Hall effect sensor?",
      "options": ["A voltage difference is generated across the wafer", "The sensor becomes magnetized", "It generates a radio signal", "Its temperature rises"],
      "answer": 0,
      "explanation": "The Hall effect states that a voltage difference is generated across a conductor/semiconductor perpendicular to both current and an applied magnetic field."
    }
  ],
  "buildChallenge": {
    "objective": "Build a rotational speed pulse counter that counts how many times a magnet passes by.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "Hall Effect Sensor", "slug": "hall-effect-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "Magnet", "slug": "magnet" },
      { "name": "LED", "slug": "light-emitting-diode" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect Hall Sensor VCC to 5V, GND to GND, and D0 to Arduino Pin 2 (Interrupt pin).",
        "expectedResult": "Sensor wired."
      },
      {
        "stepNum": 2,
        "text": "Connect an LED through a 220Ω series resistor to Arduino Digital Pin 6.",
        "expectedResult": "Indicator LED ready."
      }
    ],
    "expectedOutput": "When powered up and code is loaded, the LED flashes each time a magnet passes close to the Hall sensor face.",
    "troubleshooting": [
      {
        "symptom": "LED stays on constant or does not trigger at all",
        "causes": ["Magnet presented on wrong pole face", "Comparator threshold set incorrectly"],
        "fixSteps": ["Flip the magnet over. Adjust the onboard potentiometer on the KY-024 module back."]
      }
    ],
    "experiments": [
      {
        "title": "Serial pulse count logger",
        "description": "Modify the code to print the total count of magnet passes on the Serial Monitor window."
      }
    ],
    "verificationChecklist": [
      "VCC connected to 5V",
      "D0 mapped to Pin 2",
      "LED triggers on magnet proximity"
    ],
    "reflectionQuestions": [
      "Why are Hall effect sensors used in bicycle speedometers instead of mechanical switches?",
      "What is the difference between latching and non-latching Hall sensors?"
    ],
    "relatedProjects": ["Speedometer Console", "Magnetic Limit Switcher"],
    "xpReward": 80,
    "badge": "Magneto Badge"
  }
};
