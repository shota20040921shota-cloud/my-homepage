/*
 * THE RECORD OF AONO SHOTA - Ver.4.7.1
 * Navigation observer hotfix
 *
 * 修正内容
 * ・メニューをクリックできなくなる問題を修正
 * ・ページが応答しなくなる無限監視ループを停止
 * ・Ver.4.7の見た目と機能は維持
 *
 * 旧 homepage_v47_navigation_refinement.js を
 * このファイルで上書きしてください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV471NavigationRefinementStyles";
    const HUB_ID = "v47UtilityHub";
    const MENU_ID = "v47UtilityMenu";

    let menuOpen = false;
    let contentObserver = null;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const oldStyle = document.getElementById("aonoV47NavigationRefinementStyles");
        if (oldStyle) oldStyle.id = STYLE_ID;

        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
body.v47-refined > .title{display:none!important}
body.v47-refined .container{height:calc(100vh - 40px)!important;margin:20px auto!important}
body.v47-refined .v47-sidebar-heading{display:block;padding:6px 8px 20px;margin-bottom:16px;border-bottom:1px solid var(--v45-line,rgba(91,65,38,.22));text-decoration:none;color:inherit}
body.v47-refined .v47-sidebar-kicker{display:block;margin-bottom:8px;color:var(--v45-muted,#74685a);font:800 9px/1.2 var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif);letter-spacing:.24em}
body.v47-refined .v47-sidebar-title{display:block;color:var(--v45-accent-dark,#523518);font:700 25px/1.04 var(--v45-font-display,"Yu Mincho",serif);letter-spacing:.09em}
body.v47-refined .v47-sidebar-owner{display:block;margin-top:8px;color:var(--v45-muted,#74685a);font:700 10px/1.2 var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif);letter-spacing:.17em}
body.v47-refined .menu-group:not(.open){display:none!important}
body.v47-refined .menu-group.open{display:block!important}
body.v47-refined .right>.window.record>h2:first-child{display:none!important}
body.v47-refined .right>.window.record{padding-top:18px!important}
body.v47-detail-page #currentLocation{min-height:0!important;margin:0 0 12px!important;padding:0 2px 10px!important;border:0!important;border-bottom:1px solid var(--v45-line,rgba(91,65,38,.22))!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
body.v47-detail-page #currentLocation .current-location-label{display:none!important}
body.v47-home-page #currentLocation{display:none!important}
.v47-utility-hub{position:fixed;right:22px;bottom:22px;z-index:2147482500;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:var(--v45-font-body,"Hiragino Sans","Yu Gothic",sans-serif)}
.v47-utility-trigger{display:grid;place-items:center;width:52px;height:52px;border:1px solid rgba(82,53,24,.38);border-radius:50%;background:linear-gradient(180deg,#80603d,#62411f);color:#fffaf0;font:800 20px/1 inherit;cursor:pointer;box-shadow:0 12px 30px rgba(43,25,9,.22)}
.v47-utility-menu{display:grid;width:min(260px,calc(100vw - 32px));padding:9px;gap:5px;border:1px solid var(--v45-line-strong,rgba(91,65,38,.38));border-radius:14px;background:rgba(255,250,240,.96);box-shadow:0 18px 44px rgba(43,25,9,.2);backdrop-filter:blur(14px)}
.v47-utility-menu[hidden]{display:none!important}
.v47-tool-button{display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:10px;width:100%;min-height:49px;padding:7px 9px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--v45-ink,#30271f);text-align:left;cursor:pointer;font:inherit}
.v47-tool-button:hover{border-color:var(--v45-line,rgba(91,65,38,.22));background:rgba(117,80,44,.07)}
.v47-tool-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:rgba(117,80,44,.1);color:var(--v45-accent-dark,#523518);font-size:17px}
.v47-tool-copy b{display:block;color:var(--v45-accent-dark,#523518);font-size:12px}
.v47-tool-copy small{display:block;margin-top:2px;color:var(--v45-muted,#74685a);font-size:9px}
.v47-tool-state{font-size:9px;font-weight:800;color:var(--v45-muted,#74685a)}
body.v47-refined #v42AmbientFloatingButton,
body.v47-refined #v43BgmFloatingButton,
body.v47-refined .v41-back-to-top,
body.v47-refined #v44FloatingPet{position:fixed!important;left:-9999px!important;right:auto!important;top:auto!important;bottom:auto!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
@media(max-width:760px){
 body.v47-refined .container{height:auto!important;margin:10px auto 76px!important}
 body.v47-refined .menu-group.open{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important}
 .v47-utility-hub{right:12px;bottom:12px}
}
@media(max-width:480px){body.v47-refined .menu-group.open{grid-template-columns:1fr!important}}
`;
        document.head.appendChild(style);
    }

    function getMenuWindow() {
        return document.querySelector(".left > .window.v46-menu-window") ||
            Array.from(document.querySelectorAll(".left > .window")).find(el =>
                el.querySelector(".menu-category,.menu-item")
            ) || null;
    }

    function createSidebarBrand() {
        const menuWindow = getMenuWindow();
        if (!menuWindow || menuWindow.querySelector(".v47-sidebar-heading")) return;

        const brand = document.createElement("a");
        brand.className = "v47-sidebar-heading";
        brand.href = "#";
        brand.innerHTML = `
            <span class="v47-sidebar-kicker">A PERSONAL ARCHIVE</span>
            <span class="v47-sidebar-title">THE RECORD</span>
            <span class="v47-sidebar-owner">AONO SHOTA</span>
        `;
        brand.addEventListener("click", e => {
            e.preventDefault();
            openPageByName("HOME");
        });
        menuWindow.insertBefore(brand, menuWindow.firstChild);
    }

    function categoryPairs() {
        const menuWindow = getMenuWindow();
        if (!menuWindow) return [];

        const categories = Array.from(menuWindow.querySelectorAll(".menu-category"));
        return categories.map(category => {
            let group = category.nextElementSibling;
            while (group && !group.classList.contains("menu-group")) group = group.nextElementSibling;
            return { category, group };
        }).filter(pair => pair.group);
    }

    function setOpenCategory(targetCategory) {
        categoryPairs().forEach(({category, group}) => {
            const active = category === targetCategory;
            if (category.classList.contains("open") !== active) category.classList.toggle("open", active);
            if (group.classList.contains("open") !== active) group.classList.toggle("open", active);
            category.setAttribute("aria-expanded", String(active));
        });
    }

    function findCategoryForPage(pageName) {
        const normalized = String(pageName || "").trim().toUpperCase();
        for (const pair of categoryPairs()) {
            const found = Array.from(pair.group.querySelectorAll(".menu-item")).some(item =>
                item.textContent.trim().toUpperCase() === normalized
            );
            if (found) return pair.category;
        }
        return null;
    }

    function currentPageName() {
        if (document.querySelector(".v41-dashboard")) return "HOME";
        return document.getElementById("locationPage")?.textContent?.trim() ||
            document.querySelector(".menu-item.selected")?.textContent?.trim() ||
            "HOME";
    }

    function syncPageState() {
        const page = currentPageName();
        const isHome = page.toUpperCase() === "HOME";

        document.body.classList.toggle("v47-home-page", isHome);
        document.body.classList.toggle("v47-detail-page", !isHome);

        const category = findCategoryForPage(page);
        if (category) setOpenCategory(category);
    }

    function bindMenuOnce() {
        const menuWindow = getMenuWindow();
        if (!menuWindow || menuWindow.dataset.v471Bound === "true") return;

        menuWindow.dataset.v471Bound = "true";

        menuWindow.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const category = target.closest(".menu-category");
            if (category) {
                event.preventDefault();
                event.stopPropagation();
                setOpenCategory(category);
                return;
            }

            const item = target.closest(".menu-item");
            if (item) {
                const pair = categoryPairs().find(({group}) => group.contains(item));
                if (pair) setOpenCategory(pair.category);
                window.setTimeout(syncPageState, 30);
            }
        });
    }

    function openPageByName(pageName) {
        const normalized = String(pageName || "").trim().toUpperCase();

        if (normalized === "HOME") {
            const btn = document.querySelector("[data-v41-home],#v41HomeButton");
            if (btn) return btn.click();
            if (typeof window.openHomeDashboard === "function") return window.openHomeDashboard();
        }

        const item = Array.from(document.querySelectorAll(".menu-item")).find(el =>
            el.textContent.trim().toUpperCase() === normalized
        );
        if (item) item.click();
    }

    function createUtilityHub() {
        if (document.getElementById(HUB_ID)) return;

        const hub = document.createElement("div");
        hub.id = HUB_ID;
        hub.className = "v47-utility-hub";
        hub.innerHTML = `
            <div id="${MENU_ID}" class="v47-utility-menu" hidden>
                ${tool("bgm","🎵","BGM")}
                ${tool("ambience","♬","環境音")}
                ${tool("top","↑","ページ上部")}
                ${tool("pet","✦","RECORD PET")}
                ${tool("option","⚙","OPTION")}
            </div>
            <button class="v47-utility-trigger" type="button" aria-expanded="false">＋</button>
        `;
        document.body.appendChild(hub);

        const trigger = hub.querySelector(".v47-utility-trigger");
        const menu = hub.querySelector(".v47-utility-menu");

        trigger.addEventListener("click", e => {
            e.stopPropagation();
            menuOpen = !menuOpen;
            menu.hidden = !menuOpen;
            trigger.textContent = menuOpen ? "×" : "＋";
            trigger.setAttribute("aria-expanded", String(menuOpen));
        });

        hub.querySelector("[data-tool='bgm']").addEventListener("click", () => document.getElementById("v43BgmFloatingButton")?.click());
        hub.querySelector("[data-tool='ambience']").addEventListener("click", () => document.getElementById("v42AmbientFloatingButton")?.click());
        hub.querySelector("[data-tool='top']").addEventListener("click", () => {
            const record = document.querySelector(".record");
            if (record) record.scrollTo({top:0, behavior:"smooth"});
            menu.hidden = true;
            menuOpen = false;
            trigger.textContent = "＋";
        });
        hub.querySelector("[data-tool='pet']").addEventListener("click", () => {
            document.getElementById("v44FloatingPet")?.click();
            menu.hidden = true;
            menuOpen = false;
            trigger.textContent = "＋";
        });
        hub.querySelector("[data-tool='option']").addEventListener("click", () => {
            openPageByName("OPTION");
            menu.hidden = true;
            menuOpen = false;
            trigger.textContent = "＋";
        });

        document.addEventListener("click", e => {
            if (menuOpen && !hub.contains(e.target)) {
                menuOpen = false;
                menu.hidden = true;
                trigger.textContent = "＋";
            }
        });
    }

    function tool(key, icon, label) {
        return `
            <button class="v47-tool-button" type="button" data-tool="${key}">
                <span class="v47-tool-icon">${icon}</span>
                <span class="v47-tool-copy"><b>${label}</b><small>クイック操作</small></span>
                <span class="v47-tool-state">›</span>
            </button>
        `;
    }

    function observeContentOnly() {
        if (contentObserver) return;
        const content = document.getElementById("content");
        if (!content) return;

        contentObserver = new MutationObserver(() => {
            window.requestAnimationFrame(syncPageState);
        });

        contentObserver.observe(content, {
            childList: true
        });
    }

    function init() {
        document.body.classList.add("v47-refined");
        injectStyles();
        createSidebarBrand();
        bindMenuOnce();
        createUtilityHub();
        syncPageState();
        observeContentOnly();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, {once:true});
    } else {
        init();
    }
})();
