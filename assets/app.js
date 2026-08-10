const grid = document.getElementById("videoGrid");
const empty = document.getElementById("empty");
const pagination = document.getElementById("pagination");
const perPage = 10;

function esc(s=""){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function placeholder(title){
  const text = encodeURIComponent((title || "VIDEO").slice(0,22));
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%231c202a"/><text x="50%" y="50%" fill="%23b9bfca" font-size="28" font-family="Arial" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
}

async function load(page=1){
  grid.innerHTML = "";
  const res = await fetch(`/api/videos?page=${page}&limit=${perPage}`);
  if(!res.ok){ empty.textContent="Could not load videos."; empty.classList.remove("hidden"); return; }
  const data = await res.json();

  if(!data.videos.length){
    empty.textContent="No videos found.";
    empty.classList.remove("hidden");
    pagination.innerHTML="";
    return;
  }
  empty.classList.add("hidden");

  data.videos.forEach(v=>{
    const card=document.createElement("a");
    card.className="video-card";
    card.href=`/watch.html?slug=${encodeURIComponent(v.slug)}`;
    const thumb=v.thumbnail_url || placeholder(v.title);
    card.innerHTML=`
      <div class="thumb-wrap">
        <img class="thumb" loading="lazy" src="${esc(thumb)}" alt="">
        ${v.duration ? `<span class="duration">${esc(v.duration)}</span>` : ""}
      </div>
      <div class="video-card-title">${esc(v.title)}</div>`;
    grid.appendChild(card);
  });

  pagination.innerHTML="";
  for(let p=1;p<=data.pages;p++){
    const b=document.createElement("button");
    b.className="page-btn"+(p===data.page?" active":"");
    b.textContent=p;
    b.onclick=()=>{load(p);scrollTo({top:0,behavior:"smooth"});};
    pagination.appendChild(b);
  }
}
load(1);
