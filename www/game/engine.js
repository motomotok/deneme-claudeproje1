// Simülasyon çekirdeği: canvas boyutlandırma, oyuncu/eşya fiziği, çarpışma
// tespiti, güç-yükseltmeleri, can/revive akışı ve HUD güncellemesi.
// (Çizim mantığı render.js'de, ekran/durum geçişleri screens.js'de.)
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let W,H,CX,CY,DPR, RINGS=[], PLAYER_R;
const NUM_RINGS = 3, MIN_GAP = 0.55;

function resize(){
  DPR = Math.min(window.devicePixelRatio||1, 2);
  W = window.innerWidth; H = window.innerHeight;
  cv.width=W*DPR; cv.height=H*DPR; cv.style.width=W+'px'; cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  CX=W/2; CY=H/2;
  const base=Math.min(W,H);
  RINGS=[base*0.19, base*0.285, base*0.38];
  PLAYER_R=Math.max(9, base*0.021);
}

let state='menu';
const GAME_STATES = {play:1, pause:1, over:1, revive:1};
let mode='classic', diffKey='normal';
let player, items, particles, score, combo, lives, level, elapsed, spawnTimer, shake, flash, freezeFlash;
let levelFlashT, session, timeLeft, newRecord, timeScale, timeScaleT, activeBoost=null, pendingBoost=null;

const SLOW_DUR=300, MAGNET_DUR=360, INVUL=95, FREEZE_DUR=150, MULT_DUR=360, GHOST_DUR=240;
const PW = ['shield','slow','magnet','freeze','mult','ghost'];
const PW_EMOJI = {shield:'🛡️',slow:'⏱️',magnet:'🧲',freeze:'⏳',mult:'💰',ghost:'👻'};

function resetGame(){
  player = { ang:-Math.PI/2, targetRing:0, curRadius:radiusFor(0), speed:1.6,
             shield:false, slowT:0, magnetT:0, invulT:0, freezeT:0, multT:0, ghostT:0 };
  items=[]; particles=[]; score=0; combo=1;
  lives = mode==='zen' ? 999 : diffCfg.lives;
  level=1; elapsed=0; spawnTimer=0; shake=0; flash=0; freezeFlash=0; levelFlashT=0;
  session = {stars:0, golds:0, diamonds:0, magnets:0, hits:0, shieldSaved:false, streakMax:0,
             coins:0, coinPickups:0, luckyCharges:0, stardustMult:1, revivedUsed:false};
  timeLeft = mode==='time' ? 60 : null;
  newRecord=false; timeScale=1; timeScaleT=0;
  if(activeBoost){
    if(activeBoost==='shieldstart') player.shield=true;
    else if(activeBoost==='slowstart') player.slowT=SLOW_DUR;
    else if(activeBoost==='luckystart') session.luckyCharges=3;
    else if(activeBoost==='coinrush') session.stardustMult=1.5;
    activeBoost=null;
  }
  for(let i=0;i<4;i++) spawnItem(player.ang + 1.4 + i*0.95);
  updateHud();
}

function normAng(a){ a%=(Math.PI*2); if(a<0)a+=Math.PI*2; return a; }
function angDiff(a,b){ let d=b-a; while(d>Math.PI)d-=Math.PI*2; while(d<-Math.PI)d+=Math.PI*2; return d; }
function radiusFor(r){ return RINGS[r]; }
function easeOut(t){ return 1-Math.pow(1-t,3); }
function isHazardType(t){ return t==='hazard'||t==='hazardJump'||t==='hazardBomb'; }
function isPower(t){ return t==='shield'||t==='slow'||t==='magnet'||t==='freeze'||t==='mult'||t==='ghost'; }

