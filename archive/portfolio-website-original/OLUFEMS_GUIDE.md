# 👨‍💻 Olufems' Guide
## Developer - Feature Development

**Your Role:** Feature development, component creation, bug fixes, and code implementation.

---

## 📌 Your Responsibilities

- ✓ Develop all React components
- ✓ Implement features per specifications
- ✓ Create and manage data files
- ✓ Integrate EmailJS
- ✓ Fix bugs identified by QA
- ✓ Write clean, documented code
- ✓ Commit regularly to Git
- ✓ Collaborate with David on code review

---

## 🎯 Week-by-Week Development

### **Week 1: Setup & Scaffolding** (5-7 hours)

**Monday:**
```bash
# Follow David's DEVELOPMENT_SETUP_GUIDE.md
npm install
npm start
# Verify site loads at http://localhost:3000
```

**Tuesday:**
- [ ] Create folder structure:
  ```
  src/
  ├── components/
  │   ├── common/
  │   ├── sections/
  │   └── projects/
  ├── data/
  │   ├── projects.json
  │   └── skills.json
  ├── App.jsx
  └── index.jsx
  ```

- [ ] Create stub components:
  ```jsx
  // Navbar.jsx
  export function Navbar() {
    return <nav>Navigation</nav>;
  }
  
  // Hero.jsx
  export function Hero() {
    return <section>Hero</section>;
  }
  
  // etc...
  ```

**Wednesday:**
- [ ] Create data files with sample data
- [ ] Link components to App.jsx
- [ ] Verify build works

**Thursday:**
- [ ] First commit to Git
  ```bash
  git checkout -b feature/project-setup
  git add .
  git commit -m "feat: Initial project setup with folder structure"
  git push origin feature/project-setup
  # Create Pull Request
  ```

**Friday:**
- [ ] Get code reviewed by David
- [ ] Merge to main branch
- [ ] Ready for Week 2 development

**Deliverables:**
- [ ] Folder structure created
- [ ] Stub components in place
- [ ] Data files ready
- [ ] First PR merged

---

### **Week 2: Hero & Navbar Components** (8-10 hours)

**Mon-Tue: Navbar Component** (4 hours)

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
          <a href="#home" className="hover:text-[#14B8A6]">Home</a>
          <a href="#projects" className="hover:text-[#14B8A6]">Projects</a>
          <a href="#about" className="hover:text-[#14B8A6]">About</a>
          <a href="#contact" className="hover:text-[#14B8A6]">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg">
            <a href="#home" className="block px-4 py-2">Home</a>
            <a href="#projects" className="block px-4 py-2">Projects</a>
            <a href="#about" className="block px-4 py-2">About</a>
            <a href="#contact" className="block px-4 py-2">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}
```

**Wed-Thu: Hero Component** (3 hours)

Create `src/components/sections/Hero.jsx`:

```jsx
import React from 'react';
import { HiArrowRight } from 'react-icons/hi';

