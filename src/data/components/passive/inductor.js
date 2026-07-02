export const inductorFamily = {
  "id": "inductor",
  "name": "Inductor",
  "category": "Passive Components",
  "variants": [
    {
      "name": "Fixed Inductor",
      "slug": "inductor",
      "category": "Passive Components",
      "description": "A passive component that stores electrical energy in a magnetic field when electric current flows through it.",
      "status": "completed",
      "mission": "Understand electromagnetism and inductance storage.",
      "prerequisites": ["current", "voltage"],
      "learningOutcomes": [
        "How inductors store magnetic energy",
        "Self-induction and Lenz's Law",
        "Behavior of inductors in AC vs DC circuits"
      ],
      "typicalValue": "100µH",
      "polarity": "Non-polarized",
      "difficulty": "Intermediate",
      "learningTime": "8 min",
      "symbolSvg": "\n        <svg viewBox=\"0 0 80 40\" width=\"60\" height=\"40\" stroke=\"currentColor\" stroke-width=\"2.5\" fill=\"none\">\n          <line x1=\"5\" y1=\"20\" x2=\"15\" y2=\"20\" />\n          <path d=\"M15,20 C15,10 23,10 23,20 C23,10 31,10 31,20 C31,10 39,10 39,20 C39,10 47,10 47,20 C47,10 55,10 55,20\" />\n          <line x1=\"55\" y1=\"20\" x2=\"75\" y2=\"20\" />\n        </svg>\n      ",
      "specs": [
        { "label": "Category", "value": "Passive" },
        { "label": "Common Value", "value": "1µH - 10mH" },
        { "label": "Current Rating", "value": "100mA - 5A" },
        { "label": "DCR (DC Resistance)", "value": "0.1Ω - 12Ω" }
      ],
      "parts": [
        {
          "id": "core",
          "name": "Ferrite Drum Core",
          "description": "Magnetic spool made of iron oxides that concentrates the magnetic field.",
          "connectorY": 100,
          "labelSide": "left",
          "labelY": 100,
          "visual": {
            "width": "48px",
            "height": "48px",
            "borderRadius": "8px",
            "background": "linear-gradient(90deg, #334155, #1e293b)",
            "border": "1px solid rgba(255, 255, 255, 0.1)",
            "assembledY": -30,
            "explodedY": -110,
            "zIndex": 4,
            "type": "block"
          }
        },
        {
          "id": "windings",
          "name": "Copper Windings",
          "description": "Coiled enamel-coated copper wire that carries current to build the magnetic field.",
          "connectorY": 170,
          "labelSide": "right",
          "labelY": 170,
          "visual": {
            "width": "56px",
            "height": "36px",
            "borderRadius": "4px",
            "background": "repeating-linear-gradient(90deg, #d97706, #d97706 6px, #b45309 6px, #b45309 12px)",
            "border": "1px solid rgba(255,255,255,0.1)",
            "assembledY": -20,
            "explodedY": -30,
            "zIndex": 3,
            "type": "block"
          }
        },
        {
          "id": "sleeve",
          "name": "Protective Sleeve",
          "description": "Black plastic heat-shrink wrap that insulates and holds core assemblies tight.",
          "connectorY": 240,
          "labelSide": "left",
          "labelY": 240,
          "visual": {
            "width": "60px",
            "height": "54px",
            "borderRadius": "10px",
            "background": "rgba(15, 23, 42, 0.8)",
            "border": "1px solid rgba(255, 255, 255, 0.08)",
            "assembledY": -30,
            "explodedY": 70,
            "zIndex": 2,
            "type": "block"
          }
        },
        {
          "id": "leads",
          "name": "Terminal Leads",
          "description": "Thick wire pins extending from the winding ends to connect to circuit boards.",
          "connectorY": 310,
          "labelSide": "right",
          "labelY": 310,
          "visual": {
            "width": "36px",
            "height": "20px",
            "assembledY": 10,
            "explodedY": 130,
            "zIndex": 1,
            "type": "leads"
          }
        }
      ],
      "defaultCards": [
        {
          "question": "What is an Inductor?",
          "answer": "A wire coil wrapping a magnetic core. When current enters, it grows a magnetic field to store energy temporarily."
        },
        {
          "question": "How does it block AC changes?",
          "answer": "Lenz's Law says any change in current induces an opposing electromotive force (back-EMF). This choke action resists rapid AC signals while letting flat DC flow unimpeded."
        }
      ],
      "workingPrinciple": {
        "whatIsIt": "A magnetic energy storage component.",
        "whyNeeded": "To filter out electrical spikes, smooth switching power regulator ripple, and tune radio frequencies.",
        "howItWorks": "Current flow creates circular magnetic lines of force. If current fluctuates, the magnetic field expands/collapses, inducing an opposite voltage that attempts to maintain steady current.",
        "svgDiagram": "\n          <svg viewBox=\"0 0 100 100\" width=\"80\" height=\"80\">\n            <rect x=\"25\" y=\"40\" width=\"50\" height=\"20\" fill=\"#334155\" />\n            <path d=\"M20,50 Q30,30 40,50 T60,50 T80,50\" fill=\"none\" stroke=\"#d97706\" stroke-width=\"4\" />\n            <ellipse cx=\"50\" cy=\"50\" rx=\"25\" ry=\"35\" fill=\"none\" stroke=\"#a855f7\" stroke-dasharray=\"4,4\" stroke-width=\"2\" />\n          </svg>\n        "
      },
      "circuitSymbol": {
        "meaning": "Curved coils representing physical wire wraps.",
        "usage": "Used in power supply circuits (chokes) or LC networks for filtering and frequency selections."
      },
      "advantages": [
        "Blocks noise ripples completely",
        "Extremely reliable structural build",
        "Excellent high-frequency choke responses"
      ],
      "limitations": [
        "Bulky and heavy compared to resistors/capacitors",
        "Generates electromagnetic radiation noise (EMI) affecting nearby chips",
        "Suffers from parasitic series resistance (DCR)"
      ],
      "engineeringChecklist": [
        "Verify max DC current limits of the inductor windings",
        "Keep inductors spaced apart to prevent mutual magnetic crosstalk",
        "Observe saturation current limits to prevent core permeability crash"
      ],
      "safetyNotes": [
        "High voltage spikes (inductive kickback) can occur when cutting power. Always use a flyback diode.",
        "Keep away from strong external permanent magnets."
      ],
      "commonMistakes": [
        {
          "question": "Magnetic Saturation causing overheat",
          "answer": "Running current beyond rated limit shifts the ferrite core to air-core behavior, dropping inductance to near zero and causing high currents and burnout."
        }
      ],
      "engineeringTips": [
        "Always place a flyback clamp diode across inductive coils (relays/motors) to absorb voltage spikes during turn-off.",
        "Use shielded inductors in noise-sensitive RF circuits to prevent interference."
      ],
      "quiz": [
        {
          "question": "What is the unit of inductance?",
          "options": [
            "Farad",
            "Henry",
            "Ohm",
            "Tesla"
          ],
          "answer": 1,
          "explanation": "Inductance is measured in Henries (H), commonly microhenries (µH) or millihenries (mH)."
        },
        {
          "question": "How does an inductor react to Direct Current (DC) after steady-state is reached?",
          "options": [
            "It blocks it completely",
            "It acts as a simple short circuit wire with minor resistance",
            "It shifts phase by 90 degrees",
            "It explodes under heat pressure"
          ],
          "answer": 1,
          "explanation": "At steady DC, the magnetic field is static and no opposing EMF is generated. The inductor behaves as a basic wire with its small DC copper resistance."
        }
      ],
      "buildChallenge": {
        "objective": "Build a passive Low-Pass Inductor-Capacitor filter to smooth voltage ripple.",
        "estimatedTime": "15 min",
        "difficulty": "Intermediate",
        "requiredComponents": [
          { "name": "100µH Inductor", "slug": "inductor" },
          { "name": "10µF Capacitor", "slug": "electrolytic-capacitor" },
          { "name": "LED", "slug": "light-emitting-diode" },
          { "name": "220Ω Resistor", "slug": "fixed-resistor" },
          { "name": "9V Battery & Clip", "slug": "battery" }
        ],
        "requiredTools": ["Breadboard", "Jumper Wires"],
        "wiringSteps": [
          {
            "stepNum": 1,
            "text": "Insert the 100µH Inductor across row 10 and row 15 on the breadboard.",
            "expectedResult": "Inductor bridges rows 10 and 15."
          },
          {
            "stepNum": 2,
            "text": "Connect the 10µF Capacitor positive (+) leg to row 15 and negative (-) leg to GND.",
            "expectedResult": "Filter node is established at row 15."
          },
          {
            "stepNum": 3,
            "text": "Connect the 220Ω resistor from row 15 to the LED Anode. LED Cathode to GND.",
            "expectedResult": "Output load is connected."
          },
          {
            "stepNum": 4,
            "text": "Connect battery positive (+) wire to row 10 (Inductor input) and negative (-) wire to GND rail.",
            "expectedResult": "Loop power is completed."
          }
        ],
        "expectedOutput": "The inductor-capacitor filter network attenuates high-frequency noise from the power supply, outputting a smooth stable DC to the LED load.",
        "troubleshooting": [
          {
            "symptom": "LED does not glow or dims severely",
            "causes": ["Capacitor wired in reverse polarity", "Loose pins"],
            "fixSteps": [
              "Ensure the capacitor negative stripe connects to GND.",
              "Verify inductor legs are fully inserted into rows."
            ]
          }
        ],
        "experiments": [
          {
            "title": "AC ripple test",
            "description": "Observe voltage ripple dampening when tapping high-frequency noise inputs."
          }
        ],
        "verificationChecklist": [
          "Inductor is in the positive path",
          "Capacitor is polarized correctly",
          "Steady LED illumination achieved"
        ],
        "reflectionQuestions": [
          "Why does an inductor resist rapid changes in current?",
          "How does a low-pass LC filter smooth out AC ripple voltage?"
        ],
        "relatedProjects": ["Power Supply Filter", "Switching Regulator Module"],
        "xpReward": 80,
        "badge": "Magnetic Choke Badge"
      }
    }
  ]
};
