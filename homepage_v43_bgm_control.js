/*
 * THE RECORD OF AONO SHOTA - Ver.4.3
 * ・BGMのON / OFF切替
 * ・BGM音量調整
 *
 * index.html の </body> 直前で、homepage_v42_ink_ambience.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV43BgmStyles";
    const FLOATING_BUTTON_ID = "v43BgmFloatingButton";
    const OPTION_CARD_ID = "v43BgmOptionCard";
    const UPDATE_MARKER = "VER.4.3 BGM CONTROL";

    const BGM_STORAGE_KEY = "aonoV43BgmEnabled";
    const BGM_VOLUME_STORAGE_KEY = "aonoV43BgmVolume";

    let bgmEnabled = readBoolean(BGM_STORAGE_KEY, true);
    let bgmVolume = readNumber(BGM_VOLUME_STORAGE_KEY, 0.20, 0, 1);
    let userHasInteracted = false;
    let enhanceTimer = null;
    let contentObserver = null;

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
            const storedValue = localStorage.getItem(key);
            if (storedValue === null) return fallback;
            const value = Number(storedValue);
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

    function getBgm() {
        return document.getElementById("bgm");
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.3 BGM CONTROL
========================================================= */
.v43-bgm-floating{
    position:fixed;
    right:130px;
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
    transition:.18s transform,.18s opacity,.18s box-shadow,.18s filter;
}
.v43-bgm-floating:hover{
    transform:translateY(-3px);
    box-shadow:0 8px 17px rgba(55,29,4,.3),0 0 12px rgba(222,174,93,.45);
}
.v43-bgm-floating.muted{opacity:.58;filter:grayscale(.58)}
.v43-bgm-floating::after{
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
.v43-bgm-floating:hover::after{opacity:1;transform:none}
.v43-bgm-pulse{animation:v43BgmPulse .65s ease}
@keyframes v43BgmPulse{
    0%,100%{transform:none}
    45%{transform:scale(1.13);box-shadow:0 0 24px rgba(222,174,93,.75)}
}
.v43-bgm-option-card{
    padding:18px;
    border:2px solid rgba(111,70,24,.45);
    border-radius:15px;
    background:rgba(255,249,226,.75);
    box-shadow:inset 0 0 13px rgba(255,255,255,.74),0 5px 12px rgba(58,31,7,.13);
}
.v43-bgm-option-card h4{margin:0 0 7px;color:#5c350d;font-size:20px;letter-spacing:2px}
.v43-bgm-option-card>p{margin:0 0 14px;color:#765d40;font-size:14px;line-height:1.7}
.v43-bgm-control-row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:14px;
    padding:12px 0;
    border-top:1px dashed rgba(112,70,25,.28);
}
.v43-bgm-control-row:first-of-type{border-top:0;padding-top:0}
.v43-bgm-control-label{min-width:0}
.v43-bgm-control-label b{display:block;color:#5e370f;font-size:15px;letter-spacing:1px}
.v43-bgm-control-label small{display:block;margin-top:3px;color:#8a7254;font-size:12px;line-height:1.5}
.v43-bgm-toggle{
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
.v43-bgm-toggle:hover{transform:translateY(-2px);box-shadow:0 4px 9px rgba(70,39,8,.16)}
.v43-bgm-toggle.active{
    background:linear-gradient(135deg,#8c5d22,#5f390e);
    color:#fff5d5;
    box-shadow:0 0 12px rgba(159,102,34,.34);
}
.v43-bgm-volume-wrap{
    display:grid;
    grid-template-columns:minmax(160px,1fr) auto;
    align-items:center;
    gap:12px;
    min-width:min(360px,50vw);
}
.v43-bgm-volume{width:100%;accent-color:#85551d;cursor:pointer}
.v43-bgm-volume-value{min-width:48px;text-align:right;color:#5f390e;font-weight:bold}
.v43-bgm-status{
    margin-top:12px;
    padding:10px 12px;
    border-radius:10px;
    background:rgba(255,255,255,.52);
    color:#6c4d2d;
    font-size:12px;
    line-height:1.65;
}
.v43-bgm-status b{color:#55300c}
@media(max-width:700px){
    .v43-bgm-control-row{align-items:flex-start;flex-direction:column}
    .v43-bgm-volume-wrap{min-width:0;width:100%}
    .v43-bgm-floating{right:116px;bottom:14px;width:42px;height:42px}
}
`;
        document.head.appendChild(style);
    }

    function optionCardHtml() {
        return `
<div id="${OPTION_CARD_ID}" class="v43-bgm-option-card">
    <h4>🎵 BACKGROUND MUSIC</h4>
    <p>サイト全体で流れるBGMを設定します。効果音とページ環境音とは別に切り替えられます。</p>

    <div class="v43-bgm-control-row">
        <div class="v43-bgm-control-label">
            <b>BGM</b>
            <small>OFFにすると、現在流れているBGMをすぐに停止します。</small>
        </div>
        <button class="v43-bgm-toggle" data-v43-bgm-toggle type="button">ON</button>
    </div>

    <div class="v43-bgm-control-row">
        <div class="v43-bgm-control-label">
            <b>BGMの音量</b>
            <small>設定はこのブラウザに保存され、次回も引き継がれます。</small>
        </div>
        <div class="v43-bgm-volume-wrap">
            <input class="v43-bgm-volume" data-v43-bgm-volume type="range" min="0" max="100" step="1" value="20" aria-label="BGMの音量">
            <span class="v43-bgm-volume-value" data-v43-bgm-volume-value>20%</span>
        </div>
    </div>

    <div class="v43-bgm-status" data-v43-bgm-status>
        現在：<b>ON</b><br>
        ブラウザの仕様により、最初のクリック後から再生されます。
    </div>
</div>`;
    }

    function injectOptionCard() {
        const shell = document.querySelector(".v41-option-shell");
        if (!shell || document.getElementById(OPTION_CARD_ID)) return;
        shell.insertAdjacentHTML("beforeend", optionCardHtml());
        updateUi();
    }

    function createFloatingButton() {
        if (document.getElementById(FLOATING_BUTTON_ID)) return;

        const button = document.createElement("button");
        button.id = FLOATING_BUTTON_ID;
        button.className = "v43-bgm-floating";
        button.type = "button";
        button.setAttribute("aria-label", "BGMを切り替える");
        button.addEventListener("click", () => setBgmEnabled(!bgmEnabled));
        document.body.appendChild(button);
    }

    function setBgmEnabled(enabled) {
        bgmEnabled = Boolean(enabled);
        saveSetting(BGM_STORAGE_KEY, bgmEnabled);
        applyBgmState(true);
        pulseButton();
    }

    function setBgmVolume(value) {
        bgmVolume = Math.min(1, Math.max(0, Number(value) || 0));
        saveSetting(BGM_VOLUME_STORAGE_KEY, bgmVolume.toFixed(2));
        const bgm = getBgm();
        if (bgm) bgm.volume = bgmVolume;
        updateUi();
    }

    function applyBgmState(attemptPlay = false) {
        const bgm = getBgm();
        if (!bgm) {
            updateUi();
            return;
        }

        bgm.volume = bgmVolume;

        if (!bgmEnabled) {
            bgm.pause();
        } else if (attemptPlay && userHasInteracted) {
            bgm.play().catch(() => {
                // 自動再生が拒否された場合は、次のユーザー操作時に再試行する。
            });
        }

        updateUi();
    }

    function updateUi() {
        const bgm = getBgm();
        const isPlaying = Boolean(bgm && !bgm.paused && !bgm.ended);

        document.querySelectorAll("[data-v43-bgm-toggle]").forEach(button => {
            button.classList.toggle("active", bgmEnabled);
            button.textContent = bgmEnabled ? "ON" : "OFF";
            button.setAttribute("aria-pressed", String(bgmEnabled));
        });

        document.querySelectorAll("[data-v43-bgm-volume]").forEach(input => {
            input.value = String(Math.round(bgmVolume * 100));
            input.disabled = !bgmEnabled;
        });

        document.querySelectorAll("[data-v43-bgm-volume-value]").forEach(element => {
            element.textContent = `${Math.round(bgmVolume * 100)}%`;
        });

        document.querySelectorAll("[data-v43-bgm-status]").forEach(element => {
            let note;
            if (!bgmEnabled) {
                note = "BGMは停止しています。";
            } else if (isPlaying) {
                note = "BGMを再生中です。";
            } else if (!userHasInteracted) {
                note = "最初のクリック後から再生されます。";
            } else {
                note = "再生待機中です。もう一度画面をクリックすると再生されます。";
            }
            element.innerHTML = `現在：<b>${bgmEnabled ? "ON" : "OFF"}</b><br>${note}`;
        });

        const button = document.getElementById(FLOATING_BUTTON_ID);
        if (button) {
            button.textContent = bgmEnabled ? "🎵" : "⏸";
            button.classList.toggle("muted", !bgmEnabled);
            button.dataset.label = bgmEnabled ? `BGM：ON（${Math.round(bgmVolume * 100)}%）` : "BGM：OFF";
            button.setAttribute("aria-pressed", String(bgmEnabled));
            button.title = bgmEnabled ? "BGMをOFFにする" : "BGMをONにする";
        }

        const dashStatus = document.getElementById("v43DashBgmStatus");
        if (dashStatus) dashStatus.textContent = bgmEnabled ? `${Math.round(bgmVolume * 100)}%` : "OFF";
    }

    function pulseButton() {
        const button = document.getElementById(FLOATING_BUTTON_ID);
        if (!button) return;
        button.classList.remove("v43-bgm-pulse");
        void button.offsetWidth;
        button.classList.add("v43-bgm-pulse");
    }

    function patchDashboard() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard) return;

        const statusHeadings = Array.from(dashboard.querySelectorAll(".v41-dashboard-panel-title h5"));
        const systemHeading = statusHeadings.find(element => element.textContent.trim() === "SYSTEM STATUS");
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const systemVersion = systemPanel?.querySelector(".v41-dashboard-panel-title span");
        if (systemVersion) systemVersion.textContent = "VER.4.3";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) latest.innerHTML = "<b>NEW UPDATE</b><br>BGMのON / OFF切替と音量調整を追加しました。";

        const list = systemPanel?.querySelector(".v41-system-list");
        if (list && !document.getElementById("v43DashBgmRow")) {
            const row = document.createElement("div");
            row.id = "v43DashBgmRow";
            row.className = "v41-system-row";
            row.innerHTML = '<span>BGM</span><b id="v43DashBgmStatus">---</b>';
            list.appendChild(row);
        }

        updateUi();
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card v43-new-record" data-new-record="true">
    <div class="item-title">📜 Ver.4.3</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>🎵 BGMコントロールを実装</b><br>
        ・BGMを効果音やページ環境音とは別にON / OFF可能<br>
        ・右下のBGMボタンから即座に切替可能<br>
        ・OPTIONからBGM音量を調整可能<br>
        ・設定をブラウザへ自動保存
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function enhance() {
        enhanceTimer = null;
        injectOptionCard();
        patchDashboard();
        applyBgmState(false);
    }

    function scheduleEnhance(delay = 80) {
        if (enhanceTimer) clearTimeout(enhanceTimer);
        enhanceTimer = window.setTimeout(enhance, delay);
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

            const toggle = target.closest("[data-v43-bgm-toggle]");
            if (toggle) {
                setBgmEnabled(!bgmEnabled);
                return;
            }

            if (bgmEnabled) {
                window.setTimeout(() => applyBgmState(true), 0);
            } else {
                window.setTimeout(() => applyBgmState(false), 0);
            }
        }, true);

        document.addEventListener("input", event => {
            const target = event.target;
            if (!(target instanceof HTMLInputElement)) return;
            if (target.matches("[data-v43-bgm-volume]")) {
                setBgmVolume(Number(target.value) / 100);
            }
        });

        document.addEventListener("keydown", () => {
            if (userHasInteracted) return;
            userHasInteracted = true;
            if (bgmEnabled) applyBgmState(true);
        }, { once: true, capture: true });

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && bgmEnabled && userHasInteracted) {
                applyBgmState(true);
            }
        });

        const bgm = getBgm();
        bgm?.addEventListener("play", updateUi);
        bgm?.addEventListener("pause", updateUi);
        bgm?.addEventListener("volumechange", updateUi);
    }

    function boot() {
        injectStyles();
        addUpdateLog();
        createFloatingButton();
        bindActions();
        watchContent();
        applyBgmState(false);
        scheduleEnhance(25);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
