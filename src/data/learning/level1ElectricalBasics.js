export const level1Lessons = [
  {
    "id": "intro-engineering",
    "title": "What is Engineering?",
    "slug": "what-is-engineering",
    "category": "Introduction",
    "difficulty": "Beginner",
    "time": "3 min",
    "learningObjective": "Understand how engineers apply science and math to solve real-world problems.",
    "overview": [
      "Engineering is the art of solving problems. Scientists study how the natural world behaves, but engineers take that science and use it to build tools, structures, and systems that make human life better.",
      "From the smartphone in your pocket to the bridges you cross and the clean water from your tap, engineering is at work in every corner of the modern world."
    ],
    "workingPrinciple": "Engineering works by identifying a human need, understanding the physics and constraints of the problem, designing a blueprint or model, and then iterating on the prototype until it safely and efficiently works in the real world.",
    "applications": [
      {
        "title": "The Internet",
        "value": "Software & Comm",
        "description": "Linking billions of computers worldwide."
      },
      {
        "title": "Rocket Propulsion",
        "value": "Aerospace",
        "description": "Defying gravity to explore outer space."
      }
    ],
    "commonMistakes": [
      {
        "title": "Designing without testing",
        "description": "Engineers must build and stress-test physical prototypes before manufacturing."
      },
      {
        "title": "Ignoring real constraints",
        "description": "Budget, material strength, and safety rules are as important as the primary function."
      }
    ],
    "quiz": [
      {
        "question": "What is the main goal of engineering?",
        "options": [
          "To study natural history",
          "To solve real-world problems using science and math",
          "To draw pretty sketches of machines",
          "To write essays about physics theories"
        ],
        "answer": 1,
        "explanation": "Engineers focus on practical application—creating solutions to human problems."
      }
    ],
    "relatedComponents": [
      {
        "name": "Multimeter",
        "description": "Essential tool for any engineer to measure circuit attributes."
      }
    ],
    "relatedProjects": [
      {
        "name": "Smart Plant Monitor",
        "description": "A project applying software, sensors, and hardware engineering."
      }
    ],
    "nextSlug": "what-is-electrical-engineering",
    "prevSlug": null,
    "section": "Introduction",
    "whyItMatters": "Engineering is the bridge between scientific discovery and human utility. It shapes our entire modern environment.",
    "keyConcepts": [
      "Scientific Application",
      "Iterative Prototyping",
      "Real-world Constraints"
    ],
    "miniExperiment": {
      "title": "Structural Integrity Challenge",
      "description": "Build a small bridge span using standard sheets of paper and test its load bearing capability.",
      "steps": [
        "Fold a standard sheet of paper into a accordion-style fan shape.",
        "Place the folded span between two supports (e.g. books) 15cm apart.",
        "Gradually stack coins on top of the folded paper to measure its strength."
      ]
    }
  },
  {
    "id": "intro-ee",
    "title": "What is Electrical Engineering?",
    "slug": "what-is-electrical-engineering",
    "category": "Introduction",
    "difficulty": "Beginner",
    "time": "4 min",
    "learningObjective": "Discover the field that powers our world through electricity, electromagnetism, and electronics.",
    "overview": [
      "Electrical Engineering is the branch of engineering that deals with electricity, electromagnetism, and electronics. It ranges from massive power stations transmitting gigawatts across countries to microscopic silicon chips inside smartphones.",
      "Without electrical engineers, we would not have electric grids, computers, internet communications, or electronic medical equipment."
    ],
    "workingPrinciple": "Electrical engineering uses the physical properties of electric charge to transmit energy (powering systems) or transmit information (computing and communications).",
    "applications": [
      {
        "title": "Power Plants",
        "value": "Generation",
        "description": "Generating megawatts from solar, wind, coal, or nuclear."
      },
      {
        "title": "Microprocessors",
        "value": "Electronics",
        "description": "Billions of transistors executing code on a tiny chip."
      }
    ],
    "commonMistakes": [
      {
        "title": "Mixing power and signal lines",
        "description": "High power lines generate magnetic interference that can ruin low-voltage signals."
      }
    ],
    "quiz": [
      {
        "question": "Which of the following is NOT part of Electrical Engineering?",
        "options": [
          "Designing microprocessors",
          "Building water reservoirs and concrete dams",
          "Programming microcontrollers",
          "Designing solar cell networks"
        ],
        "answer": 1,
        "explanation": "Water dams and concrete reservoirs are the domain of civil engineering, though hydro generators involve electrical engineering."
      }
    ],
    "relatedComponents": [
      {
        "name": "Oscilloscope",
        "description": "Visualizes electrical waveforms in signals over time."
      }
    ],
    "relatedProjects": [
      {
        "name": "Solar Tracker",
        "description": "Measures and redirects panels to capture maximum sunlight."
      }
    ],
    "nextSlug": "why-learn-electronics",
    "prevSlug": "what-is-engineering",
    "section": "Introduction",
    "whyItMatters": "Electrical engineering is the foundation of energy distribution and modern computer processing.",
    "keyConcepts": [
      "Power Generation",
      "Information Transmission",
      "Silicon Microelectronics"
    ],
    "miniExperiment": {
      "title": "Magnet and Coil Generator",
      "description": "Explore electromagnetic induction by rotating a strong magnet inside a coiled copper wire.",
      "steps": [
        "Wind a thin insulated copper wire around a plastic tube 50 times.",
        "Connect both ends of the wire to a low-current LED or multimeter.",
        "Quickly slide a neodymium magnet back and forth inside the tube to generate voltage."
      ]
    }
  },
  {
    "id": "why-learn",
    "title": "Why Learn Electronics?",
    "slug": "why-learn-electronics",
    "category": "Introduction",
    "difficulty": "Beginner",
    "time": "3 min",
    "learningObjective": "Understand how mastering electronics unlocks hardware prototyping and custom inventions.",
    "overview": [
      "Electronics is the control of electrical currents using tiny components. By learning electronics, you move from being a consumer of technology to a creator of technology.",
      "Whether you want to build custom home automation gadgets, robotic projects, medical prototypes, or intelligent AI sensors, electronics is the physical gateway to making your code interact with the physical world."
    ],
    "workingPrinciple": "Electronics bridges software and hardware. Code controls a microcontroller, which changes voltage pins, which in turn switches components, lights up LEDs, and moves motors.",
    "applications": [
      {
        "title": "Smart Homes",
        "value": "IoT",
        "description": "Appliances that coordinate automatically to save energy."
      },
      {
        "title": "Wearable Tech",
        "value": "Biometrics",
        "description": "Watches tracking your heart rate, sleep, and steps."
      }
    ],
    "commonMistakes": [
      {
        "title": "Treating hardware like pure software",
        "description": "In software, errors crash the code. In hardware, wrong connections can burn the chips."
      }
    ],
    "quiz": [
      {
        "question": "What is the main benefit of learning electronics?",
        "options": [
          "To run code without any electrical power",
          "To bridge software logic with physical control and sensors",
          "To memorize historical inventions",
          "To assemble furniture faster"
        ],
        "answer": 1,
        "explanation": "Electronics allows digital logic to read physical sensors and control physical actuators."
      }
    ],
    "relatedComponents": [
      {
        "name": "Microcontroller",
        "description": "The brain of modern electronics projects."
      }
    ],
    "relatedProjects": [
      {
        "name": "Home Security Alarm",
        "description": "A project integrating LDRs, lasers, and buzzers."
      }
    ],
    "nextSlug": "what-is-electricity",
    "prevSlug": "what-is-electrical-engineering",
    "section": "Introduction",
    "whyItMatters": "Learning electronics transforms you from a consumer of technology into a creator who understands control systems.",
    "keyConcepts": [
      "Sensor Integration",
      "Hardware Automation",
      "Physical Computing"
    ],
    "miniExperiment": {
      "title": "Circuit Schematic Analysis",
      "description": "Locate and identify at least three active component symbols inside a standard circuit schematic.",
      "steps": [
        "Find a simple LED flash schematic diagram online.",
        "Trace the path from the positive voltage source down to the negative ground point.",
        "Identify the resistor, LED, and switch symbols on the diagram."
      ]
    }
  },
  {
    "id": "electricity",
    "title": "What is Electricity?",
    "slug": "what-is-electricity",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "4 min",
    "learningObjective": "Discover how the movement of microscopic charged particles transfers energy.",
    "overview": [
      "Electricity is the form of energy associated with the movement or accumulation of electrical charge.",
      "Everything around you is made of atoms. Atoms contain even smaller particles: protons (which have a positive charge) and electrons (which have a negative charge). When electrons break free and move from atom to atom, they create electricity."
    ],
    "workingPrinciple": "In a copper wire, the outermost electrons of the copper atoms are loosely bound. When an external force pushes them, they jump from one atom to the next. This coordinated chain reaction transfers electrical energy.",
    "specs": [
      {
        "label": "Carrier",
        "value": "Electrons"
      },
      {
        "label": "Medium",
        "value": "Conductor"
      }
    ],
    "commonMistakes": [
      {
        "title": "Thinking electrons travel at light speed",
        "description": "The push travels at nearly light speed, but individual electrons crawl along at less than 1 mm per second!"
      }
    ],
    "quiz": [
      {
        "question": "What microscopic particles flow to create electricity in wires?",
        "options": [
          "Protons",
          "Neutrons",
          "Electrons",
          "Atoms"
        ],
        "answer": 2,
        "explanation": "Electrons are the negative charge carriers that move through metals."
      }
    ],
    "relatedComponents": [
      {
        "name": "Battery",
        "description": "Chemical cell that pushes electrons."
      }
    ],
    "relatedProjects": [
      {
        "name": "Simple LED Loop",
        "description": "A basic circuit demonstrating current flow."
      }
    ],
    "nextSlug": "electric-charge",
    "prevSlug": "why-learn-electronics",
    "section": "Electrical Concepts",
    "whyItMatters": "Electricity powers almost all modern communication, healthcare, lighting, and manufacturing industries.",
    "keyConcepts": [
      "Atomic Structure",
      "Electron Drift",
      "Energy Transfer"
    ],
    "miniExperiment": {
      "title": "Static Deflection Lab",
      "description": "Create electrostatic force using a plastic comb and dry hair to attract small paper bits.",
      "steps": [
        "Rub a plastic comb rapidly against dry hair or a wool sweater for 15 seconds.",
        "Slowly bring the comb close to tiny pieces of paper on a table.",
        "Observe the electrostatic attraction lift the papers against gravity."
      ]
    }
  },
  {
    "id": "electric-charge",
    "title": "Electric Charge",
    "slug": "electric-charge",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Understand positive and negative charges and the electrostatic force that exists between them.",
    "overview": [
      "Electric charge is a fundamental property of matter. It comes in two types: Positive (+) and Negative (-).",
      "The law of charges states that opposite charges attract each other, while like charges repel each other. This invisible force of attraction and repulsion is the foundation of how voltage and capacitors operate."
    ],
    "workingPrinciple": "Charged particles create an electric field. The strength of this field pushes like charges away and pulls opposite charges close. The unit of electric charge is the Coulomb (C).",
    "specs": [
      {
        "label": "Unit",
        "value": "Coulomb (C)"
      },
      {
        "label": "Symbol",
        "value": "Q"
      }
    ],
    "commonMistakes": [
      {
        "title": "Assuming protons move in a circuit",
        "description": "Protons are locked inside the heavy nucleus of the atom and do not move. Only negative electrons flow."
      }
    ],
    "quiz": [
      {
        "question": "What happens when two positive charges are placed close to each other?",
        "options": [
          "They attract each other",
          "They repel each other",
          "Nothing happens",
          "They neutralize instantly"
        ],
        "answer": 1,
        "explanation": "Like charges repel each other, while opposite charges attract."
      }
    ],
    "relatedComponents": [
      {
        "name": "Capacitor",
        "description": "Stores positive and negative charges on parallel plates."
      }
    ],
    "relatedProjects": [
      {
        "name": "Charge Detector",
        "description": "Build a circuit to detect static charges in the air."
      }
    ],
    "nextSlug": "conductors-vs-insulators",
    "prevSlug": "what-is-electricity",
    "section": "Electrical Concepts",
    "whyItMatters": "All electrical phenomena stem from the interactions between positive and negative charge carriers.",
    "keyConcepts": [
      "Coulombs Law",
      "Electrostatic Fields",
      "Charge Interactions"
    ],
    "miniExperiment": {
      "title": "Repulsive Balloons Lab",
      "description": "Explore electrostatic fields using two inflated balloons charged with negative electrons.",
      "steps": [
        "Inflate two balloons and tie them together with a thin piece of string.",
        "Rub both balloons vigorously with a wool cloth to deposit negative charges.",
        "Release the balloons and observe them pushing away from each other."
      ]
    }
  },
  {
    "id": "conductors-insulators",
    "title": "Conductors vs Insulators",
    "slug": "conductors-vs-insulators",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "4 min",
    "learningObjective": "Classify materials based on how easily they allow electricity to flow.",
    "overview": [
      "Materials behave differently when exposed to electricity. Some let charge pass through with ease, while others block it completely.",
      "Conductors are materials with free electrons that allow current to flow easily (like Copper, Gold, and Aluminum). Insulators lock their electrons tightly, preventing current flow (like Rubber, Glass, and Plastic)."
    ],
    "workingPrinciple": "Conductors have \"free\" outer-shell valence electrons that jump easily under a voltage push. Insulators have full outer-shells, meaning they resist letting go of electrons.",
    "specs": [
      {
        "label": "Best Conductor",
        "value": "Silver / Copper"
      },
      {
        "label": "Common Insulator",
        "value": "Rubber"
      }
    ],
    "commonMistakes": [
      {
        "title": "Thinking pure water is a good conductor",
        "description": "Pure distilled water is actually an insulator. It only conducts electricity when minerals and salts are dissolved in it."
      }
    ],
    "quiz": [
      {
        "question": "Why is copper used in household electrical wiring?",
        "options": [
          "It is a high-quality insulator",
          "It is a cheap magnetic material",
          "It is an excellent conductor with lots of free electrons",
          "It changes color when current flows"
        ],
        "answer": 2,
        "explanation": "Copper is a metal with low resistance and abundant free electrons, making it an ideal electrical conductor."
      }
    ],
    "relatedComponents": [
      {
        "name": "Copper Wire",
        "description": "Standard conductor used in circuits."
      },
      {
        "name": "Insulation Tape",
        "description": "Protective rubber sheet used to cover exposed wires."
      }
    ],
    "relatedProjects": [
      {
        "name": "Conductivity Tester",
        "description": "A simple tester that detects if an unknown material is a conductor."
      }
    ],
    "nextSlug": "voltage",
    "prevSlug": "electric-charge",
    "section": "Electrical Concepts",
    "whyItMatters": "Selecting the correct materials ensures circuits operate efficiently without causing short circuits or shocks.",
    "keyConcepts": [
      "Conductivity",
      "Resistivity",
      "Valence Electrons"
    ],
    "miniExperiment": {
      "title": "Conductivity Tester",
      "description": "Construct a simple tester loop with an LED and test various household items for conductivity.",
      "steps": [
        "Set up a basic battery-to-LED path, leaving one wire junction open.",
        "Bridge the open junction using a metal coin, a piece of wood, and plastic.",
        "Note which materials close the loop to light the LED (conductors) vs block it (insulators)."
      ]
    }
  },
  {
    "id": "voltage",
    "title": "Voltage",
    "slug": "voltage",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Understand voltage as electrical pressure or potential difference.",
    "overview": [
      "Voltage is the electrical pressure difference between two points that pushes charge through a circuit.",
      "Think of it as height in a water system: a water tank on a high tower creates high pressure, pushing water out of a hose. A battery does the same thing for electricity, creating high pressure at the positive terminal to push electrons toward the ground terminal."
    ],
    "workingPrinciple": "Voltage represents electrical potential energy per unit charge. The unit is the Volt (V), and it is measured between two points using a voltmeter.",
    "specs": [
      {
        "label": "Unit",
        "value": "Volt (V)"
      },
      {
        "label": "Symbol",
        "value": "V"
      },
      {
        "label": "Device",
        "value": "Voltmeter"
      }
    ],
    "commonMistakes": [
      {
        "title": "Measuring voltage in series",
        "description": "Voltage is a difference between two points, so you must always measure it in parallel across a component, never in line with it."
      }
    ],
    "formula": {
      "equation": "V = W / Q",
      "variables": [
        {
          "name": "V",
          "description": "Voltage in Volts (V)"
        },
        {
          "name": "W",
          "description": "Work or Energy in Joules (J)"
        },
        {
          "name": "Q",
          "description": "Charge in Coulombs (C)"
        }
      ]
    },
    "quiz": [
      {
        "question": "What is the closest analogy for Voltage in a pipe system?",
        "options": [
          "The thickness of the pipe walls",
          "The rate at which water molecules flow past",
          "The water pressure pushing water through the pipe",
          "The bucket catching the water at the end"
        ],
        "answer": 2,
        "explanation": "Voltage acts as the electrical pressure that drives current, just like water pressure drives water flow."
      }
    ],
    "relatedComponents": [
      {
        "name": "Battery",
        "description": "Chemical voltage source."
      },
      {
        "name": "Regulator",
        "description": "Keeps voltage steady."
      }
    ],
    "relatedProjects": [
      {
        "name": "Variable Power Supply",
        "description": "A project that allows adjusting output voltage."
      }
    ],
    "nextSlug": "current",
    "prevSlug": "conductors-vs-insulators",
    "section": "Circuit Fundamentals",
    "whyItMatters": "Voltage is the push or potential difference that drives electrons through a closed loop circuit.",
    "keyConcepts": [
      "Potential Difference",
      "Electromotive Force",
      "Voltage Sources"
    ],
    "miniExperiment": {
      "title": "Battery Cell Stacking",
      "description": "Measure the combined output voltage of stacked batteries using a digital multimeter.",
      "steps": [
        "Set your digital multimeter selector dial to measure DC Voltage.",
        "Touch the probes to a single AA cell to measure its nominal 1.5V output.",
        "Stack two AA cells in series (positive to negative terminal) and verify the combined 3.0V output."
      ]
    }
  },
  {
    "id": "current",
    "title": "Current",
    "slug": "current",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Measure the flow rate of electrical charge moving through a circuit.",
    "overview": [
      "Current is the rate at which electric charge flows past a specific point in a circuit.",
      "If voltage is the pressure, current is the actual water flowing through the hose. The unit is the Ampere (Amp or A), which measures how many billions of electrons pass by every second."
    ],
    "workingPrinciple": "Current flow requires a closed loop path and a voltage push. It is measured in series using an ammeter.",
    "specs": [
      {
        "label": "Unit",
        "value": "Ampere (A)"
      },
      {
        "label": "Symbol",
        "value": "I"
      },
      {
        "label": "Device",
        "value": "Ammeter"
      }
    ],
    "formula": {
      "equation": "I = Q / t",
      "variables": [
        {
          "name": "I",
          "description": "Current in Amperes (A)"
        },
        {
          "name": "Q",
          "description": "Charge in Coulombs (C)"
        },
        {
          "name": "t",
          "description": "Time in seconds (s)"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Connecting ammeter in parallel",
        "description": "Ammeters have near-zero resistance. Connecting them in parallel across a power source causes a short circuit, blowing the meter’s fuse."
      }
    ],
    "quiz": [
      {
        "question": "If 2 Coulombs of charge pass through a wire in 2 seconds, what is the current?",
        "options": [
          "0.5 Amps",
          "1 Amp",
          "2 Amps",
          "4 Amps"
        ],
        "answer": 1,
        "explanation": "Current I = Q / t = 2C / 2s = 1 Amp."
      }
    ],
    "relatedComponents": [
      {
        "name": "Fuse",
        "description": "A safety wire that melts if current exceeds safe levels."
      }
    ],
    "relatedProjects": [
      {
        "name": "Current Limit LED Loop",
        "description": "A project verifying current thresholds."
      }
    ],
    "nextSlug": "resistance",
    "prevSlug": "voltage",
    "section": "Circuit Fundamentals",
    "whyItMatters": "Current is the actual rate of charge flow. Controlling current is critical to protect sensitive microchips.",
    "keyConcepts": [
      "Amperes Rate",
      "Conventional Current vs Electron Flow",
      "Current Measurement"
    ],
    "miniExperiment": {
      "title": "Water flow analogy",
      "description": "Visualize current flow rates by comparing two water bottles with different outlet tube diameters.",
      "steps": [
        "Fill two identical plastic bottles with water.",
        "Attach a wide straw to the bottom of bottle A and a narrow straw to bottle B.",
        "Open both outlets and observe the faster water flow rate (higher current) in bottle A."
      ]
    }
  },
  {
    "id": "resistance",
    "title": "Resistance",
    "slug": "resistance",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Understand resistance as opposition to current flow and how resistors control circuits.",
    "overview": [
      "Resistance is the measure of opposition to the flow of electric current.",
      "If voltage pushes and current flows, resistance is the squeezing of the pipe that restricts the flow. The unit is the Ohm (Ω)."
    ],
    "workingPrinciple": "As electrons collide with the atomic structure of a material, they lose energy as heat. This friction is resistance. Resistors are added to limit current and protect components.",
    "specs": [
      {
        "label": "Unit",
        "value": "Ohm (Ω)"
      },
      {
        "label": "Symbol",
        "value": "R"
      },
      {
        "label": "Device",
        "value": "Ohmmeter"
      }
    ],
    "formula": {
      "equation": "R = V / I",
      "variables": [
        {
          "name": "R",
          "description": "Resistance in Ohms (Ω)"
        },
        {
          "name": "V",
          "description": "Voltage in Volts (V)"
        },
        {
          "name": "I",
          "description": "Current in Amperes (A)"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Measuring resistance on a live circuit",
        "description": "Always turn off power and disconnect components before measuring resistance, otherwise your readings will be incorrect and you could damage the meter."
      }
    ],
    "quiz": [
      {
        "question": "What happens to the current in a circuit if resistance increases while voltage stays the same?",
        "options": [
          "Current increases",
          "Current decreases",
          "Current remains the same",
          "Current goes to zero instantly"
        ],
        "answer": 1,
        "explanation": "According to Ohm's Law, current is inversely proportional to resistance. More resistance means less current."
      }
    ],
    "relatedComponents": [
      {
        "name": "Resistor",
        "description": "Restricts current flow."
      },
      {
        "name": "Potentiometer",
        "description": "Variable resistor."
      }
    ],
    "relatedProjects": [
      {
        "name": "LED Dimmer",
        "description": "Controls LED brightness by varying resistance."
      }
    ],
    "nextSlug": "power",
    "prevSlug": "current",
    "section": "Circuit Fundamentals",
    "whyItMatters": "Resistance allows us to control the current and voltage levels at specific nodes inside a circuit.",
    "keyConcepts": [
      "Resistivity Factors",
      "Ohms Unit",
      "Resistor Components"
    ],
    "miniExperiment": {
      "title": "Pencil Lead Variable Resistor",
      "description": "Explore carbon resistance by sliding a wire probe along a graphite pencil line.",
      "steps": [
        "Draw a thick, dark line 10cm long using a soft graphite pencil on paper.",
        "Connect one battery terminal clip to the start of the graphite line.",
        "Slide the second clip along the line and observe an LED brightness increase as resistance drops."
      ]
    }
  },
  {
    "id": "power",
    "title": "Power",
    "slug": "power",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Calculate the rate at which electrical energy is consumed or generated.",
    "overview": [
      "Electrical Power is the rate at which electrical energy is transferred or consumed in a circuit.",
      "It is a combination of how hard the voltage pushes (V) and how fast the current flows (I). The unit of power is the Watt (W)."
    ],
    "workingPrinciple": "Power is work done per second. When voltage drives current through a component, electrical work is done (e.g. heating a resistor or turning a motor).",
    "specs": [
      {
        "label": "Unit",
        "value": "Watt (W)"
      },
      {
        "label": "Symbol",
        "value": "P"
      }
    ],
    "formula": {
      "equation": "P = V × I",
      "variables": [
        {
          "name": "P",
          "description": "Power in Watts (W)"
        },
        {
          "name": "V",
          "description": "Voltage in Volts (V)"
        },
        {
          "name": "I",
          "description": "Current in Amperes (A)"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Exceeding resistor power ratings",
        "description": "A standard resistor is rated for 1/4 Watt (0.25W). Exceeding this makes the resistor burn and release smoke."
      }
    ],
    "quiz": [
      {
        "question": "How much power is consumed by a 12V motor drawing 2 Amperes of current?",
        "options": [
          "6 Watts",
          "10 Watts",
          "24 Watts",
          "48 Watts"
        ],
        "answer": 2,
        "explanation": "Power P = V * I = 12V * 2A = 24 Watts."
      }
    ],
    "relatedComponents": [
      {
        "name": "Power Resistor",
        "description": "Resistors designed to handle heat."
      }
    ],
    "relatedProjects": [
      {
        "name": "Solar Charger Monitor",
        "description": "Measures incoming solar power in watts."
      }
    ],
    "nextSlug": "energy",
    "prevSlug": "resistance",
    "section": "Circuit Fundamentals",
    "whyItMatters": "Power measures how fast a circuit consumes electrical energy or transforms it into light, heat, or movement.",
    "keyConcepts": [
      "Wattage Rate",
      "Joule Heating",
      "Power Formula (P = V * I)"
    ],
    "miniExperiment": {
      "title": "Appliance Power Rating Calculator",
      "description": "Find the power consumption label on three home devices and compute their operating current.",
      "steps": [
        "Inspect the label on your phone charger, laptop adapter, or lamp for the Wattage rating.",
        "Use the formula I = P / V (assuming 230V or 110V wall voltage) to find the operating current.",
        "Compare the computed currents of different appliances to see which draws the most."
      ]
    }
  },
  {
    "id": "energy",
    "title": "Energy",
    "slug": "energy",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "4 min",
    "learningObjective": "Relate electrical power consumption to overall work done over time.",
    "overview": [
      "Electrical Energy is the total work performed by electricity over a period of time.",
      "While power is how fast you use electricity (like speed), energy is the total amount consumed (like distance). It is measured in Joules (J) or Watt-hours (Wh)."
    ],
    "workingPrinciple": "Energy is power multiplied by time. Electricity meters measure energy in kilowatt-hours (kWh) to calculate utility bills.",
    "specs": [
      {
        "label": "Unit",
        "value": "Joule (J) / Wh"
      },
      {
        "label": "Symbol",
        "value": "E"
      }
    ],
    "formula": {
      "equation": "E = P × t",
      "variables": [
        {
          "name": "E",
          "description": "Energy in Joules (J) or Watt-hours"
        },
        {
          "name": "P",
          "description": "Power in Watts (W)"
        },
        {
          "name": "t",
          "description": "Time in seconds or hours"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Confusing kW and kWh",
        "description": "kW is a rate of energy use (power). kWh is the total volume of energy used over time."
      }
    ],
    "quiz": [
      {
        "question": "If a 10W LED bulb is left on for 5 hours, how much energy in Watt-hours is used?",
        "options": [
          "2 Wh",
          "15 Wh",
          "50 Wh",
          "500 Wh"
        ],
        "answer": 2,
        "explanation": "Energy = Power * Time = 10W * 5h = 50 Wh."
      }
    ],
    "relatedComponents": [
      {
        "name": "LiPo Battery",
        "description": "Stores electrical energy chemically."
      }
    ],
    "relatedProjects": [
      {
        "name": "Battery Capacity Tester",
        "description": "Measures energy content of batteries in Wh."
      }
    ],
    "nextSlug": "ohms-law",
    "prevSlug": "power",
    "section": "Circuit Fundamentals",
    "whyItMatters": "Understanding energy consumption helps in designing battery-operated systems that last for days.",
    "keyConcepts": [
      "Watt-Hours",
      "Energy Conservation",
      "Capacity Rating"
    ],
    "miniExperiment": {
      "title": "Battery Lifetime Estimator",
      "description": "Estimate how long a standard AA alkaline battery can power a low-power indicator LED.",
      "steps": [
        "Check the capacity rating of a typical AA alkaline battery (typically 2000mAh).",
        "Determine the operating current of a standard low-power LED circuit (typically 20mA).",
        "Divide capacity by current (2000mAh / 20mA) to compute the estimated operating life (100 hours)."
      ]
    }
  },
  {
    "id": "ohms-law",
    "title": "Ohm's Law",
    "slug": "ohms-law",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "6 min",
    "learningObjective": "Master the mathematical triangle relating Voltage, Current, and Resistance.",
    "overview": [
      "Ohm's Law is the most important equation in electronics. It states that current is directly proportional to voltage and inversely proportional to resistance.",
      "This simple equation (V = I * R) allows engineers to calculate exactly how much resistance is needed to prevent an LED from burning out, or how much current a circuit will draw."
    ],
    "workingPrinciple": "If you double the voltage, you double the current. If you double the resistance, you halve the current. This relationship governs all linear electronic circuits.",
    "specs": [
      {
        "label": "Formula",
        "value": "V = I × R"
      },
      {
        "label": "Discovered By",
        "value": "Georg Ohm (1827)"
      }
    ],
    "formula": {
      "equation": "V = I × R",
      "variables": [
        {
          "name": "V",
          "description": "Voltage in Volts (V)"
        },
        {
          "name": "I",
          "description": "Current in Amperes (A)"
        },
        {
          "name": "R",
          "description": "Resistance in Ohms (Ω)"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Forgetting units conversion",
        "description": "Resistors are often in kilo-ohms (kΩ) or current in milliamperes (mA). Always convert to base units (Ohms, Amps) before calculating!"
      }
    ],
    "quiz": [
      {
        "question": "If a circuit has a 9V battery and a 3 Ohm resistor, what is the current in the loop?",
        "options": [
          "3 Amps",
          "12 Amps",
          "27 Amps",
          "0.33 Amps"
        ],
        "answer": 0,
        "explanation": "Current I = V / R = 9V / 3Ω = 3 Amps."
      }
    ],
    "relatedComponents": [
      {
        "name": "Carbon Resistor",
        "description": "Component used to set resistance values."
      }
    ],
    "relatedProjects": [
      {
        "name": "LED Current Calculator",
        "description": "Calculate and build an LED loop safely."
      }
    ],
    "nextSlug": "ac-dc",
    "prevSlug": "energy",
    "section": "Circuit Analysis",
    "whyItMatters": "Ohm's Law is the most fundamental relationship used to analyze and design any electronic system.",
    "keyConcepts": [
      "V-I-R Relationship",
      "Linear Proportionality",
      "Ohmic Materials"
    ],
    "miniExperiment": {
      "title": "Ohms Law Calculator Check",
      "description": "Verify current values by changing the loop voltage across a fixed 100-ohm load resistor.",
      "steps": [
        "Write down the Ohm's Law current formula: I = V / R.",
        "Calculate current for V = 5V and R = 100 ohms (I = 0.05A or 50mA).",
        "Double the voltage to 10V and calculate the new current (I = 100mA), verifying linear doubling."
      ]
    }
  },
  {
    "id": "ac-dc",
    "title": "AC vs DC",
    "slug": "ac-dc",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Contrast Alternating Current (AC) and Direct Current (DC) systems.",
    "overview": [
      "Electricity can flow in two patterns: Alternating Current (AC) and Direct Current (DC).",
      "In DC, current flows in a single direction (like a battery). In AC, current constantly reverses its direction back and forth, usually 50 or 60 times per second (like household mains outlets)."
    ],
    "workingPrinciple": "DC provides a steady voltage ideal for computing and chips. AC can be easily stepped up to high voltages for long-distance grid transmission with minimal losses.",
    "specs": [
      {
        "label": "DC Source",
        "value": "Batteries / USB"
      },
      {
        "label": "AC Source",
        "value": "Wall Outlets"
      }
    ],
    "commonMistakes": [
      {
        "title": "Connecting AC directly to DC devices",
        "description": "Connecting a DC chip directly to AC wall power without a rectifier transformer instantly explodes the chip."
      }
    ],
    "quiz": [
      {
        "question": "What type of current is supplied by a standard AA battery?",
        "options": [
          "AC (Alternating Current)",
          "DC (Direct Current)",
          "Static Charge",
          "Magnetic Current"
        ],
        "answer": 1,
        "explanation": "Batteries always output steady Direct Current (DC) in a single direction."
      }
    ],
    "relatedComponents": [
      {
        "name": "Rectifier Diode",
        "description": "Converts AC signals to DC."
      }
    ],
    "relatedProjects": [
      {
        "name": "AC to DC Rectifier Block",
        "description": "Build a bridge circuit that rectifies signal inputs."
      }
    ],
    "nextSlug": "series-circuit",
    "prevSlug": "ohms-law",
    "section": "Circuit Analysis",
    "whyItMatters": "AC is used for long-distance power grids, while DC is the standard for logic circuits and battery systems.",
    "keyConcepts": [
      "Alternating Frequency",
      "Direct Current Stability",
      "Rectification Process"
    ],
    "miniExperiment": {
      "title": "AC-DC Source Detective",
      "description": "Inspect three electronic devices and list whether they require external AC or DC power to function.",
      "steps": [
        "Look at a toaster, a wall clock, and your smartphone charger adapter input/output text.",
        "Identify which devices consume alternating current directly from wall sockets (AC).",
        "Identify which ones run on batteries or require the USB block adapter to output stable direct current (DC)."
      ]
    }
  },
  {
    "id": "series-circuit",
    "title": "Series Circuit",
    "slug": "series-circuit",
    "category": "Circuit Connections",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Wire components in series and understand current and voltage distribution.",
    "overview": [
      "A Series Circuit is a configuration where components are connected end-to-end, forming a single path for current to flow.",
      "If you connect three LEDs in series, the same current flows through all of them. However, if any single component is removed or breaks, the loop opens and all components stop working."
    ],
    "workingPrinciple": "Total resistance is the sum of individual resistances: R_total = R1 + R2 + ... Current is the same everywhere, but voltage divides across the components.",
    "specs": [
      {
        "label": "Current path",
        "value": "Single path"
      },
      {
        "label": "Total resistance",
        "value": "Increases"
      }
    ],
    "formula": {
      "equation": "R_total = R1 + R2 + ...",
      "variables": [
        {
          "name": "R_total",
          "description": "Total resistance in Ohms (Ω)"
        },
        {
          "name": "R1, R2",
          "description": "Resistances of individual components"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Series wiring old xmas lights",
        "description": "If one bulb burns out in series lights, it acts as an open switch, turning off the entire string. Finding the broken bulb is a nightmare!"
      }
    ],
    "quiz": [
      {
        "question": "If two 100 Ohm resistors are connected in series, what is the total resistance?",
        "options": [
          "50 Ohms",
          "100 Ohms",
          "200 Ohms",
          "10,000 Ohms"
        ],
        "answer": 2,
        "explanation": "In series, resistances add up: R_total = 100 + 100 = 200 Ohms."
      }
    ],
    "relatedComponents": [
      {
        "name": "Series Resistor Pack",
        "description": "Resistors wired in series."
      }
    ],
    "relatedProjects": [
      {
        "name": "Series Christmas Tree Lights",
        "description": "A project demonstrating series loops."
      }
    ],
    "nextSlug": "parallel-circuit",
    "prevSlug": "ac-dc",
    "section": "Circuit Analysis",
    "whyItMatters": "Understanding series loops is essential for routing switches, fuses, and multi-cell battery packs.",
    "keyConcepts": [
      "Single Current Path",
      "Voltage Division",
      "Cumulative Resistance"
    ],
    "miniExperiment": {
      "title": "Series Resistor String",
      "description": "Measure the combined resistance of three 100-ohm resistors wired end-to-end in series.",
      "steps": [
        "Connect three 100-ohm resistors in a single chain (series arrangement).",
        "Touch the multimeter ohm probes to the start and end of the chain.",
        "Verify that the total measured resistance is the sum of all parts (300 ohms)."
      ]
    }
  },
  {
    "id": "parallel-circuit",
    "title": "Parallel Circuit",
    "slug": "parallel-circuit",
    "category": "Circuit Connections",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Build parallel circuits and analyze branch currents and voltage drop.",
    "overview": [
      "A Parallel Circuit is a configuration where components are connected side-by-side across the same two nodes, creating multiple branches for current flow.",
      "In a parallel circuit, every component receives the full voltage of the source. If one branch is disconnected, the other branches continue to operate normally."
    ],
    "workingPrinciple": "Voltage is the same across all parallel branches. The total current splits across the branches. Total resistance decreases: 1/R_total = 1/R1 + 1/R2 + ...",
    "specs": [
      {
        "label": "Voltage drop",
        "value": "Equal everywhere"
      },
      {
        "label": "Current path",
        "value": "Multiple paths"
      }
    ],
    "formula": {
      "equation": "1/R_total = 1/R1 + 1/R2",
      "variables": [
        {
          "name": "R_total",
          "description": "Total equivalent parallel resistance"
        },
        {
          "name": "R1, R2",
          "description": "Resistances of parallel branches"
        }
      ]
    },
    "commonMistakes": [
      {
        "title": "Parallel battery shorting",
        "description": "Never connect batteries of different voltages in parallel, as the higher voltage battery will dump current into the lower voltage one, causing overheating."
      }
    ],
    "quiz": [
      {
        "question": "How are household appliances wired in a home distribution box?",
        "options": [
          "In series, so turning off a TV turns off all lights",
          "In parallel, so each appliance receives full voltage and operates independently",
          "In a single loops with high fuses",
          "They do not use circuits"
        ],
        "answer": 1,
        "explanation": "Parallel wiring ensures that switching off one light does not cut power to your refrigerator or computer."
      }
    ],
    "relatedComponents": [
      {
        "name": "Terminal Block",
        "description": "Component used to split signals in parallel."
      }
    ],
    "relatedProjects": [
      {
        "name": "Parallel Room Wiring Model",
        "description": "A mock room circuit model with independent switches."
      }
    ],
    "nextSlug": "open-circuit",
    "prevSlug": "series-circuit",
    "section": "Circuit Analysis",
    "whyItMatters": "Almost all household electrical outlets are wired in parallel, keeping appliance voltages independent.",
    "keyConcepts": [
      "Multiple Current Paths",
      "Constant Node Voltage",
      "Reciprocal Resistance"
    ],
    "miniExperiment": {
      "title": "Parallel Loop Isolation",
      "description": "Verify that removing one bulb in a parallel loop does not disconnect current to the other loop.",
      "steps": [
        "Set up two LED loops sharing the same battery terminals in a parallel layout.",
        "Switch both loops on and verify that both LEDs light up.",
        "Disconnect wire link to LED A and verify that LED B remains on and unaffected."
      ]
    }
  },
  {
    "id": "open-circuit",
    "title": "Open Circuit",
    "slug": "open-circuit",
    "category": "Circuit Connections",
    "difficulty": "Beginner",
    "time": "3 min",
    "learningObjective": "Define open circuits and use switches to control loop state.",
    "overview": [
      "An Open Circuit is a circuit that has an intentional or accidental break in its path, preventing current from flowing.",
      "A closed circuit forms a complete loop, letting charges circulate. When you turn off a light, your switch physically disconnects the wires, creating an open circuit that stops the flow."
    ],
    "workingPrinciple": "An open circuit has infinite resistance at the point of the break. The current is exactly zero Amps, and the full voltage difference appears across the break.",
    "specs": [
      {
        "label": "Current",
        "value": "0 Amperes"
      },
      {
        "label": "Resistance",
        "value": "Infinite (∞)"
      }
    ],
    "commonMistakes": [
      {
        "title": "Confusing open and closed terminology",
        "description": "In software, opening a file makes it active. In electronics, opening a circuit breaks it, turning it off."
      }
    ],
    "quiz": [
      {
        "question": "What is the current flowing in an open circuit?",
        "options": [
          "Infinite Amps",
          "1 Amp",
          "Same as input voltage",
          "0 Amps"
        ],
        "answer": 3,
        "explanation": "An open circuit has a broken path, so no charge carriers can circulate. Current is zero."
      }
    ],
    "relatedComponents": [
      {
        "name": "Toggle Switch",
        "description": "Manually opens and closes a path."
      },
      {
        "name": "Relay",
        "description": "Electrically controlled switch."
      }
    ],
    "relatedProjects": [
      {
        "name": "Laser Tripwire Switch",
        "description": "A project that opens the circuit when a laser is broken."
      }
    ],
    "nextSlug": "short-circuit",
    "prevSlug": "parallel-circuit",
    "section": "Safety",
    "whyItMatters": "Open circuits allow us to stop current flow safely using mechanical switch devices.",
    "keyConcepts": [
      "Broken Loops",
      "Infinite Resistive Air Gap",
      "Voltage Presence without Flow"
    ],
    "miniExperiment": {
      "title": "Paperclip Switch Loop",
      "description": "Construct a simple paperclip switch to easily open and close a flashlight bulb loop.",
      "steps": [
        "Construct a battery-to-bulb circuit, cutting one connection path in half.",
        "Secure a metal paperclip to one cut wire end using a thumbtack.",
        "Rotate the paperclip to touch the second wire end, closing (and opening) the circuit."
      ]
    }
  },
  {
    "id": "short-circuit",
    "title": "Short Circuit",
    "slug": "short-circuit",
    "category": "Circuit Connections",
    "difficulty": "Beginner",
    "time": "4 min",
    "learningObjective": "Understand the danger of short circuits and how low-resistance paths bypass loads.",
    "overview": [
      "A Short Circuit is an accidental, low-resistance connection between two nodes of a circuit that are meant to be at different voltages.",
      "Electricity always takes the path of least resistance. If you connect a bare wire directly from the positive battery terminal to the negative terminal, current bypasses the lightbulb and flows through the wire, rapidly draining the battery and causing sparks."
    ],
    "workingPrinciple": "A short circuit has near-zero resistance. According to Ohm's Law (I = V/R), as resistance approaches zero, current skyrockets, generating excessive heat.",
    "specs": [
      {
        "label": "Danger Level",
        "value": "Extremely High (Fire Hazard)"
      },
      {
        "label": "Resistance",
        "value": "Near Zero (0)"
      }
    ],
    "commonMistakes": [
      {
        "title": "Shorting batteries with metallic tools",
        "description": "Accidentally touching both battery terminals with a metal wrench causes massive sparking and can explode LiPo batteries."
      }
    ],
    "quiz": [
      {
        "question": "Why does a short circuit generate sparks and fire?",
        "options": [
          "Because resistance is infinite",
          "Because current becomes extremely high due to near-zero resistance",
          "Because the battery converts to AC",
          "Because protons escape the wire"
        ],
        "answer": 1,
        "explanation": "Low resistance causes current to spike. This massive flow of electrons creates intense friction and heat."
      }
    ],
    "relatedComponents": [
      {
        "name": "Circuit Breaker",
        "description": "Automatically breaks connection during short circuit currents."
      },
      {
        "name": "Fuse",
        "description": "Blows to save components."
      }
    ],
    "relatedProjects": [
      {
        "name": "Fuse Blow indicator",
        "description": "A project displaying a warning when a fuse blows."
      }
    ],
    "nextSlug": "electrical-safety",
    "prevSlug": "open-circuit",
    "section": "Safety",
    "whyItMatters": "Uncontrolled short circuits dump high currents, generating intense heat and creating severe fire hazards.",
    "keyConcepts": [
      "Zero Resistance Path",
      "Thermal runaway",
      "Overcurrent Protection"
    ],
    "miniExperiment": {
      "title": "Short Circuit Safety Analysis",
      "description": "Analyze how a thin copper strand or fuse acts as a safety switch under high current.",
      "steps": [
        "Obtain a single very thin copper wire strand from a stranded wire.",
        "Connect it in series with a 9V battery and a 10W load resistor.",
        "Simulate a short circuit by touching a wire directly across the resistor, and observe the thin copper strand melt safely (fusing)."
      ]
    }
  },
  {
    "id": "electrical-safety",
    "title": "Electrical Safety",
    "slug": "electrical-safety",
    "category": "Electrical Basics",
    "difficulty": "Beginner",
    "time": "5 min",
    "learningObjective": "Observe safe laboratory and home practices when working with electrical current.",
    "overview": [
      "Safety is the first rule of electrical engineering. Low voltages (like 5V from USB or 9V batteries) are generally safe, but household outlets (110V/230V) carry enough energy to be lethal.",
      "Understanding how current affects the human body and how safety devices protect you is critical for working with hardware."
    ],
    "workingPrinciple": "Human skin has resistance. Wet skin drops resistance, letting dangerous currents flow through the body. Standard safety devices like GFCIs detect current leaks and cut power instantly.",
    "specs": [
      {
        "label": "Safe Voltage limit",
        "value": "Under 50V DC"
      },
      {
        "label": "Fatal Current",
        "value": "Above 50mA (0.05A)"
      }
    ],
    "commonMistakes": [
      {
        "title": "Working on hot wires",
        "description": "Never touch wires while a circuit is powered. Always unplug or flip the breaker first!"
      },
      {
        "title": "Using water on electrical fires",
        "description": "Water conducts electricity. Use dry chemical fire extinguishers for electrical fires, never water!"
      }
    ],
    "quiz": [
      {
        "question": "What is the safe threshold of electrical current through the human body?",
        "options": [
          "Anything below 10 Amps",
          "Less than 5-10 Milliamperes",
          "Only high voltage AC is safe",
          "There is no safe threshold"
        ],
        "answer": 1,
        "explanation": "Currents above 10mA can cause muscle contraction (preventing you from letting go), and 50-100mA is fatal."
      }
    ],
    "relatedComponents": [
      {
        "name": "GFCI Socket",
        "description": "Ground Fault Circuit Interrupter."
      },
      {
        "name": "ESD Wriststrap",
        "description": "Protects components from static shocks."
      }
    ],
    "relatedProjects": [
      {
        "name": "GFCI simulation tester",
        "description": "A safe low-voltage mock GFCI circuit."
      }
    ],
    "nextSlug": "final-assessment",
    "prevSlug": "short-circuit",
    "section": "Safety",
    "whyItMatters": "Understanding current pathways and limits is crucial to safely work on low and high voltage electronics.",
    "keyConcepts": [
      "Shock Thresholds",
      "Grounding Principles",
      "GFCIs Protection"
    ],
    "miniExperiment": {
      "title": "GFCI Test Button Check",
      "description": "Perform a safety audit on a bathroom GFCI outlet using its built-in mechanical test button.",
      "steps": [
        "Locate a GFCI-equipped wall outlet in your kitchen or bathroom (identifiable by TEST/RESET buttons).",
        "Press the \"TEST\" button and verify that the \"RESET\" button pops out and cuts power.",
        "Press the \"RESET\" button to restore electrical flow and safety status."
      ]
    }
  },
  {
    "id": "final-assessment",
    "title": "Final Assessment",
    "slug": "final-assessment",
    "category": "Assessment",
    "difficulty": "Intermediate",
    "time": "8 min",
    "learningObjective": "Validate your Level 1 Electrical Basics mastery across all key core concepts.",
    "overview": [
      "Welcome to the Level 1 Final Assessment. This comprehensive review verifies your understanding of voltage, current, resistance, Ohm's Law, series/parallel networks, and safety.",
      "Completing this assessment unlocks Level 2 and validates your foundation as a hardware engineer."
    ],
    "workingPrinciple": "This exam evaluates conceptual recall, mathematical application (Ohm's Law calculations), circuit classification, and troubleshooting skills.",
    "specs": [
      {
        "label": "Total Questions",
        "value": "5 MCQ"
      },
      {
        "label": "Required Score",
        "value": "80% (4/5)"
      }
    ],
    "commonMistakes": [
      {
        "title": "Rushing calculations",
        "description": "Take your time to write down V = I * R and double check values before choosing your answer."
      }
    ],
    "quiz": [
      {
        "question": "Which component is used to restrict the flow of electric current?",
        "options": [
          "Battery",
          "Resistor",
          "GFCI Outlet",
          "Voltmeter"
        ],
        "answer": 1,
        "explanation": "Resistors restrict current flow by adding resistance to the circuit loop."
      },
      {
        "question": "In which circuit connection is the voltage same across all components?",
        "options": [
          "Series Circuit",
          "Parallel Circuit",
          "Open Circuit",
          "None of the above"
        ],
        "answer": 1,
        "explanation": "Parallel branches share the same electrical pressure nodes, so voltage is equal across them."
      },
      {
        "question": "What is the current of a 10V circuit with a 5 Ohm resistor?",
        "options": [
          "2 Amps",
          "15 Amps",
          "50 Amps",
          "0.5 Amps"
        ],
        "answer": 0,
        "explanation": "I = V / R = 10V / 5Ω = 2 Amps."
      },
      {
        "question": "What happens if you bypass a lightbulb in a circuit with a direct wire from battery positive to negative?",
        "options": [
          "The lightbulb glows brighter",
          "You create an open circuit",
          "You create a short circuit",
          "The current goes to zero"
        ],
        "answer": 2,
        "explanation": "Bypassing the load with a direct zero-resistance wire creates a short circuit path."
      },
      {
        "question": "Which device is used to measure potential difference across a component?",
        "options": [
          "Ammeter",
          "Ohmmeter",
          "Voltmeter",
          "Oscilloscope"
        ],
        "answer": 2,
        "explanation": "A voltmeter measures electrical potential difference (voltage) in parallel across a component."
      }
    ],
    "relatedComponents": [
      {
        "name": "Electrical Engineering Certificate",
        "description": "Level 1 Badge unlocked upon completion."
      }
    ],
    "relatedProjects": [
      {
        "name": "Level 1 Projects Portfolio",
        "description": "Collection of basic engineering loops."
      }
    ],
    "nextSlug": null,
    "prevSlug": "electrical-safety",
    "section": "Final Assessment",
    "whyItMatters": "Testing your understanding ensures you have mastered Level 1 before moving to microcontrollers.",
    "keyConcepts": [
      "Ohm's Law Recall",
      "Series/Parallel Calculations",
      "Safety Protocols"
    ],
    "miniExperiment": {
      "title": "Level 1 Knowledge Check",
      "description": "Begin the final assessment quiz to test your mastery of core electrical basics concepts.",
      "steps": [
        "Review the key concepts checklist in the right side progress panel.",
        "Ensure you have obtained at least 200 XP from prior module quizzes.",
        "Click the Start Assessment button to begin the 5-question challenge."
      ]
    }
  }
];
