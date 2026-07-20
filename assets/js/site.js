
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

const filterBtns = document.querySelectorAll('[data-filter]');
const workCards = document.querySelectorAll('[data-category]');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  workCards.forEach(card => {
    card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
  });
}));

const quizData = [{"q": "Where do your leads or enquiries go after someone contacts your business?", "pain": "Leads are not entering one clear system.", "a": [[0, "One clear system"], [1, "Email, WhatsApp, Instagram or website messages"], [2, "Different team members track them in different places"], [3, "I am not fully sure"]]}, {"q": "Can you quickly see who needs to be contacted today?", "pain": "Follow-up is not easy to see daily.", "a": [[0, "Yes, there is a clear follow-up list"], [1, "Sometimes, but I search manually"], [2, "I remember it myself or check messages"], [3, "Follow-up gets missed often"]]}, {"q": "When a lead comes in, do you know the exact stage they are in?", "pain": "Lead stages are unclear.", "a": [[0, "Yes, every lead has a stage"], [1, "Some leads are tracked, not all"], [2, "We mostly guess from messages"], [3, "We do not use stages"]]}, {"q": "How do you know which leads are most important?", "pain": "Hot leads may not be prioritized.", "a": [[0, "We rank by urgency, value or next action"], [1, "We try to remember who matters most"], [2, "We treat most leads the same"], [3, "There is no priority system"]]}, {"q": "Do you know how many enquiries became paying customers last month?", "pain": "Conversion from enquiry to customer is unclear.", "a": [[0, "Yes, I can see it clearly"], [1, "I can calculate it manually"], [2, "I only have a rough idea"], [3, "No, I do not know"]]}, {"q": "After a customer books, buys or signs up, what happens next?", "pain": "The after-enquiry process is not fixed.", "a": [[0, "There is a clear next-step process"], [1, "We send messages manually"], [2, "It depends on who handles it"], [3, "There is no fixed process"]]}, {"q": "Are client, project, order or booking details stored in one place?", "pain": "Important customer or project details are scattered.", "a": [[0, "Yes, everything is connected"], [1, "Some things are organized, some are scattered"], [2, "Details are spread across messages, sheets and notes"], [3, "I often have to search for information"]]}, {"q": "How often do you repeat the same manual tasks?", "pain": "Manual work is taking too much time.", "a": [[0, "Rarely"], [1, "Sometimes"], [2, "Every week"], [3, "Almost every day"]]}, {"q": "Can you see the full health of your business process in one dashboard?", "pain": "There is no simple dashboard for the business process.", "a": [[0, "Yes"], [1, "Partly"], [2, "No, I check many places"], [3, "I do not have a dashboard"]]}, {"q": "What would break first if your business got twice as many enquiries next month?", "pain": "Growth would make the current process harder to manage.", "a": [[0, "Nothing. Our system can handle it"], [1, "Follow-up would become harder"], [2, "Lead or customer tracking would become messy"], [3, "The whole process would become stressful"]]}, {"q": "When someone asks for an update, how fast can you answer?", "pain": "Status visibility is slow or unclear.", "a": [[0, "Immediately"], [1, "In a few minutes"], [2, "After checking messages or spreadsheets"], [3, "I often do not know without asking someone"]]}, {"q": "Are important business decisions based on clear data or memory?", "pain": "Decisions are based too much on memory or guessing.", "a": [[0, "Clear data"], [1, "Some data, some guessing"], [2, "Mostly memory and experience"], [3, "We do not track enough to know"]]}];
let qIndex = 0;
let answers = [];
const qText = document.getElementById('quiz-question');
const qCount = document.getElementById('quiz-count');
const progress = document.getElementById('quiz-progress');
const answersBox = document.getElementById('quiz-answers');
const backBtn = document.getElementById('quiz-back');
const quizCard = document.getElementById('quiz-card');
const resultPanel = document.getElementById('quiz-result');
function renderQuiz() {
  if (!qText) return;
  const item = quizData[qIndex];
  qText.textContent = item.q;
  qCount.textContent = `Question ${qIndex+1} of ${quizData.length}`;
  progress.style.width = `${(qIndex/quizData.length)*100}%`;
  answersBox.innerHTML = '';
  item.a.forEach(([score, label]) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      answers[qIndex] = {score, label, pain:item.pain};
      if (qIndex < quizData.length - 1) { qIndex++; renderQuiz(); } else { showResult(); }
    });
    answersBox.appendChild(btn);
  });
  if (backBtn) backBtn.disabled = qIndex === 0;
}
if (backBtn) backBtn.addEventListener('click', () => { if(qIndex>0){qIndex--; renderQuiz();} });
function showResult() {
  const total = answers.reduce((sum,a)=>sum+(a?.score||0),0);
  const pains = answers.filter(a => a && a.score >= 2).map(a => a.pain);
  let title, message, setup;
  if(total <= 8) {
    title = 'Your process is still manageable.';
    message = 'You may not need a full Airtable system yet. You may only need a cleaner contact form, a simple lead list, or a better enquiry flow.';
    setup = 'Website Clarity Review or simple lead list';
  } else if(total <= 18) {
    title = 'Airtable could help you stop losing clarity.';
    message = 'Your business is starting to show signs of scattered follow-up, manual tracking or unclear lead management.';
    setup = 'Airtable lead tracker with follow-up views';
  } else if(total <= 27) {
    title = 'Your business needs a proper workflow system.';
    message = 'Your answers show that your business may be relying too much on memory, messages, spreadsheets or manual follow-up.';
    setup = 'Custom Airtable CRM, pipeline, follow-up reminders and dashboard';
  } else {
    title = 'Your process may be blocking growth.';
    message = 'If enquiries doubled, the current process could become stressful. You likely need a full Airtable operations system.';
    setup = 'Full Airtable operations dashboard with CRM, tasks, follow-up and reporting';
  }
  quizCard.classList.add('hidden');
  resultPanel.classList.remove('hidden');
  document.getElementById('result-score').textContent = `Score: ${total} / 36`;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
  document.getElementById('result-setup').textContent = setup;
  const painList = document.getElementById('result-pains');
  painList.innerHTML = '';
  (pains.length ? pains : ['No major workflow issue selected.']).forEach(p => {
    const li = document.createElement('li'); li.textContent = p; painList.appendChild(li);
  });
  const emailBody = `Hi Oyeola Studio,

I completed the 2-Minute Workflow Check.

My score is: ${total} / 36
My result is: ${title}
Recommended setup: ${setup}

The biggest issues selected were:
- ${(pains.length?pains:['No major workflow issue selected']).join('
- ')}

My business/website link:

Please let me know the best next step.

Thank you.`;
  document.getElementById('result-email').href = `mailto:oyeolawebmaster@gmail.com?subject=${encodeURIComponent('Airtable workflow check result')}&body=${encodeURIComponent(emailBody)}`;
  progress.style.width = '100%';
}
renderQuiz();
