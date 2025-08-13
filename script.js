const wheel1Options = [
    { text: "安然無事", prob: 1 },
    { text: "大板20下", prob: 10 },
    { text: "大板40下", prob: 7 },
    { text: "大板60下", prob: 4 },
    { text: "小板20下", prob: 10 },
    { text: "小板40下", prob: 10 },
    { text: "小板60下", prob: 10 },
    { text: "手掌20下", prob: 10 },
    { text: "手掌40下", prob: 8 },
    { text: "手掌60下", prob: 7 },
    { text: "皮帶20下", prob: 10 },
    { text: "皮帶40下", prob: 7 },
    { text: "皮帶60下", prob: 4 },
    { text: "按摩20下", prob: 1 }
];

const wheel2Options = [
    { text: "分數5", prob: 10, score: 5 },
    { text: "分數10", prob: 15, score: 10 },
    { text: "分數15", prob: 15, score: 15 },
    { text: "分數20", prob: 20, score: 20 },
    { text: "分數25", prob: 15, score: 25 },
    { text: "分數30", prob: 10, score: 30 },
    { text: "分數-10", prob: 6, score: -10 },
    { text: "分數-15", prob: 4, score: -15 },
    { text: "分數-30", prob: 3, score: -30 },
    { text: "丟了一半", prob: 2, score: 0 }
];

let score = 0;
let counts = { daban: 0, xiaoban: 0, shouzhang: 0, pidai: 0 };
let historyCount = 0;
let lastSubtitleScoreLevel = 0;

const resultEl = document.getElementById('result');
const button = document.getElementById('drawButton');
const historyEl = document.getElementById('history');
const subtitleEl = document.getElementById('subtitle');

button.addEventListener('click', () => {
    button.disabled = true;
    let animDuration = 1000;
    let animInterval = 80;
    let elapsed = 0;
    const combinedTexts = [...wheel1Options.map(o => o.text), ...wheel2Options.map(o => o.text)];
    let animTimer = setInterval(() => {
        let randomIndex = Math.floor(Math.random() * combinedTexts.length);
        resultEl.textContent = combinedTexts[randomIndex];
        elapsed += animInterval;
        if (elapsed >= animDuration) {
            clearInterval(animTimer);
            const w1 = spinWheel(wheel1Options);
            const w2 = spinWheel(wheel2Options);
            updateCounts(w1);
            updateScore(w2);
            resultEl.textContent = `${w1.text} + ${w2.text}`;
            addHistory(w1, w2);
            button.disabled = false;
        }
    }, animInterval);
});

function spinWheel(options) {
    const totalProb = options.reduce((sum, o) => sum + o.prob, 0);
    let rnd = Math.random() * totalProb;
    for (let o of options) {
        if (rnd < o.prob) return o;
        rnd -= o.prob;
    }
}

function updateCounts(result) {
    if (result.text.includes("大板")) animateStat("daban");
    if (result.text.includes("小板")) animateStat("xiaoban");
    if (result.text.includes("手掌")) animateStat("shouzhang");
    if (result.text.includes("皮帶")) animateStat("pidai");

    if (result.text.includes("大板")) counts.daban += parseInt(result.text.match(/\d+/)[0]);
    if (result.text.includes("小板")) counts.xiaoban += parseInt(result.text.match(/\d+/)[0]);
    if (result.text.includes("手掌")) counts.shouzhang += parseInt(result.text.match(/\d+/)[0]);
    if (result.text.includes("皮帶")) counts.pidai += parseInt(result.text.match(/\d+/)[0]);

    document.getElementById("count-daban").textContent = counts.daban;
    document.getElementById("count-xiaoban").textContent = counts.xiaoban;
    document.getElementById("count-shouzhang").textContent = counts.shouzhang;
    document.getElementById("count-pidai").textContent = counts.pidai;
}

function updateScore(result) {
    const scoreEl = document.getElementById("score");
    if (result.text === "丟了一半") {
        score = Math.floor(score / 2);
        scoreEl.classList.add("half");
        setTimeout(() => scoreEl.classList.remove("half"), 600);
    } else {
        score += result.score;
    }
    scoreEl.classList.remove("change-positive", "change-negative");
    if (result.score > 0) scoreEl.classList.add("change-positive");
    if (result.score < 0) scoreEl.classList.add("change-negative");
    scoreEl.textContent = score;
    updateSubtitle(score);
}

function animateStat(id) {
    const el = document.getElementById(`count-${id}`);
    el.classList.add("updated");
    setTimeout(() => el.classList.remove("updated"), 400);
}

function addHistory(w1, w2) {
    historyCount++;
    const entry = document.createElement("div");
    entry.textContent = `${historyCount}. ${w1.text} + ${w2.text}`;
    if (w2.score < 0) entry.classList.add("negative");
    if (w2.text === "丟了一半") entry.classList.add("half");
    historyEl.prepend(entry);
}

function updateSubtitle(currentScore) {
    let level = 0;
    let messages = [];
    if (currentScore > 500) {
        level = 4;
        messages = ["弟弟知道錯了，屁股真的很痛，可以消氣嗎，拜託!!!"];
    } else if (currentScore > 300) {
        level = 3;
        messages = [
            "弟弟知道不乖的下場就是屁股像現在被抽到紅腫，不敢不聽話了",
            "都是弟弟嘴上不饒人，結果屁股開花有得到教訓，已經長記性了",
            "搗蛋的壞弟弟屁股已經紅到變超乖的屁股，只會聽哥哥的話了"
        ];
    } else if (currentScore > 200) {
        level = 2;
        messages = [
            "弟弟知道裝逼的代價就是挨打，認清屁股永遠不可能比板子硬了",
            "弟弟剛剛是逞強説自己能扛住，已經多挨了好幾百下了，有點腫",
            "看在弟弟主動脫光趴好翹高，哥哥可以從輕發落了嗎"
        ];
    } else if (currentScore > 100) {
        level = 1;
        messages = [
            "弟弟自願受罰，屁股疼死，但受罰更爽，下次還敢犯錯。",
            "被抽這幾下，弟弟還是趴好翹屁股，哥哥管教可以狠點嗎",
            "弟弟故意惹禍，就是為了被哥哥揍的屁股發紅，有種再來"
        ];
    }
    if (level > lastSubtitleScoreLevel) {
        lastSubtitleScoreLevel = level;
        subtitleEl.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}
