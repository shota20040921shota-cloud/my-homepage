/*
 * THE RECORD OF AONO SHOTA - Ver.4.2
 * ・記録のインク演出
 * ・ページごとの環境音
 *
 * index.html の </body> 直前で、homepage_v41_dashboard_ui.js の後に読み込んでください。
 * 追加の音声ファイルは不要です。環境音は Web Audio API で生成します。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV42InkAmbienceStyles";
    const FLOATING_BUTTON_ID = "v42AmbientFloatingButton";
    const UPDATE_MARKER = "VER.4.2 INK AND PAGE AMBIENCE";

    const INK_STORAGE_KEY = "aonoV42InkEnabled";
    const AMBIENT_STORAGE_KEY = "aonoV42AmbientEnabled";
    const AMBIENT_VOLUME_STORAGE_KEY = "aonoV42AmbientVolume";

    const ambiencePresets = {
        study: {
            label: "静かな書斎",
            noiseType: "lowpass",
            noiseFrequency: 900,
            noiseGain: 0.020,
            humFrequency: 84,
            humGain: 0.008,
            accent: "paper",
            accentMin: 4.5,
            accentMax: 8.5
        },
        library: {
            label: "古書庫",
            noiseType: "lowpass",
            noiseFrequency: 720,
            noiseGain: 0.022,
            humFrequency: 66,
            humGain: 0.007,
            accent: "paper",
            accentMin: 5.5,
            accentMax: 10
        },
        park: {
            label: "風と遠い鐘",
            noiseType: "bandpass",
            noiseFrequency: 1450,
            noiseGain: 0.018,
            humFrequency: 128,
            humGain: 0.004,
            accent: "chime",
            accentMin: 5,
            accentMax: 9
        },
        game: {
            label: "ゲーム端末室",
            noiseType: "lowpass",
            noiseFrequency: 520,
            noiseGain: 0.014,
            humFrequency: 96,
            humGain: 0.010,
            accent: "bleep",
            accentMin: 3.8,
            accentMax: 7.2
        },
        music: {
            label: "音楽室",
            noiseType: "lowpass",
            noiseFrequency: 1050,
            noiseGain: 0.012,
            humFrequency: 110,
            humGain: 0.004,
            accent: "pluck",
            accentMin: 4.3,
            accentMax: 8.2
        },
        adventure: {
            label: "冒険の鼓動",
            noiseType: "lowpass",
            noiseFrequency: 620,
            noiseGain: 0.018,
            humFrequency: 52,
            humGain: 0.010,
            accent: "thud",
            accentMin: 4.8,
            accentMax: 8.8
        },
        system: {
            label: "魔法装置の低音",
            noiseType: "bandpass",
            noiseFrequency: 760,
            noiseGain: 0.012,
            humFrequency: 142,
            humGain: 0.007,
            accent: "shimmer",
            accentMin: 4.2,
            accentMax: 7.8
        }
    };

    const pageAmbience = {
        HOME: "study",
        CHARACTER: "library",
        PREFERENCES: "park",
        SKILL: "library",
        TITLE: "library",
        "ITEM BOX": "library",
        "GAME LIBRARY": "game",
        GALLERY: "park",
        "DISNEY GUIDE": "park",
        "PERFORMANCE RECORD": "music",
        MUSCLE: "adventure",
        ACHIEVEMENTS: "adventure",
        "AONO GACHA": "game",
        "AONO COLLECTION": "game",
        "MESSAGE BOARD": "library",
        CONTACT: "system",
        "UPDATE LOG": "library",
        OPTION: "system"
    };

    let inkEnabled = readBoolean(INK_STORAGE_KEY, true);
    let ambientEnabled = readBoolean(AMBIENT_STORAGE_KEY, true);
    let ambientVolume = readNumber(AMBIENT_VOLUME_STORAGE_KEY, 0.24, 0, 1);

    let audioContext = null;
    let ambienceMaster = null;
    let ambienceNodes = [];
    let accentTimer = null;
    let currentPresetKey = "";
    let currentPage = "";
    let userHasInteracted = false;

    let contentObserver = null;
    let enhanceTimer = null;
    let lastAnimatedFirstNode = null;
    let lastAnimatedPage = "";

    function readBoolean(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value !== "false";
        } catch (error) {
            return fallback;
        }
    }

    function readNumber(key, fallback, min, max) {
        try {
            const value = Number(localStorage.getItem(key));
            return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (error) {
            // 保存できない環境でも、その場の設定変更は有効にする。
        }
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.2 RECORD INK REVEAL
========================================================= */
.v42-ink-target{
    position:relative;
    isolation:isolate;
    will-change:opacity,clip-path,filter,transform;
}
.v42-ink-target.v42-ink-ready{
    opacity:.05;
    clip-path:polygon(0 0,0 0,0 100%,0 100%);
    filter:sepia(.9) saturate(.45) contrast(.72) blur(1.4px);
    transform:translateY(5px);
}
.v42-ink-target.v42-ink-play{
    animation:v42InkReveal .92s cubic-bezier(.18,.78,.2,1) both;
    animation-delay:var(--v42-ink-delay,0ms);
}
@keyframes v42InkReveal{
    0%{
        opacity:.05;
        clip-path:polygon(0 0,0 0,0 100%,0 100%);
        filter:sepia(.9) saturate(.45) contrast(.72) blur(1.4px);
        transform:translateY(5px);
    }
    38%{opacity:.68;filter:sepia(.72) saturate(.6) contrast(.86) blur(.45px)}
    72%{clip-path:polygon(0 0,100% 0,96% 100%,0 100%)}
    100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);filter:none;transform:none}
}
body.v41-motion-short .v42-ink-target.v42-ink-play{animation-duration:.38s}
body.v41-motion-none .v42-ink-target,
body.v42-ink-disabled .v42-ink-target{
    opacity:1!important;
    clip-path:none!important;
    filter:none!important;
    transform:none!important;
    animation:none!important;
}

