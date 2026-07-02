export const resistorFamily = {
  "id": "resistor",
  "name": "Resistor",
  "category": "Passive Components",
  "variants": [
    {
      "name": "Fixed Resistor",
      "slug": "fixed-resistor",
      "category": "Passive Components",
      "description": "A component that resists the flow of electricity by a fixed, unchanging amount.",
      "status": "completed",
      "mission": "Learn how resistors limit current and divide voltage.",
      "prerequisites": [
        "voltage",
        "current"
      ],
      "learningOutcomes": [
        "What is a resistor",
        "How to read color bands",
        "Ohm's Law basics"
      ],
      "typicalValue": "1kΩ",
      "polarity": "Non-polarized",
      "difficulty": "Beginner",
      "learningTime": "5 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"5\" y1=\"20\" x2=\"25\" y2=\"20\" />\n          <polyline points=\"25,20 29,10 35,30 41,10 47,30 51,20\" />\n          <line x1=\"51\" y1=\"20\" x2=\"75\" y2=\"20\" />\n        </svg>\n      ",
      "specs": [
        {
          "label": "Category",
          "value": "Passive"
        },
        {
          "label": "Common Value",
          "value": "10Ω - 1MΩ"
        },
        {
          "label": "Tolerance",
          "value": "±1% or ±5%"
        },
        {
          "label": "Polarity",
          "value": "Non-polarized"
        }
      ],
      "parts": [
        {
          "id": "body",
          "name": "Ceramic Body",
          "description": "A heat-resistant ceramic cylinder that supports the resistive material.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "74px",
            "height": "38px",
            "borderRadius": "6px",
            "background": "linear-gradient(90deg, #d8b4fe 0%, #a855f7 50%, #7e22ce 100%)",
            "border": "1px solid rgba(255, 255, 255, 0.1)",
            "assembledY": -50,
            "explodedY": -130,
            "zIndex": 4,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "The hard ceramic rod in the center of the resistor."
            },
            {
              "question": "Why ceramic?",
              "answer": "Ceramic resists electricity completely and handles heat without melting."
            }
          ]
        },
        {
          "id": "film",
          "name": "Resistive Film",
          "description": "A thin coating of carbon or metal that limits the current.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "58px",
            "height": "18px",
            "background": "repeating-linear-gradient(45deg, #1e293b, #1e293b 2px, #475569 2px, #475569 4px)",
            "assembledY": -30,
            "explodedY": -60,
            "zIndex": 3,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "A thin layer of carbon or metal film sprayed onto the ceramic rod."
            },
            {
              "question": "How does it block current?",
              "answer": "A spiral cut is carved into this layer, forcing electricity to travel a longer, narrower path to slow down."
            }
          ]
        },
        {
          "id": "bands",
          "name": "Color Bands",
          "description": "Stripes printed on the body to show the resistance value.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "62px",
            "height": "10px",
            "background": "linear-gradient(90deg, #ef4444 0%, #3b82f6 50%, #f59e0b 100%)",
            "assembledY": -15,
            "explodedY": 20,
            "zIndex": 2,
            "type": "block"
          },
          "cards": [
            {
              "question": "What are they?",
              "answer": "Standard color stripes printed on the outside coating."
            },
            {
              "question": "What do they mean?",
              "answer": "Each color represents a number. Engineers read them to find the resistor value in ohms."
            }
          ]
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Connecting pins that let it join the circuit in any direction.",
          "connectorY": 320,
          "labelSide": "right",
          "labelY": 320,
          "visual": {
            "width": "90px",
            "height": "8px",
            "assembledY": 10,
            "explodedY": 100,
            "zIndex": 1,
            "type": "leads_axial"
          },
          "cards": [
            {
              "question": "What are they?",
              "answer": "Tinned copper legs extending from the end caps."
            },
            {
              "question": "How do you solder them?",
              "answer": "Resistors have no positive or negative leads. You can connect them either way!"
            }
          ]
        }
      ],
      "defaultCards": [
        {
          "question": "What is it?",
          "answer": "A resistor is a component that limits current flow. Think of it like a squeeze in a water hose slowing down water flow."
        },
        {
          "question": "Why is it needed?",
          "answer": "Components like LEDs can only handle small currents. Resistors absorb excess voltage, limiting current to safe operating levels."
        },
        {
          "question": "What happens if removed?",
          "answer": "Removing it leaves either an open circuit (no electricity flows) or a short circuit (unrestricted current burns out parts)."
        }
      ],
      "applications": [
        {
          "id": "arduino",
          "role": "LED Protection",
          "desc": "LED protector. Limits current to protect LEDs from burning out."
        },
        {
          "id": "phone-charger",
          "role": "Pull-up Resistor",
          "desc": "Voltage guide. Holds signal pins at a stable HIGH state when not pressed."
        },
        {
          "id": "amplifier",
          "role": "Voltage Divider",
          "desc": "Voltage splitter. Divides a larger voltage into smaller values."
        }
      ],
      "quickSummary": [
        "Resists electric current, regulating current flow levels.",
        "Generates a voltage drop across itself following Ohm’s Law (V = I * R).",
        "Non-polarized: Can be soldered in any direction in a circuit."
      ],
      "commonMistakes": [
        {
          "question": "Choosing wrong wattage",
          "answer": "Resistors turn electrical friction into heat. Using a low-wattage resistor in a high-power circuit makes it burn up and smell like smoke!"
        }
      ],
      "subcategory": "Resistors",
      "estimatedTime": "15 min",
      "learningObjectives": [
        "Understand electrical resistance and Ohm's Law.",
        "Read and calculate 4-band resistor color codes.",
        "Choose the correct resistor values to protect components."
      ],
      "learningOutcome": "After completing this lesson, students will be able to understand, identify, and correctly use resistors in practical circuits.",
      "workingPrinciple": {
        "whatIsIt": "A Resistor is a passive electrical component that creates resistance in the flow of electric current.",
        "whyNeeded": "It limits current flow and divides voltage to prevent damage to sensitive components like LEDs.",
        "howItWorks": "By using carbon or metal film materials that restrict the flow of electrons, it converts excess electrical energy into heat."
      },
      "pinout": {
        "pins": [
          {
            "name": "Lead A",
            "direction": "Bi-directional",
            "voltage": "V_in",
            "description": "Left wire terminal. Can connect to positive or negative."
          },
          {
            "name": "Lead B",
            "direction": "Bi-directional",
            "voltage": "V_out",
            "description": "Right wire terminal. Can connect to positive or negative."
          }
        ]
      },
      "circuitSymbol": {
        "svg": "<svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\"><line x1=\"5\" y1=\"20\" x2=\"25\" y2=\"20\" /><polyline points=\"25,20 29,10 35,30 41,10 47,30 51,20\" /><line x1=\"51\" y1=\"20\" x2=\"75\" y2=\"20\" /></svg>",
        "meaning": "A zigzag line representing the electrical friction or difficult path that limits current.",
        "orientation": "Non-polarized. Can be placed in either direction.",
        "usage": "Place in series with any component needing current protection."
      },
      "internalStructure": {
        "svg": "<svg viewBox=\"0 0 100 50\" width=\"100\" height=\"50\"><rect x=\"10\" y=\"15\" width=\"80\" height=\"20\" fill=\"#cbd5e1\" stroke=\"currentColor\" stroke-width=\"1.5\" /><line x1=\"0\" y1=\"25\" x2=\"10\" y2=\"25\" stroke=\"currentColor\" stroke-width=\"2\" /><line x1=\"90\" y1=\"25\" x2=\"100\" y2=\"25\" stroke=\"currentColor\" stroke-width=\"2\" /></svg>",
        "description": "Constructed by wrapping a resistive film around a ceramic core and attaching metal end caps and leads."
      },
      "specifications": [
        {
          "label": "Resistance Range",
          "value": "1Ω to 10MΩ"
        },
        {
          "label": "Tolerance Options",
          "value": "±1%, ±5%, ±10%"
        },
        {
          "label": "Power Rating (Standard)",
          "value": "0.25W (1/4W)"
        },
        {
          "label": "Max Voltage",
          "value": "250V DC"
        },
        {
          "label": "Package Styles",
          "value": "Axial Lead / SMD 0805"
        }
      ],
      "advantages": [
        "Extremely inexpensive and reliable",
        "Small size and easy to install",
        "Provides precise current control"
      ],
      "limitations": [
        "Converts electrical energy to wasted heat",
        "Cannot handle high power without getting very hot",
        "Fixed value cannot be adjusted dynamically"
      ],
      "engineeringTips": [
        "Always leave a safety margin in wattage: choose a resistor rated for at least double the calculated power dissipation.",
        "Use gold band resistors (5% tolerance) for standard projects, and blue-body metal film resistors (1% tolerance) for precise analog readings."
      ],
      "safetyNotes": [
        "Resistors can become hot enough to burn skin if operated near their power limit.",
        "Never exceed the voltage rating of a resistor (typically 250V for 1/4W)."
      ],
      "engineeringChecklist": [
        "Verify resistance value using a multimeter or color codes.",
        "Check power rating (e.g. 1/4W, 1/2W, or 1W) matches the circuit load.",
        "Ensure leads are trimmed and do not touch other metal components."
      ],
      "datasheet": "Typical 1/4W Carbon Film Resistor: Tolerance ±5%, Max Operating Voltage 250V, Temperature Coefficient -450 ppm/°C.",
      "downloads": [
        {
          "type": "Datasheet PDF",
          "filename": "resistor_1_4w_datasheet.pdf",
          "size": "124 KB"
        },
        {
          "type": "Color Code Guide",
          "filename": "resistor_color_codes.pdf",
          "size": "320 KB"
        }
      ],
      "arduinoExamples": [
        {
          "title": "LED Protection Setup",
          "code": "\nvoid setup() {\n  pinMode(13, OUTPUT); // Pin 13 has a built-in resistor on some boards\n}\nvoid loop() {\n  digitalWrite(13, HIGH); // Output 5V, protected by resistor\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n        "
        }
      ],
      "wiringExamples": [
        {
          "description": "Connect resistor from Arduino Pin 9 to the Anode of an LED.",
          "connections": [
            {
              "from": "Arduino D9",
              "to": "Resistor Lead A"
            },
            {
              "from": "Resistor Lead B",
              "to": "LED Anode"
            }
          ]
        }
      ],
      "simulations": [
        {
          "name": "Ohm's Law Interactive Lab",
          "url": "https://example.com/resistor-sim"
        }
      ],
      "relatedLessons": [
        "what-is-electricity",
        "resistance",
        "ohms-law"
      ],
      "relatedComponents": [
        "potentiometer",
        "light-emitting-diode",
        "electrolytic-capacitor"
      ],
      "relatedProjects": [
        "smart-plant-monitor",
        "light-theremin"
      ],
      "comparisonComponents": [
        {
          "name": "Resistor vs Potentiometer",
          "pros": [
            "Cheap, static, small size"
          ],
          "cons": [
            "Cannot adjust resistance value dynamically"
          ],
          "idealFor": "Static current limiting"
        }
      ],
      "quiz": [
        {
          "question": "Which law describes the relationship between voltage, current, and resistance?",
          "options": [
            "Newton's Law",
            "Ohm's Law",
            "Coulomb's Law",
            "Kirchhoff's Law"
          ],
          "answer": 1,
          "explanation": "Ohm's Law states that V = I * R, which governs resistor behavior."
        }
      ],
      "xpReward": 50,
      "aiSuggestedQuestions": [
        "How do I read resistor color codes?",
        "What happens if I use a 100-ohm resistor instead of a 220-ohm resistor?",
        "How do I calculate power dissipation in a resistor?"
      ],
      "buildChallenge": {
        "objective": "Build a basic LED current limiter circuit to protect the LED from burning out.",
        "estimatedTime": "10 min",
        "difficulty": "Beginner",
        "requiredComponents": [
          {
            "name": "LED",
            "slug": "light-emitting-diode"
          },
          {
            "name": "220Ω Resistor",
            "slug": "fixed-resistor"
          },
          {
            "name": "Breadboard",
            "slug": "breadboard"
          },
          {
            "name": "9V Battery & Clip",
            "slug": "battery"
          }
        ],
        "requiredTools": [
          "Breadboard",
          "Jumper Wires"
        ],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the 220Ω Resistor across the breadboard center gap.",
            "expectedResult": "Resistor bridges rows 10 and 15."
          },
          {
            "stepNum": 2,
            "text": "Insert the LED. Connect the long leg (Anode) to the resistor row 15.",
            "expectedResult": "LED Cathode is in row 16."
          },
          {
            "stepNum": 3,
            "text": "Connect battery negative (black wire) to LED Cathode row 16. Connect positive (red wire) to Resistor row 10.",
            "expectedResult": "Circuit loop is completed."
          }
        ],
        "expectedOutput": "The LED glows brightly without burning out.",
        "troubleshooting": [
          {
            "symptom": "LED does not glow",
            "causes": [
              "Reverse polarity",
              "Loose connection"
            ],
            "fixSteps": [
              "Turn the LED legs around.",
              "Check if wires are pushed all the way in."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Increase Resistance",
            "description": "Replace the 220Ω resistor with a 10kΩ resistor and observe the LED brightness drop."
          }
        ],
        "verificationChecklist": [
          "Resistor value is 220 ohms",
          "LED long leg is connected to resistor",
          "Battery polarities match"
        ],
        "reflectionQuestions": [
          "Why did the LED get dimmer when you used a larger resistor value?",
          "What would happen if you removed the resistor and connected the LED directly to the 9V battery?"
        ],
        "relatedProjects": [
          "LED Blinker",
          "Light Control dial"
        ],
        "xpReward": 100,
        "badge": "Practical Electronics Badge"
      }
    },
    {
      "name": "Variable Resistor",
      "slug": "variable-resistor",
      "category": "Passive Components",
      "description": "A resistor whose resistance can be adjusted by turning a dial. Commonly used as volume controls.",
      "status": "new",
      "mission": "Learn how to adjust resistance dynamically.",
      "prerequisites": [
        "fixed-resistor"
      ],
      "learningOutcomes": [
        "How variable resistors work",
        "Potentiometer basics",
        "Controlling voltage output"
      ],
      "typicalValue": "10kΩ",
      "polarity": "Non-polarized",
      "difficulty": "Beginner",
      "learningTime": "7 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"5\" y1=\"20\" x2=\"25\" y2=\"20\" />\n          <polyline points=\"25,20 29,10 35,30 41,10 47,30 51,20\" />\n          <line x1=\"51\" y1=\"20\" x2=\"75\" y2=\"20\" />\n          <line x1=\"38\" y1=\"38\" x2=\"38\" y2=\"15\" />\n          <polygon points=\"38,15 34,22 42,22\" fill=\"currentColor\" />\n        </svg>\n      ",
      "specs": [
        {
          "label": "Category",
          "value": "Passive"
        },
        {
          "label": "Common Value",
          "value": "1kΩ - 100kΩ"
        },
        {
          "label": "Power Rating",
          "value": "0.1W - 0.5W"
        },
        {
          "label": "Adjustment Type",
          "value": "Rotary Shaft"
        }
      ],
      "parts": [
        {
          "id": "shaft",
          "name": "Turning Shaft",
          "description": "The knob you rotate to change the resistance.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "24px",
            "height": "34px",
            "borderRadius": "4px 4px 0 0",
            "background": "linear-gradient(90deg, #94a3b8, #cbd5e1, #64748b)",
            "border": "1px solid rgba(255, 255, 255, 0.2)",
            "assembledY": -65,
            "explodedY": -140,
            "zIndex": 5,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "The metal rod that you turn with your fingers."
            },
            {
              "question": "What is its job?",
              "answer": "It is connected to the wiper inside, moving it along the track when you rotate it."
            }
          ]
        },
        {
          "id": "case",
          "name": "Metal Case",
          "description": "Metal cover protecting the internal track.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "64px",
            "height": "40px",
            "borderRadius": "32px 32px 4px 4px",
            "background": "linear-gradient(135deg, #1e293b, #334155)",
            "border": "1px solid rgba(255, 255, 255, 0.1)",
            "assembledY": -40,
            "explodedY": -70,
            "zIndex": 4,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "The metal enclosure of the potentiometer."
            },
            {
              "question": "What is its job?",
              "answer": "It shields the delicate resistive parts inside from dirt and static noise."
            }
          ]
        },
        {
          "id": "track",
          "name": "Carbon Track",
          "description": "A horseshoe-shaped strip of resistive carbon inside.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "52px",
            "height": "14px",
            "borderRadius": "6px",
            "background": "linear-gradient(90deg, #090d16, #1e293b, #090d16)",
            "assembledY": -15,
            "explodedY": 5,
            "zIndex": 3,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "A curved strip coated in carbon."
            },
            {
              "question": "What is its job?",
              "answer": "It creates a resistive path. The further the wiper travels along it, the higher the resistance."
            }
          ]
        },
        {
          "id": "wiper",
          "name": "Wiper Contact",
          "description": "A sliding metal contact that moves along the track.",
          "connectorY": 320,
          "labelSide": "right",
          "labelY": 320,
          "visual": {
            "width": "18px",
            "height": "24px",
            "background": "linear-gradient(90deg, #fbbf24, #d97706)",
            "assembledY": -5,
            "explodedY": 45,
            "zIndex": 2,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "A tiny sliding metal contact."
            },
            {
              "question": "What is its job?",
              "answer": "It taps into the carbon track. Its position determines the output resistance."
            }
          ]
        },
        {
          "id": "leads",
          "name": "Terminals",
          "description": "Three connecting pins (ends of the track, plus the moving wiper).",
          "connectorY": 390,
          "labelSide": "left",
          "labelY": 390,
          "visual": {
            "width": "46px",
            "height": "30px",
            "assembledY": 15,
            "explodedY": 95,
            "zIndex": 1,
            "type": "leads_potentiometer"
          },
          "cards": [
            {
              "question": "Why three pins?",
              "answer": "The outer pins connect to the full track. The middle pin is connected to the moving wiper."
            },
            {
              "question": "How is it used?",
              "answer": "To use it as a simple volume dial, connect one side to audio in, one to ground, and the middle pin to your output."
            }
          ]
        }
      ],
      "defaultCards": [
        {
          "question": "What is it?",
          "answer": "An adjustable resistor. You can change its resistance manually by turning a shaft."
        },
        {
          "question": "Why is it used?",
          "answer": "It lets users control things manually, like volume on a radio or the speed of a motor."
        },
        {
          "question": "How does it work?",
          "answer": "Turning the knob slides a metal finger (wiper) along a resistive track, altering the resistance path length."
        }
      ],
      "applications": [
        {
          "id": "amplifier",
          "role": "Volume Control",
          "desc": "Volume dial. Adjusts the music level in headphones or speakers."
        },
        {
          "id": "arduino",
          "role": "Brightness Dimmer",
          "desc": "Brightness control. Adjusts brightness of LED panels or screens."
        },
        {
          "id": "television",
          "role": "Sensor input",
          "desc": "Position sensor. Detects how far you push joystick controller sticks."
        }
      ],
      "quickSummary": [
        "Provides adjustable resistance by turning a dial.",
        "Uses a sliding wiper contact on a resistive track.",
        "Usually has three pins: two fixed ends and one adjustable wiper."
      ],
      "commonMistakes": [
        {
          "question": "Wiring the wiper wrong",
          "answer": "Swapping the center wiper pin with an outer pin is very common. This makes the dial act as an on-off switch or work backwards!"
        }
      ],
      "subcategory": "Resistors",
      "estimatedTime": "15 min",
      "learningObjectives": [
        "Understand variable resistance and how to divide voltage.",
        "Identify terminal pins on a standard rotary potentiometer.",
        "Integrate potentiometers with microcontroller analog inputs."
      ],
      "learningOutcome": "After completing this lesson, students will be able to configure and program variable resistors to dynamically control signal levels.",
      "workingPrinciple": {
        "whatIsIt": "A Variable Resistor (Potentiometer) is a resistor whose resistance value can be manually adjusted.",
        "whyNeeded": "It provides user control interfaces, such as volume dials, lighting dimmers, or speed knobs.",
        "howItWorks": "Rotating the shaft slides a metallic wiper along a carbon track, shifting the resistive length and output voltage."
      },
      "pinout": {
        "pins": [
          {
            "name": "Terminal 1",
            "direction": "Input",
            "voltage": "V_in",
            "description": "Left pin. Connected to one side of the carbon track."
          },
          {
            "name": "Wiper",
            "direction": "Output",
            "voltage": "Adjustable",
            "description": "Middle pin. Connected to the sliding wiper contact."
          },
          {
            "name": "Terminal 2",
            "direction": "Input",
            "voltage": "GND",
            "description": "Right pin. Connected to the other side of the carbon track."
          }
        ]
      },
      "circuitSymbol": {
        "svg": "<svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\"><line x1=\"5\" y1=\"20\" x2=\"25\" y2=\"20\" /><polyline points=\"25,20 29,10 35,30 41,10 47,30 51,20\" /><line x1=\"51\" y1=\"20\" x2=\"75\" y2=\"20\" /><line x1=\"38\" y1=\"38\" x2=\"38\" y2=\"15\" /><polygon points=\"38,15 34,22 42,22\" fill=\"currentColor\" /></svg>",
        "meaning": "A standard resistor zigzag with an arrow pointing to the center, representing the adjustable wiper.",
        "orientation": "Non-polarized, but pin configuration affects turning direction polarity.",
        "usage": "Wired as a voltage divider (3 pins) or a rheostat (2 pins)."
      },
      "internalStructure": {
        "svg": "<svg viewBox=\"0 0 100 50\" width=\"100\" height=\"50\"><circle cx=\"50\" cy=\"25\" r=\"18\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" /><line x1=\"50\" y1=\"25\" x2=\"50\" y2=\"12\" stroke=\"currentColor\" stroke-width=\"2\" /></svg>",
        "description": "Built with a circular carbon resistive track, a metal wiper brush attached to a central rotating shaft, and three wire terminals."
      },
      "specifications": [
        {
          "label": "Resistance Range",
          "value": "10kΩ (Typical)"
        },
        {
          "label": "Taper Type",
          "value": "Linear (Type B)"
        },
        {
          "label": "Power Dissipation",
          "value": "0.1W"
        },
        {
          "label": "Rotation Angle",
          "value": "300° ±5°"
        },
        {
          "label": "Lifetime",
          "value": "15,000 cycles"
        }
      ],
      "advantages": [
        "Simple analog input interface",
        "Requires no external power to resist current",
        "Provides smooth, infinite adjustment resolution"
      ],
      "limitations": [
        "Mechanical parts wear out over time",
        "Susceptible to dust and static noise",
        "Not suitable for high current loads"
      ],
      "engineeringTips": [
        "For stable microchip analog readings, place a small 0.1uF capacitor between the wiper pin and ground to filter high-frequency noise.",
        "Check if your pot is linear (type B, best for sensors/tuning) or logarithmic (type A, best for audio volume)."
      ],
      "safetyNotes": [
        "Never short-circuit the wiper pin directly from positive supply to ground, as this will burn out the track."
      ],
      "engineeringChecklist": [
        "Confirm the total end-to-end track resistance matches your design.",
        "Identify the center wiper pin correctly to avoid incorrect voltage spikes."
      ],
      "datasheet": "Linear Rotary Potentiometer: Power rating 0.1W, Tolerance ±20%, Max Voltage 50V AC / 20V DC.",
      "downloads": [
        {
          "type": "Datasheet PDF",
          "filename": "potentiometer_rotary.pdf",
          "size": "180 KB"
        }
      ],
      "arduinoExamples": [
        {
          "title": "Analog Input Read",
          "code": "\nvoid setup() {\n  Serial.begin(9600);\n}\nvoid loop() {\n  int sensorVal = analogRead(A0); // Read wiper voltage\n  Serial.println(sensorVal);     // Output 0 - 1023\n  delay(100);\n}\n        "
        }
      ],
      "wiringExamples": [
        {
          "description": "Connect left pin to 5V, center pin to A0, right pin to GND.",
          "connections": [
            {
              "from": "Arduino 5V",
              "to": "Pot Pin 1"
            },
            {
              "from": "Arduino A0",
              "to": "Pot Pin 2 (Wiper)"
            },
            {
              "from": "Arduino GND",
              "to": "Pot Pin 3"
            }
          ]
        }
      ],
      "simulations": [
        {
          "name": "Potentiometer Control Simulator",
          "url": "https://example.com/pot-sim"
        }
      ],
      "relatedLessons": [
        "resistance",
        "voltage",
        "ohms-law"
      ],
      "relatedComponents": [
        "fixed-resistor",
        "light-emitting-diode"
      ],
      "relatedProjects": [
        "light-theremin",
        "smart-plant-monitor"
      ],
      "comparisonComponents": [
        {
          "name": "Fixed vs Variable Resistor",
          "pros": [
            "Adjustable resistance on-the-fly"
          ],
          "cons": [
            "Larger size, mechanically fragile"
          ],
          "idealFor": "User control interfaces"
        }
      ],
      "quiz": [
        {
          "question": "Which pin of a standard 3-pin potentiometer outputs the adjustable voltage?",
          "options": [
            "Left Pin",
            "Right Pin",
            "Center Pin (Wiper)",
            "Metal Case"
          ],
          "answer": 2,
          "explanation": "The center pin is connected to the wiper which slides along the track."
        }
      ],
      "xpReward": 50,
      "aiSuggestedQuestions": [
        "What is the difference between linear and logarithmic taper?",
        "How do I use a potentiometer as a variable current limiter (rheostat)?"
      ],
      "buildChallenge": {
        "objective": "Build an LED brightness dial controller circuit using a potentiometer.",
        "estimatedTime": "15 min",
        "difficulty": "Beginner",
        "requiredComponents": [
          {
            "name": "10kΩ Potentiometer",
            "slug": "variable-resistor"
          },
          {
            "name": "LED",
            "slug": "light-emitting-diode"
          },
          {
            "name": "220Ω Resistor",
            "slug": "fixed-resistor"
          },
          {
            "name": "9V Battery & Clip",
            "slug": "battery"
          }
        ],
        "requiredTools": [
          "Breadboard",
          "Jumper Wires"
        ],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the Potentiometer into the breadboard.",
            "expectedResult": "Terminals are locked into separate rows."
          },
          {
            "stepNum": 2,
            "text": "Connect battery positive (red wire) to Pot Pin 1. Connect battery negative (black wire) to Pot Pin 3.",
            "expectedResult": "Power track is established."
          },
          {
            "stepNum": 3,
            "text": "Connect one lead of the 220Ω resistor to Pot Pin 2 (Wiper center). Connect the other resistor lead to LED Anode.",
            "expectedResult": "Wiper output flows to LED."
          },
          {
            "stepNum": 4,
            "text": "Connect LED Cathode to battery negative row.",
            "expectedResult": "Common ground return is complete."
          }
        ],
        "expectedOutput": "Rotating the potentiometer knob smoothly adjusts the LED brightness from fully off to fully on.",
        "troubleshooting": [
          {
            "symptom": "LED burns out or dials incorrectly",
            "causes": [
              "Omitted the 220-ohm safety resistor",
              "Wiper connected wrong"
            ],
            "fixSteps": [
              "Always keep the safety resistor in series to prevent shorting.",
              "Verify center pin matches wiper."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Reverse turning direction",
            "description": "Swap the battery wires on Pot Pin 1 and Pin 3 and observe the brightness toggle direction swap."
          }
        ],
        "verificationChecklist": [
          "Safety resistor is present in the path",
          "Center pin of pot is wired to resistor",
          "Wiper output voltage is smooth"
        ],
        "reflectionQuestions": [
          "Why was the extra 220-ohm resistor required in this circuit?",
          "What would happen if you turned the dial to 0-ohm resistance without that safety resistor?"
        ],
        "relatedProjects": [
          "Light Dimmer",
          "Volume Controller Dial"
        ],
        "xpReward": 100,
        "badge": "Analog Tuning Badge"
      }
    },
    {
      "name": "LDR (Photoresistor)",
      "slug": "ldr",
      "category": "Passive Components",
      "description": "A light-sensitive resistor whose resistance decreases when light shines on it.",
      "status": "completed",
      "mission": "Explore how light alters electrical resistance.",
      "prerequisites": ["resistance", "current"],
      "learningOutcomes": [
        "How LDRs detect light",
        "Light vs dark resistance ranges",
        "Building light-sensing divider circuits"
      ],
      "typicalValue": "10kΩ in light, 1MΩ in dark",
      "polarity": "Non-polarized",
      "difficulty": "Beginner",
      "learningTime": "6 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <circle cx=\"38\" cy=\"20\" r=\"16\" stroke=\"currentColor\" stroke-width=\"1.5\" />\n          <line x1=\"5\" y1=\"20\" x2=\"22\" y2=\"20\" />\n          <polyline points=\"22,20 26,13 32,27 38,13 44,27 48,20\" />\n          <line x1=\"48\" y1=\"20\" x2=\"71\" y2=\"20\" />\n          <line x1=\"22\" y1=\"5\" x2=\"28\" y2=\"11\" />\n          <polygon points=\"28,11 23,10 27,6\" fill=\"currentColor\" />\n          <line x1=\"16\" y1=\"10\" x2=\"22\" y2=\"16\" />\n          <polygon points=\"22,16 17,15 21,11\" fill=\"currentColor\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Passive Sensor" },
        { "label": "Light Resistance", "value": "100Ω - 2kΩ" },
        { "label": "Dark Resistance", "value": "1MΩ - 10MΩ" },
        { "label": "Response Time", "value": "20ms - 30ms" }
      ],
      "parts": [
        {
          "id": "substrate",
          "name": "Ceramic Substrate",
          "description": "White ceramic plate that provides structural support.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "60px",
            "height": "40px",
            "borderRadius": "4px",
            "background": "#f8fafc",
            "border": "1px solid rgba(255,255,255,0.2)",
            "assembledY": -50,
            "explodedY": -130,
            "zIndex": 5,
            "type": "block"
          }
        },
        {
          "id": "track",
          "name": "Cadmium Sulfide Track",
          "description": "The zig-zag light-sensitive semiconductor track.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "48px",
            "height": "28px",
            "background": "repeating-linear-gradient(45deg, #f97316, #f97316 4px, #ef4444 4px, #ef4444 8px)",
            "assembledY": -30,
            "explodedY": -60,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "electrodes",
          "name": "Metal Electrodes",
          "description": "Metal contacts that connect the CdS track to the leads.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "52px",
            "height": "32px",
            "background": "rgba(203, 213, 225, 0.4)",
            "border": "1.5px solid #cbd5e1",
            "assembledY": -15,
            "explodedY": 20,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "coating",
          "name": "Epoxy Coating",
          "description": "Transparent protective layer that seals out moisture.",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "64px",
            "height": "44px",
            "borderRadius": "6px",
            "background": "rgba(251, 146, 60, 0.15)",
            "border": "1px solid rgba(251, 146, 60, 0.3)",
            "assembledY": -50,
            "explodedY": 90,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Tin-plated copper pins that connect LDR into circuits.",
          "connectorY": 380,
          "labelSide": "left",
          "labelY": 380,
          "visual": {
            "width": "30px",
            "height": "70px",
            "assembledY": 10,
            "explodedY": 160,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is an LDR?",
          "answer": "A special resistor whose resistance shifts with ambient light."
        },
        {
          "question": "How does CdS work?",
          "answer": "Cadmium sulfide is a semiconductor. Light gives electrons enough energy to break free, increasing conduction and dropping resistance."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A photo-sensitive resistor.",
        "whyNeeded": "To detect ambient light levels and trigger light-activated switches.",
        "howItWorks": "Under darkness, it acts as a very high resistor (up to 1MΩ). Under light, its free carriers multiply, dropping resistance down to a few hundred ohms.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <circle cx=\"50\" cy=\"50\" r=\"45\" fill=\"none\" stroke=\"#f97316\" stroke-width=\"4\" />\n            <path d=\"M20,50 Q35,20 50,50 T80,50\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"6\" />\n            <line x1=\"25\" y1=\"15\" x2=\"45\" y2=\"35\" stroke=\"#eab308\" stroke-width=\"3\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "A zig-zag resistor enclosed in a circle with light ray arrows.",
        "usage": "Connect in series with a fixed resistor to form a light-to-voltage divider."
      },
      "advantages": [
        "Very inexpensive",
        "Easy to interface",
        "Highly sensitive to light changes"
      ],
      "limitations": [
        "Slow response time (tens of milliseconds)",
        "Not suitable for precise lux measurements",
        "Temperature dependent"
      ],
      "engineeringChecklist": [
        "Check light/dark resistance values",
        "Align LDR sensor towards the light source",
        "Verify divider resistor value matches nominal LDR resistance"
      ],
      "safetyNotes": [
        "Do not exceed maximum power dissipation limits.",
        "Cadmium sulfide is toxic; handle with care and recycle properly."
      ],
      "commonMistakes": [
        {
          "question": "LDR is not detecting changes",
          "answer": "It is connected alone without a fixed resistor in a voltage divider. An LDR requires a divider to convert resistance changes to voltage changes."
        }
      ],
      "engineeringTips": [
        "Use a 10kΩ series resistor for general outdoor/indoor lighting thresholds.",
        "Cover the LDR with shrink tube to focus light detection directionally."
      ],
      "quiz": [
        {
          "question": "What happens to LDR resistance when light intensity increases?",
          "options": [
            "It increases exponentially",
            "It remains constant",
            "It decreases significantly",
            "It fluctuates randomly"
          ],
          "answer": 2,
          "explanation": "Light energy frees charge carriers in the CdS track, dropping resistance from megaohms to hundreds of ohms."
        },
        {
          "question": "Why is LDR wired in series with a fixed resistor?",
          "options": [
            "To filter high frequency noise",
            "To form a voltage divider that outputs variable voltage",
            "To prevent short circuiting the battery",
            "To increase light absorption speed"
          ],
          "answer": 1,
          "explanation": "The series combination forms a voltage divider, translating resistance variations into readable analog voltage."
        }
      ],
      "buildChallenge": {
        "objective": "Build an automatic night lamp circuit that turns on an LED when the LDR sensor is covered.",
        "estimatedTime": "12 min",
        "difficulty": "Beginner",
        "requiredComponents": [
          { "name": "LDR Sensor", "slug": "ldr" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the LDR and a 10kΩ Resistor in series on the breadboard to form a divider row.",
            "expectedResult": "LDR and Resistor meet at row 15."
          },
          {
            "stepNum": 2,
            "text": "Connect the LDR end to GND. Connect the 10kΩ Resistor end to battery positive (+).",
            "expectedResult": "Voltage divider is powered."
          },
          {
            "stepNum": 3,
            "text": "Connect the divider output row 15 to the LED Anode. Connect the LED Cathode to battery positive (+) row.",
            "expectedResult": "LED lights up as LDR goes dark."
          }
        ],
        "expectedOutput": "Covering the LDR with your finger decreases voltage at the middle pin, forcing the LED to light up automatically.",
        "troubleshooting": [
          {
            "symptom": "LED stays permanently on or off",
            "causes": ["Incorrect wire connections", "Fixed resistor is too small/large"],
            "fixSteps": [
              "Verify LDR and 10k resistor meet at the same breadboard node.",
              "Adjust series resistor size closer to the LDR's threshold range."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Torch light test",
            "description": "Shine a flashlight on LDR and watch the LED turn off instantly."
          }
        ],
        "verificationChecklist": [
          "Divider center pin connected to LED",
          "Covering LDR triggers LED response",
          "Tin pins are securely pressed"
        ],
        "reflectionQuestions": [
          "Explain why voltage at the divider node shifts when light changes.",
          "What component could you add to make the night lamp switch faster without intermediate dimming?"
        ],
        "relatedProjects": ["Solar Charger Controller", "Optical Alarm Sensor"],
        "xpReward": 60,
        "badge": "Solar Guardian Badge"
      }
    },
    {
      "name": "NTC Thermistor",
      "slug": "thermistor",
      "category": "Passive Components",
      "description": "A thermal resistor whose resistance decreases sharply as temperature rises.",
      "status": "completed",
      "mission": "Learn to monitor temperature electrically.",
      "prerequisites": ["resistance", "current"],
      "learningOutcomes": [
        "Understand NTC vs PTC temperature coefficients",
        "Measuring resistance changes with temperature",
        "Interfacing thermistors for heat alarms"
      ],
      "typicalValue": "10kΩ at 25°C",
      "polarity": "Non-polarized",
      "difficulty": "Intermediate",
      "learningTime": "7 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"5\" y1=\"20\" x2=\"25\" y2=\"20\" />\n          <polyline points=\"25,20 29,10 35,30 41,10 47,30 51,20\" />\n          <line x1=\"51\" y1=\"20\" x2=\"75\" y2=\"20\" />\n          <line x1=\"20\" y1=\"32\" x2=\"55\" y2=\"8\" />\n          <line x1=\"20\" y1=\"32\" x2=\"24\" y2=\"32\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Passive Sensor" },
        { "label": "Nominal Resistance", "value": "10kΩ at 25°C" },
        { "label": "B-Constant", "value": "3950K" },
        { "label": "Operating Range", "value": "-40°C to +125°C" }
      ],
      "parts": [
        {
          "id": "bead",
          "name": "Epoxy Bead",
          "description": "Protective epoxy resin coating shaped as a teardrop.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "36px",
            "height": "36px",
            "borderRadius": "50%",
            "background": "linear-gradient(135deg, #1e293b, #0f172a)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "assembledY": -40,
            "explodedY": -110,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "sinter",
          "name": "Sintered Oxide Core",
          "description": "Pressed metal oxide semiconductor core that responds to heat.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "20px",
            "height": "20px",
            "borderRadius": "50%",
            "background": "linear-gradient(135deg, #ef4444, #b91c1c)",
            "assembledY": -30,
            "explodedY": -50,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Insulated Leads",
          "description": "Nickel-plated leads covered in high-temp insulating sleeves.",
          "connectorY": 260,
          "labelSide": "left",
          "labelY": 260,
          "visual": {
            "width": "30px",
            "height": "70px",
            "assembledY": 10,
            "explodedY": 80,
            "zIndex": 2,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is NTC?",
          "answer": "Negative Temperature Coefficient. It means resistance drops as temperature rises."
        },
        {
          "question": "Why metal oxides?",
          "answer": "Metal oxides like nickel, manganese, and cobalt act as semiconductors where heat frees charge carriers, decreasing resistance."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A temperature-sensitive resistor.",
        "whyNeeded": "To measure or detect heat thresholds in batteries, appliances, and industrial gear.",
        "howItWorks": "As the sintered semiconductor core heats up, valence electrons gain thermal energy to move, dropping the overall resistance exponentially.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <circle cx=\"50\" cy=\"50\" r=\"35\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"4\" />\n            <rect x=\"35\" y=\"35\" width=\"30\" height=\"30\" fill=\"#1e293b\" stroke=\"#94a3b8\" stroke-width=\"2\" />\n            <path d=\"M20,80 L80,20\" stroke=\"#ef4444\" stroke-width=\"3\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "A resistor with a diagonal slash and flat step, showing non-linear temperature response.",
        "usage": "Wire in series with a 10k resistor to feed an analog input ADC pin."
      },
      "advantages": [
        "Extremely high thermal sensitivity",
        "Rugged teardrop profile",
        "Low cost"
      ],
      "limitations": [
        "Highly non-linear response curve",
        "Requires mathematical calibration (Steinhart-Hart equation)",
        "Self-heating error if current is too high"
      ],
      "engineeringChecklist": [
        "Identify NTC or PTC variant specifications",
        "Avoid high measurement currents to prevent self-heating errors",
        "Verify nominal resistance at reference 25°C room temp"
      ],
      "safetyNotes": [
        "Ensure measurement currents remain below self-heating power thresholds.",
        "Protect leads from bare copper shorts if insulation is compromised."
      ],
      "commonMistakes": [
        {
          "question": "Self-Heating reads false hot temperatures",
          "answer": "Too much current is running through the thermistor. Use a larger series resistor or take pulse measurements to limit power dissipation."
        }
      ],
      "engineeringTips": [
        "Use a 10kΩ series resistor to build a temperature sensor voltage divider.",
        "Apply thermal paste when pressing the sensor bead to heat sinks."
      ],
      "quiz": [
        {
          "question": "What happens to NTC Thermistor resistance as temperature rises?",
          "options": [
            "It increases linearly",
            "It decreases sharply",
            "It stays locked at nominal value",
            "It fluctuates erratically"
          ],
          "answer": 1,
          "explanation": "NTC stand for Negative Temperature Coefficient: resistance drops exponentially as heat frees charge carriers."
        }
      ],
      "buildChallenge": {
        "objective": "Build a simple temperature alarm circuit using a thermistor divider to trigger a buzzer.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "NTC Thermistor", "slug": "thermistor" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "Buzzer", "slug": "buzzer" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the Thermistor and 10kΩ Resistor in series across the breadboard.",
            "expectedResult": "They share row 12 connection."
          },
          {
            "stepNum": 2,
            "text": "Connect the remaining Thermistor end to GND. Connect the Resistor end to positive (+).",
            "expectedResult": "Divider circuit is powered."
          },
          {
            "stepNum": 3,
            "text": "Connect the output row 12 to the Buzzer positive terminal. Connect Buzzer negative to GND.",
            "expectedResult": "Buzzer sounds when thermistor gets hot."
          }
        ],
        "expectedOutput": "Heating the thermistor bead (e.g. warming with your fingers) drops its resistance, sounding the buzzer alarm.",
        "troubleshooting": [
          {
            "symptom": "Buzzer sounds continuously",
            "causes": ["Swapped connection rows", "Reference resistor too small"],
            "fixSteps": [
              "Verify divider row matches buzzer trigger node.",
              "Use a larger series resistor to shift threshold trigger point."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Cooling test",
            "description": "Place an ice cube near the bead and witness the buzzer stop immediately as resistance climbs."
          }
        ],
        "verificationChecklist": [
          "Buzzer responds to heat shifts",
          "Voltage divider correctly wired",
          "Bead leads are kept isolated"
        ],
        "reflectionQuestions": [
          "How does a Negative Temperature Coefficient differ from Positive Temperature Coefficient (PTC)?",
          "Explain why NTC resistance does not decrease linearly with temperature changes."
        ],
        "relatedProjects": ["Smart Termostat Control", "PC Overheat Safety Alarm"],
        "xpReward": 70,
        "badge": "Thermal Tracker Badge"
      }
    }
  ]
};
