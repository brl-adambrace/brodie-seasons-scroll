// Assembles the prototype (index.html) from the single-source Webflow payloads in this folder.
import fs from 'fs'; import path from 'path'; import {fileURLToPath} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url)); const idx=path.join(dir,'..','index.html');
const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
let html=fs.readFileSync(idx,'utf8');
// seasons script (shared)
const foot=read('footer.html'); const sScript=foot.slice(foot.indexOf('<script>'),foot.indexOf('</script>')+9);
const a=html.indexOf('<!-- SSC:END -->'); const lastScriptStart=html.lastIndexOf('<script>',a); const lastScriptEnd=html.indexOf('</script>',lastScriptStart)+9;
html=html.slice(0,lastScriptStart)+sScript+html.slice(lastScriptEnd);
// divisions block
const divisions=[
 {t:'D6 Beginner',s:'Everyone Starts Somewhere.',img:'div-d6.jpg',d:'D6 is for athletes who have never played organized basketball. No experience required — just the willingness to show up, learn, and grow. Everyone starts somewhere.'},
 {t:'D5 Rookie',s:'The League Starts Here.',img:'div-d5.jpg',d:'D5 is for athletes stepping into organized ball for the first time — building confidence, finding their footing, and competing on a real court.'},
 {t:'D4 Rec',s:'Growth Starts Here.',img:'div-d4.jpg',d:'D4 is for players sharpening their skills, improving their game IQ, showing flashes of potential. This is the space between learning and competing.'},
 {t:'D3 Inter',s:'You’ve Got Game.',img:'div-d3.jpg',d:'D3 players are consistent, confident, and ready to compete at pace. You know the systems, the flow, and you bring it every night.'},
 {t:'D2 Comp',s:'Every Game Is A Statement.',img:'div-d2.jpg',d:'D2 is made for high-level players refining their edge, preparing for exposure, and proving they belong in the top tier.'},
 {t:'D1 Elite',s:'Where Legends Live.',img:'div-d1.jpg',d:'D1 is for the most dominant and skilled players in the league. This is where the game slows down, the lights get brighter, and every move matters.'}];
const card=x=>`        <div class="dv-slot">
          <div class="dv-card" tabindex="0">
            <img class="dv-card__img" src="assets/${x.img}" alt="">
            <div class="dv-card__frost"></div>
            <div class="dv-card__content">
              <h3 class="dv-card__title">${x.t}</h3>
              <p class="dv-card__sub">${x.s}</p>
              <p class="dv-card__desc">${x.d}</p>
            </div>
            <a href="#" class="dv-card__info" role="button" aria-label="About ${x.t}"><div class="dv-card__info-icon"></div></a>
          </div>
        </div>`;
const markup=read('divisions-prototype.html').replace('<!--CARDS-->',divisions.map(card).join('\n'));
const head=read('divisions-head.html'); const headCss=head.slice(head.indexOf('<style>'),head.indexOf('</style>')+8);
const dfoot=read('divisions-footer.html'); const dScript=dfoot.slice(dfoot.indexOf('<script>'),dfoot.indexOf('</script>')+9);
const block=`<!-- DV:START -->\n  <style>\n${read('divisions-static.css')}  </style>\n  ${headCss}\n${markup}\n  ${dScript}\n  <!-- DV:END -->`;
if(html.includes('<!-- DV:START -->')) html=html.replace(/<!-- DV:START -->[\s\S]*?<!-- DV:END -->/,block);
else html=html.replace('<!-- SSC:END -->','<!-- SSC:END -->\n\n  '+block);
// ways to play block
const whead=read("waystoplay-head.html"); const wheadCss=whead.slice(whead.indexOf("<style>"),whead.indexOf("</style>")+8);
const wfoot=read("waystoplay-footer.html"); const wScript=wfoot.slice(wfoot.indexOf("<script>"),wfoot.indexOf("</script>")+9);
const wblock=`<!-- WYP:START -->\n  <style>\n${read("waystoplay-static.css")}  </style>\n  ${wheadCss}\n${read("waystoplay-prototype.html")}\n  ${wScript}\n  <!-- WYP:END -->`;
if(html.includes("<!-- WYP:START -->")) html=html.replace(/<!-- WYP:START -->[\s\S]*?<!-- WYP:END -->/,wblock);
else html=html.replace("<!-- DV:END -->","<!-- DV:END -->\n\n  "+wblock);
new Function(wScript.slice(8,-9));
fs.writeFileSync(idx,html);
new Function(sScript.slice(8,-9)); new Function(dScript.slice(8,-9));
console.log('index.html rebuilt:',html.length,'chars; DV block',block.length);
