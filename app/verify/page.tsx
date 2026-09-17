import Sidebar from "@/components/Sidebar";
import DashboardVerification from "@/components/DashboardVerification";
import styles from "./verify.module.css";

export default function VerifyPage() {
  return (
    <main className={styles.shell}>
      <Sidebar activePage="home" />
      <DashboardVerification />
    </main>
  );
}
