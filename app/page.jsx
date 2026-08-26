'use client';

import { useState, useEffect, useMemo } from "react";
const makeIcon = (symbol) => function Icon({ size = 20, color = "currentColor", className = "" }) {
  return <span aria-hidden="true" className={className} style={{ color, fontSize: size, lineHeight: 1, display: "inline-grid", placeItems: "center" }}>{symbol}</span>;
};
const Plus = makeIcon("+");
const Trash2 = makeIcon("×");
const Printer = makeIcon("▣");
const Check = makeIcon("✓");
const X = makeIcon("×");
const Delete = makeIcon("⌫");
const ArrowRight = makeIcon("→");
const ArrowLeft = makeIcon("←");
const Languages = makeIcon("文");
const Loader2 = makeIcon("◌");

/* ============================================================
   JIN CHENG GLOBAL CERAMIC — 采购食物清单 / سند شراء المواد الغذائية
   采购员专用录入端：中文 / 阿拉伯语可切换
   采购人姓名、签字、日期由打印后手写填上
   ============================================================ */

const C = {
  ink: "#10203F",
  ink2: "#1F3864",
  paper: "#F1EEE4",
  card: "#FFFFFF",
  olive: "#5B6B2E",
  tomato: "#C8442B",
  amber: "#E8A33D",
  line: "#D8D2C4",
  mute: "#8A8477",
};

const FONT_AR = "'Noto Kufi Arabic','Tajawal','Segoe UI',system-ui,sans-serif";
const FONT_ZH = "'PingFang SC','Microsoft YaHei',system-ui,sans-serif";
const FONT_NUM = "'DIN Alternate','Roboto Mono',ui-monospace,monospace";

const STORE = "jc_food_voucher_v3";

/* ---- 界面文案 ---- */
const TX = {
  appTitle: { ar: "سند شراء المواد الغذائية", zh: "采购食物清单" },
  newBuy: { ar: "شراء جديد", zh: "新建采购" },
  past: { ar: "السندات السابقة", zh: "历史单据" },
  total: { ar: "المجموع", zh: "合计" },
  done: { ar: "إنهاء", zh: "完成" },
  other: { ar: "صنف آخر", zh: "其他品名" },
  qty: { ar: "الكمية", zh: "数量" },
  price: { ar: "السعر للوحدة", zh: "单价 JOD" },
  next: { ar: "التالي: السعر", zh: "下一步：单价" },
  add: { ar: "إضافة", zh: "加入清单" },
  lastPrice: { ar: "آخر سعر", zh: "上次单价" },
  tapUse: { ar: "اضغط للاستخدام", zh: "点击套用" },
  newItem: { ar: "صنف جديد", zh: "新增品名" },
  typeName: { ar: "اكتب الاسم بالعربي", zh: "用中文或阿拉伯语写品名" },
  eg: { ar: "مثال: ملوخية", zh: "例如：秋葵 / ملوخية" },
  translate: { ar: "ترجمة", zh: "翻译" },
  saveUse: { ar: "حفظ واستخدام", zh: "保存并使用" },
  notFound: { ar: "غير معروف، جرّب اسماً آخر", zh: "无法识别，请换个说法" },
  netErr: { ar: "فشل الاتصال", zh: "翻译服务连接失败" },
  print: { ar: "طباعة", zh: "打印" },
};

const UNITS = [
  { id: "kg", ar: "كغم", zh: "公斤", en: "KG" },
  { id: "pc", ar: "حبة", zh: "个", en: "PC" },
  { id: "tray", ar: "طبق", zh: "盘", en: "TRAY" },
  { id: "box", ar: "صندوق", zh: "箱", en: "BOX" },
  { id: "bag", ar: "كيس", zh: "袋", en: "BAG" },
  { id: "bunch", ar: "ربطة", zh: "把", en: "BUNCH" },
];

