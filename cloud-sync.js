const CloudSync=(()=>{
 const TOKEN_KEY="aqsaCloudSession",PROFILE_KEY="aqsaCloudProfile";
 let syncing=false,timer=null;
 const config=window.AQSA_CLOUD_CONFIG||{};
 const configured=()=>/^https:\/\/.+\.supabase\.co\/?$/.test(config.url)&&config.anonKey.length>20;
 const token=()=>localStorage.getItem(TOKEN_KEY)||"";
 const profile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||"null")}catch{return null}};
 const status=(message,kind="")=>{const el=document.getElementById("cloudStatus");if(el){el.textContent=message;el.className=`cloud-status ${kind}`}};
 async function rpc(name,body){
  if(!configured())throw new Error("Cloud sync has not been connected yet.");
  const response=await fetch(`${config.url.replace(/\/$/,"")}/rest/v1/rpc/${name}`,{method:"POST",headers:{apikey:config.anonKey,Authorization:`Bearer ${config.anonKey}`,"Content-Type":"application/json"},body:JSON.stringify(body)});
  let data=null;try{data=await response.json()}catch{}
  if(!response.ok)throw new Error(data?.message||data?.hint||`Cloud request failed (${response.status}).`);
  return data;
 }
 function normalizeUsername(value){return value.trim().toLowerCase()}
 function validate(username,pin){
  if(!/^[a-z0-9][a-z0-9._-]{2,29}$/.test(username))throw new Error("Username must be 3–30 characters using letters, numbers, dots, dashes or underscores.");
  if(!/^\d{6,12}$/.test(pin))throw new Error("Parent PIN must contain 6–12 digits.");
 }
 function showState(){
  const active=Boolean(token()&&profile());
  document.getElementById("cloudSignedOut")?.classList.toggle("hidden",active);
  document.getElementById("cloudSignedIn")?.classList.toggle("hidden",!active);
  const name=document.getElementById("cloudProfileName");if(name)name.textContent=profile()?.username||"";
  if(!configured())status("Cloud code is ready. Connect a Supabase project to activate it.");
  else if(active)status("Scores are saved locally and will synchronize when this device is online.","success");
 }
 async function authenticate(create){
  const username=normalizeUsername(document.getElementById("cloudUsername").value),pin=document.getElementById("cloudPin").value;
  try{
   validate(username,pin);status(create?"Creating profile…":"Signing in…");
   const result=await rpc(create?"create_learning_profile":"login_learning_profile",{p_username:username,p_pin:pin,p_display_name:"Aqsa"});
   if(!result?.ok)throw new Error(result?.error||"Sign-in failed.");
   localStorage.setItem(TOKEN_KEY,result.token);localStorage.setItem(PROFILE_KEY,JSON.stringify({username:result.username,displayName:result.display_name||"Aqsa"}));
   document.getElementById("cloudPin").value="";showState();await sync(true);
  }catch(error){status(error.message,"error")}
 }
 function validRecord(r){return r&&typeof r.recordId==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(r.date||"")&&(YearCurriculum.levelIds||[1,2]).includes(Number(r.grade))&&["math","english","science"].includes(r.subject)&&Number.isFinite(Number(r.score))}
 function toCloud(r){return{id:r.recordId,date:r.date,timestamp:Number(r.timestamp)||Date.now(),grade:Number(r.grade),subject:r.subject,revision:String(r.revision||"legacy"),path_day:Number(r.pathDay)||null,path_start:r.pathStart||null,variant:Math.max(0,Number(r.variant)||0),unit:String(r.unit||""),score:Number(r.score),correct:Number(r.correct)||0,total:Number(r.total)||0}}
 function fromCloud(r){return{recordId:r.id,date:r.activity_date,timestamp:Number(r.activity_timestamp),grade:r.grade,subject:r.subject,revision:r.revision,pathDay:r.path_day,pathStart:r.path_start,variant:r.variant,unit:r.unit,score:r.score,correct:r.correct,total:r.total}}
 async function sync(manual=false){
  if(syncing||!token()||!configured()||!navigator.onLine){if(manual&&!navigator.onLine)status("Offline. Scores remain safely stored on this device and will sync later.");return}
  syncing=true;status("Synchronizing scores…");
  try{
   const local=getRecords().filter(validRecord),result=await rpc("sync_learning_scores",{p_token:token(),p_records:local.map(toCloud)});
   if(!result?.ok){if(result?.session_expired){localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(PROFILE_KEY);showState()}throw new Error(result?.error||"Synchronization failed.")}
   const merged=new Map(local.map(r=>[`${r.timestamp}:${r.grade}:${r.subject}`,r]));for(const row of result.records||[]){const record=fromCloud(row);merged.set(`${record.timestamp}:${record.grade}:${record.subject}`,record)}
   replaceRecords([...merged.values()].sort((a,b)=>a.timestamp-b.timestamp));status(`Synced ${merged.size} score record${merged.size===1?"":"s"}.`,"success");
  }catch(error){status(`${error.message} Local scores are still safe on this device.`,"error")}
  finally{syncing=false}
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(()=>sync(false),1200)}
 function signOut(){localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(PROFILE_KEY);showState();status("Signed out. Scores remain on this device.")}
 let bound=false;
 function bind(){
  if(bound)return;bound=true;
  document.getElementById("cloudCreate")?.addEventListener("click",()=>authenticate(true));
  document.getElementById("cloudSignIn")?.addEventListener("click",()=>authenticate(false));
  document.getElementById("cloudSyncNow")?.addEventListener("click",()=>sync(true));
  document.getElementById("cloudSignOut")?.addEventListener("click",signOut);
  window.addEventListener("online",schedule);showState();if(token())schedule();
 }
 document.readyState==="loading"?document.addEventListener("DOMContentLoaded",bind):bind();
 return{sync,schedule,configured,profile};
})();
window.CloudSync=CloudSync;
