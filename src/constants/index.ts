//  export const BACKEND_URL = "https://campus-connect-dev.xyz/api/v1"

// export const BACKEND_URL_V2 = "https://campus-connect-dev.xyz/api/v2"
 export const BACKEND_URL = "http://localhost:8000/api/v1"

export const BACKEND_URL_V2 = "http://localhost:8000/api/v2"
export const universities = [
    { "value": "AKTU", "label": "AKTU", "id": "AKTU" },
   
]
export const paperType = [
    {value:'end-sem',label:'Semester exams',id:'end-sem'},
    {value:'st',label:'Sessional Test',id:'st'},
    {value:'put',label:'Pre University Test',id:'put'},
    
    {value:'mid-term',label:'Mid term exams',id:'mid-term'}
]
export const eventCategories = [
    { value: 'hackathon', label: 'Hackathon', id: 'hackathon' },
    { value: 'session', label: 'Session', id: 'session' },
    { value: 'workshop', label: 'Workshop', id: 'workshop' },
    { value: 'contest', label: 'Contest', id: 'contest' },
    { value: 'campaign', label: 'Campaign', id: 'campaign' },
    { value: 'other', label: 'Other', id: 'other' },
    { value: 'ground-work', label: 'Ground Work', id: 'ground-work' },
  ];
export const eventFormTypes = [
    {value:'registration',label:"Registration",id:'registration'},
    {value:'feedback',label:'Feedback',id:'feedback'},
    {value:'other',label:"Other",id:'other'}
]
 export const branches = [
    { value: 'CSE', label: 'Computer Science and Engineering (CORE)', id: 'cse-core' },
      { value: 'ECE', label: 'Electronics and Communication Engineering', id: 'ece' },
   
      { value: 'ME', label: 'Mechanical Engineering', id: 'me' },
      { value: 'CE', label: 'Civil Engineering', id: 'ce' },
    
      { value: 'CHE', label: 'Chemical Engineering', id: 'che' },
      { value: 'BT', label: 'Biotechnology', id: 'bt' },
      { value: 'MT', label: 'Manufacturing Technology', id: 'mt' },
      { value: 'AE', label: 'Aeronautical Engineering', id: 'ae' },
      { value: 'EI', label: 'Electronics and Instrumentation Engineering', id: 'ei' },
      { value: 'EN', label: 'Environmental Engineering', id: 'en' },
      { value: 'FT', label: 'Food Technology', id: 'ft' },
      { value: 'IN', label: 'Instrumentation Engineering', id: 'in' },
      { value: 'AEI', label: 'Applied Electronics and Instrumentation Engineering', id: 'aei' },
      { value: 'CE IT', label: 'Civil Engineering with Information Technology', id: 'ce-it' }
        ]

        export const resourceTypes = [
            {value:'pyq',label:'PYQ',id:'pyq'},
            {value:'notes',label:'NOTES',id:'notes'},
            {value:'question-bank',label:'Question Bank',id:'question-bank'},
            {value:'quantum',label:'Quantum',id:'quantum'},
            {value:'short-notes',label:'Short Notes',id:'short-notes'}
        ]

        export const projectCategories = [
            {value: 'backend', label: 'Backend', id: 'backend'},
            {value: 'frontend', label: 'Frontend', id: 'frontend'},
            {value: 'fullstack', label: 'Full Stack', id: 'fullstack'},
            {value: 'mobile', label: 'Mobile Development', id: 'mobile'},
            {value: 'data-science', label: 'Data Science', id: 'data-science'},
            {value: 'devops', label: 'DevOps', id: 'devops'},
            {value: 'game-dev', label: 'Game Development', id: 'game-dev'},
            {value: 'security', label: 'Cybersecurity', id: 'security'},
            {value: 'embedded', label: 'Embedded Systems', id: 'embedded'},
            {value: 'blockchain', label: 'Blockchain', id: 'blockchain'},
            {value: 'machine-learning', label: 'Machine Learning', id: 'machine-learning'},
            {value: 'artificial-intelligence', label: 'Artificial Intelligence', id: 'artificial-intelligence'},
            {value: 'cloud-computing', label: 'Cloud Computing', id: 'cloud-computing'},
            {value: 'ui-ux', label: 'UI/UX Design', id: 'ui-ux'},
            {value: 'iot', label: 'Internet of Things', id: 'iot'},
            {value: 'ar-vr', label: 'AR/VR', id: 'ar-vr'},
            {value: 'database', label: 'Database Management', id: 'database'},
            {value: 'networking', label: 'Networking', id: 'networking'},
            {value: 'automation', label: 'Automation', id: 'automation'},
            {value: 'quantum-computing', label: 'Quantum Computing', id: 'quantum-computing'},
            {value: 'robotics', label: 'Robotics', id: 'robotics'},
            {value: 'bioinformatics', label: 'Bioinformatics', id: 'bioinformatics'},
            {value: 'fintech', label: 'Fintech', id: 'fintech'}
        ];      
export const navResourceOptions : { title: string; href: string; description: string }[] = [
  {
    title: "PYQ's",
    href: "/resources/pyq",
    description:
      "Previous Year papers of aktu university",
  },
  {
    title: "Question Bank",
    href: "/resources/question-bank",
    description:
      "Question banks subjectwise for each subjects.",
  },
  {
    title: "Lectures",
    href: "/resources/lectures",
    description:
      "Online lectures sorted for you subjectwise and topicwise",
  },
  {
    title: "Notes",
    href: "/resources/notes",
    description: "Subjectwise and chapterwise notes for each year.",
  },
  {
    title: "Short Notes",
    href: "/resources/short-notes",
    description:
      "Short Notes for quick revision",
  },
  {
    title: "Quantum",
    href: "/resources/quantum",
    description:
      "Subjectwise quantum",
  },
]