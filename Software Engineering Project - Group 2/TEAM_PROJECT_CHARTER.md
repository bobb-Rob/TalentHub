# 👥 Team Portfolio Project Charter
## 4-Person Development Team

**Project Name:** Personal Portfolio Website  
**Team Size:** 4 members  
**Duration:** 6 weeks  
**Difficulty:** Beginner-Friendly  

---

## 🎯 Team Roles & Responsibilities

### 1️⃣ **RobertSon - Project Manager 1** (Overall Leadership)

**Primary Responsibilities:**
- ✓ Overall project coordination and timeline management
- ✓ Sprint planning and daily standup facilitation
- ✓ Stakeholder communication (instructor/client)
- ✓ Risk management and escalation
- ✓ Final project presentation to instructors
- ✓ GitHub repository management (permissions, merges)
- ✓ Overall quality assurance and sign-off

**Weekly Tasks:**
- **Week 1:** Create GitHub org/repo, set up team access, schedule meetings
- **Week 2:** Monitor Navbar/Hero progress, ensure docs are updated
- **Week 3:** Check Projects gallery implementation, verify team communication
- **Week 4:** Review About/Skills sections, manage any blockers
- **Week 5:** Oversee Contact form testing, coordinate final testing
- **Week 6:** Coordinate deployment, prepare final presentation

**Key Deliverables:**
- [ ] GitHub repository with team access
- [ ] Project charter (this document)
- [ ] Weekly status reports
- [ ] Final presentation slides
- [ ] Project retrospective

---

### 2️⃣ **David - Project Manager 2** (Technical Lead & Development Support)

**Primary Responsibilities:**
- ✓ Technical architecture decisions
- ✓ Code review and quality standards
- ✓ Development environment setup (Node.js, dependencies)
- ✓ Build process and deployment pipeline
- ✓ Technical documentation and best practices
- ✓ Troubleshooting and team support
- ✓ Performance optimization

**Weekly Tasks:**
- **Week 1:** Set up development environment, install dependencies, configure Tailwind
- **Week 2:** Review Navbar/Hero code quality, establish coding standards
- **Week 3:** Ensure Projects gallery follows best practices, code review
- **Week 4:** Technical review of About/Skills sections
- **Week 5:** Performance testing, optimization, Lighthouse audit
- **Week 6:** Final deployment, production environment setup

**Key Deliverables:**
- [ ] Development environment guide
- [ ] Code style guide and standards
- [ ] Performance optimization report
- [ ] Deployment playbook
- [ ] Technical documentation

---

### 3️⃣ **Mercy - QA Tester** (Quality Assurance & Testing)

**Primary Responsibilities:**
- ✓ Test planning and test case creation
- ✓ Functional testing (all features)
- ✓ Mobile responsiveness testing
- ✓ Cross-browser testing (Chrome, Firefox, Safari)
- ✓ Accessibility testing (WCAG 2.1 AA)
- ✓ Performance testing and Lighthouse audit
- ✓ Bug reporting and issue tracking
- ✓ Email form testing and validation

**Weekly Tasks:**
- **Week 1:** Create test plan and test cases, prepare testing checklists
- **Week 2:** Test Navbar/Hero on mobile/desktop, report issues
- **Week 3:** Test Projects gallery filters, verify responsive design
- **Week 4:** Test About/Skills sections, check accessibility
- **Week 5:** Test contact form validation, email delivery, perform Lighthouse audit
- **Week 6:** Final regression testing, sign-off checklist

**Key Deliverables:**
- [ ] Test plan document
- [ ] Test cases and checklists
- [ ] Weekly bug reports
- [ ] Performance test results (Lighthouse)
- [ ] Accessibility audit report
- [ ] QA sign-off document

---

### 4️⃣ **Olufems - Developer** (Primary Development)

**Primary Responsibilities:**
- ✓ Feature development and implementation
- ✓ Component development (React)
- ✓ Data management (projects.json, skills.json)
- ✓ Email integration (EmailJS)
- ✓ Bug fixes and technical improvements
- ✓ Code documentation and comments
- ✓ Git commits and branch management

**Weekly Tasks:**
- **Week 1:** Create folder structure, set up data files, initialize components
- **Week 2:** Develop Navbar and Hero components with Tailwind styling
- **Week 3:** Develop Projects section with filters and ProjectCard component
- **Week 4:** Develop About section, skills grid, load skills.json
- **Week 5:** Develop Contact form with validation, EmailJS integration, error handling
- **Week 6:** Fix bugs, optimize code, prepare for deployment

