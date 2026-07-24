import { FunctionComponent } from "react";
import styles from "./LandingPage.module.css";

export type LandingPageType = {
  className?: string;
};

const LandingPage: FunctionComponent<LandingPageType> = ({
  className = "",
}) => {
  return (
    <section className={[styles.landingPage, className].join(" ")}>
      <header className={styles.header}>
        <div className={styles.headerChild} />
        <img className={styles.lightModeIcon} alt="" src="/ccat-landing-page/light-mode.svg" />
        <img
          className={styles.logoLightFull1Icon}
          loading="lazy"
          alt=""
          src="/ccat-landing-page/logo-light-full-1@2x.png"
        />
        <img
          className={styles.notificationsUnreadIcon}
          alt=""
          src="/ccat-landing-page/notifications-unread.svg"
        />
        <img className={styles.headerItem} alt="" src="/ccat-landing-page/Rectangle-74@2x.png" />
        <div className={styles.frameParent}>
          <div className={styles.ellipseParent}>
            <div className={styles.frameChild} />
            <div className={styles.div}>75%</div>
            <div className={styles.frameItem} />
          </div>
          <div className={styles.completeYourProfile}>
            Complete your Profile
          </div>
        </div>
        <div className={styles.groupTabBar}>
          <div className={styles.groupContent}>
            <div className={styles.tab}>
              <b className={styles.create}>CREATE</b>
            </div>
            <div className={styles.tab2}>
              <b className={styles.create}>CONNECT</b>
            </div>
            <div className={styles.tab3}>
              <b className={styles.create}>COLLABORATE</b>
            </div>
            <div className={styles.tab4}>
              <b className={styles.create}>CCIQ</b>
            </div>
          </div>
        </div>
        <div className={styles.headerInner}>
          <div className={styles.screenshot20250520At338Parent}>
            <img
              className={styles.screenshot20250520At338Icon}
              alt=""
              src="/ccat-landing-page/Screenshot-2025-05-20-at-3-38-18-PM-2-removebg-preview-1@2x.png"
            />
            <img
              className={styles.lucidehistoryIcon}
              alt=""
              src="/ccat-landing-page/lucide-history.svg"
            />
            <img
              className={styles.lucidebellIcon}
              alt=""
              src="/ccat-landing-page/lucide-bell.svg"
            />
            <img
              className={styles.lucidehistoryIcon}
              alt=""
              src="/ccat-landing-page/lucide-chart-column-big.svg"
            />
            <div className={styles.frameWrapper}>
              <div className={styles.lucidestarParent}>
                <img
                  className={styles.lucidestarIcon}
                  alt=""
                  src="/ccat-landing-page/lucide-star.svg"
                />
                <div className={styles.div2}>131</div>
              </div>
            </div>
            <img
              className={styles.profileIcon}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/Profile-Icon@2x.png"
            />
          </div>
        </div>
        <b className={styles.beta}>BETA</b>
      </header>
    </section>
  );
};

export default LandingPage;