const PRESET = [
  { id: "p01", e: "🍅", ar: "بندورة", zh: "番茄", en: "Tomato", u: "kg", g: "veg" },
  { id: "p02", e: "🥒", ar: "خيار", zh: "黄瓜", en: "Cucumber", u: "kg", g: "veg" },
  { id: "p03", e: "🥔", ar: "بطاطا", zh: "土豆", en: "Potato", u: "kg", g: "veg" },
  { id: "p04", e: "🧅", ar: "بصل", zh: "洋葱", en: "Onion", u: "kg", g: "veg" },
  { id: "p05", e: "🧄", ar: "ثوم", zh: "大蒜", en: "Garlic", u: "kg", g: "veg" },
  { id: "p06", e: "🥕", ar: "جزر", zh: "胡萝卜", en: "Carrot", u: "kg", g: "veg" },
  { id: "p07", e: "🍆", ar: "باذنجان", zh: "茄子", en: "Eggplant", u: "kg", g: "veg" },
  { id: "p08", e: "🥬", ar: "كوسا", zh: "西葫芦", en: "Zucchini", u: "kg", g: "veg" },
  { id: "p09", e: "🌶️", ar: "فلفل", zh: "辣椒", en: "Pepper", u: "kg", g: "veg" },
  { id: "p10", e: "🥬", ar: "ملفوف", zh: "圆白菜", en: "Cabbage", u: "kg", g: "veg" },
  { id: "p11", e: "🥗", ar: "خس", zh: "生菜", en: "Lettuce", u: "kg", g: "veg" },
  { id: "p12", e: "🌿", ar: "بقدونس", zh: "欧芹/香菜", en: "Parsley", u: "bunch", g: "veg" },
  { id: "p13", e: "🍋", ar: "ليمون", zh: "柠檬", en: "Lemon", u: "kg", g: "fruit" },
  { id: "p14", e: "🍎", ar: "تفاح", zh: "苹果", en: "Apple", u: "kg", g: "fruit" },
  { id: "p15", e: "🍌", ar: "موز", zh: "香蕉", en: "Banana", u: "kg", g: "fruit" },
  { id: "p16", e: "🍊", ar: "برتقال", zh: "橙子", en: "Orange", u: "kg", g: "fruit" },
  { id: "p17", e: "🍉", ar: "بطيخ", zh: "西瓜", en: "Watermelon", u: "kg", g: "fruit" },
  { id: "p18", e: "🍇", ar: "عنب", zh: "葡萄", en: "Grapes", u: "kg", g: "fruit" },
  { id: "p19", e: "🍗", ar: "دجاج", zh: "鸡肉", en: "Chicken", u: "kg", g: "meat" },
  { id: "p20", e: "🥩", ar: "لحم", zh: "羊/牛肉", en: "Meat", u: "kg", g: "meat" },
  { id: "p21", e: "🐟", ar: "سمك", zh: "鱼", en: "Fish", u: "kg", g: "meat" },
  { id: "p22", e: "🥚", ar: "بيض", zh: "鸡蛋", en: "Eggs", u: "tray", g: "meat" },
  { id: "p23", e: "🍚", ar: "أرز", zh: "大米", en: "Rice", u: "bag", g: "dry" },
  { id: "p24", e: "🌾", ar: "طحين", zh: "面粉", en: "Flour", u: "bag", g: "dry" },
  { id: "p25", e: "🍬", ar: "سكر", zh: "白糖", en: "Sugar", u: "kg", g: "dry" },
  { id: "p26", e: "🫙", ar: "زيت", zh: "食用油", en: "Oil", u: "box", g: "dry" },
  { id: "p27", e: "🧂", ar: "ملح", zh: "盐", en: "Salt", u: "kg", g: "dry" },
  { id: "p28", e: "🍵", ar: "شاي", zh: "茶叶", en: "Tea", u: "kg", g: "dry" },
  { id: "p29", e: "🍞", ar: "خبز", zh: "面包", en: "Bread", u: "bag", g: "dry" },
  { id: "p30", e: "🥛", ar: "لبن", zh: "酸奶", en: "Yogurt", u: "pc", g: "dry" },
  { id: "p31", e: "🧀", ar: "جبنة", zh: "奶酪", en: "Cheese", u: "kg", g: "dry" },
  { id: "p32", e: "🍝", ar: "معكرونة", zh: "意面", en: "Pasta", u: "bag", g: "dry" },
];

