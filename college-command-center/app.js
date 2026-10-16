const lessons = [
  {
    id: "tlmt-systems",
    course: "RETAIL101",
    group: "RETAIL TECHNOLOGY",
    skill: "System roles",
    minutes: 6,
    title: "APS, CRM, and ERP",
    summary: "These systems share data, but each solves a different business problem: planning operations, managing customers, or connecting the enterprise.",
    rules: [
      "APS forecasts demand and plans inventory, movement, and schedules.",
      "CRM organizes customer information, service, and marketing interactions.",
      "ERP connects internal functions such as purchasing, inventory, finance, and HR.",
      "Choose a system by identifying the retailer's most costly problem first."
    ],
    method: [
      "Name the business problem: planning, customers, or disconnected internal records.",
      "Match the problem to APS, CRM, or ERP.",
      "Explain the operational result instead of merely defining the acronym."
    ],
    example: {
      prompt: "A grocer repeatedly runs out of fast-selling products.",
      work: "Problem: demand and replenishment planning\nBest fit: APS\nResult: forecast demand and schedule earlier replenishment",
      answer: "APS is the strongest first choice because the failure is planning-related."
    },
    memory: "APS plans. CRM knows customers. ERP connects the enterprise."
  },
  {
    id: "tlmt-tracking",
    course: "RETAIL101",
    group: "RETAIL TECHNOLOGY",
    skill: "Tracking and synchronization",
    minutes: 5,
    title: "Barcodes, RFID, and shared data",
    summary: "Retailers must identify products accurately, capture each event, update shared records, and turn that information into action.",
    rules: [
      "Barcodes normally require a visible, deliberate scan.",
      "RFID uses radio waves and may read several tags without direct line of sight.",
      "Synchronized records help stores, warehouses, suppliers, and planners use the same facts.",
      "Poor input data produces poor forecasts and replenishment decisions."
    ],
    method: [
      "Identify the item with a barcode or RFID tag.",
      "Capture the event, such as a sale, receipt, or movement.",
      "Update shared records and trigger the correct business action."
    ],
    example: {
      prompt: "A product is scanned at checkout.",
      work: "Sale captured → store inventory falls by one → planner sees the new level → replenishment decision updates",
      answer: "The scan matters because the data flows into the next decision."
    },
    memory: "Identify → capture → synchronize → decide."
  },
  {
    id: "tlmt-choice",
    course: "RETAIL101",
    group: "RETAIL TECHNOLOGY",
    skill: "Technology choice",
    minutes: 5,
    title: "Choosing the right first investment",
    summary: "A limited budget forces a retailer to solve the highest-impact problem first while recognizing what the unselected systems still provide.",
    rules: [
      "Choose APS for stockouts, overstock, demand variability, or scheduling.",
      "Choose CRM for retention, service, personalization, or marketing.",
      "Choose ERP for duplicate records and disconnected internal processes.",
      "A good recommendation connects the system to a measurable business outcome."
    ],
    method: [
      "Find the root problem rather than the most visible symptom.",
      "Select the system that directly changes that problem.",
      "State the benefit and one limitation of the choice."
    ],
    example: {
      prompt: "Purchasing and accounting record the same orders differently.",
      work: "Root problem: disconnected internal transactions\nBest fit: ERP\nBenefit: one coordinated record across departments",
      answer: "ERP addresses the integration problem more directly than APS or CRM."
    },
    memory: "Problem first. System second. Benefit third."
  },
  {
    id: "finc-basics",
    course: "FINANCE101",
    group: "INTEREST & INFLATION",
    skill: "Interest basics",
    minutes: 6,
    title: "Interest and interest rates",
    summary: "Interest is the dollar price of using money. The interest rate compares that dollar amount with the starting principal for a period.",
    rules: [
      "Principal is the amount invested or borrowed at the start.",
      "Interest is a dollar amount; the interest rate is a percentage.",
      "Rate = interest ÷ principal.",
      "Cash flows from different dates must be moved to the same point in time before comparison."
    ],
    method: [
      "Identify the beginning principal and ending amount.",
      "Subtract to find the dollar interest.",
      "Divide interest by principal and convert the decimal to a percentage."
    ],
    example: {
      prompt: "$1,000 grows to $1,100 in one year.",
      work: "Interest = 1,100 − 1,000 = 100\nRate = 100 ÷ 1,000 = 0.10",
      answer: "The interest is $100 and the interest rate is 10%."
    },
    memory: "Interest is dollars. Rate is the dollars compared with principal."
  },
  {
    id: "finc-timevalue",
    course: "FINANCE101",
    group: "INTEREST & INFLATION",
    skill: "Time value of money",
    minutes: 8,
    title: "Compounding and discounting",
    summary: "Compounding moves money forward in time. Discounting reverses the process to find what a future amount is worth today.",
    rules: [
      "Simple interest earns only on the original principal.",
      "Compound interest earns on principal and earlier interest.",
      "Future value: FV = PV(1 + r)^n.",
      "Present value: PV = FV ÷ (1 + r)^n."
    ],
    method: [
      "Label PV, FV, r, and n before choosing a formula.",
      "Convert the percentage rate to a decimal and match rate periods with n.",
      "Substitute, calculate, and test whether the direction makes sense."
    ],
    example: {
      prompt: "$500 earns 8% compound interest for two years.",
      work: "FV = 500(1 + .08)²\nFV = 500(1.1664)\nFV = 583.20",
      answer: "The future value is $583.20."
    },
    memory: "Forward means multiply. Backward means divide."
  },
  {
    id: "finc-inflation",
    course: "FINANCE101",
    group: "INTEREST & INFLATION",
    skill: "Inflation and real return",
    minutes: 5,
    title: "Nominal versus real returns",
    summary: "A balance can grow while its buying power falls. Real return shows growth after accounting for inflation.",
    rules: [
      "Nominal rates have not been adjusted for inflation.",
      "Real rate is approximately nominal rate minus inflation.",
      "If nominal return exceeds inflation, purchasing power rises.",
      "If inflation exceeds nominal return, purchasing power falls."
    ],
    method: [
      "Identify the nominal return and inflation rate.",
      "Subtract inflation for a quick real-return estimate.",
      "State what the result means for purchasing power."
    ],
    example: {
      prompt: "An account earns 5% while inflation is 3%.",
      work: "Approximate real return = 5% − 3% = 2%",
      answer: "Purchasing power rises by approximately 2%."
    },
    memory: "Nominal is the number. Real is what the money can buy."
  },
  {
    id: "itcc-objects",
    course: "OFFICE101",
    group: "WORD + EXCEL",
    skill: "Linking and embedding",
    minutes: 6,
    title: "Paste, link, or embed",
    summary: "The correct transfer method depends on whether the Word document needs a fixed snapshot, a live Excel connection, or a self-contained editable object.",
    rules: [
      "Paste creates a fixed copy that does not update with Excel.",
      "Link keeps Word connected to the source Excel file.",
      "Embed stores a separate Excel object inside Word.",
      "Links can break if the source workbook is moved or renamed."
    ],
    method: [
      "Ask whether the content must update when Excel changes.",
      "Ask whether the Word file must remain self-contained.",
      "Choose paste, link, or embed based on those two answers."
    ],
    example: {
      prompt: "A monthly report must always show the latest Excel chart.",
      work: "Needs automatic updates: yes\nNeeds live source connection: yes\nChoice: link",
      answer: "Link the chart so Excel changes can update Word."
    },
    memory: "Paste is a snapshot. Link is live. Embed lives inside Word."
  },
  {
    id: "itcc-merge",
    course: "OFFICE101",
    group: "WORD + EXCEL",
    skill: "Mail merge structure",
    minutes: 7,
    title: "Main document, records, and fields",
    summary: "Mail merge combines one reusable Word design with a structured data source to create many personalized documents.",
    rules: [
      "The main document contains the standard wording and layout.",
      "The data source contains recipient records.",
      "One row is one record; one column is one field.",
      "Merge fields are placeholders such as «FirstName»."
    ],
    method: [
      "Prepare a clean list with one header row and one recipient per row.",
      "Connect Word to the list and insert the correct merge fields.",
      "Preview several records before Finish & Merge."
    ],
    example: {
      prompt: "Create 40 letters using names stored in Excel.",
      work: "Word letter = main document\nExcel list = data source\nEach person = record\nFirstName = field",
      answer: "One template plus 40 records produces 40 personalized letters."
    },
    memory: "Word supplies the design. Excel supplies the people."
  },
  {
    id: "itcc-sources",
    course: "OFFICE101",
    group: "WORD + EXCEL",
    skill: "Office data sources",
    minutes: 5,
    title: "Outlook, Access, and Publisher",
    summary: "Different Office applications can supply contacts, filter complex records, or create visually designed personalized output.",
    rules: [
      "Outlook contacts can supply names, addresses, and emails.",
      "Access queries can filter, sort, and join larger relational data sets.",
      "Publisher supports visually designed personalized materials.",
      "The quality of the merged output depends on clean source data."
    ],
    method: [
      "Identify where the needed records already live.",
      "Filter the list before connecting it to the main document.",
      "Preview outliers such as missing fields and long names."
    ],
    example: {
      prompt: "Send a message only to active club members in one region.",
      work: "Large relational list + filtering requirement → Access query → connect selected records to Word",
      answer: "An Access query is useful because it can select the exact recipients first."
    },
    memory: "Outlook contacts. Access filters. Publisher designs."
  }
];

