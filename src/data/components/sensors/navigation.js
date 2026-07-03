export const gpsModule = {
  "name": "GPS Module (NEO-6M)",
  "slug": "gps-module",
  "category": "Sensors",
  "description": "A high-performance satellite positioning receiver module that calculates geographic latitude, longitude, altitude, and time indicators.",
  "status": "completed",
  "measures": "Geographic Coordinates, Speed & Time",
  "outputType": "UART (Serial)",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V logic (Sufficient for most inputs, RX requires shifting on 5V boards)",
  "powerConsumption": "45mA",
  "mission": "Learn to parse NMEA satellite data streams over serial ports.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Receive NMEA string sentences over UART serial connections",
    "Extract latitude and longitude coordinates",
    "Parse UTC time and satellite count values"
  ],
  "typicalValue": "NEO-6M",
  "polarity": "Polarized Power Pins",
  "difficulty": "Intermediate",
  "learningTime": "45 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <circle cx=\"30\" cy=\"30\" r=\"6\" />\n      <polygon points=\"30,20 34,28 26,28\" fill=\"currentColor\" />\n      <line x1=\"15\" y1=\"45\" x2=\"15\" y2=\"50\" />\n      <line x1=\"25\" y1=\"45\" x2=\"25\" y2=\"50\" />\n      <line x1=\"35\" y1=\"45\" x2=\"35\" y2=\"50\" />\n      <line x1=\"45\" y1=\"45\" x2=\"45\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3V - 5V" },
    { "label": "Receiver Type", "value": "50 Channels, GPS L1 C/A" },
    { "label": "Default Baud Rate", "value": "9600 bps" },
    { "label": "Horizontal Position Accuracy", "value": "2.5 m" },
    { "label": "Navigation Update Rate", "value": "1 Hz (default), up to 5 Hz" }
  ],
  "parts": [
    {
      "id": "ceramic",
      "name": "Ceramic Patch Antenna",
      "description": "High-gain ceramic antenna that picks up weak high-frequency RF signals emitted by GPS satellites.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "46px",
        "height": "46px",
        "borderRadius": "4px",
        "background": "radial-gradient(circle, #78716c 30%, #44403c 100%)",
        "border": "1.5px solid #292524",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 4
      }
    },
    {
      "id": "epprom",
      "name": "EEPROM Configuration IC",
      "description": "Stores user configuration parameters and calibration offsets.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "20px",
        "height": "20px",
        "borderRadius": "1px",
        "background": "#1e293b",
        "border": "1px solid #4b5563",
        "assembledY": -30,
        "explodedY": -80,
        "zIndex": 3
      }
    },
    {
      "id": "battery",
      "name": "Backup Rechargeable Battery",
      "description": "Small coin-cell battery storing ephemeris data to allow fast hot-starts.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "18px",
        "height": "18px",
        "borderRadius": "50%",
        "background": "linear-gradient(90deg, #94a3b8, #cbd5e1)",
        "assembledY": 0,
        "explodedY": -30,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "GY-GPS6MV2 Breakout PCB",
      "description": "Board carrying the NEO-6M module, power indicators, and antenna coaxial connector.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "64px",
        "height": "90px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1e3a8a, #1d4ed8)",
        "border": "1px solid #1d4ed8",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "4-pin Serial Header",
      "description": "VCC, RX, TX, and GND pins.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
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
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Positive power terminal." },
      { "name": "RX", "direction": "Serial Input (Receive)", "voltage": "3.3V logic", "description": "Serial input commands pin. Requires 3.3V logic levels." },
      { "name": "TX", "direction": "Serial Output (Transmit)", "voltage": "3.3V TTL", "description": "Serial output data pin. Transmits NMEA sentences." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A satellite navigation GPS receiver module.",
    "whyNeeded": "Used in vehicle tracking systems, drone flight logs, outdoor navigation, and clock synchronization.",
    "howItWorks": "The patch antenna detects high frequency signals from GPS satellites. The module processes travel times from at least four satellites to calculate local 3D position (latitude, longitude, altitude). It outputs these coordinates continuously in NMEA-0183 formatted text strings over the TX serial line.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"15\" y=\"20\" width=\"70\" height=\"60\" fill=\"#1e3a8a\" rx=\"4\" />\n        <rect x=\"35\" y=\"35\" width=\"30\" height=\"30\" fill=\"#78716c\" />\n        <polygon points=\"50,15 65,30 35,30\" fill=\"#fbbf24\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating UART serial RX/TX pins.",
    "usage": "Connect module TX to microcontroller RX, and module RX to microcontroller TX (using level shifters on 5V boards)."
  },
  "advantages": [
    "Global coverage enables absolute position coordinates anywhere outdoors",
    "Provides extremely accurate UTC time sync information",
    "Uses simple UART serial commands that require no special hardware pins"
  ],
  "limitations": [
    "Will not function indoors, in deep tunnels, or next to high structures which block satellite views",
    "Takes a long time (typically 30-60 seconds) to acquire initial satellite lock (Cold Start)",
    "Relatively high power consumption (~45mA continuous)"
  ],
  "engineeringTips": [
    "Always test GPS projects outdoors or near a window. The onboard tiny LED will start flashing green/red once a stable satellite lock is established.",
    "Use software serial libraries to map GPS communications on secondary digital pins, leaving hardware UART pins free for debugging."
  ],
  "commonMistakes": [
    {
      "question": "Sensor outputs empty NMEA lines and no coordinate data in serial monitor",
      "answer": "This is normal indoors. The sensor must be placed outdoors under clear sky views for at least 2 minutes to acquire initial lock and download orbital coordinates."
    }
  ],
  "safetyNotes": [
    "Do not pull on the fragile coaxial cable linking the ceramic patch antenna to the module PCB."
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹350 - ₹500",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller Board", "SoftwareSerial library", "Jumper wires"]
  },
  "bestFor": ["Outdoor Trackers", "Navigating Drones", "Clock Synchronizers"],
  "notRecommendedFor": ["Indoor movement trackers", "Low-power battery-only devices"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 4 },
    { "boardSlug": "arduino-nano", "rating": 4 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["oled", "buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["oled", "esp32-devkit"],
  "commonProjects": ["Vehicle GPS Tracker Node", "Handheld GPS Navigator", "Drone Autonomous Return-to-Home Module"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "Satellite Positioning GPS Receiver",
    "operatingVoltage": "3.3V - 5V",
    "measurementRange": "Global coordinates (Latitude/Longitude/Altitude)",
    "accuracy": "Within 2.5 meters (open sky)",
    "interface": "UART (Serial, default 9600 bps)",
    "responseTime": "1s (Update rate 1Hz)",
    "typicalPrice": "₹350 - ₹500",
    "bestUseCases": "Vehicle tracking, outdoor navigation, speedometers, time sync nodes"
  },
  "quiz": [
    {
      "question": "How many satellites must a GPS module lock onto to calculate a 3D position?",
      "options": ["1 Satellite", "2 Satellites", "4 Satellites", "12 Satellites"],
      "answer": 2,
      "explanation": "A minimum of four satellites are required to solve the four variables: latitude, longitude, altitude, and clock time offset."
    }
  ],
  "buildChallenge": {
    "objective": "Build a vehicle tracker that outputs GPS coordinates to an OLED display.",
    "estimatedTime": "30 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "GPS Module (NEO-6M)", "slug": "gps-module" },
      { "name": "ESP32 Board", "slug": "esp32-devkit" },
      { "name": "OLED Display", "slug": "oled" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "TinyGPS++ Library"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect NEO-6M VCC to ESP32 3.3V, and GND to GND.",
        "expectedResult": "Module is powered."
      },
      {
        "stepNum": 2,
        "text": "Connect NEO-6M TX pin to ESP32 RX2 (GPIO 16) and RX to TX2 (GPIO 17).",
        "expectedResult": "Serial communications routed."
      },
      {
        "stepNum": 3,
        "text": "Connect OLED SCL to GPIO 22 and SDA to GPIO 21.",
        "expectedResult": "Display communications connected."
      }
    ],
    "expectedOutput": "When taken outdoors, the GPS module locks onto satellites. The OLED display begins printing live latitude, longitude, and current speed updates.",
    "troubleshooting": [
      {
        "symptom": "OLED screen stays black or shows 0.000 coordinates",
        "causes": ["SDA/SCL reversed on OLED", "No satellite lock (Porous window glass blocking)"],
        "fixSteps": ["Check OLED wiring SCL/SDA. Move outdoors for at least 5 minutes to allow initial lock."]
      }
    ],
    "experiments": [
      {
        "title": "Speed limit warning",
        "description": "Modify the code to sound a warning tone on GPIO 2 if the GPS calculated speed exceeds 20 km/h."
      }
    ],
    "verificationChecklist": [
      "GPS green LED starts flashing outdoors",
      "Latitude/Longitude outputs are correct",
      "OLED screen prints coordinates"
    ],
    "reflectionQuestions": [
      "Why is GPS coordinate output formatted as degrees, minutes, and seconds?",
      "What is the difference between 'cold start' and 'hot start' recovery times in GPS modules?"
    ],
    "relatedProjects": ["Asset Tracker Hub", "GPS Speedometer Console"],
    "xpReward": 100,
    "badge": "Navigator Badge"
  }
};
