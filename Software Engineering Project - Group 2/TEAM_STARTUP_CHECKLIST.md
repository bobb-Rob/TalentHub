# ✅ Team Startup Checklist
## Before Week 1 Begins

---

## 📋 Team Member Responsibilities

### **RobertSon - Project Manager 1**

**Before Week 1:**
- [ ] Read TEAM_PROJECT_CHARTER.md
- [ ] Read ROBERTSONS_GUIDE.md
- [ ] Create GitHub organization (if needed) or repository
- [ ] Add David, Mercy, Olufems as collaborators
- [ ] Set branch protection rules (require reviews)
- [ ] Create Slack/Teams channel: #portfolio-project
- [ ] Send team charter to everyone
- [ ] Schedule Monday 9 AM meeting
- [ ] Send calendar invite for Friday 3 PM weekly standup
- [ ] Confirm all team members have access to GitHub

**First Email to Team:**
```
Subject: Portfolio Project - Team Kickoff Monday 9 AM

Hi Team,

Excited to build the portfolio project together! Here's what we're doing:

Team:
- RobertSon (Project Manager 1) - Overall coordination
- David (Project Manager 2/Tech Lead) - Technical leadership
- Mercy (QA Tester) - Quality assurance
- Olufems (Developer) - Feature development

Timeline: 6 weeks
Target: Professional portfolio + CMP 722 grade ✓

Documents to Read:
1. TEAM_PROJECT_CHARTER.md (everyone)
2. Your specific role guide:
   - Robertson: ROBERTSONS_GUIDE.md
   - David: DAVIDS_GUIDE.md
   - Mercy: MERCYS_GUIDE.md
   - Olufems: OLUFEMS_GUIDE.md
3. TEAM_COLLABORATION_GUIDE.md (everyone)

Meeting Schedule:
- Monday 9 AM: Sprint planning (15 min)
- Friday 3 PM: Sprint review & demo (30 min)
- Daily: Async updates in Slack

GitHub Repo: [Link]
Slack Channel: #portfolio-project

Let's build something great! 🚀

-RobertSon
```

---

### **David - Project Manager 2 / Tech Lead**

**Before Week 1:**
- [ ] Read TEAM_PROJECT_CHARTER.md
- [ ] Read DAVIDS_GUIDE.md
- [ ] Install Node.js locally (verify version >= 16)
- [ ] Create DEVELOPMENT_SETUP_GUIDE.md
- [ ] Create CODE_STYLE_GUIDE.md
- [ ] Install recommended VSCode extensions:
  - [ ] ES7+ React/Redux/React-Native snippets
  - [ ] Prettier (code formatter)
  - [ ] ESLint
  - [ ] Tailwind CSS IntelliSense
- [ ] Test `npm install` in template folder
- [ ] Test `npm start` works
- [ ] Document any setup issues
- [ ] Prepare list of dependencies needed

**First Message to Team:**
```
David: @channel

Development environment ready! Here's what you need:

1. Install Node.js from nodejs.org (v16+)
2. Download DEVELOPMENT_SETUP_GUIDE.md from GitHub
3. Follow steps to set up your machine
4. Run: npm install && npm start
5. Verify site loads at http://localhost:3000

I'll help anyone stuck on setup Monday morning.

Also read CODE_STYLE_GUIDE.md so we code consistently.

-David
```

---

### **Mercy - QA Tester**

**Before Week 1:**
- [ ] Read TEAM_PROJECT_CHARTER.md
- [ ] Read MERCYS_GUIDE.md
- [ ] Install Chrome DevTools (F12 in Chrome)
- [ ] Install WAVE accessibility extension
- [ ] Get familiar with Lighthouse (in DevTools)
- [ ] Create TEST_PLAN.md document
- [ ] Create testing spreadsheet for bug tracking
- [ ] Create ACCESSIBILITY_CHECKLIST.md
- [ ] Create BROWSER_COMPATIBILITY.md
- [ ] Test DevTools device emulation on test website

**First Message to Team:**
```
Mercy: @channel

QA plan ready! I'll test everything thoroughly.

Here's my testing strategy:
- Functional testing (features work)
- Mobile responsiveness (iPhone, Android, iPad)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility (WCAG 2.1 AA compliance)
- Performance (Lighthouse audits)

I'll report all issues on GitHub as they're found.

Week 1: I'm creating detailed test cases for each feature.

Questions? Ask me in #portfolio-project 🧪

-Mercy
```

---

### **Olufems - Developer**

