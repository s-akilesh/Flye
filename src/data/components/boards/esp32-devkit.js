export const esp32Devkit = {
  "name": "ESP32 DevKit",
  "slug": "esp32-devkit",
  "category": "Development Boards",
  "description": "A powerful, dual-core microcontroller board with integrated Wi-Fi and Bluetooth, designed for advanced IoT applications and smart home prototypes.",
  "status": "completed",
  "mission": "Master advanced dual-core processing and wireless systems using the ESP32.",
  "prerequisites": ["voltage", "current", "light-emitting-diode", "fixed-resistor"],
  "learningOutcomes": [
    "Configure Wi-Fi web clients and Bluetooth beacons",
    "Utilize dual-core processing tasks",
    "Read multi-channel analog sensors"
  ],
  "typicalValue": "ESP32-WROOM-32",
  "polarity": "Polarized Power Ports",
  "difficulty": "Intermediate",
  "learningTime": "45 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"12\" y=\"10\" width=\"36\" height=\"40\" rx=\"2\" />\n      <rect x=\"18\" y=\"15\" width=\"24\" height=\"14\" fill=\"none\" />\n      <line x1=\"20\" y1=\"18\" x2=\"40\" y2=\"18\" />\n      <line x1=\"20\" y1=\"21\" x2=\"36\" y2=\"21\" />\n      <line x1=\"20\" y1=\"24\" x2=\"32\" y2=\"24\" />\n      <circle cx=\"24\" cy=\"42\" r=\"2\" fill=\"currentColor\" />\n      <circle cx=\"36\" cy=\"42\" r=\"2\" fill=\"currentColor\" />\n      <line x1=\"12\" y1=\"32\" x2=\"7\" y2=\"32\" />\n      <line x1=\"48\" y1=\"32\" x2=\"53\" y2=\"32\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Microcontroller", "value": "Tensilica Dual-Core 32-bit LX6" },
    { "label": "Operating Voltage", "value": "3.3V" },
    { "label": "Flash Memory", "value": "4 MB" },
    { "label": "SRAM", "value": "520 KB" },
    { "label": "Clock Speed", "value": "240 MHz" },
    { "label": "Wi-Fi Protocol", "value": "802.11 b/g/n (2.4 GHz)" },
    { "label": "Bluetooth Protocol", "value": "v4.2 BR/EDR and BLE" },
    { "label": "GPIO Pins", "value": "36 (with capacitive touch)" },
    { "label": "ADC Channels", "value": "18 (12-bit)" }
  ],
  "parts": [
    {
      "id": "usb",
      "name": "Micro-USB / Type-C Port",
      "description": "Standard interface for power, uploading firmware, and serial debugging.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "42px",
        "height": "32px",
        "borderRadius": "2px",
        "background": "linear-gradient(90deg, #94a3b8, #cbd5e1)",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 5
      }
    },
    {
      "id": "regulators",
      "name": "Dual Voltage Regulators",
      "description": "Drop USB 5V down to steady 3.3V rails powering module circuits.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "32px",
        "height": "32px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "assembledY": -35,
        "explodedY": -90,
        "zIndex": 4
      }
    },
    {
      "id": "mcu",
      "name": "ESP-WROOM-32 Chip Module",
      "description": "The RF-shielded module enclosing the LX6 CPU, SRAM, flash, and antenna.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "70px",
        "height": "70px",
        "borderRadius": "4px",
        "background": "linear-gradient(180deg, #a1a1aa 0%, #52525b 100%)",
        "border": "1.5px solid #71717a",
        "assembledY": 15,
        "explodedY": -20,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Black Matte PCB",
      "description": "Multi-layer board routing high-frequency signals.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "86px",
        "height": "160px",
        "borderRadius": "6px",
        "background": "linear-gradient(135deg, #18181b, #09090b)",
        "border": "1.5px solid #27272a",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "Header Pins Layout",
      "description": "Dual-row pins breaking out pins for breadboard connectivity.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
      "visual": {
        "width": "78px",
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
      { "name": "3V3", "direction": "Power Output", "voltage": "3.3V", "description": "Regulated 3.3V power output." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground connection." },
      { "name": "GPIO 2", "direction": "GPIO (Built-in LED)", "voltage": "3.3V max", "description": "General Purpose IO Pin 2." },
      { "name": "GPIO 34", "direction": "Input Only (ADC)", "voltage": "0V - 3.3V", "description": "Analog Input Pin 34." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A high-performance wireless SoC board.",
    "whyNeeded": "Crucial for complex IoT networks, edge computing, audio processing, and dual wireless (Wi-Fi + BLE) systems.",
    "howItWorks": "Firmware is compiled and loaded via the USB interface. The dual-core CPU can run networking tasks on Core 0 and user code on Core 1 concurrently, preventing connection lag.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"25\" y=\"10\" width=\"50\" height=\"80\" fill=\"#18181b\" rx=\"3\" />\n        <rect x=\"35\" y=\"25\" width=\"30\" height=\"30\" fill=\"#3f3f46\" />\n        <circle cx=\"42\" cy=\"40\" r=\"3\" fill=\"#a855f7\" />\n        <circle cx=\"58\" cy=\"40\" r=\"3\" fill=\"#3b82f6\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block representing the dual-row ESP32 development module.",
    "usage": "Use as a core control block for advanced IoT schematics."
  },
  "advantages": [
    "Dual 32-bit cores allow multitasking at very high speeds (240MHz)",
    "Includes both Wi-Fi and Bluetooth BLE on a single cheap module",
    "Large number of ADC channels and touch sensing pins built-in"
  ],
  "limitations": [
    "High power consumption compared to standard non-wireless MCUs",
    "GPIO pins operate at 3.3V logic (not 5V tolerant)",
    "A few pins (GPIO 34-39) are input-only and lack pullups"
  ],
  "engineeringTips": [
    "Verify whether the specific GPIO pins are safe to use (some are bootstrap pins).",
    "Use BLE instead of Classic Bluetooth to save battery power in sensors."
  ],
  "commonMistakes": [
    {
      "question": "Board does not enter download mode automatically",
      "answer": "Some DevKits require holding the 'BOOT' button during upload. Once 'Connecting...' appears in IDE, hold Boot for 1 second."
    }
  ],
  "safetyNotes": [
    "Verify logic level match. Never wire 5V sensor outputs to ESP32 inputs."
  ],
  "buyingGuide": {
    "beginnerRating": 4.5,
    "priceRange": "₹500 - ₹750",
    "availability": "High",
    "recommendedAccessories": ["Micro-USB Cable", "Solderless Breadboard", "DHT11 Temp/Humidity Sensor", "OLED Display Module"]
  },
  "bestFor": ["Advanced IoT", "Smart Home Gateways", "Bluetooth beacons", "AI edge audio"],
  "notRecommendedFor": ["Extremely low power battery sleep (requires careful tuning)", "Direct 5V actuator control", "Beginners with zero coding history"],
  "compatibleComponents": ["light-emitting-diode", "fixed-resistor", "relay", "oled", "servo-motor"],
  "nextLearningPath": ["relay", "oled"],
  "comparisonBoards": ["arduino-uno", "esp8266-nodemcu", "raspberry-pi-pico"],
  "comparisonSpecs": {
    "cpu": "Xtensa Dual-Core 32-bit LX6",
    "clockSpeed": "240 MHz",
    "ram": "520 KB SRAM",
    "flash": "4 MB",
    "gpioCount": "36 GPIOs",
    "analogPins": "18 ADC (12-bit), 2 DAC (8-bit)",
    "pwmSupport": "16 Channels",
    "wifi": "802.11 b/g/n (2.4 GHz)",
    "bluetooth": "v4.2 BR/EDR and BLE",
    "usbInterface": "Micro-USB / Type-C",
    "operatingVoltage": "3.3V",
    "programmingEnv": "Arduino IDE, ESP-IDF, MicroPython",
    "typicalPrice": "₹500 - ₹750",
    "bestUseCases": "Advanced IoT, Bluetooth beacons, smart gateways, camera boards"
  },
  "quiz": [
    {
      "question": "How many processor cores does the ESP32 CPU contain?",
      "options": ["1 Core", "2 Cores", "4 Cores", "None"],
      "answer": 1,
      "explanation": "The ESP32 is powered by a dual-core Tensilica Xtensa 32-bit LX6 microprocessor."
    }
  ],
  "buildChallenge": {
    "objective": "Build a Smart Home dashboard server to switch an LED and report chip temperature.",
    "estimatedTime": "20 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "ESP32 DevKit", "slug": "esp32-devkit" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "Micro-USB Cable", "Wi-Fi Network"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Plug the ESP32 into the breadboard center slot.",
        "expectedResult": "Pins fit cleanly."
      },
      {
        "stepNum": 2,
        "text": "Connect the 220Ω Resistor from GPIO 2 to row 20.",
        "expectedResult": "Resistor links to output."
      },
      {
        "stepNum": 3,
        "text": "Connect LED Anode (+) to row 20, LED Cathode (-) to the GND pin row.",
        "expectedResult": "LED indicator wired."
      }
    ],
    "expectedOutput": "The ESP32 hosts a web page showing live CPU temperature and a toggle button to control the LED via network commands.",
    "troubleshooting": [
      {
        "symptom": "Serial Monitor prints random garbage characters",
        "causes": ["Baud rate mismatch"],
        "fixSteps": ["Set the Serial Monitor baud rate to 115200 to match the code setup settings."]
      }
    ],
    "experiments": [
      {
        "title": "Touch switch",
        "description": "Configure GPIO 4 as a capacitive touch input pin to toggle the LED on/off on bare wire touch."
      }
    ],
    "verificationChecklist": [
      "Wi-Fi connected successfully",
      "Web interface triggers LED state",
      "CPU temperature updates on page refresh"
    ],
    "reflectionQuestions": [
      "What is the advantage of using dual-core processing in web servers?",
      "How does capacitive touch sensing work on ESP32 pins?"
    ],
    "relatedProjects": ["Smart Server Board", "Local Bluetooth Beacon"],
    "xpReward": 100,
    "badge": "ESP32 Architect Badge"
  }
};
