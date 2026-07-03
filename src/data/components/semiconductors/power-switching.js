export const powerSwitchingFamily = {
  "id": "power-switching",
  "name": "Power Switching Devices",
  "category": "Semiconductors",
  "variants": [
    {
      "name": "Bridge Rectifier",
      "slug": "bridge-rectifier",
      "category": "Semiconductors",
      "description": "An integrated arrangement of four diodes in a bridge configuration, used to convert Alternating Current (AC) into Direct Current (DC).",
      "status": "completed",
      "mission": "Learn how four-diode bridges perform full-wave AC rectification.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "Full-wave rectification vs half-wave rectification",
        "Bridge input/output pin configurations",
        "Sizing power supply filter capacitors"
      ],
      "typicalValue": "e.g. KBL406 / W04",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "10 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <polygon points=\"30,10 50,30 30,50 10,30\" fill=\"none\" />\n          <line x1=\"10\" y1=\"30\" x2=\"50\" y2=\"30\" stroke-dasharray=\"2,2\" />\n          <line x1=\"30\" y1=\"10\" x2=\"30\" y2=\"50\" stroke-dasharray=\"2,2\" />\n          <text x=\"8\" y=\"25\" font-size=\"8\" stroke=\"none\" fill=\"currentColor\">~</text>\n          <text x=\"48\" y=\"25\" font-size=\"8\" stroke=\"none\" fill=\"currentColor\">~</text>\n          <text x=\"26\" y=\"8\" font-size=\"8\" stroke=\"none\" fill=\"currentColor\">+</text>\n          <text x=\"26\" y=\"58\" font-size=\"8\" stroke=\"none\" fill=\"currentColor\">-</text>\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Power Semiconductor" },
        { "label": "Max AC Input Voltage", "value": "400V - 1000V" },
        { "label": "Max Output DC Current", "value": "1A - 10A" },
        { "label": "Forward Voltage Drop (Total)", "value": "1.4V (Two diodes in series)" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "Plastic Housing",
          "description": "Square or inline flat black plastic body sealing the 4-diode network.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "80px",
            "height": "48px",
            "borderRadius": "4px",
            "background": "linear-gradient(180deg, #1e293b 0%, #020617 100%)",
            "border": "1px solid rgba(255,255,255,0.08)",
            "assembledY": -35,
            "explodedY": -120,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "chips",
          "name": "Diode Array Die",
          "description": "Four separate silicon PN junctions bonded internally in a loop bridge config.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "64px",
            "height": "24px",
            "background": "linear-gradient(90deg, #ef4444 25%, #3b82f6 25%, #3b82f6 50%, #10b981 50%, #10b981 75%, #f59e0b 75%)",
            "border": "1.5px solid rgba(255,255,255,0.15)",
            "assembledY": -20,
            "explodedY": -35,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Pins Layout",
          "description": "Four pins: two AC inputs (~), one DC positive output (+), and one DC negative return (-).",
          "connectorY": 260,
          "labelSide": "left",
          "labelY": 260,
          "visual": {
            "width": "48px",
            "height": "64px",
            "assembledY": 15,
            "explodedY": 80,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is a bridge rectifier?",
          "answer": "An integrated chip package holding four diodes wired in a loop. It converts Alternating Current (AC) into Direct Current (DC) by routing both positive and negative AC halves to the same output."
        },
        {
          "question": "Why does it have 4 pins?",
          "answer": "Two pins are labeled with AC waves (~) for AC power inputs. The other two pins are labeled (+) and (-) for the rectified DC output."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A full-wave AC-to-DC converter.",
        "whyNeeded": "To power DC circuits using household AC mains or step-down AC transformer outputs.",
        "howItWorks": "During the positive AC cycle, current enters through AC1 and flows out (+). During the negative AC cycle, current enters through AC2 and is still routed out (+). The return paths are automatically directed to (-).",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <polygon points=\"50,15 85,50 50,85 15,50\" fill=\"#1e293b\" stroke=\"currentColor\" stroke-width=\"2\" />\n            <line x1=\"25\" y1=\"50\" x2=\"75\" y2=\"50\" stroke=\"#3b82f6\" stroke-width=\"4\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "A diamond bridge showing four internal diode arrows routing to DC ports.",
        "usage": "Connect AC input pins to the transformer secondary; hook filter capacitor across positive/negative outputs."
      },
      "advantages": [
        "Converts both halves of AC wave (full-wave efficiency)",
        "Compact single-chip replacement for four separate diodes",
        "Higher DC output voltage than half-wave rectifiers"
      ],
      "limitations": [
        "Incurs double forward voltage drops (~1.4V loss total)",
        "Generates heat under large continuous DC currents",
        "Requires large output capacitors to filter out remaining DC ripples"
      ],
      "engineeringChecklist": [
        "Double-check that AC inputs and DC outputs are not swapped",
        "Ensure power ratings match continuous load current requirements",
        "Verify step-down transformer AC output voltage does not exceed rectifier limits"
      ],
      "safetyNotes": [
        "Mains AC voltage is lethal. Perform all breadboard experiments using low-voltage safety transformers (e.g. 9V AC).",
        "Electrolytic filter capacitors can explode if wired to DC ports backward."
      ],
      "commonMistakes": [
        {
          "question": "Massive AC hum or short circuits",
          "answer": "AC inputs and DC outputs are cross-wired. This shorts out the transformer. Re-read pin stamps on the bridge package."
        }
      ],
      "engineeringTips": [
        "Always add a large capacitor (e.g. 1000µF) across (+) and (-) outputs to smooth the rectified DC ripple waves."
      ],
      "quiz": [
        {
          "question": "What is the primary function of a bridge rectifier?",
          "options": [
            "To step up DC voltage levels",
            "To convert Alternating Current (AC) to Direct Current (DC)",
            "To isolate signal circuits optoelectronically",
            "To amplify weak audio frequencies"
          ],
          "answer": 1,
          "explanation": "Bridge rectifiers utilize a four-diode loop network to perform full-wave conversion of AC inputs into stable DC outputs."
        }
      ],
      "buildChallenge": {
        "objective": "Build a full-wave AC-to-DC rectifier circuit and filter the output voltage ripple.",
        "estimatedTime": "20 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "Bridge Rectifier", "slug": "bridge-rectifier" },
          { "name": "1000µF Capacitor", "slug": "electrolytic-capacitor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "Breadboard", "slug": "breadboard" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires", "9V AC Power Adapter (Safety low-voltage AC source)"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the Bridge Rectifier into breadboard rows 10, 11, 12, and 13.",
            "expectedResult": "Pins correspond to AC1 (~), AC2 (~), positive (+), and negative (-)."
          },
          {
            "stepNum": 2,
            "text": "Connect the 9V AC safety input wires to AC1 (row 10) and AC2 (row 11) rows.",
            "expectedResult": "AC source is wired."
          },
          {
            "stepNum": 3,
            "text": "Connect the 1000µF filter capacitor positive (+) leg to DC (+) row 12 and negative (-) leg to DC (-) row 13.",
            "expectedResult": "Filter capacitor is parallel across outputs."
          },
          {
            "stepNum": 4,
            "text": "Connect the 220Ω Resistor from DC (+) row 12 to row 20. Connect LED Anode (+) to row 20 and Cathode (-) to DC (-) row 13.",
            "expectedResult": "LED indicator load is completed."
          }
        ],
        "expectedOutput": "The bridge rectifier converts the AC input into pulsed DC, and the 1000µF capacitor smooths it into a stable flat DC, keeping the LED glowing constantly.",
        "troubleshooting": [
          {
            "symptom": "LED flickers rapidly or fails to light",
            "causes": ["Filter capacitor is too small or wired backwards", "Diode pins are misaligned"],
            "fixSteps": [
              "Verify the capacitor negative stripe connects to the (-) row 13.",
              "Ensure AC adapter output matches low-voltage AC settings."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Ripple filtering check",
            "description": "Temporarily disconnect the 1000µF capacitor and witness the LED flickering rapidly at AC frequency, showing filter necessity."
          }
        ],
        "verificationChecklist": [
          "Capacitor polarity is correct",
          "AC source connected to ~ pins",
          "Stable DC LED output achieved"
        ],
        "reflectionQuestions": [
          "Why did the LED flicker when the capacitor was removed?",
          "Explain why two diodes are always conducting at any given moment in the bridge."
        ],
        "relatedProjects": ["Linear Power Supply Module", "AC Voltage Monitor"],
        "xpReward": 100,
        "badge": "Rectifier Badge"
      }
    },
    {
      "name": "TRIAC",
      "slug": "triac",
      "category": "Semiconductors",
      "description": "A bidirectional thyristor switch that controls AC current flow through both halves of the AC waveform.",
      "status": "completed",
      "mission": "Explore solid-state AC switching controls.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "Bidirectional AC switching physics",
        "Gate trigger currents and MT1/MT2 terminals",
        "Basic phase control dimming concepts"
      ],
      "typicalValue": "e.g. BT136 / BT137",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "12 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"22\" y2=\"30\" />\n          <polygon points=\"22,15 22,45 36,30\" fill=\"none\" />\n          <polygon points=\"36,15 36,45 22,30\" fill=\"none\" />\n          <line x1=\"36\" y1=\"15\" x2=\"36\" y2=\"45\" />\n          <line x1=\"22\" y1=\"15\" x2=\"22\" y2=\"45\" />\n          <line x1=\"36\" y1=\"30\" x2=\"50\" y2=\"30\" />\n          <polyline points=\"36,38 42,42 42,50\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Thyristor Semiconductor" },
        { "label": "Max AC Voltage (Vdrm)", "value": "600V - 800V" },
        { "label": "Max AC Load Current (It)", "value": "4A - 16A" },
        { "label": "Gate Trigger Voltage (Vgt)", "value": "1.5V" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "TO-220 Case",
          "description": "Plastic package with metal mounting tab designed for power dissipation.",
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
          "name": "Heat Sink Tab",
          "description": "Metal back tab that dissipates thermal heat during high AC loads.",
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
          "id": "junction",
          "name": "PNPN Junctions",
          "description": "Bidirectional silicon layers designed to latch in both current directions.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "54px",
            "height": "16px",
            "background": "linear-gradient(90deg, #10b981 50%, #f59e0b 50%)",
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
          "description": "Three terminals: Main Terminal 1 (MT1), Main Terminal 2 (MT2), and Gate (G).",
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
          "question": "What is a TRIAC?",
          "answer": "A solid-state AC switch. Unlike transistors which only control DC, a TRIAC can switch Alternating Current (AC) on and off in both directions."
        },
        {
          "question": "How is it triggered?",
          "answer": "Applying a brief current pulse to the Gate pin locks the TRIAC into conduction. It stays ON until the AC voltage swings back to zero."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A bidirectional AC thyristor switch.",
        "whyNeeded": "To control high-power AC loads like light dimmers, fan speed controllers, and heaters.",
        "howItWorks": "It behaves as two opposing SCRs in parallel sharing a gate. Triggering the Gate switches MT1 to MT2. Because AC crosses 0V twice per cycle, the TRIAC automatically resets itself at every zero-crossing point, requiring another gate pulse to continue conducting.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <polygon points=\"25,30 25,70 55,50\" fill=\"#10b981\" />\n            <polygon points=\"55,30 55,70 25,50\" fill=\"#f59e0b\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Two interlocking triangles with a single Gate wire, representing bidirectional AC control.",
        "usage": "Wire MT2 in series with the AC load; trigger Gate via DIAC or opto-triac."
      },
      "advantages": [
        "Switches AC on both positive and negative phases",
        "Solid state: no moving contact sparks or wear",
        "Handles very large AC power levels"
      ],
      "limitations": [
        "Generates significant EMI noise, requiring filter coils",
        "Cannot switch pure DC loads (will latch ON permanently)",
        "Requires heat sinks for loads exceeding 2 Amps"
      ],
      "engineeringChecklist": [
        "Always add a snubber RC network across MT1 and MT2 to prevent false inductive triggers",
        "Verify AC voltage does not exceed maximum Vdrm limits",
        "Connect Gate to MT1 trigger return paths correctly"
      ],
      "safetyNotes": [
        "Do not interface a TRIAC directly to microcontroller pins without opto-isolation (use MOC3021 opto-triac).",
        "Perform testing using safe, isolated low-voltage AC sources."
      ],
      "commonMistakes": [
        {
          "question": "TRIAC is locked ON permanently in DC",
          "answer": "TRIACs require AC zero-crossings to turn off. In DC, they latch ON permanently once triggered and cannot turn off without cutting power."
        }
      ],
      "engineeringTips": [
        "Always use an opto-isolated TRIAC driver (like MOC3021) to protect digital microcontrollers from lethal AC voltages."
      ],
      "quiz": [
        {
          "question": "How does a TRIAC turn OFF once it has been triggered?",
          "options": [
            "By applying a negative gate pulse",
            "When the load current drops below the holding current (e.g. at AC zero-crossing)",
            "By increasing the gate current threshold",
            "Automatically after a fixed 10ms interval"
          ],
          "answer": 1,
          "explanation": "TRIACs latch ON and only turn OFF when the AC load current falls close to zero, which happens naturally at the zero-crossing point."
        }
      ],
      "buildChallenge": {
        "objective": "Build a low-voltage AC switch circuit using a BT136 TRIAC to control a safe 12V AC light bulb.",
        "estimatedTime": "20 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "TRIAC", "slug": "triac" },
          { "name": "1kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "Breadboard", "slug": "breadboard" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires", "12V AC safety transformer and AC Light Bulb"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the TRIAC into breadboard rows 10, 11, and 12.",
            "expectedResult": "MT1 is row 10, MT2 is row 11, Gate is row 12."
          },
          {
            "stepNum": 2,
            "text": "Connect MT1 row 10 to the common AC source return wire.",
            "expectedResult": "Common return path is established."
          },
          {
            "stepNum": 3,
            "text": "Connect MT2 row 11 to one terminal of the 12V AC Light Bulb. Connect other bulb terminal to 12V AC positive supply.",
            "expectedResult": "AC load loop is wired in series."
          },
          {
            "stepNum": 4,
            "text": "Connect the 1kΩ Resistor to Gate row 12. Briefly touch the other end of the resistor to MT2 row 11.",
            "expectedResult": "Gate is pulsed."
          }
        ],
        "expectedOutput": "Pulsing the Gate wire turns the TRIAC ON, lighting the AC bulb. It stays lit until you disconnect the gate trigger path.",
        "troubleshooting": [
          {
            "symptom": "Light bulb fails to light up",
            "causes": ["Gate resistor value too large", "Incorrect pinouts"],
            "fixSteps": ["Check MT1, MT2, and Gate configurations. Ensure gate trigger current is high enough."]
          }
        ],
        "experiments": [
          {
            "title": "Gate wire test",
            "description": "Trigger the gate from MT2 and observe the solid AC lamp illumination."
          }
        ],
        "verificationChecklist": [
          "12V AC safety adapter used",
          "MT1 connected to return line",
          "Light bulb responds to gate trigger"
        ],
        "reflectionQuestions": [
          "Why will this circuit not turn off when using a DC power source instead of AC?",
          "What is the purpose of the 1k resistor on the gate?"
        ],
        "relatedProjects": ["Low-Voltage AC Solid State Switch", "Light Dimmer Console"],
        "xpReward": 90,
        "badge": "AC Switcher Badge"
      }
    },
    {
      "name": "SCR (Thyristor)",
      "slug": "scr",
      "category": "Semiconductors",
      "description": "A unidirectional silicon controlled rectifier thyristor that latches ON when triggered by a gate pulse, staying ON until current drops to zero.",
      "status": "completed",
      "mission": "Explore latching switch logic using SCR components.",
      "prerequisites": ["pn-junction-diode"],
      "learningOutcomes": [
        "SCR unidirectional latching physics",
        "Gate trigger latching requirements",
        "Designing latching safety alarm loops"
      ],
      "typicalValue": "e.g. C106D / MCR100",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "10 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"10\" y1=\"30\" x2=\"25\" y2=\"30\" />\n          <polygon points=\"25,20 25,40 40,30\" fill=\"none\" />\n          <line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"40\" />\n          <line x1=\"40\" y1=\"30\" x2=\"50\" y2=\"30\" />\n          <polyline points=\"25,30 18,38 18,46\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Thyristor Semiconductor" },
        { "label": "Max Peak Inverse Voltage (Vrom)", "value": "400V - 600V" },
        { "label": "Max DC Load Current (It)", "value": "1A - 4A" },
        { "label": "Gate Trigger Current (Igt)", "value": "0.2mA - 2mA" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "TO-220 Casing",
          "description": "Power transistor package case displaying SCR ratings.",
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
          "name": "Heat Sink Tab",
          "description": "Metal back tab connected to the SCR Anode.",
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
          "id": "junction",
          "name": "PNPN Silicon Core",
          "description": "Four-layer semiconductor die that locks into latch state.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "50px",
            "height": "16px",
            "background": "linear-gradient(90deg, #dc2626 25%, #2563eb 25%, #2563eb 50%, #dc2626 50%, #dc2626 75%, #2563eb 75%)",
            "border": "1px solid rgba(255,255,255,0.15)",
            "assembledY": -20,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Leads",
          "description": "Three pins: Cathode (K), Anode (A), and Gate (G).",
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
          "question": "What is an SCR?",
          "answer": "A silicon controlled rectifier. It is a latching switch. Once a brief pulse triggers the Gate, the SCR turns ON and stays ON even if the gate trigger is removed."
        },
        {
          "question": "How do you turn it off?",
          "answer": "To turn it off, you must cut the power path or short the Anode to Cathode briefly to drop current below the holding limit."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A latching solid-state DC switch.",
        "whyNeeded": "To build safety alarms, crowbar protection loops, and latching triggers that must stay ON after activation.",
        "howItWorks": "Constructed as a 4-layer PNPN block. Triggering the Gate closes the loop internally. Because of positive feedback between internal equivalent NPN/PNP pairs, it latches ON. Only dropping the load path current to zero breaks the latch.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <polygon points=\"30,20 30,80 70,50\" fill=\"#dc2626\" />\n            <line x1=\"70\" y1=\"20\" x2=\"70\" y2=\"80\" stroke=\"#2563eb\" stroke-width=\"4\" />\n            <polyline points=\"30,50 15,65\" stroke=\"currentColor\" stroke-width=\"3\" fill=\"none\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Diode symbol showing an additional angled Gate wire, representing latching gate control.",
        "usage": "Connect in series with a DC buzzer or alarm load."
      },
      "advantages": [
        "Inherent latching action (memorizes triggers)",
        "Zero contact bounce or mechanical wear",
        "Extremely high surge current tolerance"
      ],
      "limitations": [
        "Cannot switch AC without resetting at zero crossings",
        "Wastes about 1V forward drop across the junction",
        "Requires manual reset switch to turn off"
      ],
      "engineeringChecklist": [
        "Verify gate current is sufficient to trigger latching",
        "Add a reset normally-closed switch in series to clear the latch",
        "Ensure load draws more than holding current specification limit"
      ],
      "safetyNotes": [
        "Keep gate voltages within safety parameters.",
        "High voltage SCR circuits hold charge; isolate power completely before touching."
      ],
      "commonMistakes": [
        {
          "question": "SCR fails to latch ON",
          "answer": "The load current is too low. SCRs require a minimum 'holding current' (e.g. 5mA) to stay latched. If the load is very small, add a parallel resistor to draw more current."
        }
      ],
      "engineeringTips": [
        "Add a 1k pulldown resistor from Gate to Cathode to prevent false triggers from electromagnetic noise."
      ],
      "quiz": [
        {
          "question": "Once an SCR is triggered ON, how can it be turned OFF?",
          "options": [
            "By removing the gate trigger pulse",
            "By applying a negative pulse to the gate",
            "By interrupting the anode-to-cathode current path",
            "Automatically after 1 second"
          ],
          "answer": 2,
          "explanation": "Because it is a latching thyristor, removing the gate trigger does not turn it off. Current flow must be interrupted or dropped below the holding threshold."
        }
      ],
      "buildChallenge": {
        "objective": "Build a latching security alarm circuit that sounds a buzzer permanently when a tripwire is disconnected.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "SCR (Thyristor)", "slug": "scr" },
          { "name": "1kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "Buzzer", "slug": "buzzer" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires", "Switch"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the SCR into breadboard rows 10, 11, and 12.",
            "expectedResult": "Cathode is row 10, Anode is row 11, Gate is row 12."
          },
          {
            "stepNum": 2,
            "text": "Connect Cathode row 10 to GND. Connect the Buzzer positive (+) to battery positive (+), negative (-) to Anode row 11.",
            "expectedResult": "Buzzer load is wired in series."
          },
          {
            "stepNum": 3,
            "text": "Insert the 10kΩ Resistor from battery positive (+) to Gate row 12. Connect a jumper wire from Gate row 12 to GND (representing the tripwire).",
            "expectedResult": "Gate is held low by the tripwire wire."
          },
          {
            "stepNum": 4,
            "text": "Connect the 9V battery positive (+) to the positive rail, negative (-) to GND.",
            "expectedResult": "Buzzer remains silent."
          },
          {
            "stepNum": 5,
            "text": "Disconnect the tripwire jumper wire from GND rail.",
            "expectedResult": "Buzzer sounds and latches ON."
          }
        ],
        "expectedOutput": "Disconnecting the tripwire lets the 10k resistor pull the Gate high, triggering the SCR. The buzzer sounds and stays ON even if you put the tripwire back. Disconnect battery power to reset.",
        "troubleshooting": [
          {
            "symptom": "Buzzer stays on even with tripwire grounded",
            "causes": ["Incorrect pin configuration C106D"],
            "fixSteps": ["Verify Cathode (K), Anode (A), and Gate (G) layout matches pin definitions."]
          }
        ],
        "experiments": [
          {
            "title": "Latch test",
            "description": "Trigger the alarm, reconnect the tripwire, and verify the buzzer stays on, proving latching logic."
          }
        ],
        "verificationChecklist": [
          "Buzzer latches ON correctly",
          "Tripwire silences alarm when powered up",
          "Cathode goes directly to GND"
        ],
        "reflectionQuestions": [
          "Why did the alarm stay ON after reconnecting the tripwire?",
          "How could you modify this circuit to add a reset button?"
        ],
        "relatedProjects": ["Latching Burglar Alarm", "Overvoltage Crowbar Protector"],
        "xpReward": 85,
        "badge": "Latching Alarm Badge"
      }
    },
    {
      "name": "Optocoupler",
      "slug": "optocoupler",
      "category": "Semiconductors",
      "description": "An optoelectronic isolator that transfers electrical signals between two isolated circuits using light waves.",
      "status": "completed",
      "mission": "Learn how optical paths isolate circuit noises.",
      "prerequisites": ["light-emitting-diode", "npn-transistor"],
      "learningOutcomes": [
        "Concept of electrical isolation (galvanic isolation)",
        "Internal LED and phototransistor interfaces",
        "Preventing ground loops and high voltage feedback"
      ],
      "typicalValue": "e.g. PC817 / 4N35",
      "polarity": "Polarized",
      "difficulty": "Intermediate",
      "learningTime": "10 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 60 60\" width=\"50\" height=\"50\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <rect x=\"10\" y=\"10\" width=\"40\" height=\"40\" rx=\"4\" />\n          <line x1=\"5\" y1=\"20\" x2=\"18\" y2=\"20\" />\n          <polygon points=\"18,15 18,25 24,20\" fill=\"none\" />\n          <line x1=\"24\" y1=\"15\" x2=\"24\" y2=\"25\" />\n          <line x1=\"24\" y1=\"20\" x2=\"10\" y2=\"20\" />\n          <line x1=\"42\" y1=\"20\" x2=\"42\" y2=\"40\" />\n          <line x1=\"34\" y1=\"30\" x2=\"42\" y2=\"40\" />\n          <line x1=\"50\" y1=\"30\" x2=\"42\" y2=\"30\" />\n          <line x1=\"22\" y1=\"26\" x2=\"32\" y2=\"36\" />\n          <polygon points=\"32,36 27,36 31,32\" fill=\"currentColor\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Isolator Semiconductor" },
        { "label": "Isolation Voltage (Viso)", "value": "5000V RMS" },
        { "label": "Current Transfer Ratio (CTR)", "value": "50% - 600%" },
        { "label": "Max Collector-Emitter Voltage", "value": "80V" }
      ],
      "parts": [
        {
          "id": "case",
          "name": "DIP-4 Casing",
          "description": "Black plastic dual-in-line package sealing the light path.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "64px",
            "height": "48px",
            "borderRadius": "4px",
            "background": "linear-gradient(180deg, #1e293b 0%, #090d16 100%)",
            "border": "1px solid rgba(255,255,255,0.08)",
            "assembledY": -35,
            "explodedY": -120,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "emitter",
          "name": "Infrared LED Emitter",
          "description": "Internal Gallium Arsenide infrared LED that emits light when input current flows.",
          "connectorY": 180,
          "labelSide": "right",
          "labelY": 180,
          "visual": {
            "width": "20px",
            "height": "20px",
            "borderRadius": "50%",
            "background": "rgba(96, 165, 250, 0.2)",
            "border": "1.5px solid #3b82f6",
            "assembledY": -25,
            "explodedY": -50,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "receiver",
          "name": "Phototransistor Receiver",
          "description": "Internal silicon phototransistor that detects light and switches ON the output current.",
          "connectorY": 250,
          "labelSide": "left",
          "labelY": 250,
          "visual": {
            "width": "20px",
            "height": "20px",
            "borderRadius": "50%",
            "background": "rgba(52, 211, 153, 0.2)",
            "border": "1.5px solid #10b981",
            "assembledY": -25,
            "explodedY": 15,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Metal Pins",
          "description": "Four copper lead pins: Anode (1), Cathode (2), Emitter (3), and Collector (4).",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "36px",
            "height": "56px",
            "assembledY": 15,
            "explodedY": 90,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is an optocoupler?",
          "answer": "A tiny chip holding an infrared LED and a phototransistor separated by air. When you power the LED, its light travels across the gap to turn on the transistor, linking two circuits completely through light with zero copper contact."
        },
        {
          "question": "Why is it useful?",
          "answer": "It provides galvanic isolation. If a high-voltage surge strikes the output side, it cannot travel back through the light gap, keeping your sensitive Arduino computer safe."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A light-based electrical isolator.",
        "whyNeeded": "To separate clean microcontroller logic from noisy high-voltage motor/relay loops.",
        "howItWorks": "Input signal flows into Pin 1, turning on the internal IR LED. Infrared light crosses a glass barrier, hitting the phototransistor base. This turns the transistor ON, completing the output loop without any copper wiring connection.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"10\" y=\"20\" width=\"35\" height=\"60\" fill=\"#1e293b\" />\n            <rect x=\"55\" y=\"20\" width=\"35\" height=\"60\" fill=\"#1e293b\" />\n            <path d=\"M35,50 L55,50\" stroke=\"#3b82f6\" stroke-dasharray=\"3,3\" stroke-width=\"4\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "An LED pointing optical arrows towards a transistor base inside a box boundary.",
        "usage": "Wire input pins to the controller; connect collector/emitter output to load switches."
      },
      "advantages": [
        "Prevents ground loops and high-voltage feedback spikes",
        "Blocks common-mode noise completely",
        "Compact DIP-4 packaging"
      ],
      "limitations": [
        "Limits bandwidth (not suited for GHz data lines)",
        "Current Transfer Ratio (CTR) degrades over years of use",
        "Requires separate isolated power supplies to keep isolation true"
      ],
      "engineeringChecklist": [
        "Use a series resistor (e.g. 220Ω) to limit internal LED forward current",
        "Ensure input and output grounds are kept completely separate",
        "Verify Current Transfer Ratio (CTR) matches load switching currents"
      ],
      "safetyNotes": [
        "Keep high voltage wires physically separated from low voltage trigger pins."
      ],
      "commonMistakes": [
        {
          "question": "Zero isolation benefit achieved",
          "answer": "Connected the input ground and output ground to the same copper rail. Isolation requires completely separate ground references. Keep grounds isolated!"
        }
      ],
      "engineeringTips": [
        "Use the PC817 optocoupler for basic low-speed digital signal isolates."
      ],
      "quiz": [
        {
          "question": "What is the primary method of signal transmission inside an optocoupler?",
          "options": [
            "Magnetic Induction",
            "Light Waves (Infrared)",
            "Direct Copper Contact",
            "Acoustic Waves"
          ],
          "answer": 1,
          "explanation": "Optocouplers transmit signals using light waves emitted by an internal IR LED and detected by a phototransistor, ensuring complete electrical isolation."
        }
      ],
      "buildChallenge": {
        "objective": "Build an isolated motor trigger circuit linking a simulated 5V controller signal to a 9V motor loop.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "Optocoupler", "slug": "optocoupler" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "10kΩ Resistor", "slug": "fixed-resistor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "Breadboard", "slug": "breadboard" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the PC817 Optocoupler across the breadboard center gap.",
            "expectedResult": "Pins 1 & 2 are on left, pins 3 & 4 are on right."
          },
          {
            "stepNum": 2,
            "text": "Connect the 220Ω Resistor from positive (+) trigger to Pin 1. Connect Pin 2 to GND.",
            "expectedResult": "Input LED path is complete."
          },
          {
            "stepNum": 3,
            "text": "Connect Pin 4 (Collector) to battery positive (+). Connect the 10kΩ resistor from Pin 3 (Emitter) to row 20.",
            "expectedResult": "Output path is powered."
          },
          {
            "stepNum": 4,
            "text": "Connect LED Anode (+) to row 20, LED Cathode (-) to battery negative (-). Ensure battery negative (-) does not connect to input GND.",
            "expectedResult": "Isolate loop is closed."
          }
        ],
        "expectedOutput": "Applying a 5V signal to the 220Ω input resistor lights the internal LED. Light crosses the gap, turning the output phototransistor ON and lighting the isolated output LED load.",
        "troubleshooting": [
          {
            "symptom": "Output LED never lights up",
            "causes": ["Incorrect pin orientation dot", "Input LED wired backwards"],
            "fixSteps": [
              "Locate the printed dot showing Pin 1 (top-left).",
              "Verify the input trigger voltage is at least 3V."
            ]
          }
        ],
        "experiments": [
          {
            "title": "Ground separation verification",
            "description": "Use a multimeter to verify there is megaohm resistance between input ground and battery negative, proving galvanic isolation."
          }
        ],
        "verificationChecklist": [
          "Pin 1 dot correctly aligned",
          "Completely separate input and output ground paths",
          "Output LED switches with input signal"
        ],
        "reflectionQuestions": [
          "Why is it essential to keep input and output grounds separate to maintain isolation?",
          "Explain the meaning of Current Transfer Ratio (CTR)."
        ],
        "relatedProjects": ["Isolated Relays Driver Interface", "Galvanic MIDI Input Guard"],
        "xpReward": 85,
        "badge": "Isolation Shield Badge"
      }
    }
  ]
};
