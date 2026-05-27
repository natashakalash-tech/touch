const predictions = [
  "сегодня ты удивишься",
  "кто-то думает о тебе",
  "скоро придёт хорошая новость",
  "не торопись — всё вовремя",
  "доверься первому импульсу",
  "вечером будет тепло",
  "ты на правильном пути",
  "маленький знак — большой смысл",
  "отпусти — и откроется новое",
  "завтра будет лучше",
  "ты сильнее, чем кажется",
  "что-то хорошее давно ждёт тебя",
  "смейся чаще — это работает",
  "ближе, чем кажется",
  "сейчас лучшее время действовать",
];

const touchBtn = document.getElementById("touchBtn");
const touchLabel = document.getElementById("touchLabel");
const oracle = document.getElementById("oracle");

let used = [];

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
      : { rot: 14, dx: 3, dy: 4, rotDelta: 5, durMin: 0.1, durMax: 0.22 };

  if (intensity === "oracle") {
    const parts = text.split(/(\s+)/);
    parts.forEach((part) => {
      if (!part) return;

      if (/^\s+$/.test(part)) {
        container.appendChild(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.className = "oracle-word";
      [...part].forEach((ch) => appendShakyChar(word, ch, charClass, scale));
      container.appendChild(word);
    });
    return;
  }

  [...text].forEach((ch) => appendShakyChar(container, ch, charClass, scale));
}

applyShakyLetters(touchLabel, "ПОТРОГАЙ", "btn-char", "button");

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

  const tilt = (Math.random() - 0.5) * 6;
  oracle.style.setProperty("--tilt", `${tilt.toFixed(1)}deg`);

  applyShakyLetters(oracle, text, "oracle-char", "oracle");
}

function revealOracle() {
  const text = pickPrediction();
  buildShakyText(text);
  oracle.hidden = false;
  requestAnimationFrame(() => oracle.classList.add("visible"));
}

touchBtn.addEventListener("click", () => {
  if (touchBtn.classList.contains("dissolving")) return;

  touchBtn.classList.add("dissolving");
  touchBtn.addEventListener(
    "animationend",
    () => {
      touchBtn.style.display = "none";
      revealOracle();
    },
    { once: true }
  );
});
