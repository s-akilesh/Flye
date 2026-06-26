export const capacitorFamily = {
  id: 'capacitor',
  name: 'Capacitor',
  category: 'Passive Components',
  variants: [
    {
      name: 'Electrolytic Capacitor',
      slug: 'electrolytic-capacitor',
      category: 'Passive Components',
      description: 'A component that stores a large amount of electrical energy in a liquid. It has a positive and a negative side.',
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
        { label: 'Voltage Range', value: '10V - 450V' },
        { label: 'Polarity', value: 'Polarized (Has + and -)' }
      ],
      parts: [
        {
          id: 'can',
          name: 'Aluminum Can',
          description: 'The outer protective metal shell. It covers the inside parts to keep them safe and dry.',
          connectorY: 90,
          labelSide: 'left',
          labelY: 90,
          visual: {
            width: '64px',
            height: '70px',
            borderRadius: '8px 8px 0 0',
            background: 'linear-gradient(90deg, #475569 0%, #cbd5e1 50%, #64748b 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            assembledY: -80,
            explodedY: -190,
            zIndex: 6,
            type: 'can'
          },
          cards: [
            {
              question: 'What is it?',
              answer: 'A metal cup that covers the inside parts to stop the liquid from drying out.'
            },
            {
              question: 'Why is it needed?',
              answer: 'It keeps the chemical gel inside safe and seals it tightly.'
            }
          ]
        },
        {
          id: 'foil',
          name: 'Aluminum Foil',
          description: 'Long sheets of thin metal rolled up inside. They hold the electrical charges.',
          connectorY: 150,
          labelSide: 'right',
          labelY: 150,
          visual: {
            width: '56px',
            height: '40px',
            background: 'repeating-linear-gradient(45deg, #94a3b8, #94a3b8 2px, #64748b 2px, #64748b 4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            assembledY: -55,
            explodedY: -115,
            zIndex: 5,
            type: 'block'
          },
          cards: [
            {
              question: 'What is it?',
              answer: 'Thin metal sheets rolled up like a sleeping bag. They hold electrical charges on their surface.'
            },
            {
              question: 'How does it help?',
              answer: 'By rolling them tightly, we fit a huge metal surface into a tiny space. More surface area means more charge storage!'
            }
          ]
        },
        {
          id: 'oxide',
          name: 'Oxide Layer',
          description: 'A microscopic rust layer on the metal foil. It acts as an insulator so charges do not touch.',
          connectorY: 210,
          labelSide: 'left',
          labelY: 210,
          visual: {
            width: '58px',
            height: '14px',
            background: 'rgba(139, 92, 246, 0.4)',
            border: '1.5px solid var(--accent-violet)',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
            assembledY: -35,
            explodedY: -55,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            {
              question: 'What is it?',
              answer: 'An extremely thin insulating film grown chemically on the positive aluminum sheet.'
            },
            {
              question: 'Why is it needed?',
              answer: 'It acts as a barrier that stops electricity from crossing between the metal plates while keeping them very close.'
            }
          ]
        },
        {
          id: 'electrolyte',
          name: 'Electrolyte Gel',
          description: 'A wet chemical gel. It makes perfect contact inside to help store more energy.',
          connectorY: 270,
          labelSide: 'right',
          labelY: 270,
          visual: {
            width: '54px',
            height: '40px',
            background: 'linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #d97706 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            assembledY: -15,
            explodedY: 5,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            {
              question: 'What is it?',
              answer: 'A liquid or gel soaked into paper separators that behaves as the negative terminal plate.'
            },
            {
              question: 'Why liquid?',
              answer: 'A solid metal plate cannot touch every rough spot of the oxide layer. The liquid flows into every tiny hole to maximize contact.'
            }
          ]
        },
        {
          id: 'seal',
          name: 'Rubber Seal',
          description: 'A black rubber plug at the bottom. It stops the gel from leaking out.',
          connectorY: 330,
          labelSide: 'left',
          labelY: 330,
          visual: {
            width: '60px',
            height: '24px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            assembledY: 10,
            explodedY: 75,
            zIndex: 2,
            type: 'seal'
          },
          cards: [
            {
              question: 'What is it?',
              answer: 'A rubber plug inserted at the bottom of the can.'
            },
            {
              question: 'Why is it needed?',
              answer: 'It seals the can so the liquid gel cannot dry out or leak. It also keeps the two metal legs apart.'
            }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'The two metal legs. The long leg is positive (+), and the short leg is negative (-).',
          connectorY: 390,
          labelSide: 'right',
          labelY: 390,
          visual: {
            width: '40px',
            height: '70px',
            assembledY: 45,
            explodedY: 150,
            zIndex: 1,
            type: 'leads'
          },
          cards: [
            {
              question: 'What is it?',
              answer: 'Two copper wires connected to the internal foil layers.'
            },
            {
              question: 'How to find polarity?',
              answer: 'The long leg is positive. The capacitor body also has a gray band with minus (-) signs pointing to the negative leg.'
            }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'It is a passive component that stores electrical energy. It acts like a tiny water tank that fills and empties instantly.'
        },
        {
          question: 'Why is it needed?',
          answer: 'Electricity from wall outlets fluctuates. This capacitor smooths out the dips and spikes to keep the voltage steady.'
        },
        {
          question: 'What happens if removed?',
          answer: 'Circuits will get noisy. Microcontrollers might reset randomly, and speakers will make a loud hum.'
        }
      ],
      applications: [
        { id: 'phone-charger', role: 'Smoothing Power', desc: 'Smoothes electrical ripples. It makes the voltage steady before charging your phone.' },
        { id: 'motherboard', role: 'CPU Stabilizer', desc: 'Extra power reservoir. It gives quick energy to the computer brain so it does not crash.' },
        { id: 'arduino', role: 'Voltage Dip Filter', desc: 'Power helper. It keeps the board running smoothly when motors draw too much power.' },
        { id: 'amplifier', role: 'Sound Filter', desc: 'Sound filter. It blocks static hums so your music sounds clean.' }
      ],
      quickSummary: [
        'Acts like a tiny battery that charges and discharges instantly.',
        'Makes messy voltages steady and clean.',
        'Polarized: Must connect positive and negative legs correctly.'
      ],
      commonMistakes: [
        {
          question: 'Connecting it backwards',
          answer: 'Reversing positive and negative makes the capacitor overheat, leak, or pop. Always verify the negative stripe!'
        }
      ]
    },
    {
      name: 'Ceramic Capacitor',
      slug: 'ceramic-capacitor',
      category: 'Passive Components',
      description: 'A small, round capacitor made of ceramic. It stores a tiny amount of energy and can be connected in any direction.',
      status: 'new',
      symbolSvg: `
        <svg viewBox="0 0 40 60" width="40" height="60" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="20" y1="5" x2="20" y2="25" />
          <line x1="10" y1="25" x2="30" y2="25" />
          <line x1="10" y1="35" x2="30" y2="35" />
          <line x1="20" y1="35" x2="20" y2="55" />
        </svg>
      `,
      specs: [
        { label: 'Category', value: 'Passive' },
        { label: 'Common Value', value: '10pF - 100nF' },
        { label: 'Voltage Range', value: '16V - 1000V' },
        { label: 'Polarity', value: 'Non-polarized (No + or -)' }
      ],
      parts: [
        {
          id: 'coating',
          name: 'Epoxy Coating',
          description: 'The outer protective orange casing. It acts like a shield.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '64px',
            height: '64px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            assembledY: -50,
            explodedY: -150,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The orange plastic coating on the outside.' },
            { question: 'What is its job?', answer: 'It protects the ceramic disk inside from dust, dirt, and water.' }
          ]
        },
        {
          id: 'electrode',
          name: 'Silver Electrodes',
          description: 'Silver layers painted on both sides of the ceramic disk. They conduct charge.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '56px',
            height: '46px',
            borderRadius: '23px',
            background: 'linear-gradient(90deg, #94a3b8, #cbd5e1, #64748b)',
            border: '1px solid rgba(255,255,255,0.1)',
            assembledY: -35,
            explodedY: -70,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What are they?', answer: 'Thin silver coatings on the ceramic disk.' },
            { question: 'What is their job?', answer: 'They act as the two metal plates that hold the electrical charge.' }
          ]
        },
        {
          id: 'ceramic',
          name: 'Ceramic Disk',
          description: 'The ceramic material in the middle. It blocks electricity from crossing.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '48px',
            height: '38px',
            borderRadius: '19px',
            background: 'linear-gradient(135deg, #78716c 0%, #44403c 100%)',
            border: '1.5px dashed #a8a29e',
            assembledY: -20,
            explodedY: 10,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A tiny slice of ceramic placed between the silver layers.' },
            { question: 'What is its job?', answer: 'It acts as an insulator to block direct current while allowing signals to pass.' }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'Two identical legs. Since it is non-polarized, they can go either way.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '32px',
            height: '70px',
            assembledY: 30,
            explodedY: 110,
            zIndex: 1,
            type: 'leads_equal'
          },
          cards: [
            { question: 'What are they?', answer: 'Two equal-length copper legs.' },
            { question: 'Is polarity important?', answer: 'No! You can connect these legs in any direction. There is no positive or negative.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'A small capacitor that stores a tiny amount of electricity. It looks like a little orange bean with two legs.'
        },
        {
          question: 'Why is it used?',
          answer: 'It is very fast. It filters out high-speed electrical noise that can confuse microchips.'
        },
        {
          question: 'Does it have polarity?',
          answer: 'No! You can connect it in any direction. It will never pop if connected backwards.'
        }
      ],
      applications: [
        { id: 'television', role: 'Signal Filter', desc: 'Filters high-speed signals. It removes electrical noise from TV signals for a clear picture.' },
        { id: 'arduino', role: 'Noise Cleaner', desc: 'Cleans up electrical noise. Placed near microchips to filter out minor voltage ripples.' },
        { id: 'amplifier', role: 'Treble filter', desc: 'Tone helper. Allows high-pitch sounds to pass to speakers while blocking bass.' },
        { id: 'phone-charger', role: 'EMI filter', desc: 'Radio noise blocker. Prevents the charger from interfering with radio signals.' }
      ],
      quickSummary: [
        'Stores small amounts of charge extremely fast.',
        'Non-polarized: Can be connected in any direction.',
        'Filters out high-frequency noise and interference.'
      ],
      commonMistakes: [
        {
          question: 'Cracking the body',
          answer: 'Ceramic is brittle like glass. Bending the legs too hard can crack the body and break it. Handle with care!'
        }
      ]
    },
    {
      name: 'Paper Capacitor',
      slug: 'paper-capacitor',
      category: 'Passive Components',
      description: 'An older type of capacitor made of rolled paper. It is used in legacy equipment and high-voltage power supplies.',
      status: 'new',
      symbolSvg: `
        <svg viewBox="0 0 40 60" width="40" height="60" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="20" y1="5" x2="20" y2="25" />
          <line x1="10" y1="25" x2="30" y2="25" />
          <line x1="10" y1="35" x2="30" y2="35" />
          <line x1="20" y1="35" x2="20" y2="55" />
        </svg>
      `,
      specs: [
        { label: 'Category', value: 'Passive' },
        { label: 'Common Value', value: '1nF - 1µF' },
        { label: 'Voltage Range', value: '100V - 600V' },
        { label: 'Polarity', value: 'Non-polarized' }
      ],
      parts: [
        {
          id: 'case',
          name: 'Wax Case',
          description: 'The outer protective wax/plastic shell.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '80px',
            height: '40px',
            borderRadius: '4px',
            background: 'linear-gradient(180deg, #78350f, #451a03)',
            border: '1px solid rgba(255,255,255,0.1)',
            assembledY: -40,
            explodedY: -130,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The outer casing, usually made of wax-coated paper or plastic.' },
            { question: 'What is its job?', answer: 'It seals the inside layers and keeps out moisture, which ruins paper.' }
          ]
        },
        {
          id: 'foil',
          name: 'Rolled Foil',
          description: 'Rolled metal sheets that hold the electric charges.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '70px',
            height: '30px',
            background: 'repeating-linear-gradient(90deg, #94a3b8, #cbd5e1 5px)',
            assembledY: -25,
            explodedY: -50,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What are they?', answer: 'Two sheets of aluminum foil rolled into a tube.' },
            { question: 'What is their job?', answer: 'They carry the positive and negative electrical charges.' }
          ]
        },
        {
          id: 'paper',
          name: 'Oiled Paper',
          description: 'A paper strip soaked in oil. It acts as the dielectric insulator.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '74px',
            height: '14px',
            background: 'linear-gradient(90deg, #d97706, #f59e0b)',
            assembledY: -10,
            explodedY: 30,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'Kraft paper soaked in oil or wax.' },
            { question: 'Why oil?', answer: 'Dry paper is a poor insulator. Soaking it in oil makes it much better at blocking electricity.' }
          ]
        },
        {
          id: 'leads',
          name: 'Axial Leads',
          description: 'Wires extending from each end of the cylinder.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '90px',
            height: '10px',
            assembledY: 10,
            explodedY: 110,
            zIndex: 1,
            type: 'leads_axial'
          },
          cards: [
            { question: 'What are they?', answer: 'Metal legs coming out from the opposite ends of the cylinder.' },
            { question: 'How do you connect them?', answer: 'Since it is non-polarized, you can solder them either way.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'An old-style capacitor that uses paper soaked in oil to store electricity.'
        },
        {
          question: 'Where is it used?',
          answer: 'You will find it in vintage radios, tube amplifiers, and old machinery.'
        },
        {
          question: 'Does it wear out?',
          answer: 'Yes! The paper absorbs moisture over decades, causing it to fail. Modern circuits use plastic film instead.'
        }
      ],
      applications: [
        { id: 'amplifier', role: 'Vintage Tuning', desc: 'Signal coupling. Passes audio signals between amplifier stages in old radios.' },
        { id: 'television', role: 'Mains Filter', desc: 'Absorbs high-voltage spikes in industrial machines and old tube equipment.' },
        { id: 'arduino', role: 'Motor Starter', desc: 'Helps kick-start old electric fan motors.' }
      ],
      quickSummary: [
        'Used in vintage electronics and heavy duty applications.',
        'Insulated with paper soaked in oil or wax.',
        'Vulnerable to aging and moisture absorption.'
      ],
      commonMistakes: [
        {
          question: 'Using old paper capacitors',
          answer: 'Old paper capacitors are leaky. Always replace them with modern film capacitors when restoring vintage equipment!'
        }
      ]
    },
    {
      name: 'Polyester Capacitor',
      slug: 'polyester-capacitor',
      category: 'Passive Components',
      description: 'A reliable capacitor made of polyester plastic film. It is highly stable and used in audio circuits.',
      status: 'new',
      symbolSvg: `
        <svg viewBox="0 0 40 60" width="40" height="60" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="20" y1="5" x2="20" y2="25" />
          <line x1="10" y1="25" x2="30" y2="25" />
          <line x1="10" y1="35" x2="30" y2="35" />
          <line x1="20" y1="35" x2="20" y2="55" />
        </svg>
      `,
      specs: [
        { label: 'Category', value: 'Passive' },
        { label: 'Common Value', value: '1nF - 10µF' },
        { label: 'Voltage Range', value: '50V - 1000V' },
        { label: 'Polarity', value: 'Non-polarized' }
      ],
      parts: [
        {
          id: 'case',
          name: 'Plastic Case',
          description: 'A hard, colorful plastic box that protects the inside.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '64px',
            height: '50px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            assembledY: -50,
            explodedY: -130,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The outer box shell, usually green, red, or yellow.' },
            { question: 'What is its job?', answer: 'It keeps the plastic layers safe from humidity and physical impacts.' }
          ]
        },
        {
          id: 'film',
          name: 'Polyester Film',
          description: 'Thin sheets of plastic acting as the dielectric insulator.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '54px',
            height: '30px',
            background: 'rgba(59, 130, 246, 0.3)',
            border: '1.5px solid var(--accent-blue)',
            assembledY: -30,
            explodedY: -50,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'An ultra-thin roll of polyester plastic film.' },
            { question: 'What is its job?', answer: 'It is the insulator that blocks electricity from passing directly.' }
          ]
        },
        {
          id: 'metal',
          name: 'Metal Layers',
          description: 'Thin metal coating on the plastic sheets to hold charges.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '50px',
            height: '10px',
            background: '#e2e8f0',
            assembledY: -15,
            explodedY: 30,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What are they?', answer: 'Aluminum layers sprayed directly onto the plastic film.' },
            { question: 'What is their job?', answer: 'They act as the electrode plates that store electrical charge.' }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'Two pins at the bottom for circuit board mounting.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '32px',
            height: '50px',
            assembledY: 25,
            explodedY: 100,
            zIndex: 1,
            type: 'leads_equal'
          },
          cards: [
            { question: 'What are they?', answer: 'Two wires extending from the metal layers.' },
            { question: 'Is direction important?', answer: 'No! Solder it in any direction you like.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'A capacitor made of thin plastic film sheets coated in metal. It is highly stable and reliable.'
        },
        {
          question: 'Where is it used?',
          answer: 'It is highly popular in audio amplifiers, power filters, and tone shaping circuits.'
        },
        {
          question: 'Why is it preferred over ceramic?',
          answer: 'It handles much higher voltages and is very stable, meaning its capacitance does not change with temperature.'
        }
      ],
      applications: [
        { id: 'amplifier', role: 'Tone Control', desc: 'Tone shaper. Adjusts bass and treble output in speaker circuits.' },
        { id: 'phone-charger', role: 'AC filter', desc: 'AC filter. Blocks high-voltage spikes on electrical power lines.' },
        { id: 'television', role: 'Sound Filter', desc: 'Audio coupling. Passes clean audio signals while blocking raw DC voltages.' }
      ],
      quickSummary: [
        'Extremely stable and does not degrade easily over time.',
        'Non-polarized and handles high voltage well.',
        'Perfect for audio filtering and tone control.'
      ],
      commonMistakes: [
        {
          question: 'Overheating the film',
          answer: 'Since the insulator inside is made of plastic, keeping a hot soldering iron on the legs for too long will melt it!'
        }
      ]
    },
    {
      name: 'Tantalum Capacitor',
      slug: 'tantalum-capacitor',
      category: 'Passive Components',
      description: 'A specialized polarized capacitor. It packs high storage capacity into a tiny bead shape.',
      status: 'new',
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
        { label: 'Common Value', value: '0.1µF - 100µF' },
        { label: 'Voltage Range', value: '4V - 50V' },
        { label: 'Polarity', value: 'Polarized (Has marked + side)' }
      ],
      parts: [
        {
          id: 'bead',
          name: 'Resin Bead',
          description: 'The colored epoxy coating that covers the inside pellet.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '60px',
            height: '60px',
            borderRadius: '30px 30px 4px 4px',
            background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            assembledY: -50,
            explodedY: -130,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The yellow/orange hard epoxy droplet coating.' },
            { question: 'Why this shape?', answer: 'It is dipped in liquid epoxy resin to create a tiny, robust protective shell.' }
          ]
        },
        {
          id: 'pellet',
          name: 'Tantalum Pellet',
          description: 'A spongy block of tantalum metal serving as the anode.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '46px',
            height: '38px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
            assembledY: -35,
            explodedY: -50,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A spongy block of sintered tantalum metal powder.' },
            { question: 'Why is it spongy?', answer: 'The spongy texture creates a massive surface area in a tiny space, allowing high capacitance.' }
          ]
        },
        {
          id: 'oxide',
          name: 'Oxide Film',
          description: 'Tantalum pentoxide layer acting as an ultra-thin insulator.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '48px',
            height: '10px',
            background: 'rgba(16, 185, 129, 0.4)',
            border: '1.5px solid var(--accent-emerald)',
            assembledY: -20,
            explodedY: 30,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'A microscopic layer of rust grown on the tantalum pellet.' },
            { question: 'Why is it special?', answer: 'It is incredibly thin, allowing charges to sit very close together.' }
          ]
        },
        {
          id: 'leads',
          name: 'Metal Leads',
          description: 'Connecting legs. The positive leg is marked with a plus sign.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '40px',
            height: '60px',
            assembledY: 20,
            explodedY: 100,
            zIndex: 1,
            type: 'leads'
          },
          cards: [
            { question: 'How is polarity marked?', answer: 'Unlike electrolytic capacitors, the plus (+) side is explicitly marked with a stripe or plus symbol.' },
            { question: 'Is polarity critical?', answer: 'Yes! Tantalum is highly sensitive to reverse voltage.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'A high-performance polarized capacitor. It is very small but holds a lot of charge.'
        },
        {
          question: 'Where is it used?',
          answer: 'In laptops, smartphones, and medical equipment where space is tiny.'
        },
        {
          question: 'Why is it better than aluminum?',
          answer: 'It does not dry out over time and is much smaller for the same storage capacity.'
        }
      ],
      applications: [
        { id: 'motherboard', role: 'Laptop RAM buffer', desc: 'Compact buffer. Stabilizes voltage next to small laptop RAM sticks.' },
        { id: 'phone-charger', role: 'Phone Filter', desc: 'Voltage regulator. Smooths power inside smartphones.' },
        { id: 'arduino', role: 'Hearing Aid Filter', desc: 'Micro filter. Fits inside tiny hearing aid electronics.' }
      ],
      quickSummary: [
        'Compact and highly reliable for space-saving designs.',
        'Polarized: Must connect positive and negative correctly.',
        'Extremely low leakage: Holds charge for a long time.'
      ],
      commonMistakes: [
        {
          question: 'Connecting it backwards',
          answer: 'Warning! Tantalum capacitors can explode or catch fire instantly if connected backwards. Double-check the plus (+) mark!'
        }
      ]
    },
    {
      name: 'Variable Capacitor',
      slug: 'variable-capacitor',
      category: 'Passive Components',
      description: 'A capacitor whose storage capacity can be adjusted by turning a knob. It is used to tune radios.',
      status: 'new',
      symbolSvg: `
        <svg viewBox="0 0 40 60" width="40" height="60" stroke="currentColor" stroke-width="2.5" fill="none">
          <line x1="20" y1="5" x2="20" y2="25" />
          <line x1="10" y1="25" x2="30" y2="25" />
          <line x1="10" y1="35" x2="30" y2="35" />
          <line x1="20" y1="35" x2="20" y2="55" />
          <line x1="5" y1="45" x2="35" y2="15" />
          <polygon points="35,15 30,15 35,20" fill="currentColor" />
        </svg>
      `,
      specs: [
        { label: 'Category', value: 'Passive' },
        { label: 'Common Value', value: '10pF - 500pF' },
        { label: 'Voltage Range', value: '10V - 200V' },
        { label: 'Polarity', value: 'Non-polarized' }
      ],
      parts: [
        {
          id: 'knob',
          name: 'Turning Shaft',
          description: 'A metal pin that you turn to change the capacitance value.',
          connectorY: 100,
          labelSide: 'left',
          labelY: 100,
          visual: {
            width: '24px',
            height: '30px',
            borderRadius: '12px 12px 0 0',
            background: 'linear-gradient(90deg, #94a3b8, #cbd5e1, #475569)',
            border: '1px solid rgba(255,255,255,0.2)',
            assembledY: -65,
            explodedY: -140,
            zIndex: 4,
            type: 'block'
          },
          cards: [
            { question: 'What is it?', answer: 'The metal rod or knob at the top.' },
            { question: 'What is its job?', answer: 'You turn it to rotate the metal plates, changing how much charge is stored.' }
          ]
        },
        {
          id: 'rotor',
          name: 'Rotor Plates',
          description: 'Moving metal plates that rotate when you turn the shaft.',
          connectorY: 170,
          labelSide: 'right',
          labelY: 170,
          visual: {
            width: '60px',
            height: '30px',
            borderRadius: '15px 15px 0 0',
            background: 'linear-gradient(90deg, #38bdf8, #bae6fd)',
            border: '1px solid rgba(255,255,255,0.1)',
            assembledY: -40,
            explodedY: -70,
            zIndex: 3,
            type: 'block'
          },
          cards: [
            { question: 'What are they?', answer: 'Metal plates connected to the shaft.' },
            { question: 'Why do they move?', answer: 'Rotating them changes how much they overlap with the stationary plates below.' }
          ]
        },
        {
          id: 'stator',
          name: 'Stator Plates',
          description: 'Stationary metal plates that remain fixed in place.',
          connectorY: 240,
          labelSide: 'left',
          labelY: 240,
          visual: {
            width: '64px',
            height: '30px',
            borderRadius: '32px 32px 0 0',
            background: 'linear-gradient(90deg, #475569, #94a3b8)',
            assembledY: -20,
            explodedY: 10,
            zIndex: 2,
            type: 'block'
          },
          cards: [
            { question: 'What are they?', answer: 'Fixed metal plates that do not move.' },
            { question: 'What is their job?', answer: 'They act as the opposite electrical plate. The air gaps between these and the rotor plates store energy.' }
          ]
        },
        {
          id: 'leads',
          name: 'Terminals',
          description: 'Solder tabs to connect it to the radio circuit.',
          connectorY: 320,
          labelSide: 'right',
          labelY: 320,
          visual: {
            width: '50px',
            height: '24px',
            assembledY: 15,
            explodedY: 90,
            zIndex: 1,
            type: 'leads_equal'
          },
          cards: [
            { question: 'Where are they?', answer: 'Solder tabs at the base.' },
            { question: 'How do you wire them?', answer: 'Connect one to the rotor contact and one to the stator contact.' }
          ]
        }
      ],
      defaultCards: [
        {
          question: 'What is it?',
          answer: 'A capacitor whose capacitance can be changed by turning a knob. It is like an adjustable electrical valve.'
        },
        {
          question: 'Where is it used?',
          answer: 'Inside older radio receivers to tune into different AM or FM radio stations.'
        },
        {
          question: 'How does turning it change the value?',
          answer: 'Turning the knob adjusts how much the moving plates overlap with the fixed plates. More overlap means more capacitance!'
        }
      ],
      applications: [
        { id: 'television', role: 'Radio Tuner', desc: 'Frequency tuner. Turn the dial to select different radio stations.' },
        { id: 'amplifier', role: 'Antenna Matcher', desc: 'Signal tuner. Tunes wireless antenna circuits for best reception.' },
        { id: 'phone-charger', role: 'Frequency adjust', desc: 'Sets the operating speed of timing oscillator circuits.' }
      ],
      quickSummary: [
        'Allows manual adjustment of capacitance.',
        'Used for radio station tuning and signal adjustments.',
        'Adjusts the overlap area between metal plates.'
      ],
      commonMistakes: [
        {
          question: 'Forcing past the stop point',
          answer: 'Turning the knob past its limit will bend the metal plates, causing them to touch and short-circuit the component.'
        }
      ]
    }
  ]
};
