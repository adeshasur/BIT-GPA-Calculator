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
  levelFilter: "all",
  level3Elective: "IT5506",
  grades: {},
  theme: "dark"
};

// DOM References
const container = document.querySelector("#courseContainer");
const summary = document.querySelector("#summary");
const overallGpaElement = document.querySelector("#overallGpa");
const overallCreditsElement = document.querySelector("#overallCredits");
const gradeTemplate = document.querySelector("#gradeOptions");
const gaugeProgressCircle = document.querySelector("#gaugeProgress");
const themeToggleBtn = document.querySelector("#themeToggleBtn");

// Initialize state from LocalStorage
function loadState() {
  const savedGrades = localStorage.getItem("bit_gpa_grades");
  const savedElective = localStorage.getItem("bit_gpa_elective");
  const savedFilter = localStorage.getItem("bit_gpa_filter");
  const savedTheme = localStorage.getItem("bit_gpa_theme");

  if (savedGrades) {
    try {
      state.grades = JSON.parse(savedGrades);
    } catch (e) {
      state.grades = {};
    }
  }
  if (savedElective) state.level3Elective = savedElective;
  if (savedFilter) state.levelFilter = savedFilter;
  if (savedTheme) {
    state.theme = savedTheme;
  } else {
    // Detect system preference
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    state.theme = prefersLight ? "light" : "dark";
  }

  // Set inputs to match loaded state
  document.querySelector("#levelFilter").value = state.levelFilter;
  const radio = document.querySelector(`input[name='level3Elective'][value='${state.level3Elective}']`);
  if (radio) radio.checked = true;

  applyTheme();
}

function saveState() {
  localStorage.setItem("bit_gpa_grades", JSON.stringify(state.grades));
  localStorage.setItem("bit_gpa_elective", state.level3Elective);
  localStorage.setItem("bit_gpa_filter", state.levelFilter);
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

// Event Listeners
document.querySelector("#levelFilter").addEventListener("change", (event) => {
  state.levelFilter = event.target.value;
  saveState();
  render();
});

document.querySelectorAll("input[name='level3Elective']").forEach((input) => {
  input.addEventListener("change", (event) => {
    state.level3Elective = event.target.value;
    saveState();
    render();
  });
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all entered grades?")) {
    state.grades = {};
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
      state.grades = {};
    } else if (targetGrade) {
      // Set all active visible courses to targetGrade
      const active = activeCourses();
      active.forEach((course) => {
        const entry = ensureGradeState(course.code);
        if (course.enhancement) {
          entry.passed = (targetGrade !== "E"); // Pass EN subjects unless setting to E
        } else {
          entry.first = targetGrade;
          entry.repeat = ""; // clear repeats on bulk simulation
        }
      });
    }
    saveState();
    render();
  });
});

// Helper Functions
function activeCourses() {
  return COURSES.filter((course) => !course.optional || course.code === state.level3Elective);
}

