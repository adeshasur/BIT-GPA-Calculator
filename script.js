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

const REPEAT_CAP = 2.0;

const COURSES = [
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
  activeLevel: localStorage.getItem("bit_gpa_active_level") || "home",
  level3Elective: "IT5506",
  grades: JSON.parse(localStorage.getItem("bit_gpa_grades") || "{}")
};

const gradeTemplate = document.querySelector("#gradeOptions");
const summaryGrid = document.querySelector("#summaryGrid");
const courseArea = document.querySelector("#courseArea");
const overallGpa = document.querySelector("#overallGpa");
const overallCredits = document.querySelector("#overallCredits");
const pageTitle = document.querySelector("#pageTitle");
const pageLead = document.querySelector("#pageLead");

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.activeLevel = button.dataset.level;
    localStorage.setItem("bit_gpa_active_level", state.activeLevel);
    render();
  });
});

document.querySelectorAll("[data-home-level]").forEach((button) => {
  button.addEventListener("click", () => {
    state.activeLevel = button.dataset.homeLevel;
    localStorage.setItem("bit_gpa_active_level", state.activeLevel);
    render();
  });
});

document.querySelectorAll("input[name='level3Elective']").forEach((input) => {
  input.addEventListener("change", (event) => {
    state.level3Elective = event.target.value;
    render();
  });
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  state.grades = {};
  localStorage.removeItem("bit_gpa_grades");
  render();
});

function activeCourses() {
  return COURSES.filter((course) => !course.optional || course.code === state.level3Elective);
}

function visibleLevels() {
  if (state.activeLevel === "home") {
    return [];
  }
  if (state.activeLevel === "all") {
    return [1, 2, 3];
  }
  return [Number(state.activeLevel)];
}

function gradeState(code) {
  if (!state.grades[code]) {
    state.grades[code] = { first: "", repeat: "", passed: false };
  }
  return state.grades[code];
}

function saveGrades() {
  localStorage.setItem("bit_gpa_grades", JSON.stringify(state.grades));
}

function isRepeatAllowed(grade) {
  return grade && GRADE_POINTS[grade] < REPEAT_CAP;
}

function effectiveGpv(course) {
  if (course.gpaCredits === 0) {
    return null;
  }

  const grades = gradeState(course.code);
  if (!grades.first) {
    return null;
  }

  if (isRepeatAllowed(grades.first) && grades.repeat) {
    return Math.min(GRADE_POINTS[grades.repeat], REPEAT_CAP);
  }

  return GRADE_POINTS[grades.first];
}

function summarizeLevel(level) {
  const courses = activeCourses().filter((course) => course.level === level);
  const gpaCourses = courses.filter((course) => course.gpaCredits > 0);
  const entered = gpaCourses.filter((course) => effectiveGpv(course) !== null);
  const credits = entered.reduce((total, course) => total + course.gpaCredits, 0);
  const totalCredits = gpaCourses.reduce((total, course) => total + course.gpaCredits, 0);
  const points = entered.reduce((total, course) => total + effectiveGpv(course) * course.gpaCredits, 0);
  const cCredits = entered.reduce((total, course) => total + (effectiveGpv(course) >= REPEAT_CAP ? course.gpaCredits : 0), 0);
  const eCount = gpaCourses.filter((course) => gradeState(course.code).first === "E").length;
  const enCourses = courses.filter((course) => course.enhancement);
  const enPassed = enCourses.every((course) => gradeState(course.code).passed);
  const gpa = credits > 0 ? points / credits : null;
  const complete = credits === totalCredits;

  return { level, credits, totalCredits, cCredits, eCount, enPassed, gpa, complete };
}

function statusFor(summary) {
  if (!summary.complete) {
    return { type: "warn", text: "Pending" };
  }
  if (summary.eCount > 0) {
    return { type: "bad", text: `${summary.eCount} E grade(s). Repeat needed.` };
  }
  if (!summary.enPassed) {
    return { type: "bad", text: "EN module pass is pending." };
  }
  if (summary.gpa < 1.5) {
    return { type: "bad", text: "GPA is below 1.50 progression threshold." };
  }
  if (summary.cCredits < 20) {
    return { type: "bad", text: "Less than 20 credits are C or above." };
  }
  return { type: "ok", text: "Progression criteria look okay." };
}

function formatGpa(value) {
  return value === null ? "--" : value.toFixed(2);
}

function renderSummary() {
  const summaries = [1, 2, 3].map(summarizeLevel);
  summaryGrid.innerHTML = summaries.map((summary) => {
    const status = statusFor(summary);
    return `
      <article class="summary-card">
        <span>Level ${summary.level}</span>
        <strong>${formatGpa(summary.gpa)}</strong>
        <small>${summary.credits} / ${summary.totalCredits} credits</small>
        <em class="status ${status.type}">${status.text}</em>
      </article>
    `;
  }).join("");

  const allCourses = activeCourses().filter((course) => course.gpaCredits > 0 && effectiveGpv(course) !== null);
  const credits = allCourses.reduce((total, course) => total + course.gpaCredits, 0);
  const points = allCourses.reduce((total, course) => total + effectiveGpv(course) * course.gpaCredits, 0);
  overallGpa.textContent = formatGpa(credits > 0 ? points / credits : null);
  overallCredits.textContent = `${credits} / 90 credits`;
}

