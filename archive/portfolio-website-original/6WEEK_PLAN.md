# 🚀 6-Week Portfolio Project Plan
## Beginner-Friendly Edition

**Total Time Commitment:** 43-55 hours  
**Weekly Effort:** 7-10 hours/week  
**Ideal Schedule:** 1-2 hours per weekday, 2-3 hours on weekends

---

## 📊 Quick Overview

| Week | Focus | Deliverable | Time |
|------|-------|-------------|------|
| **1** | Setup & Plan | GitHub repo ready, React initialized | 5-7h |
| **2** | Foundation | Hero & Navbar working & styled | 8-10h |
| **3** | Gallery | Projects displaying with filters | 8-10h |
| **4** | About Section | About & Skills sections complete | 8-10h |
| **5** | Contact | Contact form sending emails | 8-10h |
| **6** | Launch | Testing, optimization, deployed | 6-8h |

---

## 📅 WEEK 1: Setup & Planning (5-7 hours)

### 🎯 Goals
- [ ] Create GitHub repository
- [ ] Initialize React project
- [ ] Install all dependencies
- [ ] Understand the project structure
- [ ] Set up development environment

### 📝 Daily Breakdown

**Monday (1 hour)**
```bash
# Create GitHub repo
1. Go to github.com
2. Click "New repository"
3. Name: "portfolio"
4. Description: "Personal portfolio website"
5. Add README.md
6. Click "Create repository"

# Clone to your computer
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

**Tuesday-Wednesday (2 hours)**
```bash
# Initialize React project
npx create-react-app .

# Install dependencies
npm install react-router-dom tailwindcss zustand react-icons emailjs-com
npm install -D autoprefixer postcss

# Configure Tailwind
npx tailwindcss init -p
```

**Thursday (1 hour)**
- Read: Portfolio_Project_Proposal.md (Sections 1-3)
- Understand: What you're building and why
- Review: Design system (colors, typography, spacing)

**Friday (1-2 hours)**
- Create folder structure (see below)
- Create `.env` file (we'll fill this later)
- First commit to GitHub: "Initial project setup"

### 📁 Folder Structure to Create

```
portfolio/
├── public/
│   └── images/
│       ├── projects/
│       └── avatar.jpg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   └── projects/
│   │       └── ProjectCard.jsx
│   ├── data/
│   │   ├── projects.json
│   │   └── skills.json
│   ├── App.jsx
│   ├── App.css
│   └── index.jsx
├── .env
├── .gitignore
├── package.json
└── README.md
```

### 📌 Checklist
- [ ] GitHub repo created and cloned
- [ ] React project initialized
- [ ] All dependencies installed
- [ ] Folder structure created
- [ ] `.env` file created (empty for now)
- [ ] First commit pushed to GitHub
- [ ] Read project proposal

---

## 📅 WEEK 2: Foundation (8-10 hours)

### 🎯 Goals
- [ ] Build responsive Navbar
- [ ] Build Hero section
- [ ] Add CTA buttons
- [ ] Set up TailwindCSS colors/styling
- [ ] Mobile-responsive design working

### 📝 Daily Breakdown

**Monday-Tuesday (3 hours)**

Create `src/components/common/Navbar.jsx`:
```jsx
import React, { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#1A202C]">Olufems</h1>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          <a href="#home" className="text-gray-700 hover:text-[#14B8A6] transition">Home</a>
          <a href="#projects" className="text-gray-700 hover:text-[#14B8A6] transition">Projects</a>
          <a href="#about" className="text-gray-700 hover:text-[#14B8A6] transition">About</a>
          <a href="#contact" className="text-gray-700 hover:text-[#14B8A6] transition">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg md:hidden">
            <a href="#home" className="block px-4 py-2 hover:bg-gray-100">Home</a>
            <a href="#projects" className="block px-4 py-2 hover:bg-gray-100">Projects</a>
            <a href="#about" className="block px-4 py-2 hover:bg-gray-100">About</a>
            <a href="#contact" className="block px-4 py-2 hover:bg-gray-100">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}
```

**Wednesday-Thursday (3 hours)**

Create `src/components/sections/Hero.jsx`:
```jsx
import React from 'react';
import { HiArrowRight } from 'react-icons/hi';

