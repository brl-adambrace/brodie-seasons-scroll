// browserTint: keeps <meta name="theme-color"> in step with the page section touching the browser bar, so iOS Safari's
// tab bar (bottom) and Android Chrome's address bar (top) always match the content beside them: black over the dark
// sections, the site's #f8f8f8 over the light ones. Without it Safari tints from the body background (#f8f8f8) and shows a
// light bar under dark sections. Runs on every scroll frame (one elementFromPoint + a short ancestor walk).
(function(){
  var meta=document.querySelector('meta[name="theme-color"]');
  if(!meta){ meta=document.createElement('meta'); meta.setAttribute('name','theme-color'); document.head.appendChild(meta); }
  var ua=navigator.userAgent, bottomBar=/iP(hone|ad|od)/.test(ua)&&!/CriOS|FxiOS|EdgiOS/.test(ua);   // iOS Safari: bar at the bottom; everything else: top
  function opaque(c){ var m=/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(c||''); return m&&(m[4]===undefined||parseFloat(m[4])>=.98)?'rgb('+m[1]+', '+m[2]+', '+m[3]+')':null; }
  function luma(c){ var m=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c||''); return m?(0.2126*m[1]+0.7152*m[2]+0.0722*m[3])/255:0; }
  function colorAt(x,y){
    var el=document.elementFromPoint(x,y), text=el?getComputedStyle(el).color:'', media=false;
    while(el&&el!==document.documentElement){ var cs=getComputedStyle(el);
      if(el.tagName==='VIDEO'||el.tagName==='IMG'||el.classList.contains('w-background-video')||el.querySelector(':scope > video')) return 'rgb(0, 0, 0)';   // media sits on top of whatever colour the wrapper has
      var c=opaque(cs.backgroundColor); if(c) return c;
      if(cs.backgroundImage!=='none') media=true;
      el=el.parentElement; }
    // no opaque background above the point: photo/video sections are dark on this site; otherwise light text means a
    // dark section and anything else shows the body colour
    if(media||luma(text)>0.6) return 'rgb(0, 0, 0)';
    return opaque(getComputedStyle(document.body).backgroundColor)||'rgb(0, 0, 0)';
  }
  var last='';
  function update(){
    var y=bottomBar?Math.max(1,innerHeight-2):1, c=colorAt(innerWidth/2,y);
    if(c!==last){ last=c; meta.setAttribute('content',c); }
  }
  var queued=false; function schedule(){ if(queued) return; queued=true; requestAnimationFrame(function(){ queued=false; update(); }); }
  addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule); addEventListener('load',update);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',update); else update();
})();
