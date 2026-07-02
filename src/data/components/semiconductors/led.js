export const ledFamily = {
  "id": "led-diode",
  "name": "LED & Diode",
  "category": "Semiconductors",
  "variants": [
    {
      "name": "Light Emitting Diode (LED)",
      "slug": "light-emitting-diode",
      "category": "Semiconductors",
      "description": "A semiconductor diode that lights up when current flows through it in one direction.",
      "status": "new",
      "mission": "Learn how LEDs emit light and why they require current limiting.",
      "prerequisites": [
        "voltage",
        "current"
      ],
      "learningOutcomes": [
        "How LEDs emit light",
        "Polarity identification",
        "Sizing current-limiting resistors"
      ],
      "typicalValue": "2.0V, 20mA",
      "polarity": "Polarized",
      "difficulty": "Beginner",
      "learningTime": "8 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <polygon points=\"25,20 25,40 40,30\" fill=\"none\" />\n          <line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"40\" />\n          <line x1=\"40\" y1=\"30\" x2=\"50\" y2=\"30\" />\n          <line x1=\"28\" y1=\"18\" x2=\"20\" y2=\"10\" />\n          <polygon points=\"20,10 24,10 20,14\" fill=\"currentColor\" />\n          <line x1=\"38\" y1=\"18\" x2=\"30\" y2=\"10\" />\n          <polygon points=\"30,10 34,10 30,14\" fill=\"currentColor\" />\n        </svg>\n      ",
      "specs": [
        {
          "label": "Category",
          "value": "Semiconductor"
        },
        {
          "label": "Voltage Drop",
          "value": "1.8V - 3.3V"
        },
        {
          "label": "Max Current",
          "value": "20mA"
        },
        {
          "label": "Polarity",
          "value": "Polarized (Anode & Cathode)"
        }
      ],
      "parts": [
        {
          "id": "dome",
          "name": "Epoxy Dome",
          "description": "The plastic lens that protects the chip and shapes the light.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "56px",
            "height": "60px",
            "borderRadius": "28px 28px 4px 4px",
            "background": "rgba(139, 92, 246, 0.25)",
            "border": "1.5px solid var(--accent-violet)",
            "boxShadow": "0 0 15px rgba(139, 92, 246, 0.4)",
            "assembledY": -50,
            "explodedY": -140,
            "zIndex": 4,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "The transparent colored plastic cap covering the internals."
            },
            {
              "question": "Why is it domed?",
              "answer": "Its rounded top acts as a lens, focusing light so it shines brighter in one direction."
            }
          ]
        },
        {
          "id": "chip",
          "name": "Semiconductor Chip",
          "description": "The silicon crystal that emits light when powered.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "12px",
            "height": "12px",
            "background": "linear-gradient(135deg, #10b981, #059669)",
            "border": "1px solid rgba(255,255,255,0.2)",
            "assembledY": -35,
            "explodedY": -65,
            "zIndex": 3,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "A tiny crystal chip made of semiconductor material (like gallium)."
            },
            {
              "question": "How does it shine?",
              "answer": "When current passes through, electrons release energy as light. Changing the crystal material changes the color of the light!"
            }
          ]
        },
        {
          "id": "frame",
          "name": "Lead Frame",
          "description": "A small metal platform that holds the chip inside.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "42px",
            "height": "24px",
            "background": "linear-gradient(90deg, #94a3b8, #cbd5e1, #64748b)",
            "assembledY": -10,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          },
          "cards": [
            {
              "question": "What is it?",
              "answer": "Two metal brackets holding the internal parts."
            },
            {
              "question": "What is the cup?",
              "answer": "One side has a tiny reflecting cup. This holds the chip and reflects its light upwards."
            }
          ]
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "The metal legs. The positive leg is longer, and the negative leg has a flat side.",
          "connectorY": 320,
          "labelSide": "right",
          "labelY": 320,
          "visual": {
            "width": "40px",
            "height": "70px",
            "assembledY": 30,
            "explodedY": 105,
            "zIndex": 1,
            "type": "leads"
          },
          "cards": [
            {
              "question": "How to find polarity?",
              "answer": "The positive leg (Anode) is longer. The negative leg (Cathode) is shorter, and the plastic casing has a flat edge on that side."
            },
            {
              "question": "What happens if reversed?",
              "answer": "The LED blocks current and does not light up. It will not break unless the voltage is very high."
            }
          ]
        }
      ],
      "defaultCards": [
        {
          "question": "What is an LED?",
          "answer": "A Light Emitting Diode. It is a tiny semiconductor bulb that converts electricity directly into light with almost no heat."
        },
        {
          "question": "Why does it need a resistor?",
          "answer": "LEDs have no internal resistance. Connecting them directly to power lets current surge, burning out the tiny chip instantly."
        },
        {
          "question": "Is direction important?",
          "answer": "Yes! Current must enter the positive leg (Anode) and leave the negative leg (Cathode) to light it up."
        }
      ],
      "applications": [
        {
          "id": "arduino",
          "role": "Status Indicator",
          "desc": "Onboard status indicator. Blinks pin 13 to show the board is running code."
        },
        {
          "id": "phone-charger",
          "role": "Power Indicator",
          "desc": "Power indicator. Tells you when the charger is plugged in."
        },
        {
          "id": "television",
          "role": "Screen Backlight",
          "desc": "Screen illumination. Hundreds of white LEDs light up pixels from behind."
        }
      ],
      "quickSummary": [
        "Converts electrical energy directly into light.",
        "Polarized: Must connect positive (longer leg) and negative correctly.",
        "Always requires a current-limiting resistor to protect the chip."
      ],
      "commonMistakes": [
        {
          "question": "No resistor connected",
          "answer": "Never connect an LED directly to a battery without a resistor. Excess current will burn it out in a fraction of a second!"
        }
      ],
      "subcategory": "Diodes",
      "estimatedTime": "15 min",
      "learningObjectives": [
        "Understand semiconductor P-N junctions and photon emission.",
        "Properly identify Anode and Cathode pins of an LED.",
        "Sized current-limiting resistors for standard low-power indicators."
      ],
      "learningOutcome": "After completing this lesson, students will be able to calculate and wire LEDs safely without damage.",
      "workingPrinciple": {
        "whatIsIt": "A Light Emitting Diode (LED) is a semiconductor diode that emits light when current flows through it.",
        "whyNeeded": "LEDs are highly efficient indicators and illumination sources, converting electrical energy directly into light with minimal heat.",
        "howItWorks": "When voltage is applied in the forward direction, electrons recombine with electron holes within the device, releasing energy in the form of photons (electroluminescence)."
      },
      "pinout": {
        "pins": [
          {
            "name": "Anode (+)",
            "direction": "Input",
            "voltage": "1.8V - 3.3V",
            "description": "Positive lead (longer leg). Connect to positive voltage via a current-limiting resistor."
          },
          {
            "name": "Cathode (-)",
            "direction": "Output",
            "voltage": "0V (GND)",
            "description": "Negative lead (shorter leg, flat edge of casing). Connect to ground."
          }
        ]
      },
      "circuitSymbol": {
        "svg": "<svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\"><line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" /><polygon points=\"25,20 25,40 40,30\" fill=\"none\" /><line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"40\" /><line x1=\"40\" y1=\"30\" x2=\"50\" y2=\"30\" /><line x1=\"28\" y1=\"18\" x2=\"20\" y2=\"10\" /><polygon points=\"20,10 24,10 20,14\" fill=\"currentColor\" /><line x1=\"38\" y1=\"18\" x2=\"30\" y2=\"10\" /><polygon points=\"30,10 34,10 30,14\" fill=\"currentColor\" /></svg>",
        "meaning": "A standard diode triangle pointing in the direction of forward current flow, with two arrows pointing outward to represent light emission.",
        "orientation": "Current can only flow in the direction of the triangle (from Anode to Cathode).",
        "usage": "Always place in series with a resistor to protect the junction."
      },
      "internalStructure": {
        "svg": "<svg viewBox=\"0 0 100 50\" width=\"100\" height=\"50\"><rect x=\"35\" y=\"10\" width=\"30\" height=\"30\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" /></svg>",
        "description": "Constructed with a semiconductor chip (P-N junction) sitting in a reflective cup, connected by a bond wire to the leads and encapsulated in an epoxy lens dome."
      },
      "specifications": [
        {
          "label": "Forward Voltage (Red)",
          "value": "1.8V - 2.0V"
        },
        {
          "label": "Forward Voltage (Blue)",
          "value": "3.0V - 3.3V"
        },
        {
          "label": "Max Forward Current",
          "value": "20mA (Typical)"
        },
        {
          "label": "Peak Wavelength",
          "value": "625nm (Red)"
        }
      ],
      "advantages": [
        "Very high efficiency, low power consumption",
        "Solid state reliability, long operating life",
        "Instantaneous switching response speed"
      ],
      "limitations": [
        "Polarity sensitive, does not work if reversed",
        "Burns out instantly if current exceeds maximum rating",
        "Limited light spread angle without a diffusal cap"
      ],
      "engineeringTips": [
        "If the leads of an LED are cut short, check the plastic collar. The flat side indicates the negative Cathode lead.",
        "Never connect an LED directly to a power source like a 9V battery or Arduino pins without a series resistor!"
      ],
      "safetyNotes": [
        "Looking directly at high-power LEDs can cause eye strain or damage."
      ],
      "engineeringChecklist": [
        "Identify long lead (Anode) and short lead (Cathode) correctly.",
        "Ensure a series resistor (normally 220 or 330 ohms) is connected to limit current."
      ],
      "datasheet": "Standard 5mm Red Indicator LED: Forward Voltage 2.0V, Max Continuous Current 25mA, Luminous Intensity 80mcd.",
      "downloads": [
        {
          "type": "Datasheet PDF",
          "filename": "standard_5mm_led.pdf",
          "size": "150 KB"
        }
      ],
      "arduinoExamples": [
        {
          "title": "Blink Output",
          "code": "\nvoid setup() {\n  pinMode(9, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(9, HIGH); // Turn LED on\n  delay(500);\n  digitalWrite(9, LOW);  // Turn LED off\n  delay(500);\n}\n        "
        }
      ],
      "wiringExamples": [
        {
          "description": "Connect Arduino D9 -> 220-ohm Resistor -> LED Anode, and Cathode -> GND.",
          "connections": [
            {
              "from": "Arduino D9",
              "to": "Resistor Lead 1"
            },
            {
              "from": "Resistor Lead 2",
              "to": "LED Anode (+)"
            },
            {
              "from": "LED Cathode (-)",
              "to": "Arduino GND"
            }
          ]
        }
      ],
      "simulations": [
        {
          "name": "LED Decoupling Lab",
          "url": "https://example.com/led-sim"
        }
      ],
      "relatedLessons": [
        "what-is-electricity",
        "voltage",
        "current"
      ],
      "relatedComponents": [
        "fixed-resistor",
        "variable-resistor",
        "electrolytic-capacitor"
      ],
      "relatedProjects": [
        "smart-plant-monitor",
        "light-theremin"
      ],
      "comparisonComponents": [
        {
          "name": "LED vs Filament Bulb",
          "pros": [
            "Uses 90% less energy, lasts 50x longer"
          ],
          "cons": [
            "Polarized, requires current limiter"
          ],
          "idealFor": "Status indicators and energy-saving lighting"
        }
      ],
      "quiz": [
        {
          "question": "Which lead of an LED is connected to the positive supply?",
          "options": [
            "Cathode (shorter leg)",
            "Anode (longer leg)",
            "Wiper",
            "Grounding lead"
          ],
          "answer": 1,
          "explanation": "The Anode is the positive terminal and must be wired to the supply."
        }
      ],
      "xpReward": 50,
      "aiSuggestedQuestions": [
        "What is the typical forward voltage of a blue LED?",
        "Why do different colored LEDs require different resistor sizes?"
      ],
      "buildChallenge": {
        "objective": "Build and wire a basic indicator LED light loop on a breadboard.",
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
    }
  ]
};
