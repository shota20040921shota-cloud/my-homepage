/*
 * THE RECORD OF AONO SHOTA - Ver.4.12
 * UPDATE LOG definitive top-position fix
 *
 * ・UPDATE LOGを開くと更新カードから表示
 * ・前ページのスクロール位置を引き継がない
 * ・空白を作るヘッダー／現在地表示をUPDATE LOGだけ非表示
 * ・監視対象は#content直下の差し替えだけ（無限ループなし）
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV412UpdateLogFixStyles";
    const UPDATE_MARKER =
        "VER.4.12 UPDATE LOG DEFINITIVE TOP FIX";

    let resetTimers = [];
    let contentObserver = null;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.12 / UPDATE LOG STARTS AT THE TOP
========================================================= */
body.v412-update-log-page .window.record,
body.v412-update-log-page #content,
body.v412-update-log-page #content *{
    overflow-anchor:none!important;
}

body.v412-update-log-page #currentLocation,
body.v412-update-log-page
#content > .v41-page-header{
    display:none!important;
}

body.v412-update-log-page .right > .window.record{
    padding-top:10px!important;
}

body.v412-update-log-page #content{
    display:block!important;
    min-height:0!important;
    height:auto!important;
    margin:0 auto!important;
    padding:0!important;
}

body.v412-update-log-page
#content .record-section{
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

body.v412-update-log-page
#content .record-section > .item-card{
    flex:none!important;
    margin-top:0!important;
}

body.v412-update-log-page
#content.v40-content-update .item-card{
    opacity:1!important;
    visibility:visible!important;
    transform:none!important;
    animation:v412UpdateCardReveal .16s ease both!important;
    animation-delay:calc(min(var(--i,0),3) * 18ms)!important;
}

@keyframes v412UpdateCardReveal{
    from{opacity:0;transform:translateY(3px)}
    to{opacity:1;transform:none}
}

body.v41-motion-none.v412-update-log-page
#content.v40-content-update .item-card{
    animation:none!important;
}

@media(prefers-reduced-motion:reduce){
    body.v412-update-log-page
    #content.v40-content-update .item-card{
        animation:none!important;
    }
}
`;
        document.head.appendChild(style);
    }

    function getActivePageName() {
        const selected = document.querySelector(
            ".menu-item.selected[data-page]"
        );

        if (selected?.dataset.page) {
            return selected.dataset.page.trim().toUpperCase();
        }

        try {
            if (
                typeof currentPageName !== "undefined" &&
                currentPageName
            ) {
                return String(currentPageName)
                    .trim()
                    .toUpperCase();
            }
        } catch (error) {}

        return String(
            document.getElementById("locationPage")
                ?.textContent || ""
        ).trim().toUpperCase();
    }

    function clearTimers() {
        resetTimers.forEach(window.clearTimeout);
        resetTimers = [];
    }

    function positionUpdateLogAtTop() {
        const active =
            getActivePageName() === "UPDATE LOG";

        document.body.classList.toggle(
            "v412-update-log-page",
            active
        );

        if (!active) return;

        const record = document.querySelector(
            ".right > .window.record, .window.record"
        );
        const content = document.getElementById("content");
        const section = content?.querySelector(
            ".record-section"
        );

        if (!record || !content || !section) return;

        section.style.margin = "0";
        section.style.padding = "0";
        section.style.minHeight = "0";
        section.style.height = "auto";

        /*
         * まず0へ戻し、その後record-sectionの実座標を使って
         * 空白を飛ばします。レイアウトがどの順番で完成しても
         * 最初の更新カードが画面上部に来ます。
         */
        record.style.scrollBehavior = "auto";
        record.scrollTop = 0;
        content.scrollTop = 0;

        const alignSection = () => {
            const recordRect = record.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const difference =
                sectionRect.top - recordRect.top - 8;

            if (Math.abs(difference) > 2) {
                record.scrollTop += difference;
            }

            if (record.scrollTop < 0) {
                record.scrollTop = 0;
            }
        };

        alignSection();
        requestAnimationFrame(() => {
            alignSection();
            requestAnimationFrame(alignSection);
        });
    }

    function schedulePositioning() {
        clearTimers();

        [0, 40, 120, 260, 520, 900].forEach(delay => {
            resetTimers.push(
                window.setTimeout(
                    positionUpdateLogAtTop,
                    delay
                )
            );
        });
    }

    function addUpdateLogEntry() {
        try {
            if (
                typeof records === "undefined" ||
                !records["UPDATE LOG"] ||
                records["UPDATE LOG"].includes(
                    UPDATE_MARKER
                )
            ) {
                return;
            }

            const card = `
<div class="item-card">
    <div class="item-title">
        Ver.4.12 / UI &amp; UPDATE LOG FIX
    </div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>クイック操作とUPDATE LOGを修正</b><br>
        ・BGM／環境音のON・OFFを視覚表示<br>
        ・OPTIONボタンを修正<br>
        ・旧ボタンが裏に残る問題を解消<br>
        ・UPDATE LOGを更新カードから表示
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

                const updateLink = target.closest(
                    '.menu-item[data-page="UPDATE LOG"],' +
                    '[data-v41-open-page="UPDATE LOG"],' +
                    '[data-v44-dashboard-page="UPDATE LOG"]'
                );

                if (!updateLink) return;

                document.body.classList.add(
                    "v412-update-log-page"
                );

                const record = document.querySelector(
                    ".window.record"
                );

                if (record) record.scrollTop = 0;
                schedulePositioning();
            },
            true
        );

        const content = document.getElementById("content");
        if (!content || contentObserver) return;

        contentObserver = new MutationObserver(
            mutations => {
                const replaced = mutations.some(
                    mutation =>
                        mutation.type === "childList" &&
                        mutation.target === content
                );

                if (replaced) schedulePositioning();
            }
        );

        contentObserver.observe(content, {
            childList:true,
            subtree:false
        });
    }

    function init() {
        injectStyles();
        addUpdateLogEntry();
        bind();
        schedulePositioning();
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
