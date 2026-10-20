const FIN={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
const norm=s=>[...s].map(c=>FIN[c]||c).join('');
// Port of Letroso's alignment scorer: 0 absent, 1 present, 2 head, 3 tail
function align(answer,guess){
  const n=[...norm(answer)],r=[...norm(guess)];
  const T=Array.from({length:n.length+1},()=>Array.from({length:r.length+1},()=>({cost:0,paths:[]})));
  T[0][0]={cost:0,paths:[[]]};
  for(let i=1;i<=n.length;i++)T[i][0]={cost:i,paths:T[i-1][0].paths.map(p=>[...p,'+'])};
  for(let j=1;j<=r.length;j++)T[0][j]={cost:j,paths:T[0][j-1].paths.map(p=>[...p,'-'])};
  for(let i=1;i<=n.length;i++)for(let j=1;j<=r.length;j++){
    const m=T[i-1][j-1].cost+(n[i-1]===r[j-1]?0:Infinity),a=T[i-1][j].cost+1,b=T[i][j-1].cost+1,c=Math.min(a,b,m),paths=[];
    if(c===m)paths.push(...T[i-1][j-1].paths.map(p=>[...p,'>']));
    if(c===a)paths.push(...T[i-1][j].paths.map(p=>[...p,'+']));
    if(c===b)paths.push(...T[i][j-1].paths.map(p=>[...p,'-']));
    T[i][j]={cost:c,paths};
  }
  let best=-Infinity,cands=[];
  for(const p of T[n.length][r.length].paths){
    const start=p[0]==='>',end=p[p.length-1]==='>',pat=Array(r.length).fill(0),pool=[...n];
    let matches=0,run=0,score=(start?1:0)+(end?1:0),f=0;
    for(const s of p){
      if(s==='>'){matches++;run++;pat[f]=run===1?2:3;pool.splice(pool.indexOf(r[f]),1);score+=3*run;f++;}
      else if(s==='+')run=0;
      else{run=0;f++;}
    }
    for(let k=0;k<r.length;k++)if(pat[k]===0&&pool.includes(r[k])){pat[k]=1;pool.splice(pool.indexOf(r[k]),1);}
    if(matches===1&&!start&&!end)pat[pat.indexOf(2)]=1;
    if(score===best)cands.push({pat,start,end});else if(score>best){best=score;cands=[{pat,start,end}];}
  }
  cands.sort((x,y)=>x.pat.join()<y.pat.join()?1:-1);
  return cands[0];
}
function score(answer,guess){
  const {pat,start,end}=align(answer,guess),L=[...guess].length;
  const out=pat.map((v,i)=>({cls:['absent','present','head','tail'][v],start:i===0&&start,end:i===L-1&&end}));
  const pres=out.filter(o=>o.cls==='present').length,abs=out.filter(o=>o.cls==='absent').length;
  if(pres===1&&abs===L-1)out.find(o=>o.cls==='present').cls='one';
  return out;
}
if(typeof module!=='undefined')module.exports={score,norm};
