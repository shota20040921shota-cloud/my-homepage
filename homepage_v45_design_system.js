/*
 * THE RECORD OF AONO SHOTA - Ver.4.5
 * Visual Design System / Professional UI Refresh
 *
 * index.html の </body> 直前で、homepage_v44_myroom_pet.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV45DesignSystemStyles";
    const UPDATE_MARKER = "VER.4.5 PROFESSIONAL DESIGN SYSTEM";

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.5 DESIGN TOKENS
========================================================= */
:root{
    --v45-bg:#d8c39e;
    --v45-paper:#f7f0e2;
    --v45-paper-strong:#fffaf0;
    --v45-paper-muted:#eee2cd;
    --v45-ink:#30271f;
    --v45-muted:#74685a;
    --v45-line:rgba(91,65,38,.22);
    --v45-line-strong:rgba(91,65,38,.38);
    --v45-accent:#75502c;
    --v45-accent-dark:#523518;
    --v45-gold:#b68b42;
    --v45-focus:#7b5d32;

    --v45-font-display:"Yu Mincho","Hiragino Mincho ProN","Hiragino Mincho Pro",serif;
    --v45-font-body:"Hiragino Sans","Yu Gothic UI","Yu Gothic","Meiryo",sans-serif;

    --v45-radius-sm:8px;
    --v45-radius-md:14px;
    --v45-radius-lg:22px;
    --v45-shadow-sm:0 4px 14px rgba(49,32,15,.08);
    --v45-shadow-md:0 14px 36px rgba(49,32,15,.12);
    --v45-ease:cubic-bezier(.2,.7,.2,1);
}

