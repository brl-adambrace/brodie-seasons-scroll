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
const footer=(await Promise.all(['footer.html','divisions-footer.html','waystoplay-footer.html'].map(minScript))).join('\n');
fs.mkdirSync(path.join(dir,'dist'),{recursive:true});
fs.writeFileSync(path.join(dir,'dist','page-head.html'),head); fs.writeFileSync(path.join(dir,'dist','page-footer.html'),footer);
// sanity: every <script> still parses
for(const m of footer.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
console.log('page-head', head.length,'chars; page-footer', footer.length,'chars (limit 10000 each)');
