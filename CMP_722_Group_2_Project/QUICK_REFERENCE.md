# Portfolio Project: Quick Reference Guide

## 📚 What You Have

| Document | Purpose | Read When |
|----------|---------|-----------|
| **Portfolio_Project_Proposal.md** | Complete specification, design, requirements | Starting the project, any phase |
| **PROJECT_SETUP_GUIDE.md** | Installation, component templates, code samples | Weeks 1-2, setting up project |
| **EXECUTION_ROADMAP.md** | Sprint-by-sprint plan, testing strategy, timeline | Weekly planning, progress tracking |
| **Portfolio_Project_Proposal.pptx** | Visual summary, presentation to stakeholders | Presenting to instructors |
| **CMP_722_Comprehensive_Summary.md** | Course notes and software engineering principles | Learning context, reference |

---

## 🚀 Start Here (First 30 Minutes)

### 1. Understand the Project
```
Read: Portfolio_Project_Proposal.md → Sections 1-3 (Spec, Design, Components)
Time: 15 minutes
Outcome: Know what you're building and why
```

### 2. Understand the Process
```
Read: Portfolio_Project_Proposal.md → Section 4 (Process Model)
Time: 5 minutes
Outcome: Know how you're building it (Hybrid Incremental)
```

### 3. Understand the Timeline
```
Read: EXECUTION_ROADMAP.md → Sprint-by-Sprint Plan
Time: 10 minutes
Outcome: Know the 8-week schedule and milestones
```

---

## 💻 Week-by-Week Quick Checklist

### Week 1: Planning
- [ ] Read all documentation
- [ ] Gather portfolio content (projects, images, bio)
- [ ] Set up EmailJS account
- [ ] Create GitHub repository

### Week 2: Setup
- [ ] Initialize React project
- [ ] Install all dependencies
- [ ] Configure Tailwind CSS
- [ ] Create directory structure
- [ ] Set up .env file

### Week 3-4: Sprint 1 (MVP)
- [ ] Build Navbar + Hero
- [ ] Build Projects section with filters
- [ ] Test mobile responsiveness
- **End Goal:** Hero + Projects working ✓

### Week 5-6: Sprint 2 (Features)
- [ ] Build About + Skills sections
- [ ] Build Contact form
- [ ] Integrate EmailJS
- [ ] Test form validation
- **End Goal:** All features implemented ✓

### Week 7: Sprint 3 (Polish)
- [ ] Run Lighthouse audit
- [ ] Optimize performance
- [ ] Complete E2E testing
- [ ] Fix accessibility issues

### Week 8: Sprint 4 (Deploy)
- [ ] Deploy to Vercel/Netlify
- [ ] Final QA on production
- [ ] Monitor for 24 hours
- **End Goal:** Live portfolio ✓

---

## 🔧 Essential Commands

### Setup
```bash
npx create-react-app portfolio
cd portfolio
npm install react-router-dom tailwindcss zustand react-icons emailjs-com
npx tailwindcss init -p
```

### Development
```bash
npm start                    # Start dev server (http://localhost:3000)
npm test                     # Run tests
npm run build               # Build for production
npm run build && serve build # Test production build locally
```

### Deployment
```bash
npm install -g vercel       # Install Vercel CLI
vercel login                # Login to Vercel
vercel                      # Deploy
```

---

## 📋 Key Files to Create

### Data Files (src/data/)
```
projects.json          # Array of 4-6 project objects
skills.json           # Array of skill categories
```

### Components (src/components/)
```
common/
  ├── Navbar.jsx       # Navigation with mobile menu
  ├── Footer.jsx       # Footer with social links
  └── Button.jsx       # Reusable button component

sections/
  ├── Hero.jsx         # Hero section with CTA
  ├── Projects.jsx     # Project gallery with filters
  ├── About.jsx        # About section + skills
  └── Contact.jsx      # Contact form with validation

projects/
  └── ProjectCard.jsx  # Single project card component
```

### Configuration
```
.env                   # Environment variables (EmailJS credentials)
tailwind.config.js     # Tailwind configuration
src/App.jsx            # Main app component
```

---

## 🎯 Core Features (DFR-1 to DFR-7)

### ✓ DFR-1: Hero Section
- Big headline + tagline
- Professional avatar/image
- Two CTA buttons ("View My Work", "Download CV")
- Mobile: Stacked layout

### ✓ DFR-2: Project Gallery
- Grid layout (3 cols desktop, 1 col mobile)
- 4-6 projects with thumbnails
- Tech stack badges
- "View Live" and "GitHub" buttons
- Filter by technology

### ✓ DFR-3: About & Skills
- Professional narrative (200-300 words)
- Skills grid organized by category
- Proficiency levels shown
- Resume download link

### ✓ DFR-4: Contact Form
- Name, Email, Subject, Message fields
- Real-time validation
- Error messages displayed
- EmailJS integration
- Success/error notifications

### ✓ DFR-5: Navigation
- Sticky navbar (desktop)
- Hamburger menu (mobile)
- Links to all sections
- Smooth scrolling

### ✓ DFR-6: Performance
- Lighthouse score >= 90
- Optimized images
- Minified CSS/JS
- Lazy loading