function makeGradeSelect(course, key, disabled = false, placeholder = "Grade") {
  const select = document.createElement("select");
  select.innerHTML = gradeTemplate.innerHTML;
  select.options[0].textContent = placeholder;
  select.value = gradeState(course.code)[key] || "";
  select.disabled = disabled;
  select.addEventListener("change", () => {
    const grades = gradeState(course.code);
    grades[key] = select.value;
    if (key === "first" && !isRepeatAllowed(select.value)) {
      grades.repeat = "";
    }
    saveGrades();
    render();
  });
  return select;
}

function renderCourse(course) {
  const grades = gradeState(course.code);
  const gpv = effectiveGpv(course);
  const repeatAllowed = isRepeatAllowed(grades.first);
  const card = document.createElement("article");
  card.className = `course-card ${course.enhancement ? "en" : ""} ${repeatAllowed ? "repeat" : ""}`;

  card.innerHTML = `
    <div class="course-title">
      <div>
        <h3>${course.name}</h3>
      </div>
      <span class="badge ${course.enhancement ? "en" : ""}">${course.enhancement ? "EN" : `${course.gpaCredits} credits`}</span>
    </div>
    <div class="grade-row"></div>
    <div class="card-footer">
      <span>${course.enhancement ? "Status" : "GPV"}</span>
      <strong class="gpv">${course.enhancement ? (grades.passed ? "PASS" : "--") : formatGpa(gpv)}</strong>
    </div>
  `;

  const row = card.querySelector(".grade-row");

  if (course.enhancement) {
    const label = document.createElement("label");
    label.className = "pass-label";
    label.innerHTML = `<input type="checkbox" ${grades.passed ? "checked" : ""}> Pass`;
    label.querySelector("input").addEventListener("change", (event) => {
      gradeState(course.code).passed = event.target.checked;
      saveGrades();
      render();
    });
    row.append(label);
    return card;
  }

  const first = document.createElement("div");
  first.className = "grade-field";
  first.append(makeGradeSelect(course, "first", false, "Select Grade"));

  row.append(first);

  if (repeatAllowed) {
    const repeat = document.createElement("div");
    repeat.className = "grade-field";
    repeat.append(makeGradeSelect(course, "repeat", false, "Repeat Grade"));
    row.append(repeat);

    const hint = document.createElement("span");
    hint.className = "hint bad";
    hint.textContent = "Repeat capped at C.";
    card.insertBefore(hint, card.querySelector(".card-footer"));
  }

  return card;
}

function renderCourses() {
  courseArea.innerHTML = "";
  visibleLevels().forEach((level) => {
    const summary = summarizeLevel(level);
    const panel = document.createElement("section");
    panel.className = "level-panel";
    panel.innerHTML = `
      <header class="level-header">
        <div>
          <h2>Level ${level}</h2>
          <p>${summary.credits} / ${summary.totalCredits} credits</p>
        </div>
        <span class="level-gpa">GPA ${formatGpa(summary.gpa)}</span>
      </header>
      <div class="${state.activeLevel === "all" ? "course-grid" : "semester-grid"}"></div>
      ${state.activeLevel === "all" ? "" : `<div class="year-result"><span>Level ${level} GPA</span><strong>${formatGpa(summary.gpa)}</strong></div>`}
    `;

    const grid = panel.querySelector(".course-grid");
    const semesterGrid = panel.querySelector(".semester-grid");
    const levelCourses = activeCourses().filter((course) => course.level === level);

    if (grid) {
      levelCourses.forEach((course) => grid.append(renderCourse(course)));
    } else {
      const semesters = [...new Set(levelCourses.map((course) => String(course.semester)))];
      semesters.forEach((semester) => {
        const column = document.createElement("section");
        column.className = "semester-column";
        column.innerHTML = `<h3 class="semester-title">Semester ${semester}</h3>`;
        levelCourses.filter((course) => String(course.semester) === semester).forEach((course) => column.append(renderCourse(course)));
        semesterGrid.append(column);
      });
    }
    courseArea.append(panel);
  });
}

function render() {
  const app = document.querySelector(".app");
  app.dataset.view = state.activeLevel;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.level === state.activeLevel));
  if (state.activeLevel === "all") {
    pageTitle.textContent = "Overall GPA";
    pageLead.textContent = "Fill any level. Your overall GPA updates instantly.";
  } else if (state.activeLevel !== "home") {
    pageTitle.textContent = `Year ${state.activeLevel} GPA Calculation`;
    pageLead.textContent = "Select grades for each subject.";
  }
  renderSummary();
  renderCourses();
}

render();