function visibleCourses() {
  const courses = activeCourses();
  if (state.levelFilter === "all") {
    return courses;
  }
  return courses.filter((course) => String(course.level) === state.levelFilter);
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

// Logic: Check progression for a given level
function summarizeLevel(level) {
  const allLevelCourses = activeCourses().filter((course) => course.level === level);
  const gpaCourses = allLevelCourses.filter((course) => course.gpaCredits > 0);
  const enhancementCourses = allLevelCourses.filter((course) => course.enhancement);
  
  const enteredGpaCourses = gpaCourses.filter((course) => effectiveGradePoint(course) !== null);
  const totalGpaCredits = gpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  const enteredGpaCredits = enteredGpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  
  const points = enteredGpaCourses.reduce((total, course) => total + effectiveGradePoint(course) * course.gpaCredits, 0);
  const gpa = enteredGpaCredits > 0 ? points / enteredGpaCredits : null;
  
  // A course credit counts as "C or above" if effective grade point is >= 2.00
  const cOrAboveCredits = enteredGpaCourses.reduce((total, course) => {
    return total + (effectiveGradePoint(course) >= REPEAT_CAP ? course.gpaCredits : 0);
  }, 0);
  
  // Unresolved E count: Student failed the first attempt and either hasn't repeated or failed the repeat too
  const unresolvedE = gpaCourses.filter((course) => {
    const courseState = ensureGradeState(course.code);
    if (courseState.first === "E") {
      if (!courseState.repeat || courseState.repeat === "E") {
        return true;
      }
    }
    return false;
  });

  // Check if there are active repeat courses (grades below C that are not E, or E grades that have been repeated)
  const repeatCoursesCount = gpaCourses.filter((course) => {
    const courseState = ensureGradeState(course.code);
    const hasFirstFail = courseState.first && GRADE_POINTS[courseState.first] < REPEAT_CAP;
    return hasFirstFail;
  }).length;

  const enPassed = enhancementCourses.every((course) => ensureGradeState(course.code).passed);
  const enEntered = enhancementCourses.filter((course) => ensureGradeState(course.code).passed).length;
  const enTotal = enhancementCourses.length;

  const complete = (enteredGpaCredits === totalGpaCredits) && (enEntered === enTotal || enPassed);

  // UCSC BIT progression rule checks:
  // - Minimum GPA of 1.50 (NOT 2.00)
  // - Minimum 20 credits at C or above
  const hasMinGpa = gpa === null || gpa >= 1.50;
  const hasMinCCredits = cOrAboveCredits >= 20 || (enteredGpaCredits < 20 && cOrAboveCredits === enteredGpaCredits); // Allow partial checking
  
  // Can progress: 
  // We check progression status dynamically:
  // If GPA is below 1.5, progress is blocked.
  // If unresolved E is present, progress is allowed with resits.
  // If C credits < 20 (when fully entered), progress is blocked.
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
    // If not complete, but current stats are fine
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

  // Circular gauge animation (circumference is 263.89)
  const percentage = Math.min(cumulativeGpa / 4.0, 1.0);
  const offset = 263.89 - percentage * 263.89;
  gaugeProgressCircle.style.strokeDashoffset = offset;

  // Dynamically change gauge color based on GPA class thresholds
  if (cumulativeGpa >= 3.25) {
    gaugeProgressCircle.style.stroke = "var(--success)"; // First Class
  } else if (cumulativeGpa >= 3.00) {
    gaugeProgressCircle.style.stroke = "var(--color-secondary)"; // Second Upper
  } else if (cumulativeGpa >= 2.75) {
    gaugeProgressCircle.style.stroke = "var(--info)"; // Second Lower
  } else if (cumulativeGpa >= 2.00) {
    gaugeProgressCircle.style.stroke = "var(--text-secondary)"; // Pass
  } else if (cumulativeGpa >= 1.50) {
    gaugeProgressCircle.style.stroke = "var(--warning)"; // Progression
  } else {
    gaugeProgressCircle.style.stroke = "var(--danger)"; // Fail/Risk
  }
}

// Award eligibility card renderer
function renderAwards(levels, cumulativeGpa) {
  const getAwardBox = (id) => document.querySelector(id);
  const ditBox = getAwardBox("#ditAward");
  const hditBox = getAwardBox("#hditAward");
  const bitBox = getAwardBox("#bitAward");

  const lvl1 = levels.find((l) => l.level === 1);
  const lvl2 = levels.find((l) => l.level === 2);
  const lvl3 = levels.find((l) => l.level === 3);

  // Helper to check if a level has all GPA courses >= C and EN passed
  const isLevelAwardReady = (levelNum) => {
    const levelCourses = activeCourses().filter((c) => c.level === levelNum);
    const gpaCourses = levelCourses.filter((c) => c.gpaCredits > 0);
    const enhancementCourses = levelCourses.filter((c) => c.enhancement);

    const anyEmpty = gpaCourses.some((c) => {
      const gpv = effectiveGradePoint(c);
      return gpv === null;
    });

    if (anyEmpty) return "pending";

    // Check if any course is below C (GPV < 2.00)
    const hasBelowC = gpaCourses.some((c) => {
      const gpv = effectiveGradePoint(c);
      return gpv !== null && gpv < 2.00;
    });

    const enPassed = enhancementCourses.every((c) => ensureGradeState(c.code).passed);

    if (hasBelowC) return "ineligible";
    if (!enPassed) return "ineligible";
    return "eligible";
  };

  // 1. Diploma in IT (DIT) - Level I
  const ditStatus = isLevelAwardReady(1);
  updateAwardUI(ditBox, ditStatus, {
    pending: "Level I grades pending",
    ineligible: "Ineligible: Grade(s) below C",
    eligible: "Eligible: Diploma in IT"
  });

  // 2. Higher Diploma in IT (HDIT) - Level II
  let hditStatus = "pending";
  if (ditStatus === "eligible") {
    hditStatus = isLevelAwardReady(2);
  } else if (ditStatus === "ineligible") {
    hditStatus = "ineligible";
  }
  
  updateAwardUI(hditBox, hditStatus, {
    pending: ditStatus === "eligible" ? "Level II grades pending" : "Requires Level I Diploma",
    ineligible: "Ineligible: Grade(s) below C",
    eligible: "Eligible: Higher Diploma"
  });

  // 3. BIT Degree - Level III
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
    ineligible: cumulativeGpa !== null && cumulativeGpa < 2.00 ? "Ineligible: Cumulative GPA < 2.00" : "Ineligible: Grade(s) below C",
    eligible: `Eligible: BIT Degree (${getClassHonor(cumulativeGpa)})`
  };
  updateAwardUI(bitBox, bitStatus, bitStatusText);
}

