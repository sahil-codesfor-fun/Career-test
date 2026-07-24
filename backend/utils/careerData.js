// careerData.js
// Database of careers for dynamic PDF recommendations

const careersDatabase = {
  Engineering: [
    {
      title: "AI Engineer",
      skills: ["Python", "Machine Learning", "Mathematics", "Problem Solving"],
      why: "Excellent logical reasoning and very high technical aptitude align perfectly with building complex AI systems.",
      growth: "★★★★★",
      salary: "₹8 LPA - ₹40 LPA",
      degrees: ["B.Tech CSE (AI & ML)", "B.Tech Computer Science"]
    },
    {
      title: "Software Engineer",
      skills: ["Programming", "System Design", "Logic", "Algorithms"],
      why: "Strong analytical ability and programming potential make you a great fit for software development.",
      growth: "★★★★★",
      salary: "₹6 LPA - ₹35 LPA",
      degrees: ["B.Tech CSE", "BCA", "B.Sc Computer Science"]
    },
    {
      title: "Cyber Security Engineer",
      skills: ["Networking", "Ethical Hacking", "Analytical Thinking", "Attention to Detail"],
      why: "Your high attention to detail and problem-solving skills are ideal for protecting digital infrastructure.",
      growth: "★★★★★",
      salary: "₹7 LPA - ₹30 LPA",
      degrees: ["B.Tech Cyber Security", "B.Tech CSE"]
    },
    {
      title: "Data Scientist",
      skills: ["Statistics", "Python", "Data Analysis", "Critical Thinking"],
      why: "High numerical ability and analytical thinking make you suitable for extracting insights from large data.",
      growth: "★★★★★",
      salary: "₹8 LPA - ₹35 LPA",
      degrees: ["B.Tech Data Science", "B.Sc Statistics"]
    },
    {
      title: "Robotics Engineer",
      skills: ["Mechanics", "Electronics", "Programming", "Innovation"],
      why: "A strong mix of technical interest and scientific aptitude prepares you well for automation and robotics.",
      growth: "★★★★☆",
      salary: "₹7 LPA - ₹25 LPA",
      degrees: ["B.Tech Robotics", "B.Tech Mechatronics"]
    },
    {
      title: "Cloud Engineer",
      skills: ["Cloud Platforms", "Networking", "Linux", "Security"],
      why: "Your logical reasoning and structural thinking align with managing large-scale cloud architectures.",
      growth: "★★★★★",
      salary: "₹8 LPA - ₹30 LPA",
      degrees: ["B.Tech Cloud Computing", "B.Tech CSE"]
    },
    {
      title: "Mechanical Engineer",
      skills: ["Physics", "Design", "Mathematics", "Analytical Thinking"],
      why: "Your scientific aptitude and practical problem-solving skills are a strong match for mechanical design.",
      growth: "★★★★☆",
      salary: "₹4 LPA - ₹20 LPA",
      degrees: ["B.Tech Mechanical Engineering"]
    }
  ],
  Medical: [
    {
      title: "Doctor (MBBS)",
      skills: ["Biology", "Empathy", "Decision Making", "Stamina"],
      why: "High scientific aptitude and strong decision-making skills under pressure are crucial for medical practice.",
      growth: "★★★★★",
      salary: "₹10 LPA - ₹50+ LPA",
      degrees: ["MBBS", "MD / MS"]
    },
    {
      title: "Dentist",
      skills: ["Biology", "Precision", "Patience", "Communication"],
      why: "Good scientific knowledge combined with precision and focus makes dentistry a great fit.",
      growth: "★★★★☆",
      salary: "₹5 LPA - ₹25 LPA",
      degrees: ["BDS", "MDS"]
    },
    {
      title: "Pharmacist",
      skills: ["Chemistry", "Attention to Detail", "Research", "Memory"],
      why: "Your scientific curiosity and meticulous nature are perfect for pharmaceutical sciences.",
      growth: "★★★★☆",
      salary: "₹4 LPA - ₹15 LPA",
      degrees: ["B.Pharm", "M.Pharm", "Pharm.D"]
    },
    {
      title: "Agriculture Scientist",
      skills: ["Biology", "Research", "Environmental Science", "Data Analysis"],
      why: "A strong interest in life sciences and research makes agricultural innovation a promising path.",
      growth: "★★★★☆",
      salary: "₹5 LPA - ₹20 LPA",
      degrees: ["B.Sc Agriculture", "M.Sc Agriculture"]
    },
    {
      title: "Forensic Scientist",
      skills: ["Analytical Thinking", "Chemistry", "Observation", "Logic"],
      why: "Excellent analytical ability and attention to detail are critical for forensic investigations.",
      growth: "★★★☆☆",
      salary: "₹4 LPA - ₹18 LPA",
      degrees: ["B.Sc Forensic Science", "M.Sc Forensic Science"]
    },
    {
      title: "Physiotherapist",
      skills: ["Anatomy", "Empathy", "Physical Endurance", "Communication"],
      why: "Your interpersonal skills and understanding of human biology make you suited for physical rehabilitation.",
      growth: "★★★★☆",
      salary: "₹3 LPA - ₹15 LPA",
      degrees: ["BPT", "MPT"]
    }
  ],
  Commerce: [
    {
      title: "Chartered Accountant",
      skills: ["Accounting", "Numerical Ability", "Taxation", "Law"],
      why: "Exceptional numerical ability and analytical thinking are the core requirements for high-level accounting.",
      growth: "★★★★★",
      salary: "₹8 LPA - ₹30+ LPA",
      degrees: ["B.Com", "CA Certification"]
    },
    {
      title: "Investment Banker",
      skills: ["Finance", "Data Analysis", "Communication", "High Stress Tolerance"],
      why: "Strong numerical ability combined with decision-making skills positions you well for high-stakes finance.",
      growth: "★★★★★",
      salary: "₹12 LPA - ₹50+ LPA",
      degrees: ["BBA Finance", "MBA Finance"]
    },
    {
      title: "Business Analyst",
      skills: ["Data Interpretation", "Communication", "Problem Solving", "Strategy"],
      why: "Your blend of analytical thinking and communication skills is perfect for bridging business and technology.",
      growth: "★★★★★",
      salary: "₹6 LPA - ₹25 LPA",
      degrees: ["BBA Business Analytics", "MBA"]
    },
    {
      title: "Marketing Manager",
      skills: ["Creativity", "Communication", "Psychology", "Strategy"],
      why: "High creativity and strong communication skills are essential for designing successful marketing campaigns.",
      growth: "★★★★☆",
      salary: "₹5 LPA - ₹25 LPA",
      degrees: ["BBA Marketing", "MBA Marketing"]
    },
    {
      title: "HR Manager",
      skills: ["Communication", "Empathy", "Leadership", "Conflict Resolution"],
      why: "Your strong interpersonal and leadership skills make you naturally suited for human resource management.",
      growth: "★★★★☆",
      salary: "₹5 LPA - ₹20 LPA",
      degrees: ["BBA HR", "MBA HR"]
    },
    {
      title: "Entrepreneur",
      skills: ["Leadership", "Risk Management", "Innovation", "Resilience"],
      why: "High leadership potential and decision-making abilities are the key drivers for successful entrepreneurship.",
      growth: "★★★★★",
      salary: "Variable / High Potential",
      degrees: ["BBA Entrepreneurship", "Any Degree"]
    }
  ],
  Humanities: [
    {
      title: "Psychologist",
      skills: ["Empathy", "Communication", "Observation", "Critical Thinking"],
      why: "Your high emotional intelligence and analytical thinking make you highly suited for understanding human behavior.",
      growth: "★★★★☆",
      salary: "₹4 LPA - ₹20 LPA",
      degrees: ["B.A. Psychology", "M.A. Clinical Psychology"]
    },
    {
      title: "Lawyer",
      skills: ["Debate", "Logical Reasoning", "Research", "Public Speaking"],
      why: "Excellent logical reasoning and communication skills are the foundation of a successful legal career.",
      growth: "★★★★★",
      salary: "₹6 LPA - ₹40+ LPA",
      degrees: ["BA LLB", "BBA LLB", "LLM"]
    },
    {
      title: "Journalist",
      skills: ["Writing", "Investigation", "Communication", "Curiosity"],
      why: "Strong communication and a high degree of curiosity align perfectly with investigative journalism.",
      growth: "★★★☆☆",
      salary: "₹3 LPA - ₹15 LPA",
      degrees: ["B.A. Journalism & Mass Comm."]
    },
    {
      title: "Fashion Designer",
      skills: ["Creativity", "Drawing", "Trend Analysis", "Innovation"],
      why: "Exceptional creativity and a strong aesthetic sense make you a great fit for the design industry.",
      growth: "★★★★☆",
      salary: "₹4 LPA - ₹25 LPA",
      degrees: ["B.Des Fashion Design"]
    },
    {
      title: "Economist",
      skills: ["Data Analysis", "Mathematics", "Research", "Policy Making"],
      why: "Your analytical ability and interest in societal structures are perfect for economic research and policy.",
      growth: "★★★★☆",
      salary: "₹6 LPA - ₹25 LPA",
      degrees: ["B.A. Economics", "M.A. Economics"]
    },
    {
      title: "Civil Services (IAS/IPS)",
      skills: ["Leadership", "Decision Making", "General Knowledge", "Dedication"],
      why: "Strong leadership, decision-making, and analytical skills are essential for top-tier government administration.",
      growth: "★★★★★",
      salary: "₹10 LPA - ₹25 LPA + Perks",
      degrees: ["B.A. Political Science", "Any Degree"]
    }
  ],
  Class10: [
    {
      title: "Science (PCM)",
      skills: ["Mathematics", "Physics", "Logical Reasoning", "Problem Solving"],
      why: "High numerical and logical abilities indicate strong potential in engineering, architecture, and technology.",
      growth: "★★★★★",
      salary: "N/A (Stream Selection)",
      degrees: ["B.Tech", "B.Arch", "B.Sc"]
    },
    {
      title: "Science (PCB)",
      skills: ["Biology", "Chemistry", "Observation", "Memory"],
      why: "A strong scientific aptitude and interest in life sciences make this the right path for medical careers.",
      growth: "★★★★★",
      salary: "N/A (Stream Selection)",
      degrees: ["MBBS", "BDS", "B.Pharm", "B.Sc Agriculture"]
    },
    {
      title: "Commerce",
      skills: ["Numbers", "Economics", "Business Logic", "Accounting"],
      why: "Good numerical ability and analytical thinking are perfect for finance, business, and accounting.",
      growth: "★★★★★",
      salary: "N/A (Stream Selection)",
      degrees: ["B.Com", "BBA", "CA", "CS"]
    },
    {
      title: "Humanities / Arts",
      skills: ["Communication", "Creativity", "Critical Thinking", "Social Science"],
      why: "High creativity and communication skills align well with law, psychology, design, and media.",
      growth: "★★★★☆",
      salary: "N/A (Stream Selection)",
      degrees: ["BA", "BA LLB", "B.Des", "BFA"]
    },
    {
      title: "Diploma / Polytechnic",
      skills: ["Practical Skills", "Technical Interest", "Execution", "Hands-on Work"],
      why: "A preference for practical, hands-on learning makes technical diploma courses a fast track to a career.",
      growth: "★★★☆☆",
      salary: "N/A (Stream Selection)",
      degrees: ["Diploma in Engineering"]
    }
  ],
  Below10: [
    {
      title: "Engineer / Technologist",
      skills: ["Math", "Science", "Curiosity", "Building Things"],
      why: "You enjoy solving puzzles and understanding how things work, showing early signs of an engineering mindset.",
      growth: "★★★★★",
      salary: "High Potential",
      degrees: ["Focus on Math & Science"]
    },
    {
      title: "Doctor / Healthcare Professional",
      skills: ["Science", "Helping Others", "Observation", "Care"],
      why: "Your interest in biology and helping others indicates a natural inclination towards medical sciences.",
      growth: "★★★★★",
      salary: "High Potential",
      degrees: ["Focus on Science (Biology)"]
    },
    {
      title: "Artist / Designer",
      skills: ["Drawing", "Imagination", "Colors", "Expression"],
      why: "You are highly imaginative and love expressing ideas visually, showing great potential in creative fields.",
      growth: "★★★★☆",
      salary: "High Potential",
      degrees: ["Focus on Arts & Humanities"]
    },
    {
      title: "Entrepreneur / Leader",
      skills: ["Speaking", "Organizing", "Ideas", "Confidence"],
      why: "You naturally take charge of group activities and have great ideas, which are the foundations of leadership.",
      growth: "★★★★★",
      salary: "High Potential",
      degrees: ["Focus on All Subjects & Extracurriculars"]
    }
  ]
};

// Helper function to get category based on test title
function getCategoryFromTestTitle(title) {
  const t = title.toLowerCase();
  if (t.includes('engineer')) return 'Engineering';
  if (t.includes('medic') || t.includes('life')) return 'Medical';
  if (t.includes('commerce') || t.includes('business')) return 'Commerce';
  if (t.includes('humanities') || t.includes('arts')) return 'Humanities';
  if (t.includes('10+1') || t.includes('10+2') || t.includes('11') || t.includes('12')) {
    // If it's a generic 11/12th test, return Engineering as default if we don't know the stream, 
    // but ideally the test title is more specific. We'll fallback to a mix or Engineering.
    return 'Engineering'; 
  }
  if (t.includes('1st') || t.includes('10th') || t.includes('1-10')) return 'Class10';
  if (t.includes('below')) return 'Below10';
  
  // Default fallback
  return 'Engineering';
}

module.exports = {
  careersDatabase,
  getCategoryFromTestTitle
};
