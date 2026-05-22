const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  E: 0.0
};

const REPEAT_CAP = GRADE_POINTS.C;

const COURSES = [
  { level: 1, code: "EN1106", name: "Introductory Mathematics", semester: 1, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 1, code: "IT1106", name: "Information Systems", semester: 1, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT1206", name: "Computer Systems", semester: 1, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT1306", name: "Free and Open Source Software for Personal Computing", semester: 1, credits: 3, gpaCredits: 3 },
  { level: 1, code: "IT1406", name: "Introduction to Programming", semester: 1, credits: 4, gpaCredits: 4 },
  { level: 1, code: "EN2106", name: "Communication Skills I", semester: 2, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 1, code: "IT2106", name: "Mathematics for Computing I", semester: 2, credits: 3, gpaCredits: 3 },
  { level: 1, code: "IT2206", name: "Fundamentals of Software Engineering", semester: 2, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT2306", name: "Database Systems", semester: 2, credits: 4, gpaCredits: 4 },
  { level: 1, code: "IT2406", name: "Web Application Development I", semester: 2, credits: 4, gpaCredits: 4 },
  { level: 2, code: "EN3106", name: "Communication Skills II", semester: 3, credits: 2, gpaCredits: 0, enhancement: true },
  { level: 2, code: "IT3106", name: "Object Oriented Analysis & Design", semester: 3, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT3206", name: "Data Structures and Algorithms", semester: 3, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT3306", name: "Data Management Systems", semester: 3, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT3406", name: "Web Application Development II", semester: 3, credits: 4, gpaCredits: 4 },
  { level: 2, code: "IT4106", name: "User Experience Design", semester: 4, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT4206", name: "Enterprise Application Development", semester: 4, credits: 4, gpaCredits: 4 },
  { level: 2, code: "IT4306", name: "Information Technology Project Management", semester: 4, credits: 3, gpaCredits: 3 },
  { level: 2, code: "IT4406", name: "Agile Software Development", semester: 4, credits: 4, gpaCredits: 4 },
  { level: 2, code: "IT4506", name: "Computer Networks", semester: 4, credits: 3, gpaCredits: 3 },
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
  grades: {}
};

const container = document.querySelector("#courseContainer");
const summary = document.querySelector("#summary");
const overallGpa = document.querySelector("#overallGpa");
const overallCredits = document.querySelector("#overallCredits");
const gradeTemplate = document.querySelector("#gradeOptions");

document.querySelector("#levelFilter").addEventListener("change", (event) => {
  state.levelFilter = event.target.value;
  render();
});

document.querySelectorAll("input[name='level3Elective']").forEach((input) => {
  input.addEventListener("change", (event) => {
    state.level3Elective = event.target.value;
    render();
  });
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  state.grades = {};
  render();
});

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

  if (isRepeatAllowed(grades.first) && grades.repeat) {
    return Math.min(GRADE_POINTS[grades.repeat], REPEAT_CAP);
  }

  return GRADE_POINTS[grades.first];
}

function summarizeLevel(level) {
  const courses = activeCourses().filter((course) => course.level === level && course.gpaCredits > 0);
  const enhancementCourses = activeCourses().filter((course) => course.level === level && course.enhancement);
  const entered = courses.filter((course) => effectiveGradePoint(course) !== null);
  const points = entered.reduce((total, course) => total + effectiveGradePoint(course) * course.gpaCredits, 0);
  const credits = entered.reduce((total, course) => total + course.gpaCredits, 0);
  const totalCredits = courses.reduce((total, course) => total + course.gpaCredits, 0);
  const cOrAboveCredits = entered.reduce((total, course) => {
    return total + (effectiveGradePoint(course) >= REPEAT_CAP ? course.gpaCredits : 0);
  }, 0);
  const eGrades = courses.filter((course) => ensureGradeState(course.code).first === "E");
  const repeatCourses = courses.filter((course) => {
    const grade = ensureGradeState(course.code).first;
    return grade && grade !== "E" && GRADE_POINTS[grade] < REPEAT_CAP;
  });
  const enPassed = enhancementCourses.every((course) => ensureGradeState(course.code).passed);
  const gpa = credits > 0 ? points / credits : null;
  const complete = credits === totalCredits;
  const canProgress = complete && gpa >= 2 && cOrAboveCredits >= 20 && eGrades.length === 0 && enPassed;

  return {
    level,
    credits,
    totalCredits,
    cOrAboveCredits,
    eCount: eGrades.length,
    repeatCount: repeatCourses.length,
    enPassed,
    gpa,
    complete,
    canProgress
  };
}

function formatGpa(value) {
  return value === null ? "--" : value.toFixed(2);
}

function renderSummary() {
  const levels = [1, 2, 3].map(summarizeLevel);
  const allCredits = levels.reduce((total, item) => total + item.credits, 0);
  const allPoints = activeCourses().reduce((total, course) => {
    const gpv = effectiveGradePoint(course);
    return total + (gpv === null ? 0 : gpv * course.gpaCredits);
  }, 0);
  const cumulative = allCredits > 0 ? allPoints / allCredits : null;

  overallGpa.textContent = formatGpa(cumulative);
  overallCredits.textContent = `${allCredits} / 90 GPA credits`;

  summary.innerHTML = levels.map((item) => {
    const status = item.complete ? "Complete" : `${item.totalCredits - item.credits} credits pending`;
    const progression = progressionStatus(item);
    return `
      <article class="summary-card">
        <span>Level ${item.level}</span>
        <strong>${formatGpa(item.gpa)}</strong>
        <small>${item.credits} / ${item.totalCredits} GPA credits · ${item.cOrAboveCredits} credits C or above · ${status}</small>
        <em class="${progression.className}">${progression.text}</em>
      </article>
    `;
  }).join("") + `
    <article class="summary-card">
      <span>Overall</span>
      <strong>${formatGpa(cumulative)}</strong>
      <small>${allCredits} / 90 GPA credits entered</small>
    </article>
  `;
}

function progressionStatus(item) {
  if (!item.complete) {
    return { className: "neutral", text: "Enter all GPA course grades to check progression." };
  }

  if (item.eCount > 0) {
    return { className: "danger", text: `${item.eCount} E grade(s): repeat before progressing to the next year.` };
  }

  if (!item.enPassed) {
    return { className: "danger", text: "EN courses must be passed; they are not counted for GPA." };
  }

  if (item.gpa < 2) {
    return { className: "danger", text: "GPA is below 2.00; repeats/improvement are needed." };
  }

  if (item.cOrAboveCredits < 20) {
    return { className: "danger", text: "Less than 20 GPA credits are C or above; progression is at risk." };
  }

  if (item.repeatCount > 0) {
    return { className: "caution", text: `${item.repeatCount} repeat course(s), but progression criteria are currently met.` };
  }

  return { className: "success", text: "Progression criteria are currently met." };
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
    if (event.target.dataset.key === "first" && !isRepeatAllowed(event.target.value)) {
      current.repeat = "";
    }
    render();
  });
  return select;
}

