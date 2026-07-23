# 🧪 Mercy's Guide
## QA Tester - Quality Assurance

**Your Role:** Quality assurance, testing, bug reporting, accessibility, and performance validation.

---

## 📌 Your Responsibilities

- ✓ Create comprehensive test plan
- ✓ Functional testing (all features)
- ✓ Mobile responsiveness testing
- ✓ Cross-browser testing
- ✓ Accessibility testing (WCAG 2.1 AA)
- ✓ Performance testing (Lighthouse)
- ✓ Bug reporting and tracking
- ✓ Email form testing
- ✓ Final sign-off

---

## 🎯 Week-by-Week Tasks

### **Week 1: Test Planning & Setup** (4-5 hours)

**Monday:**
- [ ] Create TEST_PLAN.md document
- [ ] List all features to test
- [ ] Create test case templates
- [ ] Set up bug tracking system (GitHub Issues)

**Test Plan Should Include:**
```
1. Hero Section Tests
   - Headline displays correctly
   - CTA buttons clickable
   - Responsive on mobile/tablet/desktop
   - Images load properly

2. Navbar Tests
   - Links navigate correctly
   - Mobile menu opens/closes
   - Sticky positioning works
   - Responsive layout

3. Projects Gallery Tests
   - 4 projects display
   - Filtering works
   - Cards responsive
   - Images optimized

... etc for all sections
```

**Tuesday-Wednesday:**
- [ ] Create accessibility checklist (WCAG 2.1 AA)
- [ ] Create mobile responsiveness checklist
- [ ] Create cross-browser checklist
- [ ] Create performance checklist

**Thursday:**
- [ ] Set up testing environment
- [ ] Install testing tools
- [ ] Create spreadsheet for bug tracking

**Friday:**
- [ ] Review test plan with team
- [ ] Confirm all test scenarios covered
- [ ] Ready to start testing Week 2

**Deliverables:**
- [ ] TEST_PLAN.md
- [ ] ACCESSIBILITY_CHECKLIST.md
- [ ] BROWSER_COMPATIBILITY.md
- [ ] BUG_TRACKING_SPREADSHEET

---

### **Week 2: Hero & Navbar Testing** (4-5 hours)

**Desktop Testing (Windows/Mac/Linux):**
- [ ] Open http://localhost:3000
- [ ] Navbar displays at top
- [ ] All nav links work and scroll to sections
- [ ] Hero section displays correctly
- [ ] Headline visible and readable
- [ ] CTA buttons clickable
- [ ] Images load without delay

**Mobile Testing (using Chrome DevTools):**
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Test iPhone SE, iPhone 12, Pixel 5
- [ ] Navbar collapses to hamburger menu
- [ ] Mobile menu opens/closes smoothly
- [ ] Hero section text readable on mobile
- [ ] CTA buttons finger-sized (not too small)
- [ ] Images responsive