**Key Deliverables:**
- [ ] All React components
- [ ] Data files (projects.json, skills.json)
- [ ] EmailJS integration working
- [ ] Clean, well-commented code
- [ ] Git history showing development process

---

## 📅 Weekly Team Schedule

### **Week 1: Setup & Planning** (5-7 hours total per person)
- **Monday 9 AM:** Team kickoff meeting (30 min)
  - Review project charter
  - Assign tasks
  - Discuss team communication
  
- **Tuesday-Thursday:** Work on assigned tasks
  - RobertSon: GitHub setup
  - David: Environment setup
  - Mercy: Test planning
  - Olufems: Code scaffolding
  
- **Friday 3 PM:** Weekly standup (15 min)
  - Report progress
  - Identify blockers
  - Plan Week 2

### **Week 2: Foundation** (8-10 hours total per person)
- **Monday 9 AM:** Sprint planning (15 min)
- **Daily 5 PM:** Quick 5-minute check-in (async or brief call)
- **Friday 3 PM:** Sprint review & demo (30 min)
  - Show working Navbar & Hero
  - Discuss what worked/didn't

### **Weeks 3-6:** Same structure
- Monday: Sprint planning
- Daily: Async updates (Slack/Teams)
- Friday: Sprint review & demo

---

## 🔄 Collaboration Workflow

### Communication Channels

**GitHub Issues:** 
- Feature requests
- Bug reports
- Code review feedback
```
Example: [Bug] Contact form not validating email
Reported by: Mercy
Assigned to: Olufems
Priority: High
```

**Slack/WhatsApp/Teams:**
- Daily quick updates
- Blocker escalation
- General team chat

**Weekly Meetings:**
- Monday 9 AM: Sprint planning (15 min)
- Friday 3 PM: Sprint review (30 min)

### Git Workflow

```
main branch (production-ready)
  ↓
Week 1-6 development branches:
  - feature/navbar-hero (Olufems)
  - feature/projects-gallery (Olufems)
  - feature/about-skills (Olufems)
  - feature/contact-form (Olufems)
  - bugfix/... (Olufems)

Each branch:
1. Created from main
2. Code reviewed by David
3. Tested by Mercy
4. Merged by RobertSon
5. Deployed to Vercel
```

### Code Review Process

**For every piece of code:**
1. Olufems: Push to feature branch
2. David: Review code quality
   - ✓ Follows style guide
   - ✓ No console errors
   - ✓ Properly commented
3. Mercy: Test functionality
   - ✓ Works on mobile
   - ✓ Accessible
   - ✓ No broken links
4. RobertSon: Approve & merge

---

## 📊 Task Assignment by Component

### **Week 2: Hero & Navbar**
- **Developer (Olufems):** Build Navbar.jsx, Hero.jsx
- **QA (Mercy):** Test navigation, mobile menu, responsive design
- **Tech Lead (David):** Code review, style guide enforcement
- **PM (RobertSon):** Track progress, ensure on schedule

### **Week 3: Projects Gallery**
- **Developer (Olufems):** Build Projects.jsx, ProjectCard.jsx, load projects.json
- **QA (Mercy):** Test filtering, grid layout, image loading
- **Tech Lead (David):** Performance review, optimize images
- **PM (RobertSon):** Manage timeline, track blockers

### **Week 4: About & Skills**
- **Developer (Olufems):** Build About.jsx, SkillsGrid, load skills.json
- **QA (Mercy):** Test responsiveness, grid layout, accessibility
- **Tech Lead (David):** Code quality, structure review
- **PM (RobertSon):** Coordinate with other tasks, ensure no blockers

### **Week 5: Contact Form**
- **Developer (Olufems):** Build Contact.jsx, EmailJS integration, validation
- **QA (Mercy):** Test form submission, email delivery, error handling, accessibility
- **Tech Lead (David):** Security review, error handling patterns
- **PM (RobertSon):** Ensure email setup is complete, manage dependencies

### **Week 6: Testing & Deploy**
- **Developer (Olufems):** Bug fixes, final optimizations
- **QA (Mercy):** Full regression testing, Lighthouse audit, final checklist
- **Tech Lead (David):** Deployment setup, performance optimization
- **PM (RobertSon):** Coordinate deployment, final presentation prep

---

## 📈 Success Metrics

### **Individual Metrics**

