:root{
  --bg:#f5f5f9;
  --panel:#ffffff;
  --ink:#32334a;
  --ink-soft:#5a5b78;
  --muted:#a5a3b8;
  --line:#eceaf5;
  --accent:#7367f0;
  --accent-soft:#eeecff;
  --accent-dark:#5a4fd6;
  --success:#28c76f;
  --success-soft:#dff7e9;
  --warn:#ff9f43;
  --warn-soft:#fff1e0;
  --danger:#ea5455;
  --danger-soft:#fde3e4;
  --info:#00cfe8;
  --info-soft:#d9f6fa;
  --pink:#ff6b9d;
  --pink-soft:#ffe5ef;
  --brand-ink:#2F3349;
  --brand-pink:#FF4FA3;
  --brand-online:#71DD37;
  --confetti-cyan:#03C3EC;
  --font:'Public Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  --radius:10px;
  --radius-lg:14px;
  --shadow:0 2px 6px rgba(50,51,74,0.06);
  --shadow-lg:0 6px 20px rgba(50,51,74,0.08);
  --shadow-card:0 2px 6px rgba(47,51,73,0.08);
  --shadow-brand:0 4px 12px rgba(115,103,240,0.35);
}
*{ box-sizing:border-box; }
html,body,#root{ margin:0; padding:0; min-height:100vh; }
body{ background:var(--bg); color:var(--ink); font-family:var(--font); font-size:14px; line-height:1.5; -webkit-font-smoothing:antialiased; }

.app{ display:grid; grid-template-columns:260px 1fr; min-height:100vh; }

/* Sidebar */
aside{
  background:var(--panel); border-right:1px solid var(--line);
  padding:22px 14px; position:sticky; top:0; height:100vh; overflow-y:auto;
}
.brand{
  display:flex; align-items:center; gap:11px;
  padding:4px 6px 14px; margin-bottom:12px;
  border-bottom:1px solid #EDEDF2;
  cursor:pointer;
}

/* Brand mark tile — new: rounded gradient tile with drop shadow (was navy circle) */
.brand-stamp{
  width:42px; height:42px; border-radius:12px;
  background:linear-gradient(135deg, var(--accent) 0%, var(--brand-pink) 100%);
  box-shadow:var(--shadow-brand);
  display:flex; align-items:center; justify-content:center;
  flex:none;
}
.brand-stamp img{ height:25px; width:auto; display:block; }

