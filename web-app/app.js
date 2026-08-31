const app=document.getElementById('app'), title=document.getElementById('pageTitle');
const cfg=window.LTLINE_SUPABASE||{};
const hasSupabase=window.supabase && cfg.url && cfg.anonKey && !cfg.anonKey.includes('PASTE_YOUR_');
const db=hasSupabase?window.supabase.createClient(cfg.url,cfg.anonKey):null;

const data={projects:[],services:[]};
let stats={projects:0,assets:0,warranties:0,open_services:0};

function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function fmtDate(v){return v?new Date(v).toLocaleDateString('sq-AL'):'';}
function statusSq(v){return ({active:'Aktiv',open:'E hapur',in_progress:'Në proces',planned:'Planifikuar',completed:'Përfunduar',cancelled:'Anuluar'})[v]||v||'';}
function prioritySq(v){return ({low:'I ulët',medium:'Mesatar',high:'I lartë',critical:'Kritik'})[v]||v||'';}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}
function connectionNotice(){return hasSupabase?'':'<div class="panel" style="margin-bottom:16px;border-left:4px solid #f59e0b"><strong>Konfigurimi i databazës mungon.</strong><p class="muted">Shto çelësin publik të Supabase te <code>web-app/supabase-config.js</code>. Mos përdor service_role key.</p></div>';}

async function loadDashboardData(){
  if(!db)return;
  const [s,p,a,w,sv]=await Promise.all([
    db.rpc('get_dashboard_stats'),
    db.from('projects').select('id,project_code,name,address,city,status').order('created_at',{ascending:false}).limit(4),
    db.from('assets').select('id,asset_code,project_id,status').order('created_at',{ascending:false}).limit(4),
    db.from('warranties').select('id,warranty_code,project_id,start_date,end_date,status').order('created_at',{ascending:false}).limit(4),
    db.from('service_requests').select('id,request_code,project_id,problem_description,priority,status').order('created_at',{ascending:false}).limit(3)
  ]);
  if(s.error) throw s.error;
  stats=s.data||stats;
  if(!p.error)data.projects=p.data||[];
  if(!a.error)data.assets=a.data||[];
  if(!w.error)data.warranties=w.data||[];
  if(!sv.error)data.services=sv.data||[];
}

async function dashboard(){
  let error='';
  if(db){try{await loadDashboardData()}catch(e){error=esc(e.message||'Gabim gjatë leximit të databazës.')}}
  const serviceRows=data.services.length?data.services.map(x=>`<tr><td>${esc(x.request_code)}</td><td>${esc(x.project_id)}</td><td>${esc(x.problem_description)}</td><td>${esc(prioritySq(x.priority))}</td><td><span class="badge">${esc(statusSq(x.status))}</span></td></tr>`).join(''):'<tr><td colspan="5" class="muted">Nuk ka kërkesa të disponueshme për këtë përdorues.</td></tr>';
  const projects=data.projects.length?data.projects.map(p=>`<div class="project"><div class="project-img">🏠</div><div class="project-body"><strong>${esc(p.project_code)}</strong><p>${esc([p.city,p.address].filter(Boolean).join(', '))}</p><span class="badge">${esc(statusSq(p.status))}</span></div></div>`).join(''):'<div class="muted">Nuk ka projekte.</div>';
  return `${connectionNotice()}${error?`<div class="panel" style="margin-bottom:16px;color:#b91c1c">${error}</div>`:''}<div class="welcome"><div><h2>Mirë se erdhe, Leonard!</h2><div class="muted">Përmbledhje nga databaza LTLINE.</div></div><button class="btn secondary">${new Date().toLocaleDateString('sq-AL')}</button></div><section class="cards"><div class="card">📁 Projekte aktive<div class="metric">${stats.projects}</div><span class="muted">Nga databaza</span></div><div class="card">⚙ Pajisje të regjistruara<div class="metric">${stats.assets}</div><span class="muted">Nga databaza</span></div><div class="card">◈ Garanci aktive<div class="metric">${stats.warranties}</div><span class="muted">Nga databaza</span></div><div class="card">🔧 Kërkesa të hapura<div class="metric">${stats.open_services}</div><span class="muted">Nga databaza</span></div></section><div class="grid2"><div class="panel"><h3>Kërkesat e fundit</h3><table><thead><tr><th>ID Kërkesa</th><th>Objekti</th><th>Problemi</th><th>Prioriteti</th><th>Statusi</th></tr></thead><tbody>${serviceRows}</tbody></table></div><div class="panel"><h3>Veprime të shpejta</h3><div class="actions"><button class="btn" data-view="qr">⌗ Skano QR Code</button><button class="btn secondary" data-view="service-form">🔧 Kërkesë e re shërbimi</button><button class="btn secondary" data-view="projects">⌂ Projektet / objektet</button></div></div></div><div class="panel" style="margin-top:16px"><h3>Projektet e fundit</h3><div class="projects">${projects}</div></div>`;
}

