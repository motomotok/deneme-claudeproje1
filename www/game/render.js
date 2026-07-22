// Çizim katmanı: ana requestAnimationFrame döngüsü, arkaplan yıldızları,
// güneş/halka/iz/oyuncu/eşya görselleri. Buradaki hiçbir fonksiyon oyun
// durumunu (skor, can vb.) değiştirmez — sadece engine.js'in ürettiği
// durumu canvas'a çizer.
const bgStars=[];
function initStars(){
  bgStars.length=0;
  const n=Math.round((W*H)/9000);
  for(let i=0;i<n;i++) bgStars.push({x:Math.random()*W,y:Math.random()*H,z:Math.random()*0.9+0.1,r:Math.random()*1.4+0.3});
}
let shootTimer=140; const shootStars=[];
function updateShootingStars(dt){
  shootTimer-=dt;
  if(shootTimer<=0){
    shootTimer=240+Math.random()*300;
    shootStars.push({x:-40,y:Math.random()*H*0.4,vx:7+Math.random()*4,vy:3+Math.random()*2,life:1});
  }
  for(const s of shootStars){ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=0.012*dt; }
  for(let i=shootStars.length-1;i>=0;i--) if(shootStars[i].life<=0||shootStars[i].x>W+40) shootStars.splice(i,1);
}
function drawShootingStars(){
  for(const s of shootStars){
    ctx.save(); ctx.globalAlpha=Math.max(0,s.life);
    const g=ctx.createLinearGradient(s.x,s.y,s.x-60,s.y-26);
    g.addColorStop(0,'#ffffff'); g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=g; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-60,s.y-26); ctx.stroke();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x,s.y,2.6,0,7); ctx.fill();
    ctx.restore();
  }
}

let last=0;
function loop(ts){
  const dt=Math.min(40, ts-last)/16.6667 || 1; last=ts;
  ctx.clearRect(0,0,W,H);
  updateShootingStars(dt);
  drawBg(dt);
  if(state==='play') update(dt);
  drawWorld();
  drawParticles(dt);
  requestAnimationFrame(loop);
}

function drawBg(dt){
  for(const s of bgStars){
    s.y += s.z*0.15*dt; if(s.y>H){ s.y=0; s.x=Math.random()*W; }
    ctx.globalAlpha=s.z; ctx.fillStyle=T.sf;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,7); ctx.fill();
  }
  ctx.globalAlpha=1;
  drawShootingStars();
}

function drawWorld(){
  const t=performance.now()*0.001;
  ctx.save();
  if(shake>0.3 && GAME_STATES[state]) ctx.translate((Math.random()-0.5)*shake,(Math.random()-0.5)*shake);

  drawSun(t);

  for(const r of RINGS) drawRing(r);

  if(GAME_STATES[state]){
    for(const it of items){
      if(!it.alive) continue;
      const rad=radiusFor(it.ring);
      drawItem(CX+Math.cos(it.ang)*rad, CY+Math.sin(it.ang)*rad, it.type, easeOut(Math.max(0,it.pop)), t, it);
    }
    drawPlayer(t);
  }
  ctx.restore();

  if(flash>0 && GAME_STATES[state]){ ctx.fillStyle=hexA(T.peril, flash*0.4); ctx.fillRect(0,0,W,H); }
  if(freezeFlash>0 && GAME_STATES[state]){ ctx.fillStyle=hexA('#7fe8ff', freezeFlash*0.22); ctx.fillRect(0,0,W,H); }
}

