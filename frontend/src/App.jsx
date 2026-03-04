import { useState, useEffect } from 'react';
import './index.css';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Predefined Data for Skills & Roadmaps
const careerDataMap = {
  "Data Scientist": {
    requiredSkills: ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
    roadmap: [
      { month: "Month 1", tasks: ["Learn Python basics", "Learn SQL", "Practice small datasets"] },
      { month: "Month 2", tasks: ["Learn Machine Learning basics", "Build 1 ML project"] },
      { month: "Month 3", tasks: ["Learn Data Visualization", "Build Portfolio Project"] }
    ]
  },
  "ML Engineer": {
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "Deployment"],
    roadmap: [
      { month: "Month 1", tasks: ["Python Advanced", "ML Basics"] },
      { month: "Month 2", tasks: ["Deep Learning", "TensorFlow"] },
      { month: "Month 3", tasks: ["Deployment basics", "Build ML project"] }
    ]
  },
  "Frontend Developer": {
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    roadmap: [
      { month: "Month 1", tasks: ["Learn HTML & CSS", "Responsive Design"] },
      { month: "Month 2", tasks: ["JavaScript Fundamentals", "DOM Manipulation"] },
      { month: "Month 3", tasks: ["Learn React", "Build Frontend Portfolio"] }
    ]
  },
  "Backend Developer": {
    requiredSkills: ["Node.js", "Express", "Databases", "API Design", "Authentication"],
    roadmap: [
      { month: "Month 1", tasks: ["Learn Node.js basics", "Understand APIs"] },
      { month: "Month 2", tasks: ["Express Framework", "Database Integration (SQL/NoSQL)"] },
      { month: "Month 3", tasks: ["Authentication basics", "Build Backend API Project"] }
    ]
  },
  "Full Stack Developer": {
    requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Databases"],
    roadmap: [
      { month: "Month 1", tasks: ["Frontend Basics (HTML/CSS/JS)", "Introduction to React"] },
      { month: "Month 2", tasks: ["Backend Basics (Node.js/Express)", "Database Basics"] },
      { month: "Month 3", tasks: ["Full Stack Integration", "Deploy Full Stack App"] }
    ]
  },
  "Data Analyst": {
    requiredSkills: ["Excel", "SQL", "Python", "Tableau", "Statistics"],
    roadmap: [
      { month: "Month 1", tasks: ["Advanced Excel", "Basic SQL queries"] },
      { month: "Month 2", tasks: ["Python for Data Analysis", "Basic Statistics"] },
      { month: "Month 3", tasks: ["Data Visualization with Tableau", "Analyze Real World Dataset"] }
    ]
  },
  "Business Analyst": {
    requiredSkills: ["Requirements Gathering", "Agile", "SQL", "Excel", "Communication"],
    roadmap: [
      { month: "Month 1", tasks: ["Learn Requirements Gathering", "Agile Methodologies"] },
      { month: "Month 2", tasks: ["Data Analysis with Excel/SQL", "Process Modeling"] },
      { month: "Month 3", tasks: ["Stakeholder Communication", "Mock Project Documentation"] }
    ]
  },
  "AI Engineer": {
    requiredSkills: ["Python", "Machine Learning", "Deep Learning", "NLP", "Cloud Platforms"],
    roadmap: [
      { month: "Month 1", tasks: ["Advanced Python", "ML & DL Fundamentals"] },
      { month: "Month 2", tasks: ["Natural Language Processing", "Computer Vision Basics"] },
      { month: "Month 3", tasks: ["Cloud Deployment (AWS/GCP)", "Build end-to-end AI Product"] }
    ]
  },
  "Product Manager": {
    requiredSkills: ["Product Strategy", "Agile", "Market Research", "User Experience", "Data Analysis"],
    roadmap: [
      { month: "Month 1", tasks: ["Product Lifecycle", "Market Research Basics"] },
      { month: "Month 2", tasks: ["Agile & Scrum", "Writing PRDs"] },
      { month: "Month 3", tasks: ["User Analytics", "Launch MVP Strategy"] }
    ]
  },
  "Consultant": {
    requiredSkills: ["Problem Solving", "Data Analysis", "Presentation Skills", "Project Management", "Client Communication"],
    roadmap: [
      { month: "Month 1", tasks: ["Frameworks & Problem Solving", "Basic Financial Analysis"] },
      { month: "Month 2", tasks: ["Slide Writing & Presentations", "Storylining"] },
      { month: "Month 3", tasks: ["Client Communication Mock", "Case Interviews Practice"] }
    ]
  },
  "UX/UI Designer": {
    requiredSkills: ["Figma", "Wireframing", "User Research", "Prototyping", "Color Theory"],
    roadmap: [
      { month: "Month 1", tasks: ["UI Fundamentals (Color, Typography)", "Learn Figma"] },
      { month: "Month 2", tasks: ["UX Principles", "User Research & Wireframing"] },
      { month: "Month 3", tasks: ["High Fidelity Prototyping", "Build Design Portfolio"] }
    ]
  },
  "Graphic Designer": {
    requiredSkills: ["Adobe Illustrator", "Photoshop", "Typography", "Color Theory", "Branding"],
    roadmap: [
      { month: "Month 1", tasks: ["Master Design Principles", "Learn Photoshop & Illustrator"] },
      { month: "Month 2", tasks: ["Typography Mastery", "Logo Design"] },
      { month: "Month 3", tasks: ["Brand Identity Creation", "Build Online Portfolio"] }
    ]
  },
  "Product Designer": {
    requiredSkills: ["Figma", "User Research", "Interaction Design", "Business Strategy", "Prototyping"],
    roadmap: [
      { month: "Month 1", tasks: ["Advanced UX/UI", "Interaction Design Principles"] },
      { month: "Month 2", tasks: ["Business Strategy & Needs", "Conducting User Interviews"] },
      { month: "Month 3", tasks: ["End-to-end Product Design", "Portfolio Presentation"] }
    ]
  },
  "General Professional": {
    requiredSkills: ["Communication", "Problem Solving", "Time Management"],
    roadmap: [
      { month: "Month 1", tasks: ["Improve Communication Skills"] },
      { month: "Month 2", tasks: ["Time Management Techniques"] },
      { month: "Month 3", tasks: ["General Problem Solving Scenarios"] }
    ]
  }
};