function updateAwardUI(element, status, textMap) {
  element.className = `award-status-box ${status}`;
  const statusBadge = element.querySelector(".award-badge");
  statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  element.querySelector(".award-desc").textContent = textMap[status];
}

function getClassHonor(gpa) {
  if (gpa >= 3.25) return "1st Class";
  if (gpa >= 3.00) return "2nd Upper";
  if (gpa >= 2.75) return "2nd Lower";
  return "General Pass";
}

function renderSummary() {
  const levels = [1, 2, 3].map(summarizeLevel);
  
  // Cumulative GPA calculations
  const allGpaCourses = activeCourses().filter((c) => c.gpaCredits > 0);
  const enteredGpaCourses = allGpaCourses.filter((c) => effectiveGradePoint(c) !== null);
  
  const allCredits = enteredGpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  const allPoints = enteredGpaCourses.reduce((total, course) => {
    const gpv = effectiveGradePoint(course);
    return total + (gpv === null ? 0 : gpv * course.gpaCredits);
  }, 0);
  
  const cumulative = allCredits > 0 ? allPoints / allCredits : null;

  updateGauge(cumulative, allCredits);
  renderAwards(levels, cumulative);

  // Render year cards
  summary.innerHTML = levels.map((item) => {
    let cardClass = "level-all";
    if (item.level === 1) cardClass = "level-1";
    if (item.level === 2) cardClass = "level-2";
    if (item.level === 3) cardClass = "level-3";

    const progressClassMap = {
      eligible: "success",
      caution: "caution",
      blocked: "danger",
      neutral: "neutral"
    };
    const statusClass = progressClassMap[item.progressState];

    return `
      <article class="summary-card ${cardClass}">
        <span>Level ${item.level}</span>
        <strong>${item.gpa === null ? "--" : item.gpa.toFixed(2)}</strong>
        <small>${item.credits} / ${item.totalCredits} Credits Entered</small>
        <small style="margin-top: 4px; display: block; opacity: 0.85;">
          ${item.cOrAboveCredits} Cr &ge; C · ${item.repeatCount} Repeats
        </small>
        <em class="${statusClass}">${item.progressMessage}</em>
      </article>
    `;
  }).join("") + `
    <article class="summary-card level-all">
      <span>Cumulative Degree</span>
      <strong>${cumulative === null ? "--" : cumulative.toFixed(2)}</strong>
      <small>${allCredits} / 90 Total GPA Credits</small>
      <em class="neutral">${cumulative === null ? "Simulate grades to begin" : getClassHonor(cumulative)}</em>
    </article>
  `;
}

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
    
    // Auto-reset repeat if first attempt is changed to C or above
    if (event.target.dataset.key === "first" && !isRepeatAllowed(event.target.value)) {
      current.repeat = "";
    }
    
    saveState();
    render();
  });
  return select;
}

