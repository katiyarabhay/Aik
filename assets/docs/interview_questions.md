# Aikyam Ananda Pre-School: Interview Questions Guide

This guide is split into two sections:
1. **Technical Developer Interview Questions** (for evaluating developers maintaining or upgrading this codebase).
2. **Admission & Parent Interview Questions** (for the school administration when interviewing parents who apply through the website's enquiry form).

---

## 1. Technical Developer Interview Questions
These questions assess a developer's understanding of the technology stack used on the website: vanilla HTML5/CSS3, JavaScript (ES Modules), Firebase Realtime Database, and EmailJS.

### Category A: Database & Third-Party Integrations

#### Q1: Client-Side Security & Firebase Realtime Database Config
> **Question:** In `script.js`, the Firebase configuration (containing the `apiKey` and `databaseURL`) is hardcoded directly in the client-side JavaScript. Is this a security risk, and how do we prevent unauthorized read/write access to the database?
* **Answer Key:** 
  * The configuration keys themselves are not secret keys; they are required for client connection. 
  * However, anyone viewing the source code can find the database URL. To secure the database, we **must configure Firebase Security Rules** in the Firebase console.
  * For example, we should only allow `.write` (with schema validation checking field lengths, presence of emails, etc.) and restrict `.read` to authorized administrators only.

```json
{
  "rules": {
    "enquiries": {
      ".read": "auth != null",
      ".write": "newData.hasChildren(['parentName', 'childName', 'dob', 'contactNo', 'email'])"
    },
    "feedback": {
      ".read": "auth != null",
      ".write": "newData.hasChildren(['name', 'email', 'message'])"
    }
  }
}
```

#### Q2: Error Handling in Multiple Async Operations
> **Question:** When a parent submits an enquiry, the form does two async things: pushes data to Firebase RTDB, and then sends an email notification via EmailJS. If Firebase succeeds but EmailJS fails (e.g., due to an expired API quota), how does the website currently behave? How would you improve this resilience?
* **Answer Key:** 
  * Currently, the EmailJS call is nested inside a separate `try-catch` inside the main Firebase success block. If EmailJS fails, the error is caught, logged to the console, and the user is still shown a successful alert: *"Thank you for your enquiry! We will get back to you soon."*
  * **Improvement:** To improve resilience and reduce client-side overhead, we could move EmailJS to a backend serverless function or a Firebase Cloud Function that triggers automatically on a new entry write to the database. This keeps the client-side code lightweight and secures templates/service keys.

---

### Category B: JavaScript & DOM Interactions

#### Q3: Child Age Calculation Logic
> **Question:** The enquiry form calculates the child's age dynamically as of a target date: July 31, 2026. Explain the logic used in `script.js` to handle day borrows (negative differences in days) and month borrows when calculating years, months, and days.
* **Answer Key:**
  * When the user inputs a Date of Birth, the code creates a date object and compares it with `2026-07-31`.
  * **Day borrow:** If target day (31) minus child's DOB day is negative, it subtracts 1 from the months difference, and looks up the last day of the previous month using `new Date(targetYear, targetMonth, 0).getDate()` to borrow days.
  * **Month borrow:** If the months difference goes negative, it subtracts 1 from the year difference and adds 12 to the months.
  * This manual date manipulation avoids installing heavy library dependencies (like moment.js) for a single form.

#### Q4: Lightbox Performance and Event Delegation
> **Question:** The image gallery in `gallery.html` uses a custom lightbox. The code attaches a `click` event listener to each image inside `.gallery-grid` using a `.forEach` loop. What is the performance bottleneck if this grid scales to hundreds of images, and how would you refactor it using event delegation?
* **Answer Key:**
  * Attaching individual listeners to hundreds of images increases memory usage and degrades scrolling/rendering performance.
  * **Refactoring:** We can attach a single listener to the parent element (`.gallery-grid`) and check the click target:

```javascript
const galleryGrid = document.querySelector('.gallery-grid');
galleryGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const index = Array.from(galleryGrid.querySelectorAll('img')).indexOf(e.target);
        lightbox.style.display = "flex";
        showImage(index);
    }
});
```

#### Q5: Carousel Auto-Scroll & Accessibility
> **Question:** How does the events carousel handle loop resets when it reaches the end of the items? How is the user interaction optimized to avoid jumping while they are reading/viewing a card?
* **Answer Key:**
  * The carousel calculates the scroll width and checks if `scrollLeft >= maxScroll - 10`. If true, it wraps around smoothly by scrolling back to the beginning (`0`).
  * To prevent jumping, the carousel clears the interval on `mouseenter` (`carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoScrollInterval))`) and resets the interval when the mouse leaves.

---

### Category C: CSS & UI Design

#### Q6: Mobile Header & Responsiveness
> **Question:** How does the mobile navigation toggle work on smaller screens? Explain the CSS transitions and classes involved.
* **Answer Key:**
  * In HTML, there is a hamburger icon (`.hamburger`). In Javascript, clicking it toggles the class `.active` on both the hamburger and the navigation links (`.nav-links`).
  * In CSS, `.nav-links` goes from absolute positioning (hidden off-screen or faded out) to visible. Active mobile classes override positioning to slide in or display dropdowns.

#### Q7: Wavy Section Dividers
> **Question:** The website features visually rich wavy top/bottom dividers between sections like About, Vision, and Events. How are these achieved technically?
* **Answer Key:**
  * The waves are inline SVG shapes (`<svg viewBox="0 0 1200 120">`) embedded inside container divs (`.wave-top` and `.wave-bottom`).
  * They are positioned absolute (`position: absolute`) at the top (`top: 0`) and bottom (`bottom: -1px`), spanning `width: 100%`.
  * The SVG paths are filled with matching colors (`fill: #00BFFF;` / `fill: #ffffff;`) to blend smoothly with adjacent section background colors.

---

## 2. Parent & Admission Interview Questions
These questions are designed for the school admissions desk to ask parents who submit enquiries through the website's forms.

### Category A: Core Information (Extracted from Form Data)
1. **"I see from your application that [Child's Name] will be [Age calculated by website] on July 31, 2026. Have they previously attended a playgroup, daycare, or nursery?"**
   * *Purpose:* Establish baseline social exposure and transition readiness.
2. **"You mentioned you live in [Area of Residence]. How do you plan to handle the commute? Are you interested in transport options or carpooling with other parents in that area?"**
   * *Purpose:* Assess logistical feasibility and help structure transport routes.

### Category B: Learning Philosophy & Development (Aligned with Site Themes)
3. **"Our website highlights our commitment to 'Holistic Development' (Emotional, Cognitive, Physical, and Social). Which of these areas do you feel your child is strongest in, and where do they need the most nurturing?"**
   * *Purpose:* Match the child's needs to the school's core curriculum areas.
4. **"Aikyam Ananda's core belief is 'Together We Can' and learning by doing. How do you reinforce experiential, hands-on learning at home?"**
   * *Purpose:* Gauge parent alignment with the school’s pedagogical values.
5. **"How does your child handle transition periods or being separated from you? What comfort strategies work best for them?"**
   * *Purpose:* Prepare teachers for the child's emotional adjustment needs during the first few weeks of school.

### Category C: Collaboration & Open House
6. **"You indicated on your form that you are interested in visiting our campus for an Open House. What are the key things you look for in a preschool environment during a campus visit?"**
   * *Purpose:* Customize the campus tour to focus on parent priorities (e.g., safety, play areas, classroom sanitation).
7. **"We believe in a close partnership with parents. In what ways do you hope to be involved with the school community (e.g., volunteering for festival events like Holi, Dussehra, or Christmas celebrations highlighted in our events calendar)?"**
   * *Purpose:* Foster long-term parent engagement in school celebrations and notice-board activities.
