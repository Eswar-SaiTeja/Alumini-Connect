import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Government College Rajahmundry Alumni Connect...');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.successStory.deleteMany();
  await prisma.newsAnnouncement.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.alumniSkill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.alumniProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSetting.deleteMany();

  const superAdminPassword = await bcrypt.hash('Admin@GCRJY2026', 10);
  const editorPassword = await bcrypt.hash('Editor@GCRJY2026', 10);
  const alumniPassword = await bcrypt.hash('Alumni@2026', 10);

  // 1. Create Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@gcrjy.ac.in',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      status: 'APPROVED',
      profile: {
        create: {
          fullName: 'Prof. K. Venkateswara Rao',
          graduationYear: 1988,
          department: 'Physics',
          degree: 'M.Sc Physics',
          currentDesignation: 'Dean & Director of Alumni Affairs',
          currentCompany: 'Government College (Autonomous), Rajahmundry',
          industry: 'Higher Education',
          city: 'Rajahmundry',
          state: 'Andhra Pradesh',
          country: 'India',
          bio: 'Dean of Alumni Affairs and Professor of Physics at Government College (Autonomous), Rajahmundry. Alumnus of 1988 Batch.',
          profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          isFeatured: true,
          isVerified: true,
          emailPrivacy: 'PUBLIC',
          phonePrivacy: 'PUBLIC',
        },
      },
    },
  });

  // 2. Create Content Manager
  await prisma.user.create({
    data: {
      email: 'editor@gcrjy.ac.in',
      passwordHash: editorPassword,
      role: 'CONTENT_MANAGER',
      status: 'APPROVED',
      profile: {
        create: {
          fullName: 'Dr. Anita Sastry',
          graduationYear: 2002,
          department: 'English',
          degree: 'M.A. English Literature',
          currentDesignation: 'Head of Media & Communications',
          currentCompany: 'Government College (Autonomous), Rajahmundry',
          industry: 'Education & Media',
          city: 'Rajahmundry',
          state: 'Andhra Pradesh',
          country: 'India',
          bio: 'Managing digital communications, alumni publications, and news for GCRJY.',
          profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
          isFeatured: false,
          isVerified: true,
        },
      },
    },
  });

  // 3. Create Diverse Alumni Records
  const alumniData = [
    {
      email: 'ramesh.sharma@alumni.gcrjy.ac.in',
      name: 'Ramesh Sharma',
      batch: 1994,
      department: 'Computer Science',
      degree: 'B.Sc Computer Science',
      company: 'Microsoft Corporation',
      designation: 'Principal Engineering Manager',
      industry: 'Information Technology',
      city: 'Redmond, WA',
      state: 'Washington',
      country: 'United States',
      bio: 'Leading distributed cloud systems at Microsoft Azure. Passionate about mentoring students from Godavari region in STEM and open source.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Distributed Systems', 'Azure', 'C#', 'Cloud Architecture', 'Mentorship'],
      experiences: [
        { title: 'Principal Engineering Manager', company: 'Microsoft', location: 'Redmond, WA', startDate: '2018-03', isCurrent: true, description: 'Directing Azure Core Infrastructure teams.' },
        { title: 'Senior Software Engineer', company: 'Amazon Web Services', location: 'Seattle, WA', startDate: '2012-05', endDate: '2018-02', isCurrent: false, description: 'Built large scale S3 storage services.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Computer Science', fieldOfStudy: 'Computer Science & Mathematics', startYear: 1991, endYear: 1994 },
        { institution: 'Indian Institute of Technology (IIT) Madras', degree: 'M.Tech', fieldOfStudy: 'Computer Science', startYear: 1995, endYear: 1997 }
      ]
    },
    {
      email: 'kavitha.reddy@alumni.gcrjy.ac.in',
      name: 'Dr. Kavitha Reddy',
      batch: 1999,
      department: 'Chemistry',
      degree: 'B.Sc Chemistry',
      company: 'Dr. Reddy’s Laboratories',
      designation: 'Senior VP - Global Drug Discovery',
      industry: 'Pharmaceuticals & Biotechnology',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      bio: 'Ph.D in Organic Chemistry from IISc Bengaluru. Spearheading novel molecular formulations for oncology therapeutics.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Pharmaceutical R&D', 'Organic Synthesis', 'Drug Discovery', 'Clinical Trials', 'Regulatory Affairs'],
      experiences: [
        { title: 'Senior VP - Global Drug Discovery', company: "Dr. Reddy's Laboratories", location: 'Hyderabad', startDate: '2019-01', isCurrent: true, description: 'Managing oncology therapeutic discovery pipelines.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Chemistry', fieldOfStudy: 'Chemistry, Botany, Zoology', startYear: 1996, endYear: 1999 },
        { institution: 'Indian Institute of Science (IISc)', degree: 'Ph.D.', fieldOfStudy: 'Bio-Organic Chemistry', startYear: 2000, endYear: 2005 }
      ]
    },
    {
      email: 'suryanarayana.murthy@alumni.gcrjy.ac.in',
      name: 'Sri S. N. Murthy, IAS',
      batch: 1982,
      department: 'Economics',
      degree: 'B.A. Economics',
      company: 'Government of Andhra Pradesh',
      designation: 'Principal Secretary (Retd.)',
      industry: 'Civil Services & Public Policy',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      country: 'India',
      bio: 'Distinguished civil servant (IAS 1986 batch). Spearheaded major rural irrigation and industrial corridor policies across AP and South India.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Public Policy', 'Infrastructure Planning', 'Administrative Governance', 'Economic Reforms'],
      experiences: [
        { title: 'Principal Secretary', company: 'Government of Andhra Pradesh', location: 'Amaravati', startDate: '2015-06', endDate: '2020-04', isCurrent: false, description: 'Headed industries and commerce ministry initiatives.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.A. Economics', fieldOfStudy: 'Economics, History, Politics', startYear: 1979, endYear: 1982 }
      ]
    },
    {
      email: 'priya.sundaram@alumni.gcrjy.ac.in',
      name: 'Priya Sundaram',
      batch: 2008,
      department: 'Mathematics',
      degree: 'B.Sc Mathematics',
      company: 'Goldman Sachs',
      designation: 'Executive Director - Quantitative Strategy',
      industry: 'Investment Banking & Finance',
      city: 'London',
      state: 'England',
      country: 'United Kingdom',
      bio: 'Leading algorithmic pricing and financial derivatives modeling in London. Dedicated to promoting women in mathematical finance.',
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Quantitative Modeling', 'Stochastic Calculus', 'Python', 'Algorithmic Trading', 'Risk Management'],
      experiences: [
        { title: 'Executive Director', company: 'Goldman Sachs', location: 'London, UK', startDate: '2017-09', isCurrent: true, description: 'Managing EMEA quantitative risk strategies.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Mathematics', fieldOfStudy: 'Mathematics & Statistics', startYear: 2005, endYear: 2008 },
        { institution: 'London School of Economics (LSE)', degree: 'M.Sc Financial Mathematics', fieldOfStudy: 'Quantitative Finance', startYear: 2009, endYear: 2010 }
      ]
    },
    {
      email: 'anand.chowdary@alumni.gcrjy.ac.in',
      name: 'Anand Chowdary',
      batch: 2014,
      department: 'Computer Science',
      degree: 'B.Sc Computer Science',
      company: 'ScaleX Data Labs',
      designation: 'Co-Founder & CEO',
      industry: 'Information Technology',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      bio: 'Tech entrepreneur building enterprise data streaming infrastructure. Raised Series B funding. Active angel investor.',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Startups', 'Venture Capital', 'Product Strategy', 'Distributed Kafka', 'Go/Rust'],
      experiences: [
        { title: 'Co-Founder & CEO', company: 'ScaleX Data Labs', location: 'Bengaluru', startDate: '2020-02', isCurrent: true, description: 'Built team of 60+ engineers serving Fortune 500 customers.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Computer Science', fieldOfStudy: 'Computer Applications', startYear: 2011, endYear: 2014 }
      ]
    },
    {
      email: 'dr.sudhir.n@alumni.gcrjy.ac.in',
      name: 'Dr. Sudhir Narayana',
      batch: 2001,
      department: 'Botany',
      degree: 'B.Sc Botany',
      company: 'University of Cambridge',
      designation: 'Senior Research Fellow - Plant Genomics',
      industry: 'Scientific Research',
      city: 'Cambridge',
      state: 'Cambridgeshire',
      country: 'United Kingdom',
      bio: 'Researching CRISPR-Cas gene-editing in drought-resilient crops to combat global climate change food insecurity.',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Plant Genomics', 'CRISPR-Cas9', 'Bioinformatics', 'Climate Resilient Agriculture'],
      experiences: [
        { title: 'Senior Research Fellow', company: 'University of Cambridge', location: 'Cambridge, UK', startDate: '2016-04', isCurrent: true, description: 'Principal investigator on sustainable crop genetic markers.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Botany', fieldOfStudy: 'Botany & Plant Sciences', startYear: 1998, endYear: 2001 }
      ]
    },
    {
      email: 'lakshmi.prasanna@alumni.gcrjy.ac.in',
      name: 'Lakshmi Prasanna',
      batch: 2016,
      department: 'Commerce',
      degree: 'B.Com General',
      company: 'Deloitte India',
      designation: 'Manager - Forensic Audit & Compliance',
      industry: 'Accounting & Advisory',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      bio: 'Chartered Accountant (CA) with 8+ years experience in corporate fraud investigation and governance advisory.',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Forensic Audit', 'Financial Reporting', 'Corporate Governance', 'AML Compliance'],
      experiences: [
        { title: 'Manager - Forensic Audit', company: 'Deloitte India', location: 'Mumbai', startDate: '2021-06', isCurrent: true, description: 'Leading enterprise risk investigation engagements.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Com General', fieldOfStudy: 'Accountancy & Mercantile Law', startYear: 2013, endYear: 2016 }
      ]
    },
    {
      email: 'vikram.varma@alumni.gcrjy.ac.in',
      name: 'Vikram Varma',
      batch: 2010,
      department: 'Physics',
      degree: 'B.Sc Physics',
      company: 'ISRO - Indian Space Research Organisation',
      designation: 'Scientist / Engineer - SD',
      industry: 'Aerospace & Space Technology',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      bio: 'Contributing to India’s Chandrayaan and Gaganyaan human spaceflight mission payload instrumentation systems.',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Optics & Sensors', 'Space Payloads', 'Embedded Telemetry', 'Cryogenic Instrumentation'],
      experiences: [
        { title: 'Scientist / Engineer - SD', company: 'ISRO (URSC)', location: 'Bengaluru', startDate: '2014-08', isCurrent: true, description: 'Flight calibration and thermal payload verification.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Physics', fieldOfStudy: 'Physics & Electronics', startYear: 2007, endYear: 2010 }
      ]
    },
    {
      email: 'swathi.babu@alumni.gcrjy.ac.in',
      name: 'Swathi Babu',
      batch: 2018,
      department: 'Computer Science',
      degree: 'B.Sc Computer Applications',
      company: 'Google',
      designation: 'Software Engineer III',
      industry: 'Information Technology',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      bio: 'Working on Google Search query understanding algorithms. Active speaker at local developer meetups and hackathons.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['NLP', 'Information Retrieval', 'C++', 'Python', 'Machine Learning'],
      experiences: [
        { title: 'Software Engineer III', company: 'Google', location: 'Hyderabad', startDate: '2022-01', isCurrent: true, description: 'Core ranking and query tokenization services.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Computer Applications', fieldOfStudy: 'Computer Science', startYear: 2015, endYear: 2018 }
      ]
    },
    {
      email: 'srinivas.rao@alumni.gcrjy.ac.in',
      name: 'K. Srinivas Rao',
      batch: 1989,
      department: 'Telugu',
      degree: 'M.A. Telugu Literature',
      company: 'Andhra University',
      designation: 'Professor & Dean of Humanities',
      industry: 'Higher Education & Literature',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      country: 'India',
      bio: 'Renowned scholar of classical Godavari literature, Nannaya poetic traditions, and contemporary Telugu literary critique.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Classical Telugu Literature', 'Linguistic History', 'Research Guidance', 'Literary Criticism'],
      experiences: [
        { title: 'Professor & Dean', company: 'Andhra University', location: 'Visakhapatnam', startDate: '2010-08', isCurrent: true, description: 'Guiding Ph.D. scholars in Dravidian linguistics.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'M.A. Telugu Literature', fieldOfStudy: 'Telugu Literature', startYear: 1987, endYear: 1989 }
      ]
    },
    {
      email: 'manoj.kumar@alumni.gcrjy.ac.in',
      name: 'Manoj Kumar Patnaik',
      batch: 2005,
      department: 'Zoology',
      degree: 'B.Sc Zoology',
      company: 'Apollo Hospitals Group',
      designation: 'Chief Embryologist & Lab Director',
      industry: 'Healthcare & Medicine',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      bio: 'Leading advanced Assisted Reproductive Technology (ART) laboratories. Published 20+ clinical research papers in human reproductive biology.',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Clinical Embryology', 'IVF/ICSI', 'Cryopreservation', 'Laboratory Quality Control'],
      experiences: [
        { title: 'Chief Embryologist', company: 'Apollo Hospitals', location: 'Chennai', startDate: '2016-03', isCurrent: true, description: 'Heading fertility lab operations across South India.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Zoology', fieldOfStudy: 'Animal Physiology & Genetics', startYear: 2002, endYear: 2005 }
      ]
    },
    {
      email: 'deepika.nair@alumni.gcrjy.ac.in',
      name: 'Deepika Nair',
      batch: 2012,
      department: 'History',
      degree: 'B.A. History',
      company: 'Archaeological Survey of India (ASI)',
      designation: 'Superintending Archaeologist',
      industry: 'Heritage & Conservation',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      bio: 'Specialist in ancient Eastern Deccan Buddhist architecture, rock-cut monuments, and epigraphical heritage preservation.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Archaeological Excavation', 'Epigraphy', 'Heritage Conservation', 'Museum Curating'],
      experiences: [
        { title: 'Superintending Archaeologist', company: 'ASI', location: 'New Delhi', startDate: '2019-07', isCurrent: true, description: 'Overseeing UNESCO World Heritage site conservation projects.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.A. History', fieldOfStudy: 'History, Archaeology, Politics', startYear: 2009, endYear: 2012 }
      ]
    },
    {
      email: 'sanjay.gupta@alumni.gcrjy.ac.in',
      name: 'Sanjay Gupta',
      batch: 2003,
      department: 'Commerce',
      degree: 'B.Com Computers',
      company: 'Standard Chartered Bank',
      designation: 'Managing Director - Trade Finance',
      industry: 'Banking & Financial Services',
      city: 'Singapore',
      state: 'Singapore',
      country: 'Singapore',
      bio: 'Managing trade corridor financing across South Asia and Southeast Asia. Passionate about financial inclusion and micro-lending innovations.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Structured Trade Finance', 'Cross-Border Liquidity', 'Risk Underwriting', 'FinTech'],
      experiences: [
        { title: 'Managing Director', company: 'Standard Chartered', location: 'Singapore', startDate: '2018-05', isCurrent: true, description: 'Managing ASEAN trade flow portfolio exceeding $5B.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Com Computers', fieldOfStudy: 'Commerce & Computer Applications', startYear: 2000, endYear: 2003 }
      ]
    },
    {
      email: 'rohini.rao@alumni.gcrjy.ac.in',
      name: 'Dr. Rohini Rao',
      batch: 2007,
      department: 'Physics',
      degree: 'B.Sc Physics',
      company: 'Max Planck Institute for Quantum Optics',
      designation: 'Senior Physicist',
      industry: 'Scientific Research',
      city: 'Munich',
      state: 'Bavaria',
      country: 'Germany',
      bio: 'Specializing in ultrafast laser spectroscopy and quantum entanglement experiments. Mentor for international graduate students.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Quantum Optics', 'Ultrafast Lasers', 'Spectroscopy', 'Photonics'],
      experiences: [
        { title: 'Senior Physicist', company: 'Max Planck Institute', location: 'Munich, Germany', startDate: '2017-10', isCurrent: true, description: 'Leading high-harmonic laser excitation laboratory.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Physics', fieldOfStudy: 'Physics & Mathematics', startYear: 2004, endYear: 2007 }
      ]
    },
    {
      email: 'chaitanya.k@alumni.gcrjy.ac.in',
      name: 'Chaitanya Krishna',
      batch: 2019,
      department: 'Computer Science',
      degree: 'B.Sc Computer Science',
      company: 'Atlassian',
      designation: 'Senior Cloud Systems Engineer',
      industry: 'Information Technology',
      city: 'Sydney',
      state: 'NSW',
      country: 'Australia',
      bio: 'Building enterprise developer tool observability and reliability infrastructure at Atlassian Sydney.',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      isFeatured: false,
      skills: ['Kubernetes', 'Terraform', 'Go', 'Observability', 'Site Reliability Engineering'],
      experiences: [
        { title: 'Senior Cloud Systems Engineer', company: 'Atlassian', location: 'Sydney, Australia', startDate: '2023-02', isCurrent: true, description: 'Managing global multi-region cloud deployment mesh.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Sc Computer Science', fieldOfStudy: 'Computer Science', startYear: 2016, endYear: 2019 }
      ]
    },
    {
      email: 'bhaskar.raju@alumni.gcrjy.ac.in',
      name: 'Bhaskar Raju',
      batch: 1997,
      department: 'Commerce',
      degree: 'B.Com',
      company: 'Godavari Agro Ventures Pvt Ltd',
      designation: 'Founder & Managing Director',
      industry: 'Agriculture & Food Processing',
      city: 'Rajahmundry',
      state: 'Andhra Pradesh',
      country: 'India',
      bio: 'Empowering 5,000+ local farmers across East & West Godavari through direct-to-market cold-chain logistics and organic exports.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      isFeatured: true,
      skills: ['Agri-Business', 'Supply Chain', 'Farmer Producer Orgs', 'Food Technology Export'],
      experiences: [
        { title: 'Founder & MD', company: 'Godavari Agro Ventures', location: 'Rajahmundry', startDate: '2004-01', isCurrent: true, description: 'Expanded agro export footprint across 12 countries.' }
      ],
      educations: [
        { institution: 'Government College (Autonomous), Rajahmundry', degree: 'B.Com', fieldOfStudy: 'Commerce & Business Management', startYear: 1994, endYear: 1997 }
      ]
    }
  ];

  for (const item of alumniData) {
    const user = await prisma.user.create({
      data: {
        email: item.email,
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        status: 'APPROVED',
        profile: {
          create: {
            fullName: item.name,
            graduationYear: item.batch,
            department: item.department,
            degree: item.degree,
            currentCompany: item.company,
            currentDesignation: item.designation,
            industry: item.industry,
            city: item.city,
            state: item.state,
            country: item.country,
            bio: item.bio,
            profilePhoto: item.photo,
            isFeatured: item.isFeatured,
            isVerified: true,
            emailPrivacy: 'ALUMNI_ONLY',
            phonePrivacy: 'PRIVATE',
            companyPrivacy: 'PUBLIC',
            skills: {
              create: item.skills.map((name) => ({ name })),
            },
            experiences: {
              create: item.experiences.map((exp) => ({
                title: exp.title,
                company: exp.company,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate || null,
                isCurrent: exp.isCurrent,
                description: exp.description,
              })),
            },
            educations: {
              create: item.educations.map((edu) => ({
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                startYear: edu.startYear,
                endYear: edu.endYear,
              })),
            },
          },
        },
      },
    });
  }

  // 4. Create Rich Events
  const eventsData = [
    {
      title: '173rd Grand Annual Alumni Convention & Golden Jubilee Reunion 2026',
      description: 'The premier flagship gathering of Government College (Autonomous), Rajahmundry alumni from across the globe. Featuring distinguished alumni felicitations, keynote address by ISRO & Civil Services luminaries, department alumni interactions, musical evening on the Godavari banks, and the launch of the 2026-2030 Campus Development Fund.',
      category: 'REUNION',
      bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
      eventDate: '2026-11-14',
      time: '09:00 AM - 08:30 PM IST',
      venue: 'Heritage Quadrangle & Godavari Convocation Auditorium, GCRJY Campus, Rajahmundry',
      isOnline: false,
      speaker: 'Sri S. N. Murthy (IAS Retd.) & Dr. Kavitha Reddy (Dr. Reddy’s Labs)',
      organizer: 'GCRJY Central Alumni Association Executive Committee',
      capacity: 1500,
      registrationDeadline: '2026-11-10',
      isPublished: true,
    },
    {
      title: 'Global Tech & AI Innovation Summit: Bridging Campus to Silicon Valley',
      description: 'An interactive hybrid summit exploring generative AI, modern distributed systems, and career pathways in big tech. Alumni engineers from Microsoft, Google, Atlassian, and top startups share technical insights, conduct mock architecture reviews, and open mentorship slots for junior alumni.',
      category: 'WEBINAR',
      bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      eventDate: '2026-09-26',
      time: '06:00 PM - 09:00 PM IST',
      venue: 'Online via Zoom & College Media Auditorium (Hybrid)',
      isOnline: true,
      onlineLink: 'https://meet.gcrjy.ac.in/alumni-ai-summit-2026',
      speaker: 'Ramesh Sharma (Microsoft) & Anand Chowdary (ScaleX Labs)',
      organizer: 'GCRJY Computer Science & Mathematics Alumni Chapter',
      capacity: 500,
      registrationDeadline: '2026-09-25',
      isPublished: true,
    },
    {
      title: 'Godavari Riverfront Heritage Walk & Networking Breakfast',
      description: 'Start your Sunday morning reconnecting with fellow batchmates along the historic Pushkar Ghats and Godavari riverside, followed by traditional Godavari breakfast at the Heritage Alumni Pavilion. Open to all alumni and families.',
      category: 'CULTURAL',
      bannerImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200',
      eventDate: '2026-10-04',
      time: '06:30 AM - 10:00 AM IST',
      venue: 'Pushkar Ghat Promenade & College Pavilion, Rajahmundry',
      isOnline: false,
      speaker: 'Prof. K. Srinivas Rao (Andhra University)',
      organizer: 'GCRJY Youth & Cultural Alumni Wing',
      capacity: 300,
      registrationDeadline: '2026-10-02',
      isPublished: true,
    },
    {
      title: 'Civil Services & State PSC Career Conclave by Alumni Officers',
      description: 'Comprehensive preparation strategy masterclass for UPSC Civil Services, APPSC Group-1, and banking examinations conducted by senior serving and retired alumni officers.',
      category: 'CAREER',
      bannerImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200',
      eventDate: '2026-10-18',
      time: '10:00 AM - 02:00 PM IST',
      venue: 'Main Seminar Hall 1, Science Block, GCRJY',
      isOnline: false,
      speaker: 'Distinguished Alumni Bureaucrats & Public Policy Specialists',
      organizer: 'GCRJY Public Administration & Career Cell',
      capacity: 250,
      registrationDeadline: '2026-10-16',
      isPublished: true,
    }
  ];

  for (const evt of eventsData) {
    const createdEvent = await prisma.event.create({
      data: evt,
    });

    // Add some sample registrations
    await prisma.eventRegistration.create({
      data: {
        eventId: createdEvent.id,
        userId: adminUser.id,
        alumniName: 'Prof. K. Venkateswara Rao',
        alumniEmail: 'admin@gcrjy.ac.in',
        alumniPhone: '+91 98480 12345',
        ticketNumber: `GCRJY-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
        attendanceStatus: 'REGISTERED',
      },
    });
  }

  // 5. Create News & Announcements
  const newsData = [
    {
      title: 'Government College (Autonomous), Rajahmundry Awarded NAAC A++ with Historic 3.72 CGPA',
      subtitle: 'The 173-year-old historic institution receives the highest grade in Andhra Pradesh, honoring its legacy of academic rigor and research excellence.',
      content: 'In a momentous achievement for higher education in the Godavari region, Government College (Autonomous), Rajahmundry has been accredited with the prestigious NAAC A++ grade with an exceptional CGPA of 3.72 out of 4. The peer review team commended the college for its modern digital laboratories, rich heritage preservation, high research publication output, and active global alumni participation. Principal Dr. Ramachandra Murthy dedicated this honor to generations of faculty, students, and loyal alumni whose continued support elevates the college on the national map.',
      category: 'COLLEGE_NEWS',
      featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
      author: 'College Academic Cell',
      tags: 'NAAC, Accreditation, Excellence, Milestone',
      isPublished: true,
    },
    {
      title: 'Distinguished Alumnus Pledges ₹2.5 Crore for Advanced AI & Robotics Innovation Center',
      subtitle: 'New state-of-the-art laboratory will offer high-performance compute clusters and hands-on robotics equipment for undergraduate students.',
      content: 'The GCRJY Alumni Association is thrilled to announce a transformative philanthropic commitment of ₹2.5 Crores by Silicon Valley alumnus Ramesh Sharma (Batch 1994). The grant will fund the construction of the "Godavari Tech Innovation & AI Hub", featuring 60 GPU workstations, IoT prototyping benches, and high-speed fiber connectivity to foster world-class technical skills right here on the Rajahmundry campus.',
      category: 'ALUMNI_NEWS',
      featuredImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
      author: 'Alumni Relations Office',
      tags: 'Philanthropy, AI Lab, Technology, Innovation',
      isPublished: true,
    },
    {
      title: 'Registrations Open: 2026-2027 Alumni Career Mentorship Program',
      subtitle: 'Connect 1-on-1 with final-year students for resume reviews, mock interviews, and career navigation across 12 disciplines.',
      content: 'The Alumni Career Mentorship Initiative enters its 4th successful year. We invite our experienced alumni across IT, Pharma, Banking, Civil Services, Law, and Academia to dedicate 2 hours a month to guide ambitious students from our campus. Last year, 240+ students received internships and placement offers through mentorship guidance.',
      category: 'ANNOUNCEMENT',
      featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
      author: 'Career Guidance Cell',
      tags: 'Mentorship, Careers, Students, Placements',
      isPublished: true,
    },
    {
      title: 'College Celebrates 173 Years of Historic Excellence on the Banks of River Godavari',
      subtitle: 'Special exhibition inaugurated showcasing rare 19th-century manuscripts, botanical specimens, and historic photographs.',
      content: 'Founded in 1853 as a provincial school and upgraded to a degree college in 1873, Government College Rajahmundry stands as a temple of learning that has nurtured national freedom fighters, pioneering scientists, chief ministers, and literary giants. A month-long heritage exhibition is currently open to the public in the Central Library.',
      category: 'ACHIEVEMENT',
      featuredImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000',
      author: 'Heritage & Archives Committee',
      tags: 'History, Heritage, 1853, Celebration',
      isPublished: true,
    }
  ];

  for (const n of newsData) {
    await prisma.newsAnnouncement.create({
      data: n,
    });
  }

  // 6. Create Success Stories
  const storiesData = [
    {
      alumniName: 'Dr. Kavitha Reddy',
      batch: 1999,
      department: 'Chemistry',
      achievementTitle: 'Leading the Frontier of Life-Saving Oncology Therapeutics',
      story: 'Growing up along the banks of River Godavari, Kavitha discovered her passion for chemical synthesis in the heritage laboratories of Government College Rajahmundry. Today, as Senior Vice President of Global Drug Discovery at Dr. Reddy’s Laboratories, her research team has developed novel affordable molecules for lung and breast cancer therapeutics. "The foundational experimental discipline instilled by my GCRJY professors remains the bedrock of my scientific career," she remarks with pride.',
      careerInfo: 'Senior VP, Dr. Reddy’s Laboratories | Ph.D. IISc Bengaluru | 40+ International Patents',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
      isFeatured: true,
      isPublished: true,
    },
    {
      alumniName: 'Ramesh Sharma',
      batch: 1994,
      department: 'Computer Science',
      achievementTitle: 'From Godavari Ghats to Architecting Planetary Cloud Systems at Microsoft',
      story: 'When Ramesh enrolled in GCRJY in 1991, personal computers were a rare luxury. With relentless curiosity and mentorship from devoted mathematics faculty, he mastered computing fundamentals that propelled him to IIT Madras and later to Microsoft’s headquarters in Redmond. Over the past two decades, he has helped build the backbone of modern cloud computing.',
      careerInfo: 'Principal Engineering Manager, Microsoft Azure | M.Tech IIT Madras',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      isFeatured: true,
      isPublished: true,
    },
    {
      alumniName: 'Anand Chowdary',
      batch: 2014,
      department: 'Computer Science',
      achievementTitle: 'Building an Enterprise Cloud Infrastructure Unicorn from India',
      story: 'At just 31, Anand Chowdary is recognized as one of India’s top young software entrepreneurs. His company, ScaleX Data Labs, provides ultra-low-latency data stream processing for Fortune 500 financial institutions. Anand frequently credits the open, encouraging environment at GCRJY for teaching him independent thinking and resilience.',
      careerInfo: 'Founder & CEO, ScaleX Data Labs | Forbes 30 Under 30 Asia',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
      isFeatured: true,
      isPublished: true,
    },
    {
      alumniName: 'Sri S. N. Murthy, IAS',
      batch: 1982,
      department: 'Economics',
      achievementTitle: 'Four Decades of Exemplary Public Service and State Infrastructure Development',
      story: 'As a student of economics at GCRJY, Sri S.N. Murthy participated actively in college debates and social welfare campaigns. After securing a top rank in the UPSC Civil Services Examination in 1986, he served with distinction across multiple districts, implementing landmark irrigation canals, port connectivity corridors, and welfare programs across Andhra Pradesh.',
      careerInfo: 'Principal Secretary (Retd.), IAS 1986 Batch | Public Policy Advisor',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      isFeatured: true,
      isPublished: true,
    }
  ];

  for (const s of storiesData) {
    await prisma.successStory.create({
      data: s,
    });
  }

  // 7. Create Campus & Reunion Gallery
  const galleryData = [
    {
      title: 'Historic Main Quadrangle & Victorian Clock Tower',
      category: 'CAMPUS',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      caption: 'The majestic heritage red-brick facade of Government College Rajahmundry, standing proudly since the 19th century.',
      orderIndex: 1,
    },
    {
      title: 'Grand Annual Alumni Convention 2025 in Full Session',
      category: 'ALUMNI_MEETS',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
      caption: 'Over 1,200 alumni from 14 countries gathered in the Quadrangle to celebrate cherished memories.',
      orderIndex: 2,
    },
    {
      title: 'Heritage Chemistry & Botany Research Laboratories',
      category: 'CAMPUS',
      imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
      caption: 'State-of-the-art scientific equipment in the newly upgraded science wing.',
      orderIndex: 3,
    },
    {
      title: 'Batch of 1995 Silver Jubilee Reunion Celebration',
      category: 'REUNIONS',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
      caption: 'Classmates of 1995 reconnecting and presenting a commemorative memento to the college.',
      orderIndex: 4,
    },
    {
      title: 'Annual College Sports Day & Alumni vs Faculty Match',
      category: 'ACTIVITIES',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
      caption: 'Friendly cricket match on the college grounds with enthusiastic student support.',
      orderIndex: 5,
    },
    {
      title: 'Convocation Ceremony & Outstanding Alumni Awards',
      category: 'ACHIEVEMENTS',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
      caption: 'Honoring distinguished alumni with lifetime achievement medals.',
      orderIndex: 6,
    }
  ];

  for (const g of galleryData) {
    await prisma.galleryItem.create({
      data: g,
    });
  }

  // 8. Create Site Settings for Dynamic Institutional Branding
  const siteSettings = [
    { key: 'college_name', value: 'Government College (Autonomous), Rajahmundry', group: 'BRANDING' },
    { key: 'college_short_name', value: 'GCRJY', group: 'BRANDING' },
    { key: 'college_estd', value: '1853', group: 'BRANDING' },
    { key: 'tagline', value: 'Connecting Generations. Inspiring Futures.', group: 'BRANDING' },
    { key: 'hero_badge', value: 'Estd. 1853 • Autonomous • NAAC A++ (3.72 CGPA)', group: 'HERO' },
    { key: 'hero_title', value: 'Connecting Generations. Inspiring Futures.', group: 'HERO' },
    { key: 'hero_subtitle', value: 'Welcome to the official alumni platform of Government College (Autonomous), Rajahmundry. Discover lifelong connections, mentor current students, explore global networks, and celebrate our shared 173-year legacy.', group: 'HERO' },
    { key: 'primary_color', value: '#0a2540', group: 'BRANDING' },
    { key: 'secondary_color', value: '#c89116', group: 'BRANDING' },
    { key: 'accent_color', value: '#1e40af', group: 'BRANDING' },
    { key: 'contact_email', value: 'alumni@gcrjy.ac.in', group: 'CONTACT' },
    { key: 'contact_phone', value: '+91 (0883) 2475456', group: 'CONTACT' },
    { key: 'contact_address', value: 'Government College (Autonomous), Katheru Road, Rajamahendravaram (Rajahmundry), East Godavari Dist, Andhra Pradesh - 533105, India', group: 'CONTACT' },
    { key: 'facebook_url', value: 'https://facebook.com/gcrjyalumni', group: 'FOOTER' },
    { key: 'linkedin_url', value: 'https://linkedin.com/school/government-college-rajahmundry', group: 'FOOTER' },
    { key: 'twitter_url', value: 'https://twitter.com/gcrjy_alumni', group: 'FOOTER' },
    { key: 'youtube_url', value: 'https://youtube.com/gcrjyofficial', group: 'FOOTER' },
    { key: 'stats_total_alumni', value: '52400', group: 'STATS' },
    { key: 'stats_countries', value: '42', group: 'STATS' },
    { key: 'stats_chapters', value: '18', group: 'STATS' },
    { key: 'stats_companies', value: '3800', group: 'STATS' },
  ];

  for (const s of siteSettings) {
    await prisma.siteSetting.create({
      data: s,
    });
  }

  // 9. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      adminEmail: 'admin@gcrjy.ac.in',
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      details: 'GCRJY Alumni Connect platform initialized with production seed data and settings.',
    },
  });

  console.log('✅ Database successfully seeded with rich GCRJY data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
