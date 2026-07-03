export const esp8266Nodemcu = {
  "name": "ESP8266 NodeMCU",
  "slug": "esp8266-nodemcu",
  "category": "Development Boards",
  "description": "An open-source firmware and development kit that helps you to prototype your IoT product with a few Lua script lines or Arduino C++ code, built around the ESP-12E Wi-Fi module.",
  "status": "completed",
  "mission": "Learn to connect embedded systems to local Wi-Fi networks.",
  "prerequisites": ["voltage", "current", "light-emitting-diode", "fixed-resistor"],
  "learningOutcomes": [
    "Connect board to local Wi-Fi hotspots",
    "Switch GPIO pins remotely over HTTP protocols",
    "Collect remote telemetry indicators"
  ],
  "typicalValue": "ESP8266 (ESP-12E)",
  "polarity": "Polarized Power Ports",
  "difficulty": "Intermediate",
  "learningTime": "40 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"10\" width=\"30\" height=\"40\" rx=\"2\" />\n      <rect x=\"20\" y=\"15\" width=\"20\" height=\"12\" fill=\"none\" />\n      <line x1=\"22\" y1=\"18\" x2=\"38\" y2=\"18\" />\n      <line x1=\"22\" y1=\"21\" x2=\"34\" y2=\"21\" />\n      <line x1=\"22\" y1=\"24\" x2=\"30\" y2=\"24\" />\n      <rect x=\"25\" y=\"38\" width=\"10\" height=\"5\" />\n      <line x1=\"15\" y1=\"32\" x2=\"10\" y2=\"32\" />\n      <line x1=\"45\" y1=\"32\" x2=\"50\" y2=\"32\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Microcontroller", "value": "Tensilica L106 32-bit" },
    { "label": "Operating Voltage", "value": "3.3V" },
    { "label": "Input Voltage (USB)", "value": "5V" },
    { "label": "Flash Memory", "value": "4 MB" },
    { "label": "SRAM", "value": "64 KB Instruction, 96 KB Data" },
    { "label": "Clock Speed", "value": "80 MHz / 160 MHz" },
    { "label": "Wi-Fi Protocol", "value": "802.11 b/g/n (2.4 GHz)" },
    { "label": "GPIO Pins", "value": "17 (most multiplexed)" },
    { "label": "ADC Channels", "value": "1 (10-bit, 0V - 1.0V max)" }
  ],
  "parts": [
    {
      "id": "usb",
      "name": "Micro-USB Connector",
      "description": "Supplies power and connects CP2102 driver for programming.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "40px",
        "height": "30px",
        "borderRadius": "2px",
        "background": "linear-gradient(90deg, #94a3b8, #cbd5e1)",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 5
      }
    },
    {
      "id": "bridge",
      "name": "CP2102 USB-to-UART Bridge",
      "description": "Silicon Labs chip converting USB signals to serial TTL commands.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "30px",
        "height": "30px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "assembledY": -35,
        "explodedY": -90,
        "zIndex": 4
      }
    },
    {
      "id": "mcu",
      "name": "ESP-12E Wi-Fi Module",
      "description": "Metal shield housing the Tensilica CPU and integrated PCB Wi-Fi antenna.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "64px",
        "height": "64px",
        "borderRadius": "4px",
        "background": "linear-gradient(180deg, #94a3b8 0%, #475569 100%)",
        "border": "1.5px solid #64748b",
        "assembledY": 15,
        "explodedY": -20,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Black NodeMCU PCB",
      "description": "Double-sided circuit board carrying all traces.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "80px",
        "height": "150px",
        "borderRadius": "6px",
        "background": "linear-gradient(135deg, #1e293b, #0f172a)",
        "border": "1.5px solid #334155",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "Dual-Inline Male Header Pins",
      "description": "Pins breaking out GPIO lanes for breadboard use.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
      "visual": {
        "width": "74px",
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
      { "name": "3V3", "direction": "Power Output", "voltage": "3.3V", "description": "3.3V Output pin." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "D1", "direction": "GPIO (I2C SCL)", "voltage": "3.3V max", "description": "GPIO 5 pin." },
      { "name": "A0", "direction": "Analog Input", "voltage": "0V - 3.3V", "description": "Analog pin (attenuated on board to 1.0V chip limit)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A Wi-Fi enabled microcontroller board.",
    "whyNeeded": "Enables sending telemetry data over local networks and running web servers to trigger physical pins.",
    "howItWorks": "You program the board using the Arduino IDE. The MCU chip executes the control instructions, and the internal Wi-Fi stack manages networking protocols to communicate with routers and servers.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"30\" y=\"10\" width=\"40\" height=\"80\" fill=\"#0f172a\" rx=\"2\" />\n        <path d=\"M35,25 Q50,15 65,25\" stroke=\"#fbbf24\" stroke-width=\"4\" fill=\"none\" />\n        <path d=\"M40,35 Q50,28 60,35\" stroke=\"#fbbf24\" stroke-width=\"4\" fill=\"none\" />\n        <circle cx=\"50\" cy=\"45\" r=\"4\" fill=\"#fbbf24\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block representation for ESP8266 pins.",
    "usage": "Use as a main controller in IoT schematics."
  },
  "advantages": [
    "Very cheap way to add Wi-Fi capabilities to projects",
    "Large flash storage (4MB) compared to Arduino boards",
    "Supported by Arduino IDE library ecosystem"
  ],
  "limitations": [
    "Only has 1 analog input pin with a 1V chip limit",
    "GPIO logic operates at 3.3V, not 5V tolerant",
    "Wi-Fi consumes high peak currents during transmission"
  ],
  "engineeringTips": [
    "Never connect 5V signals directly to ESP8266 GPIO pins without level shifters.",
    "Ensure power supplies can deliver at least 500mA to prevent Wi-Fi brownouts."
  ],
  "commonMistakes": [
    {
      "question": "Connecting 5V sensors directly to input pins",
      "answer": "ESP8266 inputs are not 5V tolerant. Directly wiring 5V inputs will fry the internal silicon."
    }
  ],
  "safetyNotes": [
    "Peak Wi-Fi currents can drop USB voltages; use quality power leads."
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹350 - ₹500",
    "availability": "High",
    "recommendedAccessories": ["Micro-USB Cable", "Solderless Breadboard", "5V 1A USB Power Adapter"]
  },
  "bestFor": ["IoT Projects", "Smart Home Sensors", "Wi-Fi Web Server Demos"],
  "notRecommendedFor": ["High pin count needs", "Bluetooth applications", "Analog sensor arrays"],
  "compatibleComponents": ["light-emitting-diode", "fixed-resistor", "relay", "oled"],
  "nextLearningPath": ["relay", "oled"],
  "comparisonBoards": ["arduino-uno", "esp32-devkit"],
  "comparisonSpecs": {
    "cpu": "Tensilica L106 (32-bit)",
    "clockSpeed": "80 MHz / 160 MHz",
    "ram": "80 KB User RAM",
    "flash": "4 MB",
    "gpioCount": "17 GPIOs",
    "analogPins": "1 ADC (10-bit, 1.0V max)",
    "pwmSupport": "All GPIO (except D0)",
    "wifi": "802.11 b/g/n (2.4 GHz)",
    "bluetooth": "No",
    "usbInterface": "Micro-USB",
    "operatingVoltage": "3.3V",
    "programmingEnv": "Arduino IDE, MicroPython, Lua",
    "typicalPrice": "₹350 - ₹500",
    "bestUseCases": "Basic IoT nodes, smart home sensors, Wi-Fi relays"
  },
  "quiz": [
    {
      "question": "What is the logic level voltage rating of the ESP8266 NodeMCU?",
      "options": ["1.8V", "3.3V", "5V", "12V"],
      "answer": 1,
      "explanation": "The ESP8266 uses 3.3V logic levels. Connecting 5V signals directly can damage the chip."
    }
  ],
  "buildChallenge": {
    "objective": "Build a local Wi-Fi control switch to toggle an LED remotely.",
    "estimatedTime": "20 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "ESP8266 NodeMCU", "slug": "esp8266-nodemcu" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "Micro-USB Cable", "Wi-Fi Router/Hotspot"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Insert the ESP8266 into the breadboard so pins bridge the center gap.",
        "expectedResult": "Pins align correctly."
      },
      {
        "stepNum": 2,
        "text": "Connect the 220Ω Resistor from Pin D1 to row 20.",
        "expectedResult": "Resistor is connected to output."
      },
      {
        "stepNum": 3,
        "text": "Connect LED Anode (+) to row 20, LED Cathode (-) to the GND pin row.",
        "expectedResult": "LED is wired."
      }
    ],
    "expectedOutput": "The ESP8266 hosts a local web server. Accessing the IP address in your browser displays a page with buttons to turn the LED ON and OFF.",
    "troubleshooting": [
      {
        "symptom": "ESP8266 fails to connect to Wi-Fi",
        "causes": ["Incorrect SSID or Password in code", "Router blocking 2.4GHz connections"],
        "fixSteps": ["Check spelling in SSID string. Ensure router has 2.4GHz enabled."]
      }
    ],
    "experiments": [
      {
        "title": "Local network page control",
        "description": "Trigger the LED via commands sent from a mobile phone connected to the same Wi-Fi network."
      }
    ],
    "verificationChecklist": [
      "Wi-Fi connection established (Serial print confirms)",
      "Web page loads on phone/laptop",
      "LED toggles correctly"
    ],
    "reflectionQuestions": [
      "Why does the ESP8266 require 2.4GHz Wi-Fi instead of 5GHz?",
      "How is an IP address assigned to the ESP8266 by the router?"
    ],
    "relatedProjects": ["Wi-Fi Switch Board", "IoT Weather Hub"],
    "xpReward": 90,
    "badge": "IoT Apprentice Badge"
  }
};
