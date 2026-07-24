"use client"

import { useState } from "react"
import type { UserPortfolio } from "@/@types/learner/portfolio"


type portfolio = {
  portfolio: UserPortfolio
}

const Template3 = ({ portfolio: initialPortfolio }: portfolio) => {
  const [portfolio] = useState<UserPortfolio>(initialPortfolio)

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans">
      {/* Header Section with Photo and Name */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        {/* Profile Photo - Circular */}
        <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-gray-100 shadow-md flex-shrink-0">
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

        {/* Name and Contact Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-bold uppercase tracking-wide text-gray-800 mb-6">
            {portfolio?.portfolio_profile[0].name}  {portfolio?.portfolio_profile[0].lastName}
          </h1>
          {(portfolio?.portfolio_profile?.[0]?.city || portfolio?.portfolio_profile?.[0]?.state) && (
            <h2 className="text-xl text-white mt-2">
              {portfolio.portfolio_profile[0].city}
              {portfolio.portfolio_profile[0].state && `, ${portfolio.portfolio_profile[0].state}`}
            </h2>
          )}

          {/* Contact Information with Icons */}
          <div className="space-y-3">
            {portfolio?.portfolio_social?.[0]?.mob_num && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-800 text-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span className="text-gray-700">{portfolio?.portfolio_social?.[0]?.mob_num}</span>
              </div>
            )}

            {portfolio?.portfolio_social?.[0]?.email && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-800 text-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span className="text-gray-700">{portfolio?.portfolio_social?.[0]?.email}</span>
              </div>
            )}

            {portfolio?.portfolio_profile?.[0]?.country && (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-800 text-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span className="text-gray-700">{portfolio?.portfolio_profile?.[0]?.state} {portfolio?.portfolio_profile?.[0]?.country}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-300 my-8"></div>

      {/* Main Content - Two Column Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Education, Skills, Language */}
        <div className="md:w-2/5 space-y-8">
          {/* Education Section */}
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4">EDUCATION</h2>

            <div className="space-y-6">
              {Array.isArray(portfolio.Education) && portfolio.Education.length > 0 ? (
                portfolio.Education.map((education, index) => (
                  <div key={index} className="space-y-1">
                    <h3 className="font-bold text-gray-800">{education.title || "Secondary & Senior Secondary"}</h3>
                    <p className="text-gray-700">{education.institute}</p>
                    <p className="text-gray-600">
                      {formatYearRange(education.start_date, education.end_date)}
                      {education.description && ` - ${education.description}`}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">Secondary & Senior Secondary</h3>
                    <p className="text-gray-700">Jawahar Navodaya Vidyalaya, Nagaur</p>
                    <p className="text-gray-600">2016 - 9.2 CGPA</p>
                    <p className="text-gray-600">2018 - 71%</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">Bachelor in Comp. Applications</h3>
                    <p className="text-gray-700">Kuchaman College</p>
                    <p className="text-gray-600">2018-2021, 81%</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-800">Masters in Comp. Applications</h3>
                    <p className="text-gray-700">MBM University</p>
                    <p className="text-gray-600">1st Sem - SGPA 8.63</p>
                    <p className="text-gray-600">2nd Sem - SGPA 8.17</p>
                    <p className="text-gray-600">3rd sem - awaited</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4">SKILLS</h2>

            <ul className="space-y-4 list-disc pl-5">
              {portfolio?.skill?.length > 0 ? (
                portfolio.skill.map((skill, index) => (
                  <li key={index} className="text-gray-700">
                    {skill.name}
                  </li>
                ))
              ) : (
                <>
                  <li className="text-gray-700">
                    <p className="font-medium">Programming Languages such as - C, Python, C++, Java, React</p>
                  </li>
                  <li className="text-gray-700">
                    <p className="font-medium">Html, Css</p>
                  </li>
                  <li className="text-gray-700">
                    <p className="font-medium">Problem Solving with Data Structure & Algorithms</p>
                  </li>
                  <li className="text-gray-700">
                    <p className="font-medium">Expertise in Linux specific distribution(RedHat)</p>
                  </li>
                  <li className="text-gray-700">
                    <p className="font-medium">Soft Skill such as Teamwork- Ability to collaborate effectively.</p>
                  </li>
                </>
              )}
            </ul>
          </section>

          {/* Language Section */}
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4">LANGUAGE</h2>

            <ul className="list-disc pl-5">
              <li className="text-gray-700">English</li>
              <li className="text-gray-700">Hindi</li>
            </ul>
          </section>
        </div>

        {/* Right Column - Profile, Certificates */}
        <div className="md:w-3/5 space-y-8">
          {/* Profile Section */}
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4">PROFILE</h2>

            <p className="text-gray-700 leading-relaxed">
              {portfolio?.portfolio_profile?.map((profile, index) => (
                <p key={index}>{profile.about_me}</p>
              ))}

            </p>
          </section>

          {/* Certificates Section */}
          <section>
            <h2 className="text-2xl font-bold uppercase mb-4">CERTIFICATES & BADGES</h2>

            {portfolio.Certificate && portfolio.Certificate.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.Certificate.map((cert, index) => (
                  <div key={index} className="border border-gray-200 p-4 rounded">
                    <h3 className="font-bold text-gray-800">{cert.title}</h3>
                    <p className="text-gray-700">{cert.institute}</p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(cert.start_date)} — {formatDate(cert.end_date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="mb-2">
                    <img
                      src="/placeholder.svg?height=150&width=300"
                      width={300}
                      height={150}
                      alt="Red Hat Certified System Administrator"
                      className="border border-gray-200"
                    />
                  </div>
                  <p className="font-medium">• Red Hat Certified System Administrator</p>
                </div>

                <div>
                  <div className="mb-2">
                    <img
                      src="/placeholder.svg?height=150&width=300"
                      width={300}
                      height={150}
                      alt="MBM ESRC Summer Workshop"
                      className="border border-gray-200"
                    />
                  </div>
                  <p className="font-medium">• MBM ESRC Summer Workshop</p>
                </div>

                <div>
                  <div className="mb-2">
                    <img
                      src="/placeholder.svg?height=150&width=300"
                      width={300}
                      height={150}
                      alt="MBM Encarta v.24"
                      className="border border-gray-200"
                    />
                  </div>
                  <p className="font-medium">• MBM Encarta v.24</p>
                </div>

                <div className="mt-8">
                  <h3 className="font-medium text-lg mb-2">• Others:</h3>
                  <ul className="space-y-2 pl-4">
                    <li className="text-gray-700">
                      • Currently running RHCE( Red Hat Certified Engineer) From Rajasthan Advanced Technology Center
                    </li>
                    <li className="text-gray-700">• Project on Java Bug Tracking in BCA</li>
                    <li className="text-gray-700">• Project On Freelancer Portal in MCA Project</li>
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

// Helper function to format date ranges like "2020 - 2023"
const formatYearRange = (startDate?: string, endDate?: string) => {
  if (!startDate) return ""

  const startYear = new Date(`${startDate}-01`).getFullYear()
  let endYear = "Present"

  if (endDate) {
    endYear = new Date(`${endDate}-01`).getFullYear().toString()
  }

  return `${startYear} - ${endYear}`
}

// Original formatDate function kept for compatibility
const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  const date = new Date(`${dateString}-01`)
  const options = { year: "numeric", month: "short" } as Intl.DateTimeFormatOptions
  return date.toLocaleDateString("en-US", options)
}

export default Template3

