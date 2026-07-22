// Sezon Bileti (Battle-Pass) ekranının DOM render'ı — ilerleme çubuğu,
// kademe listesi (ücretsiz/ücretli claim butonları) ve Sezon Bileti IAP
// durum senkronizasyonu. Veri modeli data.js'de (ensureSeason, SEASON_TIERS,
// claimSeasonTier).
function syncSeasonPassUI(price){
  const txt=document.getElementById('seasonPassStatusText');
  const btn=document.getElementById('seasonPassBuyBtn');
  if(!txt || !btn) return;
  if(stats.seasonPremium){
    txt.innerHTML=icon('check')+' Sezon Bileti aktif — bu ay premium ödülleri alabilirsin!';
    btn.style.display='none';
  } else {
    txt.innerHTML=icon('ticket')+' Premium çizgi ile daha büyük ödüller';
    btn.style.display='inline-block';
    btn.innerHTML=icon('ticket')+' Sezon Bileti — '+(price || (window.SeasonPass ? SeasonPass.FALLBACK_PRICE_TEXT : '29 TL'));
  }
}

function renderBattlepass(){
  ensureSeason();
  const s = activeSeason();
  const daysLeft = Math.max(0, s.days - seasonDayIndex(s.start, new Date()));
  document.getElementById('seasonXpLine').textContent = stats.seasonXp+' XP · '+s.name+' · '+daysLeft+' gün kaldı';
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
    if(freeClaimed){ freeBtn.innerHTML=icon('check')+' '+tier.free+' '+icon('coin'); freeBtn.disabled=true; }
    else if(reached){ freeBtn.innerHTML=icon('gift')+' '+tier.free+' '+icon('coin'); freeBtn.addEventListener('click', ()=>{ if(claimSeasonTier(i,'free')) renderBattlepass(); }); }
    else { freeBtn.innerHTML=icon('lock')+' '+tier.free+' '+icon('coin'); freeBtn.disabled=true; }
    tile.appendChild(freeBtn);

    const premBtn=document.createElement('button');
    const premLabel = tier.cosmeticSlot ? ('+'+tier.premium+' '+icon('coin')+' '+icon('palette')) : ('+'+tier.premium+' '+icon('coin'));
    premBtn.className='bpChip premium'+((!stats.seasonPremium)?' locked':premClaimed?' claimed':reached?' claimable':' locked');
    if(!stats.seasonPremium){ premBtn.innerHTML=icon('ticket')+' '+premLabel; premBtn.disabled=true; }
    else if(premClaimed){ premBtn.innerHTML=icon('check')+' '+premLabel; premBtn.disabled=true; }
    else if(reached){ premBtn.innerHTML=icon('gift')+' '+premLabel; premBtn.addEventListener('click', ()=>{ if(claimSeasonTier(i,'premium')) renderBattlepass(); }); }
    else { premBtn.innerHTML=icon('lock')+' '+premLabel; premBtn.disabled=true; }
    tile.appendChild(premBtn);

    wrap.appendChild(tile);
  });
}
