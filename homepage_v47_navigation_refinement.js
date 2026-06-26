/*
 * THE RECORD OF AONO SHOTA - Ver.4.7
 * Navigation / Layout Refinement
 *
 * 実装内容
 * ・上部の大きなサイトタイトルを左サイドバーへ移動
 * ・メニューを「現在のカテゴリだけ開く」アコーディオン化
 * ・右側の重複した「RECORD」見出しを削除
 * ・BGM / 環境音 / TOP / PET / OPTIONを1つのフローティングメニューへ統合
 * ・HOMEは情報量を維持し、詳細ページは重複情報を減らすフォーカス表示
 *
 * index.html の </body> 直前で、
 * homepage_v46_sidebar_cleanup.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV47NavigationRefinementStyles";
    const UPDATE_MARKER = "VER.4.7 NAVIGATION REFINEMENT";
    const HUB_ID = "v47UtilityHub";
    const MENU_ID = "v47UtilityMenu";

    let mutationTimer = null;
    let menuOpen = false;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.7 / GLOBAL LAYOUT
========================================================= */
body.v47-refined > .title{
    display:none!important;
}

body.v47-refined .container{
    height:calc(100vh - 40px)!important;
    margin:20px auto!important;
}

body.v47-refined .left{
    position:relative;
}

body.v47-refined .v47-sidebar-heading{
    display:block;
    padding:6px 8px 20px;
    margin-bottom:16px;
    border-bottom:1px solid var(--v45-line,rgba(91,65,38,.22));
    text-decoration:none;
    color:inherit;
}

body.v47-refined .v47-sidebar-kicker{
    display:block;
    margin-bottom:8px;
    color:var(--v45-muted,#74685a);
    font:800 9px/1.2 var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif);
    letter-spacing:.24em;
}

body.v47-refined .v47-sidebar-title{
    display:block;
    color:var(--v45-accent-dark,#523518);
    font:700 25px/1.04 var(--v45-font-display,"Yu Mincho",serif);
    letter-spacing:.09em;
}

body.v47-refined .v47-sidebar-owner{
    display:block;
    margin-top:8px;
    color:var(--v45-muted,#74685a);
    font:700 10px/1.2 var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif);
    letter-spacing:.17em;
}

body.v47-refined .left > .window.v46-menu-window{
    padding-top:16px!important;
}

body.v47-refined .left > .window.v46-menu-window > h2{
    margin:0 8px 12px!important;
    padding:0 0 11px!important;
    color:var(--v45-muted,#74685a)!important;
    font:800 10px/1.2 var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif)!important;
    letter-spacing:.2em!important;
    border-bottom:1px solid var(--v45-line,rgba(91,65,38,.22))!important;
}

/* =========================================================
   ONE-CATEGORY ACCORDION
========================================================= */
body.v47-refined .menu-category{
    margin:5px 0 2px!important;
}

body.v47-refined .menu-category.v47-current-category{
    color:var(--v45-accent-dark,#523518)!important;
    background:rgba(117,80,44,.11)!important;
    border-color:rgba(117,80,44,.24)!important;
}

body.v47-refined .menu-group{
    overflow:hidden;
}

body.v47-refined .menu-group:not(.open){
    display:none!important;
}

body.v47-refined .menu-group.open{
    display:block!important;
}

/* =========================================================
   REMOVE REDUNDANT OUTER RECORD HEADING
========================================================= */
body.v47-refined .right > .window.record > h2:first-child{
    display:none!important;
}

body.v47-refined .right > .window.record{
    padding-top:18px!important;
}

/* 詳細ページでは専用ヘッダーと重複する現在地表示を簡潔に */
body.v47-detail-page #currentLocation{
    min-height:0!important;
    margin:0 0 12px!important;
    padding:0 2px 10px!important;
    border:0!important;
    border-bottom:1px solid var(--v45-line,rgba(91,65,38,.22))!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
}

body.v47-detail-page #currentLocation .current-location-label{
    display:none!important;
}

body.v47-detail-page .v41-page-header{
    margin-bottom:20px!important;
}

body.v47-detail-page .v41-page-header-description{
    max-width:760px;
}

/* HOMEはダッシュボードを主役として広く見せる */
body.v47-home-page #currentLocation{
    display:none!important;
}

