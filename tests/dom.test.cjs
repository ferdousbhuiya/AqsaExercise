const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const dom=new JSDOM(html,{url:'https://aqsa.test',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;
const voices=[{name:'Basic English',lang:'en-US',voiceURI:'basic',default:true},{name:'English Natural',lang:'en-US',voiceURI:'natural',default:false},{name:'French',lang:'fr-FR',voiceURI:'fr'}];
let lastSpoken=null;
w.speechSynthesis={getVoices:()=>voices,cancel:()=>{},speak:u=>{lastSpoken=u},addEventListener:()=>{}};
w.SpeechSynthesisUtterance=class{constructor(text){this.text=text}};
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({}, {get:()=>()=>{}});
const old={date:'2026-09-01',timestamp:1788307200000,grade:1,subject:'math',score:80,correct:8,total:10};
w.localStorage.setItem('aqsaRecords',JSON.stringify([old]));
for(const file of ['lessons.js','year-curriculum.js','app.js','enhancements.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}).runInContext(dom.getInternalVMContext());
const e=code=>new vm.Script(code).runInContext(dom.getInternalVMContext()),el=id=>w.document.getElementById(id),click=id=>el(id).click();
assert.match(el('pathStatus').textContent,/Day 1 of 365/);
for(const grade of [1,2])for(const subject of ['math','english','science']){
 e(`state.grade=${grade};state.reviewDay=183;renderHome();renderCurriculum();startExercise('${subject}');`);
 assert.equal(e('state.questions.length'),14);
 for(let i=0;i<14;i++){
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
assert.equal(JSON.stringify(e('getRecords()[0]')),JSON.stringify({...old,recordId:e('getRecords()[0].recordId')}));
// Punctuation must distinguish a statement from a question.
e("state.grade=1;state.reviewDay=141;startExercise('english');state.index=state.questions.findIndex(q=>q.skill==='Punctuation');renderQuestion();");
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
// Whole-year review must not add score records.
const before=e('getRecords().length');e("showPage('preview');review.day=365;review.grade=2;renderPreview();");
assert.equal(w.document.querySelectorAll('[data-review-day]').length,365);
assert.equal(w.document.querySelectorAll('.preview-questions>li').length,42);
click('previewAnswers');assert.equal(w.document.querySelectorAll('.answer-detail[open]').length,42);
assert.equal(e('getRecords().length'),before);
// Complete all four games; revisiting a solved game keeps Next Round available.
for(const kind of ['frog','shop','words','sort']){
 e(`game.kind='${kind}';game.round=0;game.stars=0;showPage('games');`);
 if(kind==='frog'){for(let i=0;i<10&&!e('game.done');i++)click('frogJump');}
 if(kind==='shop'){e('game.total=game.target;drawGame()');click('payCoins');}
 if(kind==='words'){e("game.picked=[];for(const letter of game.word){const i=game.letters.findIndex((t,j)=>t.letter===letter&&!game.picked.includes(j));game.picked.push(i)}drawGame();");click('checkWord');}
 if(kind==='sort')w.document.querySelector(`[data-bin="${e('game.side')}"]`).click();
 assert.equal(e('game.done'),true);assert.equal(e('game.stars'),1);
 e("showPage('home');showPage('games');");assert.equal(el('nextGameRound').classList.contains('hidden'),false);click('nextGameRound');assert.equal(e('game.done'),false);
}
assert.equal(e('getRecords().length'),before);
click('voiceSample');assert.equal(lastSpoken.voice.voiceURI,'natural');assert.equal(lastSpoken.pitch,1);assert.equal(lastSpoken.rate,.95);
assert.equal(el('voiceSelect').options.length,3,'Only English voices plus automatic');
el('voiceSelect').value='basic';el('voiceSelect').dispatchEvent(new w.Event('change'));el('voiceRate').value='0.8';el('voiceRate').dispatchEvent(new w.Event('change'));click('voiceSample');assert.equal(lastSpoken.voice.voiceURI,'basic');assert.equal(lastSpoken.rate,.8);
e("speak('2 × 3 = 6');");assert.match(lastSpoken.text,/times/);assert.match(lastSpoken.text,/equals/);
console.log('PASS: all subjects and grades, scoring, wrong punctuation, explanations, legacy records, bonus sets, pencil mode, full-year preview, four games, voice preferences and date changes.');
w.close();
