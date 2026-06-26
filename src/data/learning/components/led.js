export const ledFamily = {
  id: 'led-diode',
  name: 'LED & Diode',
  category: 'Semiconductors',
  variants: [
    {
      name: 'Light Emitting Diode (LED)',
      slug: 'light-emitting-diode',
      category: 'Semiconductors',
      description: 'A semiconductor diode that lights up when current flows through it in one direction.',
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
        { label: 'Category', value: 'Semiconductor' },
        { label: 'Voltage Drop', value: '1.8V - 3.3V' },
        { label: 'Max Current', value: '20mA' },
        { label: 'Polarity', value: 'Polarized (Anode & Cathode)' }
      ],
      parts: [
        {
          id: 'dome',
          name: 'Epoxy Dome',
          description: 'The plastic lens that protects the chip and shapes the light.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '56px',
            height: '60px',
            borderRadius: '28px 28px 4px 4px',
            background: 'rgba(139, 92, 246, 0.25)',
            border: '1.5px solid var(--accent-violet)',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
            assembledY: -50,
            explodedY: -140,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The transparent colored plastic cap covering the internals.' },
            { question: 'Why is it domed?', answer: 'Its rounded top acts as a lens, focusing light so it shines brighter in one direction.' }
          ]
        },
        {
          id: 'chip',
          name: 'Semiconductor Chip',
          description: 'The silicon crystal that emits light when powered.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '12px',
            height: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: '1px solid rgba(255,255,255,0.2)',
            assembledY: -35,
            explodedY: -65,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A tiny crystal chip made of semiconductor material (like gallium).' },
            { question: 'How does it shine?', answer: 'When current passes through, electrons release energy as light. Changing the crystal material changes the color of the light!' }
          ]
        },
        {
          id: 'frame',
          name: 'Lead Frame',
          description: 'A small metal platform that holds the chip inside.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '42px',
            height: '24px',
            background: 'linear-gradient(90deg, #94a3b8, #cbd5e1, #64748b)',
            assembledY: -10,
            explodedY: 15,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'Two metal brackets holding the internal parts.' },
            { question: 'What is the cup?', answer: 'One side has a tiny reflecting cup. This holds the chip and reflects its light upwards.' }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'The metal legs. The positive leg is longer, and the negative leg has a flat side.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '40px',
            height: '70px',
            assembledY: 30,
            explodedY: 105,
            zIndex: 1,
            type: 'leads'
          },
          cards: [
            { question: 'How to find polarity?', answer: 'The positive leg (Anode) is longer. The negative leg (Cathode) is shorter, and the plastic casing has a flat edge on that side.' },
            { question: 'What happens if reversed?', answer: 'The LED blocks current and does not light up. It will not break unless the voltage is very high.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is an LED?',
          answer: 'A Light Emitting Diode. It is a tiny semiconductor bulb that converts electricity directly into light with almost no heat.'
        },
        {
          question: 'Why does it need a resistor?',
          answer: 'LEDs have no internal resistance. Connecting them directly to power lets current surge, burning out the tiny chip instantly.'
        },
        {
          question: 'Is direction important?',
          answer: 'Yes! Current must enter the positive leg (Anode) and leave the negative leg (Cathode) to light it up.'
        }
      ],
      applications: [
        { id: 'arduino', role: 'Status Indicator', desc: 'Onboard status indicator. Blinks pin 13 to show the board is running code.' },
        { id: 'phone-charger', role: 'Power Indicator', desc: 'Power indicator. Tells you when the charger is plugged in.' },
        { id: 'television', role: 'Screen Backlight', desc: 'Screen illumination. Hundreds of white LEDs light up pixels from behind.' }
      ],
      quickSummary: [
        'Converts electrical energy directly into light.',
        'Polarized: Must connect positive (longer leg) and negative correctly.',
        'Always requires a current-limiting resistor to protect the chip.'
      ],
      commonMistakes: [
        {
          question: 'No resistor connected',
          answer: 'Never connect an LED directly to a battery without a resistor. Excess current will burn it out in a fraction of a second!'
        }
      ]
    },
    {
      name: 'PN Junction Diode',
      slug: 'pn-junction-diode',
      category: 'Semiconductors',
      description: 'A component that acts as a one-way valve for electricity, letting current pass in one direction and blocking it in the other.',
      status: 'new',
      symbolSvg: `
        <svg viewBox="0 0 60 60" width="50" height="50" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="10" y1="30" x2="25" y2="30" />
          <polygon points="25,20 25,40 40,30" fill="none" />
          <line x1="40" y1="20" x2="40" y2="40" />
          <line x1="40" y1="30" x2="50" y2="30" />
        </svg>
      `,
      specs: [
        { label: 'Category', value: 'Semiconductor' },
        { label: 'Forward Voltage', value: '0.7V (Silicon)' },
        { label: 'Max Current', value: '1A - 3A' },
        { label: 'Polarity', value: 'Polarized (Has stripe on Cathode)' }
      ],
      parts: [
        {
          id: 'case',
          name: 'Plastic Body',
          description: 'Black cylindrical casing protecting the silicon junction.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '80px',
            height: '36px',
            borderRadius: '4px',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            assembledY: -35,
            explodedY: -120,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A cylindrical black plastic casing.' },
            { question: 'What is its job?', answer: 'It seals and protects the delicate silicon PN junction from physical damage.' }
          ]
        },
        {
          id: 'stripe',
          name: 'Cathode Stripe',
          description: 'A silver band marking the negative terminal (blocking side).',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '10px',
            height: '36px',
            background: '#94a3b8',
            assembledY: -35,
            explodedY: -60,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A painted silver band at one end of the black body.' },
            { question: 'What does it show?', answer: 'It marks the Cathode (negative side). This is the blocking wall. Current cannot enter from this side.' }
          ]
        },
        {
          id: 'junction',
          name: 'PN Junction',
          description: 'The silicon crystal junction that allows one-way flow.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '66px',
            height: '18px',
            background: 'linear-gradient(90deg, #3b82f6 50%, #ef4444 50%)',
            border: '1px solid rgba(255,255,255,0.1)',
            assembledY: -15,
            explodedY: 15,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A slice of silicon where positive (P) and negative (N) materials meet.' },
            { question: 'How does it control flow?', answer: 'Applying positive voltage to the P-side shrinks the barrier so current flows. Applying it to the N-side widens the barrier, blocking current completely.' }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'Connecting legs at both ends.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '90px',
            height: '8px',
            assembledY: 10,
            explodedY: 90,
            zIndex: 1,
            type: 'leads_axial'
          },
          cards: [
            { question: 'How do you connect them?', answer: 'The lead next to the silver stripe is the Cathode (negative). The other lead is the Anode (positive).' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is a diode?',
          answer: 'A component that acts as a one-way valve for electricity. It allows current to flow forward and blocks it from returning.'
        },
        {
          question: 'Why is it needed?',
          answer: 'It protects circuits. If a battery is connected backwards, the diode blocks the electricity, protecting expensive parts.'
        },
        {
          question: 'What is the silver stripe?',
          answer: 'The silver stripe marks the Cathode (negative side). Solder it pointing in the direction you want current to flow.'
        }
      ],
      applications: [
        { id: 'phone-charger', role: 'AC to DC Rectifier', desc: 'Power rectifier. Converts wall outlet AC voltage into clean DC voltage.' },
        { id: 'arduino', role: 'Reverse Protection', desc: 'Shield protector. Blocks power if the battery is connected backwards by mistake.' },
        { id: 'amplifier', role: 'Spike Protection', desc: 'Kickback blocker. Absorbs voltage spikes created by motors or relays.' }
      ],
      quickSummary: [
        'Acts as a one-way valve for electric current.',
        'Polarized: Silver band indicates the cathode (negative) side.',
        'Used for converting AC to DC and protecting circuits.'
      ],
      commonMistakes: [
        {
          question: 'Connecting it backwards',
          answer: 'Putting a diode in backwards blocks the entire circuit, stopping it from receiving any electricity. Check the silver stripe!'
        }
      ]
    }
  ]
};
