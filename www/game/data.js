// Oyun verisi: temalar, kozmetikler, mağaza kilitleri, ayarlar/istatistik
// kalıcılığı (localStorage), zorluk tabloları, seed'li RNG, günlük görevler,
// başarımlar ve yıldız tozu (coin) ekonomisi.
const THEMES = {
  neon:      {name:'Neon',       star:'#54e0ff', gold:'#ffd24a', peril:'#ff4d6d', player:'#a97bff', sun:'#8ad8ff', bg0:'#05060f', bg1:'#0b0f2a', sf:'#9fb8ff', gate:{type:'free'}},
  sunset:    {name:'Gün Batımı', star:'#ff9e64', gold:'#ffd93d', peril:'#ff2e63', player:'#ff6bd6', sun:'#ffb37b', bg0:'#160a14', bg1:'#2a0f24', sf:'#ffd0b0', gate:{type:'free'}},
  matrix:    {name:'Matrix',     star:'#39ff14', gold:'#c6ff3b', peril:'#ff0055', player:'#00ffc3', sun:'#7dffb0', bg0:'#020a05', bg1:'#03160b', sf:'#7dff9f', gate:{type:'free'}},
  ice:       {name:'Buz',        star:'#7fdbff', gold:'#eaf9ff', peril:'#ff5e78', player:'#4fc3ff', sun:'#bdecff', bg0:'#05101a', bg1:'#0a2033', sf:'#bfe6ff', gate:{type:'free'}},
  vaporwave: {name:'Vaporwave',  star:'#ff6ec7', gold:'#7afcff', peril:'#ff2f6e', player:'#8a5fff', sun:'#ff9ee8', bg0:'#0f0620', bg1:'#1d0a3a', sf:'#c9a8ff', gate:{type:'coin', price:250}},
  gilded:    {name:'Altın Çağ',  star:'#ffe08a', gold:'#fff4c2', peril:'#ff5a3c', player:'#ffd24a', sun:'#fff6da', bg0:'#120d02', bg1:'#241a05', sf:'#ffe9a8', gate:{type:'coin', price:250}},
  void:      {name:'Kara Madde', star:'#c9c9ff', gold:'#8f8fff', peril:'#ff3d6b', player:'#4a3fff', sun:'#e0e0ff', bg0:'#020204', bg1:'#08060f', sf:'#8888aa', gate:{type:'coin', price:320}},
};
let T = THEMES.neon;
function applyTheme(key){
  T = THEMES[key] || THEMES.neon; cfg.theme = key; saveCfg();
  const r = document.documentElement.style;
  r.setProperty('--star',T.star); r.setProperty('--gold',T.gold);
  r.setProperty('--peril',T.peril); r.setProperty('--player',T.player);
  r.setProperty('--bg0',T.bg0); r.setProperty('--bg1',T.bg1);
  document.body.style.background = T.bg0;
  document.querySelectorAll('.theme').forEach(el=>el.classList.toggle('sel', el.dataset.key===key));
}

const SKINS = [
  {id:'default', name:'Mor Orb',    color:'#a97bff', gate:{type:'free'}},
  {id:'verdant', name:'Yeşil Orb',  color:'#5efc82', gate:{type:'achievement', id:'shield'}},
  {id:'solar',   name:'Altın Orb',  color:'#ffd24a', gate:{type:'achievement', id:'lvl5'}},
  {id:'aurora',  name:'Elmas Orb',  color:'#7fe8ff', gate:{type:'achievement', id:'diamondhunter'}},
  {id:'crimson', name:'Kızıl Orb',  color:'#ff4d6d', gate:{type:'achievement', id:'combo15'}},
  {id:'ember',   name:'Kor Orb',    color:'#ff8a3d', gate:{type:'coin', price:150}},
  {id:'frost',   name:'Buz Orb',    color:'#bfe8ff', gate:{type:'coin', price:150}},
  {id:'toxic',   name:'Toksik Orb', color:'#baff3d', gate:{type:'coin', price:220}},
  {id:'obsidian',name:'Obsidyen Orb', color:'#7d6fae', gate:{type:'coin', price:220}},
  {id:'prism',   name:'Prizma Orb', color:'#ffffff', gate:{type:'coin', price:400}, rainbow:true},
];
function playerColor(){
  const sk=SKINS.find(s=>s.id===cfg.skin)||SKINS[0];
  if(!isUnlockedItem('skins', sk)) return SKINS[0].color;
  if(sk.rainbow) return `hsl(${(performance.now()*0.06)%360},85%,68%)`;
  return sk.color;
}

