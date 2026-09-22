const SUBJECTS={
  math:{label:"Math",icon:"➕",description:"Numbers, patterns and problem solving",color:"#ff8a55"},
  english:{label:"English",icon:"📖",description:"Reading, spelling and language",color:"#6558db"},
  science:{label:"Science",icon:"🔬",description:"Explore living things and our world",color:"#2aa978"}
};

const BANK={
  1:{
    math:[
      {p:"What number comes after 39?",a:"40"},{p:"7 + 5 = ?",a:"12"},{p:"15 − 6 = ?",a:"9"},
      {p:"Which number is greater?",a:"18",choices:["12","18","9","10"]},{p:"Write 24 in words.",a:"twenty four",aliases:["twenty-four"]},
      {p:"Put these numbers in order from smallest to greatest: 8, 3, 6",a:"3, 6, 8",aliases:["3 6 8"]},
      {p:"How many tens are in 50?",a:"5"},{p:"Which symbol makes this true? 9 __ 4",a:">",choices:[">","<","="]}
    ],
    english:[
      {p:"Which word is a naming word (noun)?",a:"dog",choices:["run","dog","blue","quickly"]},
      {p:"Choose the correct word: The cat ___ sleeping.",a:"is",choices:["is","are","am","be"]},
      {p:"Type the word you hear.",a:"happy",speak:"happy"},{p:"What is the opposite of big?",a:"small"},
      {p:"Add the missing letter: _ish",a:"f"},{p:"Read: “Mia has a red kite.” What color is the kite?",a:"red"},
      {p:"Which word is an action word (verb)?",a:"jump",choices:["table","jump","yellow","soft"]},
      {caseSensitive:true,p:"Fix the sentence with a capital letter: aqsa likes books.",a:"Aqsa likes books",aliases:["Aqsa likes books."]}
    ],
    science:[
      {p:"Which one is a living thing?",a:"tree",choices:["rock","tree","spoon","chair"]},
      {p:"Which body part helps you see?",a:"eyes",choices:["ears","eyes","nose","hands"]},
      {p:"Plants need water and ___.",a:"sunlight",aliases:["sun"]},{p:"What planet do we live on?",a:"earth"},
      {p:"Which animal can fly?",a:"bird",choices:["fish","bird","cat","frog"]},
      {p:"Ice is water in which state?",a:"solid",choices:["solid","liquid","gas"]},
      {p:"We use our ears to ___.",a:"hear"},{p:"Is the Sun a star?",a:"yes",choices:["yes","no"]}
    ]
  },
  2:{
    math:[
      {p:"46 + 27 = ?",a:"73"},{p:"82 − 35 = ?",a:"47"},{p:"4 groups of 3 make ___.",a:"12"},
      {p:"Half of 18 is ___.",a:"9"},{p:"Write 306 in words.",a:"three hundred six",aliases:["three hundred and six"]},
      {p:"What is the value of the 5 in 352?",a:"50",choices:["5","50","500"]},
      {p:"Arrange from greatest to smallest: 105, 150, 115",a:"150, 115, 105",aliases:["150 115 105"]},
      {p:"20 ÷ 5 = ?",a:"4"}
    ],
    english:[
      {p:"Which word is an adjective?",a:"bright",choices:["bright","sing","garden","slowly"]},
      {p:"Choose the correct plural of child.",a:"children",choices:["childs","children","childes"]},
      {p:"Type the word you hear.",a:"because",speak:"because"},{p:"Choose the past tense of walk.",a:"walked"},
      {p:"Read: “Lena packed an umbrella because dark clouds filled the sky.” Why did Lena pack an umbrella?",a:"because it might rain",aliases:["it might rain","because of rain","rain"]},
      {p:"Which sentence is a question?",a:"Where is my hat?",choices:["I found my hat.","Where is my hat?","Put on your hat."]},
      {p:"Complete with a pronoun: Sam is kind. ___ helps me.",a:"he",choices:["He","It","We"]},
      {p:"Spell the word for a place where books are kept.",a:"library"}
    ],
    science:[
      {p:"Which part of a plant takes in water from soil?",a:"roots",choices:["flower","roots","fruit","leaf"]},
      {p:"A caterpillar changes into a ___.",a:"butterfly"},{p:"Which material is attracted to a magnet?",a:"iron",choices:["wood","plastic","iron","paper"]},
      {p:"Water vapor is a ___.",a:"gas",choices:["solid","liquid","gas"]},{p:"Earth moves around the ___.",a:"sun"},
      {p:"Which sense helps us notice perfume?",a:"smell"},{p:"What do animals need to survive?",a:"food and water",aliases:["water and food","food, water","food water"]},
      {p:"A push or pull is called a ___.",a:"force"}
    ]
  }
};


