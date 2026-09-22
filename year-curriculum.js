/* Offline, deterministic 365-day curriculum. Skills recur with new applications.
   No remote AI, API key, timer, or paid service is needed. */
const YearCurriculum = (() => {
  const days = 365;
  const names = ['Aqsa','Mia','Ben','Lena','Ali','Sam','Zoe','Noah','Ella','Leo','Ivy','Omar'];
  const angles = ['Notice and name','Build a model','Explain how','Compare and sort','Predict and check','Use it in real life','Challenge and reflect'];
  const routines = [
    'Look carefully. Say what you notice before choosing your answer.',
    'Draw a simple picture or use objects to show the idea.',
    'Explain your thinking with the words “I know because”.',
    'Find what stays the same and what is different.',
    'Make a prediction, then use the example to check it.',
    'Connect the idea to something you might do at home or school.',
    'Try without help first, then explain one mistake and how to fix it.'
  ];
  function random(seed) { let n=seed>>>0; return max=>{n=(n+0x6D2B79F5)>>>0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)%max;}; }
  function question(p,a,explanation,choices,extra={}) {
    return {p,a:String(a),explanation,...(choices?{choices:[...new Set([String(a),...choices.map(String)])]}:{}),...extra};
  }
  function lesson(title,text,example,visual,challenge) {return {title,text,example,visual,challenge};}
  const mathUnits = [
    ['Counting and number lines','Count in order. Each step to the right on a number line adds one. Each step to the left takes one away.'],
    ['Tens, ones and place value','A ten is a bundle of 10 ones. The position of a digit tells its value. A zero can hold an empty place.'],
    ['Addition strategies','Addition joins amounts. Start with the larger number and count on, or split a number to make a ten.'],
    ['Subtraction strategies','Subtraction finds what is left or the difference. Count back, take away in parts, or use addition to check.'],
    ['Compare and order','Compare hundreds first, then tens, then ones. The open side of < or > faces the larger amount.'],
    ['Patterns and skip counting','Find the amount added each time. Repeat the same rule to extend a number pattern.'],
    ['Shapes and their properties','A triangle has 3 straight sides; a rectangle has 4. A square is a special rectangle with all sides equal. A circle has no straight sides.'],
    ['Measuring length','Use the same unit to compare lengths. Start a ruler at zero and read the endpoint. State the unit with your measurement.'],
    ['Clocks and elapsed time','An hour has 60 minutes. At an exact hour the minute hand points to 12. At half past it points to 6.'],
    ['Coins and shopping','In US money, a penny is 1 cent, a nickel 5 cents, a dime 10 cents and a quarter 25 cents. Add values, not just the number of coins.'],
    ['Equal parts and groups','Equal shares have the same amount. Two equal parts are halves; four equal parts are fourths. Draw groups to check they are equal.'],
    ['Tables and picture graphs','A table or graph organizes information. Read the labels first. Add to find totals; subtract to compare two amounts.'],
    ['Word problems and reasoning','Decide what is known and what is asked. Draw a model, choose an operation, and check whether the answer makes sense.']
  ];
  const contexts = ['shells','stickers','blocks','buttons','beads','cards','pencils','leaves','marbles','toy cars','flowers','books'];
  function math(grade,day,variant) {
    const unit=Math.min(12,Math.floor((day-1)/28)), week=Math.floor(((day-1)%28)/7), angle=(day-1)%7;
    const r=random(grade*1000003+day*7907+variant*104729), person=names[(day+variant)%names.length];
    const item=contexts[(day+week+variant)%contexts.length], max=grade===1?[5,10,15,20][week]:[20,40,70,100][week];
    const qs=[]; const add=(p,a,e,c)=>qs.push(question(p,a,e,c));
    for(let i=0;i<10;i++) {
      let a=1+r(max-1), b=1+r(grade===1?9:30), n, answer;
      const prefix=i===9?'Challenge: ':'';
      switch(unit) {
        case 0:
          n=1+r(max-1);
          if(i%3===0)add(`${prefix}${person} counts ${n} ${item}, then finds one more. How many now?`,n+1,`One more than ${n} is ${n+1}.`);
          else if(i%3===1)add(`${prefix}Fill the gap: ${n}, __, ${n+2}.`,n+1,'Count forward one at a time.');
          else add(`${prefix}Start at ${n+3} on a number line. Move ${grade} steps left. Where do you land?`,n+3-grade,`Moving left subtracts ${grade}.`);
          break;
        case 1:
          n=grade===1?10+r(90):100+r(900);
          if(i%3===0)add(`${prefix}How many tens are shown by the tens digit in ${n}?`,Math.floor(n/10)%10,'The tens place is the second position from the right.');
          else if(i%3===1)add(`${prefix}What is the value of the ones digit in ${n}?`,n%10,'The rightmost digit counts ones.');
          else {const tens=1+r(9),ones=r(10),h=grade===1?0:1+r(9);add(`${prefix}Build the number: ${h?`${h} hundreds, `:''}${tens} tens and ${ones} ones.`,h*100+tens*10+ones,`${h*100} + ${tens*10} + ${ones} = ${h*100+tens*10+ones}.`);}
          break;
        case 2:
          a=grade===1?1+r(Math.max(2,max-1)):10+r(max-10);b=1+r(grade===1?max-a:10+week*5);
          add(i%2?`${prefix}${person} has ${a} ${item} and gets ${b} more. How many altogether?`:`${prefix}${a} + ${b} = ?`,a+b,`Start at ${a} and add ${b}. The total is ${a+b}.`);break;
        case 3:
          a=grade===1?2+r(max-1):10+r(max-9);b=1+r(a);
          add(i%2?`${prefix}There are ${a} ${item}. ${person} puts away ${b}. How many remain?`:`${prefix}${a} − ${b} = ?`,a-b,`Check: ${a-b} + ${b} = ${a}.`);break;
        case 4:
          a=1+r(grade===1?99:999);b=1+r(grade===1?99:999);
          if(i%2===0)add(`${prefix}Choose the symbol: ${a} __ ${b}`,a>b?'>':a<b?'<':'=',`Compare place values. ${a} is ${a>b?'greater than':a<b?'less than':'equal to'} ${b}.`,['<','>','=']);
          else add(`${prefix}Which is ${i%4===1?'greatest':'smallest'}: ${a}, ${b}, ${a+b}?`,i%4===1?a+b:Math.min(a,b),'Compare the amounts, starting with the largest place value.',[a,b,a+b]);break;
        case 5: {
          const step=grade===1?[2,5,10][(i+week)%3]:[2,3,5,10][(i+week)%4];n=r(10)*step;
          add(`${prefix}Find the next number: ${n}, ${n+step}, ${n+2*step}, __.`,n+3*step,`Add ${step} each time.`);break;}
        case 6: {
          const shape=['triangle','square','rectangle'][i%3],sides=i%3===0?3:4,count=1+r(grade===1?4:8);
          if(i%2===0)add(`${prefix}Draw ${count} separate ${shape}${count===1?'':'s'}. How many straight sides altogether?`,count*sides,`Each ${shape} has ${sides} straight sides. Count ${count} groups of ${sides}.`);
          else {const circles=1+r(5);add(`${prefix}${person} draws ${count} ${shape}${count===1?"":"s"} and ${circles} circle${circles===1?"":"s"}. How many corners altogether?`,count*sides,`Each ${shape} has ${sides} corners. Circles add no corners.`);}break;}
        case 7:
          a=2+r(grade===1?12:40);b=1+r(a-1);
          if(i%2===0)add(`${prefix}A ribbon is ${a} cm long. Cut off ${b} cm. How many centimeters remain?`,a-b,`${a} cm − ${b} cm = ${a-b} cm.`);
          else add(`${prefix}A pencil is ${a} cm and a crayon is ${b} cm long. How many centimeters longer is the pencil?`,a-b,'Subtract the shorter length from the longer length.');break;
        case 8: {
          const hour=1+r(12),duration=1+r(grade===1?2:4),end=(hour+duration-1)%12+1;
          if(i%2===0)add(`${prefix}Reading starts at ${hour}:00 and lasts ${duration} hour${duration===1?'':'s'}. What hour is it at the end? Type 1–12.`,end,`Move the hour hand forward ${duration} hour${duration===1?'':'s'} from ${hour}.`);
          else {const minute=grade===1?30:5*(1+r(11));add(`${prefix}At ${hour}:${String(minute).padStart(2,'0')}, how many minutes past ${hour} is it?`,minute,'The digits after the colon show minutes past the hour.');}break;}
        case 9: {
          const d=1+r(grade===1?3:8),p=r(10),cost=1+r(d*10+p);
          if(i%2===0)add(`${prefix}${person} has ${d} dimes and ${p} pennies. How many cents is that?`,d*10+p,`${d} × 10 cents + ${p} cents = ${d*10+p} cents.`);
          else add(`${prefix}A snack costs ${cost} cents. Pay ${d*10+p} cents. How many cents change?`,d*10+p-cost,'Change is the amount paid minus the cost.');break;}
        case 10: {
          const groups=grade===1?2:[2,3,4,5][r(4)],each=1+r(grade===1?10:9);
          if(i%2===0)add(`${prefix}Share ${groups*each} ${item} equally among ${groups} children. How many does each get?`,each,`${groups} equal groups of ${each} make ${groups*each}.`);
          else add(`${prefix}${groups} bags each contain ${each} ${item}. How many altogether?`,groups*each,`Add ${each} ${groups} times to get ${groups*each}.`);break;}
        case 11:
          a=2+r(grade===1?10:30);b=1+r(grade===1?9:20);
          if(i%2===0)add(`${prefix}Class survey: cats ${a} votes; dogs ${b} votes. How many votes altogether?`,a+b,'Add both categories in the table.');
          else add(`${prefix}Picture graph: Monday ${a} stars; Tuesday ${b} stars. Each star means ${grade} books. How many books on Tuesday?`,b*grade,`Read the key: ${b} stars × ${grade} books per star.`);break;
        default: {
          a=grade===1?5+r(6):20+r(40);b=1+r(grade===1?5:20);const c=1+r(a);
          add(`${prefix}${person} starts with ${a} ${item}, gets ${b} more, then gives away ${c}. How many remain?`,a+b-c,`First ${a} + ${b} = ${a+b}. Then ${a+b} − ${c} = ${a+b-c}.`);
        }
      }
      // Retry with the next deterministic values, keeping the same skill.
      if(qs.slice(0,-1).some(q=>q.p===qs[qs.length-1].p)){qs.pop();i--;}
    }
    const example=qs[0];
    return {unit:mathUnits[unit][0],lesson:lesson(`${angles[angle]}: ${mathUnits[unit][0]}`,mathUnits[unit][1]+' '+routines[angle],`${example.p} Answer: ${example.a}. ${example.explanation}`,mathVisual(unit,grade),`Use ${item} or a drawing to explain question 10. Show a second way to check your answer.`),questions:qs};
  }
  function mathVisual(unit,grade) {
    return ['0 → 1 → 2 → 3 → 4 → 5','23 = 20 + 3','● ● ● + ● ● = 5','● ● ● ● ● − ● ● = 3','12 < 21','2 → 4 → 6 → 8','△ 3 sides   □ 4 sides   ○ 0 straight sides','0 | 1 | 2 | 3 | 4 | 5 cm','12 → 1 → 2 → 3 …','dime: 10¢   nickel: 5¢   penny: 1¢','●● | ●● = 2 equal groups','Cats: ●●●   Dogs: ●●','Start → add → take away → check'][unit];
  }
  const englishUnits = [
    ['Beginning sounds','Listen to the first sound, then match it to a letter. Say the whole word after blending its sounds.'],
    ['Rhymes and word families','Rhyming words share an ending sound. Changing the first sound can make a new word: cat, hat, bat.'],
    ['Naming words','A noun names a person, place, animal or thing. Find who or what the sentence is about.'],
    ['Action words','A verb can tell an action. Ask what someone or something does: run, paint, read.'],
    ['Describing words','An adjective gives information about a noun, such as its color, size or texture.'],
    ['Complete sentences','Begin a sentence with a capital letter. A statement ends with a period; a question ends with a question mark.'],
    ['One and more than one','A plural names more than one. Many words add s; some add es; a few change, such as child to children.'],
    ['Pronouns','Pronouns replace nouns. Use I for yourself, we for a group including you, and they for a group you describe.'],
    ['Time words and past tense','Past-tense verbs tell about before now. Many add ed, but some change: go becomes went.'],
    ['Opposites and similar meanings','Opposites have contrasting meanings. Synonyms have similar meanings. Read the whole sentence to choose a word.'],
    ['Compound words','Two words can join to make one compound word: rain + coat = raincoat. Think about how the parts help with meaning.'],
    ['Story sequence','First, next and finally help put events in order. Use clues from the story, not guesses.'],
    ['Reasons and reading clues','A cause explains why something happens. An effect is what happens. Use because to connect an action to a reason.']
  ];
  // Four distinct story situations per topic. Variants also change character, object details and setting.
  const stories = [
    ['packs a bag','go to school','checks the books','walks to school'],['fills a cup','have a drink','turns off the tap','drinks the water'],['opens a box','find a toy','moves the paper','takes out the toy'],['puts on a hat','play in the sun','finds some shade','plays outside'],
    ['feeds a cat','care for a pet','fills the water bowl','washes both hands'],['finds a shell','make a beach picture','draws its shape','leaves it on the beach'],['holds a kite','fly it in the breeze','walks to an open field','lets the kite rise'],['picks up a mat','make a reading spot','puts it on the floor','sits down to read'],
    ['visits a library','borrow a book','asks the librarian','checks out a story'],['visits a garden','look at plants','follows the path','draws a leaf'],['visits a shop','buy some fruit','chooses an apple','pays at the counter'],['visits a park','watch birds','sits quietly','sketches a bird'],
    ['rolls a ball','play a game','asks a friend to join','takes turns'],['paints a picture','make a gift','lets the paint dry','gives it to a friend'],['builds a tower','test some blocks','makes a wide base','adds a top block'],['folds some paper','make a card','writes a kind message','gives the card away'],
    ['chooses a blanket','stay warm','sits on the couch','reads a book'],['chooses a basket','carry some apples','checks the handle','puts the apples inside'],['chooses a ribbon','decorate a gift','measures a piece','ties a bow'],['chooses a cushion','sit comfortably','puts it on a chair','sits down'],
    ['writes a note','thank a teacher','checks the capital letter','hands over the note'],['reads a sign','find the entrance','follows the arrow','opens the door'],['asks a question','learn about a bird','listens carefully','writes down a fact'],['tells a story','entertain a friend','describes the setting','explains the ending'],
    ['sorts some socks','tidy a drawer','matches pairs','puts the pairs away'],['counts some boxes','pack the books','finds enough space','closes each box'],['washes some dishes','help after lunch','dries each plate','puts the plates away'],['arranges some chairs','prepare for guests','leaves walking space','welcomes the visitors'],
    ['joins a team','play together','listens to the plan','helps a teammate'],['meets a friend','share a game','explains the rules','takes the first turn'],['helps a neighbor','carry a light bag','asks where it belongs','sets it down'],['calls a cousin','share some news','waits for an answer','tells the news'],
    ['plants a seed','grow a flower','adds a little water','checks the pot later'],['cleans a desk','make space to work','sorts the papers','starts drawing'],['walks to a pond','look for ducks','stays on the path','watches quietly'],['bakes with a grown-up','make a snack','mixes the ingredients','waits for it to cool'],
    ['opens a window','let in cool air','checks the weather','enjoys the breeze'],['moves a lamp','see the page better','points it at the book','reads the words'],['fills a bottle','bring water on a walk','closes the lid','packs the bottle'],['slows down','walk safely on a wet path','takes small steps','reaches a dry place'],
    ['puts on a raincoat','stay dry','fastens the buttons','walks into the rain'],['packs a lunchbox','bring food to school','adds a sandwich','closes the lid'],['finds a bookmark','save a place in a story','puts it between pages','closes the book'],['watches a sunset','see the evening colors','looks at the clouds','draws the sky'],
    ['gets some paper','make a plane','folds the wings','tests the plane'],['gathers some blocks','make a bridge','leaves a gap underneath','rolls a toy car below'],['gets a pot','plant a bean','adds soil and water','places it near a window'],['gets a puzzle','solve a picture','finds the edge pieces','fills in the middle'],
    ['takes an umbrella','stay dry in the rain','checks the sky','walks under the umbrella'],['wears a scarf','stay warm in the cold','wraps it gently','goes outside'],['waters a plant','help it grow','checks the dry soil','adds a little water'],['rests in the shade','cool down after playing','drinks some water','feels ready to walk home']
  ];
  const vocab = [
    ['cat','hat','c','cats','small','big'],['dog','log','d','dogs','hot','cold'],['sun','fun','s','suns','bright','dim'],['pig','wig','p','pigs','clean','dirty'],
    ['hen','pen','h','hens','happy','sad'],['bug','rug','b','bugs','near','far'],['fox','box','f','foxes','fast','slow'],['bell','shell','b','bells','loud','quiet'],
    ['boat','coat','b','boats','long','short'],['cake','lake','c','cakes','soft','hard'],['train','rain','t','trains','early','late'],['bee','tree','b','bees','full','empty']
  ];
  function english(grade,day,variant) {
    const unit=Math.min(12,Math.floor((day-1)/28)),week=Math.floor(((day-1)%28)/7),angle=(day-1)%7;
    const s=stories[unit*4+week],name=names[(day+variant*5)%names.length],friend=names[(day+variant*5+4)%names.length];
    const color=['red','blue','green','yellow','purple','orange','pink'][(day+variant)%7];
    const place=['near the door','beside the window','by the table','next to the shelf'][(Math.floor(day/7)+variant)%4];
    const passage=`${name} ${s[0]} to ${s[1]}. First, ${name} ${s[2]}. Next, ${name} ${s[3]}. Later, ${friend} brings a ${color} notebook. They put the notebook ${place}.`;
    const v=vocab[(day+variant)%vocab.length],v2=vocab[(day+variant+5)%vocab.length],qs=[];
    const add=(p,a,e,c,extra)=>qs.push(question(p,a,e,c,{passage,...extra}));
    add(`Who ${s[0]}?`,name,`The first sentence names ${name}.`,[name,friend,'No one']);
    add(`What is ${name}’s goal in the first sentence?`,s[1],`Look for “to ${s[1]}” in the first sentence.`,[s[1],'find a lost shoe','take a nap']);
    add('What happens first?',s[2],`The word “First” introduces “${s[2]}”.`,[s[2],s[3],'brings a notebook']);
    add('What color is the notebook?',color,`The story says it is ${color}.`,[color,'white','black']);
    add('Where do they put the notebook?',place,`The last sentence gives the location: ${place}.`,[place,'under the bed','inside a car']);
    for(let i=0;i<4;i++) {
      const w=vocab[(day+variant+i)%vocab.length],other=vocab[(day+variant+i+6)%vocab.length];
      if(grade===2) {
        const pairs=[['ship','sh'],['chair','ch'],['thin','th'],['whale','wh'],['shop','sh'],['chick','ch'],['thorn','th']];
        const irregular=[['child','children'],['foot','feet'],['tooth','teeth'],['mouse','mice'],['goose','geese'],['person','people'],['man','men']];
        if(unit===0){const z=pairs[(day+i)%pairs.length];add(`Which two letters work together at the beginning of “${z[0]}”?`,z[1],'A digraph uses two letters for one sound.',[z[1],'br','st']);continue;}
        if(unit===1){const z=[['cake','a'],['bike','i'],['home','o'],['cube','u']][i];add(`In “${z[0]}”, which vowel says its name before the silent e?`,z[1],'A final silent e often makes the earlier vowel sound long.',['a','i','o','u']);continue;}
        if(unit===2){const n=names[(day+i)%names.length];add(`Find the proper noun: “${n} sees a ${w[0]}.”`,n,'A proper noun names a particular person or place and starts with a capital.',[n,w[0],'sees']);continue;}
        if(unit===3){const z=[['bird','sings','sing'],['dog','runs','run'],['child','plays','play'],['cat','sleeps','sleep']][i];add(`Choose the verb: One ${z[0]} ___.`,z[1],'A singular subject takes this verb form in the present tense.',[z[1],z[2]]);continue;}
        if(unit===6){const z=irregular[(day+i)%irregular.length];add(`One ${z[0]}, two ___.`,z[1],'This irregular plural changes instead of simply adding s.',[z[1],z[0]+'s',z[0]]);continue;}
        if(unit===7){const n=names[(day+i)%names.length];add(`${n} and I read about a ${w[0]}. Replace “${n} and I” with a pronoun.`, 'We','We includes the speaker and at least one other person.',['We','They','It']);continue;}
      }
      switch(unit) {
        case 0:add(`Which letter starts “${w[0]}”?`,w[2],`Say ${w[0]} slowly. Its first letter is ${w[2]}.`,[w[2],'z','m']);break;
        case 1:add(`Which word rhymes with “${w[0]}”?`,w[1],`${w[0]} and ${w[1]} share an ending sound.`,[w[1],other[0],'desk']);break;
        case 2:add(`Find the noun: “The ${w[0]} can move.”`,w[0],`${w[0]} names a thing or animal.`,[w[0],'can','move']);break;
        case 3: {const verb=['jump','paint','read','sing'][(day+i)%4];add(`Find the action word: “We ${verb} beside the ${w[0]}.”`,verb,`${verb} tells what we do.`,[verb,'we',w[0]]);break;}
        case 4:add(`Which word describes the noun in “the ${w[4]} ${w[0]}”?`,w[4],`${w[4]} describes the ${w[0]}.`,[w[4],w[0],'the']);break;
        case 5: {const n=names[(day+i)%names.length];add(`Choose the correctly written sentence about ${n}.`,`${n} likes books.`, 'A statement begins with a capital and ends with a period.',[`${n} likes books.`,`${n.toLowerCase()} likes books.`,`${n} likes books?`]);break;}
        case 6:add(`One ${w[0]}, two ___.`,w[3],`${w[3]} means more than one ${w[0]}.`,[w[3],w[0],w[0]+'ing']);break;
        case 7: {const n=names[(day+i)%names.length],n2=names[(day+i+1)%names.length];add(`${n} and ${n2} see a ${w[0]}. ___ look closely.`, 'They','They replaces a group of people.', ['They','It','I']);break;}
        case 8: {const pair=[['walk','walked'],['jump','jumped'],['play','played'],['go','went'],['see','saw'],['eat','ate'],['make','made']][(day+i)%7];add(`Today I ${pair[0]}. Yesterday I ___.`,pair[1],`${pair[1]} is the past tense of ${pair[0]}.`,[pair[1],pair[0],pair[0]+'ing']);break;}
        case 9:add(`What is the opposite of “${w[4]}”?`,w[5],`${w[4]} and ${w[5]} have opposite meanings.`,[w[5],w[4],'round']);break;
        case 10: {const pair=[['rain','coat'],['sun','flower'],['book','mark'],['foot','ball'],['bed','room'],['tooth','brush'],['snow','man'],['lunch','box']][(day+i)%8];add(`Join the words: ${pair[0]} + ${pair[1]} = ?`,pair.join(''),'Keep both words together to make one compound word.');break;}
        case 11: {const order=[['seed, sprout, plant','plant, seed, sprout'],['wake up, get dressed, go to school','go to school, wake up, get dressed'],['mix, bake, cool','cool, mix, bake'],['pick a book, read, return the book','return the book, pick a book, read']][i];add(`Choose the sensible order for ${['growing a plant','a school morning','baking with a grown-up','borrowing a book'][i]}.`,order[0],'Think about which step must happen before the next.',order);break;}
        default: {const pair=[['It rains','the path gets wet'],['The light is switched on','the room becomes brighter'],['A ball is pushed','it starts rolling'],['A plant gets no water for a long time','it may wilt']][i];add(`${pair[0]}. What is a likely effect?`,pair[1],'An effect is a result of the cause.',[pair[1],'time runs backward','nothing can ever change']);}
      }
    }
    add(grade===1?'Challenge: What happens just before the notebook arrives?':`Challenge: Which sentence best summarizes ${name}’s goal?`,grade===1?s[3]:`${name} wants to ${s[1]}.`,grade===1?'Use the order: first, next, later.':'A summary gives the main idea rather than a small detail.',grade===1?[s[3],s[2],'They put away the notebook.']:[`${name} wants to ${s[1]}.`,`${name} loses a shoe.`,`${name} cannot find a notebook.`]);
    const extensions={0:'Two letters can work together as a digraph, such as sh in ship or ch in chair.',1:'A final silent e often lets a vowel say its name: cap becomes cape.',2:'A proper noun names a particular person or place and begins with a capital letter.',3:'Match the verb to its subject: one bird sings, but two birds sing.',6:'Learn irregular plurals such as child/children, foot/feet and mouse/mice.',7:'Use we for a group that includes yourself. Use they for another group.'};
    return {unit:englishUnits[unit][0],lesson:lesson(`${angles[angle]}: ${englishUnits[unit][0]}`,englishUnits[unit][1]+' '+(grade===2?(extensions[unit]||'Use evidence from the passage to explain your answer.')+' ':'')+routines[angle],passage,`${v[0]} → ${v[1]}\nFirst → Next → Later`,grade===1?`Draw what ${name} does. Tell a grown-up the story in your own words.`:`Write three sentences about a new ending for ${name}. Include a reason using “because”.`),questions:qs};
  }
  // 52 weekly investigations: 13 themes, four distinct concepts in each theme.
  // Each case: title, teaching, example A, example B, category A, category B, explanation.
  const scienceCases = [
    ['Living or nonliving','Living organisms grow and need resources. Something that moves is not always living.','a growing bean plant','a toy car','living','nonliving','A plant is an organism. A toy car can move but does not grow as an organism.'],
    ['Needs of animals','Animals need water, food and air. A habitat must help meet their needs.','clean drinking water','a painted decoration','a basic need','not a basic need','Water supports life. Decorations are not required for survival.'],
    ['Natural and made objects','People make some objects from materials found in nature. Natural does not mean living.','a pebble','a plastic cup','natural','made by people','Pebbles form in nature. People manufacture plastic cups.'],
    ['Growth over time','Growth means an organism gets larger or develops. A change in position is not growth.','a seedling getting taller','a ball rolling downhill','growth','movement without growth','The seedling develops. The ball only changes position.'],
    ['Roots and leaves','Roots take in water. Leaves use light to help make food for the plant.','a root','a leaf','takes in water from soil','uses light to help make food','Plant parts do different jobs that help the whole plant live.'],
    ['Stems and flowers','A stem supports the plant and carries water. Many flowers help plants produce seeds.','a stem','a flower','supports and carries water','helps produce seeds','Stems transport water. Flowers take part in reproduction.'],
    ['Seeds and seedlings','A seed can begin growing when conditions are suitable. A seedling is a young plant.','a bean before it sprouts','a bean with young roots and leaves','seed','seedling','Sprouting starts growth from a seed into a young plant.'],
    ['Light for plants','Green plants need light to make food. Too little light can affect their growth.','a plant by a suitable bright window','a plant kept in a dark cupboard','has access to light','lacks light','Light is needed for photosynthesis, the process plants use to make food.'],
    ['Animal coverings','Different animals have different coverings. Coverings can protect bodies and help control temperature.','a robin','a rabbit','feathers','fur','Birds have feathers. Mammals such as rabbits have hair or fur.'],
    ['Homes and habitats','Habitats provide resources. Animals have features suited to their habitats.','a pond fish','a desert lizard','aquatic habitat','dry land habitat','Fish live in water. Desert lizards are suited to dry land.'],
    ['Life cycles','An animal changes as it grows. A butterfly has egg, caterpillar, chrysalis and adult stages.','a caterpillar','an adult butterfly','larval stage','adult stage','A caterpillar is the larva; it is not a small adult butterfly.'],
    ['Food relationships','A food chain shows how energy passes from food to an eater. Plants make food using light.','grass making food','a rabbit eating grass','producer','consumer','Plants are producers. Animals get energy by eating other organisms or their products.'],
    ['Sight and hearing','Eyes detect light. Ears detect sounds. Different senses provide different evidence.','noticing a red flag','noticing a ringing bell','sight','hearing','Color is seen with eyes. A ringing sound is heard with ears.'],
    ['Smell and touch','The nose detects smells. Skin detects touch, pressure and temperature. Never touch unknown hot objects.','noticing a flower scent','feeling a soft cloth','smell','touch','A scent is detected by the nose; texture is detected by touch.'],
    ['Bones and muscles','Bones support the body. Muscles pull on body parts to help them move.','the skull protecting the brain','a muscle bending an arm','support and protection','movement','Bones provide structure. Muscles contract to help move the body.'],
    ['Healthy habits','Washing hands with soap helps remove germs. Rest helps the body recover.','washing hands before a meal','sleeping at night','hygiene','rest','Both support health in different ways. One does not replace the other.'],
    ['Solids and liquids','A solid keeps its own shape. A liquid flows and takes the shape of its container.','a wooden block','water in a cup','solid','liquid','A block holds its shape. Water flows into the shape of a cup.'],
    ['Air is matter','Air is a mixture of gases. It takes up space even though most of it cannot be seen.','air inside a balloon','a marble inside a jar','gas','solid','The balloon holds gas. A marble is a solid object.'],
    ['Melting and freezing','Melting changes solid water to liquid. Freezing changes liquid water to solid.','an ice cube warming into water','water cooling into ice','melting','freezing','Adding or removing thermal energy can change the state of water.'],
    ['Evaporation and condensation','Liquid water can become water vapor. Water vapor can cool and form liquid droplets.','a puddle slowly drying','droplets forming outside a cold cup','evaporation','condensation','The puddle becomes vapor. Droplets outside the cup come from water vapor in the air.'],
    ['Material properties','Materials can be described by properties such as flexibility and hardness.','a rubber band bending','a stone resisting a squeeze','flexible','hard','A flexible material bends readily; a hard material resists scratching or pressing.'],
    ['Absorbing water','Absorbent materials take in water. Waterproof materials resist water passing through.','a paper towel soaking up a spill','a plastic raincoat shedding drops','absorbent','waterproof','A towel takes water into spaces in its material. A raincoat is designed to keep water out.'],
    ['Light through materials','Transparent materials let you see clearly through them. Opaque materials block light passing through.','clear window glass','a wooden door','transparent','opaque','You can see through clear glass. Wood blocks light passing through it.'],
    ['Changing materials','Some changes alter shape without making a new material. Other changes produce new substances.','folding a sheet of paper','an iron nail rusting','change of shape','formation of a new substance','Folding leaves paper as paper. Rust is a new substance formed from iron reacting.'],
    ['Pushes and pulls','A force is a push or pull. Forces can change motion or shape.','pressing a door away from you','tugging a wagon toward you','push','pull','A push acts away from you; a pull draws something toward you.'],
    ['Friction','Friction can slow sliding objects. Rougher surfaces often produce more friction in a simple sliding test.','a toy sliding on rough carpet','the same toy sliding on a smooth board','usually more friction','usually less friction','Surface texture affects sliding. Keep the toy and starting push the same for a comparison.'],
    ['Ramps and motion','A ramp is a sloping surface. Gravity can make a toy roll down it.','a toy rolling down a ramp','a toy resting on a flat floor','moving downhill','at rest','On a ramp, gravity can cause a toy to speed up downhill.'],
    ['Magnets','Magnets attract iron and some other metals. They do not attract every material or every metal.','an iron paper clip','a wooden craft stick','attracted to an ordinary magnet','not attracted to an ordinary magnet','Iron is attracted. Wood is not. Material matters more than size.'],
    ['Sources of light','A light source gives out light. Other visible objects reflect light from sources.','a lit flashlight','a book lit by a lamp','light source','reflects light','A flashlight emits light. A book is visible when light reflects from it.'],
    ['Shadows','A shadow forms where an opaque object blocks light. Its position depends on the light and object.','a hand blocking a flashlight beam','a beam passing through clear glass','can make a dark shadow','lets much of the light through','An opaque hand blocks light. Clear glass transmits much of it.'],
    ['Sound and vibration','Sound is produced by vibrating objects. Vibrations can travel through materials.','a plucked string moving back and forth','a string held still','vibrating','not vibrating','The moving string can produce sound. Stopping its vibration stops that sound.'],
    ['Loud and soft','Sound can differ in loudness. Protect hearing by keeping volume comfortable.','a gentle whisper','a loud drum strike','softer sound','louder sound','A whisper is usually quieter. Loud sounds can hurt ears if too intense or prolonged.'],
    ['Clouds and rain','Clouds contain tiny droplets or ice crystals. Rain falls as liquid water drops.','tiny droplets gathered in the sky','liquid drops falling to the ground','cloud','rain','A cloud holds tiny droplets or crystals. Rain drops fall to the ground.'],
    ['Wind','Wind is moving air. You can observe its effects without seeing the air itself.','a flag fluttering in a breeze','a flag hanging still in calm air','evidence of moving air','little evidence of wind','A fluttering flag shows the effect of moving air.'],
    ['Weather instruments','Instruments help measure weather. A thermometer measures temperature; a rain gauge collects rainfall.','reading a thermometer','reading a rain gauge','measuring temperature','measuring rainfall','Choose the instrument that measures the quantity you want.'],
    ['Weather and seasons','Weather describes conditions at a time and place. Seasonal patterns describe typical changes across the year.','a report that it rains this morning','a pattern of warmer summers','weather now','seasonal pattern','One day is weather. A repeated yearly pattern describes seasons.'],
    ['Day and night','Earth spins. The side facing the Sun has day; the side facing away has night.','the side of Earth facing the Sun','the side facing away from the Sun','day','night','The Sun does not switch off. Earth turning changes which places receive sunlight.'],
    ['Sun and Moon','The Sun is a star that emits light. The Moon reflects sunlight. Never look directly at the Sun.','the Sun','the Moon','gives out its own visible light','reflects sunlight','The Moon shines in our sky because sunlight reflects from it.'],
    ['Earth and its surface','Earth has land and water. Maps use symbols and colors to represent real places.','an ocean','a mountain','body of water','landform','Oceans contain water. Mountains are elevated parts of land.'],
    ['Spinning and orbiting','Rotation means spinning. Orbiting means traveling around another object.','Earth spinning on its axis','Earth traveling around the Sun','rotation','orbit','Rotation causes the day-night cycle. One orbit around the Sun takes about a year.'],
    ['Rocks and soil','Soil contains mineral particles and often decayed organic matter, air and water. Rocks are solid natural materials.','a handful of garden soil','a piece of granite','soil mixture','rock','Soil is a mixture. Granite is a type of rock made of minerals.'],
    ['Moving water changes land','Water can carry soil and sand. Erosion moves material; deposition leaves it in a new place.','a stream carrying sand away','sand settling when water slows','erosion','deposition','Moving water transports grains. Slower water can drop them.'],
    ['Saving resources','Using less reduces demand. Reusing means using an item again rather than throwing it away.','turning off an unused light','using a jar again for pencils','reducing use','reusing','Reducing avoids unnecessary use. Reusing gives an object another useful purpose.'],
    ['Caring for habitats','Human actions can help or harm habitats. Keep wildlife wild and observe from a distance.','putting litter in a bin','leaving plastic beside a pond','helps protect a habitat','can harm a habitat','Litter can injure animals or pollute their habitats.'],
    ['Observation and inference','An observation is directly noticed or measured. An inference is an explanation based on evidence.','seeing wet footprints','thinking someone walked in from the rain','observation','inference','You can see the prints. Their cause is a reasoned explanation that might need more evidence.'],
    ['Fair comparisons','A fair test changes one factor while keeping other relevant conditions the same.','changing only the ramp height','changing both the ramp and the toy','fairer comparison','confounded comparison','Changing two factors makes it hard to tell which caused a difference.'],
    ['Repeating measurements','Repeating a test helps reveal variation. A single result may not represent what usually happens.','rolling a toy three times from the same start','rolling it once and declaring it always works','repeated test','single test','Repeated trials provide more evidence than one trial.'],
    ['Evidence and claims','A claim should fit the evidence. More testing may be needed before making a broad conclusion.','saying what three measured trials show','saying every object behaves the same after one trial','supported limited claim','claim beyond the evidence','Describe what was tested. Avoid saying always when evidence is limited.']
  ];
  const scienceThemes=['Living things','Plants','Animals and habitats','Body and senses','States of matter','Materials','Forces and magnets','Light and sound','Weather','Earth and space','Our environment','Working like a scientist','Science projects'];
  // Project weeks reuse an earlier concept with an explicit new design/evidence task.
  const projectCases=[
    ['Design a plant-care plan',scienceCases[7]],['Choose a spill-cleaning material',scienceCases[21]],['Design a toy-car test',scienceCases[25]],['Explain a shadow model',scienceCases[29]]
  ];
  function science(grade,day,variant) {
    const week=Math.min(51,Math.floor((day-1)/7)),angle=(day-1)%7,unit=Math.floor(week/4);
    const source=week<48?scienceCases[week]:projectCases[week-48][1];
    const [baseTitle,teach,a,b,ca,cb,reason]=source,title=week<48?baseTitle:projectCases[week-48][0];
    const person=names[(day+grade+variant)%names.length],r=random(day*3571+grade*97+variant*313);
    const countA=3+r(grade===1?7:17),countB=1+r(countA-1),trial=1+((day+variant)%4);
    const report=`Practice observation chart (made-up classroom data): ${person} sorts picture cards. ${countA} cards show ${a}; ${countB} cards show ${b}. Each card represents one example.`;
    const qs=[];const add=(p,ans,e,choices,extra={})=>qs.push(question(p,ans,e,choices,extra));
    const conceptTasks=[
      [
        [`${person} studies ${a}. Which label fits?`,ca,[cb]],
        [`Which label fits ${b}?`,cb,[ca]],
        [`Which example belongs with “${ca}”?`,a,[b]],
        [`Which example belongs with “${cb}”?`,b,[a]],
        ['Which explanation matches the two examples?',reason,['All objects behave in exactly the same way.']]
      ],
      [
        [`You make a model of ${a}. Which label should you add?`,ca,[cb]],
        [`Your second model represents ${b}. Which label belongs on it?`,cb,[ca]],
        [`A model labeled “${ca}” should represent which example?`,a,[b]],
        ['Does making a paper model turn the paper into the real thing?','no',['yes']],
        ['What should your model help explain?',reason,['The model must include every detail in the world.']]
      ],
      [
        [`A friend labels ${a} as “${cb}”. What is the correction?`,ca,[cb]],
        [`A friend labels ${b} as “${ca}”. What is the correction?`,cb,[ca]],
        ['Which explanation helps correct the labels?',reason,['Labels never need checking.']],
        [`Which example would you use to explain “${ca}”?`,a,[b]],
        ['What should you do if you cannot explain a label?','look again at the example and its properties',['guess and refuse to check']]
      ],
      [
        [`Sort these: ${a}; ${b}. Which goes in the “${ca}” group?`,a,[b]],
        [`Which goes in the “${cb}” group?`,b,[a]],
        ['Should the same sorting rule apply to every example?','yes',['no']],
        ['What difference supports your sorting?',reason,['The first card picked is always right.']],
        [`You find another picture of ${b}. Which group should it join?`,cb,[ca]]
      ],
      [
        [`Predict the label for a new drawing of ${a}.`,ca,[cb]],
        [`Predict the label for a new drawing of ${b}.`,cb,[ca]],
        ['What science idea supports these predictions?',reason,['A prediction cannot use evidence.']],
        ['If new evidence disagrees with a prediction, what should happen?','recheck and update the prediction',['hide the evidence']],
        [`A second observer agrees that ${a} fits “${ca}”. What does agreement provide?`,'additional support, not proof about everything',['proof that all future guesses are correct']]
      ],
      [
        [`In an everyday explanation, ${a} is an example of what?`,ca,[cb]],
        [`Which everyday example helps you explain “${cb}”?`,b,[a]],
        ['Which explanation would you share with a grown-up?',reason,['Objects change category whenever we rename them.']],
        ['How should you explore unfamiliar real objects?','observe safely with a grown-up',['taste them to find out']],
        [`You see ${b} in a book. Which label connects it to today's lesson?`,cb,[ca]]
      ],
      [
        [`Challenge review: ${a} belongs to which category?`,ca,[cb]],
        [`Challenge review: which example belongs to “${cb}”?`,b,[a]],
        ['Which sentence best teaches the idea?',reason,['No explanation is needed for science.']],
        ['What should a strong science explanation include?','a claim supported by observations',['only a confident voice']],
        ['You still have a question after the lesson. What is a useful next step?','plan a safe observation with a grown-up',['pretend you already know everything']]
      ]
    ][angle];
    for(const [prompt,answer,wrong] of conceptTasks)add(prompt,answer,answer===ca||answer===cb||answer===a||answer===b?reason:`${answer}.`,wrong,{passage:teach});
    add(`How many picture cards show ${a}?`,countA,'Read the first count in the chart.',null,{passage:report});
    add('How many picture cards are in the chart altogether?',countA+countB,`Add ${countA} + ${countB} = ${countA+countB}.`,null,{passage:report});
    add(grade===1?'Which category has more picture cards?':`How many more cards show ${a} than ${b}?`,grade===1?ca:countA-countB,grade===1?`${countA} is greater than ${countB}.`:`Subtract ${countA} − ${countB} = ${countA-countB}.`,grade===1?[ca,cb]:null,{passage:report});
    const thinking=[
      ['Which is an observation about the chart?',`There are ${countA} cards showing ${a}.`,'An observation reports what is seen or counted.',['Every example in the world is on this chart.','The chart proves what will happen tomorrow.']],
      ['What should a model help us show?','the important parts of the idea','A model is a simplified representation, not a perfect copy.',['only our favorite color','every detail in the universe']],
      ['Which words help connect evidence to an explanation?','I know because','Because connects a statement to its supporting reason.',['It must be magic','No evidence is needed']],
      ['What rule should we use to sort the cards?',`the difference between ${ca} and ${cb}`,'Use the property being studied as the sorting rule.',['the color of the table','which card we picked up first']],
      ['What should we do if an observation disagrees with our prediction?','check the evidence and revise the prediction','Predictions can change when new evidence is found.',['hide the observation','change the count to fit the guess']],
      ['What should we do before trying a new hands-on activity?','ask a grown-up to help choose safe materials','A grown-up can help choose a safe way to investigate.',['taste unknown materials','look directly at the Sun']],
      ['What makes an explanation stronger?','evidence from careful observations','Evidence supports an explanation.',['saying it louder','ignoring results that surprise us']]
    ][angle];
    add(thinking[0],thinking[1],thinking[2],thinking[3]);
    add(`Challenge: In a second picture sort, ${person} adds ${trial} cards showing ${b}. How many cards now show ${b}?`,countB+trial,`The original ${countB} cards plus ${trial} new cards make ${countB+trial}.`,null,{passage:report});
    const activity=[`Draw ${a} and ${b}. Label each with its science category.`,`Make a paper model of ${a}. Explain what your model shows and what it leaves out.`,`Explain why ${a} and ${b} have different labels. Use “because”.`,`Make two sorting groups for ${ca} and ${cb}. Add a new example with a grown-up.`,`Predict how you would label a new example. Ask a grown-up to help check your reason.`,`Find a safe everyday example related to ${title.toLowerCase()}. Sketch it without touching unknown materials.`,`Teach a grown-up today's idea. Give an example, an explanation and one question you still have.`][angle];
    return {unit:scienceThemes[unit],lesson:lesson(`${angles[angle]}: ${title}`,teach+' '+routines[angle],`${a}: ${ca}. ${b}: ${cb}. ${reason}`,`${a} → ${ca}\n${b} → ${cb}`,activity),questions:qs};
  }
  function build(grade,subject,day,variant=0) {
    if(![1,2].includes(Number(grade))||!['math','english','science'].includes(subject)||!Number.isInteger(day)||day<1||day>days||!Number.isInteger(variant)||variant<0)throw new RangeError('Invalid curriculum request');
    grade=Number(grade);
    const pack=({math,english,science})[subject](grade,day,variant);
    const r=random(day*1237+grade*71+variant*1471+subject.length);
    if(day===365){pack.lesson.title='Year finale: '+pack.unit;pack.lesson.challenge='Choose one example from this year. Show what you know in a drawing, explanation or mini-project. '+pack.lesson.challenge;}
    pack.questions.forEach((q,i)=>{q.id=`year1-g${grade}-${subject}-d${day}-v${variant}-q${i+1}`;q.challenge=i===9;if(q.choices)for(let j=q.choices.length-1;j>0;j--){const k=r(j+1);[q.choices[j],q.choices[k]]=[q.choices[k],q.choices[j]];}});
    return {...pack,grade,subject,day,variant,week:Math.min(52,Math.ceil(day/7)),focus:angles[(day-1)%7]};
  }
  function dateNumber(value) {const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');if(!m)return NaN;const n=Date.UTC(+m[1],+m[2]-1,+m[3]);const d=new Date(n);return d.getUTCFullYear()===+m[1]&&d.getUTCMonth()===+m[2]-1&&d.getUTCDate()===+m[3]?n/86400000:NaN;}
  function dayForDate(start,current) {const a=dateNumber(start),b=dateNumber(current);return Number.isFinite(a)&&Number.isFinite(b)?Math.max(1,Math.min(days,b-a+1)):1;}
  return {days,build,dayForDate,dateNumber,topics:{math:mathUnits.map(u=>u[0]),english:englishUnits.map(u=>u[0]),science:scienceThemes}};
})();
if(typeof module!=='undefined')module.exports=YearCurriculum;
