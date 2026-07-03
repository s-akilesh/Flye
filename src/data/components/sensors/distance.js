export const ultrasonicSensor = {
  "name": "Ultrasonic Sensor (HC-SR04)",
  "slug": "ultrasonic-sensor",
  "category": "Sensors",
  "description": "An active distance measurement sensor that uses ultrasonic sound waves to detect the proximity of objects without physical contact.",
  "status": "completed",
  "measures": "Distance",
  "outputType": "Trigger + Echo",
  "operatingVoltage": "5V",
  "logicLevel": "5V TTL (Requires divider for 3.3V boards)",
  "powerConsumption": "15mA",
  "mission": "Learn to calculate distance by measuring sound wave travel times.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Trigger ultrasonic sound bursts via software pin control",
    "Calculate distances based on echo echo pulse width timing",
    "Interface 5V echo levels with 3.3V microcontroller logic inputs"
  ],
  "typicalValue": "HC-SR04",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "30 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"10\" y=\"15\" width=\"40\" height=\"30\" rx=\"2\" />\n      <circle cx=\"22\" cy=\"30\" r=\"8\" />\n      <circle cx=\"38\" cy=\"30\" r=\"8\" />\n      <circle cx=\"22\" cy=\"30\" r=\"2\" fill=\"currentColor\" />\n      <circle cx=\"38\" cy=\"30\" r=\"2\" fill=\"currentColor\" />\n      <line x1=\"20\" y1=\"45\" x2=\"20\" y2=\"50\" />\n      <line x1=\"27\" y1=\"45\" x2=\"27\" y2=\"50\" />\n      <line x1=\"33\" y1=\"45\" x2=\"33\" y2=\"50\" />\n      <line x1=\"40\" y1=\"45\" x2=\"40\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "5V DC" },
    { "label": "Static Current", "value": "< 2mA" },
    { "label": "Output Signal", "value": "Electric frequency signal, high level 5V, low level 0V" },
    { "label": "Sensor Angle", "value": "< 15 degrees" },
    { "label": "Detection Distance", "value": "2cm - 400cm" },
    { "label": "High Precision", "value": "Up to 3mm" }
  ],
  "parts": [
    {
      "id": "transmitter",
      "name": "Ultrasonic Transmitter (T)",
      "description": "Emits high-frequency ultrasonic sound pulses at 40 kHz.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "48px",
        "height": "48px",
        "borderRadius": "50%",
        "background": "radial-gradient(circle, #cbd5e1 30%, #475569 100%)",
        "border": "2.5px solid #94a3b8",
        "assembledY": -80,
        "explodedY": -150,
        "zIndex": 4
      }
    },
    {
      "id": "receiver",
      "name": "Ultrasonic Receiver (R)",
      "description": "Detects the returning echoed sound waves reflected from objects.",
      "connectorY": 160,
      "labelSide": "right",
      "labelY": 160,
      "visual": {
        "width": "48px",
        "height": "48px",
        "borderRadius": "50%",
        "background": "radial-gradient(circle, #cbd5e1 30%, #475569 100%)",
        "border": "2.5px solid #94a3b8",
        "assembledY": -80,
        "explodedY": -100,
        "zIndex": 4
      }
    },
    {
      "id": "mcu",
      "name": "Control IC (Max3232/similar)",
      "description": "Processes trigger input commands and converts returning transducers analog signals into high/low digital pulses.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "40px",
        "height": "30px",
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
      "name": "Sensor Board PCB",
      "description": "Dual-sided green PCB holding passive resistors, capacitors, and transistor drivers.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "120px",
        "height": "70px",
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
      "name": "4-pin Header Block",
      "description": "VCC, Trig, Echo, and GND connection terminals.",
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
      { "name": "VCC", "direction": "Power Input", "voltage": "5V", "description": "Positive power supply terminal." },
      { "name": "Trig", "direction": "Digital Input", "voltage": "5V max", "description": "Trigger pin to start measurement (10µs pulse)." },
      { "name": "Echo", "direction": "Digital Output", "voltage": "5V TTL", "description": "Echo pulse output pin (pulse width represents travel duration)." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Ground negative power terminal." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A time-of-flight distance measurement sensor.",
    "whyNeeded": "Enables obstacle detection, collision avoidance, and fluid level measurement without contact.",
    "howItWorks": "A 10-microsecond high pulse is sent to the Trig pin. The sensor responds by emitting an 8-cycle burst of ultrasound at 40 kHz. The Echo pin goes high immediately and remains high until the sensor detects the returning reflected sound wave. By measuring the duration the Echo pin was high, distance is calculated as: Distance = (Echo Duration * Speed of Sound) / 2.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"10\" y=\"40\" width=\"30\" height=\"30\" fill=\"#047857\" rx=\"2\" />\n        <path d=\"M45,45 C50,40 55,40 60,45 M48,48 C52,44 56,44 60,48 M50,52 C53,49 56,49 59,52\" stroke=\"#60a5fa\" stroke-width=\"2\" stroke-linecap=\"round\" fill=\"none\" />\n        <circle cx=\"80\" cy=\"50\" r=\"8\" fill=\"#cbd5e1\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block representing the Trig, Echo, power, and ground connections.",
    "usage": "Connect Trig to a digital output pin and Echo to a digital input pin."
  },
  "advantages": [
    "Not affected by object color, transparency, or ambient lighting levels",
    "Extremely cheap and widely available sensor",
    "High accuracy up to 3mm at short ranges"
  ],
  "limitations": [
    "Inaccurate readings when detecting soft fabrics or highly angled surfaces which absorb/scatter sound waves",
    "Requires a 5V supply, meaning a voltage divider is needed for 3.3V boards to avoid overvoltage on the Echo pin",
    "Limited detection range (up to 4 meters max)"
  ],
  "engineeringTips": [
    "Use a simple voltage divider (1kΩ and 2kΩ resistors) on the Echo line when interfacing with 3.3V controllers like ESP32 or Raspberry Pi Pico.",
    "Introduce a small delay (e.g. 50ms) between sequential measurements to allow scattered acoustic reflections to dissipate."
  ],
  "commonMistakes": [
    {
      "question": "Echo pin outputting 0V constantly on 3.3V controllers",
      "answer": "If Echo pin outputting 0V, verify the sensor VCC has a stable 5V source. Many HC-SR04 models will not function if powered at 3.3V."
    }
  ],
  "safetyNotes": [
    "Avoid touch contact with transducer metal cases during operation as they vibrate at high frequency."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹100 - ₹180",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller Board", "Resistors (1kΩ, 2kΩ)", "Breadboard", "Jumper wires"]
  },
  "bestFor": ["Obstacle Avoidance", "Fluid Level Measurement", "Simple Prototyping"],
  "notRecommendedFor": ["Soft target detection", "Outdoor use in heavy rain", "High speed industrial rangefinders"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 4 },
    { "boardSlug": "raspberry-pi-pico", "rating": 4 },
    { "boardSlug": "esp8266-nodemcu", "rating": 4 }
  ],
  "compatibleComponents": ["buzzer", "servo-motor", "oled", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["servo-motor", "arduino-uno"],
  "commonProjects": ["Obstacle Avoiding Robot", "Water Tank Level Monitor", "Smart Touchless Dustbin", "Automated Parking Assistant"],
  "comparisonSensors": ["ldr"],
  "comparisonSpecs": {
    "sensorType": "Ultrasonic Transducer",
    "operatingVoltage": "5V",
    "measurementRange": "2cm to 400cm",
    "accuracy": "±3mm",
    "interface": "Digital (Trigger + Echo pulse)",
    "responseTime": "< 20ms",
    "typicalPrice": "₹100 - ₹180",
    "bestUseCases": "Distance calculation, object avoidance, touchless triggers"
  },
  "quiz": [
    {
      "question": "What is the speed of sound used to calculate distance in standard conditions?",
      "options": ["340 m/s", "150 m/s", "1000 m/s", "300,000 km/s"],
      "answer": 0,
      "explanation": "Sound waves travel at approximately 340 meters per second (or 0.034 cm/microsecond) in dry air at room temperature."
    },
    {
      "question": "Why is a resistor divider needed on the Echo pin when connecting HC-SR04 to an ESP32?",
      "options": ["To boost output current", "To drop the 5V Echo pulse down to 3.3V", "To filter acoustic noise", "To power the sensor"],
      "answer": 1,
      "explanation": "The HC-SR04 outputs a 5V signal on its Echo pin. Since ESP32 GPIOs operate at 3.3V logic, a divider is required to protect the pin from overvoltage damage."
    }
  ],
  "buildChallenge": {
    "objective": "Build a visual obstacle distance meter that flashes an LED faster as objects get closer.",
    "estimatedTime": "20 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "HC-SR04 Sensor", "slug": "ultrasonic-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Insert the HC-SR04 pins into separate rows of the breadboard.",
        "expectedResult": "Pins plug securely."
      },
      {
        "stepNum": 2,
        "text": "Connect sensor VCC to Arduino 5V, and sensor GND to Arduino GND.",
        "expectedResult": "Power loops are connected."
      },
      {
        "stepNum": 3,
        "text": "Connect sensor Trig pin to Arduino Pin 9, and Echo pin to Pin 10.",
        "expectedResult": "Signal lanes mapped."
      },
      {
        "stepNum": 4,
        "text": "Connect an LED through a 220Ω series resistor to Arduino Digital Pin 6.",
        "expectedResult": "LED indicator ready."
      }
    ],
    "expectedOutput": "When powered up and code is uploaded, the LED flashes. Bringing a hand closer to the transducers speeds up the flash rate.",
    "troubleshooting": [
      {
        "symptom": "Distance readings constantly show 0cm or 3000cm",
        "causes": ["Faulty wiring on Trig/Echo pins", "Weak VCC supply current"],
        "fixSteps": ["Check Trig/Echo alignments. Verify sensor is powered by Arduino 5V, not 3.3V pin."]
      }
    ],
    "experiments": [
      {
        "title": "Acoustic alarm threshold",
        "description": "Add a buzzer to sound a warning tone if an obstacle enters within 10cm."
      }
    ],
    "verificationChecklist": [
      "VCC connected to 5V rail",
      "Trig mapped to Pin 9, Echo mapped to Pin 10",
      "Serial Monitor outputs dynamic distance calculations"
    ],
    "reflectionQuestions": [
      "Why must the calculated Sound wave travel time be divided by 2?",
      "What targets would cause acoustic reflections to scatter away from the receiver?"
    ],
    "relatedProjects": ["Sensing Barrier", "Distance Indicator Panel"],
    "xpReward": 85,
    "badge": "Sonic Guide Badge"
  }
};
