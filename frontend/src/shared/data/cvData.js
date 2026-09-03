/**
 * Centralized CV/Resume data structure.
 *
 * This is the single source of truth for the public CV page.
 * The future Admin editor will replace this with API data
 * without requiring any changes to the CV UI components.
 *
 * To integrate with an API:
 *   const [cvData, setCvData] = useState(defaultCVData)
 *   useEffect(() => { fetchCV().then(setCvData) }, [])
 *   Then pass cvData to <CVPage data={cvData} />
 */

const defaultCVData = {
  personal: {
    name: 'Desalegn Kasaye',
    title: 'Full-Stack Developer',
    photo: '/BDU1601297.png',
    location: 'Bahir Dar, Ethiopia',
    phone: '0908720092',
    email: 'desalegnky827@gmail.com',
    github: 'https://github.com/Degky827/',
    linkedin: 'https://www.linkedin.com/in/desiye-dev/',
    portfolio: 'https://modernize-portifo.vercel.app/',
  },

  summary:
    'Computer Science student and full-stack developer focused on building modern web and cross-platform mobile applications. Experienced in developing scalable software solutions using modern frontend, backend, mobile, and database technologies. Interested in clean architecture, reliable systems, performance, and creating practical digital products that solve real-world problems.',

  skills: {
    frontend: [
      'React',
      'TypeScript',
      'JavaScript',
      'Vite',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Framer Motion',
      'Three.js',
      'React Three Fiber',
    ],
    backend: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'JWT Authentication',
      'Microservices Architecture',
    ],
    mobile: ['Flutter', 'Dart', 'Riverpod', 'GoRouter', 'Dio'],
    databases: ['PostgreSQL', 'MongoDB', 'Prisma', 'Firebase'],
    devops: [
      'Git',
      'GitHub',
      'Docker',
      'Nginx',
      'GitHub Actions',
      'RabbitMQ',
      'Redis',
      'Linux',
      'Postman',
    ],
  },

  experience: [
    {
      id: 'exp-1',
      title: 'Software Developer Intern',
      company: 'Askuals Link',
      location: 'Bahir Dar, Ethiopia',
      startDate: '2026-01',
      endDate: null,
      current: true,
      bullets: [
        'Contributing to the development of digital transport-service applications using Flutter and modern backend technologies.',
        'Working on the Menged Transport Driver App and related transport-service workflows.',
        'Developing and integrating backend services using Node.js, Express.js, PostgreSQL, Prisma, and REST APIs.',
        'Working with microservice architecture and asynchronous service communication using RabbitMQ.',
        'Contributing to containerized development and deployment workflows using Docker.',
      ],
    },
  ],

  projects: [
    {
      id: 'proj-1',
      name: 'Menged Transport Driver App',
      description:
        'A digital transport-service platform designed to streamline driver applications, licensing workflows, document submission, verification, citations, and payment-related processes.',
      technologies: [
        'Flutter',
        'Dart',
        'Node.js',
        'Express.js',
        'PostgreSQL',
        'Prisma',
        'RabbitMQ',
        'Docker',
      ],
      highlights: [
        'Driver application workflows',
        'Digital document submission',
        'License-related processes',
        'Verification workflows',
        'Backend service integration',
        'Microservice architecture',
      ],
      url: null,
      github: null,
      featured: true,
    },
    {
      id: 'proj-2',
      name: '3D Interactive Developer Portfolio',
      description:
        'An interactive developer portfolio combining modern web development with immersive 3D experiences to showcase projects, skills, experience, and professional work.',
      technologies: [
        'React',
        'TypeScript',
        'Three.js',
        'React Three Fiber',
        'Framer Motion',
        'Tailwind CSS',
      ],
      highlights: [
        'Interactive 3D experience',
        'Responsive UI',
        'Motion-based interactions',
        'Modern component architecture',
        'Developer-focused visual design',
      ],
      url: 'https://modernize-portifo.vercel.app/',
      github: 'https://github.com/Degky827/',
      featured: true,
    },
    {
      id: 'proj-3',
      name: 'BDU-Guide — Indoor Navigation',
      description:
        'A cross-platform mobile application designed to help students navigate indoor locations within Bahir Dar University.',
      technologies: ['Flutter', 'Dart', 'Firebase'],
      highlights: [
        'Mobile application development',
        'Indoor navigation concept',
        'Cross-platform UI',
        'Firebase integration',
      ],
      url: null,
      github: null,
      featured: false,
    },
    {
      id: 'proj-4',
      name: 'Digital Grade-Report Locker',
      description:
        'A mobile-focused digital solution for securely managing and accessing academic grade-report information.',
      technologies: ['Flutter', 'Dart', 'Firebase'],
      highlights: [
        'Mobile application development',
        'Secure data management',
        'Academic information system',
      ],
      url: null,
      github: null,
      featured: false,
    },
  ],

  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science',
      institution: 'Bahir Dar University',
      location: 'Bahir Dar, Ethiopia',
      startDate: '2022',
      endDate: '2027',
      expected: true,
      description: null,
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      name: 'INSA Cyber Talent Summer Camp 2026',
      organization: 'INSA',
      track: 'Development & Emerging Technologies Track',
      date: null,
      url: null,
    },
  ],

  achievements: [
    {
      id: 'ach-1',
      title: 'Selected for INSA Cyber Talent Summer Camp 2026',
      description: 'Development & Emerging Technologies Track.',
    },
    {
      id: 'ach-2',
      title: 'Practical software development experience',
      description: 'Through internship work at Askuals Link.',
    },
    {
      id: 'ach-3',
      title: 'Cross-domain technical experience',
      description:
        'Experience working across web, mobile, backend, databases, and distributed service architecture.',
    },
  ],

  languages: [
    { id: 'lang-1', language: 'Amharic', proficiency: 'Native' },
    { id: 'lang-2', language: 'English', proficiency: 'Professional Working Proficiency' },
  ],
}

export default defaultCVData
