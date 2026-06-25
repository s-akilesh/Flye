export const fundamentalsData = [
  {
    id: 'electricity-basics',
    title: 'What is Electricity?',
    description: 'Electricity is not a mysterious fluid; it is the movement of tiny charged particles called electrons through a conductor (like a copper wire). Think of it like water flowing through a pipe.',
    cards: [
      {
        question: 'What is it?',
        answer: 'Electricity is the flow of electric charge, usually carried by electrons moving through a material. It is a fundamental form of energy that powers our world.'
      },
      {
        question: 'Why is it needed?',
        answer: 'Without the movement of charge, we cannot transfer energy across distances. Electricity is the most efficient medium we have to transport and convert energy into light, heat, or motion.'
      },
      {
        question: 'How does it work?',
        answer: 'When a force (voltage) pushes electrons, they hop from atom to atom along a wire. This collective movement of millions of microscopic particles generates electrical power.'
      },
      {
        question: 'Real-life example',
        answer: 'A lightning bolt is electricity flowing through air to release built-up charge. In your phone, a battery pushes electrons through copper traces to power the processor.'
      }
    ]
  },
  {
    id: 'current-basics',
    title: 'How Current Flows',
    description: 'Current is the rate at which charge flows past a point. If you think of electricity as water, current is the volume of water flowing through the pipe per second.',
    cards: [
      {
        question: 'What is it?',
        answer: 'Current is the flow rate of electric charge. It is measured in Amperes (A) or Amps, representing the quantity of electrons passing by every second.'
      },
      {
        question: 'Why is it needed?',
        answer: 'Current is what actually does the physical work in a circuit—like heating up a filament in a bulb or spinning a coil in a motor. No current means no work is done.'
      },
      {
        question: 'Which way does it flow?',
        answer: 'By convention, current flows from Positive (+) to Negative (-). However, the actual physical electrons are negative and flow from Negative to Positive.'
      },
      {
        question: 'Common mistake',
        answer: 'Thinking that "more current" is always drawn. A power supply only *provides* current up to its limit; the circuit components *draw* only what they need.'
      }
    ]
  },
  {
    id: 'voltage-basics',
    title: 'Why Voltage Exists',
    description: 'Voltage is the push or pressure that makes charge move. In the water pipe analogy, voltage is the water pressure created by a pump or a high tank.',
    cards: [
      {
        question: 'What is it?',
        answer: 'Voltage is the electrical pressure difference between two points, measured in Volts (V). It represents the potential energy available to push electrons.'
      },
      {
        question: 'Why is it needed?',
        answer: 'Electrons are lazy and will not move on their own. Voltage provides the electrostatic force needed to overcome resistance and generate current flow.'
      },
      {
        question: 'How do we measure it?',
        answer: 'Voltage is always measured *across* two points (a difference), not through a single point. There must be a difference in potential for current to flow.'
      },
      {
        question: 'Real-life example',
        answer: 'A standard AA battery has a potential difference of 1.5V between its positive and negative terminals. This pressure pushes electrons when connected.'
      }
    ]
  },
  {
    id: 'resistance-basics',
    title: 'Understanding Resistance',
    description: 'Resistance is the opposition to current flow. In the water pipe analogy, resistance is like a narrow section of the pipe or a valve slowing down the water.',
    cards: [
      {
        question: 'What is it?',
        answer: 'Resistance is the friction that electrons encounter as they flow through a material. It is measured in Ohms (Ω) and regulates current flow.'
      },
      {
        question: 'Why is it needed?',
        answer: 'Without resistance, current would flow infinitely fast, causing short circuits and burning out power sources. Resistance lets us control current precisely.'
      },
      {
        question: 'What happens to the energy?',
        answer: 'When electrons collide inside a resistor, their kinetic energy is converted into heat. This is how electric heaters and toaster filaments work.'
      },
      {
        question: 'Common mistake',
        answer: 'Believing that materials are either perfect conductors or perfect insulators. All real materials have some resistance, even copper wires.'
      }
    ]
  },
  {
    id: 'capacitance-basics',
    title: 'Understanding Capacitance',
    description: 'Capacitance is the ability to store charge. Think of a capacitor like a small water tank with a flexible rubber membrane in the middle that stretches to store pressure.',
    cards: [
      {
        question: 'What is it?',
        answer: 'Capacitance is the capacity to store electric charge and potential energy in an electric field. It is measured in Farads (F).'
      },
      {
        question: 'Why is it needed?',
        answer: 'It acts like a tiny temporary battery that can absorb ripples in power supplies, block Direct Current (DC), and allow Alternating Current (AC) to pass.'
      },
      {
        question: 'How does it store charge?',
        answer: 'It holds opposite charges (+ and -) on two parallel conductive plates separated by an insulating gap. The attraction stores the charge.'
      },
      {
        question: 'Real-life example',
        answer: 'When you unplug a router, its status LED stays lit for a few seconds. That light is powered by energy draining from its capacitors.'
      }
    ]
  },
  {
    id: 'inductance-basics',
    title: 'Understanding Inductance',
    description: 'Inductance is the opposition to changes in current. In the water pipe analogy, inductance is like a heavy water wheel that takes time to spin up and spin down.',
    cards: [
      {
        question: 'What is it?',
        answer: 'Inductance is the ability of a coil of wire to store energy in a magnetic field when current flows through it. It is measured in Henries (H).'
      },
      {
        question: 'Why is it needed?',
        answer: 'Inductance resists sudden jumps or drops in current. This makes inductors excellent for filtering out high-frequency noise and stabilizing current.'
      },
      {
        question: 'How does it work?',
        answer: 'Flowing current creates a magnetic field. If the current tries to change, the magnetic field collapses or expands, fighting the change.'
      },
      {
        question: 'Real-life example',
        answer: 'Ignition coils in cars store magnetic energy and collapse it suddenly to create the high-voltage spark needed to ignite fuel.'
      }
    ]
  }
];
