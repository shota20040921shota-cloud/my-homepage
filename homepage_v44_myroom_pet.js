/*
 * THE RECORD OF AONO SHOTA - Ver.4.4
 * ・獲得カードを自由に飾れる「MY RECORD ROOM」
 * ・閲覧とお世話で成長する「RECORD SPIRIT」
 *
 * index.html の </body> 直前で、homepage_v43_bgm_control.js の後に読み込んでください。
 */
(() => {
    "use strict";

    const STYLE_ID = "aonoV44MyRoomPetStyles";
    const ROOM_PAGE = "MY ROOM";
    const PET_PAGE = "RECORD PET";
    const UPDATE_MARKER = "VER.4.4 MY ROOM AND RECORD SPIRIT";

    const ROOM_STORAGE_KEY = "aonoV44MyRoom";
    const PET_STORAGE_KEY = "aonoV44RecordPet";
    const PET_VISIBLE_STORAGE_KEY = "aonoV44PetVisible";
    const VIEWED_STORAGE_KEY = "aonoV44ViewedPages";

    const roomSlots = [
        { id: "wall-left", label: "左の額縁", short: "FRAME L", className: "slot-wall-left" },
        { id: "wall-right", label: "右の額縁", short: "FRAME R", className: "slot-wall-right" },
        { id: "shelf-left", label: "棚・左", short: "SHELF L", className: "slot-shelf-left" },
        { id: "shelf-center", label: "棚・中央", short: "SHELF C", className: "slot-shelf-center" },
        { id: "shelf-right", label: "棚・右", short: "SHELF R", className: "slot-shelf-right" },
        { id: "desk-left", label: "机・左", short: "DESK L", className: "slot-desk-left" },
        { id: "desk-right", label: "机・右", short: "DESK R", className: "slot-desk-right" },
        { id: "pedestal", label: "中央台座", short: "MAIN", className: "slot-pedestal" }
    ];

    const roomThemes = {
        archive: { label: "古書の書斎", description: "羊皮紙と木製家具を中心にした標準テーマ。" },
        midnight: { label: "夜の記録室", description: "月明かりと青いランタンが灯る静かな部屋。" },
        royal: { label: "王家の展示室", description: "紫と金の装飾で高レアカードが映える部屋。" }
    };

    const affinityMeta = {
        game: { label: "GAME", icon: "▣", color: "#5f83bc", finalName: "PIXEL FAMILIAR", description: "ゲーム系の記録を好む、好奇心旺盛な電脳精霊。" },
        music: { label: "MUSIC", icon: "♪", color: "#b26783", finalName: "MELODY WISP", description: "演奏や音を力に変える、リズム好きの音楽精霊。" },
        adventure: { label: "ADVENTURE", icon: "◆", color: "#b76b3e", finalName: "BRAVE GUARDIAN", description: "筋トレや挑戦を通じて強くなる、勇敢な守護精霊。" },
        memory: { label: "MEMORY", icon: "✦", color: "#9a78b8", finalName: "ARCHIVE LUMEN", description: "写真や人物記録を集める、穏やかな記憶の精霊。" }
    };

    const pageAffinity = {
        HOME: "memory",
        CHARACTER: "memory",
        PREFERENCES: "memory",
        TITLE: "memory",
        "ITEM BOX": "memory",
        GALLERY: "memory",
        "DISNEY GUIDE": "memory",
        "MESSAGE BOARD": "memory",
        CONTACT: "memory",
        "UPDATE LOG": "memory",
        OPTION: "memory",
        "GAME LIBRARY": "game",
        "AONO GACHA": "game",
        "AONO COLLECTION": "game",
        "MY ROOM": "game",
        SKILL: "music",
        "PERFORMANCE RECORD": "music",
        MUSCLE: "adventure",
        ACHIEVEMENTS: "adventure",
        "RECORD PET": "adventure"
    };

    const careActions = {
        feed: {
            label: "記録のしずくを与える",
            icon: "💧",
            description: "エネルギーを回復。毎日のお世話の基本です。",
            energy: 18,
            mood: 4,
            bond: 2,
            exp: 4,
            affinity: "memory",
            affinityPoint: 1
        },
        play: {
            label: "ミニゲームで遊ぶ",
            icon: "🎮",
            description: "気分と親密度が大きく上昇し、GAME傾向が育ちます。",
            energy: -7,
            mood: 18,
            bond: 4,
            exp: 6,
            affinity: "game",
            affinityPoint: 2,
            minimumEnergy: 8
        },
        listen: {
            label: "音楽を聴かせる",
            icon: "♪",
            description: "音に合わせて喜び、MUSIC傾向と親密度が育ちます。",
            energy: -3,
            mood: 12,
            bond: 5,
            exp: 5,
            affinity: "music",
            affinityPoint: 2,
            minimumEnergy: 4
        },
        train: {
            label: "一緒に修行する",
            icon: "⚔",
            description: "エネルギーを使う代わりに多くの経験値を得ます。",
            energy: -12,
            mood: 5,
            bond: 3,
            exp: 8,
            affinity: "adventure",
            affinityPoint: 3,
            minimumEnergy: 15
        },
        read: {
            label: "記録を読み聞かせる",
            icon: "📖",
            description: "親密度が上がり、MEMORY傾向が大きく育ちます。",
            energy: -4,
            mood: 8,
            bond: 5,
            exp: 7,
            affinity: "memory",
            affinityPoint: 3,
            minimumEnergy: 5
        },
        rest: {
            label: "ランタンの下で休ませる",
            icon: "🌙",
            description: "エネルギーを大きく回復。疲れている時におすすめです。",
            energy: 28,
            mood: 5,
            bond: 1,
            exp: 2,
            affinity: null,
            affinityPoint: 0
        }
    };

    let roomState = loadRoomState();
    let petData = loadPetData();
    let petVisible = readBoolean(PET_VISIBLE_STORAGE_KEY, true);
    let selectedRoomSlot = roomSlots[0].id;
    let selectedRoomCardId = null;
    let contentObserver = null;
    let enhanceScheduled = false;
    let lastTrackedPage = "";
    let lastTrackedAt = 0;

    function clamp(value, min = 0, max = 100) {
        return Math.min(max, Math.max(min, Number(value) || 0));
    }

    function todayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }

    function readBoolean(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value !== "false";
        } catch (error) {
            return fallback;
        }
    }

    function readJson(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            if (!value) return fallback;
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // 保存できない環境でも、その場の操作は続行する。
        }
    }

    function loadRoomState() {
        const saved = readJson(ROOM_STORAGE_KEY, {});
        const placements = {};
        roomSlots.forEach(slot => {
            const value = Number(saved?.placements?.[slot.id]);
            placements[slot.id] = Number.isFinite(value) && value > 0 ? value : null;
        });
        const theme = roomThemes[saved?.theme] ? saved.theme : "archive";
        return { theme, placements };
    }

    function saveRoomState() {
        writeJson(ROOM_STORAGE_KEY, roomState);
    }

    function defaultPetData() {
        return {
            version: 1,
            name: "レコ",
            exp: 0,
            bond: 15,
            mood: 72,
            energy: 82,
            affinity: { game: 0, music: 0, adventure: 0, memory: 0 },
            daily: { date: todayKey(), pages: [], careCount: 0, roomRewards: 0 },
            createdAt: Date.now(),
            lastSeen: Date.now()
        };
    }

    function loadPetData() {
        const base = defaultPetData();
        const saved = readJson(PET_STORAGE_KEY, {});
        const data = {
            ...base,
            ...saved,
            affinity: { ...base.affinity, ...(saved?.affinity || {}) },
            daily: { ...base.daily, ...(saved?.daily || {}) }
        };

        data.name = String(data.name || "レコ").trim().slice(0, 12) || "レコ";
        data.exp = Math.max(0, Number(data.exp) || 0);
        data.bond = clamp(data.bond);
        data.mood = clamp(data.mood);
        data.energy = clamp(data.energy);
        Object.keys(affinityMeta).forEach(key => {
            data.affinity[key] = Math.max(0, Number(data.affinity[key]) || 0);
        });
        if (!Array.isArray(data.daily.pages)) data.daily.pages = [];
        data.daily.careCount = Math.max(0, Number(data.daily.careCount) || 0);
        data.daily.roomRewards = Math.max(0, Number(data.daily.roomRewards) || 0);

        applyTimePassage(data);
        resetDailyDataIfNeeded(data);
        return data;
    }

    function applyTimePassage(data) {
        const now = Date.now();
        const lastSeen = Number(data.lastSeen) || now;
        const fullDays = Math.floor((now - lastSeen) / 86400000);
        if (fullDays > 0) {
            data.energy = clamp(data.energy - Math.min(36, fullDays * 8), 20, 100);
            data.mood = clamp(data.mood - Math.min(28, fullDays * 5), 20, 100);
        }
        data.lastSeen = now;
    }

    function resetDailyDataIfNeeded(data = petData) {
        const key = todayKey();
        if (data.daily.date !== key) {
            data.daily = { date: key, pages: [], careCount: 0, roomRewards: 0 };
        }
    }

    function savePetData() {
        petData.lastSeen = Date.now();
        resetDailyDataIfNeeded(petData);
        writeJson(PET_STORAGE_KEY, petData);
    }

    function levelInfo(totalExp = petData.exp) {
        let level = 1;
        let remaining = Math.max(0, Number(totalExp) || 0);
        let next = 45;
        while (remaining >= next && level < 99) {
            remaining -= next;
            level += 1;
            next = 45 + (level - 1) * 18;
        }
        return {
            level,
            current: remaining,
            next,
            percent: Math.min(100, Math.round((remaining / next) * 100))
        };
    }

    function dominantAffinity() {
        const entries = Object.entries(petData.affinity);
        entries.sort((a, b) => b[1] - a[1]);
        if (!entries.length || entries[0][1] === 0) return "memory";
        return entries[0][0];
    }

    function evolutionInfo() {
        const info = levelInfo();
        const affinity = dominantAffinity();
        const meta = affinityMeta[affinity];
        if (info.level < 5) {
            return {
                stage: 1,
                affinity,
                name: "INK DROP",
                japanese: "生まれたての記録精",
                symbol: "✦",
                message: "まだ小さなインクのしずく。いろいろな記録に触れることで性格が決まります。"
            };
        }
        if (info.level < 12) {
            return {
                stage: 2,
                affinity,
                name: `YOUNG ${meta.label} SPIRIT`,
                japanese: `${meta.label}に惹かれる幼年精霊`,
                symbol: meta.icon,
                message: `現在は${meta.label}傾向が最も強く育っています。Lv.12で本格的に進化します。`
            };
        }
        if (info.level < 20) {
            return {
                stage: 3,
                affinity,
                name: meta.finalName,
                japanese: meta.description,
                symbol: meta.icon,
                message: `閲覧傾向とお世話の積み重ねにより、${meta.finalName}へ進化しました。`
            };
        }
        return {
            stage: 4,
            affinity,
            name: `CHRONICLE ${meta.label} SPIRIT`,
            japanese: "長い記録を守る上位精霊",
            symbol: "✧",
            message: `Lv.20を越え、${meta.label}の力をまとった上位の記録精霊になりました。`
        };
    }

    function getAllCards() {
        try {
            return typeof aonoCards !== "undefined" && Array.isArray(aonoCards) ? aonoCards : [];
        } catch (error) {
            return [];
        }
    }

    function getOwnedCardIds() {
        try {
            if (typeof gachaData !== "undefined" && Array.isArray(gachaData.owned)) {
                return gachaData.owned.map(Number).filter(Number.isFinite);
            }
        } catch (error) {}
        const saved = readJson("aonoGachaData", { owned: [] });
        return Array.isArray(saved.owned) ? saved.owned.map(Number).filter(Number.isFinite) : [];
    }

    function getOwnedCards() {
        const owned = new Set(getOwnedCardIds());
        return getAllCards().filter(card => owned.has(Number(card.id)));
    }

    function getCard(cardId) {
        const id = Number(cardId);
        return getAllCards().find(card => Number(card.id) === id) || null;
    }

    function getRarityClassSafe(rarity) {
        try {
            if (typeof getRarityClass === "function") return getRarityClass(rarity);
        } catch (error) {}
        return `rarity-${String(rarity || "n").toLowerCase()}`;
    }

    function rarityWeight(rarity) {
        return { SECRET: 6, UR: 5, SSR: 4, SR: 3, R: 2, N: 1 }[rarity] || 0;
    }

    function sanitizeRoomPlacements() {
        const owned = new Set(getOwnedCardIds());
        const used = new Set();
        roomSlots.forEach(slot => {
            const cardId = Number(roomState.placements[slot.id]);
            if (!cardId || !owned.has(cardId) || used.has(cardId)) {
                roomState.placements[slot.id] = null;
            } else {
                roomState.placements[slot.id] = cardId;
                used.add(cardId);
            }
        });
        saveRoomState();
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
/* =========================================================
   VER.4.4 COMMON
========================================================= */
.v44-page-intro{
    padding:17px 18px;border:2px solid rgba(112,70,24,.43);border-radius:15px;
    background:linear-gradient(135deg,rgba(255,250,226,.88),rgba(223,196,146,.66));
    box-shadow:inset 0 0 13px rgba(255,255,255,.72),0 5px 12px rgba(58,31,7,.12);
    color:#60462c;line-height:1.78;font-size:14px;
}
.v44-page-intro b{color:#55300b}.v44-page-intro p{margin:6px 0 0}
.v44-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:14px 0}
.v44-button{
    padding:9px 12px;border:2px solid #76501f;border-radius:10px;background:#fff3cb;color:#5a360f;
    font:700 13px inherit;cursor:pointer;transition:.18s transform,.18s background,.18s box-shadow;
}
.v44-button:hover{transform:translateY(-2px);background:#ffe7aa;box-shadow:0 5px 10px rgba(62,34,8,.16)}
.v44-button.active{background:linear-gradient(135deg,#8b5b24,#58350f);color:#fff2cb;box-shadow:0 0 12px rgba(150,97,32,.35)}
.v44-button.danger{border-color:#8b4435;background:#f8ded4;color:#6c271d}
.v44-button:disabled{opacity:.48;cursor:not-allowed;transform:none;box-shadow:none}
.v44-subheading{margin:0 0 12px;padding-bottom:8px;border-bottom:1px dashed rgba(112,70,24,.38);color:#5b350f;font-size:19px;letter-spacing:2px}
.v44-empty{padding:24px;border:2px dashed rgba(112,70,24,.42);border-radius:13px;text-align:center;background:rgba(255,255,255,.42);color:#755e43;line-height:1.8}
.v44-progress{height:11px;overflow:hidden;border:1px solid rgba(77,43,12,.32);border-radius:999px;background:rgba(87,53,20,.12)}
.v44-progress>span{display:block;height:100%;width:var(--value,0%);border-radius:inherit;background:linear-gradient(90deg,#c99b4e,#774615);transition:.35s width}
body.v41-motion-none .v44-progress>span{transition:none}

/* =========================================================
   MY RECORD ROOM
========================================================= */
.v44-room-shell{display:flex;flex-direction:column;gap:15px}
.v44-room-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(260px,.7fr);gap:15px;align-items:start}
.v44-room-stage{
    position:relative;min-height:560px;overflow:hidden;border:5px solid #5d3712;border-radius:19px;
    box-shadow:inset 0 0 35px rgba(255,255,255,.25),0 10px 24px rgba(47,25,4,.25);
    transition:.3s background,.3s box-shadow;
}
.v44-room-stage::before{content:"";position:absolute;left:0;right:0;bottom:0;height:32%;border-top:5px solid rgba(70,36,9,.48);background:repeating-linear-gradient(90deg,rgba(81,44,13,.24) 0 2px,transparent 2px 90px),linear-gradient(#9b642d,#6f401b)}
.v44-room-stage::after{content:"MY RECORD ROOM";position:absolute;left:18px;top:14px;color:rgba(255,255,255,.58);font-size:11px;font-weight:bold;letter-spacing:4px;text-shadow:0 1px 5px rgba(0,0,0,.35)}
.v44-room-stage[data-theme="archive"]{background:radial-gradient(circle at 50% 18%,rgba(255,244,187,.8),transparent 24%),linear-gradient(135deg,#dbc18d,#9f7440)}
.v44-room-stage[data-theme="midnight"]{background:radial-gradient(circle at 78% 13%,rgba(220,235,255,.8),transparent 9%),radial-gradient(circle at 35% 24%,rgba(82,123,177,.35),transparent 25%),linear-gradient(145deg,#273c58,#101827 68%);box-shadow:inset 0 0 50px rgba(74,125,194,.25),0 10px 24px rgba(12,19,35,.45)}
.v44-room-stage[data-theme="midnight"]::before{background:repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 2px,transparent 2px 90px),linear-gradient(#25354b,#111a28);border-color:rgba(190,217,255,.2)}
.v44-room-stage[data-theme="royal"]{background:radial-gradient(circle at 50% 14%,rgba(255,231,150,.7),transparent 22%),linear-gradient(145deg,#6a4a7b,#2e1e3d 72%);box-shadow:inset 0 0 45px rgba(245,208,107,.2),0 10px 24px rgba(35,20,45,.4)}
.v44-room-stage[data-theme="royal"]::before{background:repeating-linear-gradient(90deg,rgba(245,211,112,.15) 0 2px,transparent 2px 85px),linear-gradient(#5f3c55,#321d2f);border-color:rgba(235,199,99,.36)}
.v44-room-window{position:absolute;right:7%;top:9%;width:22%;height:27%;border:7px solid rgba(83,48,14,.75);border-radius:50% 50% 8px 8px;background:linear-gradient(#83aac5,#e7cf96);box-shadow:inset 0 0 18px rgba(255,255,255,.5)}
.v44-room-stage[data-theme="midnight"] .v44-room-window{background:radial-gradient(circle at 60% 30%,#fff4bd 0 8%,transparent 9%),linear-gradient(#17243b,#425677)}
.v44-room-stage[data-theme="royal"] .v44-room-window{background:radial-gradient(circle at 40% 25%,#ffe29b 0 8%,transparent 9%),linear-gradient(#3b294e,#73557e)}
.v44-room-shelf{position:absolute;left:11%;right:10%;top:51%;height:12px;border:3px solid rgba(72,38,9,.7);border-radius:5px;background:#7d481b;box-shadow:0 9px 0 rgba(55,29,7,.25)}
.v44-room-desk{position:absolute;left:22%;right:15%;bottom:14%;height:19%;border:4px solid rgba(67,35,8,.75);border-radius:10px 10px 3px 3px;background:linear-gradient(#98602b,#694019);box-shadow:inset 0 0 10px rgba(255,255,255,.12)}
.v44-room-slot{
    position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;padding:5px;border:2px dashed rgba(255,249,218,.72);
    border-radius:11px;background:rgba(50,28,8,.18);color:#fff5d3;text-shadow:0 1px 4px rgba(0,0,0,.6);cursor:pointer;
    transition:.18s transform,.18s border,.18s box-shadow,.18s background;
}
.v44-room-slot:hover,.v44-room-slot.selected{transform:translateY(-3px);border-style:solid;border-color:#fff0a8;background:rgba(255,240,174,.19);box-shadow:0 0 17px rgba(255,229,139,.58)}
.v44-room-slot.drag-over{transform:scale(1.06);border-style:solid;background:rgba(255,239,147,.35);box-shadow:0 0 26px rgba(255,230,133,.86)}
.v44-room-slot.empty::after{content:attr(data-short);font-size:10px;font-weight:bold;letter-spacing:1px;opacity:.86}
.v44-room-slot.slot-wall-left{left:11%;top:14%;width:23%;height:28%}
.v44-room-slot.slot-wall-right{left:41%;top:14%;width:23%;height:28%}
.v44-room-slot.slot-shelf-left{left:13%;top:42%;width:17%;height:18%}
.v44-room-slot.slot-shelf-center{left:34%;top:42%;width:17%;height:18%}
.v44-room-slot.slot-shelf-right{left:55%;top:42%;width:17%;height:18%}
.v44-room-slot.slot-desk-left{left:27%;bottom:14%;width:18%;height:22%}
.v44-room-slot.slot-desk-right{left:49%;bottom:14%;width:18%;height:22%}
.v44-room-slot.slot-pedestal{right:5%;bottom:8%;width:19%;height:29%;border-color:#ffe79c;background:rgba(91,55,12,.28)}
.v44-display-card{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:7px;border:2px solid rgba(255,255,255,.64);border-radius:9px;background:linear-gradient(145deg,rgba(255,251,226,.95),rgba(216,184,124,.9));color:#4f2f0e;text-shadow:none;box-shadow:0 5px 12px rgba(28,14,2,.35);overflow:hidden}
.v44-display-card b{max-width:100%;font-size:11px;line-height:1.25;text-align:center;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v44-display-card small{margin-top:4px;font-size:9px;letter-spacing:1px}.v44-display-card .rarity{padding:2px 6px;margin:0 0 5px;font-size:8px}
.v44-slot-remove{position:absolute;right:2px;top:2px;z-index:5;width:22px;height:22px;padding:0;border:1px solid rgba(85,39,16,.6);border-radius:50%;background:#fff0d5;color:#6a2d20;font-weight:bold;cursor:pointer;line-height:1}
.v44-room-stage.showcase .v44-room-slot{border-color:transparent;background:transparent}.v44-room-stage.showcase .v44-room-slot.empty{opacity:0;pointer-events:none}.v44-room-stage.showcase::after{opacity:.3}
.v44-room-side{display:flex;flex-direction:column;gap:12px}
.v44-room-panel{padding:15px;border:2px solid rgba(112,70,24,.4);border-radius:14px;background:rgba(255,249,226,.77);box-shadow:inset 0 0 12px rgba(255,255,255,.72),0 5px 12px rgba(58,31,7,.12)}
.v44-room-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v44-room-stat{padding:10px;border-radius:10px;background:rgba(122,78,28,.09);text-align:center}.v44-room-stat b{display:block;color:#5b350f;font-size:22px}.v44-room-stat span{font-size:11px;color:#806747}
.v44-room-detail{min-height:145px;color:#6b5237;font-size:13px;line-height:1.65}.v44-room-detail h5{margin:0 0 7px;color:#58320d;font-size:17px}.v44-room-detail .rarity{margin-bottom:7px}
.v44-inventory-card{padding:16px;border:2px solid rgba(112,70,24,.4);border-radius:15px;background:rgba(255,249,226,.76)}
.v44-inventory-controls{display:grid;grid-template-columns:minmax(180px,1fr) minmax(140px,.4fr);gap:9px;margin-bottom:12px}
.v44-input{width:100%;padding:10px 11px;border:2px solid #98703b;border-radius:10px;background:#fff8df;color:#4f310f;font:inherit}
.v44-card-inventory{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px;max-height:430px;overflow:auto;padding:3px}
.v44-inventory-item{position:relative;min-height:140px;padding:11px;border:2px solid rgba(112,70,24,.38);border-radius:12px;background:rgba(255,255,255,.64);cursor:pointer;transition:.18s transform,.18s box-shadow,.18s opacity;text-align:left;color:#553817}
.v44-inventory-item:hover{transform:translateY(-3px);box-shadow:0 7px 13px rgba(58,31,7,.16)}.v44-inventory-item.placed{opacity:.52}.v44-inventory-item.selected{outline:3px solid rgba(138,90,32,.45)}
.v44-inventory-item .rarity{font-size:9px;padding:2px 7px}.v44-inventory-item b{display:block;margin:8px 0 5px;font-size:13px;line-height:1.35}.v44-inventory-item p{margin:0;color:#775f43;font-size:11px;line-height:1.45;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.v44-room-help{padding:15px;border:2px dashed rgba(112,70,24,.4);border-radius:14px;background:rgba(255,255,255,.44);color:#6f573b;font-size:13px;line-height:1.8}.v44-room-help ol{margin:8px 0 0 20px}.v44-room-help b{color:#58320d}

/* =========================================================
   RECORD SPIRIT / MINI PET
========================================================= */
.v44-pet-shell{display:flex;flex-direction:column;gap:15px}
.v44-pet-main{display:grid;grid-template-columns:minmax(270px,.8fr) minmax(0,1.2fr);gap:15px;align-items:stretch}
.v44-pet-stage{position:relative;min-height:390px;display:grid;place-items:center;padding:25px;overflow:hidden;border:4px solid #654019;border-radius:20px;background:radial-gradient(circle at 50% 35%,rgba(255,246,184,.95),transparent 30%),linear-gradient(145deg,#d9bd82,#8e6536);box-shadow:inset 0 0 30px rgba(255,255,255,.38),0 9px 20px rgba(49,25,4,.24)}
.v44-pet-stage::before,.v44-pet-stage::after{content:"✦  ·  ✧  ·  ✦";position:absolute;color:rgba(94,54,13,.28);letter-spacing:8px}.v44-pet-stage::before{top:18px;left:18px}.v44-pet-stage::after{right:18px;bottom:18px;transform:rotate(180deg)}
.v44-pet-card{text-align:center;position:relative;z-index:2}.v44-pet-name{margin:15px 0 2px;color:#4d2b0a;font-size:25px;letter-spacing:3px}.v44-pet-form{color:#765630;font-size:11px;font-weight:bold;letter-spacing:2px}.v44-pet-line{max-width:310px;margin:13px auto 0;padding:10px 13px;border-radius:13px;background:rgba(255,255,255,.55);color:#654a2d;font-size:12px;line-height:1.65}
.v44-creature{--pet-color:#8e6cab;--pet-light:#eadcf5;position:relative;width:170px;height:150px;margin:auto;filter:drop-shadow(0 14px 13px rgba(45,24,7,.25));animation:v44PetFloat 3.1s ease-in-out infinite}
.v44-creature-body{position:absolute;left:22px;right:22px;bottom:8px;height:112px;border:4px solid rgba(66,38,13,.48);border-radius:52% 48% 44% 48% / 56% 58% 42% 44%;background:radial-gradient(circle at 35% 25%,var(--pet-light),transparent 27%),linear-gradient(145deg,var(--pet-light),var(--pet-color));box-shadow:inset -12px -14px 20px rgba(63,32,11,.12),inset 8px 8px 14px rgba(255,255,255,.42)}
.v44-creature-body::after{content:"";position:absolute;left:20px;right:20px;bottom:-12px;height:22px;border-radius:50%;background:rgba(44,24,7,.22);filter:blur(8px);z-index:-1}
.v44-creature-eye{position:absolute;top:48px;width:13px;height:18px;border-radius:50%;background:#35200f;box-shadow:inset 0 4px 0 rgba(255,255,255,.75)}.v44-creature-eye.eye-left{left:55px}.v44-creature-eye.eye-right{right:55px}
.v44-creature-mouth{position:absolute;left:50%;top:76px;width:22px;height:10px;transform:translateX(-50%);border-bottom:3px solid #5d331c;border-radius:50%}
.v44-creature-symbol{position:absolute;left:50%;top:-3px;display:grid;place-items:center;width:52px;height:52px;transform:translateX(-50%);border:3px solid rgba(255,255,255,.72);border-radius:50%;background:var(--pet-color);color:#fff8d8;font-size:26px;box-shadow:0 0 18px color-mix(in srgb,var(--pet-color) 65%,transparent)}
.v44-creature-wing{display:none;position:absolute;top:54px;width:42px;height:55px;border:3px solid rgba(255,255,255,.5);background:color-mix(in srgb,var(--pet-light) 70%,transparent)}.v44-creature-wing.wing-left{left:2px;border-radius:70% 25% 70% 30%;transform:rotate(-24deg)}.v44-creature-wing.wing-right{right:2px;border-radius:25% 70% 30% 70%;transform:rotate(24deg)}
.v44-creature.stage-2 .v44-creature-wing,.v44-creature.stage-3 .v44-creature-wing,.v44-creature.stage-4 .v44-creature-wing{display:block}.v44-creature.stage-3{width:190px;height:170px}.v44-creature.stage-3 .v44-creature-body{height:125px}.v44-creature.stage-4{width:205px;height:185px}.v44-creature.stage-4 .v44-creature-body{height:135px;border-width:5px;box-shadow:0 0 25px color-mix(in srgb,var(--pet-color) 55%,transparent),inset -12px -14px 20px rgba(63,32,11,.12),inset 8px 8px 14px rgba(255,255,255,.42)}
.v44-creature.affinity-game{--pet-color:#537caf;--pet-light:#d9ecff}.v44-creature.affinity-music{--pet-color:#b26083;--pet-light:#ffe0ef}.v44-creature.affinity-adventure{--pet-color:#b66b3d;--pet-light:#ffe0b5}.v44-creature.affinity-memory{--pet-color:#8e6cab;--pet-light:#eadcf5}
@keyframes v44PetFloat{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-9px) rotate(1deg)}}
body.v41-motion-none .v44-creature{animation:none}
.v44-pet-info{display:flex;flex-direction:column;gap:11px;padding:17px;border:2px solid rgba(112,70,24,.4);border-radius:15px;background:rgba(255,249,226,.78)}
.v44-pet-level-row{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}.v44-pet-level-row b{color:#4f2d0b;font-size:26px}.v44-pet-level-row span{color:#7b6245;font-size:12px}
.v44-pet-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.v44-pet-stat{padding:10px;border-radius:11px;background:rgba(111,70,24,.08);text-align:center}.v44-pet-stat b{display:block;color:#59340f;font-size:21px}.v44-pet-stat span{font-size:10px;color:#806a4e;letter-spacing:1px}
.v44-pet-name-editor{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.v44-pet-name-editor input{min-width:0}
.v44-care-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.v44-care-button{min-height:94px;padding:12px;border:2px solid rgba(112,70,24,.42);border-radius:12px;background:rgba(255,255,255,.55);color:#573711;text-align:left;cursor:pointer;transition:.18s transform,.18s box-shadow,.18s background}.v44-care-button:hover{transform:translateY(-3px);background:#fff1c9;box-shadow:0 7px 13px rgba(58,31,7,.15)}.v44-care-button b{display:block;margin-bottom:5px;font-size:13px}.v44-care-button small{display:block;color:#796247;font-size:10px;line-height:1.45}.v44-care-button .v44-care-icon{float:right;font-size:22px}
.v44-soul-balance{
    display:block;
    width:max-content;
    max-width:100%;
    margin-top:8px;
    padding:4px 8px;
    border:1px solid rgba(104,72,28,.24);
    border-radius:999px;
    background:rgba(255,245,205,.88);
    color:#6b4316;
    font-size:10px;
    font-weight:bold;
    letter-spacing:.04em;
}
.v44-soul-balance.insufficient{
    background:rgba(169,71,53,.1);
    color:#873f30;
}
.v44-pet-message{padding:11px 13px;border-radius:11px;background:rgba(94,57,18,.09);color:#664b2e;font-size:12px;line-height:1.65}.v44-pet-message.success{background:rgba(85,137,73,.13);color:#3f6638}.v44-pet-message.error{background:rgba(169,71,53,.13);color:#82382b}
.v44-affinity-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v44-affinity-card{padding:13px;border:2px solid rgba(112,70,24,.34);border-radius:12px;background:rgba(255,255,255,.5)}.v44-affinity-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;color:#5d3c19;font-size:12px;font-weight:bold}.v44-affinity-head b{font-size:16px}.v44-affinity-card p{margin:8px 0 0;color:#79634a;font-size:10px;line-height:1.5}
.v44-pet-guide{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.v44-guide-card{padding:16px;border:2px solid rgba(112,70,24,.38);border-radius:14px;background:rgba(255,249,226,.72);color:#6c5438;font-size:13px;line-height:1.75}.v44-guide-card h4{margin:0 0 8px;color:#57320d;font-size:17px;letter-spacing:1px}.v44-guide-card ul,.v44-guide-card ol{margin:7px 0 0 20px}.v44-guide-card strong{color:#59340f}

/* =========================================================
   FLOATING PET / OPTION / DASHBOARD
========================================================= */
.v44-floating-pet{position:fixed;left:18px;bottom:18px;z-index:2147481900;display:flex;align-items:center;gap:8px;padding:7px 10px 7px 7px;border:2px solid #74501f;border-radius:999px;background:linear-gradient(145deg,#fff6d8,#d5aa68);color:#55320f;box-shadow:0 6px 16px rgba(55,29,4,.3),inset 0 0 9px rgba(255,255,255,.72);cursor:pointer;transition:.2s transform,.2s opacity,.2s box-shadow}.v44-floating-pet:hover{transform:translateY(-4px);box-shadow:0 9px 19px rgba(55,29,4,.34),0 0 13px rgba(222,174,93,.48)}.v44-floating-pet.hidden{display:none}.v44-floating-pet-orb{--orb:#8e6cab;display:grid;place-items:center;width:39px;height:39px;border:2px solid rgba(255,255,255,.7);border-radius:50% 50% 44% 48%;background:radial-gradient(circle at 35% 25%,#fff,transparent 23%),var(--orb);color:#fff8d6;font-size:17px;animation:v44PetFloat 2.8s ease-in-out infinite}.v44-floating-pet.affinity-game .v44-floating-pet-orb{--orb:#537caf}.v44-floating-pet.affinity-music .v44-floating-pet-orb{--orb:#b26083}.v44-floating-pet.affinity-adventure .v44-floating-pet-orb{--orb:#b66b3d}.v44-floating-pet.affinity-memory .v44-floating-pet-orb{--orb:#8e6cab}.v44-floating-pet-text b{display:block;font-size:11px}.v44-floating-pet-text small{display:block;margin-top:1px;font-size:9px;opacity:.76}.v44-floating-speech{position:absolute;left:8px;bottom:58px;max-width:240px;padding:9px 11px;border-radius:11px;background:rgba(47,28,8,.93);color:#fff5d8;font-size:10px;line-height:1.5;opacity:0;visibility:hidden;transform:translateY(5px);transition:.2s;pointer-events:none}.v44-floating-pet.speaking .v44-floating-speech{opacity:1;visibility:visible;transform:none}
.v44-option-card{padding:18px;border:2px solid rgba(111,70,24,.45);border-radius:15px;background:rgba(255,249,226,.75);box-shadow:inset 0 0 13px rgba(255,255,255,.74),0 5px 12px rgba(58,31,7,.13)}.v44-option-card h4{margin:0 0 7px;color:#5c350d;font-size:20px;letter-spacing:2px}.v44-option-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 0;border-top:1px dashed rgba(112,70,25,.28)}.v44-option-row:first-of-type{border-top:0}.v44-option-row p{margin:3px 0 0;color:#806a4e;font-size:11px;line-height:1.5}.v44-option-toggle{min-width:92px;padding:9px 12px;border:2px solid #79501d;border-radius:999px;background:#ede0bd;color:#604017;font:700 13px inherit;cursor:pointer}.v44-option-toggle.active{background:linear-gradient(135deg,#8c5d22,#5f390e);color:#fff5d5}
.v44-dashboard-companion{display:grid;grid-template-columns:1fr 1fr;gap:11px}.v44-dashboard-card{padding:15px;border:2px solid rgba(112,71,25,.4);border-radius:14px;background:rgba(255,249,224,.72);box-shadow:inset 0 0 10px rgba(255,255,255,.65);color:#6b5135}.v44-dashboard-card h5{margin:0 0 8px;color:#5a350f;font-size:15px;letter-spacing:1px}.v44-dashboard-card p{margin:0 0 10px;font-size:11px;line-height:1.6}.v44-dashboard-card b{color:#4e2c0a}

@media(max-width:950px){.v44-room-layout,.v44-pet-main{grid-template-columns:1fr}.v44-room-stage{min-height:520px}.v44-pet-guide{grid-template-columns:1fr}}
@media(max-width:700px){
    .v44-room-stage{min-height:470px}.v44-room-slot.slot-pedestal{right:3%;width:22%}.v44-room-slot.slot-wall-left{left:7%;width:27%}.v44-room-slot.slot-wall-right{left:38%;width:27%}
    .v44-inventory-controls{grid-template-columns:1fr}.v44-card-inventory{grid-template-columns:repeat(2,minmax(0,1fr));max-height:390px}.v44-care-grid,.v44-affinity-grid{grid-template-columns:1fr}.v44-pet-stats{grid-template-columns:1fr 1fr 1fr}.v44-dashboard-companion{grid-template-columns:1fr}
    .v44-floating-pet{left:10px;bottom:66px;padding-right:8px}.v44-floating-pet-text{display:none}.v44-floating-speech{max-width:190px}
}
@media(max-width:460px){.v44-room-stage{min-height:430px}.v44-card-inventory{grid-template-columns:1fr}.v44-room-slot.slot-shelf-left{left:8%;width:20%}.v44-room-slot.slot-shelf-center{left:31%;width:20%}.v44-room-slot.slot-shelf-right{left:54%;width:20%}.v44-pet-stats{grid-template-columns:1fr}.v44-creature{transform:scale(.86)}}
`;
        document.head.appendChild(style);
    }

    function registerPages() {
        try {
            if (typeof records !== "undefined") {
                records[ROOM_PAGE] = roomPageHtml();
                records[PET_PAGE] = petPageHtml();
            }
            if (typeof pageCategories !== "undefined") {
                pageCategories[ROOM_PAGE] = "COLLECTION";
                pageCategories[PET_PAGE] = "ADVENTURE";
            }
            if (typeof pageBackgrounds !== "undefined") {
                pageBackgrounds[ROOM_PAGE] = "item_box_background.png";
                pageBackgrounds[PET_PAGE] = "achievements_background.png";
            }
            if (typeof pageThemes !== "undefined") {
                pageThemes[ROOM_PAGE] = "collection";
                pageThemes[PET_PAGE] = "achievement";
            }
        } catch (error) {
            console.warn("Ver.4.4のページ登録に失敗しました。", error);
        }
    }

    function createMenuItem(pageName, icon, label) {
        const item = document.createElement("div");
        item.className = "menu-item";
        item.dataset.page = pageName;
        item.dataset.new = "true";
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.innerHTML = `<span class="menu-thumb">${icon}</span><span class="menu-label">${label}</span><span class="menu-new">NEW</span>`;
        item.addEventListener("click", event => {
            event.preventDefault();
            openCustomPage(pageName, true);
        });
        item.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCustomPage(pageName, true);
            }
        });
        return item;
    }

    function addMenuItems() {
        const collectionButton = document.querySelector(
            '.menu-category[data-category="COLLECTION"]'
        );
        const collectionGroup = collectionButton?.nextElementSibling;

        if (collectionGroup?.classList.contains("menu-group")) {
            let roomItem = document.querySelector(
                `.menu-item[data-page="${ROOM_PAGE}"]`
            );

            if (!roomItem) {
                roomItem = createMenuItem(ROOM_PAGE, "🏠", "MY ROOM");
            }

            /*
             * MY ROOMがメニュー末尾へ押し出されないよう、
             * GAME LIBRARYの直後へ固定します。
             */
            const gameLibraryItem = collectionGroup.querySelector(
                '.menu-item[data-page="GAME LIBRARY"]'
            );
            const itemBox = collectionGroup.querySelector(
                '.menu-item[data-page="ITEM BOX"]'
            );
            const anchor = gameLibraryItem || itemBox;

            if (anchor) {
                collectionGroup.insertBefore(
                    roomItem,
                    anchor.nextElementSibling
                );
            } else if (!collectionGroup.contains(roomItem)) {
                collectionGroup.prepend(roomItem);
            }
        }

        const adventureButton = document.querySelector(
            '.menu-category[data-category="ADVENTURE"]'
        );
        const adventureGroup = adventureButton?.nextElementSibling;

        if (
            adventureGroup?.classList.contains("menu-group") &&
            !document.querySelector(
                `.menu-item[data-page="${PET_PAGE}"]`
            )
        ) {
            adventureGroup.appendChild(
                createMenuItem(PET_PAGE, "✦", "RECORD PET")
            );
        }

        refreshNewBadgesV44();
    }

    function readViewedPages() {
        const data = readJson(VIEWED_STORAGE_KEY, []);
        return Array.isArray(data) ? data : [];
    }

    function markViewed(pageName) {
        const pages = readViewedPages();
        if (!pages.includes(pageName)) {
            pages.push(pageName);
            writeJson(VIEWED_STORAGE_KEY, pages);
        }
        refreshNewBadgesV44();
    }

    function refreshNewBadgesV44() {
        const viewed = readViewedPages();
        [ROOM_PAGE, PET_PAGE].forEach(pageName => {
            const item = document.querySelector(`.menu-item[data-page="${pageName}"]`);
            const badge = item?.querySelector(".menu-new");
            if (badge) badge.hidden = viewed.includes(pageName);
        });
    }

    function roomPageHtml() {
        return `
<section class="v44-room-shell" data-v44-page="room">
    <div class="v44-page-intro">
        <b>🏠 MY RECORD ROOM</b>
        <p>AONO GACHAやSOUL交換で入手したカードを、額縁・棚・机・中央台座の8か所へ自由に飾れます。配置、部屋テーマ、選択中のカードはこのブラウザに自動保存されます。</p>
    </div>

    <div class="v44-toolbar" aria-label="部屋の操作">
        ${Object.entries(roomThemes).map(([key, value]) => `<button class="v44-button" data-v44-room-theme="${key}" type="button">${value.label}</button>`).join("")}
        <button class="v44-button" data-v44-room-auto type="button">✦ 高レアから自動配置</button>
        <button class="v44-button" data-v44-room-showcase type="button">▣ 鑑賞モード</button>
        <button class="v44-button danger" data-v44-room-clear type="button">全部外す</button>
    </div>

    <div class="v44-room-layout">
        <div id="v44RoomStage" class="v44-room-stage" data-theme="archive">
            <div class="v44-room-window" aria-hidden="true"></div>
            <div class="v44-room-shelf" aria-hidden="true"></div>
            <div class="v44-room-desk" aria-hidden="true"></div>
            ${roomSlots.map(slot => `<button class="v44-room-slot empty ${slot.className}" data-v44-room-slot="${slot.id}" data-short="${slot.short}" type="button" aria-label="${slot.label}"></button>`).join("")}
        </div>

        <aside class="v44-room-side">
            <div class="v44-room-panel">
                <h4 class="v44-subheading">ROOM STATUS</h4>
                <div class="v44-room-stats">
                    <div class="v44-room-stat"><b id="v44RoomPlaced">0 / 8</b><span>DISPLAYED</span></div>
                    <div class="v44-room-stat"><b id="v44RoomOwned">0</b><span>OWNED CARDS</span></div>
                </div>
            </div>
            <div class="v44-room-panel">
                <h4 class="v44-subheading">SELECTED DISPLAY</h4>
                <div id="v44RoomDetail" class="v44-room-detail">飾る場所を選んでください。</div>
            </div>
            <div class="v44-room-help">
                <b>飾り方</b>
                <ol>
                    <li>部屋内の飾りたい場所を選択します。</li>
                    <li>下のカード一覧からカードをクリックします。</li>
                    <li>PCではカードを部屋へドラッグ＆ドロップすることもできます。</li>
                    <li>同じカードは1か所だけに飾れます。別の場所へ置くと自動で移動します。</li>
                </ol>
            </div>
        </aside>
    </div>

    <div class="v44-inventory-card">
        <h4 class="v44-subheading">OWNED CARD INVENTORY</h4>
        <div class="v44-inventory-controls">
            <input id="v44RoomSearch" class="v44-input" type="search" placeholder="カード名・No.で検索">
            <select id="v44RoomRarity" class="v44-input" aria-label="レアリティで絞り込み">
                <option value="ALL">すべてのレアリティ</option>
                <option value="SECRET">SECRET</option><option value="UR">UR</option><option value="SSR">SSR</option>
                <option value="SR">SR</option><option value="R">R</option><option value="N">N</option>
            </select>
        </div>
        <div id="v44CardInventory" class="v44-card-inventory"></div>
    </div>
</section>`;
    }

    function creatureHtml(compact = false) {
        const evolution = evolutionInfo();
        const scaleClass = compact ? "compact" : "";
        return `
<div class="v44-creature stage-${evolution.stage} affinity-${evolution.affinity} ${scaleClass}" aria-label="${escapeHtml(evolution.name)}">
    <span class="v44-creature-wing wing-left"></span><span class="v44-creature-wing wing-right"></span>
    <div class="v44-creature-body"></div>
    <span class="v44-creature-eye eye-left"></span><span class="v44-creature-eye eye-right"></span>
    <span class="v44-creature-mouth"></span>
    <span class="v44-creature-symbol">${evolution.symbol}</span>
</div>`;
    }

    function getCurrentSoulBalance() {
        try {
            if (typeof gachaData !== "undefined") {
                return Math.max(0, Number(gachaData.soul || 0));
            }
        } catch (error) {}
        return 0;
    }

    function soulBalanceLabel() {
        return `現在所持：${getCurrentSoulBalance().toLocaleString("ja-JP")} SOUL`;
    }

    function petPageHtml() {
        return `
<section class="v44-pet-shell" data-v44-page="pet">
    <div class="v44-page-intro">
        <b>✦ RECORD SPIRIT</b>
        <p>サイト内のページを見たり、お世話をしたりすると成長するミニペットです。どの記録を多く見るかによってGAME・MUSIC・ADVENTURE・MEMORYの傾向が変わり、Lv.12以降の姿が分岐します。</p>
    </div>

    <div class="v44-pet-main">
        <div class="v44-pet-stage">
            <div class="v44-pet-card">
                <div id="v44PetCreatureWrap">${creatureHtml()}</div>
                <h4 id="v44PetName" class="v44-pet-name">${escapeHtml(petData.name)}</h4>
                <div id="v44PetForm" class="v44-pet-form">INK DROP</div>
                <div id="v44PetLine" class="v44-pet-line">記録の匂いがする……。</div>
            </div>
        </div>

        <div class="v44-pet-info">
            <div class="v44-pet-level-row"><b id="v44PetLevel">LEVEL 1</b><span id="v44PetExpText">EXP 0 / 45</span></div>
            <div class="v44-progress" aria-label="経験値"><span id="v44PetExpBar" style="--value:0%"></span></div>
            <div class="v44-pet-stats">
                <div class="v44-pet-stat"><b id="v44PetBond">15</b><span>BOND / 親密度</span></div>
                <div class="v44-pet-stat"><b id="v44PetMood">72</b><span>MOOD / 気分</span></div>
                <div class="v44-pet-stat"><b id="v44PetEnergy">82</b><span>ENERGY / 元気</span></div>
            </div>

            <div class="v44-pet-name-editor">
                <input id="v44PetNameInput" class="v44-input" type="text" maxlength="12" value="${escapeHtml(petData.name)}" aria-label="ペットの名前">
                <button class="v44-button" data-v44-pet-rename type="button">名前を保存</button>
            </div>

            <h4 class="v44-subheading">CARE ACTIONS</h4>
            <div class="v44-care-grid">
                ${Object.entries(careActions).map(([key, action]) => `
                    <button class="v44-care-button" data-v44-care="${key}" type="button">
                        <span class="v44-care-icon">${action.icon}</span>
                        <b>${action.label}</b><small>${action.description}</small>
                    </button>`).join("")}
                <button class="v44-care-button" data-v44-soul-snack type="button">
                    <span class="v44-care-icon">🔮</span>
                    <b>SOULのおやつ</b>
                    <small>
                        10 SOULを使い、元気・親密度・経験値をまとめて増やします。
                        <span id="v44SoulBalance" class="v44-soul-balance">${soulBalanceLabel()}</span>
                    </small>
                </button>
            </div>
            <div id="v44PetMessage" class="v44-pet-message">本日のお世話経験値ボーナス：あと <b id="v44CareRemaining">8</b> 回</div>
        </div>
    </div>

    <div class="v44-room-panel">
        <h4 class="v44-subheading">EVOLUTION AFFINITY</h4>
        <div id="v44AffinityGrid" class="v44-affinity-grid"></div>
    </div>

    <div class="v44-pet-guide">
        <article class="v44-guide-card">
            <h4>成長の仕組み</h4>
            <ul>
                <li><strong>その日に初めて開いたページ</strong>ごとにEXPと傾向ポイントを獲得します。</li>
                <li>同じページを何度も開いても、閲覧EXPは1日1回だけです。</li>
                <li>お世話は何度でもできますが、EXPボーナスは<strong>1日8回</strong>までです。</li>
                <li>数日見ないとENERGYとMOODが少し下がりますが、20未満にはなりません。</li>
            </ul>
        </article>
        <article class="v44-guide-card">
            <h4>進化段階</h4>
            <ol>
                <li><strong>Lv.1〜4：</strong>INK DROP。進化先を探している幼体。</li>
                <li><strong>Lv.5〜11：</strong>最も高い傾向に合わせた幼年精霊。</li>
                <li><strong>Lv.12〜19：</strong>4種類の専用形態へ進化。</li>
                <li><strong>Lv.20以降：</strong>CHRONICLE SPIRITとして上位進化。</li>
            </ol>
        </article>
        <article class="v44-guide-card">
            <h4>4つの進化ルート</h4>
            <ul>
                <li><strong>GAME：</strong>GAME LIBRARY、ガチャ、コレクション、MY ROOM。</li>
                <li><strong>MUSIC：</strong>PERFORMANCE RECORD、SKILL。</li>
                <li><strong>ADVENTURE：</strong>MUSCLE、ACHIEVEMENTS、RECORD PET。</li>
                <li><strong>MEMORY：</strong>CHARACTER、GALLERY、PREFERENCESなど人物・思い出系。</li>
            </ul>
        </article>
        <article class="v44-guide-card">
            <h4>各ステータス</h4>
            <ul>
                <li><strong>BOND：</strong>どれだけ仲良くなったか。お世話で上昇します。</li>
                <li><strong>MOOD：</strong>現在の気分。遊ぶ・音楽・読み聞かせで上がります。</li>
                <li><strong>ENERGY：</strong>行動する元気。修行で減り、休息やしずくで回復します。</li>
                <li><strong>EXP：</strong>レベルと進化段階を決める経験値です。</li>
            </ul>
        </article>
    </div>
</section>`;
    }

    function openCustomPage(pageName, playSound = false) {
        if (![ROOM_PAGE, PET_PAGE].includes(pageName)) return;
        const content = document.getElementById("content");
        if (!content) return;

        document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("selected"));
        const menuItem = document.querySelector(`.menu-item[data-page="${pageName}"]`);
        menuItem?.classList.add("selected");

        content.innerHTML = pageName === ROOM_PAGE ? roomPageHtml() : petPageHtml();
        if (typeof applyPagePresentation === "function") applyPagePresentation(pageName);
        if (playSound && typeof playUiSound === "function") playUiSound("page");
        document.querySelector(".window.record")?.scrollTo({ top: 0, behavior: "auto" });
        markViewed(pageName);
        trackPageVisit(pageName, true);

        requestAnimationFrame(() => {
            if (pageName === ROOM_PAGE) initializeRoomPage();
            if (pageName === PET_PAGE) initializePetPage();
            window.setTimeout(() => enhancePageHeader(pageName), 50);
        });
    }

    function enhancePageHeader(pageName) {
        const header = document.querySelector(`.v41-page-header[data-page="${pageName}"]`);
        if (!header) return;
        const meta = pageName === ROOM_PAGE
            ? { icon: "🏠", category: "COLLECTION RECORD", title: "MY RECORD ROOM", description: "獲得カードを飾り、自分だけの展示室を作るコレクションページ。" }
            : { icon: "✦", category: "ADVENTURE RECORD", title: "RECORD SPIRIT", description: "サイト内の行動とお世話で成長・進化するミニペット。" };
        const icon = header.querySelector(".v41-page-header-icon");
        const category = header.querySelector(".v41-page-header-category");
        const title = header.querySelector("h3");
        const description = header.querySelector(".v41-page-header-description");
        if (icon && icon.textContent !== meta.icon) icon.textContent = meta.icon;
        if (category && category.textContent !== meta.category) category.textContent = meta.category;
        if (title && title.textContent !== meta.title) title.textContent = meta.title;
        if (description && description.textContent !== meta.description) description.textContent = meta.description;
    }

    function initializeRoomPage() {
        sanitizeRoomPlacements();
        selectedRoomSlot = roomSlots.some(slot => slot.id === selectedRoomSlot) ? selectedRoomSlot : roomSlots[0].id;
        renderRoom();
        bindRoomControls();
    }

    function bindRoomControls() {
        const root = document.querySelector('[data-v44-page="room"]');
        if (!root || root.dataset.bound === "true") return;
        root.dataset.bound = "true";

        root.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;

            const themeButton = target.closest("[data-v44-room-theme]");
            if (themeButton) {
                roomState.theme = themeButton.dataset.v44RoomTheme;
                saveRoomState();
                renderRoom();
                return;
            }

            const removeButton = target.closest("[data-v44-room-remove]");
            if (removeButton) {
                event.stopPropagation();
                removeCardFromSlot(removeButton.dataset.v44RoomRemove);
                return;
            }

            const slot = target.closest("[data-v44-room-slot]");
            if (slot) {
                selectedRoomSlot = slot.dataset.v44RoomSlot;
                selectedRoomCardId = roomState.placements[selectedRoomSlot] || null;
                renderRoomStage();
                renderRoomDetail();
                return;
            }

            const cardButton = target.closest("[data-v44-card-id]");
            if (cardButton) {
                const cardId = Number(cardButton.dataset.v44CardId);
                selectedRoomCardId = cardId;
                placeCardInSelectedSlot(cardId);
                return;
            }

            if (target.closest("[data-v44-room-auto]")) {
                autoDecorateRoom();
                return;
            }
            if (target.closest("[data-v44-room-showcase]")) {
                const stage = document.getElementById("v44RoomStage");
                stage?.classList.toggle("showcase");
                target.closest("[data-v44-room-showcase]")?.classList.toggle("active", stage?.classList.contains("showcase"));
                return;
            }
            if (target.closest("[data-v44-room-clear]")) {
                if (window.confirm("部屋に飾ったカードをすべて外しますか？カード自体は消えません。")) {
                    roomSlots.forEach(slotItem => { roomState.placements[slotItem.id] = null; });
                    saveRoomState();
                    selectedRoomCardId = null;
                    renderRoom();
                }
            }
        });

        root.addEventListener("input", event => {
            if (event.target.matches("#v44RoomSearch,#v44RoomRarity")) renderRoomInventory();
        });
        root.addEventListener("change", event => {
            if (event.target.matches("#v44RoomSearch,#v44RoomRarity")) renderRoomInventory();
        });

        root.addEventListener("dragstart", event => {
            const item = event.target.closest?.("[data-v44-card-id]");
            if (!item || !event.dataTransfer) return;
            event.dataTransfer.setData("text/plain", item.dataset.v44CardId);
            event.dataTransfer.effectAllowed = "move";
        });
        root.addEventListener("dragover", event => {
            const slot = event.target.closest?.("[data-v44-room-slot]");
            if (!slot) return;
            event.preventDefault();
            slot.classList.add("drag-over");
        });
        root.addEventListener("dragleave", event => {
            event.target.closest?.("[data-v44-room-slot]")?.classList.remove("drag-over");
        });
        root.addEventListener("drop", event => {
            const slot = event.target.closest?.("[data-v44-room-slot]");
            if (!slot || !event.dataTransfer) return;
            event.preventDefault();
            slot.classList.remove("drag-over");
            const cardId = Number(event.dataTransfer.getData("text/plain"));
            if (!cardId) return;
            selectedRoomSlot = slot.dataset.v44RoomSlot;
            selectedRoomCardId = cardId;
            placeCardInSelectedSlot(cardId);
        });
    }

    function renderRoom() {
        const stage = document.getElementById("v44RoomStage");
        if (stage) stage.dataset.theme = roomState.theme;
        document.querySelectorAll("[data-v44-room-theme]").forEach(button => {
            button.classList.toggle("active", button.dataset.v44RoomTheme === roomState.theme);
        });
        renderRoomStage();
        renderRoomInventory();
        renderRoomDetail();
        updateRoomStats();
    }

    function renderRoomStage() {
        const stage = document.getElementById("v44RoomStage");
        if (!stage) return;
        roomSlots.forEach(slotMeta => {
            const slot = stage.querySelector(`[data-v44-room-slot="${slotMeta.id}"]`);
            if (!slot) return;
            const cardId = roomState.placements[slotMeta.id];
            const card = cardId ? getCard(cardId) : null;
            slot.classList.toggle("selected", selectedRoomSlot === slotMeta.id);
            slot.classList.toggle("empty", !card);
            slot.innerHTML = card ? `
                <div class="v44-display-card">
                    <button class="v44-slot-remove" data-v44-room-remove="${slotMeta.id}" type="button" aria-label="${slotMeta.label}から外す">×</button>
                    <span class="rarity ${getRarityClassSafe(card.rarity)}">${card.rarity}</span>
                    <b>${escapeHtml(card.name)}</b>
                    <small>No.${String(card.id).padStart(3, "0")}</small>
                </div>` : "";
        });
    }

    function renderRoomInventory() {
        const container = document.getElementById("v44CardInventory");
        if (!container) return;
        const search = (document.getElementById("v44RoomSearch")?.value || "").trim().toLowerCase();
        const rarity = document.getElementById("v44RoomRarity")?.value || "ALL";
        const placed = new Set(Object.values(roomState.placements).filter(Boolean).map(Number));
        const cards = getOwnedCards()
            .filter(card => {
                const no = String(card.id).padStart(3, "0");
                const matchesSearch = !search || String(card.name).toLowerCase().includes(search) || no.includes(search);
                const matchesRarity = rarity === "ALL" || card.rarity === rarity;
                return matchesSearch && matchesRarity;
            })
            .sort((a, b) => rarityWeight(b.rarity) - rarityWeight(a.rarity) || Number(a.id) - Number(b.id));

        if (!getOwnedCards().length) {
            container.innerHTML = '<div class="v44-empty" style="grid-column:1/-1">まだ飾れるカードがありません。<br>AONO GACHAまたはSOUL CARD EXCHANGEでカードを獲得すると、ここへ表示されます。</div>';
            return;
        }
        if (!cards.length) {
            container.innerHTML = '<div class="v44-empty" style="grid-column:1/-1">条件に一致する所持カードがありません。</div>';
            return;
        }
        container.innerHTML = cards.map(card => `
            <button class="v44-inventory-item ${placed.has(Number(card.id)) ? "placed" : ""} ${selectedRoomCardId === Number(card.id) ? "selected" : ""}" data-v44-card-id="${card.id}" draggable="true" type="button">
                <span class="rarity ${getRarityClassSafe(card.rarity)}">${card.rarity}</span>
                <b>No.${String(card.id).padStart(3, "0")} ${escapeHtml(card.name)}</b>
                <p>${escapeHtml(card.text)}</p>
            </button>`).join("");
    }

    function renderRoomDetail() {
        const detail = document.getElementById("v44RoomDetail");
        if (!detail) return;
        const slot = roomSlots.find(item => item.id === selectedRoomSlot);
        const cardId = roomState.placements[selectedRoomSlot] || selectedRoomCardId;
        const card = cardId ? getCard(cardId) : null;
        if (!card) {
            detail.innerHTML = `<h5>${escapeHtml(slot?.label || "飾る場所")}</h5>この場所を選択中です。下の所持カードをクリックすると配置できます。`;
            return;
        }
        detail.innerHTML = `
            <span class="rarity ${getRarityClassSafe(card.rarity)}">${card.rarity}</span>
            <h5>No.${String(card.id).padStart(3, "0")} ${escapeHtml(card.name)}</h5>
            <p>${escapeHtml(card.text)}</p>
            <small>${slot ? `${slot.label}に展示中` : "カードを選択中"}</small>`;
    }

    function updateRoomStats() {
        const placedCount = Object.values(roomState.placements).filter(Boolean).length;
        const placed = document.getElementById("v44RoomPlaced");
        const owned = document.getElementById("v44RoomOwned");
        if (placed) placed.textContent = `${placedCount} / ${roomSlots.length}`;
        if (owned) owned.textContent = String(getOwnedCards().length);
        updateDashboardCompanion();
    }

    function placeCardInSelectedSlot(cardId) {
        const owned = new Set(getOwnedCardIds());
        if (!owned.has(Number(cardId))) return;
        if (!selectedRoomSlot) selectedRoomSlot = roomSlots[0].id;
        roomSlots.forEach(slot => {
            if (Number(roomState.placements[slot.id]) === Number(cardId)) roomState.placements[slot.id] = null;
        });
        roomState.placements[selectedRoomSlot] = Number(cardId);
        selectedRoomCardId = Number(cardId);
        saveRoomState();
        rewardPetForRoomDecoration();
        renderRoom();
        if (typeof playUiSound === "function") playUiSound("success");
    }

    function removeCardFromSlot(slotId) {
        if (!roomState.placements[slotId]) return;
        roomState.placements[slotId] = null;
        selectedRoomSlot = slotId;
        selectedRoomCardId = null;
        saveRoomState();
        renderRoom();
        if (typeof playUiSound === "function") playUiSound("click");
    }

    function autoDecorateRoom() {
        const cards = getOwnedCards().sort((a, b) => rarityWeight(b.rarity) - rarityWeight(a.rarity) || Number(a.id) - Number(b.id));
        roomSlots.forEach((slot, index) => {
            roomState.placements[slot.id] = cards[index] ? Number(cards[index].id) : null;
        });
        saveRoomState();
        selectedRoomSlot = roomSlots[0].id;
        selectedRoomCardId = roomState.placements[selectedRoomSlot];
        rewardPetForRoomDecoration();
        renderRoom();
        if (typeof playUiSound === "function") playUiSound("success");
    }

    function rewardPetForRoomDecoration() {
        resetDailyDataIfNeeded();
        if (petData.daily.roomRewards < 5) {
            petData.daily.roomRewards += 1;
            petData.exp += 2;
            petData.bond = clamp(petData.bond + 1);
            petData.affinity.game += 1;
            savePetData();
            updateFloatingPet();
        }
    }

    function initializePetPage() {
        renderPetPage();
        bindPetControls();
    }

    function bindPetControls() {
        const root = document.querySelector('[data-v44-page="pet"]');
        if (!root || root.dataset.bound === "true") return;
        root.dataset.bound = "true";
        root.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const care = target.closest("[data-v44-care]");
            if (care) {
                performCareAction(care.dataset.v44Care);
                return;
            }
            if (target.closest("[data-v44-soul-snack]")) {
                giveSoulSnack();
                return;
            }
            if (target.closest("[data-v44-pet-rename]")) {
                renamePet();
            }
        });
        root.querySelector("#v44PetNameInput")?.addEventListener("keydown", event => {
            if (event.key === "Enter") renamePet();
        });
    }

    function renderPetPage(message = "") {
        const root = document.querySelector('[data-v44-page="pet"]');
        if (!root) return;
        const level = levelInfo();
        const evolution = evolutionInfo();
        const creatureWrap = document.getElementById("v44PetCreatureWrap");
        if (creatureWrap) creatureWrap.innerHTML = creatureHtml();
        setText("v44PetName", petData.name);
        setText("v44PetForm", `${evolution.name} / ${evolution.japanese}`);
        setText("v44PetLine", message || petDialogue(getCurrentPageName()));
        setText("v44PetLevel", `LEVEL ${level.level}`);
        setText("v44PetExpText", `EXP ${level.current} / ${level.next}`);
        const expBar = document.getElementById("v44PetExpBar");
        if (expBar) expBar.style.setProperty("--value", `${level.percent}%`);
        setText("v44PetBond", Math.round(petData.bond));
        setText("v44PetMood", Math.round(petData.mood));
        setText("v44PetEnergy", Math.round(petData.energy));
        const input = document.getElementById("v44PetNameInput");
        if (input && document.activeElement !== input) input.value = petData.name;
        setText(
            "v44CareRemaining",
            Math.max(0, 8 - petData.daily.careCount)
        );

        const soulBalance = document.getElementById("v44SoulBalance");
        if (soulBalance) {
            const currentSoul = getCurrentSoulBalance();
            soulBalance.textContent =
                `現在所持：${currentSoul.toLocaleString("ja-JP")} SOUL`;
            soulBalance.classList.toggle(
                "insufficient",
                currentSoul < 10
            );
        }

        renderAffinityGrid();
        updateFloatingPet();
        updateDashboardCompanion();
    }

    function renderAffinityGrid() {
        const grid = document.getElementById("v44AffinityGrid");
        if (!grid) return;
        const max = Math.max(10, ...Object.values(petData.affinity));
        const dominant = dominantAffinity();
        grid.innerHTML = Object.entries(affinityMeta).map(([key, meta]) => {
            const value = petData.affinity[key];
            const percent = Math.round((value / max) * 100);
            return `
                <article class="v44-affinity-card">
                    <div class="v44-affinity-head"><span>${meta.icon} ${meta.label}${key === dominant ? " / CURRENT" : ""}</span><b>${value}</b></div>
                    <div class="v44-progress"><span style="--value:${percent}%;background:${meta.color}"></span></div>
                    <p>${meta.description}</p>
                </article>`;
        }).join("");
    }

    function performCareAction(actionKey) {
        const action = careActions[actionKey];
        if (!action) return;
        resetDailyDataIfNeeded();
        if (action.minimumEnergy && petData.energy < action.minimumEnergy) {
            showPetMessage(`ENERGYが足りません。先に「${careActions.rest.label}」か「${careActions.feed.label}」で回復してください。`, "error");
            if (typeof playUiSound === "function") playUiSound("error");
            return;
        }

        const expBonus = petData.daily.careCount < 8 ? action.exp : 0;
        petData.daily.careCount += 1;
        petData.energy = clamp(petData.energy + action.energy);
        petData.mood = clamp(petData.mood + action.mood);
        petData.bond = clamp(petData.bond + action.bond);
        petData.exp += expBonus;
        if (action.affinity) petData.affinity[action.affinity] += action.affinityPoint;
        savePetData();

        const bonusText = expBonus > 0 ? `EXP +${expBonus}` : "本日分のEXPボーナスは終了";
        renderPetPage(`${action.icon} ${action.label}をしました。${bonusText}。`);
        showPetMessage(`${action.label}：ENERGY ${signed(action.energy)} / MOOD ${signed(action.mood)} / BOND +${action.bond} / ${bonusText}`, "success");
        speakFloatingPet(`${action.icon} うれしそうにしています。`);
        if (typeof playUiSound === "function") playUiSound("success");
    }

    function signed(value) {
        return value >= 0 ? `+${value}` : String(value);
    }

    function giveSoulSnack() {
        let soul = 0;
        try {
            soul = typeof gachaData !== "undefined" ? Number(gachaData.soul || 0) : 0;
        } catch (error) {}
        if (soul < 10) {
            showPetMessage(`SOULが10必要です。現在所持：${getCurrentSoulBalance().toLocaleString("ja-JP")} SOUL`, "error");
            if (typeof playUiSound === "function") playUiSound("error");
            return;
        }
        try {
            gachaData.soul -= 10;
            if (typeof saveGachaData === "function") saveGachaData();
            if (typeof updateGachaInfo === "function") updateGachaInfo();
        } catch (error) {
            showPetMessage("SOULデータを更新できませんでした。", "error");
            return;
        }
        petData.energy = clamp(petData.energy + 30);
        petData.mood = clamp(petData.mood + 12);
        petData.bond = clamp(petData.bond + 5);
        petData.exp += 10;
        savePetData();
        renderPetPage("🔮 SOULのおやつが輝き、体中に記録の力が満ちました。");
        showPetMessage("10 SOULを使用：ENERGY +30 / MOOD +12 / BOND +5 / EXP +10", "success");
        if (typeof playUiSound === "function") playUiSound("success");
    }

    function renamePet() {
        const input = document.getElementById("v44PetNameInput");
        const name = String(input?.value || "").trim().slice(0, 12);
        if (!name) {
            showPetMessage("名前を1文字以上入力してください。", "error");
            return;
        }
        petData.name = name;
        savePetData();
        renderPetPage(`新しい名前は「${name}」。気に入ったようです。`);
        showPetMessage(`名前を「${name}」に変更しました。`, "success");
        if (typeof playUiSound === "function") playUiSound("success");
    }

    function showPetMessage(text, type = "") {
        const box = document.getElementById("v44PetMessage");
        if (!box) return;
        box.className = `v44-pet-message ${type}`.trim();
        box.innerHTML = `${escapeHtml(text)}<br>本日のお世話経験値ボーナス：あと <b id="v44CareRemaining">${Math.max(0, 8 - petData.daily.careCount)}</b> 回`;
    }

    function trackPageVisit(pageName, force = false) {
        if (!pageName || pageName === "RECORD") return;
        const now = performance.now();
        if (!force && pageName === lastTrackedPage && now - lastTrackedAt < 500) return;
        lastTrackedPage = pageName;
        lastTrackedAt = now;

        resetDailyDataIfNeeded();
        if (!petData.daily.pages.includes(pageName)) {
            petData.daily.pages.push(pageName);
            const affinity = pageAffinity[pageName] || "memory";
            petData.affinity[affinity] += 2;
            petData.exp += 4;
            if (petData.daily.pages.length % 3 === 0) petData.bond = clamp(petData.bond + 1);
            petData.mood = clamp(petData.mood + 1);
            savePetData();
            updateFloatingPet();
            updateDashboardCompanion();
            speakFloatingPet(`「${pageName}」の記録を覚えました。EXP +4`);
        } else {
            petData.lastSeen = Date.now();
            savePetData();
            updateFloatingPet();
        }
    }

    function currentPageFromDom() {
        if (document.querySelector(".v41-dashboard")) return "HOME";
        try {
            if (typeof currentPageName !== "undefined" && currentPageName && currentPageName !== "RECORD") return currentPageName;
        } catch (error) {}
        return document.getElementById("locationPage")?.textContent?.trim() || "HOME";
    }

    function getCurrentPageName() {
        return currentPageFromDom();
    }

    function petDialogue(pageName) {
        const evolution = evolutionInfo();
        if (petData.energy < 30) return "少し眠そうです。休ませると元気になります。";
        if (petData.mood < 35) return "ちょっと退屈そう。遊んだり音楽を聴かせたりしてみましょう。";
        const lines = {
            HOME: "今日はどの記録を見に行きますか？",
            "GAME LIBRARY": "ゲームがたくさん……全部覚えられるかな。",
            "MY ROOM": "飾られたカードを見ると、ぼくも少し誇らしい。",
            "AONO GACHA": "新しいカードの気配がします。",
            "AONO COLLECTION": "集めた記録は、ぼくの成長にもつながります。",
            GALLERY: "写真には、その瞬間の気持ちも残っています。",
            "PERFORMANCE RECORD": "この音、もう一度聴きたい。",
            MUSCLE: "挑戦の記録は、強い光を持っています。",
            ACHIEVEMENTS: "達成した記録は消えません。",
            "UPDATE LOG": "またこの本が少し分厚くなりました。",
            "RECORD PET": evolution.message
        };
        return lines[pageName] || "新しい記録を探しに行きましょう。";
    }

    function createFloatingPet() {
        if (document.getElementById("v44FloatingPet")) return;
        const button = document.createElement("button");
        button.id = "v44FloatingPet";
        button.className = "v44-floating-pet";
        button.type = "button";
        button.setAttribute("aria-label", "ミニペットを開く");
        button.innerHTML = '<span class="v44-floating-pet-orb">✦</span><span class="v44-floating-pet-text"><b>RECORD PET</b><small>LEVEL 1</small></span><span class="v44-floating-speech"></span>';
        button.addEventListener("click", () => openCustomPage(PET_PAGE, true));
        document.body.appendChild(button);
        updateFloatingPet();
    }

    function updateFloatingPet() {
        const button = document.getElementById("v44FloatingPet");
        if (!button) return;
        const level = levelInfo();
        const evolution = evolutionInfo();
        button.classList.remove("affinity-game", "affinity-music", "affinity-adventure", "affinity-memory");
        button.classList.add(`affinity-${evolution.affinity}`);
        button.classList.toggle("hidden", !petVisible);
        const orb = button.querySelector(".v44-floating-pet-orb");
        const name = button.querySelector(".v44-floating-pet-text b");
        const levelText = button.querySelector(".v44-floating-pet-text small");
        if (orb) orb.textContent = evolution.symbol;
        if (name) name.textContent = petData.name;
        if (levelText) levelText.textContent = `LEVEL ${level.level}`;
        button.title = `${petData.name} / ${evolution.name} / Lv.${level.level}`;
        updateOptionUi();
    }

    function speakFloatingPet(text) {
        if (!petVisible) return;
        const button = document.getElementById("v44FloatingPet");
        const speech = button?.querySelector(".v44-floating-speech");
        if (!button || !speech) return;
        speech.textContent = text;
        button.classList.add("speaking");
        window.clearTimeout(button._v44SpeechTimer);
        button._v44SpeechTimer = window.setTimeout(() => button.classList.remove("speaking"), 4200);
    }

    function addOptionCard() {
        const shell = document.querySelector(".v41-option-shell");
        if (!shell || document.getElementById("v44PetOptionCard")) return;
        shell.insertAdjacentHTML("beforeend", `
<div id="v44PetOptionCard" class="v44-option-card">
    <h4>✦ RECORD SPIRIT</h4>
    <div class="v44-option-row">
        <div><b>画面上のミニペット</b><p>全ページに表示される小さなRECORD SPIRITを切り替えます。育成データはOFFでも保存されます。</p></div>
        <button class="v44-option-toggle" data-v44-pet-visible type="button">ON</button>
    </div>
    <div class="v44-option-row">
        <div><b>ペットの詳しい状態</b><p>レベル、進化ルート、お世話方法を確認します。</p></div>
        <button class="v44-button" data-v44-open-pet type="button">PET PAGE</button>
    </div>
</div>`);
        updateOptionUi();
    }

    function updateOptionUi() {
        const button = document.querySelector("[data-v44-pet-visible]");
        if (button) {
            button.textContent = petVisible ? "ON" : "OFF";
            button.classList.toggle("active", petVisible);
            button.setAttribute("aria-pressed", String(petVisible));
        }
    }

    function injectDashboardCompanion() {
        const dashboard = document.querySelector(".v41-dashboard");
        if (!dashboard || document.getElementById("v44DashboardCompanion")) return;
        const quickPanel = dashboard.querySelector(".v41-dashboard-quick")?.parentElement;
        const wrapper = document.createElement("div");
        wrapper.id = "v44DashboardCompanion";
        wrapper.className = "v44-dashboard-companion";
        wrapper.innerHTML = `
            <article class="v44-dashboard-card">
                <h5>🏠 MY RECORD ROOM</h5>
                <p>獲得したカードを8か所へ自由に展示できます。</p>
                <p><b id="v44DashRoomCount">0 / 8</b> DISPLAYED</p>
                <button class="v44-button" data-v44-dashboard-page="${ROOM_PAGE}" type="button">部屋を開く</button>
            </article>
            <article class="v44-dashboard-card">
                <h5>✦ RECORD SPIRIT</h5>
                <p><b id="v44DashPetName">${escapeHtml(petData.name)}</b> / <span id="v44DashPetLevel">LEVEL 1</span></p>
                <p id="v44DashPetForm">INK DROP</p>
                <button class="v44-button" data-v44-dashboard-page="${PET_PAGE}" type="button">お世話する</button>
            </article>`;
        if (quickPanel?.nextSibling) quickPanel.parentNode.insertBefore(wrapper, quickPanel.nextSibling);
        else dashboard.appendChild(wrapper);
        updateDashboardCompanion();
    }

    function updateDashboardCompanion() {
        const roomCount = Object.values(roomState.placements).filter(Boolean).length;
        const level = levelInfo();
        const evolution = evolutionInfo();
        setText("v44DashRoomCount", `${roomCount} / ${roomSlots.length}`);
        setText("v44DashPetName", petData.name);
        setText("v44DashPetLevel", `LEVEL ${level.level}`);
        setText("v44DashPetForm", evolution.name);
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== String(value)) element.textContent = String(value);
    }

    function addUpdateLog() {
        try {
            if (typeof records === "undefined" || !records["UPDATE LOG"] || records["UPDATE LOG"].includes(UPDATE_MARKER)) return;
            const card = `
<div class="item-card">
    <div class="item-title">📜 Ver.4.4</div>
    <div class="item-text">
        <b style="display:none">${UPDATE_MARKER}</b>
        <b>🏠 MY RECORD ROOMを実装</b><br>
        ・所持カードを額縁、棚、机、中央台座の8か所へ配置可能<br>
        ・クリック操作とドラッグ＆ドロップの両方に対応<br>
        ・3種類の部屋テーマ、高レア自動配置、鑑賞モードを追加<br>
        ・配置内容をブラウザへ自動保存<br><br>
        <b>✦ RECORD SPIRITを実装</b><br>
        ・ページ閲覧とお世話で成長するミニペットを追加<br>
        ・LEVEL、EXP、BOND、MOOD、ENERGYを記録<br>
        ・GAME、MUSIC、ADVENTURE、MEMORYの4ルートで進化<br>
        ・HOMEダッシュボードとOPTIONにも専用項目を追加
    </div>
</div>`;
            records["UPDATE LOG"] = records["UPDATE LOG"].replace('<div class="record-section">', '<div class="record-section">' + card);
        } catch (error) {}
    }

    function addVer410UpdateLog() {
        const marker = "VER.4.10 MY ROOM MENU AND SOUL BALANCE";

        try {
            if (
                typeof records === "undefined" ||
                !records["UPDATE LOG"] ||
                records["UPDATE LOG"].includes(marker)
            ) {
                return;
            }

            const card = `
<div class="item-card">
    <div class="item-title">Ver.4.10 / MENU &amp; PET UI FIX</div>
    <div class="item-text">
        <b style="display:none">${marker}</b>
        <b>MY ROOM・メニュー・SOUL表示を改善</b><br>
        ・MY ROOMをGAME LIBRARYの直後へ固定<br>
        ・左メニューのスクロール範囲を修正<br>
        ・SOULのおやつに現在の所持SOULを表示<br>
        ・SOUL不足時に現在所持数を案内
    </div>
</div>`;

            records["UPDATE LOG"] = records["UPDATE LOG"].replace(
                '<div class="record-section">',
                '<div class="record-section">' + card
            );
        } catch (error) {}
    }

    function scheduleEnhance() {
        if (enhanceScheduled) return;
        enhanceScheduled = true;
        requestAnimationFrame(() => {
            enhanceScheduled = false;
            const page = currentPageFromDom();
            if (page === ROOM_PAGE) {
                if (!document.querySelector('[data-v44-page="room"]')) return;
                enhancePageHeader(ROOM_PAGE);
                if (!document.querySelector('[data-v44-page="room"][data-v44-ready="true"]')) {
                    const root = document.querySelector('[data-v44-page="room"]');
                    if (root) root.dataset.v44Ready = "true";
                    initializeRoomPage();
                }
            } else if (page === PET_PAGE) {
                enhancePageHeader(PET_PAGE);
                if (!document.querySelector('[data-v44-page="pet"][data-v44-ready="true"]')) {
                    const root = document.querySelector('[data-v44-page="pet"]');
                    if (root) root.dataset.v44Ready = "true";
                    initializePetPage();
                }
            }
            addOptionCard();
            injectDashboardCompanion();
            trackPageVisit(page);
        });
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

            const visibility = target.closest("[data-v44-pet-visible]");
            if (visibility) {
                petVisible = !petVisible;
                try { localStorage.setItem(PET_VISIBLE_STORAGE_KEY, String(petVisible)); } catch (error) {}
                updateFloatingPet();
                if (typeof playUiSound === "function") playUiSound("click");
                return;
            }
            if (target.closest("[data-v44-open-pet]")) {
                openCustomPage(PET_PAGE, true);
                return;
            }
            const dashboardButton = target.closest("[data-v44-dashboard-page]");
            if (dashboardButton) {
                openCustomPage(dashboardButton.dataset.v44DashboardPage, true);
            }
        });

        document.addEventListener("click", event => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (target.closest("#locationPage") && [ROOM_PAGE, PET_PAGE].includes(currentPageFromDom())) {
                event.preventDefault();
                event.stopImmediatePropagation();
                openCustomPage(currentPageFromDom(), false);
            }
        }, true);

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                petData.lastSeen = Date.now();
                savePetData();
                updateFloatingPet();
            }
        });
        window.addEventListener("beforeunload", () => savePetData());
    }

    function boot() {
        injectStyles();
        registerPages();
        addUpdateLog();
        addVer410UpdateLog();
        addMenuItems();
        window.setTimeout(addMenuItems, 120);
        createFloatingPet();
        bindGlobalActions();
        watchContent();
        sanitizeRoomPlacements();
        savePetData();
        scheduleEnhance();
        window.setTimeout(() => trackPageVisit(currentPageFromDom(), true), 180);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }
})();
