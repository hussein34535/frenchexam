const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\husso\\Desktop\\امتحان_قانون_فرنسي.html', 'utf8');
const tdata = JSON.parse(fs.readFileSync('C:\\Users\\husso\\Desktop\\frenchexam\\translations.json', 'utf8'));

// fix: "dit" -> "est" in key
tdata["La police judiciaire est l'ensemble des interventions de l'administration qui tendent à imposer à la libre action des particuliers la discipline exigée par la vie en société."] = 
tdata["La police judiciaire dit l'ensemble des interventions de l'administration qui tendent à imposer à la libre action des particuliers la discipline exigée par la vie en société."];
delete tdata["La police judiciaire dit l'ensemble des interventions de l'administration qui tendent à imposer à la libre action des particuliers la discipline exigée par la vie en société."];

// extract the questions array from HTML
const match = html.match(/const questions = (\[[\s\S]*?\]);/);
if (!match) { console.error('Could not find questions array'); process.exit(1); }
const questions = JSON.parse(match[1]);

// add translation to each question that has one
questions.forEach(q => {
  if (tdata[q.q]) {
    q.t = tdata[q.q];
  }
});

const questionsJson = JSON.stringify(questions, null, 2);

// build updated HTML
let newHtml = html.replace(match[0], `const questions = ${questionsJson};`);

// update render function to show translation
newHtml = newHtml.replace(
  `      <div class="q-text">\${q.q}</div>`,
  `      <div class="q-text">\${q.q}</div>\${q.t ? '<div style="background:#f0f7ff;padding:10px;border-radius:6px;margin-bottom:12px;font-size:14px;line-height:1.5;color:#1a237e;border-right:3px solid #1a73e8;">📖 ' + q.t + '</div>' : ''}`
);

// update selectOpt to show explanation when wrong
newHtml = newHtml.replace(
  `   state.revealed = true;
   render();`,
  `   state.revealed = true;
   // show wrong explanation
   if (i !== shuffled[idx].answer && shuffled[idx].t) {
     const q = shuffled[idx];
     setTimeout(() => {
       const el = document.querySelector('#main .card .opts');
       if (el) {
         const expl = document.createElement('div');
         expl.style.cssText = 'margin-top:12px;padding:10px;background:#fff3e0;border-radius:6px;border-right:3px solid #f57c00;font-size:13px;line-height:1.6;';
         expl.innerHTML = '⚠️ <strong>الترجمة:</strong> ' + q.t;
         el.after(expl);
       }
     }, 50);
   }
   render();`
);

fs.writeFileSync('C:\\Users\\husso\\Desktop\\امتحان_قانون_فرنسي.html', newHtml, 'utf8');
console.log('Done! Updated HTML with translations.');