export function Hero() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-[#1A202C] to-[#2D3748] flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Hi, I'm Olufems
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Full-stack ML engineer focused on NLP and data-efficient AI systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#projects" 
                className="bg-[#14B8A6] text-white px-6 py-3 rounded-lg hover:scale-105 transition flex items-center justify-center gap-2"
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

          <div className="hidden md:flex justify-center">
            <div className="w-80 h-80 rounded-full bg-[#14B8A6]/20 border-4 border-[#14B8A6] flex items-center justify-center">
              <p className="text-white text-center">Add photo: public/images/avatar.jpg</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Update App.jsx:**
```jsx
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/sections/Hero';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
```

**Friday:**
- [ ] Get code reviewed by David
- [ ] Get tested by Mercy (mobile/desktop)
- [ ] Fix any issues
- [ ] Merge to main

**Commit:**
```bash
git checkout -b feature/navbar-hero
# Make changes
git commit -m "feat: Add responsive Navbar and Hero components"
git push origin feature/navbar-hero
# Create PR, wait for reviews, merge
```

---

### **Week 3: Projects Gallery** (8-10 hours)

**Monday-Tuesday: ProjectCard Component**

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
      {/* Image */}
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
            className="flex-1 bg-[#14B8A6] text-white py-2 rounded text-center hover:bg-[#0D9488] transition"
          >
            Live <HiExternalLink />
          </a>
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-[#14B8A6] text-[#14B8A6] py-2 rounded hover:bg-[#14B8A6]/10"
          >
            Code <HiCode />
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Wednesday-Thursday: Projects Section**

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

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTech(null)}
            className={`px-4 py-2 rounded-full ${
              selectedTech === null 
                ? 'bg-[#14B8A6] text-white' 
                : 'bg-white border-2 border-gray-300'
            }`}
          >
            All
          </button>
          {allTechs.map(tech => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-4 py-2 rounded-full ${
                selectedTech === tech 
                  ? 'bg-[#14B8A6] text-white' 
                  : 'bg-white border-2 border-gray-300'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Friday:**
- [ ] Get reviewed and tested
- [ ] Fix issues
- [ ] Merge

---

### **Week 4: About & Skills** (8-10 hours)

**Similar process to Week 3:**

Create `src/components/sections/About.jsx`:
- Display narrative text
- Show skills grid (3 columns desktop, 1 mobile)
- Load from skills.json
- Show proficiency levels

Create Footer component as well.

**Commits:**
```bash
git checkout -b feature/about-skills
# Develop components
git commit -m "feat: Add About section with skills grid"
git commit -m "feat: Add Footer component"
```

---

### **Week 5: Contact Form** (8-10 hours)

**Critical:** EmailJS Integration

Create `src/components/sections/Contact.jsx`:

```jsx
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { HiCheckCircle } from 'react-icons/hi';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      console.error('Email error:', error);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            rows="5"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#14B8A6] text-white py-3 rounded-lg hover:bg-[#0D9488]"
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <div className="text-green-600 flex items-center gap-2">
              <HiCheckCircle /> Message sent!
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
```

**Test:**
- [ ] Fill out form
- [ ] Submit
- [ ] Verify email received
- [ ] Test validation errors

---

### **Week 6: Bug Fixes & Optimization** (6-8 hours)

**Monday-Friday:**
- [ ] Fix bugs reported by Mercy
- [ ] Optimize performance
- [ ] Clean up code
- [ ] Add comments
- [ ] Final commits

**Bug Fix Process:**
1. Mercy reports bug via GitHub Issue
2. You create branch: `bugfix/form-validation`
3. Fix the bug
4. Commit and create PR
5. Get reviewed
6. Get tested
7. Merge

---

## 💻 Git Workflow (For All Weeks)

### **Before Starting Feature:**
```bash
git checkout main
git pull origin main
git checkout -b feature/navbar-hero
```

### **While Developing:**
```bash
# Make changes

# Check status
git status

# Add changes
git add .

# Commit frequently (not just at end)
git commit -m "feat: Add Navbar responsive design"
git commit -m "feat: Add mobile menu functionality"

# Push to GitHub
git push origin feature/navbar-hero
```

### **When Ready for Review:**
1. Go to GitHub
2. Create Pull Request
3. Description: What you built, any notes for reviewers
4. Wait for David's code review
5. Wait for Mercy's testing
6. Address feedback
7. RobertSon approves merge

### **After Merge:**
```bash
git checkout main
git pull origin main
# New feature is now in main!
```

---

## 📝 Code Quality Guidelines

**Comment Your Code:**
```jsx
// DO: Clear comments
export function ProjectCard({ project }) {
  // Track hover state for scaling animation
  const [isHovered, setIsHovered] = useState(false);

// DON'T: Obvious comments
const handleChange = (e) => {
  // Set the form data  (obvious!)
  setFormData(prev => ({ ...prev, [name]: value }));
}
```

**Name Variables Clearly:**
```javascript
// DO
const filteredProjects = projects.filter(p => p.tech.includes(selected));

// DON'T
const fp = projects.filter(p => p.t.includes(s));
```

**Handle Errors:**
```javascript
// DO
try {
  await emailjs.send(...);
} catch (error) {
  console.error('Email failed:', error);
  setStatus('error');
}

// DON'T
await emailjs.send(...); // Hope it works!
```

---

## ✅ Your Week 1 Checklist

- [ ] Node.js and npm verified working
- [ ] `npm install` completed
- [ ] `npm start` works (site loads)
- [ ] GitHub repo cloned
- [ ] Folder structure created
- [ ] First branch created and pushed
- [ ] Ready to code Week 2!

---

## 🎯 Success Metrics

**Week 6 Sign-Off:**

- [ ] All components built and working
- [ ] Zero console errors
- [ ] Clean code (reviewed by David)
- [ ] All tests passing (verified by Mercy)
- [ ] Git history showing development process
- [ ] All features implemented per spec
- [ ] Code properly commented
- [ ] Ready for deployment

---

**Remember:** You're the engine that makes this project run. Clean code, frequent commits, and collaboration with the team ensures success! 👨‍💻

**You've got this! 💪**
