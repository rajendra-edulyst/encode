import React, { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs, fetchNoahRecommendedJobRoles, fetchSkillsMappingListCreative } from "@/services/learner/OpportunitieService";
import Container from "./Container";
import styles from "./SkillInsights.module.css";
import { fetchFunctionalDomains } from "@/services/getting-started";
import { FunctionalDomain } from "@/@types/getting-started";
import { getUserSkills } from "@/services/learner/PortfolioService";
import { fetchStageSkills, fetchSkillsList } from "@/services/learner/OpportunitieService";

const skillsColor = ['#6F4DBD', '#E66B1F', '#26DDDD', '#E132D2', '#7CD017'];

const getSkillColor = (skill: any, allSkills: any[]) => {
    if (!allSkills || allSkills.length === 0 || !skill) return undefined;
    const index = allSkills.findIndex((s: any) => s.id === skill.id || s.id === skill.skill_id);
    if (index === -1) return undefined;
    return skillsColor[index % skillsColor.length];
};

const getSkillIcon = (skill: any, allSkills: any[]) => {
    if (skill?.icon) return skill.icon;
    if (!allSkills || allSkills.length === 0 || !skill) return undefined;
    const globalSkill = allSkills.find((s: any) => s.id === skill.id || s.id === skill.skill_id);
    return globalSkill?.icon;
};

const DynamicSkillIcon = ({ skill, allSkills, fallbackSrc, className, color }: any) => {
    const iconUrl = getSkillIcon(skill, allSkills);
    if (!iconUrl) {
        return <img className={className} loading="lazy" alt="" src={fallbackSrc} />;
    }

    return (
        <div className={className} style={{ position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 91 99" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M72.075 0h-53.15A18.762 18.762 0 008.73 2.991 19.014 19.014 0 000 19.013V99a19.01 19.01 0 018.33-15.755 18.763 18.763 0 0110.595-3.258h53.15c3.757 0 7.258-1.1 10.204-2.998A19.022 19.022 0 0091 60.974V19.013A19.02 19.02 0 0082.85 3.38 18.766 18.766 0 0072.075 0z" fill="white" />
            </svg>
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '36px',
                height: '36px',
                backgroundColor: color || '#fff',
                WebkitMaskImage: `url(${iconUrl})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: `url(${iconUrl})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
            }} />
        </div>
    );
};

export type SkillInsightsType = {
    className?: string;
};

