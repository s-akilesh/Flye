export const resistorData = {
  name: 'Fixed Resistor',
  slug: 'fixed-resistor',
  category: 'Passive Components',
  description: 'A fundamental passive component designed to resist the flow of electrical current, allowing precise regulation of current levels and voltage drops in a circuit.',
  status: 'completed',
  symbolSvg: `
    <svg viewBox="0 0 80 40" width="60" height="40" stroke="currentColor" stroke-width="2.5" fill="none">
      <line x1="5" y1="20" x2="25" y2="20" />
      <polyline points="25,20 29,10 35,30 41,10 47,30 51,20" />
      <line x1="51" y1="20" x2="75" y2="20" />
    </svg>
  `,
  specs: [
    { label: 'Category', value: 'Passive' },
    { label: 'Common Value', value: '10Ω - 1MΩ' },
    { label: 'Tolerance', value: '±1%, ±5%' },
    { label: 'Polarity', value: 'Non-polarized' }
  ],
  parts: [
    {
      id: 'body',
      name: 'Ceramic Body',
      offsetY: -30,
      description: 'The structural core of the resistor.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A solid ceramic rod that provides the structural base of the resistor. It is a highly effective heat-resistant electrical insulator.'
        }
      ]
    },
    {
      id: 'film',
      name: 'Resistive Film',
      offsetY: 0,
      description: 'The material that limits current.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A thin carbon or metal film deposited on the ceramic rod. A helical groove is cut into it to determine the exact resistance path length.'
        }
      ]
    },
    {
      id: 'bands',
      name: 'Color Bands',
      offsetY: 30,
      description: 'Standard value markings.',
      cards: [
        {
          question: 'What is it?',
          answer: 'Color-coded bands printed on the outer body. They indicate the resistance value, multiplier, and tolerance percentage.'
        }
      ]
    }
  ],
  defaultCards: [
    {
      question: 'What is it?',
      answer: 'A resistor is a passive component that limits current flow. Think of it like a squeeze in a water hose slowing down water flow.'
    },
    {
      question: 'Why is it needed?',
      answer: 'Components like LEDs can only handle small currents. Resistors absorb excess voltage, limiting current to safe operating levels.'
    },
    {
      question: 'What happens if removed?',
      answer: 'Removing it leaves either an open circuit (no electricity flows) or a short circuit (unrestricted current burns out parts).'
    }
  ],
  applications: [
    {
      product: 'LED Circuit',
      role: 'Current Limiter',
      desc: 'Placed in series with an LED. It prevents the LED from drawing too much current from a battery, which would instantly burn it out.'
    },
    {
      product: 'Arduino Pins',
      role: 'Pull-up Resistor',
      desc: 'Connected between a microchip pin and 5V. It holds the input at a stable HIGH state when a button is not pressed, preventing floating noise.'
    }
  ],
  quickSummary: [
    'Resists electric current, regulating current flow levels',
    'Generates a voltage drop across itself following Ohm’s Law (V = I * R)',
    'Non-polarized: Can be soldered in any direction in a circuit',
    'Converts excess electrical energy into heat'
  ]
};
