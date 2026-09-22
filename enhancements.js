/* Question visuals, family review, voice preferences and learning games. */
function questionVisual(q){
 const v=q.visual;if(!v)return '';
 const safe=escapeHtml;
 if(v.kind==='column')return `<div class="column-sum" aria-label="${v.a} ${v.op} ${v.b}"><div>${v.a}</div><div>${v.op} ${v.b}</div><div class="sum-line">?</div></div>`;
 if(v.kind==='array')return `<div class="counter-array" role="img" aria-label="${v.rows} rows of ${v.cols} counters" style="grid-template-columns:repeat(${v.cols},18px)">${Array.from({length:v.rows*v.cols},()=>'<span>●</span>').join('')}</div>`;
 if(v.kind==='line'){
  const x=n=>25+(n-v.min)/(v.max-v.min)*590;
  return `<svg class="number-line" viewBox="0 0 640 100" role="img" aria-label="Number line from ${v.min} to ${v.max}. Start at ${v.from}. Move ${Math.abs(v.delta)} steps ${v.delta<0?'left':'right'}."><path d="M25 55 H615" stroke="#6857d9" stroke-width="3"/>${Array.from({length:v.max-v.min+1},(_,i)=>{const n=i+v.min;return `<path d="M${x(n)} 48 V62" stroke="#6857d9"/><text x="${x(n)}" y="83" text-anchor="middle" font-size="15">${n}</text>`;}).join('')}<circle cx="${x(v.from)}" cy="55" r="7" fill="#f08040"/><text x="${x(v.from)}" y="30" text-anchor="middle" font-size="15">Start</text></svg>`;
 }
 if(v.kind==='fraction')return `<div class="fraction-bar" role="img" aria-label="${v.filled} shaded parts out of ${v.total} equal parts">${Array.from({length:v.total},(_,i)=>`<span class="${i<v.filled?'shaded':''}"></span>`).join('')}</div>`;
 if(v.kind==='shape'){const points={triangle:'100,15 180,145 20,145',square:'30,20 170,20 170,160 30,160',rectangle:'15,45 185,45 185,140 15,140',pentagon:'100,10 185,70 155,160 45,160 15,70'};return `<svg class="shape-picture" viewBox="0 0 200 180" role="img" aria-label="${safe(v.shape)}"><polygon points="${points[v.shape]}" fill="#e8e0ff" stroke="#6857d9" stroke-width="5"/></svg>`;}
 if(v.kind==='clock'){
  const point=(angle,length)=>[100+Math.sin(angle*Math.PI/180)*length,100-Math.cos(angle*Math.PI/180)*length];
  const h=point((v.hour%12)*30+v.minute*.5,42),m=point(v.minute*6,65);
  return `<svg class="clock-picture" viewBox="0 0 200 200" role="img" aria-label="Analog clock. Hour hand ${v.minute?`between ${v.hour} and ${v.hour%12+1}`:`at ${v.hour}`}, minute hand at ${v.minute/5||12}."><circle cx="100" cy="100" r="95" fill="white" stroke="#6857d9" stroke-width="4"/>${Array.from({length:12},(_,i)=>{const p=point((i+1)*30,78);return `<text x="${p[0]}" y="${p[1]+5}" font-size="16" text-anchor="middle">${i+1}</text>`;}).join('')}<path d="M100 100 L${h[0]} ${h[1]}" stroke="#24304a" stroke-width="7"/><path d="M100 100 L${m[0]} ${m[1]}" stroke="#d96024" stroke-width="4"/><circle cx="100" cy="100" r="5" fill="#6857d9"/></svg>`;
 }
 if(v.kind==='bars')return `<div class="mini-bars" role="img" aria-label="${v.labels.map((l,i)=>`${l}: ${v.values[i]}`).join('; ')}">${v.labels.map((l,i)=>`<div><span>${safe(l)}</span><b style="width:${v.values[i]/Math.max(...v.values)*65}%">${v.values[i]}</b></div>`).join('')}</div>`;
 return '';
}
const review={day:1,grade:1,subject:'all',answers:false};
function renderPreview(){
 $('previewGrade').value=review.grade;$('previewSubject').value=review.subject;$('previewDay').value=review.day;
 $('previewDays').innerHTML=Array.from({length:365},(_,i)=>`<button class="day-tile ${review.day===i+1?'selected':''}" data-review-day="${i+1}" aria-label="Preview day ${i+1}" aria-pressed="${review.day===i+1}">${i+1}</button>`).join('');
 const subjects=review.subject==='all'?Object.keys(SUBJECTS):[review.subject];
 $('previewSets').innerHTML=subjects.map(subject=>{
  const pack=YearCurriculum.build(review.grade,subject,review.day);
  return `<article class="preview-subject"><h2>${SUBJECTS[subject].icon} Day ${review.day} · Grade ${review.grade} · ${SUBJECTS[subject].label}</h2><p>${[...new Set(pack.questions.map(q=>q.skill))].map(escapeHtml).join(' · ')}</p><button class="primary-btn" data-preview-practice="${subject}">Practice this exact set</button><ol class="preview-questions">${pack.questions.map(q=>`<li><span class="skill-tag">${escapeHtml(q.skill)}</span>${q.passage?`<p class="reading-passage">${escapeHtml(q.passage)}</p>`:''}<p>${escapeHtml(q.p)}</p>${questionVisual(q)}${q.choices?`<p class="preview-choices">Options: ${q.choices.map(escapeHtml).join(' / ')}</p>`:''}<details class="answer-detail" ${review.answers?'open':''}><summary>Answer and explanation</summary><p><strong>${escapeHtml(q.a)}</strong> · ${escapeHtml(q.explanation)}</p></details></li>`).join('')}</ol></article>`;
 }).join('');
 $('previewPrev').disabled=review.day===1;$('previewNext').disabled=review.day===365;
 $('previewAnswers').textContent=review.answers?'Hide all answers':'Show all answers';
 document.querySelectorAll('[data-review-day]').forEach(b=>b.onclick=()=>{review.day=Number(b.dataset.reviewDay);renderPreview()});
 document.querySelectorAll('[data-preview-practice]').forEach(b=>b.onclick=()=>{state.grade=review.grade;state.reviewDay=review.day;localStorage.setItem('aqsaGrade',state.grade);startExercise(b.dataset.previewPractice)});
}
$('previewGrade').onchange=e=>{review.grade=Number(e.target.value);renderPreview()};
$('previewSubject').onchange=e=>{review.subject=e.target.value;renderPreview()};
$('previewDay').onchange=e=>{const n=Number(e.target.value);if(Number.isInteger(n)&&n>=1&&n<=365)review.day=n;renderPreview()};
$('previewPrev').onclick=()=>{review.day=Math.max(1,review.day-1);renderPreview()};
$('previewNext').onclick=()=>{review.day=Math.min(365,review.day+1);renderPreview()};
$('previewAnswers').onclick=()=>{review.answers=!review.answers;renderPreview()};
$('previewPrint').onclick=()=>window.print();

