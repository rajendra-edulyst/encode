import { FunctionComponent } from "react";
import styles from "./Header.module.css";

export type HeaderType = {
  className?: string;
};

const Header: FunctionComponent<HeaderType> = ({ className = "" }) => {
  return (
    <section className={[styles.header, className].join(" ")}>
      <div className={styles.headerChild} />
      <img className={styles.lightModeIcon} alt="" />
      <img
        className={styles.logoLightFull1Icon}
        loading="lazy"
        alt=""
        src="/logo-light-full-1@2x.png"
      />
      <img className={styles.notificationsUnreadIcon} alt="" />
      <img className={styles.headerItem} alt="" />
      <div className={styles.frameParent}>
        <div className={styles.ellipseParent}>
          <div className={styles.frameChild} />
          <div className={styles.div}>75%</div>
          <div className={styles.frameItem} />
        </div>
        <div className={styles.completeYourProfile}>Complete your Profile</div>
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
          <img className={styles.screenshot20250520At338Icon} alt="" />
          <img className={styles.lucidehistoryIcon} alt="" />
          <img
            className={styles.lucidebellIcon}
            alt=""
            src="/lucide-bell.svg"
          />
          <img className={styles.lucidehistoryIcon} alt="" />
          <div className={styles.frameWrapper}>
            <div className={styles.lucidestarParent}>
              <img className={styles.lucidestarIcon} alt="" />
              <div className={styles.div2}>131</div>
            </div>
          </div>
          <img
            className={styles.notificationsIcon}
            loading="lazy"
            alt=""
            src="/Notifications@2x.png"
          />
        </div>
      </div>
      <b className={styles.beta}>BETA</b>
    </section>
  );
};

export default Header;
