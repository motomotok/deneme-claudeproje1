// Ayarlar / mağaza / istatistik ekranlarının DOM render'ı ve satın alma
// mantığı. Oyun fiziğine dokunmaz, sadece data.js'deki kataloglar ile
// #screen-* elemanlarını senkronize eder.
const MODE_LABEL = {classic:'Klasik', time:'Zaman', zen:'Zen', daily:'Günlük'};
function syncSettings(){
  document.getElementById('soundSw').classList.toggle('on', cfg.sound);
  document.getElementById('bigSw').classList.toggle('on', cfg.bigButtons);
  document.getElementById('handSw').classList.toggle('on', cfg.leftHand);
  document.getElementById('cbSw').classList.toggle('on', cfg.colorblind);
  renderThemeGrid();
  document.querySelectorAll('.theme').forEach(el=>el.classList.toggle('sel', el.dataset.key===cfg.theme));
  renderSkins();
  syncPremiumUI();
  syncPlayGamesUI();
}
function syncPlayGamesUI(){
  const card=document.getElementById('playGamesCard');
  const txt=document.getElementById('playGamesStatusText');
  const btn=document.getElementById('playGamesBtn');
  const row=document.getElementById('acctRow');
  if(!card || !btn) return;
  if(!window.PlayGames || !PlayGames.isNative()){
    card.style.display='none';
    if(row) row.classList.add('single');
    return;
  }
  card.style.display='flex';
  if(row) row.classList.remove('single');
  if(PlayGames.signedIn){ txt.textContent='✅ Bağlandın!'; btn.textContent='Skor Tablosu'; }
  else { txt.textContent='🏆 Play Games'; btn.textContent='Bağlan'; }
}
function syncPremiumUI(price){
  const txt=document.getElementById('premiumStatusText');
  const btn=document.getElementById('premiumBuyBtn');
  if(!txt || !btn) return;
  if(stats.premiumNoAds){
    txt.textContent='✅ Premium aktif!';
    btn.style.display='none';
  } else {
    txt.textContent='💎 Reklamsız Premium';
    btn.style.display='inline-block';
    btn.textContent=price || (window.Premium ? Premium.FALLBACK_PRICE_TEXT : '49 TL');
  }
}
function showLegalPopup(){ document.getElementById('infoPopupOverlay').style.display='flex'; beep(500,0.05,'sine',0.08); }
function hideLegalPopup(){ document.getElementById('infoPopupOverlay').style.display='none'; }

let statsTab='ach';
function renderStatsTab(){
  document.querySelectorAll('#statsTabs .stab').forEach(t=>t.classList.toggle('sel', t.dataset.statTab===statsTab));
  document.getElementById('achCard').style.display = statsTab==='ach' ? 'block' : 'none';
  document.getElementById('lbCard').style.display = statsTab==='lb' ? 'block' : 'none';
  document.getElementById('leagueCard').style.display = statsTab==='league' ? 'block' : 'none';
}
function syncStats(){
  document.getElementById('stBest').textContent=stats.best;
  document.getElementById('stStars').textContent=stats.stars;
  document.getElementById('stGames').textContent=stats.games;
  document.getElementById('stLevel').textContent=stats.maxLevel;
  renderAchievements();
  renderLeaderboard();
  renderRivalLeague();
  renderStatsTab();
}
function renderRivalLeague(){
  const el=document.getElementById('leagueList'); if(!el) return;
  ensureRivalLeague();
  el.innerHTML = stats.rivalLeague.map(r=>{
    const beaten = stats.best>=r.score;
    return `<div class="row" style="${beaten?'opacity:.55':''}">
      <span class="k">${beaten?'✅':'🎯'} ${turkishAccusative(r.name)} geç</span>
      <span class="v">${r.score}</span>
    </div>`;
  }).join('');
}
function renderSkins(){
  const grid=document.getElementById('skinGrid'); grid.innerHTML='';
  SKINS.forEach(sk=>{
    const unlocked=isUnlockedItem('skins', sk);
    const d=document.createElement('div');
    d.className='skinDot'+(cfg.skin===sk.id?' sel':'')+(unlocked?'':' locked');
    d.style.background = sk.rainbow ? 'conic-gradient(from 0deg,#ff5e5e,#ffd24a,#5efc82,#54e0ff,#a97bff,#ff5e5e)' : sk.color;
    d.title=sk.name;
    d.addEventListener('click', ()=>onShopCardClick('skins', sk));
    grid.appendChild(d);
  });
}
function renderAchievements(){
  const grid=document.getElementById('achGrid'); grid.innerHTML='';
  let count=0;
  ACHIEVEMENTS.forEach(a=>{
    const unlocked=stats.unlocked.includes(a.id); if(unlocked) count++;
    const d=document.createElement('div');
    d.className='achItem'+(unlocked?' unlocked':'');
    d.title=a.desc;
    d.innerHTML=`<div class="ic">${a.icon}</div><div>${a.name}</div>`;
    grid.appendChild(d);
  });
  document.getElementById('achCount').textContent=count;
}
function renderLeaderboard(){
  const el=document.getElementById('lbList');
  if(!stats.leaderboard.length){ el.innerHTML='<div class="row"><span class="k">Henüz kayıt yok</span></div>'; return; }
  el.innerHTML = stats.leaderboard.map(e=>`<div class="row"><span class="k">${e.date} · ${MODE_LABEL[e.mode]||e.mode}</span><span class="v">${e.score}</span></div>`).join('');
}
function refreshDailyStatus(){
  const t=todayStr();
  const done = stats.dailyDate===t && stats.dailyDone;
  document.getElementById('dailyStatus').textContent = done ? ('Bugün oynadın · Skor: '+stats.dailyScore) : 'Herkes aynı düzen, tek deneme';
}

