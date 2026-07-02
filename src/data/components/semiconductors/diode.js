export const diodeFamily = {
  "id": "diode",
  "name": "Diodes",
  "category": "Semiconductors",
  "variants": [
    {
      "name": "PN Junction Diode",
      "slug": "pn-junction-diode",
      "category": "Semiconductors",
      "description": "A component that acts as a one-way valve for electricity, letting current pass in one direction and blocking it in the other.",
      "status": "completed",
      "mission": "Learn how PN junctions enable one-way current flow.",
      "prerequisites": ["current", "voltage"],
      "learningOutcomes": [
        "Forward and reverse bias physics",
        "Silicon forward voltage drops",
        "Reverse protection applications"
      ],
      "typicalValue": "0.7V drop",
      "polarity": "Polarized",
      "difficulty": "Beginner",
      "learningTime": "7 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <polygon points=\"25,20 25,40 40,30\" fill=\"none\" />\n          <line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"40\" />\n          <line x1=\"40\" y1=\"30\" x2=\"50\" y2=\"30\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Semiconductor" },
        { "label": "Forward Voltage Drop", "value": "0.7V (Silicon)" },
        { "label": "Max Continuous Current", "value": "1A (e.g. 1N4007)" },
        { "label": "Peak Inverse Voltage (PIV)", "value": "50V - 1000V" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "Plastic Case",
          "description": "Black cylindrical casing protecting the internal silicon chip.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "80px",
            "height": "36px",
            "borderRadius": "4px",
            "background": "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "assembledY": -35,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "stripe",
          "name": "Cathode Stripe",
          "description": "Silver band marking the negative terminal (blocking wall side).",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "10px",
            "height": "36px",
            "background": "#cbd5e1",
            "assembledY": -35,
            "explodedY": -60,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "junction",
          "name": "PN Silicon Junction",
          "description": "The semiconductor boundary where P-type and N-type silicon interface.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "66px",
            "height": "18px",
            "background": "linear-gradient(90deg, #3b82f6 50%, #ef4444 50%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -15,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Axial tin-plated copper leads connecting the diode into circuits.",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "90px",
            "height": "8px",
            "assembledY": 10,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads_axial"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is a diode?",
          "answer": "A component that acts as a one-way valve for electricity, letting current pass forward and blocking it backward."
        },
        {
          "question": "Which side is the Cathode?",
          "answer": "The Cathode (negative side) is marked by the silver stripe. Solder it pointing in the direction of ground."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A one-way semiconductor valve.",
        "whyNeeded": "To protect circuits against reverse polarity and rectify AC current to DC.",
        "howItWorks": "Under forward bias (Anode positive), the internal depletion layer barrier shrinks, allowing current to flow. Under reverse bias, the barrier expands, blocking current flow.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <polygon points=\"30,20 30,80 70,50\" fill=\"#3b82f6\" />\n            <line x1=\"70\" y1=\"20\" x2=\"70\" y2=\"80\" stroke=\"#ef4444\" stroke-width=\"6\" />\n            <line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"currentColor\" stroke-dasharray=\"3,3\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "An arrow pointing to a vertical line blocker, denoting forward flow and reverse block.",
        "usage": "Use as a series rectifier or parallel protection shunt."
      },
      "advantages": [
        "Inexpensive reverse-polarity guard",
        "Handles high voltage ratings",
        "Extremely reliable switch action"
      ],
      "limitations": [
        "Loses 0.7V forward voltage across the silicon junction",
        "Slow switching speed compared to Schottky",
        "Suffers minor leakage current under high temperatures"
      ],
      "engineeringChecklist": [
        "Double-check alignment of the silver stripe",
        "Verify peak inverse voltage exceeds peak circuit surges",
        "Calculate heat dissipation if currents exceed 1 Ampere"
      ],
      "safetyNotes": [
        "Never connect a diode directly across power without a series load.",
        "Silicon diodes can get very hot during high continuous rectification."
      ],
      "commonMistakes": [
        {
          "question": "Circuit is dead after wiring protection",
          "answer": "The diode is wired in backwards. It blocks the entire power stream. Reverse the cathode silver ring direction."
        }
      ],
      "engineeringTips": [
        "Use a 1N4007 diode for general-purpose 9V battery reverse-voltage shielding."
      ],
      "quiz": [
        {
          "question": "What is the typical forward voltage drop of a standard silicon diode?",
          "options": ["0.2V", "0.7V", "1.2V", "5.0V"],
          "answer": 1,
          "explanation": "Silicon PN junctions require a 0.7V threshold potential barrier drop to start conducting in forward bias."
        }
      ],
      "buildChallenge": {
        "objective": "Build a reverse battery protection circuit to shield a delicate LED output.",
        "estimatedTime": "10 min",
        "difficulty": "Beginner",
        "requiredComponents": [
          { "name": "PN Junction Diode", "slug": "pn-junction-diode" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the Diode into the breadboard so the Anode (no stripe) is at row 5 and Cathode (silver stripe) is at row 10.",
            "expectedResult": "Diode bridges row 5 and 10."
          },
          {
            "stepNum": 2,
            "text": "Connect the 220Ω Resistor from row 10 to row 15.",
            "expectedResult": "Resistor links diode Cathode to LED node."
          },
          {
            "stepNum": 3,
            "text": "Connect LED Anode (+) to row 15 and LED Cathode (-) to the GND blue rail.",
            "expectedResult": "Output load path is closed."
          },
          {
            "stepNum": 4,
            "text": "Connect battery positive (+) to row 5, and battery negative (-) to GND.",
            "expectedResult": "LED glows normally."
          }
        ],
        "expectedOutput": "The diode lets forward current power the LED. If you connect the battery polarities backward, the diode blocks all flow, leaving the LED safely unpowered.",
        "troubleshooting": [
          {
            "symptom": "LED does not light up under correct battery wiring",
            "causes": ["Diode cathode stripe faces battery positive"],
            "fixSteps": ["Verify the silver stripe faces away from battery input row 5."]
          }
        ],
        "experiments": [
          {
            "title": "Reverse polarity test",
            "description": "Deliberately swap battery wires to confirm the diode blocks all current with zero LED damage."
          }
        ],
        "verificationChecklist": [
          "Silver stripe points towards the resistor",
          "LED turns off safely on reverse hookup",
          "Diode is in series with current flow"
        ],
        "reflectionQuestions": [
          "What is the measured voltage across the LED when power is reversed?",
          "How much voltage is lost across the diode in this circuit?"
        ],
        "relatedProjects": ["Reverse Battery Guard", "AC to DC Power Converter"],
        "xpReward": 50,
        "badge": "Polar Shield Badge"
      }
    },
    {
      "name": "Zener Diode",
      "slug": "zener-diode",
      "category": "Semiconductors",
      "description": "A special diode designed to allow current to flow backward once a specific breakdown voltage is reached.",
      "status": "completed",
      "mission": "Explore how Zener diodes regulate voltage levels.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "Understand Zener breakdown region",
        "Using Zeners as voltage regulators",
        "Clamping signal spikes"
      ],
      "typicalValue": "5.1V breakdown",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "10 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <polygon points=\"25,20 25,40 40,30\" fill=\"none\" />\n          <polyline points=\"35,16 40,20 40,40 45,44\" />\n          <line x1=\"40\" y1=\"30\" x2=\"50\" y2=\"30\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Semiconductor" },
        { "label": "Zener Voltage (Vz)", "value": "3.3V - 12V (Common)" },
        { "label": "Power Dissipation", "value": "500mW - 5W" },
        { "label": "Polarity", "value": "Polarized (Black band is Cathode)" }
      ],
      "parts": [
        {
          "id": "glass-case",
          "name": "Glass Case",
          "description": "Hermetically sealed red/orange glass package displaying Zener values.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "74px",
            "height": "32px",
            "borderRadius": "3px",
            "background": "linear-gradient(180deg, #fb923c 0%, #ea580c 100%)",
            "border": "1px solid rgba(255, 255, 255, 0.2)",
            "assembledY": -35,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "stripe",
          "name": "Cathode Stripe",
          "description": "Black marker stripe designating the Zener cathode terminal.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "8px",
            "height": "32px",
            "background": "#0f172a",
            "assembledY": -35,
            "explodedY": -60,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "junction",
          "name": "Heavily Doped Junction",
          "description": "Specially doped silicon PN junction that breaks down cleanly without burning out.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "60px",
            "height": "16px",
            "background": "linear-gradient(90deg, #1d4ed8 50%, #dc2626 50%)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "assembledY": -15,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Conductive lead pins.",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "86px",
            "height": "8px",
            "assembledY": 10,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads_axial"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What makes Zener unique?",
          "answer": "Unlike standard diodes that burn out under reverse voltage breakdown, Zener diodes are engineered to conduct backward at a precise voltage limit (Vz)."
        },
        {
          "question": "What is it used for?",
          "answer": "Commonly used to create stable voltage reference steps or clamp overvoltage spikes to protect microcontroller pins."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A voltage-limiting regulator shunt.",
        "whyNeeded": "To stabilize fluctuating power voltages into a clean fixed voltage output.",
        "howItWorks": "In forward bias, it behaves as a normal diode (0.7V drop). In reverse bias, it blocks current until input voltage reaches Vz. It then breaks down, routing excess current to ground while keeping voltage constant.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <polygon points=\"30,20 30,80 70,50\" fill=\"#fb923c\" />\n            <polyline points=\"65,15 70,20 70,80 75,85\" stroke=\"#ea580c\" stroke-width=\"4\" fill=\"none\" />\n            <line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"currentColor\" stroke-dasharray=\"3,3\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Diode symbol with bent cathode plate edges resembling a 'Z'.",
        "usage": "Connect in reverse bias (Cathode pointing to positive supply) parallel with the load."
      },
      "advantages": [
        "Simplest voltage regulator available",
        "Protects inputs from static charge surges (ESD)",
        "Compact glass packaging"
      ],
      "limitations": [
        "Inefficient: wastes excess energy as heat",
        "Regulation quality depends heavily on series load resistor",
        "Has high output impedance compared to active LDOs"
      ],
      "engineeringChecklist": [
        "Identify correct breakdown voltage print (e.g. 5V1 for 5.1V)",
        "Select series current-limiting resistor to protect Zener from overheating",
        "Connect Cathode to positive rail for reverse bias use"
      ],
      "safetyNotes": [
        "Always calculate power dissipation (P = Vz * Iz) to stay under rated limits (e.g. 0.5W).",
        "Without a series resistor, Zener diodes will immediately overheat and short out."
      ],
      "commonMistakes": [
        {
          "question": "Zener is hot and failing to clamp",
          "answer": "Omitted the series current-limiting resistor, allowing direct unregulated power source current to force high heat dissipation."
        }
      ],
      "engineeringTips": [
        "Use a 5.1V Zener diode (like 1N4733) to protect Arduino inputs from exceeding 5V spikes."
      ],
      "quiz": [
        {
          "question": "In which bias state is a Zener diode typically operated to regulate voltage?",
          "options": ["Forward Bias", "Reverse Bias", "Unbiased", "AC Bias"],
          "answer": 1,
          "explanation": "Zener diodes are connected in reverse bias to utilize their clean reverse breakdown voltage region."
        }
      ],
      "buildChallenge": {
        "objective": "Build a 5.1V Zener shunt regulator to clamp a fluctuating 9V source down to a safe 5.1V reference step.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "5.1V Zener Diode", "slug": "zener-diode" },
          { "name": "1kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the 1kΩ Resistor across breadboard row 5 and row 12.",
            "expectedResult": "Resistor drops initial 9V source supply."
          },
          {
            "stepNum": 2,
            "text": "Insert the Zener Diode Cathode (black stripe) to row 12 and its Anode (no stripe) to the blue GND rail.",
            "expectedResult": "Zener is connected in reverse bias parallel to output node."
          },
          {
            "stepNum": 3,
            "text": "Insert the LED Anode (+) to row 12 and LED Cathode (-) to GND rail.",
            "expectedResult": "LED is connected across clamped Zener output."
          },
          {
            "stepNum": 4,
            "text": "Connect battery positive (+) to row 5 and battery negative (-) to GND rail.",
            "expectedResult": "Output voltage at row 12 stabilizes at 5.1V."
          }
        ],
        "expectedOutput": "The Zener clamps output voltage at row 12 to 5.1V. The 1kΩ resistor limits the excess current, protecting both the Zener and the LED.",
        "troubleshooting": [
          {
            "symptom": "Voltage at regulator node is 0.7V",
            "causes": ["Zener diode is wired backwards in forward bias"],
            "fixSteps": ["Swap Zener pins so the black stripe faces positive row 12."]
          }
        ],
        "experiments": [
          {
            "title": "Voltage measurement",
            "description": "Measure row 12 with a multimeter to confirm it stays locked at 5.1V even if battery source fluctuates."
          }
        ],
        "verificationChecklist": [
          "Black stripe connected to positive row 12",
          "Series resistor is present",
          "Stable LED output illumination"
        ],
        "reflectionQuestions": [
          "Why did we use a 1k resistor instead of connecting the Zener directly?",
          "How does Zener power consumption change if the load is disconnected?"
        ],
        "relatedProjects": ["Reference Voltage Generator", "USB 5V Overvoltage Protector"],
        "xpReward": 80,
        "badge": "Zener Clamping Badge"
      }
    },
    {
      "name": "Schottky Diode",
      "slug": "schottky-diode",
      "category": "Semiconductors",
      "description": "A high-speed switching diode with a metal-semiconductor junction, offering extremely low forward voltage drop.",
      "status": "completed",
      "mission": "Explore low forward voltage drop and fast switching.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "Understand metal-semiconductor junctions",
        "Lower power losses in power paths",
        "Fast recovery switching speeds"
      ],
      "typicalValue": "0.3V drop",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "8 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <polygon points=\"25,20 25,40 40,30\" fill=\"none\" />\n          <polyline points=\"35,18 40,18 40,30 40,42 45,42\" />\n          <line x1=\"40\" y1=\"30\" x2=\"50\" y2=\"30\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Semiconductor" },
        { "label": "Forward Voltage Drop", "value": "0.15V - 0.45V" },
        { "label": "Switching Speed", "value": "Nanoseconds range" },
        { "label": "Leakage Current", "value": "Higher than PN silicon" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "Epoxy Case",
          "description": "Cylindrical epoxy body housing the fast metal-semiconductor boundary.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "80px",
            "height": "36px",
            "borderRadius": "4px",
            "background": "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
            "border": "1px solid rgba(255,255,255,0.08)",
            "assembledY": -35,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "stripe",
          "name": "Cathode Stripe",
          "description": "Identifies the cathode end (often gold or silver ring).",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "10px",
            "height": "36px",
            "background": "#e2e8f0",
            "assembledY": -35,
            "explodedY": -60,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "junction",
          "name": "Metal-Semiconductor Junction",
          "description": "Junction formed by metal (platinum/tungsten) and N-type silicon, creating a Schottky barrier with no depletion layer storage.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "64px",
            "height": "16px",
            "background": "linear-gradient(90deg, #fbbf24 50%, #60a5fa 50%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -15,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Axial Leads",
          "description": "Conductive hookup wire leads.",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "90px",
            "height": "8px",
            "assembledY": 10,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads_axial"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "Why use Schottky?",
          "answer": "Schottky diodes use a metal-semiconductor junction instead of a standard PN silicon junction. This results in a very low forward drop (~0.3V) and ultra-fast recovery switching speeds."
        },
        {
          "question": "Where is it used?",
          "answer": "Commonly used in high-frequency switching power supplies (SMPS), solar panel bypass strings, and RF detectors."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A low-loss high-speed barrier diode.",
        "whyNeeded": "To reduce heating losses in high-current paths and switch MHz signals.",
        "howItWorks": "Current flows from the metal anode into the semiconductor cathode. Because there is no minority carrier charge storage, the diode turns off almost instantly when voltage is reversed.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <polygon points=\"30,20 30,80 70,50\" fill=\"#4b5563\" />\n            <path d=\"M65,15 L70,15 L70,30 L70,80 L70,85 L75,85\" stroke=\"#f59e0b\" stroke-width=\"4\" fill=\"none\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Diode symbol with hooks resembling an 'S', showing Schottky style.",
        "usage": "Use in SMPS output rectification blocks."
      },
      "advantages": [
        "Saves battery power (lowest forward drop voltage)",
        "Switches in nanoseconds (supports high MHz frequencies)",
        "Low parasitic junction capacitance"
      ],
      "limitations": [
        "Higher reverse leakage current (increases with temperature)",
        "Lower maximum reverse breakdown voltage (typically max 100V)",
        "Prone to thermal runaway if leakage is unchecked"
      ],
      "engineeringChecklist": [
        "Check reverse leakage specs at high operating temps",
        "Ensure peak inverse voltage fits safety margins",
        "Keep trace path short to minimize high-frequency inductance"
      ],
      "safetyNotes": [
        "Do not use in high-voltage AC paths where reverse voltages exceed rating limits.",
        "Keep Schottky temperature under control to avoid runaway reverse leakage current."
      ],
      "commonMistakes": [
        {
          "question": "Excessive leakage draining battery",
          "answer": "Using a Schottky diode in hot environments with high reverse voltages allows battery leakage backward. Verify leakage current specifications at operating temp."
        }
      ],
      "engineeringTips": [
        "Use a Schottky diode (e.g. 1N5819) as a bypass diode in solar panel setups to minimize energy loss."
      ],
      "quiz": [
        {
          "question": "Which of the following is the main benefit of a Schottky diode over a standard silicon diode?",
          "options": [
            "Higher breakdown voltage capacity",
            "Lower forward voltage drop and faster switching speed",
            "Zero reverse leakage current",
            "Insensitivity to temperature changes"
          ],
          "answer": 1,
          "explanation": "Schottky diodes offer a very low forward drop (~0.3V) and switch in nanoseconds because they lack minority carrier storage."
        }
      ],
      "buildChallenge": {
        "objective": "Build a solar panel battery block circuit comparing Schottky and PN Diode power efficiencies.",
        "estimatedTime": "12 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "Schottky Diode", "slug": "schottky-diode" },
          { "name": "PN Junction Diode", "slug": "pn-junction-diode" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the Schottky Diode with Anode at row 5 and Cathode (stripe) at row 10.",
            "expectedResult": "Schottky Diode bridges rows 5 and 10."
          },
          {
            "stepNum": 2,
            "text": "Connect the 220Ω resistor from row 10 to row 15.",
            "expectedResult": "Resistor is connected to output."
          },
          {
            "stepNum": 3,
            "text": "Connect the LED Anode (+) to row 15 and LED Cathode (-) to GND rail.",
            "expectedResult": "Output load is closed."
          },
          {
            "stepNum": 4,
            "text": "Connect battery positive (+) to row 5 and battery negative (-) to GND rail.",
            "expectedResult": "LED lights up with high brightness."
          }
        ],
        "expectedOutput": "The LED lights up brighter because the Schottky diode drops only ~0.3V, saving more power than the standard PN silicon diode.",
        "troubleshooting": [
          {
            "symptom": "LED is dim",
            "causes": ["Wired the standard PN diode by mistake"],
            "fixSteps": ["Swap PN diode with the metal-semiconductor Schottky diode (1N5819) and compare brightness."]
          }
        ],
        "experiments": [
          {
            "title": "Diode voltage comparison",
            "description": "Measure forward voltage drop across standard diode (0.7V) vs Schottky diode (0.3V) using a multimeter."
          }
        ],
        "verificationChecklist": [
          "Low forward voltage drop confirmed",
          "Diode cathode stripe points toward load",
          "LED lights up brightly"
        ],
        "reflectionQuestions": [
          "Why does the lower forward voltage drop of Schottky diodes increase circuit efficiency?",
          "Explain why Schottky diodes are preferred in high-frequency switching regulators."
        ],
        "relatedProjects": ["Solar Battery Blocker", "High-Efficiency Buck Regulator"],
        "xpReward": 60,
        "badge": "Schottky Speed Badge"
      }
    },
    {
      "name": "Photodiode",
      "slug": "photodiode",
      "category": "Semiconductors",
      "description": "A light-sensitive semiconductor diode that converts light energy into electric current.",
      "status": "completed",
      "mission": "Explore light detection using PN junctions.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "Understand photocurrent generation",
        "Photodiode bias modes (photovoltaic vs photoconductive)",
        "Interfacing light detectors"
      ],
      "typicalValue": "940nm peak sensing",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "9 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <circle cx=\"30\" cy=\"30\" r=\"20\" stroke=\"currentColor\" stroke-width=\"1.5\" />\n          <line x1=\"10\" y1=\"30\" x2=\"22\" y2=\"30\" />\n          <polygon points=\"22,22 22,38 34,30\" fill=\"none\" />\n          <line x1=\"34\" y1=\"22\" x2=\"34\" y2=\"38\" />\n          <line x1=\"34\" y1=\"30\" x2=\"50\" y2=\"30\" />\n          <line x1=\"18\" y1=\"15\" x2=\"26\" y2=\"23\" />\n          <polygon points=\"26,23 21,23 25,19\" fill=\"currentColor\" />\n          <line x1=\"24\" y1=\"11\" x2=\"32\" y2=\"19\" />\n          <polygon points=\"32,19 27,19 31,15\" fill=\"currentColor\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Semiconductor Sensor" },
        { "label": "Peak Sensitivity Wavelength", "value": "850nm - 940nm (IR Range)" },
        { "label": "Photocurrent Output", "value": "10µA - 100µA" },
        { "label": "Response Time", "value": "Nanoseconds range" }
      ],
      "parts": [
        {
          "id": "lens",
          "name": "Plastic Lens",
          "description": "Dark black or clear epoxy dome that filters light, focusing specific wavelengths (like infrared) onto the active chip.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "44px",
            "height": "56px",
            "borderRadius": "22px 22px 4px 4px",
            "background": "rgba(30, 41, 59, 0.7)",
            "border": "1.5px solid #475569",
            "assembledY": -50,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "chip",
          "name": "Silicon PIN Chip",
          "description": "Silicon semiconductor chip with a wide intrinsic layer to maximize photon absorption.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "22px",
            "height": "16px",
            "background": "linear-gradient(135deg, #10b981, #047857)",
            "assembledY": -25,
            "explodedY": -20,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Terminal Leads",
          "description": "Connecting anode and cathode terminal legs.",
          "connectorY": 260,
          "labelSide": "left",
          "labelY": 260,
          "visual": {
            "width": "24px",
            "height": "76px",
            "assembledY": 15,
            "explodedY": 80,
            "zIndex": 2,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is a photodiode?",
          "answer": "A diode that generates minor electrical current when struck by photons."
        },
        {
          "question": "Why is it black?",
          "answer": "The black lens filters out visible ambient light so the sensor only responds to infrared light, reducing noise in remote control links."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "An optoelectronic light sensor.",
        "whyNeeded": "To receive optical signals in remote control links, laser tripwires, and light meters.",
        "howItWorks": "Operated in reverse bias. Light photons hit the wide depletion layer, breaking electron-hole pairs. This creates a tiny leakage current (photocurrent) proportional to light intensity.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <circle cx=\"50\" cy=\"50\" r=\"35\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"4\" />\n            <line x1=\"15\" y1=\"15\" x2=\"35\" y2=\"35\" stroke=\"#eab308\" stroke-width=\"3\" />\n            <line x1=\"25\" y1=\"10\" x2=\"45\" y2=\"30\" stroke=\"#eab308\" stroke-width=\"3\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Diode symbol in a circle with inward-pointing light arrows.",
        "usage": "Connect in reverse bias series with a large resistor to measure voltage shifts."
      },
      "advantages": [
        "Ultra-fast speed (ns response compared to LDR's ms)",
        "Excellent linearity over wide light ranges",
        "Low noise"
      ],
      "limitations": [
        "Generates very tiny current (requires amplification)",
        "Highly sensitive to temperature leakage",
        "Narrow angle of light sensitivity"
      ],
      "engineeringChecklist": [
        "Wire in reverse bias (Anode to negative, Cathode to positive)",
        "Use a large series resistor (100kΩ - 1MΩ) to convert microamps into measurable voltage",
        "Shield sensor from direct ambient light noise"
      ],
      "safetyNotes": [
        "Keep reverse voltages under maximum breakdown rating (typically 30V)."
      ],
      "commonMistakes": [
        {
          "question": "Photodiode wired in forward bias",
          "answer": "Wiring it forward bias acts as a normal short-circuiting diode. It ignores light completely. Connect in reverse bias to measure light leakage."
        }
      ],
      "engineeringTips": [
        "Pair with a transimpedance amplifier (op-amp) for precision high-speed light measurements."
      ],
      "quiz": [
        {
          "question": "How is a photodiode typically biased when used as a light sensor?",
          "options": ["Forward Bias", "Reverse Bias", "Unbiased", "AC Bias"],
          "answer": 1,
          "explanation": "Photodiodes are operated in reverse bias because the photo-induced leakage current varies linearly with light intensity."
        }
      ],
      "buildChallenge": {
        "objective": "Build a laser tripwire alarm circuit using a reverse-biased photodiode.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "Photodiode", "slug": "photodiode" },
          { "name": "100kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "Buzzer", "slug": "buzzer" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the Photodiode on the breadboard. Cathode (long leg) to row 5, Anode (short leg) to row 12.",
            "expectedResult": "Photodiode bridges rows 5 and 12."
          },
          {
            "stepNum": 2,
            "text": "Insert the 100kΩ Resistor from row 12 to the GND rail.",
            "expectedResult": "Resistor pulls row 12 to ground."
          },
          {
            "stepNum": 3,
            "text": "Connect the Buzzer positive (+) leg to row 12 and negative (-) to GND rail.",
            "expectedResult": "Buzzer is placed across output resistor."
          },
          {
            "stepNum": 4,
            "text": "Connect battery positive (+) to row 5 and battery negative (-) to GND rail.",
            "expectedResult": "Sensor is powered."
          }
        ],
        "expectedOutput": "Shining light on the photodiode decreases its reverse resistance, pulling row 12 high and sounding the buzzer.",
        "troubleshooting": [
          {
            "symptom": "Alarm does not respond to light",
            "causes": ["Photodiode is forward biased", "Resistor value too small"],
            "fixSteps": [
              "Reverse photodiode legs so long leg connects to positive.",
              "Use a larger series resistor (100k - 1M) to amplify small currents."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Ambient light check",
            "description": "Block ambient light and watch output drop to zero, demonstrating IR filter casing efficiency."
          }
        ],
        "verificationChecklist": [
          "Buzzer responds to IR/Flashlight light",
          "Reverse bias wiring confirmed",
          "Resistor value is at least 100kΩ"
        ],
        "reflectionQuestions": [
          "Why is a large 100k resistor required in series with the photodiode?",
          "What is dark current and how does it affect detection limits?"
        ],
        "relatedProjects": ["Laser Tripwire Security Alarm", "Infrared Remote Receiver"],
        "xpReward": 70,
        "badge": "Photon Catcher Badge"
      }
    },
    {
      "name": "Laser Diode",
      "slug": "laser-diode",
      "category": "Semiconductors",
      "description": "A semiconductor laser diode that produces coherent, focused light amplification through stimulated emission.",
      "status": "completed",
      "mission": "Explore coherent light beam generation.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "Coherent vs incoherent light source differences",
        "Stimulated emission principles",
        "Driver circuit safety requirements"
      ],
      "typicalValue": "650nm (Red)",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "12 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <circle cx=\"30\" cy=\"30\" r=\"20\" stroke=\"currentColor\" stroke-width=\"1.5\" />\n          <line x1=\"10\" y1=\"30\" x2=\"22\" y2=\"30\" />\n          <polygon points=\"22,20 22,40 34,30\" fill=\"none\" />\n          <line x1=\"34\" y1=\"20\" x2=\"34\" y2=\"40\" />\n          <line x1=\"34\" y1=\"30\" x2=\"50\" y2=\"30\" />\n          <line x1=\"38\" y1=\"24\" x2=\"48\" y2=\"14\" />\n          <polygon points=\"48,14 43,14 47,18\" fill=\"currentColor\" />\n          <line x1=\"42\" y1=\"20\" x2=\"52\" y2=\"10\" />\n          <polygon points=\"52,10 47,10 51,14\" fill=\"currentColor\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Optoelectronic Semiconductor" },
        { "label": "Laser Wavelength", "value": "650nm (Red)" },
        { "label": "Output Optical Power", "value": "5mW (Class IIIa)" },
        { "label": "Operating Current", "value": "20mA - 30mA" }
      ],
      "parts": [
        {
          "id": "can",
          "name": "Metal Can Casing",
          "description": "Brass protective package that shields the chip and acts as a heat sink.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "64px",
            "height": "64px",
            "borderRadius": "50%",
            "background": "linear-gradient(135deg, #d97706, #b45309)",
            "border": "1px solid rgba(255,255,255,0.2)",
            "assembledY": -45,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "lens",
          "name": "Focusing Lens Window",
          "description": "Small glass lens window that collimates the emitted light into a narrow, parallel beam.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "30px",
            "height": "12px",
            "borderRadius": "3px",
            "background": "rgba(147, 197, 253, 0.4)",
            "border": "1.5px solid #3b82f6",
            "assembledY": -25,
            "explodedY": -40,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "chip",
          "name": "Laser Chip",
          "description": "Double heterostructure laser diode chip containing cleaved reflective cavity walls.",
          "connectorY": 260,
          "labelSide": "left",
          "labelY": 260,
          "visual": {
            "width": "20px",
            "height": "16px",
            "background": "linear-gradient(90deg, #ef4444 30%, #f43f5e 100%)",
            "assembledY": -15,
            "explodedY": 20,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Terminal Leads",
          "description": "Pin terminals (typically three pins: laser diode anode, laser diode cathode, and monitor photodiode feedback).",
          "connectorY": 330,
          "labelSide": "right",
          "labelY": 330,
          "visual": {
            "width": "32px",
            "height": "56px",
            "assembledY": 15,
            "explodedY": 100,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is stimulated emission?",
          "answer": "Incoherent light (like LEDs) emits photons randomly. Stimulated emission triggers a chain reaction where incoming photons stimulate excited electrons to emit identical, coherent photons, producing a highly concentrated beam."
        },
        {
          "question": "Why does it have three pins?",
          "answer": "Laser output shifts with temperature. Two pins power the laser diode, while the third connects to an internal monitor photodiode to feedback output strength and stabilize current."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A stimulated-emission coherent light source.",
        "whyNeeded": "To generate highly focused beams for optical communications, distance measurements, and scanners.",
        "howItWorks": "Current pushes carrier recombination in the optical cavity. Cleaved ends bounce photons back and forth, amplifying light waves until a collimated, single-frequency coherent laser beam exits the window.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"30\" y=\"35\" width=\"40\" height=\"30\" fill=\"#d97706\" />\n            <line x1=\"70\" y1=\"50\" x2=\"100\" y2=\"50\" stroke=\"#ef4444\" stroke-width=\"4\" />\n            <circle cx=\"85\" cy=\"50\" r=\"3\" fill=\"#f87171\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Diode symbol in a circle with parallel outgoing light ray arrows.",
        "usage": "Requires an active constant-current driver regulator circuit."
      },
      "advantages": [
        "Perfect single-frequency laser beam output",
        "Collimated straight-line projection over long distances",
        "Extremely high transmission speeds"
      ],
      "limitations": [
        "Highly sensitive to static charge (ESD) and voltage spikes",
        "Wastes thermal energy; output drops if it gets hot",
        "Dangerous: can cause permanent eye damage if viewed directly"
      ],
      "engineeringChecklist": [
        "Always use static-shielding wristbands during assembly",
        "Never connect a laser diode directly to a power source without a driver",
        "Verify laser classification power levels"
      ],
      "safetyNotes": [
        "NEVER stare directly into a laser beam path.",
        "Use protective laser glasses during testing to block reflected energy."
      ],
      "commonMistakes": [
        {
          "question": "Connecting directly to battery burns out laser",
          "answer": "Laser diodes have near-zero internal resistance. Without constant current limitation, they draw huge currents, causing optical damage and burnouts."
        }
      ],
      "engineeringTips": [
        "Use a dedicated regulator IC (like LM317 in constant current mode) to construct a safe laser driver."
      ],
      "quiz": [
        {
          "question": "What is the primary physical process that distinguishes laser light from LED light?",
          "options": [
            "Spontaneous Emission",
            "Stimulated Emission",
            "Thermal Resistance Shift",
            "Phosphor Absorption"
          ],
          "answer": 1,
          "explanation": "Stimulated emission produces coherent, single-frequency light waves, which is the core physics of laser operation."
        }
      ],
      "buildChallenge": {
        "objective": "Build a current-limited laser transmitter to project a straight alignment beam.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "Laser Diode", "slug": "laser-diode" },
          { "name": "100Ω Resistor", "slug": "fixed-resistor" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the 100Ω current-limiting Resistor across breadboard row 5 and row 10.",
            "expectedResult": "Resistor provides safety current limit."
          },
          {
            "stepNum": 2,
            "text": "Identify Laser Diode anode (+) and cathode (-) pins. Insert Anode to row 10, Cathode to GND rail.",
            "expectedResult": "Laser Diode is wired in series."
          },
          {
            "stepNum": 3,
            "text": "Connect battery positive (+) to row 5, battery negative (-) to GND rail.",
            "expectedResult": "Laser diode projects red beam."
          }
        ],
        "expectedOutput": "The laser diode projects a focused red dot onto a target. The series resistor limits current to safe operating margins.",
        "troubleshooting": [
          {
            "symptom": "Laser fails to light or glows very dim",
            "causes": ["Incorrect pin identification", "Voltage too low"],
            "fixSteps": [
              "Verify the anode (+) and cathode (-) matches your breadboard rows.",
              "Do not use depleted batteries; lasers require minimum 3V threshold voltage."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Collimation check",
            "description": "Aim laser at a far wall and observe that the beam spot remains tight and does not expand like a regular LED."
          }
        ],
        "verificationChecklist": [
          "Focused light beam output visible",
          "Series safety resistor is present",
          "Laser is pointed away from faces"
        ],
        "reflectionQuestions": [
          "Why is a laser beam spot highly focused compared to a standard LED?",
          "How does heating affect laser diode output efficiency?"
        ],
        "relatedProjects": ["Laser Tripwire Security Transmitter", "Optical Aligning Tool"],
        "xpReward": 80,
        "badge": "Laser Beam Badge"
      }
    }
  ]
};
