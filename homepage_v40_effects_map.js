/*
 * THE RECORD OF AONO SHOTA - Ver.4.0
 * ・カテゴリ別ページ遷移演出
 * ・GAME LIBRARY / GALLERY / MUSCLE / UPDATE LOG専用演出
 * ・CHARACTER内にクリック式ライフマップを追加
 *
 * index.html の </body> 直前で、homepage_v37_update.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV40EffectsMapStyles";
    const OVERLAY_ID = "aonoV40TransitionOverlay";
    const UPDATE_MARKER = "VER.4.0 TRANSITION AND LIFE MAP";

    let pendingPageName = "CHARACTER";
    let transitionTimer = null;

    const mapEntries = {
        tsu: {
            title: "三重県 津市",
            label: "START POINT",
            period: "2004.09.21",
            text: "人生の記録が始まった出生地。ここから青野将大のルートがスタートしました。",
            relatedPage: "CHARACTER",
            relatedLabel: "CHARACTERを開く"
        },
        wakayama: {
            title: "和歌山県",
            label: "EARLY MEMORY",
            period: "幼少期",
            text: "幼少期を過ごした場所。三重県から東京都へ続く人生ルートの大切な中継地点です。",
            relatedPage: "CHARACTER",
            relatedLabel: "CHARACTERを開く"
        },
        nishikasai: {
            title: "東京都",
            label: "HOME BASE",
            period: "6歳ごろから現在",
            text: "現在の生活拠点。ゲーム、ギター、料理、長距離散歩など、多くの記録がここから生まれています。",
            relatedPage: "PREFERENCES",
            relatedLabel: "PREFERENCESを開く"
        },
        shibuya: {
            title: "東京都 渋谷",
            label: "STUDY AREA",
            period: "大学生活",
            text: "法律や情報社会、国際法などを学ぶ活動地点。学びと企画の記録を積み重ねています。",
            relatedPage: "SKILL",
            relatedLabel: "SKILLを開く"
        },
        maihama: {
            title: "舞浜 / 東京ディズニーリゾート",
            label: "FAVORITE PLACE",
            period: "現在",
            text: "パークの景色、設定、ショーや空間演出を楽しむお気に入りの場所。ディズニー関連の記録へつながります。",
            relatedPage: "GALLERY",
            relatedLabel: "GALLERYを開く"
        },
        walking: {
            title: "都内・地下鉄徒歩ルート",
            label: "WALKING QUEST",
            period: "継続中",
            text: "半蔵門線・浅草線・新宿線を徒歩で制覇。都内を長距離で歩き、街の構造や休憩場所も観察しています。",
            relatedPage: "ACHIEVEMENTS",
            relatedLabel: "ACHIEVEMENTSを開く"
        }
    };

    const lifeMapHtml = `
        <section class="life-map-card" aria-labelledby="lifeMapTitle">
            <div class="life-map-heading">
                <div>
                    <p class="life-map-kicker">AONO LIFE ROUTE</p>
                    <h3 id="lifeMapTitle">人生と記録のマップ</h3>
                    <p>地点をクリックすると、その場所に関する記録が開きます。</p>
                </div>
                <span class="life-map-compass" aria-hidden="true">✦</span>
            </div>

            <div class="life-map-stage">
                <svg class="life-map-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
                    <path class="life-map-main-line" d="M105 420 C210 395 250 455 350 405 S505 315 585 270 S705 220 815 160" />
                    <path class="life-map-branch-line" d="M585 270 C660 335 700 375 790 410" />
                    <path class="life-map-branch-line" d="M585 270 C655 210 690 125 770 92" />
                    <path class="life-map-walk-line" d="M585 270 C700 275 765 270 900 300" />
                </svg>

                <button class="life-map-point" style="--x:10%;--y:75%" data-map-id="tsu" type="button">
                    <span class="life-map-dot"></span><span>津市</span>
                </button>
                <button class="life-map-point" style="--x:34%;--y:72%" data-map-id="wakayama" type="button">
                    <span class="life-map-dot"></span><span>和歌山</span>
                </button>
                <button class="life-map-point selected" style="--x:58%;--y:48%" data-map-id="nishikasai" type="button">
                    <span class="life-map-dot"></span><span>東京都</span>
                </button>
                <button class="life-map-point" style="--x:77%;--y:73%" data-map-id="shibuya" type="button">
                    <span class="life-map-dot"></span><span>渋谷</span>
                </button>
                <button class="life-map-point" style="--x:75%;--y:15%" data-map-id="maihama" type="button">
                    <span class="life-map-dot"></span><span>舞浜</span>
                </button>
                <button class="life-map-point" style="--x:90%;--y:53%" data-map-id="walking" type="button">
                    <span class="life-map-dot"></span><span>徒歩記録</span>
                </button>

                <div class="life-map-route-label life-map-route-label-main">三重 → 和歌山 → 東京</div>
                <div class="life-map-route-label life-map-route-label-walk">半蔵門線・浅草線・新宿線</div>
            </div>

            <article id="lifeMapDetail" class="life-map-detail" aria-live="polite">
                <div class="life-map-detail-badge" id="lifeMapDetailLabel">HOME BASE</div>
                <div class="life-map-detail-main">
                    <p id="lifeMapDetailPeriod">6歳ごろから現在</p>
                    <h4 id="lifeMapDetailTitle">東京都</h4>
                    <p id="lifeMapDetailText">現在の生活拠点。ゲーム、ギター、料理、長距離散歩など、多くの記録がここから生まれています。</p>
                </div>
                <button id="lifeMapOpenRecord" class="life-map-open-button" data-open-page="PREFERENCES" type="button">
                    PREFERENCESを開く
                </button>
            </article>

            <p class="life-map-note">※ 正確な縮尺の地図ではなく、人生の移動と活動地点を表した路線図風マップです。</p>
        </section>
    `;

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4 PAGE TRANSITIONS
========================================================= */
.v40-transition-overlay{
    position:fixed!important;
    top:0;
    left:0;
    width:0;
    height:0;
    z-index:2147483000!important;
    display:grid!important;
    place-items:center;
    overflow:hidden;
    border-radius:12px;
    pointer-events:none!important;
    background:rgba(28,16,5,.16);
    opacity:0;
    visibility:hidden;
    transform:translateZ(0);
    will-change:opacity,transform;
    isolation:isolate;
    contain:paint;
}
.v40-transition-overlay.playing{
    visibility:visible!important;
}
.v40-transition-overlay.playing{animation:v40OverlayLife .92s ease both}
@keyframes v40OverlayLife{0%{opacity:0}10%,72%{opacity:1}100%{opacity:0}}
.v40-transition-label{
    position:absolute;
    left:50%;
    bottom:22px;
    transform:translateX(-50%);
    padding:7px 15px;
    border:1px solid rgba(255,255,255,.55);
    border-radius:999px;
    background:rgba(24,13,3,.72);
    color:#fff7d7;
    font-size:11px;
    font-weight:bold;
    letter-spacing:3px;
    white-space:nowrap;
    text-shadow:0 0 8px rgba(255,220,130,.8);
}

