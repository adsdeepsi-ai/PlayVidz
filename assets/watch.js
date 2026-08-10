const params = new URLSearchParams(location.search);
const slug = params.get("slug");
const player = document.getElementById("player");
const titleEl = document.getElementById("watchTitle");
const descEl = document.getElementById("watchDescription");
const grid = document.getElementById("similarGrid");

function esc(s=""){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function placeholder(title){
  const text=encodeURIComponent((title||"VIDEO").slice(0,22));
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%231c202a"/><text x="50%" y="50%" fill="%23b9bfca" font-size="28" font-family="Arial" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
}
function card(v){
  const a=document.createElement("a");
  a.className="video-card";
  a.href=`/watch.html?slug=${encodeURIComponent(v.slug)}`;
  a.innerHTML=`<div class="thumb-wrap"><img class="thumb" loading="lazy" src="${esc(v.thumbnail_url||placeholder(v.title))}" alt="">${v.duration?`<span class="duration">${esc(v.duration)}</span>`:""}</div><div class="video-card-title">${esc(v.title)}</div>`;
  return a;
}

async function init(){
  if(!slug){ titleEl.textContent="Video not found"; return; }
  const res=await fetch(`/api/video?slug=${encodeURIComponent(slug)}`);
  if(!res.ok){ titleEl.textContent="Video not found"; return; }
  const data=await res.json();
  const v=data.video;
  document.title=v.title+" - MVStyle";
  titleEl.textContent=v.title;
  descEl.textContent=v.description||"";
  player.src=v.video_url;

  data.similar.forEach(v=>grid.appendChild(card(v)));
}
init();