function qr(){return `<div class="panel qrbox"><h2>Skano QR Code</h2><p class="muted">Fut QR ID-në për të gjetur objektin ose asetin në databazën LTLINE.</p><div class="qrvisual"></div><button class="btn" id="camera">📷 HAP KAMERËN</button><div class="form" style="margin:25px auto 0;text-align:left"><label>ID e QR / Objektit</label><input id="qrid" placeholder="LTLINE-QR-2026-0001"><button class="btn" id="resolve" style="margin-top:12px">Hap rekordin</button><div id="qrresult" style="margin-top:16px"></div></div></div>`}

async function resolveQr(id){
  if(!db){toast('Konfigurimi i Supabase mungon.');return;}
  const {data:q,error}=await db.from('qr_codes').select('qr_code,target_type,target_id,status').eq('qr_code',id).eq('status','active').maybeSingle();
  if(error)throw error;
  if(!q){document.getElementById('qrresult').innerHTML='<div class="panel">QR nuk u gjet ose është joaktiv.</div>';return;}
  let html=`<div class="panel"><strong>QR u gjet</strong><p class="muted">${esc(q.qr_code)} · ${esc(q.target_type)}</p>`;
  if(q.target_type==='project'){
    const r=await db.from('projects').select('*').eq('id',q.target_id).maybeSingle();
    if(r.data)html+=`<h3>${esc(r.data.project_code)}</h3><p>${esc(r.data.name)}</p><p class="muted">${esc([r.data.city,r.data.address].filter(Boolean).join(', '))}</p><span class="badge">${esc(statusSq(r.data.status))}</span>`;
  }else if(q.target_type==='asset'){
    const r=await db.from('assets').select('*, products(name,model,manufacturer)').eq('id',q.target_id).maybeSingle();
    if(r.data)html+=`<h3>${esc(r.data.asset_code)}</h3><p>${esc(r.data.serial_number||'')}</p><p class="muted">${esc(r.data.products?.name||'')}</p><span class="badge">${esc(statusSq(r.data.status))}</span>`;
  }
  html+='</div>';document.getElementById('qrresult').innerHTML=html;
}

function serviceForm(){return `<div class="form"><h2>Kërkesë e re shërbimi</h2><p class="muted">Regjistro një problem për objektin ose pajisjen.</p><label>ID Objekt / Pajisje</label><input id="serviceRef" placeholder="LTLINE-H100-2026-0001"><label>Prioriteti</label><select id="servicePriority"><option value="low">I ulët</option><option value="medium" selected>Mesatar</option><option value="high">I lartë</option><option value="critical">Kritik</option></select><label>Përshkrimi i problemit</label><textarea id="serviceProblem" rows="5" placeholder="Përshkruaj problemin..."></textarea><button class="btn" id="submitService" style="margin-top:15px">Dërgo kërkesën</button></div>`}

