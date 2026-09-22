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
  const mathSkills=['Addition','Subtraction','Multiplication','Division','Word problem','Number line','Number words','Place value','Compare','Patterns','Shapes','Measurement','Time','Money','Fractions','Data','Missing number','Odd and even'];
  function mix(items,r){const out=[...items];for(let i=out.length-1;i>0;i--){const j=r(i+1);[out[i],out[j]]=[out[j],out[i]];}return out;}
  function words(n){const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];if(n<20)return small[n];if(n<100)return ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'][Math.floor(n/10)]+(n%10?' '+small[n%10]:'');return small[Math.floor(n/100)]+' hundred'+(n%100?' '+words(n%100):'');}
  function mixedMath(grade,day,variant){
    const r=random(day*7193+variant*8171+grade*1021),stage=Math.floor((day-1)/92),core=mathSkills.slice(0,7);
    const extras=mix(mathSkills.slice(7),random(day*29+variant*43+grade)).slice(0,3);
    const skills=mix([...core,...extras,...mix(core,r).slice(0,4)],r),qs=[];
    const person=names[(day+variant)%names.length],item=contexts[(day+variant*3)%contexts.length];
    for(const skill of skills){
      let q,attempt=0;
      do{
        const a=grade===1?12+r(38+stage*12):100+r(200+stage*100),b=grade===1?10+r(30):30+r(100+stage*50);
        const n=2+r(grade===1?4:8),k=2+r(grade===1?4:8),mode=r(3);let x;
        const make=(p,ans,e,choices,extra)=>question(p,ans,e,choices,{skill,...extra});
        switch(skill){
          case 'Addition':q=make(mode===0?`Add ${a} and ${b}.`:`${a} + ${b} = ?`,a+b,`Add ones, then tens${grade===2?', then hundreds':''}. Regroup if a column reaches ten. ${a} + ${b} = ${a+b}.`,null,{visual:{kind:'column',a,b,op:'+'}});break;
          case 'Subtraction':q=make(`${a+b} − ${b} = ?`,a,`Subtract by place value. Check: ${a} + ${b} = ${a+b}.`,null,{visual:{kind:'column',a:a+b,b,op:'−'}});break;
          case 'Multiplication':q=make(mode===0?`${n} × ${k} = ?`:`Count ${n} equal groups of ${k}. How many altogether?`,n*k,`${n} groups of ${k} give ${n*k}.`,null,{visual:{kind:'array',rows:n,cols:k}});break;
          case 'Division':q=make(mode===0?`${n*k} ÷ ${n} = ?`:`Share ${n*k} counters equally into ${n} groups. How many in each?`,k,`${n} × ${k} = ${n*k}, so ${n*k} ÷ ${n} = ${k}.`);break;
          case 'Word problem':x=1+r(n*k);q=mode===0?make(`${person} has ${n*k} ${item}, gets ${n} more, then gives away ${x}. How many remain?`,n*k+n-x,`First add ${n}. Then subtract ${x}.`):mode===1?make(`${person} packs ${n} bags with ${k} ${item} in each. How many ${item} are packed?`,n*k,`There are ${n} equal groups of ${k}.`):make(`${person} shares ${n*k} ${item} equally among ${k} friends. How many does each friend get?`,n,`Split the total into ${k} equal groups.`);break;
          case 'Number line':{const from=3+r(8),step=1+r(4),delta=mode===0?-Math.min(step,from):step; q=make(`Start at ${from}. Move ${Math.abs(delta)} steps ${delta>0?'right':'left'} on the number line. Where do you land?`,from+delta,`Moving ${delta>0?'right adds':'left subtracts'} ${Math.abs(delta)}.`,null,{visual:{kind:'line',from,delta,min:0,max:16}});break;}
          case 'Number words':x=grade===1?10+r(90):100+r(900);q=make(`Write ${x} in words.`,words(x),`Read each place: ${words(x)}.`,null,{aliases:[words(x).replace('hundred ','hundred and ')]});break;
          case 'Place value':x=grade===1?10+r(90):100+r(900);q=make(`What is the value of the tens digit in ${x}?`,Math.floor(x/10)%10*10,'The tens digit represents that many groups of ten.');break;
          case 'Compare':q=make(`Which symbol fits? ${a} __ ${b}`,a>b?'>':a<b?'<':'=',`Compare the largest place values first.`,['<','>','=']);break;
          case 'Patterns':x=1+r(12);q=make(`Continue: ${x}, ${x+n}, ${x+2*n}, __.`,x+3*n,`Add ${n} at every step.`);break;
          case 'Shapes':{const shape=['triangle','square','rectangle','pentagon'][r(4)],sides={triangle:3,square:4,rectangle:4,pentagon:5}[shape];q=make(`How many sides does a ${shape} have?`,sides,`A ${shape} has ${sides} straight sides.`,[3,4,5,6],{visual:{kind:'shape',shape}});break;}
          case 'Measurement':q=make(`A ribbon is ${a} cm long. Another is ${b} cm long. What is their total length in centimeters?`,a+b,`Both lengths use centimeters, so add ${a} + ${b}.`);break;
          case 'Time':{const h=1+r(12),m=[0,30,15,45][r(grade===1?2:4)];q=make(`Read the clock. Type the time as h:mm.`,`${h}:${String(m).padStart(2,'0')}`,`The short hand shows the hour; the long hand shows ${m} minutes.`,null,{visual:{kind:'clock',hour:h,minute:m}});break;}
          case 'Money':x=r(10);q=make(`You have ${n} dimes and ${x} pennies. How many cents altogether?`,n*10+x,`Each dime is 10 cents; each penny is 1 cent. ${n} × 10 + ${x} = ${n*10+x}.`);break;
          case 'Fractions':{const total=[2,3,4][r(3)],filled=1+r(total-1);q=make('What fraction of the bar is shaded? Type shaded parts / total parts.',`${filled}/${total}`,`${filled} of ${total} equal parts are shaded.`,null,{visual:{kind:'fraction',total,filled},aliases:[`${filled} / ${total}`]});break;}
          case 'Data':q=make(`Read the chart. How many more votes did cats get than dogs?`,k,`Subtract ${n} from ${n+k}.`,null,{visual:{kind:'bars',labels:['Cats','Dogs'],values:[n+k,n]}});break;
          case 'Missing number':q=make(`Find the missing number: __ + ${k} = ${n+k}.`,n,`Subtract ${k} from ${n+k}.`);break;
          default:q=make(`Is ${a} odd or even?`,a%2?'odd':'even','Even numbers can be split into two equal whole-number groups.',['odd','even']);
        }
      }while(qs.some(old=>old.p===q.p)&&++attempt<100);
      if(attempt===100)throw Error('Could not construct distinct math questions');qs.push(q);
    }
    const focus=core[(day-1)%core.length],sample=qs.find(q=>q.skill===focus);
    return {unit:'Mixed math adventure',lesson:lesson(`Today's focus: ${focus}`,`Practice ${[...new Set(skills)].join(', ').toLowerCase()}. Work in small steps, and use drawings or objects when you need them.`,`${sample.p} Answer: ${sample.a}. ${sample.explanation}`,'Think → Model → Solve → Check',`Choose a ${focus.toLowerCase()} problem and explain a second way to solve it.`),questions:qs};
  }
  function mixedEnglish(grade,day,variant){
    const r=random(day*1531+variant*1931+grade*73),base=english(grade,day,variant),passage=base.questions[0].passage;
    const v=vocab[(day+variant)%vocab.length],w=vocab[(day+variant+5)%vocab.length],person=names[(day+variant)%names.length];
    const qs=base.questions.slice(0,3).map((q,i)=>({...q,skill:['Reading: who','Reading: why','Story sequence'][i]}));
    const add=(skill,p,a,e,c,extra)=>qs.push(question(p,a,e,c,{skill,...extra}));
    add('Spelling',`Spell the word meaning ${['the star that lights our day','a small pet that says meow','a place with plants','something you read','water falling from clouds'][day%5]}.`,['sun','cat','garden','book','rain'][day%5],'Say the word slowly, then check each sound.');
    add('Nouns',`Find the noun: “The ${v[0]} can move.”`,v[0],'A noun names a person, place, animal or thing.',[v[0],'can','move']);
    const verb=['jump','paint','read','sing','swim','draw','dance'][(day+variant)%7];
    add('Verbs',`Find the action: “We ${verb} near the ${v[0]}.”`,verb,'A verb tells what someone does.',[verb,'we',v[0]]);
    const adjective=['small','friendly','bright','clean','happy','tiny','quick','loud','long','soft','early','busy'][(day+variant)%vocab.length];
    add('Adjectives',`Find the describing word: “the ${adjective} ${v[0]}”.`,adjective,'An adjective describes a noun.',[adjective,v[0],'the']);
    add('Opposites',`Write the opposite of “${w[4]}”.`,w[5],`${w[4]} and ${w[5]} have opposite meanings.`);
    add('Punctuation',`Choose the correctly written statement about ${person}.`,`${person} likes books.`,'A statement starts with a capital letter and ends with a period.',[`${person} likes books.`,`${person.toLowerCase()} likes books.`,`${person} likes books?`]);
    const rotations=[
      ()=>add('Rhymes',`Which word rhymes with “${v[0]}”?`,v[1],'Listen for the same ending sound.',[v[1],w[0],'desk']),
      ()=>add('Plurals',`One ${v[0]}, two ___.`,v[3],'A plural means more than one.',[v[3],v[0],v[0]+'ing']),
      ()=>{const pair=[['walk','walked'],['go','went'],['eat','ate'],['see','saw'],['make','made']][day%5];add('Past tense',`Today I ${pair[0]}. Yesterday I ___.`,pair[1],'The past tense tells about before now.',[pair[1],pair[0],pair[0]+'ing']);},
      ()=>add('Pronouns',`${person} and I are friends. ___ play together.`, 'We','We includes the speaker and another person.',['We','They','It']),
      ()=>{const pair=[['rain','coat'],['sun','flower'],['tooth','brush'],['foot','ball'],['book','mark']][day%5];add('Compound words',`Join ${pair[0]} + ${pair[1]}.`,pair.join(''),'Join the two complete words to make one word.');},
      ()=>add('Beginning sounds',`Which letter starts “${w[0]}”?`,w[2],'Listen to the beginning sound.',[w[2],'z','q']),
      ()=>{const z=[['tiny','small'],['glad','happy'],['fast','quick'],['begin','start'],['large','big']][day%5];add('Similar meanings',`Which word means almost the same as “${z[0]}”?`,z[1],'Synonyms have similar meanings.',[z[1],'empty','round']);},
      ()=>{const z=[['ship','sh'],['chair','ch'],['thin','th']][day%3];add('Letter teams',`Which two letters work together at the beginning of “${z[0]}”?`,z[1],'A digraph uses two letters for one sound.',[z[1],'br','st']);}
    ];
    mix(rotations,r).slice(0,5).forEach(f=>f());
    if(grade===2){const q=qs.find(q=>q.skill==='Nouns');q.p=`Which word is a proper noun?`;q.a=person;q.choices=[person,v[0],'school'];q.explanation='A proper noun names a particular person or place and begins with a capital.';}
    return {unit:'Mixed English adventure',lesson:lesson('Read, write and play with words',`Today's mix: ${qs.map(q=>q.skill).join(', ')}. Read the short story first. Find evidence in its sentences, then practice words and grammar.`,passage,`${v[0]} → ${v[1]}\nFirst → Next → Finally`,`Write or tell a new two-sentence ending. Include an action word and a describing word.`),questions:mix(qs,r)};
  }
  function mixedScience(grade,day,variant){
    const r=random(day*2777+variant*997+grade*83),indices=mix(Array.from({length:48},(_,i)=>i),r).slice(0,6),qs=[];
    const add=(skill,p,a,e,c,extra)=>qs.push(question(p,a,e,c,{skill,...extra}));
    indices.forEach((index,i)=>{
      const [title,teach,a,b,ca,cb,reason]=scienceCases[index],skill=title;
      if(i===0)add(skill,`Sort this example: ${a}. Which label fits?`,ca,reason,[ca,cb]);
      else if(i===1)add(skill,`A learner labels ${b} as “${ca}”. Is the label correct?`,'no',`${b} fits “${cb}”. ${reason}`,['yes','no']);
      else if(i===2)add(skill,`Complete: ${a} is an example of ___.`,ca,reason,[ca,cb]);
      else if(i===3)add(skill,`Which statement explains the difference between ${a} and ${b}?`,reason,reason,[reason,`Both examples must be ${ca}.`,`Both examples must be ${cb}.`]);
      else if(i===4)add(skill,`You need an example of “${cb}”. Which would you choose?`,b,reason,[a,b]);
      else add(skill,`Which pair is correctly matched?`,`${a} → ${ca}`,reason,[`${a} → ${ca}`,`${a} → ${cb}`,`${b} → ${ca}`]);
    });
    const season=[['a puddle warms and slowly dries','evaporation','freezing'],['water gets cold enough to become ice','freezing','melting'],['ice becomes liquid as it warms','melting','condensation'],['drops form outside a cold glass','condensation','evaporation']][day%4];
    add('Predict a change',`What process happens when ${season[0]}?`,season[1],'Changes in thermal energy can change the state of water.',[season[1],season[2]]);
    const tool=[['temperature','thermometer','ruler'],['length','ruler','rain gauge'],['rainfall','rain gauge','thermometer'],['mass','balance','ruler']][(day+variant)%4];
    add('Choose a tool',`Which tool would you use to measure ${tool[0]}?`,tool[1],`A ${tool[1]} measures ${tool[0]}.`,[tool[1],tool[2]]);
    const height=3+r(9),later=height+1+r(6);
    add('Read evidence',`Plant A was ${height} cm tall on Monday and ${later} cm on Friday. Which claim fits the measurements?`,'It grew taller.','The later measurement is larger.',['It grew taller.','It got shorter.','It stayed the same height.']);
    add('Measure change',`How many centimeters did Plant A grow?`,later-height,`Subtract ${height} from ${later}.`,null,{passage:`Monday: ${height} cm. Friday: ${later} cm.`,visual:{kind:'bars',labels:['Monday','Friday'],values:[height,later]}});
    const test=[['ramp height','the same toy car'],['amount of water','the same kind of plant'],['surface texture','the same sliding block'],['paper thickness','the same bridge span']][(day+variant)%4];
    add('Fair tests',`To test ${test[0]}, what should stay the same?`,test[1],'Change one factor and keep other relevant conditions the same.',[test[1],'change everything at once']);
    add('Observation or guess',`“Plant A is ${later} cm tall.” Is this a measurement or a guess about tomorrow?`,'measurement','A ruler reading records an observation.',['measurement','guess about tomorrow']);
    const safe=[['a bright Sun','observe shadows instead of looking at the Sun','look directly at the Sun'],['an unknown liquid','ask a grown-up before handling it','taste it'],['a wild animal','watch from a distance','try to grab it'],['a hot object','ask a grown-up for help','touch it to check']][day%4];
    add('Safe investigation',`You want to learn about ${safe[0]}. What should you do?`,safe[1],'Choose a safe way to observe.',[safe[1],safe[2]]);
    add('Reason from results',`A toy rolls ${height} cm in one test and ${later} cm in another. What should you do before saying how far it usually rolls?`,'repeat the test under the same conditions','Repeated tests give more evidence.',['repeat the test under the same conditions','say it always rolls exactly '+later+' cm']);
    const focus=scienceCases[indices[0]];
    return {unit:'Mixed science adventure',lesson:lesson(`Explore today: ${focus[0]}`,focus[1],`${focus[2]}: ${focus[4]}. ${focus[3]}: ${focus[5]}. ${focus[6]}`,`${focus[2]} → ${focus[4]}\n${focus[3]} → ${focus[5]}`,`Draw an example of ${focus[0].toLowerCase()}. Explain it, then tell a grown-up one observation you could safely make.`),questions:mix(qs,r),learningNotes:indices.slice(1).map(i=>({title:scienceCases[i][0],text:scienceCases[i][1],example:scienceCases[i][6]}))};
  }

  function build(grade,subject,day,variant=0) {
    if(![1,2].includes(Number(grade))||!['math','english','science'].includes(subject)||!Number.isInteger(day)||day<1||day>days||!Number.isInteger(variant)||variant<0)throw new RangeError('Invalid curriculum request');
    grade=Number(grade);
    const pack=({math:mixedMath,english:mixedEnglish,science:mixedScience})[subject](grade,day,variant);
    const r=random(day*1237+grade*71+variant*1471+subject.length);
    if(day===365){pack.lesson.title='Year finale: '+pack.unit;pack.lesson.challenge='Choose one example from this year. Show what you know in a drawing, explanation or mini-project. '+pack.lesson.challenge;}
    pack.questions.forEach((q,i)=>{q.id=`mixed-v2-g${grade}-${subject}-d${day}-v${variant}-q${i+1}`;q.challenge=i===pack.questions.length-1;if(q.choices)for(let j=q.choices.length-1;j>0;j--){const k=r(j+1);[q.choices[j],q.choices[k]]=[q.choices[k],q.choices[j]];}});
    return {...pack,grade,subject,day,variant,week:Math.min(52,Math.ceil(day/7)),focus:angles[(day-1)%7]};
  }
  function dateNumber(value) {const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');if(!m)return NaN;const n=Date.UTC(+m[1],+m[2]-1,+m[3]);const d=new Date(n);return d.getUTCFullYear()===+m[1]&&d.getUTCMonth()===+m[2]-1&&d.getUTCDate()===+m[3]?n/86400000:NaN;}
  function dayForDate(start,current) {const a=dateNumber(start),b=dateNumber(current);return Number.isFinite(a)&&Number.isFinite(b)?Math.max(1,Math.min(days,b-a+1)):1;}
  return {days,build,dayForDate,dateNumber,words,scienceCases,mathSkills,topics:{math:mathUnits.map(u=>u[0]),english:englishUnits.map(u=>u[0]),science:scienceThemes}};
})();
if(typeof module!=='undefined')module.exports=YearCurriculum;
