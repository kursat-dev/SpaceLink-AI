const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Message = require('./models/Message');

dotenv.config();

const seedUsers = [
  {
    name: 'Dr. Elias Vance',
    email: 'elias@orbital.tech',
    password: 'password123',
    role: 'Engineer',
    title: 'Senior Systems Architect, Orbital Logistics',
    bio: 'Specializing in the intersection of AI and satellite constellation management. 12+ years of experience building autonomous navigation protocols for LEO missions.',
    skills: ['AI/Machine Learning', 'Satellite Systems', 'Embedded Rust', 'Orbital Mechanics', 'Real-time OS', 'FPGA'],
    interests: ['Deep Space', 'Autonomous Systems', 'Swarm Robotics'],
    experienceLevel: 'Lead',
    location: 'Geneva, CH (Remote)',
    website: 'eliasvance.ai',
    isAvailable: true,
    isVerified: true,
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'French', level: 'C1 Level' },
      { name: 'German', level: 'B2 Level' }
    ],
    experience: [
      { title: 'Chief Architect', company: 'AstraComm Systems', description: 'Leading the software architecture for the Gen-3 StarLink competitors.', startYear: 2020, endYear: 2026, current: true },
      { title: 'Embedded Lead', company: 'Lunar Pioneers', description: 'Authored mission-critical safety software for autonomous lunar landers.', startYear: 2016, endYear: 2020 },
      { title: 'Research Fellow', company: 'ESA', description: 'Published 12 peer-reviewed papers on swarm robotics.', startYear: 2012, endYear: 2016 }
    ]
  },
  {
    name: 'Dr. Julia Vane',
    email: 'julia@propulsion.dev',
    password: 'password123',
    role: 'Engineer',
    title: 'Orbital Propulsion Architect',
    bio: 'Expert in low-power xenon propulsion systems with a focus on energy-efficient orbit transfers. Published researcher on Hall thruster optimization.',
    skills: ['Propulsion', 'Hall Thrusters', 'Xenon Systems', 'Orbit Transfer', 'Thermal Management'],
    interests: ['LEO Missions', 'Green Propulsion', 'Electric Propulsion'],
    experienceLevel: 'Senior',
    location: 'Munich, DE',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }, { name: 'German', level: 'Native' }],
    experience: [
      { title: 'Propulsion Lead', company: 'OHB SE', description: 'Designed next-gen electric propulsion for ESA missions.', startYear: 2018, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Lunar MeshNet',
    email: 'contact@meshnet.space',
    password: 'password123',
    role: 'Startup',
    title: 'Decentralized Lunar Communication Startup',
    bio: 'Building the infrastructure backbone for cislunar communication using mesh networking and deep-space signal processing.',
    skills: ['Infrastructure', 'Deep Space Comms', 'Mesh Networking', 'Signal Processing', 'Antenna Design'],
    interests: ['Lunar Economy', 'Communication Infrastructure', 'Cislunar Space'],
    experienceLevel: 'Mid-Level',
    location: 'Austin, TX',
    isAvailable: true,
    isVerified: false,
    languages: [{ name: 'English', level: 'Native' }],
    experience: [
      { title: 'Co-Founder & CTO', company: 'Lunar MeshNet', description: 'Leading R&D on decentralized communication protocols for lunar surface operations.', startYear: 2023, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@orbital-logistics.com',
    password: 'password123',
    role: 'Engineer',
    title: 'Lead Orbital Logistician',
    bio: 'Specialized in supply chain optimization for in-orbit assembly. Holds a patent for modular docking nodes for space stations.',
    skills: ['Supply Chain', 'Microgravity Fabrication', 'Docking Systems', 'Logistics', 'Project Management'],
    interests: ['In-Orbit Assembly', 'Space Stations', 'Modular Architecture'],
    experienceLevel: 'Lead',
    location: 'Houston, TX',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }, { name: 'Mandarin', level: 'Native' }],
    experience: [
      { title: 'Logistics Lead', company: 'Axiom Space', description: 'Managing orbital supply chain for commercial space station modules.', startYear: 2021, endYear: 2026, current: true },
      { title: 'Systems Engineer', company: 'NASA JSC', description: 'ISS cargo scheduling and rendezvous planning.', startYear: 2017, endYear: 2021 }
    ]
  },
  {
    name: 'Astra Dynamic Labs',
    email: 'hello@astradynamic.com',
    password: 'password123',
    role: 'Company',
    title: 'Satellite Deployment & Propulsion Company',
    bio: 'Seeking propulsion specialists for next-gen LEO satellite deployment missions. We build the buses; you shape the trajectory.',
    skills: ['Propulsion', 'LEO', 'Satellite Deployment', 'Systems Integration', 'Mission Planning'],
    interests: ['LEO Constellation', 'Satellite Services', 'Rideshare'],
    experienceLevel: 'Senior',
    location: 'Hawthorne, CA',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }],
    experience: [
      { title: 'Founded', company: 'Astra Dynamic Labs', description: 'Full-stack satellite deployment solutions for LEO and MEO customers.', startYear: 2019, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Global Horizon Corp',
    email: 'partnerships@globalhorizon.space',
    password: 'password123',
    role: 'Company',
    title: 'Orbital Mechanics Consulting',
    bio: 'Full-service orbital mechanics consultancy for lunar gateway logistics, trajectory planning, and mission assurance.',
    skills: ['Orbital Mechanics', 'Lunar Gateway', 'Trajectory Planning', 'Mission Assurance', 'Consulting'],
    interests: ['Lunar Economy', 'Gateway Operations', 'Deep Space Logistics'],
    experienceLevel: 'Executive',
    location: 'Washington, DC',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }],
    experience: []
  },
  {
    name: 'Nebula Ventures',
    email: 'invest@nebulavc.com',
    password: 'password123',
    role: 'Investor',
    title: 'Space-Tech Venture Capital',
    bio: 'Early-stage VC focusing on deep-tech space startups. $200M AUM. Backed 15+ launches. Looking for disruptive orbital infrastructure plays.',
    skills: ['Venture Capital', 'Due Diligence', 'Space Economy', 'Financial Modeling', 'Portfolio Management'],
    interests: ['Deep-Tech', 'Orbital Infrastructure', 'Satellite IoT', 'Launch Vehicles'],
    experienceLevel: 'Executive',
    location: 'San Francisco, CA',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }],
    experience: [
      { title: 'Managing Partner', company: 'Nebula Ventures', description: 'Leading space-tech investments across seed to Series B.', startYear: 2018, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Orbital Dynamics Capital',
    email: 'deals@orbdcap.com',
    password: 'password123',
    role: 'Investor',
    title: 'Growth-Stage Space Investment Fund',
    bio: 'Growth equity fund specializing in scaling space companies. Focus on satellite services, Earth observation, and in-space manufacturing.',
    skills: ['Growth Equity', 'Space Policy', 'Market Analysis', 'Strategic Advisory'],
    interests: ['Satellite Services', 'Earth Observation', 'In-Space Manufacturing', 'Space Policy'],
    experienceLevel: 'Executive',
    location: 'London, UK',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }, { name: 'French', level: 'B2 Level' }],
    experience: []
  },
  {
    name: 'Marcus Thorne',
    email: 'marcus@orbdynamics.com',
    password: 'password123',
    role: 'Engineer',
    title: 'CTO, Orbital Dynamics Corp',
    bio: 'Technical visionary with 15+ years in aerospace software. Led recruitment transformation using SpaceLink AI for Artemis III payload subsystems.',
    skills: ['Software Architecture', 'Payload Systems', 'AI/Machine Learning', 'Team Leadership', 'Systems Engineering'],
    interests: ['Artemis Program', 'Payload Integration', 'Aerospace Software'],
    experienceLevel: 'Executive',
    location: 'Cape Canaveral, FL',
    isAvailable: false,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }],
    experience: [
      { title: 'CTO', company: 'Orbital Dynamics Corp', description: 'Leading all technical operations and engineering teams.', startYear: 2015, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Dr. Elena Vance',
    email: 'elena@robotics.space',
    password: 'password123',
    role: 'Engineer',
    title: 'Chief Robotics Engineer',
    bio: 'Pioneer in autonomous rover navigation for planetary missions. Specializing in AI-driven path planning and multi-sensor fusion.',
    skills: ['Robotics & Kinematics', 'Embedded AI/ML', 'Sensor Fusion (LIDAR/RADAR)', 'Autonomous Navigation', 'Computer Vision'],
    interests: ['Lunar Exploration', 'Autonomous Vehicles', 'Terrain Mapping'],
    experienceLevel: 'Lead',
    location: 'Pasadena, CA',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }, { name: 'Spanish', level: 'B1 Level' }],
    experience: [
      { title: 'Chief Robotics Engineer', company: 'Lunar Dynamics Inc.', description: 'Leading autonomous rover development for south pole missions.', startYear: 2020, endYear: 2026, current: true },
      { title: 'Robotics Engineer', company: 'JPL/NASA', description: 'Contributed to Mars 2020 rover autonomy software.', startYear: 2015, endYear: 2020 }
    ]
  },
  {
    name: 'Kai Nakamura',
    email: 'kai@thermalspace.jp',
    password: 'password123',
    role: 'Engineer',
    title: 'Thermal Systems Specialist',
    bio: 'Expert in spacecraft thermal control and radiator design for deep space missions. Developed novel heat pipe technology for CubeSats.',
    skills: ['Thermal Management', 'Radiator Design', 'Heat Pipes', 'CubeSat Systems', 'Cryogenics'],
    interests: ['Deep Space Missions', 'CubeSats', 'Thermal Innovation'],
    experienceLevel: 'Senior',
    location: 'Tokyo, JP',
    isAvailable: true,
    isVerified: false,
    languages: [{ name: 'Japanese', level: 'Native' }, { name: 'English', level: 'C1 Level' }],
    experience: [
      { title: 'Thermal Lead', company: 'JAXA', description: 'Designed thermal subsystems for Hayabusa3 mission.', startYear: 2019, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Andromeda Launch Co.',
    email: 'team@andromedalaunch.com',
    password: 'password123',
    role: 'Startup',
    title: 'Small Satellite Launch Provider',
    bio: 'Developing a cost-effective, reusable micro-launcher for the booming small satellite market. Currently in flight-test phase.',
    skills: ['Launch Vehicles', 'Reusable Rockets', 'Avionics', 'Ground Systems', 'Regulatory Compliance'],
    interests: ['SmallSat Market', 'Reusability', 'Launch Services', 'NewSpace'],
    experienceLevel: 'Mid-Level',
    location: 'Mojave, CA',
    isAvailable: true,
    isVerified: false,
    languages: [{ name: 'English', level: 'Native' }],
    experience: [
      { title: 'Founded', company: 'Andromeda Launch Co.', description: 'Building next-gen micro-launchers.', startYear: 2022, endYear: 2026, current: true }
    ]
  },
  {
    name: 'Spectral Earth Analytics',
    email: 'info@spectral-ea.com',
    password: 'password123',
    role: 'Company',
    title: 'Earth Observation & Data Analytics',
    bio: 'Transforming satellite imagery into actionable intelligence. Our AI platform processes petabytes of Earth observation data for agriculture, climate, and defense.',
    skills: ['Earth Observation', 'Remote Sensing', 'Data Analytics', 'GIS', 'Cloud Computing'],
    interests: ['Climate Tech', 'Agriculture', 'Defense Intelligence', 'Geospatial AI'],
    experienceLevel: 'Senior',
    location: 'Berlin, DE',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }, { name: 'German', level: 'Native' }],
    experience: []
  },
  {
    name: 'Priya Sharma',
    email: 'priya@isro-alumni.in',
    password: 'password123',
    role: 'Engineer',
    title: 'Aerospace Systems Engineer',
    bio: 'Former ISRO mission planner with deep expertise in GEO satellite operations. Now consulting for commercial operators transitioning to software-defined satellites.',
    skills: ['GEO Operations', 'Mission Planning', 'Software-Defined Satellites', 'Ground Segment', 'RF Engineering'],
    interests: ['Commercial Space', 'Software-Defined Radio', 'Satellite Broadcasting'],
    experienceLevel: 'Senior',
    location: 'Bangalore, IN',
    isAvailable: true,
    isVerified: true,
    languages: [{ name: 'English', level: 'Native' }, { name: 'Hindi', level: 'Native' }, { name: 'Kannada', level: 'Native' }],
    experience: [
      { title: 'Independent Consultant', company: 'Self-Employed', description: 'Advising commercial satellite operators.', startYear: 2022, endYear: 2026, current: true },
      { title: 'Mission Planner', company: 'ISRO', description: 'Managed mission operations for GSAT series.', startYear: 2014, endYear: 2022 }
    ]
  }
];

