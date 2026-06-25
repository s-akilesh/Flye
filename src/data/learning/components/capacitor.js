export const capacitorData = {
  name: 'Electrolytic Capacitor',
  slug: 'electrolytic-capacitor',
  category: 'Passive Components',
  description: 'An energy-storage component that utilizes a conductive liquid electrolyte to achieve a much higher capacitance than standard ceramic or film capacitors.',
  status: 'continue',
  symbolSvg: `
    <svg viewBox="0 0 40 60" width="40" height="60" stroke="currentColor" stroke-width="2.5" fill="none">
      <line x1="20" y1="5" x2="20" y2="25" />
      <line x1="10" y1="25" x2="30" y2="25" />
      <path d="M10,35 C15,32 25,32 30,35" />
      <line x1="20" y1="34" x2="20" y2="55" />
      <text x="3" y="20" font-size="14" font-weight="bold" fill="currentColor">+</text>
    </svg>
  `,
  specs: [
    { label: 'Category', value: 'Passive' },
    { label: 'Common Value', value: '10µF - 1000µF' },
    { label: 'Voltage Range', value: '6.3V - 450V' },
    { label: 'Polarity', value: 'Polarized (Has + and -)' }
  ],
  parts: [
    {
      id: 'can',
      name: 'Aluminum Can',
      offsetY: -160,
      description: 'The outer protective metal housing.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A cylindrical aluminum shell that encloses the capacitor roll, protecting the delicate internal foil, paper, and liquid electrolyte from drying out or getting damaged.'
        },
        {
          question: 'Why is it needed?',
          answer: 'The electrolyte is liquid or gel-like. The can hermetically seals the chemical compounds, preventing evaporation and containing any internal gas buildup.'
        },
        {
          question: 'Common mistakes',
          answer: 'Denting the can. Mechanical damage can cause the internal positive and negative layers to touch, creating a short circuit that will destroy the component.'
        }
      ]
    },
    {
      id: 'foil',
      name: 'Aluminum Foil',
      offsetY: -85,
      description: 'The rolled electrode sheets.',
      cards: [
        {
          question: 'What is it?',
          answer: 'Two long, thin sheets of high-purity aluminum foil rolled into a compact cylinder. These act as the metallic plates of the capacitor that carry electric charge.'
        },
        {
          question: 'How does it work?',
          answer: 'By etching the foil surface with microscopic pits, its surface area is increased up to 100 times. More surface area allows storing significantly more electrical charge.'
        },
        {
          question: 'What happens if removed?',
          answer: 'Without the conductive metal plates, there is no surface to hold electrical charges, reducing the capacitance of the component to zero.'
        }
      ]
    },
    {
      id: 'oxide',
      name: 'Oxide Layer',
      offsetY: -20,
      description: 'The dielectric insulating film.',
      cards: [
        {
          question: 'What is it?',
          answer: 'An extremely thin layer of Aluminum Oxide (Al₂O₃) grown chemically on the positive aluminum foil. It acts as the "dielectric" insulator.'
        },
        {
          question: 'Why is it needed?',
          answer: 'It keeps the charge-carrying plates from touching while allowing them to get incredibly close. The closer the charges, the stronger the storage capacity.'
        },
        {
          question: 'How thin is it?',
          answer: 'It is microscopic—less than 1 micron thick! This extreme thinness is the secret behind the massive storage capacity of electrolytic capacitors.'
        }
      ]
    },
    {
      id: 'electrolyte',
      name: 'Electrolyte',
      offsetY: 35,
      description: 'The conductive liquid/gel paper.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A liquid or gel electrolyte soaked into a paper separator. It acts as the actual cathode (negative plate) of the capacitor, making full contact with the oxide layer.'
        },
        {
          question: 'Why is it needed?',
          answer: 'Since the oxide layer is rough, solid metal foil cannot make perfect contact with it. The liquid electrolyte conforms to every microscopic pit, maximizing contact area.'
        },
        {
          question: 'What happens if it dries?',
          answer: 'Over many years or at high temperatures, the liquid electrolyte slowly dries out. The contact area shrinks, causing the capacitance to drop and the capacitor to fail.'
        }
      ]
    },
    {
      id: 'seal',
      name: 'Rubber Seal',
      offsetY: 90,
      description: 'The bottom insulating plug.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A rubber plug inserted at the bottom of the aluminum can. It seals the open end of the cylinder while keeping the positive and negative leads separated.'
        },
        {
          question: 'Why is it needed?',
          answer: 'It prevents the liquid electrolyte from leaking out. It also acts as an insulator, ensuring the two metal leads do not short-circuit against the outer can.'
        },
        {
          question: 'Common mistakes',
          answer: 'Subjecting the capacitor to extreme temperatures. Excess heat degrades the rubber, causing it to harden, crack, leak, or pop out due to gas pressure.'
        }
      ]
    },
    {
      id: 'leads',
      name: 'Metal Leads',
      offsetY: 155,
      description: 'Connecting pins (positive & negative).',
      cards: [
        {
          question: 'What is it?',
          answer: 'Two tinned copper wires connected to the internal foil layers. The longer lead is the positive terminal (anode), while the shorter lead is the negative terminal (cathode).'
        },
        {
          question: 'Why is it needed?',
          answer: 'They connect the internal rolled plates to the outside circuit board. They are the electrical terminals of the component.'
        },
        {
          question: 'How do I identify polarity?',
          answer: 'The positive lead is longer. Also, the capacitor body has a vertical stripe (usually light gray with "-" symbols) printed on the side pointing to the negative lead.'
        }
      ]
    }
  ],
  defaultCards: [
    {
      question: 'What is it?',
      answer: 'An electrolytic capacitor is a passive component that stores electrical charge. It acts like a tiny, high-speed reservoir that can release energy instantly.'
    },
    {
      question: 'Why is it needed?',
      answer: 'Power supplies are messy and fluctuate. Capacitors absorb these sudden voltage spikes and fill in the dips, keeping the voltage stable for sensitive microchips.'
    },
    {
      question: 'What happens if removed?',
      answer: 'Without smoothing capacitors, circuits suffer from electrical noise, leading to microcontrollers resetting randomly or audio circuits generating loud hums.'
    },
    {
      question: 'How do I identify it?',
      answer: 'Look for a small cylinder with two legs. It will have its capacitance (in microfarads, e.g., 100µF), operating voltage (e.g., 25V), and a negative stripe (-) printed on the body.'
    },
    {
      question: 'Common beginner mistakes',
      answer: 'Connecting it backwards! Electrolytic capacitors are polarized. Reversing the voltage causes gases to build up inside, making the seal pop or causing a tiny explosion.'
    }
  ],
  applications: [
    {
      product: 'Phone Charger',
      role: 'Smoothing AC Noise',
      desc: 'Inside a charger, AC power from the wall is converted to DC. The capacitor smooths out the leftover ripples, delivering a clean 5V DC charge to protect your phone.'
    },
    {
      product: 'Motherboard',
      role: 'CPU Power Buffering',
      desc: 'Located next to the CPU. When the processor suddenly performs heavy calculations and draws massive current, these capacitors deliver bulk charge instantly to prevent system crashes.'
    },
    {
      product: 'Arduino',
      role: 'Voltage Dip Filter',
      desc: 'Placed across the power inputs. If a motor turns on and drags down the power rails, the capacitor releases stored charge to keep the microcontroller running continuously.'
    },
    {
      product: 'Audio Amplifier',
      role: 'Audio Coupling & Decoupling',
      desc: 'Blocks raw DC voltages while letting the AC audio signal pass through to the speaker, preventing a loud, constant hum and protecting the speaker coils.'
    }
  ],
  quickSummary: [
    'Stores electrical energy chemically in an electrostatic field',
    'Filters and smooths voltage fluctuations in power circuits',
    'Blocks Direct Current (DC) while passing Alternating Current (AC) signals',
    'Polarized: Must connect positive and negative leads correctly to avoid explosion'
  ]
};