function spawnItem(atAng){
  const zen = mode==='zen';
  const hazChance = zen ? 0 : Math.min(diffCfg.hazCap, diffCfg.hazBase + elapsed*diffCfg.hazRamp);
  let ang, ring, tries=0, ok=false;
  do{
    ring=Math.floor(rnd()*NUM_RINGS);
    ang=normAng(atAng!=null ? atAng : (player.ang + 1.5 + rnd()*3.0));
    ok=true;
    for(const it of items){
      if(!it.alive || it.expiring || it.ring!==ring) continue;
      if(Math.abs(angDiff(it.ang,ang))<MIN_GAP){ ok=false; break; }
    }
    tries++;
  } while(!ok && tries<12);
  if(!ok) return;
  let type; let r=rnd();
  if(session.luckyCharges>0 && r<hazChance){ session.luckyCharges--; r=hazChance; }
  if(r < hazChance){
    const sub=rnd();
    type = sub<0.55 ? 'hazard' : sub<0.82 ? 'hazardJump' : 'hazardBomb';
  } else if(r < hazChance+0.03) type='diamond';
  else if(r < hazChance+0.08) type=PW[Math.floor(rnd()*PW.length)];
  else if(r < hazChance+0.14) type='coin';
  else if(r < hazChance+0.25) type='gold';
  else type='star';
  items.push({ang, ring, type, alive:true, pop:0, expiring:false, prevFwd:null,
    jumpT: type==='hazardJump' ? 70+Math.random()*60 : 0});
}

function tap(x){
  const goOut = x >= W/2;
  const next = player.targetRing + (goOut ? 1 : -1);
  if(next < 0 || next > NUM_RINGS-1) return;
  player.targetRing = next;
  beep(goOut?620:420,0.07,'triangle',0.10);
}

function burst(x,y,color,n,spd){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, s=Math.random()*spd+0.5;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color,r:Math.random()*3+1.5});
  }
}
function showFlash(text,dur){ levelFlashT=dur; document.getElementById('levelFlash').textContent=text; }

function checkStreak(ix,iy,mult){
  if(combo>0 && combo%5===0){
    score+=20*mult; timeScale=0.3; timeScaleT=16;
    showFlash('STREAK x'+combo+'!',50); burst(ix,iy,'#ffffff',18,5); beep(1000,0.08,'square',0.12);
  }
}

