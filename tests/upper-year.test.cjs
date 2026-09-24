const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..'),context=vm.createContext({module:{exports:{}},console});
for(const file of ['year-curriculum.js','upper-curriculum.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}).runInContext(context);
const Y=new vm.Script('YearCurriculum').runInContext(context);
const levels=[3,4,5,6,7,8,106,107,108],subjects=['math','english','science'];
let count=0;
assert.equal(Y.levels.length,11);
for(const level of levels){
  assert.equal(Y.topicsFor(level,'math').length,13);
  assert.equal(Y.topicsFor(level,'english').length,13);
  assert.equal(Y.topicsFor(level,'science').length,13);
  for(const subject of subjects){
    const fingerprints=new Set();
    for(let day=1;day<=365;day++){
      const daily=Y.build(level,subject,day);
      assert.equal(daily.questions.length,15,`${level} ${subject} day ${day}`);
      assert.equal(daily.lesson.sections.length,7);
      assert.ok(daily.lesson.text.length>80);
      assert.ok(daily.lesson.example.length>40);
      assert.ok(daily.lesson.challenge.length>40);
      assert.equal(new Set(daily.questions.map(q=>q.p)).size,15);
      assert.ok(new Set(daily.questions.map(q=>q.skill)).size>=12);
      assert.deepEqual(daily,Y.build(level,subject,day),'Deterministic daily set');
      const fingerprint=JSON.stringify(daily.questions.map(q=>[q.p,q.a,q.passage]));
      assert.ok(!fingerprints.has(fingerprint),`Repeated day ${level} ${subject} ${day}`);fingerprints.add(fingerprint);
      for(const variant of [0,1,2]){
        const pack=Y.build(level,subject,day,variant);
        assert.equal(pack.questions.length,15);
        assert.equal(new Set(pack.questions.map(q=>q.p)).size,15);
        for(const item of pack.questions){
          count++;assert.ok(item.id&&item.skill&&item.p&&item.a!==''&&item.explanation);
          assert.ok(!/undefined|NaN/.test(JSON.stringify(item)));
          if(item.choices){assert.ok(item.choices.includes(item.a));assert.equal(item.choices.length,new Set(item.choices).size);assert.ok(item.choices.length>=2)}
        }
        if(variant)assert.notEqual(JSON.stringify(pack.questions.map(q=>[q.p,q.a,q.passage])),fingerprint,'Bonus must be fresh');
      }
      assert.ok(daily.questions.at(-1).challenge);
      if(level>=106){assert.equal(daily.supported,true);assert.match(daily.lesson.text,/Supported pathway/)}
    }
    console.log(`${Y.levelLabel(level)} ${subject}: 365 lessons and daily sets verified`);
  }
}
console.log(`PASS: ${count.toLocaleString()} upper-grade and VE question instances checked.`);
