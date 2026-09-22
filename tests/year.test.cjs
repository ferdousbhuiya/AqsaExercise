const assert=require('node:assert/strict');
const Y=require('../year-curriculum.js');
let questionCount=0;
for(const grade of [1,2])for(const subject of ['math','english','science']) {
  const dailySets=new Set();
  for(let day=1;day<=365;day++) {
    const pack=Y.build(grade,subject,day);
    assert.deepEqual(pack,Y.build(grade,subject,day),'Stable after reload');
    assert.equal(pack.questions.length,10);
    assert.equal(new Set(pack.questions.map(q=>q.p)).size,10,'No duplicates within a sheet');
    assert.ok(pack.lesson.text&&pack.lesson.example&&pack.lesson.challenge&&pack.lesson.visual);
    const key=JSON.stringify(pack.questions.map(q=>[q.p,q.a,q.passage]));
    assert.ok(!dailySets.has(key),`Repeated daily set: ${grade} ${subject} ${day}`);dailySets.add(key);
    for(const variant of [0,1,2]) {
      const set=Y.build(grade,subject,day,variant);
      assert.equal(set.questions.length,10);
      assert.equal(new Set(set.questions.map(q=>q.p)).size,10);
      for(const q of set.questions) {
        questionCount++;
        assert.ok(q.id&&q.p&&q.a!==''&&q.explanation);
        assert.ok(!/undefined|NaN/.test(JSON.stringify(q)));
        if(q.choices){assert.ok(q.choices.includes(q.a));assert.equal(new Set(q.choices).size,q.choices.length);assert.ok(q.choices.length>=2);}
        if(subject==='math') {
          const arithmetic=q.p.match(/(?:^|Challenge: )(\d+) ([+−]) (\d+) = \?/);
          if(arithmetic)assert.equal(+q.a,arithmetic[2]==='+'?+arithmetic[1]+ +arithmetic[3]:+arithmetic[1]- +arithmetic[3]);
          const pattern=q.p.match(/next number: (\d+), (\d+), (\d+),/);
          if(pattern)assert.equal(+q.a,2*pattern[3]-pattern[2]);
          const sharing=q.p.match(/Share (\d+).*among (\d+) children/);
          if(sharing)assert.equal(+q.a,sharing[1]/sharing[2]);
          const coins=q.p.match(/has (\d+) dimes and (\d+) pennies/);
          if(coins)assert.equal(+q.a,coins[1]*10+ +coins[2]);
          assert.ok(Number.isFinite(+q.a)||['<','>','='].includes(q.a));
          if(Number.isFinite(+q.a))assert.ok(+q.a>=0);
        }
      }
      if(variant)assert.notEqual(JSON.stringify(set.questions.map(q=>[q.p,q.a,q.passage])),key,'Bonus must differ from daily set');
    }
    assert.ok(pack.questions[9].challenge);
  }
  console.log(`Grade ${grade} ${subject}: 365 distinct daily sheets, stable answers, lessons and bonuses`);
}
assert.equal(Y.dayForDate('2026-09-22','2026-09-22'),1);
assert.equal(Y.dayForDate('2026-09-22','2026-09-23'),2);
assert.equal(Y.dayForDate('2026-09-22','2027-09-21'),365);
assert.equal(Y.dayForDate('2026-09-22','2028-09-21'),365,'No silent year wrap');
assert.equal(Y.dayForDate('2026-10-01','2026-09-22'),1);
assert.equal(Y.dayForDate('2028-02-28','2028-03-01'),3,'Leap day');
assert.equal(Y.dayForDate('2026-03-07','2026-03-09'),3,'DST uses dates, not elapsed local hours');
assert.equal(Y.dayForDate('broken','2026-09-22'),1);
assert.ok(Number.isNaN(Y.dateNumber('2026-02-30')));
assert.throws(()=>Y.build(1,'math',366));
console.log(`PASS: ${questionCount.toLocaleString()} generated question instances checked (daily plus two bonus variants).`);
