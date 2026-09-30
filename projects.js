/* ============================================================
   作品資料 — 平常只要改這個檔案
   ------------------------------------------------------------
   CHAPTERS：章節（對應目錄 INDEX），每章有自己的標題頁
   每個專案的 layout：
     "collage" → 左文字、右拼貼（rows：每一列等高，寬度依比例自動分配）
     "phones"  → 手機直式展示（phones 陣列）
     "feature" → 左 Project Overview / My Contribution，右主影片＋劇照
   素材：
     { video: "slug", ar: 16/9 }     assets/video/slug-preview.mp4（點開播放 slug.mp4 有聲完整版）
     { img: "檔名.jpg", ar: 3/2 }     assets/img/檔名.jpg
     { youtube: "影片ID", ar: 16/9 }
   ============================================================ */
window.CHAPTERS = [
  {
    id: "videography", no: "01", outline: "VIDEO", solid: "GRAPHY", zh: "影片製作",
    years: "2023 — 2026", preview: "sportsnote",
    pills: ["Brand Film", "Event Film", "Product Ad"],
    projects: [
      {
        layout: "collage",
        category: "Video Production", client: "H2U 永悅健康｜運動筆記",
        title: "運動筆記 Showreel", en: "Sports Content Reel",
        meta: { Client: "H2U 永悅健康 / 運動筆記", Role: "拍攝・剪輯・後製特效", Period: "2025.06 – 2025.11" },
        desc: "負責跑鞋開箱、跑者專訪及品牌活動影片製作，涵蓋拍攝、剪輯與後製特效，並依平台需求規劃 Reels、Shorts 與長片內容，以精準的節奏與畫面敘事運動品牌價值。",
        scope: ["跑鞋開箱影片", "跑者專訪紀錄", "品牌活動紀錄", "Reels / Shorts 規劃", "後製特效與調色"],
        rows: [
          [{ video: "sportsnote", ar: 16 / 9, title: "運動筆記 Showreel" }],
          [{ img: "stills/sportsnote-19.jpg", ar: 16 / 9 }, { img: "stills/sportsnote-28.jpg", ar: 16 / 9 }, { img: "stills/sportsnote-32.jpg", ar: 16 / 9 }],
        ],
      },
      {
        layout: "feature",
        category: "Event Film", client: "破局者年會 2026",
        title: "破局者年會 2026", en: "Annual Conference Film",
        meta: { Event: "破局者年會 2026 年度大會", Role: "拍攝・剪輯・調色", Format: "4K 主影片 / 9:16 短影音" },
        overview: "以大型年會現場為素材，剪出兼具氣勢與節奏的活動主影片，完整記錄講者、觀眾互動與品牌現場氛圍。",
        contribution: "負責現場多機位拍攝、主影片剪輯與調色，並另外產出直式短影音版本，供社群平台二次傳播。",
        main: { video: "breaker", ar: 16 / 9, title: "破局者年會 2026 主影片" },
        stills: ["breaker-5", "breaker-13", "breaker-37", "breaker-53", "breaker-61", "breaker-69"],
      },
      {
        layout: "collage",
        category: "Product Ad", client: "La glow｜毅達創意",
        title: "La glow 產品輕影片", en: "Beauty Product Films",
        meta: { Client: "毅達創意", Role: "品牌實習生（影片製作・設計）", Period: "2023.06 – 2023.10" },
        desc: "協助品牌設計與影片製作，參與各類品牌專案的設計與執行，每週負責三支以上的產品影片，確保每支影片的視覺質感與品牌風格一致。",
        scope: ["產品輕影片", "品牌視覺設計", "社群素材"],
        rows: [[{ video: "vface", ar: 1350 / 1080, title: "La glow 緊緻V臉精華油" }, { video: "cactus", ar: 1, title: "La glow 仙人掌精華" }]],
      },
    ],
  },
  {
    id: "short-form", no: "02", outline: "SHORT", solid: "FORM", gap: true, zh: "知識型短影音",
    years: "2025 — 2026", preview: "day0",
    pills: ["KOL Content", "Reels / Shorts", "Thumbnail Design"],
    projects: [
      {
        layout: "phones",
        category: "KOL Short-form", client: "弘琦有限公司",
        title: "KOL 知識型短影音", en: "Short-form Video Editing",
        meta: { Client: "弘琦有限公司", Role: "剪輯師（企劃・拍攝・剪輯・封面）", Period: "2025.12 – 2026.10" },
        desc: "主導 KOL 影片全流程製作，從企劃、拍攝、剪輯到封面標題設計，打造累積百萬觀看與數千則留言的爆款短影音，將複雜金融知識轉化為淺顯易懂的內容。",
        phones: [
          { video: "day0", title: "Day 0", sub: "連續 30 天每天獲利 1% 挑戰" },
          { video: "tsmc", title: "上車台積電的機會來了嗎", sub: "台股知識短影音" },
          { video: "fx-guide", title: "交易新手入門指南", sub: "外匯新手教學" },
        ],
      },
      {
        layout: "phones",
        category: "Social Content", client: "運動筆記・破局者年會",
        title: "品牌社群短影音", en: "Branded Social Media Content",
        meta: { Client: "運動筆記 / 破局者年會", Role: "拍攝・剪輯・字幕動態", Format: "9:16 Reels / Shorts" },
        desc: "針對 IG Reels、YouTube Shorts 的觀看習慣，以前三秒鉤子、快節奏剪輯與動態字幕，把活動與人物故事濃縮成適合社群傳播的直式短影音。",
        phones: [
          { video: "on-event", title: "On 長距離揪跑活動", sub: "運動筆記 活動紀錄" },
          { video: "lin-doc", title: "林小安談紀錄片", sub: "運動筆記 跑者專訪" },
          { video: "breaker-short", title: "破局者年會 2026", sub: "活動短影音" },
        ],
      },
    ],
  },
  {
    id: "photography", no: "03", outline: "PHOTO", solid: "GRAPHY", zh: "商品攝影",
    years: "2025", preview: null, previewImg: "on-cloudflow.jpg",
    pills: ["Product", "Still Life", "Running Shoes"],
    projects: [
      {
        layout: "collage",
        category: "Product Photography", client: "On 昂跑",
        title: "On Cloudflow 跑鞋攝影", en: "Product Still Life",
        meta: { Product: "On Cloudflow 5 跑鞋", Role: "攝影・燈光・後製修圖" },
        desc: "以冷調自然光與簡潔的白色場景，拍出跑鞋的輕量感與科技感；從整體造型、鞋跟細節到開箱情境，完整呈現產品的材質與品牌識別。",
        scope: ["產品主視覺", "細節特寫", "開箱情境照", "色調後製"],
        rows: [
          [{ img: "on-cloudflow.jpg", ar: 1.5, title: "On Cloudflow 5" }],
          [{ img: "on-cloudflow-10.jpg", ar: 1.5, title: "Swiss Engineering 鞋跟細節" }, { img: "on-cloudflow-33.jpg", ar: 1.5, title: "開箱情境" }],
        ],
      },
      {
        layout: "collage",
        category: "Product Photography", client: "運動眼鏡",
        title: "運動眼鏡 產品攝影", en: "Product & Lifestyle Shoot",
        meta: { Project: "運動眼鏡商品攝影", Role: "攝影・後製修圖" },
        desc: "以城市街景與自然光為主軸，結合產品特寫、模特兒情境與材質細節，呈現運動眼鏡俐落、輕量的產品性格。",
        scope: ["產品特寫", "模特兒情境照", "戶外自然光拍攝", "色調後製"],
        rows: [
          [{ img: "urban-13.jpg", ar: 1.5 }, { img: "urban-5.jpg", ar: 1.5 }],
          [{ img: "urban-1.jpg", ar: 1.5 }, { img: "urban-2.jpg", ar: 2 / 3 }, { img: "urban-11.jpg", ar: 1.5 }],
          [{ img: "urban-15.jpg", ar: 1.5 }, { img: "urban-4.jpg", ar: 1.5 }, { img: "urban-6.jpg", ar: 1.5 }],
        ],
      },
    ],
  },
  {
    id: "animation", no: "04", outline: "3D", solid: "MOTION", gap: true, zh: "3D 動畫",
    years: "2022 — 2023", preview: "anim",
    pills: ["3D Animation", "Motion Design", "Compositing"],
    projects: [
      {
        layout: "feature",
        category: "3D Animation", client: "Motion & 3D",
        title: "動畫 Showreel", en: "3D Animation & Motion Design Reel",
        meta: { Project: "3D 動畫作品集 2022–2023", Role: "3D 動畫・動態設計・後製合成" },
        overview: "集結 2022–2023 年的 3D 動畫與動態設計作品，從腳本、分鏡到動畫輸出，呈現完整的動畫製作能力。",
        contribution: "獨立完成動畫製作流程：故事撰寫、分鏡設計、3D 動畫、動態設計與後製合成。",
        main: { video: "anim", ar: 16 / 9, title: "3D Animation & Motion Design Showreel 2022–2023" },
        stills: ["anim-12", "anim-16", "anim-48", "anim-60", "anim-68", "anim-84"],
      },
    ],
  },
  {
    id: "documentary", no: "05", outline: "DOCU", solid: "MENTARY", zh: "紀錄片",
    years: "2025", preview: "oasis",
    pills: ["Director", "Interview", "Documentary"],
    projects: [
      {
        layout: "feature",
        category: "Documentary", client: "H2U 永悅健康｜2025 OASIS 綠洲實習計畫",
        title: "OASIS 實習生紀錄片", en: "Documentary Film · 13'29\"",
        meta: { Project: "2025 OASIS 綠洲實習計畫", Role: "導演統籌", Length: "13 分 29 秒" },
        overview: "記錄 2025 OASIS 綠洲實習計畫中實習生與主管的真實訪談，呈現跨部門協作與成長歷程。",
        contribution: "身為導演兼統籌，帶領 16 位實習生成員、協調 8 位主管，主導拍攝流程與鏡頭設計，高效完成專案。",
        main: { video: "oasis", ar: 16 / 9, title: "OASIS 實習生紀錄片" },
        stills: ["oasis-150", "oasis-330", "oasis-420", "oasis-600", "oasis-700", "oasis-785"],
      },
    ],
  },
];