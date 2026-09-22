const SUBJECTS={
  math:{label:"Math",icon:"➕",description:"Numbers, patterns and problem solving",color:"#ff8a55"},
  english:{label:"English",icon:"📖",description:"Reading, spelling and language",color:"#6558db"},
  science:{label:"Science",icon:"🔬",description:"Explore living things and our world",color:"#2aa978"}
};

// Each calendar day maps to a stable curriculum sheet. Bonus sets are separate.
function selectedDay(){return state.reviewDay||YearCurriculum.dayForDate(yearStart(),today())}
function yearStart(){let start=localStorage.getItem("aqsaYearStart");if(!Number.isFinite(YearCurriculum.dateNumber(start))){start=today();localStorage.setItem("aqsaYearStart",start)}return start}
function currentPack(subject){return YearCurriculum.build(state.grade,subject,selectedDay())}
function dailyQuestions(subject,again){
 const day=selectedDay();let variant=0;
 if(again){const key=`aqsaBonus:${state.grade}:${subject}:${day}`;variant=Number(localStorage.getItem(key)||0)+1;localStorage.setItem(key,variant)}
 state.pack=YearCurriculum.build(state.grade,subject,day,variant);
 state.sessionDate=today();state.pathStart=yearStart();
 return state.pack.questions;
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderYearControls(){
 const day=selectedDay(),current=YearCurriculum.dayForDate(yearStart(),today());
 $("pathStatus").textContent=`Day ${day} of 365 · Week ${Math.min(52,Math.ceil(day/7))} · ${state.reviewDay?"Explore / review":"Today's path"}`;
 $("pathDay").value=day;$("yearStart").value=yearStart();
 $("todayPath").textContent=`Today · Day ${current}`;
 $("pathNote").textContent=current===365?"You have reached the last day of this path. All 365 days remain available for review. Start a new path date in Grown-up View when ready.":"A new day opens automatically using this device's local date. Choose any day to catch up or explore.";
}
const state={grade:[1,2].includes(Number(localStorage.getItem("aqsaGrade")))?Number(localStorage.getItem("aqsaGrade")):1,reviewDay:null,subject:null,questions:[],index:0,correct:0,selected:"",pencil:false,range:7};
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
  renderYearControls();
  const records=getRecords(),done=new Set(records.filter(r=>r.grade===state.grade&&r.pathStart===yearStart()&&r.pathDay===selectedDay()&&r.variant===0).map(r=>r.subject));
  $("subjectCards").innerHTML=Object.entries(SUBJECTS).map(([key,s])=>`<article class="subject-card ${key}"><div class="subject-icon">${s.icon}</div><h3>${s.label}</h3><p>${escapeHtml(currentPack(key).unit)}</p><p class="daily-topic">${escapeHtml(currentPack(key).lesson.title)}</p><button class="secondary-btn" data-learn="${key}">Learn first</button><div class="subject-meta"><span class="done-badge">${done.has(key)?"✓ Day complete":"10 questions"}</span><button class="start-btn" data-start="${key}">${done.has(key)?"Review this set":"Start"}</button></div></article>`).join("");
  document.querySelectorAll("[data-learn]").forEach(b=>b.onclick=()=>{showPage("learn");$("daily-"+b.dataset.learn).scrollIntoView({behavior:"smooth",block:"start"})});
  document.querySelectorAll("[data-start]").forEach(b=>b.addEventListener("click",()=>startExercise(b.dataset.start)));
  const dates=[...new Set(records.map(r=>r.date))].sort().reverse();let streak=0,d=new Date();for(const date of dates){if(date===localDate(d)){streak++;d.setDate(d.getDate()-1)}else if(streak===0){d.setDate(d.getDate()-1);if(date===localDate(d)){streak++;d.setDate(d.getDate()-1)}else break}else break}$("streakCount").textContent=`${streak} day${streak===1?"":"s"} streak`;
}
$("gradeSelect").addEventListener("change",e=>{state.grade=Number(e.target.value);localStorage.setItem("aqsaGrade",state.grade);renderHome()});

