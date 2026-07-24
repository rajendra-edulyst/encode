import { useState } from "react"
import type { UserPortfolio } from "@/@types/learner/portfolio"

type portfolio = {
  portfolio: UserPortfolio
}

const Template4 = ({ portfolio: initialPortfolio }: portfolio) => {
  const [portfolio] = useState<UserPortfolio>(initialPortfolio)

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm font-serif">
      {/* Header Section */}
      <div className="bg-[#4A7C6F] text-white p-8 rounded-t-lg text-center">
        <div className="max-w-[200px] mx-auto mb-6 border-t border-white/30" />
        <h1 className="text-5xl font-light mb-4 text-white">{portfolio?.name}</h1>
        <div className="text-sm space-x-2 text-white/90">
          {/* {portfolio?.portfolio_social?.[0]?.location && <span>{portfolio?.portfolio_social?.[0]?.location}</span>} */}
          {portfolio?.portfolio_social?.[0]?.mob_num && (
            <>
              <span>|</span>
              <span>{portfolio?.portfolio_social?.[0]?.mob_num}</span>
            </>
          )}
          {portfolio?.portfolio_social?.[0]?.email && (
            <>
              <span>|</span>
              <span>{portfolio?.portfolio_social?.[0]?.email}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* Summary Section */}
        <section>
          <h2 className="text-[#4A7C6F] text-xl font-semibold mb-3 border-b border-[#4A7C6F]/20">Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            Professional with expertise in {portfolio?.skill?.map((s) => s.name).join(", ")}. Demonstrated experience in
            delivering quality solutions and exceeding expectations.
          </p>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-[#4A7C6F] text-xl font-semibold mb-3 border-b border-[#4A7C6F]/20">Skills</h2>
          <div className="grid grid-cols-2 gap-4">
            {portfolio?.skill?.map((skill, index) => (
              <div key={index} className="text-gray-700">
                • {skill.name}
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section>
          <h2 className="text-[#4A7C6F] text-xl font-semibold mb-3 border-b border-[#4A7C6F]/20">Experience</h2>
          <div className="space-y-6">
            {Array.isArray(portfolio.Experience) &&
              portfolio?.Experience.map((experience, index) => (
                <div key={index}>
                  <div className="mb-2">
                    <h3 className="font-semibold uppercase text-gray-900">
                      {experience.title} | {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                    </h3>
                    <p className="text-[#4A7C6F] font-semibold">
                      {experience.institute} - {experience.location}
                    </p>
                  </div>
                  <p className="text-gray-700">{experience.description}</p>
                </div>
              ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-[#4A7C6F] text-xl font-semibold mb-3 border-b border-[#4A7C6F]/20">
            Education and Training
          </h2>
          {Array.isArray(portfolio.Education) &&
            portfolio?.Education.map((education, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold text-gray-900">{education.institute}</h3>
                <p className="text-[#4A7C6F]">{education.title}</p>
                <div className="text-gray-700">
                  <span>{education.location}</span>
                  <span className="mx-2">|</span>
                  <span>
                    {formatDate(education.start_date)} - {formatDate(education.end_date)}
                  </span>
                </div>
              </div>
            ))}
        </section>

        {/* Certificates Section */}
        {portfolio?.Certificate && portfolio?.Certificate.length > 0 && (
          <section>
            <h2 className="text-[#4A7C6F] text-xl font-semibold mb-3 border-b border-[#4A7C6F]/20">Certifications</h2>
            {Array.isArray(portfolio.Certificate) &&
              portfolio?.Certificate.map((certificate, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-gray-900">{certificate.title}</h3>
                  <p className="text-[#4A7C6F]">{certificate.institute}</p>
                  <p className="text-gray-700">
                    {formatDate(certificate.start_date)} - {formatDate(certificate.end_date)}
                  </p>
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  )
}

const formatDate = (dateString?: string) => {
  const date = new Date(`${dateString}-01`)
  const options = { year: "numeric", month: "short" } as Intl.DateTimeFormatOptions
  return date.toLocaleDateString("en-US", options)
}

export default Template4

