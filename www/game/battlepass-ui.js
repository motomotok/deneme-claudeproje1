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
    const tile=document.createElement('div');
    tile.className='bpTile';
    tile.innerHTML=`<div class="bpTier">Kademe ${i+1}</div><div class="bpXp">${tier.xp} XP</div>`;

    const freeBtn=document.createElement('button');
    freeBtn.className='bpChip'+(freeClaimed?' claimed':reached?' claimable':' locked');
    if(freeClaimed){ freeBtn.textContent='✅ '+tier.free+' 🪙'; freeBtn.disabled=true; }
    else if(reached){ freeBtn.textContent='🎁 '+tier.free+' 🪙'; freeBtn.addEventListener('click', ()=>{ if(claimSeasonTier(i,'free')) renderBattlepass(); }); }
    else { freeBtn.textContent='🔒 '+tier.free+' 🪙'; freeBtn.disabled=true; }
    tile.appendChild(freeBtn);

    const premBtn=document.createElement('button');
    const premLabel = tier.premiumCosmetic ? ('+'+tier.premium+' 🪙 🎨') : ('+'+tier.premium+' 🪙');
    premBtn.className='bpChip premium'+((!stats.seasonPremium)?' locked':premClaimed?' claimed':reached?' claimable':' locked');
    if(!stats.seasonPremium){ premBtn.textContent='🎫 '+premLabel; premBtn.disabled=true; }
    else if(premClaimed){ premBtn.textContent='✅ '+premLabel; premBtn.disabled=true; }
    else if(reached){ premBtn.textContent='🎁 '+premLabel; premBtn.addEventListener('click', ()=>{ if(claimSeasonTier(i,'premium')) renderBattlepass(); }); }
    else { premBtn.textContent='🔒 '+premLabel; premBtn.disabled=true; }
    tile.appendChild(premBtn);

    wrap.appendChild(tile);
  });
}
