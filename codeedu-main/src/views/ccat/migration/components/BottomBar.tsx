import { FunctionComponent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import styles from "./BottomBar.module.css";

export type BottomBarType = {
  className?: string;
};

const BottomBar: FunctionComponent<BottomBarType> = ({ className = "" }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation()
  const persona = searchParams.get('persona');

  if (location.pathname === "/cci-stage-4" && (persona && persona === "1")) return

  return (
    <section className={[styles.bottomBar, className, "z-9"].join(" ")}>
      <div className={styles.bottomBarChild} />
      <div className={styles.bottomInfo}>
        <h3 className={styles.faqSupport}>
          <Link to="/help-center?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link> | <Link to="/queries?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
        </h3>
        {/*<h3 className={styles.attemptsLeft23}>Attempts Left: 2/3</h3>*/}
      </div>
      <div className={styles.copyrightNoticeWrapper}>
        <div className={styles.copyrightNotice}>
          <img className={styles.copyrightIcon} alt="" src="/copyright.svg" />
          <h3 className={styles.copyrights2025All}>
            Copyrights 2026 All rights reserved by CODE EDU
          </h3>
        </div>
      </div>
    </section>
  );
};

export default BottomBar;
