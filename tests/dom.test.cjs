const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const dom=new JSDOM(html,{url:'https://aqsa.test',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({}, {get:()=>()=>{}});
const old={date:'2026-09-01',timestamp:1788307200000,grade:1,subject:'math',score:80,correct:8,total:10};
w.localStorage.setItem('aqsaRecords',JSON.stringify([old]));
for(const file of ['lessons.js','year-curriculum.js','app.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}).runInContext(dom.getInternalVMContext());
const e=code=>new vm.Script(code).runInContext(dom.getInternalVMContext()),el=id=>w.document.getElementById(id),click=id=>el(id).click();
assert.match(el('pathStatus').textContent,/Day 1 of 365/);
for(const grade of [1,2])for(const subject of ['math','english','science']){
 e(`state.grade=${grade};state.reviewDay=183;renderHome();renderCurriculum();startExercise('${subject}');`);
 assert.equal(e('state.questions.length'),10);
 for(let i=0;i<10;i++){
  const q=e('state.questions[state.index]');
  if(q.choices){const b=[...w.document.querySelectorAll('[data-choice]')].find(x=>x.dataset.choice===q.a);assert.ok(b);b.click();}
  else el('typedAnswer').value=q.a;
  click('submitAnswer');assert.match(el('feedback').textContent,/Excellent!/);
  click('submitAnswer');assert.equal(e('state.correct'),i+1,'Cannot double count answer');
  click('nextQuestion');
 }
 assert.equal(el('resultScore').textContent,'100%');
 assert.equal(e('getRecords().at(-1).pathDay'),183);
 click('anotherExercise');assert.ok(e('state.pack.variant')>0);
 click('backHome');
}
assert.equal(e('getRecords().length'),7);
assert.equal(JSON.stringify(e('getRecords()[0]')),JSON.stringify(old));
// Punctuation must distinguish a statement from a question.
e("state.grade=1;state.reviewDay=141;startExercise('english');state.index=5;renderQuestion();");
let wrong=[...w.document.querySelectorAll('[data-choice]')].find(x=>x.dataset.choice.endsWith('?'));
assert.ok(wrong);wrong.click();click('submitAnswer');assert.match(el('feedback').textContent,/Good try/);assert.equal(e('state.correct'),0);
// Same day's questions are stable after visiting other pages and generating bonuses.
e("state.reviewDay=null;startExercise('math');");const first=el('questionPrompt').textContent;e("startExercise('math',true);startExercise('math');");assert.equal(el('questionPrompt').textContent,first);
click('pencilMode');assert.equal(el('pencilPanel').classList.contains('hidden'),false);click('pencilCorrect');assert.equal(e('state.correct'),1);
el('pathDay').value='365';el('pathDay').dispatchEvent(new w.Event('change'));e("showPage('learn')");assert.match(el('daily-science').textContent,/Year finale/);
click('todayPath');assert.equal(e('selectedDay()'),1);
el('yearStart').value='2026-09-01';el('yearStart').dispatchEvent(new w.Event('change'));
assert.equal(e('selectedDay()'),e("YearCurriculum.dayForDate('2026-09-01',today())"));
e("showPage('progress')");assert.ok(el('historyList').textContent.includes('Day 183'));
assert.equal(e('getRecords().length'),7);
console.log('PASS: all subjects and grades, scoring, wrong punctuation, explanations, legacy records, bonus sets, pencil mode, day navigation and date changes.');
w.close();
