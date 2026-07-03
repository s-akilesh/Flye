export const raspberryPiPico = {
  "name": "Raspberry Pi Pico",
  "slug": "raspberry-pi-pico",
  "category": "Development Boards",
  "description": "A high-performance microcontroller board featuring the RP2040 chip designed by Raspberry Pi, offering flexible digital interfaces and dual ARM cores.",
  "status": "completed",
  "mission": "Explore dual-core ARM Cortex-M0+ processing and MicroPython programming.",
  "prerequisites": ["voltage", "current", "light-emitting-diode", "fixed-resistor"],
  "learningOutcomes": [
    "Upload firmware using drag-and-drop UF2 files",
    "Program scripts in MicroPython using Thonny IDE",
    "Utilize programmable I/O (PIO) blocks"
  ],
  "typicalValue": "RP2040",
  "polarity": "Polarized Power Ports",
  "difficulty": "Intermediate",
  "learningTime": "45 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"16\" y=\"10\" width=\"28\" height=\"40\" rx=\"2\" />\n      <rect x=\"26\" y=\"5\" width=\"8\" height=\"5\" />\n      <circle cx=\"30\" cy=\"20\" r=\"3\" fill=\"currentColor\" />\n      <line x1=\"16\" y1=\"15\" x2=\"12\" y2=\"15\" />\n      <line x1=\"16\" y1=\"25\" x2=\"12\" y2=\"25\" />\n      <line x1=\"16\" y1=\"35\" x2=\"12\" y2=\"35\" />\n      <line x1=\"16\" y1=\"45\" x2=\"12\" y2=\"45\" />\n      <line x1=\"44\" y1=\"15\" x2=\"48\" y2=\"15\" />\n      <line x1=\"44\" y1=\"25\" x2=\"48\" y2=\"25\" />\n      <line x1=\"44\" y1=\"35\" x2=\"48\" y2=\"35\" />\n      <line x1=\"44\" y1=\"45\" x2=\"48\" y2=\"45\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Microcontroller", "value": "RP2040 Dual-core ARM Cortex-M0+" },
    { "label": "Operating Voltage", "value": "3.3V" },
    { "label": "Input Voltage (USB)", "value": "5V" },
    { "label": "Flash Memory", "value": "2 MB" },
    { "label": "SRAM", "value": "264 KB" },
    { "label": "Clock Speed", "value": "133 MHz" },
    { "label": "GPIO Pins", "value": "26 (with 3 ADC)" },
    { "label": "Analog Input Pins", "value": "3 (12-bit)" },
    { "label": "USB Interface", "value": "Micro-USB" }
  ],
  "parts": [
    {
      "id": "usb",
      "name": "Micro-USB Connector",
      "description": "Used to supply power and download firmware using drag-and-drop UF2 files.",
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
      "id": "bootsel",
      "name": "BOOTSEL Button",
      "description": "Used during boot up to mount the Pico as a USB mass storage drive.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "20px",
        "height": "20px",
        "borderRadius": "50%",
        "background": "#dc2626",
        "assembledY": -35,
        "explodedY": -90,
        "zIndex": 4
      }
    },
    {
      "id": "mcu",
      "name": "RP2040 chip",
      "description": "Dual-core ARM Cortex M0+ chip designed directly by Raspberry Pi.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "48px",
        "height": "48px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1.5px solid #4b5563",
        "assembledY": 15,
        "explodedY": -20,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Green Pico PCB",
      "description": "Compact double-sided board with castellated hole edges.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "74px",
        "height": "150px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #047857, #065f46)",
        "border": "1.5px solid #065f46",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "Castellated Pins",
      "description": "Edge pins allowing direct soldering onto carrier boards or header mounts.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
      "visual": {
        "width": "68px",
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
      { "name": "3V3 Out", "direction": "Power Output", "voltage": "3.3V", "description": "3.3V power supply output." },
      { "name": "GND", "direction": "Ground", "voltage": "0V", "description": "Common ground pin." },
      { "name": "GP25", "direction": "Digital I/O (Built-in LED)", "voltage": "3.3V max", "description": "General Purpose IO Pin 25." },
      { "name": "GP26", "direction": "GPIO (ADC0)", "voltage": "0V - 3.3V", "description": "Analog Input Pin 26." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A flexible dual-core ARM microcontroller board.",
    "whyNeeded": "Excellent for learning MicroPython, high-speed IO triggering, and customized state machines (PIO).",
    "howItWorks": "Firmware is compiled or loaded. If using MicroPython, the internal Python interpreter reads code saved to flash, running tasks across the ARM cores.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"30\" y=\"10\" width=\"40\" height=\"80\" fill=\"#047857\" rx=\"2\" />\n        <rect x=\"42\" y=\"35\" width=\"16\" height=\"16\" fill=\"#022c22\" />\n        <circle cx=\"50\" cy=\"65\" r=\"3\" fill=\"#ef4444\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block representation showing Pi Pico GPIO lines.",
    "usage": "Use as a main logic driver in MicroPython designs."
  },
  "advantages": [
    "Dual ARM Cortex cores run complex computations at 133MHz",
    "Castellated edges allow surface-mounting directly onto custom PCBs",
    "Programmable I/O (PIO) blocks run custom hardware state machines independently"
  ],
  "limitations": [
    "No built-in Wi-Fi or Bluetooth (requires Pico W version)",
    "Output current per pin is lower (max ~5mA) compared to AVR",
    "Micro-USB port is fragile under heavy mechanical force"
  ],
  "engineeringTips": [
    "Use PIO blocks to offload critical timing signals from the main CPU cores.",
    "Keep current load per pin under 4mA for signal stability."
  ],
  "commonMistakes": [
    {
      "question": "Pico does not appear as a USB drive",
      "answer": "You must hold down the white 'BOOTSEL' button *before* inserting the USB cable. Release it after plugging in."
    }
  ],
  "safetyNotes": [
    "Ensure input voltage limits are observed on ADC pins (max 3.3V)."
  ],
  "buyingGuide": {
    "beginnerRating": 4.5,
    "priceRange": "₹350 - ₹500",
    "availability": "High",
    "recommendedAccessories": ["Micro-USB Cable", "Solderless Breadboard", "Header Pins", "Connecting wires"]
  },
  "bestFor": ["MicroPython Learning", "High-speed IO tasks", "Custom state machine designs"],
  "notRecommendedFor": ["Wireless projects (without Pico W)", "Direct 5V voltage logic controllers", "Complex graphic displays control"],
  "compatibleComponents": ["light-emitting-diode", "fixed-resistor", "variable-resistor", "buzzer"],
  "nextLearningPath": ["variable-resistor", "buzzer"],
  "comparisonBoards": ["arduino-uno", "arduino-nano", "esp32-devkit"],
  "comparisonSpecs": {
    "cpu": "RP2040 Dual-core ARM Cortex M0+",
    "clockSpeed": "133 MHz",
    "ram": "264 KB SRAM",
    "flash": "2 MB",
    "gpioCount": "26 GPIOs",
    "analogPins": "3 ADC (12-bit)",
    "pwmSupport": "16 Channels",
    "wifi": "No",
    "bluetooth": "No",
    "usbInterface": "Micro-USB",
    "operatingVoltage": "3.3V",
    "programmingEnv": "C/C++ SDK, MicroPython, Arduino",
    "typicalPrice": "₹350 - ₹500",
    "bestUseCases": "High-speed IO control, MicroPython learning, PIO processing"
  },
  "quiz": [
    {
      "question": "What custom chip designed by Raspberry Pi powers the Pico board?",
      "options": ["ATmega328P", "RP2040", "ESP32", "ARM9"],
      "answer": 1,
      "explanation": "The Raspberry Pi Pico is powered by the RP2040 dual-core ARM Cortex-M0+ microcontroller chip."
    }
  ],
  "buildChallenge": {
    "objective": "Build a temperature indicator buzzer alarm using Raspberry Pi Pico.",
    "estimatedTime": "20 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "Raspberry Pi Pico", "slug": "raspberry-pi-pico" },
      { "name": "Buzzer", "slug": "buzzer" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Thonny IDE", "Micro-USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Insert the Raspberry Pi Pico into the breadboard center slot.",
        "expectedResult": "Pins align correctly."
      },
      {
        "stepNum": 2,
        "text": "Connect the Buzzer positive (+) pin to GP15 pin row.",
        "expectedResult": "Buzzer is linked to output."
      },
      {
        "stepNum": 3,
        "text": "Connect the Buzzer negative (-) pin to a Pico GND pin row.",
        "expectedResult": "Ground connection completed."
      }
    ],
    "expectedOutput": "The Pico reads its built-in internal chip temperature sensor. If the temperature exceeds 30°C, it activates the GP15 pin, sounding the buzzer.",
    "troubleshooting": [
      {
        "symptom": "Thonny IDE fails to connect to Pico",
        "causes": ["Incorrect interpreter configuration", "USB cable lacks data lines"],
        "fixSteps": ["Check that interpreter in Thonny is set to 'MicroPython (Raspberry Pi Pico)'. Use a known-good data USB cable."]
      }
    ],
    "experiments": [
      {
        "title": "Temperature trigger change",
        "description": "Change the code trigger temperature limit in your Python script to test the alarm at cooler thresholds."
      }
    ],
    "verificationChecklist": [
      "MicroPython interpreter is working in Thonny",
      "Pico reads chip temperature successfully",
      "Buzzer activates on heat trigger threshold"
    ],
    "reflectionQuestions": [
      "How is the Pico's built-in ADC used to read its internal temperature?",
      "Explain the process of loading a .uf2 file onto the Pico."
    ],
    "relatedProjects": ["Temperature Overheat Alarm", "MicroPython Signal Beacon"],
    "xpReward": 90,
    "badge": "Pico Pioneer Badge"
  }
};
