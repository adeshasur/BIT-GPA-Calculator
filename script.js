/* UCSC BIT GPA Calculator - Application Logic */

const GRADE_POINTS = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "E": 0.0
};

const REPEAT_CAP = 2.0; // C grade point is 2.0

const COURSES = [
  // Level 1
  { level: 1, code: "EN1106", name: "Introductory Mathematics", semester: 1, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 1, code: "IT1106", name: "Information Systems", semester: 1, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT1206", name: "Computer Systems", semester: 1, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT1306", name: "Free & Open Source Software for PC", semester: 1, credits: 3, gpaCredits: 3 },
  { level: 1, code: "IT1406", name: "Introduction to Programming", semester: 1, credits: 4, gpaCredits: 4 },
  { level: 1, code: "EN2106", name: "Communication Skills I", semester: 2, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 1, code: "IT2106", name: "Mathematics for Computing I", semester: 2, credits: 3, gpaCredits: 3 },
  { level: 1, code: "IT2206", name: "Fundamentals of Software Engineering", semester: 2, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT2306", name: "Database Systems", semester: 2, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT2406", name: "Web Application Development I", semester: 2, credits: 4, gpaCredits: 4 },
  
  // Level 2
  { level: 2, code: "EN3106", name: "Communication Skills II", semester: 3, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 2, code: "IT3106", name: "Object Oriented Analysis & Design", semester: 3, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT3206", name: "Data Structures and Algorithms", semester: 3, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT3306", name: "Data Management Systems", semester: 3, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT3406", name: "Web Application Development II", semester: 3, credits: 4, gpaCredits: 4 },
  { level: 2, code: "IT4106", name: "User Experience Design", semester: 4, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT4206", name: "Enterprise Application Development", semester: 4, credits: 4, gpaCredits: 4 },
  { level: 2, code: "IT4306", name: "IT Project Management", semester: 4, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT4406", name: "Agile Software Development", semester: 4, credits: 4, gpaCredits: 4 },
  { level: 2, code: "IT4506", name: "Computer Networks", semester: 4, credits: 3, gpaCredits: 3 },
  
  // Level 3
  { level: 3, code: "EN5106", name: "Fundamentals of Management & Entrepreneurship", semester: 5, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 3, code: "IT5106", name: "Software Development Project", semester: "5 & 6", credits: 8, gpaCredits: 8 },
  { level: 3, code: "IT5206", name: "Professional Practice", semester: 5, credits: 3, gpaCredits: 3 },
  { level: 3, code: "IT5306", name: "Principles of Information Security", semester: 5, credits: 3, gpaCredits: 3 },
  { level: 3, code: "IT5406", name: "Systems & Network Administration", semester: 5, credits: 3, gpaCredits: 3 },
  { level: 3, code: "IT5506", name: "Mathematics for Computing II", semester: 5, credits: 3, gpaCredits: 3, optional: true },
  { level: 3, code: "EN6106", name: "Emerging Topics in Information Technology", semester: 6, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 3, code: "IT6206", name: "Software Quality Assurance", semester: 6, credits: 3, gpaCredits: 3 },
  { level: 3, code: "IT6306", name: "Mobile Application Development", semester: 6, credits: 4, gpaCredits: 4 },
  { level: 3, code: "IT6406", name: "Network Security and Audit", semester: 6, credits: 3, gpaCredits: 3 },
  { level: 3, code: "IT6506", name: "e-Business Technologies", semester: 6, credits: 3, gpaCredits: 3, optional: true }
];

const state = {
  activeTab: "home", // "home", 1, 2, 3, or "final"
  level3Elective: "IT5506",
  grades: {},
  theme: "dark",
  wasDegreeEligible: false
};

// DOM References
const overallGpaElement = document.querySelector("#overallGpa");
const overallCreditsElement = document.querySelector("#overallCredits");
const gradeTemplate = document.querySelector("#gradeOptions");
const gaugeProgressCircle = document.querySelector("#gaugeProgress");
const themeToggleBtn = document.querySelector("#themeToggleBtn");
const courseGrid = document.querySelector("#courseGrid");
const levelTabs = document.querySelector("#levelTabs");
const activeLevelTitle = document.querySelector("#activeLevelTitle");
const activeLevelBadge = document.querySelector("#activeLevelBadge");
const activeLevelCredits = document.querySelector("#activeLevelCredits");
const activeLevelCCredits = document.querySelector("#activeLevelCCredits");
const activeLevelStatus = document.querySelector("#activeLevelStatus");

// Initialize state from LocalStorage
function loadState() {
  const savedGrades = localStorage.getItem("bit_gpa_grades");
  const savedElective = localStorage.getItem("bit_gpa_elective");
  const savedActiveTab = localStorage.getItem("bit_gpa_active_tab");
  const savedTheme = localStorage.getItem("bit_gpa_theme");

  if (savedGrades) {
    try {
      state.grades = JSON.parse(savedGrades);
    } catch (e) {
      state.grades = {};
    }
  }
  if (savedElective) state.level3Elective = savedElective;
  if (savedActiveTab) {
    if (savedActiveTab === "home" || savedActiveTab === "final") {
      state.activeTab = savedActiveTab;
    } else {
      state.activeTab = parseInt(savedActiveTab, 10) || 1;
    }
  } else {
    state.activeTab = "home";
  }
  if (savedTheme) {
    state.theme = savedTheme;
  } else {
    // Detect system preference
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    state.theme = prefersLight ? "light" : "dark";
  }

  // Set inputs to match loaded state
  const radio = document.querySelector(`input[name='level3Elective'][value='${state.level3Elective}']`);
  if (radio) radio.checked = true;

  updateTabUI();
  applyTheme();
}

function saveState() {
  localStorage.setItem("bit_gpa_grades", JSON.stringify(state.grades));
  localStorage.setItem("bit_gpa_elective", state.level3Elective);
  localStorage.setItem("bit_gpa_active_tab", state.activeTab);
  localStorage.setItem("bit_gpa_theme", state.theme);
}

// Theme Application
function applyTheme() {
  if (state.theme === "light") {
    document.documentElement.classList.add("light-theme");
  } else {
    document.documentElement.classList.remove("light-theme");
  }
}

// Event Listeners for controls
document.querySelectorAll("input[name='level3Elective']").forEach((input) => {
  input.addEventListener("change", (event) => {
    state.level3Elective = event.target.value;
    saveState();
    render();
  });
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all entered grades and reset preferences?")) {
    state.grades = {};
    state.activeTab = "home";
    state.level3Elective = "IT5506";
    const radio = document.querySelector("input[name='level3Elective'][value='IT5506']");
    if (radio) radio.checked = true;
    updateTabUI();
    saveState();
    render();
  }
});

themeToggleBtn.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme();
});

