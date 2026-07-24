import { useState } from "react"
import type { UserPortfolio } from "@/@types/learner/portfolio"

type PortfolioProps = {
  portfolio: UserPortfolio
}

const Template1 = ({ portfolio: initialPortfolio }: PortfolioProps) => {
  const [portfolio] = useState<UserPortfolio>(initialPortfolio)

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans">

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-48 h-48 bg-gray-100">
          <img
            src={
              portfolio?.image
                ? portfolio?.image?.replace("/https:", "https:")
                : "/default-profile.png"
            }
            width={180}
            height={180}
            alt={portfolio?.name || "Profile"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold uppercase tracking-wide text-gray-900">
            {portfolio?.portfolio_profile[0].name || "Name not provided"}   {portfolio?.portfolio_profile[0].lastName || "Name not provided"}
          </h1>

          <p className="text-xl mt-2 text-gray-700">{portfolio?.skill?.[0]?.name || "No Skill Provided"}</p>

          {/* Divider */}
          <div className="h-px bg-gray-300 my-4"></div>

          {/* Contact Information */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {portfolio?.portfolio_social?.[0]?.mob_num && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <span className="text-gray-700">{portfolio?.portfolio_social?.[0]?.mob_num}</span>
              </div>
            )}

            {portfolio?.portfolio_social?.[0]?.email && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <span className="text-gray-700">{portfolio?.portfolio_social?.[0]?.email}</span>
              </div>
            )}

            {portfolio?.portfolio_social?.[0]?.linkedin && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-700"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </span>
                <span className="text-gray-700">{portfolio?.portfolio_social?.[0]?.linkedin}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-300 my-4"></div>
        </div>
      </div>

      {/* About Me Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase mb-2">ABOUT ME</h2>
        <div className="h-px bg-gray-300 mb-4"></div>
        <p className="text-gray-700 leading-relaxed">
          {portfolio?.portfolio_profile?.[0]?.about_me || "No information provided."}
        </p>
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase mb-2">EDUCATION</h2>
        <div className="h-px bg-gray-300 mb-4"></div>
        <div className="space-y-6">
          {portfolio?.Education?.length > 0 ? (
            portfolio.Education.map((education, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">{formatYearRange(education.start_date ?? '', education.end_date ?? '')}</p>
                  <p>{education.institute}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-bold">{education.title}</h3>
                  <p className="text-gray-700 mt-2">{education.description || "No description available."}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No education records found.</p>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase mb-2">EXPERIENCE</h2>
        <div className="h-px bg-gray-300 mb-4"></div>
        <div className="space-y-6">
          {portfolio?.Experience?.length > 0 ? (
            portfolio.Experience.map((experience, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">{formatYearRange(experience.start_date ?? '', experience.end_date ?? '')}</p>
                  <p>{experience.institute}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-bold">{experience.title}</h3>
                  <p className="text-gray-700 mt-2">{experience.description || "No description available."}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No experience records found.</p>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold uppercase mb-2">SKILLS</h2>
        <div className="h-px bg-gray-300 mb-4"></div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 list-disc pl-5">
          {portfolio?.skill?.length > 0 ? (
            portfolio.skill.map((skill, index) => (
              <li key={index} className="text-gray-700">{skill.name}</li>
            ))
          ) : (
            <li>No skills available.</li>
          )}
        </ul>
      </section>

      {/* References Section */}
      {/* <section>
        <h2 className="text-xl font-bold uppercase mb-2">REFERENCES</h2>
        <div className="h-px bg-gray-300 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
          {portfolio?.references?.length > 0 ? (
            portfolio.references.map((reference, index) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900">{reference.name}</h3>
                <p className="text-gray-700">{reference.title}</p>
                <div className="mt-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> {reference.phone || "No phone available"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> {reference.email || "No email available"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No references provided.</p>
          )}
        </div>
      </section> */}
    </div>
  )
}

const formatYearRange = (startDate: string, endDate: string) => {
  const startYear = new Date(startDate).getFullYear()
  const endYear = new Date(endDate).getFullYear()
  return `${startYear} - ${endYear}`
}

export default Template1
