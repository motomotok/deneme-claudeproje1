// Oyun verisi: temalar, kozmetikler, mağaza kilitleri, ayarlar/istatistik
// kalıcılığı (localStorage), zorluk tabloları, seed'li RNG, günlük görevler,
// başarımlar ve yıldız tozu (coin) ekonomisi.
const THEMES = {
  neon:      {name:'Neon',       star:'#54e0ff', gold:'#ffd24a', peril:'#ff4d6d', player:'#a97bff', sun:'#8ad8ff', bg0:'#05060f', bg1:'#0b0f2a', sf:'#9fb8ff', gate:{type:'free'}},
  sunset:    {name:'Gün Batımı', star:'#ff9e64', gold:'#ffd93d', peril:'#ff2e63', player:'#ff6bd6', sun:'#ffb37b', bg0:'#160a14', bg1:'#2a0f24', sf:'#ffd0b0', gate:{type:'free'}},
  matrix:    {name:'Matrix',     star:'#39ff14', gold:'#c6ff3b', peril:'#ff0055', player:'#00ffc3', sun:'#7dffb0', bg0:'#020a05', bg1:'#03160b', sf:'#7dff9f', gate:{type:'free'}},
  ice:       {name:'Buz',        star:'#7fdbff', gold:'#eaf9ff', peril:'#ff5e78', player:'#4fc3ff', sun:'#bdecff', bg0:'#05101a', bg1:'#0a2033', sf:'#bfe6ff', gate:{type:'free'}},
  vaporwave: {name:'Vaporwave',  star:'#ff6ec7', gold:'#7afcff', peril:'#ff2f6e', player:'#8a5fff', sun:'#ff9ee8', bg0:'#0f0620', bg1:'#1d0a3a', sf:'#c9a8ff', gate:{type:'coin', price:4000}},
  gilded:    {name:'Altın Çağ',  star:'#ffe08a', gold:'#fff4c2', peril:'#ff5a3c', player:'#ffd24a', sun:'#fff6da', bg0:'#120d02', bg1:'#241a05', sf:'#ffe9a8', gate:{type:'coin', price:4000}},
  void:      {name:'Kara Madde', star:'#c9c9ff', gold:'#8f8fff', peril:'#ff3d6b', player:'#4a3fff', sun:'#e0e0ff', bg0:'#020204', bg1:'#08060f', sf:'#8888aa', gate:{type:'coin', price:5000}},
  inferno:   {name:'İnferno',    star:'#ffb454', gold:'#ffe08a', peril:'#ff2e2e', player:'#ff5a1f', sun:'#ffcf8a', bg0:'#170502', bg1:'#2c0a03', sf:'#ffb27a', gate:{type:'coin', price:7000}},
  celestial: {name:'Semavi',     star:'#7fffd4', gold:'#ffe9a8', peril:'#ff4d8a', player:'#2fe6c4', sun:'#bff7ea', bg0:'#01100e', bg1:'#03201b', sf:'#8ff5da', gate:{type:'coin', price:7500}},
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
  {id:'ember',   name:'Kor Orb',    color:'#ff8a3d', gate:{type:'coin', price:2500}},
  {id:'frost',   name:'Buz Orb',    color:'#bfe8ff', gate:{type:'coin', price:2500}},
  {id:'toxic',   name:'Toksik Orb', color:'#baff3d', gate:{type:'coin', price:3500}},
  {id:'obsidian',name:'Obsidyen Orb', color:'#7d6fae', gate:{type:'coin', price:3500}},
  {id:'prism',   name:'Prizma Orb', color:'#ffffff', gate:{type:'coin', price:6500}, rainbow:true},
  {id:'plasma',    name:'Plazma Orb',   color:'#ff5ec4', gate:{type:'coin', price:7000}},
  {id:'starlight', name:'Yıldız Işığı Orb', color:'#eaf2ff', gate:{type:'coin', price:8000}},
  {id:'shadow',    name:'Gölge Orb',    color:'#3a2f55', gate:{type:'coin', price:9000}},
  {id:'season1_orb', name:'1. Sezon Orbu', color:'#54e0ff', gate:{type:'seasonpass', season:1}, rainbow:true},
  {id:'season2_orb', name:'2. Sezon Orbu', color:'#ff8a3d', gate:{type:'seasonpass', season:2}, rainbow:true},
];
function playerColor(){
  const sk=SKINS.find(s=>s.id===cfg.skin)||SKINS[0];
  if(!isUnlockedItem('skins', sk)) return SKINS[0].color;
  if(sk.rainbow) return `hsl(${(performance.now()*0.06)%360},85%,68%)`;
  return sk.color;
}