/* PROFILE：本のページ */
.v40-transition-profile{background:radial-gradient(circle,#fff7d2 0,#c99f5d 58%,#60401e 100%)}
.v40-book{position:relative;width:min(430px,72%);height:250px;perspective:1100px;filter:drop-shadow(0 18px 22px rgba(30,15,2,.42));isolation:isolate}
.v40-book-base,.v40-book-page{position:absolute;inset:0;border:4px solid #704313;border-radius:8px;background:linear-gradient(90deg,#ead09a 0 49.4%,#8b6028 49.7% 50.3%,#f5dfad 50.6%);transform-origin:left center}
.v40-book-base{z-index:1}
.v40-book-page{left:50%;width:50%;z-index:2;background:linear-gradient(100deg,#fff0c8,#d4a969);animation:v40PageFlip .78s cubic-bezier(.18,.78,.25,1) both}
.v40-book-title{position:absolute;inset:0;z-index:3;display:grid;place-items:center;color:#734817;font-weight:bold;letter-spacing:7px;white-space:nowrap;pointer-events:none;text-shadow:0 1px 0 rgba(255,247,210,.75);animation:v40BookTitle .78s ease both}
@keyframes v40PageFlip{0%{transform:rotateY(0)}100%{transform:rotateY(-178deg)}}
@keyframes v40BookTitle{0%,32%{opacity:0}58%,100%{opacity:1}}

/* COLLECTION：宝箱 */
.v40-transition-collection{background:radial-gradient(circle,#fce6a0 0,#7b4a17 52%,#211307 100%)}
.v40-chest{position:relative;width:220px;height:160px;filter:drop-shadow(0 18px 20px rgba(0,0,0,.42))}
.v40-chest-body{position:absolute;left:15px;right:15px;bottom:0;height:98px;border:6px solid #583009;border-radius:10px;background:linear-gradient(#bb7426,#71400f)}
.v40-chest-body::before{content:"";position:absolute;left:50%;top:-3px;width:34px;height:48px;transform:translateX(-50%);border:4px solid #54300c;border-radius:6px;background:#e8bd4b}
.v40-chest-lid{position:absolute;left:9px;right:9px;top:23px;height:69px;border:6px solid #583009;border-radius:80px 80px 12px 12px;background:linear-gradient(#d38d35,#815017);transform-origin:center bottom;animation:v40ChestOpen .78s ease both}
.v40-chest-light{position:absolute;left:50%;top:65px;width:170px;height:120px;transform:translateX(-50%) scale(.2);background:radial-gradient(ellipse,#fffbd8 0,#ffd862 34%,rgba(255,190,45,0) 72%);animation:v40ChestLight .82s ease both}
@keyframes v40ChestOpen{0%{transform:rotateX(0)}55%,100%{transform:rotateX(-115deg) translateY(-7px)}}
@keyframes v40ChestLight{0%,24%{opacity:0;transform:translateX(-50%) scale(.2)}65%{opacity:1}100%{opacity:0;transform:translateX(-50%) scale(1.5)}}

/* ADVENTURE：剣の斬撃 */
.v40-transition-adventure{background:linear-gradient(135deg,rgba(28,42,28,.95),rgba(75,35,18,.92))}
.v40-sword{position:absolute;width:330px;height:18px;border-radius:99px;background:linear-gradient(#fff,#cce8f0 45%,#7597aa 48%,#e7fbff 60%,#788994);box-shadow:0 0 15px #d8f7ff;transform:translate(-150%,-120%) rotate(-35deg);animation:v40SwordCut .64s cubic-bezier(.12,.85,.28,1) both}
.v40-sword::before{content:"";position:absolute;right:-55px;top:-12px;width:70px;height:42px;border-radius:50%;background:#8b5c1f;border:6px solid #3e2608}
.v40-slash{position:absolute;width:145%;height:8px;background:#fff;box-shadow:0 0 14px #fff,0 0 35px #ffc968;transform:rotate(-35deg) scaleX(0);animation:v40Slash .78s ease .18s both}
@keyframes v40SwordCut{0%{transform:translate(-150%,-120%) rotate(-35deg)}100%{transform:translate(155%,130%) rotate(-35deg)}}
@keyframes v40Slash{0%{opacity:0;transform:rotate(-35deg) scaleX(0)}38%{opacity:1;transform:rotate(-35deg) scaleX(1)}100%{opacity:0;transform:rotate(-35deg) scaleX(1)}}

/* SYSTEM：魔法陣 */
.v40-transition-system{background:radial-gradient(circle,rgba(130,226,214,.35),rgba(21,40,42,.96) 65%)}
.v40-magic-circle,.v40-magic-circle::before,.v40-magic-circle::after{position:absolute;border:3px solid #a4fff2;border-radius:50%;box-shadow:0 0 14px #66e1d2,inset 0 0 14px #66e1d2}
.v40-magic-circle{width:250px;height:250px;animation:v40MagicSpin .95s linear both}
.v40-magic-circle::before{content:"✦　◇　✦　◇　✦";inset:26px;display:grid;place-items:center;color:#c9fff7;font-size:25px;letter-spacing:4px;border-style:dashed;animation:v40MagicReverse .8s linear infinite}
.v40-magic-circle::after{content:"";inset:69px;border-width:2px}
@keyframes v40MagicSpin{0%{opacity:0;transform:scale(.15) rotate(0)}55%{opacity:1;transform:scale(1) rotate(210deg)}100%{opacity:0;transform:scale(1.25) rotate(330deg)}}
@keyframes v40MagicReverse{to{transform:rotate(-360deg)}}

/* GAME LIBRARY：カード展開 */
.v40-transition-game{background:linear-gradient(145deg,#17243a,#07101d)}
.v40-game-deck{position:relative;width:330px;height:215px}
.v40-game-deck span{position:absolute;left:125px;top:42px;width:90px;height:130px;border:3px solid rgba(255,255,255,.7);border-radius:10px;background:linear-gradient(145deg,#4b75aa,#1a2c47);box-shadow:0 10px 18px rgba(0,0,0,.38);animation:v40DealCard .72s cubic-bezier(.17,.8,.25,1) both;animation-delay:calc(var(--i) * 65ms)}
.v40-game-deck span::after{content:"GAME";position:absolute;inset:0;display:grid;place-items:center;color:white;font:bold 14px sans-serif;letter-spacing:2px}
@keyframes v40DealCard{0%{opacity:0;transform:translateY(-80px) rotate(0) scale(.65)}100%{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}}

/* GALLERY：写真現像 */
.v40-transition-gallery{background:#241d18}
.v40-polaroid{position:relative;width:225px;height:275px;padding:16px 16px 48px;background:#fff8e8;box-shadow:0 16px 30px rgba(0,0,0,.46);transform:rotate(-4deg);animation:v40PhotoDrop .82s ease both}
.v40-polaroid::before{content:"";display:block;width:100%;height:100%;background:linear-gradient(135deg,#3f4b55,#ddd1b7);filter:grayscale(1) brightness(.35);animation:v40Develop .86s ease both}
.v40-polaroid::after{content:"MEMORY";position:absolute;left:0;right:0;bottom:13px;text-align:center;color:#664b31;font-weight:bold;letter-spacing:5px}
@keyframes v40PhotoDrop{0%{opacity:0;transform:translateY(-120px) rotate(8deg)}100%{opacity:1;transform:translateY(0) rotate(-4deg)}}
@keyframes v40Develop{0%,28%{filter:grayscale(1) brightness(.25)}100%{filter:grayscale(0) brightness(1)}}

/* MUSCLE：ゲージ */
.v40-transition-muscle{background:linear-gradient(135deg,#32190f,#8b3f24)}
.v40-power-wrap{width:min(470px,72%);text-align:center;color:#fff4d9;font-weight:bold;letter-spacing:4px}
.v40-power-bar{height:38px;margin-top:16px;padding:5px;border:4px solid #ffe5b4;border-radius:999px;background:rgba(20,8,3,.55);box-shadow:0 0 18px rgba(255,186,96,.45)}
.v40-power-fill{height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#f2bc4b,#ff6c35,#fff);box-shadow:0 0 15px #ff9b4c;animation:v40PowerFill .72s cubic-bezier(.16,.8,.2,1) both}
@keyframes v40PowerFill{0%{width:0}100%{width:100%}}

/* UPDATE LOG：タイプライター */
.v40-transition-update{background:linear-gradient(#172019,#07100a);color:#c7ffd3}
.v40-terminal{width:min(560px,82%);padding:22px;border:2px solid #7be391;border-radius:10px;background:rgba(0,18,6,.86);box-shadow:0 0 25px rgba(80,220,115,.35);font:700 15px/1.8 monospace}
.v40-type-line{width:0;overflow:hidden;white-space:nowrap;border-right:2px solid #a8ffba;animation:v40Typing .72s steps(34,end) both,v40Caret .35s step-end infinite}
@keyframes v40Typing{to{width:100%}}
@keyframes v40Caret{50%{border-color:transparent}}

/* ページ本体側の個別アニメーション */
#content.v40-content-profile{animation:v40ContentPage .58s ease both;transform-origin:left center}
@keyframes v40ContentPage{0%{opacity:.1;transform:perspective(900px) rotateY(-11deg) translateX(24px)}100%{opacity:1;transform:none}}
.game-card.v40-card-deal{animation:v40RealCardDeal .52s ease both;animation-delay:calc(var(--i) * 22ms)}
@keyframes v40RealCardDeal{0%{opacity:0;transform:translateY(-25px) rotate(-2deg) scale(.94)}100%{opacity:1;transform:none}}
.gallery-grid img.v40-photo-develop{animation:v40RealPhoto .8s ease both;animation-delay:calc(var(--i) * 38ms)}
@keyframes v40RealPhoto{0%{opacity:0;filter:grayscale(1) brightness(.25) blur(4px);transform:translateY(18px) rotate(-2deg)}100%{opacity:1;filter:none;transform:none}}
#content.v40-content-update .item-card{animation:v40LogReveal .38s ease both;animation-delay:calc(var(--i) * 50ms)}
@keyframes v40LogReveal{0%{opacity:0;transform:translateX(-14px)}100%{opacity:1;transform:none}}

/* =========================================================
   LIFE MAP
========================================================= */
.life-map-card{margin-top:16px;padding:20px;border:4px solid #79501d;border-radius:18px;background:linear-gradient(145deg,rgba(255,248,218,.9),rgba(217,184,123,.82));box-shadow:inset 0 0 20px rgba(255,255,255,.7),0 7px 17px rgba(55,29,5,.25)}
.life-map-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:15px;padding-bottom:13px;border-bottom:2px dashed rgba(110,69,24,.4)}
.life-map-kicker{margin:0;color:#9b6b28;font-size:11px;font-weight:bold;letter-spacing:4px}
.life-map-heading h3{margin:3px 0 2px;font-size:28px;letter-spacing:3px;color:#5a330b}
.life-map-heading p{margin:0;font-size:14px;color:#765b39}
.life-map-compass{display:grid;place-items:center;flex:0 0 58px;width:58px;height:58px;border:3px solid #956426;border-radius:50%;color:#936222;font-size:26px;background:rgba(255,255,255,.45);animation:v40Compass 9s linear infinite}
@keyframes v40Compass{to{transform:rotate(360deg)}}
.life-map-stage{position:relative;min-height:430px;overflow:hidden;border:3px solid rgba(105,67,22,.55);border-radius:16px;background:radial-gradient(circle at 74% 19%,rgba(111,181,206,.38),transparent 20%),radial-gradient(circle at 25% 79%,rgba(115,163,99,.38),transparent 27%),linear-gradient(145deg,rgba(255,251,225,.8),rgba(211,190,145,.66))}
.life-map-stage::before{content:"";position:absolute;inset:0;opacity:.22;background-image:linear-gradient(rgba(94,67,29,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(94,67,29,.22) 1px,transparent 1px);background-size:34px 34px}
.life-map-lines{position:absolute;inset:0;width:100%;height:100%}
.life-map-main-line,.life-map-branch-line,.life-map-walk-line{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:15 10;animation:v40RouteMove 18s linear infinite}
.life-map-main-line{stroke:#8c5a1c;stroke-width:12}
.life-map-branch-line{stroke:#5f8292;stroke-width:8}
.life-map-walk-line{stroke:#9b5744;stroke-width:7}
@keyframes v40RouteMove{to{stroke-dashoffset:-500}}
.life-map-point{position:absolute;left:var(--x);top:var(--y);z-index:3;display:flex;flex-direction:column;align-items:center;gap:5px;transform:translate(-50%,-50%);border:0;background:transparent;color:#4d2b08;font:700 13px "Yu Mincho","MS Mincho",serif;cursor:pointer;filter:drop-shadow(0 2px 2px rgba(255,255,255,.8))}
.life-map-dot{position:relative;width:25px;height:25px;border:5px solid #fff3cb;border-radius:50%;background:#8b5a20;box-shadow:0 0 0 4px #6a3b0c,0 0 13px rgba(255,207,91,.7);transition:.22s}
.life-map-dot::after{content:"";position:absolute;inset:-13px;border:2px solid #c99336;border-radius:50%;opacity:0;transform:scale(.55);transition:.24s}
.life-map-point:hover .life-map-dot,.life-map-point:focus-visible .life-map-dot,.life-map-point.selected .life-map-dot{transform:scale(1.23);background:#d79426;box-shadow:0 0 0 4px #6a3b0c,0 0 22px #ffd36b}
.life-map-point.selected .life-map-dot::after{opacity:1;transform:scale(1);animation:v40PointPulse 1.6s ease-in-out infinite}
@keyframes v40PointPulse{50%{transform:scale(1.3);opacity:.18}}
.life-map-point:focus-visible{outline:2px solid #73450d;outline-offset:5px;border-radius:8px}
.life-map-route-label{position:absolute;z-index:2;padding:4px 8px;border-radius:999px;background:rgba(255,248,218,.82);color:#704312;font-size:11px;font-weight:bold;letter-spacing:1px;box-shadow:0 2px 7px rgba(60,32,5,.14)}
.life-map-route-label-main{left:24%;bottom:8%}
.life-map-route-label-walk{right:3%;top:40%}
.life-map-detail{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:15px;margin-top:15px;padding:15px;border:2px solid rgba(111,70,24,.45);border-radius:14px;background:rgba(255,255,255,.55);animation:v40MapDetail .35s ease}
@keyframes v40MapDetail{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.life-map-detail-badge{padding:7px 9px;border-radius:8px;background:#7d4f1b;color:#fff4d0;font-size:10px;font-weight:bold;letter-spacing:2px;writing-mode:vertical-rl}
.life-map-detail-main p{margin:0;font-size:13px;color:#7c6242}
.life-map-detail-main h4{margin:2px 0 4px;font-size:22px;color:#573009}
.life-map-detail-main #lifeMapDetailText{font-size:14px;line-height:1.7;color:#5d472e}
.life-map-open-button{padding:10px 13px;border:2px solid #654014;border-radius:10px;background:#87581f;color:#fff5d3;font:700 13px inherit;cursor:pointer;white-space:nowrap;box-shadow:0 3px 0 #4e2d09;transition:.18s}
.life-map-open-button:hover{transform:translateY(-2px);background:#a36c27;box-shadow:0 5px 0 #4e2d09,0 0 12px rgba(255,213,113,.55)}
.life-map-open-button:active{transform:translateY(2px);box-shadow:none}
.life-map-note{margin:10px 0 0;font-size:11px;color:#80694d;text-align:right}

@media(max-width:760px){
    .life-map-stage{min-height:500px}
    .life-map-detail{grid-template-columns:auto 1fr}
    .life-map-open-button{grid-column:1/-1;width:100%}
    .life-map-route-label{display:none}
}
@media(max-width:520px){
    .life-map-heading h3{font-size:22px}
    .life-map-compass{display:none}
    .life-map-stage{min-height:560px}
    .life-map-point{font-size:11px}
    .life-map-dot{width:21px;height:21px}
}
/* PC側で「アニメーションを減らす」が有効でも、
   ページ遷移演出だけは通常どおり表示する */
@media(prefers-reduced-motion:reduce){
    .life-map-compass,
    .life-map-main-line,
    .life-map-branch-line,
    .life-map-walk-line,
    .life-map-point.selected .life-map-dot::after{
        animation-duration:.01ms!important;
        animation-iteration-count:1!important;
    }

    .v40-transition-overlay.playing{
        animation:v40OverlayLife .92s ease both!important;
    }
    .v40-transition-overlay.playing .v40-book-page{
        animation:v40PageFlip .78s cubic-bezier(.18,.78,.25,1) both!important;
    }
    .v40-transition-overlay.playing .v40-chest-lid{
        animation:v40ChestOpen .78s ease both!important;
    }
    .v40-transition-overlay.playing .v40-chest-light{
        animation:v40ChestLight .82s ease both!important;
    }
    .v40-transition-overlay.playing .v40-sword{
        animation:v40SwordCut .64s cubic-bezier(.12,.85,.28,1) both!important;
    }
    .v40-transition-overlay.playing .v40-slash{
        animation:v40Slash .78s ease .18s both!important;
    }
    .v40-transition-overlay.playing .v40-magic-circle{
        animation:v40MagicSpin .95s linear both!important;
    }
    .v40-transition-overlay.playing .v40-magic-circle::before{
        animation:v40MagicReverse .8s linear infinite!important;
    }
    .v40-transition-overlay.playing .v40-game-deck span{
        animation:v40DealCard .72s cubic-bezier(.17,.8,.25,1) both!important;
        animation-delay:calc(var(--i) * 65ms)!important;
    }
    .v40-transition-overlay.playing .v40-polaroid{
        animation:v40PhotoDrop .82s ease both!important;
    }
    .v40-transition-overlay.playing .v40-polaroid::before{
        animation:v40Develop .86s ease both!important;
    }
    .v40-transition-overlay.playing .v40-power-fill{
        animation:v40PowerFill .72s cubic-bezier(.16,.8,.2,1) both!important;
    }
    .v40-transition-overlay.playing .v40-type-line{
        animation:v40Typing .72s steps(34,end) both,v40Caret .35s step-end infinite!important;
    }
}
`;
        document.head.appendChild(style);
    }

    function ensureTransitionOverlay() {
        let overlay = document.getElementById(OVERLAY_ID);
        if (overlay) return overlay;

        overlay = document.createElement("div");
        overlay.id = OVERLAY_ID;
        overlay.className = "v40-transition-overlay";
        overlay.setAttribute("aria-hidden", "true");

        document.body.appendChild(overlay);
        return overlay;
    }

    function getCategoryForPage(pageName) {
        if (pageName === "GAME LIBRARY") return "COLLECTION";
        if (pageName === "MUSCLE") return "ADVENTURE";

        if (typeof pageCategories !== "undefined" && pageCategories[pageName]) {
            return pageCategories[pageName];
        }

        return "PROFILE";
    }

    function getTransitionType(pageName) {
        if (pageName === "GAME LIBRARY") return "game";
        if (pageName === "GALLERY") return "gallery";
        if (pageName === "MUSCLE") return "muscle";
        if (pageName === "UPDATE LOG") return "update";

        const category = getCategoryForPage(pageName);
        return {
            PROFILE: "profile",
            COLLECTION: "collection",
            ADVENTURE: "adventure",
            SYSTEM: "system"
        }[category] || "profile";
    }

    function getTransitionMarkup(type, pageName) {
        const label = `${getCategoryForPage(pageName)} / ${pageName}`;

        const effects = {
            profile: '<div class="v40-book"><div class="v40-book-base"></div><div class="v40-book-page"></div><div class="v40-book-title">THE RECORD</div></div>',
            collection: '<div class="v40-chest"><div class="v40-chest-light"></div><div class="v40-chest-body"></div><div class="v40-chest-lid"></div></div>',
            adventure: '<div class="v40-sword"></div><div class="v40-slash"></div>',
            system: '<div class="v40-magic-circle"></div>',
            game: '<div class="v40-game-deck"><span style="--i:0;--x:-110px;--y:20px;--r:-18deg"></span><span style="--i:1;--x:-55px;--y:6px;--r:-9deg"></span><span style="--i:2;--x:0px;--y:0px;--r:0deg"></span><span style="--i:3;--x:55px;--y:6px;--r:9deg"></span><span style="--i:4;--x:110px;--y:20px;--r:18deg"></span></div>',
            gallery: '<div class="v40-polaroid"></div>',
            muscle: '<div class="v40-power-wrap">POWER CHARGE<div class="v40-power-bar"><div class="v40-power-fill"></div></div></div>',
            update: '<div class="v40-terminal"><div class="v40-type-line">&gt; LOADING UPDATE RECORD...</div></div>'
        };

        return `${effects[type] || effects.profile}<div class="v40-transition-label">${label}</div>`;
    }

    function playTransitionSound(type) {
        if (typeof playUiTone !== "function") return;

        const tone = (...args) => playUiTone(...args);

        if (type === "profile") {
            tone(310, 0.08, 0.025, "triangle", 0);
            tone(430, 0.11, 0.022, "sine", 0.07);
        } else if (type === "collection") {
            tone(150, 0.08, 0.032, "square", 0);
            tone(520, 0.11, 0.025, "triangle", 0.18);
            tone(790, 0.15, 0.021, "sine", 0.27);
        } else if (type === "adventure") {
            tone(950, 0.06, 0.022, "sawtooth", 0);
            tone(260, 0.12, 0.018, "triangle", 0.08);
        } else if (type === "system") {
            tone(440, 0.12, 0.022, "sine", 0);
            tone(660, 0.14, 0.021, "sine", 0.08);
            tone(880, 0.16, 0.018, "triangle", 0.16);
        } else if (type === "game") {
            tone(330, 0.05, 0.022, "square", 0);
            tone(440, 0.05, 0.022, "square", 0.07);
            tone(660, 0.07, 0.02, "square", 0.14);
        } else if (type === "gallery") {
            tone(180, 0.04, 0.035, "square", 0);
            tone(90, 0.06, 0.025, "square", 0.045);
        } else if (type === "muscle") {
            tone(240, 0.07, 0.024, "triangle", 0);
            tone(360, 0.07, 0.024, "triangle", 0.09);
            tone(520, 0.1, 0.024, "triangle", 0.18);
        } else if (type === "update") {
            [0, 1, 2, 3, 4].forEach(index => tone(600 + index * 35, 0.025, 0.012, "square", index * 0.07));
        }
    }

    function positionTransitionOverlay(overlay) {
        const record = document.querySelector(".record");
        if (!record) return false;

        const rect = record.getBoundingClientRect();

        overlay.style.top = `${Math.max(0, rect.top)}px`;
        overlay.style.left = `${Math.max(0, rect.left)}px`;
        overlay.style.width = `${Math.max(1, rect.width)}px`;
        overlay.style.height = `${Math.max(1, Math.min(rect.height, window.innerHeight - Math.max(0, rect.top)))}px`;
        overlay.style.right = "auto";
        overlay.style.bottom = "auto";
        overlay.style.zIndex = "2147483000";
        overlay.style.visibility = "visible";

        return true;
    }

    function cancelTransitionAnimations(overlay) {
        overlay.getAnimations({ subtree: true }).forEach(animation => {
            try {
                animation.cancel();
            } catch (_) {
                // 古いブラウザ向け
            }
        });
    }

    function animateElement(element, keyframes, options) {
        if (!element || typeof element.animate !== "function") return null;

        element.style.animation = "none";
        return element.animate(keyframes, {
            fill: "both",
            easing: "ease",
            ...options
        });
    }

    function forceTransitionMotion(overlay, type) {
        cancelTransitionAnimations(overlay);

        animateElement(
            overlay,
            [
                { opacity: 0, transform: "translateZ(0) scale(1.01)" },
                { opacity: 1, offset: 0.12 },
                { opacity: 1, offset: 0.74 },
                { opacity: 0, transform: "translateZ(0) scale(1)" }
            ],
            { duration: 1100 }
        );

        if (type === "profile") {
            animateElement(
                overlay.querySelector(".v40-book-page"),
                [
                    { transform: "rotateY(0deg)" },
                    { transform: "rotateY(-178deg)" }
                ],
                { duration: 850, easing: "cubic-bezier(.18,.78,.25,1)" }
            );
        }

        if (type === "collection") {
            animateElement(
                overlay.querySelector(".v40-chest-lid"),
                [
                    { transform: "rotateX(0deg) translateY(0)" },
                    { transform: "rotateX(0deg) translateY(0)", offset: 0.22 },
                    { transform: "rotateX(-115deg) translateY(-7px)" }
                ],
                { duration: 900, easing: "cubic-bezier(.18,.8,.25,1)" }
            );

            animateElement(
                overlay.querySelector(".v40-chest-light"),
                [
                    { opacity: 0, transform: "translateX(-50%) scale(.15)" },
                    { opacity: 0, transform: "translateX(-50%) scale(.2)", offset: 0.25 },
                    { opacity: 1, transform: "translateX(-50%) scale(.9)", offset: 0.62 },
                    { opacity: 0, transform: "translateX(-50%) scale(1.65)" }
                ],
                { duration: 1000 }
            );
        }

        if (type === "adventure") {
            animateElement(
                overlay.querySelector(".v40-sword"),
                [
                    { transform: "translate(-160%,-125%) rotate(-35deg)" },
                    { transform: "translate(165%,135%) rotate(-35deg)" }
                ],
                { duration: 720, easing: "cubic-bezier(.12,.85,.28,1)" }
            );

            animateElement(
                overlay.querySelector(".v40-slash"),
                [
                    { opacity: 0, transform: "rotate(-35deg) scaleX(0)" },
                    { opacity: 1, transform: "rotate(-35deg) scaleX(1)", offset: 0.38 },
                    { opacity: 0, transform: "rotate(-35deg) scaleX(1)" }
                ],
                { duration: 800, delay: 160 }
            );
        }

        if (type === "system") {
            animateElement(
                overlay.querySelector(".v40-magic-circle"),
                [
                    { opacity: 0, transform: "scale(.12) rotate(0deg)" },
                    { opacity: 1, transform: "scale(1) rotate(220deg)", offset: 0.58 },
                    { opacity: 0, transform: "scale(1.28) rotate(360deg)" }
                ],
                { duration: 1050, easing: "linear" }
            );

        }

        if (type === "game") {
            overlay.querySelectorAll(".v40-game-deck span").forEach((card, index) => {
                animateElement(
                    card,
                    [
                        { opacity: 0, transform: "translateY(-90px) rotate(0deg) scale(.55)" },
                        {
                            opacity: 1,
                            transform: `translate(${card.style.getPropertyValue("--x")},${card.style.getPropertyValue("--y")}) rotate(${card.style.getPropertyValue("--r")}) scale(1)`
                        }
                    ],
                    {
                        duration: 720,
                        delay: index * 70,
                        easing: "cubic-bezier(.17,.8,.25,1)"
                    }
                );
            });
        }

        if (type === "gallery") {
            animateElement(
                overlay.querySelector(".v40-polaroid"),
                [
                    { opacity: 0, transform: "translateY(-130px) rotate(9deg) scale(.9)" },
                    { opacity: 1, transform: "translateY(0) rotate(-4deg) scale(1)" }
                ],
                { duration: 880, easing: "cubic-bezier(.18,.8,.25,1)" }
            );

            animateElement(
                overlay.querySelector(".v40-polaroid"),
                [
                    { filter: "grayscale(1) brightness(.25)" },
                    { filter: "grayscale(0) brightness(1)" }
                ],
                { duration: 900 }
            );
        }

        if (type === "muscle") {
            animateElement(
                overlay.querySelector(".v40-power-fill"),
                [
                    { width: "0%" },
                    { width: "100%" }
                ],
                { duration: 820, easing: "cubic-bezier(.16,.8,.2,1)" }
            );
        }

        if (type === "update") {
            animateElement(
                overlay.querySelector(".v40-type-line"),
                [
                    { width: "0%" },
                    { width: "100%" }
                ],
                { duration: 820, easing: "steps(34,end)" }
            );
        }
    }

    function runTransition(pageName) {
        if (!pageName) return;

        pendingPageName = pageName;
        const type = getTransitionType(pageName);
        const overlay = ensureTransitionOverlay();
        if (!overlay || !positionTransitionOverlay(overlay)) return;

        window.clearTimeout(transitionTimer);
        cancelTransitionAnimations(overlay);

        overlay.className = `v40-transition-overlay v40-transition-${type}`;
        overlay.innerHTML = getTransitionMarkup(type, pageName);

        // PCでCSSアニメーションが抑止・クリップされても確実に再生する
        requestAnimationFrame(() => {
            positionTransitionOverlay(overlay);
            overlay.classList.add("playing");
            forceTransitionMotion(overlay, type);
            playTransitionSound(type);
        });

        transitionTimer = window.setTimeout(() => {
            cancelTransitionAnimations(overlay);
            overlay.classList.remove("playing");
            overlay.style.visibility = "hidden";
            overlay.style.width = "0";
            overlay.style.height = "0";
            overlay.innerHTML = "";
        }, 1160);
    }

    function appendLifeMap() {
        if (typeof records === "undefined" || !records.CHARACTER) return;
        if (records.CHARACTER.includes("AONO LIFE ROUTE")) return;
        records.CHARACTER += lifeMapHtml;
    }

    function initializeLifeMap() {
        const map = document.querySelector(".life-map-card");
        if (!map || map.dataset.ready === "true") return;
        map.dataset.ready = "true";

        map.addEventListener("click", event => {
            const point = event.target.closest(".life-map-point");

            if (point) {
                const entry = mapEntries[point.dataset.mapId];
                if (!entry) return;

                map.querySelectorAll(".life-map-point").forEach(item => {
                    item.classList.toggle("selected", item === point);
                });

                const detail = document.getElementById("lifeMapDetail");
                if (detail) {
                    detail.style.animation = "none";
                    void detail.offsetWidth;
                    detail.style.animation = "";
                }

                document.getElementById("lifeMapDetailLabel").textContent = entry.label;
                document.getElementById("lifeMapDetailPeriod").textContent = entry.period;
                document.getElementById("lifeMapDetailTitle").textContent = entry.title;
                document.getElementById("lifeMapDetailText").textContent = entry.text;

                const openButton = document.getElementById("lifeMapOpenRecord");
                openButton.dataset.openPage = entry.relatedPage;
                openButton.textContent = entry.relatedLabel;

                if (typeof playUiSound === "function") playUiSound("click");
                return;
            }

            const openButton = event.target.closest("#lifeMapOpenRecord");
            if (openButton) {
                const pageName = openButton.dataset.openPage;
                const menuItem = document.querySelector(`.menu-item[data-page="${CSS.escape(pageName)}"]`);
                menuItem?.click();
            }
        });
    }

    function decorateRenderedPage(pageName) {
        const content = document.getElementById("content");
        if (!content) return;

        content.classList.remove("v40-content-profile", "v40-content-update");

        if (getCategoryForPage(pageName) === "PROFILE") {
            content.classList.add("v40-content-profile");
        }

        if (pageName === "CHARACTER") {
            initializeLifeMap();
        }

        if (pageName === "GAME LIBRARY") {
            window.setTimeout(() => {
                document.querySelectorAll(".game-card").forEach((card, index) => {
                    card.style.setProperty("--i", String(Math.min(index, 18)));
                    card.classList.add("v40-card-deal");
                });
            }, 45);
        }

        if (pageName === "GALLERY") {
            document.querySelectorAll(".gallery-grid img").forEach((image, index) => {
                image.style.setProperty("--i", String(Math.min(index, 16)));
                image.classList.add("v40-photo-develop");
            });
        }

        if (pageName === "UPDATE LOG") {
            content.classList.add("v40-content-update");
            content.querySelectorAll(".item-card").forEach((card, index) => {
                card.style.setProperty("--i", String(Math.min(index, 15)));
            });
        }
    }

    function installContentObserver() {
        const content = document.getElementById("content");
        if (!content) return;

        const observer = new MutationObserver(mutations => {
            const replaced = mutations.some(mutation => mutation.target === content && mutation.type === "childList");
            if (!replaced) return;

            window.setTimeout(() => decorateRenderedPage(pendingPageName), 25);
        });

        observer.observe(content, { childList: true });
    }

    function installTransitionTriggers() {
        let lastPage = "";
        let lastTime = 0;

        const trigger = pageName => {
            const now = performance.now();

            // pointer/clickの二重発火を防止
            if (pageName === lastPage && now - lastTime < 180) return;

            lastPage = pageName;
            lastTime = now;
            runTransition(pageName);
        };

        document.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const menuItem = target.closest(".menu-item[data-page]");
            if (menuItem) {
                trigger(menuItem.dataset.page);
                return;
            }

            if (
                target.closest("#locationPage") &&
                typeof currentPageName !== "undefined"
            ) {
                trigger(currentPageName);
            }
        }, true);

        window.addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            const target = event.target;

            if (
                target instanceof HTMLElement &&
                target.closest("input,textarea,select,button,a,[contenteditable='true']")
            ) {
                return;
            }

            const selected = document.querySelector(
                ".menu-item.selected[data-page]"
            );

            if (selected) trigger(selected.dataset.page);
        }, true);

        window.addEventListener("resize", () => {
            const overlay = document.getElementById(OVERLAY_ID);

            if (overlay?.classList.contains("playing")) {
                positionTransitionOverlay(overlay);
            }
        });
    }

    function enforceMuscleAdventurePlacement() {
        if (typeof pageCategories !== "undefined") {
            pageCategories.MUSCLE = "ADVENTURE";
        }

        const muscle = document.querySelector('.menu-item[data-page="MUSCLE"]');
        const adventureButton = document.querySelector('.menu-category[data-category="ADVENTURE"]');
        const adventureGroup = adventureButton?.nextElementSibling;

        if (muscle && adventureGroup?.classList.contains("menu-group") && muscle.parentElement !== adventureGroup) {
            adventureGroup.prepend(muscle);
        }
    }

    function addUpdateLog() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;
        if (records["UPDATE LOG"].includes(UPDATE_MARKER)) return;

        const card = `
            <div class="item-card">
                <div class="item-title">📜 Ver.4.0</div>
                <div class="item-text">
                    <b style="display:none">${UPDATE_MARKER}</b>
                    <b>✨ カテゴリ別ページ遷移を実装</b><br>
                    ・PROFILE：本のページをめくる演出<br>
                    ・COLLECTION：宝箱が開く演出<br>
                    ・ADVENTURE：剣で画面を切る演出<br>
                    ・SYSTEM：魔法陣が展開する演出<br>
                    ・GAME LIBRARY：ゲームカードが並ぶ演出<br>
                    ・GALLERY：写真が現像される演出<br>
                    ・MUSCLE：パワーゲージが満タンになる演出<br>
                    ・UPDATE LOG：タイプライター演出<br><br>
                    <b>🗺 CHARACTERにライフマップを追加</b><br>
                    ・三重県津市 → 和歌山県 → 東京都の移動を路線図風に表示<br>
                    ・東京都、渋谷、舞浜、地下鉄徒歩記録を地点として追加<br>
                    ・地点をクリックすると説明と関連ページへのボタンを表示
                </div>
            </div>
        `;

        records["UPDATE LOG"] = records["UPDATE LOG"].replace(
            '<div class="record-section">',
            '<div class="record-section">' + card
        );
    }

    function sortUpdateLogNewestFirst() {
        if (typeof records === "undefined" || !records["UPDATE LOG"]) return;

        const template = document.createElement("template");
        template.innerHTML = records["UPDATE LOG"].trim();

        const section = template.content.querySelector(".record-section");
        if (!section) return;

        const cards = Array.from(section.children).filter(card =>
            card.classList.contains("item-card")
        );

        const versionOf = card => {
            const title = card.querySelector(".item-title")?.textContent || "";
            const match = title.match(/Ver\.(\d+)(?:\.(\d+))?/i);

            return match
                ? [Number(match[1]), Number(match[2] || 0)]
                : [-1, -1];
        };

        cards.sort((cardA, cardB) => {
            const [majorA, minorA] = versionOf(cardA);
            const [majorB, minorB] = versionOf(cardB);

            return majorB - majorA || minorB - minorA;
        });

        cards.forEach(card => section.appendChild(card));
        records["UPDATE LOG"] = template.innerHTML;
    }

    function boot() {
        injectStyles();
        ensureTransitionOverlay();
        enforceMuscleAdventurePlacement();
        appendLifeMap();
        addUpdateLog();
        sortUpdateLogNewestFirst();
        installContentObserver();
        installTransitionTriggers();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();