export const ledData = {
  name: 'Light Emitting Diode (LED)',
  slug: 'light-emitting-diode',
  category: 'Semiconductors',
  description: 'A specialized semiconductor diode that emits light when an electric current flows through it in the correct direction (forward bias).',
  status: 'new',
  symbolSvg: `
    <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2.5" fill="none">
      <line x1="10" y1="30" x2="25" y2="30" />
      <polygon points="25,20 25,40 40,30" fill="none" />
      <line x1="40" y1="20" x2="40" y2="40" />
      <line x1="40" y1="30" x2="50" y2="30" />
      <line x1="28" y1="18" x2="20" y2="10" />
      <polygon points="20,10 24,10 20,14" fill="currentColor" />
      <line x1="38" y1="18" x2="30" y2="10" />
      <polygon points="30,10 34,10 30,14" fill="currentColor" />
    </svg>
  `,
  specs: [
    { label: 'Category', value: 'Semiconductors' },
    { label: 'Forward Voltage', value: '1.8V - 3.3V' },
    { label: 'Max Current', value: '20mA' },
    { label: 'Polarity', value: 'Polarized (Anode/Cathode)' }
  ],
  parts: [
    {
      id: 'lens',
      name: 'Epoxy Dome',
      offsetY: -35,
      description: 'Protective plastic lens.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A transparent epoxy casing that houses the semiconductor chip. Its domed shape acts as a lens to focus the emitted light.'
        }
      ]
    },
    {
      id: 'chip',
      name: 'Semiconductor Die',
      offsetY: 0,
      description: 'The light-generating core.',
      cards: [
        {
          question: 'What is it?',
          answer: 'A tiny crystal of semiconductor material (e.g. Gallium Arsenide). When electrons drop into holes across the P-N junction, they release energy as photons (light).'
        }
      ]
    },
    {
      id: 'frame',
      name: 'Lead Frame',
      offsetY: 35,
      description: 'Supports and electrical feeds.',
      cards: [
        {
          question: 'What is it?',
          answer: 'Two thick metal brackets. The anode post connects to the positive crystal side. The negative post contains a tiny reflector cup hosting the chip.'
        }
      ]
    }
  ],
  defaultCards: [
    {
      question: 'What is it?',
      answer: 'An LED is a semiconductor light source. It converts electrical energy directly into light with very high efficiency and minimal heat.'
    },
    {
      question: 'Why is it needed?',
      answer: 'LEDs provide visual feedback to users, indicating power state, transmit activity, or warnings without consuming much power.'
    },
    {
      question: 'Common beginner mistakes',
      answer: 'Connecting it directly to a battery without a resistor. LEDs have very little resistance. Direct connection lets current surge, burning out the chip in a split second.'
    }
  ],
  applications: [
    {
      product: 'Arduino Board',
      role: 'Pin 13 Indicator',
      desc: 'An onboard surface mount LED is connected to digital pin 13 to serve as a built-in debugging status indicator for developers.'
    },
    {
      product: 'TV Screen',
      role: 'Backlight Array',
      desc: 'Hundreds of bright white LEDs are arranged behind the LCD panel to provide uniform illumination for screen pixel coloring.'
    }
  ],
  quickSummary: [
    'Emits light when current flows in the forward direction (anode to cathode)',
    'Highly polarized: Will block current and not light up if connected backwards',
    'Extremely low internal resistance: Always requires a current-limiting resistor',
    'Energy-efficient: Lasts up to 50,000 hours'
  ]
};