const TRAILS = [
  {id:'classic', name:'Klasik',        gate:{type:'free'}},
  {id:'sparkle', name:'Kıvılcım',      gate:{type:'coin', price:2000}},
  {id:'comet',   name:'Kuyruklu Yıldız', gate:{type:'coin', price:3000}},
  {id:'rainbow', name:'Gökkuşağı',     gate:{type:'coin', price:4500}},
  {id:'pixel',   name:'Piksel',        gate:{type:'coin', price:2600}},
  {id:'ribbon',  name:'Kurdele',       gate:{type:'coin', price:3200}},
  {id:'quantum', name:'Kuantum',       gate:{type:'coin', price:5000}},
  {id:'phantom', name:'Hayalet İz',    gate:{type:'coin', price:5500}},
  {id:'season1_trail', name:'1. Sezon İzi', gate:{type:'seasonpass', season:1}},
  {id:'season2_trail', name:'2. Sezon İzi', gate:{type:'seasonpass', season:2}},
];
const SUNS = [
  {id:'classic',   name:'Klasik Yıldız',  gate:{type:'free'}},
  {id:'redgiant',  name:'Kızıl Dev',      gate:{type:'coin', price:2500}},
  {id:'blackhole', name:'Kara Delik',     gate:{type:'coin', price:5500}},
  {id:'nebula',    name:'Nebula',         gate:{type:'coin', price:3500}},
  {id:'crystal',   name:'Kristal Çekirdek', gate:{type:'coin', price:3500}},
  {id:'quasar',    name:'Kuasar',         gate:{type:'coin', price:6000}},
  {id:'supernova', name:'Süpernova',      gate:{type:'coin', price:6500}},
];
const RINGSTYLES = [
  {id:'classic', name:'Klasik',     gate:{type:'free'}},
  {id:'dotted',  name:'Noktalı',    gate:{type:'coin', price:1600}},
  {id:'glow',    name:'Parlak',     gate:{type:'coin', price:3000}},
  {id:'double',  name:'Çift Çizgi', gate:{type:'coin', price:2600}},
  {id:'pulse',   name:'Nabız',      gate:{type:'coin', price:3500}},
  {id:'circuit', name:'Devre',      gate:{type:'coin', price:4000}},
  {id:'season1_ring', name:'1. Sezon Çemberi', gate:{type:'seasonpass', season:1}},
  {id:'season2_ring', name:'2. Sezon Çemberi', gate:{type:'seasonpass', season:2}},
];
const BOOSTS = [
  {id:'shieldstart', name:'Kalkanla Başla', desc:'Oyuna kalkan aktifken başlarsın', icon:'shield', price:1300},
  {id:'slowstart',   name:'Yavaş Açılış',   desc:'İlk saniyelerde orb yavaş döner', icon:'hourglass', price:1000},
  {id:'luckystart',  name:'Şanslı Açılış',  desc:'İlk 3 tehlikeli an güvenliye çevrilir', icon:'clover', price:1100},
  {id:'coinrush',    name:'Toz Rüzgarı',    desc:'Bu oyunda kazanılan yıldız tozu %50 fazla', icon:'sparkle', price:1600},
];

function isUnlockedItem(category, item){
  if(item.gate.type==='free') return true;
  if(item.gate.type==='achievement') return stats.unlocked.includes(item.gate.id);
  if(item.gate.type==='coin') return stats.owned[category].includes(item.id);
  if(item.gate.type==='seasonpass') return stats.owned[category].includes(item.id);
  return false;
}