.brand-text{ display:flex; flex-direction:column; line-height:1.15; min-width:0; }
.brand-wordmark{ font-size:20px; font-weight:700; letter-spacing:-0.02em; white-space:nowrap; }
.brand-wordmark .part1{ color:var(--brand-ink); }
.brand-wordmark .part2{ color:var(--accent); }
.brand-kicker{
  font-size:9px; font-weight:400; letter-spacing:0.19em;
  text-transform:uppercase; color:#a5a3ae;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}

.nav-section{
  font-size:10.5px; font-weight:700; color:var(--muted); text-transform:uppercase;
  letter-spacing:0.7px; padding:16px 12px 8px;
}
.nav-item{
  display:flex; align-items:center; gap:12px; padding:9px 10px; border-radius:8px;
  color:var(--ink-soft); cursor:pointer; font-weight:500; font-size:13.5px;
  margin-bottom:3px; transition:all 0.15s; border:none; background:none; width:100%;
  text-align:left; font-family:inherit; text-decoration:none;
}
.nav-item:hover{ background:#f6f5fa; color:var(--ink); }
.nav-item.active{
  background:linear-gradient(72deg,var(--accent) 0%, #8f83f5 100%);
  color:#fff; box-shadow:0 3px 10px rgba(115,103,240,0.35);
}
.chip{
  width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center;
  flex-shrink:0; transition:all 0.15s;
}
.chip svg{ width:15px; height:15px; }
.nav-item .chip{ background:var(--accent-soft); color:var(--accent); }
.nav-item[data-color="info"] .chip{ background:var(--info-soft); color:var(--info); }
.nav-item[data-color="pink"] .chip{ background:var(--pink-soft); color:var(--pink); }
.nav-item[data-color="warn"] .chip{ background:var(--warn-soft); color:var(--warn); }
.nav-item[data-color="success"] .chip{ background:var(--success-soft); color:var(--success); }
.nav-item[data-color="muted"] .chip{ background:#f0eef8; color:var(--ink-soft); }
.nav-item.active .chip{ background:rgba(255,255,255,0.22); color:#fff; }
.nav-item.active .chip svg{ stroke:#fff; }
.badge{ margin-left:auto; font-size:10px; padding:2px 7px; border-radius:10px; background:var(--danger); color:#fff; font-weight:700; }
.badge.soft{ background:var(--warn-soft); color:var(--warn); }

/* Topbar */
.topbar{
  background:var(--panel); border-radius:var(--radius-lg); margin:18px 28px 0;
  padding:10px 18px; display:flex; align-items:center; gap:14px;
  box-shadow:var(--shadow);
}
.search{ display:flex; align-items:center; gap:10px; flex:1; color:var(--muted); }
.search input{ border:none; outline:none; background:none; font-family:inherit; font-size:14px; color:var(--ink); width:100%; }
.top-icons{ display:flex; align-items:center; gap:6px; }
.icn-btn{
  width:36px; height:36px; display:flex; align-items:center; justify-content:center;
  border-radius:8px; color:var(--ink-soft); cursor:pointer; position:relative;
  text-decoration:none;
}
.icn-btn:hover{ background:#f6f5fa; color:var(--ink); }
.dot{ position:absolute; top:8px; right:8px; width:8px; height:8px; border-radius:50%; background:var(--danger); border:2px solid #fff; }

/* Avatar — new spec: 34px, gradient 135deg, border only (no outer ring), tighter portrait */
.avatar{
  width:34px; height:34px; border-radius:50%;
  overflow:hidden; position:relative;
  background:linear-gradient(135deg, var(--accent) 0%, var(--brand-pink) 100%);
  border:2px solid var(--brand-online);
  margin-left:6px;
}
.avatar img{ position:absolute; left:50%; transform:translateX(-50%); top:2px; height:92px; width:auto; }

.content{ padding:22px 28px 60px; }

/* Hero — rewritten: standard padded card with portrait on halo + confetti dots.
   Card is 302px min-height because the portrait is bottom-anchored past the card edge. */
.hero{
  background:var(--panel);
  border-radius:8px;
  padding:32px 36px;
  display:flex; align-items:flex-end; gap:24px;
  min-height:302px;
  overflow:hidden;
  margin-bottom:20px;
  box-shadow:var(--shadow-card);
}
.hero-text{
  flex:1 1 auto;
  display:flex; flex-direction:column; gap:14px;
  padding-bottom:8px;
  min-width:0;
}
.hero .greet{ color:var(--accent); font-weight:700; font-size:24px; margin:0; letter-spacing:-0.3px; }
.hero .greet span{ display:inline-block; animation:wave 1.6s ease-in-out infinite; transform-origin:70% 70%; }
@keyframes wave{ 0%,60%,100%{transform:rotate(0)} 10%{transform:rotate(14deg)} 20%{transform:rotate(-8deg)} 30%{transform:rotate(14deg)} 40%{transform:rotate(-4deg)} 50%{transform:rotate(10deg)} }
.hero p{ margin:0; color:#6D6B77; font-size:15px; line-height:1.55; max-width:460px; }
.hero .cta{
  display:inline-block; background:var(--accent); color:#fff; text-decoration:none;
  padding:10px 18px; border-radius:6px; font-weight:500; font-size:14px;
  box-shadow:0 3px 8px rgba(115,103,240,0.35); cursor:pointer; border:none; font-family:inherit;
}

/* Art column — halo + confetti + portrait, all absolutely positioned */
.hero-art{
  width:230px; flex:none; align-self:stretch;
  position:relative;
}
.hero-halo{
  position:absolute;
  width:190px; height:190px;
  border-radius:50%;
  background:linear-gradient(135deg, #F1EFFF 0%, #FFE9F4 100%);
  right:16px; bottom:-22px;
}
.hero-confetti{ position:absolute; border-radius:50%; }
.hero-confetti.c1{ width:7px; height:7px; background:var(--brand-pink);     right:6px;   top:14px; }
.hero-confetti.c2{ width:6px; height:6px; background:var(--confetti-cyan);  right:196px; top:52px; }
.hero-confetti.c3{ width:5px; height:5px; background:var(--brand-online);   right:176px; bottom:26px; }
.hero-portrait-img{
  position:absolute;
  right:34px; bottom:-30px;
  height:266px; width:auto;
  filter:drop-shadow(0 14px 20px rgba(47,51,73,0.18));
}

/* Hero responsive */
@media(max-width:1100px){
  .hero{ min-height:250px; }
  .hero-art{ width:170px; }
  .hero-halo{ width:140px; height:140px; bottom:-16px; }
  .hero-portrait-img{ height:200px; bottom:-22px; }
  .hero-confetti.c2{ right:146px; }
  .hero-confetti.c3{ right:126px; }
}
@media(max-width:768px){
  .hero-art{ display:none; }
  .hero{ min-height:auto; }
}

/* Stat cards */
.stat-row{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-bottom:20px; }
.stat-card{
  border-radius:var(--radius-lg); padding:20px 22px; color:#fff;
  position:relative; overflow:hidden; box-shadow:var(--shadow);
  min-height:130px; display:flex; flex-direction:column; justify-content:space-between;
}
.stat-card .stat-icn{
  width:44px; height:44px; border-radius:10px; background:rgba(255,255,255,0.22);
  display:flex; align-items:center; justify-content:center; margin-bottom:10px;
}
.stat-card .stat-icn svg{ width:22px; height:22px; stroke:#fff; }
.stat-card .lbl{ font-size:13px; font-weight:500; opacity:0.9; }
.stat-card .val{ font-size:26px; font-weight:800; letter-spacing:-0.5px; margin-top:2px; }
.stat-card .delta{ font-size:11.5px; opacity:0.88; margin-top:6px; font-weight:500; }
.stat-1{ background:linear-gradient(135deg,#7367f0,#9d94f5); }
.stat-2{ background:linear-gradient(135deg,#00cfe8,#4ddbec); }
.stat-3{ background:linear-gradient(135deg,#ff9f43,#ffb976); }
.stat-4{ background:linear-gradient(135deg,#28c76f,#5fd694); }
.stat-card::after{ content:''; position:absolute; right:-30px; top:-30px; width:120px; height:120px; border-radius:50%; background:rgba(255,255,255,0.09); }
.stat-card::before{ content:''; position:absolute; right:20px; bottom:-40px; width:80px; height:80px; border-radius:50%; background:rgba(255,255,255,0.07); }

.dash-grid{ display:grid; grid-template-columns:2fr 1fr; gap:20px; }
@media(max-width:1100px){ .dash-grid{ grid-template-columns:1fr; } }

/* Panels */
.panel{ background:var(--panel); border-radius:var(--radius-lg); padding:22px 24px; box-shadow:var(--shadow); margin-bottom:20px; }
.panel-head{ display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; gap:12px; flex-wrap:wrap; }
.panel h3{ margin:0; font-size:16px; font-weight:700; letter-spacing:-0.2px; }
.panel .sub{ margin:3px 0 0; color:var(--muted); font-size:12.5px; }

/* Tables */
table{ width:100%; border-collapse:collapse; }
th{
  text-align:left; font-size:11px; font-weight:700; color:var(--muted);
  text-transform:uppercase; letter-spacing:0.5px; padding:11px 12px;
  border-bottom:1px solid var(--line); background:#fafaff;
}
th:first-child{ border-top-left-radius:8px; padding-left:14px; }
th:last-child{ border-top-right-radius:8px; padding-right:14px; }
td{ padding:14px 12px; border-bottom:1px solid var(--line); font-size:13.5px; vertical-align:middle; }
td:first-child{ padding-left:14px; }
td:last-child{ padding-right:14px; }
tr:last-child td{ border-bottom:none; }
tr:hover td{ background:#fafaff; }
.num{ text-align:right; font-variant-numeric:tabular-nums; font-weight:500; }
.row-name{ display:flex; align-items:center; gap:10px; }
.row-chip{
  width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:13px; color:#fff; flex-shrink:0;
}

/* Inputs */
input, select{
  font-family:inherit; font-size:13.5px; padding:9px 12px; border:1px solid var(--line);
  border-radius:8px; background:#fff; color:var(--ink); width:100%; transition:all 0.15s;
}
input:focus, select:focus{ outline:none; border-color:var(--accent); box-shadow:0 0 0 3px rgba(115,103,240,0.12); }
.row-add{ display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; align-items:flex-end; padding-top:16px; border-top:1px dashed var(--line); }
.field{ display:flex; flex-direction:column; gap:5px; }
.field label{ font-size:11px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:0.4px; }
.hint{ font-size:11.5px; color:var(--muted); margin-top:4px; }
.hint code{ background:#f0eef8; padding:1px 4px; border-radius:3px; font-size:11px; }

/* Buttons */
button.primary{
  background:var(--accent); color:#fff; border:none; padding:9px 18px; border-radius:8px;
  cursor:pointer; font-size:13.5px; font-weight:600; font-family:inherit;
  box-shadow:0 3px 8px rgba(115,103,240,0.28); transition:all 0.15s;
}
button.primary:hover{ background:var(--accent-dark); }
button.primary:active{ transform:translateY(1px); }
button.primary:disabled{ opacity:0.55; cursor:not-allowed; box-shadow:none; }
button.ghost{
  background:none; border:1px solid var(--line); color:var(--ink-soft); padding:6px 12px;
  border-radius:6px; cursor:pointer; font-size:12px; font-weight:500; font-family:inherit;
  display:inline-flex; align-items:center; gap:5px;
}
button.ghost:hover{ border-color:var(--danger); color:var(--danger); background:var(--danger-soft); }
button.edit{
  background:none; border:1px solid var(--line); color:var(--accent); padding:6px 12px;
  border-radius:6px; cursor:pointer; font-size:12px; font-weight:500; font-family:inherit;
  display:inline-flex; align-items:center; gap:5px;
}
button.edit:hover{ border-color:var(--accent); background:var(--accent-soft); }
.action-cell{ display:flex; gap:6px; align-items:center; justify-content:flex-start; flex-wrap:nowrap; }

/* Pills */
.pill{ display:inline-block; padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; }
.pill.ok{ background:var(--success-soft); color:var(--success); }
.pill.low{ background:var(--warn-soft); color:var(--warn); }
.pill.bridge{ background:var(--accent-soft); color:var(--accent); }
.pill.err{ background:var(--danger-soft); color:var(--danger); }
.pill.info{ background:var(--info-soft); color:var(--info); }

.empty{ color:var(--muted); font-style:italic; padding:24px 4px; text-align:center; }

/* BOM */
.bom-line{
  display:grid; grid-template-columns:2fr 1fr 1fr 1fr auto; gap:12px; align-items:center;
  padding:12px 14px; border:1px solid var(--line); border-radius:10px; margin-bottom:8px;
  background:#fff; transition:all 0.15s;
}
.bom-line:hover{ border-color:#dedafc; background:#fafaff; }
.recipe-select{ margin-bottom:18px; max-width:380px; }

/* Info box */
.conv-box{
  background:linear-gradient(135deg,#f4f2ff,#eeecff); border:1px solid #dedafc;
  border-radius:10px; padding:14px 16px; font-size:12.5px; color:var(--ink-soft);
  margin-bottom:18px; display:flex; gap:12px; align-items:flex-start;
}
.conv-box b{ color:var(--accent-dark); }
.conv-icon{
  width:32px; height:32px; border-radius:8px; background:var(--accent); color:#fff;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}

/* Metric cards */
.metric-row{ display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:20px; }
.metric{
  background:var(--panel); border-radius:var(--radius-lg); padding:20px 22px;
  box-shadow:var(--shadow); display:flex; align-items:center; gap:14px;
}
.metric .m-icn{ width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.metric.a .m-icn{ background:var(--accent-soft); color:var(--accent); }
.metric.b .m-icn{ background:var(--info-soft); color:var(--info); }
.metric.c .m-icn{ background:var(--success-soft); color:var(--success); }
.metric .l{ font-size:12px; color:var(--muted); font-weight:500; }
.metric .v{ font-size:22px; font-weight:800; margin-top:2px; letter-spacing:-0.4px; }

/* Chart */
.chart-row{ display:flex; align-items:center; gap:12px; margin-bottom:14px; font-size:12.5px; }
.chart-row .name{ width:130px; color:var(--ink-soft); font-weight:500; }
.chart-row .bar-bg{ flex:1; height:8px; background:#f0eef8; border-radius:4px; overflow:hidden; }
.chart-row .bar-fill{ height:100%; border-radius:4px; }
.chart-row .val{ width:80px; text-align:right; font-variant-numeric:tabular-nums; font-weight:600; color:var(--ink); }

/* Radial */
.radial{ display:flex; flex-direction:column; align-items:center; padding:8px 0 6px; position:relative; }
.radial svg{ width:140px; height:140px; }
.radial .r-inner{ position:absolute; top:50%; left:50%; transform:translate(-50%,-60%); display:flex; flex-direction:column; align-items:center; }
.radial .r-val{ font-size:24px; font-weight:800; letter-spacing:-0.4px; }
.radial .r-lbl{ font-size:11px; color:var(--muted); }

/* Settings tabs */
.settings-tabs{ display:flex; gap:4px; border-bottom:1px solid var(--line); margin-bottom:20px; }
.settings-tabs button{
  background:none; border:none; padding:12px 18px;
  font-family:inherit; font-size:13.5px; font-weight:500;
  color:var(--ink-soft); cursor:pointer;
  border-bottom:2px solid transparent; margin-bottom:-1px;
}
.settings-tabs button:hover{ color:var(--ink); }
.settings-tabs button.active{ color:var(--accent); border-bottom-color:var(--accent); font-weight:600; }

.settings-grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
@media(max-width:820px){ .settings-grid{ grid-template-columns:1fr; } }

/* Header link row */
.header-link-row{
  display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;
  padding:14px; border:1px solid var(--line); border-radius:10px;
  background:#fff;
}
.header-link-row:hover{ border-color:#dedafc; }

/* Icon picker */
.icon-picker-wrap{ position:relative; }
.icon-picker-btn{
  display:flex; align-items:center; gap:4px;
  padding:8px 10px; border:1px solid var(--line); border-radius:8px;
  background:#fff; cursor:pointer; color:var(--ink-soft); font-family:inherit;
  height:38px;
}
.icon-picker-btn:hover{ border-color:var(--accent); color:var(--accent); }
.icon-picker-popover{
  position:absolute; top:calc(100% + 4px); left:0; z-index:20;
  background:#fff; border:1px solid var(--line); border-radius:10px;
  box-shadow:var(--shadow-lg); padding:8px;
  display:grid; grid-template-columns:repeat(6, 32px); gap:4px;
  width:232px;
}
.icon-picker-popover button{
  width:32px; height:32px; border:none; background:none; cursor:pointer;
  border-radius:6px; display:flex; align-items:center; justify-content:center;
  color:var(--ink-soft); padding:0;
}
.icon-picker-popover button:hover{ background:var(--accent-soft); color:var(--accent); }
.icon-picker-popover button.active{ background:var(--accent); color:#fff; }

/* Preview tile in Settings — matches the sidebar mark tile */
.brand-tile-preview{
  width:80px; height:80px; border-radius:22px;
  background:linear-gradient(135deg, var(--accent) 0%, var(--brand-pink) 100%);
  box-shadow:var(--shadow-brand);
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}

/* Loading */
.loading{ color:var(--muted); text-align:center; padding:40px; }

/* Responsive */
@media(max-width:960px){
  .app{ grid-template-columns:1fr; }
  aside{ display:none; }
  .stat-row{ grid-template-columns:repeat(2,1fr); }
  .metric-row{ grid-template-columns:1fr; }
}