// Quick-fill buttons
document.querySelectorAll(".fill-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const action = event.target.dataset.btn;
    const targetGrade = event.target.dataset.grade;

    if (action === "clear") {
      // Clear grades for active tab's courses
      const visible = visibleCourses();
      visible.forEach((course) => {
        if (state.grades[course.code]) {
          delete state.grades[course.code];
        }
      });
    } else if (targetGrade) {
      // Set visible active courses to targetGrade
      const visible = visibleCourses();
      visible.forEach((course) => {
        const entry = ensureGradeState(course.code);
        if (course.enhancement) {
          entry.passed = (targetGrade !== "E");
        } else {
          entry.first = targetGrade;
          entry.repeat = "";
        }
      });
    }
    saveState();
    render();
  });
});

// Tab switching button bindings
levelTabs.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lvl = btn.dataset.level;
    if (lvl === "home" || lvl === "final") {
      state.activeTab = lvl;
    } else {
      state.activeTab = parseInt(lvl, 10) || 1;
    }
    updateTabUI();
    saveState();
    render();
  });
});

// Welcome screen button bindings
document.querySelectorAll("#welcomeScreen button[data-btn-level]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lvl = btn.dataset.btnLevel;
    if (lvl === "home" || lvl === "final") {
      state.activeTab = lvl;
    } else {
      state.activeTab = parseInt(lvl, 10) || 1;
    }
    updateTabUI();
    saveState();
    render();
  });
});