const mentorMap = {
  "Data Scientist": {
    name: "Rahul Sharma",
    experience: "5 Years in Data Science",
    company: "Tech Company",
    slots: ["Saturday 5 PM", "Sunday 11 AM"]
  },
  "ML Engineer": {
    name: "Anjali Verma",
    experience: "6 Years in AI/ML",
    company: "AI Startup",
    slots: ["Friday 6 PM", "Sunday 4 PM"]
  },
  "Frontend Developer": {
    name: "Arjun Rao",
    experience: "4 Years in Web Development",
    company: "Product Company",
    slots: ["Saturday 3 PM", "Monday 7 PM"]
  },
  "Data Analyst": {
    name: "Sneha Patel",
    experience: "3 Years in Data Analysis",
    company: "Fintech Corp",
    slots: ["Saturday 10 AM", "Sunday 2 PM"]
  },
  "Backend Developer": {
    name: "Vikram Singh",
    experience: "5 Years in Backend Systems",
    company: "E-Commerce Enterprise",
    slots: ["Tuesday 6 PM", "Thursday 7 PM"]
  },
  "Full Stack Developer": {
    name: "Priya Das",
    experience: "4 Years Full Stack",
    company: "Freelance/Consultant",
    slots: ["Wednesday 5 PM", "Friday 4 PM"]
  },
  "Business Analyst": {
    name: "Karan Johar",
    experience: "6 Years in Business Analysis",
    company: "Consulting Firm",
    slots: ["Monday 6 PM", "Saturday 11 AM"]
  },
  "AI Engineer": {
    name: "Ravi Kumar",
    experience: "7 Years in AI Research",
    company: "Tech Giant",
    slots: ["Saturday 4 PM", "Sunday 6 PM"]
  },
  "Product Manager": {
    name: "Neha Gupta",
    experience: "5 Years in Product",
    company: "SaaS Startup",
    slots: ["Tuesday 5 PM", "Wednesday 6 PM"]
  },
  "Consultant": {
    name: "Aman Desai",
    experience: "4 Years Consulting",
    company: "Big 4 Firm",
    slots: ["Saturday 9 AM", "Sunday 10 AM"]
  },
  "UX/UI Designer": {
    name: "Riya Sen",
    experience: "5 Years in Product Design",
    company: "Design Agency",
    slots: ["Friday 5 PM", "Saturday 2 PM"]
  },
  "Graphic Designer": {
    name: "Arun Nair",
    experience: "6 Years in Branding",
    company: "Creative Studio",
    slots: ["Monday 5 PM", "Wednesday 11 AM"]
  },
  "Product Designer": {
    name: "Meera Reddy",
    experience: "5 Years in UX/UI",
    company: "Consumer Tech",
    slots: ["Thursday 6 PM", "Saturday 3 PM"]
  },
  "General Professional": {
    name: "Sanjay Mishra",
    experience: "10 Years in Industry",
    company: "Corporate Mentor",
    slots: ["Saturday 10 AM", "Sunday 10 AM"]
  }
};