function refreshWallet(){
  const v = stats.stardust||0;
  ['walletHud','shopWallet','menuWallet'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.textContent=v;
  });
}

function getEquipped(category){
  if(category==='themes') return cfg.theme;
  if(category==='skins') return cfg.skin;
  if(category==='trails') return cfg.trail;
  if(category==='suns') return cfg.sun;
  if(category==='rings') return cfg.ringStyle;
}
function setEquipped(category, id){
  if(category==='themes'){ applyTheme(id); return; }
  if(category==='skins') cfg.skin=id;
  else if(category==='trails') cfg.trail=id;
  else if(category==='suns') cfg.sun=id;
  else if(category==='rings') cfg.ringStyle=id;
  saveCfg();
}
function purchase(category, item){
  if(item.gate.type!=='coin') return false;
  const price = effectivePrice(category, item);
  if(stats.stardust < price){
    queueToast('🪙 Yetersiz Yıldız Tozu — '+(price-stats.stardust)+' eksik');
    beep(200,0.12,'square',0.1); return false;
  }
  stats.stardust -= price;
  stats.owned[category].push(item.id);
  saveStats(); refreshWallet();
  queueToast('✅ '+item.name+' satın alındı!');
  beep(700,0.1,'sine',0.13); beep(1000,0.1,'triangle',0.12);
  return true;
}
function renderDealBanner(){
  const el=document.getElementById('dealBanner'); if(!el) return;
  const deal=activeDeal();
  el.textContent = deal ? ('🔥 Günün Fırsatı: '+deal.item.name+' %'+Math.round(DEAL_DISCOUNT*100)+' indirimli!') : '';
}

let pendingPurchase = null;
function showPurchaseConfirm(icon, name, price, onYes){
  pendingPurchase = onYes;
  document.getElementById('pcIcon').textContent = icon;
  document.getElementById('pcName').textContent = name;
  document.getElementById('pcPrice').textContent = '🪙 '+price;
  document.getElementById('purchaseConfirmOverlay').style.display = 'flex';
  beep(500,0.05,'sine',0.08);
}
function hidePurchaseConfirm(){
  document.getElementById('purchaseConfirmOverlay').style.display = 'none';
  pendingPurchase = null;
}

function onShopCardClick(category, item){
  const unlocked = isUnlockedItem(category, item);
  if(!unlocked){
    if(item.gate.type==='coin'){
      showPurchaseConfirm('🎨', item.name, effectivePrice(category,item), ()=>{
        if(purchase(category,item)) setEquipped(category, item.id);
        renderSkins(); renderThemeGrid(); syncShopIfOpen();
      });
    } else if(item.gate.type==='seasonpass'){
      queueToast('🔒 '+item.name+' — Sezon Bileti\'nin son kademesinden açılır.');
      beep(200,0.1,'square',0.1);
    } else {
      const ach=ACHIEVEMENTS.find(a=>a.id===item.gate.id);
      queueToast('🔒 '+item.name+' kilitli: '+(ach?ach.desc:''));
      beep(200,0.1,'square',0.1);
    }
  } else {
    setEquipped(category, item.id);
    beep(600,0.06,'sine',0.1);
    renderSkins(); renderThemeGrid(); syncShopIfOpen();
  }
}
function syncShopIfOpen(){ if(state==='shop') renderShopTab(); }