const DEAL_DISCOUNT = 0.3;
const DEAL_CATEGORIES = {
  themes: ()=>Object.keys(THEMES).map(k=>Object.assign({id:k}, THEMES[k])),
  skins: ()=>SKINS, trails: ()=>TRAILS, suns: ()=>SUNS, rings: ()=>RINGSTYLES,
};
// Her gün tarih-seed'li RNG ile kozmetik kataloglardan bir öğe seçip
// %30 indirim uygular ("Günün Fırsatı"). goShop() her açılışta çağırır,
// stats.dealDate bugünse no-op olduğu için güvenle tekrar çağrılabilir.
function ensureDailyDeal(){
  const t = todayStr();
  if(stats.dealDate===t) return;
  const candidates=[];
  for(const cat in DEAL_CATEGORIES){
    DEAL_CATEGORIES[cat]().forEach(item=>{
      if(item.gate.type==='coin' && !isUnlockedItem(cat,item)) candidates.push({cat, id:item.id});
    });
  }
  stats.dealDate = t;
  if(candidates.length){
    const pick = candidates[Math.floor(mulberry32(dateSeed())()*candidates.length)];
    stats.dealCategory = pick.cat; stats.dealId = pick.id;
  } else { stats.dealCategory=''; stats.dealId=''; }
  saveStats();
}
function activeDeal(){
  if(!stats.dealCategory || !stats.dealId) return null;
  const item = (DEAL_CATEGORIES[stats.dealCategory]?DEAL_CATEGORIES[stats.dealCategory]():[]).find(i=>i.id===stats.dealId);
  return item ? {category:stats.dealCategory, item} : null;
}
function effectivePrice(category, item){
  if(category===stats.dealCategory && item.id===stats.dealId) return Math.round(item.gate.price*(1-DEAL_DISCOUNT));
  return item.gate.price;
}

let cfg = load('neonYorungeCfg', {sound:true, theme:'neon', skin:'default', trail:'classic', sun:'classic', ringStyle:'classic', bigButtons:false, leftHand:false, colorblind:false});
let stats = load('neonYorungeStats', {
  best:0, stars:0, games:0, maxLevel:1, magnets:0, golds:0, diamonds:0,
  unlocked:[], leaderboard:[], dailyDate:'', dailyDone:false, dailyScore:0, dailyCount:0,
  questDate:'', questId:'', questDone:false,
  stardust:0, lifetimeStardust:0, owned:{themes:[], skins:[], trails:[], suns:[], rings:[]}, boosts:{},
  adRewardsDate:'', adRewardsToday:0,
  rivalName:'', rivalScore:0, premiumNoAds:false,
  lastSeenDate:'', loginStreak:0,
  dealDate:'', dealCategory:'', dealId:'',
  rivalLeague:[],
  seasonKey:'', seasonXp:0, seasonPremium:false,
  seasonClaimedFree:[], seasonClaimedPremium:[],
});
function load(k,def){ try{ return Object.assign({}, def, JSON.parse(localStorage.getItem(k)||'{}')); }catch(e){ return def; } }
function saveCfg(){ try{ localStorage.setItem('neonYorungeCfg', JSON.stringify(cfg)); }catch(e){} }
function saveStats(){ try{ localStorage.setItem('neonYorungeStats', JSON.stringify(stats)); }catch(e){} }