const TRAILS = [
  {id:'classic', name:'Klasik',        gate:{type:'free'}},
  {id:'sparkle', name:'Kıvılcım',      gate:{type:'coin', price:120}},
  {id:'comet',   name:'Kuyruklu Yıldız', gate:{type:'coin', price:180}},
  {id:'rainbow', name:'Gökkuşağı',     gate:{type:'coin', price:280}},
  {id:'pixel',   name:'Piksel',        gate:{type:'coin', price:160}},
  {id:'ribbon',  name:'Kurdele',       gate:{type:'coin', price:200}},
];
const SUNS = [
  {id:'classic',   name:'Klasik Yıldız',  gate:{type:'free'}},
  {id:'redgiant',  name:'Kızıl Dev',      gate:{type:'coin', price:150}},
  {id:'blackhole', name:'Kara Delik',     gate:{type:'coin', price:350}},
  {id:'nebula',    name:'Nebula',         gate:{type:'coin', price:220}},
  {id:'crystal',   name:'Kristal Çekirdek', gate:{type:'coin', price:220}},
];
const RINGSTYLES = [
  {id:'classic', name:'Klasik',     gate:{type:'free'}},
  {id:'dotted',  name:'Noktalı',    gate:{type:'coin', price:100}},
  {id:'glow',    name:'Parlak',     gate:{type:'coin', price:180}},
  {id:'double',  name:'Çift Çizgi', gate:{type:'coin', price:160}},
];
const BOOSTS = [
  {id:'shieldstart', name:'Kalkanla Başla', desc:'Oyuna kalkan aktifken başlarsın', icon:'🛡️', price:80},
  {id:'slowstart',   name:'Yavaş Açılış',   desc:'İlk saniyelerde orb yavaş döner', icon:'⏳', price:60},
  {id:'luckystart',  name:'Şanslı Açılış',  desc:'İlk 3 tehlikeli an güvenliye çevrilir', icon:'🍀', price:70},
  {id:'coinrush',    name:'Toz Rüzgarı',    desc:'Bu oyunda kazanılan yıldız tozu %50 fazla', icon:'💫', price:100},
];

function isUnlockedItem(category, item){
  if(item.gate.type==='free') return true;
  if(item.gate.type==='achievement') return stats.unlocked.includes(item.gate.id);
  if(item.gate.type==='coin') return stats.owned[category].includes(item.id);
  return false;
}

let cfg = load('neonYorungeCfg', {sound:true, theme:'neon', skin:'default', trail:'classic', sun:'classic', ringStyle:'classic', bigButtons:false, leftHand:false, colorblind:false});
let stats = load('neonYorungeStats', {
  best:0, stars:0, games:0, maxLevel:1, magnets:0, golds:0, diamonds:0,
  unlocked:[], leaderboard:[], dailyDate:'', dailyDone:false, dailyScore:0, dailyCount:0,
  questDate:'', questId:'', questDone:false,
  stardust:0, lifetimeStardust:0, owned:{themes:[], skins:[], trails:[], suns:[], rings:[]}, boosts:{},
  adRewardsDate:'', adRewardsToday:0,
});
function load(k,def){ try{ return Object.assign({}, def, JSON.parse(localStorage.getItem(k)||'{}')); }catch(e){ return def; } }
function saveCfg(){ try{ localStorage.setItem('neonYorungeCfg', JSON.stringify(cfg)); }catch(e){} }
function saveStats(){ try{ localStorage.setItem('neonYorungeStats', JSON.stringify(stats)); }catch(e){} }

const DIFF = {
  easy:{label:'Kolay', lives:4, hazBase:0.06, hazRamp:0.0003, hazCap:0.17, speedRamp:0.0009},
  normal:{label:'Normal', lives:3, hazBase:0.08, hazRamp:0.0004, hazCap:0.21, speedRamp:0.0011},
  hard:{label:'Zor', lives:2, hazBase:0.11, hazRamp:0.00055, hazCap:0.25, speedRamp:0.0014},
};
let diffCfg = DIFF.normal;

