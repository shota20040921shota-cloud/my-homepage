/*
 * THE RECORD OF AONO SHOTA - Ver.4.9
 * Sidebar cleanup hotfix
 *
 * 修正内容
 * ・ページが応答しなくなる無限MutationObserverループを停止
 * ・メニューをクリックできない問題を解消
 * ・左側STATUS削除、NAVIGATION化、ブランド表記は維持
 *
 * 旧 homepage_v46_sidebar_cleanup.js を
 * このファイルで上書きしてください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV461SidebarCleanupStyles";
    const MARKER = "VER.4.10 SIDEBAR SCROLL FIX";

    function injectStyles() {
        const oldStyle = document.getElementById("aonoV46SidebarCleanupStyles");
        if (oldStyle) oldStyle.remove();
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.6.1 SIDEBAR CLEANUP
========================================================= */
body.v46-sidebar-clean .left{
    display:block!important;
    height:100%!important;
    min-height:0!important;
    overflow-x:hidden!important;
    overflow-y:auto!important;
    overscroll-behavior:contain!important;
    touch-action:pan-y!important;
    scrollbar-gutter:stable!important;
    pointer-events:auto!important;
    padding-right:6px!important;
}

body.v46-sidebar-clean .left > .window{
    margin-bottom:0!important;
}

body.v46-sidebar-clean .left > .window.v46-menu-window{
    width:100%!important;
    height:auto!important;
    min-height:max-content!important;
    max-height:none!important;
    display:block!important;
    overflow:visible!important;
    pointer-events:auto!important;
}

body.v46-sidebar-clean .left > .window.v46-menu-window > h2{
    margin-bottom:16px!important;
}