const DIFF = {
  easy:{label:'Kolay', lives:4, hazBase:0.05, hazRamp:0.00025, hazCap:0.14, speedRamp:0.0007, speedCap:2.0, scoreMult:0.8},
  normal:{label:'Normal', lives:3, hazBase:0.09, hazRamp:0.00045, hazCap:0.22, speedRamp:0.0011, speedCap:2.4, scoreMult:1.0},
  hard:{label:'Zor', lives:2, hazBase:0.14, hazRamp:0.0008, hazCap:0.34, speedRamp:0.0016, speedCap:2.9, scoreMult:1.35},
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
function daysBetweenStr(a,b){
  const da=new Date(a+'T00:00:00'), db=new Date(b+'T00:00:00');
  return Math.round((db-da)/86400000);
}
function weekendMult(){ return [5,6,0].includes(new Date().getDay()) ? 1.2 : 1; }
let rngFn = Math.random;
function rnd(){ return rngFn(); }

// "Rakip" hedef sistemi — gerçek arkadaş verisi yok (backend/sosyal giriş
// yok), bu yüzden Subway Surfers'ın "arkadaşını geç" bannerındaki hissi
// rastgele bir isim + mantıklı bir hedef puanla simüle ediyoruz.
const RIVAL_NAMES = [
  'Ahmet','Mehmet','Ayşe','Fatma','Zeynep','Emre','Deniz','Can','Elif','Burak',
  'Ece','Kerem','Selin','Onur','Yusuf','Merve','Berk','Cem','Gizem','Umut',
  'İrem','Kaan','Aslı','Barış','Nazlı','Serkan','Buse','Tolga','Pınar','Volkan',
];
// Türkçe belirtme hâli (accusative) eki: son ünlüye göre ı/i/u/ü seçilir,
// isim ünlüyle bitiyorsa araya kaynaştırma "y" harfi girer (Tolga'yı,
// Ahmet'i, Onur'u gibi) — sabit bir "'i" eki yanlış isimlerde yanlış olurdu.
function turkishAccusative(name){
  const vowels='aeıioöuü';
  const lower=name.toLocaleLowerCase('tr-TR');
  let lastVowel=null;
  for(let i=lower.length-1;i>=0;i--){ if(vowels.includes(lower[i])){ lastVowel=lower[i]; break; } }
  const sufMap={a:'ı', ı:'ı', e:'i', i:'i', o:'u', u:'u', ö:'ü', ü:'ü'};
  const suf=sufMap[lastVowel]||'ı';
  const endsInVowel=vowels.includes(lower[lower.length-1]);
  return name+"'"+(endsInVowel?'y':'')+suf;
}
function ensureRival(){
  if(stats.rivalScore>0 && stats.best<stats.rivalScore) return;
  let name;
  do{ name=RIVAL_NAMES[Math.floor(Math.random()*RIVAL_NAMES.length)]; }while(name===stats.rivalName && RIVAL_NAMES.length>1);
  let target;
  if(stats.best<=0) target = 300+Math.floor(Math.random()*400);
  else target = stats.best + Math.max(150, Math.round(stats.best*(0.15+Math.random()*0.15)));
  stats.rivalName=name; stats.rivalScore=target;
  saveStats();
}

// "Rakipler Ligi" — İstatistikler ekranında gösterilen 5 kademeli sabit
// hedef listesi (ensureRival'daki tekli banner'dan ayrı, geriye dönük
// tüm kademeleri aynı anda görebilmek için).
function ensureRivalLeague(){
  const league = stats.rivalLeague||[];
  const topScore = league.length ? league[league.length-1].score : 0;
  if(league.length>0 && stats.best<topScore) return;
  const usedNames = new Set();
  let base = stats.best>0 ? stats.best : 0;
  const fresh=[];
  for(let i=0;i<5;i++){
    let name;
    do{ name=RIVAL_NAMES[Math.floor(Math.random()*RIVAL_NAMES.length)]; }while(usedNames.has(name) && usedNames.size<RIVAL_NAMES.length);
    usedNames.add(name);
    if(base<=0) base = 300+Math.floor(Math.random()*400);
    else base += 150+Math.floor(Math.random()*150);
    fresh.push({name, score:base, beaten:false});
  }
  stats.rivalLeague = fresh;
  saveStats();
}

// Giriş serisi ödülleri: gün 1..7, 8. günden itibaren döngü tekrarlanır.
const LOGIN_STREAK_REWARDS = [20,30,40,60,80,100,150];

// Uygulama her açıldığında bir kez çağrılır: (1) günlerdir açılmadıysa
// "geri dönüş" bonusu verir, (2) art arda giriş serisini günceller ve
// ödülünü verir. `stats.lastSeenDate` bugünse fonksiyon no-op'tur, bu
// yüzden aynı gün içinde tekrar çağrılması güvenlidir.
function handleDailyReturn(){
  const t = todayStr();
  if(stats.lastSeenDate === t) return;
  const gap = stats.lastSeenDate ? daysBetweenStr(stats.lastSeenDate, t) : 0;
  if(gap>=3){
    const bonus = Math.min(300, gap*20);
    addStardust(bonus);
    queueToast('👋 Seni özledik! '+gap+' gündür yoktun — +'+bonus+' 🪙');
  }
  stats.loginStreak = (gap===1) ? (stats.loginStreak||0)+1 : 1;
  const day = Math.min(stats.loginStreak, LOGIN_STREAK_REWARDS.length);
  const reward = LOGIN_STREAK_REWARDS[day-1];
  addStardust(reward);
  queueToast('🔥 Giriş serisi '+stats.loginStreak+'. gün — +'+reward+' 🪙');
  stats.lastSeenDate = t;
  saveStats();
}

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
  {id:'first', icon:'star', name:'İlk Adım', desc:'İlk oyununu tamamla', reward:50, check:(s)=>s.games>=1},
  {id:'hundred', icon:'star', name:'Yüzler Kulübü', desc:'Tek oyunda 100+ puan yap', reward:80, check:(s,c)=>c.runScore>=100},
  {id:'lvl5', icon:'rocket', name:'Hızlı Başlangıç', desc:'5. seviyeye ulaş', reward:100, check:(s,c)=>c.level>=5},
  {id:'shield', icon:'shield', name:'Zırhlı', desc:'Kalkanla bir çarpışmayı savuştur', reward:80, check:(s,c)=>c.session.shieldSaved},
  {id:'magnetmaster', icon:'magnet', name:'Mıknatıs Ustası', desc:'Toplam 10 mıknatıs topla', reward:120, check:(s)=>s.magnets>=10},
  {id:'diamondhunter', icon:'gem', name:'Elmas Avcısı', desc:'Toplam 5 elmas topla', reward:150, check:(s)=>s.diamonds>=5},
  {id:'combo15', icon:'flame', name:'Kombo Kralı', desc:'Tek oyunda 15 combo yap', reward:120, check:(s,c)=>c.session.streakMax>=15},
  {id:'zenmaster', icon:'moon', name:'Zen Ustası', desc:'Zen modda 2 dakika oyna', reward:100, check:(s,c)=>c.mode==='zen' && c.elapsedSec>=120},
  {id:'dailyexplorer', icon:'calendar', name:'Günlük Kaşif', desc:'Bir günlük mücadeleyi tamamla', reward:100, check:(s)=>s.dailyCount>=1},
  {id:'legend', icon:'trophy', name:'Efsane', desc:'En iyi skorun 500+ olsun', reward:300, check:(s)=>s.best>=500},
  {id:'richling', icon:'coin', name:'Yıldız Tozu Zengini', desc:'Toplamda 1000 yıldız tozu biriktir', reward:150, check:(s)=>s.lifetimeStardust>=1000},
  {id:'collector', icon:'palette', name:'Koleksiyoncu', desc:'5 kozmetik eşya satın al', reward:200, check:(s)=>Object.values(s.owned).reduce((n,arr)=>n+arr.length,0)>=5},
];
function checkAchievements(c){
  const newly=[];
  for(const a of ACHIEVEMENTS){
    if(stats.unlocked.includes(a.id)) continue;
    if(a.check(stats,c)){ stats.unlocked.push(a.id); addStardust(a.reward); newly.push(a); }
  }
  if(newly.length){ saveStats(); newly.forEach(a=>queueToast(icon(a.icon)+' Başarı: '+a.name+'  +'+a.reward+' '+icon('coin'))); }
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

// Battle-Pass ("Sezon Bileti"): takvim ayına değil, belirli bir başlangıç
// tarihine ve sabit süreye (gün) bağlı bir sezon penceresi kullanır — böylece
// "bugünden itibaren 1 ay" gibi kesin bir aralık tanımlanabilir. Her sezonun
// kendine özel, YALNIZCA o sezonun Sezon Bileti ilerlemesinden açılan bir
// çember + iz + orb seti vardır (bkz. RINGSTYLES/TRAILS/SKINS'teki
// 'seasonN_*' girdileri) — mağazadan asla yıldız tozuyla satın alınamazlar.
// Sezon bitince ödülü almamış olanlar için o kozmetikler kalıcı olarak
// erişilemez hâle gelir (mağaza listesinden bile kalkar, bkz. shop-ui.js
// shopItemsFor); zaten sahip olanlarda ise kalıcı bir nadirlik/prestij
// eşyası olarak kalır. Son tanımlı sezon takvimde süresi dolsa bile aktif
// kalmaya devam eder — yeni bir sezon eklenene kadar "sonsuza kadar" sürer.
const SEASONS = [
  {id:1, name:'1. Sezon', start:'2026-07-22', days:30},
  {id:2, name:'2. Sezon', start:'2026-08-21', days:30},
];
function seasonDayIndex(startStr, d){
  const start = new Date(startStr+'T00:00:00');
  return Math.floor((d-start)/86400000);
}
function activeSeason(d){
  d = d || new Date();
  for(let i=0;i<SEASONS.length;i++){
    const s=SEASONS[i];
    const idx=seasonDayIndex(s.start, d);
    const isLast = i===SEASONS.length-1;
    if(idx>=0 && (isLast || idx<s.days)) return s;
  }
  return SEASONS[0];
}
const SEASON_TIERS = [
  {xp:80,   free:30,  premium:100},
  {xp:180,  free:40,  premium:100},
  {xp:300,  free:50,  premium:100},
  {xp:440,  free:60,  premium:100},
  {xp:600,  free:70,  premium:100},
  {xp:780,  free:90,  premium:100},
  {xp:980,  free:110, premium:100},
  {xp:1200, free:130, premium:100, cosmeticSlot:'rings'},
  {xp:1440, free:160, premium:100, cosmeticSlot:'trails'},
  {xp:1700, free:200, premium:100, cosmeticSlot:'skins'},
];
function ensureSeason(){
  const k = 'S'+activeSeason().id;
  if(stats.seasonKey!==k){
    stats.seasonKey=k; stats.seasonXp=0; stats.seasonPremium=false;
    stats.seasonClaimedFree=[]; stats.seasonClaimedPremium=[];
    saveStats();
  }
}
function seasonCosmeticFor(slot, season){
  season = season || activeSeason();
  const list = slot==='skins' ? SKINS : slot==='rings' ? RINGSTYLES : TRAILS;
  return list.find(it=>it.gate.type==='seasonpass' && it.gate.season===season.id);
}
function claimSeasonTier(index, track){
  const tier = SEASON_TIERS[index]; if(!tier) return false;
  if(stats.seasonXp < tier.xp) return false;
  if(track==='free'){
    if(stats.seasonClaimedFree.includes(index)) return false;
    addStardust(tier.free); stats.seasonClaimedFree.push(index);
  } else {
    if(!stats.seasonPremium) return false;
    if(stats.seasonClaimedPremium.includes(index)) return false;
    addStardust(tier.premium); stats.seasonClaimedPremium.push(index);
    if(tier.cosmeticSlot){
      const cosmetic = seasonCosmeticFor(tier.cosmeticSlot);
      if(cosmetic && !stats.owned[tier.cosmeticSlot].includes(cosmetic.id)) stats.owned[tier.cosmeticSlot].push(cosmetic.id);
    }
  }
  saveStats();
  queueToast('🎫 Sezon kademesi '+(index+1)+' alındı!');
  beep(700,0.1,'sine',0.13); beep(1000,0.1,'triangle',0.12);
  return true;
}
