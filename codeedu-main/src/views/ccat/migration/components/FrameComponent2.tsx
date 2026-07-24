import React, { FunctionComponent } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs, fetchCciqReportStatistics } from "@/services/learner/OpportunitieService";
import ShortTerms from "./ShortTerms";
import styles from "./FrameComponent2.module.css";
import { useUserProfile } from "@/hooks/data/useGettingStarted";
import { Tooltip } from "@/components/ui";

export type FrameComponent2Type = {
  className?: string;
  shortTermsTermGoals?: string;
  longTermsShortTermGoals?: string;
  shortTermsNext36Months?: string;
  longTermsNext36Months?: string;
  shortTermsRefineYourStorytelling?: string;
  longTermsRefineYourStorytelling?: string;
  shortTermsTakeComprehensive?: string;
  longTermsTakeComprehensive?: string;
};

const FrameComponent2: FunctionComponent<FrameComponent2Type> = ({
  className = "",
  shortTermsTermGoals,
  longTermsShortTermGoals,
  shortTermsNext36Months,
  longTermsNext36Months,
  shortTermsRefineYourStorytelling,
  longTermsRefineYourStorytelling,
  shortTermsTakeComprehensive,
  longTermsTakeComprehensive,
}) => {
  const { data: jobListResponse } = useQuery({
    queryKey: ['jobListWow'],
    queryFn: () => fetchJobs(),
  });

  const { data: cciqStatsResponse } = useQuery({
    queryKey: ['cciqReportStatistics'],
    queryFn: () => fetchCciqReportStatistics(),
  });
  const cciqStats = cciqStatsResponse?.data || cciqStatsResponse || {};

  const { data: userProfile } = useUserProfile();

  const rawJobs = Array.isArray(jobListResponse) ? jobListResponse : ((jobListResponse as any)?.data || []);
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

  return (
    <div className={[styles.heroAreaParent, className].join(" ")}>
      <section className={styles.heroArea}>
        <img className={styles.image441Icon} alt="" src="/image-441@2x.png" />
        <img
          className={styles.logoLightFull1Icon}
          loading="lazy"
          alt=""
          src="/logo-light-full-11@2x.png"
        />
        <div className={styles.brandIdentity}>
          <div className={styles.brandElements}>
            <div className={styles.brandContainer}>
              <img
                className={styles.image442Icon}
                loading="lazy"
                alt=""
                src="/image-442@2x.png"
              />
            </div>
            <b className={styles.creativeCapabilityIndex}>
              CREATIVE CAPABILITY INDEX
            </b>
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <div className={styles.container2}>
          <div className={styles.container3}>
            <b className={styles.cciResult}>CCIQ Result</b>
            <div className={styles.careerCompatibilityIndex}>
              Career Compatibility Index
            </div>
          </div>
          <div className={styles.container4}>
            <div className={styles.assessmentId}>Assessment ID</div>
            <div className={styles.cci2024001523}>{cciqStats?.assessmentId || 'CCI-2024-001523'}</div>
          </div>
        </div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.profileInfo}>
          <div className={styles.greetingArea}>
            <section className={styles.frameParent}>
              <div className={styles.personalMessageWrapper}>
                <div className={styles.personalMessage}>
                  <h1 className={styles.heyRahul}>
                    <span>{`Hey, `}</span>
                    <span className={styles.rahul}>{userProfile?.platform_name || userProfile?.name || 'User'}</span>
                  </h1>
                  <div className={styles.thisIsntAbout}>
                    This isn’t about being perfect—it’s about showing how you
                    think. Your future isn’t defined by one response.
                  </div>
                </div>
              </div>
              <img
                className={styles.spacerIcon}
                loading="lazy"
                alt=""
                src="/Spacer@2x.png"
              />
            </section>
            <div className={styles.scoreDisplay}>
              <div className={styles.scoreContainer}>
                <section className={styles.score}>
                  <div className={styles.container5}>
                    <div className={styles.scoreValues}>
                      <img
                        className={styles.currentScoreIcon}
                        loading="lazy"
                        alt=""
                        src="/Current-Score.svg"
                      />
                      <div className={styles.totalScore}>
                        <h1 className={styles.scoreValue}>{cciqStats?.score ?? 0}</h1>
                      </div>
                      <div className={styles.outOf100}>out of {cciqStats?.max_score ?? 0}</div>
                    </div>
                    <div className={styles.percentageScore}>
                      <div className={styles.percentageArea}>
                        <div className={styles.percentageDisplay}>
                          <div className={styles.container6}>
                            <h3 className={styles.percentageNumber}>{cciqStats?.score ?? 0}%</h3>
                          </div>
                        </div>
                        <div className={styles.yourCciScore}>
                          Your CCIQ Score
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container7}>
                    <div className={styles.container8}>
                      <img
                        className={styles.containerIcon}
                        alt=""
                        src="/Container.svg"
                      />
                      <div className={styles.container9}>
                        <div className={styles.bestFitDomain}>
                          Best Fit Domain
                        </div>
                        <h3 className={styles.uiuxDesign}>{cciqStats?.best_fit_domain || ''}</h3>
                      </div>
                    </div>
                    <button className={styles.container10}>
                      <img className={styles.icon} alt="" src="/Icon1.svg" />
                      <div className={styles.text}>
                        <b className={styles.topPotentialMatch}>
                          TOP POTENTIAL MATCH
                        </b>
                      </div>
                    </button>
                  </div>
                </section>
                <section className={styles.skillAnalysis}>
                  <div className={styles.containerParent}>
                    <div className={styles.container11}>
                      <img
                        className={styles.containerIcon2}
                        alt=""
                        src="/Icon1.svg"
                      />
                      <h3 className={styles.skillAnalysis2}>Skill Analysis</h3>
                    </div>
                    <div className={styles.skillVisuals}>
                      <div className={styles.visualContainers}>
                        <div className={styles.visualElementsWrapper}>
                          <div className={styles.visualElements}>
                            <div className={styles.digitalFluencyVisual}>
                              <img
                                className={styles.currentScoreIcon}
                                alt=""
                                src="/Fluency-Gauge.svg"
                              />
                              <div className={styles.fluencyDetails}>
                                <div className={styles.gaugeLabels}>
                                  <div className={styles.digitalFluencyGraph}>
                                    <div
                                      className={styles.digitalFluencyContainer}
                                    >
                                      <img
                                        className={styles.groupIcon}
                                        loading="lazy"
                                        alt=""
                                        src="/Group4.svg"
                                      />
                                    </div>
                                    <img
                                      className={styles.groupIcon}
                                      loading="lazy"
                                      alt=""
                                      src="/Group.svg"
                                    />
                                  </div>
                                </div>
                                <div className={styles.criticalThinkingDetails}>
                                  <div className={styles.thinkingLabels}>
                                    <img
                                      className={styles.groupIcon}
                                      loading="lazy"
                                      alt=""
                                      src="/Group2.svg"
                                    />
                                  </div>
                                  <img
                                    className={styles.groupIcon}
                                    loading="lazy"
                                    alt=""
                                    src="/Group1.svg"
                                  />
                                </div>
                              </div>
                              <div className={styles.fluencyTitle}>
                                <Tooltip title={cciqStats?.skills?.[0]?.name || ``}>
                                  <div
                                    className={styles.digitalAi}
                                  >{cciqStats?.skills?.[0]?.name || ``}</div>
                                </Tooltip>
                                <div className={styles.expressionRow}>
                                  <div className={styles.skillsAnalysisBar}>{cciqStats?.skills?.[0]?.score ?? 12}</div>
                                </div>
                              </div>
                              <div className={styles.fluencyIndicator}>
                                <img
                                  className={styles.groupIcon}
                                  loading="lazy"
                                  alt=""
                                  src="/Group3.svg"
                                />
                              </div>
                            </div>
                            <div className={styles.thinkingTitle}>
                              <Tooltip title={cciqStats?.skills?.[1]?.name || ""}>
                                <div
                                  className={styles.creativeCritical}
                                >
                                  {cciqStats?.skills?.[1]?.name || (
                                    <>
                                      {`Creative &`}
                                      <br />
                                      {`Critical Thinking`}
                                    </>
                                  )}
                                </div>
                              </Tooltip>
                            </div>
                            <div className={styles.thinkingPercent}>
                              <div className={styles.skillsAnalysisBar}>{cciqStats?.skills?.[1]?.score ?? 12}</div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame}>
                          <Tooltip title={cciqStats?.skills?.[2]?.name || ""}>
                            <div
                              className={styles.problemSolving}
                            >
                              {cciqStats?.skills?.[2]?.name || (
                                <>
                                  {`Problem Solving &`}
                                  <br />
                                  {`System Thinking`}
                                </>
                              )}
                            </div>
                          </Tooltip>
                          <div className={styles.solvingPercent}>
                            <div className={styles.skillsAnalysisBar}>{cciqStats?.skills?.[2]?.score ?? 12}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.leadershipBreakdownWrapper}>
                    <div className={styles.leadershipBreakdown}>
                      <div className={styles.communicationHeader}>
                        <div className={styles.skillHeaders}>
                          <div className={styles.collaborationInsights}>
                            <Tooltip title={cciqStats?.skills?.[3]?.name || ""}>
                              <div
                                className={styles.collaborationLeadership}
                              >
                                {cciqStats?.skills?.[3]?.name || (
                                  <>
                                    {`Collaboration &`}
                                    <br />
                                    {`Leadership`}
                                  </>
                                )}
                              </div>
                            </Tooltip>
                            <div className={styles.leadershipInsights}>
                              <div className={styles.skillsAnalysisBar}>{cciqStats?.skills?.[3]?.score ?? 12}</div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame}>
                          <Tooltip title={cciqStats?.skills?.[4]?.name || ""}>
                            <div
                              className={styles.problemSolving}
                            >
                              {cciqStats?.skills?.[4]?.name || (
                                <>
                                  {`Communication &`}
                                  <br />
                                  {`Expression`}
                                </>
                              )}
                            </div>
                          </Tooltip>
                          <div className={styles.frame2}>
                            <div className={styles.skillsAnalysisBar}>{cciqStats?.skills?.[4]?.score ?? 10}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.container12}>
                    <div className={styles.container13}>
                      <div className={styles.container14} />
                      <div
                        className={styles.creativeCritical2}
                      >{cciqStats?.skills?.[1]?.name || ``}</div>
                    </div>
                    <div className={styles.container13}>
                      <div className={styles.container16} />
                      <div
                        className={styles.creativeCritical2}
                      >{cciqStats?.skills?.[2]?.name || ``}</div>
                    </div>
                    <div className={styles.container13}>
                      <div className={styles.container18} />
                      <div
                        className={styles.creativeCritical2}
                      >{cciqStats?.skills?.[4]?.name || ``}</div>
                    </div>
                    <div className={styles.personalSkills}>
                      <div className={styles.container13}>
                        <div className={styles.container20} />
                        <div
                          className={styles.creativeCritical2}
                        >{cciqStats?.skills?.[0]?.name || ``}</div>
                      </div>
                      <div className={styles.container13}>
                        <div className={styles.container22} />
                        <div
                          className={styles.creativeCritical2}
                        >{cciqStats?.skills?.[3]?.name || ``}</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <section className={styles.containerGroup}>
                <div className={styles.container23}>
                  <div className={styles.heading3}>
                    <h3 className={styles.domainScores}>Domain Scores</h3>
                  </div>
                  <div className={styles.container24}>
                    <div className={styles.container25}>
                      <div className={styles.container26}>
                        <div className={styles.text2}>
                          <div className={styles.uiux}>{cciqStats?.domain_scores?.[0]?.domain || ''}</div>
                        </div>
                        <div className={styles.text3}>
                          <b className={styles.scoreBreaks}>{cciqStats?.domain_scores?.[0]?.score ?? 0} / {cciqStats?.domain_scores?.[0]?.max_score ?? 0}</b>
                        </div>
                      </div>
                      <div className={styles.container27}>
                        <div className={styles.container28} />
                      </div>
                    </div>
                    <div className={styles.container29}>
                      <div className={styles.container26}>
                        <div className={styles.text4}>
                          <div className={styles.adPr}>{cciqStats?.domain_scores?.[1]?.domain || ''}</div>
                        </div>
                        <div className={styles.text3}>
                          <b className={styles.b}>{cciqStats?.domain_scores?.[1]?.score ?? 0} / {cciqStats?.domain_scores?.[1]?.max_score ?? 0}</b>
                        </div>
                      </div>
                      <div className={styles.container31}>
                        <div className={styles.container32} />
                      </div>
                    </div>
                    <div className={styles.container33}>
                      <div className={styles.container34}>
                        <div className={styles.text6}>
                          <div className={styles.strategy}>{cciqStats?.domain_scores?.[2]?.domain || ''}</div>
                        </div>
                        <div className={styles.text7}>
                          <b className={styles.b2}>{cciqStats?.domain_scores?.[2]?.score ?? 0} / {cciqStats?.domain_scores?.[2]?.max_score ?? 0}</b>
                        </div>
                      </div>
                      <div className={styles.container35}>
                        <div className={styles.container36} />
                      </div>
                    </div>
                    <div className={styles.container33}>
                      <div className={styles.container34}>
                        <div className={styles.text8}>
                          <div className={styles.strategy}>
                            {cciqStats?.domain_scores?.[3]?.domain || ''}
                          </div>
                        </div>
                        <div className={styles.text7}>
                          <b className={styles.b3}>{cciqStats?.domain_scores?.[3]?.score ?? 0} / {cciqStats?.domain_scores?.[3]?.max_score ?? 0}</b>
                        </div>
                      </div>
                      <div className={styles.container35}>
                        <div className={styles.container40} />
                      </div>
                    </div>
                  </div>
                  <div className={styles.container41}>
                    <div className={styles.container42}>
                      <div className={styles.focusAreas}>Focus Areas</div>
                    </div>
                    <div className={styles.container43}>
                      <div className={styles.container44}>
                        <div className={styles.container45} />
                        <div className={styles.text10}>
                          <div className={styles.advertisingPr}>
                            {cciqStats?.domain_scores?.[0]?.domain || cciqStats?.focusAreas?.[0] || 'UI/UX Design'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.container44}>
                        <div className={styles.container47} />
                        <div className={styles.text11}>
                          <div className={styles.advertisingPr}>
                            {cciqStats?.domain_scores?.[1]?.domain || cciqStats?.focusAreas?.[1] || 'Advertising & PR'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.container44}>
                        <div className={styles.container49} />
                        <div className={styles.text12}>
                          <div className={styles.advertisingPr}>
                            {cciqStats?.domain_scores?.[2]?.domain || cciqStats?.focusAreas?.[2] || 'Content Strategy'}
                          </div>
                        </div>
                      </div>
                      <div className={styles.container44}>
                        <div className={styles.container51} />
                        <div className={styles.text13}>
                          <div className={styles.advertisingPr}>
                            {cciqStats?.domain_scores?.[3]?.domain || cciqStats?.focusAreas?.[3] || 'Entrepreneurship'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.jobRoles}>
                  <div className={styles.container52}>
                    <h3 className={styles.percentageNumber}>Job Roles</h3>
                    <div className={styles.domains}>{cciqStats?.jobRolesCount ?? (cciqStats?.job_roles?.length ?? 0)} Domains</div>
                  </div>
                  <div className={styles.containerContainer}>
                    <div className={styles.container53}>
                      <div className={styles.domain1}>
                        <div className={styles.container54}>
                          <img className={styles.containerIcon3} alt="" />
                          <div className={styles.container55}>
                            <div className={styles.text14}>
                              <div className={styles.primary}>Primary</div>
                            </div>
                            <b
                              className={styles.spatialExperience}
                            >{`Spatial & Experience Design`}</b>
                            <div className={styles.skillsAnalysisBar}>
                              <ul
                                className={styles.interiorDesignExhibitionDes}
                              >
                                <li>Interior Design</li>
                                <li>Exhibition Design</li>
                                <li>Retail Design</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className={styles.container56}>
                          <div className={styles.container34}>
                            <div className={styles.skillsAnalysisBar}>
                              Progress
                            </div>
                            <div className={styles.div}>78%</div>
                          </div>
                          <div className={styles.container58}>
                            <div className={styles.container59} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.domain3}>
                        <div className={styles.container60}>
                          <img className={styles.containerIcon4} alt="" />
                          <div className={styles.container55}>
                            <div className={styles.text15}>
                              <div className={styles.primary}>Primary</div>
                            </div>
                            <div className={styles.heading32}>
                              <b className={styles.productDesign}>
                                Product Design
                              </b>
                            </div>
                            <div className={styles.paragraph}>
                              <div className={styles.coursesCompleted}>
                                2/4 courses completed
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.container62}>
                          <div className={styles.container34}>
                            <div className={styles.skillsAnalysisBar}>
                              Progress
                            </div>
                            <div className={styles.div}>45%</div>
                          </div>
                          <div className={styles.container58}>
                            <div className={styles.container65} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.container66}>
                        <div className={styles.container67}>
                          <img className={styles.containerIcon4} alt="" />
                          <div className={styles.container68}>
                            <div className={styles.text16}>
                              <div className={styles.primary}>Secondary</div>
                            </div>
                            <div className={styles.heading33}>
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
                        <div className={styles.container69}>
                          <div className={styles.container70}>
                            <div className={styles.text17}>
                              <div className={styles.progress3}>Progress</div>
                            </div>
                            <div className={styles.text18}>
                              <div className={styles.progress3}>45%</div>
                            </div>
                          </div>
                          <div className={styles.container58}>
                            <div className={styles.container72} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.containerChild} />
                      <b className={styles.p}>P</b>
                    </div>
                    <div className={styles.container53}>
                      <div className={styles.domain1}>
                        <div className={styles.container54}>
                          <img className={styles.containerIcon3} alt="" />
                          <div className={styles.container55}>
                            <div className={styles.text14}>
                              <div className={styles.primary}>Primary</div>
                            </div>
                            <b
                              className={styles.spatialExperience}
                            >{`Game & Interactive Design`}</b>
                            <div className={styles.skillsAnalysisBar}>
                              <ul
                                className={styles.interiorDesignExhibitionDes}
                              >
                                <li>Game Design</li>
                                <li>Level Design</li>
                                <li>Interactive Art</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className={styles.container56}>
                          <div className={styles.container34}>
                            <div className={styles.skillsAnalysisBar}>
                              Progress
                            </div>
                            <div className={styles.div}>78%</div>
                          </div>
                          <div className={styles.container58}>
                            <div className={styles.container59} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.domain3}>
                        <div className={styles.container60}>
                          <img className={styles.containerIcon4} alt="" />
                          <div className={styles.container55}>
                            <div className={styles.text15}>
                              <div className={styles.primary}>Primary</div>
                            </div>
                            <div className={styles.heading32}>
                              <b className={styles.productDesign}>
                                Product Design
                              </b>
                            </div>
                            <div className={styles.paragraph}>
                              <div className={styles.coursesCompleted}>
                                2/4 courses completed
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.container62}>
                          <div className={styles.container34}>
                            <div className={styles.skillsAnalysisBar}>
                              Progress
                            </div>
                            <div className={styles.div}>45%</div>
                          </div>
                          <div className={styles.container58}>
                            <div className={styles.container65} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.container66}>
                        <div className={styles.container67}>
                          <img className={styles.containerIcon4} alt="" />
                          <div className={styles.container68}>
                            <div className={styles.text16}>
                              <div className={styles.primary}>Secondary</div>
                            </div>
                            <div className={styles.heading33}>
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
                        <div className={styles.container69}>
                          <div className={styles.container70}>
                            <div className={styles.text17}>
                              <div className={styles.progress3}>Progress</div>
                            </div>
                            <div className={styles.text18}>
                              <div className={styles.progress3}>45%</div>
                            </div>
                          </div>
                          <div className={styles.container58}>
                            <div className={styles.container72} />
                          </div>
                        </div>
                      </div>
                      <div className={styles.containerItem} />
                      <b className={styles.p}>S</b>
                    </div>
                  </div>
                  <div className={styles.roleOptions}>
                    {(cciqStats?.job_roles || jobs.map((j: any) => j.name)).map((role: string, index: number) => (
                      <div
                        key={index}
                        className={styles.accessoryDesignerWrapper}
                        title={role}
                      >
                        <div
                          className={styles.skillsAnalysisBar}
                          style={{
                            color: '#000',
                            lineHeight: '1.4',
                            wordBreak: 'break-word',
                            textAlign: 'center'
                          }}
                        >
                          {role}
                        </div>
                      </div>
                    ))}
                    {!(cciqStats?.job_roles) && jobs.length === 0 && (
                      <div className={styles.skillsAnalysisBar}>Loading...</div>
                    )}
                  </div>
                </div>
              </section>
              <section className={styles.goals}>
                <ShortTerms
                  shortTermGoals={shortTermsTermGoals}
                  next36Months={shortTermsNext36Months}
                  refineYourStorytellingMethods={
                    cciqStats?.short_term_goals?.[0] || shortTermsRefineYourStorytelling
                  }
                  takeComprehensiveCopywriting={
                    cciqStats?.short_term_goals?.[1] || shortTermsTakeComprehensive
                  }
                />
                <ShortTerms
                  shortTermGoals={longTermsShortTermGoals}
                  next36Months={longTermsNext36Months}
                  refineYourStorytellingMethods={
                    cciqStats?.long_term_goals?.[0] || longTermsRefineYourStorytelling
                  }
                  takeComprehensiveCopywriting={
                    cciqStats?.long_term_goals?.[1] || longTermsTakeComprehensive
                  }
                />
              </section>
            </div>
          </div>
        </div>
        <div className={styles.container93}>
          <div className={styles.skillsAnalysisBar}>
            *Based on your performance across all 4 stages of the CCIQ Assessment
            • Issued on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent2;