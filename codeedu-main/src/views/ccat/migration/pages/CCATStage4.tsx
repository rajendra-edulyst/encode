import { FunctionComponent, useEffect, useMemo, useState } from "react";

import FrameComponent from "../components/FrameComponent1";
import FellowshipUsage from "../components/FellowshipUsage";
import SkillInsights from "../components/SkillInsights";
import BottomBar from "../components/BottomBar";
import SubmitReportModal from "../components/SubmitReportModal";
import styles from "./CCATStage4.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { submitCCIStage4Report, assignCCICategoryMarks } from "@/services/learner/CCIService";
import { useQueryClient } from "@tanstack/react-query";
import { FellowshipCertificate } from "../components/FellowshipCertificate";
import PersonaProgress from "../components/PersonaProgress";
import { fetchPersonaQuestions, fetchPersonaResponse } from "@/views/persona-insights/service";
import { useAuth } from "@/auth";
import ActionButtons from "../components/ActionButtons";
import { usePackageParameters, usePackages, useUserPackageDetails, useUserProfile } from "@/hooks/data/useGettingStarted";
import { INDUSTRY } from '@/constants/roles.constant'
import NoahSkillInsight from "../components/NoahSkillsInsight";


const CCATStage4: FunctionComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState<number>(30);
  const [totalResponses, setTotalResponses] = useState<number>(0);
  const [usagePercentage, setUsagePercentage] = useState(0);
  const [searchParams] = useSearchParams();
  const { data: userProfile } = useUserProfile();
  const userId = userProfile?.id;
  const { data: packageDetailsRes } = useUserPackageDetails(userId);
  const [packageDetails, setPackageDetails] = useState(packageDetailsRes?.data?.package);
  const [upgradedPackage, setUpgradedPackage] = useState<any | null>()
  const percentage = userProfile?.user_profile?.completion_percentage || 0;
  const { data: parameters = [] } = usePackageParameters()

  const preferenceType = useMemo(() => {
    const isIndustryRole = Array.isArray(user?.authority) && user.authority.includes(INDUSTRY);
    const isIndustryOrg = user?.user_org_type === 'industry';
    return isIndustryRole || isIndustryOrg ? 'industry' : 'user';
  }, [user?.authority, user?.user_org_type]);

  const params = useMemo(() => {
    const query = new URLSearchParams();
    query.append('type', preferenceType);
    return query;
  }, [preferenceType]);

  const { data: preferences = [], isLoading, isFetched } = usePackages(params);

  const persona = searchParams.get("persona");

  useEffect(() => {
    if (preferences) {
      const nextPackage = preferences
        .filter((item: any) => Number(item.price) > Number(packageDetails?.price))
        .sort((a: any, b: any) => Number(a.price) - Number(b.price))[0];

      if (nextPackage) {
        setUpgradedPackage(nextPackage);
      }
    }
  })


  const loadPersonaData = async () => {
    if (!user?.id) return;
    try {
      const data = await fetchPersonaQuestions();
      setQuestions(data.questions?.length ?? 0);
      const insightId = data.feedbackInsight?._id;

      if (!insightId) {
        console.warn("Persona insight ID is missing");
        return;
      }

      const response = await fetchPersonaResponse(insightId, String(user.id));
      setTotalResponses(response?.answers?.length ?? 0);
    } catch (error) {
      console.error("Failed to fetch persona data:", error);
    }
  };

  useEffect(() => {
    loadPersonaData();
  }, [user?.id]);

  useEffect(() => {
    if (packageDetailsRes?.data) {
      const { user_package_parameter_items, package: packageInfo } = packageDetailsRes.data;
      const totals = user_package_parameter_items.reduce(
        (acc: any, item: any) => {
          acc.allowed += Number(item.allowed_access_count || 0);
          acc.used += Number(item.used_access_count || 0);
          return acc;
        },
        { allowed: 0, used: 0 }
      );
      setPackageDetails(packageInfo)
      const percentage =
        totals.allowed > 0
          ? Number(((totals.used / totals.allowed) * 100).toFixed(2))
          : 0;

      setUsagePercentage(percentage);
    }
  }, [packageDetailsRes, packageDetails]);

  const handleSubmitReport = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await submitCCIStage4Report();

      if (packageDetailsRes?.data?.user_package_parameter_items) {
        try {
          await assignCCICategoryMarks(packageDetailsRes?.data?.user_package_parameter_items);
        } catch (markError) {
          console.error("Failed to assign category marks:", markError);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to submit report:", error);
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.ccatStage4}>
      <div className={styles.ccatStage4Inner}>
        <div className={styles.frameChild} />
      </div>

      <div className={styles.container}>
        <div className={styles.container2}>
          <div className={styles.badge}>
            <div className={styles.question15Out}>Question 15 out of 15</div>
          </div>
          <div className={styles.container3}>
            <div className={styles.badge2}>
              <div
                className={styles.roxServices}
              >{`ROX Services & SIM Management`}</div>
            </div>
            <div className={styles.badge3}>
              <div className={styles.roxServices}>2 of 27</div>
            </div>
          </div>
        </div>
        <div className={styles.primitivediv}>
          <div className={styles.container4} />
        </div>
      </div>
      <div className={styles.stageDescripttion}>
        <div className={styles.objectiveToAssessContainer}>
          <p className={styles.objective}>
            <b className={styles.objective2}>Objective:</b>
          </p>
          <p className={styles.objective}>
            <span className={styles.toAssessStorytelling}>
              To assess storytelling ability, communication strength,
              confidence, and personal branding.
            </span>
          </p>
          <p className={styles.objective}>
            <span className={styles.toAssessStorytelling}>&nbsp;</span>
          </p>
          <p className={styles.objective}>
            <b>
              <span className={styles.activityToDo2}>Activity to do:</span>
            </b>
          </p>
          <p className={styles.objective}>
            <span>
              <b>
                <span className={styles.videoSubmissionMandatory2}>
                  1. Video Submission (Mandatory)
                </span>
              </b>
            </span>
          </p>
          <ul className={styles.taskUploadAVideoResume}>
            <li>
              <span>
                <span>Task: Upload a Video Resume / Capability Pitch</span>
              </span>
            </li>
            <li>
              <span>
                <span>Duration: 2–3 minutes</span>
              </span>
            </li>
            <li>
              <span>
                <span>Format: MP4 / MOV</span>
              </span>
            </li>
            <li>
              <span>
                <span>Device: Mobile / Laptop</span>
              </span>
            </li>
          </ul>
          <p className={styles.objective}>
            <span>
              <span>What to Cover:</span>
            </span>
          </p>
          <ul className={styles.taskUploadAVideoResume}>
            <li>
              <span>
                <span>Introduction (Who you are)</span>
              </span>
            </li>
            <li>
              <span>
                <span>Your skills / interests</span>
              </span>
            </li>
            <li>
              <span>
                <span>Your approach to problem-solving</span>
              </span>
            </li>
            <li>
              <span>
                <span>What makes you unique</span>
              </span>
            </li>
          </ul>
          <p className={styles.objective}>
            <span>
              <span>&nbsp;</span>
            </span>
          </p>
          <p className={styles.objective}>
            <span>
              <b className={styles.videoSubmissionMandatory2}>
                2. Graphic Analysis (Mandatory)
              </b>
            </span>
          </p>
          <ul className={styles.taskUploadAVideoResume}>
            <li>
              <span>
                <span>
                  Task: Analyze a given visual/graphic (poster, UI, infographic,
                  etc.)
                </span>
              </span>
            </li>
            <li>
              <span>
                <span>Response Type: Short structured answer.</span>
              </span>
            </li>
          </ul>
          <p className={styles.objective}>
            <span>
              <span>Evaluation Focus:</span>
            </span>
          </p>
          <ul className={styles.taskUploadAVideoResume}>
            <li>
              <span>
                <span>Observation skills</span>
              </span>
            </li>
            <li>
              <span>
                <span>Visual interpretation</span>
              </span>
            </li>
            <li>
              <span>
                <span>Critical thinking</span>
              </span>
            </li>
            <li>
              <span>
                <span>Ability to derive insights</span>
              </span>
            </li>
          </ul>
          <p className={styles.objective}>
            <span>
              <span>&nbsp;</span>
            </span>
          </p>
          <p className={styles.objective}>
            <span>
              <b className={styles.videoSubmissionMandatory2}>
                3. Written Analysis (Mandatory)
              </b>
            </span>
          </p>
          <p className={styles.objective}>
            <span>
              <span className={styles.taskRespondTo}>
                Task: Respond to a prompt / scenario in written format
              </span>
            </span>
          </p>
          <p className={styles.objective}>
            <span>
              <span className={styles.taskRespondTo}>&nbsp;</span>
            </span>
          </p>
          <p className={styles.objective}>
            <span>
              <b className={styles.taskRespondTo}>{`Duration: `}</b>
              <span className={styles.taskRespondTo}>4 Hours</span>
            </span>
          </p>
        </div>
        <div className={styles.stage03Wrapper}>
          <b className={styles.question15Out}>Stage 03</b>
        </div>
      </div>

      {Number(persona) !== 1 ? <FrameComponent /> : null}
      <main className={styles.ccatStage4Child} style={{ paddingBottom: "250px", position: "relative", zIndex: 1 }}>
        <div className={styles.actionButtonsParent}>

          {Number(persona) !== 1 && <ActionButtons onSubmit={handleSubmitReport} packageDetailsRes={packageDetailsRes} />}

          {Number(persona) === 1 && <FellowshipCertificate progress={usagePercentage} upgradedPackage={packageDetailsRes?.data?.package} percent={percentage} />}
          <FellowshipUsage progress={usagePercentage} packageDetailsRes={packageDetailsRes} globalParameters={parameters} />
          <SkillInsights domains={userProfile?.user_functional_domain} />
          <NoahSkillInsight />
          {Number(persona) === 1 && <PersonaProgress
            currentQuestions={totalResponses}
            totalQuestions={questions}
            onUpdate={loadPersonaData}
          />}

        </div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute bottom-[-12rem] left-0 w-full h-96 object-cover z-0 opacity-80 pointer-events-none"
        >
          <source src="/video/rainbow.mp4" type="video/mp4" />
        </video>

      </main>
      <SubmitReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          navigate("/cci");
        }}
      />
      <div className={styles.component8}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameItem} />
          <div className={styles.blue}>
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
          </div>
        </div>
        <img className={styles.frameIcon2} alt="" />
      </div>
      <BottomBar />
    </div>
  );
};

export default CCATStage4;
