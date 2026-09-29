// Builds js/data/search-index.js from the site's HTML files.
// Run: node build-index.js   (from the site root)
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

function strip(html){
  return html.replace(/<script[\s\S]*?<\/script>/gi," ")
             .replace(/<style[\s\S]*?<\/style>/gi," ")
             .replace(/<[^>]+>/g," ")
             .replace(/&[a-z]+;/gi," ")
             .replace(/\s+/g," ").trim();
}
function h3text(chunk){
  const m = chunk.match(/<h3>([\s\S]*?)<\/h3>/i);
  return m ? strip(m[1]) : "";
}
const entries = [];
function add(t,u,s){
  s = (s||"").slice(0,220);
  if(t && s) entries.push({t, u, s});
}

// course lessons
const courseTitles = {};
for(const f of fs.readdirSync(path.join(ROOT,"courses"))){
  if(!f.endsWith(".html")) continue;
  const html = fs.readFileSync(path.join(ROOT,"courses",f),"utf8");
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1] || f;
  const course = strip(title).replace(" — The New Academy","");
  courseTitles[f] = course;
  const parts = html.split('<div class="lesson');
  for(let i=1;i<parts.length;i++){
    const chunk = parts[i];
    const h = h3text(chunk) || ("Lesson "+i);
    const body = strip(chunk.split('<div class="lesson-body">')[1]||chunk);
    add(course+" · "+h, "courses/"+f, body);
  }
  add(course+" — course overview", "courses/"+f, strip(html.split('<div class="wrap">')[1]||"").slice(0,400));
}

// library sources
const libPath = path.join(ROOT,"library.html");
if(fs.existsSync(libPath)){
  const html = fs.readFileSync(libPath,"utf8");
  const parts = html.split('<div class="source');
  for(let i=1;i<parts.length;i++){
    const chunk = parts[i];
    const id = (chunk.match(/id="([^"]+)"/)||[])[1] || "";
    const h = h3text(chunk) || "Source";
    add("Library · "+h, "library.html"+(id?"#"+id:""), strip(chunk));
  }
}

// timeline
const tlPath = path.join(ROOT,"timeline.html");
if(fs.existsSync(tlPath)){
  const html = fs.readFileSync(tlPath,"utf8");
  const parts = html.split('<div class="tl-ev"');
  for(let i=1;i<parts.length;i++){
    const chunk = parts[i];
    const date = strip((chunk.match(/<div class="tl-date">([\s\S]*?)<\/div>/)||[])[1]||"");
    const h = (chunk.match(/<h4>([\s\S]*?)<\/h4>/)||[])[1] || "";
    add("Timeline · "+date+" "+strip(h), "timeline.html", strip(chunk));
  }
}

// top-level pages
for(const [f,t] of [["review.html","Review room — flashcards, drills, notes"],["search.html","Search the academy"],["exam.html","Final examinations"],["timeline.html","Timeline of the classical world"],["library.html","The Library — primary sources"],["index.html","The New Academy — curriculum"]]){
  const p = path.join(ROOT,f);
  if(fs.existsSync(p)) add(t, f, strip(fs.readFileSync(p,"utf8")).slice(0,300));
}

const out = "window.ACADEMY_SEARCH = "+JSON.stringify(entries)+";\n";
fs.mkdirSync(path.join(ROOT,"js","data"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"js","data","search-index.js"), out);
console.log("wrote search-index.js with", entries.length, "entries");