**Before Week 1:**
- [ ] Read TEAM_PROJECT_CHARTER.md
- [ ] Read OLUFEMS_GUIDE.md
- [ ] Install Node.js (version >= 16)
- [ ] Clone GitHub repository
- [ ] Run `npm install`
- [ ] Run `npm start`
- [ ] Verify site loads at http://localhost:3000
- [ ] Install VSCode extensions (from David's list)
- [ ] Create feature branch for Week 1
- [ ] Get familiar with project structure
- [ ] Review React basics (30 min quick refresh)
- [ ] Verify Git basics (clone, commit, push)

**First Message to Team:**
```
Olufems: Dev environment ready! 

Completed:
✓ Node.js installed
✓ Repo cloned
✓ npm install working
✓ npm start works
✓ Site loads at localhost:3000

Ready to start development Monday!

I'll follow the OLUFEMS_GUIDE.md for Week 1 setup tasks.

-Olufems
```

---

## 🚀 Week 1 Kickoff Tasks

### **Monday 9 AM - First Team Meeting**

**Agenda (15 minutes):**
1. RobertSon: Welcome, agenda for week
2. David: Tech setup overview
3. Mercy: Testing approach
4. Olufems: Development schedule
5. All: Any questions?

**Confirm:**
- [ ] Everyone can access GitHub
- [ ] Everyone has development environment set up
- [ ] Everyone understands their role
- [ ] Communication channel working
- [ ] Sprint goals clear

---

## 📱 Communication Setup

### **Slack/Teams Channel Creation**

**Channel Name:** #portfolio-project

**Channel Description:**
```
4-person team building a portfolio website for CMP 722.

Team: RobertSon (PM1), David (PM2/Tech), Mercy (QA), Olufems (Dev)
Timeline: 6 weeks
Goal: Professional portfolio + CMP 722 grade
```

**Channel Settings:**
- [ ] Notifications: All mentions
- [ ] Pinned messages: Project charter, role guides
- [ ] Topic: "Personal Portfolio Project - 6 Week Sprint"

### **Daily Standup Format**

Post in #portfolio-project **daily at 5 PM** (or when done for the day):

```
Name: [Your name]
Done: [What I accomplished today]
Doing: [What I'll work on tomorrow]
Blocker: [Any issues? Or "None"]
```

---

## 📊 GitHub Setup

### **Repository Configuration**

**Settings to Configure:**
- [ ] Branch protection on `main`
  - [ ] Require pull request reviews (1 approval)
  - [ ] Require status checks to pass
  - [ ] Dismiss stale PR approvals
- [ ] Add team members as collaborators
- [ ] Create GitHub Project board (optional)
- [ ] Create issue templates for bugs

**Branch Naming Convention:**
```
feature/component-name     (new features)
bugfix/issue-description   (bug fixes)
docs/what-changed         (documentation)
```

**Example Branches:**
- `feature/navbar`
- `feature/hero-section`
- `bugfix/form-validation`
- `docs/setup-guide`

---

## 📚 Required Reading (Do This Now!)

**Everyone:**
- [ ] TEAM_PROJECT_CHARTER.md (30 min)
- [ ] TEAM_COLLABORATION_GUIDE.md (20 min)
- [ ] 6WEEK_PLAN.md (15 min overview)

**Your Role-Specific:**
- [ ] RobertSon: ROBERTSONS_GUIDE.md (30 min)
- [ ] David: DAVIDS_GUIDE.md (30 min)
- [ ] Mercy: MERCYS_GUIDE.md (30 min)
- [ ] Olufems: OLUFEMS_GUIDE.md (30 min)

**Total Time:** ~2.5 hours before Week 1 starts

---

## ✅ Pre-Week 1 Verification

### **RobertSon Checks:**
- [ ] GitHub repo created and accessible to all
- [ ] Slack channel created and all members added
- [ ] Meeting calendar invites sent to team
- [ ] Team charter distributed
- [ ] All team members confirmed ready

**Verification Message:**
```
RobertSon: @channel let me verify everyone's ready:

✓ GitHub access?
✓ Development environment set up?
✓ Read team charter?
✓ Ready for Monday 9 AM kickoff?

React with ✓ when ready!
```

### **David Checks:**
- [ ] Development setup guide distributed
- [ ] All team members have working Node.js
- [ ] npm install works for everyone
- [ ] npm start works for everyone
- [ ] Code style guide reviewed

**Verification Message:**
```
David: @channel dev setup check:

Everyone run this and let me know it works:
npm install && npm start

Then visit: http://localhost:3000

React with ✓ when you see the site load!
```

### **Mercy Checks:**
- [ ] Test plan created
- [ ] Testing tools installed (DevTools, WAVE, Lighthouse)
- [ ] Test cases ready
- [ ] Bug tracking system set up

**Verification Message:**
```
Mercy: @channel QA setup complete!

I've created our test plan and bug tracking system.

I'm ready to test features starting Week 2.

Questions about testing approach? Ask here! 🧪
```

### **Olufems Checks:**
- [ ] Development environment working
- [ ] GitHub repo cloned
- [ ] First branch created
- [ ] Ready to start development

**Verification Message:**
```
Olufems: @channel dev setup complete!

✓ Node.js installed
✓ Repo cloned
✓ npm install working
✓ npm start working

Ready to start building Monday! 👨‍💻
```

---

## 🎯 Success Criteria for Week 1

**By Friday Week 1:**
- [ ] GitHub repo fully configured
- [ ] All team members have working dev environment
- [ ] Test plan created
- [ ] Folder structure for project created
- [ ] First pull request reviewed and merged
- [ ] Team communication established
- [ ] All team members understand their roles
- [ ] Ready to start building Week 2! 🚀

---

## 📞 Quick Reference Phone Directory

**In case of emergency:**

| Name | Slack | Phone | Best Time |
|------|-------|-------|-----------|
| RobertSon | @robertson | [Add] | 9-5 |
| David | @david | [Add] | 10-6 |
| Mercy | @mercy | [Add] | 8-5 |
| Olufems | @olufems | [Add] | 10-6 |

---

## 🚀 Go / No-Go Meeting (Friday Before Week 1)

**Optional but recommended: Friday before Week 1 starts**

Quick 10-min video call to verify:
- Everyone set up ✓
- No blockers ✓
- Ready to launch ✓
- Final questions answered ✓

---

## 📌 Pinned Slack Messages

Post these in #portfolio-project and pin them:

**Pinned Message 1:**
```
📋 TEAM DOCUMENTS
- TEAM_PROJECT_CHARTER.md
- TEAM_COLLABORATION_GUIDE.md
- 6WEEK_PLAN.md
- Role-specific guides (see README)
```

**Pinned Message 2:**
```
📅 MEETING SCHEDULE
Monday 9 AM: Sprint planning (15 min)
Friday 3 PM: Sprint review & demo (30 min)
Daily: Async updates at 5 PM
```

**Pinned Message 3:**
```
🔗 IMPORTANT LINKS
GitHub: [URL]
Project Charter: [Link]
Deployment Target: Vercel
```

---

## 🎉 Team Launch Party Message

**Send to team on Friday before Week 1:**

```
🚀 PORTFOLIO PROJECT LAUNCH! 🚀

Team, we're officially launching Monday!

You have:
✓ Clear roles and responsibilities
✓ Detailed timeline (6 weeks)
✓ Strong communication plan
✓ Technical leadership (David)
✓ Quality focus (Mercy)
✓ Development power (Olufems)
✓ Coordination (RobertSon)

Goals:
✓ Professional portfolio website
✓ Demonstrate CMP 722 principles
✓ Learn & grow as a team
✓ Have fun building together

Monday 9 AM: We launch! 🎯

Get some rest this weekend. We've got this! 💪

#PortfolioProject #TeamWork #CMP722
```

---

## ✅ Final Launch Checklist

**48 Hours Before Week 1 Starts:**

- [ ] All team members read required documents
- [ ] GitHub repo ready with team access
- [ ] Slack channel created with all members
- [ ] Development environment verified on all machines
- [ ] First sprint goals documented
- [ ] Meeting calendar invites sent
- [ ] Test plan created
- [ ] Communication plan confirmed
- [ ] Roles and responsibilities clear
- [ ] Contingency plans for blockers defined

**24 Hours Before Week 1:**

- [ ] Final questions answered in Slack
- [ ] Everyone confirmed ready
- [ ] Development environment verified working
- [ ] Launch message sent to team
- [ ] Team morale high! 🚀

**Monday Morning Week 1:**

- [ ] 9 AM sprint planning meeting
- [ ] Team kickoff complete
- [ ] Sprint goals assigned
- [ ] Development begins!

---

## 🎓 Learning Outcomes

**After 6 weeks, team will have learned:**

✓ How to work as a software team  
✓ Professional development practices  
✓ Code review and quality assurance  
✓ Git workflow and GitHub collaboration  
✓ Agile sprint methodology  
✓ React and modern web development  
✓ How to deploy to production  
✓ CMP 722 software engineering principles  

---

**You're ready to launch! See you Monday! 🚀**