const questions = [
  { id:"t1", course:"RETAIL101", skill:"System roles", prompt:"Which system helps a retailer forecast demand and schedule replenishment?", choices:["APS","CRM","ERP","RFID"], correct:0, explanation:"APS is designed for advanced planning and scheduling, including demand forecasts and replenishment decisions.", trap:"ERP records and connects transactions, but the question asks specifically about planning future demand and replenishment.", takeaway:"APS plans the future; ERP connects the enterprise." },
  { id:"t2", course:"RETAIL101", skill:"System roles", prompt:"Which system is organized mainly around customer relationships and interactions?", choices:["ERP","CRM","APS","Barcode"], correct:1, explanation:"CRM stores and uses customer information for service, sales, retention, and marketing.", trap:"ERP can contain customer transactions, but customer relationships are CRM's central purpose.", takeaway:"When the problem says customer, think CRM first." },
  { id:"t3", course:"RETAIL101", skill:"Tracking and synchronization", prompt:"What is a common advantage of RFID over a standard barcode?", choices:["It removes the need for product records","It can often read tags without direct line of sight","It always costs less","It replaces APS and ERP"], correct:1, explanation:"RFID uses radio waves, so tags can often be detected without a visible one-at-a-time scan.", trap:"RFID improves identification and tracking; it does not replace planning or enterprise systems.", takeaway:"Barcode usually needs sight; RFID uses radio." },
  { id:"t4", course:"RETAIL101", skill:"Tracking and synchronization", prompt:"Why can incorrect inventory data cause a stockout?", choices:["The system may delay replenishment because it thinks stock is available","Customers stop using barcodes","RFID increases inflation","The ERP automatically closes the store"], correct:0, explanation:"If the record shows inventory that is not really available, the system may not reorder until the shelf is already empty.", trap:"Technology cannot fix every decision when the input data is wrong.", takeaway:"Accurate data is the foundation of accurate replenishment." },
  { id:"t5", course:"RETAIL101", skill:"Technology choice", prompt:"A retailer's purchasing, inventory, and accounting records do not agree. What is the strongest first system choice?", choices:["CRM","APS","ERP","RFID"], correct:2, explanation:"ERP connects internal functions and transactions, making it the strongest fit for disconnected company records.", trap:"APS may use inventory data, but it does not primarily solve enterprise-wide record integration.", takeaway:"Disconnected departments point to ERP." },
  { id:"t6", course:"RETAIL101", skill:"Technology choice", prompt:"A retailer has strong internal records but weak customer retention and generic marketing. What is the strongest first choice?", choices:["CRM","ERP","APS","Barcode"], correct:0, explanation:"CRM helps organize customer information and tailor service and marketing.", trap:"The retailer's internal process is already strong; the stated weakness is the customer relationship.", takeaway:"Choose the system that attacks the named problem." },
  { id:"f1", course:"FINANCE101", skill:"Interest basics", prompt:"An investment grows from $1,000 to $1,120. How much interest was earned?", choices:["$12","$100","$120","12%"], correct:2, explanation:"Interest is the ending amount minus the principal: $1,120 − $1,000 = $120.", trap:"12% is the rate, not the dollar interest.", takeaway:"Interest is dollars; rate is a percentage." },
  { id:"f2", course:"FINANCE101", skill:"Interest basics", prompt:"An investment earns $80 on a $1,000 principal. What is the interest rate?", choices:["0.8%","8%","12.5%","80%"], correct:1, explanation:"Rate = interest ÷ principal = 80 ÷ 1,000 = 0.08 = 8%.", trap:"Do not stop at the decimal; convert 0.08 to 8%.", takeaway:"Rate equals interest divided by principal." },
  { id:"f3", course:"FINANCE101", skill:"Time value of money", prompt:"Which formula finds compound future value?", choices:["FV = PV(1 + r)^n","PV = FV(1 + r)^n","FV = PV − r","FV = r ÷ PV"], correct:0, explanation:"Compound future value multiplies present value by the growth factor raised to the number of periods.", trap:"Dividing by the growth factor is used when discounting a future value back to the present.", takeaway:"Forward means multiply by (1 + r)^n." },
  { id:"f4", course:"FINANCE101", skill:"Time value of money", prompt:"What is the compound future value of $500 after two years at 8%?", choices:["$540.00","$580.00","$583.20","$640.00"], correct:2, explanation:"FV = 500(1.08)^2 = 500(1.1664) = $583.20.", trap:"$580 uses simple interest. Compound interest earns interest on the first year's interest too.", takeaway:"For compound growth, keep the exponent n." },
  { id:"f5", course:"FINANCE101", skill:"Inflation and real return", prompt:"An account earns 4% while inflation is 6%. What happens to purchasing power?", choices:["It rises about 10%","It rises about 2%","It stays the same","It falls about 2%"], correct:3, explanation:"Approximate real return = 4% − 6% = −2%, so purchasing power falls.", trap:"A positive nominal return does not guarantee a positive real return.", takeaway:"Compare the return with inflation, not with zero." },
  { id:"f6", course:"FINANCE101", skill:"Inflation and real return", prompt:"Which rate has already been adjusted for inflation?", choices:["Nominal rate","Real rate","Coupon rate only","Simple rate"], correct:1, explanation:"The real rate measures the change in purchasing power after inflation.", trap:"Nominal is the stated number before the inflation adjustment.", takeaway:"Real return tells what the money can actually buy." },
  { id:"i1", course:"OFFICE101", skill:"Linking and embedding", prompt:"A Word chart should update when its Excel source changes. Which method should you use?", choices:["Paste","Link","Screenshot","Retype"], correct:1, explanation:"A linked object keeps a connection to the source workbook and can reflect later changes.", trap:"A normal paste creates a fixed snapshot.", takeaway:"Link means live connection." },
  { id:"i2", course:"OFFICE101", skill:"Linking and embedding", prompt:"Which method stores a separate editable Excel object inside a Word file?", choices:["Paste as text","Link","Embed","Mail merge"], correct:2, explanation:"Embedding stores a copy of the Excel object inside the Word document.", trap:"A link points to an external source; an embed travels inside the document.", takeaway:"Embed lives inside Word." },
  { id:"i3", course:"OFFICE101", skill:"Mail merge structure", prompt:"In an Excel mail-merge list, what does one row normally represent?", choices:["One field","One recipient record","One Word template","One formula"], correct:1, explanation:"Each row contains one complete recipient record; columns hold individual fields.", trap:"A field is one category of information, such as FirstName, and therefore occupies a column.", takeaway:"Rows are records; columns are fields." },
  { id:"i4", course:"OFFICE101", skill:"Mail merge structure", prompt:"What is «FirstName» in a Word mail-merge document?", choices:["A recipient record","A merge field","A workbook","A formula"], correct:1, explanation:"It is a placeholder that Word replaces with the matching field value for each recipient.", trap:"The placeholder is not the data source itself; it points to one field in that source.", takeaway:"Merge fields are placeholders." },
  { id:"i5", course:"OFFICE101", skill:"Office data sources", prompt:"Which application is especially useful for filtering and joining records before a mail merge?", choices:["Paint","Access","PowerPoint","Calculator"], correct:1, explanation:"An Access query can filter, sort, select, and join records before Word uses them.", trap:"Excel is useful for a straightforward list, but the question emphasizes relational filtering and joining.", takeaway:"Access queries prepare complex recipient sets." },
  { id:"i6", course:"OFFICE101", skill:"Office data sources", prompt:"Why should ZIP codes sometimes be stored as text in Excel?", choices:["To preserve leading zeroes","To create interest formulas","To make mail merge slower","To sort names alphabetically"], correct:0, explanation:"Text formatting prevents Excel from dropping a leading zero, such as the first zero in 01234.", trap:"ZIP codes may contain only digits, but they function as identifiers rather than quantities.", takeaway:"Identifiers that can start with zero should often be text." }
];

