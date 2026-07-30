import Link from "next/link";
import Sidebar from "../../../components/Sidebar";
export default function Kitchen(){return <main className="app-shell"><Sidebar activePage="food"/><section className="content-stage"><div style={{padding:48}}><p style={{fontWeight:800,letterSpacing:'.12em',fontSize:11,color:'#68758b'}}>FOOD / KITCHEN MODE</p><h1 style={{fontSize:48,margin:'8px 0'}}>Kitchen Mode</h1><p style={{color:'#68758b'}}>The focused cooking interface starts in Sprint 17.2.</p><Link href="/food">← Back to Food</Link></div></section></main>}