const voiceState={voices:[],utterance:null};
function loadVoices(){
 if(!('speechSynthesis' in window)){$('voiceStatus').textContent='Read-aloud is unavailable in this browser.';return;}
 voiceState.voices=speechSynthesis.getVoices().filter(v=>/^en([_-]|$)/i.test(v.lang));
 const saved=localStorage.getItem('aqsaVoice')||'';
 $('voiceSelect').innerHTML='<option value="">Automatic English voice</option>'+voiceState.voices.map(v=>`<option value="${escapeHtml(v.voiceURI)}">${escapeHtml(v.name)} (${escapeHtml(v.lang)})</option>`).join('');
 $('voiceSelect').value=voiceState.voices.some(v=>v.voiceURI===saved)?saved:'';
 const rate=Number(localStorage.getItem('aqsaVoiceRate'))||.95;$('voiceRate').value=rate;
 $('voiceStatus').textContent=voiceState.voices.length?'Try the available voices and choose the one Aqsa likes. Voice quality depends on the voices this device makes available.':'Voices are still loading. Try the sample after a moment.';
}
function speak(text){
 if(!('speechSynthesis' in window))return;
 speechSynthesis.cancel();
 const saved=localStorage.getItem('aqsaVoice');
 const rank=v=>(/natural|neural|enhanced|premium|online/i.test(v.name)?100:0)+(/Siri|Google|Aria|Jenny|Ava/i.test(v.name)?30:0)+(/^en-US$/i.test(v.lang)?10:0)+(v.default?1:0);
 const available=voiceState.voices.length?voiceState.voices:speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));
 const selected=available.find(v=>v.voiceURI===saved)||[...available].sort((a,b)=>rank(b)-rank(a))[0];
 const spoken=String(text).replace(/\+/g,' plus ').replace(/×/g,' times ').replace(/÷/g,' divided by ').replace(/−/g,' minus ').replace(/=/g,' equals ').replace(/__/g,' blank ');
 const u=new SpeechSynthesisUtterance(spoken);if(selected)u.voice=selected;u.lang=selected?.lang||'en-US';u.rate=Math.max(.7,Math.min(1.2,Number(localStorage.getItem('aqsaVoiceRate'))||.95));u.pitch=1;
 voiceState.utterance=u;u.onerror=e=>{if(!['canceled','interrupted'].includes(e.error))$('voiceStatus').textContent='This voice could not play. Please choose another voice and try the sample.';};speechSynthesis.speak(u);
}
$('voiceSelect').onchange=e=>localStorage.setItem('aqsaVoice',e.target.value);
$('voiceRate').onchange=e=>localStorage.setItem('aqsaVoiceRate',e.target.value);
$('voiceSample').onclick=()=>speak('Hello Aqsa! Let us learn and play together. Take your time and have fun.');
$('voiceStop').onclick=()=>{if('speechSynthesis' in window)speechSynthesis.cancel()};
if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',loadVoices);
loadVoices();

