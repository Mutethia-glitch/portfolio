/*
  THE ANATOMY OF WORK
  A self-contained anatomical-style procedural 3D illustration and scroll-driven
  helix of case-study cards. No external 3D engine or downloaded anatomical model.
  Bone, disc, canal, process and nerve geometry is generated mathematically.
  This is a creative visualization, not an anatomical/medical reconstruction.
*/
(() => {
  'use strict';
  const track = document.getElementById('neural-track');
  const canvas = document.getElementById('spine-canvas');
  const cards = [...document.querySelectorAll('.neuro-step')];
  if (!track || !canvas || cards.length !== 4) return;
  const ctx = canvas.getContext('2d', {alpha: true});
  if (!ctx) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 900px)');
  const idxText = document.getElementById('neural-index');
  const progressBar = document.getElementById('neural-meter-fill');
  const section = document.querySelector('.neural-section');
  const glowColors = ['#7de6ff', '#f6dc6a', '#ff83c3', '#b6a0ff'];
  const lighterColors = ['#e6faff', '#fff8d5', '#ffe7f4', '#f2eaff'];
  let width = 1, height = 1, dpr = 1;
  let visible = true, ticking = false, progress = 0, targetProgress = 0;
  let pointerX = 0, pointerY = 0, easedX = 0, easedY = 0;
  let lastFrame = -Infinity, now = 0, lastIndex = -1;
  const clamp = (a, x, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a,b,t) => Math.round(a+(b-a)*t);
  const rgba = (color, alpha) => {
    let s = color.replace('#','');
    return `rgba(${parseInt(s.slice(0,2),16)},${parseInt(s.slice(2,4),16)},${parseInt(s.slice(4,6),16)},${alpha})`;
  };
  const formatN = n => String(n + 1).padStart(2, '0');
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = Math.max(box.width, 1); height = Math.max(box.height, 1);
    dpr = Math.min(1.75, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    draw();
  }
  function getScrollPosition() {
    if (mobile.matches) return 0;
    const bounds = track.getBoundingClientRect();
    return clamp(0, -bounds.top / Math.max(1, bounds.height - innerHeight), 1);
  }
  function updateCards() {
    const pos = progress * 3;
    const selected = clamp(0, Math.round(pos), 3);
    const staticMode = mobile.matches || reduced.matches;
    if (lastIndex !== selected) {
      idxText.innerHTML = `${formatN(selected)} <span>/ 04</span>`;
      section.style.setProperty('--active-neural-accent', glowColors[selected]);
      cards.forEach((c, i) => {
        const on = i === selected;
        c.classList.toggle('neuro-active', on);
        c.setAttribute('aria-hidden', staticMode ? 'false' : String(!on));
        c.querySelectorAll('a').forEach(a => {
          if (!staticMode && !on) a.setAttribute('tabindex', '-1');
          else a.removeAttribute('tabindex');
        });
      });
      lastIndex = selected;
    }
    progressBar.style.height = `${Math.round(progress * 100)}%`;
    if (mobile.matches || reduced.matches) return;
    cards.forEach((card, i) => {
      const delta = i - pos;
      const distance = Math.abs(delta);
      const theta = delta * 1.16;
      const horizontal = Math.sin(theta) * Math.min(122, width * .09) + Math.sign(delta) * Math.min(23, distance * 15);
      const vertical = delta * Math.min(225, height * .26);
      const depth = -Math.min(730, distance * 340);
      const scale = Math.max(.57, 1 - distance * .24);
      const alpha = Math.pow(clamp(0, 1 - distance * .96, 1), 1.65);
      card.style.opacity = alpha.toFixed(3);
      card.style.filter = `blur(${Math.max(0, distance-0.23)*2.2}px)`;
      card.style.transform = `translate(-50%, -50%) translate3d(${horizontal.toFixed(1)}px,${vertical.toFixed(1)}px,${depth.toFixed(1)}px) rotateY(${(-8 + delta * 29).toFixed(1)}deg) rotateX(${(delta*4.5).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      card.style.pointerEvents = distance < .48 ? 'auto':'none';
      card.style.zIndex = String(Math.round(30 - distance * 7));
    });
  }
  function onScroll() {
    targetProgress = getScrollPosition();
    if (reduced.matches) progress=targetProgress;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { ticking=false; if (reduced.matches || mobile.matches) {updateCards();draw()} });
    }
  }
  function project(x,y,z, yaw=0, pitch=0) {
    const cy=Math.cos(yaw), sy=Math.sin(yaw), cp=Math.cos(pitch), sp=Math.sin(pitch);
    const rx=x*cy-z*sy, rz=x*sy+z*cy;
    const ry=y*cp-rz*sp, zz=y*sp+rz*cp;
    const perspective=4.9 / (4.9 + zz*.34);
    const unit=Math.min(height*.129, width*.118, 116);
    return {
      x: width*(mobile.matches?.52:.365) + rx*unit*perspective,
      y: height*.50 + ry*unit*perspective,
      z: zz,
      scale: unit*perspective,
    };
  }
  function outline(points, color, stroke=null, sw=1) {
    if (points.length<2)return;
    ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
    for (let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);
    ctx.closePath();ctx.fillStyle=color;ctx.fill();
    if(stroke){ctx.lineWidth=sw;ctx.strokeStyle=stroke;ctx.stroke();}
  }
  function curve(points,widthPx, color, glow=0, fine=null) {
    if(points.length<2)return;
    ctx.save();
    ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++){
      const prev=points[i-1], next=points[i];
      ctx.quadraticCurveTo(prev.x,prev.y,(prev.x+next.x)*.5,(prev.y+next.y)*.5);
    }
    const last=points[points.length-1];ctx.lineTo(last.x,last.y);
    ctx.lineWidth=widthPx;ctx.strokeStyle=color;
    if(glow){ctx.shadowColor=fine||color;ctx.shadowBlur=glow;}
    ctx.stroke();
    ctx.restore();
  }
  function bezierNerve(start,end,color,alpha,step) {
    if(alpha<.005) return;
    const dx=Math.max(12,end.x-start.x);
    const cp1={x:start.x+Math.min(160,dx*.28),y:start.y-17+step*3};
    const cp2={x:end.x-Math.min(160,dx*.38),y:end.y+Math.sin(step*2.1)*26};
    const cubic=(t)=>{const q=1-t;return {
      x:q*q*q*start.x+3*q*q*t*cp1.x+3*q*t*t*cp2.x+t*t*t*end.x,
      y:q*q*q*start.y+3*q*q*t*cp1.y+3*q*t*t*cp2.y+t*t*t*end.y};};
    ctx.save();ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.moveTo(start.x,start.y);
    ctx.bezierCurveTo(cp1.x,cp1.y,cp2.x,cp2.y,end.x,end.y);
    ctx.strokeStyle=rgba(color,.20);ctx.lineWidth=18;ctx.shadowBlur=28;ctx.shadowColor=color;ctx.stroke();
    ctx.beginPath();ctx.moveTo(start.x,start.y);
    ctx.bezierCurveTo(cp1.x,cp1.y,cp2.x,cp2.y,end.x,end.y);
    ctx.strokeStyle=rgba(color,.63);ctx.lineWidth=5;ctx.shadowBlur=13;ctx.shadowColor=color;ctx.stroke();
    ctx.beginPath();ctx.moveTo(start.x,start.y);
    ctx.bezierCurveTo(cp1.x,cp1.y,cp2.x,cp2.y,end.x,end.y);
    ctx.strokeStyle='#fff8eb';ctx.shadowBlur=0;ctx.lineWidth=1.6;ctx.stroke();
    // A nucleus, terminal ganglion, and two branching nerve endings.
    for(const [pt,r] of [[start,3.5],[end,4.7]]){
      ctx.beginPath();ctx.arc(pt.x,pt.y,r,0,Math.PI*2);
      ctx.fillStyle='#ffeabb';ctx.shadowColor=color;ctx.shadowBlur=15;ctx.fill();
    }
    ctx.beginPath();ctx.moveTo(end.x,end.y);ctx.quadraticCurveTo(end.x+12,end.y-9,end.x+22,end.y-12);
    ctx.moveTo(end.x,end.y);ctx.quadraticCurveTo(end.x+12,end.y+9,end.x+22,end.y+16);
    ctx.strokeStyle=rgba(color,.42);ctx.lineWidth=1.3;ctx.stroke();
    if (!reduced.matches) {
      // A traveling electrical impulse visibly follows the actual nerve path.
      const t=((now*.00017+step*.21)%1),p=cubic(t);
      ctx.shadowBlur=17;ctx.shadowColor=color;
      ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.2,2.5*alpha),0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }
  // Bones are real projected volumetric geometry: stacked elliptical-body meshes,
  // three-dimensional posterior arches, spinous/transverse processes and discs.
  const levels=17;
  const bonePosition = (i) => {
    const y=(i-(levels-1)/2)*.356;
    return {x: Math.sin(i*.27)*.11, y, z: .12*Math.sin(i*.34) - .027*Math.cos(i*.17)};
  };
  function paintDisc(i, yaw,pitch) {
    const v=bonePosition(i), factor=.73+i*.020;
    const rx=.34*factor,rz=.29*factor, slices=27, cy=v.y+.15,hh=.075;
    const ring=(y)=>Array.from({length:slices+1},(_,j)=>{
      const a=j/slices*Math.PI*2;
      return project(v.x+Math.cos(a)*rx,y,v.z+Math.sin(a)*rz,yaw,pitch);
    });
    const top=ring(cy-hh),bot=ring(cy+hh);
    for(let j=0;j<slices;j++)outline([top[j],bot[j],bot[j+1],top[j+1]],'rgba(147,130,141,.53)');
    outline(top,'rgba(187,161,151,.68)','rgba(251,220,199,.45)',.75);
    curve([top[4],top[9],top[15]],1.0,'rgba(225,245,245,.36)');
  }
  function paintBone(i,yaw,pitch) {
    const v=bonePosition(i);const u=i/(levels-1);const factor=.64+u*.40;
    const rx=.38*factor,rz=.30*factor,ht=.205*(.79+u*.36);
    const ring=(offset,rMult=1,yDelta=0)=>Array.from({length:31},(_,k)=>{
      const a=k/30*Math.PI*2;
      const irregular=1+.044*Math.sin(a*5+i*1.7)+.027*Math.cos(a*9+i);
      return project(v.x+Math.cos(a)*rx*rMult*irregular,v.y+offset+yDelta,
          v.z+Math.sin(a)*rz*rMult*irregular,yaw,pitch);
    });
    // Posterior articular arch and processes, drawn behind the vertebral body.
    const arch0=project(v.x-rx*.65,v.y-.02,v.z-rz*.38,yaw,pitch);
    const arch1=project(v.x-rx*.47,v.y-.022,v.z-rz*1.6,yaw,pitch);
    const arch2=project(v.x,v.y-.012,v.z-rz*2.12,yaw,pitch);
    const arch3=project(v.x+rx*.47,v.y-.022,v.z-rz*1.6,yaw,pitch);
    const arch4=project(v.x+rx*.65,v.y-.02,v.z-rz*.38,yaw,pitch);
    curve([arch0,arch1,arch2,arch3,arch4], Math.max(6,arch0.scale*.12),'rgba(77,64,69,.87)',2);
    curve([arch0,arch1,arch2,arch3,arch4],Math.max(4,arch0.scale*.07),'#d8bc98',4,'#e5d2b0');
    curve([arch0,arch1,arch2,arch3,arch4],Math.max(1,arch0.scale*.016),'rgba(255,248,220,.72)');
    const left=[project(v.x-rx*.45,v.y-.01,v.z-rz*1.1,yaw,pitch),
      project(v.x-rx*1.32,v.y+.023,v.z-rz*1.5,yaw,pitch),
      project(v.x-rx*2.1,v.y+.082,v.z-rz*1.58,yaw,pitch)];
    const right=[project(v.x+rx*.45,v.y-.01,v.z-rz*1.1,yaw,pitch),
      project(v.x+rx*1.32,v.y+.023,v.z-rz*1.5,yaw,pitch),
      project(v.x+rx*2.1,v.y+.082,v.z-rz*1.58,yaw,pitch)];
    for(const branch of [left,right]){
      curve(branch,Math.max(4,branch[0].scale*.09),'rgba(67,54,64,.9)',4);
      curve(branch,Math.max(2,branch[0].scale*.065),'#d2b38b');
      curve(branch,Math.max(1,branch[0].scale*.021),'rgba(255,249,224,.70)');
    }
    curve([arch2,project(v.x,v.y+.056,v.z-rz*2.68,yaw,pitch),
      project(v.x,v.y+.165,v.z-rz*3.17,yaw,pitch)],Math.max(4,arch2.scale*.082),'#bca17e');
    const bottom=ring(ht*.50, .93),top=ring(-ht*.5,1.015);
    const faces=[];
    for(let j=0;j<30;j++){
      const a=(j+.5)/30*Math.PI*2;
      const normalX=Math.cos(a),normalZ=Math.sin(a);
      const light=clamp(.12, .43 + normalX*(-.65) + normalZ*(-.37), .99);
      const c=mix(94,226,light),r=mix(88,226,light),b=mix(104,208,light);
      const col=`rgb(${c+12},${r+2},${b})`;
      faces.push({points:[top[j],top[j+1],bottom[j+1],bottom[j]],z:(top[j].z+bottom[j].z)/2,color:col});
    }
    faces.sort((a,b)=>b.z-a.z).forEach(({points,color})=>outline(points,color,'rgba(71,57,66,.20)',.55));
    const center=project(v.x,v.y-ht*.5,v.z,yaw,pitch);
    const highlight=ctx.createRadialGradient(center.x-center.scale*.09,center.y-center.scale*.10,1,center.x,center.y,Math.max(center.scale*.46,10));
    highlight.addColorStop(0,'rgba(255,250,231,.97)');
    highlight.addColorStop(.55,'rgba(234,212,180,.90)');
    highlight.addColorStop(1,'rgba(122,103,107,.92)');
    outline(top,highlight,'rgba(255,239,206,.34)',1.1);
    // Thin cortical edges and subtle cancellous-bone surface pores.
    curve([top[2],top[6],top[10]],Math.max(1,center.scale*.014),'rgba(255,253,238,.76)');
    for(let k=0;k<5;k++){
      let a=(i*2.42+k*1.37),px=center.x+Math.cos(a)*center.scale*.16,py=center.y+Math.sin(a)*center.scale*.058;
      ctx.beginPath();ctx.arc(px,py,(k%2===0?1.2:.7)*clamp(.7,center.scale/80,1.6),0,Math.PI*2);
      ctx.fillStyle='rgba(109,91,85,.19)';ctx.fill();
    }
    // Painted bone seams and mineral glaze.
    const pL=project(v.x-rx*.82,v.y,v.z-.015,yaw,pitch);
    const pR=project(v.x+rx*.82,v.y,v.z-.015,yaw,pitch);
    curve([pL,project(v.x,v.y+.012,v.z-rz*.50,yaw,pitch),pR],1,'rgba(252,243,216,.20)');
  }
  function drawStaircase(yaw,pitch) {
    // Actual projected treads, turning around the vertebral axis like a helicoid.
    const amount=16;
    for(let i=0;i<amount;i++) {
      const theta=i*.70+progress*2.3-1.3;
      const yy=(i-(amount-1)/2)*.355;
      const r0=.52,r1=1.50, spread=.32;
      const corners=[
        [r0*Math.cos(theta-spread),yy,r0*Math.sin(theta-spread)],
        [r1*Math.cos(theta-spread),yy,r1*Math.sin(theta-spread)],
        [r1*Math.cos(theta+spread),yy,r1*Math.sin(theta+spread)],
        [r0*Math.cos(theta+spread),yy,r0*Math.sin(theta+spread)]
      ].map(p=>project(...p,yaw,pitch));
      const rim=corners.map(p=>({x:p.x,y:p.y+Math.max(3,p.scale*.045),z:p.z}));
      const group=Math.floor(i/(amount/4));
      const focus=1-clamp(0,Math.abs(group-progress*3)*.32,.85);
      outline([corners[1],corners[2],rim[2],rim[1]],`rgba(113,118,156,${.16*focus})`);
      outline(corners,`rgba(143,176,201,${.11*focus})`,rgba(glowColors[group],.23*focus),.7);
      curve([corners[1],corners[2]],.9,rgba(glowColors[group],.54*focus));
    }
  }
  function drawCord(yaw,pitch) {
    const cord=[];
    for(let j=0;j<72;j++){
      const t=j/71*(levels-1);
      let i=Math.min(levels-2,Math.floor(t)),f=t-i;
      const va=bonePosition(i),vb=bonePosition(i+1);
      cord.push(project(lerp(va.x,vb.x,f),lerp(va.y,vb.y,f),lerp(va.z,vb.z,f)-.49,yaw,pitch));
    }
    curve(cord,Math.max(5,cord[0].scale*.07),'rgba(251,209,135,.27)',28,'#ffe8b8');
    curve(cord,Math.max(2,cord[0].scale*.037),'rgba(254,232,173,.73)',5);
    curve(cord,Math.max(.75,cord[0].scale*.011),'#fff9dc');
  }
  function drawNerveRoots(yaw,pitch) {
    for(let i=1;i<levels-1;i++){
      const p=bonePosition(i);
      for(const sign of [-1,1]){
        const points=[
          project(p.x,p.y+.16,p.z-.48,yaw,pitch),
          project(p.x+sign*.27,p.y+.19,p.z-.56,yaw,pitch),
          project(p.x+sign*.55,p.y+.23,p.z-.57,yaw,pitch),
          project(p.x+sign*.79,p.y+.31,p.z-.42,yaw,pitch)
        ];
        curve(points,Math.max(1.2,points[0].scale*.027),'rgba(251,209,139,.32)',5,'#f7d09a');
        curve(points,Math.max(.6,points[0].scale*.008),'rgba(255,245,204,.72)');
      }
    }
  }
  function drawHeroConnections(yaw,pitch) {
    const active=progress*3;
    const canvasRect=canvas.getBoundingClientRect();
    for(let k=0;k<4;k++){
      const d=Math.abs(k-active);
      if(d>1.6)continue;
      const v=bonePosition(2+k*4);
      const start=project(v.x+.44,v.y+.13,v.z-.40,yaw,pitch);
      const rect=cards[k].getBoundingClientRect();
      // Terminate at the actual edge of the staircase card after its 3D transform.
      const endpoint=mobile.matches ? {x:width*.78,y:height*.47+k*16} :
        {x:rect.left-canvasRect.left+Math.min(28,rect.width*.055), y:rect.top-canvasRect.top+rect.height*.38};
      const alpha=clamp(.02,1.12-d*.72,1);
      bezierNerve(start,endpoint,glowColors[k],alpha,k);
    }
  }
  function drawAtmosphere() {
    const bg=ctx.createRadialGradient(width*.38,height*.46,4,width*.38,height*.46,Math.min(height*.75,width*.64));
    bg.addColorStop(0,'rgba(118,152,183,.10)');
    bg.addColorStop(.45,'rgba(115,106,166,.048)');
    bg.addColorStop(1,'rgba(14,17,40,0)');
    ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
    // Depth ticks and contour rings give the image a scientific 3D viewing environment.
    ctx.lineWidth=.65;
    for(let i=0;i<7;i++){
      const ry=(i+1)*height/8;
      ctx.beginPath();ctx.moveTo(width*.11,ry);ctx.lineTo(width*.54,ry);
      ctx.strokeStyle='rgba(203,215,239,.038)';ctx.stroke();
    }
    const center={x:width*.355,y:height*.5};
    for(let i=0;i<3;i++){
      ctx.beginPath();ctx.ellipse(center.x,center.y,Math.min(width*.28,310)+i*25,Math.min(height*.34,350)+i*23,-.23,0,Math.PI*2);
      ctx.strokeStyle=`rgba(164,170,223,${.065-i*.013})`;ctx.stroke();
    }
  }
  function draw(){
    if(!width||!height)return;
    ctx.clearRect(0,0,width,height);
    if(mobile.matches && height<500) return;
    drawAtmosphere();
    const yaw=-.37+progress*.40+easedX*.22;
    const pitch=-.06+easedY*.12;
    drawStaircase(yaw,pitch);
    drawCord(yaw,pitch);
    drawNerveRoots(yaw,pitch);
    // Back-to-front vertebral bodies, with discs visibly separating them.
    for(let i=0;i<levels;i++){
      if(i>0)paintDisc(i-1,yaw,pitch);
      paintBone(i,yaw,pitch);
    }
    drawHeroConnections(yaw,pitch);
    const focus=clamp(0,Math.round(progress*3),3);
    const mark=project(0, bonePosition(2+focus*4).y+.1,-.39,yaw,pitch);
    ctx.beginPath();ctx.arc(mark.x,mark.y,Math.min(16,mark.scale*.12),0,Math.PI*2);
    ctx.fillStyle=rgba(glowColors[focus],.23);ctx.fill();
    ctx.beginPath();ctx.arc(mark.x,mark.y,Math.min(4,mark.scale*.035),0,Math.PI*2);
    ctx.fillStyle=lighterColors[focus];ctx.shadowColor=glowColors[focus];ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;
  }
  function frame(t) {
    if(document.hidden) return;
    if(t-lastFrame < (mobile.matches ? 53 : 32)) { requestAnimationFrame(frame);return; }
    lastFrame=t;now=t;
    if(mobile.matches){progress=0;}
    else progress=lerp(progress,targetProgress,.2);
    easedX=lerp(easedX,pointerX,.065);easedY=lerp(easedY,pointerY,.065);
    if(visible){updateCards();draw();}
    if(!reduced.matches)requestAnimationFrame(frame);
  }
  function resetLayout(){
    section.classList.toggle('neural-static',mobile.matches || reduced.matches);
    progress=targetProgress=getScrollPosition();lastIndex=-1;
    cards.forEach(c=>{c.style.removeProperty('opacity');c.style.removeProperty('filter');c.style.removeProperty('transform');c.style.removeProperty('pointer-events');c.style.removeProperty('z-index');});
    updateCards();resize();
    if(reduced.matches)draw();
  }
  const boundsObserver=new ResizeObserver(resetLayout);
  boundsObserver.observe(canvas);
  new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible && reduced.matches)draw();},{threshold:0}).observe(track);
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',resetLayout,{passive:true});
  window.addEventListener('pointermove',e=>{
    if(!visible||reduced.matches||mobile.matches)return;
    pointerX=clamp(-1,(e.clientX/innerWidth-.5)*1.5,1);
    pointerY=clamp(-1,(e.clientY/innerHeight-.5)*1.5,1);
  },{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && !reduced.matches)requestAnimationFrame(frame)});
  for(const media of [mobile,reduced])media.addEventListener?.('change',()=>{resetLayout();if(!reduced.matches)requestAnimationFrame(frame)});
  document.querySelectorAll('.neuro-step img').forEach(img=>{
    img.addEventListener('error',()=>img.closest('.neuro-step')?.classList.add('img-error'));
    img.addEventListener('load',()=>img.closest('.neuro-step')?.classList.remove('img-error'));
    if(img.complete && !img.naturalWidth)img.closest('.neuro-step')?.classList.add('img-error');
  });
  document.documentElement.classList.add('neural-enhanced');
  resetLayout();
  if(!reduced.matches)requestAnimationFrame(frame);
  // Access without motion: allow every project link in the normal archive below.
})();
