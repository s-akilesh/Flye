export const arduinoNano = {
  "name": "Arduino Nano",
  "slug": "arduino-nano",
  "category": "Development Boards",
  "description": "A compact, breadboard-friendly 8-bit development board based on the ATmega328P, sharing the same architecture as the UNO in a smaller form factor.",
  "status": "completed",
  "mission": "Learn to utilize compact controllers in small physical spaces.",
  "prerequisites": ["voltage", "current", "light-emitting-diode", "fixed-resistor"],
  "learningOutcomes": [
    "Assemble and power projects using a breadboard",
    "Identify Nano pin alignments",
    "Interface mini actuators and indicator LEDs"
  ],
  "typicalValue": "ATmega328P (SMD)",
  "polarity": "Polarized Power Ports",
  "difficulty": "Beginner",
  "learningTime": "35 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"10\" width=\"30\" height=\"40\" rx=\"2\" />\n      <rect x=\"25\" y=\"5\" width=\"10\" height=\"5\" />\n      <circle cx=\"30\" cy=\"25\" r=\"2\" fill=\"currentColor\" />\n      <line x1=\"15\" y1=\"15\" x2=\"10\" y2=\"15\" />\n      <line x1=\"15\" y1=\"25\" x2=\"10\" y2=\"25\" />\n      <line x1=\"15\" y1=\"35\" x2=\"10\" y2=\"35\" />\n      <line x1=\"15\" y1=\"45\" x2=\"10\" y2=\"45\" />\n      <line x1=\"45\" y1=\"15\" x2=\"50\" y2=\"15\" />\n      <line x1=\"45\" y1=\"25\" x2=\"50\" y2=\"25\" />\n      <line x1=\"45\" y1=\"35\" x2=\"50\" y2=\"35\" />\n      <line x1=\"45\" y1=\"45\" x2=\"50\" y2=\"45\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Microcontroller", "value": "ATmega328P" },
    { "label": "Operating Voltage", "value": "5V" },
    { "label": "Input Voltage (VIN)", "value": "7V - 12V" },
    { "label": "Digital I/O Pins", "value": "14 (6 provide PWM)" },
    { "label": "Analog Input Pins", "value": "8 (2 more than UNO)" },
    { "label": "DC Current per I/O Pin", "value": "20 mA" },
    { "label": "Flash Memory", "value": "32 KB (2 KB used by bootloader)" },
    { "label": "SRAM", "value": "2 KB" },
    { "label": "Clock Speed", "value": "16 MHz" }
  ],
  "parts": [
    {
      "id": "usb",
      "name": "Mini-USB Port",
      "description": "Compact USB connector for power delivery and serial uploading.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "44px",
        "height": "36px",
        "borderRadius": "2px",
        "background": "linear-gradient(90deg, #94a3b8, #cbd5e1)",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 4
      }
    },
    {
      "id": "mcu",
      "name": "ATmega328P Chip (SMD)",
      "description": "Small surface-mount microcontroller chip running the firmware program code.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "36px",
        "height": "36px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1px solid #4b5563",
        "assembledY": -20,
        "explodedY": -60,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Blue Mini PCB",
      "description": "Double-sided miniature circuit board routing traces between elements.",
      "connectorY": 260,
      "labelSide": "left",
      "labelY": 260,
      "visual": {
        "width": "64px",
        "height": "140px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #1d4ed8, #1e3a8a)",
        "assembledY": 50,
        "explodedY": 30,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "Dual-Inline Male Header Pins",
      "description": "Two rows of 15 pins designed to plug directly into breadboards.",
      "connectorY": 340,
      "labelSide": "right",
      "labelY": 340,
      "visual": {
        "width": "54px",
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
      { "name": "VIN", "direction": "Power Input", "voltage": "7V - 12V", "description": "External raw voltage supply pin." },
      { "name": "5V", "direction": "Power Output", "voltage": "5V", "description": "Regulated 5V output." },
      { "name": "D2", "direction": "Digital I/O", "voltage": "5V max", "description": "Digital Input/Output Pin 2." },
      { "name": "A0", "direction": "Analog Input", "voltage": "0V - 5V", "description": "Analog Input Pin 0." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A miniature development board for compact builds.",
    "whyNeeded": "Allows breadboard prototyping with identical code and functionality as larger boards, saving substantial physical layout space.",
    "howItWorks": "Identical operation to the UNO. The code is compiled by the compiler and flashed via the USB-to-Serial converter chip (such as CH340 or FT232RL) into the ATmega328P chip's flash memory.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"30\" y=\"10\" width=\"40\" height=\"80\" fill=\"#1e40af\" rx=\"2\" />\n        <rect x=\"40\" y=\"30\" width=\"20\" height=\"20\" fill=\"#000\" />\n        <circle cx=\"50\" cy=\"65\" r=\"3\" fill=\"#fff\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block symbol representing the compact Nano dual-row footprints.",
    "usage": "Place in schematics to represent mini-controller nodes."
  },
  "advantages": [
    "Plugs directly into standard solderless breadboards",
    "Extremely compact size (45mm x 18mm) and light weight",
    "Provides 2 extra analog inputs (A6 and A7) compared to the UNO"
  ],
  "limitations": [
    "Mini-USB or micro-USB port is fragile under heavy cable pulling",
    "Limited current dissipation due to small voltage regulator size",
    "Requires driver software setup (CH340) for generic clones"
  ],
  "engineeringTips": [
    "Do not pull more than 100mA total from the 5V pin when powered via VIN.",
    "Ensure pins are straight before pressing into breadboard sockets."
  ],
  "commonMistakes": [
    {
      "question": "Selecting wrong bootloader setting in Arduino IDE",
      "answer": "Nano clones often use the 'Old Bootloader' setting. If uploading fails, change Processor in Tools to 'ATmega328P (Old Bootloader)'."
    }
  ],
  "safetyNotes": [
    "Always check for copper shards or wires under the breadboard to prevent short circuits."
  ],
  "buyingGuide": {
    "beginnerRating": 4.5,
    "priceRange": "₹300 - ₹450",
    "availability": "High",
    "recommendedAccessories": ["Mini-USB/Type-C Cable", "Solderless Breadboard", "Jumper Wires"]
  },
  "bestFor": ["Breadboard Prototyping", "Compact Wearables", "Small Robotics"],
  "notRecommendedFor": ["Internet of Things (IoT)", "Memory-intensive tasks", "High power loads control"],
  "compatibleComponents": ["light-emitting-diode", "fixed-resistor", "ldr", "buzzer", "servo-motor"],
  "nextLearningPath": ["ldr", "buzzer"],
  "comparisonBoards": ["arduino-uno", "esp32-devkit", "raspberry-pi-pico"],
  "comparisonSpecs": {
    "cpu": "ATmega328P (8-bit AVR)",
    "clockSpeed": "16 MHz",
    "ram": "2 KB SRAM",
    "flash": "32 KB",
    "gpioCount": "14 Digital (6 PWM)",
    "analogPins": "8 ADC (10-bit)",
    "pwmSupport": "6 pins",
    "wifi": "No",
    "bluetooth": "No",
    "usbInterface": "Mini-USB / Type-C",
    "operatingVoltage": "5V",
    "programmingEnv": "Arduino IDE, C/C++",
    "typicalPrice": "₹300 - ₹450",
    "bestUseCases": "Small compact projects, breadboard prototyping"
  },
  "quiz": [
    {
      "question": "Which analog pins does the Arduino Nano have that the Arduino UNO does not?",
      "options": ["A0 and A1", "A4 and A5", "A6 and A7", "None"],
      "answer": 2,
      "explanation": "Due to its SMD package, the Arduino Nano breaks out two extra ADC channels: A6 and A7."
    }
  ],
  "buildChallenge": {
    "objective": "Build a mini Traffic Signal light sequence using the Arduino Nano.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "Arduino Nano", "slug": "arduino-nano" },
      { "name": "Red LED", "slug": "light-emitting-diode" },
      { "name": "Yellow LED", "slug": "light-emitting-diode" },
      { "name": "Green LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistors", "slug": "fixed-resistor" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Insert the Arduino Nano into the center split channel of the breadboard.",
        "expectedResult": "Pins plug cleanly into separate rows."
      },
      {
        "stepNum": 2,
        "text": "Connect three 220Ω Resistors from pins D2, D3, and D4 to open breadboard rows.",
        "expectedResult": "Outputs are linked to resistors."
      },
      {
        "stepNum": 3,
        "text": "Connect the anodes (+) of Red, Yellow, and Green LEDs to those resistors, and all cathodes (-) to Arduino GND row.",
        "expectedResult": "Traffic LEDs are powered in series."
      }
    ],
    "expectedOutput": "The traffic signal lights sequence: Green for 5 seconds, Yellow for 2 seconds, and Red for 5 seconds repeatedly.",
    "troubleshooting": [
      {
        "symptom": "Uploading code fails immediately",
        "causes": ["Incorrect driver / port selected", "Old bootloader mismatch"],
        "fixSteps": ["Go to Tools -> Processor and select 'ATmega328P (Old Bootloader)'."]
      }
    ],
    "experiments": [
      {
        "title": "Pedestrian push button",
        "description": "Add a push button on pin D5 to change the lights immediately on press."
      }
    ],
    "verificationChecklist": [
      "Nano fits flush in breadboard",
      "Red, Yellow, Green LEDs cycle correctly",
      "Old bootloader chosen if using clone board"
    ],
    "reflectionQuestions": [
      "Why is the Nano preferred over the UNO for breadboard designs?",
      "How many total digital inputs can be configured on the Nano?"
    ],
    "relatedProjects": ["Traffic Signal Prototyper", "Mini Alarm Console"],
    "xpReward": 80,
    "badge": "Nano Pilot Badge"
  }
};
