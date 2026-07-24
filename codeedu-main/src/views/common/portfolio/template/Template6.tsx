import { useState } from "react"
import type { UserPortfolio } from "@/@types/learner/portfolio"

type portfolio = {
  portfolio: UserPortfolio
}

const Template6 = ({ portfolio: initialPortfolio }: portfolio) => {
  const [portfolio] = useState<UserPortfolio>(initialPortfolio)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm font-sans p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-blue-600">{portfolio.portfolio_profile[0].name} {portfolio.portfolio_profile[0].lastName}</h1>
        <p className="text-lg text-gray-600 mt-1">{portfolio?.portfolio_profile[0].city},{portfolio?.portfolio_profile[0].state}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Details */}
        <div className="md:w-1/3 space-y-8">
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Details</h2>

            {portfolio?.portfolio_profile?.[0]?.country && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 uppercase text-sm">Address</h3>
                <p className="text-gray-600">{portfolio?.portfolio_profile?.[0]?.city},{portfolio?.portfolio_profile?.[0]?.state}</p>
              </div>
            )}

            {portfolio?.portfolio_social?.[0]?.mob_num && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 uppercase text-sm">Phone</h3>
                <p className="text-gray-600">{portfolio?.portfolio_social?.[0]?.mob_num}</p>
              </div>
            )}

            {portfolio?.portfolio_social?.[0]?.email && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-700 uppercase text-sm">Email</h3>
                <p className="text-gray-600">{portfolio?.portfolio_social?.[0]?.email}</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Skills</h2>
            <div className="space-y-3">
              {portfolio?.skill?.map((skill, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-gray-700">{skill.name}</p>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-blue-600 h-2"
                      style={{ width: `${skill.self_proficiency || Math.min(100, (index + 1) * 25)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Areas of Expertise</h2>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">Technology Vision & Strategy</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">Cloud Computing</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">Data Analytics</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">Executive Leadership</span>
              </div>
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">Project Management</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Languages</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-gray-700">English</p>
                <div className="w-full bg-gray-200 h-2">
                  <div className="bg-blue-600 h-2 w-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <p className="text-gray-700">Hindi</p>
                <div className="w-full bg-gray-200 h-2">
                  <div className="bg-blue-600 h-2 w-full"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Content */}
        <div className="md:w-2/3 space-y-8">
          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Profile</h2>
            <p className="text-gray-700 leading-relaxed">
              Professional with expertise in{" "}
              {portfolio?.skill?.map((s) => s.name).join(", ") || "technology leadership and innovation"}. Demonstrated
              experience in delivering quality solutions and exceeding expectations. Skilled at fostering innovation and
              collaboration across teams while driving technological advancement in various industries.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {Array.isArray(portfolio.Experience) && portfolio.Experience.length > 0 ? (
                portfolio.Experience.map((experience, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800">
                        {experience.title}, {experience.institute}
                      </h3>
                      <span className="text-gray-600 text-right">{experience.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {formatDate(experience.start_date)} —{" "}
                      {experience.end_date ? formatDate(experience.end_date) : "Present"}
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      {experience.description ?? ''
                        .split(". ")
                        .filter(Boolean)
                        .map((point, i) => (
                          <li key={i}>{point}.</li>
                        ))}
                    </ul>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800">Chief Technology Officer, BlueTech Solutions</h3>
                      <span className="text-gray-600 text-right">Oklahoma City, OK</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Jan 2013 — Present</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>
                        Steered the technological vision of the company while fostering innovation and collaboration
                        across teams.
                      </li>
                      <li>
                        Led the successful integration of AI technologies, enhancing product capabilities and opening
                        new revenue streams.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800">
                        Vice President of Technology, Innovative Solutions Group
                      </h3>
                      <span className="text-gray-600 text-right">Washington, D.C.</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Jun 2006 — Dec 2012</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                      <li>
                        Oversaw the development and implementation of strategic technology initiatives, resulting in a
                        30% increase in operational efficiency.
                      </li>
                      <li>Mentored a team of 50+ IT professionals, nurturing a high-performance culture.</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Education</h2>
            <div className="space-y-4">
              {Array.isArray(portfolio.Education) && portfolio.Education.length > 0 ? (
                portfolio.Education.map((education, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">
                        {education.title}, {education.institute}
                      </h3>
                      <span className="text-gray-600 text-right">{education.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {formatDate(education.start_date)} — {formatDate(education.end_date)}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">
                        Master of Science in Computer Science, Georgetown University
                      </h3>
                      <span className="text-gray-600 text-right">Washington, D.C.</span>
                    </div>
                    <p className="text-gray-600 text-sm">Sep 2000 — May 2002</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800">
                        Bachelor of Science in Technology, The George Washington University
                      </h3>
                      <span className="text-gray-600 text-right">Washington, D.C.</span>
                    </div>
                    <p className="text-gray-600 text-sm">Sep 1996 — May 2000</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {portfolio.Certificate && portfolio.Certificate.length > 0 ? (
            <section>
              <h2 className="text-lg font-bold uppercase border-b-2 border-blue-600 pb-1 mb-4">Certifications</h2>
              <div className="space-y-4">
                {Array.isArray(portfolio.Certificate) &&
                  portfolio.Certificate.map((certificate, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800">{certificate.title}</h3>
                      <p className="text-gray-600">{certificate.institute}</p>
                      <p className="text-gray-600 text-sm">
                        {formatDate(certificate.start_date)} — {formatDate(certificate.end_date)}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(`${dateString}-01`)
  const options = { year: "numeric", month: "short" } as Intl.DateTimeFormatOptions
  return date.toLocaleDateString("en-US", options)
}

export default Template6