const NoahSkillInsight: FunctionComponent<SkillInsightsType> = ({
    className = "",
}) => {
    const [domains, setDomains] = useState<FunctionalDomain[]>([]);

    const { data: creativeStage } = useQuery({
        queryKey: ['getCreativeStageResults'],
        queryFn: () => fetchStageSkills(),
    });

    const isDomainsEmpty = creativeStage && (!creativeStage.domains || creativeStage.domains.length === 0);

    const skillsTitle = isDomainsEmpty ? "Current Skills" : "Noah’s Recommended Skills";
    const domainsTitle = isDomainsEmpty ? "Current Domains" : "Noah’s Recommended Domains";
    const jobRolesTitle = isDomainsEmpty ? "Job Roles" : "Noah’s Recommended Job Roles";

    const isCciStage4 = typeof window !== 'undefined' && window.location.pathname.includes('/cci-stage-4');

    const { data: jobListResponse } = useQuery({
        queryKey: isCciStage4 ? ['noahRecommendedJobRoles'] : ['jobListWow'],
        queryFn: () => isCciStage4 ? fetchNoahRecommendedJobRoles() : fetchJobs(),
    });

    const { data: allSkillsResponse } = useQuery({
        queryKey: ['skills-list-creative'],
        queryFn: () => {
            const p = new URLSearchParams();
            p.append('creative', '1');
            return fetchSkillsList(p);
        },
    });

    const rawJobs = Array.isArray(jobListResponse) ? jobListResponse : (jobListResponse?.data || []);
    const jobs = rawJobs.filter((job: any) => {
        if (isCciStage4) {
            return true;
        }
        return true;
    });

    const { data: skillsResponse } = useQuery({
        queryKey: isCciStage4 ? ['userSkillsCreative'] : ['userSkills'],
        queryFn: () => isCciStage4 ? fetchSkillsMappingListCreative() : getUserSkills(),
    });

    const skills = (skillsResponse as any)?.data && Array.isArray((skillsResponse as any).data)
        ? (skillsResponse as any).data
        : (Array.isArray(skillsResponse) ? skillsResponse : []);

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
                    <h3 className={styles.currentSkills}>{skillsTitle}</h3>
                </div>

                <div className={styles.container2}>
                    {skills.length > 0 ? (
                        skills.map((skill: any, index: number) => (
                            <div className={styles.skill1} key={skill.id || index}>
                                <div className={styles.container3}>
                                    <div className={styles.container4}>
                                        <img className={styles.containerIcon} alt="" src={getSkillIcon(skill, allSkillsResponse || []) || undefined} />
                                        <div className={styles.container5}>
                                            <b className={styles.creativeThinking}>{skill.name || skill.skill_name}</b>
                                        </div>
                                    </div>
                                    <div className={styles.div}>{skill.self_proficiency ? `${skill.self_proficiency}${String(skill.self_proficiency).includes('%') ? '' : '%'}` : '0%'}</div>
                                </div>
                                <div className={styles.container6}>
                                    <div className={styles.container7} style={{ width: skill.self_proficiency ? `${skill.self_proficiency}${String(skill.self_proficiency).includes('%') ? '' : '%'}` : '0%' }} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <>
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
                        </>
                    )}
                </div>

                <div className={styles.skillVisuals}>
                    {skills.length > 0 ? (
                        <>
                            {skills[0] && (
                                <div className={styles.visualSense2}>
                                    <img
                                        className={styles.image432Icon}
                                        alt=""
                                        src="/image-432@2x.png"
                                    />
                                    <DynamicSkillIcon
                                        skill={skills[0]}
                                        allSkills={allSkillsResponse || []}
                                        fallbackSrc="/Asset-1-3@2x.png"
                                        className={styles.asset13}
                                        color={skills[0]?.color || getSkillColor(skills[0], allSkillsResponse || []) || '#e66b1f'}
                                    />
                                    <div className={styles.rectangleParent} style={{ paddingLeft: '20px', paddingRight: '20px', alignItems: 'center', textAlign: 'center', backgroundColor: skills[0]?.color || getSkillColor(skills[0], allSkillsResponse || []) || '#e66b1f' }}>
                                        <div className={styles.frameChild} style={{ backgroundColor: skills[0]?.color || getSkillColor(skills[0], allSkillsResponse || []) || '#e66b1f' }} />
                                        <b className={styles.visualSense3} style={{ width: '100%', height: 'auto', fontSize: '18px', lineHeight: '1.2', wordWrap: 'break-word' }}>
                                            {skills[0].name || skills[0].skill_name}
                                        </b>
                                        <div className={styles.proficiencyLabels}>
                                            <b className={styles.primary}>Primary</b>
                                        </div>
                                    </div>
                                    <img className={styles.visualSenseChild} alt="" />
                                </div>
                            )}
                            {skills[1] && (
                                <div className={styles.problemSolving2}>
                                    <img
                                        className={styles.image432Icon2}
                                        alt=""
                                        src="/image-432@2x.png"
                                    />
                                    <DynamicSkillIcon
                                        skill={skills[1]}
                                        allSkills={allSkillsResponse || []}
                                        fallbackSrc="/Asset-1-31@2x.png"
                                        className={styles.asset13}
                                        color={skills[1]?.color || getSkillColor(skills[1], allSkillsResponse || []) || '#26dddd'}
                                    />
                                    <img className={styles.problemSolvingChild} alt="" />
                                    <div className={styles.rectangleGroup} style={{ paddingLeft: '20px', paddingRight: '20px', alignItems: 'center', textAlign: 'center', backgroundColor: skills[1]?.color || getSkillColor(skills[1], allSkillsResponse || []) || '#26dddd' }}>
                                        <div className={styles.frameItem} style={{ backgroundColor: skills[1]?.color || getSkillColor(skills[1], allSkillsResponse || []) || '#26dddd' }} />
                                        <b className={styles.problemSolving3} style={{ width: '100%', height: 'auto', fontSize: '18px', lineHeight: '1.2', wordWrap: 'break-word' }}>
                                            {skills[1].name || skills[1].skill_name}
                                        </b>
                                        <div className={styles.secondaryWrapper}>
                                            <b className={styles.secondary}>Secondary</b>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
            <div className={styles.domainprogress}>
                <div className={styles.container28}>
                    <h3 className={styles.currentDomains}>{domainsTitle}</h3>
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
                    <h3 className={styles.currentDomains}>{jobRolesTitle}</h3>
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
                    {jobs.map((job: any) => (
                        <div key={job.id} className={styles.accessoryDesignerWrapper}>
                            <div className={styles.creativeThinking}>
                                {formatJobName(job.job_role || job.name)}
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && (
                        <div className={styles.creativeThinking}>No Jobs Roles Found</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NoahSkillInsight;
