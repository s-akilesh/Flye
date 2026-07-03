export const dht11 = {
  "name": "DHT11 Temperature & Humidity Sensor",
  "slug": "dht11",
  "category": "Sensors",
  "description": "A basic, low-cost digital temperature and humidity sensor utilizing a capacitive humidity sensor and a thermistor.",
  "status": "completed",
  "measures": "Temperature & Humidity",
  "outputType": "Single Wire (Digital)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V / 5V Compatible",
  "powerConsumption": "2.5mA (Max during conversion)",
  "mission": "Learn to read digital environmental data streams using single-bus protocols.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Read temperature and relative humidity values",
    "Decode single-wire serial data packets",
    "Handle time-sensitive sensor request handshakes"
  ],
  "typicalValue": "DHT11",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "25 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <line x1=\"20\" y1=\"20\" x2=\"40\" y2=\"20\" stroke-dasharray=\"2,2\" />\n      <line x1=\"20\" y1=\"25\" x2=\"40\" y2=\"25\" stroke-dasharray=\"2,2\" />\n      <line x1=\"20\" y1=\"30\" x2=\"40\" y2=\"30\" stroke-dasharray=\"2,2\" />\n      <line x1=\"20\" y1=\"35\" x2=\"40\" y2=\"35\" stroke-dasharray=\"2,2\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"30\" y1=\"45\" x2=\"30\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.3V - 5.5V" },
    { "label": "Humidity Range", "value": "20% - 90% RH (±5% accuracy)" },
    { "label": "Temperature Range", "value": "0°C - 50°C (±2°C accuracy)" },
    { "label": "Sampling Interval", "value": "2 seconds" },
    { "label": "Package Size", "value": "15.5mm x 12mm x 5.5mm" }
  ],
  "parts": [
    {
      "id": "cover",
      "name": "Plastic Grid Mesh Cover",
      "description": "Protects internal elements while allowing ambient air flow to reach the sensor surfaces.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "48px",
        "height": "48px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        "border": "1.5px solid #1e40af",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 4
      }
    },
    {
      "id": "humidity",
      "name": "Capacitive Humidity Sensor",
      "description": "Uses a moisture-absorbing polymer layer between electrodes to measure shifts in relative humidity.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "30px",
        "height": "30px",
        "borderRadius": "2px",
        "background": "#cbd5e1",
        "border": "1.5px solid #94a3b8",
        "assembledY": -30,
        "explodedY": -80,
        "zIndex": 3
      }
    },
    {
      "id": "thermistor",
      "name": "NTC Thermistor",
      "description": "Negative temperature coefficient thermal resistor measuring ambient temperature.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "16px",
        "height": "16px",
        "borderRadius": "50%",
        "background": "#1e293b",
        "border": "1px solid #000",
        "assembledY": 0,
        "explodedY": -30,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Substrate PCB",
      "description": "Underlying circuit board holding reference resistors and tracking connections.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "64px",
        "height": "80px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "Connection Pins",
      "description": "VDD, DATA, NC, and GND terminals.",
      "connectorY": 350,
      "labelSide": "left",
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
      { "name": "VDD", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Positive voltage supply." },
      { "name": "DATA", "direction": "Bidirectional Digital", "voltage": "VCC", "description": "Serial data output/input bus pin (requires pullup)." },
      { "name": "NC", "direction": "Not Connected", "voltage": "0V", "description": "Null reference pin." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Negative power ground." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A single-wire environmental sensor module.",
    "whyNeeded": "Crucial for monitoring building comfort levels, climate cabinets, and home weather nodes.",
    "howItWorks": "The capacitive element detects humidity variations, and the NTC thermistor registers thermal variations. An internal 8-bit MCU decodes these analog readings and sends a 40-bit data packet (16-bit humidity, 16-bit temperature, and 8-bit checksum) down the DATA line when triggered by a start pulse.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" fill=\"#1d4ed8\" rx=\"4\" />\n        <rect x=\"30\" y=\"35\" width=\"40\" height=\"30\" fill=\"none\" stroke=\"#fff\" stroke-dasharray=\"2,2\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating single-line serial bus pins.",
    "usage": "Always connect a 4.7kΩ to 10kΩ pullup resistor from the DATA line to VDD."
  },
  "advantages": [
    "Extremely cheap and easy to wire",
    "Digital signal transmission does not degrade over long cable runs",
    "Integrates both humidity and temperature in a single tiny module"
  ],
  "limitations": [
    "Coarse accuracy limits (±2°C, ±5% RH)",
    "Slow sampling rate; cannot be read faster than once every 2 seconds",
    "Cannot measure temperatures below freezing (0°C)"
  ],
  "engineeringTips": [
    "Always place a 10kΩ pull-up resistor between the DATA line and VCC to ensure clean high states.",
    "Do not place the sensor near heat-generating devices like processors or voltage regulators."
  ],
  "commonMistakes": [
    {
      "question": "Sensor returns 'NaN' readings in serial print loops",
      "answer": "Usually caused by reading the sensor too fast (sampling interval under 2 seconds) or missing/incorrect pullup resistor connection on the DATA line."
    }
  ],
  "safetyNotes": [
    "Do not expose the polymer mesh to direct condensing moisture or chemical solvents."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹80 - ₹130",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "10kΩ Pullup Resistor", "Breadboard"]
  },
  "bestFor": ["Indoor Weather Stations", "Home Comfort Automation", "Basic Science Projects"],
  "notRecommendedFor": ["Sub-zero outdoor weather monitoring", "High precision laboratory chambers", "Fast-responding thermal probes"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 5 }
  ],
  "compatibleComponents": ["oled", "buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["oled", "esp32-devkit"],
  "commonProjects": ["Indoor Weather Station", "Automatic Dehumidifier Switch", "Greenhouse Thermostat Controller"],
  "comparisonSensors": ["dht22", "bmp280"],
  "comparisonSpecs": {
    "sensorType": "Humidity & Temp (Capacitive/Thermistor)",
    "operatingVoltage": "3.3V - 5.5V",
    "measurementRange": "0°C to 50°C / 20% to 90% RH",
    "accuracy": "±2°C / ±5% RH",
    "interface": "Single-Wire Serial (Proprietary)",
    "responseTime": "2.0s",
    "typicalPrice": "₹80 - ₹130",
    "bestUseCases": "Home telemetry, basic greenhouse indicators, beginner weather nodes"
  },
  "quiz": [
    {
      "question": "What is the minimum recommended sampling time interval when reading the DHT11 sensor?",
      "options": ["100 milliseconds", "1 second", "2 seconds", "10 seconds"],
      "answer": 2,
      "explanation": "The DHT11 has a slow response time. Reading it faster than once every 2 seconds can cause errors or stale readings."
    }
  ],
  "buildChallenge": {
    "objective": "Build a home temperature monitor that warns when conditions get too hot.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "DHT11 Sensor", "slug": "dht11" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "DHT Library"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Plug the DHT11 into the breadboard.",
        "expectedResult": "Pins align."
      },
      {
        "stepNum": 2,
        "text": "Connect DHT11 VDD to 5V and GND to GND.",
        "expectedResult": "Power loops configured."
      },
      {
        "stepNum": 3,
        "text": "Connect DHT11 DATA to Arduino Pin 2, and place a 10kΩ pullup resistor from DATA to 5V.",
        "expectedResult": "Signal line pulled high."
      },
      {
        "stepNum": 4,
        "text": "Connect an LED through a 220Ω resistor to Pin 6.",
        "expectedResult": "LED ready."
      }
    ],
    "expectedOutput": "The Arduino outputs temperature and humidity readings to the Serial Monitor. If temperature rises above 28°C, the warning LED turns on.",
    "troubleshooting": [
      {
        "symptom": "Serial print output shows 'NaN' constant values",
        "causes": ["Data pin connected to wrong input", "Missing pullup resistor"],
        "fixSteps": ["Check that DHT11 pin 2 is connected to Arduino Pin 2. Make sure 10kΩ resistor bridges VDD and DATA."]
      }
    ],
    "experiments": [
      {
        "title": "Humid breath trigger",
        "description": "Blow warm humid air directly into the DHT11 mesh. Check how fast humidity registers an increase on the serial monitor."
      }
    ],
    "verificationChecklist": [
      "Pullup resistor present on data line",
      "Serial monitor baud set to match code setup",
      "Dynamic readings print successfully"
    ],
    "reflectionQuestions": [
      "Why does DHT11 data require a checksum byte in its communication packet?",
      "Why is a capacitive sensor element useful for measuring moisture?"
    ],
    "relatedProjects": ["Home Weather Panel", "Greenhouse Fan Switch"],
    "xpReward": 80,
    "badge": "Weather Scout Badge"
  }
};

