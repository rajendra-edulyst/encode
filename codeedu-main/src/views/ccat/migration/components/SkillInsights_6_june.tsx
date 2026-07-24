import React, { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/services/learner/OpportunitieService";
import Container from "./Container";
import styles from "./SkillInsights.module.css";
import { fetchFunctionalDomains } from "@/services/getting-started";
import { FunctionalDomain } from "@/@types/getting-started";

export type SkillInsightsType = {
  className?: string;
};

const SkillInsights: FunctionComponent<SkillInsightsType> = ({
  className = "",
}) => {
  const [domains, setDomains] = useState<FunctionalDomain[]>([]);

  const { data: jobListResponse } = useQuery({
    queryKey: ['jobListWow'],
    queryFn: () => fetchJobs(),
  });

  const rawJobs = Array.isArray(jobListResponse) ? jobListResponse : (jobListResponse?.data || []);
  const jobs = rawJobs.filter((job: any) => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/cci-stage-4')) {
      return job.is_match === 1;
    }
    return true;
  });

  const formatJobName = (name: string) => {
    if (!name) return null;
    const words = name.split(' ');
    const lines = [];
    for (let i = 0; i < words.length; i += 2) {
      lines.push(words.slice(i, i + 2).join(' '));
    }

    if (lines.length === 1) {
      return (
        <>
          {lines[0]}
          <br />
          &nbsp;
        </>
      );
    }

    return (
      <>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  };

  useEffect(() => {
    const getDomains = async () => {
      try {
        const data = await fetchFunctionalDomains();
        const mappedDomains = data.filter(d => d.is_mapped === 1);
        setDomains(mappedDomains);
      } catch (error) {
        console.error("Failed to fetch functional domains:", error);
      }
    };
    getDomains();
  }, []);

  return (
    <section className={[styles.skillInsights, className].join(" ")}>
      <div className={styles.skillsprogress}>
        <div className={styles.container}>
          <h3 className={styles.currentSkills}>Current Skills</h3>
        </div>
        <div className={styles.container2}>
          <div className={styles.skill1}>
            <div className={styles.container3}>
              <div className={styles.container4}>
                <img className={styles.containerIcon} alt="" />
                <div className={styles.container5}>
                  <b className={styles.creativeThinking}>Creative Thinking</b>
                </div>
              </div>
              <div className={styles.div}>85%</div>
            </div>
            <div className={styles.container6}>
              <div className={styles.container7} />
            </div>
          </div>
          <div className={styles.skill1}>
            <div className={styles.container3}>
              <div className={styles.container4}>
                <img className={styles.containerIcon} alt="" />
                <div className={styles.container5}>
                  <b className={styles.creativeThinking}>Visual Sense</b>
                </div>
              </div>
              <div className={styles.div}>72%</div>
            </div>
            <div className={styles.container11}>
              <div className={styles.container12} />
            </div>
          </div>
          <div className={styles.skill1}>
            <div className={styles.container3}>
              <div className={styles.container4}>
                <img className={styles.containerIcon} alt="" />
                <div className={styles.container5}>
                  <b className={styles.creativeThinking}>Problem Solving</b>
                </div>
              </div>
              <div className={styles.div}>68%</div>
            </div>
            <div className={styles.container16}>
              <div className={styles.container17} />
            </div>
          </div>
          <div className={styles.skill1}>
            <div className={styles.container3}>
              <div className={styles.container4}>
                <img className={styles.containerIcon} alt="" />
                <div className={styles.container5}>
                  <b className={styles.creativeThinking}>Logical Reasoning</b>
                </div>
              </div>
              <div className={styles.div}>55%</div>
            </div>
            <div className={styles.container21}>
              <div className={styles.container22} />
            </div>
          </div>
          <div className={styles.skill1}>
            <div className={styles.container3}>
              <div className={styles.container4}>
                <img className={styles.containerIcon} alt="" />
                <div className={styles.container5}>
                  <b className={styles.creativeThinking}>Design Awareness</b>
                </div>
              </div>
              <div className={styles.div}>78%</div>
            </div>
            <div className={styles.container6}>
              <div className={styles.container27} />
            </div>
          </div>
        </div>
        <div className={styles.skillVisuals}>
          <div className={styles.visualSense2}>
            <img
              className={styles.image432Icon}
              alt=""
              src="/image-432@2x.png"
            />
            <img
              className={styles.asset13}
              loading="lazy"
              alt=""
              src="/Asset-1-3@2x.png"
            />
            <div className={styles.rectangleParent}>
              <div className={styles.frameChild} />
              <b className={styles.visualSense3}>
                Visual
                <br />
                Sense
              </b>
              <div className={styles.proficiencyLabels}>
                <b className={styles.primary}>Primary</b>
              </div>
            </div>
            <img className={styles.visualSenseChild} alt="" />
          </div>
          <div className={styles.problemSolving2}>
            <img
              className={styles.image432Icon2}
              alt=""
              src="/image-432@2x.png"
            />
            <img
              className={styles.asset13}
              loading="lazy"
              alt=""
              src="/Asset-1-31@2x.png"
            />
            <img className={styles.problemSolvingChild} alt="" />
            <div className={styles.rectangleGroup}>
              <div className={styles.frameItem} />
              <b className={styles.problemSolving3}>
                Problem
                <br />
                Solving
              </b>
              <div className={styles.secondaryWrapper}>
                <b className={styles.secondary}>Secondary</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.domainprogress}>
        <div className={styles.container28}>
          <h3 className={styles.currentDomains}>Current Domains</h3>
          <div className={styles.domains}>{domains.length} Domains</div>
        </div>
        <div className={styles.domainVisuals}>
          {domains.map((domain, index) => (
            <Container
              key={domain.id}
              spatialExperienceDesign={domain.name}
              child_domains={domain.child_domains}
              p={index === 0 ? "P" : "S"}
              proficiencyLabelsBackgroundColor={index === 0 ? undefined : "#e60086"}
              rectangleDivBackgroundColor={index === 0 ? undefined : "#e60086"}
            />
          ))}
        </div>
      </div>
      <div className={styles.jobRoles}>
        <div className={styles.container28}>
          <h3 className={styles.currentDomains}>Job Roles</h3>
          <div className={styles.domains}>2 Domains</div>
        </div>
        <div className={styles.containerParent}>
          <div className={styles.container30}>
            <div className={styles.domain1}>
              <div className={styles.container31}>
                <img className={styles.containerIcon6} alt="" />
                <div className={styles.container32}>
                  <div className={styles.text}>
                    <div className={styles.primary2}>Primary</div>
                  </div>
                  <b
                    className={styles.spatialExperience}
                  >{`Spatial & Experience Design`}</b>
                  <div className={styles.creativeThinking}>
                    <ul className={[styles.interiorDesignExhibitionDes, "list-disc"].join(" ")}>
                      <li>Interior Design</li>
                      <li>Exhibition Design</li>
                      <li>Retail Design</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={styles.container33}>
                <div className={styles.container3}>
                  <div className={styles.creativeThinking}>Progress</div>
                  <div className={styles.div6}>78%</div>
                </div>
                <div className={styles.container6}>
                  <div className={styles.container36} />
                </div>
              </div>
            </div>
            <div className={styles.domain3}>
              <div className={styles.container37}>
                <img className={styles.containerIcon7} alt="" />
                <div className={styles.container32}>
                  <div className={styles.text2}>
                    <div className={styles.primary2}>Primary</div>
                  </div>
                  <div className={styles.heading3}>
                    <b className={styles.productDesign}>Product Design</b>
                  </div>
                  <div className={styles.paragraph}>
                    <div className={styles.coursesCompleted}>
                      2/4 courses completed
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container39}>
                <div className={styles.container3}>
                  <div className={styles.creativeThinking}>Progress</div>
                  <div className={styles.div6}>45%</div>
                </div>
                <div className={styles.container6}>
                  <div className={styles.container42} />
                </div>
              </div>
            </div>
            <div className={styles.container43}>
              <div className={styles.container44}>
                <img className={styles.containerIcon7} alt="" />
                <div className={styles.container45}>
                  <div className={styles.text3}>
                    <div className={styles.primary2}>Secondary</div>
                  </div>
                  <div className={styles.heading32}>
                    <div className={styles.frontendDevelopment}>
                      Frontend Development
                    </div>
                  </div>
                  <div className={styles.paragraph2}>
                    <div className={styles.coursesCompleted2}>
                      2/4 courses completed
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container46}>
                <div className={styles.container47}>
                  <div className={styles.text4}>
                    <div className={styles.progress3}>Progress</div>
                  </div>
                  <div className={styles.text5}>
                    <div className={styles.progress3}>45%</div>
                  </div>
                </div>
                <div className={styles.container6}>
                  <div className={styles.container49} />
                </div>
              </div>
            </div>
            <div className={styles.containerChild} />
            <b className={styles.p}>P</b>
          </div>
          <div className={styles.container30}>
            <div className={styles.domain1}>
              <div className={styles.container31}>
                <img className={styles.containerIcon6} alt="" />
                <div className={styles.container32}>
                  <div className={styles.text}>
                    <div className={styles.primary2}>Primary</div>
                  </div>
                  <b
                    className={styles.spatialExperience}
                  >{`Game & Interactive Design`}</b>
                  <div className={styles.creativeThinking}>
                    <ul className={styles.interiorDesignExhibitionDes}>
                      <li>Game Design</li>
                      <li>Level Design</li>
                      <li>Interactive Art</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={styles.container33}>
                <div className={styles.container3}>
                  <div className={styles.creativeThinking}>Progress</div>
                  <div className={styles.div6}>78%</div>
                </div>
                <div className={styles.container6}>
                  <div className={styles.container36} />
                </div>
              </div>
            </div>
            <div className={styles.domain3}>
              <div className={styles.container37}>
                <img className={styles.containerIcon7} alt="" />
                <div className={styles.container32}>
                  <div className={styles.text2}>
                    <div className={styles.primary2}>Primary</div>
                  </div>
                  <div className={styles.heading3}>
                    <b className={styles.productDesign}>Product Design</b>
                  </div>
                  <div className={styles.paragraph}>
                    <div className={styles.coursesCompleted}>
                      2/4 courses completed
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container39}>
                <div className={styles.container3}>
                  <div className={styles.creativeThinking}>Progress</div>
                  <div className={styles.div6}>45%</div>
                </div>
                <div className={styles.container6}>
                  <div className={styles.container42} />
                </div>
              </div>
            </div>
            <div className={styles.container43}>
              <div className={styles.container44}>
                <img className={styles.containerIcon7} alt="" />
                <div className={styles.container45}>
                  <div className={styles.text3}>
                    <div className={styles.primary2}>Secondary</div>
                  </div>
                  <div className={styles.heading32}>
                    <div className={styles.frontendDevelopment}>
                      Frontend Development
                    </div>
                  </div>
                  <div className={styles.paragraph2}>
                    <div className={styles.coursesCompleted2}>
                      2/4 courses completed
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.container46}>
                <div className={styles.container47}>
                  <div className={styles.text4}>
                    <div className={styles.progress3}>Progress</div>
                  </div>
                  <div className={styles.text5}>
                    <div className={styles.progress3}>45%</div>
                  </div>
                </div>
                <div className={styles.container6}>
                  <div className={styles.container49} />
                </div>
              </div>
            </div>
            <div className={styles.containerItem} />
            <b className={styles.p}>S</b>
          </div>
        </div>
        <div className={styles.roleOptions}>
          {jobs.slice(0, 5).map((job: any) => (
            <div key={job.id} className={styles.accessoryDesignerWrapper}>
              <div className={styles.creativeThinking}>
                {formatJobName(job.name)}
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className={styles.creativeThinking}>Loading...</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillInsights;