function update(dt){
  elapsed+=dt;
  const zen = mode==='zen';
  const nl = zen ? level : 1 + Math.floor(elapsed/720);
  if(nl>level){ level=nl; beep(660,0.1,'triangle',0.13); beep(990,0.12,'sine',0.10); showFlash('SEVİYE '+level,70); vibrate([10,50,10]); }

  if(mode==='time'){
    timeLeft -= dt/60;
    if(timeLeft<=0){ timeLeft=0; gameOver('time'); return; }
  }

  let speedMul = 1;
  if(player.freezeT>0) speedMul=0.04; else if(player.slowT>0) speedMul=0.5;
  player.speed = 1.5 + (zen?0:Math.min(2.4, elapsed*diffCfg.speedRamp));
  player.ang = normAng(player.ang + player.speed*speedMul*0.018*dt*timeScale);

  const tR=radiusFor(player.targetRing);
  player.curRadius += (tR-player.curRadius)*Math.min(1,0.22*dt);
  const settled = Math.abs(player.curRadius-tR) < PLAYER_R*0.8;
  const curRing = player.targetRing;

  if(player.slowT>0) player.slowT-=dt;
  if(player.magnetT>0) player.magnetT-=dt;
  if(player.invulT>0) player.invulT-=dt;
  if(player.freezeT>0) player.freezeT-=dt;
  if(player.multT>0) player.multT-=dt;
  if(player.ghostT>0) player.ghostT-=dt;
  const mult = player.multT>0 ? 2 : 1;

  spawnTimer-=dt;
  if(spawnTimer<=0){ spawnItem(); spawnTimer=Math.max(14, 40 - elapsed*0.011); }

  for(const it of items){
    if(!it.alive) continue;
    if(!it.expiring && it.pop<1) it.pop=Math.min(1,it.pop+dt*0.14);

    if(it.type==='hazardJump' && !it.expiring){
      it.jumpT-=dt;
      if(it.jumpT<=0){ it.ring=(it.ring+(Math.random()<0.5?1:-1)+NUM_RINGS)%NUM_RINGS; it.jumpT=70+Math.random()*60; }
    }

    const fwd=normAng(it.ang-player.ang);
    if(it.prevFwd!=null && (fwd-it.prevFwd)>Math.PI) it.expiring=true;
    it.prevFwd=fwd;

    if(it.expiring){ it.pop-=dt*0.08; if(it.pop<=0){ it.alive=false; continue; } }

    const da=Math.abs(angDiff(player.ang,it.ang));
    const hitWindow = it.type==='hazardBomb' ? 0.20 : 0.13;
    if(it.expiring || da>=hitWindow || !settled) continue;

    const sameRing = it.ring===curRing;
    const ix=CX+Math.cos(it.ang)*radiusFor(it.ring), iy=CY+Math.sin(it.ang)*radiusFor(it.ring);

    if(isHazardType(it.type)){
      if(!sameRing) continue;
      if(player.ghostT>0){ it.alive=false; burst(ix,iy,'#ffffff',10,3); continue; }
      if(player.invulT<=0){ it.alive=false; hitHazard(ix,iy,it.type); if(state!=='play') return; }
    } else if(sameRing || (player.magnetT>0 && !isPower(it.type))){
      it.alive=false;
      if(it.type==='gold'){ combo++; score+=5*combo*mult; session.stars++; session.golds++; stats.golds++;
        burst(ix,iy,T.gold,22,5); shake=6; beep(880,0.09,'triangle',0.14); beep(1320,0.10,'sine',0.10); bumpCombo(); checkStreak(ix,iy,mult); }
      else if(it.type==='diamond'){ combo++; score+=(20+level*4)*mult; session.stars++; session.diamonds++; stats.diamonds++;
        burst(ix,iy,'#eafcff',26,6); shake=8; beep(1200,0.1,'triangle',0.15); beep(1600,0.12,'sine',0.12); bumpCombo(); checkStreak(ix,iy,mult); }
      else if(it.type==='star'){ combo++; score+=combo*mult; session.stars++;
        burst(ix,iy,T.star,14,4); shake=3; beep(660+combo*8,0.07,'sine',0.12); bumpCombo(); checkStreak(ix,iy,mult); }
      else if(it.type==='coin'){
        const gained=Math.round((3+Math.floor(rnd()*4))*session.stardustMult*weekendMult());
        addStardust(gained); session.coins+=gained; session.coinPickups++;
        burst(ix,iy,'#ffb454',18,4.5); shake=4; beep(950,0.08,'triangle',0.13); beep(1400,0.06,'sine',0.1);
      }
      else { activatePower(it.type,ix,iy); }
    }
    session.streakMax=Math.max(session.streakMax,combo);
  }
  items=items.filter(it=>it.alive);
  if(items.length>30) items.splice(0, items.length-30);

  if(shake>0) shake*=Math.pow(0.86,dt);
  if(flash>0) flash=Math.max(0,flash-dt*0.06);
  if(freezeFlash>0) freezeFlash=Math.max(0,freezeFlash-dt*0.05);
  if(levelFlashT>0) levelFlashT-=dt;
  if(timeScaleT>0){ timeScaleT-=1; if(timeScaleT<=0) timeScale=1; }
  updateHud();
}

function hitHazard(ix,iy,subtype){
  const px=CX+Math.cos(player.ang)*player.curRadius, py=CY+Math.sin(player.ang)*player.curRadius;
  if(player.shield){ player.shield=false; session.shieldSaved=true; burst(px,py,'#5efc82',26,5); shake=9;
    beep(300,0.2,'square',0.14); return; }
  const power = subtype==='hazardBomb' ? 1.6 : 1;
  lives--; combo=1; shake=16*power; flash=1; session.hits++;
  burst(ix,iy,T.peril,34,6); beep(120,0.4,'sawtooth',0.2); beep(80,0.5,'square',0.15); vibrate([40,30,40]);
  if(lives<=0){
    if(mode!=='zen' && !session.revivedUsed) offerRevive();
    else gameOver();
  }
  else { player.invulT=INVUL; beep(220,0.15,'square',0.1); }
}