function renderCourseRow(course) {
  const grades = ensureGradeState(course.code);
  const row = document.createElement("tr");
  
  const badgeClass = course.enhancement ? "badge en" : "badge gpa";
  const badgeText = course.enhancement ? "EN" : `${course.gpaCredits} Credits`;

  row.innerHTML = `
    <td data-label="Course">
      <span class="course-title">
        <strong>${course.code} · ${course.name}</strong>
        <span>Semester ${course.semester} · ${course.credits} Credits total</span>
      </span>
    </td>
    <td data-label="Type"><span class="${badgeClass}">${badgeText}</span></td>
    <td data-label="First Attempt" class="first-grade"></td>
    <td data-label="Repeat Attempt" class="repeat-cell"></td>
    <td data-label="Effective GPV" class="effective"></td>
  `;

  const firstCell = row.querySelector(".first-grade");
  const repeatCell = row.querySelector(".repeat-cell");
  const effectiveCell = row.querySelector(".effective");

  if (course.enhancement) {
    const passLabel = document.createElement("label");
    passLabel.className = "pass-control";
    passLabel.innerHTML = `<input type="checkbox" ${grades.passed ? "checked" : ""}> Passed`;
    passLabel.querySelector("input").addEventListener("change", (event) => {
      ensureGradeState(course.code).passed = event.target.checked;
      saveState();
      render();
    });
    firstCell.appendChild(passLabel);
    repeatCell.innerHTML = "<span class='hint'>Excluded from GPA</span>";
    effectiveCell.textContent = grades.passed ? "PASS" : "--";
    effectiveCell.className = grades.passed ? "effective pass" : "effective";
    return row;
  }

  firstCell.appendChild(gradeSelect(course, "first"));

  const repeatAllowed = isRepeatAllowed(grades.first);
  const repeatControls = document.createElement("div");
  repeatControls.className = "repeat-controls";
  
  const selectRow = document.createElement("div");
  selectRow.className = "repeat-row-controls";
  selectRow.appendChild(gradeSelect(course, "repeat", !repeatAllowed));
  repeatControls.appendChild(selectRow);
  
  repeatCell.appendChild(repeatControls);

  const hint = document.createElement("span");
  hint.className = `hint ${repeatAllowed ? "warning" : "ok"}`;
  hint.textContent = repeatAllowed
    ? "Capped at C (2.00 GPV) if repeated."
    : grades.first
      ? "C or above is final."
      : "Allowed for C- or below.";
  repeatCell.appendChild(hint);

  const gpv = effectiveGradePoint(course);
  effectiveCell.textContent = gpv === null ? "--" : gpv.toFixed(2);
  return row;
}

function renderLevels() {
  const courses = visibleCourses();
  container.innerHTML = "";

  [1, 2, 3].forEach((level) => {
    const levelCourses = courses.filter((course) => course.level === level);
    if (levelCourses.length === 0) return;

    const levelSummary = summarizeLevel(level);
    const section = document.createElement("article");
    section.className = "level-card";
    
    let levelTitle = `Level ${level}`;
    if (level === 1) levelTitle = `Level I · Diploma in IT (DIT)`;
    if (level === 2) levelTitle = `Level II · Higher Diploma (HDIT)`;
    if (level === 3) levelTitle = `Level III · BIT Degree`;

    section.innerHTML = `
      <header class="level-header">
        <div>
          <h2>${levelTitle}</h2>
          <p>${levelSummary.credits} / ${levelSummary.totalCredits} GPA Credits Entered</p>
        </div>
        <div>
          <span class="badge gpa">GPA ${levelSummary.gpa === null ? "--" : levelSummary.gpa.toFixed(2)}</span>
        </div>
      </header>
      <div style="overflow-x: auto;">
        <table class="course-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Type</th>
              <th>First Attempt</th>
              <th>Repeat Attempt</th>
              <th style="text-align: center;">Effective GPV</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;

    const body = section.querySelector("tbody");
    levelCourses.forEach((course) => body.appendChild(renderCourseRow(course)));
    container.appendChild(section);
  });
}

function render() {
  renderSummary();
  renderLevels();
}

// Initial Run
loadState();
render();