let shopTab='themes';
function shopItemsFor(cat){
  if(cat==='themes') return Object.keys(THEMES).map(k=>Object.assign({id:k}, THEMES[k]));
  if(cat==='skins') return SKINS;
  if(cat==='trails') return TRAILS;
  if(cat==='suns') return SUNS;
  if(cat==='rings') return RINGSTYLES;
  return [];
}
function swatchHtml(category, item){
  if(category==='themes'){
    return `<div class="swatch" style="justify-content:center">${['star','gold','peril','player'].map(k=>`<span style="background:${item[k]}"></span>`).join('')}</div>`;
  }
  if(category==='skins'){
    const bg = item.rainbow ? 'conic-gradient(from 0deg,#ff5e5e,#ffd24a,#5efc82,#54e0ff,#a97bff,#ff5e5e)' : item.color;
    return `<div class="skinPreview" style="background:${bg}"></div>`;
  }
  if(category==='trails'){
    return `<div class="trailPreview">${[0,1,2,3,4].map(i=>`<i style="${trailDotStyle(item.id,i)}"></i>`).join('')}</div>`;
  }
  if(category==='suns') return `<div class="sunPreview ${item.id}"></div>`;
  if(category==='rings') return `<div class="ringPreview ${item.id}"></div>`;
  return '';
}
function trailDotStyle(id,i){
  const op=1-i*0.16;
  if(id==='pixel') return `background:var(--accent-2,#a97bff);opacity:${op};border-radius:2px;width:${9-i}px;height:${9-i}px;`;
  if(id==='rainbow') return `background:hsl(${i*60},85%,65%);opacity:${op};border-radius:50%;width:${9-i}px;height:${9-i}px;`;
  if(id==='sparkle') return `background:#fff;opacity:${op*(i%2?0.5:1)};border-radius:50%;width:${6+((i*7)%5)}px;height:${6+((i*7)%5)}px;`;
  if(id==='comet') return `background:linear-gradient(90deg,var(--accent-2,#a97bff),transparent);opacity:${op};width:${16-i*2}px;height:6px;border-radius:4px;`;
  if(id==='ribbon') return `background:var(--accent-2,#a97bff);opacity:${op};border-radius:50%;width:${8-i}px;height:${8-i}px;transform:translateY(${(i%2?4:-4)}px);`;
  if(id==='quantum') return `background:${i%2?'#7fe8ff':'var(--accent-2,#a97bff)'};opacity:${op};border-radius:50%;width:${9-i}px;height:${9-i}px;`;
  if(id==='phantom') return `background:#eaf2ff;opacity:${op*0.5};border-radius:50%;width:${10-i}px;height:${10-i}px;`;
  return `background:var(--accent-2,#a97bff);opacity:${op};border-radius:50%;width:${9-i}px;height:${9-i}px;`;
}
function renderShopGrid(category){
  const grid=document.getElementById('shopGrid'); grid.innerHTML='';
  shopItemsFor(category).forEach(item=>{
    const unlocked=isUnlockedItem(category,item);
    const equipped=getEquipped(category)===item.id;
    const card=document.createElement('div');
    card.className='shopCard'+(equipped?' equipped':'')+(!unlocked?' locked':'');
    let priceHtml;
    if(!unlocked && item.gate.type==='coin'){
      const isDeal = category===stats.dealCategory && item.id===stats.dealId;
      priceHtml = isDeal
        ? `<div class="price">🔥 <s style="opacity:.6">${item.gate.price}</s> 🪙 ${effectivePrice(category,item)}</div>`
        : `<div class="price">🪙 ${item.gate.price}</div>`;
    }
    else if(!unlocked && item.gate.type==='achievement'){
      const ach=ACHIEVEMENTS.find(a=>a.id===item.gate.id);
      priceHtml=`<div class="price lockreq">🔒 ${ach?ach.name:''}</div>`;
    } else if(!unlocked && item.gate.type==='seasonpass'){
      priceHtml=`<div class="price lockreq">🎫 Sezon Ödülü</div>`;
    } else if(equipped) priceHtml=`<div class="price ok">✓ Takılı</div>`;
    else priceHtml=`<div class="price ok">Sahip</div>`;
    card.innerHTML = swatchHtml(category,item)+`<div class="cn">${item.name}</div>`+priceHtml;
    card.addEventListener('click', ()=>onShopCardClick(category,item));
    grid.appendChild(card);
  });
}
function renderBoostsShop(){
  const grid=document.getElementById('shopGrid'); grid.innerHTML='';
  BOOSTS.forEach(b=>{
    const owned=stats.boosts[b.id]||0;
    const card=document.createElement('div'); card.className='shopCard boostCard';
    card.innerHTML = `<div class="boostIcon">${b.icon}</div><div class="cn">${b.name}</div><div class="bdesc">${b.desc}</div><div class="price">🪙 ${b.price}</div><div class="ownedTag">Envanter: ${owned}</div>`;
    card.addEventListener('click', ()=>{
      if(stats.stardust<b.price){ queueToast('🪙 Yetersiz Yıldız Tozu'); beep(200,0.1,'square',0.1); return; }
      showPurchaseConfirm(b.icon, b.name, b.price, ()=>{
        stats.stardust-=b.price; stats.boosts[b.id]=(stats.boosts[b.id]||0)+1; saveStats(); refreshWallet();
        queueToast('✅ '+b.name+' envantere eklendi'); beep(700,0.1,'sine',0.13); beep(1000,0.1,'triangle',0.12);
        renderBoostsShop();
      });
    });
    grid.appendChild(card);
  });
}
function renderShopTab(){
  document.querySelectorAll('.stab').forEach(t2=>t2.classList.toggle('sel', t2.dataset.tab===shopTab));
  if(shopTab==='boosts') renderBoostsShop(); else renderShopGrid(shopTab);
}
function renderBoostRow(){
  const row=document.getElementById('boostRow'); if(!row) return;
  row.innerHTML='';
  const noneChip=document.createElement('div');
  noneChip.className='diffChip'+(!pendingBoost?' sel':'');
  noneChip.textContent='Yok';
  noneChip.addEventListener('click', ()=>{ pendingBoost=null; renderBoostRow(); beep(400,0.05,'sine',0.08); });
  row.appendChild(noneChip);
  BOOSTS.forEach(b=>{
    const owned=stats.boosts[b.id]||0;
    if(owned<=0) return;
    const chip=document.createElement('div');
    chip.className='diffChip'+(pendingBoost===b.id?' sel':'');
    chip.textContent=b.icon+' '+b.name+' ×'+owned;
    chip.addEventListener('click', ()=>{ pendingBoost=b.id; renderBoostRow(); beep(400,0.05,'sine',0.08); });
    row.appendChild(chip);
  });
}