export const dht22 = {
  "name": "DHT22 Temperature & Humidity Sensor",
  "slug": "dht22",
  "category": "Sensors",
  "description": "A higher precision, wider range digital temperature and humidity sensor module, pin-compatible with the DHT11.",
  "status": "completed",
  "measures": "Temperature & Humidity",
  "outputType": "Single Wire (Digital)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V / 5V Compatible",
  "powerConsumption": "2.5mA (Max during conversion)",
  "mission": "Learn to handle higher precision environmental floating-point readings.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Measure sub-zero temperatures down to -40°C",
    "Monitor full humidity ranges up to 100% RH",
    "Implement high-accuracy local thermostats"
  ],
  "typicalValue": "DHT22 (AM2302)",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "25 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <circle cx=\"22\" cy=\"22\" r=\"2\" fill=\"currentColor\" />\n      <circle cx=\"38\" cy=\"22\" r=\"2\" fill=\"currentColor\" />\n      <line x1=\"20\" y1=\"30\" x2=\"40\" y2=\"30\" stroke-dasharray=\"2,2\" />\n      <line x1=\"20\" y1=\"35\" x2=\"40\" y2=\"35\" stroke-dasharray=\"2,2\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"30\" y1=\"45\" x2=\"30\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.3V - 6.0V" },
    { "label": "Humidity Range", "value": "0% - 100% RH (±2% accuracy)" },
    { "label": "Temperature Range", "value": "-40°C - 80°C (±0.5°C accuracy)" },
    { "label": "Sampling Interval", "value": "2 seconds" },
    { "label": "A/D Resolution", "value": "16-bit" }
  ],
  "parts": [
    {
      "id": "cover",
      "name": "White Vent Mesh Cover",
      "description": "Protects precision sensors from direct handling static while letting air pass.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "48px",
        "height": "48px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #cbd5e1, #94a3b8)",
        "border": "1.5px solid #64748b",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 4
      }
    },
    {
      "id": "sensing",
      "name": "Precision Polymer Capacitor",
      "description": "High accuracy capacitive moisture grid.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "30px",
        "height": "30px",
        "borderRadius": "2px",
        "background": "#e2e8f0",
        "border": "1.5px solid #cbd5e1",
        "assembledY": -30,
        "explodedY": -80,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Blue Substrate PCB",
      "description": "PCB carrying high performance digital conversion ICs.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "64px",
        "height": "80px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #0284c7, #0369a1)",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "4-pin Header Block",
      "description": "Header pins designed to mount onto socket lines.",
      "connectorY": 350,
      "labelSide": "left",
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
      { "name": "VDD", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Positive voltage terminal." },
      { "name": "DATA", "direction": "Bidirectional Digital", "voltage": "VCC", "description": "Data output bus pin." },
      { "name": "NC", "direction": "Not Connected", "voltage": "0V", "description": "Null pin." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground connection." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A high-performance digital environmental sensor.",
    "whyNeeded": "Used in professional HVAC controls, weather stations, and precision laboratory chambers.",
    "howItWorks": "Same bus protocol as DHT11, but utilizes high-resolution 16-bit analog-to-digital converters to translate capacitance changes into fraction values, returning fractional outputs with high reliability.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" fill=\"#64748b\" rx=\"4\" />\n        <path d=\"M35,40 H65 M35,50 H65 M35,60 H65\" stroke=\"#fff\" stroke-width=\"2\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating high-precision DHT series pins.",
    "usage": "Include the pullup resistor on the signal line for stable communications."
  },
  "advantages": [
    "Wider measurement range (-40°C to 80°C and 0-100% RH)",
    "Four times higher temperature resolution than DHT11",
    "High accuracy (±0.5°C and ±2% RH)"
  ],
  "limitations": [
    "Twice as expensive as DHT11",
    "Requires 2 seconds between consecutive reads",
    "Larger physical package volume"
  ],
  "engineeringTips": [
    "Use DHT22 when project requires outdoor weather readings where temperatures drop below 0°C.",
    "Add a filtering capacitor (100nF) between VCC and GND close to the sensor to clean power noise."
  ],
  "commonMistakes": [
    {
      "question": "Configuring sensor as DHT11 in programming code",
      "answer": "DHT11 and DHT22 use different data scaling factors. Setting the wrong sensor type in your library definitions will lead to wildly inaccurate values."
    }
  ],
  "safetyNotes": [
    "Protect sensor from mud, condensing water drops, and direct high-pressure spray."
  ],
  "buyingGuide": {
    "beginnerRating": 4.5,
    "priceRange": "₹220 - ₹350",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller Board", "10kΩ pullup resistor", "Breadboard"]
  },
  "bestFor": ["Outdoor Weather Monitors", "Precision Humidistats", "HVAC Controllers"],
  "notRecommendedFor": ["Extremely tight spaces", "High frequency thermal tracking"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 5 }
  ],
  "compatibleComponents": ["oled", "buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["oled", "esp32-devkit"],
  "commonProjects": ["Outdoor Climate Station", "Precision Hatchery Incubator", "Smart Home Dehumidification Node"],
  "comparisonSensors": ["dht11", "bmp280"],
  "comparisonSpecs": {
    "sensorType": "Precision Humidity & Temp",
    "operatingVoltage": "3.3V - 6.0V",
    "measurementRange": "-40°C to 80°C / 0% to 100% RH",
    "accuracy": "±0.5°C / ±2% RH",
    "interface": "Single-Wire Serial (Proprietary)",
    "responseTime": "2.0s",
    "typicalPrice": "₹220 - ₹350",
    "bestUseCases": "Precision temperature control, outdoor weather nodes, incubator systems"
  },
  "quiz": [
    {
      "question": "What temperature range can the DHT22 measure?",
      "options": ["0°C to 50°C", "-40°C to 80°C", "-100°C to 100°C", "-20°C to 60°C"],
      "answer": 1,
      "explanation": "The DHT22 measures temperatures from -40°C up to 80°C, making it suitable for sub-zero outdoor conditions."
    }
  ],
  "buildChallenge": {
    "objective": "Build a sub-zero freezer temperature alarm that registers sub-zero alerts.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "DHT22 Sensor", "slug": "dht22" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "Buzzer", "slug": "buzzer" },
      { "name": "10kΩ Resistor", "slug": "fixed-resistor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect DHT22 VDD to Arduino 5V, GND to GND, and DATA pin to Pin 2.",
        "expectedResult": "Sensor is powered and signal connected."
      },
      {
        "stepNum": 2,
        "text": "Place the 10kΩ resistor between DHT22 VDD and DATA rows.",
        "expectedResult": "DATA bus pulled high."
      },
      {
        "stepNum": 3,
        "text": "Connect a buzzer from Arduino Pin 8 to GND.",
        "expectedResult": "Alarm buzzer ready."
      }
    ],
    "expectedOutput": "The Arduino reads temperature values. If the temperature exceeds 4°C (freezer warning limit), it sounds the alarm buzzer.",
    "troubleshooting": [
      {
        "symptom": "Buzzer sounds immediately on power-up when room is cold",
        "causes": ["Incorrect logic threshold in code", "Wrong library selected"],
        "fixSteps": ["Check comparison operator in code. Ensure trigger is set to >4°C."]
      }
    ],
    "experiments": [
      {
        "title": "Cold ice test",
        "description": "Place the DHT22 inside a sealed bag near ice cubes. Observe the serial monitor as values descend below 0°C."
      }
    ],
    "verificationChecklist": [
      "DATA pin pullup present",
      "Freezer alarm trigger code active",
      "Dynamic serial telemetry outputs"
    ],
    "reflectionQuestions": [
      "Why is DHT22 preferred over DHT11 for measuring refrigerator systems?",
      "What causes condensations to build up inside the sensor mesh?"
    ],
    "relatedProjects": ["Incubator Controller", "Sub-Zero Logging Terminal"],
    "xpReward": 85,
    "badge": "Cryo Scout Badge"
  }
};