const EXTRA={
1:{math:[
{p:"Count by tens: 10, 20, 30, __",a:"40"}, {p:"6 + 3 = ?",a:"9"},
{p:"12 − 4 = ?",a:"8"}, {p:"Which number is smaller?",a:"14",choices:["41","14"]},
{p:"Write 10 in words.",a:"ten"}, {p:"How many sides does a triangle have?",a:"3"}],
english:[{p:"Type the word you hear.",a:"sun",speak:"sun"},
{p:"Which word rhymes with cat?",a:"hat",choices:["hat","dog","sun"]},
{p:"Choose the plural: one book, two ___.",a:"books",choices:["book","books"]},
{p:"Which word describes a color?",a:"green",choices:["green","jump","table"]},
{p:"Read: Ben feeds his dog every morning. Who feeds the dog?",a:"Ben"},
{p:"Which mark ends a question?",a:"?",choices:["?",".",","]}],
science:[{p:"Which body part helps you smell?",a:"nose",choices:["nose","ears","eyes"]},
{p:"Which is nonliving?",a:"rock",choices:["cat","tree","rock"]},
{p:"Rain falls from ___.",a:"clouds",aliases:["a cloud","cloud"]},
{p:"Which animal lives in water?",a:"fish",choices:["fish","cat","horse"]},
{p:"Which is a liquid?",a:"water",choices:["ice","water","rock"]},
{p:"What should you do before eating?",a:"wash hands",choices:["wash hands","touch mud","skip washing"]}]},
2:{math:[{p:"Count by hundreds: 100, 200, 300, __",a:"400"},
{p:"5 × 2 = ?",a:"10"},{p:"12 shared equally among 3 children gives each child ___.",a:"4"},
{p:"How many hundreds are in 1,000?",a:"10"},{p:"Write 1,000 in words.",a:"one thousand"},
{p:"Which symbol fits? 306 __ 360",a:"<",choices:["<",">","="]}],
english:[{p:"Type the word you hear.",a:"garden",speak:"garden"},
{p:"Which word is a verb?",a:"swim",choices:["swim","blue","chair"]},
{p:"Choose the correct sentence.",a:"We are friends.",choices:["We is friends.","We are friends."]},
{p:"Read: Ali planted a seed. He watered it each day. A small shoot appeared. What did Ali plant?",a:"a seed",aliases:["seed"]},
{p:"Which word means the opposite of early?",a:"late"},
{p:"Choose the adjective: The soft blanket is warm.",a:"soft",choices:["soft","blanket","is"]}],
science:[{p:"Which action is a pull?",a:"pulling a wagon",choices:["pulling a wagon","kicking a ball"]},
{p:"What happens when ice warms enough?",a:"it melts",choices:["it melts","it becomes a rock"]},
{p:"Which part of a plant usually makes food using sunlight?",a:"leaves",choices:["roots","leaves","flowers"]},
{p:"What causes day and night on Earth?",a:"Earth spins",choices:["Earth spins","The Sun switches off"]},
{p:"Which animal hatches from an egg?",a:"chicken",choices:["chicken","cat","dog"]},
{p:"Which material lets light through clearly?",a:"clear glass",choices:["clear glass","wood","cardboard"]}]}
};
for(const g of [1,2])for(const subject of Object.keys(SUBJECTS))BANK[g][subject].push(...EXTRA[g][subject]);
// Shuffle with a date-based seed: the first sheet stays consistent all day.
function dailyQuestions(subject,again){
 const items=[...BANK[state.grade][subject]];
 let seed=2166136261;
 for(const c of `${today()}-${state.grade}-${subject}`)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 for(let i=items.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=again?Math.floor(Math.random()*(i+1)):seed%(i+1);[items[i],items[j]]=[items[j],items[i]];}
 return items.slice(0,10);
}

const CURRICULUM={
  Math:["Counting and number sense","Place value: ones, tens and hundreds","Addition and subtraction","Early multiplication and division","Number words and ordering","Greater than, less than and equal","Patterns, shapes, money and time"],
  English:["Letters, sounds and spelling","Nouns, verbs, adjectives and pronouns","Sentence building and punctuation","Listening dictation","Reading short passages","Vocabulary and comprehension","Speaking and storytelling"],
  Science:["Living and nonliving things","Plants and animals","The human body and five senses","Matter: solid, liquid and gas","Earth, weather and space","Forces, magnets and simple machines","Observation and simple experiments"]
};

