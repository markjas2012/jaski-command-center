import Link from "next/link";
import Sidebar from "../../../components/Sidebar";

export default function Recipes() {
  return (
    <main className="app-shell">
      <Sidebar activePage="food" />
      <section className="content-stage" aria-label="Recipe Book">
        <div style={{minHeight:"100%",padding:48,borderRadius:25,background:"linear-gradient(145deg,#241f18,#151a16)",color:"#f6f0e3"}}>
          <p style={{margin:0,fontWeight:900,letterSpacing:".16em",fontSize:10,color:"#d0ad6c"}}>FOOD / RECIPE BOOK</p>
          <h1 style={{fontFamily:"Georgia, serif",fontWeight:500,fontSize:64,letterSpacing:"-.045em",margin:"10px 0 12px"}}>Recipe Book.</h1>
          <p style={{maxWidth:620,color:"#aaa296",lineHeight:1.6}}>Your personal recipe collection lives here. The library itself begins in the next Food sprint.</p>
          <Link href="/food" style={{display:"inline-block",marginTop:28,color:"#d0ad6c",textDecoration:"none",fontWeight:800}}>← Back to Food</Link>
        </div>
      </section>
    </main>
  );
}
