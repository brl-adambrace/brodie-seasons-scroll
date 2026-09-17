// Builds one self-contained hosted script per section for Webflow's registered-scripts system:
// the behaviour CSS (from *-head.html) is injected into <head> immediately, the behaviour JS (from *-footer.html)
// runs at DOMContentLoaded. Output: dist/hosted/<name>-<version>.js + manifest.json (md5 for the asset upload,
// sha384 integrity for register_hosted_script). Bump the version in hosted-versions.json before rebuilding.
import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import {fileURLToPath} from 'url'; import {minify} from 'terser';
const dir=path.dirname(fileURLToPath(import.meta.url)); const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const versions=JSON.parse(read('hosted-versions.json'));
const sections=[
  {name:'seasons-scroll',display:'seasonsScroll',head:'head.html',foot:'footer.html'},
  {name:'divisions-carousel',display:'divisionsCarousel',head:'divisions-head.html',foot:'divisions-footer.html'},
  {name:'ways-to-play',display:'waysToPlay',head:'waystoplay-head.html',foot:'waystoplay-footer.html'},
];
function slimCss(s){ s=s.replace(/<!--[\s\S]*?-->/g,'').replace(/\/\*[\s\S]*?\*\//g,''); return s.split('\n').map(l=>l.trim()).filter(Boolean).join('\n'); }
const out=path.join(dir,'dist','hosted'); fs.mkdirSync(out,{recursive:true});
const manifest=[];
for(const s of sections){
  const h=read(s.head), f=read(s.foot);
  const css=slimCss(h.slice(h.indexOf('<style>')+7,h.indexOf('</style>')));
  const js=f.slice(f.indexOf('<script>')+8,f.indexOf('</script>'));
  const src=`(function(){var c=${JSON.stringify(css)};var st=document.createElement('style');st.setAttribute('data-brl','${s.name}');st.textContent=c;(document.head||document.documentElement).appendChild(st);function init(){${js}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();`;
  const min=(await minify(src,{compress:{passes:2},mangle:true,format:{comments:false}})).code;
  const file=`${s.name}-${versions[s.name]}.js`; fs.writeFileSync(path.join(out,file),min);
  const buf=Buffer.from(min); new Function(min);
  manifest.push({name:s.name,display:s.display,version:versions[s.name],file,bytes:buf.length,md5:crypto.createHash('md5').update(buf).digest('hex'),integrity:'sha384-'+crypto.createHash('sha384').update(buf).digest('base64')});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest,null,1));