const game={kind:'frog',round:0,stars:0,done:false,position:0,total:0,letters:[],picked:[]};
const gameInfo={frog:['🐸 Number-line hop','Move the frog to the lily pad using equal jumps.'],shop:['🛒 Coin shop','Build the exact price with coins.'],words:['🌻 Word garden','Tap the letter tiles in order to grow a word.'],sort:['🔬 Science sorter','Send each example to its correct science group.']};
function renderGames(){
 $('gameGrade').value=state.grade;
 $('gameMenu').innerHTML=Object.entries(gameInfo).map(([key,v])=>`<button class="game-choice ${game.kind===key?'selected':''}" data-game="${key}"><strong>${v[0]}</strong><span>${v[1]}</span></button>`).join('');
 document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>{game.kind=b.dataset.game;game.round=0;game.stars=0;renderGames()});
 if(!game.round)newGameRound();else drawGame();
}
function newGameRound(){
 game.round++;game.done=false;game.message="";game.total=0;game.picked=[];
 const n=Math.floor(Math.random()*8)+2;
 if(game.kind==='frog'){game.step=state.grade===1?1+Math.floor(Math.random()*2):2+Math.floor(Math.random()*3);game.start=Math.floor(Math.random()*4);game.position=game.start;game.target=game.start+game.step*(2+Math.floor(Math.random()*4));}
 if(game.kind==='shop'){game.target=state.grade===1?5+Math.floor(Math.random()*26):20+Math.floor(Math.random()*80);}
 if(game.kind==='words'){
  const bank=[['cat','A pet that says meow'],['sun','Our nearest star'],['fish','An animal that swims using fins'],['book','Something you read'],['plant','A living thing with roots'],['rain','Water drops from clouds'],['garden','A place to grow flowers'],['rabbit','An animal with long ears'],['yellow','The color of a ripe banana'],['window','You can look outside through it'],['number','It tells how many'],['pencil','A tool used to write']];
  const pick=bank[(game.round-1+Math.floor(Math.random()*bank.length))%(state.grade===1?8:bank.length)];game.word=pick[0];game.clue=pick[1];game.letters=Array.from(game.word).map((letter,i)=>({letter,id:i})).sort(()=>Math.random()-.5);
 }
 if(game.kind==='sort'){const index=Math.floor(Math.random()*YearCurriculum.scienceCases.length);game.case=YearCurriculum.scienceCases[index];game.side=Math.random()<.5?0:1;}
 drawGame();
}
function drawGame(){
 const h=escapeHtml;let content='';
 if(game.kind==='frog')content=`<p>Start at <strong>${game.start}</strong>. Reach <strong>${game.target}</strong> by jumping <strong>${game.step}</strong> each time.</p><div class="frog-track" aria-label="Frog is at ${game.position}">${Array.from({length:game.target+game.step+1},(_,i)=>`<span class="lily ${i===game.target?'target':''}">${i===game.position?'🐸':i===game.target?'🌸':''}<small>${i}</small></span>`).join('')}</div><p id="frogPosition" aria-live="polite">Frog position: ${game.position}</p><button class="secondary-btn" id="frogBack">← Back ${game.step}</button> <button class="primary-btn" id="frogJump">Jump ${game.step} →</button>`;
 if(game.kind==='shop')content=`<div class="shop-item">🧸 <strong>${game.target}¢</strong></div><p>Pay exactly ${game.target} cents for the toy.</p><div class="coin-buttons">${[1,5,10,25].map(c=>`<button data-coin="${c}" class="coin">${c}¢</button>`).join('')}</div><p aria-live="polite">Your coins: <strong>${game.total}¢</strong></p><button id="clearCoins" class="secondary-btn">Clear coins</button> <button id="payCoins" class="primary-btn">Pay</button>`;
 if(game.kind==='words')content=`<p>${h(game.clue)}</p><div class="word-slots" aria-live="polite">${h(game.picked.map(i=>game.letters[i].letter).join(''))||'Tap letters below'}</div><div class="letter-tiles">${game.letters.map((t,i)=>`<button data-letter="${i}" ${game.picked.includes(i)?'disabled':''}>${t.letter}</button>`).join('')}</div><button id="undoLetter" class="secondary-btn">Undo</button> <button id="checkWord" class="primary-btn">Grow my word 🌻</button>`;
 if(game.kind==='sort')content=`<h3>${h(game.case[0])}</h3><p class="sort-object">${h(game.case[2+game.side])}</p><p>Choose the correct group.</p><div class="sort-bins">${[game.case[4],game.case[5]].map((c,i)=>`<button data-bin="${i}">${h(c)}</button>`).join('')}</div>`;
 $('gameBoard').innerHTML=`<h2>${gameInfo[game.kind][0]}</h2><p>Round ${game.round} · ⭐ <span id="gameStars">${game.stars}</span> stars</p>${content}<p id="gameFeedback" class="game-feedback" role="status"></p><button id="nextGameRound" class="primary-btn hidden">Next round →</button>`;
 const feedback=(message,ok)=>{if(game.done)return;game.message=message;$('gameFeedback').textContent=message;if(ok){game.done=true;game.stars++;$('gameStars').textContent=game.stars;$('nextGameRound').classList.remove('hidden');$('gameBoard').querySelectorAll('button:not(#nextGameRound)').forEach(b=>b.disabled=true);}};
 $('nextGameRound').onclick=newGameRound;
 if(game.kind==='frog'){
  const move=delta=>{if(game.done)return;const next=game.position+delta;if(next<0||next>game.target+game.step){feedback('Stay on the number line. Try the other direction.',false);return;}game.position=next;drawGame();if(game.position===game.target){game.done=true;game.stars++;$('gameStars').textContent=game.stars;game.message=`You reached the flower! ${game.start} + ${(game.target-game.start)/game.step} jumps of ${game.step} = ${game.target}.`; $('gameFeedback').textContent=game.message;$('nextGameRound').classList.remove('hidden');$('frogBack').disabled=true;$('frogJump').disabled=true;}};
  $('frogBack').onclick=()=>move(-game.step);$('frogJump').onclick=()=>move(game.step);
 }
 if(game.kind==='shop'){
  document.querySelectorAll('[data-coin]').forEach(b=>b.onclick=()=>{if(game.done)return;game.total+=Number(b.dataset.coin);drawGame()});$('clearCoins').onclick=()=>{game.total=0;drawGame()};$('payCoins').onclick=()=>feedback(game.total===game.target?`Perfect! Your coins total ${game.target} cents.`:game.total<game.target?`Add ${game.target-game.total} more cents.`:`That is ${game.total-game.target} cents too much. Clear the coins and try again.`,game.total===game.target);
 }
 if(game.kind==='words'){
  document.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>{if(game.done)return;game.picked.push(Number(b.dataset.letter));drawGame()});$('undoLetter').onclick=()=>{game.picked.pop();drawGame()};$('checkWord').onclick=()=>{const answer=game.picked.map(i=>game.letters[i].letter).join('');feedback(answer===game.word?`Your word grew! ${game.word}.`:`Try again. The word begins with ${game.word[0]} and has ${game.word.length} letters.`,answer===game.word)};
 }
 if(game.kind==='sort')document.querySelectorAll('[data-bin]').forEach(b=>b.onclick=()=>feedback(Number(b.dataset.bin)===game.side?`Correct! ${game.case[6]}`:`Think about the properties. ${game.case[1]}`,Number(b.dataset.bin)===game.side));
 if(game.done){$('gameFeedback').textContent=game.message||'Well done! Ready for another round?';$('nextGameRound').classList.remove('hidden');$('gameBoard').querySelectorAll('button:not(#nextGameRound)').forEach(b=>b.disabled=true);}
}
$('gameGrade').onchange=e=>{state.grade=Number(e.target.value);localStorage.setItem('aqsaGrade',state.grade);game.round=0;game.stars=0;renderGames()};