function App() {
  const [skills, setSkills] = useState('');
  const [interest, setInterest] = useState('AI');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  // State to track which career is expanded
  const [expandedCareer, setExpandedCareer] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);

  // State for page transitions
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State for Streak system
  const [streak, setStreak] = useState(0);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Authenticate User Anonymously
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Firebase Anonymous Auth Error", error);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Streak Logic: Runs when a user is authenticated
  useEffect(() => {
    if (!firebaseUser) return;

    const fetchStreak = async () => {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        const todayObj = new Date();
        const today = todayObj.toLocaleDateString('en-CA');

        const yesterdayObj = new Date();
        yesterdayObj.setDate(yesterdayObj.getDate() - 1);
        const yesterday = yesterdayObj.toLocaleDateString('en-CA');

        let currentStreak = 0;
        let storedDate = null;

        if (docSnap.exists()) {
          const data = docSnap.data();
          currentStreak = data.streakCount || 0;
          storedDate = data.lastLoginDate;
        }

        // Check condition based on last login date
        if (!storedDate) {
          // First time login
          currentStreak = 1;
        } else {
          if (storedDate === today) {
            // Logged in today, do nothing
          } else if (storedDate === yesterday) {
            // Increment streak
            currentStreak += 1;
          } else {
            // Reset streak
            currentStreak = 1;
          }
        }

        setStreak(currentStreak);

        // Update Firestore
        await setDoc(userRef, {
          streakCount: currentStreak,
          lastLoginDate: today
        }, { merge: true });

      } catch (err) {
        console.error("Error fetching or updating streak from Firestore:", err);
      }
    };

    fetchStreak();
  }, [firebaseUser]);

  // Determine which Badge to show based on streak milestones
  let badgeText = '';
  let badgeClass = '';
  if (streak >= 100) {
    badgeText = 'Elite Learner – Mentor Unlocked';
    badgeClass = 'badge-elite';
  } else if (streak >= 30) {
    badgeText = 'Focused Achiever';
    badgeClass = 'badge-achiever';
  } else if (streak >= 7) {
    badgeText = 'Consistency Beginner';
    badgeClass = 'badge-beginner';
  }

  const handleSuggest = async () => {
    if (!skills.trim() || !interest) {
      setError('Please provide both skills and an interest area.');
      return;
    }
    setError('');
    setLoading(true);
    setSuggestions([]);
    setExpandedCareer(null);
    setSelectedCareer(null);

    try {
      const response = await fetch('http://localhost:3000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills, interest }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations.');
      }

      const data = await response.json();
      setSuggestions(data);
      setIsSubmitted(true);
    } catch (err) {
      setError('Could not connect to the backend server. Make sure it is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (career) => {
    setExpandedCareer(expandedCareer === career ? null : career);
    setSelectedCareer(career);
  };

  const handleBookSession = () => {
    alert("Session Booked Successfully! Mentor will contact you.");
  };

  const handleStartOver = () => {
    setIsSubmitted(false);
    setSuggestions([]);
    setSkills('');
    setInterest('AI');
    setError('');
    setExpandedCareer(null);
    setSelectedCareer(null);
  };

  const renderSkillGap = (career) => {
    const data = careerDataMap[career];
    if (!data || !data.requiredSkills) return null;

    // Convert user skills to lowercase array for matching
    const userSkillsArray = skills.split(',').map(s => s.trim().toLowerCase());

    return (
      <div className="detail-section">
        <h3 className="section-title">Skill Gap Analysis</h3>
        <table className="skill-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.requiredSkills.map((reqSkill, idx) => {
              const isCompleted = userSkillsArray.includes(reqSkill.toLowerCase());
              return (
                <tr key={idx}>
                  <td>{reqSkill}</td>
                  <td>
                    <span className={`status-badge ${isCompleted ? 'status-completed' : 'status-missing'}`}>
                      {isCompleted ? 'Completed' : 'Missing'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderRoadmap = (career) => {
    const data = careerDataMap[career];
    if (!data || !data.roadmap) return null;

    return (
      <div className="detail-section">
        <h3 className="section-title">3-Month Roadmap</h3>
        <div className="roadmap-grid">
          {data.roadmap.map((monthData, idx) => (
            <div key={idx} className="roadmap-card">
              <h4>{monthData.month}</h4>
              <ul>
                {monthData.tasks.map((task, tIdx) => {
                  const queryBase = encodeURIComponent(task + ' best complete tutorial');
                  const searchUrl = `https://www.youtube.com/results?search_query=${queryBase}&sp=CAM%253D`;
                  return (
                    <li key={tIdx}>
                      <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="roadmap-link">
                        {task}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="hero">
        <h1 className="title">Skill2Future</h1>
        <p className="subtitle">Career Recommendation System</p>
      </div>

      <div className="streak-container">
        <div className="streak-card">
          <div className="streak-header">
            <h3>Daily Streak</h3>
            {badgeText && <span className={`streak-badge ${badgeClass}`}>{badgeText}</span>}
          </div>
          <p className="streak-number">🔥 Current Streak: {streak} {streak === 1 ? 'day' : 'days'}</p>
          <div className="progress-wrapper">
            <progress className="streak-progress" value={streak} max={100}></progress>
            <span className="progress-text">{streak}/100 Days</span>
          </div>

          {/* Unlock feature for streak >= 100 */}
          {streak >= 100 && (
            <div className="mentor-unlock-card">
              <h4>🎉 Mentor Guidance Unlocked!</h4>
              <button
                className="btn btn-book mt-4"
                onClick={() => alert("Congratulations! You unlocked a free mentor guidance session.")}
                style={{ width: '100%' }}
              >
                Claim Free Mentor Session
              </button>
            </div>
          )}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="card form-card">
          <div className="form-group">
            <label htmlFor="skills">Your Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              placeholder="e.g. python, excel, react"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="interest">Primary Interest</label>
            <select
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option value="AI">AI</option>
              <option value="Data">Data</option>
              <option value="Web Development">Web Development</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
            </select>
          </div>

          {error && <div className="error">{error}</div>}

          <button
            className="btn"
            onClick={handleSuggest}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Get Career Suggestions'}
          </button>
        </div>
      ) : (
        <div className="results-section">
          <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="results-title" style={{ margin: 0 }}>Your Career Matches</h2>
            <button className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={handleStartOver}>
              Start Over
            </button>
          </div>
          <div className="cards-grid">
            {suggestions.map((item, index) => {
              const isExpanded = expandedCareer === item.career;
              return (
                <div
                  key={index}
                  className={`result-card ${isExpanded ? 'active-card' : ''}`}
                  onClick={() => handleCardClick(item.career)}
                >
                  <div className="match-badge">{item.match} Match</div>
                  <h3 className="career-name">{item.career}</h3>
                  <div className="click-hint">{isExpanded ? 'Hide Details ▲' : 'Click for Details ▼'}</div>

                  {isExpanded && (
                    <div className="expanded-details">
                      {renderSkillGap(item.career)}
                      {renderRoadmap(item.career)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedCareer && (
            <div className="mentor-section mt-8 pt-8 border-t border-gray-200">
              <h2 className="results-title">Learning Roadmap</h2>

              {selectedCareer === "Data Scientist" && (
                <div className="roadmap-static">
                  <h3 className="section-title mt-4 text-indigo-600">Month 1</h3>
                  <p>
                    <a href="https://www.youtube.com/results?search_query=best+complete+python+basics+tutorial&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Learn Python Basics</a>
                    {' and '}
                    <a href="https://www.youtube.com/results?search_query=best+complete+sql+tutorial+for+beginners&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Learn SQL</a>
                  </p>
                  <h3 className="section-title mt-4 text-indigo-600">Month 2</h3>
                  <p><a href="https://www.youtube.com/results?search_query=best+complete+machine+learning+tutorial&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Learn Machine Learning Basics</a></p>
                  <h3 className="section-title mt-4 text-indigo-600">Month 3</h3>
                  <p><a href="https://www.youtube.com/results?search_query=best+complete+data+visualization+tutorial&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Build Portfolio Project</a></p>
                </div>
              )}

              {selectedCareer === "ML Engineer" && (
                <div className="roadmap-static">
                  <h3 className="section-title mt-4 text-indigo-600">Month 1</h3>
                  <p><a href="https://www.youtube.com/results?search_query=best+complete+advanced+python+tutorial&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Advanced Python + ML Basics</a></p>
                  <h3 className="section-title mt-4 text-indigo-600">Month 2</h3>
                  <p><a href="https://www.youtube.com/results?search_query=best+complete+deep+learning+tensorflow+tutorial&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Deep Learning + TensorFlow</a></p>
                  <h3 className="section-title mt-4 text-indigo-600">Month 3</h3>
                  <p><a href="https://www.youtube.com/results?search_query=best+complete+machine+learning+deployment+tutorial&sp=CAM%253D" target="_blank" rel="noopener noreferrer" className="roadmap-link">Deployment + ML Project</a></p>
                </div>
              )}

              <h2 className="results-title mt-8">Mentor Guidance</h2>
              {mentorMap[selectedCareer] ? (
                <div className="mentor-card">
                  <div className="mentor-header">
                    <div className="mentor-avatar">
                      {mentorMap[selectedCareer].name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="mentor-name">{mentorMap[selectedCareer].name}</h3>
                      <p className="mentor-role">{mentorMap[selectedCareer].experience} | {mentorMap[selectedCareer].company}</p>
                    </div>
                  </div>

                  <div className="mentor-slots">
                    <h4>Available Slots:</h4>
                    <div className="slots-container">
                      {mentorMap[selectedCareer].slots.map((slot, sIdx) => (
                        <span key={sIdx} className="slot-badge">{slot}</span>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-book mt-4" onClick={handleBookSession}>
                    Book Session
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p className="font-semibold text-lg">Recommended Mentor: Senior Professional in {selectedCareer}</p>
                  <p className="text-gray-600 mt-2">Suggested: Weekly 1:1 Guidance + Resume Review</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