const state={grade:Number(localStorage.getItem("aqsaGrade")||1),subject:null,questions:[],index:0,correct:0,selected:"",pencil:false,range:7};
const $=id=>document.getElementById(id);

function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function today(){return localDate()}
function getRecords(){return JSON.parse(localStorage.getItem("aqsaRecords")||"[]")}
function saveRecord(record){const records=getRecords();records.push(record);localStorage.setItem("aqsaRecords",JSON.stringify(records))}
function normalize(v){return String(v??"").trim().toLowerCase().replace(/[.!?]/g,"").replace(/-/g," ").replace(/\s+/g," ")}
function shuffle(items){return [...items].sort(()=>Math.random()-.5)}

function showPage(name){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$(name+"Page").classList.add("active");document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===name));scrollTo({top:0,behavior:"smooth"});if(name==="home")renderHome();if(name==="learn")renderCurriculum();if(name==="progress")renderDashboard();}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

function renderHome(){
  $("gradeSelect").value=state.grade;
  const records=getRecords(),done=new Set(records.filter(r=>r.date===today()).map(r=>r.subject));
  $("subjectCards").innerHTML=Object.entries(SUBJECTS).map(([key,s])=>`<article class="subject-card ${key}"><div class="subject-icon">${s.icon}</div><h3>${s.label}</h3><p>${s.description}</p><div class="subject-meta"><span class="done-badge">${done.has(key)?"✓ Done today":"10 questions"}</span><button class="start-btn" data-start="${key}">${done.has(key)?"Practice again":"Start"}</button></div></article>`).join("");
  document.querySelectorAll("[data-start]").forEach(b=>b.addEventListener("click",()=>startExercise(b.dataset.start)));
  const dates=[...new Set(records.map(r=>r.date))].sort().reverse();let streak=0,d=new Date();for(const date of dates){if(date===localDate(d)){streak++;d.setDate(d.getDate()-1)}else if(streak===0){d.setDate(d.getDate()-1);if(date===localDate(d)){streak++;d.setDate(d.getDate()-1)}else break}else break}$("streakCount").textContent=`${streak} day${streak===1?"":"s"} streak`;
}
$("gradeSelect").addEventListener("change",e=>{state.grade=Number(e.target.value);localStorage.setItem("aqsaGrade",state.grade);renderHome()});

function startExercise(subject,again=false){state.subject=subject;state.questions=dailyQuestions(subject,again);state.index=0;state.correct=0;state.selected="";state.pencil=false;showPage("exercise");renderQuestion()}
function renderQuestion(){
  state.checked=false;
  const q=state.questions[state.index],s=SUBJECTS[state.subject];
  $("exerciseSubject").textContent=s.label;$("exerciseSubject").style.color=s.color;$("exerciseTitle").textContent=`Grade ${state.grade} daily practice`;$("questionPosition").textContent=`${state.index+1} of ${state.questions.length}`;$("questionBar").style.width=`${(state.index/state.questions.length)*100}%`;$("questionPrompt").textContent=q.p;
  $("feedback").className="feedback hidden";$("feedback").textContent="";$("nextQuestion").classList.add("hidden");$("submitAnswer").classList.remove("hidden");$("pencilCorrect").classList.add("hidden");$("pencilTryAgain").classList.add("hidden");$("typedAnswer").value="";state.selected="";
  $("speakButton").classList.toggle("hidden",!q.speak);$("choiceAnswers").innerHTML=q.choices?q.choices.map(c=>`<button class="choice-btn" data-choice="${c}">${c}</button>`).join(""):"";$("textAnswerWrap").classList.toggle("hidden",Boolean(q.choices));
  document.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".choice-btn").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.selected=b.dataset.choice}));
  setMode("type");if(q.speak)setTimeout(()=>speak(q.speak),400);
}
function speak(word){if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.rate=.72;u.pitch=1.05;speechSynthesis.speak(u)}}
$("speakButton").addEventListener("click",()=>speak(state.questions[state.index].speak));

