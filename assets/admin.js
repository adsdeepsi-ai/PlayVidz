const form=document.getElementById("addForm");
const msg=document.getElementById("message");
const list=document.getElementById("adminList");
const refresh=document.getElementById("refresh");

function esc(s=""){
  return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function placeholder(title){
  const text=encodeURIComponent((title||"VIDEO").slice(0,12));
  return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="%231c202a"/><text x="50%" y="50%" fill="%23b9bfca" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">${text}</text></svg>`;
}
function token(){return document.getElementById("token").value.trim()}

async function load(){
  list.innerHTML="Loading...";
  const res=await fetch("/api/videos?limit=100");
  const data=await res.json();
  list.innerHTML="";
  data.videos.forEach(v=>{
    const row=document.createElement("div");
    row.className="admin-item";
    row.innerHTML=`<img src="${esc(v.thumbnail_url||placeholder(v.title))}" alt=""><div><div class="admin-item-title">${esc(v.title)}</div><div class="muted">${esc(v.duration||"")} · ${esc(v.slug)}</div></div><button class="delete-btn" data-id="${v.id}">Delete</button>`;
    row.querySelector("button").onclick=()=>removeVideo(v.id);
    list.appendChild(row);
  });
}
async function removeVideo(id){
  if(!confirm("Delete this video?")) return;
  const res=await fetch("/api/admin/videos",{method:"DELETE",headers:{"x-admin-token":token(),"content-type":"application/json"},body:JSON.stringify({id})});
  const data=await res.json().catch(()=>({}));
  msg.textContent=data.message||data.error||"Done";
  load();
}
form.onsubmit=async e=>{
  e.preventDefault();
  msg.textContent="Adding...";
  const body={
    title:document.getElementById("title").value.trim(),
    video_url:document.getElementById("videoUrl").value.trim(),
    thumbnail_url:document.getElementById("thumbUrl").value.trim(),
    duration:document.getElementById("duration").value.trim(),
    description:document.getElementById("description").value.trim()
  };
  const res=await fetch("/api/admin/videos",{method:"POST",headers:{"x-admin-token":token(),"content-type":"application/json"},body:JSON.stringify(body)});
  const data=await res.json().catch(()=>({}));
  msg.textContent=data.message||data.error||"Done";
  if(res.ok){form.reset(); document.getElementById("token").value=token();}
  load();
};
refresh.onclick=load;
load();
