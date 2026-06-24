/*
 * THE RECORD OF AONO SHOTA - Ver.3.7 add-on
 * ・SOUL交換レート値下げ
 * ・背景画像の視認性改善
 * ・画像を参考にしたGAME LIBRARY（352件）
 *
 * 旧 homepage_v36_update.js の代わりに、index.html の </body> 直前で読み込んでください。
 */
(() => {
    "use strict";

    const PAGE_NAME = "GAME LIBRARY";
    const STORAGE_VIEW_KEY = "aonoGameLibraryView";

    /* スクリーンショットを参考に登録。重複タイトルは複数ライブラリを1件へ統合。 */
    const ownedGames = [
        {
                "title": "100%おれんじじゅ～すっ！",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "100%おれんじじゅ～すっ！ - 体験版",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "7 Days to Die [latest_experimental]",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "8AM",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "911 Operator",
                "libraries": [
                        "Steam",
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Aimlabs",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Alterchase",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ARK: Survival Evolved",
                "libraries": [
                        "Steam",
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ARK: Survival Of The Fittest",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "A.V.A Global",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Balatro",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Banana Hell: Mountain of Madness",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Battle Simulator: Counter Stickman",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Besiege",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Billies Wheelie",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Black Desert",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Car Mechanic Simulator 2018",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cast & Spell",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Chamber Survival",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "CloverPit",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Content Warning",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Counter-Strike 2",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Craftopia / クラフトピア",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Crown Champion: Legends of the Arena",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cursed Companions",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Dark and Darker",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "DEAD OR ALIVE Xtreme Venus Vacation",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Delta Force",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Deponia",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Depths Of Horror: Mushroom Day",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Doki Doki Literature Club",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Dungeon of the ENDLESS™",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "eWorlds: A 3D Platformer Adventure",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Factory Town Idle",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Farlight 84",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Fat Prison Simulator 3",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Fight or Flight",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "FINAL FANTASY VII EVER CRISIS",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "FIND ALL 7: Japan",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "G1牧場ステークス",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Gamble With Your Friends",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Golf It!",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Gravewood High",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Graveyard Keeper",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Halo Infinite",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Hand Simulator",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Her Story",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "HITMAN World of Assassination",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Human Fall Flat",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Initial Drift Online",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Keep Digging / キープディギング",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Krunker",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "LAPIDARY: Jewel Craft Simulator",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "LEGO® Builder's Journey",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Linebound",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Little Nightmares",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Little Nightmares Enhanced Edition",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "LivingBattle",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "LivingForest",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Machinika Museum",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Moonrise Fall",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "MultiVersus",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Muse Dash",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "MyVoiceZoo",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Nocturnal",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Noita",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Once Human",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "One Gun Guy",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ONE PIECE ODYSSEY",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Palia",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Palworld / パルワールド",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "Papers, Please",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Paranoia",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Path of Exile",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PEAK",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Pet Lands",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PICO PARK: Classic Edition",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Poco",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Project Winter",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PUBG: BATTLEGROUNDS",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PUBG: Experimental Server",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "PUBG: Test Server",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Puppet Master: The Game",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Puzzle Together",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Raft",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "REAL MOON",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "R.E.P.O.",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Shadowverse: Worlds Beyond",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "Sid Meier's Civilization VI",
                "libraries": [
                        "Steam",
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Slay the Spire",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Slay the Spire 2 [public-beta]",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Smart Factory Tycoon",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Splitgate",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Stardew Valley",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Sudoku RPG",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Sunkenland",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Super Bomberman R Online",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Supermarket Simulator",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Supermarket Together",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "SUPERVIVE",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "TaskPals",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Tell Me Why",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Terraria",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Terrors to Unveil - Day Off",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Backrooms: Unbounded",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Deed: Dynasty",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "THE FINALS",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Sims™ 4",
                "libraries": [
                        "Steam",
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "tModLoader",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ツール"
        },
        {
                "title": "Together in Forgotten Lands: Chapter One",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Tom Clancy's Rainbow Six Siege - Test Server",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Undercroft Warriors",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Untrusted",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Unturned",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Vampire Survivors",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "VRChat",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Warframe",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Warhammer 40,000: Gladius - Relics of War",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Warlander",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Weyrdlets 2.0: Desktop Pets",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Wild Castle",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Wild Terra 2: New Lands",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Winexy",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Wordle",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Wordle Demo",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "World Crafter TD",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "World Crafter TD Demo",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Yu-Gi-Oh! Master Duel",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "イナズマイレブン 英雄たちのヴィクトリーロード",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "ウマ娘 プリティーダービー",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "エーペックスレジェンズ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "エスケープ フロム ダッコフ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "オーバーウォッチ® 2",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "お住まい夢物語DX",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "グランド・セフト・オートV エンハンスト",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "グランド・セフト・オートV レガシー",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ゲーム発展国++",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "サッカークラブ物語",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ジュラシック・ワールド・エボリューション2",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "タスクバーヒーロー",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "ダスクダイバー - Adult Only",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "デイヴ・ザ・ダイバー",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "テニスクラブ物語",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ドラえもんのどら焼き屋さん物語",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ハートピアスローライフ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "バイオプロトタイプ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ハウスフリッパー",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "バニーガーデン",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ひっぱるなよ、串焼きマスター！",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ファンタジーライフｉ グルグルの竜と時をぬすむ少女",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ぷよぷよ™テトリス®2",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "プラネットコースター",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "プロサッカークラブをつくろう！",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "プロレスリング物語",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ヘブンバーンズレッド",
                "libraries": [
                        "Steam"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "ホグワーツ・レガシー",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ほのぼのドリル",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "マーベル・ライバルズ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "めっちゃカメレオン",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "モンスターハンター：ワールド",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ゆうえんち夢物語",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ゆけむり温泉郷",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "レインボーシックス シージ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ワンワンバトル",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "異ノ域U - Isolated Hours -",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "異世界アダルトショップ",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "開園ピクセル牧場",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "開店デパート日記",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "漢字でGO! 集英社マンガ祭",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "逆転裁判123 成歩堂セレクション",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "財閥タウンズV",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "司書のお仕事：魔導図書館を片付け！",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "常夏プールパレス",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "森林キャンプが丘",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "箭箭剣 Arrow a Row",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "超将棋",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "陶芸マスター",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "南国バカンス島",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "崩壊3rd",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "冒険ダンジョン村2",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "僕のヒーローアカデミア ULTRA RUMBLE",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "名門ポケット学院2",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "野球部ものがたり",
                "libraries": [
                        "Steam"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Among Us",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Fortnite",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Unrailed!",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Verdun",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Pine",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Viewfinder",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Nioh: The Complete Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Tiny Tina's Assault on Dragon Keep: A Wonderlands One-shot Adventure",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Fall Guys",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Overcooked! 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Model Builder",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Genshin Impact",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "DAEMON X MACHINA",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Automachef",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Hell is Other Demons",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Sonic Mania",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "20 Minutes Till Dawn",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "A Plague Tale: Innocence",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Aerial_Knight's Never Yield",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Among the Sleep - Enhanced Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Astro Duel 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Aven Colony",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "BioShock 2 Remastered",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "BioShock Infinite: The Complete Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "BioShock Remastered",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Black Book",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Black Widow: Recharged",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Blazing Sails",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Blood West",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Bloodstained: Ritual of the Night",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Borderlands 3",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Call of the Sea",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Call of the Wild: The Angler",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cassette Beasts",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cave Story+",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Centipede: Recharged",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Chess Ultra",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Chivalry 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Chivalry 2 - Public Testing",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Circus Electrique",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cities: Skylines",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Control",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cook, Serve, Delicious! 3?!",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Cris Tales",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Darkwood",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "DARQ: Complete Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Dead by Daylight",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Defense Grid: The Awakening",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "DEMON'S TILT",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "体験版・テスト"
        },
        {
                "title": "Destiny 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Deus Ex: Mankind Divided",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Divine Knockout (DKO)",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "DNF Duel",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Dodo Peak",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Doki Doki Literature Club Plus!",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Doors - Paradox",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Dragon Age: Inquisition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Duskers",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Eternights",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Europa Universalis IV",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Fallout 3: Game of the Year Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Fallout: New Vegas",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Farming Simulator 22",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Filament",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "First Class Trouble",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Freshly Frosted",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Galactic Civilizations III",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Galactic Civilizations III Test Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Gamedec - Definitive Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Geneforge 1 - Mutagen",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Ghostrunner",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Ghostwire: Tokyo",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Gloomhaven",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Godfall",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Godlike Burger",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Gods Will Fall",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "GOG GALAXY",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ツール"
        },
        {
                "title": "Guacamelee! 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Guacamelee! Super Turbo Championship Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Guild of Dungeoneering",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Haven Dock",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Homeworld Remastered Collection",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Hood: Outlaws & Legends",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Horizon Chase Turbo",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Hundred Days - Winemaking Simulator",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Hyper Echelon",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "In Sound Mind",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Insurmountable",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Invincible Presents: Atom Eve",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Iratus: Lord of the Dead",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Jitsu Squad",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Jotunnslayer: Hordes of Hel",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "KID A MNESIA EXHIBITION",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Lost Castle",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Mages of Mystralia",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Maneater",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Marvel's Guardians of the Galaxy",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Marvel's Midnight Suns",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Metro: Last Light Redux",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Mighty Fight Federation",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Minit",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Mothergunship",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Moving Out",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Never Alone (Kisima Ingitchuna)",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Obduction",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Offworld Trading Company",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Orwell: Keeping an Eye On You",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PAYDAY 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PC Building Simulator",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Prey",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Prison Architect",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Prop Sumo",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Rebel Galaxy",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Recipe for Disaster",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Relicta",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Ring of Pain",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Rise of the Tomb Raider: 20 Year Celebration",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Rising Storm 2: Vietnam",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Rocket League",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Rogue Company",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Sail Forth",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Saints Row",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Saints Row: The Third Remastered",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Salt and Sanctuary",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Severed Steel",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Shadow of the Tomb Raider: Definitive Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Sheltered",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "SKALD: Against the Black Priory",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Sorry We're Closed",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Soulstice",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Spellbreak",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Stubbs the Zombie in Rebel Without a Pulse",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Styx: Master of Shadows",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Styx: Shards of Darkness",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Super Space Club",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Supraland",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Bridge",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Escapists",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Falconeer",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Outer Worlds",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Outer Worlds: Spacer's Choice Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Spectrum Retreat",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Vanishing of Ethan Carter",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "The Vanishing of Ethan Carter Redux",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "theHunter: Call of the Wild",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Thief",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ToeJam & Earl: Back in the Groove!",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "TOMAK: Save the Earth Again",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Tomb Raider GOTY Edition",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Total War: THREE KINGDOMS",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Train Sim World 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Void Bastards",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Warpips",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Wildgate",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Windbound",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "XCOM 2",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Yoku's Island Express",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Yooka-Laylee",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "Yooka-Laylee and the Impossible Lair",
                "libraries": [
                        "Epic Games"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "学園アイドルマスター",
                "libraries": [
                        "その他"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "VALORANT",
                "libraries": [
                        "その他"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "Minecraft",
                "libraries": [
                        "その他"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "Call of Duty: Black Ops 7",
                "libraries": [
                        "その他"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "ぽこ あ ポケモン",
                "libraries": [
                        "その他"
                ],
                "status": "プレイ中",
                "type": "ゲーム"
        },
        {
                "title": "EA SPORTS FC 26",
                "libraries": [
                        "その他"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "PowerWash Simulator 2",
                "libraries": [
                        "その他"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "ディズニー ツイステッドワンダーランド",
                "libraries": [
                        "その他"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "栄冠ナイン クロスロード",
                "libraries": [
                        "その他"
                ],
                "status": "所持",
                "type": "ゲーム"
        },
        {
                "title": "剣と魔法のログレス いにしえの女神",
                "libraries": [
                        "その他"
                ],
                "status": "所持",
                "type": "ゲーム"
        }
];

    const normalizeText = value => String(value ?? "")
        .normalize("NFKC")
        .toLocaleLowerCase("ja-JP")
        .replace(/[™®©]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const escapeHtml = value => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    function hashTitle(title) {
        let hash = 0;
        for(const char of title) hash = ((hash << 5) - hash + char.codePointAt(0)) | 0;
        return Math.abs(hash) % 360;
    }

    function makeMark(title) {
        const cleaned = title.replace(/[^0-9A-Za-zぁ-んァ-ヶ一-龠]/g, " ").trim();
        const parts = cleaned.split(/\s+/).filter(Boolean);
        if(!parts.length) return "GAME";
        if(parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
        return parts.slice(0, 3).map(part => part[0]).join("").toUpperCase();
    }

    function injectStyles() {
        if(document.getElementById("aonoV37Styles")) return;
        document.getElementById("aonoV36Styles")?.remove();
        const style = document.createElement("style");
        style.id = "aonoV37Styles";
        style.textContent = `
/* ===== Ver.3.7 背景画像の視認性 ===== */
.record{
    background:linear-gradient(rgba(255,248,225,.035),rgba(72,39,8,.075)),var(--page-bg) center/cover no-repeat !important;
    background-color:#d9b678 !important;
}
.record::before{background:radial-gradient(circle at center,rgba(255,253,239,.01),rgba(79,42,8,.01)) !important;}
.record #content .item-card,
.record #content .record-card,
.record #content .aono-card,
.record #content .collection-card{background:rgba(255,245,210,.62) !important;backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);}

/* ===== GAME LIBRARY ===== */
.game-library-shell{display:flex;flex-direction:column;gap:14px;}
.game-library-hero{background:linear-gradient(135deg,rgba(255,247,218,.82),rgba(229,213,174,.68)) !important;}
.game-library-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:14px;}
.game-library-stat{padding:10px;border:2px solid rgba(110,69,25,.48);border-radius:12px;background:rgba(255,255,255,.45);text-align:center;font-size:12px;}
.game-library-stat b{display:block;margin-top:2px;font-size:24px;color:#6a3b0c;}
.game-library-controls{display:grid;grid-template-columns:minmax(230px,1.5fr) repeat(3,minmax(130px,.75fr));gap:10px;}
.game-library-search,.game-library-select{width:100%;min-height:44px;padding:10px 12px;border:2px solid #8a5a22;border-radius:10px;background:rgba(255,250,231,.94);color:#3a2200;font:16px "Yu Mincho","MS Mincho",serif;}
.game-library-subcontrols{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;}
.game-library-actions{display:flex;flex-wrap:wrap;gap:8px;}
.game-library-button{padding:8px 13px;border:2px solid #684014;border-radius:9px;background:#8b5a20;color:#fff5d0;font:700 14px inherit;cursor:pointer;}
.game-library-button[aria-pressed="true"]{background:#4f6f45;border-color:#314e2b;}
.game-library-result-text{font-size:14px;font-weight:bold;color:#684014;}
.game-library-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:13px;}
.game-card{position:relative;display:flex;flex-direction:column;min-height:250px;border:3px solid rgba(119,78,30,.72);border-radius:15px;background:linear-gradient(145deg,rgba(255,249,226,.88),rgba(226,207,166,.74));box-shadow:inset 0 0 14px rgba(255,255,255,.72),0 5px 13px rgba(59,31,7,.20);overflow:hidden;transition:transform .18s ease,box-shadow .18s ease;}
.game-card:hover{transform:translateY(-3px);box-shadow:inset 0 0 14px rgba(255,255,255,.8),0 9px 18px rgba(59,31,7,.27);}
.game-cover{display:grid;place-items:center;min-height:128px;padding:12px;background:linear-gradient(145deg,hsl(var(--game-hue) 55% 29%),hsl(calc(var(--game-hue) + 45) 52% 17%));color:rgba(255,255,255,.92);font:900 clamp(28px,5vw,45px)/1.05 Georgia,serif;letter-spacing:2px;text-align:center;text-shadow:0 3px 12px rgba(0,0,0,.55);}
.game-card-body{display:flex;flex:1;flex-direction:column;padding:13px;}
.game-card-title{font-size:17px;font-weight:bold;line-height:1.4;color:#512b05;overflow-wrap:anywhere;}
.game-card-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;}
.game-tag,.game-status{padding:4px 7px;border:1px solid rgba(105,66,25,.35);border-radius:999px;background:rgba(255,255,255,.62);font-size:11px;line-height:1.2;}
.game-status{align-self:flex-start;margin-top:auto;background:#76532d;color:#fff8df;font-weight:bold;}
.game-status[data-status="プレイ中"]{background:#3f7046;}
.game-library-list-view{display:flex;flex-direction:column;gap:5px;}
.game-library-list-view .game-card{display:grid;grid-template-columns:54px minmax(0,1fr) auto;align-items:center;min-height:58px;border-width:2px;border-radius:9px;}
.game-library-list-view .game-cover{min-height:54px;height:100%;padding:5px;font-size:15px;}
.game-library-list-view .game-card-body{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:9px;padding:8px 11px;}
.game-library-list-view .game-card-title{font-size:14px;}
.game-library-list-view .game-card-tags{margin:0;justify-content:flex-end;}
.game-library-list-view .game-status{margin:0;white-space:nowrap;}
.game-library-empty{grid-column:1/-1;padding:35px 18px;border:3px dashed rgba(112,73,29,.55);border-radius:15px;background:rgba(255,248,225,.68);text-align:center;font-weight:bold;}
@media(max-width:900px){.game-library-controls{grid-template-columns:1fr 1fr;}.game-library-summary{grid-template-columns:1fr 1fr;}}
@media(max-width:620px){.game-library-controls{grid-template-columns:1fr;}.game-library-grid{grid-template-columns:1fr 1fr;}.game-library-list-view .game-card{grid-template-columns:45px minmax(0,1fr);}.game-library-list-view .game-card-body{grid-template-columns:1fr;gap:5px;}.game-library-list-view .game-card-tags{justify-content:flex-start;}}
@media(max-width:430px){.game-library-grid{grid-template-columns:1fr;}}
`;
        document.head.appendChild(style);
    }

    function lowerSoulExchangeRates() {
        const newPrices = {N:10,R:30,SR:80,SSR:200,UR:500,SECRET:1500};
        if(typeof soulExchangePrices !== "undefined") Object.assign(soulExchangePrices,newPrices);
        if(typeof records !== "undefined" && records["AONO GACHA"]) {
            let html=records["AONO GACHA"];
            [[/N：100(?!\d)/g,"N：10"],[/R：250/g,"R：30"],[/SR：600/g,"SR：80"],[/SSR：1,500/g,"SSR：200"],[/UR：3,000/g,"UR：500"],[/SECRET：10,000/g,"SECRET：1,500"]].forEach(([p,r])=>html=html.replace(p,r));
            records["AONO GACHA"]=html;
        }
        const visible=document.querySelector(".exchange-price-list");
        if(visible) visible.innerHTML="<span>N：10</span><span>R：30</span><span>SR：80</span><span>SSR：200</span><span>UR：500</span><span>SECRET：1,500</span>";
        if(typeof renderSoulExchange === "function" && document.getElementById("exchangeList")) renderSoulExchange();
    }

    function gameLibraryHtml() {
        return `
<section class="game-library-shell" aria-label="所持ゲーム一覧">
  <div class="item-card game-library-hero">
    <div class="item-title">🎮 GAME LIBRARY</div>
    <div class="item-text">Steam・Epic Gamesなどの所持タイトルを検索できる記録庫。<br>画像から読み取ったタイトルを登録し、重複タイトルは複数ライブラリ表示へまとめています。</div>
    <div class="game-library-summary">
      <div class="game-library-stat">登録ゲーム<b id="gameTotalCount">0</b></div>
      <div class="game-library-stat">表示中<b id="gameVisibleCount">0</b></div>
      <div class="game-library-stat">Steam<b id="gameSteamCount">0</b></div>
      <div class="game-library-stat">Epic Games<b id="gameEpicCount">0</b></div>
    </div>
  </div>
  <div class="item-card">
    <div class="game-library-controls">
      <input id="gameSearch" class="game-library-search" type="search" autocomplete="off" placeholder="ゲームタイトルを検索">
      <select id="gameLibraryFilter" class="game-library-select" aria-label="ライブラリで絞り込み"></select>
      <select id="gameTypeFilter" class="game-library-select" aria-label="種類で絞り込み"></select>
      <select id="gameStatusFilter" class="game-library-select" aria-label="状況で絞り込み"></select>
    </div>
    <div class="game-library-subcontrols">
      <select id="gameSort" class="game-library-select" aria-label="並び順">
        <option value="default">登録順</option><option value="title-asc">タイトル A→Z</option><option value="title-desc">タイトル Z→A</option><option value="library">ライブラリ順</option>
      </select>
      <span id="gameResultText" class="game-library-result-text"></span>
      <div class="game-library-actions">
        <button id="gameGridView" class="game-library-button" type="button" aria-pressed="true">カード表示</button>
        <button id="gameListView" class="game-library-button" type="button" aria-pressed="false">リスト表示</button>
        <button id="gameFilterReset" class="game-library-button" type="button">条件をリセット</button>
      </div>
    </div>
  </div>
  <div id="gameLibraryList" class="game-library-grid" aria-live="polite"></div>
</section>`;
    }

    function registerGameLibraryPage() {
        if(typeof records !== "undefined") records[PAGE_NAME]=gameLibraryHtml();
        if(typeof pageCategories !== "undefined") pageCategories[PAGE_NAME]="COLLECTION";
        if(typeof pageBackgrounds !== "undefined") pageBackgrounds[PAGE_NAME]="item_box_background.png";
        if(typeof pageThemes !== "undefined") pageThemes[PAGE_NAME]="collection";
    }

    function addUpdateLog() {
        if(typeof records === "undefined" || !records["UPDATE LOG"] || records["UPDATE LOG"].includes("GAME LIBRARY FULL IMPORT")) return;
        const card=`<div class="item-card"><div class="item-title">📜 Ver.3.7</div><div class="item-text">🎮 GAME LIBRARY FULL IMPORT<br>🗃 Steam・Epic Games等から${ownedGames.length}件を登録<br>🔍 タイトル・ライブラリ・種類・プレイ状況の検索に対応<br>▦ カード表示 / ☰ リスト表示を切り替え可能<br>🔁 重複タイトルは複数ライブラリ表示へ統合</div></div>`;
        records["UPDATE LOG"]=records["UPDATE LOG"].replace('<div class="record-section">','<div class="record-section">'+card);
    }

    function addGameLibraryMenuItem() {
        let item=document.querySelector(`.menu-item[data-page="${PAGE_NAME}"]`);
        if(item) { item.onclick=()=>openGameLibraryPage(item); return item; }
        const category=[...document.querySelectorAll(".menu-category")].find(button=>button.dataset.category==="COLLECTION"||button.textContent.includes("COLLECTION"));
        const group=category?.nextElementSibling;
        if(!group?.classList.contains("menu-group")) return null;
        item=document.createElement("div");
        item.className="menu-item";item.dataset.page=PAGE_NAME;item.dataset.new="true";
        item.innerHTML='<span class="menu-thumb">🎮</span><span class="menu-label">GAME LIBRARY</span><span class="menu-new">NEW</span>';
        const itemBox=group.querySelector('.menu-item[data-page="ITEM BOX"]');
        if(itemBox) itemBox.insertAdjacentElement("afterend",item); else group.prepend(item);
        item.addEventListener("click",()=>openGameLibraryPage(item));
        return item;
    }

    function openGameLibraryPage(menuItem=document.querySelector(`.menu-item[data-page="${PAGE_NAME}"]`)) {
        document.querySelectorAll(".menu-item").forEach(item=>item.classList.remove("selected"));
        menuItem?.classList.add("selected");
        const content=document.getElementById("content");
        if(!content || typeof records === "undefined") return;
        content.innerHTML=records[PAGE_NAME];
        if(typeof applyPagePresentation === "function") applyPagePresentation(PAGE_NAME);
        if(typeof playUiSound === "function") playUiSound("select");
        initializeGameLibrary();
    }

    function makeOptions(values,label) { return [`<option value="ALL">${escapeHtml(label)}</option>`].concat(values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)).join(""); }

    function setView(view) {
        const list=document.getElementById("gameLibraryList"); if(!list) return;
        const isList=view==="list";
        list.classList.toggle("game-library-list-view",isList);
        document.getElementById("gameGridView")?.setAttribute("aria-pressed",String(!isList));
        document.getElementById("gameListView")?.setAttribute("aria-pressed",String(isList));
        try { localStorage.setItem(STORAGE_VIEW_KEY,isList?"list":"grid"); } catch(error) {}
    }

    function initializeGameLibrary() {
        if(!document.getElementById("gameLibraryList")) return;
        const libraries=[...new Set(ownedGames.flatMap(game=>game.libraries))].sort((a,b)=>a.localeCompare(b,"ja"));
        const types=[...new Set(ownedGames.map(game=>game.type))];
        const statuses=[...new Set(ownedGames.map(game=>game.status))];
        document.getElementById("gameLibraryFilter").innerHTML=makeOptions(libraries,"すべてのライブラリ");
        document.getElementById("gameTypeFilter").innerHTML=makeOptions(types,"すべての種類");
        document.getElementById("gameStatusFilter").innerHTML=makeOptions(statuses,"すべての状況");
        ["gameSearch","gameLibraryFilter","gameTypeFilter","gameStatusFilter","gameSort"].forEach(id=>{const el=document.getElementById(id);el?.addEventListener(el.tagName==="INPUT"?"input":"change",renderGameLibrary);});
        document.getElementById("gameGridView")?.addEventListener("click",()=>setView("grid"));
        document.getElementById("gameListView")?.addEventListener("click",()=>setView("list"));
        document.getElementById("gameFilterReset")?.addEventListener("click",()=>{
            document.getElementById("gameSearch").value="";document.getElementById("gameLibraryFilter").value="ALL";document.getElementById("gameTypeFilter").value="ALL";document.getElementById("gameStatusFilter").value="ALL";document.getElementById("gameSort").value="default";renderGameLibrary();document.getElementById("gameSearch").focus();
        });
        let saved="grid";try{saved=localStorage.getItem(STORAGE_VIEW_KEY)||"grid";}catch(error){}
        setView(saved);renderGameLibrary();
    }

    function renderGameLibrary() {
        const list=document.getElementById("gameLibraryList"); if(!list) return;
        const search=normalizeText(document.getElementById("gameSearch")?.value);
        const library=document.getElementById("gameLibraryFilter")?.value||"ALL";
        const type=document.getElementById("gameTypeFilter")?.value||"ALL";
        const status=document.getElementById("gameStatusFilter")?.value||"ALL";
        const sort=document.getElementById("gameSort")?.value||"default";
        let filtered=ownedGames.filter(game=>{
            const haystack=normalizeText([game.title,...game.libraries,game.type,game.status].join(" "));
            return (!search||haystack.includes(search))&&(library==="ALL"||game.libraries.includes(library))&&(type==="ALL"||game.type===type)&&(status==="ALL"||game.status===status);
        });
        const collator=new Intl.Collator("ja",{numeric:true,sensitivity:"base"});
        if(sort==="title-asc") filtered=[...filtered].sort((a,b)=>collator.compare(a.title,b.title));
        if(sort==="title-desc") filtered=[...filtered].sort((a,b)=>collator.compare(b.title,a.title));
        if(sort==="library") filtered=[...filtered].sort((a,b)=>collator.compare(a.libraries[0],b.libraries[0])||collator.compare(a.title,b.title));
        document.getElementById("gameTotalCount").textContent=ownedGames.length;
        document.getElementById("gameVisibleCount").textContent=filtered.length;
        document.getElementById("gameSteamCount").textContent=ownedGames.filter(g=>g.libraries.includes("Steam")).length;
        document.getElementById("gameEpicCount").textContent=ownedGames.filter(g=>g.libraries.includes("Epic Games")).length;
        document.getElementById("gameResultText").textContent=`${ownedGames.length}件中 ${filtered.length}件を表示`;
        if(!filtered.length){list.innerHTML='<div class="game-library-empty">条件に一致するゲームがありません。<br>検索語や絞り込み条件を変えてください。</div>';return;}
        list.innerHTML=filtered.map(game=>`<article class="game-card" style="--game-hue:${hashTitle(game.title)}"><div class="game-cover" aria-hidden="true">${escapeHtml(makeMark(game.title))}</div><div class="game-card-body"><div class="game-card-title">${escapeHtml(game.title)}</div><div class="game-card-tags">${game.libraries.map(name=>`<span class="game-tag">${escapeHtml(name)}</span>`).join("")}<span class="game-tag">${escapeHtml(game.type)}</span></div><div class="game-status" data-status="${escapeHtml(game.status)}">${escapeHtml(game.status)}</div></div></article>`).join("");
    }

    function installLocationPageFix() {
        const button=document.getElementById("locationPage");if(!button)return;
        button.addEventListener("click",event=>{if(typeof currentPageName!=="undefined"&&currentPageName===PAGE_NAME){event.preventDefault();event.stopImmediatePropagation();openGameLibraryPage();}},true);
    }

    function installLiveKeyboardNavigation() {
        document.addEventListener("keydown",event=>{
            if(!["ArrowDown","ArrowUp","Enter"].includes(event.key)||event.ctrlKey||event.altKey||event.metaKey)return;
            const target=event.target;if(target instanceof HTMLElement&&target.closest("input,select,textarea,button,a,[contenteditable='true']"))return;
            const items=[...document.querySelectorAll(".menu-item")];if(!items.length)return;
            event.preventDefault();event.stopImmediatePropagation();let index=items.findIndex(item=>item.classList.contains("selected"));if(index<0)index=0;
            if(event.key==="ArrowDown")index=(index+1)%items.length;if(event.key==="ArrowUp")index=(index-1+items.length)%items.length;
            if(event.key==="Enter"){items[index].click();return;}
            document.querySelectorAll(".menu-item").forEach(item=>item.classList.remove("selected"));const selected=items[index];selected.classList.add("selected");
            const group=selected.closest(".menu-group"),category=group?.previousElementSibling;if(group&&!group.classList.contains("open")){document.querySelectorAll(".menu-category").forEach(button=>button.classList.remove("open"));document.querySelectorAll(".menu-group").forEach(g=>g.classList.remove("open"));group.classList.add("open");category?.classList.add("open");}
            selected.scrollIntoView({block:"nearest",behavior:"smooth"});if(typeof playUiSound==="function")playUiSound("move");
        },true);
    }

    function refreshVisibleExchangePriceList() { document.addEventListener("click",event=>{if(event.target.closest?.('.menu-item[data-page="AONO GACHA"]'))window.setTimeout(lowerSoulExchangeRates,0);}); }

    function boot() { injectStyles();lowerSoulExchangeRates();registerGameLibraryPage();addUpdateLog();addGameLibraryMenuItem();installLocationPageFix();installLiveKeyboardNavigation();refreshVisibleExchangePriceList(); }
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
