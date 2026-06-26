/*
 * THE RECORD OF AONO SHOTA - Ver.4.9
 * UPDATE LOG position repair
 *
 * ・UPDATE LOGを開くたびにスクロール位置を先頭へ戻す
 * ・上部の不要な空白を除去
 * ・監視対象を#content直下の差し替えだけに限定
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV49UpdateLogFixStyles";
    let timer = 0;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
body.v49-update-log-page .right,
body.v49-update-log-page .right > .window.record,
body.v49-update-log-page #content{
    align-content:start!important;
    align-items:stretch!important;
    justify-content:flex-start!important;
}
body.v49-update-log-page #content{
    min-height:0!important;
    margin-top:0!important;
    padding-top:0!important;
}
body.v49-update-log-page #content > .v41-page-header{
    margin-top:0!important;
}
body.v49-update-log-page #content .record-section{
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
body.v49-update-log-page #content .record-section > .item-card:first-child{
    margin-top:0!important;
}
body.v49-update-log-page #content.v40-content-update .item-card{
    opacity:1!important;
    visibility:visible!important;
    transform:none!important;
    animation:v49UpdateCardReveal .2s ease both!important;
    animation-delay:calc(min(var(--i,0),4) * 25ms)!important;
}
@keyframes v49UpdateCardReveal{
    from{opacity:0;transform:translateY(5px)}
    to{opacity:1;transform:none}
}
body.v41-motion-none.v49-update-log-page #content.v40-content-update .item-card{
    animation:none!important;
}
@media(prefers-reduced-motion:reduce){
    body.v49-update-log-page #content.v40-content-update .item-card{animation:none!important}
}
`;
        document.head.appendChild(style);
    }

    function pageName() {
        if (document.querySelector(".v41-dashboard")) return "HOME";
        const selected = document.querySelector(".menu-item.selected[data-page]");
        if (selected?.dataset.page) return selected.dataset.page.trim().toUpperCase();
        return (document.getElementById("locationPage")?.textContent?.trim() || "").toUpperCase();
    }

    function resetScroll() {
        const record = document.querySelector(".right > .window.record, .window.record, .record");
        const content = document.getElementById("content");
        if (record) record.scrollTop = 0;
        if (content) content.scrollTop = 0;
        requestAnimationFrame(() => {
            if (record) record.scrollTop = 0;
            if (content) content.scrollTop = 0;
        });
    }

    function applyFix(force = false) {
        const active = force || pageName() === "UPDATE LOG";
        document.body.classList.toggle("v49-update-log-page", active);
        if (!active) return;

        const section = document.querySelector("#content .record-section");
        if (section) {
            section.style.marginTop = "0";
            section.style.paddingTop = "0";
            section.style.minHeight = "0";
            const first = section.querySelector(":scope > .item-card");
            if (first) first.style.marginTop = "0";
        }
        resetScroll();
    }

    function schedule(force = false, delay = 20) {
        clearTimeout(timer);
        timer = window.setTimeout(() => applyFix(force), delay);
    }

    function bind() {
        document.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const item = target.closest('.menu-item[data-page="UPDATE LOG"]');
            const quick = target.closest('[data-v41-open-page="UPDATE LOG"], [data-v44-dashboard-page="UPDATE LOG"]');
            if (item || quick) {
                applyFix(true);
                window.setTimeout(() => applyFix(true), 60);
                window.setTimeout(() => applyFix(true), 320);
            }
        }, true);

        const content = document.getElementById("content");
        if (content) {
            const observer = new MutationObserver(mutations => {
                const replaced = mutations.some(mutation =>
                    mutation.type === "childList" && mutation.target === content
                );
                if (replaced) schedule(false, 15);
            });
            observer.observe(content, { childList:true, subtree:false });
        }
    }

    function init() {
        injectStyles();
        bind();
        applyFix(false);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once:true });
    } else {
        init();
    }
})();
