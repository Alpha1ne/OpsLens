(function(){
var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function $(s){return document.querySelector(s)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function fmt(n){return Number(n).toLocaleString('en-US')}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lsGet(k,d){try{var v=localStorage.getItem('dvl:'+k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem('dvl:'+k,JSON.stringify(v))}catch(e){}}

/* ---------- svg helpers ---------- */
function T(x,y,txt,cls,anchor){return '<text x="'+x+'" y="'+y+'" class="'+(cls||'lbl')+'" text-anchor="'+(anchor||'start')+'">'+esc(txt)+'</text>'}
function box(x,y,w,h,cls,r){r=r==null?10:r;return '<rect x="'+(x+5)+'" y="'+(y+5)+'" width="'+w+'" height="'+h+'" rx="'+r+'" class="shd"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" class="'+(cls||'bx')+'"/>'}
function chip(cx,cy,txt,dot,dash){
  var w=Math.round(txt.length*8+26+(dot?12:0)),h=28,x=cx-w/2;
  return '<rect x="'+(x+3)+'" y="'+(cy-h/2+3)+'" width="'+w+'" height="'+h+'" rx="14" class="shd"/><rect x="'+x+'" y="'+(cy-h/2)+'" width="'+w+'" height="'+h+'" rx="14" class="chip"'+(dash?' stroke-dasharray="5 4"':'')+'/>'+
    (dot?'<circle cx="'+(x+16)+'" cy="'+cy+'" r="5" class="pk '+dot+'"/>':'')+
    '<text x="'+(cx+(dot?7:0))+'" y="'+(cy+5)+'" class="lbl" text-anchor="middle">'+esc(txt)+'</text>';
}
function packet(path,dur,begin,cls){
  if(reduce)return '';
  var tb=begin-0.2;if(tb<0)tb+=dur;
  return '<circle r="4.2" class="pk trail '+cls+'" opacity=".38"><animateMotion dur="'+dur+'s" begin="-'+tb.toFixed(2)+'s" repeatCount="indefinite" path="'+path+'"/></circle><circle r="6.5" class="pk '+cls+'"><animateMotion dur="'+dur+'s" begin="-'+begin.toFixed(2)+'s" repeatCount="indefinite" path="'+path+'"/></circle>';
}
function person(x,y,k){return '<circle cx="'+(x+13)+'" cy="'+(y+8)+'" r="8" class="pe p'+k+'"/><rect x="'+(x+1)+'" y="'+(y+19)+'" width="24" height="20" rx="8" class="pe p'+k+'"/>'}
/* ---------- icon library (original concept icons, 48x48 grid) ---------- */
var _pd=0,still=false;
function pop(inner){if(still||reduce){_pd+=45;return '<g>'+inner+'</g>'}var s='<g class="pop" style="animation-delay:'+Math.min(_pd,520)+'ms">'+inner+'</g>';_pd+=45;return s}
/* ---------- 3D clay icons (48x48) ---------- */
var C3={W:['#ffffff','#dfe4ea','#c3cbd5'],O:['#ffc58a','#ff9335','#d9690a'],B:['#e2effb','#a9c6e4','#86a8cc'],Y:['#fff0b2','#efbd45','#c99a28'],R:['#ffd0d4','#ee7480','#c9505b'],G:['#d9f4e6','#8fd1ae','#62b08a'],D:['#59626e','#39414b','#2a3038'],S:['#eef1f4','#cfd6de','#b0bac5']};
var G3={W:'gCw',O:'gCo',B:'gCb',Y:'gCy',R:'gCr',G:'gCg',D:'gCd',S:'gCs'},SP={W:'gSw',O:'gSo',B:'gSb',Y:'gSy',R:'gSr',G:'gSg',D:'gSd',S:'gSw'};
function f1(n){return (+n).toFixed(1)}
function b3(cx,by,hw,h,k,hd){
  hd=hd||hw*.5;var c=C3[k||'W'],ty=by-h,
  T=[[cx,ty-hd],[cx+hw,ty],[cx,ty+hd],[cx-hw,ty]],
  L=[[cx-hw,ty],[cx,ty+hd],[cx,by+hd],[cx-hw,by]],R=[[cx+hw,ty],[cx,ty+hd],[cx,by+hd],[cx+hw,by]];
  function pg(a,f){return '<polygon points="'+a.map(function(p){return f1(p[0])+','+f1(p[1])}).join(' ')+'" fill="'+f+'" stroke="'+f+'" stroke-width="1.2"/>'}
  return pg(L,c[1])+pg(R,c[2])+pg(T,c[0])+'<path d="M'+f1(cx-hw)+','+f1(ty)+' L'+f1(cx)+','+f1(ty+hd)+' L'+f1(cx+hw)+','+f1(ty)+'" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width=".8"/>';
}
function cy3(cx,by,rx,h,k,top){
  var ry=rx*.48,t=top||C3[k||'W'][0];
  return '<path d="M'+f1(cx-rx)+','+f1(by-h)+' V'+f1(by)+' A'+f1(rx)+','+f1(ry)+' 0 0 0 '+f1(cx+rx)+','+f1(by)+' V'+f1(by-h)+'Z" fill="url(#'+G3[k||'W']+')"/><ellipse cx="'+f1(cx)+'" cy="'+f1(by-h)+'" rx="'+f1(rx)+'" ry="'+f1(ry)+'" fill="'+t+'" stroke="#fff" stroke-opacity=".8" stroke-width=".8"/>';
}
function sp3(cx,cy,r,k){return '<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="'+f1(r)+'" fill="url(#'+SP[k||'W']+')"/>'}
function pn3(x0,y0,W,H,fill,th){ /* upright panel along the +x iso axis, with thickness */
  th=th===undefined?2.5:th;var x1=x0+W,y1=y0+W/2,
  a=[[x0,y0],[x1,y1],[x1,y1-H],[x0,y0-H]];
  var side='<polygon points="'+f1(x1)+','+f1(y1)+' '+f1(x1+th)+','+f1(y1-th/2)+' '+f1(x1+th)+','+f1(y1-H-th/2)+' '+f1(x1)+','+f1(y1-H)+'" fill="#b6bfca"/>';
  var top='<polygon points="'+f1(x0)+','+f1(y0-H)+' '+f1(x1)+','+f1(y1-H)+' '+f1(x1+th)+','+f1(y1-H-th/2)+' '+f1(x0+th)+','+f1(y0-H-th/2)+'" fill="#f4f6f8"/>';
  return side+top+'<polygon points="'+a.map(function(p){return f1(p[0])+','+f1(p[1])}).join(' ')+'" fill="'+fill+'" stroke="'+fill+'" stroke-width="1"/>';
}
function ln3(a,col,w){return '<path d="'+a+'" fill="none" stroke="'+col+'" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round"/>'}
function inP(x0,y0,W,H,u,v,uw,vh,fill){ /* rect inside a pn3 panel using panel-local fractions */
  var ax=x0+W*u,ay=y0+W*u/2-H*v,bx=x0+W*(u+uw),by=y0+W*(u+uw)/2-H*v;
  return '<polygon points="'+f1(ax)+','+f1(ay)+' '+f1(bx)+','+f1(by)+' '+f1(bx)+','+f1(by-H*vh)+' '+f1(ax)+','+f1(ay-H*vh)+'" fill="'+fill+'"/>';
}
function wrap3(s){return '<g stroke="none" stroke-linejoin="round" stroke-linecap="round">'+s+'</g>'}
var HEXK={'f-ok':'O','f-bad':'R','f-wait':'Y','f-run':'B','f-s':'W','f-pad':'S'};
var ICONS3={
 user:function(o){var k=['W','O','B','Y','G','R'][((o.k||0)%6)]||'W';return wrap3(cy3(24,43,10,14,k)+sp3(24,16,9,k))},
 laptop:function(){return wrap3(b3(24,41,18,3,'W',9)+pn3(6,36,18,19,'#2b3038',2)+inP(6,36,18,19,.1,.1,.8,.8,'#e6f0fa')+inP(6,36,18,19,.18,.6,.34,.14,'#ff8a1f')+inP(6,36,18,19,.18,.78,.6,.08,'#c8d3de'))},
 server:function(o){
  var s='',k,led=(o.led==='f-bad')?'#e5545f':(o.led==='f-wait'?'#f2c744':'#ff8a1f'),kk=o.dim?'S':'W';
  for(k=2;k>=0;k--){var by=43-k*13;s+=b3(24,by,17,9,kk,8.5)+'<circle cx="'+f1(13.5)+'" cy="'+f1(by-4.2+2)+'" r="1.7" fill="'+led+'">'+(o.blink&&!reduce&&k===0?'<animate attributeName="opacity" values="1;.25;1" dur="1.4s" repeatCount="indefinite"/>':'')+'</circle>'+ln3('M19,'+f1(by-1.2+3)+' l7,3.5',"#aab4bf",1.4)}
  return wrap3(s)},
 db:function(){return wrap3(cy3(24,42,15,10,'W')+cy3(24,31,15,10,'W')+'<path d="M9,30.5 A15,7.2 0 0 0 39,30.5" fill="none" stroke="#ff8a1f" stroke-width="2"/>'+cy3(24,20,15,10,'W')+'<path d="M9,19.5 A15,7.2 0 0 0 39,19.5" fill="none" stroke="#ff8a1f" stroke-width="2"/>')},
 cloud:function(){return wrap3('<rect x="6" y="26" width="36" height="13" rx="6.5" fill="url(#gCw)"/>'+sp3(15,27,9)+sp3(26,20,12)+sp3(36,28,8.5))},
 globe:function(){return wrap3(sp3(24,24,18,'B')+'<ellipse cx="24" cy="24" rx="7.5" ry="18" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.4"/><path d="M7,22 Q24,30 41,22" fill="none" stroke="#ff8a1f" stroke-width="2.2"/><path d="M8,32 Q24,38 40,32M8,13 Q24,19 40,13" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.3"/>')},
 lb:function(){return wrap3(ln3('M4,26 H15 M30,20 L40,13 M31,26 H41 M30,32 L40,39','#ff8a1f',2)+b3(22,36,10,16,'O',5)+b3(41,17,4.5,6,'W')+b3(42,30,4.5,6,'W')+b3(41,43,4.5,6,'W'))},
 firewall:function(){return wrap3(b3(23,32,9,9,'O',4.5)+b3(12,44,10,10,'W',5)+b3(34,44,10,10,'W',5))},
 shield:function(){var d='M24,5 L39,10 V23 C39,33 32,40 24,44 C16,40 9,33 9,23 V10Z';return wrap3('<g transform="translate(0 3)"><path d="'+d+'" fill="#8ea9c7"/></g><g transform="translate(0 1.6)"><path d="'+d+'" fill="#a9c6e4"/></g><path d="'+d+'" fill="url(#gCb)" stroke="#fff" stroke-opacity=".8" stroke-width=".9"/>'+ln3('M16,24 L22,30 L33,17','#fff',3.4))},
 container:function(){return wrap3(b3(24,40,18,16,'B',9)+ln3('M12,22 V37 M17,25 V40 M7,18 V33','#86a8cc',1.4)+ln3('M31,26 V41 M36,23 V38 M41,20 V35','#7a9bc0',1.4)+'<path d="M6,22 L24,31 L42,22" fill="none" stroke="#ff8a1f" stroke-width="2"/>')},
 layers:function(){return wrap3(b3(24,43,19,6,'W',9.5)+b3(24,34,19,6,'B',9.5)+b3(24,25,19,6,'O',9.5))},
 bucket:function(){return wrap3('<path d="M8,16 L13,40 Q24,46 35,40 L40,16Z" fill="url(#gCb)"/><ellipse cx="24" cy="16" rx="16" ry="6.5" fill="#f4f8fc" stroke="#fff"/><ellipse cx="24" cy="16" rx="13" ry="4.8" fill="#9fbddb"/><path d="M10,27 Q24,34 38,27" fill="none" stroke="#ff8a1f" stroke-width="2.2"/>')},
 file:function(o){var t=o.t||'doc',acc=t==='img'?'#ff8a1f':t==='pdf'?'#e5545f':t==='html'?'#3f8fd0':'#c3cbd5';
  return wrap3(pn3(10,40,26,32,'#ffffff',2.5)+inP(10,40,26,32,.18,.5,.64,.1,acc)+inP(10,40,26,32,.18,.35,.5,.07,'#d3d9e0')+inP(10,40,26,32,.18,.22,.64,.07,'#d3d9e0')+inP(10,40,26,32,.18,.88,.35,.07,'#ff8a1f'))},
 disk:function(){return wrap3(b3(24,40,19,9,'W',9.5)+'<ellipse cx="22" cy="28.5" rx="10" ry="4.6" fill="#39414b"/><ellipse cx="22" cy="28.2" rx="3.4" ry="1.6" fill="#ff8a1f"/><circle cx="37" cy="35" r="1.8" fill="#ff8a1f"/>')},
 key:function(){return wrap3(b3(30,30,16,4,'Y',3)+'<circle cx="14" cy="24" r="9" fill="none" stroke="#c99a28" stroke-width="6.5"/><circle cx="14" cy="24" r="9" fill="none" stroke="#f6c65a" stroke-width="5"/><circle cx="14" cy="24" r="9" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1" transform="translate(0 -1.4)"/>')},
 lock:function(){return wrap3(ln3('M15,24 V16 A9,9 0 0 1 33,16 V24','#9aa4b0',5.5)+ln3('M15,24 V16 A9,9 0 0 1 33,16 V24','#e1e6ec',3.2)+b3(24,43,13,17,'Y',6.5)+'<ellipse cx="18.5" cy="35" rx="2" ry="3" fill="#39414b"/>')},
 clock:function(){return wrap3(cy3(24,38,19,8,'W','#ffffff')+'<path d="M24,22 V29 M24,29 L31,32" fill="none" stroke="#ff8a1f" stroke-width="2.6" stroke-linecap="round" transform="translate(0 1)"/><circle cx="24" cy="30" r="1.8" fill="#39414b"/>')},
 gear:function(){var s='',a,pts=[];for(a=0;a<360;a+=45){pts.push([24+18*Math.cos(a*Math.PI/180),30+9*Math.sin(a*Math.PI/180)])}
  pts.sort(function(p,q){return p[1]-q[1]});pts.forEach(function(p){s+=b3(p[0],p[1]+5,3.2,7,'S',1.8)});
  return wrap3(cy3(24,37,15,8,'S','#f4f6f8')+s.replace(/<\/?$/,'')+'<ellipse cx="24" cy="29" rx="6" ry="2.9" fill="#39414b"/><ellipse cx="24" cy="28.4" rx="3.2" ry="1.5" fill="#ff8a1f"/>')},
 commit:function(){return wrap3(b3(24,30,22,3,'S',4)+sp3(24,24,9,'W')+'<circle cx="24" cy="24" r="9" fill="none" stroke="#ff8a1f" stroke-width="3"/>')},
 branch:function(){return wrap3(ln3('M13,14 V34 M35,20 C35,30 22,31 13,34','#aab4bf',3.6)+ln3('M13,14 V34 M35,20 C35,30 22,31 13,34','#eef1f4',1.6)+sp3(13,11,6)+sp3(13,38,6,'O')+sp3(35,16,6))},
 flask:function(){return wrap3('<path d="M19,5 H29 V19 L41,40 Q43,45 38,45 H10 Q5,45 7,40 L19,19Z" fill="url(#gCb)" opacity=".85"/><path d="M14,32 H34 L41,40 Q43,45 38,45 H10 Q5,45 7,40Z" fill="url(#gCo)"/><ellipse cx="24" cy="5.5" rx="5.5" ry="2" fill="#fff" stroke="#c3cbd5" stroke-width=".8"/><path d="M20,10 V19" stroke="#fff" stroke-opacity=".9" stroke-width="1.6" stroke-linecap="round"/>')},
 pkg:function(){return wrap3(b3(24,42,17,22,'Y',8.5)+'<polygon points="24,12.5 24,34.5 28.5,36.7 28.5,14.7" fill="#fff" opacity=".9"/><polygon points="24,12.5 28.5,14.7 24,16.9 19.5,14.7" fill="#fff"/>')},
 window:function(){return wrap3(pn3(5,40,34,30,'#ffffff',3)+inP(5,40,34,30,0,.82,1,.18,'#e4e8ed')+'<circle cx="9.5" cy="15.7" r="1.4" fill="#e5545f"/><circle cx="13.5" cy="17.7" r="1.4" fill="#f2c744"/><circle cx="17.5" cy="19.7" r="1.4" fill="#3fae78"/>'+inP(5,40,34,30,.1,.6,.8,.12,'#ffb066')+inP(5,40,34,30,.1,.4,.5,.07,'#d3d9e0')+inP(5,40,34,30,.1,.25,.65,.07,'#d3d9e0'))},
 rocket:function(){return wrap3(b3(10,36,4,8,'O',2)+b3(38,36,4,8,'O',2)+'<ellipse cx="24" cy="44" rx="4" ry="2" fill="#ffb066"/><path d="M17,14 Q24,0 31,14 V34 H17Z" fill="url(#gCw)"/><path d="M17,14 Q24,0 31,14Z" fill="url(#gCo)"/><circle cx="24" cy="22" r="4.2" fill="#8fb4da" stroke="#fff" stroke-width="1.2"/><ellipse cx="24" cy="34" rx="7" ry="3.2" fill="#ff9335"/>')},
 folder:function(){return wrap3(b3(18,38,9,22,'Y',4.5)+b3(24,42,19,15,'Y',9.5)+'<path d="M5,33 L24,42 L43,33" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>')},
 clipboard:function(){return wrap3(pn3(9,41,28,34,'#ffffff',2.8)+inP(9,41,28,34,.16,.62,.1,.09,'#ff8a1f')+inP(9,41,28,34,.34,.62,.5,.07,'#d3d9e0')+inP(9,41,28,34,.16,.42,.1,.09,'#ff8a1f')+inP(9,41,28,34,.34,.42,.5,.07,'#d3d9e0')+inP(9,41,28,34,.16,.22,.1,.09,'#d3d9e0')+b3(23,9,5,3,'D',2.5))},
 pod:function(o){var k=HEXK[o.f||'f-ok']||'O',c=C3[k],ry=8.5,rx=17,ty=17,h=16,
  H=function(cy){return [[24+rx,cy],[24+rx/2,cy+ry*.87],[24-rx/2,cy+ry*.87],[24-rx,cy],[24-rx/2,cy-ry*.87],[24+rx/2,cy-ry*.87]]};
  var T=H(ty),B=H(ty+h),pg=function(a,f){return '<polygon points="'+a.map(function(p){return f1(p[0])+','+f1(p[1])}).join(' ')+'" fill="'+f+'" stroke="'+f+'" stroke-width="1"/>'};
  var s=pg([T[3],T[2],B[2],B[3]],c[1])+pg([T[2],T[1],B[1],B[2]],c[1])+pg([T[1],T[0],B[0],B[1]],c[2])+pg(T,c[0]);
  return wrap3(s+'<ellipse cx="24" cy="'+f1(ty)+'" rx="9" ry="4.4" fill="#fff" opacity=".95"/><ellipse cx="24" cy="'+f1(ty)+'" rx="4.4" ry="2.1" fill="'+c[1]+'"/>')}
};

var ICONS={
 user:function(o){var c='f-p'+(o.k||0);return '<circle cx="24" cy="15" r="8" class="'+c+'"/><path d="M8 43c0-9 7-15 16-15s16 6 16 15z" class="'+c+'"/>'},
 laptop:function(){return '<rect x="9" y="9" width="30" height="22" rx="3" class="f-s"/><rect x="13" y="13" width="22" height="14" rx="1.5" class="f-run"/><path d="M4 36h40l-3 6H7z" class="f-pad"/>'},
 server:function(o){
  var led=o.led||'f-res',s='',k,y;
  for(k=0;k<3;k++){
    y=5+k*13;
    s+='<rect x="5" y="'+y+'" width="38" height="11" rx="3" class="'+(o.dim?'f-pad':'f-s')+'"/><circle cx="12" cy="'+(y+5.5)+'" r="2.4" class="'+led+'">'+(o.blink&&!reduce?'<animate attributeName="opacity" values="1;.2;1" dur="1.4s" begin="-'+(k*0.4)+'s" repeatCount="indefinite"/>':'')+'</circle><path d="M22 '+(y+5.5)+'h15"/>';
  }
  return s;
 },
 db:function(){return '<path d="M8 12v24c0 3.3 7.2 6 16 6s16-2.7 16-6V12z" class="f-run"/><path d="M8 24c0 3.3 7.2 6 16 6s16-2.7 16-6"/><ellipse cx="24" cy="12" rx="16" ry="6" class="f-s"/>'},
 cloud:function(){return '<path d="M14 38a9 9 0 0 1 0-18 12 12 0 0 1 23-3 10 10 0 0 1 0 21z" class="f-s"/>'},
 globe:function(){return '<circle cx="24" cy="24" r="17" class="f-run"/><ellipse cx="24" cy="24" rx="7" ry="17"/><path d="M7 24h34M10 14q14 6 28 0M10 34q14-6 28 0"/>'},
 lb:function(){return '<path d="M3 24h10"/><path d="M28 20l11-9M29 24h10M28 28l11 9"/><circle cx="21" cy="24" r="8" class="f-ok"/><path d="M18 24h6M21 21v6"/><circle cx="42" cy="11" r="3.5" class="f-req"/><circle cx="42" cy="24" r="3.5" class="f-req"/><circle cx="42" cy="37" r="3.5" class="f-req"/>'},
 firewall:function(){return '<rect x="5" y="9" width="38" height="30" rx="3" class="f-wait"/><path d="M5 19h38M5 29h38M19 9v10M31 9v10M13 19v10M25 19v10M37 19v10M19 29v10M31 29v10"/>'},
 shield:function(){return '<path d="M24 4l16 6v12c0 11-7 18-16 22-9-4-16-11-16-22V10z" class="f-run"/><path d="M16 24l6 6 11-12"/>'},
 container:function(){return '<rect x="4" y="11" width="40" height="26" rx="3" class="f-run"/><path d="M12 15v18M20 15v18M28 15v18M36 15v18"/>'},
 layers:function(){return '<rect x="6" y="6" width="36" height="9" rx="3" class="f-ok"/><rect x="6" y="19" width="36" height="9" rx="3" class="f-run"/><rect x="6" y="32" width="36" height="9" rx="3" class="f-pad"/>'},
 bucket:function(){return '<path d="M7 14h34l-4 25a4 4 0 0 1-4 3.5H15a4 4 0 0 1-4-3.5z" class="f-run"/><ellipse cx="24" cy="14" rx="17" ry="5" class="f-s"/><path d="M11 26h26"/>'},
 file:function(o){
  var t=o.t||'doc',d='';
  if(t==='img')d='<path d="M14 38l8-10 6 7 5-5 6 8z" class="f-ok"/><circle cx="31" cy="22" r="3" class="f-slow"/>';
  else if(t==='pdf')d='<rect x="11" y="26" width="27" height="10" class="f-bad"/>';
  else if(t==='html')d='<path d="M21 24l-6 7 6 7M28 24l6 7-6 7"/>';
  else d='<path d="M17 24h14M17 30h14M17 36h9"/>';
  return '<path d="M11 4h18l9 9v31H11z" class="f-s"/><path d="M29 4v9h9"/>'+d;
 },
 disk:function(){return '<rect x="5" y="11" width="38" height="26" rx="5" class="f-pad"/><circle cx="19" cy="24" r="7" class="f-s"/><circle cx="19" cy="24" r="2" class="f-ink"/><path d="M31 18h8M31 24h8"/><circle cx="37" cy="31" r="2" class="f-res"/>'},
 key:function(){return '<circle cx="15" cy="24" r="8" class="f-wait"/><path d="M23 24h20M36 24v7M42 24v5"/>'},
 lock:function(){return '<rect x="9" y="21" width="30" height="21" rx="4" class="f-wait"/><path d="M15 21v-6a9 9 0 0 1 18 0v6"/><circle cx="24" cy="31" r="2.5" class="f-ink"/>'},
 clock:function(){return '<circle cx="24" cy="24" r="18" class="f-s"/><path d="M24 12v13l9 5"/>'},
 gear:function(o){
  var t='',a;
  for(a=0;a<360;a+=45)t+='<rect x="21" y="3" width="6" height="9" rx="1.5" transform="rotate('+a+' 24 24)" class="f-pad"/>';
  return '<g>'+(o.spin&&!reduce?'<animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="4s" repeatCount="indefinite"/>':'')+t+'<circle cx="24" cy="24" r="14" class="f-pad"/><circle cx="24" cy="24" r="5" class="f-s"/></g>';
 },
 commit:function(){return '<path d="M2 24h14M32 24h14"/><circle cx="24" cy="24" r="8" class="f-s"/>'},
 branch:function(){return '<path d="M13 14v20M35 20c0 9-10 8-22 14"/><circle cx="13" cy="10" r="5" class="f-s"/><circle cx="13" cy="38" r="5" class="f-s"/><circle cx="35" cy="16" r="5" class="f-s"/>'},
 flask:function(){return '<path d="M18 5h12M20 5v14L8 39a3 3 0 0 0 2.6 4.5h26.8A3 3 0 0 0 40 39L28 19V5" class="f-s"/><path d="M13 32h22l4 7a2 2 0 0 1-1.8 3H10.8A2 2 0 0 1 9 39z" class="f-ok"/>'},
 pkg:function(){return '<path d="M24 4l17 9v22l-17 9-17-9V13z" class="f-wait"/><path d="M7 13l17 9 17-9M24 22v22"/>'},
 window:function(){return '<rect x="4" y="8" width="40" height="32" rx="4" class="f-s"/><path d="M4 18h40"/><circle cx="10" cy="13" r="1.6" class="f-red"/><circle cx="16" cy="13" r="1.6" class="f-queue"/><circle cx="22" cy="13" r="1.6" class="f-res"/><rect x="9" y="23" width="14" height="12" class="f-run"/>'},
 rocket:function(){return '<path d="M24 3c8 6 10 15 8 26H16C14 18 16 9 24 3z" class="f-s"/><circle cx="24" cy="17" r="4" class="f-run"/><path d="M16 29l-7 7 3 3 5-4M32 29l7 7-3 3-5-4" class="f-bad"/><path d="M20 33c1 5 2 8 4 11 2-3 3-6 4-11" class="f-wait"/>'},
 folder:function(){return '<path d="M4 12h15l5 6h20v23H4z" class="f-wait"/><path d="M4 18h40"/>'},
 clipboard:function(){return '<rect x="9" y="8" width="30" height="35" rx="4" class="f-s"/><rect x="17" y="4" width="14" height="8" rx="3" class="f-pad"/><path d="M15 22l3 3 5-6M27 22h8M15 33l3 3 5-6M27 33h8"/>'},
 pod:function(o){return '<path d="M24 4l17 10v20L24 44 7 34V14z" class="'+(o.f||'f-ok')+'"/><rect x="16" y="18" width="16" height="13" rx="2" class="f-s"/>'}
};
function ext(body){
  if(!ISOK.clay)return body;
  return '<g class="ib" transform="translate(0 4.2)">'+body+'</g><g class="ib" transform="translate(0 2.8)">'+body+'</g><g class="ib" transform="translate(0 1.4)">'+body+'</g><g class="ih" transform="translate(0 -.9)">'+body+'</g>'+body;
}
function ic(name,x,y,size,o){
  o=o||{};
  var s=size/48,body=ICONS3[name](o);
  if(o.run&&!reduce&&name!=='gear')body='<g><animateTransform attributeName="transform" type="rotate" values="-6 24 24;6 24 24;-6 24 24" dur="0.8s" repeatCount="indefinite"/>'+body+'</g>';
  return '<g class="i" transform="translate('+x+' '+y+') scale('+s.toFixed(3)+')" stroke-width="'+(2.6/s).toFixed(2)+'"'+(o.dim?' opacity=".5"':'')+'>'+body+'</g>';
}
function icSvg(name,px,o){return '<svg class="i" viewBox="0 0 48 48" width="'+px+'" height="'+px+'" stroke-width="2.6" aria-hidden="true">'+ICONS3[name](o||{})+'</svg>'}


/* ---------- state ---------- */
var LESSONS=[];
var cur=null, idx=0, timers=[], PG={}, gameOn=false;
function later(a,b){var fn=typeof a==='function'?a:b,ms=typeof a==='function'?b:a;timers.push(setTimeout(fn,ms))}
function clearTimers(){timers.forEach(clearTimeout);timers=[]}
function getPG(L){if(!PG[L.id])PG[L.id]=L.pg.init();return PG[L.id]}

/* =========================================================
   LESSON 1: scaling a web app
   ========================================================= */
function scaleModel(s){
  var failed=s.failed&&s.servers>1;
  var healthy=s.servers-(failed?1:0), load=s.users*0.05, cap=healthy*60, u=load/cap, m={healthy:healthy,load:load,cap:cap,u:u,failed:failed};
  if(u>=1){m.p50='timeout';m.p99='timeout';m.thr=Math.round(cap)}
  else{var p=Math.round(120/(1-0.9*Math.min(u,0.97)));m.p50=p+' ms';m.p99=Math.round(p*(1.4+2*u))+' ms';m.thr=Math.round(load)}
  m.util=Math.round(Math.min(u,1)*100);
  return m;
}
function scaleMetrics(s){
  var m=scaleModel(s), st=m.u>=1?'bad':(m.u>0.7?'warn':'ok');
  return [['P50 latency',m.p50,st],['P99 latency',m.p99,st],['Throughput',m.thr+' req/s',m.load>m.cap?'bad':'ok'],['Utilization',m.util+'%',st]];
}
/* ---------- isometric toolkit ---------- */
var IW=22,IH=12.5,IOX=320,IOY=56;
function P(x,y,z){return [IOX+(x-y)*IW,IOY+(x+y)*IH-(z||0)]}
function pts(a){return a.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')}
function poly(a,fill,st,sw,extra){return '<polygon points="'+pts(a)+'" fill="'+fill+'" stroke="'+st+'" stroke-width="'+sw+'" stroke-linejoin="round"'+(extra||'')+'/>'}
var PAL={
  metal:['#eef5f8','#b3c5d0','#8196a4'],teal:['#ffc58a','#25ab9b','#187c70'],dark:['#1d3947','#142b36','#0e1f29'],
  red:['#ff9aa4','#d24a58','#9c3340'],amber:['#ffe48f','#d9a83c','#9c7626'],blue:['#9adcff','#3a9fd9','#2a7099'],
  green:['#a4f7cf','#33b67e','#21835c'],slab:['#0f202b','#0a1720','#07111a'],grey:['#7d8f9a','#5b6c77','#46555f'],
  purple:['#d2b0ff','#8d62d6','#65449e']
};
var PAL_DARK=JSON.parse(JSON.stringify(PAL)),ISOK;
var PAL_CLAY={metal:['#ffffff','#d6dce3','#b7c0ca'],teal:['#ffd4a6','#ff9a3c','#e0770f'],dark:['#f6f7f9','#e4e8ec','#d3d9df'],red:['#ffc2c8','#ee6f7a','#c9505b'],amber:['#ffeaa0','#f0bb3f','#c6962a'],blue:['#d6e8f8','#9fc2e6','#7a9fc9'],green:['#d3f2e1','#86cfa8','#62b08a'],slab:['#f5f7f9','#e9ecf0','#d8dde3'],grey:['#d3d9df','#b8c0c9','#9ea8b2'],purple:['#ece0ff','#c3a6ee','#a283d4']};
function isoTheme(){
  var d=false,src=PAL_CLAY,k;
  for(k in src)PAL[k]=src[k];
  ISOK=d?{edge:'rgba(3,12,18,.85)',shc:'#000',sho:.42,slot:'#0a1720',card:'rgba(6,14,21,.9)',idle:'#2a6670',floor:'#ff8a1f',flo:.09,amb:'#ff8a1f',ambo:.16,clay:0,node:'#0b1a24',gs:'0 0 8px ',pg:.16,hi:.5,panel:'fill-opacity=".05"'}:
         {edge:'rgba(105,118,138,.55)',shc:'#3a4658',sho:.07,slot:'#2b3038',card:'rgba(255,255,255,.96)',idle:'#b4bcc6',floor:'#8a96a5',flo:.16,amb:'#ffffff',ambo:.9,clay:1,node:'#ffffff',gs:'0 0 4px ',pg:.07,hi:.9,panel:'fill-opacity=".35"'};
}
isoTheme();
/* colour helpers and gradients */
var GID=0;
function hx(h){h=h.replace('#','');return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]}
function mixc(h,f){var c=hx(h),t=f<0?0:255,k=Math.abs(f);return 'rgb('+c.map(function(v){return Math.round(v+(t-v)*k)}).join(',')+')'}
function lg(c1,c2,x1,y1,x2,y2){var id='g'+(++GID);return ['<linearGradient id="'+id+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient>','url(#'+id+')']}
function isoDefs(){return '<defs><filter id="bl3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter><filter id="bl7" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter><radialGradient id="fadeg"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="fm" maskUnits="userSpaceOnUse" x="-100" y="-60" width="900" height="560"><rect x="-100" y="-60" width="900" height="560" fill="url(#fadeg)" transform="translate(0,0)"/></mask><radialGradient id="amb" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="'+ISOK.amb+'" stop-opacity="'+ISOK.ambo+'"/><stop offset="1" stop-color="'+ISOK.amb+'" stop-opacity="0"/></radialGradient></defs>'}
/* faint isometric floor under the whole scene, with a soft ambient glow */
function isoFloor(){
  if(ISOK.clay)return '<ellipse cx="'+IOX+'" cy="'+(IOY+170)+'" rx="360" ry="185" fill="url(#amb)"/>';
  var g='<ellipse cx="'+IOX+'" cy="'+(IOY+170)+'" rx="330" ry="170" fill="url(#amb)"/><g mask="url(#fm)" stroke="'+ISOK.floor+'" stroke-opacity="'+ISOK.flo+'" stroke-width="1" fill="none">',i,a,b;
  for(i=-3;i<=17;i++){a=P(i,-3,0);b=P(i,17,0);g+='<path d="M'+a[0].toFixed(0)+','+a[1].toFixed(0)+' L'+b[0].toFixed(0)+','+b[1].toFixed(0)+'"/>';a=P(-3,i,0);b=P(17,i,0);g+='<path d="M'+a[0].toFixed(0)+','+a[1].toFixed(0)+' L'+b[0].toFixed(0)+','+b[1].toFixed(0)+'"/>'}
  return g+'</g>';
}
function fpoly(x,y,w,d,z,dx,dy){return pts([P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)].map(function(p){return [p[0]+dx,p[1]+dy]}))}
/* a 3D box: x,y,z = back corner on the floor grid, w,d,h = size. Gradient faces, soft shadow, lit edges */
function ibox(x,y,z,w,d,h,pal,o){
  o=o||{};
  var c=typeof pal==='string'?PAL[pal]:pal,st=o.stroke||ISOK.edge,sw=o.sw||1;
  var t=[P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)];
  var l=[P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)];
  var r=[P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)];
  var K=ISOK.clay?.3:1,gl=lg(mixc(c[1],.12*(ISOK.clay?.5:1)),mixc(c[1],-.32*K),0,0,0,1),gr=lg(mixc(c[2],.1*(ISOK.clay?.5:1)),mixc(c[2],-.38*K),0,0,0,1),gt=lg(mixc(c[0],.16*(ISOK.clay?.4:1)),mixc(c[0],-.08*K),0,0,1,1);
  var sh=(o.noshadow||h<5)?'':'<polygon points="'+fpoly(x,y,w,d,z,h*0.45,h*0.18)+'" fill="'+ISOK.shc+'" opacity="'+ISOK.sho+'" filter="url(#bl3)"/>';
  var hi='<path d="M'+t[3][0].toFixed(1)+','+t[3][1].toFixed(1)+' L'+t[2][0].toFixed(1)+','+t[2][1].toFixed(1)+' L'+t[1][0].toFixed(1)+','+t[1][1].toFixed(1)+'" fill="none" stroke="#fff" stroke-opacity="'+ISOK.hi+'" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>';
  var vh='<path d="M'+l[1][0].toFixed(1)+','+l[1][1].toFixed(1)+' L'+l[2][0].toFixed(1)+','+l[2][1].toFixed(1)+'" stroke="#fff" stroke-opacity=".22" stroke-width="1"/>';
  return sh+'<g'+(o.op?' opacity="'+(ISOK.clay?Math.max(o.op,.94):o.op)+'"':'')+(o.glow?' style="filter:drop-shadow('+ISOK.gs+o.glow+')"':'')+'>'+gl[0]+gr[0]+gt[0]+poly(l,o.round?c[1]:gl[1],o.round?c[1]:st,o.round?o.rw:sw)+poly(r,o.round?c[2]:gr[1],o.round?c[2]:st,o.round?o.rw:sw)+poly(t,o.round?c[0]:gt[1],o.round?c[0]:st,o.round?o.rw:sw)+hi+vh+'</g>';
}
/* flat slab with a glowing rim: the "platform" every object stands on */
function plat(x,y,w,d,tone,dashed){
  if(ISOK.clay){var ac=tone&&tone!=='idle',cc={ok:'#ff8a1f',run:'#3f8fd0',bad:'#e5545f',wait:'#d9a21b'}[tone||'idle'];
    var sh='<polygon points="'+fpoly(x,y,w,d,0,7,10)+'" fill="#3a4658" opacity=".24" filter="url(#bl7)"/>',a=P(x,y+d,1.2),b=P(x+w,y+d,1.2),c=P(x+w,y,1.2),dp='M'+a[0].toFixed(1)+','+a[1].toFixed(1)+' L'+b[0].toFixed(1)+','+b[1].toFixed(1)+' L'+c[0].toFixed(1)+','+c[1].toFixed(1);
    return sh+ibox(x+.13,y+.13,3,w-.26,d-.26,2,'metal',{round:1,rw:6,noshadow:true})+(ac?'<path d="'+dp+'" fill="none" stroke="'+cc+'" stroke-width="6" opacity=".4" filter="url(#bl3)" class="gp2"/>':'')+'<path d="'+dp+'" fill="none" stroke="'+(ac?cc:'#d5dae0')+'" stroke-width="2.2" stroke-linecap="round"'+(dashed?' stroke-dasharray="6 5"':'')+'/>';}
  var col={ok:'#ff8a1f',run:'#3f8fd0',bad:'#ff5f6d',idle:ISOK.idle,wait:'#f2c744'}[tone||'idle'];
  var t=[P(x,y,5),P(x+w,y,5),P(x+w,y+d,5),P(x,y+d,5)],act=tone&&tone!=='idle',i,gl='';
  if(act)gl='<polygon points="'+fpoly(x-.15,y-.15,w+.3,d+.3,0,0,4)+'" fill="'+col+'" opacity="'+ISOK.pg+'" filter="url(#bl7)"/>';
  for(i=1;i<3;i++){var a=P(x+w*i/3,y,5),b=P(x+w*i/3,y+d,5),c=P(x,y+d*i/3,5),e=P(x+w,y+d*i/3,5);
    gl+='<path d="M'+a[0].toFixed(1)+','+a[1].toFixed(1)+' L'+b[0].toFixed(1)+','+b[1].toFixed(1)+' M'+c[0].toFixed(1)+','+c[1].toFixed(1)+' L'+e[0].toFixed(1)+','+e[1].toFixed(1)+'" stroke="'+col+'" stroke-opacity=".16" stroke-width=".8" fill="none"/>'}
  return gl+ibox(x,y,0,w,d,5,'slab',{stroke:col,sw:1.4,glow:act?col:null,noshadow:true})+
    '<polygon points="'+pts(t)+'" fill="'+col+'" fill-opacity=".05" stroke="'+col+'" stroke-width="1.1" stroke-opacity=".6"'+(dashed?' stroke-dasharray="5 4"':'')+'/>'+
    [0,1,2,3].map(function(k){var p=t[k],q=t[(k+1)%4],u=t[(k+3)%4],m=function(a,b){return [a[0]+(b[0]-a[0])*.16,a[1]+(b[1]-a[1])*.16]},A=m(p,q),B=m(p,u);return '<path d="M'+A[0].toFixed(1)+','+A[1].toFixed(1)+' L'+p[0].toFixed(1)+','+p[1].toFixed(1)+' L'+B[0].toFixed(1)+','+B[1].toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="1.8" stroke-linecap="round" stroke-opacity="'+(act?.95:.45)+'"/>'}).join('');
}
/* a floor ring, used for security groups and VPC edges */
function ring(x,y,w,d,col,dash,z){
  z=z||5.5;
  return '<polygon points="'+pts([P(x,y,z),P(x+w,y,z),P(x+w,y+d,z),P(x,y+d,z)])+'" fill="'+(col||'#3f8fd0')+'" fill-opacity=".07" stroke="'+(col||'#3f8fd0')+'" stroke-width="1.6" stroke-dasharray="'+(dash||'6 5')+'"/>';
}
function ledDot(x,y,z,cls,blink,k){
  var p=P(x,y,z);
  return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.1" class="'+cls+'">'+(blink&&!reduce?'<animate attributeName="opacity" values="1;.25;1" dur="1.4s" begin="-'+((k||0)*0.4)+'s" repeatCount="indefinite"/>':'')+'</circle>';
}
/* server rack: a metal tower with slots and status lights on its right face */
function rack(x,y,tone,o){
  o=o||{};
  var h=o.h||34,pal=tone==='dead'?'grey':'metal',g=ibox(x,y,5,1.4,1.4,h,pal,{glow:o.glow});
  var led=tone==='dead'?'c-bad':(tone==='hot'?'c-bad':(tone==='warm'?'c-slow':'c-res')),k;
  var top=P(x+.7,y+.7,5+h+0);g+='<ellipse cx="'+top[0].toFixed(1)+'" cy="'+top[1].toFixed(1)+'" rx="7" ry="3" fill="#fff" opacity=".16"/>';
  for(k=0;k<3;k++){
    var z=8+k*10,a=P(x+1.4,y+0.2,z),b=P(x+1.4,y+1.2,z),c=P(x+1.4,y+1.2,z+6),d=P(x+1.4,y+0.2,z+6);
    g+=poly([a,b,c,d],ISOK.slot,'rgba(3,12,18,.5)',.8);
    g+=ledDot(x+1.4,y+0.45,z+3,led,tone!=='dead',k);
  }
  return g;
}
/* flat icon standing upright above a floor point */
function bill(name,x,y,z,size,o){var p=P(x,y,z);return ic(name,p[0]-size/2,p[1]-size,size,o)}
/* glass info card, like the labels in the reference */
function card(cx,cy,title,lines,tone,w){
  w=w||110;var col={ok:'#ff8a1f',bad:'#ff5f6d',run:'#3f8fd0',wait:'#f2c744',idle:'#ff8a1f'}[tone||'idle'],h=22+(lines?lines.length*14:0),x=cx-w/2,y=cy-h/2;
  var s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="'+ISOK.card+'" stroke="'+col+'" stroke-opacity=".7" stroke-width="1"/>';
  s+='<rect x="'+(x+8)+'" y="'+(y+8.5)+'" width="6" height="6" fill="'+col+'"/>'+T(x+19,y+16,title,'lbl xs');
  (lines||[]).forEach(function(l,i){s+=T(x+8,y+31+i*14,l,'lbl sm')});
  return s;
}
function leader(x1,y1,x2,y2,col){return '<path d="M'+x1+','+y1+' L'+x2+','+y2+'" stroke="'+(col||'#ff8a1f')+'" stroke-opacity=".45" stroke-width="1" stroke-dasharray="3 3" fill="none"/>'}
/* glowing pipe along floor points; returns path data too, so packets can follow it */
function pipeD(a,z){return 'M'+a.map(function(q){var p=P(q[0],q[1],z==null?3:z);return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' L')}
function pipe(a,state,z){
  var d=pipeD(a,z),dead=state==='dead';
  return '<path d="'+d+'" fill="none" stroke="'+(dead?'#ff5f6d':'#ff8a1f')+'" stroke-opacity="'+(dead?.25:.22)+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'+
    '<path d="'+d+'" class="ln'+(dead?' dead':(state==='flow'?' flow':''))+'" style="stroke-width:2.2"/>';
}
/* depth-sorted drawing queue: draw things in front last */
function Qnew(){return []}
function Qadd(q,x,y,s){q.push({d:x+y,s:s})}
function Qflush(q){q.sort(function(a,b){return a.d-b.d});return q.map(function(o){return pop(o.s)}).join('')}
function xmark(x,y,z){var p=P(x,y,z);return '<path d="M'+(p[0]-8)+','+(p[1]-8)+' l16,16 m0,-16 l-16,16" class="cross"/>'}
function G(sx,sy){var a=(sy-IOY)/IH,b=(sx-IOX)/IW;return [(a+b)/2,(a-b)/2]}
function cyl(sx,sy,r,h,pal,glow){
  var c=PAL[pal],rx=r,ry=r*0.5,st='rgba(3,12,18,.85)',id='g'+(++GID);
  var gd='<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+mixc(c[1],-.35)+'"/><stop offset=".35" stop-color="'+mixc(c[1],.22)+'"/><stop offset="1" stop-color="'+mixc(c[1],-.4)+'"/></linearGradient>';
  return '<ellipse cx="'+(sx+h*0.3)+'" cy="'+(sy+3)+'" rx="'+(rx*1.05)+'" ry="'+(ry*1.05)+'" fill="'+ISOK.shc+'" opacity="'+(ISOK.sho-.02)+'" filter="url(#bl3)"/><g'+(glow?' style="filter:drop-shadow(0 0 8px '+glow+')"':'')+'>'+gd+'<path d="M'+(sx-rx)+','+sy+' L'+(sx-rx)+','+(sy-h)+' A'+rx+','+ry+' 0 0 0 '+(sx+rx)+','+(sy-h)+' L'+(sx+rx)+','+sy+' A'+rx+','+ry+' 0 0 1 '+(sx-rx)+','+sy+'Z" fill="url(#'+id+')" stroke="'+st+'"/><ellipse cx="'+sx+'" cy="'+(sy-h)+'" rx="'+rx+'" ry="'+ry+'" fill="'+mixc(c[0],.08)+'" stroke="'+st+'"/><ellipse cx="'+sx+'" cy="'+(sy-h)+'" rx="'+(rx*.7)+'" ry="'+(ry*.7)+'" fill="none" stroke="#fff" stroke-opacity=".35"/></g>';
}

function drawScale(s){
  IOY=84-Math.max(0,s.servers-3)*8;
  var m=scaleModel(s),n=s.servers,lb=n>1,q=Qnew(),o='',i,share=m.load/m.healthy,np=clamp(Math.ceil(s.users/300),1,9),paths=[];
  for(i=0;i<n;i++){
    var yc=i*2.1+0.95,down=m.failed&&i===n-1;
    var a=lb?[[3.4,6.7],[5.2,6.7],[5.2,4.1],[7.9,4.1],[7.9,yc],[8.6,yc]]:[[3.4,6.7],[7.9,6.7],[7.9,yc],[8.6,yc]];
    paths.push({a:a,down:down});o+=pipe(a,down?'dead':null);
  }
  for(i=0;i<n;i++){
    var pa=paths[i];if(pa.down)continue;
    var ui=share/60,k=clamp(Math.round(share/18),1,3),cls=ui>0.8?'c-slow':'c-req',d=2.6,fw=pipeD(pa.a),bw=pipeD(pa.a.slice().reverse());
    for(var j=0;j<k;j++)o+=packet(fw,d,(j*d/k)+i*0.15,cls);
    if(ui<1)o+=packet(bw,d,1.3+i*0.15,'c-res');
  }
  var ug='',ps;
  for(i=0;i<np;i++){var pp=P(0.5+(i%3)*1.1,5.4+Math.floor(i/3)*1.1,5);ug+='<g>'+(reduce?'':'<animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="1.8s" begin="-'+(i*0.3).toFixed(1)+'s" repeatCount="indefinite"/>')+ic('user',pp[0]-15,pp[1]-30,30,{k:i%3})+'</g>'}
  Qadd(q,0,5,plat(0,5,3.4,3.4,'idle')+ug);
  ps=P(1.7,9.7,0);o+=chip(ps[0],ps[1]+2,fmt(s.users)+' users');
  if(lb){
    var lp=P(4.6,5.0,0);
    Qadd(q,4.4,3.3,plat(4.4,3.3,1.6,1.6,'run')+ibox(4.65,3.55,5,1.1,1.1,16,'blue',{glow:'rgba(63,143,208,.6)'})+bill('lb',5.2,4.1,22,40)+'<g class="fl">'+vpanel(4.2,3.4,52,2.0,34,'x','dash')+'</g>');
    o+=T(lp[0],lp[1]+18,'load balancer','lbl xs','middle')+chip(lp[0]-150,lp[1]+110,'round robin');
    if(m.failed)o+=chip(lp[0]-150,lp[1]+146,'skipping server '+n,'c-bad');
  }
  for(i=0;i<n;i++){
    var y=i*2.1,down2=paths[i].down,u2=down2?0:share/60,over=u2>=1,tone=down2?'dead':(over?'hot':(u2>=0.7?'warm':'ok'));
    var g=plat(8.2,y,1.9,1.9,down2||over?'bad':(u2>=0.7?'wait':'ok'),down2)+rack(8.5,y+0.25,tone);
    if(over&&!reduce)g='<g><animateTransform attributeName="transform" type="translate" values="0 0;-2 0;2 0;0 0" dur=".4s" repeatCount="indefinite"/>'+g+'</g>';
    var lp2=P(10.7,y+1.0,0);
    g+=T(lp2[0]+2,lp2[1]+4,down2?'S'+(i+1)+' down':'S'+(i+1)+' · '+Math.round(Math.min(u2,1)*100)+'%','lbl xs');
    if(down2)g+=xmark(9.15,y+1,36);
    if(over)for(var z=0;z<3;z++){var qp=P(8.5+0.7,y+0.95,46);g+='<rect x="'+(qp[0]-9+z*8)+'" y="'+(qp[1]-14)+'" width="6" height="9" rx="2" class="pk c-queue">'+(reduce?'':'<animate attributeName="y" values="'+(qp[1]-14)+';'+(qp[1]-21)+';'+(qp[1]-14)+'" dur=".6s" begin="'+(z*0.15)+'s" repeatCount="indefinite"/>')+'</rect>'}
    Qadd(q,8.2,y,g);
  }
  o+=Qflush(q);
  o+=chip(330,24,m.u>=1?'requests timing out':'≈ '+m.p50+' round trip',m.u>=1?'c-bad':null);
  return o;
}
LESSONS.push({
  id:'scaling',icon:'lb',parts:[["user", {}, "Users", "People or apps sending requests."], ["lb", {}, "Load balancer", "Splits traffic across servers."], ["server", {}, "Server", "Runs your app. The light shows how busy it is."], ["clock", {}, "Latency", "How long one request takes."]],name:'Scaling a web app',
  blurb:'Watch load grow on one server, then add a load balancer, lose a server and let autoscaling react. Capacity is 60 requests per second per server and every user sends about one request every 20 seconds.',
  legend:[['c-req','request'],['c-res','response'],['c-slow','slow request'],['c-queue','waiting in queue'],['c-bad','server down']],
  draw:drawScale,metrics:scaleMetrics,
  steps:[
   {label:'One server',tag:'SETUP',title:'One server, a few users',
    text:'200 users send about 10 requests per second. One app server can finish around 60 per second, so it is mostly idle and answers in about 140 ms. Watch the blue requests go in and the green responses come back.',
    idea:'Capacity is how many requests per second a server can finish. Utilization is load divided by capacity.',scene:{users:200,servers:1}},
   {label:'Busier',tag:'LOAD',title:'Latency climbs before anything breaks',
    text:'At 1,000 users the load is 50 requests per second, 83% of capacity. Nothing has failed, but requests now wait behind each other. P50 latency is several times higher and P99, the slowest 1% of requests, is much worse.',
    idea:'Queues grow non-linearly. The last 20% of utilization costs far more latency than the first 80%.',scene:{users:1000,servers:1}},
   {label:'Overload',tag:'FAIL',title:'Past 100%, requests wait and then fail',
    text:'At 2,000 users, requests arrive faster than the server can finish them. A queue builds, requests time out, and throughput is stuck at the server ceiling of 60 requests per second no matter how many users arrive.',
    idea:'Extra load beyond capacity is not served. It waits, then it fails.',scene:{users:2000,servers:1}},
   {label:'Scale out',tag:'SCALE',title:'Scale out behind a load balancer',
    text:'Add two more servers and put a load balancer in front. It spreads requests round robin, so each server sees a third of the traffic and latency drops back to normal.',
    idea:'Horizontal scaling adds machines. Vertical scaling makes one machine bigger. Horizontal also removes the single point of failure.',scene:{users:2000,servers:3}},
   {label:'Failure',tag:'FAIL',title:'One server dies and nobody notices',
    text:'Health checks see that server 3 stopped answering and the load balancer stops sending it traffic. Users see no errors, but the two remaining servers now run hotter at 83%.',
    idea:'Plan for N+1: keep enough spare capacity that losing one server does not push the rest past their limit.',scene:{users:2000,servers:3,failed:true}},
   {label:'Autoscale',tag:'SCALE',title:'Autoscaling adds capacity for you',
    text:'Traffic doubles to 4,000 users. An autoscaler watches utilization and adds servers until it falls back under a target, often 60 to 70%. When traffic drops it removes them again to save money.',
    idea:'Scale on a metric such as CPU, requests per second or queue depth, not on a schedule you have to guess.',scene:{users:4000,servers:5}},
   {label:'Try it',tag:'PLAY',title:'Break it yourself',pg:true,
    text:'Drag the users slider up, add or remove servers, and kill one. Find the point where utilization crosses 100% and see how many servers you need to bring latency back under control.',
    idea:'Try 3,000 users with 3 servers, then kill one. Then add a fourth.'}
  ],
  pg:{
   init:function(){return {users:1500,servers:2,failed:false}},
   scene:function(p){return p},
   fmt:{users:function(v){return fmt(v)}},
   controls:function(p){return '<label class="ctl"><span>Users <b id="v-users">'+fmt(p.users)+'</b></span><input type="range" id="c-users" data-k="users" min="100" max="6000" step="100" value="'+p.users+'"></label>'+
    '<label class="ctl"><span>Servers <b id="v-servers">'+p.servers+'</b></span><input type="range" id="c-servers" data-k="servers" min="1" max="6" step="1" value="'+p.servers+'"></label>'+
    '<label class="ctl chk"><input type="checkbox" id="c-failed" data-k="failed"'+(p.failed?' checked':'')+'> Kill one server</label><p class="msg" id="pgmsg">Killing a server needs at least 2 servers.</p>'},
   set:function(p,k,v){p[k]=v},
   act:function(){}
  }
});

/* =========================================================
   LESSON 2: CI/CD pipeline
   ========================================================= */
var STG=['Commit','Build','Test','Package','Staging','Prod'], DUR=['2s','9s','24s','31s','18s',''];
function ci(st,at,tag,log,m,split){return {st:st,at:at,tag:tag,log:log,m:m,split:split==null?null:split}}
function mt(stage,lead,tests,ts,rel,rs,ss){return [['Stage',stage,ss||'ok'],['Lead time',lead,'ok'],['Tests',tests,ts||'ok'],['Release',rel,rs||'ok']]}
var STG_IC=['commit','gear','flask','pkg','window','rocket'];
var STG_IC=['commit','gear','flask','pkg','window','rocket'];
var STG_IC=['commit','gear','flask','pkg','window','rocket'];
var STG_IC=['commit','gear','flask','pkg','window','rocket'];
var STG_IC=['commit','gear','flask','pkg','window','rocket'];
var STG_IC=['commit','gear','flask','pkg','window','rocket'];
function drawCI(s){
  IOY=56;
  var q=Qnew(),o='',i,Y=2.4,X=function(k){return 0.2+k*2.5},tc={pass:'ok',run:'run',fail:'bad'};
  for(i=0;i<5;i++){
    var a=[[X(i)+0.9,Y+0.9],[X(i+1)+0.9,Y+0.9]];
    o+=pipe(a,s.st[i+1]==='run'?'flow':null);
    if(s.st[i]==='pass'&&s.st[i+1]==='run')o+=packet(pipeD(a),1.1,0,'c-req');
  }
  var tagX=0;
  for(i=0;i<6;i++){
    var st=s.st[i],x=X(i),cp=P(x+0.9,Y+0.9,8),g=plat(x,Y,1.8,1.8,tc[st]||'idle');
    g+=ibox(x+0.45,Y+0.45,5,0.9,0.9,4,'dark');
    if(st==='run'&&!reduce)g+='<polygon points="'+pts([P(x-0.2,Y-0.2,5.5),P(x+2,Y-0.2,5.5),P(x+2,Y+2,5.5),P(x-0.2,Y+2,5.5)])+'" fill="none" stroke="#3f8fd0" stroke-width="2.4"><animate attributeName="opacity" values=".9;.1;.9" dur="1.2s" repeatCount="indefinite"/></polygon>';
    g+=ic(STG_IC[i],cp[0]-20,cp[1]-44,40,{run:st==='run',spin:st==='run',dim:!tc[st]});
    var bx=cp[0]+22,by=cp[1]-46;
    if(st==='pass')g+='<circle cx="'+bx+'" cy="'+by+'" r="9" class="pk c-res"/><path d="M'+(bx-4)+','+by+' l3,3.5 l5.5,-6.5" fill="none" stroke="#2a1400" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'+(i===s.at&&!reduce?' stroke-dasharray="14" stroke-dashoffset="14"><animate attributeName="stroke-dashoffset" from="14" to="0" dur=".45s" begin=".25s" fill="freeze"/></path>':'/>');
    else if(st==='fail')g+='<circle cx="'+bx+'" cy="'+by+'" r="9" class="pk c-bad"/><path d="M'+(bx-3.5)+','+(by-3.5)+' l7,7 m0,-7 l-7,7" fill="none" stroke="#2a1400" stroke-width="2.4" stroke-linecap="round"/>';
    var lp=P(x+0.9,Y+1.8,0);
    g+=T(lp[0],lp[1]+16,STG[i],'lbl xs','middle');
    if(st==='pass')g+=T(lp[0],lp[1]+30,DUR[i],'lbl sm','middle');
    Qadd(q,x,Y,g);
    if(i===s.at)tagX=cp[0];
  }
  o+=Qflush(q);
  var tw=Math.round(s.tag.length*8+26),tcx=clamp(tagX,tw/2+8,640-tw/2-10);
  o+=leader(tagX,32,tagX,P(X(s.at)+0.9,Y+0.9,8)[1]-48)+chip(tcx,22,s.tag);
  if(s.split!=null){
    var sw2=Math.max(6,Math.round(150*s.split/100));
    o+='<rect x="448" y="310" width="176" height="56" rx="6" fill="rgba(6,14,21,.9)" stroke="#ff8a1f" stroke-opacity=".55"/><rect x="456" y="318" width="6" height="6" fill="#ff8a1f"/>'+T(468,325,'canary release','lbl xs')+'<rect x="460" y="334" width="150" height="9" rx="4.5" class="track"/><rect x="460" y="334" width="'+sw2+'" height="9" rx="4.5" class="pk c-req">'+(still?'':'<animate attributeName="width" from="0" to="'+sw2+'" dur=".6s" fill="freeze"/>')+'</rect>'+T(460,358,'v1.8.4 gets '+s.split+'%','lbl sm');
  }
  o+='<rect x="18" y="262" width="418" height="112" rx="8" class="term"/>';
  o+='<circle cx="34" cy="276" r="4.5" fill="#ff5f57"/><circle cx="50" cy="276" r="4.5" fill="#febc2e"/><circle cx="66" cy="276" r="4.5" fill="#28c840"/>'+T(84,280,'ci runner · pipeline #483','tl dim');
  var nl=Math.min(s.log.length,5),lg=function(t){return t.length>56?t.slice(0,55)+'…':t};
  for(i=0;i<nl;i++)o+=T(32,299+i*15,lg(s.log[i][1]),'tl '+(s.log[i][0]||''));
  if(nl)o+='<rect x="'+Math.round(32+lg(s.log[nl-1][1]).length*7.25+5)+'" y="'+(299+(nl-1)*15-10)+'" width="7" height="12" fill="#6ee7a8">'+(reduce?'':'<animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>')+'</rect>';
  return o;
}
function ciFrames(p){
  var F=[],tag=p.broken?'a1f3c9e':'b72d04a',P='pass',R='run',I='idle',X='fail',pct=p.pct,hit=(pct*6/100).toFixed(1);
  F.push(ci([P,I,I,I,I,I],0,tag,[['','$ git push origin main'],['dim','9c2e1b0..'+tag+'  main -> main'],['','→ pipeline #483 started']],mt('Commit','0:03','—','n','v1.8.3 live'),null));
  F.push(ci([P,R,I,I,I,I],1,tag,[['','$ npm ci && npm run build'],['dim','compiling 86 modules…']],mt('Build','0:15','—','n','v1.8.3 live')));
  F.push(ci([P,P,R,I,I,I],2,tag,[['','$ npm test'],['dim','running 128 tests…']],mt('Test','0:40','…','n','v1.8.3 live')));
  if(p.broken){
    F.push(ci([P,P,X,I,I,I],2,tag,[['bad','✗ api › checkout total'],['bad','  expected 42.00, got 41.99'],['bad','127 passed, 1 failed'],['dim','pipeline stopped. nothing was released.']],mt('Test','1:05','127/128','bad','v1.8.3 live','ok','bad')));
    return F;
  }
  F.push(ci([P,P,P,I,I,I],2,tag,[['ok','✓ 128 passed, 0 failed']],mt('Test','1:05','128/128','ok','v1.8.3 live')));
  F.push(ci([P,P,P,R,I,I],3,tag,[['','$ docker build -t registry/app:1.8.4 .'],['','$ docker push registry/app:1.8.4'],['dim','pushing layers…']],mt('Package','1:30','128/128','ok','v1.8.3 live')));
  F.push(ci([P,P,P,P,R,I],4,tag,[['','$ kubectl apply -f staging/'],['dim','running smoke tests…']],mt('Staging','2:05','128/128','ok','v1.8.3 live')));
  F.push(ci([P,P,P,P,P,R],5,tag,[['','canary: '+pct+'% of traffic → v1.8.4'],['dim','watching error rate for 2 minutes…']],mt('Prod canary','2:30','128/128','ok','v1.8.3 live'),pct));
  if(p.bug){
    F.push(ci([P,P,P,P,P,X],5,tag,[['bad','✗ error rate 6.0% (limit 1.0%)'],['bad','→ auto-rollback to v1.8.3'],['dim','requests affected: '+hit+'% of all traffic']],mt('Rollback','4:40','128/128','ok','Rolled back','bad','bad'),pct));
  }else{
    F.push(ci([P,P,P,P,P,P],5,tag,[['ok','✓ error rate 0.1% (limit 1.0%)'],['ok','promoted to 100%'],['','v1.8.4 is live']],mt('Done','4:40','128/128','ok','v1.8.4 live'),100));
  }
  return F;
}
LESSONS.push({
  id:'pipeline',icon:'rocket',parts:[["commit", {}, "Commit", "A saved change that starts the pipeline."], ["gear", {}, "Build", "Turns code into something runnable."], ["flask", {}, "Test", "Automatic checks that catch bugs."], ["pkg", {}, "Package", "The artifact that gets released."], ["window", {}, "Staging", "A safe copy of production."], ["rocket", {}, "Production", "What real users see."]],name:'CI/CD pipeline',
  blurb:'Follow one change from git push to production. See where a bad change is stopped and how a canary release limits the damage of a bug the tests missed.',
  legend:[['c-ok','passed'],['c-run','running'],['c-bad','failed'],['c-idle','not reached']],
  draw:drawCI,metrics:function(s){return s.m},
  steps:[
   {label:'Commit',tag:'SETUP',title:'A push starts the pipeline',
    text:'You push commit a1f3c9e. A webhook tells the CI server, which checks out the code on a clean runner and starts the first stage. Nobody clicks anything.',
    idea:'Continuous integration means every change is built and tested automatically, on a clean machine, not only on yours.',
    scene:ci(['pass','idle','idle','idle','idle','idle'],0,'a1f3c9e',[['','$ git push origin main'],['dim','9c2e1b0..a1f3c9e  main -> main'],['','→ pipeline #483 started']],mt('Commit','0:03','—','n','v1.8.3 live'))},
   {label:'Build',tag:'BUILD',title:'Build once, reuse the result',
    text:'The runner installs dependencies and compiles the code into a build artifact. The same artifact moves through every later stage, so what you test is exactly what you ship.',
    idea:'Build once, deploy many. Rebuilding for each environment can silently produce different results.',
    scene:ci(['pass','run','idle','idle','idle','idle'],1,'a1f3c9e',[['','$ npm ci && npm run build'],['dim','added 412 packages in 9s'],['ok','✓ compiled 86 modules'],['dim','artifact: dist/ (1.4 MB)']],mt('Build','0:15','—','n','v1.8.3 live'))},
   {label:'Test',tag:'TEST',title:'Automated tests are the gate',
    text:'Unit tests, API tests and lint checks run in parallel. If everything is green the change moves on. If anything is red the pipeline stops here.',
    idea:'Fast feedback matters. A pipeline that takes an hour gets skipped, so keep the quick tests first.',
    scene:ci(['pass','pass','run','idle','idle','idle'],2,'a1f3c9e',[['','$ npm test'],['dim','unit     94 tests'],['dim','api      31 tests'],['dim','lint      3 checks'],['','running…']],mt('Test','0:40','…','n','v1.8.3 live'))},
   {label:'Failure',tag:'FAIL',title:'A failing test stops the line',
    text:'One API test fails: the checkout total is 41.99 instead of 42.00. The pipeline stops, Package, Staging and Prod never start, and users keep running v1.8.3. You see the failure in minutes, not from a customer.',
    idea:'A red pipeline is the system working. The cost of the bug is one failed run.',
    scene:ci(['pass','pass','fail','idle','idle','idle'],2,'a1f3c9e',[['bad','✗ api › checkout total'],['bad','  expected 42.00, got 41.99'],['bad','127 passed, 1 failed'],['dim','pipeline stopped. nothing was released.']],mt('Test','1:05','127/128','bad','v1.8.3 live','ok','bad'))},
   {label:'Package',tag:'PACKAGE',title:'Fix it, push, and package an image',
    text:'You fix the rounding bug and push commit b72d04a. All 128 tests pass, and the pipeline builds a container image tagged 1.8.4 and pushes it to the registry. The tag is immutable: 1.8.4 will always mean this exact image.',
    idea:'Tag images with a version or commit hash. The tag latest tells you nothing about what is running.',
    scene:ci(['pass','pass','pass','run','idle','idle'],3,'b72d04a',[['','$ docker build -t registry/app:1.8.4 .'],['','$ docker push registry/app:1.8.4'],['dim','digest: sha256:7be1…c40a']],mt('Package','1:30','128/128','ok','v1.8.3 live'))},
   {label:'Staging',tag:'DEPLOY',title:'Staging is a rehearsal',
    text:'The image is deployed to staging, an environment shaped like production but with no real users. Smoke tests call the live endpoints to check the app starts, connects to its database and answers.',
    idea:'Staging catches configuration mistakes that unit tests cannot see, such as a missing environment variable.',
    scene:ci(['pass','pass','pass','pass','run','idle'],4,'b72d04a',[['','$ kubectl apply -f staging/'],['dim','deployment "app" rolled out'],['','running smoke tests…']],mt('Staging','2:05','128/128','ok','v1.8.3 live'))},
   {label:'Canary',tag:'RELEASE',title:'Release to 10% of users first',
    text:'Production gets the new version for 10% of traffic. The pipeline watches the error rate. If it stays below the limit the release is promoted to everyone. If it rises, the pipeline rolls back automatically.',
    idea:'A canary release limits the blast radius. A bug that tests missed hurts 10% of requests for two minutes instead of everyone.',
    scene:ci(['pass','pass','pass','pass','pass','run'],5,'b72d04a',[['','canary: 10% of traffic → v1.8.4'],['dim','watching error rate for 2 minutes…'],['ok','✓ error rate 0.1% (limit 1.0%)']],mt('Prod canary','2:30','128/128','ok','v1.8.3 live'),10)},
   {label:'Try it',tag:'PLAY',title:'Run the pipeline yourself',pg:true,
    text:'Choose what goes wrong, then press Run. Break a test to see the pipeline stop. Ship a bug the tests miss and compare the damage between a 10% canary and a 100% release.',
    idea:'Try "Ship a bug" with a 10% canary, then again at 100%. Compare the requests affected.'}
  ],
  pg:{
   init:function(){return {broken:false,bug:false,pct:10,running:false,scene:ci(['idle','idle','idle','idle','idle','idle'],0,'a1f3c9e',[['dim','$ waiting for a push…']],mt('Idle','0:00','—','n','v1.8.3 live'))}},
   scene:function(p){return p.scene},
   fmt:{pct:function(v){return v+'%'}},
   controls:function(p){return '<label class="ctl chk"><input type="checkbox" id="c-broken" data-k="broken"'+(p.broken?' checked':'')+'> Break a test</label>'+
    '<label class="ctl chk"><input type="checkbox" id="c-bug" data-k="bug"'+(p.bug?' checked':'')+'> Ship a bug the tests miss</label>'+
    '<label class="ctl"><span>Canary traffic <b id="v-pct">'+p.pct+'%</b></span><input type="range" id="c-pct" data-k="pct" min="5" max="100" step="5" value="'+p.pct+'"></label>'+
    '<button class="btn run" type="button" data-act="run" id="c-run"'+(p.running?' disabled':'')+'>Run pipeline</button><p class="msg" id="pgmsg">Press Run to start a pipeline with these settings.</p>'},
   set:function(p,k,v){p[k]=v},
   act:function(p,a){
     if(a!=='run'||p.running)return;
     clearTimers();p.running=true;var F=ciFrames(p),i=0;
     $('#c-run').disabled=true;$('#pgmsg').textContent='Running…';
     (function tick(){
       p.scene=F[i];renderStage();i++;
       if(i<F.length)later(tick,900);
       else{p.running=false;var b=$('#c-run');if(b)b.disabled=false;var mg=$('#pgmsg');
         if(mg)mg.textContent=p.broken?'Stopped at Test. Nothing reached users.':(p.bug?'Rolled back. The bug reached '+(p.pct*6/100).toFixed(1)+'% of requests.':'Released to everyone.')}
     })();
   }
  }
});

/* =========================================================
   LESSON 3: Kubernetes self-healing
   ========================================================= */
function readyCount(s){return s.pods.filter(function(p){return p.s==='run'&&s.nodes[p.n]}).length}
function k8sMetrics(s){
  var r=readyCount(s),up=s.nodes.filter(Boolean).length;
  return [['Desired',String(s.desired),'ok'],['Ready',r+'/'+s.desired,r<s.desired?'warn':'ok'],['Nodes up',up+'/3',up<3?'warn':'ok'],['Restarts',String(s.restarts),s.restarts>0?'warn':'ok']];
}
function drawK8s(s){
  IOY=64;
  var q=Qnew(),o='',i,ready=readyCount(s),names=['node-a','node-b','node-c'];
  var cp=P(9.9,0.1,0);
  Qadd(q,9,-0.8,plat(9,-0.8,1.8,1.8,'ok')+'<g>'+bill('gear',9.9,0.1,6,44,{spin:true})+'</g>');
  o+=card(520,46,'control plane',['desired '+s.desired+' · ready '+ready],ready<s.desired?'wait':'ok',190)+leader(520,70,cp[0],cp[1]-52);
  if(ready<s.desired)o+=chip(520,92,'reconciling','c-queue');
  for(i=0;i<3;i++){
    var nx=0.2+i*4.4,ny=3.2,dead=!s.nodes[i],g=plat(nx,ny,3.9,3.9,dead?'bad':'ok',dead),lp=P(nx,ny+3.9,0);
    var list=s.pods.filter(function(p){return p.n===i}),items=[];
    list.forEach(function(p,j){
      var one=list.length===1,px=one?nx+1.3:nx+0.8+(j%2)*1.7,py=one?ny+1.4:ny+0.9+Math.floor(j/2)*1.1,pal=p.s==='crash'?'red':(p.s==='wait'?'amber':'green');
      var pg=ibox(px,py,5,1.3,0.8,15,pal,{glow:dead?null:(p.s==='crash'?'rgba(255,95,109,.55)':'rgba(255,138,31,.45)')});
      var tp=P(px+0.65,py+0.4,21);
      pg+=T(tp[0],tp[1]-3,'web-'+p.id+(p.v!=='v1'?' '+p.v:'')+(p.s==='crash'?' !':''),'lbl xs','middle');
      if(p.s==='crash'&&!reduce)pg='<g><animateTransform attributeName="transform" type="translate" values="0 0;-2 0;2 0;0 0" dur=".4s" repeatCount="indefinite"/>'+pg+'</g>';
      if(p.s==='wait'&&!reduce)pg='<g><animate attributeName="opacity" values="1;.4;1" dur="1.1s" repeatCount="indefinite"/>'+pg+'</g>';
      items.push({d:px+py,s:'<g opacity="'+(dead?0.5:1)+'">'+pg+'</g>'});
    });
    items.sort(function(a,b){return a.d-b.d});items.forEach(function(it){g+=it.s});
    g+=T(lp[0]-8,lp[1]+8,names[i]+' · '+(dead?'down':'up'),'lbl xs','end');
    if(dead)g+=xmark(nx+1.95,ny+1.95,10);
    Qadd(q,nx,ny,g);
  }
  return o+Qflush(q);
}
function K(nodes,pods,desired,restarts){return {nodes:nodes,pods:pods.map(function(p){return {n:p[0],v:p[1],s:p[2],id:p[3]}}),desired:desired,restarts:restarts}}
function leastNode(p){var best=-1,bc=1e9;for(var i=0;i<3;i++){if(!p.nodes[i])continue;var c=p.pods.filter(function(x){return x.n===i}).length;if(c<bc){bc=c;best=i}}return best}
function kmsg(t){var e=$('#pgmsg');if(e)e.textContent=t}
LESSONS.push({
  id:'kubernetes',icon:'pod',parts:[["gear", {}, "Control plane", "The brain. Compares desired and actual state."], ["server", {}, "Node", "A machine that runs pods."], ["pod", {}, "Pod", "One running copy of your app."], ["pod", {"f": "f-bad"}, "Crashed pod", "Kubernetes replaces it automatically."]],name:'Kubernetes self-healing',
  blurb:'You tell Kubernetes how many copies of an app you want. It keeps comparing that desired state with reality and fixes the difference. Break things and watch it repair them.',
  legend:[['c-ok','running'],['c-bad','crashed'],['c-wait','starting or rescheduling'],['c-idle','node down']],
  draw:drawK8s,metrics:k8sMetrics,
  steps:[
   {label:'Desired',tag:'SETUP',title:'You declare, Kubernetes reconciles',
    text:'A Deployment says "I want 3 replicas of web". The scheduler places the three pods on different nodes. Nothing in this setup tells Kubernetes how to keep them running. It only knows the target.',
    idea:'Declarative means you describe the end state. A controller loop works out the steps.',scene:K([1,1,1],[[0,'v1','run',1],[1,'v1','run',2],[2,'v1','run',3]],3,0)},
   {label:'Crash',tag:'FAIL',title:'A container crashes',
    text:'The app in web-2 hits an out-of-memory error and exits. Ready drops to 2 of 3, the Service stops sending traffic to that pod, and the control plane notices the gap between desired and actual.',
    idea:'Readiness decides whether a pod receives traffic. A crashed pod is removed from the Service immediately.',scene:K([1,1,1],[[0,'v1','run',1],[1,'v1','crash',2],[2,'v1','run',3]],3,0)},
   {label:'Restart',tag:'HEAL',title:'The kubelet restarts it',
    text:'The kubelet on node-b restarts the container in place. After a few seconds web-2 passes its readiness probe and traffic returns. The restart counter goes up so you can spot a pod that keeps crashing.',
    idea:'Repeated crashes use exponential back-off, shown as CrashLoopBackOff. Check logs and the last exit code.',scene:K([1,1,1],[[0,'v1','run',1],[1,'v1','run',2],[2,'v1','run',3]],3,1)},
   {label:'Node lost',tag:'FAIL',title:'A whole node goes down',
    text:'node-c loses power. Its pod web-3 is gone and Ready drops to 2 of 3. Kubernetes waits a short grace period in case the node comes back, then treats the pod as lost.',
    idea:'Spreading replicas across nodes (and zones) is what turns one failed machine into a non-event.',scene:K([1,1,0],[[0,'v1','run',1],[1,'v1','run',2],[2,'v1','wait',3]],3,1)},
   {label:'Reschedule',tag:'HEAL',title:'Pods are placed on healthy nodes',
    text:'The controller creates a replacement pod, web-4, and the scheduler puts it on node-a, a node with room. You are back at 3 of 3 without anyone logging in.',
    idea:'Pods are disposable. They are replaced, never repaired, which is why state belongs in volumes or databases.',scene:K([1,1,0],[[0,'v1','run',1],[1,'v1','run',2],[0,'v1','run',4]],3,1)},
   {label:'Scale',tag:'SCALE',title:'Scaling is changing one number',
    text:'node-c is repaired and you change replicas from 3 to 6. The scheduler spreads the new pods so every node carries two. A HorizontalPodAutoscaler can change that number for you based on CPU.',
    idea:'kubectl scale deploy/web --replicas=6 edits the desired state. The loop does the rest.',scene:K([1,1,1],[[0,'v1','run',1],[1,'v1','run',2],[2,'v1','run',5],[0,'v1','run',4],[1,'v1','run',6],[2,'v1','run',7]],6,1)},
   {label:'Rollout',tag:'RELEASE',title:'A rolling update swaps pods gradually',
    text:'You ship v2. Kubernetes starts a v2 pod, waits until it is ready, then stops a v1 pod, and repeats. At most one pod is unavailable at a time, so users never see downtime. A bad v2 that never becomes ready stops the rollout.',
    idea:'kubectl rollout undo deploy/web returns to the previous version if v2 misbehaves.',scene:K([1,1,1],[[0,'v2','run',8],[1,'v2','run',9],[2,'v2','wait',10],[0,'v1','run',4],[1,'v1','run',6],[2,'v1','run',7]],6,1)},
   {label:'Try it',tag:'PLAY',title:'Break the cluster',pg:true,
    text:'Kill pods and nodes, change the replica count and start a rollout. After every action, watch Ready fall below Desired and then recover on its own.',
    idea:'Kill two nodes in a row. With one node left the pods all pack onto it, and nothing is lost.'}
  ],
  pg:{
   init:function(){return {nodes:[1,1,1],pods:[{n:0,v:'v1',s:'run',id:1},{n:1,v:'v1',s:'run',id:2},{n:2,v:'v1',s:'run',id:3}],desired:3,restarts:0,nextId:4}},
   scene:function(p){return p},
   fmt:{desired:function(v){return String(v)}},
   controls:function(p){return '<label class="ctl"><span>Replicas <b id="v-desired">'+p.desired+'</b></span><input type="range" id="c-desired" data-k="desired" min="1" max="8" step="1" value="'+p.desired+'"></label>'+
    '<button class="btn" type="button" data-act="pod">Crash a pod</button><button class="btn" type="button" data-act="node">Kill a node</button><button class="btn" type="button" data-act="repair">Repair nodes</button><button class="btn run" type="button" data-act="roll">Roll out v2</button><p class="msg" id="pgmsg">Try an action and watch the Ready counter.</p>'},
   set:function(p,k,v){
     if(k!=='desired')return;
     while(p.pods.length<v){var n=leastNode(p);p.pods.push({n:n,v:p.pods.length&&p.pods[0].v==='v2'?'v2':'v1',s:'run',id:p.nextId++})}
     while(p.pods.length>v)p.pods.pop();
     p.desired=v;kmsg('Replica count changed to '+v+'. The scheduler places or removes pods to match.');
   },
   act:function(p,a){
     var i;
     if(a==='pod'){
       var run=p.pods.filter(function(x){return x.s==='run'&&p.nodes[x.n]});
       if(!run.length){kmsg('No running pod to crash.');return}
       var pd=run[Math.floor(Math.random()*run.length)];pd.s='crash';
       kmsg('web-'+pd.id+' crashed. The kubelet restarts the container in place.');renderStage();
       later(1000,function(){if(pd.s==='crash'&&p.nodes[pd.n]&&p.pods.indexOf(pd)>-1){pd.s='run';p.restarts++;kmsg('web-'+pd.id+' restarted and is ready again.');renderStage()}});
     }else if(a==='node'){
       var alive=[];p.nodes.forEach(function(v,j){if(v)alive.push(j)});
       if(alive.length<2){kmsg('Only one node is left. Repair nodes first.');return}
       var d=alive[Math.floor(Math.random()*alive.length)];p.nodes[d]=0;
       p.pods.forEach(function(x){if(x.n===d)x.s='wait'});
       kmsg('node-'+'abc'[d]+' is down. Its pods are lost and will be rescheduled.');renderStage();
       later(1500,function(){
         var moved=0;
         p.pods.forEach(function(x){if(!p.nodes[x.n]){x.n=leastNode(p);x.s='run';x.id=p.nextId++;moved++}});
         if(moved)kmsg(moved+' pod'+(moved>1?'s':'')+' recreated on healthy nodes.');renderStage();
       });
     }else if(a==='repair'){
       p.nodes=[1,1,1];kmsg('All nodes are back. Existing pods stay where they are.');renderStage();
     }else if(a==='roll'){
       var list=p.pods.filter(function(x){return x.v==='v1'});
       if(!list.length){kmsg('Everything already runs v2.');return}
       kmsg('Rolling out v2, one pod at a time…');
       list.forEach(function(x,k){
         later(k*1000,function(){if(p.pods.indexOf(x)<0)return;x.v='v2';x.s='wait';renderStage()});
         later(k*1000+550,function(){if(p.pods.indexOf(x)<0)return;if(x.s==='wait'&&p.nodes[x.n])x.s='run';renderStage();if(k===list.length-1)kmsg('Rollout complete. Every pod runs v2.')});
       });
     }
   }
  }
});

/* =========================================================
   UI
   ========================================================= */
/* ---------- NEW LESSONS: Git, Docker, EC2, S3 ---------- */

/* ===== Git ===== */
function gitReach(cs,i,set){set=set||{};if(i<0||set[i])return set;set[i]=1;cs[i].p.forEach(function(q){gitReach(cs,q,set)});return set}
function GC(h,l,p,k){return {h:h,l:l,p:p||[],k:k||''}}
function gz(wd,st,repo,rem){return {wd:wd,st:st,repo:repo,rem:rem}}
function gs(z,arrow,c,tags,m){return {z:z,arrow:arrow,c:c,tags:tags,m:m}}
function gmt(branch,commits,ahead,tree,ts){return [['Branch',branch,'n'],['Commits',String(commits),'n'],['Ahead of remote',String(ahead),ahead?'warn':'ok'],['Working tree',tree,ts||'ok']]}
function drawGit(s){
  IOY=96;
  var q=Qnew(),o='',i,names=['Working dir','Staging','Local repo','Remote'],cmd=['add','commit','push'],zic=['folder','clipboard','db','cloud'];
  var content=[s.z.wd,s.z.st,[s.z.repo],[s.z.rem]],cen=[];
  for(i=0;i<4;i++){var d=-7.2+i*4.8,cx=(6.4+d)/2,cy=(6.4-d)/2;cen.push([cx,cy])}
  for(i=0;i<3;i++){
    var a=[cen[i],cen[i+1]],on=s.arrow===i;
    o+=pipe(a,on?'flow':null);
    var mp=P((cen[i][0]+cen[i+1][0])/2,(cen[i][1]+cen[i+1][1])/2,0);
    o+=T(mp[0],mp[1]+18,cmd[i],'lbl xs','middle');
    if(on)o+=packet(pipeD(a),1.2,0,'c-req');
  }
  for(i=0;i<4;i++){
    var cx2=cen[i][0],cy2=cen[i][1],g=plat(cx2-1.1,cy2-1.1,2.2,2.2,i===3?'run':'idle');
    var fl=content[i].slice(0,3);
    fl.forEach(function(t,j){g+=ibox(cx2-0.8+j*0.55,cy2-0.5+j*0.2,5,0.5,0.5,6+j*2,i===2?'teal':(i===3?'blue':'amber'))});
    var tp=P(cx2,cy2,14);
    g+=ic(zic[i],tp[0]-16,tp[1]-30,32);
    var cp=P(cx2,cy2,0);
    var lines=content[i].slice(0,3).map(function(t){return t.length>13?t.slice(0,12)+'…':t});
    var chh=22+lines.length*14;
    g+=card(cp[0],cp[1]-64-chh/2+20,names[i],lines,i===3?'run':'idle',106);
    Qadd(q,cx2,cy2,g);
  }
  o+=Qflush(q);
  var n=s.c.length,dx=n>1?Math.min(70,540/(n-1)):0;
  function X(k){return 50+k*dx}
  function Y(l){return l?352:296}
  s.c.forEach(function(c,k){c.p.forEach(function(pp){
    var a=s.c[pp];
    if(a.l===c.l)o+='<path d="M'+X(pp)+','+Y(a.l)+' L'+X(k)+','+Y(c.l)+'" class="ln"/>';
    else o+='<path d="M'+X(pp)+','+Y(a.l)+' C'+(X(pp)+dx*0.6)+','+Y(a.l)+' '+(X(k)-dx*0.6)+','+Y(c.l)+' '+X(k)+','+Y(c.l)+'" class="ln"/>';
  })});
  s.c.forEach(function(c,k){
    var cls=c.k==='new'?'st-run':(c.k==='merge'?'st-pass':(c.k==='revert'?'st-fail':'')),g2='';
    if(c.k==='new'&&!reduce)g2+='<circle cx="'+X(k)+'" cy="'+Y(c.l)+'" r="16" fill="none" stroke="var(--req)" stroke-width="2.5"><animate attributeName="r" values="16;30" dur="1.3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="1.3s" repeatCount="indefinite"/></circle>';
    g2+='<circle cx="'+X(k)+'" cy="'+Y(c.l)+'" r="16" class="bx '+cls+'"/>'+T(X(k),Y(c.l)+4,c.h,'lbl xs','middle');
    o+=pop(g2);
  });
  var stack={},tl='',tc='';
  s.tags.forEach(function(t){
    var c=s.c[t.c],side=t.s||(/^feature/.test(t.t)?'down':'up'),key=t.c+side,k=stack[key]||0;stack[key]=k+1;
    var cy=side==='up'?Y(c.l)-36-k*30:Y(c.l)+34+k*30,txt=(t.head?'HEAD → ':'')+t.t,cw=Math.round(txt.length*8+26),cx=clamp(X(t.c),cw/2+6,640-cw/2-6);
    tl+='<path d="M'+X(t.c)+','+(side==='up'?Y(c.l)-17:Y(c.l)+17)+' L'+X(t.c)+','+(side==='up'?cy+14:cy-14)+'" class="ln" style="stroke-width:1.6"/>';
    tc+=chip(cx,cy,txt,null,!!t.remote);
  });
  return o+tl+tc;
}
function gitStatic(){
  var A=function(){return GC('a1f',0)},B=function(){return GC('b2c',0,[0])},C=function(k){return GC('c3d',0,[1],k)};
  var mainHead=function(c){return {c:c,t:'main',head:1}},org=function(c){return {c:c,t:'origin/main',remote:1}};
  return [
   gs(gz(['app.py','(edited)'],[],'2 commits','2 commits'),-1,[A(),B()],[mainHead(1),org(1)],gmt('main',2,0,'modified','warn')),
   gs(gz(['app.py'],['app.py','(staged)'],'2 commits','2 commits'),0,[A(),B()],[mainHead(1),org(1)],gmt('main',2,0,'staged','warn')),
   gs(gz(['app.py'],[],'3 commits','2 commits'),1,[A(),B(),C('new')],[mainHead(2),org(1)],gmt('main',3,1,'clean')),
   gs(gz(['app.py'],[],'3 commits','3 commits'),2,[A(),B(),C()],[mainHead(2),org(2)],gmt('main',3,0,'clean')),
   gs(gz(['app.py'],[],'5 commits','3 commits'),-1,[A(),B(),C(),GC('f4a',1,[2]),GC('f5b',1,[3],'new')],[{c:2,t:'main'},org(2),{c:4,t:'feature/login',head:1}],gmt('feature/login',5,2,'clean')),
   gs(gz(['app.py'],[],'6 commits','3 commits'),-1,[A(),B(),C(),GC('f4a',1,[2]),GC('f5b',1,[3]),GC('9ab',0,[2,4],'merge')],[mainHead(5),org(2),{c:4,t:'feature/login'}],gmt('main',6,3,'clean')),
   gs(gz(['app.py'],[],'5 commits','4 commits'),-1,[A(),B(),C(),GC('d4e',0,[2]),GC('e5f',0,[3],'revert')],[mainHead(4),org(3)],gmt('main',5,1,'clean'))
  ];
}
var GIT_HASH=['c3d','d4e','e5f','f6a','a7b','b8c','c9d','d0e','e1f','f2a','a3b','b4c'];
function gitInit(){return {c:[GC('a1f',0),GC('b2c',0,[0])],tips:{main:1,feature:-1},cur:'main',pushed:1,arrow:-1}}
function gitScene(p){
  var cs=p.c,all={},k;
  ['main','feature'].forEach(function(b){if(p.tips[b]>-1)gitReach(cs,p.tips[b],all)});
  var rp=gitReach(cs,p.pushed,{}),ahead=0;
  for(k in all)if(!rp[k])ahead++;
  var tags=[{c:p.tips.main,t:'main',head:p.cur==='main'},{c:p.pushed,t:'origin/main',remote:1}];
  if(p.tips.feature>-1)tags.push({c:p.tips.feature,t:'feature/login',head:p.cur==='feature'});
  return {z:gz(['app.py'],[],cs.length+' commits',Object.keys(rp).length+' commits'),arrow:p.arrow,c:cs,tags:tags,m:gmt(p.cur==='main'?'main':'feature/login',cs.length,ahead,'clean')};
}
(function(){
  var G=gitStatic();
  LESSONS.push({
    id:'git',icon:'branch',parts:[["folder", {}, "Working directory", "The files you edit."], ["clipboard", {}, "Staging area", "What goes into the next commit."], ["db", {}, "Local repository", "Full history on your machine."], ["cloud", {}, "Remote", "The shared copy, for example GitHub."], ["commit", {}, "Commit", "A saved snapshot."], ["branch", {}, "Branch", "A movable label on a line of work."]],group:'Code',name:'Git',
    blurb:'Follow a change through the working directory, staging area and local repository to the remote, then branch, merge and undo with a live commit graph.',
    legend:[['c-run','new commit'],['c-ok','merge commit'],['c-bad','revert commit'],['c-idle','dashed label = remote']],
    draw:drawGit,metrics:function(s){return s.m},
    steps:[
     {label:'Edit',tag:'SETUP',title:'Your files live in three places',text:'You edited app.py in your working directory. Git does not track that change yet. A commit is built in two moves: stage the changes you want, then commit them.',idea:'The staging area lets you build a commit from only the changes you choose.',scene:G[0]},
     {label:'Stage',tag:'ADD',title:'git add stages a change',text:'git add copies the edited file into the staging area. Nothing is saved to history yet, and you can still unstage it.',idea:'git status always tells you which of the three places each file is in.',scene:G[1]},
     {label:'Commit',tag:'COMMIT',title:'git commit saves a snapshot',text:'git commit turns what is staged into a commit: a snapshot with a hash, an author, a message and a pointer to its parent. Your local history now has 3 commits, one more than the remote.',idea:'A commit is a full snapshot, not a diff. Git stores it efficiently by sharing unchanged files.',scene:G[2]},
     {label:'Push',tag:'PUSH',title:'git push shares your commits',text:'git push sends your new commits to the remote so teammates can pull them. The origin/main label moves to your latest commit.',idea:'Until you push, your commits exist only on your machine.',scene:G[3]},
     {label:'Branch',tag:'BRANCH',title:'Branches are cheap pointers',text:'git switch -c feature/login creates a branch at your current commit and moves HEAD to it. After two commits on it, main has not moved. A branch is just a movable label on a commit.',idea:'Branch freely. Creating a branch copies nothing; it only adds a pointer.',scene:G[4]},
     {label:'Merge',tag:'MERGE',title:'Merge joins two histories',text:'Back on main, git merge feature/login creates a merge commit with two parents. Both lines of history are kept.',idea:'If main has not moved, Git can fast-forward and skip the merge commit. Use --no-ff to always record one.',scene:G[5]},
     {label:'Undo',tag:'UNDO',title:'Undo safely with revert',text:'Commit d4e was already pushed and turned out to be bad. git revert d4e adds a new commit that undoes it. History is preserved, so teammates who already pulled are not affected.',idea:'git reset rewrites history, so use it on local work only. Use git revert on anything you have shared.',scene:G[6]},
     {label:'Try it',tag:'PLAY',title:'Build your own history',pg:true,text:'Commit, branch, merge, revert and push in any order. Watch the commit graph, the branch labels and the Ahead of remote counter change.',idea:'Make two commits on feature, one on main, then merge. Then revert the last commit.'}
    ],
    pg:{
     init:gitInit,scene:gitScene,
     controls:function(){return '<button class="btn" type="button" data-act="commit">Commit</button><button class="btn" type="button" data-act="branch">New branch / switch</button><button class="btn" type="button" data-act="merge">Merge feature into main</button><button class="btn" type="button" data-act="revert">Revert last commit</button><button class="btn run" type="button" data-act="push">Push</button><button class="btn" type="button" data-act="reset">Reset</button><p class="msg" id="pgmsg">Start with Commit, then create a branch.</p>'},
     set:function(){},
     act:function(p,a){
       var cs=p.c,idx;
       cs.forEach(function(c){if(c.k==='new')c.k=''});
       p.arrow=-1;
       function add(k,l,par){if(cs.length>=12){kmsg('The graph is full. Press Reset.');return -1}cs.push(GC(GIT_HASH[cs.length%GIT_HASH.length],l,par,k));return cs.length-1}
       if(a==='commit'){
         idx=add('new',p.cur==='main'?0:1,[p.tips[p.cur]]);
         if(idx>-1){p.tips[p.cur]=idx;p.arrow=1;kmsg('Committed on '+(p.cur==='main'?'main':'feature/login')+'. The branch label moved forward.')}
       }else if(a==='branch'){
         if(p.tips.feature===-1){p.tips.feature=p.tips[p.cur];p.cur='feature';kmsg('Created feature/login at the current commit and switched to it.')}
         else{p.cur=p.cur==='main'?'feature':'main';kmsg('Switched to '+(p.cur==='main'?'main':'feature/login')+'. New commits go on this branch.')}
       }else if(a==='merge'){
         if(p.tips.feature===-1){kmsg('Create the feature branch first.')}
         else if(gitReach(cs,p.tips.main)[p.tips.feature]){kmsg('Already up to date. Commit on feature first.')}
         else{idx=add('merge',0,[p.tips.main,p.tips.feature]);if(idx>-1){p.tips.main=idx;p.cur='main';kmsg('Merged feature/login into main with a merge commit.')}}
       }else if(a==='revert'){
         var tip=p.tips[p.cur];
         if(!cs[tip].p.length){kmsg('Nothing to revert yet.')}
         else{idx=add('revert',p.cur==='main'?0:1,[tip]);if(idx>-1){p.tips[p.cur]=idx;kmsg('Added a revert commit. The old commit stays in history.')}}
       }else if(a==='push'){
         p.pushed=p.tips.main;p.arrow=2;kmsg('Pushed main. origin/main now points at your latest main commit.');
       }else if(a==='reset'){
         var f=gitInit();for(var key in f)p[key]=f[key];kmsg('History reset.');
       }
     }
    }
  });
})();

/* ===== Docker ===== */
var DF=['FROM node:20-slim','WORKDIR /app','COPY package*.json ./','RUN npm ci','COPY . .','CMD ["node","app.js"]'];
function dmt(size,layers,ctrs,build,ss){return [['Image size',size,ss||'n'],['Layers',layers,'n'],['Containers',ctrs,'n'],['Build time',build,'n']]}
function drawDocker(s){
  IOY=92;
  var o='',i,q=Qnew();
  var d=box(16,16,176,178,'bx pad',10)+T(30,38,'Dockerfile','lbl xs')+ic('file',150,20,28,{t:'doc'});
  DF.forEach(function(t,k){
    var y=62+k*21;
    if(s.hl.indexOf(k)>-1)d+='<rect x="22" y="'+(y-14)+'" width="164" height="19" rx="4" fill="rgba(63,143,208,.15)" stroke="var(--req)" stroke-width="1.2"/>';
    d+=T(30,y,t.length>21?t.slice(0,20)+'…':t,'lbl sm');
  });
  o+=pop(d);
  var L=s.layers,stMap={'':'blue','n':'teal','ok':'green','warn':'amber','bad':'red','pending':'grey'};
  if(L.length){
    var sp=P(3.2,5.2,0);
    o+=pipe([[4.9,5.4],[7.2,5.4],[7.2,3.4],[8.2,3.4]],s.reg?'flow':null);
    var g=plat(1.9,3.9,3,3,'idle');
    L.forEach(function(l,k){g+=ibox(2.3,4.3,5+k*14,2.2,2.2,12,stMap[l[2]]||'metal',{glow:l[2]==='n'?'rgba(255,138,31,.5)':null})});
    Qadd(q,1.9,3.9,g);
    L.forEach(function(l,k){
      var lp=P(4.5,5.4,5+k*14+6),nm=l[0].length>13?l[0].slice(0,12)+'…':l[0];
      o+=leader(lp[0]+22,lp[1],lp[0]+38,lp[1],'#ff8a1f')+T(lp[0]+42,lp[1]+4,nm+'  '+l[1],'lbl sm');
    });
    var topZ=5+(L.length-1)*14+12,tp=P(3.4,5.0,topZ);
    if(s.tag)o+=chip(tp[0],tp[1]-34,s.tag);
    var bp=P(3.4,6.9,0);o+=T(bp[0],bp[1]+16,'read-only layers','lbl sm','middle');
  }
  var tot=s.n+s.gone;
  if(s.reg){
    var reg=[[9.2,-2.4],[8.9,3.6]];
    Qadd(q,9.2,-2.4,plat(9.2,-2.4,2.2,2.2,'run')+bill('cloud',10.3,-1.3,6,50));
    var rp=P(10.3,-1.3,0);o+=T(rp[0],rp[1]+34,'registry','lbl xs','middle')+chip(rp[0],rp[1]+60,'app:1.1');
    Qadd(q,8.9,3.6,plat(8.9,3.6,2.4,2.4,s.reg===2?'ok':'idle')+rack(9.4,4.1,s.reg===2?'ok':'warm'));
    var bp2=P(10.1,6.0,0);o+=T(bp2[0],bp2[1]+16,'server B','lbl xs','middle');
    o+=pipe([[7.2,3.4],[7.2,-1.3],[9.2,-1.3]],'flow')+packet(pipeD([[7.2,3.4],[7.2,-1.3],[9.2,-1.3]]),1.8,0,'c-req');
    if(s.reg===2){o+=pipe([[10.3,0.6],[10.3,3.6]],'flow')+packet(pipeD([[10.3,0.6],[10.3,3.6]]),1.2,0,'c-res')+chip(bp2[0],bp2[1]+44,'running','c-res')}
  }else if(tot){
    var hx=8.2,hy=1.6,hh=Math.max(3.4,tot*0.95+0.8),g2=plat(hx,hy,2.8,hh,'ok');
    for(i=0;i<tot;i++){
      var gone=i<s.gone;
      g2+=ibox(hx+0.4,hy+0.4+i*0.95,5,2.0,0.8,11,gone?'grey':'teal',{op:gone?.45:1,glow:gone?null:'rgba(255,138,31,.4)'});
    }
    Qadd(q,hx,hy,g2);
    o+=pipe([[7.2,3.4],[7.2,hy+hh/2],[hx,hy+hh/2]],'flow');
    var hp=P(hx+1.4,hy+hh,0);o+=T(hp[0],hp[1]+16,'host · '+s.n+' running','lbl xs','middle');
    if(s.port)o+=chip(538,34,'host :8080 → :3000');
    if(s.vol){var vp=P(hx+3.6,hy+hh/2,6);o+=pipe([[hx+2.8,hy+hh/2],[hx+3.6,hy+hh/2]]);Qadd(q,hx+3.2,hy+hh/2-0.4,bill('disk',hx+3.7,hy+hh/2,6,36));o+=T(vp[0],vp[1]+16,'volume','lbl sm','middle')}
  }
  o=Qflush(q)+o;
  if(s.cmd){
    o+='<rect x="16" y="350" width="608" height="24" rx="6" class="term"/>'+T(30,367,'$ '+s.cmd,'tl');
    o+='<rect x="'+Math.round(30+(s.cmd.length+2)*7.25+5)+'" y="355" width="7" height="13" fill="#6ee7a8">'+(reduce?'':'<animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>')+'</rect>';
  }
  return o;
}
function dl(st){return [['node:20-slim','240 MB',st[0]],['WORKDIR','0 B',st[1]],['package.json','1 MB',st[2]],['npm ci','110 MB',st[3]],['app code','5 MB',st[4]]]}
function fmtMB(mb){return mb>=1000?(mb/1000).toFixed(2)+' GB':mb+' MB'}
function dockerScene(p){
  var base=p.slim?240:1100,deps=p.multi?45:110,total=base+1+deps+5;
  return {hl:[],layers:[[p.slim?'node:20-slim':'node:20',fmtMB(base),''],['WORKDIR','0 B',''],['package.json','1 MB',''],[p.multi?'deps (prod)':'npm ci',fmtMB(deps),''],['app code','5 MB','']],tag:'app:1.1',n:p.n,gone:0,port:false,vol:false,reg:0,cmd:'docker compose up --scale web='+p.n,
    m:[['Image size',fmtMB(total),total>800?'warn':'ok'],['Containers',String(p.n),'n'],['Disk used',fmtMB(total+p.n*2),'ok'],['As VMs','≈ '+(p.n*2)+' GB','warn']]};
}
LESSONS.push({
  id:'docker',icon:'container',parts:[["file", {"t": "doc"}, "Dockerfile", "The recipe for an image."], ["layers", {}, "Image", "Read-only layers stacked from the recipe."], ["container", {}, "Container", "A running instance of an image."], ["cloud", {}, "Registry", "Where images are stored and shared."], ["server", {}, "Host", "The machine that runs containers."], ["disk", {}, "Volume", "Storage that survives a container."]],group:'Containers',name:'Docker',
  blurb:'See how a Dockerfile becomes layers, why builds are cached, how containers share an image, and how volumes and registries fit in.',
  legend:[['c-run','new layer'],['c-ok','cached layer or running container'],['c-wait','rebuilt layer'],['c-queue','writable layer']],
  draw:drawDocker,metrics:function(s){return s.m},
  steps:[
   {label:'Dockerfile',tag:'SETUP',title:'A Dockerfile is a recipe',text:'A Dockerfile lists the steps to build an image: start from a base image, copy files in, install dependencies and say what to run. Each instruction becomes one read-only layer.',idea:'FROM picks the base. RUN, COPY and ADD each create a layer. CMD only records the default command.',
    scene:{hl:[],layers:[],tag:'',n:0,gone:0,port:false,vol:false,reg:0,cmd:'',m:dmt('—','0','0','—')}},
   {label:'Build',tag:'BUILD',title:'Build stacks the layers into an image',text:'docker build runs the instructions in order and stacks the results into an image tagged app:1.0. The five layers add up to about 356 MB, most of it the base image.',idea:'An image is a stack of read-only layers plus metadata. It does not run by itself.',
    scene:{hl:[],layers:dl(['new','new','new','new','new']),tag:'app:1.0',n:0,gone:0,port:false,vol:false,reg:0,cmd:'docker build -t app:1.0 .',m:dmt('356 MB','5','0','58 s')}},
   {label:'Cache',tag:'CACHE',title:'Unchanged layers come from cache',text:'You change one line of application code and build again. Docker reuses the four unchanged layers and rebuilds only the last one, so the build takes seconds. This is why package.json is copied before the source code.',idea:'Order instructions from least to most frequently changed to get the best cache hits.',
    scene:{hl:[4],layers:dl(['cached','cached','cached','cached','dirty']),tag:'app:1.1',n:0,gone:0,port:false,vol:false,reg:0,cmd:'docker build -t app:1.1 .',m:dmt('356 MB','5','0','3 s','ok')}},
   {label:'Run',tag:'RUN',title:'A container is a running image',text:'docker run starts a container from the image. Docker adds a thin writable layer on top and publishes container port 3000 on host port 8080. The image itself never changes.',idea:'Many containers can run from one image. They share the read-only layers.',
    scene:{hl:[],layers:dl(['','','','','']),tag:'app:1.1',n:1,gone:0,port:true,vol:false,reg:0,cmd:'docker run -d -p 8080:3000 app:1.1',m:dmt('356 MB','5','1','—')}},
   {label:'Volume',tag:'DATA',title:'Keep data in a volume',text:'The first container was removed, and everything in its writable layer went with it. The new container mounts a named volume, which lives outside any container, so the data is still there.',idea:'Containers are disposable. Put anything you need to keep in a volume or an external database.',
    scene:{hl:[],layers:dl(['','','','','']),tag:'app:1.1',n:1,gone:1,port:false,vol:true,reg:0,cmd:'docker run -d -v db-data:/data app:1.1',m:[['Image size','356 MB','n'],['Containers','1 running','ok'],['Old container','removed','warn'],['Volume data','kept','ok']]}},
   {label:'Registry',tag:'SHARE',title:'A registry shares images',text:'docker push uploads the image to a registry. Another server runs docker pull and gets exactly the same layers, so the app behaves the same everywhere.',idea:'Registries store images by name and tag. Pin a version tag, because latest can change under you.',
    scene:{hl:[],layers:dl(['','','','','']),tag:'app:1.1',n:0,gone:0,port:false,vol:false,reg:2,cmd:'docker push registry.io/team/app:1.1',m:[['Pushed','app:1.1','ok'],['Pulled by','server B','ok'],['Layers sent','changed only','n'],['Same image','yes','ok']]}},
   {label:'Try it',tag:'PLAY',title:'Shrink the image, scale the containers',pg:true,text:'Add containers and see how little extra disk they cost. Switch the base image and the build style to shrink the image, then compare with the As VMs figure.',idea:'Slim or alpine bases and multi-stage builds cut image size, which speeds up pulls and deploys.'}
  ],
  pg:{
   init:function(){return {n:3,slim:true,multi:false}},scene:dockerScene,
   controls:function(p){return '<label class="ctl"><span>Containers <b id="v-n">'+p.n+'</b></span><input type="range" id="c-n" data-k="n" min="1" max="6" step="1" value="'+p.n+'"></label>'+
    '<label class="ctl chk"><input type="checkbox" id="c-slim" data-k="slim"'+(p.slim?' checked':'')+'> Slim base image</label>'+
    '<label class="ctl chk"><input type="checkbox" id="c-multi" data-k="multi"'+(p.multi?' checked':'')+'> Multi-stage build</label>'},
   set:function(p,k,v){p[k]=v},act:function(){}
  }
});

/* ===== AWS EC2 ===== */
var EC2T=[['t3.micro',2,1,0.0104],['t3.medium',2,4,0.0416],['t3.large',2,8,0.0832],['m6i.xlarge',4,16,0.192],['c6i.2xlarge',8,16,0.34],['r6i.2xlarge',8,64,0.504]];
var EC2_BUY=['On-demand','Savings plan','Spot'],EC2_MULT=[1,0.7,0.35];
function drawEC2(s){
  IOY=78;
  var o='',i,q=Qnew();
  if(s.buy){
    var rows=[['On-demand','$0.083 / hr',1,'amber','pay by the second'],['Savings plan','≈ $0.058 / hr',0.7,'green','1-3 yr term'],['Spot','≈ $0.029 / hr',0.35,'blue','2 min stop notice']];
    o+=chip(330,24,'t3.large · Linux · us-east-1 (approx.)');
    rows.forEach(function(r,k){
      var d=-6.8+k*6.8,cx=(10+d)/2,cy=(10-d)/2,hh=Math.round(110*r[2]),g=plat(cx-1.3,cy-1.3,2.6,2.6,'idle')+ibox(cx-0.9,cy-0.9,5,1.8,1.8,hh,r[3],{glow:'rgba(255,138,31,.35)'});
      var bp=P(cx,cy,0);
      g+=card(bp[0],bp[1]+56,r[0],[r[1],r[4]],'idle',142);
      Qadd(q,cx,cy,g);
    });
    return o+Qflush(q);
  }
  var vpc=s.vpc,ix=vpc?6.6:4.6,iy=vpc?2.0:2.2,tone=s.st==='running'?'ok':(s.st==='pending'?'wait':'idle');
  var rt=s.st==='running'?'ok':(s.st==='pending'?'warm':'dead');
  if(vpc){
    var vp=P(5.0,0.6,0);
    o+=ring(4.8,0.5,6.4,5.8,'#ff8a1f','8 6')+ring(5.2,0.9,5.6,5.0,'#8a96a5','3 5');
    o+=ic('cloud',vp[0]-8,vp[1]-22,30)+T(vp[0]+28,vp[1]-2,'VPC 10.0.0.0/16','lbl sm');
    o+=T(vp[0]+28,vp[1]+12,'public subnet 10.0.1.0/24','lbl sm');
    Qadd(q,0,5.2,plat(0,5.2,2,2,'idle')+bill('laptop',1,6.2,5,46));
    var lp=P(1,7.2,0);o+=T(lp[0],lp[1]+16,'you','lbl xs','middle');
    Qadd(q,3.4,4.5,plat(3.4,4.5,1.4,1.4,'run')+bill('globe',4.1,5.2,5,38));
    var gp=P(4.1,5.9,0);o+=T(gp[0],gp[1]+14,'IGW','lbl xs','middle');
    (s.req||[]).forEach(function(r){
      var off=(r.k-1)*0.35,a=r.ok?[[2.0,6.2+off],[4.1+off,6.2+off],[4.1+off,3.1+off],[ix,3.1+off]]:[[2.0,6.2+off],[4.1+off,6.2+off],[4.1+off,3.1+off],[5.6,3.1+off]];
      o+=pipe(a,r.ok?null:'dead');
      if(r.ok)o+=packet(pipeD(a),2.2,r.k*0.6,'c-req');else o+=xmark(5.7,3.1+off,6);
    });
  }else{
    var d1='M212,168 C290,168 300,178 340,186',d2='M212,204 C290,204 300,198 340,196';
    o+='<path d="'+d1+'" class="ln flow"/><path d="'+d2+'" class="ln flow"/>'+chip(130,168,'AMI: Amazon Linux')+chip(130,204,'type: '+s.type);
  }
  var g=plat(ix,iy,2.2,2.2,tone,s.st==='stopped');
  if(s.sg)g+=ring(ix-0.4,iy-0.4,3.0,3.0,'#3f8fd0','3 5',5.6);
  g+=rack(ix+0.4,iy+0.4,rt);
  var cp=P(ix+1.1,iy+1.1,0),top=P(ix+1.1,iy+1.1,44);
  Qadd(q,ix,iy,g);
  o+=Qflush(q);
  o+=card(cp[0]+30,40,'EC2 instance',[s.type+' · '+s.vcpu+' vCPU',s.mem+' GiB · '+s.st],tone==='idle'?'bad':tone,160)+leader(cp[0]+30,72,top[0],top[1]-4);
  if(s.sg){
    var sgp=P(ix+3.0,iy+0.2,6);
    o+=ic('shield',sgp[0]-6,sgp[1]-34,26)+T(sgp[0]+22,sgp[1]-16,'security group','lbl sm');
    var rl=[[s.sg.ssh===2?'SSH · any IP':(s.sg.ssh===1?'SSH · my IP':'SSH closed'),s.sg.ssh],['HTTP 80',s.sg.http],['MySQL 3306',s.sg.db]];
    rl.forEach(function(r,k){var w=r[0].length*8+38,dot=r[1]===0?'c-bad':(r[1]===2?'c-slow':'c-res');o+=chip(clamp(sgp[0]+80,w/2+8,640-w/2-8),sgp[1]+4+k*34,r[0],dot)});
  }
  if(s.ebs){
    var ep=P(ix+1.1,iy+3.8,0);
    o+=pipe([[ix+1.1,iy+2.2],[ix+1.1,iy+3.6]])+bill('disk',ix+1.1,iy+3.9,5,36)+T(ep[0],ep[1]+20,'EBS 8 GB gp3','lbl xs','middle');
  }
  if(s.ip)o+=chip(cp[0]+30,310,'private 10.0.1.25')+chip(cp[0]+30,344,'public 3.91.40.12');
  return o;
}
function ec2Scene(p){
  var t=EC2T[p.ti],price=t[3]*EC2_MULT[p.buy],mo=price*730,exp=p.db?['DB open to internet','bad']:(p.ssh?['SSH open to world','warn']:['locked down','ok']);
  return {st:'running',type:t[0],vcpu:t[1],mem:t[2],vpc:true,ebs:true,ip:false,sg:{ssh:p.ssh?2:1,http:p.http?1:0,db:p.db?2:0},
    req:[{k:0,ok:1},{k:1,ok:p.http?1:0},{k:2,ok:p.db?1:0}],
    m:[['vCPU / memory',t[1]+' / '+t[2]+' GiB','n'],['Price / hour','$'+price.toFixed(4),'n'],['Per month','≈ $'+(mo<10?mo.toFixed(2):Math.round(mo)),'n'],['Exposure',exp[0],exp[1]]]};
}
(function(){
  var base={st:'running',type:'t3.micro',vcpu:2,mem:1,vpc:false,ebs:false,ip:false,sg:null,req:[]};
  function sc(o){var r={},k;for(k in base)r[k]=base[k];for(k in o)r[k]=o[k];return r}
  var sgOn={ssh:1,http:1,db:0},reqs=[{k:0,ok:1},{k:1,ok:1},{k:2,ok:0}];
  LESSONS.push({
    id:'ec2',icon:'server',parts:[["laptop", {}, "You", "Connect from your own computer."], ["globe", {}, "Internet gateway", "The door between the VPC and the internet."], ["cloud", {}, "VPC", "Your private network in AWS."], ["shield", {}, "Security group", "A firewall around the instance."], ["server", {}, "EC2 instance", "A virtual server."], ["disk", {}, "EBS volume", "The instance's disk."]],group:'Cloud',name:'AWS EC2',
    blurb:'Launch a virtual server, put it on a network, lock it down with a security group, give it a disk, resize it and compare pricing models. Prices are approximate us-east-1 Linux rates.',
    legend:[['c-res','allowed or running'],['c-bad','blocked or stopped'],['c-slow','allowed from anywhere'],['c-queue','pending']],
    draw:drawEC2,metrics:function(s){return s.m},
    steps:[
     {label:'Launch',tag:'SETUP',title:'An instance is a virtual server',text:'Launching an EC2 instance means picking an AMI (the operating system image) and an instance type (how much CPU and memory). A t3.micro has 2 vCPUs and 1 GiB of memory and costs about a cent an hour.',idea:'Pick the smallest type that fits, then resize. Types are named family, generation and size, like t3.micro.',
      scene:sc({m:[['Instance type','t3.micro','n'],['vCPU / memory','2 / 1 GiB','n'],['Price','$0.0104 / hr','n'],['State','running','ok']]})},
     {label:'Network',tag:'VPC',title:'It lives inside a VPC',text:'The instance runs in a subnet of your Virtual Private Cloud, your own isolated network. An internet gateway connects the subnet to the internet, and the instance gets a private IP plus a public one.',idea:'The private IP is for traffic inside the VPC. A public IP or Elastic IP is needed to be reachable from the internet.',
      scene:sc({vpc:true,ip:true,m:[['VPC','10.0.0.0/16','n'],['Subnet','10.0.1.0/24','n'],['Private IP','10.0.1.25','n'],['Public IP','3.91.40.12','ok']]})},
     {label:'Firewall',tag:'SECURITY',title:'Security groups are the firewall',text:'A security group lists what is allowed in. Here SSH is open only to your IP, HTTP to everyone, and MySQL is not listed, so that traffic is dropped. The default is to deny all inbound traffic.',idea:'Do not open SSH or a database port to 0.0.0.0/0 unless you must. Allow only the sources that need access.',
      scene:sc({vpc:true,sg:sgOn,req:reqs,m:[['SSH 22','my IP only','ok'],['HTTP 80','allowed','ok'],['MySQL 3306','blocked','warn'],['State','running','ok']]})},
     {label:'Storage',tag:'EBS',title:'EBS gives it a disk',text:'The root disk is an EBS volume, network storage attached to the instance. It survives a stop and start. By default the root volume is deleted when you terminate the instance.',idea:'Stop pauses the instance and keeps the disk. Terminate destroys the instance and, by default, its root disk. Take snapshots for backups.',
      scene:sc({vpc:true,sg:sgOn,ebs:true,m:[['Root volume','8 GB gp3','n'],['On stop','data kept','ok'],['On terminate','deleted','warn'],['State','running','ok']]})},
     {label:'Resize',tag:'SCALE',title:'Stop, resize, start',text:'Change the instance type while it is stopped. Here t3.micro becomes t3.large with 8 GiB of memory. While stopped you pay for the EBS volume but not for compute.',idea:'Vertical scaling needs a restart. Horizontal scaling, adding more instances, does not.',
      scene:sc({vpc:true,sg:sgOn,ebs:true,st:'stopped',type:'t3.large',mem:8,m:[['Instance type','t3.large','n'],['vCPU / memory','2 / 8 GiB','n'],['Compute billing','paused','ok'],['State','stopped','warn']]})},
     {label:'Pricing',tag:'COST',title:'Pay less with the right pricing',text:'On-demand has no commitment. A Savings Plan gives a lower rate for a 1 or 3 year commitment. Spot uses spare capacity at a steep discount, but AWS can take it back with two minutes notice.',idea:'Use spot for fault-tolerant work such as batch jobs. Keep databases and single points of failure on on-demand or savings plans.',
      scene:sc({buy:true,m:[['On-demand','$0.083 / hr','n'],['Savings plan','≈ $0.058 / hr','ok'],['Spot','≈ $0.029 / hr','warn'],['On-demand / month','≈ $61','n']]})},
     {label:'Try it',tag:'PLAY',title:'Configure your own instance',pg:true,text:'Pick an instance type, change who can reach it and choose a pricing model. The cost and exposure tiles update as you go.',idea:'Turn on SSH from anywhere and watch the exposure warning. Then try the Spot price.'}
    ],
    pg:{
     init:function(){return {ti:0,ssh:false,http:true,db:false,buy:0}},scene:ec2Scene,
     fmt:{ti:function(v){return EC2T[v][0]},buy:function(v){return EC2_BUY[v]}},
     controls:function(p){return '<label class="ctl"><span>Instance type <b id="v-ti">'+EC2T[p.ti][0]+'</b></span><input type="range" id="c-ti" data-k="ti" min="0" max="5" step="1" value="'+p.ti+'"></label>'+
      '<label class="ctl"><span>Pricing <b id="v-buy">'+EC2_BUY[p.buy]+'</b></span><input type="range" id="c-buy" data-k="buy" min="0" max="2" step="1" value="'+p.buy+'"></label>'+
      '<label class="ctl chk"><input type="checkbox" id="c-ssh" data-k="ssh"'+(p.ssh?' checked':'')+'> SSH from anywhere</label>'+
      '<label class="ctl chk"><input type="checkbox" id="c-http" data-k="http"'+(p.http?' checked':'')+'> Allow HTTP 80</label>'+
      '<label class="ctl chk"><input type="checkbox" id="c-db" data-k="db"'+(p.db?' checked':'')+'> Open MySQL 3306</label>'},
     set:function(p,k,v){p[k]=v},act:function(){}
    }
  });
})();

/* ===== AWS S3 ===== */
var FICON={png:'img',pdf:'pdf',html:'html',gz:'doc'};
var S3_RIGHT_IC={'one object':'file','who can read':'lock','presigned URL':'clock','report.pdf':'layers','storage classes':'bucket','lifecycle rule':'clock'};
var FICON={png:'img',pdf:'pdf',html:'html',gz:'doc'};
var S3_RIGHT_IC={'one object':'file','who can read':'lock','presigned URL':'clock','report.pdf':'layers','storage classes':'bucket','lifecycle rule':'clock'};
var FICON={png:'img',pdf:'pdf',html:'html',gz:'doc'};
var S3_RIGHT_IC={'one object':'file','who can read':'lock','presigned URL':'clock','report.pdf':'layers','storage classes':'bucket','lifecycle rule':'clock'};
var FICON={png:'img',pdf:'pdf',html:'html',gz:'doc'};
var S3_RIGHT_IC={'one object':'file','who can read':'lock','presigned URL':'clock','report.pdf':'layers','storage classes':'bucket','lifecycle rule':'clock'};
var FICON={png:'img',pdf:'pdf',html:'html',gz:'doc'};
var S3_RIGHT_IC={'one object':'file','who can read':'lock','presigned URL':'clock','report.pdf':'layers','storage classes':'bucket','lifecycle rule':'clock'};
var FICON={png:'img',pdf:'pdf',html:'html',gz:'doc'};
var S3_RIGHT_IC={'one object':'file','who can read':'lock','presigned URL':'clock','report.pdf':'layers','storage classes':'bucket','lifecycle rule':'clock'};
function drawS3(s){
  var o='',i,cnt={app:0,pub:0},q=Qnew();
  (s.req||[]).forEach(function(r){
    var ly=r.f==='app'?96:284,ex=r.ok?244:226,d='M112,'+ly+' L'+ex+','+ly;
    o+='<path d="'+d+'" class="ln'+(r.ok?'':' dead')+'"/>';
    if(r.ok)o+=packet(d,1.6,cnt[r.f]*0.5,r.c||'c-res');else o+='<path d="M220,'+(ly-7)+' l12,14 m0,-14 l-12,14" class="cross"/>';
  });
  var ap=G(63,100),up=G(63,288);
  Qadd(q,ap[0],ap[1],plat(ap[0]-1.1,ap[1]-1.1,2.2,2.2,'ok')+rack(ap[0]-0.7,ap[1]-0.7,'ok'));
  o+=T(63,150,'app · IAM role','lbl xs','middle');
  Qadd(q,up[0],up[1],plat(up[0]-1.1,up[1]-1.1,2.2,2.2,'idle')+bill('user',up[0],up[1],5,44,{k:1}));
  o+=T(63,338,'public user','lbl xs','middle');
  o=Qflush(q)+o;
  var blocked=s.acc.indexOf('blocked')>-1;
  o+=pop(box(244,30,190,320,'bx',14)+T(260,56,'my-app-assets','lbl')+T(260,76,s.acc,'lbl sm')+cyl(406,66,17,26,'teal','rgba(255,138,31,.5)')+(blocked?ic('lock',398,46,18):''));
  s.objs.forEach(function(ob,k){
    var y=92+k*46,ext=ob.k.split('.').pop();
    o+=pop('<rect x="258" y="'+y+'" width="162" height="36" rx="8" class="bx '+(ob.st||'')+'" style="stroke-width:1.6"/>'+ic('file',264,y+6,24,{t:FICON[ext]||'doc'})+T(294,y+23,ob.k,'lbl xs')+T(412,y+23,ob.b,'lbl sm','end'));
  });
  (s.req||[]).forEach(function(r){
    var ly=r.f==='app'?96:284,cy=ly+30+cnt[r.f]*30;cnt[r.f]++;
    o+=chip(178,cy,r.t,r.ok?'c-res':'c-bad');
  });
  if(s.clock)o+=chip(100,372,'15 min link','c-queue');
  var st={ok:'st-pass',bad:'st-fail',run:'st-run'},ri=S3_RIGHT_IC[s.right.title];
  var rg=box(458,30,166,320,'bx',12)+T(472,56,s.right.title,'lbl xs')+(ri?ic(ri,590,34,26):'');
  s.right.rows.forEach(function(r,k){
    var y=76+k*52;
    rg+='<rect x="472" y="'+y+'" width="138" height="44" rx="8" class="bx '+(st[r[2]]||'')+'" style="stroke-width:1.6"/>'+T(482,y+19,r[0],'lbl xs')+T(482,y+35,r[1],'lbl sm');
  });
  o+=pop(rg);
  return o;
}
function s3Scene(p){
  var gone=p.del&&!p.ver,marker=p.del&&p.ver,objs=[{k:'img/logo.png',b:'v1'},{k:'index.html',b:'v1'}],rows=[],k;
  if(!gone)objs.splice(1,0,marker?{k:'docs/report.pdf',b:'del',st:'st-fail'}:{k:'docs/report.pdf',b:p.ver?'v'+p.n:'v1'});
  if(gone)rows.push(['gone','no versions kept','bad']);
  else{
    if(marker)rows.push(['delete marker','current','bad']);
    if(p.ver){for(k=p.n;k>=1&&rows.length<4;k--)rows.push(['v'+k,marker?'hidden':(k===p.n?'current':'older'),(!marker&&k===p.n)?'ok':''])}
    else rows.push(['v1','current','ok']);
  }
  var rc=gone?'404':(p.last?p.last:'—');
  return {objs:objs,acc:p.block?'public: blocked':'public: open',req:p.req,clock:false,right:{title:'report.pdf',rows:rows},
    m:[['Visible objects',String(objs.length),'n'],['Versions kept',gone?'0':String(p.ver?p.n:1),'n'],['Public access',p.block?'blocked':'open',p.block?'ok':'warn'],['Last response',p.last||'—',p.last==='200'?'ok':(p.last?'bad':'n')]]};
}
(function(){
  var O3=[{k:'img/logo.png',b:'v1'},{k:'docs/report.pdf',b:'v1'},{k:'index.html',b:'v1'}];
  function R(t,rows){return {title:t,rows:rows}}
  function sc(o){var r={objs:O3,acc:'public: blocked',req:[],clock:false},k;for(k in o)r[k]=o[k];return r}
  var appGet={f:'app',t:'GET 200',ok:1,c:'c-res'},appPut={f:'app',t:'PUT 200',ok:1,c:'c-req'};
  LESSONS.push({
    id:'s3',icon:'bucket',parts:[["bucket", {}, "Bucket", "A container for objects with a unique name."], ["file", {"t": "img"}, "Object", "A file plus a key and metadata."], ["lock", {}, "Block public access", "A master switch against public reads."], ["clock", {}, "Presigned URL", "A temporary link to one object."], ["user", {}, "Public user", "Someone with no AWS permissions."], ["server", {}, "App with IAM role", "Your server, allowed by role not by key."]],group:'Cloud',name:'AWS S3',
    blurb:'Learn how object storage works: buckets and keys, who can read what, temporary links, versioning, storage classes and lifecycle rules. Prices are approximate us-east-1 rates.',
    legend:[['c-req','write'],['c-res','read'],['c-bad','denied or not found'],['c-queue','time limited']],
    draw:drawS3,metrics:function(s){return s.m},
    steps:[
     {label:'Bucket',tag:'SETUP',title:'A bucket holds objects',text:'S3 is object storage. A bucket is a container with a globally unique name, and each object in it is found by its key, such as img/logo.png. The slash is part of the name; there are no real folders.',idea:'S3 is a key-to-bytes store, not a file system. A prefix like docs/ just groups keys.',
      scene:sc({right:R('one object',[['key','img/logo.png',''],['value','84 KB of bytes',''],['metadata','image/png, tags',''],['version','versioning off','']]),m:[['Objects','3','n'],['Stored','1.2 MB','n'],['Public access','blocked','ok'],['Requests','—','n']]})},
     {label:'Put and Get',tag:'API',title:'Everything is an HTTP request',text:'Your app uploads with PUT and downloads with GET over HTTPS. Each call is signed with credentials from an IAM role, so S3 knows who is asking. Both calls here succeed with status 200.',idea:'Use an IAM role on the server instead of storing access keys in code.',
      scene:sc({req:[appPut,appGet],right:R('HTTP verbs',[['PUT','upload an object',''],['GET','download it',''],['DELETE','remove it',''],['LIST','keys by prefix','']]),m:[['Requests','2','n'],['PUT','200','ok'],['GET','200','ok'],['Objects','3','n']]})},
     {label:'Private',tag:'ACCESS',title:'Private by default',text:'A new bucket denies everyone except identities you allow. The app role can read, but an anonymous public GET returns 403 Forbidden. Block Public Access adds a second lock that stops a mistaken policy from exposing data.',idea:'Most S3 data leaks come from buckets made public by mistake. Keep Block Public Access on.',
      scene:sc({req:[appGet,{f:'pub',t:'GET 403',ok:0}],right:R('who can read',[['Block public access','ON','ok'],['IAM role','allows the app','ok'],['Public user','no permission','bad']]),m:[['Public access','blocked','ok'],['Last public GET','403','bad'],['App GET','200','ok'],['Objects','3','n']]})},
     {label:'Signed URL',tag:'SHARE',title:'Share one file with a temporary link',text:'To let a customer download one report without making anything public, your app creates a presigned URL. It carries a signature and an expiry time, here 15 minutes. After that it stops working.',idea:'A presigned URL grants one action on one object for a limited time, using the permissions of whoever signed it.',
      scene:sc({req:[{f:'app',t:'sign URL',ok:1,c:'c-req'},{f:'pub',t:'URL 200',ok:1,c:'c-res'}],clock:true,right:R('presigned URL',[['made by','your app',''],['expires','in 15 minutes','run'],['allows','one GET only',''],['bucket','still private','ok']]),m:[['Public access','blocked','ok'],['Link lifetime','15 min','warn'],['Last public GET','200','ok'],['Objects','3','n']]})},
     {label:'Versioning',tag:'SAFETY',title:'Versioning keeps every overwrite',text:'With versioning on, uploading report.pdf again does not replace the old file. It creates a new version and keeps the previous ones, so a bad upload can be rolled back.',idea:'Versioning protects against overwrites and deletes. You pay for every stored version, so pair it with a lifecycle rule.',
      scene:sc({objs:[{k:'img/logo.png',b:'v1'},{k:'docs/report.pdf',b:'v3'},{k:'index.html',b:'v1'}],req:[appPut],right:R('report.pdf',[['v3','current','ok'],['v2','older',''],['v1','older','']]),m:[['Versions','3','ok'],['Current','v3','n'],['Rollback','possible','ok'],['Objects','3','n']]})},
     {label:'Delete',tag:'SAFETY',title:'A delete only adds a marker',text:'Deleting a versioned object adds a delete marker on top. A GET now returns 404, but all three versions are still stored. Remove the marker and the file is back.',idea:'Without versioning, a delete is permanent. With it, deleting is reversible.',
      scene:sc({objs:[{k:'img/logo.png',b:'v1'},{k:'docs/report.pdf',b:'del',st:'st-fail'},{k:'index.html',b:'v1'}],req:[{f:'app',t:'DELETE 204',ok:1,c:'c-req'}],right:R('report.pdf',[['delete marker','current','bad'],['v3','hidden',''],['v2','hidden',''],['v1','hidden','']]),m:[['GET report.pdf','404','bad'],['Versions kept','3','ok'],['Visible objects','2','warn'],['Recover','remove marker','n']]})},
     {label:'Classes',tag:'COST',title:'Cheaper classes for colder data',text:'S3 Standard is for data you read often. Infrequent Access, Glacier Instant Retrieval and Deep Archive cost less to store but charge for retrieval or take longer to read. Storing 1,000 GB ranges from about $23 to about $1 a month.',idea:'Pick the class by how often you read the data, not by how important it is.',
      scene:sc({right:R('storage classes',[['Standard','$23 / 1,000 GB','run'],['Standard-IA','$12.50 / 1,000 GB',''],['Glacier Instant','$4 / 1,000 GB',''],['Deep Archive','$1 / 1,000 GB','']]),m:[['Standard','$23 / mo','n'],['Standard-IA','$12.50 / mo','n'],['Glacier Instant','$4 / mo','n'],['Deep Archive','$1 / mo','ok']]})},
     {label:'Lifecycle',tag:'COST',title:'Lifecycle rules move data for you',text:'A lifecycle rule moves objects to cheaper classes as they age, then deletes them. Logs start in Standard, move to Infrequent Access after 30 days, Glacier after 90 and are deleted after a year, without any code.',idea:'Write the rule once. S3 applies it to every object, including new ones.',
      scene:sc({objs:[{k:'logs/new.gz',b:'Std'},{k:'logs/mar.gz',b:'IA',st:'st-run'},{k:'logs/jan.gz',b:'Glacier',st:'st-pass'}],right:R('lifecycle rule',[['day 0','Standard','ok'],['day 30','→ Standard-IA',''],['day 90','→ Glacier Instant',''],['day 365','→ delete','']]),m:[['Rule','30 / 90 / 365 days','n'],['Saving','up to ~95%','ok'],['Retrieval','slower','warn'],['Code needed','none','ok']]})},
     {label:'Try it',tag:'PLAY',title:'Break a bucket safely',pg:true,text:'Toggle Block Public Access and versioning, then try a public GET, overwrite the report and delete it. Compare what you can recover with versioning on and off.',idea:'Turn versioning off, delete the report, then try Restore. Now repeat with versioning on.'}
    ],
    pg:{
     init:function(){return {block:true,ver:false,n:1,del:false,last:null,req:[]}},scene:s3Scene,
     controls:function(p){return '<label class="ctl chk"><input type="checkbox" id="c-block" data-k="block"'+(p.block?' checked':'')+'> Block public access</label>'+
      '<label class="ctl chk"><input type="checkbox" id="c-ver" data-k="ver"'+(p.ver?' checked':'')+'> Versioning</label>'+
      '<button class="btn" type="button" data-act="pub">Public GET</button><button class="btn" type="button" data-act="put">Upload / overwrite</button><button class="btn" type="button" data-act="del">Delete</button><button class="btn run" type="button" data-act="restore">Restore</button><p class="msg" id="pgmsg">Try a public GET with Block public access on, then off.</p>'},
     set:function(p,k,v){p[k]=v},
     act:function(p,a){
       var gone=p.del&&!p.ver,marker=p.del&&p.ver;
       if(a==='pub'){
         var res=(gone||marker)?'404':(p.block?'403':'200');
         p.last=res;p.req=[{f:'pub',t:'GET '+res,ok:res==='200'}];
         kmsg(res==='200'?'200: the file was served to an anonymous user.':(res==='403'?'403: access denied because public access is blocked.':'404: the object does not exist as far as GET is concerned.'));
       }else if(a==='put'){
         if(p.del){p.del=false;if(p.ver)p.n++;else p.n=1;kmsg(p.ver?'New version uploaded on top of the delete marker.':'Uploaded report.pdf as a new object.')}
         else if(p.ver){p.n++;kmsg('Saved as version v'+p.n+'. Older versions are kept.')}
         else kmsg('Overwritten in place. The old content is gone.');
         p.req=[{f:'app',t:'PUT 200',ok:1,c:'c-req'}];
       }else if(a==='del'){
         if(gone){kmsg('Already deleted.');return}
         p.del=true;p.req=[{f:'app',t:'DELETE 204',ok:1,c:'c-req'}];
         kmsg(p.ver?'A delete marker was added. Older versions are still stored.':'Deleted permanently. No versions were kept.');
       }else if(a==='restore'){
         if(!p.del){kmsg('Nothing to restore: the object is not deleted.');return}
         if(!p.ver){kmsg('Versioning was off, so nothing can be restored.');return}
         p.del=false;p.req=[{f:'app',t:'DELETE 204',ok:1,c:'c-req'}];kmsg('Delete marker removed. report.pdf is back.');
       }
     }
    }
  });
})();

/* =========================================================
   INCIDENT ROOM: an on-call game
   ========================================================= */
var INC=[
 {tag:'CPU 98%',err:'timeout',icon:'server',alert:'CPU is at 98% on all 3 web servers and pages take 12 seconds to load.',clue:'A marketing email went out 10 minutes ago. Traffic is 5x normal.',opts:['Add more servers or let autoscaling add them','Restart every server at once','Delete old log files'],ok:0,why:'The servers are healthy but overloaded. Scaling out spreads the extra traffic. Restarting all servers at once would drop every user for a while and the load would return.'},
 {tag:'disk 100%',err:'disk full',icon:'disk',alert:'The app cannot save uploads. Error: "No space left on device".',clue:'The disk was at 60% last week. /var/log is 38 GB.',opts:['Reboot the server','Free the space: compress or delete old logs, then set up log rotation','Upgrade to a bigger CPU'],ok:1,why:'Logs filled the disk. Clear space now and add log rotation so it cannot happen again. A reboot does not delete files and CPU is not the problem.'},
 {tag:'errors 40%',err:'HTTP 500',icon:'rocket',alert:'Error rate jumped from 1% to 40% two minutes after version 2.3 was deployed.',clue:'Version 2.2 ran fine for weeks. Nothing else changed.',opts:['Add more servers','Wait and see if it settles','Roll back to version 2.2'],ok:2,why:'A fresh deploy plus a sudden error spike points at the new version. Roll back first to stop the damage, then debug 2.3 calmly.'},
 {tag:'CrashLoop',err:'crash loop',icon:'pod',alert:'A Kubernetes pod shows CrashLoopBackOff and has restarted 14 times.',clue:'The image was updated an hour ago.',opts:['Read the previous container logs and describe the pod','Delete the whole node','Ignore it, Kubernetes will fix itself'],ok:0,why:'kubectl logs --previous and kubectl describe pod show why it exits: bad config, missing secret, failing probe or out-of-memory. Restarting forever never fixes a bug.'},
 {tag:'cert expired',err:'TLS error',icon:'lock',alert:'Browsers show "Your connection is not private". The HTTPS certificate expired this morning.',clue:'Nobody renewed it by hand.',opts:['Turn HTTPS off so the warning goes away','Renew the certificate now, then automate renewal','Restart the database'],ok:1,why:'Renew now and automate it (for example with ACME). Turning HTTPS off exposes users and makes things worse.'},
 {tag:'key leaked',err:'exposed',icon:'key',alert:'Someone committed an AWS access key to a public GitHub repository.',clue:'The commit is 3 minutes old and the repo is small.',opts:['Revoke or rotate the key immediately, then check activity logs','Delete the commit and hope nobody saw it','Wait, the repo has few visitors'],ok:0,why:'Bots scan public repos within seconds. Deleting the commit does not remove copies. Revoke the key first, then review CloudTrail for misuse.'},
 {tag:'bucket public',err:'public read',icon:'bucket',alert:'A storage bucket holding customer invoices can be opened by anyone with the link.',clue:'Block Public Access is OFF for this bucket.',opts:['Rename the bucket','Turn on Block Public Access and review the bucket policy','Turn on versioning'],ok:1,why:'Block Public Access is the master switch. Then fix the policy and check access logs to see who read the files.'},
 {tag:'conn maxed',err:'too many conn',icon:'db',alert:'The database says "too many connections" and the app returns errors.',clue:'Each web request opens a new connection and never closes it.',opts:['Add more web servers','Use a connection pool and close connections properly','Turn the database off for a minute'],ok:1,why:'More web servers would open even more connections. A pool reuses a small set of connections and the leak must be fixed.'},
 {tag:'DDoS',err:'503 flood',icon:'firewall',alert:'2 million requests per minute are hitting the login page from thousands of different IPs.',clue:'Normal traffic is 2 000 requests per minute.',opts:['Block the first IP you see','Put a CDN or WAF in front and add rate limits','Shut the site down for a week'],ok:1,why:'The traffic comes from many addresses, so blocking one IP does nothing. A CDN or WAF absorbs and filters it, and rate limits protect the login.'},
 {tag:'memory leak',err:'OOM killed',icon:'server',alert:'The service is killed for running out of memory about every 6 hours.',clue:'Memory climbs in a straight line after each restart.',opts:['Profile for a memory leak and set a memory limit with alerts','Add a cron job to reboot it forever','Buy a faster CPU'],ok:0,why:'A steady climb means a leak. A reboot only hides it. Find the leak and add limits and alerts so you hear about it early.'},
 {tag:'DNS fail',err:'NXDOMAIN',icon:'globe',alert:'Users cannot open shop.example.com, but opening the server IP address directly works.',clue:'The DNS record was edited yesterday.',opts:['Reinstall the operating system','Check the DNS records (A or CNAME) and their TTL','Add more pods'],ok:1,why:'The server is fine because the IP works. The name is not pointing to it, so look at the DNS record and how long old answers are cached (TTL).'},
 {tag:'CI red',err:'build failed',icon:'flask',alert:'The pipeline is red on the main branch after a merge. Tests fail.',clue:'Three more merges are waiting and a release is due today.',opts:['Skip the tests just this once','Stop merging, then revert or fix the change','Delete the failing tests'],ok:1,why:'A red main branch blocks everyone. Revert or fix quickly. Skipping or deleting tests ships bugs and hides the problem.'},
 {tag:'SSH attack',err:'auth failed',icon:'key',alert:'Logs show 40 000 failed SSH logins a day from unknown IPs on port 22.',clue:'The security group allows SSH from 0.0.0.0/0 and passwords are enabled.',opts:['Allow even more ports','Limit SSH to your IP, use keys and turn off passwords','Share the password with the team'],ok:1,why:'Shrink who can reach port 22 and use key-based login. Fewer open doors means fewer attacks.'}
];
var GS=null,gtimer=null;
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function hearts(n){var s='';for(var i=0;i<3;i++)s+='<span class="hp'+(i<n?'':' off')+'">♥</span>';return s}
function rankOf(r){return r>=10?'Incident commander':(r>=8?'Senior SRE':(r>=5?'Junior SRE':'Intern on call'))}

function drawIncident(inc,st){
  var o='',i,bad=st!=='ok';
  still=reduce||st==='keep';_pd=0;
  o+=pop(box(16,92,120,112,'bx pad',12)+ic('user',26,104,40,{k:0})+ic('user',76,104,40,{k:1})+ic('user',51,146,40,{k:2})+T(76,222,'users','lbl sm','middle'));
  for(i=0;i<3;i++){
    var ys=80+i*58,yc=ys+23,d='M136,148 C300,148 330,'+yc+' 440,'+yc;
    o+='<path d="'+d+'" class="ln'+(bad?' dead':'')+'"/>';
    if(!bad)o+=packet(d,2,i*0.6,'c-res');
    else o+='<path d="M268,'+(148+(yc-148)*0.5-7)+' l12,14 m0,-14 l-12,14" class="cross"/>';
    var g=box(440,ys,170,46,'bx '+(bad?'st-fail':'st-pass'),9)+ic('server',448,ys+5,36,{led:bad?'f-red':'f-res',blink:true})+T(492,ys+20,'web-'+(i+1),'lbl xs')+T(492,ys+36,bad?inc.err:'200 OK','lbl sm');
    if(bad&&!reduce)g='<g><animateTransform attributeName="transform" type="translate" values="0 0;-2 0;2 0;0 0" dur=".5s" begin="-'+(i*0.17).toFixed(2)+'s" repeatCount="indefinite"/>'+g+'</g>';
    o+=pop(g);
  }
  var badge=box(190,10,260,54,'bx '+(bad?'st-fail':'st-pass'),12)+ic(bad?inc.icon:'shield',200,17,40,{run:bad})+T(250,32,bad?'INCIDENT':'RESOLVED','lbl xs')+T(250,52,bad?inc.tag:'all green','lbl');
  if(bad&&!reduce)badge+='<rect x="185" y="5" width="270" height="64" rx="16" fill="none" stroke="var(--bad)" stroke-width="2.5"><animate attributeName="opacity" values=".9;.1;.9" dur="1s" repeatCount="indefinite"/></rect>';
  o+=pop(badge);
  return o;
}
function gameHud(){
  return '<span class="gk">ALERT '+(Math.min(GS.i+1,GS.deck.length))+' / '+GS.deck.length+'</span><span class="hearts" aria-label="'+GS.lives+' lives left">'+hearts(GS.lives)+'</span><span class="gk">SCORE <b>'+GS.score+'</b></span><span class="gk">STREAK <b>'+GS.streak+'</b></span>';
}
function gameHome(){
  clearInterval(gtimer);GS=null;
  var best=lsGet('best',0);
  $('#game').innerHTML=
    '<div class="ghome"><div class="gbig"><svg class="i" viewBox="0 0 48 48" width="72" height="72" stroke-width="2.6" aria-hidden="true"><g>'+ICONS.firewall({})+'</g></svg></div>'+
    '<div><h2>Incident Room</h2><p>You are on call. The pager goes off and something is broken in production. Choose the right first move before the timer runs out. You get 10 alerts and 3 lives. Faster correct answers score more, and a streak adds a bonus.</p>'+
    '<p class="gk">BEST SCORE <b>'+best+'</b> &nbsp;·&nbsp; PRESS 1, 2 OR 3 TO ANSWER</p>'+
    '<div class="nav"><button class="btn run" type="button" id="gstart">Start my shift</button></div></div></div>';
}
function gameStart(){
  GS={deck:shuffle(INC).slice(0,10),i:0,lives:3,score:0,streak:0,right:0,missed:[],state:'q'};
  gameRound();
}
function gameRound(){
  var inc=GS.deck[GS.i];
  GS.order=shuffle([0,1,2]);GS.t0=Date.now();GS.state='q';GS.limit=20;
  $('#game').innerHTML=
    '<div class="gtop" id="ghud">'+gameHud()+'</div>'+
    '<div class="gbar" aria-hidden="true"><i id="gbar"></i></div>'+
    '<section class="stage" aria-label="Production status"><div class="svgwrap"><svg id="gsvg" viewBox="0 0 640 250" role="img" aria-label="Users, servers and the current incident"></svg></div></section>'+
    '<div class="gcard"><div class="pager"><span class="gk">PAGER · <b id="gsec">20</b>s</span><strong>'+esc(inc.alert)+'</strong><span>'+esc(inc.clue)+'</span></div>'+
    '<p class="gk">WHAT IS YOUR FIRST MOVE?</p><div class="gopts">'+GS.order.map(function(j,k){return '<button class="opt" type="button" data-gopt="'+j+'"><kbd>'+(k+1)+'</kbd><span>'+esc(inc.opts[j])+'</span></button>'}).join('')+'</div>'+
    '<div id="gfb" aria-live="polite"></div></div>';
  $('#gsvg').innerHTML=drawIncident(inc,'bad');
  clearInterval(gtimer);
  gtimer=setInterval(function(){
    var left=GS.limit-(Date.now()-GS.t0)/1000,b=$('#gbar'),s=$('#gsec');
    if(!b){clearInterval(gtimer);return}
    b.style.width=Math.max(0,left/GS.limit*100)+'%';b.className=left<6?'low':'';
    if(s)s.textContent=Math.max(0,Math.ceil(left));
    if(left<=0)gameAnswer(-1);
  },100);
}
function gameAnswer(j){
  if(!GS||GS.state!=='q')return;
  clearInterval(gtimer);GS.state='a';
  var inc=GS.deck[GS.i],left=Math.max(0,GS.limit-(Date.now()-GS.t0)/1000),good=j===inc.ok,pts=0,msg;
  if(good){GS.streak++;GS.right++;pts=100+Math.round(left)*5+(GS.streak>1?(GS.streak-1)*25:0);GS.score+=pts;msg='Correct. +'+pts+' points'+(GS.streak>1?' (streak bonus included)':'')+'.'}
  else{GS.lives--;GS.streak=0;GS.missed.push(inc);msg=j<0?'Time is up. The incident ran on.':'Not the best first move.'}
  Array.prototype.forEach.call(document.querySelectorAll('.opt'),function(b){
    var v=parseInt(b.dataset.gopt,10);b.disabled=true;
    if(v===inc.ok)b.classList.add('good');else if(v===j)b.classList.add('wrong');
  });
  var over=GS.lives<=0||GS.i>=GS.deck.length-1;
  $('#gfb').innerHTML='<div class="fb '+(good?'ok':'bad')+'"><b>'+esc(msg)+'</b><p>'+esc(inc.why)+'</p></div><div class="nav"><button class="btn go" type="button" id="gnext"><span>'+(over?'See results':'Next alert')+'</span><span aria-hidden="true">→</span></button></div>';
  $('#ghud').innerHTML=gameHud();
  if(good)$('#gsvg').innerHTML=drawIncident(inc,'ok');
  var nb=$('#gnext');if(nb)nb.focus({preventScroll:false});
}
function gameNext(){
  if(GS.lives<=0||GS.i>=GS.deck.length-1){gameEnd();return}
  GS.i++;gameRound();
}
function gameEnd(){
  clearInterval(gtimer);
  var best=lsGet('best',0),isBest=GS.score>best;if(isBest)lsSet('best',GS.score);
  lsSet('last',GS.score);lsSet('shifts',lsGet('shifts',0)+1);setTimeout(renderDash,0);
  var conf='';
  if(GS.right>=8&&!reduce)for(var c=0;c<28;c++)conf+='<i class="cf" style="left:'+Math.round(Math.random()*100)+'%;animation-delay:'+(Math.random()*1.2).toFixed(2)+'s;background:var(--'+['req','res','slow','queue','bad'][c%5]+')"></i>';
  $('#game').innerHTML=
    '<div class="gres">'+conf+'<p class="gk">'+(GS.lives<=0?'PAGER DOWN · OUT OF LIVES':'SHIFT COMPLETE')+'</p><h2>'+rankOf(GS.right)+'</h2>'+
    '<div class="metrics"><div class="tile ok"><div class="k">Score</div><div class="v">'+GS.score+'</div></div><div class="tile ok"><div class="k">Fixed</div><div class="v">'+GS.right+' / '+(GS.i+1)+'</div></div><div class="tile'+(isBest?' ok':'')+'"><div class="k">Best</div><div class="v">'+Math.max(best,GS.score)+'</div></div></div>'+
    (isBest?'<p class="gk">NEW PERSONAL BEST</p>':'')+
    (GS.missed.length?'<div class="miss"><h3>Study these</h3><ul>'+GS.missed.map(function(m){return '<li><b>'+esc(m.tag)+'</b><span>'+esc(m.opts[m.ok])+'</span></li>'}).join('')+'</ul></div>':'<p>No misses. Clean shift.</p>')+
    '<div class="nav"><button class="btn run" type="button" id="gstart">Play again</button><button class="btn" type="button" data-lesson="kubernetes">Study Kubernetes</button><button class="btn" type="button" data-lesson="git">Back to lessons</button></div></div>';
}
function showGame(fromHash){
  clearTimers();hideLab();gameOn=true;
  $('.app').classList.add('gm');
  renderStatic();
  if(!GS||GS.state==='done')gameHome();
  if(!fromHash){try{history.replaceState(null,'','#game')}catch(e){location.hash='game'}}
}
function hideGame(){hideHome();hideLab();if(!gameOn)return;gameOn=false;clearInterval(gtimer);GS=null;$('.app').classList.remove('gm')}


/* ---------- order and grouping ---------- */
(function(){
  var groups={scaling:'Cloud',pipeline:'Delivery',kubernetes:'Containers'};
  LESSONS.forEach(function(L){if(groups[L.id])L.group=groups[L.id]});
  var order=['git','docker','kubernetes','ec2','s3','scaling','pipeline'];
  LESSONS.sort(function(a,b){return order.indexOf(a.id)-order.indexOf(b.id)});
})();

var seen=lsGet('seen',{});
function sceneNow(){var st=cur.steps[idx];return st.pg?cur.pg.scene(getPG(cur)):st.scene}
var lastVals={};
function renderStage(anim){
  var sc=sceneNow();
  still=reduce||!anim;_pd=0;
  var _b=cur.draw(sc);$('#svg').innerHTML=isoDefs()+'<g id="flr">'+isoFloor()+'</g><g id="scn">'+_b+'</g>';fitStage();clearTimeout(window._fit);window._fit=setTimeout(fitStage,1400);
  var ms=cur.metrics(sc);
  $('#metrics').innerHTML=ms.map(function(m){var key=cur.id+m[0],chg=lastVals[key]!==undefined&&lastVals[key]!==m[1];lastVals[key]=m[1];return '<div class="tile '+(m[2]==='n'?'':m[2])+(chg&&!reduce?' chg':'')+'"><div class="k">'+esc(m[0])+'</div><div class="v">'+esc(m[1])+'</div></div>'}).join('');
}
/* ---------- command-center dashboard: KPIs, progress, activity ---------- */
var LCOL=['#ff8a1f','#3f8fd0','#f2c744','#ff8a5b','#7fe0b4','#c58cff','#ff6fa5'];
function dayKey(d){var m=d.getMonth()+1,dd=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd}
var act=lsGet('act',{});
function logAct(){var k=dayKey(new Date());act[k]=(act[k]||0)+1;lsSet('act',act)}
function streakDays(){var n=0,d=new Date();if(!act[dayKey(d)])d.setDate(d.getDate()-1);while(act[dayKey(d)]){n++;d.setDate(d.getDate()-1)}return n}
function donut(pct){
  var c=2*Math.PI*34;
  return '<svg class="donut" viewBox="0 0 92 92" width="92" height="92" role="img" aria-label="'+pct+' percent of steps visited"><circle cx="46" cy="46" r="34" fill="none" stroke="#16303a" stroke-width="9"/><circle cx="46" cy="46" r="34" fill="none" stroke="#ff8a1f" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+(c*pct/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 46 46)"/><text x="46" y="52" text-anchor="middle" class="dn">'+pct+'%</text></svg>';
}
function kpi(ic,label,val){return '<div class="kpi"><span class="ring">'+icSvg(ic,22)+'</span><div><small>'+label+'</small><b>'+val+'</b></div></div>'}
function renderDash(){
  var total=0,vis=0,done=0;
  LESSONS.forEach(function(L){var n=(seen[L.id]||[]).length;total+=L.steps.length;vis+=n;if(n>=L.steps.length)done++});
  var pct=total?Math.round(vis/total*100):0,best=lsGet('best',0),last=lsGet('last',0),shifts=lsGet('shifts',0);
  $('#kpis').innerHTML=kpi('layers','Lessons',LESSONS.length)+kpi('clipboard','Steps',total)+kpi('shield','Steps visited',vis+' <em>('+pct+'%)</em>')+kpi('cloud','AWS guides read',svcSeen.length+'/'+svcGuides().length)+kpi('clock','Day streak',streakDays());
  $('#progTop').innerHTML='<div class="ptop">'+donut(pct)+'<ul class="plg"><li><i style="background:#ff8a1f"></i>Visited <b>'+vis+'</b></li><li><i style="background:#16303a"></i>Remaining <b>'+(total-vis)+'</b></li><li><i style="background:#3f8fd0"></i>Lessons finished <b>'+done+'/'+LESSONS.length+'</b></li></ul></div>';
  $('#progList').innerHTML=LESSONS.map(function(L,k){
    var n=(seen[L.id]||[]).length,t=L.steps.length,pc=Math.round(n/t*100),col=LCOL[k%LCOL.length];
    return '<li><button class="prow'+(L===cur&&!gameOn?' on':'')+'" type="button" data-lesson="'+L.id+'"><span class="num" style="background:'+col+'">'+(k+1)+'</span><span class="nm">'+esc(L.name)+'</span><span class="val">'+n+'/'+t+'</span><span class="bar"><i style="width:'+pc+'%;background:'+col+'"></i></span></button></li>';
  }).join('');
  /* bottom panels */
  var days=[],i,d,mx=5,bars='';
  for(i=13;i>=0;i--){d=new Date();d.setDate(d.getDate()-i);var c=act[dayKey(d)]||0;days.push([d.getDate(),c]);if(c>mx)mx=c}
  days.forEach(function(x,k){
    var hh=Math.round(x[1]/mx*86),bx=14+k*22;
    bars+='<rect x="'+bx+'" y="'+(106-Math.max(hh,x[1]?3:0))+'" width="16" height="'+Math.max(hh,x[1]?3:0)+'" rx="3" fill="url(#ag)"><title>'+x[1]+' steps viewed</title></rect><text x="'+(bx+8)+'" y="122" text-anchor="middle" class="ax">'+x[0]+'</text>';
  });
  var act14=days.reduce(function(s,x){return s+x[1]},0);
  var gm={},go_=[];
  LESSONS.forEach(function(L){if(!gm[L.group]){gm[L.group]={n:0,t:0};go_.push(L.group)}gm[L.group].n+=(seen[L.id]||[]).length;gm[L.group].t+=L.steps.length});
  $('#bottom').innerHTML=
    '<section class="panel"><h3 class="ph">Study activity <small>(steps viewed per day, last 14 days)</small></h3><svg class="chart" viewBox="0 0 336 130" role="img" aria-label="Bar chart of steps viewed each day for the last 14 days. Total '+act14+'."><defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff8a1f"/><stop offset="1" stop-color="#0f6f66"/></linearGradient></defs><path d="M10 106h316" stroke="#1b3a42" stroke-width="1"/><path d="M10 62h316M10 20h316" stroke="#12303a" stroke-width="1" stroke-dasharray="3 5"/>'+bars+'</svg></section>'+
    '<section class="panel"><h3 class="ph">Skill areas <small>(steps visited)</small></h3><ul class="skills">'+go_.map(function(g,k){var o=gm[g],pc=Math.round(o.n/o.t*100);return '<li><span>'+esc(g)+'</span><b>'+o.n+'/'+o.t+'</b><span class="bar"><i style="width:'+pc+'%;background:'+LCOL[k%LCOL.length]+'"></i></span></li>'}).join('')+'</ul></section>'+
    '<section class="panel"><h3 class="ph">Incident Room <small>(on-call game)</small></h3><div class="grec"><div><small>Best</small><b>'+best+'</b></div><div><small>Last shift</small><b>'+last+'</b></div><div><small>Shifts played</small><b>'+shifts+'</b></div></div><div class="nav"><button class="btn run" type="button" data-game="1">'+(shifts?'Play again':'Start a shift')+'</button></div></section>';
}
function tick(){
  var d=new Date(),dn=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'],pad=function(n){return n<10?'0'+n:n};
  if(!$('#clock'))return;$('#clock').textContent=d.getFullYear()+'.'+pad(d.getMonth()+1)+'.'+pad(d.getDate())+' '+dn[d.getDay()]+' '+pad(d.getHours())+':'+pad(d.getMinutes());
}
if($('#who'))$('#who').innerHTML=icSvg('user',20,{k:1})+'<span>Learner</span>';
tick();setInterval(tick,30000);



var SHORT={kubernetes:'Kubernetes',ec2:'EC2',s3:'S3',scaling:'Scaling',pipeline:'CI/CD'};
function renderNav2(){
  var mode=gameOn?'game':(labOn?'lab':(gpOn?'gp':''));
  $('#lessons').innerHTML=LESSONS.map(function(L){return '<button class="tab" type="button" data-lesson="'+L.id+'"'+(L===cur&&!mode?' aria-current="true"':'')+' title="'+esc(L.name)+'">'+icSvg(L.icon||'server',18)+'<span class="tl">'+esc(SHORT[L.id]||L.name)+'</span></button>'}).join('');
  var items=[['game','firewall','Incident Room'],['lab','gear','Build Lab'],['gp','commit','Git Practice']];
  $('#pMenu').innerHTML=items.map(function(i){return '<button type="button" data-'+i[0]+'="1"'+(mode===i[0]?' aria-current="true"':'')+'>'+icSvg(i[1],18)+i[2]+'</button>'}).join('');
  var pb=$('#pBtn');pb.setAttribute('aria-current',mode?'true':'false');
  var cn=items.filter(function(i){return i[0]===mode})[0];$('#pLab').textContent=cn?cn[2]:'Practice';
}
function renderTitle(){
  var sv=(seen[cur.id]||[]).length,n=cur.steps.length;
  $('#ltitle').innerHTML='<div class="lt-l"><span class="lt-ico">'+icSvg(cur.icon||'server',34)+'</span><div><h1>'+esc(cur.name)+'</h1><p>'+esc(cur.blurb)+'</p></div></div><div class="lt-r"><div class="row"><span>Step <b>'+(idx+1)+'</b> of '+n+'</span><span>'+sv+'/'+n+' visited</span></div><span class="pb"><i style="width:'+Math.round(sv/n*100)+'%"></i></span></div>';
}
document.addEventListener('click',function(e){
  var pb=$('#pBtn'),pm=$('#pMenu');if(!pb)return;
  var t=e.target.closest?e.target.closest('#pBtn'):null;
  if(t){var o=pm.hidden;pm.hidden=!o;pb.setAttribute('aria-expanded',o?'true':'false');return}
  if(!pm.hidden){pm.hidden=true;pb.setAttribute('aria-expanded','false')}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var pm=$('#pMenu');if(pm&&!pm.hidden){pm.hidden=true;$('#pBtn').setAttribute('aria-expanded','false');$('#pBtn').focus()}}});
var FIT={};
function fitStage(){
  var g=$('#scn'),sv=$('#svg');if(!g||!sv)return;var b;try{b=g.getBBox()}catch(e){return}
  if(!b||!b.width)return;
  var u=FIT[cur.id],x1=b.x,y1=b.y,x2=b.x+b.width,y2=b.y+b.height;
  if(u){x1=Math.min(x1,u[0]);y1=Math.min(y1,u[1]);x2=Math.max(x2,u[2]);y2=Math.max(y2,u[3])}
  FIT[cur.id]=[x1,y1,x2,y2];
  var w=x2-x1+34,h=y2-y1+26,cx=(x1+x2)/2,cy=(y1+y2)/2;
  if(w/h<1.5)w=h*1.5;if(w/h>2.2)h=w/2.2;
  sv.setAttribute('viewBox',(cx-w/2).toFixed(0)+' '+(cy-h/2).toFixed(0)+' '+w.toFixed(0)+' '+h.toFixed(0));
  var wr=sv.parentNode;if(wr&&wr.scrollWidth>wr.clientWidth)wr.scrollLeft=(wr.scrollWidth-wr.clientWidth)/2;
}
function renderStatic(){
  var _r=lsGet('resume',null),_cb=$('#contBtn');if(_cb){if(_r&&lessonById(_r.id)&&!hmOn){_cb.hidden=false;_cb.textContent='Continue';_cb.title='Continue: '+lessonById(_r.id).name}else _cb.hidden=true}
  renderNav2();
  renderTitle();
  $('#partsList').innerHTML=(cur.parts||[]).map(function(p,k){return '<li style="animation-delay:'+(k*50)+'ms">'+icSvg(p[0],42,p[1])+'<div><b>'+esc(p[2])+'</b><span>'+esc(p[3])+'</span></div></li>'}).join('');
  $('#legend').innerHTML=cur.legend.map(function(l){return '<li><i class="'+l[0]+'"></i>'+esc(l[1])+'</li>'}).join('');
  var sv=seen[cur.id]||[];
  renderDash();
  $('#stepper').innerHTML=cur.steps.map(function(s,i){
    return '<li class="'+(i===idx?'cur':(sv.indexOf(i)>-1?'seen':''))+'"><button type="button" data-step="'+i+'"'+(i===idx?' aria-current="step"':'')+'><span class="dot">'+(i+1)+'</span><span class="lab">'+esc(s.label)+'</span></button></li>';
  }).join('');
}

/* ---------- in-lesson practice terminals ---------- */
var TERMS={
 docker:{title:'Practice: Docker commands',tasks:[
  {q:'Build an image called app:1.0 from the current folder.',re:/^docker build\s+(-t\s+app:1\.0|--tag\s+app:1\.0)\s+\.$/,out:'[+] Building 12.4s (8/8) FINISHED\n => naming to docker.io/library/app:1.0',hint:'docker build -t app:1.0 .'},
  {q:'Run it in the background, publishing host port 8080 to container port 3000.',re:/^docker run\s+(-d\s+-p\s+8080:3000|-p\s+8080:3000\s+-d)\s+app:1\.0$/,out:'9f2c1b7a4e5d6c0b8a1f',hint:'docker run -d -p 8080:3000 app:1.0'},
  {q:'List the running containers.',re:/^docker ps$/,out:'CONTAINER ID   IMAGE     PORTS                    STATUS\n9f2c1b7a4e5d   app:1.0   0.0.0.0:8080->3000/tcp   Up 5 seconds',hint:'docker ps'},
  {q:'Show the logs of container 9f2c1b7a4e5d.',re:/^docker logs\s+9f2c1b7a4e5d?$/,out:'Server listening on port 3000',hint:'docker logs 9f2c1b7a4e5d'},
  {q:'Stop that container.',re:/^docker stop\s+9f2c1b7a4e5d?$/,out:'9f2c1b7a4e5d',hint:'docker stop 9f2c1b7a4e5d'}]},
 kubernetes:{title:'Practice: kubectl commands',tasks:[
  {q:'Create a Deployment named web from the nginx image.',re:/^kubectl create deployment web --image(=|\s)nginx$/,out:'deployment.apps/web created',hint:'kubectl create deployment web --image=nginx'},
  {q:'Scale it to 3 replicas.',re:/^kubectl scale deployment(\/|\s+)web\s+--replicas(=|\s)3$/,out:'deployment.apps/web scaled',hint:'kubectl scale deployment web --replicas=3'},
  {q:'List the pods.',re:/^kubectl get pods?$/,out:'NAME            READY   STATUS    RESTARTS\nweb-6d4c-abc12  1/1     Running   0\nweb-6d4c-def34  1/1     Running   0\nweb-6d4c-ghi56  1/1     Running   0',hint:'kubectl get pods'},
  {q:'Expose the deployment as a Service on port 80.',re:/^kubectl expose deployment web\s+--port(=|\s)80$/,out:'service/web exposed',hint:'kubectl expose deployment web --port=80'},
  {q:'Show details of pod web-6d4c-abc12.',re:/^kubectl describe pod web-6d4c-abc12$/,out:'Name: web-6d4c-abc12\nStatus: Running\nNode: node-1\nEvents: Pulled, Created, Started',hint:'kubectl describe pod web-6d4c-abc12'}]},
 linux:{title:'Practice: Linux commands',tasks:[
  {q:'Show the permissions and owner of report.txt in long format.',re:/^ls -l(a|h|ah|ha)? report\.txt$/,out:'-rw-r----- 1 alice devs 2048 Nov 26 10:12 report.txt',hint:'ls -l report.txt'},
  {q:'Make report.txt readable and writable by the owner only (mode 600).',re:/^chmod 600 report\.txt$/,out:'(no output means it worked)',hint:'chmod 600 report.txt'},
  {q:'Show which process is listening on port 8080.',re:/^(sudo )?(lsof -i :8080|ss -tulpn \| grep :8080)$/,out:'node  4121 www  TCP *:8080 (LISTEN)',hint:'lsof -i :8080'},
  {q:'Check the status of the nginx service.',re:/^systemctl status nginx$/,out:'nginx.service - A high performance web server\n   Active: active (running) since Thu 2026-11-26 09:00:12 UTC',hint:'systemctl status nginx'},
  {q:'Show the last 50 log lines for nginx.',re:/^(sudo )?journalctl -u nginx -n 50( --no-pager)?$/,out:'Nov 26 09:00:12 web1 systemd[1]: Started nginx.\nNov 26 09:14:03 web1 nginx[812]: GET /health 200',hint:'journalctl -u nginx -n 50'},
  {q:'Show free and used disk space in human-readable form.',re:/^df -h$/,out:'Filesystem  Size  Used Avail Use% Mounted on\n/dev/sda1    40G   31G  7.2G  82% /',hint:'df -h'}]},
 ec2:{title:'Practice: AWS CLI and IAM',tasks:[
  {q:'List your EC2 instances.',re:/^aws ec2 describe-instances$/,out:'{ "Reservations": [ { "Instances": [ { "InstanceId": "i-0abc123", "State": { "Name": "running" } } ] } ] }',hint:'aws ec2 describe-instances'},
  {q:'Stop instance i-0abc123.',re:/^aws ec2 stop-instances\s+--instance-ids\s+i-0abc123$/,out:'{ "StoppingInstances": [ { "InstanceId": "i-0abc123", "CurrentState": { "Name": "stopping" } } ] }',hint:'aws ec2 stop-instances --instance-ids i-0abc123'},
  {q:'List your IAM users.',re:/^aws iam list-users$/,out:'{ "Users": [ { "UserName": "athul" }, { "UserName": "ci-deploy" } ] }',hint:'aws iam list-users'},
  {q:'Check who you are right now.',re:/^aws sts get-caller-identity$/,out:'{ "UserId": "AIDAEXAMPLE", "Account": "123456789012", "Arn": "arn:aws:iam::123456789012:user/athul" }',hint:'aws sts get-caller-identity'}]}
};
var TS={};
function termHTML(id){
  var T=TERMS[id];if(!T)return '';var st=TS[id]||(TS[id]={i:0,log:[]}),done=st.i>=T.tasks.length;
  return '<div class="term" id="term" data-t="'+id+'"><div class="term-h">'+esc(T.title)+' <span>'+Math.min(st.i,T.tasks.length)+' / '+T.tasks.length+'</span></div>'+
   '<div class="term-q">'+(done?'All done. You ran every command.':'Task '+(st.i+1)+': '+esc(T.tasks[st.i].q))+'</div>'+
   '<pre class="term-log" id="termLog">'+st.log.map(esc).join('\n')+'</pre>'+
   (done?'<button class="btn" type="button" id="termReset">Start again</button>':'<div class="term-r"><span aria-hidden="true">$</span><input id="termIn" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type a command and press Enter" placeholder="type the command, then Enter"><button class="btn" type="button" id="termHint">Hint</button></div>')+'</div>';
}
function termRun(v){
  var id=$('#term').dataset.t,T=TERMS[id],st=TS[id],t=T.tasks[st.i];v=v.replace(/\s+/g,' ').trim();if(!v)return;
  st.log.push('$ '+v);
  if(t.re.test(v)){st.log.push(t.out,'');st.i++}else st.log.push('Not quite. That is not the command for this task. Press Hint if you are stuck.','');
  $('#term').outerHTML=termHTML(id);var l=$('#termLog');if(l)l.scrollTop=l.scrollHeight;var i=$('#termIn');if(i)i.focus();
}
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='termIn'){e.preventDefault();termRun(e.target.value)}});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('button');if(!t)return;
  if(t.id==='termHint'){var id=$('#term').dataset.t,st=TS[id];st.log.push('Hint: '+TERMS[id].tasks[st.i].hint,'');$('#term').outerHTML=termHTML(id);var i=$('#termIn');if(i)i.focus()}
  if(t.id==='termReset'){var id2=$('#term').dataset.t;TS[id2]={i:0,log:[]};$('#term').outerHTML=termHTML(id2)}});
function renderCard(){
  if(qzOn&&QZ){renderQuizCard();return}
  var st=cur.steps[idx],last=idx===cur.steps.length-1;
  var li=LESSONS.indexOf(cur),nextL=LESSONS[li+1];
  var nextLabel=last?'Take the quick check':'Next: '+cur.steps[idx+1].label;
  $('#card').innerHTML=
    '<div class="top"><span>STEP '+(idx+1)+' / '+cur.steps.length+'</span><span class="chipTag">'+esc(st.tag)+'</span></div>'+
    '<h2>'+esc(st.title)+'</h2><p>'+esc(st.text)+'</p>'+
    '<div class="idea"><b>Key idea</b>'+esc(st.idea)+'</div>'+
    '<div class="ctl-box" id="ctl">'+(st.pg?cur.pg.controls(getPG(cur)):'')+'</div>'+(last&&TERMS[cur.id]?termHTML(cur.id):'')+
    '<div class="nav"><button class="btn" type="button" id="back"'+(idx===0?' disabled':'')+'>← Back</button><button class="btn go" type="button" id="next"><span>'+esc(nextLabel)+'</span><span aria-hidden="true">→</span></button></div>';
  var _c=$('#card');if(_c&&!reduce){_c.classList.remove('cin');void _c.offsetWidth;_c.classList.add('cin')}
}
function go(i,fromHash){
  clearTimers();hideHome();qzOn=false;
  idx=clamp(i,0,cur.steps.length-1);
  var sv=seen[cur.id]||(seen[cur.id]=[]);if(sv.indexOf(idx)<0){sv.push(idx);lsSet('seen',seen)}
  logAct();lsSet('resume',{id:cur.id,idx:idx});
  if(cur.steps[idx].pg){var p=getPG(cur);if(cur.id==='pipeline'){p.running=false}}
  renderStatic();renderStage(true);renderCard();
  if(!fromHash){try{history.replaceState(null,'','#'+cur.id+'-'+(idx+1))}catch(e){location.hash=cur.id+'-'+(idx+1)}}
}
function pick(id,i,fromHash){
  hideGame();
  for(var k=0;k<LESSONS.length;k++)if(LESSONS[k].id===id){cur=LESSONS[k];go(i,fromHash);return true}
  return false;
}
function fromHash(){
  if(location.hash==='#gitlab'){if(!cur)cur=LESSONS[0];showGP(true);return}
  if(location.hash==='#lab'){if(!cur)cur=LESSONS[0];showLab(true);return}
  if(location.hash==='#game'){if(!cur)cur=LESSONS[0];showGame(true);return}
  if(location.hash==='#home'||!location.hash||location.hash==='#'){showHome(true);return}
  hideGame();
  var m=/^#([a-z0-9]+)-(\d+)$/.exec(location.hash||'');
  if(m&&pick(m[1],parseInt(m[2],10)-1,true))return;
  showHome(true);
}

document.addEventListener('click',function(e){
  var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
  if(t.dataset.gp){showGP();return}
  if(t.dataset.lab){showLab();return}
  if(t.dataset.game){showGame();return}
  if(t.dataset.gopt!=null){gameAnswer(parseInt(t.dataset.gopt,10));return}
  if(t.id==='gstart'){gameStart();return}
  if(t.id==='gnext'){gameNext();return}
  if(t.dataset.lesson){pick(t.dataset.lesson,0);return}
  if(t.dataset.step!=null){go(parseInt(t.dataset.step,10));return}
  if(t.id==='back'){go(idx-1);return}
  if(t.id==='next'){
    if(idx<cur.steps.length-1)go(idx+1);
    else startQuiz();
    return;
  }
  if(t.id==='replay'){renderStage(true);return}
  if(t.dataset.act){cur.pg.act(getPG(cur),t.dataset.act);if(t.dataset.act!=='run')renderStage();return}
});
document.addEventListener('input',function(e){
  var t=e.target;if(!t||!t.dataset||!t.dataset.k)return;
  var k=t.dataset.k,v=t.type==='checkbox'?t.checked:Number(t.value),p=getPG(cur);
  if(cur.id==='scaling'&&k==='failed'&&v&&p.servers<2){t.checked=false;kmsg('Add a second server first.');return}
  cur.pg.set(p,k,v);
  var sp=$('#v-'+k);if(sp)sp.textContent=(cur.pg.fmt&&cur.pg.fmt[k])?cur.pg.fmt[k](v):v;
  if(cur.id==='scaling'&&k==='servers'&&v<2&&p.failed){p.failed=false;var c=$('#c-failed');if(c)c.checked=false}
  renderStage();
});
document.addEventListener('keydown',function(e){
  if(!$('#mdl').hidden)return;
  if(gameOn){if(GS&&GS.state==='q'&&/^[123]$/.test(e.key)){var ob=document.querySelectorAll('.opt')[+e.key-1];if(ob)ob.click()}return}
  if(!$('#mdl').hidden)return;if(labOn||gpOn)return;var tg=e.target&&e.target.tagName;if(tg==='INPUT'&&e.target.type==='range')return;
  if(e.key==='ArrowRight')go(idx+1);else if(e.key==='ArrowLeft')go(idx-1);
});
/* ---------- AWS service guides ---------- */
var AWSCATS=['Compute','Containers','Storage','Database','Networking','Security','CI/CD','Infrastructure and operations','Monitoring','Messaging'];
/* id, name, category, icon, one line, how DevOps uses it, concepts, commands, related lesson */
var SVC=[
["ec2","EC2","Compute","server","Virtual servers you rent by the second.","",[],[],"ec2"],
["lambda","Lambda","Compute","gear","Run a function on an event. No server to manage, billed per run.","Glue code for automation: react to S3 uploads, CloudWatch alarms or schedules, run clean-up jobs, build small APIs behind API Gateway.",[["Function","Your code plus its settings (memory, timeout, role)."],["Trigger","The event that starts it: S3, SQS, a schedule, an HTTP call."],["Execution role","The IAM role the function runs as. Give it the least access it needs."],["Cold start","The extra delay when AWS starts a fresh copy of your function."]],[["aws lambda list-functions","List the functions in this region."],["aws lambda invoke --function-name my-fn out.json","Run a function once and save the reply to out.json."],["aws lambda update-function-code --function-name my-fn --zip-file fileb://app.zip","Upload new code from a zip file."]],"pipeline"],
["autoscaling","Auto Scaling","Compute","layers","Adds or removes EC2 instances for you as load changes.","Keeps a web tier at the right size, replaces unhealthy servers, and rolls out new AMIs with instance refresh.",[["Auto Scaling group","A set of identical instances with a min, desired and max size."],["Launch template","The recipe for each new instance: AMI, type, security group."],["Scaling policy","The rule: add a server when CPU is above a target."],["Health check","If an instance fails it, the group replaces it."]],[["aws autoscaling describe-auto-scaling-groups","Show your groups and their current size."],["aws autoscaling set-desired-capacity --auto-scaling-group-name web-asg --desired-capacity 4","Scale to 4 instances now."],["aws autoscaling start-instance-refresh --auto-scaling-group-name web-asg","Replace instances gradually with the latest launch template."]],"scaling"],
["ecs","ECS","Containers","container","AWS's own container service. Runs Docker containers without you managing Kubernetes.","Runs containerized apps on Fargate (no servers) or on EC2, with rolling deployments behind a load balancer.",[["Cluster","A logical group where tasks run."],["Task definition","The recipe: image, CPU, memory, ports, environment."],["Service","Keeps N copies of a task running and replaces failures."],["Fargate","Run tasks without managing the underlying servers."]],[["aws ecs list-clusters","List clusters."],["aws ecs describe-services --cluster my-cluster --services web","Check desired versus running tasks."],["aws ecs update-service --cluster my-cluster --service web --force-new-deployment","Restart tasks with a fresh deployment."]],"docker"],
["eks","EKS","Containers","pod","Managed Kubernetes. AWS runs the control plane, you run the workloads.","The standard way to run Kubernetes on AWS: deploy with kubectl or Helm, scale nodes, and connect pods to IAM.",[["Control plane","The Kubernetes brain, run and patched by AWS."],["Node group","The EC2 instances that run your pods."],["kubeconfig","The file kubectl uses to find and log in to the cluster."],["IRSA","Give a pod an IAM role instead of storing keys."]],[["aws eks list-clusters","List your clusters."],["aws eks update-kubeconfig --name my-cluster --region ap-south-1","Point kubectl at this cluster."],["kubectl get nodes","Check the worker nodes are Ready (run after update-kubeconfig)."]],"kubernetes"],
["ecr","ECR","Containers","pkg","A private registry for your Docker images.","The place your CI pipeline pushes images, and ECS or EKS pulls them from. Supports vulnerability scanning.",[["Repository","One image name with all its tags."],["Image tag","A label such as 1.0 or a git commit id."],["Lifecycle policy","Auto-delete old images to save cost."],["Scan on push","Check each image for known vulnerabilities."]],[["aws ecr create-repository --repository-name app","Create a repository."],["aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com","Log Docker in. The password is piped, never typed."],["docker push ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com/app:1.0","Upload the image."]],"docker"],
["s3","S3","Storage","bucket","Object storage for files, backups, logs and static sites.","",[],[],"s3"],
["ebs","EBS","Storage","disk","Network disks for EC2 instances.","The boot and data disk of an instance. Snapshots give you backups and a way to copy a server's disk.",[["Volume","One disk, tied to one Availability Zone."],["gp3","The usual general purpose SSD type."],["Snapshot","A point-in-time backup stored in S3."],["Attach","Connect a volume to an instance as a device."]],[["aws ec2 create-volume --size 20 --volume-type gp3 --availability-zone ap-south-1a","Create a 20 GiB disk."],["aws ec2 attach-volume --volume-id vol-0abc --instance-id i-0abc --device /dev/sdf","Attach it to an instance."],["aws ec2 create-snapshot --volume-id vol-0abc","Back it up."]],"ec2"],
["efs","EFS","Storage","folder","A shared network file system many servers can mount at once.","Shared storage for a fleet of servers or containers, for example uploads or build caches.",[["File system","The shared storage, grows and shrinks on its own."],["Mount target","The network door in each subnet."],["NFS","The protocol servers use to mount it."],["Throughput mode","How performance is provisioned."]],[["aws efs create-file-system","Create a file system."],["aws efs describe-file-systems","List file systems and their state."],["sudo mount -t efs fs-0abc:/ /mnt/efs","Mount it on a server (needs amazon-efs-utils)."]],"ec2"],
["rds","RDS","Database","db","Managed relational databases: MySQL, PostgreSQL, MariaDB, SQL Server and more.","AWS handles backups, patching and failover so the team runs the app, not the database server.",[["DB instance","One managed database server."],["Multi-AZ","A standby copy in another zone for failover."],["Read replica","An extra copy for read traffic."],["Snapshot","A backup you can restore into a new instance."]],[["aws rds describe-db-instances","List databases and their status."],["aws rds create-db-snapshot --db-instance-identifier db1 --db-snapshot-identifier db1-snap","Take a manual backup."],["aws rds reboot-db-instance --db-instance-identifier db1","Restart the database."]],"ec2"],
["dynamodb","DynamoDB","Database","db","A serverless key-value and document database with very low latency.","Backs high-traffic apps and serverless stacks. Also the standard lock table for Terraform remote state.",[["Table","A collection of items. No fixed columns."],["Partition key","Decides where an item is stored. Needed for every lookup."],["Capacity mode","On-demand (pay per request) or provisioned."],["TTL","Automatically expire old items."]],[["aws dynamodb list-tables","List tables."],["aws dynamodb put-item --table-name Orders --item file://item.json","Write one item from a JSON file."],["aws dynamodb get-item --table-name Orders --key file://key.json","Read one item by key."]],""],
["vpc","VPC","Networking","cloud","Your private network inside AWS.","Every real deployment starts here: subnets, route tables, gateways and security groups decide who can talk to whom.",[["Subnet","A slice of the VPC in one Availability Zone."],["Route table","Rules that send traffic to a gateway."],["Internet gateway","The door to the internet."],["NAT gateway","Lets private servers reach out without being reachable."]],[["aws ec2 describe-vpcs","List VPCs."],["aws ec2 create-vpc --cidr-block 10.0.0.0/16","Create a VPC with a 10.0.0.0/16 range."],["aws ec2 describe-security-groups","List firewall rules."]],"ec2"],
["elb","Load Balancer","Networking","lb","Spreads traffic across healthy servers or containers.","Fronts every web tier. Checks health, terminates HTTPS and enables zero-downtime deployments.",[["ALB","Application Load Balancer. Understands HTTP paths and hosts."],["NLB","Network Load Balancer. Very fast TCP and UDP."],["Target group","The servers or containers behind it."],["Health check","How it decides a target is alive."]],[["aws elbv2 describe-load-balancers","List load balancers."],["aws elbv2 describe-target-groups","List target groups."],["aws elbv2 describe-target-health --target-group-arn ARN","See which targets are healthy."]],"scaling"],
["route53","Route 53","Networking","globe","DNS: turns names into addresses, with health-based routing.","Points your domain at load balancers and CloudFront, and shifts traffic during failover or blue/green releases.",[["Hosted zone","All DNS records for one domain."],["Record","One rule, such as A, CNAME or alias."],["Routing policy","Simple, weighted, latency or failover."],["Health check","Stops sending users to a broken endpoint."]],[["aws route53 list-hosted-zones","List your domains."],["aws route53 list-resource-record-sets --hosted-zone-id Z123","Show records in a zone."],["aws route53 change-resource-record-sets --hosted-zone-id Z123 --change-batch file://change.json","Create or change records."]],""],
["cloudfront","CloudFront","Networking","globe","A CDN that caches your content close to users.","Serves static sites from S3 and speeds up APIs, with HTTPS and DDoS protection built in.",[["Distribution","One CDN setup with a domain name."],["Origin","Where content really lives: S3 or a load balancer."],["Edge location","A cache site near the user."],["Invalidation","Remove cached files before they expire."]],[["aws cloudfront list-distributions","List distributions."],["aws cloudfront create-invalidation --distribution-id E123 --paths '/*'","Clear the cache after a deploy."],["aws cloudfront get-distribution --id E123","Show one distribution's settings."]],"s3"],
["iam","IAM","Security","key","Who can do what in your AWS account.","Everything depends on it: users, roles for servers and pipelines, and least-privilege policies.",[["User","A person or tool with long-term credentials."],["Role","Temporary permissions that a service or person assumes."],["Policy","A JSON document of allowed and denied actions."],["MFA","A second proof of identity. Turn it on for the root user."]],[["aws sts get-caller-identity","Show who you are logged in as."],["aws iam list-users","List users."],["aws iam attach-role-policy --role-name my-role --policy-arn ARN","Give a role a policy."]],"s3"],
["secrets","Secrets Manager","Security","lock","Stores passwords and API keys, with automatic rotation.","Apps and pipelines fetch secrets at run time, so nothing sensitive lives in code or environment files.",[["Secret","An encrypted value, often JSON."],["Rotation","Change the secret on a schedule."],["Version stage","AWSCURRENT is the live version."],["Resource policy","Who may read this secret."]],[["aws secretsmanager create-secret --name prod/db --secret-string file://secret.json","Store a secret from a file, not the command line."],["aws secretsmanager get-secret-value --secret-id prod/db","Read it (needs permission)."],["aws secretsmanager rotate-secret --secret-id prod/db","Start a rotation."]],""],
["codebuild","CodeBuild","CI/CD","gear","Builds and tests your code on a throwaway machine.","The build and test stage of a pipeline: compile, run tests, build Docker images, push to ECR.",[["Project","The build settings: image, compute, source."],["buildspec.yml","The file that lists the build commands."],["Artifact","Build output saved to S3."],["Build image","The container the build runs in."]],[["aws codebuild list-projects","List build projects."],["aws codebuild start-build --project-name app-build","Run a build."],["aws codebuild batch-get-builds --ids BUILD_ID","Check a build's status."]],"pipeline"],
["codepipeline","CodePipeline","CI/CD","rocket","Connects source, build, test and deploy into one automated flow.","The conveyor belt of AWS-native delivery. Each stage runs on a code change, with optional manual approval.",[["Pipeline","The whole flow from commit to release."],["Stage","A group of actions, such as Build or Deploy."],["Action","One job in a stage."],["Approval","A pause for a human to say go."]],[["aws codepipeline list-pipelines","List pipelines."],["aws codepipeline get-pipeline-state --name my-pipeline","See each stage's status."],["aws codepipeline start-pipeline-execution --name my-pipeline","Run it now."]],"pipeline"],
["codedeploy","CodeDeploy","CI/CD","window","Pushes new versions to EC2, Lambda or ECS with safe rollout rules.","Rolling, blue/green and canary releases, with automatic rollback on failed health checks.",[["Application","The thing you deploy."],["Deployment group","The target servers or service."],["AppSpec file","Says what to copy and which scripts to run."],["Rollback","Return to the last good version."]],[["aws deploy list-applications","List applications."],["aws deploy create-deployment --application-name app --deployment-group-name prod --s3-location bucket=my-bucket,key=app.zip,bundleType=zip","Deploy a build from S3."],["aws deploy get-deployment --deployment-id d-XXXXXXXXX","Check progress."]],"pipeline"],
["cloudformation","CloudFormation","Infrastructure and operations","clipboard","Infrastructure as code: describe AWS resources in a template and AWS builds them.","Repeatable environments. Review changes in Git, deploy the same stack to dev, test and prod.",[["Template","A YAML or JSON file describing resources."],["Stack","The set of resources created from one template."],["Change set","A preview of what an update will change."],["Drift","When someone changed a resource by hand."]],[["aws cloudformation deploy --template-file t.yaml --stack-name my-stack","Create or update a stack."],["aws cloudformation describe-stack-events --stack-name my-stack","See what happened, event by event."],["aws cloudformation delete-stack --stack-name my-stack","Remove the stack and its resources."]],""],
["ssm","Systems Manager","Infrastructure and operations","laptop","Manage servers without SSH keys: shell access, commands, patching and config.","Session Manager gives a shell with no open port 22. Parameter Store holds settings, Run Command acts on many servers.",[["Session Manager","A browser or CLI shell with no SSH."],["Parameter Store","Config values and secrets by path."],["Run Command","Run a script on many instances."],["SSM Agent","The helper running on each server."]],[["aws ssm start-session --target i-0abc","Open a shell (needs the Session Manager plugin)."],["aws ssm get-parameter --name /app/db_host","Read a setting."],["aws ssm send-command --document-name AWS-RunShellScript --targets Key=instanceids,Values=i-0abc --parameters commands=uptime","Run uptime on an instance."]],"ec2"],
["cloudwatch","CloudWatch","Monitoring","clock","Metrics, logs and alarms for everything running in AWS.","The on-call view: dashboards, alarms that page you, and log search.",[["Metric","A number over time, like CPU."],["Alarm","Fires when a metric crosses a limit."],["Log group","A bucket of logs from one app."],["Dashboard","A page of graphs."]],[["aws cloudwatch describe-alarms","List alarms and their state."],["aws cloudwatch list-metrics --namespace AWS/EC2","See available EC2 metrics."],["aws logs tail /aws/lambda/my-fn --follow","Stream a log group live."]],"scaling"],
["cloudtrail","CloudTrail","Monitoring","shield","A record of every API call made in your account.","The audit trail for security and incident work: who changed that security group, and when.",[["Event","One recorded API call."],["Trail","Delivers events to S3 for long storage."],["Management events","Changes to resources, such as create or delete."],["Insights","Flags unusual API activity."]],[["aws cloudtrail lookup-events --max-results 5","See the latest events."],["aws cloudtrail describe-trails","List trails."],["aws cloudtrail get-trail-status --name my-trail","Check that logging is on."]],""],
["sqs","SQS","Messaging","pkg","A message queue that lets one part of a system hand work to another.","Decouples services and absorbs traffic spikes. Workers pull jobs at their own speed.",[["Queue","Holds messages until a consumer takes them."],["Visibility timeout","Hides a message while it is being processed."],["Dead-letter queue","Where messages go after repeated failures."],["Standard vs FIFO","Fast and at-least-once, or strictly ordered."]],[["aws sqs create-queue --queue-name jobs","Create a queue."],["aws sqs send-message --queue-url URL --message-body 'build 42'","Put a message on it."],["aws sqs receive-message --queue-url URL","Take a message off."]],""],
["sns","SNS","Messaging","lb","Sends one message to many subscribers: email, SMS, Lambda, queues.","Alert fan-out: a CloudWatch alarm publishes to a topic and the team gets email, chat and a pager call.",[["Topic","A channel you publish to."],["Subscription","Someone or something listening: email, SQS, Lambda."],["Publish","Send a message to a topic."],["Fan-out","One event reaching many consumers."]],[["aws sns create-topic --name alerts","Create a topic."],["aws sns subscribe --topic-arn ARN --protocol email --notification-endpoint you@example.com","Subscribe an address."],["aws sns publish --topic-arn ARN --message 'disk almost full'","Send a message."]],""]
];
function svcById(id){for(var i=0;i<SVC.length;i++)if(SVC[i][0]===id)return SVC[i];return null}
function svcGuides(){return SVC.filter(function(s){return s[7].length})}
var svcSeen=lsGet('svcseen',[]);
/* ---------- Linux guides ---------- */
var LNX=[["fs", "Filesystem layout", "Basics", "folder", "Linux has one tree starting at /. Knowing where things live is half of every fix.", "Finding configs in /etc, logs in /var/log, app data in /var/lib, and knowing what is safe to clean in /tmp.", [["/etc", "System and service configuration files."], ["/var/log", "Logs for the system and most services."], ["/home", "One folder per normal user."], ["/tmp", "Temporary files, cleared on reboot."]], [["pwd", "Show the folder you are in."], ["ls -lah", "List files with sizes, owners, permissions and hidden files."], ["cd /var/log", "Change to a folder. cd - goes back to the last one."], ["tree -L 2 /etc", "Show a folder tree two levels deep."], ["find / -name \"nginx.conf\" 2>/dev/null", "Search the whole system for a file by name."], ["du -sh *", "Size of each item in this folder."], ["df -h", "Free and used space on each disk."]], []], ["users", "Users, groups and sudo", "Basics", "user", "Every process and file belongs to a user. sudo lets a trusted user run one command as root.", "Creating service accounts, giving a team access to a folder, and auditing who can become root.", [["root", "The all-powerful account (UID 0)."], ["UID / GID", "Numeric ids for a user and a group."], ["sudo", "Run a single command with root rights, and log it."], ["/etc/passwd", "List of accounts. Password hashes live in /etc/shadow."]], [["id", "Show your user id and groups."], ["whoami", "Print the current username."], ["sudo useradd -m -s /bin/bash alice", "Create a user with a home folder and bash shell."], ["sudo usermod -aG docker alice", "Add alice to the docker group. Keep -a or you replace her groups."], ["sudo passwd alice", "Set a password. You are prompted, so it never appears in the command."], ["sudo -l", "List what you are allowed to run with sudo."], ["getent group sudo", "Show who is in the sudo group."]], [["Permission denied after adding to a group", "Group membership is read at login.", "Log out and back in, or run newgrp docker."], ["\"user is not in the sudoers file\"", "The account has no sudo rights.", "As root, add it to the sudo (Debian) or wheel (RHEL) group."]]], ["perms", "Permissions and ownership", "Basics", "lock", "Three sets of read, write and execute bits decide who can touch a file.", "Fixing Permission denied, locking down keys and configs, and setting up shared folders.", [["rwx", "Read 4, write 2, execute 1. Add them per set."], ["Owner / group / others", "The three sets, in that order."], ["chmod", "Change the permission bits."], ["chown", "Change the owner and group."]], [["ls -l file", "Show owner, group and mode, for example -rw-r-----."], ["chmod 640 file", "Owner rw, group r, others none."], ["chmod u+x script.sh", "Add execute for the owner only."], ["chmod -R 750 /srv/app", "Apply to a whole folder tree. Use with care."], ["sudo chown alice:devs file", "Set owner alice and group devs."], ["chmod 600 ~/.ssh/id_ed25519", "Private keys must be owner-only or SSH refuses them."], ["umask", "Show the default mask applied to new files."]], [["Permission denied running a script", "The execute bit is missing.", "chmod +x script.sh, then ./script.sh."], ["SSH ignores your key", "Key or ~/.ssh is too open.", "chmod 700 ~/.ssh and chmod 600 on the key."], ["Web server cannot read files", "Its user has no access.", "Check ls -l and the user in the service config, then fix group or mode."]]], ["pkg", "Package management", "Basics", "pkg", "Install, update and remove software from trusted repositories.", "Installing tools on servers, applying security updates and checking what is installed.", [["Repository", "A signed source of packages."], ["apt / dnf", "Package managers for Debian/Ubuntu and RHEL/Fedora."], ["Dependency", "Another package this one needs."], ["Security update", "A patch for a known vulnerability."]], [["sudo apt update", "Refresh the package list (Debian, Ubuntu)."], ["sudo apt install nginx", "Install a package."], ["sudo apt upgrade", "Install available updates."], ["apt list --installed | grep ssh", "See whether a package is installed."], ["sudo dnf install nginx", "Install on RHEL, Fedora, Rocky or Amazon Linux."], ["sudo dnf check-update", "List available updates on RHEL family."], ["dpkg -L nginx", "List files a package installed."]], []], ["shell", "Shell, pipes and text tools", "Basics", "window", "Chain small commands with pipes to search, filter and summarize anything.", "Reading logs, pulling out IPs, counting errors and building one-line checks.", [["Pipe |", "Send one command output into the next."], ["Redirect > >>", "Write output to a file, or append to it."], ["stdout / stderr", "Normal output and error output, which can be split."], ["Exit code", "0 means success. Anything else means failure."]], [["grep -i error app.log", "Lines containing error, ignoring case."], ["grep -rn \"TODO\" .", "Search all files below here and show line numbers."], ["tail -f /var/log/syslog", "Follow a log live as it grows."], ["awk '{print $1}' access.log | sort | uniq -c | sort -nr | head", "Top ten client IPs in a web log."], ["sed -i \"s/old/new/g\" file", "Replace text in place."], ["cut -d: -f1 /etc/passwd", "Take the first field of each line."], ["echo $?", "Show the exit code of the last command."], ["command 2>&1 | tee out.txt", "Merge errors into output, show it and save it."]], []], ["proc", "Processes and signals", "Processes and services", "gear", "A process is a running program. You can inspect, pause and stop it.", "Finding what eats CPU or memory, stopping a stuck job and checking what a service runs as.", [["PID", "The number that identifies a process."], ["Signal", "A message to a process. TERM asks it to stop, KILL forces it."], ["Foreground / background", "Whether it holds your terminal."], ["Zombie", "A finished process whose parent has not collected it."]], [["ps aux --sort=-%cpu | head", "Top CPU users."], ["top", "Live view. Press M for memory, q to quit."], ["htop", "Friendlier top, if installed."], ["pgrep -a nginx", "Find processes by name."], ["kill 1234", "Ask process 1234 to stop (SIGTERM)."], ["kill -9 1234", "Force kill. Last resort, no clean-up."], ["lsof -i :8080", "Which process listens on port 8080."], ["nohup ./job.sh &", "Run in the background and survive logout."]], [["Process will not die", "It ignores TERM or is stuck.", "Try kill -9. If it stays, it is in uninterruptible I/O. Check the disk or network mount."], ["Many zombie processes", "The parent is not reaping them.", "Fix or restart the parent process."]]], ["systemd", "systemd services", "Processes and services", "server", "systemd starts, stops and watches your services and records their logs.", "Starting nginx or Docker at boot, restarting a crashed app and reading why it failed.", [["Unit", "A service, timer or mount that systemd manages."], ["enable / start", "enable runs it at boot. start runs it now."], ["journal", "systemd's central log, read with journalctl."], ["Restart=", "A setting that revives a crashed service."]], [["systemctl status nginx", "State, recent log lines and the main PID."], ["sudo systemctl restart nginx", "Stop and start the service."], ["sudo systemctl enable --now nginx", "Start now and at every boot."], ["systemctl list-units --failed", "Show everything that failed."], ["journalctl -u nginx -n 50 --no-pager", "Last 50 log lines for one service."], ["journalctl -u nginx -f", "Follow the service log live."], ["sudo systemctl daemon-reload", "Reload after editing a unit file."], ["systemctl cat nginx", "Show the unit file in use."]], [["Service fails to start", "The config or a port is wrong.", "Read systemctl status and journalctl -u name -n 50, then fix the first error shown."], ["Edited the unit but nothing changed", "systemd has the old copy.", "Run daemon-reload, then restart."]]], ["cron", "Cron and timers", "Processes and services", "clock", "Run jobs on a schedule: backups, clean-ups, reports.", "Nightly backups, log rotation and health checks.", [["crontab", "Your personal list of scheduled jobs."], ["Schedule", "Five fields: minute hour day month weekday."], ["Environment", "Cron has a tiny PATH, so use full paths."], ["systemd timer", "A modern alternative with better logging."]], [["crontab -e", "Edit your jobs."], ["crontab -l", "List your jobs."], ["*/5 * * * * /usr/local/bin/check.sh", "Run every 5 minutes."], ["0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1", "Run at 02:00 daily and keep the output."], ["grep CRON /var/log/syslog", "See whether cron ran the job."], ["systemctl list-timers", "Show active systemd timers."]], [["Job works by hand but not in cron", "Different PATH and environment.", "Use absolute paths and set variables inside the script."], ["No output, no error", "Output is discarded.", "Redirect to a log file as in the backup example."]]], ["net", "Network commands", "Networking", "cloud", "A small toolkit answers: do I have an address, a route, DNS, an open port?", "Checking why a service is unreachable and which ports a server exposes.", [["IP address", "Where this machine lives on the network."], ["Port", "A numbered door for one service."], ["DNS", "Turns names into addresses."], ["Listening", "A service waiting for connections on a port."]], [["ip a", "Show interfaces and IP addresses."], ["ip route", "Show the routing table and default gateway."], ["ss -tulpn", "List listening TCP and UDP ports with the owning process."], ["ping -c 4 8.8.8.8", "Test reachability to an IP, four packets."], ["dig example.com +short", "Look up a DNS name."], ["curl -I https://example.com", "Fetch only the HTTP headers."], ["nc -zv host 443", "Test whether a TCP port is open without sending data."], ["traceroute example.com", "Show each hop on the path."], ["nc -zv 10.0.0.5 22", "Check if port 22 is reachable."]], [["ping an IP works, a name fails", "DNS problem.", "Check /etc/resolv.conf and dig @8.8.8.8 name."], ["Port open locally, not remotely", "A firewall or security group blocks it.", "Test from another host and check ufw, iptables and cloud rules."]]], ["ssh", "SSH and keys", "Networking", "key", "Encrypted remote login. Use keys, not passwords.", "Logging into servers, copying files and tunnelling to private services.", [["Key pair", "A private key you keep and a public key you share."], ["authorized_keys", "Public keys allowed to log in as this user."], ["known_hosts", "Servers you have already trusted."], ["Agent", "Holds your unlocked key in memory."]], [["ssh-keygen -t ed25519 -C \"athul laptop\"", "Create a key pair. Set a passphrase when asked."], ["ssh-copy-id user@host", "Install your public key on the server."], ["ssh -i ~/.ssh/id_ed25519 user@host", "Log in with a specific key."], ["scp file.txt user@host:/tmp/", "Copy a file to the server."], ["rsync -avz ./site/ user@host:/var/www/", "Sync a folder efficiently."], ["ssh -L 8080:localhost:80 user@host", "Forward local port 8080 to port 80 on the server."], ["ssh -vvv user@host", "Verbose output to debug a failing login."]], [["Permission denied (publickey)", "The server does not accept your key.", "Check the key is in authorized_keys and that ~/.ssh is 700 and the file 600."], ["Connection timed out", "Port 22 is blocked or the host is down.", "Check security group, firewall and sshd with systemctl status ssh."], ["Host key changed warning", "The server was rebuilt, or someone is intercepting.", "Confirm with the owner, then ssh-keygen -R host."]]], ["fw", "Firewalls", "Networking", "firewall", "Allow only the ports you need, to the sources that need them.", "Opening 443, keeping 22 private and blocking everything else by default.", [["Default deny", "Drop anything not explicitly allowed."], ["ufw", "Simple firewall front end on Ubuntu."], ["firewalld", "Zone-based firewall on RHEL family."], ["iptables / nftables", "The kernel packet filters underneath."]], [["sudo ufw status verbose", "Show rules and default policy."], ["sudo ufw default deny incoming", "Block all inbound by default."], ["sudo ufw allow 443/tcp", "Allow HTTPS."], ["sudo ufw allow from 203.0.113.10 to any port 22", "Allow SSH only from one address."], ["sudo ufw enable", "Turn the firewall on. Allow SSH first or you lock yourself out."], ["sudo firewall-cmd --list-all", "Show firewalld rules."], ["sudo iptables -L -n -v", "Raw rules with packet counters."]], [["Locked out after enabling ufw", "SSH was not allowed first.", "Use the cloud console or VM console to run ufw allow 22/tcp."]]], ["disk", "Troubleshooting: disk full", "Troubleshooting", "disk", "\"No space left on device\" breaks logging, databases and deployments.", "The most common cause of a sudden outage on a long-running server.", [["Inode", "A file record. You can run out even with free space."], ["Log rotation", "Old logs compressed and deleted on a schedule."], ["Deleted but open", "A deleted file still uses space until its process closes it."], ["Mount", "A disk attached at a folder."]], [["df -h", "Which filesystem is full."], ["df -i", "Inode usage."], ["sudo du -xh / --max-depth=1 2>/dev/null | sort -h | tail", "Biggest top-level folders."], ["sudo du -sh /var/log/* | sort -h | tail", "Biggest logs."], ["sudo journalctl --vacuum-size=200M", "Shrink the systemd journal."], ["sudo lsof +L1", "Deleted files still held open."], ["docker system df", "Docker disk use. docker system prune frees it."], ["sudo apt clean", "Clear the package cache."]], [["Disk is full but du shows little", "A deleted file is held open.", "lsof +L1, then restart that process."], ["df shows space but writes fail", "Out of inodes.", "df -i, then find and remove millions of small files."], ["/var/log grows fast", "A noisy service or no rotation.", "Fix the cause, then configure logrotate."]]], ["perf", "Troubleshooting: slow or high load", "Troubleshooting", "clock", "Find whether CPU, memory, disk or network is the bottleneck before changing anything.", "Answering \"why is the server slow?\" with evidence.", [["Load average", "Average number of processes wanting CPU. Compare to core count."], ["Swap", "Disk used as slow memory. Heavy swapping means too little RAM."], ["iowait", "CPU waiting for the disk."], ["OOM killer", "Kernel kills a process when memory runs out."]], [["uptime", "Load averages for 1, 5 and 15 minutes."], ["nproc", "Number of CPU cores."], ["free -h", "Memory and swap use."], ["vmstat 1 5", "CPU, memory, swap and I/O every second."], ["iostat -x 1 3", "Per-disk busy time and wait."], ["ps aux --sort=-%mem | head", "Top memory users."], ["dmesg -T | grep -i \"out of memory\"", "Evidence the OOM killer ran."], ["sar -u 1 5", "CPU history if sysstat is installed."]], [["Load is high but CPU is idle", "Processes are stuck on disk or network.", "Check iowait in vmstat and iostat."], ["App keeps dying with no error", "The OOM killer stopped it.", "Check dmesg, add memory or set limits."]]], ["svcfail", "Troubleshooting: service will not start", "Troubleshooting", "server", "A repeatable routine finds the first real error fast.", "Any time systemctl start fails or a container exits immediately.", [["Exit code", "Why the process ended."], ["Port in use", "Another process already holds the port."], ["Config test", "Most servers can validate their config before start."], ["First error", "Fix the earliest error. Later ones are often side effects."]], [["systemctl status app", "State and the last log lines."], ["journalctl -u app -n 100 --no-pager", "More context."], ["sudo nginx -t", "Test nginx config. Similar: apachectl configtest, sshd -t."], ["ss -tulpn | grep :80", "Who already uses port 80."], ["ls -l /path/to/file", "Check the paths in the config exist and are readable."], ["sudo -u appuser /usr/bin/app", "Run it by hand as its service user to see the error."], ["env | sort", "Check environment variables the app needs."]], [["Address already in use", "Another process holds the port.", "ss -tulpn to find it, stop it or change the port."], ["Works by hand, fails as a service", "Different user, folder or environment.", "Run as the service user and compare paths and env."]]], ["logs", "Reading logs", "Troubleshooting", "file", "Logs tell you what happened, in order. Learn to find the right one quickly.", "Debugging errors and investigating incidents.", [["syslog / messages", "General system messages."], ["auth.log / secure", "Logins and sudo use."], ["journal", "Structured systemd logs."], ["logrotate", "Archives and deletes old logs."]], [["sudo tail -n 100 /var/log/syslog", "Last 100 system lines."], ["sudo tail -f /var/log/nginx/error.log", "Follow a web server error log."], ["journalctl --since \"1 hour ago\"", "Everything in the last hour."], ["journalctl -p err -b", "Errors since the last boot."], ["sudo grep \"Failed password\" /var/log/auth.log | tail", "Recent failed SSH logins."], ["zgrep \"error\" /var/log/syslog.*.gz", "Search rotated, compressed logs."], ["last -n 10", "Recent logins."], ["dmesg -T | tail", "Kernel messages with readable times."]], []], ["connect", "Troubleshooting: cannot connect", "Troubleshooting", "cloud", "Walk the path in order: name, route, port, firewall, service.", "When a site, API or SSH is unreachable.", [["Layer by layer", "Test from the bottom up and stop at the first failure."], ["Timeout", "Packets dropped, usually a firewall."], ["Refused", "The host answered but nothing listens on that port."], ["Reset", "Something closed the connection."]], [["ping -c 2 host", "Is the host up?"], ["dig host +short", "Does the name resolve?"], ["nc -zv host 443", "Is the port reachable?"], ["curl -v https://host", "See TLS and HTTP details."], ["ss -tulpn | grep :443", "On the server: is anything listening?"], ["sudo ufw status", "Is the local firewall blocking it?"], ["traceroute host", "Where does the path stop?"]], [["Connection refused", "Service is down or listening on another address.", "Start it and check it binds to 0.0.0.0 or the right interface."], ["Connection timed out", "A firewall or security group drops packets.", "Open the port in both the host firewall and the cloud rules."], ["Name does not resolve", "DNS record or resolver problem.", "Check the record and /etc/resolv.conf."]]], ["harden", "Server hardening basics", "Security", "shield", "A few steps remove most of the easy attacks.", "Preparing a new server before it faces the internet.", [["Least privilege", "Give users and services only what they need."], ["Attack surface", "Everything an attacker could reach."], ["Patch", "Install security updates promptly."], ["Defence in depth", "Several layers, so one failure is not fatal."]], [["sudo apt update && sudo apt upgrade", "Apply updates."], ["sudo unattended-upgrades --dry-run", "Check automatic security updates (Debian, Ubuntu)."], ["sudo nano /etc/ssh/sshd_config", "Set PermitRootLogin no and PasswordAuthentication no. Keep a second session open."], ["sudo sshd -t && sudo systemctl reload ssh", "Test the SSH config, then reload."], ["sudo ufw default deny incoming", "Default deny inbound."], ["sudo apt install fail2ban", "Ban IPs with repeated failed logins."], ["ss -tulpn", "Review what listens. Remove what you do not need."], ["sudo lynis audit system", "Run a hardening audit if Lynis is installed."]], [["Locked out after changing SSH settings", "Config error or keys not set up.", "Keep the old session open while testing. Otherwise use the provider console."]]], ["audit", "Spotting suspicious activity", "Security", "firewall", "Know the quick checks a SOC analyst runs on a Linux host.", "First-look triage of a server you suspect is compromised.", [["Indicator of compromise", "Evidence such as an unknown user, process or connection."], ["Persistence", "How an attacker keeps access: cron, keys, services."], ["Lateral movement", "Using one host to reach others."], ["Evidence", "Do not overwrite logs. Copy them first."]], [["last -a | head", "Recent logins and where they came from."], ["sudo lastb | head", "Failed login attempts."], ["who -a", "Who is logged in now."], ["ps auxf", "Process tree. Look for odd parents and paths in /tmp."], ["ss -tunap", "Live connections with processes."], ["sudo grep -i \"accepted\" /var/log/auth.log | tail", "Successful SSH logins."], ["sudo find / -perm -4000 -type f 2>/dev/null", "SUID files that run as their owner."], ["sudo crontab -l; ls /etc/cron.*", "Look for unexpected scheduled jobs."], ["cat ~/.ssh/authorized_keys", "Are there keys you do not recognise?"]], [["Unknown outbound connection", "Possible malware or data exfiltration.", "Note the PID and path with ss -tunap, isolate the host and preserve logs before killing anything."]]], ["docker", "Docker host troubleshooting", "DevOps", "container", "Containers are Linux processes. The same tools help.", "Debugging containers that exit, run slow or cannot be reached.", [["Container", "An isolated process with its own filesystem."], ["Exit code 137", "Killed, often by the OOM killer."], ["Volume", "Storage that outlives a container."], ["Port mapping", "host:container, for example 8080:3000."]], [["docker ps -a", "All containers including stopped ones."], ["docker logs --tail 100 -f name", "Recent logs, following."], ["docker inspect name | less", "Full config, mounts and exit code."], ["docker exec -it name sh", "Open a shell inside."], ["docker stats", "Live CPU and memory per container."], ["docker system df", "Disk used by images and volumes."], ["docker system prune", "Remove stopped containers and unused images."]], [["Container exits at once", "The main process failed.", "docker logs name and docker inspect for the exit code."], ["Cannot reach the app on the host", "Port not published or app binds to 127.0.0.1.", "Use -p host:container and bind the app to 0.0.0.0."]]], ["script", "Bash scripting basics", "DevOps", "file", "Automate repeated steps with a short, safe script.", "Deploy helpers, backups and health checks.", [["Shebang", "#!/usr/bin/env bash on the first line."], ["set -euo pipefail", "Stop on errors and unset variables."], ["Variable", "NAME=value, read as $NAME."], ["Exit code", "Return 0 for success."]], [["chmod +x deploy.sh", "Make the script executable."], ["set -euo pipefail", "Put near the top for safer scripts."], ["if [ -f file ]; then echo ok; fi", "Test whether a file exists."], ["for f in *.log; do gzip \"$f\"; done", "Loop over files."], ["read -rsp \"Password: \" PW", "Read a secret without showing it. Never put secrets in the command."], ["bash -x script.sh", "Trace every line while it runs."], ["shellcheck script.sh", "Find mistakes before running."]], [["Script works in terminal, fails in cron", "Different PATH.", "Use absolute paths and set PATH at the top."], ["Spaces in names break the script", "Unquoted variables.", "Always quote: \"$var\"."]]]];
var LNXCATS=['Basics','Processes and services','Networking','Troubleshooting','Security','DevOps'];
var lnxSeen=lsGet('lnxseen',[]);
function lnxById(id){for(var i=0;i<LNX.length;i++)if(LNX[i][0]===id)return LNX[i];return null}

/* ---------- contents window: sidebar of sections, list of everything inside ---------- */

/* ---------- Networking lesson ---------- */
var NETM=[['DNS lookup','UDP 53','no','0'],['TCP handshake','TCP 443','no','1.5'],['HTTP request','TCP 80','no','2'],['TLS encryption','TCP 443','yes','3'],['Firewall rule','TCP 22','yes','3'],['Full trip','TCP 443','yes','3']];
function netMetrics(s){var m=NETM[s.k];return [['Stage',m[0],'ok'],['Port',m[1],s.k===4?'bad':'ok'],['Encrypted',m[2],m[2]==='yes'?'ok':'warn'],['Round trips',m[3],'ok']]}
function drawNet(s){
  IOY=70;var o='',q=Qnew(),k=s.k;
  var cp=P(1.7,8.4,0),sp=P(10.1,8.4,0),dp=P(5.1,3.4,0);
  Qadd(q,0,4,plat(0,4,3.4,3.4,'idle')+'<g>'+ic('user',P(1,4.8,5)[0]-22,P(1,4.8,5)[1]-60,44)+'</g>');
  o+=T(cp[0],cp[1]+4,'your browser','lbl xs','middle');
  Qadd(q,4,0,plat(4,0,2.2,2.2,k===0?'run':'idle')+bill('cloud',5.1,1.1,6,50));
  o+=T(dp[0],dp[1]+4,'DNS server','lbl xs','middle');
  Qadd(q,8.4,4,plat(8.4,4,3.4,3.4,k===4?'bad':'ok')+rack(9.1,4.6,k===4?'hot':'ok'));
  o+=T(sp[0],sp[1]+4,'web server','lbl xs','middle');
  var A=[[3.4,5.7],[8.4,5.7]],Ar=[[8.4,5.7],[3.4,5.7]],D=[[1.7,4],[1.7,1.1],[4,1.1]],Dr=[[4,1.1],[1.7,1.1],[1.7,4]];
  o+=pipe(A,k>=1&&k!==4?'flow':null)+pipe(D,k===0?'flow':null);
  if(k===0){o+=packet(pipeD(D),2,0,'c-req')+packet(pipeD(Dr),2,1,'c-res')+chip(dp[0]+40,dp[1]-110,'shop.example.com → 203.0.113.7')}
  if(k===1){o+=packet(pipeD(A),1.6,0,'c-req')+packet(pipeD(Ar),1.6,.5,'c-res')+packet(pipeD(A),1.6,1,'c-req');o+=chip(330,30,'SYN → SYN-ACK → ACK')}
  if(k===2){o+=packet(pipeD(A),2,0,'c-req')+packet(pipeD(Ar),2,1,'c-res');o+=chip(330,30,'GET /index.html → 200 OK')}
  if(k===3||k===5){o+=packet(pipeD(A),2,0,'c-req')+packet(pipeD(Ar),2,1,'c-res');o+=chip(330,30,k===5?'DNS → TCP → TLS → HTTP':'certificate checked, keys agreed')}
  if(k===4){o+=pipe(A,'dead')+chip(330,30,'port 22 blocked, 443 open','c-bad');var fp=P(7.2,5.7,22);o+=chip(fp[0],fp[1]-20,'firewall','c-bad')+packet(pipeD([[3.4,5.7],[7.2,5.7]]),2,0,'c-slow')}
  return o+Qflush(q);
}
LESSONS.push({
  id:'network',icon:'cloud',parts:[["user", {}, "Browser", "The client that starts every request."], ["cloud", {}, "DNS", "Turns a name into an IP address."], ["server", {}, "Server", "Answers on a port, such as 443."], ["firewall", {}, "Firewall", "Allows or blocks traffic by port."]],name:'Networking',
  blurb:'Follow one web request from the browser: name lookup, connection, encryption, the HTTP exchange and the firewall rules that decide what gets through.',
  legend:[['c-req','request'],['c-res','response'],['c-slow','blocked'],['c-bad','denied']],
  draw:drawNet,metrics:netMetrics,
  steps:[
   {label:'DNS',tag:'NAME',title:'First, turn the name into an address',
    text:'Computers route by IP address, not by name. Your browser asks a DNS server where shop.example.com lives and gets back an IP such as 203.0.113.7. The answer is cached so the next lookup is instant.',
    idea:'DNS is a phone book. If DNS fails, the site looks down even though the server is fine.',scene:{k:0}},
   {label:'TCP',tag:'CONNECT',title:'Then open a connection',
    text:'TCP sets up a reliable connection with three messages: SYN, SYN-ACK, ACK. Only after that handshake can data flow. Each round trip costs real time, which is why distance matters.',
    idea:'A port picks the service on the machine. 80 is HTTP, 443 is HTTPS, 22 is SSH.',scene:{k:1}},
   {label:'HTTP',tag:'REQUEST',title:'Send the HTTP request',
    text:'The browser sends a request such as GET /index.html. The server answers with a status code and the content. 200 means OK, 404 not found, 500 a server error.',
    idea:'HTTP is plain text on its own. Anyone on the path could read it.',scene:{k:2}},
   {label:'TLS',tag:'SECURE',title:'TLS encrypts the conversation',
    text:'HTTPS wraps HTTP in TLS. The server proves who it is with a certificate, both sides agree on keys, and everything after that is encrypted. That is the padlock in the address bar.',
    idea:'A certificate proves identity. Encryption keeps the contents private.',scene:{k:3}},
   {label:'Firewall',tag:'BLOCK',title:'Firewalls allow or deny by port',
    text:'A firewall or cloud security group lists which ports and sources are allowed. Open 443 to the world, but keep 22 (SSH) limited to your own IP. Anything not allowed is dropped silently, which looks like a timeout.',
    idea:'Default deny. Open only the ports you need, to the sources that need them.',scene:{k:4}},
   {label:'Whole trip',tag:'RECAP',title:'The whole trip, end to end',
    text:'DNS finds the address, TCP opens the connection, TLS secures it, HTTP carries the request and response, and the firewall allowed it all on port 443. When something breaks, check these layers in order.',
    idea:'Debug in order: DNS, connection, firewall, TLS, then the application.',scene:{k:5}}
  ]
});

/* ---------- Terraform lesson ---------- */
function tfMetrics(s){var m=[['write','0','0','0'],['init','0','0','0'],['plan','3','0','0'],['apply','3','0','0'],['change','1','1','0'],['destroy','0','0','3']][s.k];return [['Command',['write','init','plan','apply','apply','destroy'][s.k],'ok'],['To add',m[1],'ok'],['To change',m[2],s.k===4?'warn':'ok'],['To destroy',m[3],s.k===5?'bad':'ok']]}
function drawTF(s){
  IOY=70;var o='',q=Qnew(),k=s.k,cp=P(1.7,8.4,0),rp=P(9.6,8.4,0),i;
  Qadd(q,0,4,plat(0,4,3.4,3.4,k<3?'run':'idle')+vpanel(0.3,4.5,6,2.6,36,'x','list'));
  o+=T(cp[0],cp[1]+4,'main.tf','lbl xs','middle');
  Qadd(q,8,3.6,plat(8,3.6,3.6,4,k>=3&&k<5?'ok':'idle'));
  var n=k>=3&&k<5?3:0;
  var kinds=['rack','cloud','disk'];
  for(i=0;i<n;i++){var y=3.9+i*1.2;Qadd(q,8.4,y,ibox(8.5,y,5,2.6,0.9,12,i===1&&k===4?'amber':'teal',{glow:'rgba(255,138,31,.45)'}))}
  if(k===2)for(i=0;i<3;i++){var y2=3.9+i*1.2;Qadd(q,8.4,y2,ibox(8.5,y2,5,2.6,0.9,12,'grey',{op:.45}))}
  if(k===5)o+=chip(rp[0]-60,rp[1]-130,'3 resources removed','c-bad');
  o+=T(rp[0],rp[1]+4,'cloud account','lbl xs','middle');
  var A=[[3.4,5.7],[8,5.7]];o+=pipe(A,k>=2&&k<=4?'flow':(k===5?'dead':null));
  if(k===2||k===3)o+=packet(pipeD(A),2,0,'c-req');
  var tx=['Terraform reads .tf files','terraform init downloads the provider','Plan: 3 to add, 0 to change, 0 to destroy','Apply complete! 3 added','Plan: 0 to add, 1 to change','Destroy complete! 3 destroyed'];
  o+=chip(330,30,tx[k]);
  return o+Qflush(q);
}
LESSONS.push({
  id:'terraform',icon:'gear',parts:[["file", {"t": "doc"}, "Config", "Files that describe the infrastructure you want."], ["gear", {}, "Provider", "The plugin that talks to a cloud API."], ["clipboard", {}, "Plan", "A preview of what will change."], ["cloud", {}, "State", "Terraform's record of what it created."]],name:'Terraform',
  blurb:'Describe infrastructure in code, preview the changes and apply them. See init, plan, apply, drift and destroy with a small cloud account.',
  legend:[['c-req','api call'],['c-res','response'],['c-bad','removed']],
  draw:drawTF,metrics:tfMetrics,
  steps:[
   {label:'Write',tag:'CODE',title:'Describe what you want',text:'In Terraform you write what the end result should be: three resources, say a server, a bucket and a network. You do not write the steps to create them. The files are plain text, so they live in Git like any code.',idea:'Declarative means you state the goal and the tool works out the steps.',scene:{k:0}},
   {label:'Init',tag:'SETUP',title:'terraform init downloads providers',text:'A provider is a plugin that knows one platform, such as AWS. init downloads the providers your config needs and prepares the working folder. You run it once per project and again when providers change.',idea:'No provider, no way to talk to the cloud.',scene:{k:1}},
   {label:'Plan',tag:'PREVIEW',title:'terraform plan shows the change first',text:'Plan compares your files with the state and the real cloud, then lists what it would add, change or destroy. Nothing is touched yet. Read the plan like a code review.',idea:'Always read the plan. The destroy count is the number to watch.',scene:{k:2}},
   {label:'Apply',tag:'BUILD',title:'terraform apply makes it real',text:'Apply runs the plan. Terraform calls the cloud API, creates the three resources and records them in the state file. Resources that do not depend on each other are created in parallel.',idea:'State maps your code to real resources. Protect it and store it remotely for teams.',scene:{k:3}},
   {label:'Change',tag:'UPDATE',title:'Edit the code, plan again',text:'Change one setting in the file and run plan again. Terraform shows only the difference: one resource to change, the others untouched. If someone edited the cloud by hand, plan also reveals that drift.',idea:'Fix drift by changing the code, not the console.',scene:{k:4}},
   {label:'Destroy',tag:'CLEAN UP',title:'terraform destroy removes everything',text:'Destroy deletes every resource tracked in the state. It is perfect for lab environments you do not want to keep paying for, and dangerous in production.',idea:'Use workspaces or separate state so a lab destroy can never touch production.',scene:{k:5}}
  ]
});

/* ---------- Monitoring lesson ---------- */
function monMetrics(s){var v=[['Error rate','0.2%','ok'],['Error rate','0.2%','ok'],['Error rate','6%','bad'],['Error rate','6%','bad'],['Error rate','0.3%','ok']][s.k];return [v,['Latency p95',s.k>=2&&s.k<4?'2.4 s':'180 ms',s.k>=2&&s.k<4?'bad':'ok'],['Alert',s.k===2||s.k===3?'firing':'quiet',s.k===2||s.k===3?'bad':'ok'],['Logs / min',s.k>=1?'1.2k':'0','ok']]}
function drawMon(s){
  IOY=70;var o='',q=Qnew(),k=s.k,ap=P(1.7,8.4,0),mp=P(5.1,3.4,0),op=P(9.8,8.4,0),bad=k===2||k===3;
  Qadd(q,0,4,plat(0,4,3.4,3.4,bad?'bad':'ok')+rack(0.7,4.6,bad?'hot':'ok'));
  o+=T(ap[0],ap[1]+4,'your app','lbl xs','middle');
  Qadd(q,4,0,plat(4,0,2.6,2.2,'run')+vpanel(4.2,0.4,6,2.1,40,'x','dash'));
  o+=T(mp[0],mp[1]+4,'dashboards','lbl xs','middle');
  Qadd(q,8.4,4,plat(8.4,4,3.4,3.4,bad?'wait':'idle')+bill('firewall',9.6,5.2,8,44));
  o+=T(op[0],op[1]+4,'on-call','lbl xs','middle');
  var A=[[1.7,4],[1.7,1.1],[4,1.1]],B=[[3.4,5.7],[8.4,5.7]];
  o+=pipe(A,k>=1?'flow':null);if(k>=1)o+=packet(pipeD(A),1.8,0,bad?'c-slow':'c-req');
  o+=pipe(B,bad?'flow':null);if(bad)o+=packet(pipeD(B),1.6,0,'c-bad');
  var tx=['Nothing is measured yet','Metrics and logs flow to dashboards','Error rate 6% for 5 minutes → alert fires','On-call gets paged, reads the dashboard','Rollback done, error rate back to 0.3%'];
  o+=chip(330,30,tx[k],bad?'c-bad':null);
  return o+Qflush(q);
}
LESSONS.push({
  id:'monitoring',icon:'clock',parts:[["server", {}, "Metrics", "Numbers over time, such as error rate and latency."], ["file", {"t": "doc"}, "Logs", "Text records of what happened."], ["window", {}, "Dashboard", "One screen that shows health."], ["firewall", {}, "Alert", "A page when a rule is broken."]],name:'Monitoring',
  blurb:'Learn what to measure, how metrics, logs and dashboards fit together, and how a good alert reaches the right person before users complain.',
  legend:[['c-req','metrics and logs'],['c-slow','degraded'],['c-bad','alert']],
  draw:drawMon,metrics:monMetrics,
  steps:[
   {label:'Blind',tag:'PROBLEM',title:'Without monitoring you find out from users',text:'An app can be slow or failing for hours before anyone on the team notices. Monitoring is how you find out first, and how you prove the fix worked.',idea:'You cannot fix what you cannot see.',scene:{k:0}},
   {label:'Signals',tag:'COLLECT',title:'Collect metrics and logs',text:'Metrics are numbers sampled over time: requests, errors, latency, CPU. Logs are the detailed text of individual events. Metrics tell you something is wrong, logs help explain why.',idea:'Start with the four golden signals: latency, traffic, errors and saturation.',scene:{k:1}},
   {label:'Alert',tag:'DETECT',title:'An alert fires on a symptom',text:'The error rate jumps to 6% and stays there for five minutes, so a rule fires. Good alerts watch what users feel, such as errors and slowness, instead of every CPU spike.',idea:'Alert on symptoms, not causes. Every alert should need a human action.',scene:{k:2}},
   {label:'Respond',tag:'ACT',title:'On-call reads the dashboard',text:'The page reaches whoever is on call. They open the dashboard, see that errors began right after a release, and check the logs for the failing endpoint.',idea:'Dashboards answer "what changed?" in seconds when they are built around the same signals as the alerts.',scene:{k:3}},
   {label:'Recover',tag:'FIX',title:'Roll back and confirm',text:'Rolling back the release brings the error rate back to normal. The graph is the proof. Afterwards the team writes down what happened and adds a missing alert or test.',idea:'Measure time to detect and time to recover. Both should shrink over time.',scene:{k:4}}
  ]
});

/* ---------- IAM lesson ---------- */
function iamMetrics(s){var m=[['Identity','alice','ok'],['Policy','read only','ok'],['Request','s3:GetObject','ok'],['Decision','ALLOW','ok'],['Decision','DENY','bad'],['MFA','required','ok']][s.k];var d=s.k===4?'DENY':(s.k===3||s.k===5?'ALLOW':'pending');return [['Principal','alice','ok'],['Action',['none','none','GetObject','GetObject','PutObject','GetObject'][s.k],'ok'],['Decision',d,d==='DENY'?'bad':'ok'],['Access','least privilege','ok']]}
function drawIAM(s){
  IOY=70;var o='',q=Qnew(),k=s.k,cp=P(1.7,8.4,0),pp=P(5.1,3.4,0),rp=P(10.1,8.4,0),deny=k===4;
  Qadd(q,0,4,plat(0,4,3.4,3.4,'idle')+'<g>'+ic('user',P(1,4.8,5)[0]-22,P(1,4.8,5)[1]-60,44)+'</g>');
  o+=T(cp[0],cp[1]+4,'alice','lbl xs','middle');
  Qadd(q,4,0,plat(4,0,2.6,2.2,k>=1?'run':'idle')+vpanel(4.2,0.4,6,2.1,40,'x','list'));
  o+=T(pp[0],pp[1]+4,'policy','lbl xs','middle');
  Qadd(q,8.4,4,plat(8.4,4,3.4,3.4,deny?'bad':'ok')+bill('bucket',9.4,5.2,8,44));
  o+=T(rp[0],rp[1]+4,'S3 bucket','lbl xs','middle');
  var A=[[3.4,5.7],[8.4,5.7]],D=[[1.7,4],[1.7,1.1],[4,1.1]];
  o+=pipe(D,k===1||k===2?'flow':null)+pipe(A,k>=2?(deny?'dead':'flow'):null);
  if(k===1)o+=packet(pipeD(D),1.8,0,'c-req');
  if(k===2||k===3||k===5)o+=packet(pipeD(A),1.8,0,'c-req')+(k>=3?packet(pipeD([[8.4,5.7],[3.4,5.7]]),1.8,.9,'c-res'):'');
  if(deny)o+=packet(pipeD([[3.4,5.7],[7,5.7]]),1.8,0,'c-bad');
  var tx=['An identity: a user, role or app','Policy: alice may only read this bucket','Request: alice calls GetObject','Allowed: the policy says yes','Denied: PutObject is not in the policy','Allowed after MFA, from a trusted role'];
  o+=chip(330,30,tx[k],deny?'c-bad':null);
  return o+Qflush(q);
}
LESSONS.push({
  id:'iam',icon:'lock',parts:[["user", {}, "Principal", "Who is asking: a user, role or app."], ["file", {"t": "doc"}, "Policy", "Rules that list allowed actions."], ["bucket", {}, "Resource", "What is being accessed."], ["lock", {}, "MFA", "A second proof of identity."]],name:'IAM and least privilege',
  blurb:'See how a cloud decides yes or no: who is asking, what the policy allows, and why giving only the access that is needed keeps attackers out.',
  legend:[['c-req','request'],['c-res','response'],['c-bad','denied']],
  draw:drawIAM,metrics:iamMetrics,
  steps:[
   {label:'Identity',tag:'WHO',title:'Every request starts with an identity',text:'In the cloud, nothing happens anonymously. A person, an app or a server makes each request as a principal such as a user, a role or a service account.',idea:'Prefer roles with temporary credentials over long-lived access keys.',scene:{k:0}},
   {label:'Policy',tag:'RULES',title:'A policy lists what is allowed',text:'A policy is a small document of rules: this identity may perform these actions on these resources. Alice gets read access to one bucket and nothing else.',idea:'Everything not explicitly allowed is denied by default.',scene:{k:1}},
   {label:'Request',tag:'ASK',title:'The request is checked',text:'Alice calls GetObject on the bucket. The cloud checks who she is, then looks at every policy attached to her before touching the data.',idea:'Authentication proves who you are. Authorization decides what you can do.',scene:{k:2}},
   {label:'Allow',tag:'YES',title:'A matching rule allows it',text:'The policy contains s3:GetObject for this bucket, so the request goes through and Alice gets her file. Every decision is logged, which gives you an audit trail.',idea:'Logs of allow and deny decisions are the first place a SOC analyst looks.',scene:{k:3}},
   {label:'Deny',tag:'NO',title:'Anything else is denied',text:'Alice tries PutObject to overwrite a file. No rule allows it, so it is denied. If her credentials were stolen, the attacker could read but not change or delete data.',idea:'Least privilege limits the damage when an account is compromised.',scene:{k:4}},
   {label:'MFA',tag:'HARDEN',title:'Add a second factor for sensitive actions',text:'Multi-factor authentication asks for a code or key as well as the password. A policy can require it for risky actions, so a stolen password alone is not enough.',idea:'Turn on MFA for every human user, especially admins.',scene:{k:5}}
  ]
});

/* ---------- Linux lesson ---------- */
function linMetrics(s){var m=[['Owner','alice','644'],['Group','devs','640'],['Mode','rw- r-- ---','640'],['User','bob','denied'],['Process','nginx','running'],['Log','auth.log','24 lines']][s.k];return [['File','report.txt','ok'],['Mode',['644','640','640','640','640','640'][s.k],'ok'],['Access',s.k===3?'denied':'ok',s.k===3?'bad':'ok'],['Focus',['owner','group','permissions','denied','process','logs'][s.k],'ok']]}
function drawLin(s){
  IOY=70;var o='',q=Qnew(),k=s.k,cp=P(1.7,8.4,0),fp=P(5.1,3.4,0),sp=P(10.1,8.4,0);
  Qadd(q,0,4,plat(0,4,3.4,3.4,'idle')+'<g>'+ic('user',P(1,4.8,5)[0]-22,P(1,4.8,5)[1]-60,44)+'</g>');
  o+=T(cp[0],cp[1]+4,k===3?'bob':'alice','lbl xs','middle');
  Qadd(q,4,0,plat(4,0,2.6,2.2,'run')+bill('file',5.1,1.1,6,44));
  o+=T(fp[0],fp[1]+4,'report.txt','lbl xs','middle');
  Qadd(q,8.4,4,plat(8.4,4,3.4,3.4,k===4?'ok':'idle')+rack(9.1,4.6,k===4?'ok':'idle'));
  o+=T(sp[0],sp[1]+4,k>=4?'nginx':'server','lbl xs','middle');
  var D=[[1.7,4],[1.7,1.1],[4,1.1]],B=[[3.4,5.7],[8.4,5.7]];
  o+=pipe(D,k<=2?'flow':(k===3?'dead':null))+pipe(B,k>=4?'flow':null);
  if(k<=2)o+=packet(pipeD(D),2,0,'c-req');if(k===3)o+=packet(pipeD([[1.7,4],[1.7,1.1],[3,1.1]]),2,0,'c-bad');if(k>=4)o+=packet(pipeD(B),2,0,'c-req');
  var tx=['Owner alice owns report.txt','Group devs can also read it','-rw-r----- = owner rw, group r, others none','bob is not in devs: Permission denied','ps shows nginx running as its own user','journalctl and /var/log record what happened'];
  o+=chip(330,30,tx[k],k===3?'c-bad':null);
  return o+Qflush(q);
}
LESSONS.push({
  id:'linux',icon:'server',parts:[["user", {}, "User", "An account that owns files and runs processes."], ["file", {"t": "doc"}, "File", "Has an owner, a group and permission bits."], ["server", {}, "Process", "A running program, with the rights of its user."], ["folder", {}, "Logs", "Where Linux records events in /var/log."]],name:'Linux basics',
  blurb:'Learn the Linux ideas every DevOps and security job relies on: users and groups, file permissions, processes and logs.',
  legend:[['c-req','access'],['c-bad','denied']],
  draw:drawLin,metrics:linMetrics,
  steps:[
   {label:'Owner',tag:'USERS',title:'Every file has an owner',text:'Linux is multi-user. Each file belongs to one user, here alice. You can see it with ls -l, which lists the owner, the group and the permissions.',idea:'Run services as their own low-privilege user, never as root.',scene:{k:0}},
   {label:'Group',tag:'GROUPS',title:'Groups share access',text:'A file also belongs to a group, such as devs. Anyone in that group gets the group permissions, so a team can share files without sharing a password.',idea:'Use groups to give access to teams, not to individuals.',scene:{k:1}},
   {label:'Mode',tag:'CHMOD',title:'Permissions are three sets of three bits',text:'rw-r----- reads as: owner can read and write, group can read, everyone else gets nothing. In numbers that is 640. chmod changes it, chown changes the owner.',idea:'r=4, w=2, x=1. Add them up per set: 6 is rw, 4 is r, 0 is none.',scene:{k:2}},
   {label:'Denied',tag:'BLOCK',title:'Others are refused',text:'bob is not the owner and not in devs, so reading the file gives Permission denied. This is the same least-privilege idea you saw in IAM, built into the operating system.',idea:'Check ls -l and id when you see Permission denied.',scene:{k:3}},
   {label:'Process',tag:'RUNNING',title:'Processes run as a user',text:'A running program is a process, and it can only touch what its user can touch. ps and top show them, systemctl starts and stops services such as nginx.',idea:'If a service is hacked, the attacker gets only that user\'s rights.',scene:{k:4}},
   {label:'Logs',tag:'EVIDENCE',title:'Logs record what happened',text:'Linux logs logins, sudo use, errors and service events under /var/log and in the journal. tail -f follows a log live, and grep finds a pattern such as Failed password.',idea:'When something breaks or looks suspicious, read the logs first.',scene:{k:5}}
  ]
});
var SECT=[
 {id:'git',kind:'lesson',lesson:'git',tag:'Code',icon:'branch'},
 {id:'docker',kind:'lesson',lesson:'docker',tag:'Containers',icon:'container'},
 {id:'kubernetes',kind:'lesson',lesson:'kubernetes',tag:'Containers',icon:'pod'},
 {id:'aws',kind:'aws',name:'AWS',tag:'Cloud',icon:'cloud'},
 {id:'scaling',kind:'lesson',lesson:'scaling',tag:'Architecture',icon:'lb'},
 {id:'pipeline',kind:'lesson',lesson:'pipeline',tag:'Delivery',icon:'rocket'},
 {id:'network',kind:'lesson',lesson:'network',tag:'Foundations',icon:'cloud'},
 {id:'terraform',kind:'lesson',lesson:'terraform',tag:'Infrastructure',icon:'gear'},
 {id:'monitoring',kind:'lesson',lesson:'monitoring',tag:'Operations',icon:'clock'},
 {id:'iam',kind:'lesson',lesson:'iam',tag:'Security',icon:'lock'},
 {id:'linux',kind:'lesson',lesson:'linux',tag:'Foundations',icon:'server'},
 {id:'lnx',kind:'lnx',name:'Linux guides',tag:'Foundations',icon:'server'},
 {id:'game',kind:'game',name:'Incident Room',tag:'Play',icon:'firewall'},
 {id:'lab',kind:'lab',name:'Build Lab',tag:'Practice',icon:'gear'},
 {id:'gp',kind:'gp',name:'Git Practice',tag:'Practice',icon:'commit'}
];
function lessonById(id){for(var i=0;i<LESSONS.length;i++)if(LESSONS[i].id===id)return LESSONS[i];return null}
function secName(s){return s.name||lessonById(s.lesson).name}
var MS='overview',MSVC=null,mLast=null;
function mCur(){if(gpOn)return 'gp';if(labOn)return 'lab';if(gameOn)return 'game';return (cur&&(cur.id==='ec2'||cur.id==='s3'))?'aws':(cur?cur.id:'overview')}
function mOpen(){mLast=document.activeElement;MS=mCur();MSVC=null;$('#mdl').hidden=false;try{document.body.style.overflow='hidden'}catch(e){}mRender();$('#mclose').focus()}
function mClose(){$('#mdl').hidden=true;try{document.body.style.overflow=''}catch(e){}if(mLast&&mLast.focus)mLast.focus()}
function secProg(s){
  if(s.kind==='game'||s.kind==='lab'||s.kind==='gp')return null;
  if(s.kind==='lnx')return [lnxSeen.length,LNX.length];
  if(s.kind==='lesson'){var L=lessonById(s.lesson);return [(seen[L.id]||[]).length,L.steps.length]}
  if(s.kind==='lnx')return [lnxSeen.length,LNX.length];
  var n=0,t=0;['ec2','s3'].forEach(function(id){var L=lessonById(id);n+=(seen[id]||[]).length;t+=L.steps.length});
  return [n+svcSeen.length,t+svcGuides().length];
}
function mCard(s){
  var pr=secProg(s),blurb,meta;
  if(s.kind==='lesson'){var L=lessonById(s.lesson);blurb=L.blurb;meta=L.steps.length+' steps'}
  else if(s.kind==='aws'){blurb='Hands-on EC2 and S3 lessons, plus short guides to '+svcGuides().length+' more AWS services.';meta='2 lessons · '+svcGuides().length+' guides'}
  else if(s.kind==='lnx'){blurb='Linux for DevOps and security: basics, commands, troubleshooting and hardening, as short guides with command tables.';meta=LNX.length+' guides'}
  else if(s.kind==='gp'){blurb='A practice repo you drive with real git commands. Watch the three areas and the commit graph change.';meta='6 missions'}
  else if(s.kind==='lab'){blurb='Design your own infrastructure, send traffic through it and see what it costs and where it breaks.';meta='5 goals'}
  else{blurb='An on-call game. Read the alert, pick your first move and beat the clock.';meta='Best '+lsGet('best',0)}
  return '<button class="scard" type="button" data-mgo="'+s.id+'"><span class="sh"><span class="sico">'+icSvg(s.icon,30)+'</span><span><span class="st">'+esc(s.tag)+'</span><span class="sn">'+esc(secName(s))+'</span></span></span><span class="sp">'+esc(blurb)+'</span><span class="smeta"><span>'+esc(meta)+'</span><span>'+(pr?pr[0]+'/'+pr[1]:'Play')+' →</span></span>'+(pr?'<span class="pb"><i style="width:'+Math.round(pr[0]/pr[1]*100)+'%"></i></span>':'')+'</button>';
}
function mSvcDetail(s){
  var rel=s[8]?lessonById(s[8]):null;
  return '<article class="svc"><div class="sh"><span class="sico">'+icSvg(s[3],40)+'</span><div><span class="st">AWS · '+esc(s[2])+'</span><h3 class="svt">'+esc(s[1])+'</h3></div></div><p class="lead">'+esc(s[4])+'</p>'+
   '<h4 class="mh4">Where DevOps uses it</h4><p>'+esc(s[5])+'</p>'+
   '<h4 class="mh4">Key ideas</h4><div class="tw"><table class="tb"><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>'+s[6].map(function(r){return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td></tr>'}).join('')+'</tbody></table></div>'+
   '<h4 class="mh4">Commands to know</h4><div class="tw"><table class="tb"><thead><tr><th>Command</th><th>What it does</th></tr></thead><tbody>'+s[7].map(function(r){return '<tr><td><code>'+esc(r[0])+'</code></td><td>'+esc(r[1])+'</td></tr>'}).join('')+'</tbody></table></div>'+
   '<p class="note">Commands need the AWS CLI and a configured profile. Never type access keys into a command. Use <code>aws configure</code> or a role. Replace placeholder values (ARN, ids, ACCOUNT) with your own.</p>'+
   '<div class="mnavrow"><button class="btn" type="button" data-mgo="aws">← All AWS services</button>'+(rel?'<button class="btn go" type="button" data-mlesson="'+rel.id+'"><span>Related lesson: '+esc(rel.name)+'</span><span aria-hidden="true">→</span></button>':'')+'</div></article>';
}
function mLnxDetail(s){
  var rel=lessonById('linux');
  return '<article class="svc"><div class="sh"><span class="sico">'+icSvg(s[3],40)+'</span><div><span class="st">Linux · '+esc(s[2])+'</span><h3 class="svt">'+esc(s[1])+'</h3></div></div><p class="lead">'+esc(s[4])+'</p>'+
   '<h4 class="mh4">When you need it</h4><p>'+esc(s[5])+'</p>'+
   '<h4 class="mh4">Key ideas</h4><div class="tw"><table class="tb"><thead><tr><th>Term</th><th>Meaning</th></tr></thead><tbody>'+s[6].map(function(r){return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td></tr>'}).join('')+'</tbody></table></div>'+
   '<h4 class="mh4">Commands to know</h4><div class="tw"><table class="tb"><thead><tr><th>Command</th><th>What it does</th></tr></thead><tbody>'+s[7].map(function(r){return '<tr><td><code>'+esc(r[0])+'</code></td><td>'+esc(r[1])+'</td></tr>'}).join('')+'</tbody></table></div>'+
   (s[8].length?'<h4 class="mh4">Common problems</h4><div class="tw"><table class="tb"><thead><tr><th>Symptom</th><th>Likely cause</th><th>What to do</th></tr></thead><tbody>'+s[8].map(function(r){return '<tr><td><b>'+esc(r[0])+'</b></td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>'}).join('')+'</tbody></table></div>':'')+
   '<p class="note">Try commands on a test VM first. Replace names, paths and addresses with your own. Never put passwords or keys in a command line, and take a backup before changing config files.</p>'+
   '<div class="mnavrow"><button class="btn" type="button" data-mgo="lnx">← All Linux guides</button><button class="btn go" type="button" data-mlesson="linux"><span>Related lesson: '+esc(rel.name)+'</span><span aria-hidden="true">→</span></button></div></article>';
}
function mRender(){
  var side='<div class="mh">'+icSvg('layers',26)+'<span>Overview</span></div><button class="mnav" type="button" data-mgo="overview"'+(MS==='overview'?' aria-current="true"':'')+'>'+icSvg('window',18)+'All sections</button>'+
   SECT.map(function(s){return '<button class="mnav" type="button" data-mgo="'+s.id+'"'+(MS===s.id?' aria-current="true"':'')+'>'+icSvg(s.icon,18)+esc(secName(s))+'</button>'}).join('');
  $('#mside').innerHTML=side;
  var title,sub,body='',s=null,i;
  for(i=0;i<SECT.length;i++)if(SECT[i].id===MS)s=SECT[i];
  if(MS==='overview'||!s){title='All sections';sub='Everything in OpsLens in one place. Pick a section on the left or a card below.';renderDash();body='<div class="kpis">'+$('#kpis').innerHTML+'</div><div class="sgrid">'+SECT.map(mCard).join('')+'</div><div class="bottom">'+$('#bottom').innerHTML+'</div>'}
  else if(s.kind==='lesson'){
    var L=lessonById(s.lesson),sv=seen[L.id]||[];
    title=L.name;sub=L.blurb;
    body='<ol class="msteps">'+L.steps.map(function(st,k){return '<li><button class="mstep" type="button" data-mstep="'+L.id+':'+k+'"><span class="mnum'+(sv.indexOf(k)>-1?' ok':'')+'">'+(sv.indexOf(k)>-1?'✓':(k+1))+'</span><span class="mtx"><b>'+esc(st.label)+'</b><span>'+esc(st.title)+'</span></span><span class="chipTag">'+esc(st.tag)+'</span></button></li>'}).join('')+'</ol>';
  }else if(s.kind==='gp'){
    title='Git Practice';sub='Type real git commands in a safe practice repo.';
    body='<div class="mgame"><p>Stage, commit, branch, merge, undo, stash and push. Six missions guide you, and a live commit graph shows what each command does.</p><button class="btn run" type="button" data-mgp="1">Open Git Practice</button></div>';
  }else if(s.kind==='lab'){
    title='Build Lab';sub='Design your own infrastructure and test it.';
    body='<div class="mgame"><p>Add blocks such as a CDN, load balancer, servers, cache and database. Link them, set the traffic level, and check your design against five goals.</p><button class="btn run" type="button" data-mlab="1">Open the Build Lab</button></div>';
  }else if(s.kind==='game'){
    title='Incident Room';sub='An on-call game. Read the alert, pick your first move and beat the clock.';
    body='<div class="mgame"><p>Best score <b>'+lsGet('best',0)+'</b> · Shifts played <b>'+lsGet('shifts',0)+'</b></p><button class="btn run" type="button" data-mgame="1">Open the Incident Room</button></div>';
  }else if(s.kind==='lnx'){
    if(MSVC){var lg=lnxById(MSVC);title=lg[1];sub='Linux guide';body=mLnxDetail(lg)}
    else{title='Linux for DevOps and security';sub='Basics, everyday commands, troubleshooting and hardening. Each guide has tables you can scan fast.';
      LNXCATS.forEach(function(c){var items=LNX.filter(function(x){return x[2]===c});if(!items.length)return;
        body+='<div class="agrp"><h4>'+esc(c)+'</h4><div class="sgrid compact">'+items.map(function(x){var rd=lnxSeen.indexOf(x[0])>-1;
          return '<button class="scard" type="button" data-mlnx="'+x[0]+'"><span class="sh"><span class="sico">'+icSvg(x[3],28)+'</span><span class="sn">'+esc(x[1])+'</span><span class="badge '+(rd?'rd':'gd')+'">'+(rd?'Read':'Guide')+'</span></span><span class="sp">'+esc(x[4])+'</span></button>'}).join('')+'</div></div>'})}
  }else if(MSVC){
    var sv2=svcById(MSVC);title=sv2[1];sub='AWS guide';body=mSvcDetail(sv2);
  }else{
    title='AWS for DevOps';sub='EC2 and S3 are full interactive lessons. The rest are short guides with the ideas and commands you need first.';
    AWSCATS.forEach(function(c){
      var items=SVC.filter(function(x){return x[2]===c});if(!items.length)return;
      body+='<div class="agrp"><h4>'+esc(c)+'</h4><div class="sgrid compact">'+items.map(function(x){
        var les=!x[7].length,at=les?'data-mlesson="'+x[8]+'"':'data-msvc="'+x[0]+'"',rd=!les&&svcSeen.indexOf(x[0])>-1;
        return '<button class="scard" type="button" '+at+'><span class="sh"><span class="sico">'+icSvg(x[3],28)+'</span><span class="sn">'+esc(x[1])+'</span><span class="badge '+(les?'les':(rd?'rd':'gd'))+'">'+(les?'Lesson':(rd?'Read':'Guide'))+'</span></span><span class="sp">'+esc(x[4])+'</span></button>';
      }).join('')+'</div></div>';
    });
  }
  $('#mtitle').textContent=title;$('#msub').textContent=sub;$('#mbody').innerHTML=body;$('#mbody').scrollTop=0;
}
document.addEventListener('click',function(e){
  var t=e.target;
  if(t.id==='mdl'){mClose();return}
  t=t.closest?t.closest('button'):null;if(!t)return;
  if(t.id==='menuBtn'){mOpen();return}
  if(t.id==='mclose'){mClose();return}
  if(t.dataset.mgo){MS=t.dataset.mgo;MSVC=null;mRender();return}
  if(t.dataset.msvc){MSVC=t.dataset.msvc;if(svcSeen.indexOf(MSVC)<0){svcSeen.push(MSVC);lsSet('svcseen',svcSeen)}mRender();return}
  if(t.dataset.mlnx){MS='lnx';MSVC=t.dataset.mlnx;if(lnxSeen.indexOf(MSVC)<0){lnxSeen.push(MSVC);lsSet('lnxseen',lnxSeen)}mRender();return}
  if(t.dataset.mstep){var p=t.dataset.mstep.split(':');mClose();pick(p[0],parseInt(p[1],10));return}
  if(t.dataset.mlesson){mClose();pick(t.dataset.mlesson,0);return}
  if(t.dataset.mgame){mClose();showGame();return}
  if(t.dataset.mlab){mClose();showLab();return}
  if(t.dataset.mgp){mClose();showGP();return}
});
document.addEventListener('keydown',function(e){
  if($('#mdl').hidden)return;
  if(e.key==='Escape'){e.stopPropagation();mClose();return}
  if(e.key==='Tab'){
    var f=[].slice.call($('#mdl').querySelectorAll('button')).filter(function(b){return b.offsetParent!==null});
    if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  }
},true);

/* ---------- Build Lab: design your own infrastructure and test it ---------- */
var labOn=false,LAB=null,labSel=null,labMode=false,labFrom=null,labDemand=300,labBuilt=false,labClr=0,labDrag=null;
var LT={
 users:{name:'Users',icon:'user',cost:0,hint:'People sending requests. Always present.'},
 cdn:{name:'CDN',icon:'globe',cost:0.01,hint:'CloudFront. Serves about 60% of requests from cache.'},
 fw:{name:'Firewall',icon:'firewall',cost:0,hint:'Security group or WAF. Only lets wanted traffic in.'},
 lb:{name:'Load balancer',icon:'lb',cost:0.03,hint:'ALB. Spreads traffic over healthy servers, up to 1000 req/s.'},
 server:{name:'Server',icon:'server',cost:0.04,hint:'EC2 or containers. Each instance handles 60 req/s.'},
 cache:{name:'Cache',icon:'flask',cost:0.05,hint:'ElastiCache. Answers about 70% of reads, so the database sees 30%.'},
 db:{name:'Database',icon:'db',cost:0.07,hint:'RDS. Handles 200 req/s. Multi-AZ adds a standby copy.'},
 store:{name:'Storage',icon:'bucket',cost:0.01,hint:'S3. Holds static files such as images and scripts.'}
};
var LCOL={users:60,cdn:190,fw:320,lb:450,server:580,cache:710,db:830,store:710};
function labStarter(){return {seq:3,nodes:[{id:'n1',t:'users',x:60,y:220},{id:'n2',t:'server',x:580,y:220,n:1}],links:[['n1','n2']]}}
function labExample(){return {seq:10,nodes:[
 {id:'n1',t:'users',x:60,y:220},{id:'n2',t:'cdn',x:190,y:220},{id:'n3',t:'fw',x:320,y:220},{id:'n4',t:'lb',x:450,y:220},
 {id:'n5',t:'server',x:580,y:220,n:3},{id:'n6',t:'cache',x:710,y:150},{id:'n7',t:'db',x:830,y:220,ha:true},{id:'n8',t:'store',x:710,y:330}],
 links:[['n1','n2'],['n2','n3'],['n2','n8'],['n3','n4'],['n4','n5'],['n5','n6'],['n6','n7'],['n5','n7']]}}
function labLoad(){var d=lsGet('lab',null);if(d&&d.nodes&&d.links&&d.nodes.length)return d;return labStarter()}
function labSave(){lsSet('lab',LAB)}
function labNode(id){for(var i=0;i<LAB.nodes.length;i++)if(LAB.nodes[i].id===id)return LAB.nodes[i];return null}
function labMsg(t){var m=$('#lmsg');if(m)m.textContent=t||''}
function labAdd(t){
  if(LAB.nodes.length>=14){labMsg('That is the maximum of 14 blocks.');return}
  var x=LCOL[t],y=t==='store'?330:80,k,tries=0;
  function busy(yy){return LAB.nodes.some(function(n){return Math.abs(n.x-x)<110&&Math.abs(n.y-yy)<80})}
  while(busy(y)&&tries<8){y+=90;if(y>380)y=80;tries++}
  var n={id:'n'+(++LAB.seq),t:t,x:x,y:y};if(t==='server')n.n=1;if(t==='db')n.ha=false;
  LAB.nodes.push(n);labSel={k:'n',id:n.id};labMsg('Added '+LT[t].name+'. Click Link, then two blocks, to connect them.');labSave();labRender();
}
function labDel(){
  if(!labSel)return;
  if(labSel.k==='l'){LAB.links.splice(labSel.i,1)}
  else{var n=labNode(labSel.id);if(!n||n.t==='users'){labMsg('The Users block stays.');return}
    LAB.nodes=LAB.nodes.filter(function(x){return x.id!==n.id});LAB.links=LAB.links.filter(function(l){return l[0]!==n.id&&l[1]!==n.id})}
  labSel=null;labSave();labRender();
}
function labTryLink(a,b){
  if(a===b)return;var A=labNode(a),B=labNode(b);
  if(B.t==='users'){labMsg('Nothing sends traffic into Users.');return}
  if(LAB.links.some(function(l){return (l[0]===a&&l[1]===b)||(l[0]===b&&l[1]===a)})){labMsg('Those two are already linked.');return}
  LAB.links.push([a,b]);labMsg('Linked '+LT[A.t].name+' to '+LT[B.t].name+'.');labSave();
}
/* the simplified traffic model */
function labEval(D,chaos){
  var N={},out={},i;
  LAB.nodes.forEach(function(n){N[n.id]=n;out[n.id]=[]});
  LAB.links.forEach(function(l){if(N[l[0]]&&N[l[1]])out[l[0]].push(l[1])});
  function cnt(n){if(n.dead)return 0;var c=n.n||1;if(chaos===n.id)c-=1;return Math.max(0,c)}
  function isUp(n){if(n.t==='server')return cnt(n)>0;if(n.dead)return false;if(chaos===n.id&&!(n.t==='db'&&n.ha))return false;return true}
  function up(id){return isUp(N[id])}
  var inF={},lk={},srv={},cdnAbs=0,dbLoad=0;
  function fan(id,list,f,d){if(!list.length)return;var s=f/list.length;list.forEach(function(x){var k=id+'>'+x;lk[k]=(lk[k]||0)+s;push(x,s,d+1)})}
  function push(id,f,d){
    if(f<0.001||d>9)return;var n=N[id];inF[id]=(inF[id]||0)+f;if(!isUp(n))return;
    var outs=out[id].filter(function(x){return N[x].t!=='store'}),al=outs.filter(up);
    if(n.t==='fw')fan(id,al,f,d);
    else if(n.t==='cdn'){cdnAbs+=f*0.6;fan(id,al,f*0.4,d)}
    else if(n.t==='lb')fan(id,al,Math.min(f,1000),d);
    else if(n.t==='cache')fan(id,al.filter(function(x){return N[x].t==='db'}),f*0.3,d);
    else if(n.t==='db')dbLoad+=f;
    else if(n.t==='server'){
      var h=Math.min(f,60*cnt(n)),caches=al.filter(function(x){return N[x].t==='cache'}),dbs=al.filter(function(x){return N[x].t==='db'});
      var allDb=outs.filter(function(x){return N[x].t==='db'}),allC=outs.filter(function(x){return N[x].t==='cache'});
      var cdb=function(c){return out[c].filter(function(x){return N[x].t==='db'})};
      var needs=allDb.length>0||allC.some(function(c){return cdb(c).length>0});
      var has=dbs.length>0||caches.some(function(c){return cdb(c).some(up)});
      srv[id]={h:h,needs:needs,ok:!needs||has};
      if(srv[id].ok){if(caches.length)fan(id,caches,h,d);else if(dbs.length)fan(id,dbs,h,d)}
    }
  }
  var U=null;LAB.nodes.forEach(function(n){if(n.t==='users')U=n});
  if(U){var uo=out[U.id];if(uo.length){var s=D/uo.length;uo.forEach(function(x){lk[U.id+'>'+x]=(lk[U.id+'>'+x]||0)+s;push(x,s,1)})}}
  var dbUp=LAB.nodes.filter(function(n){return n.t==='db'&&isUp(n)}).length,dbCap=200*dbUp,f=dbLoad>0?Math.min(1,dbCap/Math.max(dbLoad,0.001)):1;
  var served=cdnAbs;
  Object.keys(srv).forEach(function(id){var q=srv[id];if(q.ok)served+=q.h*(q.needs?f:1)});
  served=Math.min(served,D);
  return {D:D,served:served,pct:D>0?served/D:0,inF:inF,lk:lk,f:f,dbCap:dbCap,dbLoad:dbLoad,cnt:cnt,up:isUp,N:N,out:out};
}
function labCost(){
  var c=0;LAB.nodes.forEach(function(n){var d=LT[n.t].cost;if(n.t==='server')c+=d*(n.n||1);else if(n.t==='db')c+=d*(n.ha?2:1);else c+=d});return c;
}
function labGoals(r){
  var N=r.N,out=r.out,U=null,g=[],i;
  LAB.nodes.forEach(function(n){if(n.t==='users')U=n});
  /* 1 traffic */
  g.push([r.pct>=0.95,'Handle the traffic','Serve at least 95% of '+r.D+' req/s. Now: '+Math.round(r.pct*100)+'%.','Add servers, put a load balancer in front, or add a CDN so fewer requests reach the servers.']);
  /* 2 survive one failure */
  var worst=1,wn=null;
  LAB.nodes.forEach(function(n){if(n.t==='server'||n.t==='db'||n.t==='cache'){var q=labEval(r.D,n.id).pct;if(q<worst){worst=q;wn=n}}});
  var ok2=r.pct>=0.95&&worst>=0.85&&LAB.nodes.some(function(n){return n.t==='server'});
  var h2=!wn?(r.pct<0.95?'Fix the traffic goal first.':'Survives every single failure.'):'If the '+LT[wn.t].name.toLowerCase()+' fails, only '+Math.round(worst*100)+'% is served. '+(wn.t==='server'?'Add a second instance.':wn.t==='db'?'Turn on Multi-AZ.':'Link servers straight to the database as well, so they can bypass a failed cache.');
  g.push([ok2,'Survive one failure','Lose any one server, cache or database and still serve 85% or more.',ok2?'Every single failure is covered.':h2]);
  /* 3 front door */
  var uo=U?out[U.id]:[],front=uo.length>0&&uo.every(function(x){var t=N[x].t;return t==='cdn'||t==='fw'||t==='lb'});
  var seenF={},q=uo.slice(),fwr=false;while(q.length){var id=q.shift();if(seenF[id])continue;seenF[id]=1;if(N[id].t==='fw')fwr=true;out[id].forEach(function(x){q.push(x)})}
  g.push([front&&fwr,'Protect the front door','Users reach only a CDN, firewall or load balancer, and a firewall sits on the path.',front?'Add a Firewall and link it on the path from Users.':'Do not link Users straight to servers or the database. Put a CDN, firewall or load balancer in front.']);
  /* 4 cache */
  var c4=LAB.nodes.some(function(n){return n.t==='cache'&&LAB.links.some(function(l){return l[1]===n.id&&N[l[0]].t==='server'})&&out[n.id].some(function(x){return N[x].t==='db'})});
  g.push([c4,'Cache protects the database','A server links to a cache and the cache links to the database.','Add a Cache, link a Server to it, then link the Cache to the Database.']);
  /* 5 static */
  var c5=LAB.nodes.some(function(n){return n.t==='store'&&LAB.links.some(function(l){return l[1]===n.id&&(N[l[0]].t==='cdn'||N[l[0]].t==='server')})});
  g.push([c5,'Static files off the servers','Storage is linked from a CDN or a server.','Add Storage, then link a CDN to it so images and scripts come from S3.']);
  return g;
}
function labPath(a,b){
  var sx=a.x+(b.x>=a.x?48:-48),ex=b.x+(b.x>=a.x?-48:48),dx=Math.max(30,Math.abs(ex-sx)/2)*(b.x>=a.x?1:-1);
  return 'M'+sx+','+a.y+' C'+(sx+dx)+','+a.y+' '+(ex-dx)+','+b.y+' '+ex+','+b.y;
}
function labDraw(r){
  var s='<defs><marker id="larr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#ff8a1f"/></marker></defs>';
  s+='<rect x="0" y="0" width="900" height="440" fill="none" data-lbg="1"/>';
  LAB.links.forEach(function(l,i){
    var a=labNode(l[0]),b=labNode(l[1]);if(!a||!b)return;
    var d=labPath(a,b),f=r.lk[l[0]+'>'+l[1]]||0,dead=!r.up(r.N[l[1]]),sel=labSel&&labSel.k==='l'&&labSel.i===i;
    s+='<path d="'+d+'" fill="none" stroke="'+(sel?'#f2c744':(dead?'#ff5f6d':'#ff8a1f'))+'" stroke-opacity="'+(f>0||sel?.85:.35)+'" stroke-width="'+(sel?3.4:1.4+Math.min(3,f/150))+'"'+(dead?' stroke-dasharray="5 5"':'')+' marker-end="url(#larr)"/>';
    var np=Math.min(3,Math.ceil(f/90));for(var k=0;k<np;k++)s+=packet(d,2.4,k*(2.4/np),'req');
    s+='<path d="'+d+'" fill="none" stroke="transparent" stroke-width="16" data-llink="'+i+'" style="cursor:pointer"/>';
  });
  LAB.nodes.forEach(function(n){
    var T0=LT[n.t],up=r.up(n),inn=r.inF[n.id]||0,util=0,sub='';
    if(n.t==='server'){var c=r.cnt(n);util=c?inn/(60*c):(inn>0?2:0);sub='×'+(n.n||1)+(c?' · '+Math.round(Math.min(util,9.99)*100)+'%':' · down')}
    else if(n.t==='lb'){util=inn/1000;sub=Math.round(inn)+' req/s'}
    else if(n.t==='db'){util=r.dbCap?r.dbLoad/r.dbCap:0;sub=(n.ha?'HA · ':'')+Math.round(r.dbLoad)+' req/s'}
    else if(n.t==='users'){sub=r.D+' req/s'}
    else if(n.t==='cdn'){sub=Math.round(inn)+' in'}
    else sub=Math.round(inn)+' in';
    var col=!up?'#ff5f6d':(util>=1?'#ff5f6d':(util>0.8?'#ffa24a':'#ff8a1f')),sel=labSel&&labSel.k==='n'&&labSel.id===n.id,pick=labFrom===n.id;
    s+='<g class="lnode" data-lnode="'+n.id+'" transform="translate('+(n.x-48)+','+(n.y-36)+')"><rect width="96" height="72" rx="12" fill="'+(ISOK.node==='#ffffff'?'#ffffff':'rgba(8,18,26,.94)')+'" stroke="'+(pick?'#f2c744':col)+'" stroke-width="'+(sel||pick?2.6:1.4)+'"'+(sel?' stroke-dasharray="6 4"':'')+' style="filter:drop-shadow(0 0 6px '+col+'55)"/>'+
      ic(n.t==='users'?'user':T0.icon,34,4,28,{})+T(48,46,T0.name,'lbl xs','middle')+T(48,62,sub,'lbl sm','middle')+
      (up?'':'<path d="M32,12 l32,32 m0,-32 l-32,32" class="cross"/>')+'</g>';
  });
  return s;
}
function labRender(){
  if(!labBuilt)return;
  var r=labEval(labDemand,null),gl=labGoals(r),met=gl.filter(function(x){return x[0]}).length,cost=labCost();
  $('#lsvg').innerHTML=labDraw(r);
  $('#lmetrics').innerHTML='<div class="tile"><div class="k">Traffic</div><div class="v">'+labDemand+' req/s</div></div><div class="tile '+(r.pct>=0.95?'ok':(r.pct>=0.6?'warn':'bad'))+'"><div class="k">Served</div><div class="v">'+Math.round(r.pct*100)+'%</div></div><div class="tile"><div class="k">Cost (est.)</div><div class="v">$'+cost.toFixed(2)+'/hr</div></div><div class="tile '+(met===5?'ok':'')+'"><div class="k">Goals</div><div class="v">'+met+' / 5</div></div>';
  $('#lgoals').innerHTML='<h3 class="ph">Goals <small>'+met+' of 5 met</small></h3><ul class="lgoals">'+gl.map(function(g){return '<li class="'+(g[0]?'done':'')+'"><span class="lck">'+(g[0]?'✓':'○')+'</span><span><b>'+esc(g[1])+'</b><small>'+esc(g[0]?g[2]:g[3])+'</small></span></li>'}).join('')+'</ul><p class="lnote">Cost is an illustrative estimate (about $'+(cost*730).toFixed(0)+' a month). Real AWS prices differ by region, so check the pricing page. This is a simplified model for practice.</p>';
  var ins='<h3 class="ph">Selected block</h3>';
  if(labSel&&labSel.k==='l'){ins+='<p>A link is selected.</p><div class="lrow"><button class="btn" type="button" data-ldel="1">Delete link</button></div>'}
  else if(labSel&&labNode(labSel.id)){
    var n=labNode(labSel.id),T0=LT[n.t];
    ins+='<p><b>'+esc(T0.name)+'</b><br>'+esc(T0.hint)+'</p><div class="lrow">';
    if(n.t==='server')ins+='<button class="btn" type="button" data-lstep="-1" aria-label="Fewer instances">−</button><span class="lval">'+(n.n||1)+' instance'+((n.n||1)>1?'s':'')+'</span><button class="btn" type="button" data-lstep="1" aria-label="More instances">+</button>';
    if(n.t==='db')ins+='<label class="lchk"><input type="checkbox" id="lha"'+(n.ha?' checked':'')+'> Multi-AZ standby</label>';
    if(n.t!=='users'){ins+='<button class="btn" type="button" data-lkill="1">'+(n.dead?'Bring it back':'Simulate failure')+'</button><button class="btn" type="button" data-ldel="1">Delete</button>'}
    ins+='</div>';
  }else ins+='<p class="lnote">Click a block to edit it. Drag blocks to move them.</p>';
  $('#linspect').innerHTML=ins;
  var mb=$('#lmode');if(mb){mb.setAttribute('aria-pressed',labMode?'true':'false');mb.textContent=labMode?(labFrom?'Now click the target block':'Click the first block'):'Link blocks'}
}
function labBuild(){
  labBuilt=true;
  $('#lab').innerHTML='<div class="labhead"><h2>Build Lab</h2><p>Design your own infrastructure. Add blocks, link them, then send traffic through the design and see what it can handle, what it costs and where it breaks.</p></div>'+
   '<div class="labbar"><div class="lpal" role="group" aria-label="Add a block">'+['cdn','fw','lb','server','cache','db','store'].map(function(t){return '<button class="btn lpb" type="button" data-ladd="'+t+'" title="'+esc(LT[t].hint)+'">'+icSvg(LT[t].icon,20)+esc(LT[t].name)+'</button>'}).join('')+'</div>'+
   '<div class="lpal"><button class="btn run" type="button" id="lmode" aria-pressed="false">Link blocks</button>'+
   '<label class="ltraf">Traffic <input type="range" id="lDemand" min="50" max="1000" step="50" value="'+labDemand+'"><output id="lDemandV">'+labDemand+' req/s</output></label></div></div>'+
   '<div class="labgrid"><div class="labcanvas"><svg id="lsvg" viewBox="0 0 900 440" role="img" aria-label="Your infrastructure design"></svg><p class="lmsg" id="lmsg" aria-live="polite"></p></div>'+
   '<div class="labside"><div class="metrics" id="lmetrics"></div><section class="panel" id="lgoals"></section><section class="panel" id="linspect"></section>'+
   '<div class="lrow"><button class="btn" type="button" data-lex="example">Load a solved example</button><button class="btn" type="button" data-lex="start">Start over</button></div></div></div>';
}
function showLab(fromH){
  clearTimers();hideGame();labOn=true;$('.app').classList.add('lb');
  if(!LAB)LAB=labLoad();if(!labBuilt)labBuild();
  renderStatic();labRender();
  if(!fromH){try{history.replaceState(null,'','#lab')}catch(e){location.hash='lab'}}
  try{window.scrollTo(0,0)}catch(e){}
}
function hideLab(){hideGP();if(!labOn)return;labOn=false;labMode=false;labFrom=null;$('.app').classList.remove('lb')}
function labPt(e){var sv=$('#lsvg'),m=sv.getScreenCTM();if(!m)return [0,0];var p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;p=p.matrixTransform(m.inverse());return [p.x,p.y]}
document.addEventListener('pointerdown',function(e){
  if(!labOn||!e.target.closest)return;
  var g=e.target.closest('[data-lnode]');
  if(g){var n=labNode(g.getAttribute('data-lnode')),p=labPt(e);labDrag={id:n.id,dx:n.x-p[0],dy:n.y-p[1],sx:e.clientX,sy:e.clientY,moved:false};e.preventDefault();return}
  var lk=e.target.closest('[data-llink]');
  if(lk){labSel={k:'l',i:parseInt(lk.getAttribute('data-llink'),10)};labFrom=null;labRender();return}
  if(e.target.closest('#lsvg')){labSel=null;if(labMode)labFrom=null;labRender()}
});
document.addEventListener('pointermove',function(e){
  if(!labDrag)return;
  if(!labDrag.moved&&Math.abs(e.clientX-labDrag.sx)+Math.abs(e.clientY-labDrag.sy)<6)return;
  labDrag.moved=true;var n=labNode(labDrag.id),p=labPt(e);
  n.x=Math.max(56,Math.min(844,Math.round(p[0]+labDrag.dx)));n.y=Math.max(42,Math.min(398,Math.round(p[1]+labDrag.dy)));labRender();
});
document.addEventListener('pointerup',function(){
  if(!labDrag)return;var d=labDrag;labDrag=null;
  if(d.moved){labSave();return}
  if(labMode){
    if(!labFrom){labFrom=d.id;labSel={k:'n',id:d.id}}
    else{labTryLink(labFrom,d.id);labFrom=null;labSel={k:'n',id:d.id}}
  }else labSel={k:'n',id:d.id};
  labRender();
});
document.addEventListener('click',function(e){
  if(!labOn)return;var t=e.target.closest?e.target.closest('button'):null;if(!t)return;
  if(t.dataset.ladd){labAdd(t.dataset.ladd);return}
  if(t.id==='lmode'){labMode=!labMode;labFrom=null;labMsg(labMode?'Link mode on. Click a source block, then the block it sends traffic to.':'');labRender();return}
  if(t.dataset.ldel){labDel();return}
  if(t.dataset.lkill){var n=labNode(labSel.id);if(n){n.dead=!n.dead;labSave();labRender()}return}
  if(t.dataset.lstep){var n2=labNode(labSel.id);if(n2){n2.n=Math.max(1,Math.min(6,(n2.n||1)+parseInt(t.dataset.lstep,10)));labSave();labRender()}return}
  if(t.dataset.lex==='example'){LAB=labExample();labSel=null;labDemand=300;$('#lDemand').value=300;$('#lDemandV').textContent='300 req/s';labSave();labMsg('Loaded a design that meets all five goals. Try breaking it.');labRender();return}
  if(t.dataset.lex==='start'){
    if(labClr){LAB=labStarter();labSel=null;labClr=0;labSave();labMsg('Back to one server.');t.textContent='Start over';labRender()}
    else{labClr=1;t.textContent='Click again to confirm';setTimeout(function(){labClr=0;t.textContent='Start over'},3000)}
    return;
  }
});
document.addEventListener('input',function(e){
  if(!labOn)return;var t=e.target;
  if(t.id==='lDemand'){labDemand=parseInt(t.value,10);$('#lDemandV').textContent=labDemand+' req/s';labRender()}
  else if(t.id==='lha'){var n=labNode(labSel.id);if(n){n.ha=t.checked;labSave();labRender()}}
});
document.addEventListener('keydown',function(e){
  if(!labOn)return;var tg=e.target&&e.target.tagName;if(tg==='INPUT'||tg==='BUTTON')return;
  if(e.key==='Delete'||e.key==='Backspace'){labDel();e.preventDefault()}
});

/* ---------- Git Practice: a simulated repo you drive with real git commands ---------- */
var gpOn=false,GP=null,gpBuilt=false,gpHist=[],gpHi=0,gpClr=0;
var GPM=[
 ['commit','Make your first commit','Create a file, stage it, commit it.','echo "hello" > notes.txt  →  git add notes.txt  →  git commit -m "Add notes"'],
 ['branch','Work on a branch','Create a branch and commit on it.','git switch -c feature  →  (edit a file)  →  git add .  →  git commit -m "..."'],
 ['merge','Merge it back','Switch to main and merge your branch.','git switch main  →  git merge feature'],
 ['revert','Undo safely','Undo a commit without rewriting history.','git revert HEAD'],
 ['push','Share your work','Push to the remote called origin.','git push origin main'],
 ['pop','Stash and restore','Shelve unfinished work, then bring it back.','(edit a tracked file)  →  git stash  →  git stash pop']
];
var GPHELP=[
 ['ls · cat f · touch f · rm f','Look at, create and delete files'],
 ['echo "text" > f   (>> appends)','Write text into a file (this is how you edit here)'],
 ['git status','What changed, and what is staged'],
 ['git add f   /   git add .','Stage a file / everything'],
 ['git commit -m "msg"   (-am)','Save staged changes (-a also stages tracked files)'],
 ['git log   --oneline','Show history'],
 ['git diff   --staged','See exact changes (unstaged / staged)'],
 ['git branch   name   -d name','List, create, delete branches'],
 ['git switch name   -c name','Move to a branch / create and move'],
 ['git checkout name   -b name','Older way to do the same'],
 ['git merge name','Join a branch into the current one'],
 ['git restore f   --staged f','Discard edits / unstage'],
 ['git reset --soft|--hard HEAD~1','Move the branch back (soft keeps changes staged, hard discards)'],
 ['git revert HEAD','Add a new commit that undoes one'],
 ['git stash   pop   list','Shelve work and bring it back'],
 ['git remote -v · fetch · pull · push','Work with origin (the shared copy)']
];
function gpFresh(){var t={'README.md':'# project\nMy first repo'};return {files:{'README.md':t['README.md']},idx:{'README.md':t['README.md']},head:'main',det:null,branches:{main:'a1b2c3d'},commits:{a1b2c3d:{p:[],m:'Initial commit',t:t,n:0,u:0}},remote:{main:'a1b2c3d'},track:{main:'a1b2c3d'},stash:[],seq:1,did:{},merging:null,log:[{k:'o',t:'Practice repo ready. Type help, or tap a command below. Work through the missions on the right.'}]}}
function gpLoad(){var d=lsGet('gp',null);return d&&d.files&&d.commits?d:gpFresh()}
function gpSave(){if(GP.log.length>160)GP.log=GP.log.slice(-160);lsSet('gp',GP)}
function cp(o){var r={};for(var k in o)r[k]=o[k];return r}
function hId(){var id;do{GP.seq++;id=('0000000'+(Math.imul(GP.seq,2654435761)>>>0).toString(16)).slice(-7)}while(GP.commits[id]);return id}
function hEq(a,b){var k;for(k in a)if(a[k]!==b[k])return false;for(k in b)if(a[k]!==b[k])return false;return true}
function hid(){return GP.det||GP.branches[GP.head]}
function hTree(){return GP.commits[hid()].t}
function anc(id){var s={},q=[id];while(q.length){var x=q.pop();if(!x||s[x])continue;s[x]=1;GP.commits[x].p.forEach(function(p){q.push(p)})}return s}
function resolve(r){
  if(!r)return null;var m=/^(HEAD|[\w\/.-]+?)(?:~(\d+)|(\^+))?$/.exec(r),base,n,id,i;if(!m)return null;
  base=m[1];n=m[2]?+m[2]:(m[3]?m[3].length:0);
  if(base==='HEAD')id=hid();else if(GP.branches[base])id=GP.branches[base];else if(/^origin\//.test(base)&&GP.track[base.slice(7)])id=GP.track[base.slice(7)];
  else{var ks=Object.keys(GP.commits).filter(function(k){return k.indexOf(base)===0});if(ks.length===1)id=ks[0]}
  for(i=0;i<n&&id;i++)id=GP.commits[id].p[0];return id||null;
}
function setTree(t){var old=cp(GP.idx),k;for(k in hTree())old[k]=1;for(k in old)if(!(k in t))delete GP.files[k];for(k in t)GP.files[k]=t[k];GP.idx=cp(t)}
function gpDirty(){var ht=hTree(),k;for(k in GP.idx)if(GP.idx[k]!==ht[k])return true;for(k in ht)if(GP.idx[k]===undefined)return true;for(k in GP.idx)if(GP.files[k]!==GP.idx[k])return true;return false}
function gpMsgStatus(){
  var ht=hTree(),o=[],k,st=[],un=[],ut=[],mm=GP.merging;
  o.push(GP.det?'HEAD detached at '+GP.det:'On branch '+GP.head);
  var tr=!GP.det&&GP.track[GP.head];
  if(tr){var a=anc(hid()),b=anc(tr),ah=Object.keys(a).filter(function(x){return !b[x]}).length,bh=Object.keys(b).filter(function(x){return !a[x]}).length;
    if(!ah&&!bh)o.push("Your branch is up to date with 'origin/"+GP.head+"'.");
    else if(ah&&!bh)o.push("Your branch is ahead of 'origin/"+GP.head+"' by "+ah+" commit"+(ah>1?'s':'')+'.\n  (use "git push" to publish your local commits)');
    else if(bh&&!ah)o.push("Your branch is behind 'origin/"+GP.head+"' by "+bh+" commit"+(bh>1?'s':'')+', and can be fast-forwarded.\n  (use "git pull" to update your local branch)');
    else o.push("Your branch and 'origin/"+GP.head+"' have diverged.")}
  for(k in GP.idx){if(ht[k]===undefined)st.push('new file:   '+k);else if(ht[k]!==GP.idx[k])st.push('modified:   '+k)}
  for(k in ht)if(GP.idx[k]===undefined)st.push('deleted:    '+k);
  for(k in GP.idx){if(GP.files[k]===undefined)un.push('deleted:    '+k);else if(GP.files[k]!==GP.idx[k])un.push('modified:   '+k)}
  for(k in GP.files)if(GP.idx[k]===undefined)ut.push(k);
  if(mm&&mm.conf.length){o.push('You have unmerged paths.\n  (fix conflicts and run "git commit")\n\nUnmerged paths:\n'+mm.conf.map(function(f){return '\tboth modified:   '+f}).join('\n'));}
  else if(mm)o.push('All conflicts fixed but you are still merging.\n  (use "git commit" to conclude merge)');
  if(st.length)o.push('Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n'+st.map(function(x){return '\t'+x}).join('\n'));
  if(un.length)o.push('Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n'+un.map(function(x){return '\t'+x}).join('\n'));
  if(ut.length)o.push('Untracked files:\n  (use "git add <file>..." to include in what will be committed)\n'+ut.map(function(x){return '\t'+x}).join('\n'));
  if(!st.length&&!un.length&&!ut.length&&!mm)o.push('nothing to commit, working tree clean');
  else if(!st.length&&(un.length||ut.length)&&!mm)o.push(un.length?'no changes added to commit (use "git add" and/or "git commit -a")':'nothing added to commit but untracked files present (use "git add" to track)');
  return o.join('\n\n').replace(/\n\n(Your branch|  \()/g,'\n$1');
}
function gpMerge(other,label){
  var me=hid();if(!other)return ['error',"merge: "+label+' - not something we can merge'];
  var A=anc(me),B=anc(other);
  if(A[other])return ['ok','Already up to date.'];
  if(B[me]){ if(gpDirty())return ['error','error: Your local changes would be overwritten by merge. Commit or stash them first.'];
    var o=me.slice(0,7)+'..'+other.slice(0,7);if(GP.det)GP.det=other;else GP.branches[GP.head]=other;setTree(GP.commits[other].t);GP.did.merge=1;return ['ok','Updating '+o+'\nFast-forward\n (branch pointer moved, no new commit needed)']}
  if(gpDirty())return ['error','error: Your local changes would be overwritten by merge. Commit or stash them first.'];
  var base=null,bn=-1,x;for(x in A)if(B[x]&&GP.commits[x].n>bn){bn=GP.commits[x].n;base=x}
  var bt=GP.commits[base].t,ot=hTree(),tt=GP.commits[other].t,res={},conf=[],names={},k;
  [bt,ot,tt].forEach(function(t){for(k in t)names[k]=1});
  for(k in names){var b=bt[k],o2=ot[k],t2=tt[k],v;
    if(o2===t2)v=o2;else if(o2===b)v=t2;else if(t2===b)v=o2;else{conf.push(k);v='<<<<<<< HEAD\n'+o2+'\n=======\n'+t2+'\n>>>>>>> '+label}
    if(v!==undefined)res[k]=v}
  var msg="Merge branch '"+label+"'";
  if(conf.length){
    var idxn=cp(res);conf.forEach(function(f){idxn[f]=ot[f]});for(k in idxn)if(idxn[k]===undefined)delete idxn[k];
    for(k in res)GP.files[k]=res[k];GP.idx=idxn;GP.merging={other:other,msg:msg,conf:conf};
    return ['error',conf.map(function(f){return 'CONFLICT (content): Merge conflict in '+f}).join('\n')+'\nAutomatic merge failed; fix conflicts and then commit the result.\n(Open the file with cat '+conf[0]+', replace it with the text you want using echo "..." > '+conf[0]+', then git add and git commit.)']}
  var id=hId();GP.commits[id]={p:[me,other],m:msg,t:res,n:++GP.seq,u:1};
  if(GP.det)GP.det=id;else GP.branches[GP.head]=id;setTree(res);GP.did.merge=1;
  return ['ok',"Merge made by the 'ort' strategy.\n[merge commit "+id+'] '+msg];
}
function gpDiffOut(a,b,names){
  var o=[],k;for(k in names){if(a[k]===b[k])continue;
    o.push('diff --git a/'+k+' b/'+k+(a[k]===undefined?'\nnew file':'')+(b[k]===undefined?'\ndeleted file':'')+'\n--- a/'+k+'\n+++ b/'+k+'\n@@ changes @@');
    if(a[k]!==undefined)a[k].split('\n').forEach(function(l){o.push('-'+l)});
    if(b[k]!==undefined)b[k].split('\n').forEach(function(l){o.push('+'+l)})}
  return o.join('\n');
}
function gpRefs(){var m={},id;Object.keys(GP.branches).forEach(function(b){(m[GP.branches[b]]=m[GP.branches[b]]||[]).push(b)});
  Object.keys(GP.track).forEach(function(b){(m[GP.track[b]]=m[GP.track[b]]||[]).push('origin/'+b)});
  id=hid();var h=m[id]||(m[id]=[]);var cur=GP.det?'HEAD':'HEAD -> '+GP.head;
  var i=h.indexOf(GP.head);if(!GP.det&&i>-1)h.splice(i,1);h.unshift(cur);return m}
function gpLogOut(args){
  var one=args.indexOf('--oneline')>-1,nI=args.indexOf('-n'),lim=nI>-1?+args[nI+1]:999,refs=gpRefs(),a=anc(hid()),ids=Object.keys(a).sort(function(x,y){return GP.commits[y].n-GP.commits[x].n}).slice(0,lim);
  return ids.map(function(id){var c=GP.commits[id],dec=refs[id]?' ('+refs[id].join(', ')+')':'';
    if(one)return id+dec+' '+c.m;
    return 'commit '+id+dec+(c.p.length>1?'\nMerge: '+c.p.join(' '):'')+'\nAuthor: '+(c.who||'You <you@example.com>')+'\nDate:   Sun Nov 22 '+('0'+(9+Math.floor(c.n/60))).slice(-2)+':'+('0'+(c.n%60)).slice(-2)+':00 2026 +0530\n\n    '+c.m}).join(one?'\n':'\n\n');
}
function gpCommit(args){
  var mi=args.indexOf('-m'),am=args.indexOf('-am'),all=args.indexOf('-a')>-1||am>-1,msg=null,k;
  if(am>-1)msg=args[am+1];else if(mi>-1)msg=args[mi+1];
  if(all)for(k in GP.idx){if(GP.files[k]===undefined)delete GP.idx[k];else GP.idx[k]=GP.files[k]}
  var ht=hTree(),diff=false;for(k in GP.idx)if(GP.idx[k]!==ht[k])diff=true;for(k in ht)if(GP.idx[k]===undefined)diff=true;
  if(GP.merging){
    if(GP.merging.conf.length)return ['error','error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use "git add <file>" to mark them resolved.'];
    var idm=hId();GP.commits[idm]={p:[hid(),GP.merging.other],m:msg||GP.merging.msg,t:cp(GP.idx),n:++GP.seq,u:1};
    if(GP.det)GP.det=idm;else GP.branches[GP.head]=idm;GP.merging=null;GP.did.merge=1;GP.did.commit=1;return ['ok','['+(GP.det?'detached HEAD':GP.head)+' '+idm+'] '+GP.commits[idm].m];
  }
  if(!diff){var un=false;for(k in GP.idx)if(GP.files[k]!==GP.idx[k])un=true;for(k in GP.files)if(GP.idx[k]===undefined)un=true;
    return ['error','On branch '+GP.head+'\n'+(un?'no changes added to commit (use "git add" and/or "git commit -a")':'nothing to commit, working tree clean')]}
  if(!msg)return ['error','Aborting commit due to empty commit message. Use: git commit -m "your message"'];
  var id=hId(),c={p:[hid()],m:msg,t:cp(GP.idx),n:++GP.seq,u:1};GP.commits[id]=c;
  if(GP.det)GP.det=id;else GP.branches[GP.head]=id;GP.did.commit=1;
  var ch=0;for(k in c.t)if(ht[k]!==c.t[k])ch++;for(k in ht)if(c.t[k]===undefined)ch++;
  return ['ok','['+(GP.det?'detached HEAD':GP.head)+' '+id+'] '+msg+'\n '+ch+' file'+(ch>1?'s':'')+' changed'];
}
function gpSwitch(args,create){
  var name=args.filter(function(a){return a[0]!=='-'})[0],c=create||args.indexOf('-b')>-1||args.indexOf('-c')>-1||args.indexOf('-B')>-1;
  if(!name)return ['error','error: missing branch name'];
  if(c){if(GP.branches[name])return ['error',"fatal: a branch named '"+name+"' already exists"];GP.branches[name]=hid();GP.head=name;GP.det=null;GP.did.branch=1;return ['ok',"Switched to a new branch '"+name+"'"]}
  var tid=GP.branches[name]||(GP.track[name.replace(/^origin\//,'')]&&/^origin\//.test(name)?GP.track[name.slice(7)]:null),isB=!!GP.branches[name];
  if(!tid){var r=resolve(name);if(r){tid=r}}
  if(!tid)return ['error',"error: pathspec '"+name+"' did not match any known branch"];
  if(GP.merging)return ['error','error: you need to resolve your current merge first'];
  var tt=GP.commits[tid].t;
  if(gpDirty()&&!hEq(tt,hTree()))return ['error','error: Your local changes would be overwritten by checkout.\nCommit your changes or stash them before you switch branches.'];
  if(!gpDirty())setTree(tt);
  if(isB){GP.head=name;GP.det=null;return ['ok',"Switched to branch '"+name+"'"]}
  GP.det=tid;return ['ok','Note: switching to \''+name+"'.\nYou are in 'detached HEAD' state. Create a branch with: git switch -c <name>"];
}
function gpGit(a){
  var c=a[0],args=a.slice(1),k,r;
  switch(c){
  case 'init':return ['ok','Reinitialized existing Git repository in /home/you/project/.git/'];
  case 'status':return ['o',gpMsgStatus()];
  case 'add':{
    var ps=args.filter(function(x){return x[0]!=='-'});if(!ps.length)return ['error','Nothing specified, nothing added.'];
    if(ps[0]==='.'||ps[0]==='-A'||args.indexOf('-A')>-1){for(k in GP.files)GP.idx[k]=GP.files[k];for(k in GP.idx)if(GP.files[k]===undefined)delete GP.idx[k]}
    else for(var i=0;i<ps.length;i++){var f=ps[i];if(GP.files[f]!==undefined)GP.idx[f]=GP.files[f];else if(GP.idx[f]!==undefined)delete GP.idx[f];else return ['error',"fatal: pathspec '"+f+"' did not match any files"]}
    if(GP.merging)GP.merging.conf=GP.merging.conf.filter(function(f){return GP.idx[f]!==GP.commits[hid()].t[f]||GP.files[f].indexOf('<<<<<<<')<0&&true}).filter(function(f){return GP.files[f]!==undefined&&GP.files[f].indexOf('<<<<<<<')>-1});
    return ['o',''];}
  case 'commit':return gpCommit(args);
  case 'log':return ['o',gpLogOut(args)];
  case 'diff':{var staged=args.indexOf('--staged')>-1||args.indexOf('--cached')>-1,names={};
    if(staged){for(k in GP.idx)names[k]=1;for(k in hTree())names[k]=1;return ['o',gpDiffOut(hTree(),GP.idx,names)]}
    for(k in GP.idx)names[k]=1;var cur={};for(k in GP.idx)cur[k]=GP.files[k];return ['o',gpDiffOut(GP.idx,cur,names)];}
  case 'branch':{
    var del=args.indexOf('-d')>-1||args.indexOf('-D')>-1,force=args.indexOf('-D')>-1,nm=args.filter(function(x){return x[0]!=='-'});
    if(del){var b=nm[0];if(!GP.branches[b])return ['error',"error: branch '"+b+"' not found"];if(b===GP.head)return ['error',"error: cannot delete branch '"+b+"' used by worktree"];
      if(!force&&!anc(hid())[GP.branches[b]])return ['error',"error: the branch '"+b+"' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D "+b+"'."];
      var old=GP.branches[b];delete GP.branches[b];return ['ok',"Deleted branch "+b+" (was "+old+")."]}
    if(nm.length){if(GP.branches[nm[0]])return ['error',"fatal: a branch named '"+nm[0]+"' already exists"];GP.branches[nm[0]]=hid();GP.did.branch=1;return ['o','']}
    return ['o',Object.keys(GP.branches).sort().map(function(b){return (b===GP.head&&!GP.det?'* ':'  ')+b}).join('\n')];}
  case 'switch':return gpSwitch(args,false);
  case 'checkout':{var dd=args.indexOf('--');if(dd>-1||(args.length&&GP.files[args[0]]!==undefined&&!GP.branches[args[0]])){var f2=args[dd>-1?dd+1:0];if(GP.idx[f2]===undefined)return ['error',"error: pathspec '"+f2+"' did not match any file(s) known to git"];GP.files[f2]=GP.idx[f2];return ['o','Updated 1 path from the index']}return gpSwitch(args,false)}
  case 'merge':{var o=args.filter(function(x){return x[0]!=='-'})[0];if(!o)return ['error','fatal: specify a branch to merge'];if(GP.merging)return ['error','fatal: You have not concluded your merge (MERGE_HEAD exists).'];
    var id=GP.branches[o]||(/^origin\//.test(o)?GP.track[o.slice(7)]:null);if(!id)return ['error',o+' - not something we can merge'];return gpMerge(id,o)}
  case 'restore':{var stg=args.indexOf('--staged')>-1,fs=args.filter(function(x){return x[0]!=='-'});if(!fs.length)return ['error','fatal: you must specify path(s) to restore'];
    for(var j=0;j<fs.length;j++){var f3=fs[j];if(stg){var hv=hTree()[f3];if(hv===undefined)delete GP.idx[f3];else GP.idx[f3]=hv}else{if(GP.idx[f3]===undefined)return ['error',"error: pathspec '"+f3+"' did not match any file(s) known to git"];GP.files[f3]=GP.idx[f3]}}
    return ['o',''];}
  case 'rm':{var f4=args.filter(function(x){return x[0]!=='-'})[0];if(!f4||GP.idx[f4]===undefined)return ['error',"fatal: pathspec '"+f4+"' did not match any files"];delete GP.files[f4];delete GP.idx[f4];return ['o',"rm '"+f4+"'"]}
  case 'reset':{
    var mode=args.indexOf('--hard')>-1?'hard':(args.indexOf('--soft')>-1?'soft':'mixed'),tg=args.filter(function(x){return x[0]!=='-'})[0];
    if(tg&&!resolve(tg)&&GP.idx[tg]!==undefined||(tg&&hTree()[tg]!==undefined&&!resolve(tg))){var hv2=hTree()[tg];if(hv2===undefined)delete GP.idx[tg];else GP.idx[tg]=hv2;return ['o','Unstaged changes after reset:']}
    var id2=tg?resolve(tg):hid();if(!id2)return ['error',"fatal: ambiguous argument '"+tg+"': unknown revision"];
    if(mode==='hard'&&gpDirty()&&id2===hid()){}
    if(GP.det)GP.det=id2;else GP.branches[GP.head]=id2;
    if(mode!=='soft')GP.idx=cp(GP.commits[id2].t);
    if(mode==='hard'){var keep={};for(k in GP.files)if(GP.idx[k]===undefined&&hTreeHas(k)===false)keep[k]=GP.files[k];var nf=cp(GP.idx);for(k in keep)nf[k]=keep[k];GP.files=nf}
    GP.did.reset=1;return ['ok','HEAD is now at '+id2+' '+GP.commits[id2].m];}
  case 'revert':{
    if(gpDirty())return ['error','error: your local changes would be overwritten by revert. Commit or stash them first.'];
    var tgt=resolve(args.filter(function(x){return x[0]!=='-'})[0]||'HEAD'),cm=tgt&&GP.commits[tgt];
    if(!cm)return ['error','fatal: bad revision'];if(cm.p.length!==1)return ['error','error: commit '+tgt+' is a '+(cm.p.length?'merge commit':'root commit')+', so it cannot be reverted directly here.\nTip: run git log --oneline and revert a regular commit, for example git revert HEAD~1'];
    var pt=GP.commits[cm.p[0]].t,nt=cp(hTree()),nm2={};for(k in cm.t)nm2[k]=1;for(k in pt)nm2[k]=1;
    for(k in nm2)if(cm.t[k]!==pt[k]){if(pt[k]===undefined)delete nt[k];else nt[k]=pt[k]}
    var rid=hId();GP.commits[rid]={p:[hid()],m:'Revert "'+cm.m+'"',t:nt,n:++GP.seq,u:1};if(GP.det)GP.det=rid;else GP.branches[GP.head]=rid;setTree(nt);GP.did.revert=1;
    return ['ok','['+(GP.det?'detached HEAD':GP.head)+' '+rid+'] Revert "'+cm.m+'"'];}
  case 'stash':{
    var sub=args[0]||'push';
    if(sub==='list')return ['o',GP.stash.map(function(s,i){return 'stash@{'+i+'}: WIP on '+s.b+': '+s.h}).join('\n')];
    if(sub==='pop'||sub==='apply'){if(!GP.stash.length)return ['error','No stash entries found.'];var s=GP.stash[0];for(k in s.f)GP.files[k]=s.f[k];if(sub==='pop'){GP.stash.shift();GP.did.pop=1}return ['ok','Applied stashed changes.\n'+(sub==='pop'?'Dropped stash entry.':'')]}
    if(!gpDirty()){return ['error','No local changes to save']}
    var sf={},tt2=hTree();for(k in GP.idx)if(GP.files[k]!==tt2[k]&&GP.files[k]!==undefined)sf[k]=GP.files[k];for(k in GP.idx)if(GP.idx[k]!==tt2[k]&&sf[k]===undefined)sf[k]=GP.idx[k];
    GP.stash.unshift({f:sf,b:GP.det?'(detached)':GP.head,h:hid()+' '+GP.commits[hid()].m});setTree(tt2);GP.did.stash=1;
    return ['ok','Saved working directory and index state WIP on '+GP.head+': '+hid()+' '+GP.commits[hid()].m];}
  case 'remote':return ['o',args.indexOf('-v')>-1?'origin\thttps://github.com/you/project.git (fetch)\norigin\thttps://github.com/you/project.git (push)':'origin'];
  case 'fetch':{var out=[],b2;for(b2 in GP.remote){if(GP.track[b2]!==GP.remote[b2]){out.push('   '+(GP.track[b2]||'(new)').slice(0,7)+'..'+GP.remote[b2].slice(0,7)+'  '+b2+' -> origin/'+b2);GP.track[b2]=GP.remote[b2]}}
    return ['o',out.length?'From github.com:you/project\n'+out.join('\n'):''];}
  case 'pull':{
    var br=GP.head,fo=[];if(GP.det)return ['error','You are not currently on a branch.'];
    if(!GP.remote[br])return ['error','There is no tracking information for the current branch.\nPush it first: git push -u origin '+br];
    if(GP.track[br]!==GP.remote[br]){fo.push('From github.com:you/project\n   '+(GP.track[br]||'').slice(0,7)+'..'+GP.remote[br].slice(0,7)+'  '+br+' -> origin/'+br);GP.track[br]=GP.remote[br]}
    var mr=gpMerge(GP.track[br],br);GP.did.pull=1;return [mr[0],(fo.concat([mr[1]])).join('\n')];}
  case 'push':{
    var pa=args.filter(function(x){return x[0]!=='-'}),pb=pa[1]||GP.head;if(GP.det&&!pa[1])return ['error','fatal: You are not currently on a branch.'];
    var L=GP.branches[pb];if(!L)return ['error',"error: src refspec "+pb+" does not match any"];
    var R=GP.remote[pb];
    if(R===L)return ['o','Everything up-to-date'];
    if(R&&!anc(L)[R])return ['error',' ! [rejected]        '+pb+' -> '+pb+' (fetch first)\nerror: failed to push some refs to \'github.com:you/project.git\'\nhint: Updates were rejected because the remote contains work that you do not have\nhint: locally. Integrate the remote changes (git pull) before pushing again.'];
    GP.remote[pb]=L;GP.track[pb]=L;GP.did.push=1;
    return ['ok','To github.com:you/project.git\n '+(R?R.slice(0,7)+'..'+L.slice(0,7):'* [new branch]')+'  '+pb+' -> '+pb];}
  case 'config':return ['o',''];
  case 'help':return ['o','Use the cheat sheet on the right, or type help.'];
  default:return ['error',"git: '"+(c||'')+"' is not supported in this practice terminal. Type help to see what works."];
  }
}
function hTreeHas(k){return hTree()[k]!==undefined}
function gpTok(s){return (s.match(/"[^"]*"|'[^']*'|>>|>|\S+/g)||[]).map(function(t){return /^["'].*["']$/.test(t)?t.slice(1,-1):t})}
function gpRun(line){
  var out=[],t=gpTok(line),c=t[0];
  if(!c)return out;
  var r;
  if(c==='git'){r=gpGit(t.slice(1))}
  else if(c==='ls')r=['o',Object.keys(GP.files).sort().join('  ')];
  else if(c==='pwd')r=['o','/home/you/project'];
  else if(c==='cat'){var f=t[1];r=f&&GP.files[f]!==undefined?['o',GP.files[f]]:['error','cat: '+(f||'')+': No such file or directory']}
  else if(c==='touch'){if(!t[1])r=['error','touch: missing file operand'];else{if(GP.files[t[1]]===undefined)GP.files[t[1]]='';r=['o','']}}
  else if(c==='rm'){var f5=t[1];if(f5&&GP.files[f5]!==undefined){delete GP.files[f5];r=['o','']}else r=['error','rm: cannot remove \''+(f5||'')+'\': No such file or directory']}
  else if(c==='echo'){var gi=t.indexOf('>>'),go=t.indexOf('>'),ix=gi>-1?gi:go;
    if(ix<0)r=['o',t.slice(1).join(' ')];
    else{var txt=t.slice(1,ix).join(' '),fn=t[ix+1];if(!fn)r=['error','bash: syntax error near unexpected token `newline\''];
      else{GP.files[fn]=(gi>-1&&GP.files[fn]?GP.files[fn]+'\n':'')+txt;r=['o','']}}}
  else if(c==='clear'){GP.log=[];return null}
  else if(c==='help'){r=['o','Supported: ls, cat, touch, echo "x" > file, rm, clear, and these git commands: status, add, commit, log, diff, branch, switch, checkout, merge, restore, reset, revert, stash, remote, fetch, pull, push.']}
  else r=['error','bash: '+c+': command not found'];
  if(r&&r[1]!=='')out.push({k:r[0]==='error'?'e':(r[0]==='ok'?'g':'o'),t:r[1]});
  return out;
}
function gpExec(line){
  line=line.trim();if(!line)return;
  GP.log.push({k:'c',t:line,p:gpPrompt()});
  gpHist.push(line);gpHi=gpHist.length;
  var o=gpRun(line);if(o)o.forEach(function(x){GP.log.push(x)});
  gpMissions(true);gpSave();gpRender();
}
function gpPrompt(){return 'you@opslens:~/project'+(GP.det?' (detached)':' ('+GP.head+')')+'$'}
function gpMDone(i){var d=GP.did,k=GPM[i][0];
  if(k==='commit')return !!d.commit&&Object.keys(GP.commits).some(function(x){return GP.commits[x].u});
  if(k==='branch')return !!d.branch&&Object.keys(GP.branches).some(function(b){if(b==='main')return false;var A=anc(GP.branches[b]),M=anc(GP.branches.main||hid());return Object.keys(A).some(function(x){return !M[x]&&GP.commits[x].u})||Object.keys(M).some(function(x){return A[x]&&GP.commits[x].u&&b!=='main'})});
  if(k==='merge')return !!d.merge;if(k==='revert')return !!d.revert;if(k==='push')return !!d.push;if(k==='pop')return !!(d.stash&&d.pop);return false}
function gpMissions(announce){
  GP.mdone=GP.mdone||{};
  GPM.forEach(function(m,i){if(!GP.mdone[m[0]]&&gpMDone(i)){GP.mdone[m[0]]=1;if(announce)GP.log.push({k:'g',t:'✔ Mission complete: '+m[1]})}});
}
/* commit graph */
function gpGraph(){
  var ids=Object.keys(GP.commits),reach={},tips=[],b;
  for(b in GP.branches)tips.push(GP.branches[b]);for(b in GP.track)tips.push(GP.track[b]);for(b in GP.remote)tips.push(GP.remote[b]);if(GP.det)tips.push(GP.det);
  tips.forEach(function(t){var a=anc(t),k;for(k in a)reach[k]=1});
  var list=ids.filter(function(i){return reach[i]}).sort(function(a,b){return GP.commits[a].n-GP.commits[b].n}),gen={},lane={},ln=0;
  list.forEach(function(id){var p=GP.commits[id].p;gen[id]=p.length?Math.max.apply(null,p.map(function(x){return gen[x]}))+1:0});
  var order=['main'].concat(Object.keys(GP.branches).filter(function(x){return x!=='main'}));
  order.forEach(function(br){if(!GP.branches[br])return;var cur=GP.branches[br],ch=[];
    while(cur&&lane[cur]===undefined){ch.push(cur);cur=GP.commits[cur].p[0]}
    var l=(cur===undefined||cur===null||ch.length===0)?0:null;
    if(ch.length){var used=Object.keys(lane).map(function(k){return lane[k]});var nl=br==='main'?0:1;while(br!=='main'&&used.indexOf(nl)>-1&&nl<5&&!sharedOk(ch,nl))nl++;ch.forEach(function(x){lane[x]=nl})}});
  function sharedOk(){return false}
  list.forEach(function(id){if(lane[id]===undefined){var p=GP.commits[id].p[0];lane[id]=p&&lane[p]!==undefined?lane[p]:1}});
  var maxG=0,maxL=0;list.forEach(function(id){maxG=Math.max(maxG,gen[id]);maxL=Math.max(maxL,lane[id])});
  var X=function(id){return 56+gen[id]*118},Y=function(id){return 84+lane[id]*100},s='';
  list.forEach(function(id){GP.commits[id].p.forEach(function(p){if(gen[p]===undefined)return;var x1=X(p),y1=Y(p),x2=X(id),y2=Y(id);
    s+='<path d="M'+x1+','+y1+' C'+(x1+36)+','+y1+' '+(x2-36)+','+y2+' '+x2+','+y2+'" fill="none" stroke="#ff8a1f" stroke-opacity=".7" stroke-width="2.4"/>'})});
  var refs=gpRefs();
  list.forEach(function(id){var c=GP.commits[id],x=X(id),y=Y(id),isH=id===hid(),merge=c.p.length>1;
    s+='<circle cx="'+x+'" cy="'+y+'" r="'+(isH?11:9)+'" fill="'+(merge?'#c58cff':(c.who?'#3f8fd0':ISOK.node))+'" stroke="'+(isH?'#f2c744':'#ff8a1f')+'" stroke-width="'+(isH?3:2)+'" style="filter:drop-shadow(0 0 6px '+(isH?'#f2c744':'#ff8a1f')+')"/>'+
      T(x,y+28,id.slice(0,7),'lbl xs','middle')+T(x,y+43,c.m.length>15?c.m.slice(0,14)+'…':c.m,'lbl sm','middle');
    (refs[id]||[]).forEach(function(r,i){var rem=r.indexOf('origin/')===0,w=Math.max(40,r.length*7.4+14),yy=y-26-i*22;
      s+='<rect x="'+(x-w/2)+'" y="'+(yy-14)+'" width="'+w+'" height="19" rx="9" fill="'+(r.indexOf('HEAD')===0?'rgba(242,199,68,.18)':'rgba(8,18,26,.9)')+'" stroke="'+(r.indexOf('HEAD')===0?'#f2c744':'#ff8a1f')+'"'+(rem?' stroke-dasharray="4 3"':'')+'/>'+T(x,yy,r,'lbl sm','middle')});
  });
  var W=Math.max(640,X(list[list.length-1]||0)+80),H=Math.max(200,84+maxL*100+70);
  return '<svg viewBox="0 0 '+Math.max(W,56+maxG*118+80)+' '+H+'" style="min-width:'+Math.max(W,56+maxG*118+80)+'px" width="100%" role="img" aria-label="Commit graph">'+s+'</svg>';
}
function gpAreas(){
  var ht=hTree(),wk=[],st=[],k;
  for(k in GP.files){var cls=GP.idx[k]===undefined?'un':(GP.idx[k]!==GP.files[k]?'mod':'');wk.push('<li class="'+cls+'">'+esc(k)+(cls==='un'?' <em>untracked</em>':(cls==='mod'?' <em>modified</em>':''))+'</li>')}
  for(k in GP.idx)if(ht[k]!==GP.idx[k])st.push('<li class="stg">'+esc(k)+(ht[k]===undefined?' <em>new</em>':' <em>changed</em>')+'</li>');
  for(k in ht)if(GP.idx[k]===undefined)st.push('<li class="stg">'+esc(k)+' <em>deleted</em></li>');
  var hc=GP.commits[hid()];
  return '<div class="gpa"><h4>Working directory</h4><ul>'+(wk.join('')||'<li class="emp">empty</li>')+'</ul></div><div class="gpa"><h4>Staging area</h4><ul>'+(st.join('')||'<li class="emp">nothing staged</li>')+'</ul></div><div class="gpa"><h4>Repository</h4><ul><li>'+(GP.det?'detached':esc(GP.head))+' · '+Object.keys(anc(hid())).length+' commits</li><li class="emp">'+esc(hid().slice(0,7))+' '+esc(hc.m)+'</li></ul></div>';
}
function gpRender(){
  if(!gpBuilt)return;
  var o=$('#gpout');
  o.innerHTML=GP.log.map(function(l){return l.k==='c'?'<div class="gln c"><span class="pp">'+esc(l.p||'$')+'</span> '+esc(l.t)+'</div>':'<div class="gln '+l.k+'">'+esc(l.t)+'</div>'}).join('');
  o.scrollTop=o.scrollHeight;
  $('#gpp').textContent=gpPrompt();
  $('#gpgraph').innerHTML=gpGraph();$('#gpareas').innerHTML=gpAreas();
  var nd=GPM.filter(function(m){return GP.mdone&&GP.mdone[m[0]]}).length,nxt=true;
  $('#gpmis').innerHTML='<h3 class="ph">Missions <small>'+nd+' of '+GPM.length+' done</small></h3><ol class="gpm">'+GPM.map(function(m){var d=GP.mdone&&GP.mdone[m[0]],cur=!d&&nxt;if(!d)nxt=false;return '<li class="'+(d?'done':(cur?'now':''))+'"><span class="lck">'+(d?'✓':'○')+'</span><span><b>'+esc(m[1])+'</b><small>'+esc(m[2])+(cur?'<br><code>'+esc(m[3])+'</code>':'')+'</small></span></li>'}).join('')+'</ol>';
}
function gpBuild(){
  gpBuilt=true;
  $('#gp').innerHTML='<div class="labhead"><h2>Git Practice</h2><p>A safe practice repo. Type real git commands and watch the three areas and the commit graph change. Nothing here touches your real repositories.</p></div>'+
   '<div class="gpgrid"><div class="gpleft"><div class="gpterm"><div class="gpout" id="gpout" role="log" aria-live="polite" aria-label="Terminal output"></div><div class="gpin"><span id="gpp" class="pp"></span><input id="gpin" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Type a command"></div></div>'+
   '<div class="gpq" role="group" aria-label="Quick commands">'+['git status','git add .','git log --oneline','git branch','ls','git diff'].map(function(q){return '<button class="btn lpb" type="button" data-gpq="'+esc(q)+'">'+esc(q)+'</button>'}).join('')+'<button class="btn lpb" type="button" data-gpteam="1">Simulate a teammate push</button></div>'+
   '<div class="gpareas" id="gpareas"></div><div class="panel"><h3 class="ph">Commit graph <small>(HEAD is yellow, dashed = origin)</small></h3><div class="gpg" id="gpgraph"></div></div></div>'+
   '<div class="gpright"><section class="panel" id="gpmis"></section><section class="panel"><h3 class="ph">Cheat sheet</h3><div class="tw"><table class="tb"><thead><tr><th>Command</th><th>What it does</th></tr></thead><tbody>'+GPHELP.map(function(h){return '<tr><td><code>'+esc(h[0])+'</code></td><td>'+esc(h[1])+'</td></tr>'}).join('')+'</tbody></table></div></section>'+
   '<div class="lrow"><button class="btn" type="button" id="gpreset">Reset practice repo</button></div></div></div>';
}
function showGP(fromH){
  clearTimers();hideGame();gpOn=true;$('.app').classList.add('gp');
  if(!GP)GP=gpLoad();if(!gpBuilt)gpBuild();
  renderStatic();gpMissions(false);gpRender();
  if(!fromH){try{history.replaceState(null,'','#gitlab')}catch(e){location.hash='gitlab'}}
  try{window.scrollTo(0,0)}catch(e){}
}
function hideGP(){if(!gpOn)return;gpOn=false;$('.app').classList.remove('gp')}
document.addEventListener('click',function(e){
  if(!gpOn)return;var t=e.target.closest?e.target.closest('button'):null;if(!t){if(e.target.closest&&e.target.closest('.gpterm')){var i=$('#gpin');if(i)i.focus()}return}
  if(t.dataset.gpq){gpExec(t.dataset.gpq);return}
  if(t.dataset.gpteam){
    var rm=GP.remote.main;if(!rm){return}
    var id=hId(),tt=cp(GP.commits[rm].t);tt['team.txt']='Added by a teammate';GP.commits[id]={p:[rm],m:'Add team notes',t:tt,n:++GP.seq,u:0,who:'Sam <sam@example.com>'};GP.remote.main=id;
    GP.log.push({k:'g',t:'Sam pushed a commit to origin/main. Your copy does not know yet. Run git fetch, or git pull.'});gpSave();gpRender();return}
  if(t.id==='gpreset'){if(gpClr){GP=gpFresh();gpClr=0;t.textContent='Reset practice repo';gpSave();gpRender()}else{gpClr=1;t.textContent='Click again to confirm';setTimeout(function(){gpClr=0;t.textContent='Reset practice repo'},3000)}}
});
document.addEventListener('keydown',function(e){
  if(!gpOn||e.target.id!=='gpin')return;var i=e.target;
  if(e.key==='Enter'){var v=i.value;i.value='';gpExec(v);e.preventDefault()}
  else if(e.key==='ArrowUp'){if(gpHi>0)gpHi--;i.value=gpHist[gpHi]||'';e.preventDefault()}
  else if(e.key==='ArrowDown'){if(gpHi<gpHist.length)gpHi++;i.value=gpHist[gpHi]||'';e.preventDefault()}
});

function nav(h){if(location.hash===h)fromHash();else location.hash=h}
/* ---------- landing page, quick checks, completion, notes, tour ---------- */
var hmOn=false;(function(){var t=lsGet("theme",null);if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');isoTheme()}})();var qzOn=false,QZ=null,tourI=0;
var QUIZ={
iam:[["What does least privilege mean?",["Give everyone admin","Give only the access that is needed","Share one password","Disable logging"],1,"Grant the minimum permissions required, so a compromised account can do little damage."],["No policy allows an action. What happens?",["It is allowed","It is denied","It is delayed","It asks for a password"],1,"Access is denied by default unless a policy explicitly allows it."],["What does MFA add?",["A second proof of identity","More storage","Faster logins","A bigger policy"],0,"A code or key on top of the password, so a stolen password alone is not enough."]],
linux:[["What does permission mode 640 mean?",["Owner rw, group r, others none","Everyone can write","Owner only","Group rw, others r"],0,"6 = rw for the owner, 4 = r for the group, 0 = nothing for others."],["Which command changes a file's permissions?",["chmod","ls","grep","ps"],0,"chmod changes the mode. chown changes the owner."],["Where does Linux keep most logs?",["/var/log","/bin","/tmp/new","/home/bin"],0,"/var/log holds system and service logs, plus the systemd journal."]],
terraform:[["Which command shows what will change without changing anything?",["terraform plan","terraform apply","terraform init","terraform fmt"],0,"plan previews the add, change and destroy counts. Nothing is touched."],["What does the state file record?",["Your passwords","Which real resources Terraform created","The Git history","Server logs"],1,"State maps your code to the real resources it manages."],["Someone edits a resource by hand in the console. What reveals it?",["Nothing","terraform plan shows drift","terraform init","The next Git commit"],1,"Plan compares code, state and the real cloud, so drift appears as a change."]],
monitoring:[["Which alert is the better one?",["CPU above 70% for 1 minute","Error rate above 5% for 5 minutes","Disk reads increased","Memory changed"],1,"Alert on a symptom users feel and sustain it long enough to avoid noise."],["What do logs give you that metrics usually do not?",["Detail about individual events","A smaller bill","Faster pages","Encryption"],0,"Metrics show that something is wrong. Logs explain the specific event."],["Which is one of the four golden signals?",["Colour","Saturation","Font size","Branch name"],1,"Latency, traffic, errors and saturation."]],
network:[["Which service turns shop.example.com into an IP address?",["DNS","DHCP","TLS","SSH"],0,"DNS maps names to IP addresses."],["Which port does HTTPS use by default?",["22","80","443","53"],2,"HTTPS uses TCP port 443. 80 is HTTP and 22 is SSH."],["A firewall silently drops a connection. What does the user usually see?",["A 404 page","A timeout","A certificate warning","A redirect"],1,"Dropped packets get no reply, so the client waits and times out."]],
git:[["Where does git add put your changes?",["Working directory","Staging area","Remote repository","Stash"],1,"git add copies the chosen changes into the staging area, ready for the next commit."],["Which command shares your local commits with the remote?",["git commit","git push","git add","git merge"],1,"git push uploads your local commits to the remote, for example GitHub."],["You pushed a bad commit. What is the safest way to undo it without rewriting shared history?",["git reset --hard","git revert","Delete the .git folder","git stash"],1,"git revert adds a new commit that undoes the old one, so history that others have stays intact."]],
docker:[["Why does a Dockerfile copy package.json before the rest of the source code?",["So the dependency layer stays cached when only code changes","Because Docker needs files in alphabetical order","To make the image half the size","To skip the build step"],0,"Layers are cached top to bottom. Dependencies change rarely, so putting them first lets Docker reuse them."],["What is the difference between an image and a container?",["An image runs, a container is a file","An image is a read-only template, a container is a running instance of it","They are the same thing","A container is stored in a registry, an image is not"],1,"You build an image once and can start many containers from it."],["Data written inside a container is lost when the container is removed. How do you keep it?",["Use a volume","Use a bigger image","Run it as root","Add more layers"],0,"A volume lives outside the container, so the data survives restarts and removal."]],
kubernetes:[["You ask for 3 replicas and one pod crashes. What does Kubernetes do?",["Waits for you to fix it","Starts a replacement pod to get back to 3","Deletes the Deployment","Stops the other two pods"],1,"Kubernetes keeps comparing desired state with reality and fixes the difference."],["Which part compares the desired state with the actual state?",["The control plane","The container registry","A volume","The image"],0,"Controllers in the control plane run this loop all the time."],["Why spread replicas across different nodes?",["One failed machine does not take the whole app down","To use more disk space","To make each pod faster","So you do not need a load balancer"],0,"If every replica is on one node, losing that node loses the app."]],
ec2:[["A security group is best described as...",["A virtual firewall around the instance listing allowed traffic","A backup of the instance","A type of disk","A pricing plan"],0,"By default all inbound traffic is denied. You add rules for what is allowed."],["You need SSH access from home. Which rule is safest?",["Port 22 from 0.0.0.0/0","Port 22 only from your own IP","Open all ports","Turn the firewall off"],1,"Limit SSH to the smallest source that needs it."],["Which pricing option suits a steady workload that runs all year?",["On-Demand only","Savings Plans or Reserved capacity","Spot for a database","The free tier"],1,"Committing to steady use gives a discount. Spot can be interrupted, so it suits flexible jobs."]],
s3:[["Which setting makes sure a bucket cannot be made public by mistake?",["Block Public Access","Versioning","A lifecycle rule","A storage class"],0,"Block Public Access overrides bucket and object permissions that would expose data."],["How should an app on EC2 get access to a bucket?",["Hard-code access keys in the code","Attach an IAM role to the instance","Make the bucket public","Email the keys to the team"],1,"Roles give temporary credentials, so there are no long-lived keys to leak."],["What does versioning protect you from?",["Accidental overwrites and deletes","Network outages","High bills","Slow downloads"],0,"Old versions are kept, so you can restore an object that was changed or deleted."]],
scaling:[["What does a load balancer do?",["Spreads requests across healthy servers","Stores the database","Compiles code","Encrypts disks"],0,"It is the front door that shares traffic out and skips unhealthy servers."],["Horizontal scaling means...",["Adding more servers","Making one server bigger","Clearing caches","Moving to another region"],0,"Vertical scaling makes one machine bigger. Horizontal adds more machines."],["One of three servers fails its health check. The load balancer...",["Stops sending it traffic","Sends it all the traffic","Shuts down the others","Reboots the users"],0,"Health checks let it route around failures so users do not notice."]],
pipeline:[["A test fails in the pipeline. What should happen?",["The pipeline stops and nothing is deployed","It deploys anyway","It deletes the repository","It skips tests next time"],0,"A failed stage is a gate. Bad code must not move on."],["What is a canary release?",["Send a small share of traffic to the new version first","Deploy to every user at once","Deploy only at night","Roll back every release"],0,"If the canary looks healthy, the rollout continues. If not, you roll back with little impact."],["Why run CI on every commit?",["Catch problems early while the change is small","To use more servers","To avoid code review","To make builds slower"],0,"Small changes are easy to understand and fix."]]
};
function lessonDone(){return lsGet('done',{})}
/* ----- landing ----- */
/* ---------- clay hero scene ---------- */
function uiPanel(kind){
  var o='<rect x="1" y="1" width="98" height="58" rx="6" fill="#fff" stroke="#dfe3e8" stroke-width="1.2"/>',i;
  var og='#ff8a1f',gr='#d3d8de',ln='#e6e9ed';
  if(kind==='dash'){
    o+='<rect x="4" y="5" width="15" height="50" rx="4" fill="#f3f5f7"/>';
    for(i=0;i<4;i++)o+='<circle cx="11.5" cy="'+(12+i*8)+'" r="2.1" fill="'+gr+'"/>';
    o+='<rect x="6" y="38" width="11" height="5" rx="2.5" fill="'+og+'"/>';
    o+='<rect x="23" y="5" width="34" height="24" rx="4" fill="#f6f7f9"/><circle cx="40" cy="17" r="8" fill="none" stroke="'+gr+'" stroke-width="4"/><path d="M40 9a8 8 0 0 1 7.6 5.5" fill="none" stroke="'+og+'" stroke-width="4" stroke-linecap="round"/>';
    o+='<rect x="60" y="5" width="36" height="24" rx="4" fill="#f6f7f9"/><path d="M63 24l7-6 6 3 8-8 8 4" fill="none" stroke="'+og+'" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>';
    o+='<rect x="23" y="33" width="73" height="22" rx="4" fill="#f6f7f9"/>';
    [8,14,10,18,12,16].forEach(function(h,k){o+='<rect x="'+(30+k*10)+'" y="'+(51-h)+'" width="5" height="'+h+'" rx="1.4" fill="'+(k%2?og:gr)+'"/>'});
  }else if(kind==='cards'){
    for(i=0;i<8;i++){var cx=6+(i%4)*23,cy=6+Math.floor(i/4)*26,hi=(i===5);
      o+='<rect x="'+cx+'" y="'+cy+'" width="20" height="23" rx="4" fill="'+(hi?'#fff6ec':'#f6f7f9')+'" stroke="'+(hi?og:ln)+'" stroke-width="'+(hi?1.4:1)+'"/><circle cx="'+(cx+10)+'" cy="'+(cy+8)+'" r="4" fill="'+(hi?og:gr)+'"/><rect x="'+(cx+4)+'" y="'+(cy+15)+'" width="12" height="2.4" rx="1.2" fill="'+gr+'"/>'}
  }else if(kind==='flow'){
    o+='<path d="M10 14h80" stroke="'+gr+'" stroke-width="1.6"/>';
    [10,28,46,64,82].forEach(function(x,k){o+='<circle cx="'+x+'" cy="14" r="'+(k===2?5.5:4)+'" fill="'+(k===2||k===4?og:'#fff')+'" stroke="'+(k===2||k===4?og:gr)+'" stroke-width="1.6"/>'});
    o+='<rect x="8" y="28" width="38" height="24" rx="5" fill="#f6f7f9" stroke="'+ln+'"/><rect x="54" y="28" width="38" height="24" rx="5" fill="#f6f7f9" stroke="'+ln+'"/><circle cx="20" cy="40" r="5" fill="'+og+'"/><rect x="29" y="36" width="12" height="3" rx="1.5" fill="'+gr+'"/><rect x="29" y="42" width="9" height="3" rx="1.5" fill="'+gr+'"/><rect x="62" y="36" width="24" height="3" rx="1.5" fill="'+gr+'"/><rect x="62" y="42" width="16" height="3" rx="1.5" fill="'+og+'"/>';
  }else{
    for(i=0;i<4;i++){var y=8+i*13;o+='<circle cx="12" cy="'+(y+3)+'" r="3.2" fill="'+(i<2?og:'#fff')+'" stroke="'+(i<2?og:gr)+'" stroke-width="1.4"/><rect x="21" y="'+y+'" width="'+(52-i*6)+'" height="3" rx="1.5" fill="'+gr+'"/><rect x="21" y="'+(y+6)+'" width="'+(30-i*3)+'" height="3" rx="1.5" fill="'+(i<2?og:ln)+'"/>'}
  }
  return o;
}
function vpanel(x0,y0,z0,len,hgt,axis,kind,tilt){
  var o,m,sh;
  if(axis==='x'){o=P(x0,y0,z0+hgt);m=[IW*len/100,IH*len/100,0,hgt/60,o[0],o[1]]}
  else{o=P(x0,y0+len,z0+hgt);m=[IW*len/100,-IH*len/100,0,hgt/60,o[0],o[1]]}
  sh='<g transform="translate(6,5)" opacity=".16"><g transform="matrix('+m.map(function(v){return v.toFixed(3)}).join(',')+')"><rect width="100" height="60" rx="6" fill="#3a4658"/></g></g>';
  return sh+'<g transform="matrix('+m.map(function(v){return v.toFixed(3)}).join(',')+')">'+uiPanel(kind)+'</g>';
}
function clayDisc(cx,cy,rx,ry,h,top,side){
  return '<ellipse cx="'+cx+'" cy="'+(cy+h+8)+'" rx="'+(rx*1.02)+'" ry="'+(ry*1.05)+'" fill="#3a4658" opacity=".22" filter="url(#bl7)"/>'+
   '<path d="M'+(cx-rx)+','+cy+' v'+h+' a'+rx+','+ry+' 0 0 0 '+(2*rx)+',0 v-'+h+'z" fill="'+side+'"/>'+
   '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+top+'" stroke="#fff" stroke-width="1.2"/>';
}
function slabC(x,y,w,d,act){
  var g=ibox(x+.13,y+.13,3,w-.26,d-.26,5,'metal',{round:1,rw:6}),a=P(x,y+d,1),b=P(x+w,y+d,1),c=P(x+w,y,1);
  var dp='M'+a[0].toFixed(1)+','+a[1].toFixed(1)+' L'+b[0].toFixed(1)+','+b[1].toFixed(1)+' L'+c[0].toFixed(1)+','+c[1].toFixed(1);
  return g+(act?'<path d="'+dp+'" fill="none" stroke="#ff8a1f" stroke-width="6" opacity=".45" filter="url(#bl3)" class="gp2"/>':'')+'<path d="'+dp+'" fill="none" stroke="'+(act?'#ff8a1f':'#d5dae0')+'" stroke-width="2.2" stroke-linecap="round"/>';
}
function robotArm(x,y){
  var g=ibox(x,y,5,1.2,1.2,6,'metal'),p=P(x+.6,y+.6,11);
  g+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="10" ry="5" fill="none" stroke="#ff8a1f" stroke-width="2.2"/>';
  g+=ibox(x+.3,y+.3,11,.6,.6,26,'metal');
  var q=P(x+.6,y+.6,37);g+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="5" fill="#fff" stroke="#cfd6dd"/><circle cx="'+q[0]+'" cy="'+q[1]+'" r="2" fill="#ff8a1f"/>';
  g+=ibox(x+.3,y-1.6,34,.6,2.2,5,'metal');
  var r=P(x+.6,y-1.6,34);g+='<path d="M'+(r[0]-4)+','+(r[1]+2)+' l0,9 M'+(r[0]+4)+','+(r[1]+2)+' l0,9" stroke="#b4bcc6" stroke-width="2.4" stroke-linecap="round"/>';
  return g;
}
function robotMascot(sx,sy){
  return '<ellipse cx="'+sx+'" cy="'+(sy+34)+'" rx="24" ry="9" fill="#3a4658" opacity=".2" filter="url(#bl3)"/>'+
   '<ellipse cx="'+sx+'" cy="'+(sy+30)+'" rx="22" ry="9" fill="#fff" stroke="#e1e5ea"/><ellipse cx="'+sx+'" cy="'+(sy+30)+'" rx="17" ry="6.5" fill="none" stroke="#ff8a1f" stroke-width="2"/>'+
   '<ellipse cx="'+sx+'" cy="'+(sy+18)+'" rx="11" ry="12" fill="#fff" stroke="#e1e5ea"/>'+
   '<rect x="'+(sx-17)+'" y="'+(sy-16)+'" width="34" height="27" rx="12" fill="#fff" stroke="#e1e5ea"/><rect x="'+(sx-13)+'" y="'+(sy-11)+'" width="26" height="16" rx="8" fill="#2a2f37"/>'+
   '<ellipse cx="'+(sx-5)+'" cy="'+(sy-3)+'" rx="2.6" ry="3.4" fill="#ff8a1f"/><ellipse cx="'+(sx+5)+'" cy="'+(sy-3)+'" rx="2.6" ry="3.4" fill="#ff8a1f"/>'+
   '<circle cx="'+(sx-19)+'" cy="'+(sy-3)+'" r="3.5" fill="#fff" stroke="#e1e5ea"/><circle cx="'+(sx+19)+'" cy="'+(sy-3)+'" r="3.5" fill="#fff" stroke="#e1e5ea"/>';
}
function heroClay(){
  var sv=IOY,sx=IOX,s='',q=Qnew(),hub,i;
  IOX=300;IOY=40;
  hub=P(4.8,4.8,5);
  s+='<ellipse cx="300" cy="230" rx="250" ry="125" fill="url(#amb)"/>';
  /* spokes */
  var sp=[[[4.8,4.8],[1.8,4.8],[1.8,6.8]],[[4.8,4.8],[7.4,4.8],[7.4,2.6]],[[4.8,4.8],[4.8,8.8],[2.6,8.8]],[[4.8,4.8],[4.8,9.4],[6.6,9.4]],[[4.8,4.8],[9.4,4.8],[9.4,7.6]]];
  sp.forEach(function(a){s+=pipe(a,'flow',2)});
  /* platforms (depth sorted) */
  Qadd(q,1,5.2,slabC(0.4,5,3.2,3,true)+vpanel(0.9,5.5,6,1.8,44,'x','list')+ibox(2.3,6.6,6,.9,.9,8,'metal')+ibox(1.2,6.9,6,.8,.8,6,'metal'));
  Qadd(q,7,1,slabC(6.4,0.6,3.2,3,true)+'<g class="fl" style="animation-delay:-2s">'+vpanel(6.7,2.9,6,2.4,48,'y','cards')+'</g>');
  Qadd(q,1,8,slabC(0.6,8,3.6,3.2,true)+vpanel(1.0,8.6,6,1.9,34,'x','dash')+ibox(1,9.6,6,2.1,1.3,2,'metal'));
  Qadd(q,5,9,slabC(5,8.6,3.2,3,true)+ibox(5.7,9.3,6,1.5,1.5,6,'metal')+ibox(6.2,9.6,12,.9,.9,16,'metal',{glow:'#ff8a1f'}));
  Qadd(q,9,8,slabC(8.6,7.2,3.6,3.2,true)+'<g class="fl" style="animation-delay:-3.5s">'+vpanel(8.9,7.4,6,2.6,38,'y','dash')+'</g>'+robotArm(10.6,9.4));
  s+=Qflush(q);
  sp.forEach(function(a,k){s+=packet(pipeD(a,2),3.2+k*.5,k*.7,'c-req')});
  /* hub */
  s+=clayDisc(hub[0],hub[1]-6,70,35,14,'#ffffff','#e3e7ec')+clayDisc(hub[0],hub[1]-8,44,22,6,'#e2e6ea','#cfd5db');
  var hy=hub[1]-16;
  s+='<ellipse cx="'+hub[0]+'" cy="'+(hy+1)+'" rx="44" ry="22" fill="none" stroke="#ff8a1f" stroke-width="3" opacity=".4" filter="url(#bl3)"/><ellipse cx="'+hub[0]+'" cy="'+(hy+1)+'" rx="44" ry="22" fill="none" stroke="#ff8a1f" stroke-width="1.6" class="pl"/>';
  s+='<g transform="translate('+(hub[0]-17)+','+(hy-14)+')"><path d="M17 6L6 24h22z" fill="none" stroke="#ff8a1f" stroke-width="2.4" stroke-linejoin="round"/><circle cx="17" cy="6" r="4.2" fill="#fff" stroke="#ff8a1f" stroke-width="2.2"/><circle cx="6" cy="24" r="4.2" fill="#fff" stroke="#ff8a1f" stroke-width="2.2"/><circle cx="28" cy="24" r="4.2" fill="#fff" stroke="#ff8a1f" stroke-width="2.2"/></g>';
  /* pole + floating panels */
  s+='<path d="M'+hub[0]+','+(hy-6)+' V'+(hy-70)+'" stroke="#ff8a1f" stroke-opacity=".7" stroke-width="2"/>';
  s+='<g class="fl">'+vpanel(3.2,3.6,78,3.6,70,'x','flow')+'</g>';
  s+='<g class="fl" style="animation-delay:-1s">'+robotMascot(hub[0]-170,hub[1]+66)+'</g>';
  IOX=sx;IOY=sv;
  return '<svg viewBox="30 -40 560 410" role="img" aria-label="Illustration: a connected platform of servers, dashboards and automation around a central hub">'+s+'</svg>';
}

function heroArt(){return heroClay()}
function heroArtOld(){
  var s,q,saveY=IOY;IOY=58;q=Qnew();
  Qadd(q,0,0,plat(0,0,3,3,'ok')+rack(0.8,0.8,'ok',{h:40}));
  Qadd(q,5,0,plat(5,0,3,3,'run')+rack(5.8,0.8,'ok',{h:40}));
  Qadd(q,2.6,4,plat(2.6,4,3,3,'ok')+ibox(3.4,4.8,5,1.4,1.4,26,'blue',{glow:'#3f8fd0'}));
  var p1=[[1.5,3],[1.5,5.5],[2.6,5.5]],p2=[[6.5,3],[6.5,5.5],[5.6,5.5]];
  s=isoDefs()+isoFloor()+pipe(p1,'flow')+pipe(p2,'flow')+Qflush(q);
  [0,1.3].forEach(function(b){s+=packet(pipeD(p1),2.6,b,'c-req')+packet(pipeD(p2),2.6,b+.6,'c-res')});
  IOY=saveY;
  return '<svg viewBox="100 10 440 270" role="img" aria-label="Illustration: servers behind a load balancer">'+s+'</svg>';
}
function secCard(at,icon,tag,name,blurb,meta,pr){
  return '<button class="scard" type="button" '+at+'><span class="sh"><span class="sico">'+icSvg(icon,30)+'</span><span><span class="st">'+esc(tag)+'</span><span class="sn">'+esc(name)+'</span></span></span><span class="sp">'+esc(blurb)+'</span><span class="smeta"><span>'+esc(meta)+'</span><span>'+(pr?pr[0]+'/'+pr[1]+' →':'Open →')+'</span></span>'+(pr?'<span class="pb"><i style="width:'+Math.round(pr[0]/pr[1]*100)+'%"></i></span>':'')+'</button>';
}
function renderHome(){
  var rs=lsGet('resume',null),rl=rs&&lessonById(rs.id),dn=lessonDone(),tot=0;LESSONS.forEach(function(L){tot+=L.steps.length});
  var cta=rl?'<button class="btn go" type="button" data-resume="1"><span>Continue: '+esc(rl.name)+' · step '+(rs.idx+1)+'</span><span aria-hidden="true">→</span></button>':'<button class="btn go" type="button" data-lesson="git"><span>Start learning</span><span aria-hidden="true">→</span></button>';
  var learn=SECT.filter(function(s){return s.kind==='lesson'||s.kind==='aws'||s.kind==='lnx'}).map(function(s){
    var pr=secProg(s),blurb,meta,at;
    if(s.kind==='lesson'){var L=lessonById(s.lesson);blurb=L.blurb;meta=L.steps.length+' steps'+(dn[L.id]!=null?' · quiz '+dn[L.id]+'/3':'');at='data-lesson="'+s.lesson+'"'}
    else if(s.kind==='lnx'){blurb='Linux for DevOps and security: basics, commands, troubleshooting and hardening. Short guides with command tables.';meta=LNX.length+' guides';at='data-mlnxo="1"'}
    else{blurb='Hands-on EC2 and S3 lessons, plus guides to '+svcGuides().length+' more services such as Lambda, EKS and DynamoDB.';meta='2 lessons · '+svcGuides().length+' guides';at='data-maws="1"'}
    return secCard(at,s.icon,s.tag,secName(s),blurb,meta,pr);
  }).join('');
  var prac=[secCard('data-game="1"','firewall','Play','Incident Room','An on-call game. Read the alert, pick your first move and beat the clock.','Best '+lsGet('best',0),null),
    secCard('data-lab="1"','gear','Practice','Build Lab','Design your own infrastructure, send traffic through it and see what it costs.','5 goals',null),
    secCard('data-gp="1"','commit','Practice','Git Practice','A safe practice repo. Type real git commands and watch the commit graph change.','6 missions',null)].join('');
  $('#home').innerHTML='<div class="hero"><div class="hero-l"><span class="eyebrow">Interactive DevOps study lab</span><h1>Learn DevOps by watching it work</h1><p>Animated 3D diagrams, hands-on labs and short quizzes for Git, Docker, Kubernetes and AWS. Free, in your browser, no sign-up.</p><div class="hero-cta">'+cta+'<button class="btn" type="button" data-tour="1">Take the tour</button></div>'+
    '<ul class="hero-stats"><li><b>'+LESSONS.length+'</b> lessons</li><li><b>'+tot+'</b> steps</li><li><b>'+(svcGuides().length+LNX.length)+'</b> guides</li><li><b>3</b> practice labs</li></ul></div><div class="hero-r">'+heroArt()+'</div></div>'+
    '<h2 class="hh">Learn</h2>'+(function(){var k=Object.keys(dn).length,pf=0;Object.keys(dn).forEach(function(x){if(dn[x]===3)pf++});return '<div class="hprog" aria-label="Quiz progress"><div class="hbar"><i style="width:'+Math.round(k/LESSONS.length*100)+'%"></i></div><span>'+k+' of '+LESSONS.length+' quizzes done'+(pf?' · '+pf+' perfect':'')+'</span></div>'})()+'<div class="sgrid">'+learn+'</div><h2 class="hh">Practice</h2><div class="sgrid">'+prac+'</div>'+
    '<h2 class="hh">How it works</h2><div class="how"><div><b>1 · Watch</b><p>Every step has an animated 3D diagram showing what really happens, with plain-language labels.</p></div><div><b>2 · Try</b><p>Use the controls, break things, and build your own setups in the practice labs.</p></div><div><b>3 · Check</b><p>Finish each lesson with a short quiz, then download your notes.</p></div></div>';
}
function countUp(){
  if(reduce)return;
  [].forEach.call(document.querySelectorAll('.hero-stats b'),function(b){var n=parseInt(b.textContent,10),t0=null;if(!n)return;
    function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/900),e=1-Math.pow(1-k,3);b.textContent=Math.round(n*e);if(k<1)requestAnimationFrame(f)}
    b.textContent='0';requestAnimationFrame(f)});
}
document.addEventListener('pointermove',function(e){
  if(reduce||e.pointerType==='touch')return;
  var c=e.target.closest&&e.target.closest('.scard');
  if(!c)return;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  c.style.setProperty('--rx',(-y*7).toFixed(2)+'deg');c.style.setProperty('--ry',(x*9).toFixed(2)+'deg');
});
document.addEventListener('pointerout',function(e){var c=e.target.closest&&e.target.closest('.scard');if(c&&!c.contains(e.relatedTarget)){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}});
function showHome(fromH){
  clearTimers();hideGame();hmOn=true;$('.app').classList.add('hm');
  if(!cur)cur=LESSONS[0];
  renderStatic();renderHome();countUp();
  if(!fromH){try{history.replaceState(null,'','#home')}catch(e){location.hash='home'}}
  try{window.scrollTo(0,0)}catch(e){}
  if(!lsGet('tour',0))setTimeout(function(){if(hmOn)tourOpen()},500);
}
function hideHome(){if(!hmOn)return;hmOn=false;$('.app').classList.remove('hm')}
/* ----- quick check ----- */
function startQuiz(){qzOn=true;QZ={id:cur.id,i:0,score:0,sel:null,done:false,miss:[]};renderCard();var c=$('#card');if(c&&c.scrollIntoView&&window.innerWidth<1100)c.scrollIntoView({behavior:'smooth',block:'start'})}
function renderQuizCard(){
  var q=QUIZ[QZ.id],n=q.length,L=lessonById(QZ.id),h;
  if(QZ.done){
    var li=LESSONS.indexOf(L),nl=LESSONS[li+1],sv=(seen[L.id]||[]).length;
    $('#card').innerHTML='<div class="top"><span>LESSON COMPLETE</span><span class="chipTag">QUIZ '+QZ.score+'/'+n+'</span></div><h2>'+esc(L.name)+' done</h2><p>You scored <b>'+QZ.score+' of '+n+'</b> on the quick check and visited '+sv+' of '+L.steps.length+' steps. '+(QZ.score===n?'Perfect.':'Review any step from the list below the diagram, then retake it.')+'</p>'+
     (QZ.miss&&QZ.miss.length?'<div class="idea"><b>Review what you missed</b>'+QZ.miss.map(function(i){var x=q[i];return '<p><b>'+esc(x[0])+'</b><br>Answer: '+esc(x[1][x[2]])+'. '+esc(x[3])+'</p>'}).join('')+'</div>':'')+'<div class="nav done"><button class="btn go" type="button" id="qnextL"><span>'+(nl?'Next lesson: '+esc(nl.name):'Back to the home page')+'</span><span aria-hidden="true">→</span></button></div>'+
     '<div class="lrow"><button class="btn" type="button" data-notes="md">Download notes</button><button class="btn" type="button" data-notes="print">Print or save as PDF</button><button class="btn" type="button" id="qretry">Retake quiz</button></div>';
    return;
  }
  var cq=q[QZ.i],ans=QZ.sel!=null;
  h='<div class="top"><span>QUICK CHECK · '+(QZ.i+1)+' / '+n+'</span><span class="chipTag">'+esc(L.name)+'</span></div><h2>'+esc(cq[0])+'</h2><div class="qopts" role="group" aria-label="Answers">'+cq[1].map(function(o,k){
    var cls='btn qopt'+(ans?(k===cq[2]?' ok':(k===QZ.sel?' bad':'')):'');
    return '<button class="'+cls+'" type="button" data-qopt="'+k+'"'+(ans?' disabled':'')+'>'+esc(o)+'</button>'}).join('')+'</div>';
  if(ans)h+='<div class="idea"><b>'+(QZ.sel===cq[2]?'Correct':'Not quite')+'</b>'+esc(cq[3])+'</div>';
  h+='<div class="nav"><button class="btn" type="button" id="qback">← Back to the lesson</button>'+(ans?'<button class="btn go" type="button" id="qnext"><span>'+(QZ.i===n-1?'See my result':'Next question')+'</span><span aria-hidden="true">→</span></button>':'')+'</div>';
  $('#card').innerHTML=h;
}
/* ----- notes ----- */
function notesMD(L){
  var o=['# '+L.name+' — study notes','','> '+L.blurb,'','## What you are looking at',''];
  (L.parts||[]).forEach(function(p){o.push('- **'+p[2]+'**: '+p[3])});
  o.push('','## Steps','');
  L.steps.forEach(function(s,i){o.push('### '+(i+1)+'. '+s.title+' ('+s.tag+')','',s.text,'','> Key idea: '+s.idea,'')});
  var q=QUIZ[L.id]||[];if(q.length){o.push('## Quick check','');q.forEach(function(x,i){o.push((i+1)+'. '+x[0],'   - Answer: **'+x[1][x[2]]+'**. '+x[3])})}
  o.push('','---','Made with OpsLens.');return o.join('\n');
}
function notesHTML(L){
  var h='<h1>'+esc(L.name)+' — study notes</h1><p><em>'+esc(L.blurb)+'</em></p><h2>What you are looking at</h2><ul>'+(L.parts||[]).map(function(p){return '<li><b>'+esc(p[2])+'</b>: '+esc(p[3])+'</li>'}).join('')+'</ul><h2>Steps</h2>';
  L.steps.forEach(function(s,i){h+='<h3>'+(i+1)+'. '+esc(s.title)+' <small>('+esc(s.tag)+')</small></h3><p>'+esc(s.text)+'</p><blockquote><b>Key idea:</b> '+esc(s.idea)+'</blockquote>'});
  var q=QUIZ[L.id]||[];if(q.length){h+='<h2>Quick check</h2><ol>'+q.map(function(x){return '<li>'+esc(x[0])+'<br><b>Answer: '+esc(x[1][x[2]])+'.</b> '+esc(x[3])+'</li>'}).join('')+'</ol>'}
  return h+'<p class="pf">Made with OpsLens.</p>';
}
function notesDownload(L){
  try{var b=new Blob([notesMD(L)],{type:'text/markdown'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=L.id+'-notes.md';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},2000)}catch(e){}
}
function notesPrint(L){$('#printdoc').innerHTML=notesHTML(L);try{window.print()}catch(e){}}
/* ----- tour ----- */
var TOUR=[["Welcome to OpsLens","Twelve interactive lessons, three practice labs and 24 AWS guides. Everything runs in your browser, and your progress is saved there."],["Pick a lesson","The tabs at the top open a lesson. Each one has an animated 3D diagram, short step cards, and a quick check at the end."],["Practice what you learn","The Practice menu has the Incident Room game, the Build Lab for designing your own infrastructure, and a Git Practice terminal."],["Find anything fast","The Sections button opens a window listing every lesson, step and AWS guide, with your progress."]];
function tourOpen(){
  var t=$('#tour');if(!t){t=document.createElement('div');t.id='tour';t.className='mdl';t.setAttribute('role','dialog');t.setAttribute('aria-modal','true');t.setAttribute('aria-labelledby','tourT');$('.app').appendChild(t)}
  tourI=0;t.hidden=false;tourRender();
}
function tourRender(){
  var s=TOUR[tourI],last=tourI===TOUR.length-1;
  $('#tour').innerHTML='<div class="tour-win"><span class="eyebrow">'+(tourI+1)+' of '+TOUR.length+'</span><h2 id="tourT">'+esc(s[0])+'</h2><p>'+esc(s[1])+'</p><div class="tour-dots">'+TOUR.map(function(x,i){return '<i class="'+(i===tourI?'on':'')+'"></i>'}).join('')+'</div><div class="lrow"><button class="btn go" type="button" id="tourNext"><span>'+(last?'Start learning':'Next')+'</span><span aria-hidden="true">→</span></button>'+(tourI?'<button class="btn" type="button" id="tourBack">Back</button>':'')+'<button class="btn" type="button" id="tourSkip">'+(last?'Close':'Skip')+'</button></div></div>';
  $('#tourNext').focus();
}
function tourClose(){var t=$('#tour');if(t)t.hidden=true;lsSet('tour',1)}
document.addEventListener('click',function(e){
  var t=e.target.closest?e.target.closest('button,.brand'):null;if(!t)return;
  if(t.classList.contains('brand')){nav('#home');return}
  var d=t.dataset;
  if(d.resume){var r=lsGet('resume',null);if(r)pick(r.id,r.idx);return}
  if(d.maws){mOpen();MS='aws';MSVC=null;mRender();return}
  if(d.mlnxo){mOpen();MS='lnx';MSVC=null;mRender();return}
  if(d.tour){tourOpen();return}
  if(d.qopt!=null&&QZ&&QZ.sel==null){var k=parseInt(d.qopt,10);QZ.sel=k;if(k===QUIZ[QZ.id][QZ.i][2])QZ.score++;else QZ.miss.push(QZ.i);renderCard();return}
  if(t.id==='qnext'){if(QZ.i===QUIZ[QZ.id].length-1){QZ.done=true;var dn=lessonDone();dn[QZ.id]=QZ.score;lsSet('done',dn)}else{QZ.i++;QZ.sel=null}renderCard();return}
  if(t.id==='qback'){qzOn=false;go(cur.steps.length-1);return}
  if(t.id==='qretry'){startQuiz();return}
  if(t.id==='qnextL'){var li=LESSONS.indexOf(cur),nl=LESSONS[li+1];qzOn=false;if(nl)pick(nl.id,0);else nav('#home');return}
  if(d.notes){if(d.notes==='md')notesDownload(cur);else notesPrint(cur);return}
  if(t.id==='tourNext'){if(tourI===TOUR.length-1){tourClose();pick('git',0)}else{tourI++;tourRender()}return}
  if(t.id==='tourBack'){tourI--;tourRender();return}
  if(t.id==='tourSkip'){tourClose();return}
  if(t.id==='themeBtn'){var cu=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';if(cu==='dark')document.documentElement.setAttribute('data-theme','dark');else document.documentElement.removeAttribute('data-theme');lsSet('theme',cu);isoTheme();if(hmOn)renderHome();else if(!labOn&&!gpOn&&!gameOn)renderStage();return}
  if(t.id==='contBtn'){var r2=lsGet('resume',null);if(r2)pick(r2.id,r2.idx);return}
});
document.addEventListener('keydown',function(e){
  var t=$('#tour');if(t&&!t.hidden&&e.key==='Escape'){e.stopPropagation();tourClose()}
  if(e.key==='Enter'&&e.target&&e.target.classList&&e.target.classList.contains('brand'))nav('#home');
},true);

window.addEventListener('hashchange',fromHash);
fromHash();
})();