const seedProjects = [
  {
    title: 'Project Artemis: Next-Gen Lunar Rover',
    description: 'Developing a fully autonomous, AI-driven exploration vehicle designed for the south pole of the Moon. This project focuses on high-precision navigation in low-light conditions and the integration of a multi-sensor suite for real-time terrain mapping.',
    requiredSkills: ['Robotics & Kinematics', 'Embedded AI/ML', 'Aerospace Systems', 'Sensor Fusion (LIDAR/RADAR)'],
    status: 'active',
    budget: '$250k - $450k Allocation',
    duration: '8 Month Phase',
    location: 'Hybrid / Orbital',
    tags: ['Lunar', 'Autonomous', 'AI', 'Robotics'],
    objectives: [
      { title: 'Primary Objective', description: 'Identify and map subterranean water ice deposits with 98% accuracy within a 5km radius.' },
      { title: 'Power Endurance', description: 'Advanced solid-state battery systems coupled with vertical solar arrays for continuous lunar operations.' }
    ]
  },
  {
    title: 'SpaceX Starshield Integration',
    description: 'Your profile matches 98% of the requirements for the Senior Avionics Lead role at Starshield. This priority match is based on recent work with Falcon 9 telemetry.',
    requiredSkills: ['Avionics', 'Telemetry', 'Software Architecture', 'Systems Engineering', 'RF Engineering'],
    status: 'active',
    budget: '$150k - $300k',
    duration: '12 Month Contract',
    location: 'Hawthorne, CA',
    tags: ['SpaceX', 'Starshield', 'Avionics', 'Defense'],
    objectives: [
      { title: 'Avionics Integration', description: 'Lead the integration of next-gen avionics for Starshield constellation.' }
    ]
  },
  {
    title: 'Cislunar Communication Mesh',
    description: 'Building a decentralized communication backbone for operations between Earth-Moon L1 and the lunar surface. Need experts in deep-space signal processing and mesh networking protocols.',
    requiredSkills: ['Deep Space Comms', 'Mesh Networking', 'Signal Processing', 'Antenna Design', 'Orbital Mechanics'],
    status: 'active',
    budget: '$500k - $1M',
    duration: '18 Months',
    location: 'Remote / Austin, TX',
    tags: ['Communication', 'Lunar', 'Mesh Network', 'Infrastructure'],
    objectives: [
      { title: 'Protocol Design', description: 'Design delay-tolerant networking protocols for cislunar operations.' },
      { title: 'Ground Station', description: 'Establish 3 ground station links for continuous coverage.' }
    ]
  },
  {
    title: 'Orbital Debris Tracking Platform',
    description: 'Developing an AI-powered platform for tracking and predicting orbital debris trajectories in LEO. Combines radar data, optical observations, and ML models for collision avoidance.',
    requiredSkills: ['AI/Machine Learning', 'Orbital Mechanics', 'Data Analytics', 'Radar Systems', 'Cloud Computing'],
    status: 'active',
    budget: '$200k - $400k',
    duration: '10 Months',
    location: 'Remote',
    tags: ['Space Safety', 'AI', 'Debris Tracking', 'LEO'],
    objectives: [
      { title: 'ML Model', description: 'Train a debris trajectory prediction model with 95% accuracy for 72-hour windows.' },
      { title: 'API', description: 'Build a real-time REST API for satellite operators to query conjunction data.' }
    ]
  },
  {
    title: 'CubeSat Thermal Innovation Challenge',
    description: 'Seeking innovative thermal management solutions for next-generation 6U CubeSats operating in highly elliptical orbits with extreme thermal cycling.',
    requiredSkills: ['Thermal Management', 'CubeSat Systems', 'Heat Pipes', 'Materials Science', 'Simulation'],
    status: 'active',
    budget: '$80k - $150k',
    duration: '6 Months',
    location: 'Remote',
    tags: ['CubeSat', 'Thermal', 'Innovation', 'HEO'],
    objectives: [
      { title: 'Novel Design', description: 'Develop a passive thermal control system that handles -150°C to +200°C cycling.' }
    ]
  },
  {
    title: 'Satellite IoT for Maritime Tracking',
    description: 'Building a constellation of nanosatellites for global maritime vessel tracking using AIS and custom IoT payloads. Looking for RF engineers and GIS specialists.',
    requiredSkills: ['RF Engineering', 'GIS', 'Satellite Systems', 'IoT', 'Maritime Systems'],
    status: 'active',
    budget: '$1M - $3M',
    duration: '24 Months',
    location: 'Berlin, DE',
    tags: ['IoT', 'Maritime', 'Nanosatellite', 'Remote Sensing'],
    objectives: [
      { title: 'Constellation Design', description: 'Optimize a 24-satellite constellation for global maritime coverage with <15min revisit time.' },
      { title: 'Payload', description: 'Design a multi-protocol IoT receiver payload under 2kg.' }
    ]
  },
  {
    title: 'Green Propulsion Test Facility',
    description: 'Establishing a test facility for non-toxic, green propulsion systems. Seeking propulsion engineers experienced with AF-M315E and LMP-103S propellants.',
    requiredSkills: ['Propulsion', 'Green Propulsion', 'Test Engineering', 'Safety Systems', 'Fluid Dynamics'],
    status: 'active',
    budget: '$2M - $5M',
    duration: '36 Months',
    location: 'Mojave, CA',
    tags: ['Green Propulsion', 'Test Facility', 'Sustainability'],
    objectives: [
      { title: 'Facility Build', description: 'Design and construct a Category 1 propulsion test stand.' },
      { title: 'First Fire', description: 'Achieve first hot-fire test within 12 months of ground-breaking.' }
    ]
  },
  {
    title: 'AI-Powered Space Weather Forecasting',
    description: 'Developing a machine learning platform for predicting solar storms and their impact on satellite operations. Integrating data from NOAA, ESA, and proprietary sensors.',
    requiredSkills: ['AI/Machine Learning', 'Data Analytics', 'Space Weather', 'Cloud Computing', 'Python'],
    status: 'active',
    budget: '$300k - $600k',
    duration: '14 Months',
    location: 'Remote',
    tags: ['Space Weather', 'AI', 'Prediction', 'Data Science'],
    objectives: [
      { title: 'Data Pipeline', description: 'Build a real-time ingestion pipeline processing 50GB/day from multiple space weather sources.' },
      { title: 'Forecast Model', description: 'Achieve 4-hour advance warning capability for Kp ≥ 7 geomagnetic storms.' }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data.');

    // Create users
    const createdUsers = await User.create(seedUsers);
    console.log(`Created ${createdUsers.length} users.`);

    // Create projects with owners distributed among users
    const projectOwners = [
      createdUsers[9],  // Dr. Elena Vance - Lunar Rover
      createdUsers[4],  // Astra Dynamic Labs - Starshield
      createdUsers[2],  // Lunar MeshNet - Cislunar Comms
      createdUsers[0],  // Dr. Elias Vance - Debris Tracking
      createdUsers[10], // Kai Nakamura - CubeSat Thermal
      createdUsers[12], // Spectral Earth - Maritime IoT
      createdUsers[1],  // Dr. Julia Vane - Green Propulsion
      createdUsers[8],  // Marcus Thorne - Space Weather
    ];

    const createdProjects = [];
    for (let i = 0; i < seedProjects.length; i++) {
      const project = await Project.create({
        ...seedProjects[i],
        owner: projectOwners[i]._id,
        teamMembers: [
          { user: projectOwners[i]._id, role: 'Project Lead' },
          ...(i < createdUsers.length - 2 ? [
            { user: createdUsers[i + 1]._id, role: 'Team Member' }
          ] : [])
        ]
      });
      createdProjects.push(project);
    }
    console.log(`Created ${createdProjects.length} projects.`);

    // Create sample messages
    const sampleMessages = [
      { sender: createdUsers[0]._id, receiver: createdUsers[3]._id, content: 'Hi Sarah, I noticed your expertise in orbital logistics. Would you be interested in collaborating on the Debris Tracking Platform?', read: true },
      { sender: createdUsers[3]._id, receiver: createdUsers[0]._id, content: 'Hi Elias! Absolutely, the debris tracking work aligns perfectly with our supply chain optimization for Axiom. Let\'s set up a call.', read: true },
      { sender: createdUsers[3]._id, receiver: createdUsers[0]._id, content: 'I\'ve reviewed the project brief. The ML model requirements are fascinating. What framework are you considering for the trajectory predictions?', read: false },
      { sender: createdUsers[6]._id, receiver: createdUsers[2]._id, content: 'Lunar MeshNet team — Nebula Ventures would love to discuss a potential seed investment. Your mesh networking approach to cislunar communication is exactly what we\'re looking for.', read: true },
      { sender: createdUsers[2]._id, receiver: createdUsers[6]._id, content: 'Thank you for reaching out! We\'re currently raising our seed round. Would love to share our pitch deck and technical roadmap.', read: false },
      { sender: createdUsers[4]._id, receiver: createdUsers[1]._id, content: 'Dr. Vane, we have an opening for a propulsion architect on our LEO deployment program. Your Hall thruster research is exactly what we need.', read: true },
      { sender: createdUsers[1]._id, receiver: createdUsers[4]._id, content: 'Very interested! I\'ve been following Astra Dynamic\'s work. Can you share more details about the mission profile?', read: false },
    ];

    await Message.create(sampleMessages);
    console.log(`Created ${sampleMessages.length} sample messages.`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test accounts (all passwords: password123):');
    createdUsers.forEach(u => {
      console.log(`   ${u.role.padEnd(10)} | ${u.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
