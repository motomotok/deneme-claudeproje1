// Ekran/durum makinesi: menü ↔ mod seç ↔ mağaza ↔ oyun ↔ duraklat ↔
// oyun-sonu geçişleri. Oyun sonu reklamı (interstitial) burada tetiklenir.
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  if(id){ const el=document.getElementById('screen-'+id); if(el) el.classList.add('active'); }
  document.getElementById('overlay').classList.toggle('hidden', !id);
}
function setHud(on){ document.getElementById('hud').classList.toggle('show', on);
  document.getElementById('hint').style.display = on?'block':'none'; }

function goMenu(){ state='menu'; setHud(false); showScreen('menu');
  document.getElementById('menuBest').textContent='En iyi: '+stats.best;
  ensureTodayQuest(); const q=currentQuest();
  document.getElementById('questLine').textContent='🎯 Günün görevi: '+q.text+(stats.questDone?' ✅':'');
  ensureRival();
  document.getElementById('rivalLine').textContent='🎯 '+turkishAccusative(stats.rivalName)+' geç: '+stats.rivalScore+' puan';
  refreshWallet(); }
function goHowto(){ state='howto'; setHud(false); showScreen('howto'); }
function goSettings(){ state='settings'; setHud(false); showScreen('settings'); syncSettings(); }
function goStats(){ state='stats'; setHud(false); showScreen('stats'); syncStats(); }
function goMode(){ state='mode'; setHud(false); showScreen('mode'); refreshDailyStatus(); renderBoostRow(); }
function goShop(){ state='shop'; setHud(false); showScreen('shop'); refreshWallet(); renderShopTab(); }

function startGame(m,d){
  m = m || mode; d = d || diffKey;
  if(AC && AC.state==='suspended') AC.resume();
  mode=m; diffKey = (mode==='daily') ? 'normal' : d;
  diffCfg = DIFF[diffKey];
  if(mode==='daily'){
    const t=todayStr();
    if(stats.dailyDate===t && stats.dailyDone){ queueToast('Bugün günlük mücadeleni tamamladın, yarın tekrar gel!'); goMode(); return; }
    rngFn = mulberry32(dateSeed());
  } else rngFn = Math.random;
  if(pendingBoost && (stats.boosts[pendingBoost]||0)>0){
    stats.boosts[pendingBoost]--; saveStats(); activeBoost=pendingBoost;
  }
  pendingBoost=null;
  resetGame(); state='play'; setHud(true); showScreen(null);
  beep(440,0.1,'sine',0.12);
}
function pauseGame(){ if(state!=='play') return; state='pause'; showScreen('pause');
  document.getElementById('zenFinishBtn').style.display = mode==='zen' ? 'block' : 'none'; }
function resumeGame(){ if(state!=='pause') return; state='play'; showScreen(null); }

let adGamesLeft = null;
function rollAdInterval(){ return 2 + Math.floor(Math.random()*2); } // 2 ya da 3 oyun

function gameOver(reason){
  state='over';
  const runScore=score, elapsedSec=elapsed/60;
  newRecord = runScore>stats.best;
  const beatenRival = (stats.rivalScore>0 && runScore>=stats.rivalScore) ? stats.rivalName : null;
  stats.best=Math.max(stats.best, runScore);
  stats.stars += session.stars; stats.games++; stats.maxLevel=Math.max(stats.maxLevel, level);
  addToLeaderboard(runScore);
  if(mode==='daily'){ stats.dailyDate=todayStr(); stats.dailyDone=true; stats.dailyScore=runScore; stats.dailyCount=(stats.dailyCount||0)+1; }
  ensureTodayQuest();
  const q=currentQuest();
  if(!stats.questDone && q.check(session,{elapsedSec, level})){
    stats.questDone=true; queueToast('🎯 Günlük görev tamamlandı: '+q.text);
  }
  checkAchievements({runScore, level, session, mode, elapsedSec});
  const scoreBonus = Math.floor(runScore/12);
  addStardust(scoreBonus);
  ensureRival();
  saveStats();
  if(beatenRival) queueToast('🏆 '+turkishAccusative(beatenRival)+' geçtin! Yeni hedef: '+stats.rivalName+' — '+stats.rivalScore);
  let reasonText='';
  if(reason==='time') reasonText='⏰ Süre doldu · ';
  else if(reason==='zen') reasonText='🧘 Oturum tamamlandı · ';
  document.getElementById('finalScore').textContent=runScore;
  document.getElementById('overStats').textContent=reasonText+'En iyi: '+stats.best+' · Seviye '+level;
  document.getElementById('recordBadge').innerHTML = newRecord ? '<span class="badge">🏆 YENİ REKOR!</span>' : '';
  const totalEarned = session.coins + scoreBonus;
  document.getElementById('coinsEarned').innerHTML = `🪙 +${totalEarned} <span style="opacity:.6;font-size:12px">(${session.coins} toplama + ${scoreBonus} puan bonusu)</span>`;
  setHud(false); showScreen('over');
  beep(200,0.3,'sine',0.12);
  if(!stats.premiumNoAds){
    if(adGamesLeft===null) adGamesLeft=rollAdInterval();
    adGamesLeft--;
    if(adGamesLeft<=0){
      adGamesLeft=rollAdInterval();
      setTimeout(()=>{ Ads.showInterstitial(); }, 700);
    }
  }
}

function addToLeaderboard(scoreVal){
  stats.leaderboard.push({score:scoreVal, date:todayStr(), mode});
  stats.leaderboard.sort((a,b)=>b.score-a.score);
  stats.leaderboard = stats.leaderboard.slice(0,5);
  saveStats();
}