/* =========================================================
   BASE / TYPOGRAPHY
========================================================= */
html{font-size:16px;scroll-behavior:smooth}
body{
    color:var(--v45-ink)!important;
    font-family:var(--v45-font-body)!important;
    letter-spacing:.01em;
    background:
        radial-gradient(circle at 14% 14%,rgba(255,255,255,.48),transparent 28%),
        radial-gradient(circle at 88% 76%,rgba(83,54,25,.14),transparent 42%),
        linear-gradient(135deg,#e7d7b8,#cfb68b 58%,#b89362)!important;
}
body::before{
    content:"";
    position:fixed;
    inset:0;
    pointer-events:none;
    opacity:.14;
    z-index:-1;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E");
}

.title,h1,h2,h3,.v41-page-header-title,.v41-dashboard-title,
.v44-room-title,.v44-pet-title,.card-name{
    font-family:var(--v45-font-display)!important;
}

.title{
    font-size:clamp(30px,3.3vw,44px)!important;
    line-height:1.12!important;
    letter-spacing:.12em!important;
    margin:22px 0 10px!important;
    color:var(--v45-accent-dark)!important;
    text-shadow:0 1px 0 rgba(255,255,255,.7)!important;
}
.title::after{
    content:"A PERSONAL ARCHIVE";
    display:block;
    margin-top:7px;
    color:var(--v45-muted);
    font-family:var(--v45-font-body);
    font-size:10px;
    font-weight:700;
    letter-spacing:.28em;
}

h2{
    padding-bottom:12px!important;
    margin-bottom:18px!important;
    border-bottom:1px solid var(--v45-line-strong)!important;
    color:var(--v45-accent-dark)!important;
    font-size:clamp(23px,2.2vw,32px)!important;
    letter-spacing:.05em;
}

p,.item-text,.record-value,.card-text{line-height:1.8}
a{color:#65411e;text-decoration-thickness:1px;text-underline-offset:3px}
a:hover{color:#9b652b;text-shadow:none!important}

button,input,select,textarea{
    font-family:var(--v45-font-body)!important;
}
button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,a:focus-visible{
    outline:3px solid rgba(123,93,50,.3)!important;
    outline-offset:3px!important;
}

/* =========================================================
   MAIN LAYOUT
========================================================= */
.container{
    width:min(1440px,calc(100% - 48px))!important;
    height:calc(100vh - 112px)!important;
    margin:18px auto 24px!important;
    display:grid!important;
    grid-template-columns:280px minmax(0,1fr)!important;
    gap:24px!important;
}
.left,.right{width:auto!important;min-width:0!important;height:100%!important}
.left{padding-right:2px!important;overflow-y:auto!important;scrollbar-gutter:stable}
.right{overflow:hidden}
.record{height:100%!important;overflow-y:auto!important;padding-right:6px;scrollbar-gutter:stable}
#content{
    max-width:1120px;
    margin:0 auto;
    font-size:17px!important;
    line-height:1.75!important;
}

.window{
    padding:20px!important;
    margin-bottom:16px!important;
    border:1px solid var(--v45-line-strong)!important;
    border-radius:var(--v45-radius-lg)!important;
    background:
        linear-gradient(rgba(255,250,240,.9),rgba(247,238,221,.91)),
        linear-gradient(135deg,#fffaf0,#eadcc2)!important;
    box-shadow:var(--v45-shadow-md)!important;
    backdrop-filter:blur(7px);
}
.left .window{padding:16px!important}

/* Scrollbars */
.left,.record,.gallery-grid,.exchange-grid,.v44-room-card-list{
    scrollbar-width:thin;
    scrollbar-color:rgba(117,80,44,.42) rgba(255,255,255,.2);
}
.left::-webkit-scrollbar,.record::-webkit-scrollbar,.gallery-grid::-webkit-scrollbar,.exchange-grid::-webkit-scrollbar{width:9px;height:9px}
.left::-webkit-scrollbar-thumb,.record::-webkit-scrollbar-thumb,.gallery-grid::-webkit-scrollbar-thumb,.exchange-grid::-webkit-scrollbar-thumb{background:rgba(117,80,44,.38);border-radius:99px;border:2px solid transparent;background-clip:padding-box}

/* =========================================================
   MENU / STATUS
========================================================= */
.status-card{
    padding:13px 14px!important;
    margin:10px 0!important;
    border:1px solid var(--v45-line)!important;
    border-radius:var(--v45-radius-md)!important;
    background:rgba(255,250,240,.68)!important;
    box-shadow:none!important;
}
.status-title{font-size:12px!important;font-weight:700;letter-spacing:.14em;color:var(--v45-muted)!important}
.status-value{font-size:22px!important;margin-top:4px!important;color:var(--v45-ink)}

.menu-category{
    min-height:44px;
    padding:10px 12px!important;
    margin:10px 0 5px!important;
    border:1px solid var(--v45-line)!important;
    border-radius:var(--v45-radius-sm)!important;
    background:rgba(255,250,240,.46)!important;
    color:var(--v45-accent-dark)!important;
    font:700 13px var(--v45-font-body)!important;
    letter-spacing:.12em;
    box-shadow:none!important;
    transform:none!important;
}
.menu-category:hover{background:rgba(255,250,240,.72)!important;box-shadow:none!important;transform:none!important}
.menu-category::after{font-size:16px!important;color:var(--v45-muted)}
.menu-group{padding:4px 0 8px 8px!important;border-left:1px solid var(--v45-line)!important}
.menu-item{
    display:flex;
    align-items:center;
    min-height:42px;
    padding:9px 11px!important;
    margin:2px 0!important;
    border:0!important;
    border-left:3px solid transparent!important;
    border-radius:var(--v45-radius-sm)!important;
    color:#53483c!important;
    font-size:14px!important;
    font-weight:600;
    line-height:1.25;
    transition:background-color .18s var(--v45-ease),color .18s var(--v45-ease),border-color .18s var(--v45-ease)!important;
    box-shadow:none!important;
    transform:none!important;
}
.menu-item::before{color:#aa895f!important;font-size:11px}
.menu-item:hover{
    background:rgba(117,80,44,.07)!important;
    color:var(--v45-accent-dark)!important;
    border-left-color:rgba(117,80,44,.48)!important;
    box-shadow:none!important;
    transform:none!important;
}
.menu-item.selected,
.v41-home-menu-item.selected{
    background:rgba(117,80,44,.13)!important;
    color:var(--v45-accent-dark)!important;
    border-left-color:var(--v45-accent)!important;
    box-shadow:none!important;
}
.menu-item.selected::before{color:var(--v45-accent)!important}
.v41-home-menu-item{
    border:1px solid var(--v45-line-strong)!important;
    border-left:3px solid var(--v45-accent)!important;
    background:rgba(255,250,240,.66)!important;
    box-shadow:none!important;
}
.v41-home-menu-item::after{background:var(--v45-accent)!important;font-size:8px!important}

/* =========================================================
   PAGE HEADER
========================================================= */
.v41-page-header{
    grid-template-columns:auto minmax(0,1fr) auto!important;
    gap:16px!important;
    margin:0 0 24px!important;
    padding:6px 0 22px!important;
    border:0!important;
    border-bottom:1px solid var(--v45-line-strong)!important;
    border-radius:0!important;
    background:transparent!important;
    box-shadow:none!important;
    overflow:visible!important;
}
.v41-page-header::after{display:none!important}
.v41-page-header-icon{
    width:44px!important;
    height:44px!important;
    border:1px solid var(--v45-line)!important;
    border-radius:12px!important;
    background:rgba(255,250,240,.7)!important;
    box-shadow:var(--v45-shadow-sm)!important;
    font-size:21px!important;
}
.v41-page-header-category{
    margin-bottom:5px!important;
    color:var(--v45-muted)!important;
    font:700 10px var(--v45-font-body)!important;
    letter-spacing:.2em!important;
}
.v41-page-header-title{
    color:var(--v45-accent-dark)!important;
    font-size:clamp(28px,3vw,44px)!important;
    line-height:1.08!important;
    letter-spacing:.08em!important;
}
.v41-page-header-description{margin-top:8px!important;color:var(--v45-muted)!important;font-size:14px!important;line-height:1.65!important}
.v41-page-header-actions button{
    min-width:42px!important;
    min-height:38px!important;
    padding:8px 11px!important;
    border:1px solid var(--v45-line)!important;
    border-radius:var(--v45-radius-sm)!important;
    background:rgba(255,250,240,.62)!important;
    color:var(--v45-accent-dark)!important;
    box-shadow:none!important;
}
.v41-page-header-actions button:hover{background:rgba(255,250,240,.94)!important;transform:none!important;box-shadow:var(--v45-shadow-sm)!important}

/* =========================================================
   CARDS / SURFACES
========================================================= */
.record-section{gap:16px!important}
.record-card,.item-card,.aono-card,.collection-card,.board-record,
.soul-exchange-panel,.exchange-card,.v41-dashboard-panel,.v41-option-card,
.v42-option-card,.v43-bgm-option-card,.v44-room-panel,.v44-pet-panel,
.v44-care-card,.v44-affinity-card{
    border:1px solid var(--v45-line)!important;
    border-radius:var(--v45-radius-md)!important;
    background:rgba(255,250,240,.76)!important;
    box-shadow:var(--v45-shadow-sm)!important;
}
.record-card,.item-card,.aono-card,.collection-card,.board-record{padding:20px!important}
.item-card:hover,.record-card:hover,.collection-card:hover{
    border-color:var(--v45-line-strong)!important;
}
.record-label,.item-title{
    padding-bottom:9px!important;
    margin-bottom:12px!important;
    border-bottom:1px solid var(--v45-line)!important;
    color:var(--v45-accent-dark)!important;
    font-size:15px!important;
    font-weight:800!important;
    letter-spacing:.06em;
}
.record-value,.item-text,.card-text{font-size:16px!important;color:#4e4439!important}
.card-name{font-size:23px!important;color:var(--v45-accent-dark)!important}
.card-no{font:700 11px var(--v45-font-body)!important;letter-spacing:.12em;color:var(--v45-muted)}

/* =========================================================
   BUTTONS / FORM CONTROLS
========================================================= */
.gacha-button,.exchange-button,.v41-setting-button,.v41-quick-button,
.v41-continue-button,.v42-toggle,.v43-bgm-toggle,.v44-room-button,.v44-care-button,
button[class*="button"]{
    border:1px solid rgba(82,53,24,.45)!important;
    border-radius:var(--v45-radius-sm)!important;
    box-shadow:none!important;
    transition:background-color .18s var(--v45-ease),border-color .18s var(--v45-ease),transform .18s var(--v45-ease),box-shadow .18s var(--v45-ease)!important;
}
.gacha-button,.exchange-button,.v41-continue-button{
    color:#fffaf0!important;
    background:linear-gradient(180deg,#80603d,#62411f)!important;
}
.gacha-button:hover,.exchange-button:hover:not(:disabled),.v41-continue-button:hover:not(:disabled){
    transform:translateY(-1px)!important;
    box-shadow:0 7px 18px rgba(57,34,12,.16)!important;
}
.gacha-button:active,.exchange-button:active,.v41-continue-button:active{transform:translateY(0)!important}

input,select,textarea,.board-input,.exchange-input,.exchange-select,.muscle-input{
    min-height:42px;
    padding:10px 12px!important;
    border:1px solid var(--v45-line-strong)!important;
    border-radius:var(--v45-radius-sm)!important;
    background:rgba(255,253,247,.88)!important;
    color:var(--v45-ink)!important;
    box-shadow:inset 0 1px 2px rgba(49,32,15,.04)!important;
}
input::placeholder,textarea::placeholder{color:#958676}

/* =========================================================
   DASHBOARD
========================================================= */
.v41-dashboard{color:var(--v45-ink)!important}
.v41-dashboard-hero{
    padding:28px!important;
    border:1px solid var(--v45-line)!important;
    border-radius:var(--v45-radius-lg)!important;
    background:linear-gradient(135deg,rgba(255,250,240,.86),rgba(239,225,200,.76))!important;
    box-shadow:var(--v45-shadow-md)!important;
}
.v41-dashboard-title{font-size:clamp(31px,4vw,52px)!important;letter-spacing:.1em!important;color:var(--v45-accent-dark)!important}
.v41-dashboard-subtitle,.v41-dashboard-date{color:var(--v45-muted)!important}
.v41-dashboard-grid{gap:16px!important}
.v41-dashboard-panel{padding:20px!important}
.v41-dashboard-stat{border:1px solid var(--v45-line)!important;background:rgba(255,250,240,.55)!important;box-shadow:none!important}
.v41-quick-button{background:rgba(255,250,240,.55)!important;color:var(--v45-accent-dark)!important}
.v41-quick-button:hover{background:rgba(255,250,240,.9)!important;transform:translateY(-1px)!important;box-shadow:var(--v45-shadow-sm)!important}

/* =========================================================
   GALLERY / MEDIA
========================================================= */
.gallery-grid{gap:18px!important;padding:8px!important}
.gallery-grid img,.guide-photo,.shop-photo{
    border:1px solid var(--v45-line)!important;
    border-radius:var(--v45-radius-md)!important;
    box-shadow:var(--v45-shadow-sm)!important;
}
.gallery-grid img{transition:transform .22s var(--v45-ease),box-shadow .22s var(--v45-ease)!important}
.gallery-grid img:hover{transform:translateY(-3px) scale(1.015)!important;box-shadow:var(--v45-shadow-md)!important}
.guide-photo:hover{transform:translateY(-2px)!important;box-shadow:var(--v45-shadow-md)!important}

/* =========================================================
   GACHA / BADGES
========================================================= */
.rarity{font:800 11px var(--v45-font-body)!important;letter-spacing:.1em;border:1px solid rgba(0,0,0,.08);box-shadow:none!important}
.rarity-ssr,.rarity-ur,.rarity-secret{box-shadow:0 3px 10px rgba(80,48,9,.12)!important}
.collection-grid,.exchange-grid{gap:16px!important}
.exchange-summary{border:1px solid var(--v45-line)!important;background:rgba(255,250,240,.58)!important}
.exchange-card{padding:17px!important}

/* =========================================================
   MY ROOM / PET VISUAL CLEANUP
========================================================= */
.v44-room-shell,.v44-pet-shell{font-family:var(--v45-font-body)!important}
.v44-room-heading,.v44-pet-heading{
    border-bottom:1px solid var(--v45-line)!important;
    padding-bottom:18px!important;
}
.v44-room-title,.v44-pet-title{letter-spacing:.06em!important;color:var(--v45-accent-dark)!important}
.v44-room-panel,.v44-pet-panel{padding:20px!important}
.v44-room-card-list,.v44-care-grid,.v44-affinity-grid{gap:14px!important}
.v44-care-card,.v44-affinity-card{padding:16px!important}
.v44-floating-pet{
    filter:drop-shadow(0 8px 16px rgba(48,29,12,.16));
}

/* =========================================================
   FIXED UI / FOOTER
========================================================= */
.footer{
    right:24px!important;
    bottom:10px!important;
    color:rgba(71,55,38,.7)!important;
    font:600 11px var(--v45-font-body)!important;
    letter-spacing:.12em;
}
.v41-back-to-top,.v42-ambience-floating,.v43-bgm-floating{
    border:1px solid var(--v45-line-strong)!important;
    background:rgba(255,250,240,.9)!important;
    color:var(--v45-accent-dark)!important;
    box-shadow:0 7px 20px rgba(49,32,15,.14)!important;
    backdrop-filter:blur(8px);
}
.v41-back-to-top:hover,.v42-ambience-floating:hover,.v43-bgm-floating:hover{
    transform:translateY(-2px)!important;
    box-shadow:0 10px 24px rgba(49,32,15,.18)!important;
}

/* =========================================================
   MOTION / REDUCED MOTION
========================================================= */
@media(prefers-reduced-motion:reduce){
    *,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
body.v41-motion-none *,body.v41-motion-none *::before,body.v41-motion-none *::after{
    transition:none!important;
}

/* =========================================================
   RESPONSIVE
========================================================= */
@media(max-width:1050px){
    .container{
        width:min(100% - 28px,1100px)!important;
        grid-template-columns:240px minmax(0,1fr)!important;
        gap:16px!important;
    }
    #content{font-size:16px!important}
}
@media(max-width:760px){
    body{height:auto!important;min-height:100vh!important;overflow:auto!important}
    .title{margin-top:18px!important;padding:0 14px}
    .container{
        width:calc(100% - 20px)!important;
        height:auto!important;
        min-height:calc(100vh - 90px)!important;
        margin:12px auto 70px!important;
        display:block!important;
    }
    .left,.right{height:auto!important}
    .left{max-height:none!important;overflow:visible!important;margin-bottom:14px}
    .right{overflow:visible!important}
    .record{height:auto!important;overflow:visible!important;padding-right:0}
    .window{padding:15px!important;border-radius:17px!important}
    .left .window{padding:12px!important}
    .menu-group.open{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;padding-left:0!important;border-left:0!important}
    .menu-item{font-size:12px!important;min-height:40px;padding:8px!important}
    .v41-page-header{grid-template-columns:auto minmax(0,1fr)!important;padding-bottom:17px!important}
    .v41-page-header-actions{grid-column:1/-1;justify-content:flex-start!important}
    .v41-page-header-description{font-size:13px!important}
    .record-card,.item-card,.aono-card,.collection-card,.board-record{padding:16px!important}
    .v41-dashboard-hero{padding:20px!important}
    .footer{display:none!important}
}
@media(max-width:480px){
    .title{font-size:27px!important;letter-spacing:.06em!important}
    .title::after{font-size:8px;letter-spacing:.2em}
    .menu-group.open{grid-template-columns:1fr!important}
    .v41-page-header-icon{display:none!important}
    .v41-page-header{grid-template-columns:1fr!important}
    .v41-page-header-title{font-size:28px!important}
    .v41-dashboard-grid,.collection-grid,.exchange-grid,.food-note-grid,.hobby-grid,.dislike-grid{grid-template-columns:1fr!important}
    .gallery-grid img{width:min(100%,240px)!important;height:auto!important;aspect-ratio:3/4}
}
`;
        document.head.appendChild(style);
    }

    function patchDashboard() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard) return;

        const headings = Array.from(dashboard.querySelectorAll(".v41-dashboard-panel-title h5"));
        const systemHeading = headings.find(el => el.textContent.trim() === "SYSTEM STATUS");
        const systemPanel = systemHeading?.closest(".v41-dashboard-panel");
        const version = systemPanel?.querySelector(".v41-dashboard-panel-title span");
        if (version) version.textContent = "VER.4.5";

        const latest = dashboard.querySelector(".v41-dashboard-latest");
        if (latest) latest.innerHTML = "<b>NEW UPDATE</b><br>フォント、余白、色、カード、メニュー、レスポンシブ表示を統一しました。";

        const rows = systemPanel?.querySelector(".v41-system-list");
        if (rows && !document.getElementById("v45DesignSystemRow")) {
            const row = document.createElement("div");
            row.id = "v45DesignSystemRow";
            row.className = "v41-system-row";
            row.innerHTML = "<span>デザインシステム</span><b>UNIFIED</b>";
            rows.appendChild(row);
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card v45-new-record" data-new-record="true">
    <div class="item-title">Ver.4.5 / DESIGN SYSTEM UPDATE</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>サイト全体のデザインを再設計</b><br>
        ・見出しは明朝体、本文と操作UIはゴシック体へ整理<br>
        ・PC表示を固定幅サイドバー＋最大幅コンテンツへ変更<br>
        ・枠線、影、角丸、余白、色のルールを統一<br>
        ・メニューの動きを抑え、現在地が分かりやすい表示へ変更<br>
        ・ページヘッダー、カード、ボタン、入力欄を共通デザイン化<br>
        ・ギャラリー、ガチャ、MY ROOM、RECORD PETも同じ基準で調整<br>
        ・スマートフォン表示とアクセシビリティを改善
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function tagBody() {
        document.body.classList.add("v45-design-system");
    }

    function enhance() {
        tagBody();
        patchDashboard();
    }

    function watchContent() {
        const content = document.getElementById("content");
        if (!content) return;
        const observer = new MutationObserver(() => requestAnimationFrame(enhance));
        observer.observe(content, { childList: true, subtree: false });
    }

    function boot() {
        injectStyles();
        addUpdateLog();
        enhance();
        watchContent();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