export const bmp280 = {
  "name": "BMP280 Barometric Pressure Sensor",
  "slug": "bmp280",
  "category": "Sensors",
  "description": "A high-precision barometric pressure and temperature sensor designed by Bosch, commonly used to calculate altitude levels in drone navigation.",
  "status": "completed",
  "measures": "Pressure, Temperature & Altitude",
  "outputType": "I²C / SPI",
  "operatingVoltage": "3.3V",
  "logicLevel": "3.3V Max (Requires level shifting on 5V boards)",
  "powerConsumption": "2.7µA (Very low power)",
  "mission": "Learn to interface with I²C sensors to calculate altitude indicators.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Query data registers over I²C serial communications",
    "Calculate barometric pressure and local altimeter settings",
    "Calculate relative heights above starting levels"
  ],
  "typicalValue": "BMP280",
  "polarity": "Polarized Power Pins",
  "difficulty": "Intermediate",
  "learningTime": "35 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <rect x=\"22\" y=\"22\" width=\"16\" height=\"16\" fill=\"none\" />\n      <circle cx=\"30\" cy=\"30\" r=\"2\" fill=\"currentColor\" />\n      <line x1=\"15\" y1=\"45\" x2=\"15\" y2=\"50\" />\n      <line x1=\"25\" y1=\"45\" x2=\"25\" y2=\"50\" />\n      <line x1=\"35\" y1=\"45\" x2=\"35\" y2=\"50\" />\n      <line x1=\"45\" y1=\"45\" x2=\"45\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "1.71V - 3.6V" },
    { "label": "Pressure Range", "value": "300 hPa - 1100 hPa (±12hPa accuracy)" },
    { "label": "Temperature Range", "value": "-40°C - 85°C (±1°C accuracy)" },
    { "label": "Bus Interface", "value": "I²C (up to 3.4MHz), SPI (up to 10MHz)" },
    { "label": "Average Current", "value": "2.74 µA at 1Hz sampling" }
  ],
  "parts": [
    {
      "id": "shield",
      "name": "Metal Shield Lid",
      "description": "Metal enclosure protecting the pressure diaphragm from direct physical damage while letting air enter through a vent hole.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "36px",
        "height": "36px",
        "borderRadius": "2px",
        "background": "linear-gradient(90deg, #e2e8f0, #cbd5e1)",
        "border": "1px solid #94a3b8",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 4
      }
    },
    {
      "id": "vent",
      "name": "Ventilation Aperture",
      "description": "Small circular opening in the metal lid allowing ambient air pressure to equilibrate with the internal sensor cavity.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "6px",
        "height": "6px",
        "borderRadius": "50%",
        "background": "#000",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 5
      }
    },
    {
      "id": "sensor",
      "name": "Piezoresistive Pressure Sensor Element",
      "description": "Silicon diaphragm that deflects minutely under air pressure variations, modifying resistance values.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "24px",
        "height": "24px",
        "borderRadius": "50%",
        "background": "#fbbf24",
        "assembledY": -20,
        "explodedY": -60,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Purple Breakout PCB",
      "description": "Tiny breakout board providing pull-up resistors and a 3.3V regulator.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "50px",
        "height": "60px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #7c3aed, #6d28d9)",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "6-pin Header pins",
      "description": "Terminals breaking out I²C and SPI pin layouts.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
      "visual": {
        "width": "42px",
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
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V", "description": "Power supply pin (3.3V max on module chips)." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "SCL", "direction": "Clock Input (I2C/SPI)", "voltage": "3.3V max", "description": "Serial Clock Line." },
      { "name": "SDA", "direction": "Data Input/Output (I2C/SPI)", "voltage": "3.3V max", "description": "Serial Data Line." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A high-precision barometric pressure sensor.",
    "whyNeeded": "Used in drones, smart weather monitors, and altimeter nodes to determine height and climb rates.",
    "howItWorks": "Deflections of the piezoresistive silicon diaphragm are digitized by the internal 24-bit ADC. Atmospheric pressure decreases predictably with height. The host controller queries these raw pressure registers over the I²C bus and applies thermodynamic scaling equations to output the altitude.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" fill=\"#7c3aed\" rx=\"4\" />\n        <rect x=\"35\" y=\"35\" width=\"30\" height=\"30\" fill=\"#e2e8f0\" />\n        <circle cx=\"42\" cy=\"42\" r=\"2\" fill=\"#000\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating standard I²C bus pin channels.",
    "usage": "Wire SDA/SCL to the controller's hardware I²C pins with appropriate level shifters if using a 5V board."
  },
  "advantages": [
    "Incredible pressure resolution allows detecting altitude changes as small as 1 meter",
    "Extremely low current draw (2.7µA) ideal for battery-powered items",
    "Includes a precision calibration memory on the chip for high accuracy"
  ],
  "limitations": [
    " Diaphragm is sensitive to wind draft noise which registers as false pressure drops",
    "Requires 3.3V supply and logic. 5V logic lines will burn the sensor if not level-shifted",
    "Diaphragm vent hole can clog if exposed to dust or moisture"
  ],
  "engineeringTips": [
    "Place a small porous foam piece over the sensor vent if installing inside drones to filter propeller drafts.",
    "Use the default I²C address `0x76`. If it does not respond, pull the SDO pin high to change the address to `0x77`."
  ],
  "commonMistakes": [
    {
      "question": "Sensor outputs the same pressure constant value or fails to find device on I2C scan",
      "answer": "Usually caused by wiring SDA/SCL lines backward, or powering the sensor with 5V instead of 3.3V. Always check logic voltages."
    }
  ],
  "safetyNotes": [
    "Never apply compressed air directly to the metal vent hole, which will instantly rupture the internal silicon diaphragm."
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹150 - ₹250",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "I²C Level Shifter (for 5V boards)", "Jumper wires"]
  },
  "bestFor": ["Drone Altimeters", "Weather Barometers", "Indoor Height Trackers"],
  "notRecommendedFor": ["Submersible water depth measurement", "Outdoor environments without cases"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 3 },
    { "boardSlug": "arduino-nano", "rating": 3 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 },
    { "boardSlug": "esp8266-nodemcu", "rating": 5 }
  ],
  "compatibleComponents": ["oled", "buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["oled", "esp32-devkit"],
  "commonProjects": ["Digital Altimeter for Model Rockets", "Home Weather Station Barometer", "Drone Height Holding System"],
  "comparisonSensors": ["dht11", "dht22"],
  "comparisonSpecs": {
    "sensorType": "Barometric Pressure & Temp",
    "operatingVoltage": "1.71V - 3.6V",
    "measurementRange": "300 to 1100 hPa / -40°C to 85°C",
    "accuracy": "±0.12 hPa (±1m altitude equivalent) / ±1°C",
    "interface": "I²C / SPI",
    "responseTime": "< 10ms",
    "typicalPrice": "₹150 - ₹250",
    "bestUseCases": "Altitude tracking, weather forecasting, rocket telemetry"
  },
  "quiz": [
    {
      "question": "How is altitude calculated using the BMP280?",
      "options": ["By timing sound echo reflections", "By measuring shifts in atmospheric air pressure", "By contacting satellite networks", "By thermal expansion"],
      "answer": 1,
      "explanation": "Atmospheric pressure decreases as altitude increases. The BMP280 measures pressure changes to calculate relative altitude values."
    }
  ],
  "buildChallenge": {
    "objective": "Build a height tracker that prints altitude in meters and flashes an LED when rising.",
    "estimatedTime": "20 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "BMP280 Sensor", "slug": "bmp280" },
      { "name": "ESP32 Board", "slug": "esp32-devkit" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "BMP280 Library"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect BMP280 VCC to ESP32 3.3V, and GND to GND.",
        "expectedResult": "Sensor is powered at 3.3V."
      },
      {
        "stepNum": 2,
        "text": "Connect BMP280 SCL to ESP32 SCL (GPIO 22) and SDA to ESP32 SDA (GPIO 21).",
        "expectedResult": "I²C connection established."
      },
      {
        "stepNum": 3,
        "text": "Connect an LED through a 220Ω series resistor to ESP32 GPIO 2.",
        "expectedResult": "LED ready."
      }
    ],
    "expectedOutput": "Opening the Serial Monitor displays live local air pressure, temperature, and relative altitude. Moving the sensor up/down registers changes.",
    "troubleshooting": [
      {
        "symptom": "Serial print logs show 'Could not find a valid BMP280 sensor'",
        "causes": ["Wrong I²C address configured in library code"],
        "fixSteps": ["Look up your library initialize call. Ensure it is configured with address `0x76` or `0x77` explicitly."]
      }
    ],
    "experiments": [
      {
        "title": "Room height check",
        "description": "Hold the sensor on the floor, note the altitude value, then lift it to the ceiling. Observe the relative centimeter-level height changes."
      }
    ],
    "verificationChecklist": [
      "VCC wired to 3.3V only",
      "I²C pins match ESP32 SDA/SCL layout",
      "Altitude displays in meters on the Serial output"
    ],
    "reflectionQuestions": [
      "Why does weather shift (like low-pressure fronts) affect absolute altitude readings?",
      "What is the I²C bus address for BMP280 by default?"
    ],
    "relatedProjects": ["Rocket Payload Telemetry", "Pocket Altimeter Node"],
    "xpReward": 90,
    "badge": "Aero Scout Badge"
  }
};