async function submitService(){
  if(!db){toast('Konfigurimi i Supabase mungon.');return;}
  const ref=document.getElementById('serviceRef').value.trim(), priority=document.getElementById('servicePriority').value, problem=document.getElementById('serviceProblem').value.trim();
  if(!ref||!problem){toast('Plotëso objektin dhe përshkrimin e problemit.');return;}
  const {data:p,error:pErr}=await db.from('projects').select('id,client_id').eq('project_code',ref).maybeSingle();
  if(pErr)throw pErr;
  if(!p){toast('Objekti nuk u gjet.');return;}
  const code='SRV-'+new Date().getFullYear()+'-'+String(Date.now()).slice(-6);
  const {error}=await db.from('service_requests').insert({request_code:code,client_id:p.client_id,project_id:p.id,priority,status:'open',problem_description:problem});
  if(error){toast('Kërkesa nuk u ruajt: '+error.message);return;}
  toast('Kërkesa u ruajt në databazën LTLINE.');render('dashboard');
}

function list(view){const labels={projects:'Projektet / Objektet',products:'Produktet',assets:'Pajisje & Asetet',warranty:'Garancitë',services:'Shërbimet',maintenance:'Mirëmbajtja',history:'Historiku',documents:'Dokumentet',clients:'Klientët'};let rows='';if(view==='projects')rows=data.projects.map(x=>`<tr><td>${esc(x.project_code)}</td><td>${esc(x.name)}</td><td>${esc([x.city,x.address].filter(Boolean).join(', '))}</td><td><span class="badge">${esc(statusSq(x.status))}</span></td></tr>`).join('');else if(view==='services')rows=data.services.map(x=>`<tr><td>${esc(x.request_code)}</td><td>${esc(x.project_id)}</td><td>${esc(x.problem_description)}</td><td><span class="badge">${esc(statusSq(x.status))}</span></td></tr>`).join('');else rows='<tr><td colspan="4" class="muted">Ky modul do të lidhet me databazën në fazën përkatëse.</td></tr>';return `<div class="panel"><h2>${labels[view]}</h2><input class="search" placeholder="Kërko..."><table><thead><tr><th>ID</th><th>Referenca</th><th>Detaje</th><th>Statusi</th></tr></thead><tbody>${rows||'<tr><td colspan="4" class="muted">Nuk ka të dhëna.</td></tr>'}</tbody></table></div>`}

async function render(view='dashboard'){title.textContent=view==='dashboard'?'Dashboard':view==='qr'?'Skano QR':view==='service-form'?'Kërkesë e re shërbimi':({projects:'Projektet / Objektet',products:'Produktet',assets:'Pajisje & Asetet',warranty:'Garancitë',services:'Shërbimet',maintenance:'Mirëmbajtja',history:'Historiku',documents:'Dokumentet',clients:'Klientët'}[view]||view);app.innerHTML='<div class="panel">Duke ngarkuar...</div>';if(view==='dashboard')app.innerHTML=await dashboard();else if(view==='qr')app.innerHTML=qr();else if(view==='service-form')app.innerHTML=serviceForm();else app.innerHTML=list(view);bind()}

function bind(){document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));const n=document.querySelector(`.nav-item[data-view="${b.dataset.view}"]`);if(n)n.classList.add('active');render(b.dataset.view)});const r=document.getElementById('resolve');if(r)r.onclick=async()=>{const id=document.getElementById('qrid').value.trim()||'LTLINE-QR-2026-0001';try{await resolveQr(id)}catch(e){toast('Gabim: '+e.message)}};const c=document.getElementById('camera');if(c)c.onclick=()=>toast('Skaneri me kamerë do të shtohet në modulin QR V2.');const s=document.getElementById('submitService');if(s)s.onclick=async()=>{try{await submitService()}catch(e){toast('Gabim: '+e.message)}}}
document.getElementById('menuBtn').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');document.getElementById('contactBtn').onclick=()=>toast('Kontakti LTLINE do të lidhet me modulin e njoftimeve.');render();