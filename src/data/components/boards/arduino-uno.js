export const arduinoUno = {
  "name": "Arduino UNO",
  "slug": "arduino-uno",
  "category": "Development Boards",
  "description": "A popular, beginner-friendly 8-bit microcontroller development board based on the ATmega328P.",
  "status": "completed",
  "mission": "Learn to write firmware and interface physical components with the Arduino UNO.",
  "prerequisites": ["voltage", "current", "light-emitting-diode", "fixed-resistor"],
  "learningOutcomes": [
    "Identify core physical components of the board",
    "Upload custom sketches via Arduino IDE",
    "Control digital outputs and read analog inputs"
  ],
  "typicalValue": "ATmega328P",
  "polarity": "Polarized Power Ports",
  "difficulty": "Beginner",
  "learningTime": "45 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"10\" y=\"15\" width=\"40\" height=\"30\" rx=\"2\" />\n      <rect x=\"5\" y=\"20\" width=\"5\" height=\"8\" />\n      <circle cx=\"42\" cy=\"22\" r=\"2\" fill=\"currentColor\" />\n      <line x1=\"15\" y1=\"15\" x2=\"15\" y2=\"12\" />\n      <line x1=\"25\" y1=\"15\" x2=\"25\" y2=\"12\" />\n      <line x1=\"35\" y1=\"15\" x2=\"35\" y2=\"12\" />\n      <line x1=\"45\" y1=\"15\" x2=\"45\" y2=\"12\" />\n      <line x1=\"15\" y1=\"45\" x2=\"15\" y2=\"48\" />\n      <line x1=\"25\" y1=\"45\" x2=\"25\" y2=\"48\" />\n      <line x1=\"35\" y1=\"45\" x2=\"35\" y2=\"48\" />\n      <line x1=\"45\" y1=\"45\" x2=\"45\" y2=\"48\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Microcontroller", "value": "ATmega328P" },
    { "label": "Operating Voltage", "value": "5V" },
    { "label": "Input Voltage (Recommended)", "value": "7V - 12V" },
    { "label": "Digital I/O Pins", "value": "14 (6 provide PWM)" },
    { "label": "Analog Input Pins", "value": "6" },
    { "label": "DC Current per I/O Pin", "value": "20 mA" },
    { "label": "Flash Memory", "value": "32 KB (0.5 KB used by bootloader)" },
    { "label": "SRAM", "value": "2 KB" },
    { "label": "EEPROM", "value": "1 KB" },
    { "label": "Clock Speed", "value": "16 MHz" }
  ],
  "parts": [
    {
      "id": "usb",
      "name": "USB Type-B Port (Silver metal housing)",
      "description": "Standard USB Type-B interface located on the left edge. Connects to PC to upload sketches and supply 5V power.",
      "connectorY": 80,
      "labelSide": "left",
      "labelY": 80,
      "visual": {
        "width": "42px",
        "height": "36px",
        "borderRadius": "3px",
        "background": "linear-gradient(180deg, #d1d5db, #9ca3af)",
        "border": "1.5px solid #4b5563",
        "assembledY": -80,
        "explodedY": -160,
        "zIndex": 6
      }
    },
    {
      "id": "dc_jack",
      "name": "DC Barrel Jack",
      "description": "Power connector on the bottom-left edge. Accepts 7V - 12V DC input to power the board independently.",
      "connectorY": 140,
      "labelSide": "left",
      "labelY": 140,
      "visual": {
        "width": "30px",
        "height": "36px",
        "borderRadius": "2px",
        "background": "linear-gradient(180deg, #1f2937, #111827)",
        "border": "1px solid #000",
        "assembledY": -30,
        "explodedY": -120,
        "zIndex": 5
      }
    },
    {
      "id": "reset_btn",
      "name": "Reset Button (Red cap)",
      "description": "Tactile switch in the top-left corner. Momentarily shorts the reset pin to GND to restart code execution.",
      "connectorY": 100,
      "labelSide": "right",
      "labelY": 100,
      "visual": {
        "width": "18px",
        "height": "18px",
        "borderRadius": "50%",
        "background": "#ef4444",
        "border": "2px solid #cbd5e1",
        "assembledY": -70,
        "explodedY": -100,
        "zIndex": 6
      }
    },
    {
      "id": "mcu",
      "name": "ATmega328P DIP IC",
      "description": "The main 28-pin Dual In-line Package (DIP) microcontroller chip containing CPU, flash, and SRAM.",
      "connectorY": 240,
      "labelSide": "right",
      "labelY": 240,
      "visual": {
        "width": "140px",
        "height": "28px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1px dashed #fbbf24",
        "assembledY": 30,
        "explodedY": -30,
        "zIndex": 4
      }
    },
    {
      "id": "crystal",
      "name": "16 MHz Crystal Oscillator (Silver can)",
      "description": "Provides precise timing clock pulses for microcontroller operation.",
      "connectorY": 190,
      "labelSide": "left",
      "labelY": 190,
      "visual": {
        "width": "24px",
        "height": "12px",
        "borderRadius": "6px",
        "background": "linear-gradient(90deg, #e2e8f0, #94a3b8)",
        "border": "1px solid #64748b",
        "assembledY": -10,
        "explodedY": -60,
        "zIndex": 5
      }
    },
    {
      "id": "headers",
      "name": "Black Female Header Sockets",
      "description": "Double row black headers routing analog, digital, power, and reset connections.",
      "connectorY": 320,
      "labelSide": "left",
      "labelY": 320,
      "visual": {
        "width": "150px",
        "height": "16px",
        "background": "#000",
        "assembledY": 80,
        "explodedY": 70,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Blue FR4 PCB Board",
      "description": "Double-sided board holding circuit paths and screen-printed component identifiers.",
      "connectorY": 350,
      "labelSide": "right",
      "labelY": 350,
      "visual": {
        "width": "190px",
        "height": "140px",
        "borderRadius": "8px",
        "background": "linear-gradient(135deg, #1d4ed8, #1e40af)",
        "border": "2.5px solid #1d4ed8",
        "assembledY": 120,
        "explodedY": 110,
        "zIndex": 1
      }
    }
  ],
  "pinout": {
    "pins": [
      { "name": "5V", "direction": "Power Output", "voltage": "5V", "description": "Output power pin providing regulated 5V." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground reference pin." },
      { "name": "Pin 13", "direction": "Digital I/O (PWM)", "voltage": "5V max", "description": "Digital Pin 13, connected to the built-in LED." },
      { "name": "Pin A0", "direction": "Analog Input", "voltage": "0V - 5V", "description": "Analog Input Channel 0." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A programmable microcontroller development board.",
    "whyNeeded": "It provides a simple platform to read inputs from sensors and write output control states to parts like motors and displays.",
    "howItWorks": "You write a program (Sketch) in the Arduino IDE and upload it via USB. The board stores it in flash memory, and the microcontroller chip executes the code sequentially, controlling voltage states on its GPIO pins.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"15\" y=\"20\" width=\"70\" height=\"60\" fill=\"#1e3a8a\" rx=\"4\" />\n        <rect x=\"30\" y=\"35\" width=\"40\" height=\"30\" fill=\"#111827\" />\n        <circle cx=\"80\" cy=\"30\" r=\"4\" fill=\"#10b981\" />\n        <circle cx=\"80\" cy=\"45\" r=\"4\" fill=\"#ef4444\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block representing the board's controller pins.",
    "usage": "Use in schematics to represent the main power source and logic driver."
  },
  "advantages": [
    "Huge beginner-friendly community and library ecosystem",
    "Extremely durable to electrical mistakes compared to 3.3V boards",
    "Removable DIP chip can be replaced easily if damaged"
  ],
  "limitations": [
    "Very small RAM (2KB) restricts heavy logic operations",
    "No built-in wireless (Wi-Fi/Bluetooth) connectivity",
    "Slow 16MHz clock limits processing speed"
  ],
  "engineeringTips": [
    "Always separate heavy motor load power loops from Arduino power lines.",
    "Limit continuous current draw per GPIO pin below 20mA."
  ],
  "commonMistakes": [
    {
      "question": "Applying voltages higher than 5V to GPIO pins",
      "answer": "GPIO pins lack overvoltage protection. Connecting high voltages will instantly burn the microcontroller."
    },
    {
      "question": "Omission of common ground reference",
      "answer": "When using external power for sensors, you must link their ground (-) pins to the Arduino GND pin for accurate signals."
    }
  ],
  "safetyNotes": [
    "Never configure wires while the Arduino is plugged into a live USB port.",
    "Do not place the board on metal surfaces while it is powered on."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹500 - ₹700",
    "availability": "High",
    "recommendedAccessories": ["USB Type-B Cable", "Solderless Breadboard", "Jumper Wires Pack", "General Electronics LED kit"]
  },
  "bestFor": ["Learning Electronics", "Robotics", "Education", "Simple Prototyping"],
  "notRecommendedFor": ["Internet of Things (IoT)", "Heavy image processing", "Wearable micro-projects"],
  "compatibleComponents": ["light-emitting-diode", "fixed-resistor", "variable-resistor", "ldr", "thermistor", "buzzer", "servo-motor"],
  "nextLearningPath": ["light-emitting-diode", "variable-resistor", "servo-motor"],
  "comparisonBoards": ["arduino-nano", "esp32-devkit", "raspberry-pi-pico"],
  "comparisonSpecs": {
    "cpu": "ATmega328P (8-bit AVR)",
    "clockSpeed": "16 MHz",
    "ram": "2 KB SRAM",
    "flash": "32 KB",
    "gpioCount": "14 Digital (6 PWM)",
    "analogPins": "6 ADC (10-bit)",
    "pwmSupport": "6 pins",
    "wifi": "No",
    "bluetooth": "No",
    "usbInterface": "USB Type-B",
    "operatingVoltage": "5V",
    "programmingEnv": "Arduino IDE, C/C++",
    "typicalPrice": "₹500 - ₹700 (Clone)",
    "bestUseCases": "Learning basics, simple robotics, beginner electronics"
  },
  "quiz": [
    {
      "question": "What microcontroller chip powers the standard Arduino UNO board?",
      "options": ["ATmega328P", "ESP32", "RP2040", "STM32"],
      "answer": 0,
      "explanation": "The Arduino UNO is built around the ATmega328P 8-bit AVR microcontroller chip."
    },
    {
      "question": "What is the typical operating voltage of the Arduino UNO GPIO pins?",
      "options": ["1.8V", "3.3V", "5V", "12V"],
      "answer": 2,
      "explanation": "The Arduino UNO operates at 5V logic. All input and output GPIO levels are 5V."
    }
  ],
  "buildChallenge": {
    "objective": "Build a basic LED blink circuit controlled by the Arduino UNO Pin 13.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "USB Type-B Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect the 220Ω Resistor from row 10 to row 15 on the breadboard.",
        "expectedResult": "Resistor bridges rows."
      },
      {
        "stepNum": 2,
        "text": "Connect LED Anode (+) to row 15, and LED Cathode (-) to the GND blue rail.",
        "expectedResult": "LED is ready."
      },
      {
        "stepNum": 3,
        "text": "Use a jumper wire to connect Arduino Digital Pin 13 to row 10.",
        "expectedResult": "Arduino drives resistor."
      },
      {
        "stepNum": 4,
        "text": "Connect Arduino GND to the blue GND rail.",
        "expectedResult": "Ground loop is closed."
      }
    ],
    "expectedOutput": "When you upload the standard 'Blink' example code, the LED on the breadboard turns on for 1 second, then off for 1 second repeatedly.",
    "troubleshooting": [
      {
        "symptom": "LED does not blink",
        "causes": ["LED is connected backwards", "IDE selected wrong COM port"],
        "fixSteps": ["Verify LED anode (longer leg) points to row 15. Check port configuration in IDE."]
      }
    ],
    "experiments": [
      {
        "title": "Blink rate change",
        "description": "Change delay values in the code from 1000 to 200 milliseconds to speed up the blink rate."
      }
    ],
    "verificationChecklist": [
      "Arduino Pin 13 wired to Resistor",
      "GND connection matches ground rail",
      "Code compiles and uploads successfully"
    ],
    "reflectionQuestions": [
      "Why is a resistor necessary in series with the LED when using a 5V supply?",
      "Explain what the 'setup' and 'loop' functions do in Arduino code."
    ],
    "relatedProjects": ["Flashing Beacon", "Siren Alarm Alarm"],
    "xpReward": 80,
    "badge": "Uno Pilot Badge"
  }
};
