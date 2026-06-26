/*
 * THE RECORD OF AONO SHOTA - Ver.4.8.1
 * UPDATE LOG Fix / Loading Loop Hotfix
 *
 * Ver.4.8で発生したMutationObserverの再実行ループを修正。
 * UPDATE LOG上部の空白・スクロール位置修正は維持します。
 *
 * homepage_v47_navigation_refinement.js の後に読み込んでください。
 * 旧 homepage_v48_update_log_fix.js は、このファイルで上書きしてください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV481UpdateLogFixStyles";
    const UPDATE_MARKER = "VER.4.8.1 LOADING LOOP HOTFIX";
    let fixTimer = 0;
    let lastPage = "";

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.8.1 / UPDATE LOG TOP-SPACE FIX
========================================================= */
body.v481-update-log-page .right,
body.v481-update-log-page .right > .window.record,
body.v481-update-log-page #content{
    align-content:start!important;
    align-items:stretch!important;
    justify-content:flex-start!important;
}

body.v481-update-log-page .right > .window.record{
    padding-top:18px!important;
}

body.v481-update-log-page #content{
    min-height:0!important;
    padding-top:0!important;
    margin-top:0!important;
}

body.v481-update-log-page #content > .v41-page-header{
    margin-top:0!important;
}

body.v481-update-log-page #content .record-section{
    display:flex!important;
    flex-direction:column!important;
    justify-content:flex-start!important;
    align-items:stretch!important;
    gap:16px!important;
    min-height:0!important;
    margin-top:0!important;
    padding-top:0!important;
    transform:none!important;
}

body.v481-update-log-page #content .record-section > .item-card:first-child{
    margin-top:0!important;
}

body.v481-update-log-page #content.v40-content-update .item-card{
    opacity:1!important;
    visibility:visible!important;
    transform:none!important;
    animation:v481UpdateCardReveal .22s ease both!important;
    animation-delay:calc(min(var(--i,0),4) * 30ms)!important;
}

@keyframes v481UpdateCardReveal{
    from{opacity:0;transform:translateY(6px)}
    to{opacity:1;transform:none}
}

body.v41-motion-none.v481-update-log-page #content.v40-content-update .item-card{
    animation:none!important;
}

@media(prefers-reduced-motion:reduce){
    body.v481-update-log-page #content.v40-content-update .item-card{
        animation:none!important;
    }
}
`;
        document.head.appendChild(style);
    }

    function currentPageName() {
        if (document.querySelector(".v41-dashboard")) return "HOME";

        const locationPage = document.getElementById("locationPage");
        if (locationPage?.textContent?.trim()) {
            return locationPage.textContent.trim().toUpperCase();
        }

        const selected = document.querySelector(".menu-item.selected");
        return selected?.textContent?.trim().toUpperCase() || "";
    }

    function resetUpdateLogScroll() {
        const record = document.querySelector(".right > .window.record, .record");
        const content = document.getElementById("content");

        if (record) record.scrollTop = 0;
        if (content) content.scrollTop = 0;

        requestAnimationFrame(() => {
            if (record) record.scrollTop = 0;
            if (content) content.scrollTop = 0;
        });
    }

    function applyUpdateLogFix() {
        const page = currentPageName();
        const isUpdateLog = page === "UPDATE LOG";

        document.body.classList.toggle("v481-update-log-page", isUpdateLog);

        if (!isUpdateLog) {
            lastPage = page;
            return;
        }

        const content = document.getElementById("content");
        const section = content?.querySelector(".record-section");
        if (!content || !section) return;

        section.style.marginTop = "0";
        section.style.paddingTop = "0";
        section.style.minHeight = "0";

        const firstCard = section.querySelector(":scope > .item-card");
        if (firstCard) firstCard.style.marginTop = "0";

        if (lastPage !== "UPDATE LOG") {
            resetUpdateLogScroll();
        }

        lastPage = page;
    }

    function scheduleFix() {
        clearTimeout(fixTimer);
        fixTimer = window.setTimeout(applyUpdateLogFix, 30);
    }

    function patchDashboardOnce() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard || dashboard.dataset.v481Patched === "true") return;

        dashboard.dataset.v481Patched = "true";

        const headings = Array.from(
            dashboard.querySelectorAll(".v41-dashboard-panel-title h5")
        );
        const systemHeading = headings.find(
            element => element.textContent.trim() === "SYSTEM STATUS"
        );
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const version = systemPanel?.querySelector(".v41-dashboard-panel-title span");

        if (version) version.textContent = "VER.4.8.1";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) {
            latest.innerHTML =
                "<b>HOTFIX</b><br>UPDATE LOG修正後にページが読み込み続ける問題を解消しました。";
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card v481-new-record" data-new-record="true">
    <div class="item-title">Ver.4.8.1 / LOADING LOOP HOTFIX</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>ページが読み込み続ける問題を修正</b><br>
        ・監視処理が自分自身を再実行し続けるループを停止<br>
        ・UPDATE LOG上部の空白修正は維持<br>
        ・UPDATE LOGを開いた際の先頭表示を維持<br>
        ・不要なDOM再描画を削減
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function bindNavigationChecks() {
        document.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            if (
                target.closest(".menu-item") ||
                target.closest("[data-v41-open-page]") ||
                target.closest("[data-v44-dashboard-page]") ||
                target.closest(".v47-sidebar-heading")
            ) {
                window.setTimeout(() => {
                    applyUpdateLogFix();
                    patchDashboardOnce();
                }, 40);
            }
        }, true);

        // contentの差し替えだけを監視。属性やダッシュボード自身の変更は監視しない。
        const content = document.getElementById("content");
        if (content) {
            const observer = new MutationObserver(() => {
                scheduleFix();
                window.setTimeout(patchDashboardOnce, 40);
            });

            observer.observe(content, {
                childList: true
            });
        }
    }

    function init() {
        injectStyles();
        addUpdateLog();
        applyUpdateLogFix();
        patchDashboardOnce();
        bindNavigationChecks();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