**Tablet Testing:**
- [ ] iPad Pro 12.9"
- [ ] iPad Air 10.9"
- [ ] Samsung Tab (10")
- [ ] Verify grid layout works on tablets

**Cross-Browser Testing:**
- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge (if Windows)

**Accessibility Testing:**
- [ ] Tab navigation works
- [ ] Button focus indicators visible
- [ ] Text contrast sufficient (use WAVE tool)
- [ ] Images have alt text
- [ ] Heading hierarchy correct (h1, h2, h3)

**Report Issues:**
- [ ] Document every bug found
- [ ] Include: Screenshot, device, browser, steps to reproduce
- [ ] Severity: Critical, High, Medium, Low
- [ ] Assign to Olufems for fixing

**Friday Report:**
- [ ] Testing complete for Hero & Navbar
- [ ] X bugs found (breakdown by severity)
- [ ] Recommendation: Approve/Fix before merge

---

### **Week 3: Projects Gallery Testing** (4-5 hours)

**Functionality Tests:**
- [ ] 4 projects display in grid
- [ ] Project cards show:
  - [ ] Title
  - [ ] Description
  - [ ] Tech tags
  - [ ] "Live" button
  - [ ] "Code" button
- [ ] Filtering by technology works
- [ ] "All" button shows all projects
- [ ] Individual tech filters work
- [ ] External links open in new tab

**Responsiveness Tests:**
- [ ] Desktop: 2 columns layout
- [ ] Tablet: 2 columns
- [ ] Mobile: 1 column
- [ ] No horizontal scrolling

**Performance Tests:**
- [ ] Images load quickly (< 2 seconds)
- [ ] No lag when filtering
- [ ] Smooth animations/transitions

**Edge Cases:**
- [ ] What happens if projects.json missing?
- [ ] What if image fails to load?
- [ ] What if filtering results in 0 projects?

**Test Devices:**
- [ ] iPhone (various sizes)
- [ ] Android (various sizes)
- [ ] Tablets
- [ ] Desktops

**Report Findings:**
- [ ] Features working: ✓
- [ ] Responsive: ✓
- [ ] Performance: ✓
- [ ] Bugs: (list any issues)

---

### **Week 4: About & Skills Testing** (4-5 hours)

**About Section:**
- [ ] Narrative text displays
- [ ] Resume download button works
- [ ] Text is readable on all devices

**Skills Grid:**
- [ ] Skills display in grid (3 cols desktop, 1 col mobile)
- [ ] Skill categories correct
- [ ] Proficiency levels show correctly
- [ ] Progress bars display (if applicable)
- [ ] Colors consistent with design

**Accessibility:**
- [ ] Text contrast sufficient
- [ ] Font sizes readable
- [ ] No color-only information
- [ ] Keyboard navigation works

**Mobile Testing:**
- [ ] Single column layout on mobile
- [ ] Skills easy to read
- [ ] No truncated text
- [ ] Proper spacing

**Report:**
- [ ] All tests passed / X issues found
- [ ] Accessibility compliance verified
- [ ] Responsive design confirmed

---

### **Week 5: Contact Form Testing** (5-6 hours)

**This is Critical Week!**

**Form Validation Tests:**
- [ ] Empty name field: Shows error message
- [ ] Empty email field: Shows error message
- [ ] Invalid email: Shows error message
- [ ] Empty subject: Shows error message
- [ ] Empty message: Shows error message
- [ ] All fields filled correctly: Form submits

**Email Delivery Tests:**
- [ ] Submit form with valid data
- [ ] Verify email received in inbox
- [ ] Verify email contains all fields
- [ ] Check sender name
- [ ] Check subject line
- [ ] Check message body

**Error Handling:**
- [ ] Network error: Show error message
- [ ] EmailJS down: Show retry button
- [ ] Try/catch working properly

**User Experience:**
- [ ] Success message displays after submit
- [ ] Form clears after submit
- [ ] Loading state shows during submission
- [ ] Smooth transitions/animations

**Mobile Testing:**
- [ ] Form displays correctly on mobile
- [ ] Keyboard doesn't cover fields
- [ ] Buttons finger-sized
- [ ] Validation messages clear

**Cross-Browser:**
- [ ] Chrome: ✓
- [ ] Firefox: ✓
- [ ] Safari: ✓
- [ ] Edge: ✓

**Test Cases:**
```
TC-001: Submit form with all valid data
- Expected: Email received, success message
- Actual: [PASS/FAIL]

TC-002: Submit empty name
- Expected: Error message "Name required"
- Actual: [PASS/FAIL]

TC-003: Submit invalid email
- Expected: Error message "Valid email required"
- Actual: [PASS/FAIL]

TC-004: Test on iPhone mobile
- Expected: Form responsive, keyboard doesn't cover
- Actual: [PASS/FAIL]

TC-005: Network error simulation
- Expected: Error message, retry button
- Actual: [PASS/FAIL]
```

**Report Issues:**
- [ ] All tests passed OR
- [ ] X critical issues, Y high, Z medium, W low

---

### **Week 6: Final Regression Testing & Sign-Off** (5-6 hours)

**Full Website Testing:**
- [ ] All 5 sections working (Hero, Projects, About, Contact, Footer)
- [ ] Navigation between sections smooth
- [ ] All images loading
- [ ] No console errors
- [ ] No broken links
- [ ] Mobile responsive verified
- [ ] Form sending emails

**Performance Audit:**
- [ ] Run Lighthouse
- [ ] Performance score: 85+
- [ ] Accessibility score: 90+
- [ ] Best Practices: 85+
- [ ] SEO: 90+

**Accessibility Audit:**
- [ ] Use WAVE tool (Chrome extension)
- [ ] Check WCAG 2.1 AA compliance
- [ ] Test with keyboard navigation
- [ ] Test with screen reader (if possible)

**Cross-Browser Final Check:**
- [ ] Chrome: ✓
- [ ] Firefox: ✓
- [ ] Safari: ✓
- [ ] Edge: ✓

**Mobile Devices (Physical if possible):**
- [ ] iPhone (iOS)
- [ ] Android
- [ ] Tablet
- [ ] Various screen sizes

**Final Checklist:**
- [ ] All features working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Contact form working
- [ ] Lighthouse 85+
- [ ] Accessibility compliant
- [ ] Cross-browser compatible
- [ ] Ready for deployment

**Final Report:**
```markdown
# QA Sign-Off Report

## Overall Status: ✓ APPROVED FOR DEPLOYMENT

### Test Summary:
- Total test cases: X
- Passed: X
- Failed: 0
- Warnings: 0

### Performance:
- Lighthouse Performance: 87
- Accessibility: 92
- Best Practices: 88
- SEO: 90

### Bugs Found & Fixed:
- Week 1: 0 critical, 1 high, 2 medium (all fixed)
- Week 2: 0 critical, 0 high, 1 medium (fixed)
- Week 3: 0 critical, 0 high, 0 medium (no issues)
- Week 4: 0 critical, 1 high, 1 medium (fixed)
- Week 5: 0 critical, 0 high, 1 medium (fixed)
- Week 6: 0 critical, 0 high, 0 medium (no issues)

### Recommendation:
✓ APPROVED FOR PRODUCTION DEPLOYMENT

Signed by: Mercy  
Date: [Week 6 Friday]
```

---

## 🛠️ Testing Tools & Resources

### **DevTools (Built-in to Chrome/Firefox):**
- F12 to open
- Device toolbar (Ctrl+Shift+M) for mobile testing
- Console tab: Check for errors
- Network tab: Check image loading
- Lighthouse tab: Performance audit

### **WAVE (Accessibility):**
- Chrome extension: Web Accessibility Evaluation Tool
- Checks WCAG compliance
- Shows color contrast issues
- Identifies missing alt text

### **Lighthouse:**
- In Chrome DevTools
- Tests Performance, Accessibility, Best Practices, SEO
- Gives specific recommendations

### **Responsive Design Checker:**
- Built into Chrome DevTools
- Test various screen sizes
- Test orientation (portrait/landscape)

### **MailSac (Email Testing):**
- https://mailsac.com
- Temporary email addresses for testing
- Can use for testing email delivery
- Free and no signup required

---

## 📋 Testing Checklist Template

**Feature: Hero Section**  
**Tester:** Mercy  
**Date:** Week 2  
**Status:** ✓ Passed

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| Headline displays | Text visible, readable | ✓ Works | ✓ |
| CTA button clickable | Button clicks, navigates | ✓ Works | ✓ |
| Mobile responsive | Stacked layout on mobile | ✓ Works | ✓ |
| Image loads | No broken image icon | ✓ Works | ✓ |

**Issues Found:** None  
**Recommendation:** ✓ Approve

---

## 🐛 Bug Report Template

**Title:** [Component] Description of Issue

**Severity:**
- Critical: Blocks deployment
- High: Major feature broken
- Medium: Minor feature broken
- Low: Nice to have fix

**Environment:**
- Device: iPhone 12
- Browser: Chrome 90
- OS: iOS 14

**Steps to Reproduce:**
1. Open site on iPhone
2. Click mobile menu
3. Observe: Menu doesn't close

**Expected Behavior:**
Menu should close after clicking link

**Actual Behavior:**
Menu remains open after clicking link

**Screenshot:** [Attach if possible]

**Notes:** Happens on all mobile devices

---

## ✅ Your Week 1 Checklist

- [ ] TEST_PLAN.md created
- [ ] ACCESSIBILITY_CHECKLIST.md created
- [ ] BROWSER_COMPATIBILITY.md created
- [ ] Bug tracking system set up
- [ ] Testing tools installed (DevTools, WAVE, Lighthouse)
- [ ] All team members trained on test process
- [ ] Ready to test Week 2 deliverables!

---

## 🎯 Success Metrics

**Week 6 Sign-Off:**

- [ ] Test plan created and executed
- [ ] 95%+ test cases passed
- [ ] Zero critical bugs in production
- [ ] Lighthouse 85+ on all metrics
- [ ] WCAG 2.1 AA compliance verified
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsive verified
- [ ] Final sign-off provided
- [ ] Comprehensive testing report submitted

---

**Remember:** You're the quality gatekeeper. Your thorough testing ensures a great experience for users! 🧪

**You've got this! 💪**
