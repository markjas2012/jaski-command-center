import Sidebar from "../../components/Sidebar";
import JamHero from "../../components/JamHero";
import theme from "./jam-festival.module.css";

export default function JamPage() {
  return (
    <div className={`app-shell ${theme.lodgeShell}`}>
      <Sidebar activePage="jam" />
      <section className={`content-shell ${theme.lodge}`}>
        <JamHero />
      </section>
    </div>
  );
}
