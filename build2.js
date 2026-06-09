const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\husso\\Desktop\\امتحان_قانون_فرنسي.html', 'utf8');

// replace in selectOpt: after state.selected = i; add wrong explanation
const oldCode = `  state.selected = i;
  state.revealed = true;
  render();`;

const newCode = `  state.selected = i;
  state.revealed = true;
  // wrong answer explanation
  if (i !== shuffled[idx].answer && shuffled[idx].t) {
    const _q = shuffled[idx];
    setTimeout(() => {
      const _el = document.querySelector('#main .card .opts');
      if (_el) {
        const _expl = document.createElement('div');
        _expl.style.cssText = 'margin-top:8px;padding:10px;background:#fff3e0;border-radius:6px;border-right:3px solid #f57c00;font-size:13px;line-height:1.6;';
        _expl.innerHTML = '<strong>❌ الإجابة خطأ</strong><br>📖 ' + _q.t;
        _el.after(_expl);
      }
    }, 50);
  }
  render();`;

const updated = html.replace(oldCode, newCode);
fs.writeFileSync('C:\\Users\\husso\\Desktop\\امتحان_قانون_فرنسي.html', updated, 'utf8');
console.log('Update done');
