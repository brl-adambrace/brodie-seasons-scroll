// Produces the combined Webflow page head/footer code (seasons + divisions) with comments and indentation
// stripped, so both blocks stay under Webflow's 10,000-character page-code limit. Sources stay readable.
import fs from 'fs'; import path from 'path'; import {fileURLToPath} from 'url'; import {minify} from 'terser';
const dir=path.dirname(fileURLToPath(import.meta.url)); const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
function slim(s){
  s=s.replace(/<!--[\s\S]*?-->/g,'');                       // html comments
  s=s.replace(/\/\*[\s\S]*?\*\//g,'');                      // block comments (css + js)
  s=s.split('\n').map(l=>l.replace(/^\s+/,'')).filter(l=>l && !l.startsWith('//'))
     .map(l=>l.replace(/;?\s+\/\/\s[^'"]*$/,m=>m.startsWith(';')?';':'')).join('\n');   // trailing // comments (never inside quotes)
  return s.trim();
}
const head=['head.html','divisions-head.html','waystoplay-head.html'].map(f=>slim(read(f))).join('\n');
async function minScript(f){ const s=read(f); const js=s.slice(s.indexOf('<script>')+8,s.indexOf('</script>')); const out=await minify(js,{compress:{passes:2},mangle:true,format:{comments:false}}); return '<script>'+out.code+'</script>'; }
const scripts=await Promise.all(['footer.html','divisions-footer.html','waystoplay-footer.html'].map(minScript));
// Webflow caps each page-code block at 10,000 characters. Scripts live in the footer; when they no longer fit, the
// smallest set that makes the footer fit is moved into the head block, wrapped to run at DOMContentLoaded (the three
// scripts are independent, so order does not matter). Fails loudly if no arrangement fits.
const LIMIT=10000; const defer=s=>'<script>document.addEventListener("DOMContentLoaded",function(){'+s.slice(8,-9)+'});</script>';
let best=null;
for(let mask=0;mask<(1<<scripts.length);mask++){
  const foot=scripts.filter((_,i)=>!(mask>>i&1)).join('\n'), extra=scripts.filter((_,i)=>mask>>i&1).map(defer).join('\n');
  const h=extra?head+'\n'+extra:head; if(foot.length>LIMIT||h.length>LIMIT) continue;
  if(!best||h.length<best.h.length) best={foot,h,moved:scripts.filter((_,i)=>mask>>i&1).length};
}
if(!best){ console.warn('page-code build skipped: the combined code no longer fits Webflow\'s 10,000-character blocks. The sections ship as hosted scripts now (build-hosted.mjs); this page-code path is kept only for reference.'); process.exit(0); }
const footer=best.foot, headOut=best.h; if(best.moved) console.log(best.moved+' script(s) moved to the head block (deferred to DOMContentLoaded) to stay under the cap');
fs.mkdirSync(path.join(dir,'dist'),{recursive:true});
fs.writeFileSync(path.join(dir,'dist','page-head.html'),headOut); fs.writeFileSync(path.join(dir,'dist','page-footer.html'),footer);
// sanity: every <script> still parses
for(const m of (footer+headOut).matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
console.log('page-head', headOut.length,'chars; page-footer', footer.length,'chars (limit 10000 each)');
