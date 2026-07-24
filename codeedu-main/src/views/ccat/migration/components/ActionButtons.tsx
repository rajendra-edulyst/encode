import { FunctionComponent, useCallback } from "react";
import styles from "./ActionButtons.module.css";
import { useUserProfile, useUserPackageDetails } from "@/hooks/data/useGettingStarted";

export type ActionButtonsType = {
  className?: string;
  onSubmit?: () => void;
  packageDetailsRes?: any
};

const ActionButtons: FunctionComponent<ActionButtonsType> = ({
  className = "",
  onSubmit,
  packageDetailsRes
}) => {
  const onTagClick = useCallback(() => {
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit]);

  const items = packageDetailsRes?.data?.user_package_parameter_items || [];

  const createItems = items.filter((item: any) => item.package_content_master?.category?.name?.toLowerCase() === 'create');
  const connectItems = items.filter((item: any) => item.package_content_master?.category?.name?.toLowerCase() === 'connect');
  const collaborateItems = items.filter((item: any) => item.package_content_master?.category?.name?.toLowerCase() === 'collaborate');

  return (
    <section className={[styles.actionButtons, className].join(" ")}>
      <div className={styles.create}>
        <div className={styles.createChild} />
        <h3 className={styles.create2}>CREATE</h3>
        <div className={styles.resourceMetrics}>
          {createItems.map((item: any) => (
            <div key={item.id} className={styles.rectangleParent3}>
              <div className={styles.frameChild} />
              <div className={styles.metricTitles}>
                <div className={styles.coursesCompleted}>{item.package_content_master?.label}</div>
              </div>
              <b className={styles.metricDividers}>{item.used_access_count || 0}</b>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.connectParent}>
        <div className={styles.connect}>
          <div className={styles.createChild} />
          <h3 className={styles.connect2}>CONNECT</h3>
          <div className={styles.resourceMetrics}>
            {connectItems.map((item: any) => (
              <div key={item.id} className={styles.rectangleParent3}>
                <div className={styles.frameChild} />
                <div className={styles.metricTitles}>
                  <div className={styles.coursesCompleted}>{item.package_content_master?.label}</div>
                </div>
                <b className={styles.communitySeparator}>{item.used_access_count || 0}</b>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.collaborate}>
          <div className={styles.createChild} />
          <h3 className={styles.collaborate2}>COLLABORATE</h3>
          <div className={styles.collaborateItem} />
          <div className={styles.resourceMetrics}>
            {collaborateItems.map((item: any) => (
              <div key={item.id} className={styles.rectangleParent3}>
                <div className={styles.frameChild} />
                <div className={styles.metricTitles}>
                  <div className={styles.coursesCompleted}>{item.package_content_master?.label}</div>
                </div>
                <b className={styles.input}>{item.used_access_count || 0}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className={styles.tag} onClick={onTagClick}>
        <div className={styles.submitButton}>
          <button className={styles.submitReport}>
            Submit
            <br />
            Report
          </button>
        </div>
      </button>
    </section>
  );
};

export default ActionButtons;