function startExercise(subject,again=false){state.subject=subject;state.questions=dailyQuestions(subject,again);state.index=0;state.correct=0;state.selected="";state.pencil=false;showPage("exercise");renderQuestion()}
function renderQuestion(){
  state.checked=false;
  const q=state.questions[state.index],s=SUBJECTS[state.subject];
  $("exerciseSubject").textContent=s.label;$("exerciseSubject").style.color=s.color;$("exerciseTitle").textContent=`Day ${state.pack.day} · ${state.pack.unit}${state.pack.variant?" · Bonus":""}`;$("questionPosition").textContent=`${state.index+1} of ${state.questions.length}`;$("questionBar").style.width=`${(state.index/state.questions.length)*100}%`;$("questionPrompt").textContent=q.p;
  $("questionPassage").textContent=q.passage||"";$("questionPassage").classList.toggle("hidden",!q.passage);$("questionKind").textContent=q.challenge?"Daily challenge":"Practice";
  $("feedback").className="feedback hidden";$("feedback").textContent="";$("nextQuestion").classList.add("hidden");$("submitAnswer").classList.remove("hidden");$("pencilCorrect").classList.add("hidden");$("pencilTryAgain").classList.add("hidden");$("typedAnswer").value="";state.selected="";
  $("speakButton").classList.toggle("hidden",!("speechSynthesis" in window));$("speakButton").textContent=q.speak?"🔊 Hear the word":"🔊 Read question aloud";$("choiceAnswers").innerHTML=q.choices?q.choices.map(c=>`<button class="choice-btn" data-choice="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join(""):"";$("textAnswerWrap").classList.toggle("hidden",Boolean(q.choices));
  document.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".choice-btn").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.selected=b.dataset.choice}));
  setMode("type");if(q.speak)setTimeout(()=>speak(q.speak),400);
}
function speak(word){if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.rate=.72;u.pitch=1.05;speechSynthesis.speak(u)}}
$("speakButton").addEventListener("click",()=>{const q=state.questions[state.index];speak(q.speak||`${q.passage||""} ${q.p}`)});

function checkAnswer(){if(state.checked)return;const q=state.questions[state.index],given=q.choices?state.selected:$("typedAnswer").value;if(!given){showFeedback("Please choose or type an answer.",false);return}const clean=q.choices?v=>String(v).trim().toLowerCase():q.caseSensitive?v=>String(v).trim().replace(/[.!?]$/," ").trim():normalize;const accepted=[q.a,...(q.aliases||[])].map(clean),ok=accepted.includes(clean(given));if(ok)state.correct++;showFeedback((ok?"Excellent! That is correct. 🌟":`Good try. The answer is “${q.a}.”`)+" "+(q.explanation||""),ok);finishQuestion()}
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

function showResults(){const score=Math.round(state.correct/state.questions.length*100);saveRecord({date:state.sessionDate,timestamp:Date.now(),grade:state.grade,subject:state.subject,pathDay:state.pack.day,pathStart:state.pathStart,variant:state.pack.variant,unit:state.pack.unit,score,correct:state.correct,total:state.questions.length});$("resultScore").textContent=`${score}%`;$("resultEmoji").textContent=score>=80?"🌟":score>=60?"😊":"🌱";$("resultHeading").textContent=score>=80?"Wonderful work!":score>=60?"Nice learning!":"Keep growing!";$("resultMessage").textContent=`You answered ${state.correct} of ${state.questions.length} questions correctly.`;$("resultChallenge").textContent=state.pack.lesson.challenge;showPage("result")}
$("anotherExercise").addEventListener("click",()=>startExercise(state.subject,true));$("resultHome").addEventListener("click",()=>showPage("home"));$("backHome").addEventListener("click",()=>showPage("home"));

function renderCurriculum(){
 $("learnGrade").value=state.grade;renderYearControls();
 $("learningDay").textContent=`Day ${selectedDay()} of 365 · Read, explore, then practice`;
 $("curriculumGrid").innerHTML=Object.entries(SUBJECTS).map(([key,subject])=>{
 const pack=currentPack(key),l=pack.lesson;
 return `<article id="daily-${key}" class="curriculum-card"><h2>${subject.icon} ${subject.label}</h2><p>Grade ${state.grade} · Day ${pack.day} · ${escapeHtml(pack.unit)}</p><h3>${escapeHtml(l.title)}</h3><div class="lesson-body"><p>${escapeHtml(l.text)}</p><div class="lesson-visual">${escapeHtml(l.visual).replace(/\n/g,"<br>")}</div><p><strong>Explore today's example:</strong> ${escapeHtml(l.example)}</p><button class="secondary-btn" data-daily-listen="${key}">🔊 Read lesson aloud</button><div class="mini-check"><h4>Today's hands-on challenge</h4><p>${escapeHtml(l.challenge)}</p><p>Explain or draw your answer with a grown-up. This activity is not automatically scored.</p></div></div><button class="primary-btn lesson-practice" data-practice="${key}">Practice this day · 10 questions</button><details class="lesson"><summary>Browse the full year's topics</summary><ol>${YearCurriculum.topics[key].map((topic,i)=>`<li><button class="topic-link" data-topic-day="${i*28+1}">${escapeHtml(topic)} · Days ${i*28+1}–${i===12?365:(i+1)*28}</button></li>`).join("")}</ol></details><details class="lesson"><summary>Foundation lesson library</summary>${LESSONS[state.grade][key].map(l=>`<details class="lesson"><summary>${escapeHtml(l.title)}</summary><p>${escapeHtml(l.text)}</p><p>${escapeHtml(l.example)}</p><details><summary>${escapeHtml(l.try)}</summary><p>${escapeHtml(l.answer)}</p></details></details>`).join("")}</details></article>`;
 }).join("");
 document.querySelectorAll("[data-daily-listen]").forEach(b=>b.onclick=()=>{const l=currentPack(b.dataset.dailyListen).lesson;speak(l.title+". "+l.text+" Example. "+l.example)});
 document.querySelectorAll("[data-practice]").forEach(b=>b.onclick=()=>startExercise(b.dataset.practice));
 document.querySelectorAll("[data-topic-day]").forEach(b=>b.onclick=()=>{state.reviewDay=Number(b.dataset.topicDay);renderCurriculum();scrollTo({top:0,behavior:"smooth"})});
}
$("learnGrade").addEventListener("change",e=>{state.grade=Number(e.target.value);localStorage.setItem("aqsaGrade",state.grade);renderCurriculum()});

