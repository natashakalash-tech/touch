const predictions = [
  "без паники, это стиль",
  "отдых тоже стратегия",
  "ты не обязан быть скромным",
  "просто делай вид, что знаешь, что делаешь",
  "ну можно себе и позволить",
  "сначала удовольствие, потом всё остальное",
  "имеешь право на маленькую радость",
  "вот тебе знак: поешь",
  "это не слабость, это стиль жизни",
  "почему бы и нет",
  "если хочется — значит, надо",
  "красавчик! продолжай",
  "случайно получилось слишком хорошо",
  "твой уровень — позволить себе лишнее",
  "иногда лучший план — не планировать",
];

const touchBtn = document.getElementById("touchBtn");
const touchLabel = document.getElementById("touchLabel");
const oracle = document.getElementById("oracle");
const motes = document.getElementById("motes");
const runeRing = document.getElementById("runeRing");

let used = [];

const calmMode = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* —— искры духов —— */
function rand(min, max) {
  return min + Math.random() * (max - min);
}

function makeMote(vars, modifier) {
  const mote = document.createElement("span");
  mote.className = `mote mote--${modifier}`;
  Object.entries(vars).forEach(([key, value]) => mote.style.setProperty(key, value));
  motes.appendChild(mote);
  return mote;
}

function spawnAmbientMotes(count) {
  for (let i = 0; i < count; i += 1) {
    const size = rand(2, 5);
    makeMote(
      {
        "--x": `${rand(2, 98).toFixed(1)}%`,
        "--y": "104%",
        "--s": `${size.toFixed(1)}px`,
        "--dx": `${rand(-9, 9).toFixed(1)}vw`,
        "--dur": `${rand(15, 28).toFixed(1)}s`,
        "--delay": `${rand(-24, 0).toFixed(1)}s`,
        "--peak": rand(0.3, 0.85).toFixed(2),
      },
      "rise"
    );
  }
}

function spawnBurst(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = rand(0, Math.PI * 2);
    const dist = rand(70, 280);
    const size = rand(2.5, 6);
    const mote = makeMote(
      {
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--s": `${size.toFixed(1)}px`,
        "--dx": `${(Math.cos(angle) * dist).toFixed(1)}px`,
        "--dy": `${(Math.sin(angle) * dist * 0.55 - dist * 0.7).toFixed(1)}px`,
        "--dur": `${rand(1.5, 2.9).toFixed(2)}s`,
        "--delay": `${rand(0, 0.45).toFixed(2)}s`,
      },
      "burst"
    );

    mote.addEventListener("animationend", () => mote.remove(), { once: true });
  }
}

if (!calmMode) spawnAmbientMotes(18);

function appendShakyChar(parent, ch, charClass, scale) {
  const span = document.createElement("span");
  span.className = charClass;

  if (ch === " ") {
    span.innerHTML = "&nbsp;";
    span.style.width = "0.35em";
  } else {
    span.textContent = ch;
    const rot = (Math.random() - 0.5) * scale.rot * 2;
    const dx = `${((Math.random() - 0.5) * scale.dx * 2).toFixed(1)}px`;
    const dy = `${((Math.random() - 0.5) * scale.dy * 2).toFixed(1)}px`;
    const rotDelta = `${((Math.random() - 0.5) * scale.rotDelta * 2).toFixed(1)}deg`;

    span.style.setProperty("--rot", `${rot.toFixed(1)}deg`);
    span.style.setProperty("--dx", dx);
    span.style.setProperty("--dy", dy);
    span.style.setProperty("--rot-delta", rotDelta);
    span.style.setProperty(
      "--wobble-dur",
      `${(scale.durMin + Math.random() * (scale.durMax - scale.durMin)).toFixed(2)}s`
    );
    span.style.setProperty("--wobble-delay", `${(Math.random() * 0.25).toFixed(2)}s`);
  }

  parent.appendChild(span);
}

function applyShakyLetters(container, text, charClass, intensity = "oracle") {
  container.textContent = "";

  const scale =
    intensity === "button"
      ? { rot: 5, dx: 1.2, dy: 1.6, rotDelta: 1.8, durMin: 0.14, durMax: 0.22 }
      : { rot: 3.5, dx: 1, dy: 1.4, rotDelta: 1.6, durMin: 0.18, durMax: 0.3 };

  const wordClass = intensity === "button" ? "btn-word" : "oracle-word";

  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;

    if (/^\s+$/.test(part)) {
      container.appendChild(document.createTextNode(part));
      return;
    }

    const word = document.createElement("span");
    word.className = wordClass;
    [...part].forEach((ch) => appendShakyChar(word, ch, charClass, scale));
    container.appendChild(word);
  });
}

applyShakyLetters(touchLabel, "ПОСЛАНИЕ ДУХОВ", "btn-char", "button");

function pickPrediction() {
  if (used.length >= predictions.length) used = [];
  const pool = predictions.filter((p) => !used.includes(p));
  const text = pool[Math.floor(Math.random() * pool.length)];
  used.push(text);
  return text;
}

function buildShakyText(text) {
  oracle.innerHTML = "";
  oracle.className = "oracle shaking";

  const tilt = (Math.random() - 0.5) * 2.4;
  oracle.style.setProperty("--tilt", `${tilt.toFixed(1)}deg`);

  applyShakyLetters(oracle, text, "oracle-char", "oracle");
}

/* —— финал: сколько послание держится на экране, мс —— */
const HOLD_MS = 5000;
const ORACLE_IN_MS = 900;
const FADE_OUT_MS = 1000;
const FAREWELL_TEXT = "ну всё, иди, не зли духов.";

function showFarewell() {
  oracle.className = "oracle shaking visible leaving";

  setTimeout(() => {
    oracle.textContent = FAREWELL_TEXT;
    oracle.className = "oracle farewell";
    runeRing.classList.add("dimmed");
    requestAnimationFrame(() => oracle.classList.add("visible"));
  }, FADE_OUT_MS);
}

function revealOracle() {
  const text = pickPrediction();
  buildShakyText(text);
  oracle.hidden = false;
  requestAnimationFrame(() => oracle.classList.add("visible"));

  setTimeout(showFarewell, ORACLE_IN_MS + HOLD_MS);
}

touchBtn.addEventListener("click", () => {
  if (touchBtn.classList.contains("dissolving")) return;

  if (!calmMode) {
    const rect = touchBtn.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
  }

  touchBtn.classList.add("dissolving");
  runeRing.classList.add("visible");

  touchBtn.addEventListener(
    "animationend",
    () => {
      touchBtn.style.display = "none";
      revealOracle();
    },
    { once: true }
  );
});
