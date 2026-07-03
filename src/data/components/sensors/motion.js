export const pirMotionSensor = {
  "name": "PIR Motion Sensor",
  "slug": "pir-motion-sensor",
  "category": "Sensors",
  "description": "A passive infrared sensor that detects motion by measuring changes in the infrared radiation emitted by surrounding warm bodies.",
  "status": "completed",
  "measures": "Motion (Infrared Radiation Changes)",
  "outputType": "Digital Output (High/Low)",
  "operatingVoltage": "5V - 12V",
  "logicLevel": "3.3V Digital Output (Safe for all boards)",
  "powerConsumption": "50µA (Static)",
  "mission": "Learn to detect physical movement using infrared radiation grids.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Detect presence and motion of warm bodies",
    "Calibrate detection delay and sensitivity using potentiometers",
    "Configure digital input interrupts on microcontroller pins"
  ],
  "typicalValue": "HC-SR501",
  "polarity": "Polarized Power Pins",
  "difficulty": "Beginner",
  "learningTime": "20 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"15\" />\n      <path d=\"M20,30 Q30,20 40,30\" stroke-dasharray=\"2,2\" />\n      <path d=\"M20,35 Q30,25 40,35\" stroke-dasharray=\"2,2\" />\n      <line x1=\"22\" y1=\"45\" x2=\"22\" y2=\"50\" />\n      <line x1=\"30\" y1=\"45\" x2=\"30\" y2=\"50\" />\n      <line x1=\"38\" y1=\"45\" x2=\"38\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "4.5V - 20V" },
    { "label": "Static Current", "value": "< 50 µA" },
    { "label": "Output Signal", "value": "Digital high 3.3V, low 0V" },
    { "label": "Delay Time", "value": "0.3s - 18min (Adjustable)" },
    { "label": "Block Time", "value": "2.5s (Default)" },
    { "label": "Sensing Angle", "value": "< 100 degrees cone" }
  ],
  "parts": [
    {
      "id": "lens",
      "name": "Fresnel Dome Lens",
      "description": "White plastic dome split into multiple lens facets. Concentrates incoming infrared rays onto the pyroelectric element.",
      "connectorY": 100,
      "labelSide": "left",
      "labelY": 100,
      "visual": {
        "width": "50px",
        "height": "32px",
        "borderRadius": "50% 50% 0 0",
        "background": "radial-gradient(circle, #cbd5e1 40%, #94a3b8 100%)",
        "border": "1.5px solid #cbd5e1",
        "assembledY": -80,
        "explodedY": -140,
        "zIndex": 4
      }
    },
    {
      "id": "pyro",
      "name": "Pyroelectric Sensor Element",
      "description": "Metal can containing two infrared-sensitive slots that generate electric charge when exposed to temperature changes.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "24px",
        "height": "24px",
        "borderRadius": "50%",
        "background": "#cbd5e1",
        "border": "1.5px solid #94a3b8",
        "assembledY": -30,
        "explodedY": -80,
        "zIndex": 3
      }
    },
    {
      "id": "ic",
      "name": "BISS0001 Processing IC",
      "description": "Specialized IC that filters noise and checks if the signal sequence matches real human movement.",
      "connectorY": 240,
      "labelSide": "left",
      "labelY": 240,
      "visual": {
        "width": "36px",
        "height": "24px",
        "borderRadius": "2px",
        "background": "#1e293b",
        "border": "1px solid #4b5563",
        "assembledY": 10,
        "explodedY": -20,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Green Base PCB",
      "description": "The board holding calibration potentiometers, diodes, and voltage regulators.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "110px",
        "height": "70px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #15803d, #166534)",
        "border": "1.5px solid #166534",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "potentiometers",
      "name": "Delay & Sensitivity Trimmers",
      "description": "Two orange adjustment knobs. Left controls sensitivity (range), right controls output pulse delay.",
      "connectorY": 330,
      "labelSide": "left",
      "labelY": 330,
      "visual": {
        "width": "44px",
        "height": "16px",
        "background": "linear-gradient(90deg, #ea580c, #c2410c)",
        "assembledY": 70,
        "explodedY": 65,
        "zIndex": 3
      }
    },
    {
      "id": "pins",
      "name": "3-pin Output Header",
      "description": "VCC, OUT, and GND pins.",
      "connectorY": 360,
      "labelSide": "right",
      "labelY": 360,
      "visual": {
        "width": "24px",
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
      { "name": "VCC", "direction": "Power Input", "voltage": "5V - 20V", "description": "Positive power input pin (accepts 5V from boards)." },
      { "name": "OUT", "direction": "Digital Output", "voltage": "3.3V TTL", "description": "Digital output pin. Goes High (3.3V) when motion is detected." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground connection." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A passive infrared motion sensor.",
    "whyNeeded": "Essential for security alerts, hands-free light switching, and occupancy sensors.",
    "howItWorks": "All warm objects emit infrared light. The PIR sensor has two internal slots made of pyroelectric materials. When a person walks past, their warm body passes in front of slot 1 first, then slot 2. The BISS0001 chip measures this differential change in infrared heat levels and triggers the OUT pin to go High (3.3V) for a set duration.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"15\" y=\"40\" width=\"70\" height=\"40\" fill=\"#166534\" rx=\"2\" />\n        <circle cx=\"50\" cy=\"40\" r=\"16\" fill=\"#cbd5e1\" />\n        <path d=\"M20,20 C35,5 65,5 80,20\" stroke=\"#ea580c\" stroke-width=\"3\" stroke-linecap=\"round\" fill=\"none\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating digital high/low output pins.",
    "usage": "Connect OUT directly to any microcontroller digital input pin. No level shifting needed as the output is 3.3V."
  },
  "advantages": [
    "Extremely low power consumption (under 50µA) makes it ideal for battery products",
    "Output logic (3.3V) is safe to connect directly to 3.3V and 5V microcontrollers",
    "Onboard trimmers allow setting delay and sensitivity without changing code"
  ],
  "limitations": [
    "Cannot detect stationary objects; the warm target must be moving",
    "Easily triggered by sudden drafts, hot air vents, or direct sunlight shifts",
    "Limited detection range (typically 7 meters maximum)"
  ],
  "engineeringTips": [
    "Turn the delay trimmer fully counter-clockwise during software testing to set the output delay to its minimum (0.3 seconds).",
    "Avoid mounting the PIR sensor close to heater outlets, air conditioners, or direct window panes."
  ],
  "commonMistakes": [
    {
      "question": "Sensor stays High (3.3V) constantly on startup",
      "answer": "PIR sensors require a warm-up period of 30 to 60 seconds after power is applied. During this time, the output may trigger randomly or stay high."
    }
  ],
  "safetyNotes": [
    "Ensure power connections are correct. Reversing VCC and GND will destroy the processing IC."
  ],
  "buyingGuide": {
    "beginnerRating": 5,
    "priceRange": "₹70 - ₹120",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller", "Buzzer or LED", "Breadboard"]
  },
  "bestFor": ["Security Alarms", "Automated Light Switches", "Room Occupancy Detectors"],
  "notRecommendedFor": ["Distance measurements", "Detecting cold objects or stationary people"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 5 },
    { "boardSlug": "arduino-nano", "rating": 5 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 },
    { "boardSlug": "esp8266-nodemcu", "rating": 5 }
  ],
  "compatibleComponents": ["buzzer", "relay", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["relay", "arduino-uno"],
  "commonProjects": ["Intruder Security Alarm", "Hands-Free Closet Light", "Automatic Door Bell Trigger", "Energy Saving Room Controller"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "Passive Infrared (PIR) Motion Detector",
    "operatingVoltage": "4.5V - 20V",
    "measurementRange": "3m to 7m (110° cone)",
    "accuracy": "Binary state (Detects change in IR profile)",
    "interface": "Digital Output (High/Low)",
    "responseTime": "< 300ms",
    "typicalPrice": "₹70 - ₹120",
    "bestUseCases": "Human motion detection, home security, hands-free lighting control"
  },
  "quiz": [
    {
      "question": "What is the purpose of the white plastic dome over the PIR sensor?",
      "options": ["To protect from rain", "To act as a Fresnel lens focusing IR rays", "To block infrared light", "To hold the battery"],
      "answer": 1,
      "explanation": "The plastic dome is a Fresnel lens. It concentrates incoming infrared radiation onto the pyroelectric sensor slots."
    }
  ],
  "buildChallenge": {
    "objective": "Build a motion-activated security alarm that sounds a buzzer when motion is detected.",
    "estimatedTime": "15 min",
    "difficulty": "Beginner",
    "requiredComponents": [
      { "name": "PIR Sensor", "slug": "pir-motion-sensor" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "Buzzer", "slug": "buzzer" },
      { "name": "Breadboard", "slug": "breadboard" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect PIR VCC to Arduino 5V, and PIR GND to GND.",
        "expectedResult": "Sensor is powered."
      },
      {
        "stepNum": 2,
        "text": "Connect PIR OUT pin directly to Arduino Pin 2.",
        "expectedResult": "Signal output linked."
      },
      {
        "stepNum": 3,
        "text": "Connect the Buzzer positive (+) to Pin 8, and negative (-) to GND.",
        "expectedResult": "Alarm buzzer ready."
      }
    ],
    "expectedOutput": "After a 30-second initialization, walking in front of the sensor triggers the buzzer to beep for 3 seconds.",
    "troubleshooting": [
      {
        "symptom": "Buzzer sounds constantly without any motion",
        "causes": ["Sensor is still warming up", "Delay trimmer is set too high"],
        "fixSteps": ["Wait 60 seconds after powering on. Turn the right trimmer (Delay) fully counter-clockwise."]
      }
    ],
    "experiments": [
      {
        "title": "Adjusting the range",
        "description": "Turn the left trimmer (Sensitivity) clockwise to increase detection range, then test the trigger distance limits."
      }
    ],
    "verificationChecklist": [
      "VCC connected to 5V",
      "OUT pin wired to Pin 2",
      "Buzzer sounds only when moving"
    ],
    "reflectionQuestions": [
      "Why does a PIR sensor fail to detect a person wearing a thick space insulation suit?",
      "Explain the difference between active sensors (like Ultrasonic) and passive sensors."
    ],
    "relatedProjects": ["Hands-Free Switcher", "Security Monitor Block"],
    "xpReward": 80,
    "badge": "Sentry Badge"
  }
};

export const mpu6050 = {
  "name": "MPU6050 IMU Accelerometer & Gyro",
  "slug": "mpu6050",
  "category": "Sensors",
  "description": "An integrated 6-axis motion tracking sensor combining a 3-axis gyroscope, 3-axis accelerometer, and a Digital Motion Processor (DMP) on a single chip.",
  "status": "completed",
  "measures": "Acceleration & Angular Velocity (6-Axis)",
  "outputType": "I²C",
  "operatingVoltage": "3.3V - 5V",
  "logicLevel": "3.3V logic (Safe for 3.3V boards, requires care for 5V I2C lines)",
  "powerConsumption": "3.8mA",
  "mission": "Learn to read and process 3D motion and tilt vectors over I²C channels.",
  "prerequisites": ["voltage", "current", "fixed-resistor"],
  "learningOutcomes": [
    "Measure 3D acceleration vectors (X, Y, Z axes)",
    "Track angular velocity and rotation rates",
    "Calculate exact pitch, roll, and tilt angles"
  ],
  "typicalValue": "MPU6050 (GY-521)",
  "polarity": "Polarized Power Pins",
  "difficulty": "Intermediate",
  "learningTime": "40 min",
  "symbolSvg": "\n    <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2\" fill=\"none\">\n      <rect x=\"15\" y=\"15\" width=\"30\" height=\"30\" rx=\"2\" />\n      <circle cx=\"30\" cy=\"30\" r=\"6\" />\n      <line x1=\"30\" y1=\"20\" x2=\"30\" y2=\"40\" />\n      <line x1=\"20\" y1=\"30\" x2=\"40\" y2=\"30\" />\n      <line x1=\"15\" y1=\"45\" x2=\"15\" y2=\"50\" />\n      <line x1=\"25\" y1=\"45\" x2=\"25\" y2=\"50\" />\n      <line x1=\"35\" y1=\"45\" x2=\"35\" y2=\"50\" />\n      <line x1=\"45\" y1=\"45\" x2=\"45\" y2=\"50\" />\n    </svg>\n  ",
  "specs": [
    { "label": "Working Voltage", "value": "3.0V - 5.0V (via onboard 3.3V regulator)" },
    { "label": "Accelerometer Range", "value": "±2g, ±4g, ±8g, ±16g (User selectable)" },
    { "label": "Gyroscope Range", "value": "±250, ±500, ±1000, ±2000 °/s (User selectable)" },
    { "label": "Interface", "value": "I²C (up to 400kHz)" },
    { "label": "Onboard Processor", "value": "Digital Motion Processor (DMP)" }
  ],
  "parts": [
    {
      "id": "sensor",
      "name": "MPU6050 Microchip QFN",
      "description": "The main silicon chip containing the MEMS structures for both the accelerometer and gyroscope.",
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
      "id": "regulator",
      "name": "3.3V Low-Dropout Regulator",
      "description": "Drops input power down to a stable 3.3V level required by the MPU6050 chip.",
      "connectorY": 180,
      "labelSide": "right",
      "labelY": 180,
      "visual": {
        "width": "16px",
        "height": "16px",
        "borderRadius": "1px",
        "background": "#000",
        "assembledY": -30,
        "explodedY": -80,
        "zIndex": 3
      }
    },
    {
      "id": "pcb",
      "name": "Blue GY-521 PCB substrate",
      "description": "Breakout board routing power, ground, SCL, SDA, and interrupt tracks.",
      "connectorY": 300,
      "labelSide": "right",
      "labelY": 300,
      "visual": {
        "width": "64px",
        "height": "80px",
        "borderRadius": "4px",
        "background": "linear-gradient(135deg, #0284c7, #0369a1)",
        "border": "1px solid #0369a1",
        "assembledY": 50,
        "explodedY": 40,
        "zIndex": 2
      }
    },
    {
      "id": "pins",
      "name": "8-pin Header block",
      "description": "Pins for I²C, power, auxiliary master I²C bus, and interrupt triggers.",
      "connectorY": 350,
      "labelSide": "left",
      "labelY": 350,
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
      { "name": "VCC", "direction": "Power Input", "voltage": "3.3V - 5V", "description": "Module power pin (uses onboard regulator)." },
      { "name": "GND", "direction": "Ground Reference", "voltage": "0V", "description": "Common ground." },
      { "name": "SCL", "direction": "I2C Clock Input", "voltage": "3.3V max", "description": "Serial Clock Line." },
      { "name": "SDA", "direction": "I2C Data line", "voltage": "3.3V max", "description": "Serial Data Line." },
      { "name": "INT", "direction": "Interrupt Output", "voltage": "3.3V max", "description": "Interrupt output pin (warns host controller when data is ready)." }
    ]
  },
  "workingPrinciple": {
    "whatIsIt": "A MEMS motion tracking accelerometer/gyro sensor.",
    "whyNeeded": "Crucial for drone stabilization, VR headsets, smartphone orientation, and robot balance loops.",
    "howItWorks": "Contains tiny Micro-Electro-Mechanical Systems (MEMS) structures. The accelerometer measures displacement of silicon masses under gravity/acceleration, while the gyroscope measures Coriolis forces generated during rotation. The onboard DMP processes these values to output quaternion vectors directly, saving main CPU cycles.",
    "svgDiagram": "\n      <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n        <rect x=\"20\" y=\"20\" width=\"60\" height=\"60\" fill=\"#0284c7\" rx=\"4\" />\n        <line x1=\"50\" y1=\"25\" x2=\"50\" y2=\"75\" stroke=\"#fbbf24\" stroke-width=\"4\" />\n        <line x1=\"25\" y1=\"50\" x2=\"75\" y2=\"50\" stroke=\"#fbbf24\" stroke-width=\"4\" />\n      </svg>\n    "
  },
  "circuitSymbol": {
    "meaning": "Block indicating standard I²C bus pin layout.",
    "usage": "Wire SDA and SCL to hardware I²C pins. Auxiliary pins (XDA, XCL) can be left disconnected."
  },
  "advantages": [
    "Combines accelerometer and gyroscope axes on a single low-cost breakout module",
    "Digital Motion Processor (DMP) handles complex math filtering algorithms internally",
    "Very high resolution 16-bit analog-to-digital conversions on all channels"
  ],
  "limitations": [
    "Gyroscope readings suffer from 'drift' over time, causing calculated angles to rotate slowly even when stationary",
    "Logic levels are 3.3V. Using long wires on 5V I2C buses can lock up communication channels",
    "Highly sensitive to mechanical vibration noise"
  ],
  "engineeringTips": [
    "Combine accelerometer and gyroscope readings using a Complementary Filter or Kalman Filter in software to cancel out both high-frequency vibration noise and slow gyroscope drift.",
    "Connect the INT pin to a hardware interrupt pin on your microcontroller to process values immediately when ready."
  ],
  "commonMistakes": [
    {
      "question": "Calculated angle drifts constantly when board is sitting flat",
      "answer": "Gyroscopes measure rate of rotation, not absolute angle. You must calibrate offset values at startup, and combine gyro readings with the gravity vector from the accelerometer to correct drift."
    }
  ],
  "safetyNotes": [
    "Check logic lines. Never plug 5V digital SDA/SCL pullup lines directly to MPU6050 pins without checking if the breakout has protective level shifters."
  ],
  "buyingGuide": {
    "beginnerRating": 4,
    "priceRange": "₹150 - ₹250",
    "availability": "High",
    "recommendedAccessories": ["Microcontroller Board", "Connecting wires", "Breadboard"]
  },
  "bestFor": ["Drone Flight Stabilization", "Self-Balancing Robots", "Handheld Controller inputs"],
  "notRecommendedFor": ["Measuring absolute geographic headings (lacks magnetometer)"],
  "compatibleBoards": [
    { "boardSlug": "arduino-uno", "rating": 4 },
    { "boardSlug": "arduino-nano", "rating": 4 },
    { "boardSlug": "esp32-devkit", "rating": 5 },
    { "boardSlug": "raspberry-pi-pico", "rating": 5 },
    { "boardSlug": "esp8266-nodemcu", "rating": 5 }
  ],
  "compatibleComponents": ["oled", "servo-motor", "light-emitting-diode", "fixed-resistor"],
  "nextLearningPath": ["servo-motor", "esp32-devkit"],
  "commonProjects": ["Self-Balancing Two-Wheel Robot", "Gesture-Controlled Mouse", "RC Drone Stabilization Flight Controller", "Smart Crash/Tilt Logger"],
  "comparisonSensors": ["ultrasonic-sensor"],
  "comparisonSpecs": {
    "sensorType": "6-Axis MEMS Inertial Measurement Unit (IMU)",
    "operatingVoltage": "3.3V - 5V (GY-521 module)",
    "measurementRange": "±2g to ±16g / ±250°/s to ±2000°/s",
    "accuracy": "16-bit A/D resolution (Highly precise MEMS response)",
    "interface": "I²C",
    "responseTime": "< 5ms",
    "typicalPrice": "₹150 - ₹250",
    "bestUseCases": "Tilt sensing, balance tracking, rotation speed measurements, drone stability"
  },
  "quiz": [
    {
      "question": "What does a 3-axis gyroscope measure?",
      "options": ["Linear acceleration", "Magnetic field direction", "Angular velocity (rate of rotation)", "Altitude"],
      "answer": 2,
      "explanation": "A gyroscope measures angular velocity (degrees per second) along the X, Y, and Z axes, indicating how fast the sensor is rotating."
    }
  ],
  "buildChallenge": {
    "objective": "Build a level indicator that turns on an LED if the sensor is tilted beyond 15 degrees.",
    "estimatedTime": "25 min",
    "difficulty": "Intermediate",
    "requiredComponents": [
      { "name": "MPU6050 Sensor", "slug": "mpu6050" },
      { "name": "Arduino UNO", "slug": "arduino-uno" },
      { "name": "LED", "slug": "light-emitting-diode" },
      { "name": "220Ω Resistor", "slug": "fixed-resistor" }
    ],
    "requiredTools": ["Arduino IDE", "USB Cable", "MPU6050 Library"],
    "wiringSteps": [
      {
        "stepNum": 1,
        "text": "Connect MPU6050 VCC to Arduino 5V (GY-521 has onboard regulator), and GND to GND.",
        "expectedResult": "Sensor is powered."
      },
      {
        "stepNum": 2,
        "text": "Connect SCL to Arduino Pin A5, and SDA to Pin A4 (I²C pins on UNO).",
        "expectedResult": "I²C bus connected."
      },
      {
        "stepNum": 3,
        "text": "Connect an LED through a 220Ω series resistor to Arduino Digital Pin 6.",
        "expectedResult": "Tilt warning indicator ready."
      }
    ],
    "expectedOutput": "Opening the Serial Monitor outputs calculated pitch and roll angles. If you tilt the board past 15 degrees, the indicator LED turns on.",
    "troubleshooting": [
      {
        "symptom": "Serial print log says 'MPU6050 connection failed'",
        "causes": ["Wrong wiring on SDA/SCL pins", "Sensor AD0 pin floating causing wrong address"],
        "fixSteps": ["Check that SCL goes to A5 and SDA goes to A4. If using ESP32, wire to GPIO 22/21."]
      }
    ],
    "experiments": [
      {
        "title": "G-Force test",
        "description": "Shake the sensor rapidly. Observe the raw G-force values climb on the serial plotter window."
      }
    ],
    "verificationChecklist": [
      "I2C lines wired correctly",
      "Pitch/Roll output calculations active",
      "LED lights up on tilt threshold trigger"
    ],
    "reflectionQuestions": [
      "Why does gyroscope integration lead to angle drift over time?",
      "How does the MPU6050 determine which way gravity is pointing?"
    ],
    "relatedProjects": ["Balancing Robot Driver", "Tilt Logging Node"],
    "xpReward": 90,
    "badge": "Gyro Pilot Badge"
  }
};