const courses = [
  { code:"RETAIL101", cls:"tlmt", week:"Week 2", title:"Retail Technology", description:"APS, CRM, ERP, product tracking, and synchronized supply-chain data." },
  { code:"FINANCE101", cls:"finc", week:"Week 2", title:"Interest Rates and Inflation", description:"Interest, compounding, present and future value, nominal and real returns." },
  { code:"OFFICE101", cls:"itcc", week:"Week 2", title:"Word, Excel, and Mail Merge", description:"Linking and embedding data, merge structure, and Office data sources." }
];

// Fictional demonstration data; no student records or classroom account links.
const courseGrades = Object.fromEntries(courses.map(c => [c.code, {score:"Sample",letter:"B",percent:85,note:"Fictional sample grade"}]));
const courseProfileUrls = Object.fromEntries(courses.map(c => [c.code,"#tracker"]));
const demoStart = new Date(); demoStart.setHours(0,0,0,0); demoStart.setDate(demoStart.getDate()-demoStart.getDay()+1);
const courseWeeks = Object.fromEntries(courses.map(c => [c.code, Array.from({length:8}, (_,i) => ({week:i+1,topic:`Practice module ${i+1}`,tasks:[{id:`demo-${c.code}-${i}`,name:`Week ${i+1} practice assignment`,type:"Practice",status:"Not started",due:new Date(+demoStart+(i*7+6)*86400000).toISOString(),meta:"Fictional demonstration task"}]}))]));