export function Hero() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-[#1A202C] to-[#2D3748] flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Hi, I'm Olufems
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-lg">
              Full-stack ML engineer focused on NLP and data-efficient AI systems.
            </p>
            <div className="flex gap-4">
              <a 
                href="#projects" 
                className="bg-[#14B8A6] text-white px-6 py-3 rounded-lg hover:scale-105 transition flex items-center gap-2"
              >
                View My Work <HiArrowRight />
              </a>
              <a 
                href="/resume.pdf" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1A202C] transition"
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Avatar - Remove if no image */}
          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 rounded-full bg-[#14B8A6] flex items-center justify-center text-white text-2xl">
              [Add your photo here]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Friday (2 hours)**
- Create `src/App.jsx` to combine Navbar and Hero
- Test on mobile (use Chrome DevTools)
- Commit to GitHub: "Add Hero section and Navbar"

### ✅ Checklist
- [ ] Navbar built and responsive
- [ ] Hero section displays correctly
- [ ] CTA buttons styled
- [ ] TailwindCSS working (colors applied)
- [ ] Mobile menu works on mobile
- [ ] Code committed to GitHub

---

## 📅 WEEK 3: Gallery (8-10 hours)

### 🎯 Goals
- [ ] Create Projects section
- [ ] Build ProjectCard component
- [ ] Load data from projects.json
- [ ] Add tech filters
- [ ] Responsive grid layout

### 📝 Daily Breakdown

**Monday-Tuesday (3 hours)**

Create `src/data/projects.json`:
```json
{
  "projects": [
    {
      "id": "project-001",
      "title": "Cross-Domain Sentiment Analysis",
      "description": "ML framework for e-commerce sentiment analysis",
      "thumbnail": "/images/projects/sentiment.jpg",
      "technologies": ["Python", "RoBERTa", "PyTorch"],
      "liveUrl": "https://demo.example.com",
      "githubUrl": "https://github.com/olufems/sentiment"
    },
    {
      "id": "project-002",
      "title": "Propensity Model System",
      "description": "Recommendation system using collaborative filtering",
      "thumbnail": "/images/projects/recommendation.jpg",
      "technologies": ["LightFM", "Python", "Scikit-learn"],
      "liveUrl": "https://demo2.example.com",
      "githubUrl": "https://github.com/olufems/recommendation"
    },
    {
      "id": "project-003",
      "title": "Data Cleaning Workshop",
      "description": "Educational materials on data preprocessing",
      "thumbnail": "/images/projects/workshop.jpg",
      "technologies": ["Python", "Jupyter", "Pandas"],
      "liveUrl": "https://workshop.example.com",
      "githubUrl": "https://github.com/olufems/workshop"
    },
    {
      "id": "project-004",
      "title": "E-commerce Analytics",
      "description": "Dashboard for tracking sales metrics",
      "thumbnail": "/images/projects/analytics.jpg",
      "technologies": ["React", "Node.js", "MongoDB"],
      "liveUrl": "https://analytics.example.com",
      "githubUrl": "https://github.com/olufems/analytics"
    }
  ]
}
```

**Wednesday (2 hours)**

Create `src/components/projects/ProjectCard.jsx`:
```jsx
import React, { useState } from 'react';
import { HiExternalLink, HiCode } from 'react-icons/hi';

export function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white rounded-lg overflow-hidden shadow-md transition-all ${
        isHovered ? 'scale-105 shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Placeholder Image */}
      <div className="w-full h-48 bg-gradient-to-br from-[#14B8A6] to-[#1A202C] flex items-center justify-center text-white">
        {project.title}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1A202C] mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{project.description}</p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map(tech => (
            <span 
              key={tech}
              className="text-xs bg-[#14B8A6]/10 text-[#14B8A6] px-3 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-[#14B8A6] text-white py-2 rounded text-center hover:bg-[#0D9488] transition flex items-center justify-center gap-2"
          >
            Live <HiExternalLink />
          </a>
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 border-2 border-[#14B8A6] text-[#14B8A6] py-2 rounded text-center hover:bg-[#14B8A6]/10 transition flex items-center justify-center gap-2"
          >
            Code <HiCode />
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Thursday-Friday (3 hours)**

Create `src/components/sections/Projects.jsx`:
```jsx
import React, { useState, useMemo } from 'react';
import projectsData from '../../data/projects.json';
import { ProjectCard } from '../projects/ProjectCard';

export function Projects() {
  const [selectedTech, setSelectedTech] = useState(null);

  const allTechs = useMemo(() => {
    const techs = new Set();
    projectsData.projects.forEach(p => p.technologies.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projectsData.projects;
    return projectsData.projects.filter(p => p.technologies.includes(selectedTech));
  }, [selectedTech]);

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-[#1A202C]">Featured Work</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Projects showcasing my expertise in ML, NLP, and full-stack development.
        </p>

        {/* Tech Filter */}
        <div className="mb-12 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTech(null)}
            className={`px-4 py-2 rounded-full transition ${
              selectedTech === null 
                ? 'bg-[#14B8A6] text-white' 
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#14B8A6]'
            }`}
          >
            All
          </button>
          {allTechs.map(tech => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-4 py-2 rounded-full transition ${
                selectedTech === tech 
                  ? 'bg-[#14B8A6] text-white' 
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#14B8A6]'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### ✅ Checklist
- [ ] projects.json created with 4 sample projects
- [ ] ProjectCard component built
- [ ] Projects section displays
- [ ] Tech filter buttons work
- [ ] Responsive grid (2 cols on desktop, 1 on mobile)
- [ ] Code committed to GitHub

---

## 📅 WEEK 4: About Section (8-10 hours)

### 🎯 Goals
- [ ] Build About section
- [ ] Create Skills grid
- [ ] Load from skills.json
- [ ] Responsive layout
- [ ] Professional styling

### 📝 Daily Breakdown

**Monday-Tuesday (3 hours)**

Create `src/data/skills.json`:
```json
{
  "skillCategories": [
    {
      "category": "Programming Languages",
      "skills": [
        { "name": "Python", "proficiency": "Expert" },
        { "name": "JavaScript", "proficiency": "Proficient" },
        { "name": "SQL", "proficiency": "Proficient" }
      ]
    },
    {
      "category": "ML & AI",
      "skills": [
        { "name": "NLP", "proficiency": "Expert" },
        { "name": "Deep Learning", "proficiency": "Proficient" },
        { "name": "Scikit-learn", "proficiency": "Expert" }
      ]
    },
    {
      "category": "Web Technologies",
      "skills": [
        { "name": "React", "proficiency": "Proficient" },
        { "name": "Node.js", "proficiency": "Proficient" }
      ]
    }
  ]
}
```

**Wednesday-Thursday (3 hours)**

Create `src/components/sections/About.jsx`:
```jsx
import React from 'react';
import skillsData from '../../data/skills.json';

export function About() {
  const getProficiencyColor = (level) => {
    if (level === 'Expert') return 'bg-[#14B8A6]';
    if (level === 'Proficient') return 'bg-[#3B82F6]';
    return 'bg-[#F59E0B]';
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-[#1A202C]">About Me</h2>

        {/* Bio */}
        <div className="mb-12">
          <p className="text-gray-700 text-lg mb-4 leading-relaxed max-w-2xl">
            I'm a postgraduate computing science student at Anchor University Lagos, 
            specializing in natural language processing and machine learning. With 4+ years 
            of experience in data science and AI, I'm passionate about building scalable, 
            data-efficient systems that solve real-world problems.
          </p>
          <a 
            href="/resume.pdf"
            className="inline-block bg-[#1A202C] text-white px-6 py-3 rounded-lg hover:bg-[#2D3748] transition"
          >
            Download Full Resume
          </a>
        </div>

        {/* Skills Grid */}
        <h3 className="text-2xl font-bold mb-8 text-[#1A202C]">Technical Skills</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {skillsData.skillCategories.map((category, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-[#1A202C] mb-4">{category.category}</h4>
              <div className="space-y-3">
                {category.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700">{skill.name}</span>
                      <span className={`text-xs text-white px-2 py-1 rounded ${getProficiencyColor(skill.proficiency)}`}>
                        {skill.proficiency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Friday (2 hours)**
- Update App.jsx to include About
- Test responsive grid
- Commit: "Add About section with skills"

### ✅ Checklist
- [ ] skills.json created with skill categories
- [ ] About section text added
- [ ] Skills grid displays correctly
- [ ] Proficiency levels show
- [ ] 3-column grid on desktop, 1 on mobile
- [ ] Code committed

---

## 📅 WEEK 5: Contact Form (8-10 hours)

### 🎯 Goals
- [ ] Build Contact section
- [ ] Create form with validation
- [ ] Set up EmailJS
- [ ] Test email delivery
- [ ] Handle errors gracefully

### 📝 Daily Breakdown

**Monday (2 hours)**

Set up EmailJS (email service):
```
1. Go to emailjs.com
2. Sign up (free account)
3. Create email service (Gmail recommended)
4. Create email template
5. Copy these IDs:
   - Service ID
   - Template ID
   - Public Key
6. Add to .env file
```

Create `.env` file:
```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

**Tuesday-Wednesday (3 hours)**

Create `src/components/sections/Contact.jsx`:
```jsx
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject required';
    if (!formData.message.trim()) newErrors.message = 'Message required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          to_email: 'your-email@example.com',
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      setMessage('Message sent! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to send. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-[#1A202C]">Get In Touch</h2>
        <p className="text-gray-600 mb-12 text-lg">
          Have a project in mind? Send me a message!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14B8A6] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14B8A6] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14B8A6] ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Project inquiry"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14B8A6] ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell me about your project..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#14B8A6] text-white py-3 rounded-lg hover:bg-[#0D9488] transition disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <HiCheckCircle size={20} />
              <span>{message}</span>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <HiExclamationCircle size={20} />
              <span>{message}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
```

**Thursday-Friday (3 hours)**
- Add Contact to App.jsx
- Create Footer component
- Test form validation locally
- Test email sending
- Commit: "Add Contact form with EmailJS"

### ✅ Checklist
- [ ] EmailJS account created
- [ ] EmailJS credentials in .env
- [ ] Contact form built
- [ ] Validation working
- [ ] Test email received
- [ ] Error messages display
- [ ] Code committed

---

## 📅 WEEK 6: Launch (6-8 hours)

### 🎯 Goals
- [ ] Test everything thoroughly
- [ ] Optimize performance
- [ ] Deploy to Vercel
- [ ] Make sure emails work
- [ ] Final GitHub push

### 📝 Daily Breakdown

**Monday-Tuesday (3 hours)**

Testing checklist:
```
□ Click all navigation links
□ Test Hero section on mobile
□ Test Projects gallery filters
□ Test About section responsiveness
□ Fill out contact form & verify email
□ Test on different browsers (Chrome, Firefox, Safari)
□ Check for console errors
□ Test mobile layout (use DevTools)
```

**Wednesday (2 hours)**

Performance optimization:
```bash
# Build for production
npm run build

# Run Lighthouse audit (local build)
npx lighthouse http://localhost:3000 --view
```

Target scores:
- Performance: 85+
- Accessibility: 90+
- Best Practices: 85+

**Thursday-Friday (2-3 hours)**

Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Add environment variables in Vercel dashboard:
- `REACT_APP_EMAILJS_SERVICE_ID`
- `REACT_APP_EMAILJS_TEMPLATE_ID`
- `REACT_APP_EMAILJS_PUBLIC_KEY`

Final steps:
- Test live site
- Verify email form works on production
- Commit everything: "Final deployment"
- Add link to live portfolio in README.md

### ✅ Checklist
- [ ] All pages tested
- [ ] Mobile responsive verified
- [ ] Form sends emails
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Deployed to Vercel
- [ ] Live URL accessible
- [ ] GitHub repo complete

---

## 🎯 Success Criteria (Week 6 End)

You've succeeded when:

✅ **Functionality:**
- Hero section displays correctly
- Navigation works on mobile & desktop
- Projects gallery shows all 4 projects
- Tech filters work
- About section displays skills
- Contact form sends emails successfully

✅ **Performance:**
- Lighthouse score 85+
- No console errors
- Mobile responsive
- All images load quickly

✅ **Code Quality:**
- Clean, readable code
- Proper folder structure
- Comments where needed
- GitHub history shows your work

✅ **Deployment:**
- Live on Vercel/Netlify
- URL accessible
- Form works on production
- Emails deliver to inbox

---

## 📊 Time Management Tips

### Track Your Progress

```
Week 1: ▓▓▓░░░░░░░░░░░░░░ (17%)
Week 2: ▓▓▓▓▓░░░░░░░░░░░░ (33%)
Week 3: ▓▓▓▓▓▓▓░░░░░░░░░░ (50%)
Week 4: ▓▓▓▓▓▓▓▓▓░░░░░░░░ (67%)
Week 5: ▓▓▓▓▓▓▓▓▓▓▓░░░░░░ (83%)
Week 6: ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░ (100%)
```

### Weekly Schedule Template

```
Monday:    1-2 hours (review week plan, start tasks)
Tuesday:   2 hours (continue implementation)
Wednesday: 1-2 hours (implementation & testing)
Thursday:  2 hours (continue & refine)
Friday:    1-2 hours (wrap up, commit to GitHub)
Weekend:   1-2 hours (final touches, review)
```

---

## 🆘 Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| **EmailJS not sending** | Check .env variables, verify template in EmailJS dashboard |
| **Tailwind styles not applying** | Run `npm start`, check tailwind.config.js paths |
| **Mobile menu not working** | Check z-index value, test with DevTools device mode |
| **Images not loading** | Verify image paths, check public/images folder exists |
| **Form validation not showing** | Check useState, verify error state updates |
| **Lighthouse score low** | Optimize images, minify code, enable caching |

---

## 📚 Resources

- **Docs:** https://react.dev
- **TailwindCSS:** https://tailwindcss.com
- **EmailJS:** https://www.emailjs.com/docs
- **Vercel:** https://vercel.com/docs

---

## 🎉 Final Words

You've got **6 weeks** and everything you need to build an amazing portfolio!

- ✅ Complete specification
- ✅ Week-by-week plan
- ✅ Code templates ready
- ✅ Deployment guide included

**Start Week 1, follow the plan, ship Week 6! 🚀**

---

**Total Estimated Time: 43-55 hours**  
**Per Week: 7-10 hours**  
**Difficulty: Beginner-Friendly**  
**Outcome: Live Portfolio + CMP 722 Grade! 🎓**
