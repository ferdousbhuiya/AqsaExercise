const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const dom=new JSDOM(html,{url:'https://aqsa.test',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,context=dom.getInternalVMContext();
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:()=>()=>{}});
w.speechSynthesis={getVoices:()=>[],cancel:()=>{},speak:()=>{},addEventListener:()=>{}};w.SpeechSynthesisUtterance=class{};
Object.defineProperty(w.navigator,'onLine',{value:true,configurable:true});
w.AQSA_CLOUD_CONFIG={url:'https://project.supabase.co',anonKey:'public-anon-key-long-enough-for-test'};
const local={recordId:'local-score-0001',date:'2026-09-22',timestamp:1000,grade:1,subject:'math',revision:'mixed-v2',pathDay:1,pathStart:'2026-09-22',variant:0,unit:'Mixed math',score:90,correct:13,total:14};
w.localStorage.setItem('aqsaRecords',JSON.stringify([local]));
const calls=[];
w.fetch=async(url,options)=>{
 const name=url.split('/').pop(),body=JSON.parse(options.body);calls.push({name,body});
 if(name==='create_learning_profile')return{ok:true,json:async()=>({ok:true,token:'token-1',username:'aqsa',display_name:'Aqsa'})};
 if(name==='login_learning_profile')return{ok:true,json:async()=>({ok:true,token:'token-2',username:'aqsa',display_name:'Aqsa'})};
 if(name==='sync_learning_scores')return{ok:true,json:async()=>({ok:true,records:[
  {id:'cloud-copy',activity_date:'2026-09-22',activity_timestamp:1000,grade:1,subject:'math',revision:'mixed-v2',path_day:1,path_start:'2026-09-22',variant:0,unit:'Mixed math',score:90,correct:13,total:14},
  {id:'other-device',activity_date:'2026-09-23',activity_timestamp:2000,grade:1,subject:'science',revision:'mixed-v2',path_day:2,path_start:'2026-09-22',variant:0,unit:'Mixed science',score:100,correct:14,total:14}
 ]})};
 throw Error(name);
};
for(const file of ['lessons.js','year-curriculum.js','app.js','enhancements.js','cloud-sync.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}).runInContext(context);
if(w.document.readyState==='loading')w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const $=id=>w.document.getElementById(id);
 $('cloudUsername').value='Aqsa';$('cloudPin').value='123456';$('cloudCreate').click();await wait(30);
 assert.equal(calls[0].name,'create_learning_profile');assert.equal(calls[0].body.p_username,'aqsa');assert.equal(calls[0].body.p_pin,'123456');
 assert.equal(w.localStorage.getItem('aqsaCloudSession'),'token-1');
 assert.equal(calls[1].name,'sync_learning_scores');assert.equal(calls[1].body.p_records.length,1);
 const records=JSON.parse(w.localStorage.getItem('aqsaRecords'));
 assert.equal(records.length,2,'Natural-key duplicate from cloud is merged');
 assert.equal(records[0].recordId,'cloud-copy');assert.equal(records[1].recordId,'other-device');
 assert.match($('cloudStatus').textContent,/Synced 2 score records/);
 $('cloudSignOut').click();assert.equal(w.localStorage.getItem('aqsaCloudSession'),null);assert.equal(JSON.parse(w.localStorage.getItem('aqsaRecords')).length,2,'Signing out preserves local records');
 $('cloudUsername').value='aqsa';$('cloudPin').value='12';$('cloudSignIn').click();await wait(10);assert.match($('cloudStatus').textContent,/6–12 digits/);assert.equal(calls.filter(c=>c.name==='login_learning_profile').length,0);
 $('cloudPin').value='123456';$('cloudSignIn').click();await wait(30);assert.equal(calls.filter(c=>c.name==='login_learning_profile').length,1);assert.equal(w.localStorage.getItem('aqsaCloudSession'),'token-2');
 console.log('PASS: profile creation, PIN validation, local upload, cross-device download, duplicate merge, sign-out preservation and sign-in.');
 w.close();
})().catch(error=>{console.error(error);process.exit(1)});
