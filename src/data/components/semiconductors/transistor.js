export const transistorFamily = {
  "id": "transistor",
  "name": "Transistors",
  "category": "Semiconductors",
  "variants": [
    {
      "name": "NPN BJT Transistor",
      "slug": "npn-transistor",
      "category": "Semiconductors",
      "description": "A current-controlled bipolar junction transistor used to amplify or switch electronic signals.",
      "status": "completed",
      "mission": "Learn how small base currents control large collector currents.",
      "prerequisites": ["current", "voltage"],
      "learningOutcomes": [
        "Collector, Base, Emitter pin configuration",
        "Transistor saturation and cutoff regions",
        "Switching circuits using BJTs"
      ],
      "typicalValue": "e.g. BC547 / PN2222",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "10 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <line x1=\"25\" y1=\"15\" x2=\"25\" y2=\"45\" stroke-width=\"4\" />\n          <line x1=\"25\" y1=\"20\" x2=\"45\" y2=\"10\" />\n          <line x1=\"25\" y1=\"40\" x2=\"45\" y2=\"50\" />\n          <polygon points=\"45,50 38,44 42,42\" fill=\"currentColor\" />\n          <line x1=\"45\" y1=\"10\" x2=\"45\" y2=\"5\" />\n          <line x1=\"45\" y1=\"50\" x2=\"45\" y2=\"55\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "BJT Semiconductor" },
        { "label": "Collector-Emitter Voltage (Vceo)", "value": "30V - 45V" },
        { "label": "Max Collector Current (Ic)", "value": "100mA - 800mA" },
        { "label": "DC Current Gain (hFE)", "value": "110 - 800" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "TO-92 Case",
          "description": "Flat-faced black plastic encapsulation protecting the silicon chip.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "64px",
            "height": "56px",
            "borderRadius": "4px 4px 18px 18px",
            "background": "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "assembledY": -45,
            "explodedY": -120,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "substrate",
          "name": "Silicon Die (N-P-N)",
          "description": "A thin layer of P-type silicon sandwiched between two N-type layers.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "40px",
            "height": "20px",
            "background": "linear-gradient(90deg, #3b82f6 33%, #ef4444 33%, #ef4444 66%, #3b82f6 66%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -25,
            "explodedY": -30,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Three terminal legs: Emitter (E), Base (B), and Collector (C).",
          "connectorY": 260,
          "labelSide": "left",
          "labelY": 260,
          "visual": {
            "width": "36px",
            "height": "70px",
            "assembledY": 15,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is an NPN BJT?",
          "answer": "A bipolar junction transistor where a tiny current applied to the middle pin (Base) switches open a path for a larger current to flow from Collector to Emitter."
        },
        {
          "question": "How do you identify the pins?",
          "answer": "With BC547, looking at the flat side from left to right: Emitter (1), Base (2), Collector (3)."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A current-amplifying solid-state switch.",
        "whyNeeded": "To switch high-power parts using tiny currents from sensor outputs or microcontroller pins.",
        "howItWorks": "Applying positive current to the Base attracts negative carriers, opening up the depletion layers. This lets a much larger electron stream pass through from Emitter to Collector.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"15\" y=\"35\" width=\"70\" height=\"30\" fill=\"#1e293b\" rx=\"3\" />\n            <circle cx=\"25\" cy=\"50\" r=\"8\" fill=\"#3b82f6\" />\n            <circle cx=\"50\" cy=\"50\" r=\"8\" fill=\"#ef4444\" />\n            <circle cx=\"75\" cy=\"50\" r=\"8\" fill=\"#3b82f6\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "The arrow points OUTWARD on Emitter (NPN = Not Pointing iN).",
        "usage": "Use as a low-side ground switch in DC circuits."
      },
      "advantages": [
        "Inexpensive and highly available",
        "Very fast switching response times",
        "High current gain (amplifies weak currents)"
      ],
      "limitations": [
        "Requires constant base input current to stay turned on",
        "Wastes power through Base-Emitter drop (~0.7V)",
        "Collector current is limited compared to MOSFETs"
      ],
      "engineeringChecklist": [
        "Select series base resistor to limit input current",
        "Verify max Collector-Emitter voltage rating",
        "Ensure collector current remains below rating limit (typically 100mA BC547)"
      ],
      "safetyNotes": [
        "Never connect Base directly to power without a resistor; it will burn out immediately.",
        "BJT transistors get hot if operated continuously in linear region under loads."
      ],
      "commonMistakes": [
        {
          "question": "Transistor is burning hot and failing",
          "answer": "Omitted the base resistor, allowing huge current to flood and melt the Base-Emitter junction. Always use a resistor (typically 1kΩ - 10kΩ)."
        }
      ],
      "engineeringTips": [
        "BC547 is excellent for low-current signals; PN2222 handles larger currents up to 800mA."
      ],
      "quiz": [
        {
          "question": "What happens when you apply a small current to the Base pin of an NPN transistor?",
          "options": [
            "It turns off completely",
            "It allows a larger current to flow from Collector to Emitter",
            "It converts DC current to AC",
            "It explodes immediately"
          ],
          "answer": 1,
          "explanation": "Applying base current opens the semiconductor channel, allowing a larger collector current to flow to the emitter."
        }
      ],
      "buildChallenge": {
        "objective": "Build a touch-sensitive LED switch circuit using an NPN transistor.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "NPN Transistor", "slug": "npn-transistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the NPN Transistor (flat face forward) into breadboard rows 10, 11, and 12.",
            "expectedResult": "Emitter is row 10, Base is row 11, Collector is row 12."
          },
          {
            "stepNum": 2,
            "text": "Connect the Emitter row 10 to the blue GND rail.",
            "expectedResult": "Emitter ground connection is made."
          },
          {
            "stepNum": 3,
            "text": "Insert the 220Ω resistor from row 12 (Collector) to row 18.",
            "expectedResult": "Collector connects to load."
          },
          {
            "stepNum": 4,
            "text": "Insert the LED Anode (+) to battery positive (+) and Cathode (-) to row 18.",
            "expectedResult": "LED series path is ready."
          },
          {
            "stepNum": 5,
            "text": "Connect the 10kΩ resistor to row 11 (Base). Leave other end open as a touch wire.",
            "expectedResult": "Base safety input is ready."
          }
        ],
        "expectedOutput": "Touching the open base resistor wire and the battery positive rail simultaneously routes your body's weak current to the Base, switching the transistor ON and illuminating the LED.",
        "troubleshooting": [
          {
            "symptom": "LED stays permanently lit",
            "causes": ["Incorrect pin layout BC547"],
            "fixSteps": ["Verify Collector and Emitter leads are not swapped. Re-read flat face direction."]
          }
        ],
        "experiments": [
          {
            "title": "Moisture detector test",
            "description": "Place the base wire and positive wire into wet soil to watch the LED turn on, demonstrating conductivity switching."
          }
        ],
        "verificationChecklist": [
          "Emitter connected to GND",
          "LED lights up on touch input",
          "10k base safety resistor is present"
        ],
        "reflectionQuestions": [
          "Explain why your body current was amplified to power the LED.",
          "What is the function of the 220-ohm resistor in this circuit?"
        ],
        "relatedProjects": ["Touch Sensor Switch", "Water Leakage Detector Alarm"],
        "xpReward": 80,
        "badge": "BJT Switch Badge"
      }
    },
    {
      "name": "PNP BJT Transistor",
      "slug": "pnp-transistor",
      "category": "Semiconductors",
      "description": "A current-controlled BJT transistor that switches ON when the base voltage is pulled low to ground.",
      "status": "completed",
      "mission": "Explore low-side base switching using PNP junctions.",
      "prerequisites": ["npn-transistor"],
      "learningOutcomes": [
        "PNP current flow paths",
        "Base current sinking switching logic",
        "Differences between NPN and PNP configurations"
      ],
      "typicalValue": "e.g. BC557 / PN2907",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "10 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <line x1=\"25\" y1=\"15\" x2=\"25\" y2=\"45\" stroke-width=\"4\" />\n          <line x1=\"25\" y1=\"20\" x2=\"45\" y2=\"10\" />\n          <line x1=\"25\" y1=\"40\" x2=\"45\" y2=\"50\" />\n          <polygon points=\"32,42 27,40 30,35\" fill=\"currentColor\" />\n          <line x1=\"45\" y1=\"10\" x2=\"45\" y2=\"5\" />\n          <line x1=\"45\" y1=\"50\" x2=\"45\" y2=\"55\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "BJT Semiconductor" },
        { "label": "Collector-Emitter Voltage (Vceo)", "value": "-30V - -45V" },
        { "label": "Max Collector Current (Ic)", "value": "-100mA - -800mA" },
        { "label": "DC Current Gain (hFE)", "value": "110 - 800" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "TO-92 Case",
          "description": "Black plastic encapsulation housing the PNP silicon junctions.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "64px",
            "height": "56px",
            "borderRadius": "4px 4px 18px 18px",
            "background": "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "assembledY": -45,
            "explodedY": -120,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "substrate",
          "name": "Silicon Die (P-N-P)",
          "description": "A thin N-type silicon layer sandwiched between two P-type layers.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "40px",
            "height": "20px",
            "background": "linear-gradient(90deg, #ef4444 33%, #3b82f6 33%, #3b82f6 66%, #ef4444 66%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -25,
            "explodedY": -30,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Three terminal legs: Emitter (E), Base (B), and Collector (C).",
          "connectorY": 260,
          "labelSide": "left",
          "labelY": 260,
          "visual": {
            "width": "36px",
            "height": "70px",
            "assembledY": 15,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is a PNP BJT?",
          "answer": "A bipolar junction transistor that switches on when the Base is connected to negative (GND). Current flows from Emitter to Collector when Base voltage is pulled low."
        },
        {
          "question": "How does PNP compare to NPN?",
          "answer": "NPN switches on with positive base voltage. PNP switches on with negative (grounded) base voltage. Emitter and collector current directions are completely reversed."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A ground-triggered solid-state switch.",
        "whyNeeded": "To switch high-side power paths where positive voltage is kept connected to Emitter.",
        "howItWorks": "Emitter is connected to positive power. Grounding the Base pulls base electrons away, opening current channels so Emitter current flows down to Collector.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"15\" y=\"35\" width=\"70\" height=\"30\" fill=\"#1e293b\" rx=\"3\" />\n            <circle cx=\"25\" cy=\"50\" r=\"8\" fill=\"#ef4444\" />\n            <circle cx=\"50\" cy=\"50\" r=\"8\" fill=\"#3b82f6\" />\n            <circle cx=\"75\" cy=\"50\" r=\"8\" fill=\"#ef4444\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "The arrow points INWARD on Emitter (PNP = Pointing iN Proudly).",
        "usage": "Use as a high-side positive supply switch."
      },
      "advantages": [
        "Perfect high-side power path controller",
        "Turns on with low/ground voltage triggers",
        "High current gains"
      ],
      "limitations": [
        "Slightly slower than NPN because holes move slower than electrons",
        "Requires Base voltage to match Emitter voltage to turn off completely",
        "Requires current limitation to prevent damage"
      ],
      "engineeringChecklist": [
        "Connect Emitter directly to battery positive (+)",
        "Add a base resistor to limit reverse control current",
        "Verify base voltage levels match supply levels for complete cutoff"
      ],
      "safetyNotes": [
        "Do not leave PNP emitter floating if Base is grounded; huge currents will flow."
      ],
      "commonMistakes": [
        {
          "question": "LED remains on even when base is disconnected",
          "answer": "PNP Base must be pulled all the way up to Emitter positive voltage to turn off. Leaving it floating can allow noise triggers to turn it on."
        }
      ],
      "engineeringTips": [
        "Pair an NPN and PNP transistor together to build a push-pull driver circuit."
      ],
      "quiz": [
        {
          "question": "To turn a PNP transistor completely ON, what voltage state should be applied to the Base relative to the Emitter?",
          "options": ["Positive voltage", "Negative/Ground voltage", "Open circuit float", "AC signal"],
          "answer": 1,
          "explanation": "PNP transistors turn ON when the base potential is pulled lower (sunk to ground) than the Emitter potential."
        }
      ],
      "buildChallenge": {
        "objective": "Build a dark sensor detector circuit using a PNP transistor and an LDR.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "PNP Transistor", "slug": "pnp-transistor" },
          { "name": "LDR Sensor", "slug": "ldr" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the PNP Transistor flat side forward into rows 10, 11, and 12.",
            "expectedResult": "Emitter is row 10, Base is row 11, Collector is row 12."
          },
          {
            "stepNum": 2,
            "text": "Connect the Emitter row 10 to battery positive (+).",
            "expectedResult": "High-side power connects to Emitter."
          },
          {
            "stepNum": 3,
            "text": "Insert the 220Ω Resistor from row 12 (Collector) to row 18.",
            "expectedResult": "Collector path is prepared."
          },
          {
            "stepNum": 4,
            "text": "Connect the LED Anode (+) to row 18, and LED Cathode (-) to GND rail.",
            "expectedResult": "LED load output is grounded."
          },
          {
            "stepNum": 5,
            "text": "Insert the LDR from row 11 (Base) to positive (+). Insert the 10kΩ Resistor from row 11 (Base) to GND rail.",
            "expectedResult": "Base voltage divider is powered."
          }
        ],
        "expectedOutput": "When light shines on the LDR, its resistance drops, pulling the Base voltage close to positive (+) and turning the PNP transistor OFF. Covering the LDR raises its resistance, allowing the 10k resistor to pull Base voltage low (GND), switching the PNP ON and lighting the LED.",
        "troubleshooting": [
          {
            "symptom": "LED turns on in bright light",
            "causes": ["Swapped the LDR and 10k resistor locations"],
            "fixSteps": ["Verify LDR connects from Base to positive (+), and 10k resistor connects from Base to GND."]
          }
        ],
        "experiments": [
          {
            "title": "Night light cover",
            "description": "Cover LDR with your palm to verify LED activates instantly as darkness falls."
          }
        ],
        "verificationChecklist": [
          "Emitter connected to positive (+) rail",
          "LED lights up in dark conditions",
          "Collector is connected to LED anode"
        ],
        "reflectionQuestions": [
          "Explain why the PNP turns off when the LDR detects high light levels.",
          "What is the base voltage value when the LDR goes dark?"
        ],
        "relatedProjects": ["Automatic Night Light", "Intruder Laser Sensor Detector"],
        "xpReward": 85,
        "badge": "Dark Guardian Badge"
      }
    },
    {
      "name": "N-Channel MOSFET",
      "slug": "n-channel-mosfet",
      "category": "Semiconductors",
      "description": "A voltage-controlled high-power field-effect transistor used to switch large currents with minimal input energy.",
      "status": "completed",
      "mission": "Learn how electrostatic fields control high-power loads.",
      "prerequisites": ["npn-transistor"],
      "learningOutcomes": [
        "Gate, Drain, Source pin configuration",
        "Voltage gate trigger thresholds (Vgs)",
        "Switching high-current DC motors safely"
      ],
      "typicalValue": "e.g. IRF540N / IRLZ44N",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "12 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <line x1=\"25\" y1=\"15\" x2=\"25\" y2=\"45\" stroke-width=\"4\" />\n          <line x1=\"30\" y1=\"15\" x2=\"30\" y2=\"45\" />\n          <line x1=\"30\" y1=\"20\" x2=\"45\" y2=\"20\" />\n          <line x1=\"30\" y1=\"40\" x2=\"45\" y2=\"40\" />\n          <line x1=\"30\" y1=\"30\" x2=\"45\" y2=\"30\" />\n          <polygon points=\"30,30 38,26 38,34\" fill=\"currentColor\" />\n          <line x1=\"45\" y1=\"20\" x2=\"45\" y2=\"5\" />\n          <line x1=\"45\" y1=\"40\" x2=\"45\" y2=\"55\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Power MOSFET" },
        { "label": "Drain-Source Voltage (Vds)", "value": "30V - 100V" },
        { "label": "Max Continuous Drain Current (Id)", "value": "30A - 110A" },
        { "label": "On-Resistance (RdsOn)", "value": "0.005Ω - 0.07Ω" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "TO-220 Body",
          "description": "Plastic body containing the high-power silicon die, attached to a metal heat-sink tab.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "80px",
            "height": "56px",
            "borderRadius": "4px",
            "background": "linear-gradient(180deg, #374151 0%, #111827 100%)",
            "border": "1px solid rgba(255,255,255,0.08)",
            "assembledY": -45,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "tab",
          "name": "Metal Heat Sink Tab",
          "description": "Metal mounting tab at the top back that dissipates thermal heat and connects internally to the Drain.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "80px",
            "height": "24px",
            "borderRadius": "4px 4px 0 0",
            "background": "linear-gradient(90deg, #94a3b8, #cbd5e1, #94a3b8)",
            "assembledY": -65,
            "explodedY": -90,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "substrate",
          "name": "Oxide Insulated Die",
          "description": "Silicon substrate carrying a metal gate separated by a micro-thin silicon dioxide insulating layer.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "50px",
            "height": "16px",
            "background": "linear-gradient(90deg, #4f46e5 50%, #ec4899 50%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -20,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Power Leads",
          "description": "Three heavy leads: Gate (G), Drain (D), and Source (S).",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "44px",
            "height": "76px",
            "assembledY": 15,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is a MOSFET?",
          "answer": "A field-effect transistor where a voltage applied to the Gate creates an electrostatic field that turns the device fully on, behaving like a near-zero-ohm switch."
        },
        {
          "question": "Why is it better than BJT?",
          "answer": "MOSFETs are voltage-controlled. Since the Gate is insulated, they draw near-zero continuous gate current, allowing them to switch huge currents (tens of Amps) without burning out."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A voltage-controlled high-power switch.",
        "whyNeeded": "To drive high-current loads like DC motors, heaters, solenoid valves, and power switching rails.",
        "howItWorks": "Applying positive voltage to the Gate attracts electrons under the insulated oxide layer. This builds an N-type conductive channel connecting the Drain to the Source, allowing large currents to flow.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"20\" y=\"35\" width=\"60\" height=\"30\" fill=\"#1e2937\" />\n            <line x1=\"20\" y1=\"42\" x2=\"80\" y2=\"42\" stroke=\"#a855f7\" stroke-width=\"4\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Gate line separated from channel lines showing oxide insulation. Arrow points inward for N-Channel.",
        "usage": "Use as a low-side power switch."
      },
      "advantages": [
        "Draws zero gate control current in steady state",
        "Ultra-low On-Resistance (RdsOn) results in low heat generation",
        "Switches huge loads (100A+)"
      ],
      "limitations": [
        "Gate has high capacitance; requires brief current spikes to charge/discharge during high frequency switching",
        "Insulated gate is extremely sensitive to ESD static discharge blowouts",
        "Requires 4V - 10V gate voltage to turn fully ON"
      ],
      "engineeringChecklist": [
        "Add a pulldown resistor (10kΩ) from Gate to Source to prevent floating triggers",
        "Verify your microcontroller output matches gate threshold needs (use logic-level MOSFETs like IRLZ44N for 5V/3.3V control)",
        "Mount on a heat sink if continuous current exceeds 5 Amps"
      ],
      "safetyNotes": [
        "Insulated Gate is fragile; handle MOSFET pins by grounding yourself first to avoid static blowouts.",
        "Always use a flyback diode when switching inductive motor loads."
      ],
      "commonMistakes": [
        {
          "question": "MOSFET turns on randomly by itself",
          "answer": "Omitted the pulldown resistor from Gate to Source. An unconnected Gate accumulates stray static charges, turning the switch on. Add a 10kΩ pulldown."
        }
      ],
      "engineeringTips": [
        "Standard MOSFETs (like IRF540N) require 10V to open fully. Use logic-level MOSFETs (like IRLZ44N) for direct 5V Arduino switching."
      ],
      "quiz": [
        {
          "question": "Why does an N-Channel MOSFET require a pulldown resistor from Gate to Source in switching circuits?",
          "options": [
            "To increase current gain",
            "To prevent the gate from floating and triggering randomly due to stray static",
            "To filter high frequency noise ripples",
            "To limit the current into the Gate"
          ],
          "answer": 1,
          "explanation": "Because the Gate is completely insulated, it behaves as a capacitor. Without a pulldown resistor, static charge remains trapped on the gate, causing floating switch states."
        }
      ],
      "buildChallenge": {
        "objective": "Build a logic-level N-Channel MOSFET switch circuit to drive a high-current DC motor load.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "N-Channel MOSFET", "slug": "n-channel-mosfet" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "PN Junction Diode", "slug": "pn-junction-diode" },
          { "name": "Motor", "slug": "motor" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the MOSFET into breadboard rows 10, 11, and 12.",
            "expectedResult": "Gate is row 10, Drain is row 11, Source is row 12."
          },
          {
            "stepNum": 2,
            "text": "Connect Source row 12 to the GND rail. Connect the 10kΩ pulldown resistor from Gate row 10 to GND rail.",
            "expectedResult": "Source and pulldown are grounded."
          },
          {
            "stepNum": 3,
            "text": "Connect the Motor negative (-) terminal to Drain row 11. Connect Motor positive (+) to positive (+) supply.",
            "expectedResult": "Motor is wired in series."
          },
          {
            "stepNum": 4,
            "text": "Insert the PN Junction Diode in reverse bias parallel across the motor leads (Cathode to motor positive, Anode to motor negative).",
            "expectedResult": "Flyback diode is installed to block spikes."
          },
          {
            "stepNum": 5,
            "text": "Connect the 220Ω Resistor from Gate row 10 to row 5. Use row 5 wire as your signal input.",
            "expectedResult": "Gate trigger path is prepared."
          }
        ],
        "expectedOutput": "Connecting row 5 wire to positive (+) voltage charges the Gate, switching the MOSFET ON and starting the motor. Disconnecting it discharges the Gate to ground through the 10k resistor, turning the motor OFF instantly.",
        "troubleshooting": [
          {
            "symptom": "Motor stays spinning and ignores input signal",
            "causes": ["Omitted the 10k pulldown resistor"],
            "fixSteps": ["Verify a 10k resistor is connected between Gate row 10 and Source row 12."]
          }
        ],
        "experiments": [
          {
            "title": "Flyback test",
            "description": "Spin the motor and disconnect power, confirming the flyback diode absorbs inductive kickback without sparks."
          }
        ],
        "verificationChecklist": [
          "10k pulldown resistor is present",
          "Flyback diode is connected across motor leads",
          "Source lead goes directly to GND"
        ],
        "reflectionQuestions": [
          "Why did we place a diode across the motor terminals?",
          "What happens to the motor if the gate control wire is left floating?"
        ],
        "relatedProjects": ["PWM DC Motor Speed Controller", "Solenoid Lock Switch Driver"],
        "xpReward": 90,
        "badge": "MOSFET Master Badge"
      }
    },
    {
      "name": "P-Channel MOSFET",
      "slug": "p-channel-mosfet",
      "category": "Semiconductors",
      "description": "A voltage-controlled field-effect transistor that switches ON when its Gate voltage is pulled lower than its Source voltage.",
      "status": "completed",
      "mission": "Explore high-side voltage-controlled power path control.",
      "prerequisites": ["n-channel-mosfet"],
      "learningOutcomes": [
        "P-Channel source-drain switching pathways",
        "Pullup gate resistor configuration",
        "High-side power control applications"
      ],
      "typicalValue": "e.g. IRF9540N / IRF9640",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "12 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <line x1=\"25\" y1=\"15\" x2=\"25\" y2=\"45\" stroke-width=\"4\" />\n          <line x1=\"30\" y1=\"15\" x2=\"30\" y2=\"45\" />\n          <line x1=\"30\" y1=\"20\" x2=\"45\" y2=\"20\" />\n          <line x1=\"30\" y1=\"40\" x2=\"45\" y2=\"40\" />\n          <line x1=\"30\" y1=\"30\" x2=\"45\" y2=\"30\" />\n          <polygon points=\"38,30 30,26 30,34\" fill=\"currentColor\" />\n          <line x1=\"45\" y1=\"20\" x2=\"45\" y2=\"5\" />\n          <line x1=\"45\" y1=\"40\" x2=\"45\" y2=\"55\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Power MOSFET" },
        { "label": "Drain-Source Voltage (Vds)", "value": "-30V - -100V" },
        { "label": "Max Continuous Drain Current (Id)", "value": "-19A - -23A" },
        { "label": "On-Resistance (RdsOn)", "value": "0.1Ω - 0.2Ω" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "TO-220 Body",
          "description": "High-power plastic packaging matching the P-Channel silicon die structure.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "80px",
            "height": "56px",
            "borderRadius": "4px",
            "background": "linear-gradient(180deg, #374151 0%, #111827 100%)",
            "border": "1px solid rgba(255,255,255,0.08)",
            "assembledY": -45,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "tab",
          "name": "Metal Heat Sink Tab",
          "description": "Tab backing connected internally to the P-Channel Drain.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "80px",
            "height": "24px",
            "borderRadius": "4px 4px 0 0",
            "background": "linear-gradient(90deg, #94a3b8, #cbd5e1, #94a3b8)",
            "assembledY": -65,
            "explodedY": -90,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "substrate",
          "name": "P-type Silicon Die",
          "description": "Insulated gate oxide boundary matching P-type charge carriers.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "50px",
            "height": "16px",
            "background": "linear-gradient(90deg, #ec4899 50%, #4f46e5 50%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -20,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Power Leads",
          "description": "Three lead pins: Gate (G), Drain (D), and Source (S).",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "44px",
            "height": "76px",
            "assembledY": 15,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is a P-Channel MOSFET?",
          "answer": "A power switch that turns ON when the Gate voltage is pulled lower (GND) than its Source pin positive voltage."
        },
        {
          "question": "Where is it used?",
          "answer": "Commonly used as a high-side load switch directly connecting positive power lines to the output load."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A high-side voltage-controlled power switch.",
        "whyNeeded": "To cut off power from the positive rail directly, rather than breaking the ground path.",
        "howItWorks": "Source is connected to positive power. Grounding the Gate charges the gate-source capacitance, creating a P-type channel that lets positive current flow from Source down to Drain.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"20\" y=\"35\" width=\"60\" height=\"30\" fill=\"#1e2937\" />\n            <line x1=\"20\" y1=\"42\" x2=\"80\" y2=\"42\" stroke=\"#ec4899\" stroke-width=\"4\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Gate oxide insulated boundary. Arrow points outward for P-Channel.",
        "usage": "Use as a high-side positive supply switch."
      },
      "advantages": [
        "Switches positive power rails directly",
        "Zero gate current in steady state",
        "Simplifies ground reference logic for the load"
      ],
      "limitations": [
        "Higher On-Resistance (RdsOn) than N-Channel (runs hotter under equal loads)",
        "Gate voltage must reach the positive rail potential to turn off completely",
        "Fragile insulated gate sensitive to static"
      ],
      "engineeringChecklist": [
        "Connect Source to positive supply (+)",
        "Add a 10kΩ pullup resistor from Gate to Source (positive rail) to keep MOSFET turned OFF by default",
        "Verify gate threshold voltages"
      ],
      "safetyNotes": [
        "Always keep gate voltage offsets below maximum limit (typically +/- 20V) to prevent gate oxide blowout."
      ],
      "commonMistakes": [
        {
          "question": "MOSFET is stuck ON even when input is low",
          "answer": "P-Channel MOSFET requires the Gate to be pulled all the way up to the positive supply voltage to turn off. If you are switching 9V, a 5V microcontroller pin cannot turn it off without an interface driver."
        }
      ],
      "engineeringTips": [
        "Use a small NPN transistor to pull down the P-Channel gate if you are controlling high-voltage rails from a low-voltage micro chip."
      ],
      "quiz": [
        {
          "question": "How do you turn a P-Channel MOSFET completely OFF?",
          "options": [
            "Pull Gate voltage to Ground (0V)",
            "Pull Gate voltage all the way up to the Source positive voltage",
            "Leave the Gate floating",
            "Reverse Source and Drain leads"
          ],
          "answer": 1,
          "explanation": "P-Channel MOSFETs turn OFF when the gate-to-source potential difference is zero. This requires pulling Gate up to the Source potential."
        }
      ],
      "buildChallenge": {
        "objective": "Build a high-side load switch using a P-Channel MOSFET to drive an LED.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "P-Channel MOSFET", "slug": "p-channel-mosfet" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the P-Channel MOSFET into breadboard rows 10, 11, and 12.",
            "expectedResult": "Gate is row 10, Drain is row 11, Source is row 12."
          },
          {
            "stepNum": 2,
            "text": "Connect Source row 12 to battery positive (+) rail. Connect the 10kΩ pullup resistor from Gate row 10 to positive (+) rail.",
            "expectedResult": "Source and Gate are pulled to positive rail."
          },
          {
            "stepNum": 3,
            "text": "Connect the 220Ω resistor from Drain row 11 to row 18.",
            "expectedResult": "Drain path is prepared."
          },
          {
            "stepNum": 4,
            "text": "Connect LED Anode (+) to row 18, and LED Cathode (-) to GND rail.",
            "expectedResult": "LED load output is grounded."
          },
          {
            "stepNum": 5,
            "text": "Use a trigger wire connected to Gate row 10. Touch the other end of the wire to the blue GND rail.",
            "expectedResult": "LED lights up when gate is grounded."
          }
        ],
        "expectedOutput": "Grounding the gate wire drops Gate voltage below the Source, switching the P-Channel MOSFET ON and lighting the LED. Removing the ground wire forces the gate back to positive through the 10k pullup, turning the LED off.",
        "troubleshooting": [
          {
            "symptom": "LED stays permanently ON",
            "causes": ["Gate wire is shorted to ground", "Omitted the 10k pullup resistor"],
            "fixSteps": ["Verify the 10k pullup resistor connects Gate row 10 directly to positive supply row 12."]
          }
        ],
        "experiments": [
          {
            "title": "Gate trigger voltage check",
            "description": "Ground the gate and measure gate-to-source voltage to confirm switching threshold."
          }
        ],
        "verificationChecklist": [
          "Source connected to positive rail",
          "10k pullup resistor is present",
          "LED lights up only when Gate is grounded"
        ],
        "reflectionQuestions": [
          "Why is a pullup resistor used instead of a pulldown in this circuit?",
          "Explain the main structural difference between N-Channel and P-Channel MOSFETs."
        ],
        "relatedProjects": ["High-Side Power Switch Controller", "Battery Charging Cutoff circuit"],
        "xpReward": 85,
        "badge": "High Side Shield Badge"
      }
    }
  ]
};