const GROUPS = [
  { id: "veg", ar: "خضار", zh: "蔬菜", e: "🥬" },
  { id: "fruit", ar: "فواكه", zh: "水果", e: "🍎" },
  { id: "meat", ar: "لحوم", zh: "肉蛋", e: "🍗" },
  { id: "dry", ar: "مواد جافة", zh: "干货", e: "🍚" },
];

const DEFAULT_DATA = { custom: [], vouchers: [], prices: {} };

const money = (n) => (Number(n) || 0).toFixed(3);
const today = () => new Date().toISOString().slice(0, 10);
const unitOf = (id) => UNITS.find((u) => u.id === id) || UNITS[0];

export default function FoodVoucherApp() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loaded, setLoaded] = useState(false);
  const [lang, setLang] = useState("ar");
  const [screen, setScreen] = useState("home");
  const [draft, setDraft] = useState(null);
  const [viewing, setViewing] = useState(null);

  const ar = lang === "ar";
  const t = (k) => TX[k][lang];

  useEffect(() => {
    (async () => {
      try {
        const raw = window.localStorage.getItem(STORE);
        if (raw) {
          const d = JSON.parse(raw);
          setData({ ...DEFAULT_DATA, ...d });
          if (d.lang) setLang(d.lang);
        }
      } catch (e) {
        /* 首次使用 */
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (next) => {
    setData(next);
    try {
      window.localStorage.setItem(STORE, JSON.stringify({ ...next, lang }));
    } catch (e) {
      console.error(e);
    }
  };

  const switchLang = async (l) => {
    setLang(l);
    try {
      window.localStorage.setItem(STORE, JSON.stringify({ ...data, lang: l }));
    } catch (e) {
      /* 忽略 */
    }
  };

  const catalog = useMemo(() => [...PRESET, ...data.custom], [data.custom]);

  const nextNo = () => {
    const ym = today().slice(0, 7).replace("-", "");
    const n = data.vouchers.filter((v) => v.no.includes(ym)).length + 1;
    return `FP-${ym}-${String(n).padStart(3, "0")}`;
  };

  const startNew = () => {
    setDraft({ no: nextNo(), date: today(), lines: [] });
    setScreen("buy");
  };

  const finish = async (d) => {
    const prices = { ...data.prices };
    d.lines.forEach((l) => (prices[l.itemId] = l.price));
    const v = { ...d, total: d.lines.reduce((s, l) => s + l.qty * l.price, 0), createdAt: Date.now() };
    await save({ ...data, prices, vouchers: [v, ...data.vouchers] });
    setViewing(v);
    setDraft(null);
    setScreen("voucher");
  };

  if (!loaded)
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: C.paper }}>
        <Loader2 className="animate-spin" size={32} color={C.ink} />
      </div>
    );

  const ctx = { lang, ar, t };

  return (
    <div dir={ar ? "rtl" : "ltr"} className="min-h-screen w-full" style={{ background: C.paper, fontFamily: ar ? FONT_AR : FONT_ZH, color: C.ink }}>
      <style>{`
        @media print { .no-print { display: none !important; } body { background:#fff !important; } }
        .tap { -webkit-tap-highlight-color: transparent; }
        button:focus-visible { outline: 3px solid ${C.amber}; outline-offset: 2px; }
      `}</style>

      {screen === "home" && <Home {...ctx} data={data} onNew={startNew} onOpen={(v) => { setViewing(v); setScreen("voucher"); }} switchLang={switchLang} />}
      {screen === "buy" && draft && (
        <Buy
          {...ctx}
          draft={draft}
          setDraft={setDraft}
          catalog={catalog}
          prices={data.prices}
          data={data}
          save={save}
          onBack={() => { setDraft(null); setScreen("home"); }}
          onDone={() => finish(draft)}
        />
      )}
      {screen === "voucher" && viewing && <VoucherView {...ctx} v={viewing} catalog={catalog} onBack={() => setScreen("home")} />}
    </div>
  );
}

/* ---------------- 首页 ---------------- */
function Home({ ar, t, data, onNew, onOpen, switchLang }) {
  const recent = data.vouchers.slice(0, 12);
  return (
    <div className="p-5 pb-10 max-w-md mx-auto">
      <div className="flex items-start justify-between pt-5 mb-7">
        <div>
          <div className="text-xs tracking-widest" style={{ color: C.mute }}>JIN CHENG GLOBAL CERAMIC</div>
          <div className="text-2xl font-bold mt-1">{t("appTitle")}</div>
        </div>
        <LangToggle ar={ar} switchLang={switchLang} />
      </div>

      <button onClick={onNew} className="tap w-full rounded-3xl p-8 mb-6 flex items-center justify-between shadow-sm" style={{ background: C.ink, color: "#fff" }}>
        <span className="text-2xl font-bold">{t("newBuy")}</span>
        <span className="rounded-full p-4" style={{ background: C.amber }}>
          <Plus size={28} color={C.ink} strokeWidth={3} />
        </span>
      </button>

      {recent.length > 0 && <div className="text-sm mb-2 font-bold" style={{ color: C.mute }}>{t("past")}</div>}
      {recent.map((v) => (
        <button key={v.no} onClick={() => onOpen(v)} className="tap w-full rounded-2xl p-4 mb-2 flex items-center justify-between" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <div style={{ textAlign: ar ? "right" : "left" }}>
            <div className="font-bold" style={{ fontFamily: FONT_NUM }}>{v.no}</div>
            <div className="text-sm" style={{ color: C.mute, fontFamily: FONT_NUM }}>{v.date}</div>
          </div>
          <div className="font-bold text-lg" style={{ fontFamily: FONT_NUM, color: C.olive }}>{money(v.total)}</div>
        </button>
      ))}
    </div>
  );
}

function LangToggle({ ar, switchLang }) {
  return (
    <div className="flex rounded-full overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      <button
        onClick={() => switchLang("ar")}
        className="tap px-4 py-2 font-bold text-sm"
        style={{ background: ar ? C.ink : C.card, color: ar ? "#fff" : C.ink, fontFamily: FONT_AR }}
      >
        عربي
      </button>
      <button
        onClick={() => switchLang("zh")}
        className="tap px-4 py-2 font-bold text-sm"
        style={{ background: !ar ? C.ink : C.card, color: !ar ? "#fff" : C.ink, fontFamily: FONT_ZH }}
      >
        中文
      </button>
    </div>
  );
}

/* ---------------- 录入 ---------------- */
function Buy({ lang, ar, t, draft, setDraft, catalog, prices, data, save, onBack, onDone }) {
  const [group, setGroup] = useState("veg");
  const [picking, setPicking] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const total = draft.lines.reduce((s, l) => s + l.qty * l.price, 0);
  const itemById = (id) => catalog.find((c) => c.id === id);
  const nameOf = (o) => (ar ? o.ar : o.zh);
  const subOf = (o) => (ar ? o.zh : o.ar);

  const addLine = (item, qty, price, unit) => {
    setDraft({ ...draft, lines: [...draft.lines, { itemId: item.id, qty, price, unit }] });
    setPicking(null);
  };
  const delLine = (i) => setDraft({ ...draft, lines: draft.lines.filter((_, k) => k !== i) });

  return (
    <div className="max-w-md mx-auto pb-40">
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: C.ink, color: "#fff" }}>
        <button onClick={onBack} className="tap p-2 rounded-xl" style={{ background: "rgba(255,255,255,.12)" }}>
          {ar ? <ArrowRight size={22} color="#fff" /> : <ArrowLeft size={22} color="#fff" />}
        </button>
        <div className="text-sm" style={{ fontFamily: FONT_NUM, opacity: 0.85 }}>{draft.no}</div>
        <div className="text-sm" style={{ fontFamily: FONT_NUM, opacity: 0.85 }}>{draft.date}</div>
      </div>

      {draft.lines.length > 0 && (
        <div className="px-4 pt-3">
          {draft.lines.map((l, i) => {
            const it = itemById(l.itemId) || { e: "❔", ar: "?", zh: "?" };
            return (
              <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-2 mb-2" style={{ background: C.card, border: `1px solid ${C.line}` }}>
                <span className="text-2xl">{it.e}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{nameOf(it)}</div>
                  <div className="text-sm" style={{ color: C.mute, fontFamily: FONT_NUM }} dir="ltr">
                    {l.qty} {ar ? unitOf(l.unit).ar : unitOf(l.unit).zh} × {money(l.price)}
                  </div>
                </div>
                <div className="font-bold text-lg" style={{ fontFamily: FONT_NUM, color: C.olive }}>{money(l.qty * l.price)}</div>
                <button onClick={() => delLine(i)} className="tap p-2 rounded-xl" style={{ background: "#FBECE8" }}>
                  <Trash2 size={18} color={C.tomato} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 px-4 pt-3 pb-2 overflow-x-auto">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGroup(g.id)}
            className="tap rounded-full px-4 py-2 whitespace-nowrap font-bold"
            style={{ background: group === g.id ? C.ink : C.card, color: group === g.id ? "#fff" : C.ink, border: `1px solid ${group === g.id ? C.ink : C.line}` }}
          >
            <span style={{ marginInlineEnd: 4 }}>{g.e}</span>
            {nameOf(g)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 px-4">
        {catalog.filter((c) => (c.g || "veg") === group).map((it) => (
          <button key={it.id} onClick={() => setPicking(it)} className="tap rounded-2xl py-4 flex flex-col items-center gap-1" style={{ background: C.card, border: `1px solid ${C.line}` }}>
            <span className="text-4xl">{it.e}</span>
            <span className="font-bold text-sm leading-tight text-center px-1">{nameOf(it)}</span>
            <span className="text-xs leading-tight text-center px-1" style={{ color: C.mute, fontFamily: ar ? FONT_ZH : FONT_AR }}>{subOf(it)}</span>
          </button>
        ))}
        <button onClick={() => setAddOpen(true)} className="tap rounded-2xl py-4 flex flex-col items-center justify-center gap-1" style={{ background: "#fff", border: `2px dashed ${C.amber}` }}>
          <Plus size={30} color={C.amber} strokeWidth={3} />
          <span className="font-bold text-sm">{t("other")}</span>
        </button>
      </div>

      <div className="no-print fixed bottom-0 left-0 right-0 px-4 py-3" style={{ background: C.ink }}>
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs" style={{ color: "rgba(255,255,255,.6)" }}>{t("total")}</div>
            <div className="flex items-baseline gap-2" dir="ltr">
              <span className="text-3xl font-bold" style={{ fontFamily: FONT_NUM, color: C.amber }}>{money(total)}</span>
              <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,.7)" }}>JOD</span>
            </div>
          </div>
          <button
            onClick={onDone}
            disabled={draft.lines.length === 0}
            className="tap rounded-2xl px-6 py-4 font-bold text-lg flex items-center gap-2"
            style={{ background: draft.lines.length ? C.amber : "rgba(255,255,255,.15)", color: draft.lines.length ? C.ink : "rgba(255,255,255,.4)" }}
          >
            <Check size={22} strokeWidth={3} /> {t("done")}
          </button>
        </div>
      </div>

      {picking && <Keypad lang={lang} ar={ar} t={t} item={picking} lastPrice={prices[picking.id]} onCancel={() => setPicking(null)} onConfirm={addLine} />}
      {addOpen && <AddItem lang={lang} ar={ar} t={t} group={group} data={data} save={save} onClose={() => setAddOpen(false)} onAdded={(it) => { setAddOpen(false); setPicking(it); }} />}
    </div>
  );
}

/* ---------------- 大数字键盘 ---------------- */
function Keypad({ ar, t, item, lastPrice, onCancel, onConfirm }) {
  const [step, setStep] = useState("qty");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState(item.u || "kg");

  const cur = step === "qty" ? qty : price;
  const setCur = step === "qty" ? setQty : setPrice;

  const press = (k) => {
    if (k === "del") return setCur(cur.slice(0, -1));
    if (k === "." && cur.includes(".")) return;
    if (cur.length > 7) return;
    setCur(cur + k);
  };

  const q = parseFloat(qty) || 0;
  const p = parseFloat(price) || 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(16,32,63,.55)" }}>
      <div className="rounded-t-3xl p-4 pb-6" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{item.e}</span>
            <div>
              <div className="font-bold text-xl">{ar ? item.ar : item.zh}</div>
              <div className="text-sm" style={{ color: C.mute, fontFamily: ar ? FONT_ZH : FONT_AR }}>{ar ? item.zh : item.ar}</div>
            </div>
          </div>
          <button onClick={onCancel} className="tap p-3 rounded-2xl" style={{ background: C.card }}>
            <X size={22} color={C.ink} />
          </button>
        </div>

        {/* 单位可选 */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => setUnit(u.id)}
              className="tap rounded-xl px-4 py-3 font-bold whitespace-nowrap"
              style={{ background: unit === u.id ? C.olive : C.card, color: unit === u.id ? "#fff" : C.ink, border: `1px solid ${unit === u.id ? C.olive : C.line}` }}
            >
              {ar ? u.ar : u.zh}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <StepBox ar={ar} active={step === "qty"} onClick={() => setStep("qty")} label={`${t("qty")}（${ar ? unitOf(unit).ar : unitOf(unit).zh}）`} value={qty || "0"} />
          <StepBox ar={ar} active={step === "price"} onClick={() => setStep("price")} label={t("price")} value={price || (lastPrice ? money(lastPrice) : "0")} faded={!price && !!lastPrice} />
        </div>

        {lastPrice && step === "price" && !price && (
          <button onClick={() => setPrice(money(lastPrice))} className="tap w-full rounded-xl py-2 mb-3 text-sm font-bold" style={{ background: "#FFF4DC", color: C.ink }}>
            {t("lastPrice")} {money(lastPrice)} — {t("tapUse")}
          </button>
        )}

        <div className="rounded-2xl py-3 mb-3 text-center" style={{ background: C.ink }} dir="ltr">
          <span className="text-3xl font-bold" style={{ fontFamily: FONT_NUM, color: C.amber }}>{money(q * p)}</span>
          <span className="text-sm font-bold ml-2" style={{ color: "rgba(255,255,255,.7)" }}>JOD</span>
        </div>

        <div className="grid grid-cols-3 gap-2" dir="ltr">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="tap rounded-2xl flex items-center justify-center"
              style={{ background: C.card, border: `1px solid ${C.line}`, height: 60, fontSize: 26, fontWeight: 700, fontFamily: FONT_NUM }}
            >
              {k === "del" ? <Delete size={24} color={C.tomato} /> : k}
            </button>
          ))}
        </div>

        <button
          onClick={() => (step === "qty" ? setStep("price") : q > 0 && p > 0 && onConfirm(item, q, p, unit))}
          disabled={step === "qty" ? !q : !(q > 0 && p > 0)}
          className="tap w-full rounded-2xl mt-3 py-4 font-bold text-xl"
          style={{ background: (step === "qty" ? q : q && p) ? C.olive : "#DDD9CF", color: (step === "qty" ? q : q && p) ? "#fff" : C.mute }}
        >
          {step === "qty" ? t("next") : t("add")}
        </button>
      </div>
    </div>
  );
}

function StepBox({ ar, active, onClick, label, value, faded }) {
  return (
    <button onClick={onClick} className="tap rounded-2xl p-3" style={{ background: C.card, border: `2px solid ${active ? C.olive : C.line}`, textAlign: ar ? "right" : "left" }}>
      <div className="text-xs" style={{ color: C.mute }}>{label}</div>
      <div className="text-2xl font-bold" style={{ fontFamily: FONT_NUM, color: faded ? C.mute : C.ink }} dir="ltr">{value}</div>
    </button>
  );
}

/* ---------------- 新增品名 + 翻译 ---------------- */
function AddItem({ ar, t, group, data, save, onClose, onAdded }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState(null);

  const translate = async () => {
    if (!text.trim()) return;
    setBusy(true);
    setErr("");
    await new Promise((resolve) => setTimeout(resolve, 220));
    const query = text.trim().toLocaleLowerCase();
    const matched = PRESET.find((item) =>
      [item.ar, item.zh, item.en].some((name) => name.toLocaleLowerCase() === query),
    );

    if (matched) {
      setRes({ ...matched, manual: false });
    } else {
      const inputIsArabic = /[\u0600-\u06ff]/.test(text);
      const category = GROUPS.find((item) => item.id === group);
      setRes({
        ar: inputIsArabic ? text.trim() : "",
        zh: inputIsArabic ? "" : text.trim(),
        en: text.trim(),
        e: category?.e || "🥗",
        u: "kg",
        g: group,
        manual: true,
      });
    }
    setBusy(false);
  };

  const confirm = async () => {
    if (!res?.ar?.trim() || !res?.zh?.trim()) return;
    const item = { id: "c" + Date.now(), e: res.e || "🥗", ar: res.ar, zh: res.zh, en: res.en, u: res.u || "kg", g: res.g || group };
    await save({ ...data, custom: [...data.custom, item] });
    onAdded(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(16,32,63,.55)" }}>
      <div className="rounded-t-3xl p-5 pb-8" style={{ background: C.paper }}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-xl">{t("newItem")}</div>
          <button onClick={onClose} className="tap p-3 rounded-2xl" style={{ background: C.card }}>
            <X size={22} color={C.ink} />
          </button>
        </div>

        <div className="text-sm mb-2" style={{ color: C.mute }}>{t("typeName")}</div>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); setRes(null); }}
          placeholder={t("eg")}
          className="w-full rounded-2xl px-4 py-4 text-xl mb-3"
          style={{ background: C.card, border: `1px solid ${C.line}` }}
        />

        {!res && (
          <button onClick={translate} disabled={busy || !text.trim()} className="tap w-full rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2" style={{ background: text.trim() ? C.ink : "#DDD9CF", color: text.trim() ? "#fff" : C.mute }}>
            {busy ? <Loader2 size={20} className="animate-spin" /> : <Languages size={20} />} {t("translate")}
          </button>
        )}

        {err && <div className="mt-3 text-center font-bold" style={{ color: C.tomato }}>{err}</div>}

        {res && (
          <div>
            <div className="rounded-2xl p-4 mb-3 flex items-start gap-4" style={{ background: C.card, border: `1px solid ${C.line}` }}>
              <span className="text-5xl">{res.e}</span>
              <div className="flex-1 min-w-0">
                {res.manual && (
                  <div className="text-xs mb-2" style={{ color: C.mute }}>
                    {ar ? "أكمل الاسم بالعربية والصينية" : "未匹配到内置词库，请补充中阿文名称"}
                  </div>
                )}
                <input
                  dir="rtl"
                  value={res.ar}
                  onChange={(e) => setRes({ ...res, ar: e.target.value })}
                  placeholder="الاسم بالعربية"
                  className="w-full rounded-xl px-3 py-2 mb-2 font-bold"
                  style={{ border: `1px solid ${C.line}`, fontFamily: FONT_AR }}
                />
                <input
                  dir="ltr"
                  value={res.zh}
                  onChange={(e) => setRes({ ...res, zh: e.target.value })}
                  placeholder="中文名称"
                  className="w-full rounded-xl px-3 py-2 font-bold"
                  style={{ border: `1px solid ${C.line}`, fontFamily: FONT_ZH }}
                />
                <div className="text-sm" style={{ color: C.mute }}>{res.en}</div>
              </div>
            </div>
            <button
              onClick={confirm}
              disabled={!res.ar?.trim() || !res.zh?.trim()}
              className="tap w-full rounded-2xl py-4 font-bold text-lg"
              style={{ background: res.ar?.trim() && res.zh?.trim() ? C.olive : "#DDD9CF", color: res.ar?.trim() && res.zh?.trim() ? "#fff" : C.mute }}
            >
              {t("saveUse")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 单据（打印用，固定中英阿三语） ---------------- */
function VoucherView({ ar, t, v, catalog, onBack }) {
  const itemById = (id) => catalog.find((c) => c.id === id) || { ar: "?", zh: "?", u: "kg" };
  const rows = v.lines.map((l) => ({ ...itemById(l.itemId), qty: l.qty, price: l.price, unit: l.unit || itemById(l.itemId).u }));

  return (
    <div>
      <div className="no-print px-4 py-3 flex items-center justify-between max-w-md mx-auto" style={{ background: C.ink }}>
        <button onClick={onBack} className="tap p-2 rounded-xl" style={{ background: "rgba(255,255,255,.12)" }}>
          {ar ? <ArrowRight size={22} color="#fff" /> : <ArrowLeft size={22} color="#fff" />}
        </button>
        <span className="font-bold" style={{ color: "#fff", fontFamily: FONT_NUM }}>{v.no}</span>
        <button onClick={() => window.print()} className="tap rounded-xl px-4 py-2 font-bold flex items-center gap-2" style={{ background: C.amber, color: C.ink }}>
          <Printer size={18} /> {t("print")}
        </button>
      </div>

      <div dir="ltr" className="mx-auto bg-white p-6" style={{ maxWidth: 760, fontFamily: "system-ui, sans-serif", color: "#000" }}>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: C.ink2 }}>JIN CHENG GLOBAL CERAMIC CO. LTD.</div>
          <div className="text-xs mt-1" style={{ color: "#666" }}>约旦金城环球陶瓷有限公司 | شركة جين تشنغ جلوبال للسيراميك</div>
          <div className="mt-2 py-2 text-white font-bold" style={{ background: C.ink2 }}>
            采购食物清单 &nbsp; FOOD PURCHASE LIST &nbsp; قائمة مشتريات المواد الغذائية
          </div>
        </div>

        <table className="w-full mt-3" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <Td b>单据编号 Voucher No.</Td>
              <Td mono>{v.no}</Td>
              <Td b>日期 Date</Td>
              <Td mono>{v.date}</Td>
            </tr>
            <tr>
              <Td b>用途 Purpose</Td>
              <Td>员工食堂 Canteen</Td>
              <Td b>付款方式 Payment</Td>
              <Td>现金 Cash / نقداً</Td>
            </tr>
          </tbody>
        </table>

        <table className="w-full mt-3" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.ink2, color: "#fff" }}>
              <Th w="6%">No.</Th>
              <Th w="40%">品名 Description الصنف</Th>
              <Th w="10%">单位 Unit</Th>
              <Th w="12%">数量 Qty</Th>
              <Th w="14%">单价 JOD</Th>
              <Th w="18%">金额 JOD</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? "#F4F7FB" : "#fff" }}>
                <Td center>{i + 1}</Td>
                <Td>{r.zh} / {r.ar}</Td>
                <Td center>{unitOf(r.unit).en}</Td>
                <Td right mono>{r.qty}</Td>
                <Td right mono>{money(r.price)}</Td>
                <Td right mono>{money(r.qty * r.price)}</Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#E8EDF7" }}>
              <td colSpan={5} className="text-right font-bold p-2" style={{ border: "1px solid #999" }}>合计 TOTAL / المجموع</td>
              <td className="text-right font-bold p-2" style={{ border: "1px solid #999", fontFamily: FONT_NUM }}>{money(v.total)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="text-xs mt-3 p-2" style={{ border: "1px solid #999", color: "#333" }}>
          声明：以上货物系向无法开具正式发票的零售商贩现金采购，所列品名、数量、单价与实际情况一致，货款已全额付清。<br />
          Declaration: The above goods were purchased in cash from retail vendors unable to issue official invoices; the items, quantities and prices are true and payment has been settled in full.
        </div>

        <div className="flex mt-6" style={{ border: "1px solid #999" }}>
          <div className="flex-1 p-3" style={{ borderRight: "1px solid #999" }}>
            <div className="text-sm font-bold">采购人签字 Purchaser's Signature / توقيع المشتري</div>
            <div style={{ height: 60 }} />
          </div>
          <div style={{ width: "35%" }} className="p-3">
            <div className="text-sm font-bold">签字日期 Date / التاريخ</div>
            <div style={{ height: 60 }} />
          </div>
        </div>
        <div className="text-xs mt-2" style={{ color: "#888" }}>
          本单据为内部记账凭证，非 JoFotara 正式发票，销项/进项税不得据此抵扣。
        </div>
      </div>
    </div>
  );
}

const Th = ({ children, w }) => (
  <th className="p-2 text-center" style={{ border: "1px solid #999", width: w, fontSize: 12 }}>{children}</th>
);
const Td = ({ children, b, center, right, mono }) => (
  <td
    className="p-2"
    style={{
      border: "1px solid #999",
      fontWeight: b ? 700 : 400,
      textAlign: center ? "center" : right ? "right" : "left",
      fontFamily: mono ? FONT_NUM : undefined,
      fontSize: 13,
    }}
  >
    {children}
  </td>
);
