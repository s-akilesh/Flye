export const ROADMAP_METADATA = [
  {
    level: 1,
    title: 'Level 1 — Electrical Basics',
    purpose: 'Learn the fundamental physical concepts that govern all circuits.',
    learningGoal: 'Students understand basic charge, voltage, current, resistance, power, and circuit connections.',
    categories: [
      {
        name: 'Introduction',
        components: [
          { id: 'intro-engineering', name: 'What is Engineering?', description: 'How engineers apply science and math to solve problems.', slug: 'what-is-engineering', isImplemented: true, isFundamental: true },
          { id: 'intro-ee', name: 'What is Electrical Engineering?', description: 'Generation, transmission, and silicon chips.', slug: 'what-is-electrical-engineering', isImplemented: true, isFundamental: true },
          { id: 'why-learn', name: 'Why Learn Electronics?', description: 'Building custom hardware and smart projects.', slug: 'why-learn-electronics', isImplemented: true, isFundamental: true }
        ]
      },
      {
        name: 'Core Concepts',
        components: [
          { id: 'electricity', name: 'What is Electricity?', description: 'The movement of charged particles.', slug: 'what-is-electricity', isImplemented: true, isFundamental: true },
          { id: 'electric-charge', name: 'Electric Charge', description: 'Positive (+) and negative (-) charges.', slug: 'electric-charge', isImplemented: true, isFundamental: true },
          { id: 'conductors-insulators', name: 'Conductors vs Insulators', description: 'Classify materials by flow rate.', slug: 'conductors-vs-insulators', isImplemented: true, isFundamental: true },
          { id: 'voltage', name: 'Voltage', description: 'Electrical pressure that pushes electrons.', slug: 'voltage', isImplemented: true, isFundamental: true },
          { id: 'current', name: 'Current', description: 'The flow rate of electrical charge.', slug: 'current', isImplemented: true, isFundamental: true },
          { id: 'resistance', name: 'Resistance', description: 'Opposition to the flow of current.', slug: 'resistance', isImplemented: true, isFundamental: true },
          { id: 'power', name: 'Power', description: 'The rate at which electrical energy is consumed.', slug: 'power', isImplemented: true, isFundamental: true },
          { id: 'energy', name: 'Energy', description: 'Total electrical work done over time.', slug: 'energy', isImplemented: true, isFundamental: true },
          { id: 'ohms-law', name: "Ohm's Law", description: 'Relation between voltage, current, and resistance.', slug: 'ohms-law', isImplemented: true, isFundamental: true },
          { id: 'ac-dc', name: 'AC vs DC', description: 'Alternating Current versus Direct Current.', slug: 'ac-dc', isImplemented: true, isFundamental: true }
        ]
      },
      {
        name: 'Circuit Connections',
        components: [
          { id: 'series-circuit', name: 'Series Circuit', description: 'Single path for current flow.', slug: 'series-circuit', isImplemented: true, isFundamental: true },
          { id: 'parallel-circuit', name: 'Parallel Circuit', description: 'Multiple paths for current flow.', slug: 'parallel-circuit', isImplemented: true, isFundamental: true },
          { id: 'open-circuit', name: 'Open Circuit', description: 'A broken path that stops current flow.', slug: 'open-circuit', isImplemented: true, isFundamental: true },
          { id: 'short-circuit', name: 'Short Circuit', description: 'Bypassing the load with near-zero resistance.', slug: 'short-circuit', isImplemented: true, isFundamental: true },
          { id: 'electrical-safety', name: 'Electrical Safety', description: 'Safe practices when working with circuits.', slug: 'electrical-safety', isImplemented: true, isFundamental: true }
        ]
      },
      {
        name: 'Assessment',
        components: [
          { id: 'final-assessment', name: 'Final Assessment', description: 'Test your Electrical Basics understanding.', slug: 'final-assessment', isImplemented: true, isFundamental: true }
        ]
      }
    ]
  },
  {
    level: 2,
    title: 'Level 2 — Electronics Fundamentals',
    purpose: 'Learn the basic building blocks of electronics.',
    learningGoal: 'Students should understand electricity and the purpose of each basic electronic component.',
    categories: [
      {
        name: 'Passive Components',
        components: [
          { id: 'resistor', name: 'Resistor', description: 'Restricts the flow of electric current.', slug: 'resistor', isImplemented: true },
          { id: 'capacitor', name: 'Capacitor', description: 'Stores electrical energy temporarily.', slug: 'capacitor', isImplemented: true },
          { id: 'inductor', name: 'Inductor', description: 'Stores energy in a magnetic field.', slug: 'inductor', isImplemented: false },
          { id: 'transformer', name: 'Transformer', description: 'Transfers electrical energy between circuits.', slug: 'transformer', isImplemented: false }
        ]
      },
      {
        name: 'Active Components',
        components: [
          { id: 'diode', name: 'Diode', description: 'Allows current to flow in one direction only.', slug: 'pn-junction-diode', isImplemented: true },
          { id: 'led', name: 'LED', description: 'Emits light when electrical current flows.', slug: 'light-emitting-diode', isImplemented: true },
          { id: 'transistor', name: 'Transistor', description: 'Switches or amplifies electrical signals.', slug: 'transistor', isImplemented: false },
          { id: 'mosfet', name: 'MOSFET', description: 'Field-effect transistor for switching power.', slug: 'mosfet', isImplemented: false },
          { id: 'voltage-regulator', name: 'Voltage Regulator', description: 'Stabilizes voltage levels.', slug: 'voltage-regulator', isImplemented: false }
        ]
      },
      {
        name: 'Protection Components',
        components: [
          { id: 'fuse', name: 'Fuse', description: 'Protects circuits against overcurrent.', slug: 'fuse', isImplemented: false },
          { id: 'mov', name: 'MOV', description: 'Metal Oxide Varistor for surge protection.', slug: 'mov', isImplemented: false },
          { id: 'tvs-diode', name: 'TVS Diode', description: 'Transient Voltage Suppression diode.', slug: 'tvs-diode', isImplemented: false }
        ]
      },
      {
        name: 'Basic Hardware',
        components: [
          { id: 'battery', name: 'Battery', description: 'Provides chemical to electrical power.', slug: 'battery', isImplemented: false },
          { id: 'breadboard', name: 'Breadboard', description: 'Solderless board for building prototypes.', slug: 'breadboard', isImplemented: false },
          { id: 'jumper-wires', name: 'Jumper Wires', description: 'Connects electrical points together.', slug: 'jumper-wires', isImplemented: false },
          { id: 'switches', name: 'Switches', description: 'Makes or breaks electrical connections.', slug: 'switches', isImplemented: false },
          { id: 'connectors', name: 'Connectors', description: 'Links cables or devices physically.', slug: 'connectors', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 3,
    title: 'Level 3 — Sensors & Output Devices',
    purpose: 'Understand how electronics interact with the physical world.',
    learningGoal: 'Students understand inputs, outputs, displays, and motion control.',
    categories: [
      {
        name: 'Sensors',
        components: [
          { id: 'temp-sensor', name: 'Temperature Sensor', description: 'Measures ambient or surface temperature.', slug: 'temp-sensor', isImplemented: false },
          { id: 'humidity-sensor', name: 'Humidity Sensor', description: 'Measures environmental moisture.', slug: 'humidity-sensor', isImplemented: false },
          { id: 'ldr', name: 'LDR', description: 'Light Dependent Resistor that varies resistance based on light.', slug: 'ldr', isImplemented: false },
          { id: 'ultrasonic', name: 'Ultrasonic Sensor', description: 'Measures distance using sound waves.', slug: 'ultrasonic', isImplemented: false },
          { id: 'pir-motion', name: 'PIR Motion Sensor', description: 'Detects infrared heat movement.', slug: 'pir-motion', isImplemented: false },
          { id: 'gas-sensor', name: 'Gas Sensor', description: 'Measures concentrations of gas leaks.', slug: 'gas-sensor', isImplemented: false },
          { id: 'sound-sensor', name: 'Sound Sensor', description: 'Detects ambient noise levels.', slug: 'sound-sensor', isImplemented: false },
          { id: 'ir-sensor', name: 'IR Sensor', description: 'Detects reflection or transmission of IR light.', slug: 'ir-sensor', isImplemented: false },
          { id: 'hall-effect', name: 'Hall Effect Sensor', description: 'Detects magnetic fields.', slug: 'hall-effect', isImplemented: false },
          { id: 'soil-moisture', name: 'Soil Moisture Sensor', description: 'Measures water content in soil.', slug: 'soil-moisture', isImplemented: false },
          { id: 'rain-sensor', name: 'Rain Sensor', description: 'Detects water droplets on a plate.', slug: 'rain-sensor', isImplemented: false }
        ]
      },
      {
        name: 'Displays',
        components: [
          { id: 'seven-segment', name: 'Seven Segment', description: 'Displays numerical characters.', slug: 'seven-segment', isImplemented: false },
          { id: 'character-lcd', name: 'Character LCD', description: 'Renders alphanumeric texts.', slug: 'character-lcd', isImplemented: false },
          { id: 'oled', name: 'OLED', description: 'High contrast graphic display.', slug: 'oled', isImplemented: false },
          { id: 'tft-display', name: 'TFT Display', description: 'Full-color graphic screen.', slug: 'tft-display', isImplemented: false },
          { id: 'led-matrix', name: 'LED Matrix', description: 'Grid of LEDs for scrolling text/pixels.', slug: 'led-matrix', isImplemented: false }
        ]
      },
      {
        name: 'Actuators',
        components: [
          { id: 'relay', name: 'Relay', description: 'Electromagnetic switch for high power.', slug: 'relay', isImplemented: false },
          { id: 'buzzer', name: 'Buzzer', description: 'Generates sound tones.', slug: 'buzzer', isImplemented: false },
          { id: 'solenoid', name: 'Solenoid', description: 'Linear electromagnetic actuator.', slug: 'solenoid', isImplemented: false }
        ]
      },
      {
        name: 'Motors',
        components: [
          { id: 'dc-motor', name: 'DC Motor', description: 'Continuous rotary direct current motor.', slug: 'dc-motor', isImplemented: false },
          { id: 'servo-motor', name: 'Servo Motor', description: 'Precise angular position motor.', slug: 'servo-motor', isImplemented: false },
          { id: 'stepper-motor', name: 'Stepper Motor', description: 'Discrete incremental rotation motor.', slug: 'stepper-motor', isImplemented: false },
          { id: 'bldc-motor', name: 'BLDC Motor', description: 'High-speed brushless DC motor.', slug: 'bldc-motor', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 4,
    title: 'Level 4 — Microcontrollers & Embedded Systems',
    purpose: 'Control electronic components using programmable hardware.',
    learningGoal: 'Students understand how controllers interact with electronic components.',
    categories: [
      {
        name: 'Arduino',
        components: [
          { id: 'arduino-uno', name: 'Arduino Uno', description: 'Popular 8-bit entry-level board.', slug: 'arduino-uno', isImplemented: false },
          { id: 'arduino-nano', name: 'Arduino Nano', description: 'Breadboard-friendly small controller.', slug: 'arduino-nano', isImplemented: false },
          { id: 'arduino-mega', name: 'Arduino Mega', description: 'Large controller with more pins/memory.', slug: 'arduino-mega', isImplemented: false }
        ]
      },
      {
        name: 'ESP Series',
        components: [
          { id: 'esp8266', name: 'ESP8266', description: 'Low-cost Wi-Fi module.', slug: 'esp8266', isImplemented: false },
          { id: 'esp32', name: 'ESP32', description: 'Wi-Fi & Bluetooth microcontroller.', slug: 'esp32', isImplemented: false }
        ]
      },
      {
        name: 'Other Controllers',
        components: [
          { id: 'rpi-pico', name: 'Raspberry Pi Pico', description: 'Dual-core ARM Cortex-M0+ board.', slug: 'rpi-pico', isImplemented: false },
          { id: 'stm32', name: 'STM32', description: '32-bit ARM microcontroller.', slug: 'stm32', isImplemented: false },
          { id: 'pic', name: 'PIC', description: 'Microchip family of controllers.', slug: 'pic', isImplemented: false },
          { id: 'avr', name: 'AVR', description: 'Atmel 8-bit controllers.', slug: 'avr', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 5,
    title: 'Level 5 — Communication Systems',
    purpose: 'Enable devices to communicate with each other.',
    learningGoal: 'Students understand wired and wireless communication systems.',
    categories: [
      {
        name: 'Wireless Transceivers',
        components: [
          { id: 'bluetooth', name: 'Bluetooth', description: 'Short-range wireless communication.', slug: 'bluetooth', isImplemented: false },
          { id: 'wifi', name: 'Wi-Fi', description: 'Local area wireless network.', slug: 'wifi', isImplemented: false },
          { id: 'lora', name: 'LoRa', description: 'Long-range low-power radio communication.', slug: 'lora', isImplemented: false },
          { id: 'gsm', name: 'GSM', description: 'Cellular network communication module.', slug: 'gsm', isImplemented: false },
          { id: 'gps', name: 'GPS', description: 'Global positioning satellite receiver.', slug: 'gps', isImplemented: false },
          { id: 'rfid', name: 'RFID', description: 'Radio frequency identification tags/readers.', slug: 'rfid', isImplemented: false },
          { id: 'nfc', name: 'NFC', description: 'Near field communication for quick link tags.', slug: 'nfc', isImplemented: false },
          { id: 'zigbee', name: 'Zigbee', description: 'Mesh network wireless standard.', slug: 'zigbee', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 6,
    title: 'Level 6 — Power Electronics',
    purpose: 'Understand power generation, regulation, and conversion.',
    learningGoal: 'Students understand how electronic systems receive and manage power.',
    categories: [
      {
        name: 'Power Modules',
        components: [
          { id: 'batteries-power', name: 'Batteries', description: 'Primary/Secondary battery technology.', slug: 'batteries-power', isImplemented: false },
          { id: 'battery-holders', name: 'Battery Holders', description: 'Physical cell mounting options.', slug: 'battery-holders', isImplemented: false },
          { id: 'solar-panels', name: 'Solar Panels', description: 'Harvesting light to electricity.', slug: 'solar-panels', isImplemented: false },
          { id: 'power-supplies', name: 'Power Supplies', description: 'AC to DC conversion and regulators.', slug: 'power-supplies', isImplemented: false },
          { id: 'buck-converter', name: 'Buck Converter', description: 'Step-down voltage regulators.', slug: 'buck-converter', isImplemented: false },
          { id: 'boost-converter', name: 'Boost Converter', description: 'Step-up voltage regulators.', slug: 'boost-converter', isImplemented: false },
          { id: 'power-regulators', name: 'Voltage Regulators', description: 'Linear power stabilization.', slug: 'power-regulators', isImplemented: false },
          { id: 'bms-modules', name: 'BMS Modules', description: 'Battery management systems protection.', slug: 'bms-modules', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 7,
    title: 'Level 7 — Integrated Circuits',
    purpose: 'Learn specialized integrated circuits used in electronic systems.',
    learningGoal: 'Students understand the purpose of commonly used ICs.',
    categories: [
      {
        name: 'Analog ICs',
        components: [
          { id: '555-timer', name: '555 Timer', description: 'Oscillator and timing circuit.', slug: '555-timer', isImplemented: false },
          { id: 'op-amp', name: 'Operational Amplifier', description: 'Signal amplification and processing.', slug: 'op-amp', isImplemented: false },
          { id: 'comparator', name: 'Comparator', description: 'Compares two voltages.', slug: 'comparator', isImplemented: false }
        ]
      },
      {
        name: 'Digital ICs',
        components: [
          { id: 'logic-gates', name: 'Logic Gates', description: 'Basic digital logical units.', slug: 'logic-gates', isImplemented: false },
          { id: 'flip-flops', name: 'Flip-Flops', description: '1-bit memory latch cells.', slug: 'flip-flops', isImplemented: false },
          { id: 'counters', name: 'Counters', description: 'Digital counting chips.', slug: 'counters', isImplemented: false },
          { id: 'shift-registers', name: 'Shift Registers', description: 'Serial to parallel conversion.', slug: 'shift-registers', isImplemented: false }
        ]
      },
      {
        name: 'Memory',
        components: [
          { id: 'eeprom', name: 'EEPROM', description: 'Electrically erasable ROM.', slug: 'eeprom', isImplemented: false },
          { id: 'flash', name: 'Flash', description: 'Non-volatile mass storage.', slug: 'flash', isImplemented: false },
          { id: 'sram', name: 'SRAM', description: 'Static random access memory.', slug: 'sram', isImplemented: false }
        ]
      },
      {
        name: 'Interface & Drivers',
        components: [
          { id: 'adc', name: 'ADC', description: 'Analog to digital converter.', slug: 'adc', isImplemented: false },
          { id: 'dac', name: 'DAC', description: 'Digital to analog converter.', slug: 'dac', isImplemented: false },
          { id: 'multiplexer', name: 'Multiplexer', description: 'Selects between multiple inputs.', slug: 'multiplexer', isImplemented: false },
          { id: 'motor-driver', name: 'Motor Driver', description: 'H-bridge ICs for motor control.', slug: 'motor-driver', isImplemented: false },
          { id: 'led-driver', name: 'LED Driver', description: 'Constant current drivers.', slug: 'led-driver', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 8,
    title: 'Level 8 — PCB & Manufacturing',
    purpose: 'Understand how electronic products are assembled.',
    learningGoal: 'Students understand how electronic circuits are built physically.',
    categories: [
      {
        name: 'Prototyping & Assembly',
        components: [
          { id: 'pcb', name: 'PCB', description: 'Printed circuit boards.', slug: 'pcb', isImplemented: false },
          { id: 'breadboard-mfg', name: 'Breadboard', description: 'Workspace prototyping boards.', slug: 'breadboard-mfg', isImplemented: false },
          { id: 'perfboard', name: 'Perfboard', description: 'Perforated dot prototype boards.', slug: 'perfboard', isImplemented: false },
          { id: 'jumper-wires-mfg', name: 'Jumper Wires', description: 'Connecting leads.', slug: 'jumper-wires-mfg', isImplemented: false },
          { id: 'soldering', name: 'Soldering', description: 'Melting metal alloys to join joints.', slug: 'soldering', isImplemented: false },
          { id: 'flux', name: 'Flux', description: 'Chemical cleaning agents for soldering.', slug: 'flux', isImplemented: false },
          { id: 'heat-shrink', name: 'Heat Shrink', description: 'Insulating sleeves.', slug: 'heat-shrink', isImplemented: false },
          { id: 'ic-socket', name: 'IC Socket', description: 'Mounting bases for IC chips.', slug: 'ic-socket', isImplemented: false },
          { id: 'pcb-design', name: 'PCB Design Basics', description: 'Routing traces, pads and footprints.', slug: 'pcb-design', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 9,
    title: 'Level 9 — Build Projects',
    purpose: 'Apply knowledge through practical engineering projects.',
    learningGoal: 'Students connect theory with real-world implementation.',
    categories: [
      {
        name: 'Beginner Projects',
        components: [
          { id: 'led-blinker', name: 'LED Blinker', description: 'Simple multi-vibrator flash circuit.', slug: 'led-blinker', isImplemented: false },
          { id: 'traffic-light', name: 'Traffic Light', description: 'Sequencing timer simulation.', slug: 'traffic-light', isImplemented: false },
          { id: 'street-light', name: 'Automatic Street Light', description: 'LDR threshold switch relays.', slug: 'street-light', isImplemented: false },
          { id: 'water-level', name: 'Water Level Indicator', description: 'Transistor switches checking probes.', slug: 'water-level', isImplemented: false }
        ]
      },
      {
        name: 'Intermediate Projects',
        components: [
          { id: 'obstacle-robot', name: 'Obstacle Avoiding Robot', description: 'Ultrasonic navigation micro-car.', slug: 'obstacle-robot', isImplemented: false },
          { id: 'smart-dustbin', name: 'Smart Dustbin', description: 'Servo automatic lid detector.', slug: 'smart-dustbin', isImplemented: false },
          { id: 'home-automation', name: 'Home Automation', description: 'Relay switching nodes control.', slug: 'home-automation', isImplemented: false },
          { id: 'weather-station', name: 'Weather Station', description: 'Sensor reading logger panel.', slug: 'weather-station', isImplemented: false }
        ]
      },
      {
        name: 'Advanced Projects',
        components: [
          { id: 'iot-home', name: 'IoT Smart Home', description: 'ESP32 MQTT online dashboard.', slug: 'iot-home', isImplemented: false },
          { id: 'smart-agri', name: 'Smart Agriculture', description: 'Automated irrigation network.', slug: 'smart-agri', isImplemented: false },
          { id: 'robotic-arm', name: 'Robotic Arm', description: 'Multi-axis servo manipulator.', slug: 'robotic-arm', isImplemented: false },
          { id: 'drone-controller', name: 'Drone Controller', description: 'IMU gyro stabilization flight controller.', slug: 'drone-controller', isImplemented: false }
        ]
      }
    ]
  },
  {
    level: 10,
    title: 'Level 10 — AI & Robotics (Future)',
    purpose: 'Future expansion for edge intelligence and navigation.',
    learningGoal: 'This level is reserved for future development.',
    categories: [
      {
        name: 'AI Modules',
        components: [
          { id: 'computer-vision', name: 'Computer Vision', description: 'Camera processors processing pixels.', slug: 'computer-vision', isImplemented: false },
          { id: 'ml-edge', name: 'Machine Learning', description: 'TinyML neural network chips.', slug: 'ml-edge', isImplemented: false },
          { id: 'robot-nav', name: 'Robot Navigation', description: 'SLAM lidar mapping engines.', slug: 'robot-nav', isImplemented: false }
        ]
      }
    ]
  }
];
