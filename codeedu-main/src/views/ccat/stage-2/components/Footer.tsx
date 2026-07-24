import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export type FooterType = {
  className?: string;
};

const Footer: FunctionComponent<FooterType> = ({ className = "" }) => {
  return (
    <section className={[styles.footer, className].join(" ")}>
      <div className={styles.footerChild} />
      <div className={`${styles.faqSupportParent} w-full flex justify-center items-center text-center`}>
        <h3 className={`${styles.faqSupport} text-center`}>
          <Link to="/help-center?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link> | <Link to="/queries?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
        </h3>
        {/*<h3 className={styles.attemptsLeft23}>Attempts Left: 2/3</h3>*/}
      </div>
      <div className={styles.copyrightArea}>
        <div className={`${styles.copyright} flex justify-center items-center`}>
          <img className={styles.copyrightIcon} alt="" src="/ccat-landing-page/copyright.svg" />
          <h3 className={`${styles.copyrights2025All} text-center m-0`}>
            Copyrights 2026 All rights reserved by CODE EDU
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Footer;