### ✓ DFR-7: Non-Functional
- Clean code structure
- Comprehensive documentation
- No console errors
- Mobile responsive
- WCAG 2.1 AA accessible

---

## 🧪 Testing Quick Reference

### Unit Tests (Check Component Rendering)
```bash
npm test -- Hero.test.js
```

### Manual Testing Checklist
```
□ Click all navigation links
□ Submit contact form
□ Test on mobile (DevTools)
□ Check all images load
□ Verify email received
□ Check form validation works
```

### Performance Testing
```bash
npm run build
npx lighthouse https://your-portfolio.com
```

---

## 🔑 EmailJS Setup (5 Minutes)

1. Visit emailjs.com → Sign up (free)
2. Add service (Gmail recommended)
3. Create email template
4. Copy these IDs:
   - Service ID → `REACT_APP_EMAILJS_SERVICE_ID`
   - Template ID → `REACT_APP_EMAILJS_TEMPLATE_ID`
   - Public Key → `REACT_APP_EMAILJS_PUBLIC_KEY`
5. Add to `.env` file

---

## 🎨 Design System (Copy & Paste)

### Colors
```css
primary:   #1A202C  /* Navy - Trust */
accent:    #14B8A6  /* Teal - Energy */
light:     #F7FAFC  /* Off-white - Backgrounds */
dark:      #2D3748  /* Dark gray - Text */
white:     #FFFFFF  /* White - Surfaces */
success:   #10B981  /* Green - Success */
danger:    #EF4444  /* Red - Errors */
```

### Typography
```css
Display:   Poppins Bold 48-36px
Body:      Inter Regular 16px
Captions:  Inter Medium 12px
Line-height: 1.6 (body), 1.2 (display)
```

### Spacing (8px Grid)
```css
xs:  4px    md: 16px    xl: 32px
sm:  8px    lg: 24px    2xl: 48px
```

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **EmailJS not sending** | Check .env credentials; verify template ID; check dashboard for rate limits |
| **Tailwind styles not working** | Run `npm run build`; check tailwind.config.js content paths |
| **Images not showing** | Verify paths in projects.json; check public/images/ folder exists |
| **Form validation not displaying** | Check console for errors; verify state updates; test with React DevTools |
| **Mobile menu not opening** | Verify onClick handler; check z-index on menu; test with DevTools |
| **Lighthouse score low** | Compress images to WebP; lazy load; minify CSS/JS; enable caching |

---

## 📊 CMP 722 Requirement Coverage

Your project demonstrates:

✅ **SPECIFICATION (Proposal)** - 30+ page requirements document  
✅ **DESIGN** - Architecture, database, UI/UX, component specs  
✅ **COMPONENT ANALYSIS** - 5 components selected with justification  
✅ **PROCESS MODEL** - Hybrid Incremental model with rationale  
✅ **VALIDATION** - Testing strategy (unit, integration, E2E, acceptance)  
✅ **EVOLUTION** - Maintenance plan, backlog, monitoring setup  

**Bonus:** Demonstrates all four core process activities in a real project context!

---

## 🚀 Deployment Checklist (Week 8)

Before going live:

- [ ] `npm run build` succeeds (no errors)
- [ ] Lighthouse score >= 90
- [ ] Test form submission → email arrives
- [ ] All images load (no 404s)
- [ ] Mobile responsive
- [ ] No console errors
- [ ] .env variables configured on Vercel/Netlify
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)

---

## 📞 Get Unstuck Fast

### If you're stuck on:

**React concepts:**
- → Read React Docs (https://react.dev)
- → Check PROJECT_SETUP_GUIDE.md (code templates provided)

**Tailwind styling:**
- → Search Tailwind Docs (https://tailwindcss.com)
- → Use online Tailwind playground

**EmailJS integration:**
- → Read PROJECT_SETUP_GUIDE.md (setup steps provided)
- → Check EmailJS documentation

**Testing:**
- → Read EXECUTION_ROADMAP.md (testing section)
- → Look up Jest/React Testing Library docs

**Timeline pressure:**
- → Focus on MVP first (Hero + Projects)
- → Cut nice-to-haves, keep essentials
- → Deploy early, iterate in production

---

## 💡 Pro Tips

1. **Start Small:** Build Hero first, then Projects. Don't try everything at once.

2. **Test Early:** Test responsive design in Week 3, not Week 7.

3. **Data-Driven:** Use projects.json and skills.json so you can update content without code.

4. **Commit Often:** Push to GitHub daily. Makes rollback easy if something breaks.

5. **Optimize Last:** Get it working first, then optimize for performance.

6. **Ask for Feedback:** Show your MVP to instructors in Week 4. Incorporate feedback in Sprints 2-3.

7. **Document As You Go:** Write component comments and README while code is fresh.

---

## 📅 Next Action

**Right now:**
1. Read Portfolio_Project_Proposal.md (30 mins)
2. Create GitHub repo
3. Follow PROJECT_SETUP_GUIDE.md for Week 1-2 setup

**Then:**
Follow EXECUTION_ROADMAP.md sprint-by-sprint for Weeks 3-8

**Result:**
Live portfolio demonstrating all CMP 722 principles! 🎉

---

**Happy coding! You've got this! 💪**
