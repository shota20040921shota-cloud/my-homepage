/*
 * THE RECORD OF AONO SHOTA - Ver.4.11
 * UPDATE LOG definitive position fix
 *
 * ・UPDATE LOGを必ず先頭から表示
 * ・以前のページのスクロール位置を引き継がない
 * ・ブラウザのscroll anchoringを無効化
 * ・ページヘッダー後の大きな空白を圧縮
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV411UpdateLogFixStyles";
    const UPDATE_MARKER = "VER.4.11 UPDATE LOG DEFINITIVE FIX";
    let observer = null;
    let timers = [];

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.11 / UPDATE LOG DEFINITIVE FIX
========================================================= */
body.v411-update-log-page .window.record,
body.v411-update-log-page #content,
body.v411-update-log-page #content *{
    overflow-anchor:none!important;
}

body.v411-update-log-page .right,
body.v411-update-log-page .right > .window.record,
body.v411-update-log-page #content{
    align-content:start!important;
    align-items:stretch!important;
    justify-content:flex-start!important;
}

body.v411-update-log-page .right > .window.record{
    padding-top:14px!important;
}

body.v411-update-log-page #content{
    display:block!important;
    min-height:0!important;
    height:auto!important;
    margin:0!important;
    padding-top:0!important;
}

body.v411-update-log-page #content > .v41-page-header{
    margin:0 0 12px!important;
    padding-top:0!important;
    padding-bottom:14px!important;
}

body.v411-update-log-page #content .record-section{
    display:flex!important;
    flex-direction:column!important;
    justify-content:flex-start!important;
    align-items:stretch!important;
    gap:12px!important;
    min-height:0!important;
    height:auto!important;
    margin:0!important;
    padding:0!important;
    transform:none!important;
}

body.v411-update-log-page #content .record-section > .item-card{
    flex:none!important;
}

body.v411-update-log-page #content .record-section > .item-card:first-child{
    margin-top:0!important;
}

body.v411-update-log-page #content.v40-content-update .item-card{
    opacity:1!important;
    visibility:visible!important;
    transform:none!important;
    animation:v411UpdateCardReveal .18s ease both!important;
    animation-delay:calc(min(var(--i,0),3) * 20ms)!important;
}

@keyframes v411UpdateCardReveal{
    from{opacity:0;transform:translateY(4px)}
    to{opacity:1;transform:none}
}

body.v41-motion-none.v411-update-log-page
#content.v40-content-update .item-card{
    animation:none!important;
}

@media(prefers-reduced-motion:reduce){
    body.v411-update-log-page
    #content.v40-content-update .item-card{
        animation:none!important;
    }
}
`;
        document.head.appendChild(style);
    }

    function currentPageName() {
        if (document.querySelector(".v41-dashboard")) return "HOME";

        if (
            typeof currentPageName !== "undefined" &&
            currentPageName &&
            currentPageName !== "RECORD"
        ) {
            return String(currentPageName).trim().toUpperCase();
        }

        const selected = document.querySelector(
            '.menu-item.selected[data-page]'
        );

        return (
            selected?.dataset.page ||
            document.getElementById("locationPage")?.textContent ||
            ""
        ).trim().toUpperCase();
    }

    function clearResetTimers() {
        timers.forEach(window.clearTimeout);
        timers = [];
    }

    function forceTop() {
        const recordWindow = document.querySelector(
            ".right > .window.record, .window.record"
        );
        const content = document.getElementById("content");

        if (recordWindow) {
            recordWindow.scrollTop = 0;

            if (typeof recordWindow.scrollTo === "function") {
                recordWindow.scrollTo(0, 0);
            }
        }

        if (content) {
            content.scrollTop = 0;
        }
    }

    function normalizeLayout() {
        const content = document.getElementById("content");
        const section = content?.querySelector(".record-section");

        if (!content || !section) return;

        section.style.margin = "0";
        section.style.padding = "0";
        section.style.minHeight = "0";
        section.style.height = "auto";

        const firstCard = section.querySelector(
            ":scope > .item-card"
        );

        if (firstCard) {
            firstCard.style.marginTop = "0";
        }
    }

    function activateFix() {
        const active = currentPageName() === "UPDATE LOG";
        document.body.classList.toggle(
            "v411-update-log-page",
            active
        );

        if (!active) return;

        normalizeLayout();
        clearResetTimers();
        forceTop();

        requestAnimationFrame(() => {
            normalizeLayout();
            forceTop();

            requestAnimationFrame(forceTop);
        });

        [30, 90, 180, 360].forEach(delay => {
            timers.push(
                window.setTimeout(() => {
                    normalizeLayout();
                    forceTop();
                }, delay)
            );
        });
    }

    function addUpdateLogEntry() {
        try {
            if (
                typeof records === "undefined" ||
                !records["UPDATE LOG"] ||
                records["UPDATE LOG"].includes(UPDATE_MARKER)
            ) {
                return;
            }

            const card = `
<div class="item-card">
    <div class="item-title">
        Ver.4.11 / UPDATE LOG POSITION FIX
    </div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>UPDATE LOGの開始位置を根本修正</b><br>
        ・前ページのスクロール位置を引き継がないよう変更<br>
        ・UPDATE LOGを必ず先頭から表示<br>
        ・scroll anchoringを無効化<br>
        ・ヘッダー下の不要な空白を圧縮
    </div>
</div>`;

            records["UPDATE LOG"] =
                records["UPDATE LOG"].replace(
                    '<div class="record-section">',
                    '<div class="record-section">' + card
                );
        } catch (error) {}
    }

    function bind() {
        document.addEventListener(
            "click",
            event => {
                const target = event.target;
                if (!(target instanceof Element)) return;

                const updateLink =
                    target.closest(
                        '.menu-item[data-page="UPDATE LOG"]'
                    ) ||
                    target.closest(
                        '[data-v41-open-page="UPDATE LOG"]'
                    ) ||
                    target.closest(
                        '[data-v44-dashboard-page="UPDATE LOG"]'
                    );

                if (!updateLink) return;

                document.body.classList.add(
                    "v411-update-log-page"
                );
                forceTop();

                window.setTimeout(activateFix, 0);
                window.setTimeout(activateFix, 80);
            },
            true
        );

        const content = document.getElementById("content");
        if (!content || observer) return;

        observer = new MutationObserver(mutations => {
            const contentReplaced = mutations.some(
                mutation =>
                    mutation.type === "childList" &&
                    mutation.target === content
            );

            if (contentReplaced) {
                window.setTimeout(activateFix, 0);
            }
        });

        observer.observe(content, {
            childList:true,
            subtree:false
        });
    }

    function init() {
        injectStyles();
        addUpdateLogEntry();
        bind();
        activateFix();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once:true }
        );
    } else {
        init();
    }
})();
