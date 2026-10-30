// demo-tour.js - Self-playing demo for a screen recording (LinkedIn video): open the page with ?demo=1 (or ?demo=1&area=cities/ahr).
// Plays the main features on the loaded area with captions and title cards, about 80 s. Does nothing without ?demo.
// Esc stops it. The app runs as usual underneath: every number on screen is the real model output.
// Loaded as a classic script: top-level names are shared between files (order set in index.html).

const DEMO=new URLSearchParams(location.search).has('demo');
if(DEMO){
  const st=document.createElement('style'); st.textContent=`
#demoCap{position:fixed;left:50%;bottom:34px;transform:translateX(-50%);z-index:9999;max-width:min(1100px,calc(100% - 32px));padding:14px 26px;border-radius:12px;
  background:rgba(8,20,28,.86);color:#fff;font:600 26px/1.3 var(--f-body),system-ui,sans-serif;text-align:center;box-shadow:0 6px 30px rgba(0,0,0,.4);opacity:0;transition:opacity .45s;pointer-events:none}
#demoCap small{display:block;font-weight:400;font-size:19px;opacity:.85;margin-top:4px}
#demoCard{position:fixed;inset:0;z-index:10000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;
  background:radial-gradient(circle at 50% 40%,#0f3a4d,#06141c);color:#fff;font-family:var(--f-body),system-ui,sans-serif;text-align:center;opacity:0;transition:opacity .7s;pointer-events:none}
#demoCard h1{font:800 64px/1.05 var(--f-display),sans-serif;letter-spacing:.02em;text-transform:uppercase;margin:0}
#demoCard p{font-size:28px;margin:0;opacity:.92} #demoCard .s{font-size:20px;opacity:.72}`; document.head.appendChild(st);
  const cap=document.createElement('div'); cap.id='demoCap'; document.body.appendChild(cap);
  const card=document.createElement('div'); card.id='demoCard'; card.style.opacity=1; document.body.appendChild(card);
  let stop=false; document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ stop=true; cap.style.opacity=0; card.style.opacity=0; } });
  const wait=ms=>new Promise((res,rej)=>setTimeout(()=>stop?rej('stopped'):res(),ms));
  const say=(t,s)=>{ cap.style.opacity=0; setTimeout(()=>{ cap.innerHTML=t?t+(s?`<small>${s}</small>`:''):''; cap.style.opacity=t?1:0; },250); };
  const show=html=>{ if(html){ card.innerHTML=html; card.style.opacity=1; } else card.style.opacity=0; };
  const until=async(f,ms=60000)=>{ const t=Date.now(); while(!f()){ if(Date.now()-t>ms) return false; await wait(300); } return true; };
  show(`<h1>Flood Scenario Explorer</h1><p>Loading the team data…</p>`);
  (async()=>{ try{
    // wait for the real data, the evacuation run and the best plan (never the synthetic demo data)
    if(!await until(()=>typeof D!=='undefined'&&D&&!isDemo&&DR.run&&DR.best&&ready&&$('srvLoad').hidden,90000)){ show(`<h1>Flood Scenario Explorer</h1><p>The data did not load: start the app server and reload.</p>`); return; }
    const big=['Pepinster','Verviers','Bad Neuenahr-Ahrweiler','Chênée'].map(n=>D.towns?.find(t=>t.name===n)).find(Boolean),focus=big?.c||E.shelters[0]?.c||[(D.bbox[0]+D.bbox[2])/2,(D.bbox[1]+D.bbox[3])/2];
    setBasemap('satellite'); setPanel(true); setDock(false); S.sizeIdx=Math.min(1,D.rps.length-1); $('size').value=S.sizeIdx; $('size').oninput({target:$('size')});
    if($('loop')) $('loop').checked=false; S.T=0; render(); map.fitBounds(D.bbox,{padding:40,duration:0});
    show(`<h1>Flood Scenario Explorer</h1><p>What if the July 2021 flood came back tomorrow?</p><p class="s">European AI Challenge 2026 · Team 3</p>`); await wait(4500);
    show(''); say(`${esc(STUDY.name)}: real EU flood maps, residents and buildings`,'EFAS hazard maps · GHS-POP · GHS-OBAT · Copernicus EMS · OpenStreetMap'); await wait(5500);
    say('Choose the flood and the scenario before pressing play','flood size, warning time, how fast the water rises, people who follow the order, shelter places'); await wait(5500);
    setDock(true); setPanel(false); setTimeout(()=>map.resize(),350); setSpeed(4); setPlaying(true); map.flyTo({center:focus,zoom:14.2,duration:4000});
    say('Press play: the water rises from the river, upstream first','streets turn red when closed to cars (more than 0.3 m of water)'); await wait(6500);
    say('Each street is told which shelter to drive to','cars follow real streets and avoid any flooded road'); await wait(5500);
    say('Shelters fill up: when one is full, cars go on to the next one','buildings change colour with the deepest water they got'); await wait(5500);
    setMode('3d'); setTimeout(()=>map.easeTo({center:focus,zoom:15.4,pitch:62,bearing:-28,duration:3500}),400);
    say('In 3D, buildings lower than the water are under water','heights from the EU building data (GHS-OBAT)'); await wait(8000);
    setMode('2d'); setTimeout(()=>{ if(E.shelters[0]){ map.easeTo({center:E.shelters[0].c,zoom:13.6,pitch:0,bearing:0,duration:2500}); selectShelter(0); } },600);
    say('Click a shelter: the streets it serves, and why it was chosen','dry, outside every mapped flood, close to the people at risk');
    await until(()=>!$('runEnd').hidden,25000); await wait(800);
    selectShelter(null); say('After each run: how many more people were evacuated than with no order','and a PDF report for the crisis coordinator'); await wait(5500);
    $('runEnd').hidden=true; showDebrief(); say('Best actions: 32 combinations tested on the same flood','the sequence of actions that gets the most people out, with the time of each step'); await wait(7000);
    $('drillClose').click(); await openReport(); say('The report answers the coordinator’s four questions','exposure, shelters, most exposed towns, best actions, costs, limits'); await wait(4000);
    for(let i=0;i<16;i++){ $('docFrame').contentWindow?.scrollBy({top:120,behavior:'smooth'}); await wait(350); } await wait(1500);
    $('docClose').click(); $('srcBtn').click(); say('Every number is traced to its dataset, with its limits','a planning tool on EU flood maps, not a forecast'); await wait(5500);
    $('docClose').click(); say(''); setPanel(true);
    show(`<h1>Flood Scenario Explorer</h1><p>Plan the evacuation before the water arrives</p><p class="s">Also: the Ahr valley (DE) and 18 areas mapped by satellite in July 2021 in BE, DE and NL</p>
      <p class="s">Data: Copernicus EMS · EFAS · GHS-OBAT · GHS-POP (JRC) · © OpenStreetMap contributors</p><p class="s">github.com/Bababoi-dev/team3-flood-explorer</p>`);
  }catch(e){ if(e!=='stopped') console.error(e); } })();
}