function checkAnswer(){if(state.checked)return;const q=state.questions[state.index],given=q.choices?state.selected:$("typedAnswer").value;if(!given){showFeedback("Please choose or type an answer.",false);return}const clean=q.caseSensitive?v=>String(v).trim().replace(/[.!?]$/," ").trim():normalize;const accepted=[q.a,...(q.aliases||[])].map(clean),ok=accepted.includes(clean(given));if(ok)state.correct++;showFeedback(ok?"Excellent! That is correct. 🌟":`Good try. The answer is “${q.a}.”`,ok);finishQuestion()}
function showFeedback(text,correct){$("feedback").textContent=text;$("feedback").className=`feedback ${correct?"correct":"incorrect"}`}
function finishQuestion(){state.checked=true;$("submitAnswer").classList.add("hidden");$("pencilCorrect").classList.add("hidden");$("pencilTryAgain").classList.add("hidden");$("nextQuestion").classList.remove("hidden");$("questionBar").style.width=`${((state.index+1)/state.questions.length)*100}%`}
$("submitAnswer").addEventListener("click",checkAnswer);$("typedAnswer").addEventListener("keydown",e=>{if(e.key==="Enter")checkAnswer()});
$("nextQuestion").addEventListener("click",()=>{state.index++;state.index<state.questions.length?renderQuestion():showResults()});

function setMode(mode){if(state.checked)return;state.pencil=mode==="pencil";$("typeMode").classList.toggle("active",!state.pencil);$("pencilMode").classList.toggle("active",state.pencil);$("pencilPanel").classList.toggle("hidden",!state.pencil);$("textAnswerWrap").classList.toggle("hidden",state.pencil||Boolean(state.questions[state.index].choices));$("choiceAnswers").classList.toggle("hidden",state.pencil);$("submitAnswer").classList.toggle("hidden",state.pencil);$("pencilCorrect").classList.toggle("hidden",!state.pencil);$("pencilTryAgain").classList.toggle("hidden",!state.pencil);if(state.pencil)clearCanvas()}
$("typeMode").addEventListener("click",()=>setMode("type"));$("pencilMode").addEventListener("click",()=>setMode("pencil"));
$("pencilCorrect").addEventListener("click",()=>{if(state.checked)return;state.correct++;showFeedback("Checked by a grown-up. Great work! 🌟",true);finishQuestion()});
$("pencilTryAgain").addEventListener("click",()=>{if(state.checked)return;showFeedback(`Check your writing. The answer is “${state.questions[state.index].a}.”`,false);finishQuestion()});