body.v46-sidebar-clean .v46-sidebar-brand{
    margin-top:auto;
    padding:18px 8px 4px;
    border-top:1px solid var(--v45-line, rgba(93,65,37,.22));
    color:var(--v45-muted, #76695c);
    text-align:center;
    font-family:var(--v45-font-body, "Hiragino Sans","Yu Gothic",sans-serif);
}

body.v46-sidebar-clean .v46-sidebar-brand strong{
    display:block;
    color:var(--v45-accent-dark, #60411f);
    font-size:11px;
    letter-spacing:.17em;
}

body.v46-sidebar-clean .v46-sidebar-brand span{
    display:block;
    margin-top:5px;
    font-size:9px;
    letter-spacing:.14em;
    opacity:.78;
}

@media(max-height:760px) and (min-width:761px){
    body.v46-sidebar-clean .left{
        overflow-y:auto!important;
    }

    body.v46-sidebar-clean .v46-sidebar-brand{
        margin-top:20px;
    }
}

@media(max-width:760px){
    body.v46-sidebar-clean .left{
        height:auto!important;
        min-height:0!important;
        overflow:visible!important;
        padding-right:0!important;
    }

    body.v46-sidebar-clean .left > .window.v46-menu-window{
        height:auto!important;
        min-height:0!important;
        max-height:none!important;
        overflow:visible!important;
    }

    body.v46-sidebar-clean .v46-sidebar-brand{
        margin-top:14px;
        padding-top:12px;
    }
}
`;
        document.head.appendChild(style);
    }

    function isStatusWindow(windowElement) {
        if (!windowElement) return false;

        const heading = windowElement.querySelector(":scope > h2");
        const headingText =
            heading?.textContent.replace(/\s+/g, " ").trim().toUpperCase() || "";

        const hasLevel = Boolean(windowElement.querySelector("#level"));
        const hasDays = Boolean(windowElement.querySelector("#days"));

        const statusTitles = Array.from(
            windowElement.querySelectorAll(".status-title")
        ).map(element =>
            element.textContent.replace(/\s+/g, " ").trim().toUpperCase()
        );

        const hasExpectedStatusTitles =
            statusTitles.includes("NAME") &&
            statusTitles.includes("LEVEL") &&
            statusTitles.includes("PLAY TIME");

        return (
            headingText.includes("STATUS") ||
            (hasLevel && hasDays) ||
            hasExpectedStatusTitles
        );
    }

    function removeSidebarStatus() {
        const left = document.querySelector(".left");
        if (!left) return;

        Array.from(left.children)
            .filter(element => element.classList?.contains("window"))
            .filter(isStatusWindow)
            .forEach(element => element.remove());
    }

    function findMenuWindow() {
        const left = document.querySelector(".left");
        if (!left) return null;

        const windows = Array.from(left.children).filter(
            element => element.classList?.contains("window")
        );

        return (
            windows.find(windowElement => {
                const heading = windowElement.querySelector(":scope > h2");
                const headingText =
                    heading?.textContent
                        .replace(/\s+/g, " ")
                        .trim()
                        .toUpperCase() || "";

                return (
                    headingText.includes("MENU") ||
                    headingText.includes("NAVIGATION") ||
                    Boolean(
                        windowElement.querySelector(
                            ".menu-category, .menu-item"
                        )
                    )
                );
            }) || null
        );
    }

    function polishMenuWindow() {
        const menuWindow = findMenuWindow();
        if (!menuWindow) return;

        menuWindow.classList.add("v46-menu-window");

        const heading = menuWindow.querySelector(":scope > h2");
        if (
            heading &&
            heading.textContent.replace(/\s+/g, " ").trim() !== "NAVIGATION"
        ) {
            heading.textContent = "NAVIGATION";
            heading.setAttribute("aria-label", "Navigation");
        }

        if (!menuWindow.querySelector(".v46-sidebar-brand")) {
            const brand = document.createElement("div");
            brand.className = "v46-sidebar-brand";
            brand.setAttribute("aria-hidden", "true");
            brand.innerHTML = `
                <strong>THE RECORD</strong>
                <span>AONO SHOTA · VER.4.9</span>
            `;
            menuWindow.appendChild(brand);
        }
    }

    function patchDashboard() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard) return;

        const headings = Array.from(
            dashboard.querySelectorAll(".v41-dashboard-panel-title h5")
        );

        const systemHeading = headings.find(
            element => element.textContent.trim() === "SYSTEM STATUS"
        );

        const systemPanel = systemHeading?.closest(
            ".v41-dashboard-panel"
        );

        const version = systemPanel?.querySelector(
            ".v41-dashboard-panel-title span"
        );

        if (version) version.textContent = "VER.4.8.3";

        const rows = systemPanel?.querySelector(".v41-system-list");
        if (rows && !document.getElementById("v461SidebarStatusRow")) {
            const row = document.createElement("div");
            row.id = "v461SidebarStatusRow";
            row.className = "v41-system-row";
            row.innerHTML =
                "<span>サイドバー</span><b>NAVIGATION ONLY</b>";
            rows.appendChild(row);
        }
    }

    function addUpdateLog() {
        if (
            typeof records === "undefined" ||
            !records["UPDATE LOG"] ||
            records["UPDATE LOG"].includes(MARKER)
        ) {
            return;
        }

        const card = `
<div class="item-card v461-new-record" data-new-record="true">
    <div class="item-title">Ver.4.8.3 / SIDEBAR LOOP HOTFIX</div>
    <div class="item-text">
        <b style="display:none">${MARKER}</b>
        <b>メニュー操作不能・ページ応答停止を修正</b><br>
        ・サイドバー監視処理の無限ループを停止<br>
        ・MENU見出しの繰り返し書き換えを防止<br>
        ・左側STATUS削除とNAVIGATION表示は維持<br>
        ・ページ操作時のCPU負荷を軽減
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function enhance() {
        document.body.classList.add("v46-sidebar-clean");
        removeSidebarStatus();
        polishMenuWindow();
        patchDashboard();
    }

    function init() {
        injectStyles();
        addUpdateLog();
        enhance();

        /*
         * 旧版ではbody全体をMutationObserverで監視し、
         * NAVIGATIONの文字を毎回textContentで書き直していました。
         * その書き換え自体が再び監視を発火させるため、
         * 無限ループになっていました。
         *
         * サイドバー構造は起動後に作り直されないため、
         * この版ではbody全体の監視を行いません。
         */
        document.addEventListener(
            "click",
            event => {
                const target = event.target;
                if (!(target instanceof Element)) return;

                if (
                    target.closest("[data-v41-home]") ||
                    target.closest(".menu-item")
                ) {
                    window.setTimeout(patchDashboard, 60);
                }
            },
            true
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {
            once: true
        });
    } else {
        init();
    }
})();
