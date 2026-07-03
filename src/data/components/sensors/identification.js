export const rfidRc522 = {
  "name": "RFID RC522 Reader Module",
  "slug": "rfid-rc522",
  "category": "Sensors",
  "description": "A highly integrated 13.56 MHz contactless reader/writer communication card module based on the MFRC522 chip.",
  "status": "completed",
  "measures": "RFID Tags / Contactless Cards (UID)",
  "outputType": "SPI",
  "operatingVoltage": "3.3V",
  "logicLevel": "3.3V logic (Requires level shifters on 5V boards)",
  "powerConsumption": "30mA",
  "mission": "Learn to read contactless ID tags and access tokens over SPI buses.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Query tag UID codes via RF induction",
    "Configure serial SPI bus master-slave channels",
    "Implement digital keycard locks"
  ],
  "typicalValue": "RC522",
  "polarity": "Polarized Power Pins",
  "difficulty": "Intermediate",
  "learningTime": "35 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"10\" y=\"10\" width=\"40\" height=\"40\" rx=\"2\" />\n      <circle cx=\"30\" cy=\"28\" r=\"8\" stroke-dasharray=\"2,2\" />\n      <rect x=\"24\" y=\"42\" width=\"12\" height=\"4\" />\n      <line x1=\"10\" y1=\"45\" x2=\"10\" y2=\"50\" />\n      <line x1=\"50\" y1=\"45\" x2=\"50\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.3V" },
    { "label": "Operating Frequency", "value": "13.56 MHz" },
    { "label": "Read Range", "value": "0 - 50 mm" },
    { "label": "Supported Cards", "value": "Mifare1 S50, Mifare1 S70, Mifare UltraLight, Mifare Pro" },
    { "label": "Data Transfer Rate", "value": "Max 10Mbit/s" }
  ],
  "parts": [
    {
      "id": "chip",
      "name": "MFRC522 Reader IC",
      "description": "NXP reader chip running high-frequency RF modulation and demodulation.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "30px",
        "height": "30px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1.5px solid #4b5563",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 4
      }
    },
    {
      "id": "antenna",
      "name": "Integrated PCB Antenna",
      "description": "Etched copper coil traces on the PCB that emit an electromagnetic field to power and query nearby tags.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "64px",
        "height": "64px",
        "borderRadius": "4px",
        "background": "repeating-linear-gradient(45deg, #1e3a8a, #1d4ed8 10px)",
        "border": "2.5px solid #fbbf24",
        "assembledY": -20,
        "explodedY": -80,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Blue RC522 PCB",
      "description": "Solder board carrying decoupling caps and SPI breakouts.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "74px",
        "height": "120px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
        "border": "1.5px solid #1e3a8a",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "8-pin Header Block",
      "description": "SPI communication lines (MOSI, MISO, SCK, SS/SDA), RST, 3.3V, and GND.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
      "visual": {
        "width": "48px",
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
      { "name": "3.3V", "direction": "Power Input", "voltage": "3.3V only", "description": "Power pin. Never connect to 5V as it will destroy the MFRC522 chip." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "RST", "direction": "Digital Input", "voltage": "3.3V max", "description": "Reset pin." },
      { "name": "MISO", "direction": "SPI Output", "voltage": "3.3V max", "description": "Master In Slave Out line." },
      { "name": "MOSI", "direction": "SPI Input", "voltage": "3.3V max", "description": "Master Out Slave In line." },
      { "name": "SCK", "direction": "SPI Clock Input", "voltage": "3.3V max", "description": "Serial Clock Line." },
      { "name": "SDA/SS", "direction": "SPI Select", "voltage": "3.3V max", "description": "Slave Select Line." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A high-frequency RFID reader/writer module.",
    "whyNeeded": "Essential for employee badges, smart lockers, inventory tracking, and electronic access gates.",
    "howItWorks": "The reader's antenna coil emits a 13.56 MHz RF field. When a passive tag enters this field, the magnetic flux induces an electric current in the tag's internal antenna, powering up its microchip. The tag then modulates the field to transmit its unique UID code back to the RC522 reader chip, which decodes it and sends it to the host via SPI.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"15\" y=\"15\" width=\"70\" height=\"70\" fill=\"#1e3a8a\" rx=\"4\" />\n        <rect x=\"25\" y=\"25\" width=\"50\" height=\"50\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"4\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating SPI bus reader connections.",
    "usage": "Connect SPI lines to the microcontroller's dedicated hardware SPI pins. Power from 3.3V pin only."
  },
  "advantages": [
    "Provides secure contactless read/write operations",
    "Uses passive tags that require no batteries, reducing maintenance",
    "Highly reliable UID reads with checksum checking"
  ],
  "limitations": [
    "Short read distance (~5cm maximum)",
    "Cannot read tags placed flat against metal surfaces which disrupt electromagnetic flux",
    "Operates strictly at 3.3V, requiring logic level shifting on 5V Arduino lines"
  ],
  "engineeringTips": [
    "Place a level shifter on MISO/MOSI/SCK lines if connecting to a 5V Arduino Uno to avoid reading errors and potential degradation over time.",
    "Do not overlap multiple readers close to each other, as their RF fields will interfere."
  ],
  "commonMistakes": [
    {
      "question": "Sensor fails to read tags and SPI setup prints error status",
      "answer": "This is almost always due to wiring mistakes on the complex SPI bus. Double-check MOSI/MISO pin positions, and verify RST is connected to a configured digital reset pin."
    }
  ],
  "safetyNotes": [
    "Never connect the RC522 VCC pin to 5V power rails."
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹180 - ₹280",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller Board", "RFID Key Fobs", "Level Shifters"]
  },
  "bestFor": ["Access Control Systems", "Attendance Trackers", "Smart Lockers"],
  "notRecommendedFor": ["Long range tracking or toll booths"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 3 },
    { "boardSlug": "arduino-nano", "rating": 3 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 },
    { "boardSlug": "esp8266-nodemcu", "rating": 5 }
  ],
  "compatibleComponents": ["relay", "oled", "buzzer", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["relay", "esp32-devkit"],
  "commonProjects": ["RFID Door Lock Gate", "Automated Attendance Registry", "Inventory Tool Tracker"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "Contactless RFID Card Reader (13.56 MHz)",
    "operatingVoltage": "3.3V",
    "measurementRange": "0mm to 50mm",
    "accuracy": "100% UID match rate (digital query)",
    "interface": "SPI",
    "responseTime": "< 10ms",
    "typicalPrice": "₹180 - ₹280",
    "bestUseCases": "Security gates, digital locks, asset tagging, attendance systems"
  },
  "quiz": [
    {
      "question": "What frequency does the RC522 RFID module operate at?",
      "options": ["125 kHz", "13.56 MHz", "2.4 GHz", "433 MHz"],
      "answer": 1,
      "explanation": "The RC522 operates at 13.56 MHz, which is the standard frequency for high-frequency contactless cards and Mifare systems."
    }
  ],
  "buildChallenge": {
    "objective": "Build an RFID security door lock that activates a relay if a registered card is read.",
    "estimatedTime": "25 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "RC522 RFID Module", "slug": "rfid-rc522" },
      { "name": "ESP32 Board", "slug": "esp32-devkit" },
      { "name": "Relay Module", "slug": "relay" },
      { "name": "Buzzer", "slug": "buzzer" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "MFRC522 Library"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect RC522 3.3V to ESP32 3.3V, and GND to GND.",
        "expectedResult": "Module powered at 3.3V safely."
      },
      {
        "stepNum": 2,
        "text": "Connect SCK to GPIO 18, MISO to GPIO 19, MOSI to GPIO 23, and SDA/SS to GPIO 5.",
        "expectedResult": "SPI interface connected."
      },
      {
        "stepNum": 3,
        "text": "Connect RST pin to GPIO 22.",
        "expectedResult": "Reset pin mapped."
      },
      {
        "stepNum": 4,
        "text": "Connect a Relay control wire to GPIO 4, and a buzzer to GPIO 2.",
        "expectedResult": "Outputs ready."
      }
    ],
    "expectedOutput": "When powered on, scanning an unauthorized card sounds a short error beep. Scanning the authorized card triggers the relay and buzzer to turn on.",
    "troubleshooting": [
      {
        "symptom": "RFID reader does not react to tags at all",
        "causes": ["Faulty SPI pins mapping", "Insufficient current output on 3.3V pin"],
        "fixSteps": ["Double check SPI pin numbers in code. Ensure board is powered by 3.3V pin of ESP32."]
      }
    ],
    "experiments": [
      {
        "title": "Adding master key",
        "description": "Modify the Arduino code to register a 'Master Card' UID. When the Master Card is scanned, it toggles a learning mode to register new user cards without reprogramming."
      }
    ],
    "verificationChecklist": [
      "RC522 powered at 3.3V",
      "SPI pins match ESP32 SPI channels",
      "Relay clicks on authorized UID scan"
    ],
    "reflectionQuestions": [
      "How is electric power transferred to the passive RFID keyfob without contacts?",
      "What is the difference between RFID UID codes and data sectors?"
    ],
    "relatedProjects": ["RFID Lock Console", "Gate Entry Logger"],
    "xpReward": 100,
    "badge": "Keykeeper Badge"
  }
};