function updateTabUI() {
  levelTabs.querySelectorAll(".tab-btn").forEach((btn) => {
    if (btn.dataset.level === String(state.activeTab)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Helpers
function activeCourses() {
  return COURSES.filter((course) => !course.optional || course.code === state.level3Elective);
}

function visibleCourses() {
  return activeCourses().filter((course) => course.level === state.activeTab);
}

function ensureGradeState(code) {
  if (!state.grades[code]) {
    state.grades[code] = { first: "", repeat: "", passed: false };
  }
  return state.grades[code];
}

function isRepeatAllowed(grade) {
  return grade !== "" && GRADE_POINTS[grade] < REPEAT_CAP;
}

function effectiveGradePoint(course) {
  if (course.gpaCredits === 0) {
    return null;
  }

  const grades = ensureGradeState(course.code);
  if (!grades.first) {
    return null;
  }

  // If first attempt is eligible for repeat and repeat has a grade entered
  if (isRepeatAllowed(grades.first) && grades.repeat) {
    return Math.min(GRADE_POINTS[grades.repeat], REPEAT_CAP);
  }

  return GRADE_POINTS[grades.first];
}

// Progression & Milestone Checks
function summarizeLevel(level) {
  const allLevelCourses = activeCourses().filter((course) => course.level === level);
  const gpaCourses = allLevelCourses.filter((course) => course.gpaCredits > 0);
  const enhancementCourses = allLevelCourses.filter((course) => course.enhancement);
  
  const enteredGpaCourses = gpaCourses.filter((course) => effectiveGradePoint(course) !== null);
  const totalGpaCredits = gpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  const enteredGpaCredits = enteredGpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  
  const points = enteredGpaCourses.reduce((total, course) => total + effectiveGradePoint(course) * course.gpaCredits, 0);
  const gpa = enteredGpaCredits > 0 ? points / enteredGpaCredits : null;
  
  const cOrAboveCredits = enteredGpaCourses.reduce((total, course) => {
    return total + (effectiveGradePoint(course) >= REPEAT_CAP ? course.gpaCredits : 0);
  }, 0);
  
  const unresolvedE = gpaCourses.filter((course) => {
    const courseState = ensureGradeState(course.code);
    if (courseState.first === "E") {
      if (!courseState.repeat || courseState.repeat === "E") {
        return true;
      }
    }
    return false;
  });

  const repeatCoursesCount = gpaCourses.filter((course) => {
    const courseState = ensureGradeState(course.code);
    return courseState.first && GRADE_POINTS[courseState.first] < REPEAT_CAP;
  }).length;

  const enPassed = enhancementCourses.every((course) => ensureGradeState(course.code).passed);
  const enEntered = enhancementCourses.filter((course) => ensureGradeState(course.code).passed).length;
  const enTotal = enhancementCourses.length;

  const complete = (enteredGpaCredits === totalGpaCredits) && (enEntered === enTotal || enPassed);

  const hasMinGpa = gpa === null || gpa >= 1.50;
  
  let progressState = "eligible"; // eligible, caution, blocked
  let progressMessage = "Progression criteria met.";

  if (enteredGpaCredits === 0) {
    progressState = "neutral";
    progressMessage = "No grades entered yet.";
  } else if (gpa < 1.50) {
    progressState = "blocked";
    progressMessage = `Blocked: Level GPA (${gpa.toFixed(2)}) is below 1.50 threshold.`;
  } else if (complete && cOrAboveCredits < 20) {
    progressState = "blocked";
    progressMessage = `Blocked: Only ${cOrAboveCredits} credits are C or above (Need 20).`;
  } else if (unresolvedE.length > 0) {
    progressState = "caution";
    progressMessage = `Proceed with Resits: ${unresolvedE.length} unresolved E grade(s).`;
  } else if (!enPassed && complete) {
    progressState = "caution";
    progressMessage = "Proceed with Resits: Enhancement (EN) courses pending pass.";
  } else if (!complete) {
    progressState = "neutral";
    progressMessage = `On Track: GPA ${gpa.toFixed(2)} (${cOrAboveCredits} credits &ge; C)`;
  }

  return {
    level,
    credits: enteredGpaCredits,
    totalCredits: totalGpaCredits,
    cOrAboveCredits,
    unresolvedECount: unresolvedE.length,
    repeatCount: repeatCoursesCount,
    enPassed,
    gpa,
    complete,
    progressState,
    progressMessage
  };
}

function updateGauge(cumulativeGpa, cumulativeCredits) {
  if (cumulativeGpa === null) {
    overallGpaElement.textContent = "--";
    overallCreditsElement.textContent = "0 / 90 Credits";
    gaugeProgressCircle.style.strokeDashoffset = 263.89;
    gaugeProgressCircle.style.stroke = "var(--border-color)";
    return;
  }

  overallGpaElement.textContent = cumulativeGpa.toFixed(2);
  overallCreditsElement.textContent = `${cumulativeCredits} / 90 Credits`;

  const percentage = Math.min(cumulativeGpa / 4.0, 1.0);
  const offset = 263.89 - percentage * 263.89;
  gaugeProgressCircle.style.strokeDashoffset = offset;

  if (cumulativeGpa >= 3.25) {
    gaugeProgressCircle.style.stroke = "var(--success)";
  } else if (cumulativeGpa >= 3.00) {
    gaugeProgressCircle.style.stroke = "var(--color-secondary)";
  } else if (cumulativeGpa >= 2.75) {
    gaugeProgressCircle.style.stroke = "var(--info)";
  } else if (cumulativeGpa >= 2.00) {
    gaugeProgressCircle.style.stroke = "var(--text-secondary)";
  } else if (cumulativeGpa >= 1.50) {
    gaugeProgressCircle.style.stroke = "var(--warning)";
  } else {
    gaugeProgressCircle.style.stroke = "var(--danger)";
  }
}

function renderAwards(levels, cumulativeGpa) {
  const getAwardBox = (id) => document.querySelector(id);
  const ditBox = getAwardBox("#ditAward");
  const hditBox = getAwardBox("#hditAward");
  const bitBox = getAwardBox("#bitAward");

  const isLevelAwardReady = (levelNum) => {
    const levelCourses = activeCourses().filter((c) => c.level === levelNum);
    const gpaCourses = levelCourses.filter((c) => c.gpaCredits > 0);
    const enhancementCourses = levelCourses.filter((c) => c.enhancement);

    const anyEmpty = gpaCourses.some((c) => effectiveGradePoint(c) === null);
    if (anyEmpty) return "pending";

    const hasBelowC = gpaCourses.some((c) => {
      const gpv = effectiveGradePoint(c);
      return gpv !== null && gpv < 2.00;
    });

    const enPassed = enhancementCourses.every((c) => ensureGradeState(c.code).passed);

    if (hasBelowC || !enPassed) return "ineligible";
    return "eligible";
  };

  const ditStatus = isLevelAwardReady(1);
  updateAwardUI(ditBox, ditStatus, {
    pending: "Level I grades pending",
    ineligible: "Ineligible: Grade(s) below C / EN pending",
    eligible: "Eligible: Diploma in IT"
  });

  let hditStatus = "pending";
  if (ditStatus === "eligible") {
    hditStatus = isLevelAwardReady(2);
  } else if (ditStatus === "ineligible") {
    hditStatus = "ineligible";
  }
  
  updateAwardUI(hditBox, hditStatus, {
    pending: ditStatus === "eligible" ? "Level II grades pending" : "Requires Level I Diploma",
    ineligible: "Ineligible: Grade(s) below C / EN pending",
    eligible: "Eligible: Higher Diploma"
  });

  let bitStatus = "pending";
  if (ditStatus === "eligible" && hditStatus === "eligible") {
    const lvl3Status = isLevelAwardReady(3);
    if (lvl3Status === "eligible" && cumulativeGpa >= 2.00) {
      bitStatus = "eligible";
    } else if (lvl3Status === "ineligible" || (lvl3Status === "eligible" && cumulativeGpa < 2.00)) {
      bitStatus = "ineligible";
    } else {
      bitStatus = "pending";
    }
  } else if (ditStatus === "ineligible" || hditStatus === "ineligible") {
    bitStatus = "ineligible";
  }

  const bitStatusText = {
    pending: hditStatus === "eligible" ? "Level III grades pending" : "Requires Higher Diploma",
    ineligible: cumulativeGpa !== null && cumulativeGpa < 2.00 ? "Ineligible: Cumulative GPA < 2.00" : "Ineligible: Grade(s) below C / EN pending",
    eligible: `Eligible: BIT Degree (${getClassHonor(cumulativeGpa)})`
  };
  updateAwardUI(bitBox, bitStatus, bitStatusText);

  // Confetti trigger
  if (bitStatus === "eligible") {
    if (!state.wasDegreeEligible) {
      triggerConfetti();
      state.wasDegreeEligible = true;
    }
  } else {
    state.wasDegreeEligible = false;
  }
}

function updateAwardUI(element, status, textMap) {
  element.className = `award-status-box ${status}`;
  const statusBadge = element.querySelector(".award-badge");
  let statusText = status.charAt(0).toUpperCase() + status.slice(1);
  if (status === "eligible") {
    statusBadge.textContent = "✅ " + statusText;
  } else if (status === "ineligible") {
    statusBadge.textContent = "❌ Locked";
  } else {
    statusBadge.textContent = "⏳ " + statusText;
  }
  element.querySelector(".award-desc").textContent = textMap[status];
}

function getClassHonor(gpa) {
  if (gpa >= 3.25) return "1st Class";
  if (gpa >= 3.00) return "2nd Upper";
  if (gpa >= 2.75) return "2nd Lower";
  return "General Pass";
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}

// Rendering Course Inputs (Cards)
function gradeSelect(course, key, disabled = false) {
  const grades = ensureGradeState(course.code);
  const select = document.createElement("select");
  select.dataset.code = course.code;
  select.dataset.key = key;
  select.disabled = disabled;
  select.innerHTML = gradeTemplate.innerHTML;
  select.value = grades[key] || "";
  
  select.addEventListener("change", (event) => {
    const current = ensureGradeState(event.target.dataset.code);
    current[event.target.dataset.key] = event.target.value;
    
    if (event.target.dataset.key === "first" && !isRepeatAllowed(event.target.value)) {
      current.repeat = "";
    }
    
    saveState();
    render();
  });
  return select;
}

function renderCourseCard(course) {
  const grades = ensureGradeState(course.code);
  const card = document.createElement("article");
  
  const repeatAllowed = isRepeatAllowed(grades.first);
  card.className = `course-card ${course.enhancement ? "enhancement" : ""} ${repeatAllowed ? "has-repeat" : ""}`;
  card.dataset.code = course.code;

  const badgeClass = course.enhancement ? "badge en" : "badge gpa";
  const badgeText = course.enhancement ? "EN" : `${course.gpaCredits} Credits`;

  card.innerHTML = `
    <div class="course-card-header">
      <div class="course-info">
        <span class="course-code">${course.code}<span class="grade-indicator-dot"></span></span>
        <h3 class="course-name">${course.name}</h3>
        <span class="course-meta">Sem ${course.semester} · ${course.credits} Credits total</span>
      </div>
      <div class="course-badge">
        <span class="${badgeClass}">${badgeText}</span>
      </div>
    </div>
    
    <div class="course-card-body"></div>
    
    <div class="course-card-footer">
      <span class="gpv-label">Effective GPV</span>
      <strong class="gpv-value">--</strong>
    </div>
  `;

  const cardBody = card.querySelector(".course-card-body");
  const effectiveVal = card.querySelector(".gpv-value");

  const updateGradeIndicator = () => {
    const dot = card.querySelector(".grade-indicator-dot");
    if (!dot) return;
    if (course.enhancement) {
      if (grades.passed) {
        dot.className = "grade-indicator-dot grade-pass";
      } else {
        dot.className = "grade-indicator-dot";
      }
    } else {
      const gpv = effectiveGradePoint(course);
      if (gpv === null) {
        dot.className = "grade-indicator-dot";
      } else if (gpv >= 3.7) {
        dot.className = "grade-indicator-dot grade-excellent";
      } else if (gpv >= 3.0) {
        dot.className = "grade-indicator-dot grade-good";
      } else if (gpv >= 2.0) {
        dot.className = "grade-indicator-dot grade-average";
      } else {
        dot.className = "grade-indicator-dot grade-poor";
      }
    }
  };

  if (course.enhancement) {
    const passLabel = document.createElement("label");
    passLabel.className = "enhancement-pass-label";
    passLabel.innerHTML = `<input type="checkbox" ${grades.passed ? "checked" : ""}> <span>Passed Module</span>`;
    passLabel.querySelector("input").addEventListener("change", (event) => {
      ensureGradeState(course.code).passed = event.target.checked;
      saveState();
      render();
    });
    
    cardBody.appendChild(passLabel);
    effectiveVal.textContent = grades.passed ? "PASS" : "--";
    effectiveVal.className = grades.passed ? "gpv-value pass" : "gpv-value";
    updateGradeIndicator();
    return card;
  }

  // GPA Course inputs
  const firstInputRow = document.createElement("div");
  firstInputRow.className = "input-row";
  firstInputRow.innerHTML = `<label>First Attempt</label>`;
  
  const selectFirst = gradeSelect(course, "first");
  firstInputRow.appendChild(selectFirst);
  cardBody.appendChild(firstInputRow);

  // Repeat dropdown slot
  const repeatContainer = document.createElement("div");
  repeatContainer.className = "repeat-container";
  
  const repeatInner = document.createElement("div");
  repeatInner.className = "repeat-inner";
  repeatInner.innerHTML = `<label>Repeat Attempt</label>`;
  
  const selectRepeat = gradeSelect(course, "repeat", !repeatAllowed);
  repeatInner.appendChild(selectRepeat);
  
  const hintText = document.createElement("span");
  hintText.className = `repeat-hint ${repeatAllowed ? "warning" : "ok"}`;
  hintText.textContent = repeatAllowed
    ? "Capped at C (2.00 GPV) on repeat."
    : grades.first
      ? "C or above is final."
      : "Allowed for C- or below.";
  repeatInner.appendChild(hintText);
  
  repeatContainer.appendChild(repeatInner);
  cardBody.appendChild(repeatContainer);

  const gpv = effectiveGradePoint(course);
  effectiveVal.textContent = gpv === null ? "--" : gpv.toFixed(2);
  updateGradeIndicator();
  
  return card;
}

function renderLevelWorkspace() {
  const levelSummary = summarizeLevel(state.activeTab);
  
  let title = `Level ${state.activeTab}`;
  if (state.activeTab === 1) title = "Level I - Diploma in IT";
  if (state.activeTab === 2) title = "Level II - Higher Diploma";
  if (state.activeTab === 3) title = "Level III - BIT Degree";
  activeLevelTitle.textContent = title;
  
  activeLevelBadge.textContent = `GPA ${levelSummary.gpa === null ? "--" : levelSummary.gpa.toFixed(2)}`;
  activeLevelCredits.textContent = `${levelSummary.credits} / ${levelSummary.totalCredits}`;
  activeLevelCCredits.textContent = `${levelSummary.cOrAboveCredits} / 20 required`;
  
  activeLevelStatus.textContent = levelSummary.progressMessage;
  activeLevelStatus.className = "";
  
  if (levelSummary.progressState === "eligible") {
    activeLevelStatus.className = "success-status";
  } else if (levelSummary.progressState === "caution") {
    activeLevelStatus.className = "caution-status";
  } else if (levelSummary.progressState === "blocked") {
    activeLevelStatus.className = "danger-status";
  } else {
    activeLevelStatus.className = "neutral-status";
  }

  const courses = visibleCourses();
  courseGrid.innerHTML = "";
  courses.forEach((course) => {
    courseGrid.appendChild(renderCourseCard(course));
  });
}

function render() {
  const levels = [1, 2, 3].map(summarizeLevel);
  
  const allGpaCourses = activeCourses().filter((c) => c.gpaCredits > 0);
  const enteredGpaCourses = allGpaCourses.filter((c) => effectiveGradePoint(c) !== null);
  
  const allCredits = enteredGpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  const allPoints = enteredGpaCourses.reduce((total, course) => {
    const gpv = effectiveGradePoint(course);
    return total + (gpv === null ? 0 : gpv * course.gpaCredits);
  }, 0);
  
  const cumulative = allCredits > 0 ? allPoints / allCredits : null;

  // Update page attributes
  const page = state.activeTab === "home" ? "home" : "dashboard";
  document.body.setAttribute("data-page", page);
  document.body.setAttribute("data-active-tab", state.activeTab);

  updateGauge(cumulative, allCredits);
  renderAwards(levels, cumulative);
  
  if (state.activeTab === 1 || state.activeTab === 2 || state.activeTab === 3) {
    renderLevelWorkspace();
  } else if (state.activeTab === "final") {
    renderYearSummaries(levels);
  }
}

function renderYearSummaries(levels) {
  const container = document.querySelector("#yearSummaryGrid");
  if (!container) return;
  container.innerHTML = "";

  levels.forEach((lvlSummary) => {
    const card = document.createElement("div");
    card.className = "year-summary-card";

    let title = "";
    let subLabel = "";
    if (lvlSummary.level === 1) {
      title = "Year 1";
      subLabel = "Diploma in IT";
    } else if (lvlSummary.level === 2) {
      title = "Year 2";
      subLabel = "Higher Diploma";
    } else if (lvlSummary.level === 3) {
      title = "Year 3";
      subLabel = "BIT Degree";
    }

    const gpaText = lvlSummary.gpa !== null ? lvlSummary.gpa.toFixed(2) : "--";
    const creditsText = `${lvlSummary.credits} / ${lvlSummary.totalCredits}`;

    // Map progress state to badge class
    let badgeClass = "neutral";
    let badgeText = "No grades";
    if (lvlSummary.progressState === "eligible") {
      badgeClass = "success";
      badgeText = "Eligible";
    } else if (lvlSummary.progressState === "caution") {
      badgeClass = "warning";
      badgeText = "Caution";
    } else if (lvlSummary.progressState === "blocked") {
      badgeClass = "danger";
      badgeText = "Blocked";
    } else if (lvlSummary.progressState === "neutral" && lvlSummary.credits > 0) {
      badgeClass = "info";
      badgeText = "On Track";
    }

    card.innerHTML = `
      <div class="summary-card-header">
        <div>
          <span class="sub-label">${subLabel}</span>
          <h3>${title}</h3>
        </div>
        <span class="status-badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="summary-card-body">
        <div class="summary-stat">
          <span class="stat-label">GPA</span>
          <span class="stat-value">${gpaText}</span>
        </div>
        <div class="summary-stat">
          <span class="stat-label">Credits</span>
          <span class="stat-value">${creditsText}</span>
        </div>
      </div>
      <button class="configure-level-btn" type="button">Edit Grades</button>
    `;

    // Click handler for Edit button
    card.querySelector(".configure-level-btn").addEventListener("click", () => {
      state.activeTab = lvlSummary.level;
      updateTabUI();
      saveState();
      render();
    });

    container.appendChild(card);
  });
}

// Initial Run
loadState();
render();
