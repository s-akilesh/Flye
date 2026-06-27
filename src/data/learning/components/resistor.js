export const resistorFamily = {
  id: 'resistor',
  name: 'Resistor',
  category: 'Passive Components',
  variants: [
    {
      name: 'Fixed Resistor',
      slug: 'fixed-resistor',
      category: 'Passive Components',
      description: 'A component that resists the flow of electricity by a fixed, unchanging amount.',
      status: 'completed',
      mission: 'Learn how resistors limit current and divide voltage.',
      prerequisites: ['electricity-basics'],
      learningOutcomes: ['What is a resistor', 'How to read color bands', "Ohm's Law basics"],
      typicalValue: '1kΩ',
      polarity: 'Non-polarized',
      difficulty: 'Beginner',
      learningTime: '5 min',
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
        { label: 'Tolerance', value: '±1% or ±5%' },
        { label: 'Polarity', value: 'Non-polarized' }
      ],
      parts: [
        {
          id: 'body',
          name: 'Ceramic Body',
          description: 'A heat-resistant ceramic cylinder that supports the resistive material.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '74px',
            height: '38px',
            borderRadius: '6px',
            background: 'linear-gradient(90deg, #d8b4fe 0%, #a855f7 50%, #7e22ce 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            assembledY: -50,
            explodedY: -130,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The hard ceramic rod in the center of the resistor.' },
            { question: 'Why ceramic?', answer: 'Ceramic resists electricity completely and handles heat without melting.' }
          ]
        },
        {
          id: 'film',
          name: 'Resistive Film',
          description: 'A thin coating of carbon or metal that limits the current.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '58px',
            height: '18px',
            background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 2px, #475569 2px, #475569 4px)',
            assembledY: -30,
            explodedY: -60,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A thin layer of carbon or metal film sprayed onto the ceramic rod.' },
            { question: 'How does it block current?', answer: 'A spiral cut is carved into this layer, forcing electricity to travel a longer, narrower path to slow down.' }
          ]
        },
        {
          id: 'bands',
          name: 'Color Bands',
          description: 'Stripes printed on the body to show the resistance value.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '62px',
            height: '10px',
            background: 'linear-gradient(90deg, #ef4444 0%, #3b82f6 50%, #f59e0b 100%)',
            assembledY: -15,
            explodedY: 20,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What are they?', answer: 'Standard color stripes printed on the outside coating.' },
            { question: 'What do they mean?', answer: 'Each color represents a number. Engineers read them to find the resistor value in ohms.' }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'Connecting pins that let it join the circuit in any direction.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '90px',
            height: '8px',
            assembledY: 10,
            explodedY: 100,
            zIndex: 1,
            type: 'leads_axial'
          },
          cards: [
            { question: 'What are they?', answer: 'Tinned copper legs extending from the end caps.' },
            { question: 'How do you solder them?', answer: 'Resistors have no positive or negative leads. You can connect them either way!' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'A resistor is a component that limits current flow. Think of it like a squeeze in a water hose slowing down water flow.'
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
        { id: 'arduino', role: 'LED Protection', desc: 'LED protector. Limits current to protect LEDs from burning out.' },
        { id: 'phone-charger', role: 'Pull-up Resistor', desc: 'Voltage guide. Holds signal pins at a stable HIGH state when not pressed.' },
        { id: 'amplifier', role: 'Voltage Divider', desc: 'Voltage splitter. Divides a larger voltage into smaller values.' }
      ],
      quickSummary: [
        'Resists electric current, regulating current flow levels.',
        'Generates a voltage drop across itself following Ohm’s Law (V = I * R).',
        'Non-polarized: Can be soldered in any direction in a circuit.'
      ],
      commonMistakes: [
        {
          question: 'Choosing wrong wattage',
          answer: 'Resistors turn electrical friction into heat. Using a low-wattage resistor in a high-power circuit makes it burn up and smell like smoke!'
        }
      ]
    },
    {
      name: 'Variable Resistor',
      slug: 'variable-resistor',
      category: 'Passive Components',
      description: 'A resistor whose resistance can be adjusted by turning a dial. Commonly used as volume controls.',
      status: 'new',
      mission: 'Learn how to adjust resistance dynamically.',
      prerequisites: ['fixed-resistor'],
      learningOutcomes: ['How variable resistors work', 'Potentiometer basics', 'Controlling voltage output'],
      typicalValue: '10kΩ',
      polarity: 'Non-polarized',
      difficulty: 'Beginner',
      learningTime: '7 min',
      symbolSvg: `
        <svg viewBox="0 0 80 40" width="60" height="40" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="5" y1="20" x2="25" y2="20" />
          <polyline points="25,20 29,10 35,30 41,10 47,30 51,20" />
          <line x1="51" y1="20" x2="75" y2="20" />
          <line x1="38" y1="38" x2="38" y2="15" />
          <polygon points="38,15 34,22 42,22" fill="currentColor" />
        </svg>
      `,
      specs: [
        { label: 'Category', value: 'Passive' },
        { label: 'Common Value', value: '1kΩ - 100kΩ' },
        { label: 'Power Rating', value: '0.1W - 0.5W' },
        { label: 'Adjustment Type', value: 'Rotary Shaft' }
      ],
      parts: [
        {
          id: 'shaft',
          name: 'Turning Shaft',
          description: 'The knob you rotate to change the resistance.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '24px',
            height: '34px',
            borderRadius: '4px 4px 0 0',
            background: 'linear-gradient(90deg, #94a3b8, #cbd5e1, #64748b)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            assembledY: -65,
            explodedY: -140,
            zIndex: 5,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The metal rod that you turn with your fingers.' },
            { question: 'What is its job?', answer: 'It is connected to the wiper inside, moving it along the track when you rotate it.' }
          ]
        },
        {
          id: 'case',
          name: 'Metal Case',
          description: 'Metal cover protecting the internal track.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '64px',
            height: '40px',
            borderRadius: '32px 32px 4px 4px',
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            assembledY: -40,
            explodedY: -70,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The metal enclosure of the potentiometer.' },
            { question: 'What is its job?', answer: 'It shields the delicate resistive parts inside from dirt and static noise.' }
          ]
        },
        {
          id: 'track',
          name: 'Carbon Track',
          description: 'A horseshoe-shaped strip of resistive carbon inside.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '52px',
            height: '14px',
            borderRadius: '6px',
            background: 'linear-gradient(90deg, #090d16, #1e293b, #090d16)',
            assembledY: -15,
            explodedY: 5,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A curved strip coated in carbon.' },
            { question: 'What is its job?', answer: 'It creates a resistive path. The further the wiper travels along it, the higher the resistance.' }
          ]
        },
        {
          id: 'wiper',
          name: 'Wiper Contact',
          description: 'A sliding metal contact that moves along the track.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '18px',
            height: '24px',
            background: 'linear-gradient(90deg, #fbbf24, #d97706)',
            assembledY: -5,
            explodedY: 45,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A tiny sliding metal contact.' },
            { question: 'What is its job?', answer: 'It taps into the carbon track. Its position determines the output resistance.' }
          ]
        },
        {
          id: 'leads',
          name: 'Terminals',
          description: 'Three connecting pins (ends of the track, plus the moving wiper).',
          connectorY: 390,
          labelSide: 'left',
          labelY: 390,
          visual: {
            width: '46px',
            height: '30px',
            assembledY: 15,
            explodedY: 95,
            zIndex: 1,
            type: 'leads_potentiometer'
          },
          cards: [
            { question: 'Why three pins?', answer: 'The outer pins connect to the full track. The middle pin is connected to the moving wiper.' },
            { question: 'How is it used?', answer: 'To use it as a simple volume dial, connect one side to audio in, one to ground, and the middle pin to your output.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'An adjustable resistor. You can change its resistance manually by turning a shaft.'
        },
        {
          question: 'Why is it used?',
          answer: 'It lets users control things manually, like volume on a radio or the speed of a motor.'
        },
        {
          question: 'How does it work?',
          answer: 'Turning the knob slides a metal finger (wiper) along a resistive track, altering the resistance path length.'
        }
      ],
      applications: [
        { id: 'amplifier', role: 'Volume Control', desc: 'Volume dial. Adjusts the music level in headphones or speakers.' },
        { id: 'arduino', role: 'Brightness Dimmer', desc: 'Brightness control. Adjusts brightness of LED panels or screens.' },
        { id: 'television', role: 'Sensor input', desc: 'Position sensor. Detects how far you push joystick controller sticks.' }
      ],
      quickSummary: [
        'Provides adjustable resistance by turning a dial.',
        'Uses a sliding wiper contact on a resistive track.',
        'Usually has three pins: two fixed ends and one adjustable wiper.'
      ],
      commonMistakes: [
        {
          question: 'Wiring the wiper wrong',
          answer: 'Swapping the center wiper pin with an outer pin is very common. This makes the dial act as an on-off switch or work backwards!'
        }
      ]
    }
  ]
};