function mulberry32(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function dateSeed(d){ d=d||new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); }
function todayStr(d){ d=d||new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
let rngFn = Math.random;
function rnd(){ return rngFn(); }

const QUEST_POOL = [
  {id:'magnet3', text:'3 mıknatıs topla', check:s=>s.magnets>=3},
  {id:'gold2', text:'2 altın yıldız topla', check:s=>s.golds>=2},
  {id:'survive90', text:'Can kaybetmeden 90 saniye hayatta kal', check:(s,c)=>c.elapsedSec>=90 && s.hits===0},
  {id:'level3', text:'3. seviyeye ulaş', check:(s,c)=>c.level>=3},
  {id:'diamond1', text:'1 elmas topla', check:s=>s.diamonds>=1},
  {id:'coin5', text:'5 yıldız tozu parçası topla', check:s=>s.coinPickups>=5},
];
function ensureTodayQuest(){
  const t=todayStr();
  if(stats.questDate!==t){
    stats.questDate=t; stats.questId=QUEST_POOL[dateSeed()%QUEST_POOL.length].id; stats.questDone=false; saveStats();
  }
}
function currentQuest(){ return QUEST_POOL.find(q=>q.id===stats.questId)||QUEST_POOL[0]; }

const ACHIEVEMENTS = [
  {id:'first', icon:'🌟', name:'İlk Adım', desc:'İlk oyununu tamamla', reward:50, check:(s)=>s.games>=1},
  {id:'hundred', icon:'💯', name:'Yüzler Kulübü', desc:'Tek oyunda 100+ puan yap', reward:80, check:(s,c)=>c.runScore>=100},
  {id:'lvl5', icon:'🚀', name:'Hızlı Başlangıç', desc:'5. seviyeye ulaş', reward:100, check:(s,c)=>c.level>=5},
  {id:'shield', icon:'🛡️', name:'Zırhlı', desc:'Kalkanla bir çarpışmayı savuştur', reward:80, check:(s,c)=>c.session.shieldSaved},
  {id:'magnetmaster', icon:'🧲', name:'Mıknatıs Ustası', desc:'Toplam 10 mıknatıs topla', reward:120, check:(s)=>s.magnets>=10},
  {id:'diamondhunter', icon:'💎', name:'Elmas Avcısı', desc:'Toplam 5 elmas topla', reward:150, check:(s)=>s.diamonds>=5},
  {id:'combo15', icon:'🔥', name:'Kombo Kralı', desc:'Tek oyunda 15 combo yap', reward:120, check:(s,c)=>c.session.streakMax>=15},
  {id:'zenmaster', icon:'🌙', name:'Zen Ustası', desc:'Zen modda 2 dakika oyna', reward:100, check:(s,c)=>c.mode==='zen' && c.elapsedSec>=120},
  {id:'dailyexplorer', icon:'📅', name:'Günlük Kaşif', desc:'Bir günlük mücadeleyi tamamla', reward:100, check:(s)=>s.dailyCount>=1},
  {id:'legend', icon:'🏆', name:'Efsane', desc:'En iyi skorun 500+ olsun', reward:300, check:(s)=>s.best>=500},
  {id:'richling', icon:'💰', name:'Yıldız Tozu Zengini', desc:'Toplamda 1000 yıldız tozu biriktir', reward:150, check:(s)=>s.lifetimeStardust>=1000},
  {id:'collector', icon:'🎨', name:'Koleksiyoncu', desc:'5 kozmetik eşya satın al', reward:200, check:(s)=>Object.values(s.owned).reduce((n,arr)=>n+arr.length,0)>=5},
];
function checkAchievements(c){
  const newly=[];
  for(const a of ACHIEVEMENTS){
    if(stats.unlocked.includes(a.id)) continue;
    if(a.check(stats,c)){ stats.unlocked.push(a.id); addStardust(a.reward); newly.push(a); }
  }
  if(newly.length){ saveStats(); newly.forEach(a=>queueToast(a.icon+' Başarı: '+a.name+'  +'+a.reward+' 🪙')); }
}
function addStardust(n){
  stats.stardust += n; stats.lifetimeStardust = (stats.lifetimeStardust||0) + n;
  refreshWallet();
}

const REWARD_AD_COINS = 25, DAILY_AD_REWARD_CAP = 10;
function adRewardsLeftToday(){
  const t=todayStr();
  if(stats.adRewardsDate!==t){ stats.adRewardsDate=t; stats.adRewardsToday=0; }
  return Math.max(0, DAILY_AD_REWARD_CAP - (stats.adRewardsToday||0));
}
function watchAdForCoins(){
  if(adRewardsLeftToday()<=0){ queueToast('🎬 Bugünlük reklam hakkın doldu, yarın tekrar gel!'); beep(200,0.1,'square',0.1); return; }
  Ads.showRewarded(()=>{
    stats.adRewardsToday=(stats.adRewardsToday||0)+1;
    addStardust(REWARD_AD_COINS); saveStats();
    queueToast('🎬 Reklam izlendi: +'+REWARD_AD_COINS+' 🪙');
    beep(700,0.1,'sine',0.13); beep(1000,0.1,'triangle',0.12);
  }, ()=>{});
}