const canvas=$("writingCanvas"),ctx=canvas.getContext("2d");let drawing=false;
function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*(canvas.height/r.height)}}
function startDraw(e){drawing=true;const p=canvasPoint(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault()}
function draw(e){if(!drawing)return;const p=canvasPoint(e);ctx.lineWidth=7;ctx.lineCap="round";ctx.strokeStyle="#27324a";ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault()}
function endDraw(){drawing=false}
function clearCanvas(){ctx.clearRect(0,0,canvas.width,canvas.height)}
canvas.addEventListener("pointerdown",startDraw);canvas.addEventListener("pointermove",draw);canvas.addEventListener("pointerup",endDraw);canvas.addEventListener("pointerleave",endDraw);$("clearCanvas").addEventListener("click",clearCanvas);

function showResults(){const score=Math.round(state.correct/state.questions.length*100);saveRecord({date:today(),timestamp:Date.now(),grade:state.grade,subject:state.subject,score,correct:state.correct,total:state.questions.length});$("resultScore").textContent=`${score}%`;$("resultEmoji").textContent=score>=80?"🌟":score>=60?"😊":"🌱";$("resultHeading").textContent=score>=80?"Wonderful work!":score>=60?"Nice learning!":"Keep growing!";$("resultMessage").textContent=`You answered ${state.correct} of ${state.questions.length} questions correctly.`;showPage("result")}
$("anotherExercise").addEventListener("click",()=>startExercise(state.subject,true));$("resultHome").addEventListener("click",()=>showPage("home"));$("backHome").addEventListener("click",()=>showPage("home"));

function renderCurriculum(){
 $("learnGrade").value=state.grade;
 $("curriculumGrid").innerHTML=Object.entries(SUBJECTS).map(([key,subject])=>`<article class="curriculum-card"><h2>${subject.icon} ${subject.label}</h2><p>Grade ${state.grade} • Read, look and try</p>${LESSONS[state.grade][key].map((l,i)=>`<details class="lesson"><summary>${l.title}</summary><div class="lesson-body"><p>${l.text}</p><div class="lesson-visual" role="img" aria-label="${l.alt}">${l.visual}</div><p><strong>Example:</strong> ${l.example}</p><button class="secondary-btn" data-listen="${key}-${i}">🔊 Read lesson aloud</button><details class="mini-check"><summary>Try it: ${l.try}</summary><p>${l.answer}</p></details></div></details>`).join("")}<button class="primary-btn lesson-practice" data-practice="${key}">Practice ${subject.label} • 10 questions</button></article>`).join("");
 document.querySelectorAll("[data-listen]").forEach(b=>b.onclick=()=>{const [key,i]=b.dataset.listen.split("-");const l=LESSONS[state.grade][key][i];speak(l.title+". "+l.text+" Example. "+l.example)});
 document.querySelectorAll("[data-practice]").forEach(b=>b.onclick=()=>startExercise(b.dataset.practice));
}
$("learnGrade").addEventListener("change",e=>{state.grade=Number(e.target.value);localStorage.setItem("aqsaGrade",state.grade);renderCurriculum()});

function renderDashboard(){const records=getRecords(),cut=new Date();cut.setDate(cut.getDate()-(state.range-1));cut.setHours(0,0,0,0);const filtered=records.filter(r=>new Date(r.date+"T12:00:00")>=cut);const avg=arr=>arr.length?Math.round(arr.reduce((a,b)=>a+b.score,0)/arr.length):0;$("summaryCards").innerHTML=[[`${filtered.length}`,"Activities"],[`${avg(filtered)}%`,"Overall average"],[`${avg(filtered.filter(r=>r.subject==="math"))}%`,"Math average"],[`${new Set(filtered.map(r=>r.date)).size}`,"Active days"]].map(([v,l])=>`<div class="summary-card"><span>${l}</span><strong>${v}</strong></div>`).join("");drawChart(filtered,state.range);$("historyList").innerHTML=records.length?records.slice().sort((a,b)=>b.timestamp-a.timestamp).slice(0,10).map(r=>`<div class="history-row"><b>${SUBJECTS[r.subject].icon} ${SUBJECTS[r.subject].label}, Grade ${r.grade}</b><span>${new Date(r.timestamp).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</span><strong>${r.score}%</strong></div>`).join(""):`<div class="empty-state">Complete an activity to see progress here.</div>`}
function drawChart(records,days){const c=$("progressChart"),dpr=devicePixelRatio||1,w=c.clientWidth||900,h=c.clientHeight||340;c.width=w*dpr;c.height=h*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);x.clearRect(0,0,w,h);const pad={l:46,r:20,t:20,b:42},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;for(let i=0;i<=4;i++){const y=pad.t+ch*i/4;x.strokeStyle="#e6e3ef";x.beginPath();x.moveTo(pad.l,y);x.lineTo(w-pad.r,y);x.stroke();x.fillStyle="#7b8396";x.font="12px sans-serif";x.fillText(String(100-i*25),8,y+4)}const dates=[];for(let i=days-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dates.push(localDate(d))}const colors={math:"#ff8a55",english:"#6558db",science:"#2aa978"};for(const subject of Object.keys(SUBJECTS)){const pts=dates.map((date,i)=>{const rs=records.filter(r=>r.date===date&&r.subject===subject);return rs.length?{x:pad.l+cw*(i/Math.max(1,dates.length-1)),y:pad.t+ch*(1-rs.reduce((a,b)=>a+b.score,0)/rs.length/100)}:null});x.strokeStyle=colors[subject];x.lineWidth=3;x.beginPath();let begun=false;pts.forEach(p=>{if(!p)return;begun?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y);begun=true});x.stroke();pts.filter(Boolean).forEach(p=>{x.fillStyle="#fff";x.strokeStyle=colors[subject];x.lineWidth=3;x.beginPath();x.arc(p.x,p.y,5,0,Math.PI*2);x.fill();x.stroke()})}const labelEvery=days<=7?1:Math.ceil(days/6);dates.forEach((date,i)=>{if(i%labelEvery&&i!==dates.length-1)return;const px=pad.l+cw*(i/Math.max(1,dates.length-1));x.fillStyle="#7b8396";x.font="11px sans-serif";x.textAlign="center";x.fillText(new Date(date+"T12:00:00").toLocaleDateString([],{month:"short",day:"numeric"}),px,h-15)});x.textAlign="left"}
document.querySelectorAll(".range-btn").forEach(b=>b.addEventListener("click",()=>{state.range=Number(b.dataset.range);document.querySelectorAll(".range-btn").forEach(x=>x.classList.toggle("active",x===b));renderDashboard()}));
$("resetProgress").addEventListener("click",()=>{if(confirm("Delete all test scores stored on this device?")){localStorage.removeItem("aqsaRecords");renderDashboard();renderHome()}});window.addEventListener("resize",()=>{if($("progressPage").classList.contains("active"))renderDashboard()});

renderHome();renderCurriculum();