body.v47-home-page .right > .window.record{
    padding-top:22px!important;
}

/* =========================================================
   UTILITY HUB
========================================================= */
.v47-utility-hub{
    position:fixed;
    right:22px;
    bottom:22px;
    z-index:2147482500;
    display:flex;
    flex-direction:column;
    align-items:flex-end;
    gap:10px;
    font-family:var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif);
}

.v47-utility-trigger{
    position:relative;
    display:grid;
    place-items:center;
    width:52px;
    height:52px;
    border:1px solid rgba(82,53,24,.38);
    border-radius:50%;
    background:linear-gradient(180deg,#80603d,#62411f);
    color:#fffaf0;
    font:800 20px/1 inherit;
    cursor:pointer;
    box-shadow:0 12px 30px rgba(43,25,9,.22);
    transition:transform .18s ease,box-shadow .18s ease,background .18s ease;
}

.v47-utility-trigger:hover{
    transform:translateY(-2px);
    box-shadow:0 16px 34px rgba(43,25,9,.28);
}

.v47-utility-trigger[aria-expanded="true"]{
    background:linear-gradient(180deg,#9a754a,#75502c);
}

.v47-utility-trigger::after{
    content:"TOOLS";
    position:absolute;
    right:60px;
    padding:6px 9px;
    border-radius:7px;
    background:rgba(47,34,23,.92);
    color:#fffaf0;
    font-size:9px;
    letter-spacing:.14em;
    opacity:0;
    transform:translateX(6px);
    pointer-events:none;
    transition:.16s;
}

.v47-utility-trigger:hover::after{
    opacity:1;
    transform:none;
}

.v47-utility-menu{
    display:grid;
    width:min(260px,calc(100vw - 32px));
    padding:9px;
    gap:5px;
    border:1px solid var(--v45-line-strong,rgba(91,65,38,.38));
    border-radius:14px;
    background:rgba(255,250,240,.96);
    box-shadow:0 18px 44px rgba(43,25,9,.2);
    backdrop-filter:blur(14px);
    transform-origin:right bottom;
    transition:opacity .16s ease,transform .16s ease,visibility .16s;
}

.v47-utility-menu[hidden]{
    display:grid!important;
    opacity:0;
    visibility:hidden;
    transform:translateY(8px) scale(.97);
    pointer-events:none;
}

.v47-tool-button{
    display:grid;
    grid-template-columns:36px minmax(0,1fr) auto;
    align-items:center;
    gap:10px;
    width:100%;
    min-height:49px;
    padding:7px 9px;
    border:1px solid transparent;
    border-radius:10px;
    background:transparent;
    color:var(--v45-ink,#30271f);
    text-align:left;
    cursor:pointer;
    font:inherit;
    transition:background .16s ease,border-color .16s ease;
}

.v47-tool-button:hover{
    border-color:var(--v45-line,rgba(91,65,38,.22));
    background:rgba(117,80,44,.07);
}

.v47-tool-icon{
    display:grid;
    place-items:center;
    width:34px;
    height:34px;
    border-radius:9px;
    background:rgba(117,80,44,.1);
    color:var(--v45-accent-dark,#523518);
    font-size:17px;
}

.v47-tool-copy b{
    display:block;
    color:var(--v45-accent-dark,#523518);
    font-size:12px;
    letter-spacing:.04em;
}

.v47-tool-copy small{
    display:block;
    margin-top:2px;
    color:var(--v45-muted,#74685a);
    font-size:9px;
}

.v47-tool-state{
    min-width:36px;
    color:var(--v45-muted,#74685a);
    font-size:9px;
    font-weight:800;
    letter-spacing:.08em;
    text-align:right;
}

.v47-tool-state.is-on{
    color:#557144;
}

/* 旧フローティング操作は機能を保持したまま非表示 */
body.v47-refined #v42AmbientFloatingButton,
body.v47-refined #v43BgmFloatingButton,
body.v47-refined .v41-back-to-top,
body.v47-refined #v44FloatingPet{
    position:fixed!important;
    left:-9999px!important;
    right:auto!important;
    top:auto!important;
    bottom:auto!important;
    width:1px!important;
    height:1px!important;
    opacity:0!important;
    pointer-events:none!important;
}

/* OPTIONの設定カードはそのまま利用 */
body.v47-refined .v41-option-shell{
    scroll-margin-top:20px;
}

@media(max-width:760px){
    body.v47-refined .container{
        height:auto!important;
        margin:10px auto 76px!important;
    }

    body.v47-refined .v47-sidebar-heading{
        padding:4px 4px 14px;
        margin-bottom:12px;
    }

    body.v47-refined .v47-sidebar-title{
        font-size:22px;
    }

    body.v47-refined .menu-group.open{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:4px!important;
    }

    .v47-utility-hub{
        right:12px;
        bottom:12px;
    }

    .v47-utility-trigger{
        width:48px;
        height:48px;
    }
}

@media(max-width:480px){
    body.v47-refined .menu-group.open{
        grid-template-columns:1fr!important;
    }
}

@media(prefers-reduced-motion:reduce){
    .v47-utility-menu,
    .v47-utility-trigger,
    .v47-tool-button{
        transition:none!important;
    }
}
`;
        document.head.appendChild(style);
    }

    function getMenuWindow() {
        return document.querySelector(".left > .window.v46-menu-window") ||
            Array.from(document.querySelectorAll(".left > .window")).find(windowElement =>
                windowElement.querySelector(".menu-category,.menu-item")
            ) ||
            null;
    }

    function createSidebarBrand() {
        const menuWindow = getMenuWindow();
        if (!menuWindow || menuWindow.querySelector(".v47-sidebar-heading")) return;

        const brand = document.createElement("a");
        brand.className = "v47-sidebar-heading";
        brand.href = "#";
        brand.setAttribute("aria-label", "HOMEを開く");
        brand.innerHTML = `
            <span class="v47-sidebar-kicker">A PERSONAL ARCHIVE</span>
            <span class="v47-sidebar-title">THE RECORD</span>
            <span class="v47-sidebar-owner">AONO SHOTA</span>
        `;
        brand.addEventListener("click", event => {
            event.preventDefault();
            openPageByName("HOME");
        });

        menuWindow.insertBefore(brand, menuWindow.firstChild);
    }

    function removeOuterHeadings() {
        const recordHeading = document.querySelector(".right > .window.record > h2:first-child");
        if (recordHeading) recordHeading.setAttribute("aria-hidden", "true");
    }

    function categoryPairs() {
        const menuWindow = getMenuWindow();
        if (!menuWindow) return [];

        const categories = Array.from(menuWindow.querySelectorAll(".menu-category"));
        return categories.map(category => {
            let group = category.nextElementSibling;
            while (group && !group.classList.contains("menu-group")) {
                group = group.nextElementSibling;
            }
            return { category, group };
        }).filter(pair => pair.group);
    }

    function setOpenCategory(targetCategory) {
        categoryPairs().forEach(({ category, group }) => {
            const active = category === targetCategory;
            category.classList.toggle("open", active);
            category.classList.toggle("v47-current-category", active);
            category.setAttribute("aria-expanded", String(active));
            group.classList.toggle("open", active);
        });
    }

    function findCategoryForPage(pageName) {
        const normalized = String(pageName || "").trim().toUpperCase();
        if (!normalized || normalized === "HOME" || normalized === "RECORD") return null;

        for (const pair of categoryPairs()) {
            const match = Array.from(pair.group.querySelectorAll(".menu-item")).some(item =>
                item.textContent.trim().toUpperCase() === normalized
            );
            if (match) return pair.category;
        }
        return null;
    }

    function currentPageName() {
        if (document.querySelector(".v41-dashboard")) return "HOME";
        const location = document.getElementById("locationPage")?.textContent?.trim();
        if (location && location !== "RECORD") return location;
        const selected = document.querySelector(".menu-item.selected");
        return selected?.textContent?.trim() || "HOME";
    }

    function syncActiveCategory() {
        const pageName = currentPageName();
        const target = findCategoryForPage(pageName);
        if (target) {
            setOpenCategory(target);
        } else if (!categoryPairs().some(pair => pair.category.classList.contains("open"))) {
            setOpenCategory(categoryPairs()[0]?.category);
        }
    }

    function bindAccordion() {
        const menuWindow = getMenuWindow();
        if (!menuWindow || menuWindow.dataset.v47AccordionBound === "true") return;
        menuWindow.dataset.v47AccordionBound = "true";

        menuWindow.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const category = target.closest(".menu-category");
            if (category) {
                event.preventDefault();
                event.stopImmediatePropagation();
                setOpenCategory(category);
                return;
            }

            const item = target.closest(".menu-item");
            if (item) {
                const pair = categoryPairs().find(({ group }) => group.contains(item));
                if (pair) setOpenCategory(pair.category);
            }
        }, true);
    }

    function openPageByName(pageName) {
        const normalized = String(pageName || "").trim().toUpperCase();

        if (normalized === "HOME") {
            const homeButton = document.querySelector("[data-v41-home],#v41HomeButton");
            if (homeButton) {
                homeButton.click();
                return;
            }
            if (typeof window.openHomeDashboard === "function") {
                window.openHomeDashboard();
                return;
            }
        }

        const item = Array.from(document.querySelectorAll(".menu-item")).find(element =>
            element.textContent.trim().toUpperCase() === normalized
        );
        if (item) {
            item.click();
            return;
        }

        const dashboardButton = document.querySelector(`[data-v44-dashboard-page="${CSS.escape(pageName)}"]`);
        if (dashboardButton) dashboardButton.click();
    }

    function setPageMode() {
        const isHome = Boolean(document.querySelector(".v41-dashboard"));
        document.body.classList.toggle("v47-home-page", isHome);
        document.body.classList.toggle("v47-detail-page", !isHome);
    }

    function createUtilityHub() {
        if (document.getElementById(HUB_ID)) return;

        const hub = document.createElement("div");
        hub.id = HUB_ID;
        hub.className = "v47-utility-hub";
        hub.innerHTML = `
            <div id="${MENU_ID}" class="v47-utility-menu" hidden role="menu" aria-label="クイックツール">
                ${toolButtonHtml("bgm","🎵","BGM","背景音楽を切り替える")}
                ${toolButtonHtml("ambience","♬","環境音","ページごとの環境音を切り替える")}
                ${toolButtonHtml("top","↑","ページ上部","現在のページの先頭へ戻る")}
                ${toolButtonHtml("pet","✦","RECORD PET","ミニペットを開く")}
                ${toolButtonHtml("option","⚙","OPTION","表示・音・演出の設定を開く")}
            </div>
            <button class="v47-utility-trigger" type="button" aria-label="クイックツールを開く" aria-expanded="false" aria-controls="${MENU_ID}">
                <span aria-hidden="true">＋</span>
            </button>
        `;

        document.body.appendChild(hub);

        hub.querySelector(".v47-utility-trigger")?.addEventListener("click", event => {
            event.stopPropagation();
            setUtilityMenuOpen(!menuOpen);
        });

        hub.querySelector("[data-v47-tool='bgm']")?.addEventListener("click", () => clickOriginal("#v43BgmFloatingButton"));
        hub.querySelector("[data-v47-tool='ambience']")?.addEventListener("click", () => clickOriginal("#v42AmbientFloatingButton"));
        hub.querySelector("[data-v47-tool='top']")?.addEventListener("click", scrollToPageTop);
        hub.querySelector("[data-v47-tool='pet']")?.addEventListener("click", () => {
            const original = document.getElementById("v44FloatingPet");
            if (original) original.click();
            else openPageByName("RECORD PET");
            setUtilityMenuOpen(false);
        });
        hub.querySelector("[data-v47-tool='option']")?.addEventListener("click", () => {
            openPageByName("OPTION");
            setUtilityMenuOpen(false);
        });

        document.addEventListener("click", event => {
            if (menuOpen && !hub.contains(event.target)) setUtilityMenuOpen(false);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && menuOpen) setUtilityMenuOpen(false);
        });

        syncUtilityStates();
    }

    function toolButtonHtml(key, icon, title, description) {
        return `
            <button class="v47-tool-button" data-v47-tool="${key}" type="button" role="menuitem">
                <span class="v47-tool-icon" aria-hidden="true">${icon}</span>
                <span class="v47-tool-copy"><b>${title}</b><small>${description}</small></span>
                <span class="v47-tool-state" data-v47-state="${key}">—</span>
            </button>
        `;
    }

    function setUtilityMenuOpen(open) {
        menuOpen = Boolean(open);
        const menu = document.getElementById(MENU_ID);
        const trigger = document.querySelector(".v47-utility-trigger");
        if (!menu || !trigger) return;

        menu.hidden = !menuOpen;
        trigger.setAttribute("aria-expanded", String(menuOpen));
        trigger.setAttribute("aria-label", menuOpen ? "クイックツールを閉じる" : "クイックツールを開く");
        trigger.querySelector("span").textContent = menuOpen ? "×" : "＋";
        if (menuOpen) syncUtilityStates();
    }

    function clickOriginal(selector) {
        const original = document.querySelector(selector);
        if (original) original.click();
        window.setTimeout(syncUtilityStates, 40);
    }

    function scrollToPageTop() {
        const record = document.querySelector(".record");
        if (record && record.scrollHeight > record.clientHeight) {
            record.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        }
        setUtilityMenuOpen(false);
    }

    function prefersReducedMotion() {
        return document.body.classList.contains("v41-motion-none") ||
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    }

    function syncUtilityStates() {
        const setState = (key, text, active = false) => {
            const state = document.querySelector(`[data-v47-state="${key}"]`);
            if (!state) return;
            state.textContent = text;
            state.classList.toggle("is-on", active);
        };

        const bgmButton = document.getElementById("v43BgmFloatingButton");
        const ambienceButton = document.getElementById("v42AmbientFloatingButton");
        const petButton = document.getElementById("v44FloatingPet");

        const bgmOn = bgmButton ? !bgmButton.classList.contains("muted") : false;
        const ambienceOn = ambienceButton ? !ambienceButton.classList.contains("muted") : false;
        const petVisible = petButton ? !petButton.classList.contains("hidden") : true;

        setState("bgm", bgmButton ? (bgmOn ? "ON" : "OFF") : "—", bgmOn);
        setState("ambience", ambienceButton ? (ambienceOn ? "ON" : "OFF") : "—", ambienceOn);
        setState("top", "TOP", false);
        setState("pet", petButton ? (petVisible ? "OPEN" : "OFF") : "OPEN", petVisible);
        setState("option", "SET", false);
    }

    function patchDashboard() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard) return;

        const headings = Array.from(dashboard.querySelectorAll(".v41-dashboard-panel-title h5"));
        const systemHeading = headings.find(element => element.textContent.trim() === "SYSTEM STATUS");
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const version = systemPanel?.querySelector(".v41-dashboard-panel-title span");

        if (version) version.textContent = "VER.4.7";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) {
            latest.innerHTML =
                "<b>NEW UPDATE</b><br>タイトル・メニュー・ページ見出し・常時操作ボタンを整理し、詳細ページをより読みやすくしました。";
        }

        const rows = systemPanel?.querySelector(".v41-system-list");
        if (rows && !document.getElementById("v47NavigationRow")) {
            const row = document.createElement("div");
            row.id = "v47NavigationRow";
            row.className = "v41-system-row";
            row.innerHTML = "<span>ナビゲーション</span><b>REFINED</b>";
            rows.appendChild(row);
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card v47-new-record" data-new-record="true">
    <div class="item-title">Ver.4.7 / NAVIGATION REFINEMENT</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>画面構成と操作UIを再整理</b><br>
        ・大きな上部タイトルを左サイドバーへ統合<br>
        ・現在のカテゴリだけを開くアコーディオンメニューへ変更<br>
        ・右側の重複したRECORD見出しを削除<br>
        ・BGM、環境音、TOP、PET、OPTIONを1つのツールメニューへ統合<br>
        ・HOMEは情報量を維持し、詳細ページは重複情報を抑えたフォーカス表示へ変更
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function runEnhancements() {
        document.body.classList.add("v47-refined");
        createSidebarBrand();
        removeOuterHeadings();
        bindAccordion();
        setPageMode();
        syncActiveCategory();
        createUtilityHub();
        syncUtilityStates();
        patchDashboard();
    }

    function scheduleEnhancements() {
        if (mutationTimer) window.clearTimeout(mutationTimer);
        mutationTimer = window.setTimeout(runEnhancements, 40);
    }

    function watchChanges() {
        const observer = new MutationObserver(scheduleEnhancements);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class"]
        });
    }

    function init() {
        injectStyles();
        addUpdateLog();
        runEnhancements();
        watchChanges();
        window.setInterval(syncUtilityStates, 1200);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
