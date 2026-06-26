/*
 * THE RECORD OF AONO SHOTA - Ver.4.6
 * Sidebar cleanup
 * ・左側の常設STATUS（NAME / LEVEL / PLAY TIME）を削除
 * ・左側をナビゲーション専用へ整理
 * ・サイドバー下部に控えめなブランド表記を追加
 *
 * index.html の </body> 直前で、
 * homepage_v45_design_system.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV46SidebarCleanupStyles";
    const MARKER = "VER.4.6 SIDEBAR CLEANUP";

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.6 SIDEBAR CLEANUP
========================================================= */
body.v46-sidebar-clean .left{
    display:flex!important;
    flex-direction:column!important;
    gap:0!important;
}

body.v46-sidebar-clean .left > .window{
    margin-bottom:0!important;
}

body.v46-sidebar-clean .left > .window.v46-menu-window{
    min-height:100%;
    display:flex;
    flex-direction:column;
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

/* サイドバーが高すぎない画面ではブランド表記を無理に固定しない */
@media(max-height:760px) and (min-width:761px){
    body.v46-sidebar-clean .left > .window.v46-menu-window{
        min-height:auto;
    }
    body.v46-sidebar-clean .v46-sidebar-brand{
        margin-top:20px;
    }
}

/* スマホではブランド表記を簡潔に */
@media(max-width:760px){
    body.v46-sidebar-clean .left > .window.v46-menu-window{
        min-height:auto;
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
        const headingText = heading?.textContent.replace(/\s+/g, " ").trim().toUpperCase() || "";

        const hasLevel = Boolean(windowElement.querySelector("#level"));
        const hasDays = Boolean(windowElement.querySelector("#days"));
        const statusTitles = Array.from(windowElement.querySelectorAll(".status-title"))
            .map(element => element.textContent.replace(/\s+/g, " ").trim().toUpperCase());

        const hasExpectedStatusTitles =
            statusTitles.includes("NAME") &&
            statusTitles.includes("LEVEL") &&
            statusTitles.includes("PLAY TIME");

        return headingText.includes("STATUS") || (hasLevel && hasDays) || hasExpectedStatusTitles;
    }

    function removeSidebarStatus() {
        const left = document.querySelector(".left");
        if (!left) return;

        const directWindows = Array.from(left.children).filter(
            element => element.classList?.contains("window")
        );

        directWindows
            .filter(isStatusWindow)
            .forEach(element => element.remove());
    }

    function findMenuWindow() {
        const left = document.querySelector(".left");
        if (!left) return null;

        const windows = Array.from(left.children).filter(
            element => element.classList?.contains("window")
        );

        return windows.find(windowElement => {
            const heading = windowElement.querySelector(":scope > h2");
            const headingText = heading?.textContent.replace(/\s+/g, " ").trim().toUpperCase() || "";
            return headingText.includes("MENU") ||
                windowElement.querySelector(".menu-category, .menu-item");
        }) || null;
    }

    function polishMenuWindow() {
        const menuWindow = findMenuWindow();
        if (!menuWindow) return;

        menuWindow.classList.add("v46-menu-window");

        const heading = menuWindow.querySelector(":scope > h2");
        if (heading) {
            heading.textContent = "NAVIGATION";
            heading.setAttribute("aria-label", "Navigation");
        }

        if (!menuWindow.querySelector(".v46-sidebar-brand")) {
            const brand = document.createElement("div");
            brand.className = "v46-sidebar-brand";
            brand.setAttribute("aria-hidden", "true");
            brand.innerHTML = `
                <strong>THE RECORD</strong>
                <span>AONO SHOTA · VER.4.6</span>
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
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const version = systemPanel?.querySelector(".v41-dashboard-panel-title span");

        if (version) version.textContent = "VER.4.6";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) {
            latest.innerHTML =
                "<b>NEW UPDATE</b><br>左側の常設ステータスを廃止し、ナビゲーション専用サイドバーへ整理しました。";
        }

        const rows = systemPanel?.querySelector(".v41-system-list");
        if (rows && !document.getElementById("v46SidebarStatusRow")) {
            const row = document.createElement("div");
            row.id = "v46SidebarStatusRow";
            row.className = "v41-system-row";
            row.innerHTML = "<span>サイドバー</span><b>NAVIGATION ONLY</b>";
            rows.appendChild(row);
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(MARKER)) return;

        const card = `
<div class="item-card v46-new-record" data-new-record="true">
    <div class="item-title">Ver.4.6 / SIDEBAR CLEANUP</div>
    <div class="item-text">
        <b style="display:none">${MARKER}</b>
        <b>左サイドバーをナビゲーション専用に再設計</b><br>
        ・NAME、LEVEL、PLAY TIMEの常設表示を削除<br>
        ・プロフィール情報はHOMEダッシュボードへ集約<br>
        ・MENU見出しをNAVIGATIONへ整理<br>
        ・サイドバー下部へ控えめなブランド表記を追加<br>
        ・PC、スマートフォン双方の余白を調整
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

        // ほかの追加JSがDOMを更新した場合にも、状態が戻らないように再確認
        const observer = new MutationObserver(() => {
            removeSidebarStatus();
            polishMenuWindow();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