**RobertSon (PM1):**
- [ ] On-time sprint delivery (6 weeks)
- [ ] Zero blockers lasting > 24 hours
- [ ] Weekly status reports submitted
- [ ] Successful team coordination
- [ ] Final presentation prepared

**David (PM2/Tech Lead):**
- [ ] Code review completed within 24 hours
- [ ] Zero critical issues in code review
- [ ] Performance targets met (Lighthouse 85+)
- [ ] Deployment successful with zero downtime
- [ ] Technical documentation complete

**Mercy (QA):**
- [ ] Test cases created by Week 1
- [ ] All critical bugs found before deployment
- [ ] 100% feature coverage tested
- [ ] Mobile responsive testing complete
- [ ] Accessibility audit passed (WCAG 2.1 AA)

**Olufems (Developer):**
- [ ] All components built on schedule
- [ ] Code follows team style guide
- [ ] Zero console errors
- [ ] Clean Git commit history
- [ ] Features tested and verified

### **Team Metrics**

✓ All 5 sections working (Hero, Projects, About, Contact, Footer)  
✓ Contact form sends emails successfully  
✓ Mobile responsive design (tested)  
✓ Lighthouse score 85+  
✓ Zero critical bugs on deployment  
✓ All tests passing  
✓ Live on Vercel/Netlify  
✓ Complete documentation  

---

## 🎯 Dependencies & Risks

### **Team Dependencies**

| Task | Depends On | Owner | Timeline |
|------|-----------|-------|----------|
| Navbar | Environment setup | David/Olufems | Week 1-2 |
| Projects | projects.json data | Olufems | Week 3 |
| About | skills.json data | Olufems | Week 4 |
| Contact | EmailJS setup | David/Olufems | Week 5 |
| Deploy | All features complete | Team | Week 6 |

### **Risk Management**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Team member unavailable | Low | High | Backup: Other dev can cover |
| EmailJS setup delay | Low | Medium | Set up early in Week 1 |
| Mobile responsiveness issues | Medium | Medium | Test daily from Week 2 |
| Deployment problems | Low | High | Practice deployment in Week 5 |
| Communication breakdown | Low | High | Daily async updates + weekly meetings |

---

## 📚 Key Documents & Links

**GitHub Repository:**
- Link: `https://github.com/YOUR_ORG/portfolio`
- Main branch: Production code
- Development branches: Feature branches per component

**Shared Documentation:**
- Project Charter: This file
- 6WEEK_PLAN.md: Development timeline
- ROLES_AND_RESPONSIBILITIES.md: This document
- TEST_PLAN.md: Created by Mercy (Week 1)
- DEPLOYMENT_GUIDE.md: Created by David (Week 5)

**Communication:**
- Slack/Teams channel: #portfolio-project
- Weekly meetings: Monday 9 AM, Friday 3 PM
- Escalation: Contact RobertSon immediately

---

## ✅ Team Checklist (Before Week 1 Starts)

**All Team Members:**
- [ ] Read this charter
- [ ] Understand your role
- [ ] Have Node.js installed
- [ ] GitHub account created
- [ ] Added to team repository
- [ ] Familiar with 6WEEK_PLAN.md

**RobertSon:**
- [ ] GitHub repo created
- [ ] Team access configured
- [ ] Meeting schedule set
- [ ] Communication channels established

**David:**
- [ ] Development environment documented
- [ ] Dependencies list prepared
- [ ] Code style guide created
- [ ] Tailwind config ready

**Mercy:**
- [ ] Test plan template prepared
- [ ] Testing tools identified (DevTools, Lighthouse)
- [ ] Accessibility checklist created
- [ ] Bug tracking system set up

**Olufems:**
- [ ] Development environment set up
- [ ] Folder structure ready
- [ ] First component sketched
- [ ] Sample data prepared

---

## 🚀 Ready to Launch!

**Team meeting:** Monday 9 AM Week 1  
**First standup:** Tuesday 5 PM Week 1  
**First demo:** Friday 3 PM Week 1 (Navbar & Hero progress)  
**Deployment:** Friday Week 6  

---

## 📝 Sign-Off

**Project Charter Acknowledged:**

- [ ] RobertSon - Project Manager 1
- [ ] David - Project Manager 2
- [ ] Mercy - QA Tester
- [ ] Olufems - Developer

**Date:** _______________

---

**Team Goal:** Build an excellent portfolio, demonstrate CMP 722 principles, and have fun doing it! 🚀

**Together, you've got this! 💪**