const weeklyPlan = [
  { day:"MON", title:"Learn one core lesson", detail:"Read the rules, method, example, and memory hook.", minutes:"15 MIN" },
  { day:"TUE", title:"Practice the same skill", detail:"Answer at least five questions and read every explanation.", minutes:"15 MIN" },
  { day:"WED", title:"Switch to the next course", detail:"Complete one short lesson in a different active course.", minutes:"15 MIN" },
  { day:"THU", title:"Mixed recall check", detail:"Use adaptive practice across all three courses.", minutes:"20 MIN" },
  { day:"FRI", title:"Repair the weakest topic", detail:"Open Progress and study the lowest-mastery skill.", minutes:"15 MIN" },
  { day:"SAT", title:"Assignment connection", detail:"Apply one concept directly to the current assignment or discussion.", minutes:"25 MIN" },
  { day:"SUN", title:"Weekly review", detail:"Retake missed questions and mark completed lessons reviewed.", minutes:"20 MIN" }
];

const STORAGE_KEY = "course-command-center-portfolio-v1";
const todayKey = () => new Date().toISOString().slice(0, 10);
const defaultState = { skills:{}, lessons:{}, plan:{}, tracker:{}, hideFinished:false, dates:[], totalXp:0 };

function loadState() {
  try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
  catch { return structuredClone(defaultState); }
}

let state = loadState();
let currentLessonId = lessons[0].id;
let currentQuestion = null;
let selectedChoice = null;
let selectedConfidence = 0;
let sessionCorrect = 0;
let sessionAttempts = 0;
let currentTrackerCourse = "RETAIL101";

function saveState() {
  if (!state.dates.includes(todayKey())) state.dates.push(todayKey());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderOverview();
  renderProgress();
  if (document.getElementById("page-tracker").classList.contains("active")) renderTracker();
}

function skillKey(course, skill) { return `${course}::${skill}`; }
function skillRecord(course, skill) { return state.skills[skillKey(course, skill)] || { attempts:0, correct:0, confidence:0 }; }
function mastery(record) {
  if (!record.attempts) return 0;
  const accuracy = record.correct / record.attempts;
  const repetition = Math.min(record.attempts / 5, 1);
  const confidence = Math.min((record.confidence || 0) / (record.attempts * 3), 1);
  return Math.round((accuracy * .7 + repetition * .2 + confidence * .1) * 100);
}

function allSkills() {
  return lessons.map(l => ({ course:l.course, skill:l.skill, record:skillRecord(l.course,l.skill) }));
}

function courseMastery(course) {
  const rows = allSkills().filter(s => s.course === course);
  return Math.round(rows.reduce((sum,s) => sum + mastery(s.record), 0) / rows.length);
}

