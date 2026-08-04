import Sidebar from "../../components/Sidebar";
import JamHero from "../../components/JamHero";
import theme from "./jam-festival.module.css";

export default function JamPage() {
  return (
    <div className={`app-shell ${theme.festivalShell}`}>
      <Sidebar activePage="jam" />
      <section className={`content-shell ${theme.festival}`}>
        <JamHero />
      </section>
    </div>
  );
}
