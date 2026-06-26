/*
 * THE RECORD OF AONO SHOTA - Ver.4.8
 * UPDATE LOG Layout Fix
 *
 * ・UPDATE LOG上部に発生する大きな空白を除去
 * ・ページを開いた際にスクロール位置を先頭へ戻す
 * ・最初の更新カードをページ上部から表示
 * ・遅延アニメーションによる一時的な空白を防止
 *
 * homepage_v47_navigation_refinement.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV48UpdateLogFixStyles";
    const UPDATE_MARKER = "VER.4.8 UPDATE LOG FIX";
    let scheduled = 0;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.8 / UPDATE LOG TOP-SPACE FIX
========================================================= */
body.v48-update-log-page .right,
body.v48-update-log-page .right > .window.record,
body.v48-update-log-page #content{
    align-content:start!important;
    align-items:stretch!important;
    justify-content:flex-start!important;
}

body.v48-update-log-page .right > .window.record{
    padding-top:18px!important;
}

body.v48-update-log-page #content{
    min-height:0!important;
    padding-top:0!important;
    margin-top:0!important;
}

body.v48-update-log-page #content > .v41-page-header{
    margin-top:0!important;
}

body.v48-update-log-page #content > .record-section,
body.v48-update-log-page #content .record-section{
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

body.v48-update-log-page #content .record-section > .item-card:first-child{
    margin-top:0!important;
}

body.v48-update-log-page #content.v40-content-update .item-card{
    opacity:1!important;
    visibility:visible!important;
    transform:none!important;
    animation:v48UpdateCardReveal .24s ease both!important;
    animation-delay:calc(min(var(--i,0),4) * 35ms)!important;
}

@keyframes v48UpdateCardReveal{
    from{opacity:0;transform:translateY(7px)}
    to{opacity:1;transform:none}
}

body.v41-motion-none.v48-update-log-page #content.v40-content-update .item-card{
    animation:none!important;
}

@media(prefers-reduced-motion:reduce){
    body.v48-update-log-page #content.v40-content-update .item-card{
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

        const headerTitle = document.querySelector(".v41-page-header h3");
        if (headerTitle?.textContent?.trim()) {
            return headerTitle.textContent.trim().toUpperCase();
        }

        const selected = document.querySelector(".menu-item.selected");
        return selected?.textContent?.trim().toUpperCase() || "";
    }

    function resetUpdateLogScroll() {
        const record = document.querySelector(".right > .window.record, .record");
        const content = document.getElementById("content");

        if (record) record.scrollTop = 0;
        if (content) content.scrollTop = 0;

        // レイアウト確定後にも再実行し、以前のページのスクロール位置復元を打ち消す
        requestAnimationFrame(() => {
            if (record) record.scrollTop = 0;
            if (content) content.scrollTop = 0;

            requestAnimationFrame(() => {
                if (record) record.scrollTop = 0;
                if (content) content.scrollTop = 0;
            });
        });
    }

    function cleanUpdateLogLayout() {
        const isUpdateLog = currentPageName() === "UPDATE LOG";
        document.body.classList.toggle("v48-update-log-page", isUpdateLog);

        if (!isUpdateLog) return;

        const content = document.getElementById("content");
        const section = content?.querySelector(".record-section");
        if (!content || !section) return;

        // 空のブロック要素が先頭に紛れた場合のみ除去する
        Array.from(section.children).forEach((element, index) => {
            if (index > 2) return;
            const empty =
                !element.textContent.trim() &&
                !element.querySelector("img,video,audio,iframe,canvas,svg,input,button");
            if (empty) element.remove();
        });

        section.style.marginTop = "0";
        section.style.paddingTop = "0";
        section.style.minHeight = "0";

        const firstCard = section.querySelector(":scope > .item-card");
        if (firstCard) firstCard.style.marginTop = "0";

        resetUpdateLogScroll();
    }

    function scheduleFix() {
        window.clearTimeout(scheduled);
        scheduled = window.setTimeout(cleanUpdateLogLayout, 25);
    }

    function patchDashboard() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard) return;

        const headings = Array.from(dashboard.querySelectorAll(".v41-dashboard-panel-title h5"));
        const systemHeading = headings.find(element => element.textContent.trim() === "SYSTEM STATUS");
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const version = systemPanel?.querySelector(".v41-dashboard-panel-title span");

        if (version) version.textContent = "VER.4.8";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) {
            latest.innerHTML =
                "<b>NEW UPDATE</b><br>UPDATE LOG上部の空白とスクロール位置を修正し、更新履歴が最初から表示されるようにしました。";
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card v48-new-record" data-new-record="true">
    <div class="item-title">Ver.4.8 / UPDATE LOG FIX</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>UPDATE LOGの表示位置を修正</b><br>
        ・ページ上部に発生していた大きな空白を除去<br>
        ・UPDATE LOGを開いた際のスクロール位置を先頭へ固定<br>
        ・最初の更新カードをページ上部から表示<br>
        ・カード表示アニメーションの遅延を短縮
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function init() {
        injectStyles();
        addUpdateLog();
        cleanUpdateLogLayout();
        patchDashboard();

        const observer = new MutationObserver(() => {
            scheduleFix();
            window.setTimeout(patchDashboard, 30);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"]
        });

        document.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const menuItem = target.closest(".menu-item");
            const quickButton = target.closest("[data-v41-open-page],[data-v44-dashboard-page]");

            const page =
                menuItem?.textContent?.trim().toUpperCase() ||
                quickButton?.getAttribute("data-v41-open-page")?.toUpperCase() ||
                quickButton?.getAttribute("data-v44-dashboard-page")?.toUpperCase();

            if (page === "UPDATE LOG") {
                window.setTimeout(cleanUpdateLogLayout, 10);
                window.setTimeout(cleanUpdateLogLayout, 100);
            }
        }, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