function drawSun(t){
  const sunR=Math.min(W,H)*0.06*(1+Math.sin(t*2)*0.04);
  const style = cfg.sun;
  if(style==='blackhole'){
    const ringR=sunR*2.2;
    const g=ctx.createRadialGradient(CX,CY,sunR*0.3,CX,CY,ringR);
    g.addColorStop(0,'#000000'); g.addColorStop(0.55,'#000000');
    g.addColorStop(0.7,hexA('#ffb454',.9)); g.addColorStop(0.85,hexA('#ff6b3d',.5)); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,ringR,0,7); ctx.fill();
    ctx.save(); ctx.translate(CX,CY); ctx.rotate(t*0.6);
    ctx.strokeStyle=hexA('#ffd88a',.7); ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(0,0,sunR*1.9,sunR*0.55,0,0,7); ctx.stroke();
    ctx.restore();
    ctx.fillStyle='#000000'; ctx.beginPath(); ctx.arc(CX,CY,sunR*0.85,0,7); ctx.fill();
  } else if(style==='redgiant'){
    const g=ctx.createRadialGradient(CX,CY,0,CX,CY,sunR*2.8);
    g.addColorStop(0,'#fff4e0'); g.addColorStop(0.3,'#ff8a3d'); g.addColorStop(1,'rgba(255,90,30,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,sunR*2.8,0,7); ctx.fill();
    ctx.fillStyle='#ffb27a'; ctx.beginPath(); ctx.arc(CX,CY,sunR*1.1,0,7); ctx.fill();
  } else if(style==='nebula'){
    const colors=['#a97bff','#54e0ff','#ff7ae0'];
    for(let i=0;i<3;i++){
      const g=ctx.createRadialGradient(CX,CY,0,CX,CY,sunR*(2.4+i*0.3));
      g.addColorStop(0, hexA(colors[i],.5)); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,sunR*(2.4+i*0.3),0,7); ctx.fill();
    }
    ctx.fillStyle='#f5f0ff'; ctx.beginPath(); ctx.arc(CX,CY,sunR*0.9,0,7); ctx.fill();
  } else if(style==='crystal'){
    const g=ctx.createRadialGradient(CX,CY,0,CX,CY,sunR*2.4);
    g.addColorStop(0,'rgba(255,255,255,.9)'); g.addColorStop(1,'rgba(140,200,255,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,sunR*2.4,0,7); ctx.fill();
    ctx.save(); ctx.translate(CX,CY); ctx.rotate(t*0.3);
    ctx.fillStyle='#dff6ff'; ctx.beginPath();
    for(let i=0;i<6;i++){ const a=i*Math.PI/3; const x=Math.cos(a)*sunR, y=Math.sin(a)*sunR; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  } else if(style==='quasar'){
    const g=ctx.createRadialGradient(CX,CY,0,CX,CY,sunR*1.6);
    g.addColorStop(0,'#ffffff'); g.addColorStop(0.4,'#bfe0ff'); g.addColorStop(1,'rgba(140,200,255,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,sunR*1.6,0,7); ctx.fill();
    ctx.save(); ctx.translate(CX,CY); ctx.rotate(t*0.9);
    for(const sign of [1,-1]){
      const bg=ctx.createLinearGradient(0,0,0,sign*sunR*3.2);
      bg.addColorStop(0,'rgba(180,220,255,.85)'); bg.addColorStop(1,'rgba(180,220,255,0)');
      ctx.fillStyle=bg; ctx.fillRect(-sunR*0.12,0,sunR*0.24,sign*sunR*3.2);
    }
    ctx.restore();
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(CX,CY,sunR*0.7,0,7); ctx.fill();
  } else if(style==='supernova'){
    const colors=['#ffffff','#ffd28a','#ff6b3d','#a97bff'];
    for(let i=0;i<4;i++){
      const rr=sunR*(1.1+i*0.55)*(1+Math.sin(t*1.6+i)*0.05);
      ctx.strokeStyle=hexA(colors[i],.55-i*0.1); ctx.lineWidth=3-i*0.4;
      ctx.beginPath(); ctx.arc(CX,CY,rr,0,7); ctx.stroke();
    }
    ctx.fillStyle='#fff8ea'; ctx.beginPath(); ctx.arc(CX,CY,sunR*0.9,0,7); ctx.fill();
  } else {
    const g=ctx.createRadialGradient(CX,CY,0,CX,CY,sunR*2.6);
    g.addColorStop(0,'rgba(255,255,255,.95)');
    g.addColorStop(0.3, hexA(T.sun,.8));
    g.addColorStop(1, hexA(T.sun,0));
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(CX,CY,sunR*2.6,0,7); ctx.fill();
    ctx.fillStyle='#eaffff'; ctx.beginPath(); ctx.arc(CX,CY,sunR,0,7); ctx.fill();
  }
}

function drawRing(r){
  const style = cfg.ringStyle;
  if(style==='dotted'){
    ctx.strokeStyle='rgba(150,175,255,0.3)'; ctx.lineWidth=2; ctx.setLineDash([2,8]);
    ctx.beginPath(); ctx.arc(CX,CY,r,0,7); ctx.stroke(); ctx.setLineDash([]);
  } else if(style==='glow'){
    ctx.save(); ctx.shadowColor=hexA(T.star,.6); ctx.shadowBlur=10;
    ctx.strokeStyle=hexA(T.star,.35); ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(CX,CY,r,0,7); ctx.stroke();
    ctx.restore();
  } else if(style==='double'){
    ctx.strokeStyle='rgba(150,175,255,0.15)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(CX,CY,r-3,0,7); ctx.stroke();
    ctx.beginPath(); ctx.arc(CX,CY,r+3,0,7); ctx.stroke();
  } else if(style==='pulse'){
    const pt=performance.now()*0.001;
    const a=0.18+Math.sin(pt*3)*0.12;
    ctx.strokeStyle=hexA(T.star,Math.max(0.06,a)); ctx.lineWidth=2+Math.sin(pt*3)*1;
    ctx.beginPath(); ctx.arc(CX,CY,r,0,7); ctx.stroke();
  } else if(style==='circuit'){
    ctx.strokeStyle='rgba(150,175,255,0.18)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(CX,CY,r,0,7); ctx.stroke();
    ctx.fillStyle='rgba(190,210,255,0.4)';
    const n=18;
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2;
      const x=CX+Math.cos(a)*r, y=CY+Math.sin(a)*r;
      ctx.fillRect(x-1.5,y-1.5,3,3);
    }
  } else {
    ctx.strokeStyle='rgba(150,175,255,0.15)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(CX,CY,r,0,7); ctx.stroke();
  }
}

function drawTrail(t,pr,pc){
  const style = cfg.trail;
  if(style==='comet' || style==='ribbon'){
    ctx.beginPath();
    for(let i=0;i<=12;i++){
      const a=player.ang - i*0.045;
      const wob = style==='ribbon' ? Math.sin(t*4-i*0.5)*PLAYER_R*0.4 : 0;
      const rad = pr+wob;
      const x=CX+Math.cos(a)*rad, y=CY+Math.sin(a)*rad;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=hexA(pc, style==='comet'?.55:.5);
    ctx.lineWidth=PLAYER_R*(style==='comet'?1.4:1.1); ctx.lineCap='round';
    ctx.globalAlpha=0.6; ctx.stroke(); ctx.globalAlpha=1;
    return;
  }
  for(let i=1;i<=10;i++){
    const a=player.ang - i*0.05;
    const tx=CX+Math.cos(a)*pr, ty=CY+Math.sin(a)*pr;
    const baseSize=PLAYER_R*(1-i/14);
    let col=pc, size=baseSize;
    if(style==='sparkle'){
      if(i%2===0) continue;
      col='#ffffff'; size=baseSize*(0.6+((i*37)%10)/10);
    } else if(style==='rainbow'){
      col=`hsl(${(t*60+i*22)%360},90%,65%)`;
    } else if(style==='pixel'){
      ctx.globalAlpha=(1-i/10)*0.5; ctx.fillStyle=col;
      ctx.fillRect(tx-size/2,ty-size/2,size,size); continue;
    } else if(style==='quantum'){
      col = (i%2===0) ? pc : '#7fe8ff';
      size = baseSize*(1+Math.sin(t*6-i*0.8)*0.25);
    } else if(style==='phantom'){
      col='#eaf2ff'; size=baseSize*1.1;
      ctx.globalAlpha=(1-i/10)*0.22;
      ctx.beginPath(); ctx.arc(tx,ty,size,0,7); ctx.fill(); continue;
    }
    ctx.globalAlpha=(1-i/10)*0.4; ctx.fillStyle=col;
    ctx.beginPath(); ctx.arc(tx,ty,size,0,7); ctx.fill();
  }
  ctx.globalAlpha=1;
}

function drawPlayer(t){
  const pr=player.curRadius;
  const px=CX+Math.cos(player.ang)*pr, py=CY+Math.sin(player.ang)*pr;
  const pc = playerColor();
  drawTrail(t,pr,pc);
  const blink = player.invulT>0 && (Math.floor(player.invulT/4)%2===0);
  if(!blink){
    if(player.ghostT>0) ctx.globalAlpha = 0.5+Math.sin(t*10)*0.15;
    const pg=ctx.createRadialGradient(px,py,0,px,py,PLAYER_R*2.2);
    pg.addColorStop(0,'#ffffff'); pg.addColorStop(0.4, hexA(pc,.85)); pg.addColorStop(1, hexA(pc,0));
    ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(px,py,PLAYER_R*2.2,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(px,py,PLAYER_R,0,7); ctx.fill();
    ctx.globalAlpha=1;
  }
  if(player.shield){
    ctx.strokeStyle='#5efc82'; ctx.lineWidth=3; ctx.globalAlpha=0.8+Math.sin(t*8)*0.2;
    ctx.beginPath(); ctx.arc(px,py,PLAYER_R*1.9,0,7); ctx.stroke(); ctx.globalAlpha=1;
  }
  if(player.magnetT>0){
    ctx.strokeStyle='#ff7ae0'; ctx.lineWidth=2; ctx.globalAlpha=0.4+Math.sin(t*6)*0.2;
    ctx.setLineDash([6,8]); ctx.beginPath(); ctx.arc(px,py,PLAYER_R*3,0,7); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha=1;
  }
}

function drawItem(x,y,type,sc,t,it){
  if(sc<=0) return;
  const R=(PLAYER_R*0.95)*sc;
  const isTwinKind = type==='hazardTwin'||type==='hazardTwinDecoy';
  let col;
  if(type==='hazardPull') col='#a97bff';
  else if(isTwinKind) col='#ff8a3d';
  else if(type==='hazardPulse') col = (it && it.pulseDanger===false) ? '#ffd9dc' : '#ff3b52';
  else if(isHazardType(type)) col=T.peril;
  else if(type==='gold') col=T.gold;
  else if(type==='star') col=T.star;
  else if(type==='diamond') col='#eafcff';
  else if(type==='coin') col='#ffb454';
  else col='#ffffff';
  const glowAlpha = type==='hazardTwinDecoy' ? 0.3+Math.sin(t*9)*0.15 : 0.6;
  const g=ctx.createRadialGradient(x,y,0,x,y,R*2.4);
  g.addColorStop(0, hexA(col,glowAlpha)); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,R*2.4,0,7); ctx.fill();

  if(isHazardType(type) || type==='hazardTwinDecoy'){
    let Rh = type==='hazardBomb' ? R*1.5 : R;
    let shapeAlpha = type==='hazardTwinDecoy' ? 0.4+Math.sin(t*9)*0.25 : 1;
    if(type==='hazardPulse'){
      const danger = it ? it.pulseDanger : true;
      const phase = it ? it.pulsePhase : 0;
      Rh = R*(0.55+(Math.sin(phase)*0.5+0.5)*0.85);
      if(!danger) shapeAlpha=0.55;
    }
    ctx.globalAlpha=shapeAlpha;
    ctx.fillStyle=col; ctx.beginPath();
    const sp=7;
    for(let i=0;i<sp*2;i++){ const rr=i%2?Rh*0.6:Rh*1.25; const a=t*1.4+i*Math.PI/sp;
      const xx=x+Math.cos(a)*rr, yy=y+Math.sin(a)*rr; i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); }
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha=1;
    if(type==='hazardJump'){
      ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.setLineDash([3,5]); ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(x,y,Rh*1.6,0,7); ctx.stroke(); ctx.setLineDash([]);
    } else if(type==='hazardPull'){
      ctx.save(); ctx.translate(x,y); ctx.rotate(-t*2.2);
      ctx.strokeStyle=hexA('#a97bff',.55); ctx.setLineDash([2,4]); ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(0,0,Rh*1.7,0,7); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    } else if(isTwinKind){
      ctx.fillStyle='rgba(255,255,255,.7)';
      ctx.beginPath(); ctx.arc(x-Rh*0.55,y-Rh*0.75,Rh*0.22,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(x+Rh*0.55,y-Rh*0.75,Rh*0.22,0,7); ctx.fill();
    }
  } else if(type==='gold'){
    drawStar(x,y,R*1.2,R*0.55,5,t*1.2,col);
    if(cfg.colorblind){ ctx.setLineDash([4,4]); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,R*1.5,0,7); ctx.stroke(); ctx.setLineDash([]); }
  } else if(type==='star'){
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,R,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(x-R*0.25,y-R*0.25,R*0.35,0,7); ctx.fill();
    if(cfg.colorblind){ ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,R*1.15,0,7); ctx.stroke(); }
  } else if(type==='diamond'){
    ctx.save(); ctx.translate(x,y); ctx.rotate(Math.PI/4);
    ctx.fillStyle=col; ctx.fillRect(-R*0.75,-R*0.75,R*1.5,R*1.5);
    ctx.restore();
    ctx.fillStyle='rgba(255,255,255,.85)'; ctx.beginPath(); ctx.arc(x-R*0.2,y-R*0.2,R*0.25,0,7); ctx.fill();
  } else if(type==='coin'){
    ctx.save(); ctx.translate(x,y); ctx.rotate(t*2);
    ctx.fillStyle='#ffb454'; ctx.beginPath(); ctx.arc(0,0,R,0,7); ctx.fill();
    ctx.fillStyle='#c47a1f'; ctx.beginPath(); ctx.arc(0,0,R*0.62,0,7); ctx.fill();
    ctx.fillStyle='#ffe3a8'; ctx.beginPath(); ctx.arc(0,0,R*0.28,0,7); ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle='rgba(255,255,255,.14)'; ctx.beginPath(); ctx.arc(x,y,R*1.25,0,7); ctx.fill();
    ctx.font=`${R*1.7}px -apple-system,system-ui,sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(PW_EMOJI[type]||'❔', x, y+R*0.05);
  }
}
function drawStar(x,y,outer,inner,pts,rot,col){
  ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<pts*2;i++){ const rr=i%2?inner:outer; const a=rot+i*Math.PI/pts-Math.PI/2;
    const xx=x+Math.cos(a)*rr, yy=y+Math.sin(a)*rr; i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); }
  ctx.closePath(); ctx.fill();
}
function drawParticles(dt){
  for(const p of particles){
    p.x+=p.vx*dt; p.y+=p.vy*dt; p.vx*=0.94; p.vy*=0.94; p.life-=0.03*dt;
    if(p.life<=0) continue;
    ctx.globalAlpha=Math.max(0,p.life); ctx.fillStyle=p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r*p.life,0,7); ctx.fill();
  }
  ctx.globalAlpha=1;
  let _pw=0;
  for(let _pr=0;_pr<particles.length;_pr++){ if(particles[_pr].life>0) particles[_pw++]=particles[_pr]; }
  particles.length=_pw;
}
function hexA(hex,a){
  const h=hex.replace('#',''); const n=parseInt(h.length===3? h.split('').map(c=>c+c).join(''):h,16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}