function renderCourseRow(course) {
  const grades = ensureGradeState(course.code);
  const row = document.createElement("tr");
  const badgeClass = course.enhancement ? "badge en" : "badge";
  const badgeText = course.enhancement ? "EN non-GPA" : `${course.gpaCredits} GPA credits`;

  row.innerHTML = `
    <td data-label="Course">
      <span class="course-title">
        <strong>${course.code} · ${course.name}</strong>
        <span>Semester ${course.semester} · ${course.credits} credits</span>
      </span>
    </td>
    <td data-label="Type"><span class="${badgeClass}">${badgeText}</span></td>
    <td data-label="First grade" class="first-grade"></td>
    <td data-label="Repeat" class="repeat-cell"></td>
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
      render();
    });
    firstCell.appendChild(passLabel);
    repeatCell.innerHTML = "<span class='hint'>Excluded from GPA</span>";
    effectiveCell.textContent = grades.passed ? "PASS" : "--";
    return row;
  }

  firstCell.appendChild(gradeSelect(course, "first"));

  const repeatAllowed = isRepeatAllowed(grades.first);
  const repeatControls = document.createElement("div");
  repeatControls.className = "repeat-controls";
  repeatControls.appendChild(gradeSelect(course, "repeat", !repeatAllowed));
  repeatCell.appendChild(repeatControls);

  const hint = document.createElement("span");
  hint.className = `hint ${repeatAllowed ? "warning" : "ok"}`;
  hint.textContent = repeatAllowed
    ? "Repeat grade is capped at C / 2.00."
    : grades.first
      ? "C or above is final."
      : "Available only after C-, D+, D, or E.";
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
    if (levelCourses.length === 0) {
      return;
    }

    const levelSummary = summarizeLevel(level);
    const section = document.createElement("article");
    section.className = "level-card";
    section.innerHTML = `
      <header class="level-header">
        <div>
          <h2>Level ${level}</h2>
          <p>${levelSummary.credits} / ${levelSummary.totalCredits} GPA credits entered</p>
        </div>
        <div>
          <span class="badge">GPA ${formatGpa(levelSummary.gpa)}</span>
        </div>
      </header>
      <table class="course-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Type</th>
            <th>First grade</th>
            <th>Repeat</th>
            <th>Effective GPV</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
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

render();
