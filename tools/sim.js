// Balancing-Simulator: node tools/sim.js <Stunden> <Klicks/s> <Power-Up-Quote>  (TUNE='{"rc":6.1}' für Varianten)
// Schnellere Simulation: 2-s-Schritte, Kauf alle 4 s
global.window = global; global.PZ = { TUNE: JSON.parse(process.env.TUNE || "{}") };
const P=require('path').join(__dirname, '..', 'js') + '/';
for (const f of ['util.js','data.js','loot.js','engine.js','achievements.js']) require(P+f);
const E=PZ.E, U=PZ.U;
const HOURS=+process.argv[2]||30, CPS_CLICK=+(process.argv[3]||3), PU_RATE=+(process.argv[4]||0.6), CR=+(process.env.CR||0.5);
let pending=[]; PZ.on('spawnPowerup', t=>pending.push(t));
let t0=Date.now(), simT=0; E.now=()=>t0+simT*1000;
E.S=E.newState(); E.recalc();
const out=[]; let run=[]; let lastEra=-1; const DT=5;
function perkBuy(){ let b=true; while(b){b=false; const av=PZ.PERKS.filter(p=>E.perkAvailable(p)&&p.cost<=E.S.np).sort((a,b)=>a.cost-b.cost); if(av.length){E.buyPerk(av[0].id);b=true;}} for(const k of ['upg','gen','era']) E.S.auto[k]=true; }
const firstEra={};
for(simT=0; simT<HOURS*3600; simT+=DT){
  const S=E.S;
  for(let c=0;c<CPS_CLICK*DT;c++) E.click(false);
  E.tick(DT);
  while(pending.length){ const p=pending.shift(); if(Math.random()<PU_RATE) E.collectPowerup(p); }
  const w=E.pendingWar(); if(w) E.chooseWar(w.id, w.options[0].id);
  if(E.bossReady()) E.bossStart();
  if(simT%10===0){
    for(const u of E.availableUpgrades()){ if(u.cost<=S.coins*0.9) E.buyUpgrade(u.id); }
    for(let i=0;i<60;i++){ const b=E.bestGen(); if(!b||E.genCost(b.id)>S.coins) break; E.buyGen(b.id,1); }
    if(E.canAdvance()) E.advanceEra();
    if(S.era>=1 && E.binCost()<S.coins*0.02) E.buyBin();
  }
  if(simT%30===0) PZ.checkAchievements();
  if(S.era!==lastEra){ run.push(`E${S.era}@${(S.stats.runTime/60).toFixed(0)}`); lastEra=S.era; if(firstEra[S.era]===undefined) firstEra[S.era]=(simT/3600).toFixed(1); }
  const g=E.crashGain();
  if(S.era>=2 && g>=Math.max(10, S.npTotal*CR) && S.stats.runTime>900){
    out.push(`crash#${S.crashes+1} t=${(simT/3600).toFixed(2)}h run=${(S.stats.runTime/60).toFixed(0)}m E${S.era} +${g} (tot ${S.npTotal+g}) | ${run.join(' ')}`);
    E.crash(); perkBuy(); run=[]; lastEra=-1;
  }
  if(simT%(3600*2)===0 && simT>0) out.push(`  h${simT/3600}: E${S.era} cps=${U.fmt(E.cps)} ach=${Object.keys(S.ach).length} loot=${Object.keys(S.loot).length} bossW/L=${S.stats.bossWins}/${S.stats.bossLosses} np=${U.fmt(S.npTotal)}`);
}
out.push('firstEra(h): '+JSON.stringify(firstEra));
console.log(out.join('\n'));
