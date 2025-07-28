let level = 0;
let xp = 0;
let totalXP = 0;
let log = [];

function xpToNext(level) {
  if (level >= 0 && level <= 16) return 2 * level + 7;
  if (level <= 31) return 5 * level - 38;
  return 9 * level - 158;
}

function updateDisplay() {
  const need = xpToNext(level);
  const percent = Math.min(100, (xp / need) * 100);
  document.getElementById('bar-fill').style.width = percent + '%';
  document.getElementById('progress-text').innerText = `${xp} / ${need} XP`;
  document.getElementById('level-display').innerText = `Level: ${level}`;
  document.getElementById('total-xp').innerText = `Gesamt-XP: ${totalXP}`;
  updateBackground();
  saveState();
}

function addXP(amount) {
  xp += amount;
  if (xp < 0) xp = 0;

  while (xp >= xpToNext(level)) {
    xp -= xpToNext(level);
    level++;
  }

  while (xp < 0 && level > 0) {
    level--;
    xp += xpToNext(level);
  }

  totalXP += Math.max(0, amount);
  log.push(`+${amount} XP auf Level ${level}`);
  renderLog();
  updateDisplay();
}

function addLevel(amount) {
  level += amount;
  if (level < 0) level = 0;
  xp = 0;
  updateDisplay();
}

function addCustomXP() {
  const value = parseInt(document.getElementById('xp-input').value);
  if (!isNaN(value)) {
    addXP(value);
    document.getElementById('xp-input').value = '';
  }
}

function renderLog() {
  const ul = document.getElementById('xp-log');
  ul.innerHTML = '';
  log.slice(-10).forEach(entry => {
    const li = document.createElement('li');
    li.innerText = entry;
    ul.appendChild(li);
  });
}

function updateBackground() {
  const body = document.body;
  body.classList.remove('level-10', 'level-30', 'level-50');
  if (level >= 50) {
    body.classList.add('level-50');
  } else if (level >= 30) {
    body.classList.add('level-30');
  } else if (level >= 10) {
    body.classList.add('level-10');
  }
}

function saveState() {
  localStorage.setItem('xpData', JSON.stringify({ level, xp, totalXP, log }));
}

function loadState() {
  const data = JSON.parse(localStorage.getItem('xpData'));
  if (data) {
    level = data.level;
    xp = data.xp;
    totalXP = data.totalXP;
    log = data.log || [];
  }
}

loadState();
updateDisplay();
renderLog();
