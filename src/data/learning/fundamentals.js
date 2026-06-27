export const fundamentalsData = [
  {
    id: 'electricity',
    name: 'Electricity',
    slug: 'electricity',
    category: 'Electrical Basics',
    description: 'The movement of charged particles.',
    mission: 'Discover how the movement of microscopic charges transfers power.',
    learningTime: '3 min',
    difficulty: 'Beginner',
    unit: 'Charge (Coulomb)',
    symbol: 'Q',
    prerequisites: [],
    learningOutcomes: ['What is electric charge', 'How charge travels', 'Analogy of electricity'],
    specs: [
      { label: 'Core Concept', value: 'Flow of Charge' },
      { label: 'Medium', value: 'Conductors (e.g. Copper)' },
      { label: 'Carrier', value: 'Electrons' }
    ],
    analogy: {
      title: 'The Marble Tube Analogy',
      description: 'Imagine a plastic tube completely filled with marbles. If you push a new marble into one end, a marble at the very far end instantly pops out. Electricity behaves exactly like this. Inside a copper wire, there are billions of tiny marbles called charges. When you apply a force at one end, they push each other along the wire, transferring energy.'
    },
    explore: {
      title: 'Pushing Charges',
      description: 'Adjust the slider to apply a push force. Watch how applying a force makes the marbles flow in a continuous line from one end of the wire to the other. When force is zero, the marbles jiggle but stay in place.'
    },
    simulatorConfig: {
      type: 'electricity',
      label: 'Push Force',
      min: 0,
      max: 10,
      defaultValue: 0
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is Electricity?',
          a: 'It is the flow or movement of electric charge (microscopic particles) through a conductor.'
        },
        {
          q: 'Why do we need it?',
          a: 'To transport energy instantly across distances and convert it into light, heat, or rotary motion.'
        },
        {
          q: 'Where do we see it?',
          a: 'Every time you plug in a device, turn on a screen, or watch a lightning storm.'
        },
        {
          q: 'What happens if it changes?',
          a: 'A stronger push force makes the charges flow faster, transferring more electrical energy per second.'
        }
      ]
    },
    applications: [
      {
        title: 'Mains Wall Outlet',
        value: 'AC Electricity',
        description: 'Delivers high electrical energy suitable for power-hungry appliances.'
      },
      {
        title: 'USB Ports',
        value: 'DC Electricity',
        description: 'Delivers a low, safe flow of charge to recharge batteries and power microchips.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'When you toggle a light switch, do the charges travel all the way from the power station to your lightbulb instantly?',
      answer: 'No! The copper wires are already full of charges (like the marbles in our full tube). The push is what travels at nearly the speed of light, making the bulb turn on instantly, while the actual charges crawl along very slowly (about 1 mm per second)!'
    },
    nextSlug: 'voltage'
  },
  {
    id: 'voltage',
    name: 'Voltage',
    slug: 'voltage',
    category: 'Electrical Basics',
    description: 'Electrical pressure that pushes electrons.',
    mission: 'Learn how potential difference provides the force to move charge.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Volt (V)',
    symbol: 'V',
    prerequisites: ['electricity'],
    learningOutcomes: ['What is electrical pressure', 'Why voltage is a difference', 'Voltage sources'],
    specs: [
      { label: 'Measurement', value: 'Volts (V)' },
      { label: 'Physics Name', value: 'Potential Difference' },
      { label: 'Sensor Device', value: 'Voltmeter' }
    ],
    analogy: {
      title: 'The Water Tank Analogy',
      description: 'Imagine a water tank placed high on a tower. The height of the water creates pressure at the bottom. The higher the tank, the more pressure pushing water out through a hose. Voltage is exactly like this water pressure. It is the electrical pressure difference between two points that pushes charge through a wire.'
    },
    explore: {
      title: 'Water Tank Height (Voltage)',
      description: 'Drag the slider to adjust the tank height (Voltage). Observe how increasing the voltage pressure causes the water stream to spray faster and further out of the pipe at the bottom.'
    },
    simulatorConfig: {
      type: 'voltage',
      label: 'Voltage (V)',
      min: 0,
      max: 24,
      defaultValue: 5
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is Voltage?',
          a: 'It is the electrical pressure difference between two points that pushes charges to move.'
        },
        {
          q: 'Why do we need it?',
          a: 'Charges are lazy and will not move on their own. Voltage provides the push needed to start electrical current.'
        },
        {
          q: 'Where do we see it?',
          a: 'Batteries (1.5V, 9V, 12V) and household wall sockets (110V or 230V).'
        },
        {
          q: 'What happens if it changes?',
          a: 'Higher voltage pushes harder, causing more current to flow. Too high a voltage will damage sensitive devices.'
        }
      ]
    },
    applications: [
      {
        title: 'Phone Charger',
        value: '5V',
        description: 'Standard safe voltage for charging portable USB electronics.'
      },
      {
        title: 'Car Battery',
        value: '12V',
        description: 'Provides enough push to spin the heavy starter motor of a vehicle engine.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'Your phone charger adapter says 5V. What does this voltage value actually tell you?',
      answer: 'It means the adapter creates an electrical pressure difference of 5 Volts between the positive line and ground. This pressure is standard, pushing charges through your phone’s charging port at a safe, controlled speed.'
    },
    nextSlug: 'current'
  },
  {
    id: 'current',
    name: 'Current',
    slug: 'current',
    category: 'Electrical Basics',
    description: 'The flow rate of electrical charge.',
    mission: 'Discover how current carries electrical power to components.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Ampere (A)',
    symbol: 'I',
    prerequisites: ['voltage'],
    learningOutcomes: ['What is current flow', 'Current limits', 'Amperes unit'],
    specs: [
      { label: 'Measurement', value: 'Amperes (A)' },
      { label: 'Symbol in Math', value: 'I' },
      { label: 'Sensor Device', value: 'Ammeter' }
    ],
    analogy: {
      title: 'The River Flow Analogy',
      description: 'Imagine a flowing river. To describe it, we can count how many gallons of water flow past a bridge every single second. In a circuit, current is the same rate of flow. Instead of gallons, we count the volume of charge (electrons) flowing through a wire cross-section per second.'
    },
    explore: {
      title: 'Rate of Water Flow (Current)',
      description: 'Slide the current flow value (Amps) up and down. Watch how higher current speeds up the water drops passing through and makes a water-wheel spin faster.'
    },
    simulatorConfig: {
      type: 'current',
      label: 'Current (A)',
      min: 0,
      max: 5,
      defaultValue: 1
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is Current?',
          a: 'It is the flow rate of charge (volume of charge passing by per second) in a wire.'
        },
        {
          q: 'Why do we need it?',
          a: 'Current is what performs the physical work—heating a toaster, lighting a bulb, or spinning a motor.'
        },
        {
          q: 'Where do we see it?',
          a: 'An LED draws about 0.02A, a phone charger delivers 2A, and a microwave oven draws 10A.'
        },
        {
          q: 'What happens if it changes?',
          a: 'Too much current causes wires to overheat and melt. Too little current means components won’t activate.'
        }
      ]
    },
    applications: [
      {
        title: 'LED Indicator',
        value: '0.02A (20mA)',
        description: 'Requires a tiny current. More than this will burn the LED out instantly.'
      },
      {
        title: 'USB Charger',
        value: '2A',
        description: 'Standard flow rate to recharge modern lithium phone batteries quickly.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'If you plug an LED that only needs 0.02A into a 2A charger, will the charger force 2A of current and blow the LED up?',
      answer: 'No! An adapter rating of 2A represents its maximum limit. The device only draws the current it needs. As long as the voltage pressure is correct (5V), the LED is perfectly safe.'
    },
    nextSlug: 'resistance'
  },
  {
    id: 'resistance',
    name: 'Resistance',
    slug: 'resistance',
    category: 'Electrical Basics',
    description: 'Opposition to the flow of current.',
    mission: 'Explore how materials limit and control current.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Ohm (Ω)',
    symbol: 'R',
    prerequisites: ['current'],
    learningOutcomes: ['What is electrical resistance', 'Why resistance generates heat', 'Unit Ohms'],
    specs: [
      { label: 'Measurement', value: 'Ohms (Ω)' },
      { label: 'Symbol in Math', value: 'R' },
      { label: 'Material Factor', value: 'Resistivity' }
    ],
    analogy: {
      title: 'The Hose Squeeze Analogy',
      description: 'Imagine water flowing through a flexible hose. If you squeeze the hose with your hand, you constrict the pipe and slow down the water flow. Resistance is this squeeze. It is the friction that charges encounter as they try to flow through a material.'
    },
    explore: {
      title: 'Squeezing the Pipe (Resistance)',
      description: 'Adjust the resistance (squeeze) slider. Squeezing the pipe restricts water flow and generates friction, turning the squeezed zone orange/red to indicate heat creation.'
    },
    simulatorConfig: {
      type: 'resistance',
      label: 'Resistance (Ω)',
      min: 1,
      max: 100,
      defaultValue: 10
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is Resistance?',
          a: 'It is the opposition or friction that slows down charge flow in a circuit.'
        },
        {
          q: 'Why do we need it?',
          a: 'To limit current. Without resistance, current would flow infinitely fast, causing dangerous short circuits.'
        },
        {
          q: 'Where do we see it?',
          a: 'In resistor components, lightbulb filaments, and heating elements in toasters.'
        },
        {
          q: 'What happens if it changes?',
          a: 'Lowering resistance increases current flow. Raising resistance chokes the flow of current.'
        }
      ]
    },
    applications: [
      {
        title: 'Toaster Wire',
        value: 'High Resistance',
        description: 'Designed to convert current directly into heat to toast bread.'
      },
      {
        title: 'Copper Wiring',
        value: 'Low Resistance',
        description: 'Allows current to travel long distances with minimal heat loss.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'When you turn on a toaster, why do the metal coils glow red hot while the power cord plugged into the wall stays cool?',
      answer: 'The toaster coils are made of nichrome, which has a very high resistance. Pushing current through high resistance creates extreme friction, converting electricity into glowing heat. The copper wall cord has very low resistance, so charges slide through with minimal friction and generate no heat.'
    },
    nextSlug: 'power'
  },
  {
    id: 'power',
    name: 'Power',
    slug: 'power',
    category: 'Electrical Basics',
    description: 'The rate at which electrical energy is consumed.',
    mission: 'See how push and flow combine to do electrical work.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Watt (W)',
    symbol: 'P',
    prerequisites: ['resistance'],
    learningOutcomes: ['What is electrical power', 'Concept of Watts', 'How voltage and current combine'],
    specs: [
      { label: 'Measurement', value: 'Watts (W)' },
      { label: 'Relation', value: 'Push × Flow (V × I)' },
      { label: 'Work Type', value: 'Rate of Energy Use' }
    ],
    analogy: {
      title: 'The Water Wheel Analogy',
      description: 'Imagine a water wheel. How fast the wheel spins and how much load it can lift depends on both the water pressure (Voltage) and the water volume (Current). Power behaves the same way. It is the rate at which electrical work is done, combining push and flow: More Voltage + More Current = More Power.'
    },
    explore: {
      title: 'Work Done (Power)',
      description: 'Adjust the sliders for Voltage (Push) and Current (Flow). Watch how increasing both increases the output Power (Watts) and makes a heavy block lift faster.'
    },
    simulatorConfig: {
      type: 'power',
      label: 'Voltage (V)',
      min: 1,
      max: 12,
      defaultValue: 5
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is Power?',
          a: 'It is the speed or rate at which electrical energy is consumed to perform physical work.'
        },
        {
          q: 'Why do we need it?',
          a: 'To measure how hard a device is working—like how bright a bulb shines or how fast a motor spins.'
        },
        {
          q: 'Where do we see it?',
          a: 'LED bulbs (9W), vacuum cleaners (1000W), and electric heaters (2000W).'
        },
        {
          q: 'What happens if it changes?',
          a: 'Higher power devices perform work faster but require more electrical flow and generate more heat.'
        }
      ]
    },
    applications: [
      {
        title: 'LED Lightbulb',
        value: '9W',
        description: 'Low power draw, producing high light output with almost no wasted heat.'
      },
      {
        title: 'Hairdryer',
        value: '1500W',
        description: 'Extremely high power draw due to generating heat and spinning a blower fan simultaneously.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'An old lightbulb uses 60W, while a modern LED bulb of the same brightness uses only 9W. Why does this difference exist?',
      answer: 'Old incandescent bulbs waste 95% of their power generating heat instead of light. LEDs have very high efficiency, converting almost all electrical power directly into light, giving you the same brightness for a fraction of the power!'
    },
    nextSlug: 'energy'
  },
  {
    id: 'energy',
    name: 'Energy',
    slug: 'energy',
    category: 'Electrical Basics',
    description: 'Total electrical work done over time.',
    mission: 'Understand battery capacity and electricity consumption.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Watt-hour (Wh)',
    symbol: 'E',
    prerequisites: ['power'],
    learningOutcomes: ['What is electrical energy', 'Watt-hours explained', 'Battery capacities'],
    specs: [
      { label: 'Measurement', value: 'Watt-hours (Wh)' },
      { label: 'Billing Unit', value: 'Kilowatt-hour (kWh)' },
      { label: 'Relation', value: 'Power × Time' }
    ],
    analogy: {
      title: 'The Water Bucket Analogy',
      description: 'Imagine collecting water from a pipe. Power is the speed at which water flows into the bucket. Energy is the total amount of water collected in the bucket over time. Total energy consumption depends on how much power a device uses and how long it runs.'
    },
    explore: {
      title: 'Accumulating Water (Energy)',
      description: 'Adjust the power slider (Watts) and the run time slider (hours). Watch how the bucket fills up, demonstrating how energy accumulates over time.'
    },
    simulatorConfig: {
      type: 'energy',
      label: 'Power Draw (W)',
      min: 1,
      max: 10,
      defaultValue: 2
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is Energy?',
          a: 'It is the total amount of electrical work done over a period of time.'
        },
        {
          q: 'Why do we need it?',
          a: 'To measure how much electrical capacity a battery holds or how much electricity we use in a month.'
        },
        {
          q: 'Where do we see it?',
          a: 'Phone battery capacities (10Wh to 15Wh) and household electricity meters (kWh).'
        },
        {
          q: 'What happens if it changes?',
          a: 'Using higher power devices or running them for longer times drains batteries faster.'
        }
      ]
    },
    applications: [
      {
        title: 'Power Bank',
        value: '20Wh',
        description: 'Indicates the total stored energy capacity, telling you how many times you can charge a device.'
      },
      {
        title: 'Utility Bill',
        value: 'kWh (1000 Wh)',
        description: 'Unit used by power companies to charge you for total energy consumed by your home.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'If your power bank holds 20Wh of energy, and your phone charger draws 5W of power, how long can it charge?',
      answer: 'Total time is Energy divided by Power: 20Wh / 5W = 4 hours. In real life, due to heat loss, the conversion is about 85% efficient, yielding around 3.4 hours of charge time.'
    },
    nextSlug: 'ac-dc'
  },
  {
    id: 'ac-dc',
    name: 'AC vs DC',
    slug: 'ac-dc',
    category: 'Electrical Basics',
    description: 'Alternating Current versus Direct Current.',
    mission: 'Compare continuous flow with alternating flow.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Direction',
    symbol: 'AC/DC',
    prerequisites: ['current'],
    learningOutcomes: ['What is DC', 'What is AC', 'Why we use both'],
    specs: [
      { label: 'DC Direction', value: 'One-Way' },
      { label: 'AC Direction', value: 'Oscillating (Back/Forth)' },
      { label: 'Frequency (AC)', value: '50Hz / 60Hz' }
    ],
    analogy: {
      title: 'Hand Saw vs Conveyor Belt',
      description: 'Imagine cutting wood. Direct Current (DC) is like a conveyor belt carrying coal continuously in one direction. Alternating Current (AC) is like a hand saw moving back and forth rhythmically. Both transfer energy, but in different ways.'
    },
    explore: {
      title: 'DC vs AC Flow',
      description: 'Toggle between DC and AC mode. In DC, the marbles flow steadily in a single direction. In AC, they vibrate back and forth rhythmically, displaying a sine wave on the screen.'
    },
    simulatorConfig: {
      type: 'acdc',
      label: 'Frequency (Hz)',
      min: 0,
      max: 60,
      defaultValue: 0
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is AC vs DC?',
          a: 'DC flows in one direction. AC alternates directions back and forth rhythmically.'
        },
        {
          q: 'Why do we need both?',
          a: 'DC is needed for microchips and batteries. AC is extremely efficient for long-distance power lines.'
        },
        {
          q: 'Where do we see it?',
          a: 'DC: Batteries, phone chargers, USB lines. AC: Household wall outlets.'
        },
        {
          q: 'What happens if it changes?',
          a: 'Plugging a DC device directly into AC without a rectifier/adapter will burn it out.'
        }
      ]
    },
    applications: [
      {
        title: 'Laptops and Phones',
        value: 'DC Power',
        description: 'Uses internal rechargeable lithium batteries which operate solely on DC.'
      },
      {
        title: 'Mains Grid',
        value: 'AC Power',
        description: 'Generated at power plants and sent over power lines because it loses less energy over distances.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'Why does your phone need a bulky charger brick instead of a simple wire connected straight to a wall outlet?',
      answer: 'Your wall outlet provides 230V/110V AC, which alternates back and forth. Your phone battery only accepts low-voltage 5V DC. The charger brick is an adapter that steps down the voltage and converts (rectifies) the alternating AC into clean, one-way DC.'
    },
    nextSlug: 'series-circuit'
  },
  {
    id: 'series-circuit',
    name: 'Series Circuit',
    slug: 'series-circuit',
    category: 'Electrical Basics',
    description: 'Single path for current flow.',
    mission: 'Learn the single-path daisy chain connection.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Connection',
    symbol: 'Series',
    prerequisites: ['current'],
    learningOutcomes: ['What is a series loop', 'Single current path', 'Series failures'],
    specs: [
      { label: 'Paths', value: 'Single Path' },
      { label: 'Current Rule', value: 'Same everywhere' },
      { label: 'Voltage Rule', value: 'Shared among parts' }
    ],
    analogy: {
      title: 'The Single Hiker Line',
      description: 'Imagine a group of hikers walking in a single file line on a narrow mountain trail. If any single hiker stops, the entire line of hikers behind them is forced to stop. A series circuit behaves exactly like this. There is only one single path for electricity.'
    },
    explore: {
      title: 'Breaking the Series Path',
      description: 'Turn the switch ON to see current flow through both bulbs. Click the toggle to "Break Bulb 1". Watch how breaking one bulb halts all flow, causing the second bulb to turn off instantly.'
    },
    simulatorConfig: {
      type: 'series',
      label: 'Active Bulbs',
      min: 1,
      max: 3,
      defaultValue: 2
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is a Series Circuit?',
          a: 'A connection where components are joined end-to-end in a single electrical loop.'
        },
        {
          q: 'Why do we need it?',
          a: 'To daisy chain components or add safety cutoffs (like fuses) that protect the entire line.'
        },
        {
          q: 'Where do we see it?',
          a: 'String lights, fuses, power switches, and stacked battery cells.'
        },
        {
          q: 'What happens if it changes?',
          a: 'If any single part of a series circuit breaks, all current flow stops completely.'
        }
      ]
    },
    applications: [
      {
        title: 'Safety Fuse',
        value: 'Series Wired',
        description: 'Connected in series with a circuit. If current spikes, the fuse burns open, protecting all other parts.'
      },
      {
        title: 'Battery Packs',
        value: 'Voltage Stacking',
        description: 'Connecting battery cells in series adds their voltage pressures together for a stronger push.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'If one bulb burns out on a classic string of Christmas tree lights, why does the entire string go dark?',
      answer: 'Because they are wired in series! Electricity must flow through each bulb filament to reach the next one. A burned-out filament creates a gap in the wire (an open switch), stopping the current flow for the entire string.'
    },
    nextSlug: 'parallel-circuit'
  },
  {
    id: 'parallel-circuit',
    name: 'Parallel Circuit',
    slug: 'parallel-circuit',
    category: 'Electrical Basics',
    description: 'Multiple paths for current flow.',
    mission: 'Explore the multi-path connection system.',
    learningTime: '4 min',
    difficulty: 'Beginner',
    unit: 'Connection',
    symbol: 'Parallel',
    prerequisites: ['series-circuit'],
    learningOutcomes: ['What is a parallel branch', 'Multiple paths', 'Parallel safety'],
    specs: [
      { label: 'Paths', value: 'Multiple Paths' },
      { label: 'Current Rule', value: 'Shared among paths' },
      { label: 'Voltage Rule', value: 'Same across all paths' }
    ],
    analogy: {
      title: 'Parallel Highway Lanes',
      description: 'Imagine a toll station on a highway with four parallel lanes. If one lane closes down, cars can still pass through the other three open lanes. A parallel circuit is the same. It provides multiple independent paths. If one path breaks, others keep flowing.'
    },
    explore: {
      title: 'Breaking Parallel Branches',
      description: 'Turn the switch ON to power both bulbs. Click "Break Bulb 1". Notice how Bulb 2 remains brightly lit because it has its own direct loop to the battery.'
    },
    simulatorConfig: {
      type: 'parallel',
      label: 'Active Branches',
      min: 1,
      max: 3,
      defaultValue: 2
    },
    understand: {
      title: 'Four Key Questions',
      questions: [
        {
          q: 'What is a Parallel Circuit?',
          a: 'A connection where components are connected across the same two points, creating multiple paths.'
        },
        {
          q: 'Why do we need it?',
          a: 'It ensures that turning off or breaking one appliance does not cut power to others.'
        },
        {
          q: 'Where do we see it?',
          a: 'All household wiring, car headlights, and power strips.'
        },
        {
          q: 'What happens if it changes?',
          a: 'Adding more parallel branches decreases total resistance, drawing more current from the battery.'
        }
      ]
    },
    applications: [
      {
        title: 'Household Outlets',
        value: 'Parallel Wired',
        description: 'All wall outlets receive a constant 110V/230V, letting you plug in devices independently.'
      },
      {
        title: 'Car Headlights',
        value: 'Branch Safety',
        description: 'Wired in parallel so if your left headlight burns out at night, the right one remains lit.'
      }
    ],
    challenge: {
      title: 'Real Life Challenge',
      question: 'If household appliances are powered by the same main line, why doesn’t turning off a light turn off your TV?',
      answer: 'Because all household appliances are wired in parallel! Each outlet and light fixture acts as a separate branch loop connected to the main panel. Breaking the path in the light switch branch doesn’t disrupt the TV’s branch.'
    },
    nextSlug: 'resistor'
  }
];