function renderDashboard(){const records=getRecords(),cut=new Date();cut.setDate(cut.getDate()-(state.range-1));cut.setHours(0,0,0,0);const filtered=records.filter(r=>new Date(r.date+"T12:00:00")>=cut);const avg=arr=>arr.length?Math.round(arr.reduce((a,b)=>a+b.score,0)/arr.length):0;$("summaryCards").innerHTML=[[`${filtered.length}`,"Activities"],[`${avg(filtered)}%`,"Overall average"],[`${avg(filtered.filter(r=>r.subject==="math"))}%`,"Math average"],[`${new Set(filtered.map(r=>r.date)).size}`,"Active days"]].map(([v,l])=>`<div class="summary-card"><span>${l}</span><strong>${v}</strong></div>`).join("");drawChart(filtered,state.range);$("historyList").innerHTML=records.length?records.slice().sort((a,b)=>b.timestamp-a.timestamp).slice(0,10).map(r=>`<div class="history-row"><b>${SUBJECTS[r.subject].icon} ${SUBJECTS[r.subject].label}, Grade ${r.grade}${r.pathDay?` · Day ${r.pathDay}${r.variant?" (bonus)":""}`:""}</b><span>${new Date(r.timestamp).toLocaleString([], {month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</span><strong>${r.score}%</strong></div>`).join(""):`<div class="empty-state">Complete an activity to see progress here.</div>`}
function drawChart(records,days){const c=$("progressChart"),dpr=devicePixelRatio||1,w=c.clientWidth||900,h=c.clientHeight||340;c.width=w*dpr;c.height=h*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);x.clearRect(0,0,w,h);const pad={l:46,r:20,t:20,b:42},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;for(let i=0;i<=4;i++){const y=pad.t+ch*i/4;x.strokeStyle="#e6e3ef";x.beginPath();x.moveTo(pad.l,y);x.lineTo(w-pad.r,y);x.stroke();x.fillStyle="#7b8396";x.font="12px sans-serif";x.fillText(String(100-i*25),8,y+4)}const dates=[];for(let i=days-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dates.push(localDate(d))}const colors={math:"#ff8a55",english:"#6558db",science:"#2aa978"};for(const subject of Object.keys(SUBJECTS)){const pts=dates.map((date,i)=>{const rs=records.filter(r=>r.date===date&&r.subject===subject);return rs.length?{x:pad.l+cw*(i/Math.max(1,dates.length-1)),y:pad.t+ch*(1-rs.reduce((a,b)=>a+b.score,0)/rs.length/100)}:null});x.strokeStyle=colors[subject];x.lineWidth=3;x.beginPath();let begun=false;pts.forEach(p=>{if(!p)return;begun?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y);begun=true});x.stroke();pts.filter(Boolean).forEach(p=>{x.fillStyle="#fff";x.strokeStyle=colors[subject];x.lineWidth=3;x.beginPath();x.arc(p.x,p.y,5,0,Math.PI*2);x.fill();x.stroke()})}const labelEvery=days<=7?1:Math.ceil(days/6);dates.forEach((date,i)=>{if(i%labelEvery&&i!==dates.length-1)return;const px=pad.l+cw*(i/Math.max(1,dates.length-1));x.fillStyle="#7b8396";x.font="11px sans-serif";x.textAlign="center";x.fillText(new Date(date+"T12:00:00").toLocaleDateString([],{month:"short",day:"numeric"}),px,h-15)});x.textAlign="left"}
document.querySelectorAll(".range-btn").forEach(b=>b.addEventListener("click",()=>{state.range=Number(b.dataset.range);document.querySelectorAll(".range-btn").forEach(x=>x.classList.toggle("active",x===b));renderDashboard()}));
$("resetProgress").addEventListener("click",()=>{if(confirm("Delete all test scores stored on this device?")){localStorage.removeItem("aqsaRecords");renderDashboard();renderHome()}});window.addEventListener("resize",()=>{if($("progressPage").classList.contains("active"))renderDashboard()});

$("pathDay").addEventListener("change",e=>{const d=Number(e.target.value);if(!Number.isInteger(d)||d<1||d>365){e.target.value=selectedDay();return}state.reviewDay=d;renderHome();renderCurriculum()});
$("todayPath").addEventListener("click",()=>{state.reviewDay=null;renderHome();renderCurriculum()});
$("yearStart").addEventListener("change",e=>{if(!Number.isFinite(YearCurriculum.dateNumber(e.target.value))){e.target.value=yearStart();return}localStorage.setItem("aqsaYearStart",e.target.value);state.reviewDay=null;renderHome();renderCurriculum()});
// Refresh date-dependent views after the app has been in the background overnight.
document.addEventListener("visibilitychange",()=>{if(!document.hidden){renderHome();renderCurriculum()}});
renderHome();renderCurriculum();
