import type { UserPortfolio } from "@/@types/learner/portfolio"
import { Hexagon } from "lucide-react"


type PortfolioProps = {
  portfolio: UserPortfolio
}

export default function Template2({ portfolio }: PortfolioProps) {
  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present"
    const date = new Date(`${dateString}-01`)
    const options = { year: "numeric", month: "short" } as Intl.DateTimeFormatOptions
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="bg-slate-800 text-white p-8 flex flex-col items-center md:items-end">
          <h1 className="text-4xl text-white md:text-5xl font-bold">
            {portfolio.portfolio_profile[0]?.name || ""} {portfolio.portfolio_profile[0]?.lastName || ""}
          </h1>

          {(portfolio?.portfolio_profile?.[0]?.city || portfolio?.portfolio_profile?.[0]?.state) && (
            <h2 className="text-xl text-white mt-2">
              {portfolio.portfolio_profile[0].city}
              {portfolio.portfolio_profile[0].state && `, ${portfolio.portfolio_profile[0].state}`}
            </h2>
          )}
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-100 p-8">
            {/* Profile Image */}
            <div className="flex justify-center -mt-32 mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white">
                {portfolio?.image ? (
                  <img
                    src={
                      portfolio?.image
                        ? portfolio?.image?.replace("/https:", "https:")
                        : "/placeholder.svg"
                    }
                    alt={portfolio?.portfolio_profile?.[0]?.name || "Profile"}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                    <Hexagon className="w-24 h-24 text-gray-400" />
                    {portfolio?.portfolio_profile?.[0]?.name && (
                      <span className="absolute text-xl font-bold text-gray-600">
                        {portfolio.portfolio_profile[0].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Section */}
            {(portfolio?.portfolio_social?.[0]?.email ||
              portfolio?.portfolio_social?.[0]?.mob_num ||
              portfolio?.portfolio_profile?.[0]?.city) && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">CONTACT</h3>
                  <div className="space-y-2">
                    {portfolio?.portfolio_social?.[0]?.mob_num && (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{portfolio.portfolio_social[0].mob_num}</span>
                      </div>
                    )}
                    {portfolio?.portfolio_social?.[0]?.email && (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{portfolio.portfolio_social[0].email}</span>
                      </div>
                    )}
                    {(portfolio?.portfolio_profile?.[0]?.city || portfolio?.portfolio_profile?.[0]?.state) && (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>
                          {portfolio.portfolio_profile[0].city}
                          {portfolio.portfolio_profile[0].state && `, ${portfolio.portfolio_profile[0].state}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Skills Section */}
            {portfolio?.skill && portfolio.skill.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">SKILLS</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {portfolio.skill.map((skill, index) => (
                    <li key={index}>
                      {skill.name}
                      {/* {skill.description && `: ${skill.description}`} */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Languages Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">LANGUAGES</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>English</li>
                <li>Hindi</li>
              </ul>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full md:w-2/3 p-8">
            {/* Profile Section */}
            {portfolio?.portfolio_profile?.[0]?.about_me && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">PROFILE</h3>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <p>{portfolio.portfolio_profile[0].about_me}</p>
                </div>
              </div>
            )}

            {/* Work Experience Section */}
            {portfolio?.Experience && portfolio.Experience.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">WORK EXPERIENCE</h3>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="relative pl-8 border-l-2 border-gray-300 ml-4">
                    {portfolio.Experience.map((job, index) => (
                      <div key={index} className="mb-8 relative">
                        <div className="absolute -left-[45px] top-0 w-6 h-6 bg-white border-2 border-gray-300 rounded-full"></div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h4 className="font-bold text-lg">{job.institute}</h4>
                            <p className="text-gray-600">{job.title}</p>
                            {job.employment_type && <p className="text-gray-600">{job.employment_type}</p>}
                          </div>
                          <div className="md:text-right mt-2 md:mt-0">
                            <span className="font-bold">
                              {formatDate(job.start_date)} - {formatDate(job.end_date)}
                            </span>
                            {job.location && <p className="text-gray-600">{job.location}</p>}
                          </div>
                        </div>
                        {job.description && <p className="mt-2 text-gray-700">{job.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Education Section */}
            {portfolio?.Education && portfolio.Education.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">EDUCATION</h3>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="relative pl-8 border-l-2 border-gray-300 ml-4">
                    {portfolio.Education.map((edu, index) => (
                      <div key={index} className="mb-8 relative">
                        <div className="absolute -left-[45px] top-0 w-6 h-6 bg-white border-2 border-gray-300 rounded-full"></div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h4 className="font-bold text-lg">{edu.title}</h4>
                            <p className="text-gray-600">{edu.institute}</p>
                            {edu.study_field && <p className="text-gray-600">{edu.study_field}</p>}
                            {edu.grade && <p className="text-gray-600">Grade: {edu.grade}</p>}
                          </div>
                          <div className="md:text-right mt-2 md:mt-0">
                            <span className="font-bold">
                              {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                            </span>
                            {edu.location && <p className="text-gray-600">{edu.location}</p>}
                          </div>
                        </div>
                        {edu.description && <p className="mt-2 text-gray-700">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Projects Section */}
            {portfolio?.Project && portfolio.Project.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">PROJECTS</h3>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="relative pl-8 border-l-2 border-gray-300 ml-4">
                    {portfolio.Project.map((project, index) => (
                      <div key={index} className="mb-8 relative">
                        <div className="absolute -left-[45px] top-0 w-6 h-6 bg-white border-2 border-gray-300 rounded-full"></div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div>
                            <h4 className="font-bold text-lg">{project.title}</h4>
                            <p className="text-gray-600">{project.institute}</p>
                          </div>
                          <div className="md:text-right mt-2 md:mt-0">
                            <span className="font-bold">
                              {formatDate(project.start_date)} - {formatDate(project.end_date)}
                            </span>
                          </div>
                        </div>
                        {project.description && <p className="mt-2 text-gray-700">{project.description}</p>}
                        {project.action && (
                          <a
                            href={project.action}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 inline-block"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

