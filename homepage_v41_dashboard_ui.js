/*
 * THE RECORD OF AONO SHOTA - Ver.4.1
 * ・HOMEダッシュボード
 * ・全ページ共通ヘッダー
 * ・ページ最上部へ戻るボタン
 * ・文字サイズ切替
 * ・アニメーション設定
 *
 * index.html の </body> 直前で、homepage_v40_effects_map.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV41DashboardUiStyles";
    const HOME_BUTTON_ID = "v41HomeMenuItem";
    const TOP_BUTTON_ID = "v41BackToTop";
    const FONT_STORAGE_KEY = "aonoV41FontSize";
    const MOTION_STORAGE_KEY = "aonoV41MotionMode";
    const LAST_PAGE_STORAGE_KEY = "aonoV41LastPage";
    const UPDATE_MARKER = "VER.4.1 DASHBOARD AND ACCESSIBILITY";
    const GAME_LIBRARY_COUNT = 366;

    const fontModes = {
        small: { label: "小さめ", factor: 0.90 },
        normal: { label: "標準", factor: 1.00 },
        large: { label: "大きめ", factor: 1.15 }
    };

    const motionModes = {
        standard: { label: "標準" },
        short: { label: "短縮" },
        none: { label: "なし" }
    };

    const pageMeta = {
        HOME: { icon: "⌂", category: "HOME", title: "HOME DASHBOARD", description: "記録・収集状況・主要ページをひとつにまとめた拠点。" },
        CHARACTER: { icon: "🧭", category: "PROFILE", title: "CHARACTER", description: "青野将大の基本情報と、人生の移動・活動地点の記録。" },
        PREFERENCES: { icon: "🎀", category: "PROFILE", title: "PREFERENCES", description: "趣味、好きな店、苦手なものをまとめた個人記録。" },
        SKILL: { icon: "✦", category: "PROFILE", title: "SKILL", description: "経験を通して身につけた技術と得意分野。" },
        TITLE: { icon: "👑", category: "PROFILE", title: "TITLE", description: "獲得した称号と、その称号にまつわる記録。" },
        "ITEM BOX": { icon: "🗝", category: "COLLECTION", title: "ITEM BOX", description: "思い入れのある道具やアイテムを保管する記録庫。" },
        "GAME LIBRARY": { icon: "🎮", category: "COLLECTION", title: "GAME LIBRARY", description: "所持ゲームを検索・絞り込みできるゲーム記録庫。" },
        GALLERY: { icon: "▣", category: "COLLECTION", title: "GALLERY", description: "ディズニーで撮影した写真を収めたアルバム。" },
        "DISNEY GUIDE": { icon: "⚓", category: "COLLECTION", title: "DISNEY GUIDE", description: "パークを楽しむための案内とおすすめ記録。" },
        "PERFORMANCE RECORD": { icon: "♪", category: "COLLECTION", title: "PERFORMANCE RECORD", description: "ギターなどの演奏投稿をまとめた音楽記録。" },
        MUSCLE: { icon: "🏋", category: "ADVENTURE", title: "MUSCLE", description: "基礎代謝と運動消費カロリーを計算するトレーニング記録。" },
        ACHIEVEMENTS: { icon: "🏅", category: "ADVENTURE", title: "ACHIEVEMENTS", description: "達成した挑戦や歩いて制覇したルートの記録。" },
        "AONO GACHA": { icon: "✧", category: "ADVENTURE", title: "AONO GACHA", description: "カードを集め、重複をSOULへ変換する収集システム。" },
        "AONO COLLECTION": { icon: "🃏", category: "ADVENTURE", title: "AONO COLLECTION", description: "獲得済みカードと未発見カードを確認する図鑑。" },
        "MESSAGE BOARD": { icon: "📜", category: "SYSTEM", title: "MESSAGE BOARD", description: "訪れた人が記録を残せる古代の掲示板。" },
        CONTACT: { icon: "✉", category: "SYSTEM", title: "CONTACT", description: "メールやXから連絡するための窓口。" },
        "UPDATE LOG": { icon: "↻", category: "SYSTEM", title: "UPDATE LOG", description: "THE RECORDに追加された機能と変更履歴。" },
        OPTION: { icon: "⚙", category: "SYSTEM", title: "OPTION", description: "文字サイズとアニメーションの表示設定。" }
    };

    let currentFontMode = readStoredMode(FONT_STORAGE_KEY, fontModes, "normal");
    let currentMotionMode = readStoredMode(MOTION_STORAGE_KEY, motionModes, "standard");
    let contentObserver = null;
    let overlayObserver = null;
    let enhanceScheduled = false;

    function readStoredMode(key, allowed, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value && Object.prototype.hasOwnProperty.call(allowed, value) ? value : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // 保存できない環境でも、その場の設定変更は有効にする。
        }
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.1 HOME MENU
========================================================= */
.v41-home-menu-item{
    position:relative;
    margin:0 0 10px;
    border:2px solid #91601f;
    border-radius:10px;
    background:linear-gradient(135deg,rgba(255,247,211,.96),rgba(219,182,112,.86));
    box-shadow:inset 0 0 10px rgba(255,255,255,.75),0 4px 9px rgba(72,38,5,.18);
    font-weight:bold;
}
.v41-home-menu-item::after{
    content:"DASHBOARD";
    margin-left:auto;
    padding:2px 7px;
    border-radius:999px;
    background:#744615;
    color:#fff4d2;
    font-size:9px;
    letter-spacing:1px;
}
.v41-home-menu-item.selected::after{background:#fff1c5;color:#5d3509}

/* =========================================================
   VER.4.1 PAGE HEADER
========================================================= */
.v41-page-header{
    position:relative;
    z-index:5;
    display:grid;
    grid-template-columns:auto minmax(0,1fr) auto;
    align-items:center;
    gap:14px;
    margin:0 0 18px;
    padding:15px 16px;
    border:2px solid rgba(111,70,24,.52);
    border-radius:15px;
    background:linear-gradient(135deg,rgba(255,250,226,.92),rgba(221,194,142,.78));
    box-shadow:inset 0 0 14px rgba(255,255,255,.78),0 5px 13px rgba(61,33,8,.16);
    overflow:hidden;
}
.v41-page-header::after{
    content:"";
    position:absolute;
    right:-42px;
    top:-55px;
    width:150px;
    height:150px;
    border:2px solid rgba(129,82,25,.13);
    border-radius:50%;
    pointer-events:none;
}
.v41-page-header-icon{
    display:grid;
    place-items:center;
    width:54px;
    height:54px;
    border:2px solid rgba(107,61,15,.45);
    border-radius:14px;
    background:rgba(255,250,230,.76);
    font-size:27px;
    box-shadow:inset 0 0 9px rgba(255,255,255,.9);
}
.v41-page-header-category{
    margin:0 0 2px;
    color:#8a5a22;
    font-size:11px;
    font-weight:bold;
    letter-spacing:3px;
}
.v41-page-header h3{
    margin:0;
    color:#4e2905;
    font-size:27px;
    letter-spacing:3px;
    line-height:1.2;
}
.v41-page-header-description{
    margin:5px 0 0;
    color:#6d5438;
    font-size:13px;
    line-height:1.55;
}
.v41-page-header-actions{position:relative;z-index:1;display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}
.v41-header-button{
    padding:8px 11px;
    border:2px solid #79501d;
    border-radius:9px;
    background:rgba(255,248,220,.84);
    color:#5b350d;
    font:700 12px inherit;
    letter-spacing:1px;
    cursor:pointer;
    transition:.18s transform,.18s background,.18s box-shadow;
}
.v41-header-button:hover{transform:translateY(-2px);background:#fff2c5;box-shadow:0 5px 10px rgba(70,39,8,.17)}

/* =========================================================
   VER.4.1 HOME DASHBOARD
========================================================= */
.v41-dashboard{display:flex;flex-direction:column;gap:15px}
.v41-dashboard-hero{
    position:relative;
    min-height:195px;
    display:flex;
    align-items:center;
    padding:26px;
    border:3px solid rgba(116,71,18,.58);
    border-radius:20px;
    overflow:hidden;
    background:
        radial-gradient(circle at 82% 15%,rgba(255,238,162,.78),transparent 30%),
        linear-gradient(135deg,rgba(255,249,219,.95),rgba(206,163,88,.83));
    box-shadow:inset 0 0 20px rgba(255,255,255,.76),0 8px 18px rgba(58,30,4,.2);
}
.v41-dashboard-hero::before{
    content:"✦";
    position:absolute;
    right:42px;
    top:28px;
    color:rgba(111,67,17,.22);
    font-size:105px;
    transform:rotate(13deg);
}
.v41-dashboard-kicker{margin:0 0 5px;color:#8a5a22;font-size:12px;font-weight:bold;letter-spacing:4px}
.v41-dashboard-hero h4{margin:0;color:#4b2705;font-size:35px;letter-spacing:4px;line-height:1.25}
.v41-dashboard-hero p{max-width:650px;margin:10px 0 0;color:#654b2d;font-size:15px;line-height:1.75}
.v41-dashboard-date{display:inline-block;margin-top:15px;padding:6px 11px;border:1px solid rgba(102,62,18,.35);border-radius:999px;background:rgba(255,255,255,.47);font-size:12px;font-weight:bold;letter-spacing:1px}
.v41-dashboard-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}
.v41-dashboard-stat{
    min-height:112px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:14px;
    border:2px solid rgba(112,71,25,.44);
    border-radius:14px;
    text-align:center;
    background:rgba(255,249,224,.72);
    box-shadow:inset 0 0 11px rgba(255,255,255,.7),0 4px 10px rgba(64,34,7,.12);
}
.v41-dashboard-stat span{color:#7f5e36;font-size:11px;font-weight:bold;letter-spacing:2px}
.v41-dashboard-stat b{display:block;margin:5px 0 1px;color:#60350b;font-size:28px;line-height:1.15}
.v41-dashboard-stat small{color:#856b4b;font-size:11px}
.v41-dashboard-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:14px}
.v41-dashboard-panel{
    padding:18px;
    border:2px solid rgba(111,70,24,.44);
    border-radius:16px;
    background:rgba(255,249,226,.73);
    box-shadow:inset 0 0 13px rgba(255,255,255,.72),0 5px 12px rgba(58,31,7,.13);
}
.v41-dashboard-panel-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 13px;padding-bottom:9px;border-bottom:1px dashed rgba(114,73,28,.38)}
.v41-dashboard-panel-title h5{margin:0;color:#5c350d;font-size:19px;letter-spacing:2px}
.v41-dashboard-panel-title span{color:#927146;font-size:10px;font-weight:bold;letter-spacing:2px}
.v41-dashboard-quick{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.v41-quick-button{
    display:flex;
    align-items:center;
    gap:10px;
    min-height:62px;
    padding:11px 12px;
    border:2px solid rgba(119,77,29,.47);
    border-radius:12px;
    background:linear-gradient(135deg,rgba(255,255,255,.71),rgba(237,217,176,.69));
    color:#56310d;
    font:700 14px inherit;
    text-align:left;
    cursor:pointer;
    transition:.18s transform,.18s box-shadow,.18s background;
}
.v41-quick-button:hover{transform:translateY(-3px);background:#fff4cf;box-shadow:0 6px 12px rgba(70,38,8,.15)}
.v41-quick-icon{display:grid;place-items:center;flex:0 0 34px;width:34px;height:34px;border-radius:9px;background:rgba(129,82,25,.12);font-size:19px}
.v41-system-list{display:grid;gap:9px}
.v41-system-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 11px;border-radius:10px;background:rgba(255,255,255,.46);font-size:13px}
.v41-system-row b{color:#63380e}
.v41-dashboard-latest{margin-top:12px;padding:12px;border-left:5px solid #9b6b2f;border-radius:8px;background:rgba(126,79,25,.08);font-size:13px;line-height:1.7}
.v41-continue-button{width:100%;margin-top:12px;padding:11px;border:2px solid #704617;border-radius:10px;background:#84551e;color:#fff5d2;font:700 14px inherit;cursor:pointer}
.v41-continue-button:disabled{opacity:.52;cursor:not-allowed}

/* =========================================================
   VER.4.1 OPTION
========================================================= */
.v41-option-shell{display:grid;gap:14px}
.v41-option-card{
    padding:19px;
    border:3px solid rgba(111,70,24,.5);
    border-radius:16px;
    background:rgba(255,249,226,.76);
    box-shadow:inset 0 0 14px rgba(255,255,255,.74),0 5px 12px rgba(61,32,6,.14);
}
.v41-option-card h4{margin:0 0 6px;color:#5b330c;font-size:21px;letter-spacing:2px}
.v41-option-card>p{margin:0 0 14px;color:#735b3e;font-size:13px;line-height:1.7}
.v41-setting-buttons{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.v41-setting-button{
    min-height:72px;
    padding:10px;
    border:2px solid rgba(112,70,23,.52);
    border-radius:12px;
    background:rgba(255,255,255,.57);
    color:#59330c;
    font:700 15px inherit;
    cursor:pointer;
    transition:.18s transform,.18s background,.18s box-shadow;
}
.v41-setting-button small{display:block;margin-top:5px;color:#846a49;font-size:10px;font-weight:normal;line-height:1.4}
.v41-setting-button:hover{transform:translateY(-2px);background:#fff3cb}
.v41-setting-button.active{border-color:#5d350c;background:#81531e;color:#fff4d1;box-shadow:0 0 0 3px rgba(255,216,126,.38)}
.v41-setting-button.active small{color:#f7dfb0}
.v41-option-status{margin-top:13px;padding:10px 12px;border-radius:10px;background:rgba(112,70,23,.09);font-size:13px;font-weight:bold;color:#674114}
.v41-option-note{padding:13px;border:2px dashed rgba(112,70,23,.4);border-radius:12px;background:rgba(255,255,255,.42);color:#71583a;font-size:12px;line-height:1.75}

/* =========================================================
   VER.4.1 BACK TO TOP
========================================================= */
.v41-back-to-top{
    position:fixed;
    right:22px;
    bottom:101px;
    z-index:10019;
    display:grid;
    place-items:center;
    width:46px;
    height:46px;
    border:2px solid #704719;
    border-radius:50%;
    background:linear-gradient(145deg,#fff3c9,#c9974d);
    color:#3d2205;
    font:900 20px inherit;
    cursor:pointer;
    box-shadow:0 5px 14px rgba(40,20,0,.35),inset 0 0 8px rgba(255,255,255,.7);
    opacity:0;
    visibility:hidden;
    transform:translateY(10px);
    transition:.2s opacity,.2s visibility,.2s transform,.2s filter;
}
.v41-back-to-top.visible{opacity:1;visibility:visible;transform:none}
.v41-back-to-top:hover{filter:brightness(1.08);transform:translateY(-2px)}

/* =========================================================
   VER.4.1 MOTION MODES
========================================================= */
body.v41-motion-short .record.page-changing,
body.v41-motion-short #content.page-transition,
body.v41-motion-short .v40-card-deal,
body.v41-motion-short .v40-photo-develop,
body.v41-motion-short .v40-content-update .item-card{
    animation-duration:.28s!important;
    animation-delay:0s!important;
}
body.v41-motion-short .menu-group.open{animation-duration:.1s!important}
body.v41-motion-none .v40-transition-overlay,
body.v41-motion-none .page-particle-layer,
body.v41-motion-none .cursor-spark{display:none!important}
body.v41-motion-none .record.page-changing,
body.v41-motion-none #content.page-transition,
body.v41-motion-none .v40-card-deal,
body.v41-motion-none .v40-photo-develop,
body.v41-motion-none .v40-content-update .item-card,
body.v41-motion-none .menu-group.open,
body.v41-motion-none .favorite-panel,
body.v41-motion-none .life-map-point.selected .life-map-dot::after{
    animation:none!important;
}
body.v41-motion-none #content *,
body.v41-motion-none #content *::before,
body.v41-motion-none #content *::after,
body.v41-motion-none .menu-item,
body.v41-motion-none .menu-category,
body.v41-motion-none .v41-back-to-top{
    transition-duration:.001ms!important;
    scroll-behavior:auto!important;
}

@media(max-width:900px){
    .v41-dashboard-stats{grid-template-columns:repeat(2,1fr)}
    .v41-dashboard-grid{grid-template-columns:1fr}
    .v41-page-header{grid-template-columns:auto minmax(0,1fr)}
    .v41-page-header-actions{grid-column:1/-1;justify-content:flex-start}
}
@media(max-width:620px){
    .v41-page-header{gap:10px;padding:13px}
    .v41-page-header-icon{width:45px;height:45px;font-size:22px}
    .v41-page-header h3{font-size:21px;letter-spacing:2px}
    .v41-page-header-description{font-size:12px}
    .v41-dashboard-hero{min-height:175px;padding:19px}
    .v41-dashboard-hero h4{font-size:27px;letter-spacing:2px}
    .v41-dashboard-stats{grid-template-columns:1fr 1fr;gap:8px}
    .v41-dashboard-stat{min-height:95px;padding:10px}
    .v41-dashboard-stat b{font-size:23px}
    .v41-dashboard-quick{grid-template-columns:1fr}
    .v41-setting-buttons{grid-template-columns:1fr}
    .v41-back-to-top{right:12px;bottom:67px;width:43px;height:43px}
}
`;
        document.head.appendChild(style);
    }

    function getPageMeta(pageName) {
        return pageMeta[pageName] || {
            icon: "📜",
            category: (typeof pageCategories !== "undefined" && pageCategories[pageName]) || "RECORD",
            title: pageName || "RECORD",
            description: "THE RECORD OF AONO SHOTAに保存された記録。"
        };
    }

    function dashboardHtml() {
        return `
<section class="v41-dashboard" aria-label="HOME DASHBOARD">
    <div class="v41-dashboard-hero">
        <div>
            <p class="v41-dashboard-kicker">THE RECORD CONTROL ROOM</p>
            <h4>WELCOME BACK,<br>AONO SHOTA.</h4>
            <p>プロフィール、ゲーム、写真、筋トレ、カード収集。増え続ける記録へ、ここからすぐにアクセスできます。</p>
            <span id="v41DashboardDate" class="v41-dashboard-date">TODAY</span>
        </div>
    </div>

    <div class="v41-dashboard-stats">
        <article class="v41-dashboard-stat"><span>PLAYER LEVEL</span><b id="v41DashLevel">---</b><small>現在のレベル</small></article>
        <article class="v41-dashboard-stat"><span>PLAY TIME</span><b id="v41DashDays">---</b><small>DAYS</small></article>
        <article class="v41-dashboard-stat"><span>GAME LIBRARY</span><b id="v41DashGames">${GAME_LIBRARY_COUNT}</b><small>REGISTERED</small></article>
        <article class="v41-dashboard-stat"><span>COLLECTION</span><b id="v41DashCollection">0 / 170</b><small id="v41DashSoul">0 SOUL</small></article>
    </div>

    <div class="v41-dashboard-grid">
        <section class="v41-dashboard-panel">
            <div class="v41-dashboard-panel-title"><h5>QUICK ACCESS</h5><span>SELECT RECORD</span></div>
            <div class="v41-dashboard-quick">
                <button class="v41-quick-button" data-v41-open-page="CHARACTER" type="button"><span class="v41-quick-icon">🧭</span><span>CHARACTER</span></button>
                <button class="v41-quick-button" data-v41-open-page="GAME LIBRARY" type="button"><span class="v41-quick-icon">🎮</span><span>GAME LIBRARY</span></button>
                <button class="v41-quick-button" data-v41-open-page="GALLERY" type="button"><span class="v41-quick-icon">▣</span><span>GALLERY</span></button>
                <button class="v41-quick-button" data-v41-open-page="MUSCLE" type="button"><span class="v41-quick-icon">🏋</span><span>MUSCLE</span></button>
                <button class="v41-quick-button" data-v41-open-page="AONO COLLECTION" type="button"><span class="v41-quick-icon">🃏</span><span>COLLECTION</span></button>
                <button class="v41-quick-button" data-v41-open-page="UPDATE LOG" type="button"><span class="v41-quick-icon">↻</span><span>UPDATE LOG</span></button>
            </div>
        </section>

        <section class="v41-dashboard-panel">
            <div class="v41-dashboard-panel-title"><h5>SYSTEM STATUS</h5><span>VER.4.1</span></div>
            <div class="v41-system-list">
                <div class="v41-system-row"><span>文字サイズ</span><b id="v41DashFontMode">標準</b></div>
                <div class="v41-system-row"><span>アニメーション</span><b id="v41DashMotionMode">標準</b></div>
                <div class="v41-system-row"><span>最新アップデート</span><b>Ver.4.1</b></div>
            </div>
            <div class="v41-dashboard-latest"><b>NEW UPDATE</b><br>HOMEダッシュボード、共通ページヘッダー、最上部ボタン、文字サイズ・アニメーション設定を追加しました。</div>
            <button id="v41ContinueButton" class="v41-continue-button" data-v41-continue type="button">前回の記録を開く</button>
        </section>
    </div>
</section>`;
    }

    function optionHtml() {
        return `
<section class="v41-option-shell" aria-label="表示設定">
    <div class="v41-option-card">
        <h4>🔤 TEXT SIZE</h4>
        <p>記録ページ内の文字サイズを切り替えます。選んだ設定は、このブラウザに保存されます。</p>
        <div class="v41-setting-buttons" role="group" aria-label="文字サイズ">
            <button class="v41-setting-button" data-v41-font="small" type="button">小さめ<small>情報量を多く表示</small></button>
            <button class="v41-setting-button" data-v41-font="normal" type="button">標準<small>通常の表示サイズ</small></button>
            <button class="v41-setting-button" data-v41-font="large" type="button">大きめ<small>文章を読みやすく表示</small></button>
        </div>
        <div id="v41FontStatus" class="v41-option-status">現在：標準</div>
    </div>

    <div class="v41-option-card">
        <h4>✨ ANIMATION</h4>
        <p>ページ移動やカード表示などの演出速度を変更します。「なし」では装飾パーティクルも非表示になります。</p>
        <div class="v41-setting-buttons" role="group" aria-label="アニメーション設定">
            <button class="v41-setting-button" data-v41-motion="standard" type="button">標準<small>すべての演出を再生</small></button>
            <button class="v41-setting-button" data-v41-motion="short" type="button">短縮<small>移動演出を素早く再生</small></button>
            <button class="v41-setting-button" data-v41-motion="none" type="button">なし<small>演出をほぼ表示しない</small></button>
        </div>
        <div id="v41MotionStatus" class="v41-option-status">現在：標準</div>
    </div>

    <div class="v41-option-note">
        🔊 効果音は、画面右下のスピーカーボタンからON / OFFを切り替えられます。<br>
        設定は自動保存されるため、次回アクセス時にも同じ状態で表示されます。
    </div>
</section>`;
    }

    function registerPages() {
        if (typeof records !== "undefined") {
            records.HOME = dashboardHtml();
            records.OPTION = optionHtml();
        }
        if (typeof pageCategories !== "undefined") {
            pageCategories.HOME = "HOME";
            pageCategories.OPTION = "SYSTEM";
        }
        if (typeof pageBackgrounds !== "undefined") {
            pageBackgrounds.HOME = "home_character_background.png";
            pageBackgrounds.OPTION = "home_character_background.png";
        }
        if (typeof pageThemes !== "undefined") {
            pageThemes.HOME = "profile";
            pageThemes.OPTION = "system";
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
<div class="item-card">
    <div class="item-title">📜 Ver.4.1</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>⌂ HOMEダッシュボードを実装</b><br>
        ・LEVEL、PLAY TIME、ゲーム登録数、カード収集状況を一覧表示<br>
        ・主要ページへ移動できるQUICK ACCESSを追加<br>
        ・前回閲覧した記録へ戻る機能を追加<br><br>
        <b>📖 全ページ共通ヘッダーを追加</b><br>
        ・カテゴリ、ページ名、説明を統一デザインで表示<br>
        ・HOMEとOPTIONへのショートカットを追加<br><br>
        <b>↑ ページ最上部へ戻るボタンを追加</b><br>
        ・長いページをスクロールしたときだけ表示<br><br>
        <b>🔤 文字サイズ切替を追加</b><br>
        ・小さめ、標準、大きめの3段階に対応<br><br>
        <b>✨ アニメーション設定を追加</b><br>
        ・標準、短縮、なしの3段階に対応
    </div>
</div>`;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function addHomeMenuItem() {
        if (document.getElementById(HOME_BUTTON_ID)) return;
        const firstCategory = document.querySelector(".menu-category");
        if (!firstCategory) return;

        const item = document.createElement("div");
        item.id = HOME_BUTTON_ID;
        item.className = "menu-item v41-home-menu-item";
        item.dataset.page = "HOME";
        item.dataset.v41Home = "true";
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.innerHTML = '<span class="menu-thumb">⌂</span><span class="menu-label">HOME</span>';
        firstCategory.insertAdjacentElement("beforebegin", item);

        item.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                renderHome(true);
            }
        });
    }

    function createBackToTopButton() {
        if (document.getElementById(TOP_BUTTON_ID)) return;
        const button = document.createElement("button");
        button.id = TOP_BUTTON_ID;
        button.className = "v41-back-to-top";
        button.type = "button";
        button.title = "ページ最上部へ戻る";
        button.setAttribute("aria-label", "ページ最上部へ戻る");
        button.textContent = "↑";
        document.body.appendChild(button);

        const recordWindow = document.querySelector(".window.record");
        const updateVisibility = () => {
            if (!recordWindow) return;
            button.classList.toggle("visible", recordWindow.scrollTop > 260);
        };

        recordWindow?.addEventListener("scroll", updateVisibility, { passive: true });
        button.addEventListener("click", () => {
            recordWindow?.scrollTo({
                top: 0,
                behavior: currentMotionMode === "none" ? "auto" : "smooth"
            });
            if (typeof playUiSound === "function") playUiSound("click");
        });
    }

    function renderHome(playSound) {
        const content = document.getElementById("content");
        if (!content) return;

        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("selected"));
        document.getElementById(HOME_BUTTON_ID)?.classList.add("selected");

        content.innerHTML = dashboardHtml();

        if (typeof applyPagePresentation === "function") {
            applyPagePresentation("HOME");
        } else {
            const category = document.getElementById("locationCategory");
            const page = document.getElementById("locationPage");
            if (category) category.textContent = "HOME";
            if (page) page.textContent = "HOME";
        }

        document.querySelector(".window.record")?.scrollTo({ top: 0, behavior: "auto" });
        if (playSound && typeof playUiSound === "function") playUiSound("page");
        scheduleEnhance();
    }

    function openPage(pageName) {
        if (!pageName) return;
        if (pageName === "HOME") {
            renderHome(true);
            return;
        }

        const item = Array.from(document.querySelectorAll(".menu-item[data-page]")).find(
            element => element.dataset.page === pageName
        );

        if (item) {
            item.click();
            return;
        }

        if (typeof records !== "undefined" && records[pageName]) {
            const content = document.getElementById("content");
            if (!content) return;
            content.innerHTML = records[pageName];
            if (typeof applyPagePresentation === "function") applyPagePresentation(pageName);
        }
    }

    function currentRenderedPage() {
        if (document.querySelector(".v41-dashboard")) return "HOME";
        if (typeof currentPageName !== "undefined" && currentPageName && currentPageName !== "RECORD") {
            return currentPageName;
        }
        return document.getElementById("locationPage")?.textContent?.trim() || "HOME";
    }

    function injectPageHeader(pageName) {
        const content = document.getElementById("content");
        if (!content || content.querySelector(":scope > .v41-page-header")) return;

        const meta = getPageMeta(pageName);
        const header = document.createElement("header");
        header.className = "v41-page-header";
        header.dataset.page = pageName;
        header.innerHTML = `
            <div class="v41-page-header-icon" aria-hidden="true">${meta.icon}</div>
            <div>
                <p class="v41-page-header-category">${meta.category} RECORD</p>
                <h3>${meta.title}</h3>
                <p class="v41-page-header-description">${meta.description}</p>
            </div>
            <div class="v41-page-header-actions">
                ${pageName === "HOME" ? "" : '<button class="v41-header-button" data-v41-home type="button">⌂ HOME</button>'}
                ${pageName === "OPTION" ? "" : '<button class="v41-header-button" data-v41-open-page="OPTION" type="button">⚙ OPTION</button>'}
            </div>`;
        content.prepend(header);
    }

    function updateDashboardValues() {
        if (!document.querySelector(".v41-dashboard")) return;

        const level = document.getElementById("level")?.textContent?.trim() || "---";
        const days = document.getElementById("days")?.textContent?.trim() || "---";
        let owned = 0;
        let total = 170;
        let soul = 0;

        try {
            if (typeof gachaData !== "undefined") {
                owned = Array.isArray(gachaData.owned) ? gachaData.owned.length : 0;
                soul = Number(gachaData.soul || 0);
            }
            if (typeof aonoCards !== "undefined" && Array.isArray(aonoCards)) total = aonoCards.length;
        } catch (error) {
            // ガチャデータがまだない場合は初期値を使う。
        }

        setText("v41DashLevel", level);
        setText("v41DashDays", days);
        setText("v41DashGames", String(GAME_LIBRARY_COUNT));
        setText("v41DashCollection", `${owned} / ${total}`);
        setText("v41DashSoul", `${soul.toLocaleString("ja-JP")} SOUL`);
        setText("v41DashFontMode", fontModes[currentFontMode].label);
        setText("v41DashMotionMode", motionModes[currentMotionMode].label);

        const today = new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long"
        }).format(new Date());
        setText("v41DashboardDate", today);

        let lastPage = "";
        try {
            lastPage = localStorage.getItem(LAST_PAGE_STORAGE_KEY) || "";
        } catch (error) {}

        const continueButton = document.getElementById("v41ContinueButton");
        if (continueButton) {
            const usable = lastPage && lastPage !== "HOME" && pageMeta[lastPage];
            continueButton.disabled = !usable;
            continueButton.dataset.page = usable ? lastPage : "";
            const label = usable ? `前回の記録「${lastPage}」を開く` : "前回の記録はまだありません";
            if (continueButton.textContent !== label) continueButton.textContent = label;
        }
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== String(value)) element.textContent = value;
    }

    function rememberPage(pageName) {
        if (!pageName || pageName === "HOME" || pageName === "OPTION" || pageName === "RECORD") return;
        try {
            localStorage.setItem(LAST_PAGE_STORAGE_KEY, pageName);
        } catch (error) {}
    }

    function textBearingElements(root) {
        const blockedTags = new Set(["SCRIPT", "STYLE", "SVG", "PATH", "IMG", "SOURCE", "AUDIO", "VIDEO", "CANVAS"]);
        return Array.from(root.querySelectorAll("*")).filter(element => {
            if (blockedTags.has(element.tagName)) return false;
            if (element.closest("svg")) return false;
            if (element.matches("input,select,textarea,button")) return true;
            return Array.from(element.childNodes).some(node =>
                node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
            );
        });
    }

    function applyFontSize() {
        const content = document.getElementById("content");
        if (!content) return;
        const factor = fontModes[currentFontMode].factor;
        const elements = textBearingElements(content);

        const uncaptured = elements.filter(element => !element.dataset.v41BaseFontSize);
        const capturedSizes = uncaptured.map(element => [
            element,
            Number.parseFloat(getComputedStyle(element).fontSize) || 16
        ]);
        capturedSizes.forEach(([element, size]) => {
            element.dataset.v41BaseFontSize = String(size);
        });

        elements.forEach(element => {
            const base = Number.parseFloat(element.dataset.v41BaseFontSize || "16");
            if (currentFontMode === "normal") {
                element.style.removeProperty("font-size");
            } else {
                element.style.fontSize = `${(base * factor).toFixed(2)}px`;
            }
        });

        updateSettingButtons();
        updateDashboardValues();
    }

    function setFontMode(mode) {
        if (!fontModes[mode]) return;
        currentFontMode = mode;
        saveSetting(FONT_STORAGE_KEY, mode);
        applyFontSize();
        if (typeof playUiSound === "function") playUiSound("click");
    }

    function applyMotionMode(mode) {
        if (!motionModes[mode]) return;
        currentMotionMode = mode;
        document.body.classList.remove("v41-motion-standard", "v41-motion-short", "v41-motion-none");
        document.body.classList.add(`v41-motion-${mode}`);
        saveSetting(MOTION_STORAGE_KEY, mode);

        if (mode === "none") {
            document.querySelector(".page-particle-layer")?.remove();
            document.querySelectorAll(".cursor-spark").forEach(element => element.remove());
            if (typeof ambientTimer !== "undefined") window.clearInterval(ambientTimer);
        } else if (typeof startAmbientParticles === "function" && typeof currentPageTheme !== "undefined") {
            startAmbientParticles(currentPageTheme);
        }

        tuneTransitionAnimations();
        updateSettingButtons();
        updateDashboardValues();
    }

    function setMotionMode(mode) {
        if (!motionModes[mode]) return;
        applyMotionMode(mode);
        if (typeof playUiSound === "function") playUiSound("click");
    }

    function updateSettingButtons() {
        document.querySelectorAll("[data-v41-font]").forEach(button => {
            const active = button.dataset.v41Font === currentFontMode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        document.querySelectorAll("[data-v41-motion]").forEach(button => {
            const active = button.dataset.v41Motion === currentMotionMode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        setText("v41FontStatus", `現在：${fontModes[currentFontMode].label}`);
        setText("v41MotionStatus", `現在：${motionModes[currentMotionMode].label}`);
    }

    function tuneTransitionAnimations() {
        const overlay = document.getElementById("aonoV40TransitionOverlay");
        if (!overlay) return;

        const tune = () => {
            const animations = overlay.getAnimations ? overlay.getAnimations({ subtree: true }) : [];
            animations.forEach(animation => {
                try {
                    if (currentMotionMode === "none") {
                        animation.finish();
                    } else {
                        animation.playbackRate = currentMotionMode === "short" ? 2.4 : 1;
                    }
                } catch (error) {}
            });
        };

        requestAnimationFrame(() => requestAnimationFrame(tune));
    }

    function watchTransitionOverlay() {
        const overlay = document.getElementById("aonoV40TransitionOverlay");
        if (!overlay || overlayObserver) return;
        overlayObserver = new MutationObserver(tuneTransitionAnimations);
        overlayObserver.observe(overlay, { attributes: true, childList: true, subtree: true });
    }

    function enhanceCurrentPage() {
        enhanceScheduled = false;
        const pageName = currentRenderedPage();
        injectPageHeader(pageName);
        rememberPage(pageName);
        updateSettingButtons();
        updateDashboardValues();
        applyFontSize();
        watchTransitionOverlay();
    }

    function scheduleEnhance() {
        if (enhanceScheduled) return;
        enhanceScheduled = true;
        requestAnimationFrame(enhanceCurrentPage);
    }

    function watchContent() {
        const content = document.getElementById("content");
        if (!content || contentObserver) return;
        contentObserver = new MutationObserver(scheduleEnhance);
        contentObserver.observe(content, { childList: true, subtree: true });
    }

    function bindGlobalActions() {
        document.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const homeButton = target.closest("[data-v41-home]");
            if (homeButton) {
                event.preventDefault();
                renderHome(true);
                return;
            }

            const continueButton = target.closest("[data-v41-continue]");
            if (continueButton) {
                const page = continueButton.dataset.page;
                if (page) openPage(page);
                return;
            }

            const pageButton = target.closest("[data-v41-open-page]");
            if (pageButton) {
                openPage(pageButton.dataset.v41OpenPage);
                return;
            }

            const fontButton = target.closest("[data-v41-font]");
            if (fontButton) {
                setFontMode(fontButton.dataset.v41Font);
                return;
            }

            const motionButton = target.closest("[data-v41-motion]");
            if (motionButton) {
                setMotionMode(motionButton.dataset.v41Motion);
            }
        });

        document.addEventListener("click", tuneTransitionAnimations, true);
        document.addEventListener("keydown", event => {
            if (event.key === "Enter") tuneTransitionAnimations();
        }, true);
    }

    function boot() {
        injectStyles();
        registerPages();
        addUpdateLog();
        addHomeMenuItem();
        createBackToTopButton();
        bindGlobalActions();
        watchContent();
        applyMotionMode(currentMotionMode);
        renderHome(false);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