let reviveTimer=null;
function offerRevive(){
  state='revive'; showScreen('revive');
  let secs=6;
  const cd=document.getElementById('reviveCountdown'); if(cd) cd.textContent=secs;
  clearInterval(reviveTimer);
  reviveTimer=setInterval(()=>{
    secs--; if(cd) cd.textContent=secs;
    if(secs<=0){ clearInterval(reviveTimer); declineRevive(); }
  },1000);
}
function acceptRevive(){
  clearInterval(reviveTimer);
  Ads.showRewarded(()=>{
    session.revivedUsed=true; lives=1; combo=1; player.invulT=INVUL*3;
    state='play'; showScreen(null); queueToast('✨ Devam ediyorsun!');
  }, ()=>{ declineRevive(); });
}
function declineRevive(){
  clearInterval(reviveTimer);
  if(state==='revive') gameOver();
}

function activatePower(type,x,y){
  if(type==='shield'){ player.shield=true; burst(x,y,'#5efc82',20,5); beep(700,0.12,'sine',0.13); beep(1050,0.12,'triangle',0.1); }
  else if(type==='slow'){ player.slowT=SLOW_DUR; burst(x,y,'#7aa2ff',20,5); beep(400,0.2,'sine',0.13); }
  else if(type==='magnet'){ player.magnetT=MAGNET_DUR; session.magnets++; stats.magnets++; burst(x,y,'#ff7ae0',20,5); beep(600,0.14,'triangle',0.13); beep(900,0.14,'sine',0.1); }
  else if(type==='freeze'){ player.freezeT=FREEZE_DUR; freezeFlash=1; burst(x,y,'#7fe8ff',20,5); beep(500,0.18,'sine',0.13); }
  else if(type==='mult'){ player.multT=MULT_DUR; burst(x,y,'#ffd24a',20,5); beep(750,0.14,'triangle',0.13); }
  else if(type==='ghost'){ player.ghostT=GHOST_DUR; burst(x,y,'#ffffff',20,5); beep(450,0.16,'sine',0.13); }
  score+=10; shake=6; vibrate(15);
}

function bumpCombo(){
  const c=document.getElementById('combo');
  c.style.transform='scale(1.4)'; setTimeout(()=>c.style.transform='scale(1)',110);
}

function updateHud(){
  document.getElementById('scoreHud').textContent=score;
  document.getElementById('combo').textContent='x'+combo;
  document.getElementById('levelHud').textContent=level;
  document.getElementById('lives').textContent = mode==='zen' ? '∞' : (lives>0 ? '❤'.repeat(lives) : '');
  const isTime = mode==='time';
  document.getElementById('timerLbl').style.display = isTime?'block':'none';
  document.getElementById('timerHud').style.display = isTime?'block':'none';
  document.getElementById('levelLbl').style.display = isTime?'none':'block';
  document.getElementById('levelHud').style.display = isTime?'none':'block';
  if(isTime) document.getElementById('timerHud').textContent = Math.ceil(timeLeft)+'s';
  const pw=document.getElementById('pw'); let html='';
  if(player.shield) html+=`<div class="pwchip">🛡️</div>`;
  if(player.slowT>0) html+=chip('⏱️', player.slowT/SLOW_DUR);
  if(player.magnetT>0) html+=chip('🧲', player.magnetT/MAGNET_DUR);
  if(player.freezeT>0) html+=chip('⏳', player.freezeT/FREEZE_DUR);
  if(player.multT>0) html+=chip('💰', player.multT/MULT_DUR);
  if(player.ghostT>0) html+=chip('👻', player.ghostT/GHOST_DUR);
  pw.innerHTML=html;
  const lf=document.getElementById('levelFlash');
  lf.style.opacity = levelFlashT>0 ? Math.min(1, levelFlashT/20) : 0;
  document.getElementById('walletHud').textContent = stats.stardust||0;
}
function chip(icon,frac){ return `<div class="pwchip">${icon}<div class="pwbar"><i style="width:${Math.max(0,frac)*100}%"></i></div></div>`; }