#content{position:relative}
.v42-ink-cloud{
    position:absolute;
    z-index:80;
    top:-34px;
    left:-26%;
    width:34%;
    height:210px;
    border-radius:48% 55% 43% 58%;
    background:
        radial-gradient(circle at 70% 35%,rgba(72,35,6,.24),transparent 46%),
        radial-gradient(circle at 40% 70%,rgba(102,54,12,.17),transparent 50%);
    filter:blur(12px);
    opacity:0;
    mix-blend-mode:multiply;
    pointer-events:none;
    animation:v42InkCloud .94s ease-out both;
}
@keyframes v42InkCloud{
    0%{left:-26%;opacity:0;transform:scale(.62) rotate(-5deg)}
    28%{opacity:.58}
    78%{opacity:.18}
    100%{left:103%;opacity:0;transform:scale(1.65) rotate(5deg)}
}
body.v41-motion-short .v42-ink-cloud{animation-duration:.38s}
body.v41-motion-none .v42-ink-cloud,
body.v42-ink-disabled .v42-ink-cloud{display:none!important}

/* =========================================================
   VER.4.2 OPTION UI
========================================================= */
.v42-option-card{
    padding:18px;
    border:2px solid rgba(111,70,24,.45);
    border-radius:15px;
    background:rgba(255,249,226,.75);
    box-shadow:inset 0 0 13px rgba(255,255,255,.74),0 5px 12px rgba(58,31,7,.13);
}
.v42-option-card h4{margin:0 0 7px;color:#5c350d;font-size:20px;letter-spacing:2px}
.v42-option-card>p{margin:0 0 14px;color:#765d40;font-size:14px;line-height:1.7}
.v42-control-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 0;border-top:1px dashed rgba(112,70,25,.28)}
.v42-control-row:first-of-type{border-top:0;padding-top:0}
.v42-control-label{min-width:0}
.v42-control-label b{display:block;color:#5e370f;font-size:15px;letter-spacing:1px}
.v42-control-label small{display:block;margin-top:3px;color:#8a7254;font-size:12px;line-height:1.5}
.v42-toggle{
    flex:0 0 auto;
    min-width:92px;
    padding:9px 12px;
    border:2px solid #79501d;
    border-radius:999px;
    background:#ede0bd;
    color:#604017;
    font:700 13px inherit;
    cursor:pointer;
    transition:.18s transform,.18s background,.18s box-shadow;
}
.v42-toggle:hover{transform:translateY(-2px);box-shadow:0 4px 9px rgba(70,39,8,.16)}
.v42-toggle.active{background:linear-gradient(135deg,#8c5d22,#5f390e);color:#fff5d5;box-shadow:0 0 12px rgba(159,102,34,.34)}
.v42-volume-wrap{display:grid;grid-template-columns:minmax(160px,1fr) auto;align-items:center;gap:12px;min-width:min(360px,50vw)}
.v42-volume{width:100%;accent-color:#85551d;cursor:pointer}
.v42-volume-value{min-width:48px;text-align:right;color:#5f390e;font-weight:bold}
.v42-ambience-status{margin-top:12px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.52);color:#6c4d2d;font-size:12px;line-height:1.65}
.v42-ambience-status b{color:#55300c}

/* =========================================================
   VER.4.2 FLOATING AMBIENCE BUTTON
========================================================= */
.v42-ambient-floating{
    position:fixed;
    right:76px;
    bottom:48px;
    z-index:2147482000;
    display:grid;
    place-items:center;
    width:46px;
    height:46px;
    border:2px solid #79501d;
    border-radius:50%;
    background:linear-gradient(145deg,#fff4cf,#d6aa68);
    color:#5c350d;
    font-size:20px;
    cursor:pointer;
    box-shadow:0 5px 14px rgba(55,29,4,.26),inset 0 0 9px rgba(255,255,255,.7);
    transition:.18s transform,.18s opacity,.18s box-shadow;
}
.v42-ambient-floating:hover{transform:translateY(-3px);box-shadow:0 8px 17px rgba(55,29,4,.3),0 0 12px rgba(222,174,93,.45)}
.v42-ambient-floating.muted{opacity:.58;filter:grayscale(.45)}
.v42-ambient-floating::after{
    content:attr(data-label);
    position:absolute;
    right:52px;
    padding:6px 9px;
    border-radius:8px;
    background:rgba(47,28,8,.9);
    color:#fff5d8;
    font-size:10px;
    letter-spacing:1px;
    white-space:nowrap;
    opacity:0;
    transform:translateX(6px);
    pointer-events:none;
    transition:.18s;
}
.v42-ambient-floating:hover::after{opacity:1;transform:none}
.v42-ambient-pulse{animation:v42AmbientPulse .7s ease}
@keyframes v42AmbientPulse{0%,100%{transform:none}45%{transform:scale(1.13);box-shadow:0 0 24px rgba(222,174,93,.75)}}

@media(max-width:700px){
    .v42-control-row{align-items:flex-start;flex-direction:column}
    .v42-volume-wrap{min-width:0;width:100%}
    .v42-ambient-floating{right:64px;bottom:14px;width:42px;height:42px}
}
`;
        document.head.appendChild(style);
    }

    function getCurrentPageName() {
        if (document.querySelector(".v41-dashboard")) return "HOME";
        if (typeof currentPageName !== "undefined" && currentPageName && currentPageName !== "RECORD") {
            return currentPageName;
        }
        return document.getElementById("locationPage")?.textContent?.trim() || "HOME";
    }

    function inkTargets(content) {
        const directChildren = Array.from(content.children).filter(element =>
            !element.matches("script,style,#v42OptionCard,.v42-ink-cloud")
        );

        const candidates = [];
        directChildren.forEach(element => {
            candidates.push(element);
            if (element.classList.contains("v41-page-header")) return;

            const inner = Array.from(element.querySelectorAll(":scope > .item-card, :scope > .record-card, :scope > article, :scope > section, :scope > div"));
            inner.slice(0, 5).forEach(child => candidates.push(child));
        });

        return [...new Set(candidates)].filter(element => {
            if (!(element instanceof HTMLElement)) return false;
            if (element.offsetParent === null && !element.classList.contains("v41-page-header")) return false;
            return !element.closest(".v42-option-card");
        }).slice(0, 14);
    }

    function clearInkClasses(root = document) {
        root.querySelectorAll?.(".v42-ink-target").forEach(element => {
            element.classList.remove("v42-ink-target", "v42-ink-ready", "v42-ink-play");
            element.style.removeProperty("--v42-ink-delay");
        });
    }

    function playInkReveal(force = false) {
        const content = document.getElementById("content");
        if (!content) return;

        const pageName = getCurrentPageName();
        const firstNode = content.firstElementChild;
        if (!force && firstNode === lastAnimatedFirstNode && pageName === lastAnimatedPage) return;

        lastAnimatedFirstNode = firstNode;
        lastAnimatedPage = pageName;
        clearInkClasses(content);

        if (!inkEnabled || document.body.classList.contains("v41-motion-none")) return;

        const targets = inkTargets(content);
        targets.forEach((element, index) => {
            element.classList.add("v42-ink-target", "v42-ink-ready");
            element.style.setProperty("--v42-ink-delay", `${Math.min(index * 65, 520)}ms`);
        });

        content.querySelectorAll(":scope > .v42-ink-cloud").forEach(element => element.remove());
        const cloud = document.createElement("div");
        cloud.className = "v42-ink-cloud";
        cloud.setAttribute("aria-hidden", "true");
        content.appendChild(cloud);
        window.setTimeout(() => cloud.remove(), document.body.classList.contains("v41-motion-short") ? 650 : 1500);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            targets.forEach(element => element.classList.add("v42-ink-play"));
        }));
    }

    function setInkEnabled(enabled) {
        inkEnabled = Boolean(enabled);
        saveSetting(INK_STORAGE_KEY, inkEnabled);
        document.body.classList.toggle("v42-ink-disabled", !inkEnabled);
        updateOptionUi();
        if (inkEnabled) playInkReveal(true);
        else clearInkClasses(document);
        if (typeof playUiSound === "function") playUiSound("click");
    }

    function getAudioContext() {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            audioContext = new AudioContextClass();
            ambienceMaster = audioContext.createGain();
            ambienceMaster.gain.value = 0.0001;
            ambienceMaster.connect(audioContext.destination);
        }
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
        return audioContext;
    }

    function createBrownNoiseBuffer(ctx) {
        const length = Math.floor(ctx.sampleRate * 2.4);
        const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < length; i += 1) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.02 * white) / 1.02;
            data[i] = last * 3.2;
        }
        return buffer;
    }

    function registerNode(node) {
        ambienceNodes.push(node);
        return node;
    }

    function stopAmbience(fadeSeconds = 0.45) {
        if (accentTimer) {
            clearTimeout(accentTimer);
            accentTimer = null;
        }
        if (!audioContext || !ambienceMaster) {
            ambienceNodes = [];
            currentPresetKey = "";
            return;
        }

        const now = audioContext.currentTime;
        ambienceMaster.gain.cancelScheduledValues(now);
        ambienceMaster.gain.setValueAtTime(Math.max(ambienceMaster.gain.value, 0.0001), now);
        ambienceMaster.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds);

        const nodesToStop = ambienceNodes.slice();
        ambienceNodes = [];
        window.setTimeout(() => {
            nodesToStop.forEach(node => {
                try { node.stop?.(); } catch (error) {}
                try { node.disconnect?.(); } catch (error) {}
            });
        }, Math.ceil((fadeSeconds + 0.15) * 1000));
        currentPresetKey = "";
    }

    function startAmbience(presetKey) {
        const preset = ambiencePresets[presetKey] || ambiencePresets.study;
        const ctx = getAudioContext();
        if (!ctx || !ambienceMaster) return;

        stopAmbience(0.22);
        currentPresetKey = presetKey;

        const now = ctx.currentTime + 0.26;
        const source = registerNode(ctx.createBufferSource());
        source.buffer = createBrownNoiseBuffer(ctx);
        source.loop = true;

        const filter = registerNode(ctx.createBiquadFilter());
        filter.type = preset.noiseType;
        filter.frequency.setValueAtTime(preset.noiseFrequency, now);
        filter.Q.value = preset.noiseType === "bandpass" ? 0.55 : 0.25;

        const noiseGain = registerNode(ctx.createGain());
        noiseGain.gain.setValueAtTime(preset.noiseGain, now);

        source.connect(filter).connect(noiseGain).connect(ambienceMaster);
        source.start(now);

        const hum = registerNode(ctx.createOscillator());
        hum.type = presetKey === "game" ? "triangle" : "sine";
        hum.frequency.setValueAtTime(preset.humFrequency, now);

        const humGain = registerNode(ctx.createGain());
        humGain.gain.setValueAtTime(preset.humGain, now);
        hum.connect(humGain).connect(ambienceMaster);
        hum.start(now);

        const target = Math.max(0.0001, ambientVolume * 0.34);
        ambienceMaster.gain.cancelScheduledValues(now);
        ambienceMaster.gain.setValueAtTime(0.0001, now);
        ambienceMaster.gain.exponentialRampToValueAtTime(target, now + 0.65);

        scheduleAccent(presetKey);
        updateOptionUi();
        updateFloatingButton();
    }

    function scheduleAccent(presetKey) {
        if (accentTimer) clearTimeout(accentTimer);
        if (!ambientEnabled || !userHasInteracted || presetKey !== currentPresetKey) return;

        const preset = ambiencePresets[presetKey] || ambiencePresets.study;
        const wait = (preset.accentMin + Math.random() * (preset.accentMax - preset.accentMin)) * 1000;
        accentTimer = window.setTimeout(() => {
            playAccent(preset.accent);
            scheduleAccent(presetKey);
        }, wait);
    }

    function connectAccent(node, gain) {
        if (!ambienceMaster) return;
        node.connect(gain).connect(ambienceMaster);
    }

    function playTone(frequency, duration, gainValue, type = "sine", delay = 0, glideTo = null) {
        if (!audioContext || !ambienceMaster) return;
        const ctx = audioContext;
        const start = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, start);
        if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(gainValue, start + Math.min(0.05, duration * 0.2));
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        connectAccent(osc, gain);
        osc.start(start);
        osc.stop(start + duration + 0.03);
    }

    function playNoiseBurst(duration, gainValue, frequency, type = "bandpass") {
        if (!audioContext || !ambienceMaster) return;
        const ctx = audioContext;
        const source = ctx.createBufferSource();
        source.buffer = createBrownNoiseBuffer(ctx);
        const filter = ctx.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = frequency;
        filter.Q.value = 0.8;
        const gain = ctx.createGain();
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        source.connect(filter).connect(gain).connect(ambienceMaster);
        source.start(now);
        source.stop(now + duration + 0.02);
    }

    function playAccent(type) {
        if (!ambientEnabled || !userHasInteracted) return;
        if (typeof soundEnabled !== "undefined" && !soundEnabled) return;

        if (type === "paper") {
            playNoiseBurst(0.24, 0.055, 1550, "bandpass");
            window.setTimeout(() => playNoiseBurst(0.15, 0.033, 1120, "highpass"), 115);
        } else if (type === "chime") {
            const root = [523.25, 587.33, 659.25, 783.99][Math.floor(Math.random() * 4)];
            playTone(root, 1.15, 0.032, "sine");
            playTone(root * 1.5, 0.92, 0.018, "sine", 0.12);
        } else if (type === "bleep") {
            const base = [220, 247, 294, 330][Math.floor(Math.random() * 4)];
            playTone(base, 0.12, 0.032, "square");
            playTone(base * 1.5, 0.09, 0.020, "square", 0.13);
        } else if (type === "pluck") {
            const note = [196, 220, 246.94, 293.66][Math.floor(Math.random() * 4)];
            playTone(note, 0.58, 0.040, "triangle", 0, note * 0.985);
            playTone(note * 2, 0.34, 0.016, "sine", 0.03);
        } else if (type === "thud") {
            playTone(74, 0.28, 0.050, "sine", 0, 42);
            playNoiseBurst(0.14, 0.025, 260, "lowpass");
        } else if (type === "shimmer") {
            const base = [392, 440, 523.25][Math.floor(Math.random() * 3)];
            playTone(base, 0.74, 0.024, "sine");
            playTone(base * 1.26, 0.61, 0.016, "sine", 0.08);
            playTone(base * 1.5, 0.52, 0.012, "triangle", 0.16);
        }
    }

    function canPlayAmbient() {
        if (!ambientEnabled || !userHasInteracted) return false;
        if (typeof soundEnabled !== "undefined" && !soundEnabled) return false;
        return true;
    }

    function updateAmbienceForPage(force = false) {
        const pageName = getCurrentPageName();
        currentPage = pageName;
        const presetKey = pageAmbience[pageName] || "library";

        if (!canPlayAmbient()) {
            stopAmbience(0.2);
            updateOptionUi();
            updateFloatingButton();
            return;
        }

        if (!force && presetKey === currentPresetKey) {
            updateOptionUi();
            return;
        }
        startAmbience(presetKey);
    }

    function setAmbientEnabled(enabled) {
        ambientEnabled = Boolean(enabled);
        saveSetting(AMBIENT_STORAGE_KEY, ambientEnabled);
        if (ambientEnabled) {
            userHasInteracted = true;
            updateAmbienceForPage(true);
            if (typeof playUiSound === "function") playUiSound("success");
        } else {
            stopAmbience(0.32);
            if (typeof playUiSound === "function") playUiSound("click");
        }
        updateOptionUi();
        updateFloatingButton();
    }

    function setAmbientVolume(value) {
        ambientVolume = Math.min(1, Math.max(0, Number(value) || 0));
        saveSetting(AMBIENT_VOLUME_STORAGE_KEY, ambientVolume.toFixed(2));
        if (audioContext && ambienceMaster && currentPresetKey) {
            const now = audioContext.currentTime;
            const target = Math.max(0.0001, ambientVolume * 0.34);
            ambienceMaster.gain.cancelScheduledValues(now);
            ambienceMaster.gain.setTargetAtTime(target, now, 0.08);
        }
        updateOptionUi();
    }

    function optionCardHtml() {
        return `
<div id="v42OptionCard" class="v42-option-card">
    <h4>🖋 RECORD INK &amp; PAGE AMBIENCE</h4>
    <p>ページを開いたときのインク演出と、ページごとに変わる環境音を設定します。</p>

    <div class="v42-control-row">
        <div class="v42-control-label">
            <b>記録のインク演出</b>
            <small>文字やカードが、紙へインクが染み込むように表示されます。</small>
        </div>
        <button class="v42-toggle" data-v42-ink-toggle type="button">ON</button>
    </div>

    <div class="v42-control-row">
        <div class="v42-control-label">
            <b>ページ環境音</b>
            <small>古書庫、ゲーム端末室、音楽室など、ページに合わせて音が切り替わります。</small>
        </div>
        <button class="v42-toggle" data-v42-ambient-toggle type="button">ON</button>
    </div>

    <div class="v42-control-row">
        <div class="v42-control-label">
            <b>環境音の音量</b>
            <small>効果音やBGMとは別に調整されます。</small>
        </div>
        <div class="v42-volume-wrap">
            <input class="v42-volume" data-v42-ambient-volume type="range" min="0" max="100" step="1" value="24" aria-label="環境音の音量">
            <span class="v42-volume-value" data-v42-volume-value>24%</span>
        </div>
    </div>

    <div class="v42-ambience-status" data-v42-ambience-status>
        現在の環境音：<b>静かな書斎</b><br>
        ブラウザの仕様により、最初のクリック後から再生されます。
    </div>
</div>`;
    }

    function injectOptionCard() {
        const shell = document.querySelector(".v41-option-shell");
        if (!shell || document.getElementById("v42OptionCard")) return;
        shell.insertAdjacentHTML("beforeend", optionCardHtml());
        updateOptionUi();
    }

    function updateOptionUi() {
        document.body.classList.toggle("v42-ink-disabled", !inkEnabled);

        document.querySelectorAll("[data-v42-ink-toggle]").forEach(button => {
            button.classList.toggle("active", inkEnabled);
            button.textContent = inkEnabled ? "ON" : "OFF";
            button.setAttribute("aria-pressed", String(inkEnabled));
        });
        document.querySelectorAll("[data-v42-ambient-toggle]").forEach(button => {
            const active = ambientEnabled;
            button.classList.toggle("active", active);
            button.textContent = active ? "ON" : "OFF";
            button.setAttribute("aria-pressed", String(active));
        });
        document.querySelectorAll("[data-v42-ambient-volume]").forEach(input => {
            input.value = String(Math.round(ambientVolume * 100));
            input.disabled = !ambientEnabled;
        });
        document.querySelectorAll("[data-v42-volume-value]").forEach(element => {
            element.textContent = `${Math.round(ambientVolume * 100)}%`;
        });

        const presetKey = pageAmbience[currentPage || getCurrentPageName()] || "library";
        const preset = ambiencePresets[presetKey];
        document.querySelectorAll("[data-v42-ambience-status]").forEach(element => {
            const audioNote = typeof soundEnabled !== "undefined" && !soundEnabled
                ? "全体の効果音がOFFのため、環境音も停止しています。"
                : (ambientEnabled
                    ? (userHasInteracted ? "ページ移動時に自動で切り替わります。" : "最初のクリック後から再生されます。")
                    : "環境音はOFFになっています。");
            element.innerHTML = `現在の環境音：<b>${preset.label}</b><br>${audioNote}`;
        });

        const dashStatus = document.getElementById("v42DashAmbientStatus");
        if (dashStatus) dashStatus.textContent = ambientEnabled ? preset.label : "OFF";
    }

    function createFloatingButton() {
        if (document.getElementById(FLOATING_BUTTON_ID)) return;
        const button = document.createElement("button");
        button.id = FLOATING_BUTTON_ID;
        button.className = "v42-ambient-floating";
        button.type = "button";
        button.setAttribute("aria-label", "ページ環境音を切り替える");
        button.addEventListener("click", () => setAmbientEnabled(!ambientEnabled));
        document.body.appendChild(button);
        updateFloatingButton();
    }

    function updateFloatingButton() {
        const button = document.getElementById(FLOATING_BUTTON_ID);
        if (!button) return;
        const presetKey = pageAmbience[currentPage || getCurrentPageName()] || "library";
        const label = ambiencePresets[presetKey]?.label || "環境音";
        button.textContent = ambientEnabled ? "♬" : "♩";
        button.classList.toggle("muted", !ambientEnabled);
        button.dataset.label = ambientEnabled ? `${label}：ON` : "環境音：OFF";
        button.setAttribute("aria-pressed", String(ambientEnabled));
        button.title = ambientEnabled ? `環境音「${label}」をOFFにする` : "ページ環境音をONにする";
    }

    function patchDashboard() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard) return;

        const versionBadge = dashboard.querySelector(".v41-dashboard-panel-title span");
        const statusHeadings = Array.from(dashboard.querySelectorAll(".v41-dashboard-panel-title h5"));
        const systemHeading = statusHeadings.find(element => element.textContent.trim() === "SYSTEM STATUS");
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const systemVersion = systemPanel?.querySelector(".v41-dashboard-panel-title span");
        if (systemVersion) systemVersion.textContent = "VER.4.2";
        else if (versionBadge) versionBadge.textContent = "VER.4.2";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) latest.innerHTML = "<b>NEW UPDATE</b><br>記録のインク演出と、ページごとに切り替わる環境音を追加しました。";

        const list = systemPanel?.querySelector(".v41-system-list");
        if (list && !document.getElementById("v42DashAmbientRow")) {
            const row = document.createElement("div");
            row.id = "v42DashAmbientRow";
            row.className = "v41-system-row";
            row.innerHTML = '<span>ページ環境音</span><b id="v42DashAmbientStatus">---</b>';
            list.appendChild(row);
        }
        updateOptionUi();
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card v42-new-record" data-new-record="true">
    <div class="item-title">📜 Ver.4.2</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>🖋 記録のインク演出を実装</b><br>
        ・ページを開いた際に、文字やカードが紙へ染み込むように表示<br>
        ・標準、短縮、なしのアニメーション設定に連動<br>
        ・OPTIONから個別にON / OFFを切替可能<br><br>
        <b>♬ ページごとの環境音を実装</b><br>
        ・古書庫、ゲーム端末室、音楽室、冒険の鼓動などをページごとに自動切替<br>
        ・環境音のON / OFFと音量調整に対応<br>
        ・追加の音声ファイルを使わず、ブラウザ内で環境音を生成
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function enhancePage() {
        enhanceTimer = null;
        currentPage = getCurrentPageName();
        injectOptionCard();
        patchDashboard();
        updateOptionUi();
        updateFloatingButton();
        playInkReveal();
        updateAmbienceForPage();
    }

    function scheduleEnhance(delay = 105) {
        if (enhanceTimer) clearTimeout(enhanceTimer);
        enhanceTimer = window.setTimeout(enhancePage, delay);
    }

    function watchContent() {
        const content = document.getElementById("content");
        if (!content || contentObserver) return;
        contentObserver = new MutationObserver(mutations => {
            if (mutations.some(mutation => mutation.type === "childList" && mutation.addedNodes.length)) {
                scheduleEnhance();
            }
        });
        contentObserver.observe(content, { childList: true, subtree: false });
    }

    function bindActions() {
        document.addEventListener("click", event => {
            userHasInteracted = true;
            const target = event.target;
            if (!(target instanceof Element)) return;

            const inkButton = target.closest("[data-v42-ink-toggle]");
            if (inkButton) {
                setInkEnabled(!inkEnabled);
                return;
            }

            const ambientButton = target.closest("[data-v42-ambient-toggle]");
            if (ambientButton) {
                setAmbientEnabled(!ambientEnabled);
                return;
            }

            if (ambientEnabled && !currentPresetKey) {
                window.setTimeout(() => updateAmbienceForPage(true), 70);
            }
        }, true);

        document.addEventListener("input", event => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            if (target.matches("[data-v42-ambient-volume]")) setAmbientVolume(Number(target.value) / 100);
        });

        document.addEventListener("keydown", event => {
            if (!userHasInteracted) {
                userHasInteracted = true;
                if (ambientEnabled) updateAmbienceForPage(true);
            }
        }, { once: true, capture: true });

        const soundToggle = document.getElementById("soundToggle");
        soundToggle?.addEventListener("click", () => {
            window.setTimeout(() => updateAmbienceForPage(true), 30);
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) stopAmbience(0.18);
            else if (canPlayAmbient()) updateAmbienceForPage(true);
        });
    }

    function boot() {
        injectStyles();
        addUpdateLog();
        createFloatingButton();
        bindActions();
        watchContent();
        document.body.classList.toggle("v42-ink-disabled", !inkEnabled);
        scheduleEnhance(25);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
