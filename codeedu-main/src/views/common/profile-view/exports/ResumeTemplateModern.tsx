import React from "react";
import type { Profile } from "../services/profileService";
import type { Section } from "../services/sectionService";

interface ResumeTemplateProps {
  profile: Profile;
  profileSections?: Section[];
}

const ResumeTemplateModern: React.FC<ResumeTemplateProps> = ({ profile, profileSections = [] }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const renderSectionHtml = (
    entry: Record<string, any>,
    html: string,
    fields: { fieldKey: string; dataType: string }[]
  ): string => {
    return html.replace(/\${(.*?)}/g, (_, keyRaw) => {
      const key = keyRaw.trim();
      const value = entry[key];

      if (value === undefined || value === null || value === "") return "";

      const field = fields.find((f) => f.fieldKey === key);

      if (field?.dataType === "binary" && typeof value === "string") {
        return `<img src="${value}" alt="${key}" style="max-width: 100%; max-height: 150px; border-radius: 8px;" />`;
      }

      if (field?.dataType === "object" && typeof value === "string") {
        return `<a href="${value}" target="_blank" style="color: #0284c7; text-decoration: underline; font-size: 13px;">View Attachment</a>`;
      }

      if (field?.dataType === "date") {
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            });
          }
        } catch {
          return String(value);
        }
      }

      return String(value);
    });
  };

  const sectionsData = profile.profileSection || {};

  const experience = (sectionsData.experience || []).slice(0, 4);
  const education = (sectionsData.education || []).slice(0, 3);
  const volunteering = (sectionsData.volunteering || []).slice(0, 2);
  const publications = (sectionsData.publications || []).slice(0, 3);
  const skills = (sectionsData.skills || []).slice(0, 12);
  const languages = (sectionsData.languages || []).slice(0, 6);

  const manualSectionKeys = [
    "about",
    "basic_info",
    "social_links",
    "socialLinks",
    "resumes",
    "experience",
    "education",
    "skills",
    "languages",
    "volunteering",
    "publications"
  ];

  const dynamicSections = (profileSections || []).filter(
    (section) =>
      !manualSectionKeys.includes(section.SectionKey) &&
      sectionsData[section.SectionKey] &&
      sectionsData[section.SectionKey].length > 0
  );

  const about = sectionsData.about?.[0]?.about_me || "";
  
  const email = sectionsData.basic_info?.[0]?.email;
  const phone = sectionsData.basic_info?.[0]?.phone;

  return (
    <div
      style={{
        fontFamily: "'Outfit', 'Inter', sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        backgroundColor: "#ffffff",
        color: "#334155",
        fontSize: "13px",
        lineHeight: 1.5,
        minHeight: "1056px", // roughly A4 height at 800px width
      }}
    >
      {/* Sidebar (Left) */}
      <div style={{ width: "35%", backgroundColor: "#0f172a", color: "#e2e8f0", padding: "40px 30px" }}>
        
        {/* Name & Contact */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ margin: "0 0 16px 0", fontSize: "32px", color: "#ffffff", fontWeight: 700, lineHeight: 1.1 }}>
            {profile.name}
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", color: "#94a3b8" }}>
            {email && <span>✉️ {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
        </div>

        {/* About */}
        {about && (
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "16px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px", borderBottom: "1px solid #334155", paddingBottom: "8px", fontWeight: 600 }}>
              Profile
            </h2>
            <p style={{ margin: 0, textAlign: "justify", fontSize: "13px", lineHeight: 1.6, color: "#cbd5e1" }}>{about}</p>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "16px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px", borderBottom: "1px solid #334155", paddingBottom: "8px", fontWeight: 600 }}>
              Expertise
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
                    <span style={{ fontWeight: 500, color: "#f8fafc" }}>{skill.skill_name}</span>
                    <span style={{ color: "#94a3b8" }}>{skill.skill_proficiency}%</span>
                  </div>
                  <div style={{ width: "100%", backgroundColor: "#334155", height: "4px", borderRadius: "2px" }}>
                    <div style={{ width: `${skill.skill_proficiency}%`, backgroundColor: "#38bdf8", height: "100%", borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 style={{ fontSize: "16px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px", borderBottom: "1px solid #334155", paddingBottom: "8px", fontWeight: 600 }}>
              Languages
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {languages.map((lang) => (
                <li key={lang.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "#f8fafc", fontWeight: 500 }}>{lang.lang_name}</span>
                  <span style={{ color: "#94a3b8" }}>{lang.proficiency}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Main Content (Right) */}
      <div style={{ width: "65%", padding: "40px" }}>
        
        {/* Experience */}
        {experience.length > 0 && (
          <section style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", backgroundColor: "#f0f9ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                💼
              </div>
              <h2 style={{ fontSize: "20px", color: "#0f172a", margin: 0, fontWeight: 700 }}>Work Experience</h2>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative" }}>
              {/* Timeline line */}
              <div style={{ position: "absolute", left: "6px", top: "10px", bottom: "10px", width: "2px", backgroundColor: "#e2e8f0" }} />
              
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative", paddingLeft: "24px" }}>
                  {/* Timeline dot */}
                  <div style={{ position: "absolute", left: "2px", top: "6px", width: "10px", height: "10px", backgroundColor: "#38bdf8", borderRadius: "50%", border: "2px solid #fff" }} />
                  
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#0f172a", fontWeight: 600 }}>{exp.title}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#0284c7", fontWeight: 500 }}>{exp.company_name}</span>
                    <span style={{ color: "#64748b", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600 }}>
                      {formatDate(exp.start_date)} – {formatDate(exp.end_date) || "Present"}
                    </span>
                  </div>
                  {exp.description && <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", backgroundColor: "#f0f9ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                🎓
              </div>
              <h2 style={{ fontSize: "20px", color: "#0f172a", margin: 0, fontWeight: 700 }}>Education</h2>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", borderLeft: "4px solid #38bdf8" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", color: "#0f172a", fontWeight: 600 }}>{edu.Institution_name}</h3>
                    <span style={{ color: "#64748b", fontSize: "11px", fontWeight: 600 }}>
                      {formatDate(edu.start_date)} – {formatDate(edu.end_date) || "Present"}
                    </span>
                  </div>
                  <div style={{ color: "#0284c7", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                    {edu.field_of_study} ({edu.education_type})
                  </div>
                  {edu.grade && <div style={{ color: "#64748b", fontSize: "12px" }}>Grade: <span style={{ fontWeight: 600, color: "#334155" }}>{edu.grade}</span></div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Volunteering & Publications */}
        <div style={{ display: "flex", gap: "24px" }}>
          {volunteering.length > 0 && (
            <section style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", color: "#0f172a", margin: 0, fontWeight: 700 }}>Volunteering</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {volunteering.map((vol) => (
                  <div key={vol.id}>
                    <h3 style={{ margin: "0 0 2px 0", fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>{vol.role}</h3>
                    <div style={{ color: "#0284c7", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>{vol.organization}</div>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>{formatDate(vol.start_date)} – {formatDate(vol.end_date) || "Present"}</div>
                    {vol.description && <p style={{ margin: 0, color: "#475569", fontSize: "12px" }}>{vol.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {publications.length > 0 && (
            <section style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "18px", color: "#0f172a", margin: 0, fontWeight: 700 }}>Publications</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {publications.map((pub) => (
                  <div key={pub.id}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#0f172a", fontWeight: 600 }}>{pub.publication_title}</h3>
                    <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{pub.publisher_name}</div>
                    {pub.publication_link && (
                      <a href={pub.publication_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#0284c7", textDecoration: "underline", fontWeight: 500 }}>
                        View Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Dynamic Sections */}
        {dynamicSections.map((section) => {
          const sectionData = sectionsData[section.SectionKey] || [];
          if (section.SectionKey === "tools_software") {
            return (
              <section key={section.SectionKey} style={{ marginTop: "36px", marginBottom: "36px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "32px", height: "32px", backgroundColor: "#f0f9ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                    🔹
                  </div>
                  <h2 style={{ fontSize: "20px", color: "#0f172a", margin: 0, fontWeight: 700 }}>{section.name}</h2>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {sectionData.map((entry: any, index: number) => {
                    const name = entry.tool_name || entry.name || "";
                    if (!name) return null;
                    return (
                      <span key={index} style={{ backgroundColor: "#f1f5f9", padding: "4px 12px", borderRadius: "16px", fontSize: "12px", color: "#334155", fontWeight: 500, border: "1px solid #e2e8f0" }}>
                        {name}
                      </span>
                    );
                  })}
                </div>
              </section>
            );
          }

          return (
            <section key={section.SectionKey} style={{ marginTop: "36px", marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: "#f0f9ff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
                  🔹
                </div>
                <h2 style={{ fontSize: "20px", color: "#0f172a", margin: 0, fontWeight: 700 }}>{section.name}</h2>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {sectionData.map((entry: any, index: number) => (
                  <div key={index} style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {section.sectionHtml ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderSectionHtml(
                            entry,
                            section.sectionHtml,
                            section.fields
                          ),
                        }}
                      />
                    ) : (
                      <ul style={{ listStyle: "disc", paddingLeft: "20px", margin: 0 }}>
                        {section.fields.map((field) => {
                          const key = field.fieldKey;
                          const value = entry[key];
                          if (key === "id" || value === null || value === undefined || value === "") return null;
                          return (
                            <li key={key} style={{ fontSize: "13px", color: "#475569" }}>
                              <strong>{field.name}:</strong> {formatDate(value)}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        
      </div>
    </div>
  );
};

export default ResumeTemplateModern;
