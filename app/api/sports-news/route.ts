import { NextResponse } from "next/server";
export const dynamic="force-dynamic";

const feeds=[
  ["MLB","https://www.espn.com/espn/rss/mlb/news"],
  ["NFL","https://www.espn.com/espn/rss/nfl/news"],
  ["NHL","https://www.espn.com/espn/rss/nhl/news"],
  ["COLLEGE","https://www.espn.com/espn/rss/ncf/news"],
];

function clean(v:string){return v.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&#39;|&apos;/g,"'").replace(/\s+/g," ").trim()}
function tag(text:string){
  const t=text.toLowerCase();
  if(/cardinals|st\. louis cardinals/.test(t))return "CARDINALS";
  if(/blues|st\. louis blues/.test(t))return "BLUES";
  if(/missouri|mizzou/.test(t))return "MIZZOU";
  if(/st\. louis city|city sc/.test(t))return "CITY SC";
  return "";
}
async function load([source,url]:string[]){
  try{
    const r=await fetch(url,{cache:"no-store",headers:{"User-Agent":"JaskiHomepage/14.1"}});
    if(!r.ok)return [];
    const xml=await r.text();
    return Array.from(xml.matchAll(/<item[\s\S]*?<\/item>/gi)).slice(0,8).map(m=>{
      const x=m[0];
      const get=(n:string)=>{const q=x.match(new RegExp(`<${n}[^>]*>([\\\\s\\\\S]*?)<\\\\/${n}>`,"i"));return q?clean(q[1]):""};
      const title=get("title"),href=get("link"),pub=get("pubDate"),d=pub?new Date(pub):null;
      return {title,source,href,tag:tag(title),date:d&&!Number.isNaN(d.getTime())?new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(d):"",time:d&&!Number.isNaN(d.getTime())?d.getTime():0};
    }).filter(x=>x.title&&x.href);
  }catch{return []}
}
export async function GET(){
  const groups=await Promise.all(feeds.map(load));
  const all=groups.flat().sort((a,b)=>(b.tag?1:0)-(a.tag?1:0)||b.time-a.time);
  const seen=new Set<string>(); const stories=[];
  for(const s of all){
    const k=s.title.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
    if(seen.has(k))continue; seen.add(k); stories.push(s);
    if(stories.length===6)break;
  }
  return NextResponse.json({updatedAt:new Intl.DateTimeFormat("en-US",{timeZone:"America/Chicago",hour:"numeric",minute:"2-digit"}).format(new Date()),stories:stories.map(({time,...s})=>s)});
}