function overallMastery() {
  const rows = allSkills();
  return Math.round(rows.reduce((sum,s) => sum + mastery(s.record), 0) / rows.length);
}

function totalAttempts() { return allSkills().reduce((sum,s) => sum + s.record.attempts, 0); }
function totalCorrect() { return allSkills().reduce((sum,s) => sum + s.record.correct, 0); }

function streak() {
  const set = new Set(state.dates);
  let count = 0;
  const d = new Date();
  while (set.has(d.toISOString().slice(0,10))) {
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function weakestSkill(filter="all") {
  const rows = allSkills().filter(s => filter === "all" || s.course === filter);
  return [...rows].sort((a,b) => {
    const aScore = a.record.attempts ? mastery(a.record) : -1;
    const bScore = b.record.attempts ? mastery(b.record) : -1;
    return aScore - bScore || a.record.attempts - b.record.attempts;
  })[0];
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(el => el.classList.toggle("active", el.id === `page-${page}`));
  document.querySelectorAll(".nav-button").forEach(el => el.classList.toggle("active", el.dataset.nav === page));
  if (page === "learn") renderLessons();
  if (page === "practice" && !currentQuestion) nextAdaptiveQuestion();
  if (page === "plan") renderPlan();
  if (page === "tracker") renderTracker();
  if (page === "progress") renderProgress();
  window.scrollTo({ top:0, behavior:"smooth" });
}

document.querySelectorAll("[data-nav]").forEach(button => button.addEventListener("click", () => showPage(button.dataset.nav)));

function renderOverview() {
  const om = overallMastery();
  const attempts = totalAttempts();
  const correct = totalCorrect();
  document.getElementById("header-mastery").textContent = `${om}%`;
  document.getElementById("overview-mastery").textContent = `${om}%`;
  document.getElementById("overview-streak").textContent = `${streak()} day${streak() === 1 ? "" : "s"}`;
  document.getElementById("overview-attempts").textContent = attempts;
  document.getElementById("overview-accuracy").textContent = attempts ? `${Math.round(correct/attempts*100)}% overall accuracy.` : "No accuracy score yet.";
  document.getElementById("overview-mastery-note").textContent = attempts ? "Built from accuracy, repetition, and confidence." : "Complete practice to establish a baseline.";

  const weak = weakestSkill();
  document.getElementById("mission-title").textContent = attempts ? `Strengthen ${weak.skill}` : "Build your baseline";
  document.getElementById("mission-copy").textContent = attempts ? `${weak.course} is currently your best target for review and practice.` : "Answer a short mixed set so the coach can identify your strongest and weakest topics.";
  document.getElementById("mission-route").innerHTML = [
    ["1", "Quick refresher", "4 min"],
    ["2", "Five adaptive questions", "6 min"],
    ["3", "Review missed explanations", "2 min"]
  ].map(row => `<div class="mission-step"><span>${row[0]}</span><span>${row[1]}</span><small>${row[2]}</small></div>`).join("");

  document.getElementById("course-grid").innerHTML = courses.map(course => {
    const score = courseMastery(course.code);
    return `<article class="course-card ${course.cls}">
      <div class="course-accent"></div><div class="course-card-body">
      <div class="course-card-top"><span class="course-code">${course.code}</span><span class="week-badge">${course.week}</span></div>
      <h3>${course.title}</h3><p>${course.description}</p>
      <div class="mastery-row"><span>MASTERY</span><strong>${score}%</strong><div class="mastery-track"><div class="mastery-fill" style="width:${score}%"></div></div></div>
      <div class="course-actions"><button class="secondary-button" data-learn-course="${course.code}">Learn</button><button class="primary-button" data-practice-course="${course.code}">Practice</button></div>
      </div></article>`;
  }).join("");
  document.querySelectorAll("[data-learn-course]").forEach(button => button.addEventListener("click", () => {
    currentLessonId = lessons.find(l => l.course === button.dataset.learnCourse).id;
    showPage("learn");
  }));
  document.querySelectorAll("[data-practice-course]").forEach(button => button.addEventListener("click", () => {
    document.getElementById("practice-filter").value = button.dataset.practiceCourse;
    currentQuestion = null;
    showPage("practice");
  }));
}

document.getElementById("start-mission").addEventListener("click", () => { document.getElementById("practice-filter").value = "all"; currentQuestion = null; showPage("practice"); });

function renderLessons() {
  const groups = courses.map(c => ({ course:c.code, label:c.title }));
  document.getElementById("lesson-menu").innerHTML = groups.map(group => `
    <p class="lesson-menu-label">${group.course} · ${group.label}</p>
    ${lessons.filter(l => l.course === group.course).map(l => `<button class="${l.id === currentLessonId ? "active" : ""}" data-lesson="${l.id}"><span class="lesson-check">${state.lessons[l.id] ? "✓" : "○"}</span><span>${l.skill}</span><small>${l.minutes}m</small></button>`).join("")}
  `).join("");
  document.querySelectorAll("[data-lesson]").forEach(button => button.addEventListener("click", () => { currentLessonId = button.dataset.lesson; renderLessons(); }));

  const lesson = lessons.find(l => l.id === currentLessonId);
  document.getElementById("lesson-complete-count").textContent = Object.values(state.lessons).filter(Boolean).length;
  document.getElementById("lesson-content").innerHTML = `
    <div class="lesson-heading"><div><span class="course-tag">${lesson.course}</span><p class="lesson-heading-meta">${lesson.minutes} MIN REFRESHER · ${state.lessons[lesson.id] ? "REVIEWED" : "NOT YET REVIEWED"}</p><h2>${lesson.title}</h2></div><span class="lesson-number">${String(lessons.indexOf(lesson)+1).padStart(2,"0")}</span></div>
    <p class="lesson-summary">${lesson.summary}</p>
    <div class="lesson-section"><p class="eyebrow">RULES TO KNOW</p><div class="rule-grid">${lesson.rules.map((r,i) => `<div class="rule-item"><span>${i+1}</span><p>${r}</p></div>`).join("")}</div></div>
    <div class="lesson-section"><p class="eyebrow">THE METHOD</p><ol class="method-list">${lesson.method.map(s => `<li>${s}</li>`).join("")}</ol></div>
    <div class="worked-example"><p class="eyebrow">WORKED EXAMPLE</p><h3>${lesson.example.prompt}</h3><code>${lesson.example.work}</code><strong>${lesson.example.answer}</strong></div>
    <div class="memory-line"><span>MEMORY HOOK</span><strong>${lesson.memory}</strong></div>
    <div class="lesson-actions"><button class="secondary-button" id="complete-lesson">${state.lessons[lesson.id] ? "Reviewed — mark again" : "Mark refresher complete"}</button><button class="primary-button" id="practice-lesson">Practice ${lesson.skill}</button></div>`;
  document.getElementById("complete-lesson").addEventListener("click", () => { state.lessons[lesson.id] = true; state.totalXp += 20; saveState(); renderLessons(); });
  document.getElementById("practice-lesson").addEventListener("click", () => {
    document.getElementById("practice-filter").value = lesson.course;
    currentQuestion = null;
    showPage("practice");
  });
}

function nextAdaptiveQuestion() {
  const filter = document.getElementById("practice-filter").value;
  const weak = weakestSkill(filter);
  let pool = questions.filter(q => (filter === "all" || q.course === filter) && q.skill === weak.skill);
  if (!pool.length) pool = questions.filter(q => filter === "all" || q.course === filter);
  const prior = currentQuestion?.id;
  const candidates = pool.filter(q => q.id !== prior);
  currentQuestion = (candidates.length ? candidates : pool)[Math.floor(Math.random() * (candidates.length || pool.length))];
  selectedChoice = null;
  selectedConfidence = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuestion;
  document.getElementById("practice-course").textContent = q.course;
  document.getElementById("practice-skill").textContent = q.skill;
  document.getElementById("practice-run").textContent = `Session: ${sessionCorrect} correct / ${sessionAttempts} attempted`;
  document.getElementById("question-number").textContent = `QUESTION · ${q.course}`;
  document.getElementById("question-prompt").textContent = q.prompt;
  document.getElementById("choice-list").innerHTML = q.choices.map((choice,i) => `<button class="choice-button" data-choice="${i}"><span class="choice-letter">${String.fromCharCode(65+i)}</span><span>${choice}</span></button>`).join("");
  document.querySelectorAll("[data-choice]").forEach(button => button.addEventListener("click", () => {
    selectedChoice = Number(button.dataset.choice);
    document.querySelectorAll("[data-choice]").forEach(b => b.classList.toggle("selected", b === button));
    updateSubmit();
  }));
  document.querySelectorAll(".confidence-button").forEach(button => { button.classList.remove("selected"); button.disabled = false; });
  document.getElementById("confidence-row").hidden = false;
  document.getElementById("submit-answer").hidden = false;
  document.getElementById("submit-answer").disabled = true;
  document.getElementById("feedback-panel").hidden = true;
}

function updateSubmit() { document.getElementById("submit-answer").disabled = selectedChoice === null || selectedConfidence === 0; }

document.querySelectorAll(".confidence-button").forEach(button => button.addEventListener("click", () => {
  selectedConfidence = Number(button.dataset.confidence);
  document.querySelectorAll(".confidence-button").forEach(b => b.classList.toggle("selected", b === button));
  updateSubmit();
}));

document.getElementById("submit-answer").addEventListener("click", () => {
  const q = currentQuestion;
  const correct = selectedChoice === q.correct;
  const key = skillKey(q.course,q.skill);
  const record = skillRecord(q.course,q.skill);
  state.skills[key] = { attempts:record.attempts+1, correct:record.correct+(correct?1:0), confidence:(record.confidence||0)+selectedConfidence };
  state.totalXp += correct ? 10 : 3;
  sessionAttempts += 1;
  if (correct) sessionCorrect += 1;
  saveState();
  document.querySelectorAll("[data-choice]").forEach(button => button.disabled = true);
  document.querySelectorAll(".confidence-button").forEach(button => button.disabled = true);
  document.getElementById("confidence-row").hidden = true;
  document.getElementById("submit-answer").hidden = true;
  const feedback = document.getElementById("feedback-panel");
  feedback.hidden = false;
  document.getElementById("feedback-result").textContent = correct ? "Correct." : `Not quite. The answer is ${String.fromCharCode(65+q.correct)}.`;
  document.getElementById("feedback-xp").textContent = correct ? "+10 XP" : "+3 XP · reviewed";
  document.getElementById("feedback-explanation").textContent = q.explanation;
  document.getElementById("feedback-trap").textContent = q.trap;
  document.getElementById("feedback-takeaway").textContent = q.takeaway;
  document.getElementById("practice-run").textContent = `Session: ${sessionCorrect} correct / ${sessionAttempts} attempted`;
});

document.getElementById("next-question").addEventListener("click", nextAdaptiveQuestion);
document.getElementById("practice-filter").addEventListener("change", () => { currentQuestion = null; nextAdaptiveQuestion(); });

function allTrackedTasks() {
  return Object.entries(courseWeeks).flatMap(([course, weeks]) => weeks.flatMap(week => week.tasks.map(task => ({ ...task, course, week:week.week, topic:week.topic }))));
}

function trackerRecord(task) {
  return { status:task.status || "Not started", grade:task.grade || "", ...(state.tracker[task.id] || {}) };
}

function isFinished(status) { return status === "Submitted" || status === "Graded"; }

function formatDue(iso, includeTime=true) {
  const date = new Date(iso);
  const dateText = new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric" }).format(date);
  if (!includeTime) return dateText;
  const timeText = new Intl.DateTimeFormat("en-US", { hour:"numeric", minute:"2-digit" }).format(date);
  return `${dateText} · ${timeText}`;
}

function deadlineLabel(iso) {
  const now = new Date();
  const due = new Date(iso);
  const days = Math.ceil((due - now) / 86400000);
  if (days < 0) return { text:`${Math.abs(days)}d overdue`, tone:"late" };
  if (days === 0) return { text:"Due today", tone:"soon" };
  if (days === 1) return { text:"Due tomorrow", tone:"soon" };
  return { text:`${days} days`, tone:days <= 7 ? "soon" : "later" };
}

function renderTracker() {
  const currentWeek = Math.max(1, Math.min(8, Math.floor((new Date() - demoStart) / 604800000) + 1));
  const tasks = allTrackedTasks();

  document.getElementById("grade-strip").innerHTML = courses.map(course => {
    const grade = courseGrades[course.code];
    return `<button class="grade-card ${course.cls} ${course.code === currentTrackerCourse ? "active" : ""}" data-track-course="${course.code}">
      <span class="grade-card-code">${course.code}</span>
      <strong>${grade.letter}</strong>
      <span>${grade.score}</span>
      <div class="grade-meter"><i style="width:${grade.percent}%"></i></div>
      <small>${grade.note}</small>
    </button>`;
  }).join("");

  document.getElementById("tracker-course-tabs").innerHTML = courses.map(course => `<button role="tab" aria-selected="${course.code === currentTrackerCourse}" class="course-tab ${course.code === currentTrackerCourse ? "active" : ""}" data-track-course="${course.code}">${course.code}</button>`).join("");
  document.querySelectorAll("[data-track-course]").forEach(button => button.addEventListener("click", () => { currentTrackerCourse = button.dataset.trackCourse; renderTracker(); }));

  const upcoming = tasks
    .filter(task => task.due && !isFinished(trackerRecord(task).status))
    .sort((a,b) => new Date(a.due) - new Date(b.due));
  document.getElementById("deadline-count").textContent = `${upcoming.length} open deadline${upcoming.length === 1 ? "" : "s"}`;
  document.getElementById("deadline-list").innerHTML = upcoming.length ? upcoming.slice(0,6).map(task => {
    const timing = deadlineLabel(task.due);
    return `<button class="deadline-row" data-deadline-course="${task.course}" data-deadline-week="${task.week}">
      <span class="deadline-date"><strong>${formatDue(task.due, false)}</strong><small>${formatDue(task.due).split(" · ")[1]}</small></span>
      <span class="deadline-main"><strong>${task.name}</strong><small>${task.course} · Week ${task.week}</small></span>
      <span class="deadline-pill ${timing.tone}">${timing.text}</span>
    </button>`;
  }).join("") : `<p class="empty-state">No open dated deadlines. Keep checking the classroom for new work.</p>`;
  document.querySelectorAll("[data-deadline-course]").forEach(button => button.addEventListener("click", () => {
    currentTrackerCourse = button.dataset.deadlineCourse;
    renderTracker();
    document.getElementById(`week-${currentTrackerCourse}-${button.dataset.deadlineWeek}`)?.scrollIntoView({ behavior:"smooth", block:"center" });
  }));

  const courseTasks = tasks.filter(task => task.course === currentTrackerCourse && !task.optional);
  const done = courseTasks.filter(task => isFinished(trackerRecord(task).status)).length;
  const percent = Math.round(done / courseTasks.length * 100);
  document.getElementById("hide-finished").checked = Boolean(state.hideFinished);
  document.getElementById("week-progress").innerHTML = `<div><span>${currentTrackerCourse} SAMPLE COURSEWORK</span><strong>${done} of ${courseTasks.length} required items finished</strong></div><div class="week-progress-track"><i style="width:${percent}%"></i></div><strong>${percent}%</strong><a class="profile-link" href="${courseProfileUrls[currentTrackerCourse]}" target="_blank" rel="noopener">Demo course overview</a>`;

  const weeks = courseWeeks[currentTrackerCourse].filter(week => !state.hideFinished || !week.tasks.filter(task => !task.optional).every(task => isFinished(trackerRecord(task).status)));
  document.getElementById("week-grid").innerHTML = weeks.length ? weeks.map(week => `<article class="week-card ${week.week === currentWeek ? "current" : ""}" id="week-${currentTrackerCourse}-${week.week}">
    <div class="week-card-head"><span>WEEK ${week.week}</span>${week.week === currentWeek ? "<strong>CURRENT</strong>" : ""}</div>
    <h3>${week.topic}</h3>
    <div class="task-list">${week.tasks.filter(task => !state.hideFinished || !isFinished(trackerRecord(task).status)).map(task => {
      const record = trackerRecord(task);
      return `<div class="task-row ${isFinished(record.status) ? "finished" : ""}">
        <div class="task-title"><span><em>${task.type || "Coursework"}</em>${task.optional ? "<em class=\"optional-tag\">OPTIONAL</em>" : ""}</span><strong>${task.name}</strong><small>${task.due ? `Due ${formatDue(task.due)}` : task.optional ? "No grade or deadline" : "No due date shown in Class Progress"}</small>${task.meta ? `<small class="profile-meta">PROFILE: ${task.meta}</small>` : ""}</div>
        <label class="field-label">STATUS<select data-task-status="${task.id}">${["Not started","In progress","Submitted","Graded"].map(status => `<option ${record.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
        <label class="field-label grade-field">GRADE<input aria-label="Grade for ${task.name}" data-task-grade="${task.id}" type="number" min="0" max="100" step="0.01" value="${record.grade}" placeholder="—" /><span>%</span></label>
      </div>`;
    }).join("")}</div>
  </article>`).join("") : `<p class="empty-state week-empty">Everything marked submitted or graded is hidden. Turn off “Hide finished work” to see all eight weeks.</p>`;

  document.querySelectorAll("[data-task-status]").forEach(select => select.addEventListener("change", () => {
    state.tracker[select.dataset.taskStatus] = { ...(state.tracker[select.dataset.taskStatus] || {}), status:select.value };
    saveState();
  }));
  document.querySelectorAll("[data-task-grade]").forEach(input => input.addEventListener("change", () => {
    state.tracker[input.dataset.taskGrade] = { ...(state.tracker[input.dataset.taskGrade] || {}), grade:input.value };
    saveState();
  }));
}

document.getElementById("hide-finished").addEventListener("change", event => { state.hideFinished = event.target.checked; saveState(); });

function renderPlan() {
  document.getElementById("plan-grid").innerHTML = weeklyPlan.map((item,i) => `<label class="plan-card ${state.plan[i] ? "complete" : ""}"><input type="checkbox" data-plan="${i}" ${state.plan[i] ? "checked" : ""}/><span><span class="eyebrow">${item.day}</span><h3>${item.title}</h3><p>${item.detail}</p></span><time>${item.minutes}</time></label>`).join("");
  document.querySelectorAll("[data-plan]").forEach(input => input.addEventListener("change", () => { state.plan[input.dataset.plan] = input.checked; saveState(); renderPlan(); }));
  const done = Object.values(state.plan).filter(Boolean).length;
  document.getElementById("plan-status").textContent = `${done} of 7 study blocks complete`;
}

document.getElementById("reset-plan").addEventListener("click", () => { if (confirm("Reset this week's checklist?")) { state.plan = {}; saveState(); renderPlan(); } });

function renderProgress() {
  const skills = allSkills();
  document.getElementById("progress-summary").innerHTML = courses.map(course => {
    const score = courseMastery(course.code);
    const attempts = skills.filter(s => s.course === course.code).reduce((n,s) => n+s.record.attempts,0);
    return `<article class="progress-card"><div class="progress-card-top"><span>${course.code}</span><strong>${score}%</strong></div><div class="progress-bar-track"><div class="progress-bar-fill" style="width:${score}%"></div></div><p>${attempts} practice attempt${attempts===1?"":"s"} · ${course.title}</p></article>`;
  }).join("");

  const tested = skills.filter(s => s.record.attempts);
  const strongest = [...tested].sort((a,b) => mastery(b.record)-mastery(a.record)).slice(0,3);
  const weakest = [...skills].sort((a,b) => {
    const aa = a.record.attempts ? mastery(a.record) : -1;
    const bb = b.record.attempts ? mastery(b.record) : -1;
    return aa-bb;
  }).slice(0,3);
  const row = item => `<div class="skill-rank"><span>${item.skill}<small>${item.course} · ${item.record.attempts ? `${item.record.correct}/${item.record.attempts} correct` : "untested"}</small></span><strong>${mastery(item.record)}%</strong></div>`;
  document.getElementById("strength-list").innerHTML = strongest.length ? strongest.map(row).join("") : `<p class="text-muted">Complete practice to reveal your strengths.</p>`;
  document.getElementById("focus-list").innerHTML = weakest.map(row).join("");
  document.getElementById("skill-table-body").innerHTML = skills.map(item => {
    const accuracy = item.record.attempts ? Math.round(item.record.correct/item.record.attempts*100)+"%" : "—";
    return `<tr><td>${item.course}</td><td>${item.skill}</td><td>${item.record.attempts}</td><td>${accuracy}</td><td>${mastery(item.record)}%</td></tr>`;
  }).join("");
}

document.getElementById("reset-progress").addEventListener("click", () => {
  if (confirm("Reset all lessons, practice results, and study history? This cannot be undone.")) {
    state = structuredClone(defaultState); localStorage.removeItem(STORAGE_KEY); sessionAttempts = 0; sessionCorrect = 0; currentQuestion = null; renderOverview(); renderProgress(); showPage("overview");
  }
});

renderOverview();
renderProgress();
