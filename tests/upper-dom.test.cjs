const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const dom=new JSDOM(html,{url:'https://aqsa.test',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.speechSynthesis={getVoices:()=>[],cancel:()=>{},speak:()=>{},addEventListener:()=>{}};w.SpeechSynthesisUtterance=class{};
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({}, {get:()=>()=>{}});
for(const file of ['lessons.js','year-curriculum.js','upper-curriculum.js','app.js','enhancements.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}).runInContext(dom.getInternalVMContext());
const e=code=>new vm.Script(code).runInContext(dom.getInternalVMContext()),el=id=>w.document.getElementById(id);
for(const id of ['gradeSelect','learnGrade','previewGrade','gameGrade'])assert.equal(el(id).querySelectorAll('option').length,11);
for(const level of [3,4,5,6,7,8,106,107,108])for(const subject of ['math','english','science']){
  e(`state.grade=${level};state.reviewDay=197;renderHome();renderCurriculum();startExercise('${subject}')`);
  assert.equal(e('state.questions.length'),15);
  assert.ok(el('questionPrompt').textContent.length>5);
  assert.equal(w.document.querySelectorAll('.lesson-step').length>=7,true);
  if(level>=106)assert.match(w.document.querySelector('.support-badge').textContent,/Supported VE pathway/);
}
e('review.grade=108;review.day=365;review.subject="all";renderPreview()');
assert.equal(w.document.querySelectorAll('.preview-questions>li').length,45);
assert.match(w.document.querySelector('.preview-subject h2').textContent,/VE 8/);
for(const kind of ['frog','shop','words','sort','fraction','equation','context','lab']){
  e(`state.grade=108;game.kind='${kind}';game.round=0;game.stars=0;renderGames()`);
  assert.match(el('gameBoard').textContent,/Round 1/);
}
console.log('PASS: Grade 3–8 and VE selectors, lessons, exercises, preview and eight games render correctly.');
w.close();