async function shareScore(){
  const text=`Neon Yörünge'de ${score} puan yaptım! 🌌`;
  if(navigator.share){
    try{ await navigator.share({title:'Neon Yörünge', text, url:location.href}); }catch(e){}
  } else if(navigator.clipboard){
    try{ await navigator.clipboard.writeText(text+' '+location.href); queueToast('📋 Panoya kopyalandı'); }catch(e){ queueToast('Kopyalanamadı'); }
  } else queueToast('Paylaşım desteklenmiyor');
}

function renderThemeGrid(){
  const grid=document.getElementById('themeGrid'); grid.innerHTML='';
  Object.keys(THEMES).forEach(key=>{
    const t=THEMES[key];
    const item = Object.assign({id:key}, t);
    const unlocked = isUnlockedItem('themes', item);
    const d=document.createElement('div'); d.className='theme'+(!unlocked?' locked':''); d.dataset.key=key;
    const themeIsDeal = !unlocked && stats.dealCategory==='themes' && stats.dealId===key;
    const priceTag = !unlocked
      ? (themeIsDeal
        ? `<div class="price" style="font-size:10.5px;color:#ffd28a;margin-top:2px">🔥 <s style="opacity:.6">${t.gate.price}</s> 🪙 ${effectivePrice('themes',item)}</div>`
        : `<div class="price" style="font-size:10.5px;color:#ffd28a;margin-top:2px">🪙 ${t.gate.price}</div>`)
      : '';
    d.innerHTML=`<div class="swatch"><span style="background:${t.star}"></span><span style="background:${t.gold}"></span><span style="background:${t.peril}"></span><span style="background:${t.player}"></span></div><div class="tn">${t.name}</div>${priceTag}`;
    d.addEventListener('click', ()=>onShopCardClick('themes', item));
    grid.appendChild(d);
  });
}
