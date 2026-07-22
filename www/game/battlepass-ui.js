// Sezon Bileti (Battle-Pass) ekranının DOM render'ı — ilerleme çubuğu,
// kademe listesi (ücretsiz/ücretli claim butonları) ve Sezon Bileti IAP
// durum senkronizasyonu. Veri modeli data.js'de (ensureSeason, SEASON_TIERS,
// claimSeasonTier).
function syncSeasonPassUI(price){
  const txt=document.getElementById('seasonPassStatusText');
  const btn=document.getElementById('seasonPassBuyBtn');
  if(!txt || !btn) return;
  if(stats.seasonPremium){
    txt.textContent='✅ Sezon Bileti aktif — bu ay premium ödülleri alabilirsin!';
    btn.style.display='none';
  } else {
    txt.textContent='🎫 Premium çizgi ile daha büyük ödüller';
    btn.style.display='inline-block';
    btn.textContent='🎫 Sezon Bileti — '+(price || (window.SeasonPass ? SeasonPass.FALLBACK_PRICE_TEXT : '29 TL'));
  }
}

function renderBattlepass(){
  ensureSeason();
  document.getElementById('seasonXpLine').textContent = stats.seasonXp+' XP · '+stats.seasonKey;
  syncSeasonPassUI();
  const wrap=document.getElementById('battlepassTiers'); wrap.innerHTML='';
  SEASON_TIERS.forEach((tier,i)=>{
    const reached = stats.seasonXp >= tier.xp;
    const freeClaimed = stats.seasonClaimedFree.includes(i);
    const premClaimed = stats.seasonClaimedPremium.includes(i);
    const row=document.createElement('div');
    row.className='card';
    row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;padding:10px 14px;';
    const label=document.createElement('div');
    label.innerHTML=`<b>Kademe ${i+1}</b><div class="muted" style="margin:0">${tier.xp} XP</div>`;
    row.appendChild(label);

    const freeBtn=document.createElement('button');
    freeBtn.className='btn alt small';
    if(freeClaimed){ freeBtn.textContent='✅ '+tier.free+' 🪙'; freeBtn.disabled=true; }
    else if(reached){ freeBtn.textContent='🎁 '+tier.free+' 🪙'; freeBtn.addEventListener('click', ()=>{ if(claimSeasonTier(i,'free')) renderBattlepass(); }); }
    else { freeBtn.textContent='🔒 '+tier.free+' 🪙'; freeBtn.disabled=true; }
    row.appendChild(freeBtn);

    const premBtn=document.createElement('button');
    premBtn.className='btn small';
    const premLabel = tier.premiumCosmetic ? ('+'+tier.premium+' 🪙 🎨') : ('+'+tier.premium+' 🪙');
    if(!stats.seasonPremium){ premBtn.textContent='🎫 '+premLabel; premBtn.disabled=true; }
    else if(premClaimed){ premBtn.textContent='✅ '+premLabel; premBtn.disabled=true; }
    else if(reached){ premBtn.textContent='🎁 '+premLabel; premBtn.addEventListener('click', ()=>{ if(claimSeasonTier(i,'premium')) renderBattlepass(); }); }
    else { premBtn.textContent='🔒 '+premLabel; premBtn.disabled=true; }
    row.appendChild(premBtn);

    wrap.appendChild(row);
  });
}
