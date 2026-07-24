import React from "react";
import type { Profile } from "../services/profileService";
import type { Section } from "../services/sectionService";

interface ResumeTemplateProps {
  profile: Profile;
  profileSections?: Section[];
}

const ResumeTemplateClassic: React.FC<ResumeTemplateProps> = ({ profile, profileSections = [] }) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
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
        return `<a href="${value}" target="_blank" style="color: #2563eb; text-decoration: underline; font-size: 13px;">View Attachment</a>`;
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
        padding: "40px",
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#1f2937",
        lineHeight: 1.6,
        fontSize: "13px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <header style={{ borderBottom: "2px solid #2563eb", paddingBottom: "20px", marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "36px", color: "#111827", fontWeight: 700, letterSpacing: "-0.5px" }}>
          {profile.name}
        </h1>
        <div style={{ color: "#4b5563", fontSize: "14px", display: "flex", justifyContent: "center", gap: "16px" }}>
          {email && <span>{email}</span>}
          {email && phone && <span style={{ color: "#9ca3af" }}>•</span>}
          {phone && <span>{phone}</span>}
        </div>
      </header>

      {/* About */}
      {about && (
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "12px", fontWeight: 600 }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, color: "#374151", textAlign: "justify" }}>{about}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px", fontWeight: 600 }}>
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 600 }}>{exp.title}</h3>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                  {formatDate(exp.start_date)} – {formatDate(exp.end_date) || "Present"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#4b5563", fontWeight: 500 }}>{exp.company_name}</span>
                <span style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic" }}>{exp.location}</span>
              </div>
              {exp.description && <p style={{ margin: 0, color: "#374151" }}>{exp.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px", fontWeight: 600 }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 600 }}>{edu.Institution_name}</h3>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                  {formatDate(edu.start_date)} – {formatDate(edu.end_date) || "Present"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px", color: "#4b5563" }}>{edu.field_of_study} ({edu.education_type})</span>
                <span style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic" }}>{edu.location}</span>
              </div>
              {edu.grade && <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Grade: {edu.grade}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills & Languages (2 Columns) */}
      <div style={{ display: "flex", gap: "32px", marginBottom: "28px" }}>
        {skills.length > 0 && (
          <section style={{ flex: 1 }}>
            <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "12px", fontWeight: 600 }}>
              Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skills.map((skill) => (
                <span key={skill.id} style={{ backgroundColor: "#f3f4f6", padding: "4px 10px", borderRadius: "16px", fontSize: "12px", color: "#374151", fontWeight: 500, border: "1px solid #e5e7eb" }}>
                  {skill.skill_name}
                </span>
              ))}
            </div>
          </section>
        )}

        {languages.length > 0 && (
          <section style={{ flex: 1 }}>
            <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "12px", fontWeight: 600 }}>
              Languages
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {languages.map((lang) => (
                <span key={lang.id} style={{ fontSize: "13px", color: "#374151" }}>
                  <strong>{lang.lang_name}</strong> <span style={{ color: "#6b7280" }}>({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Volunteering */}
      {volunteering.length > 0 && (
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px", fontWeight: 600 }}>
            Volunteering
          </h2>
          {volunteering.map((vol) => (
            <div key={vol.id} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: "#111827", fontWeight: 600 }}>{vol.role}</h3>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                  {formatDate(vol.start_date)} – {formatDate(vol.end_date) || "Present"}
                </span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#4b5563" }}>{vol.organization}</span>
              </div>
              {vol.description && <p style={{ margin: 0, color: "#374151" }}>{vol.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <section style={{ marginBottom: "28px" }}>
          <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px", fontWeight: 600 }}>
            Publications
          </h2>
          {publications.map((pub) => (
            <div key={pub.id} style={{ marginBottom: "12px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#111827", fontWeight: 600 }}>{pub.publication_title}</h3>
              <div style={{ fontSize: "13px", color: "#4b5563", marginBottom: "4px" }}>
                {pub.publisher_name} <span style={{ color: "#9ca3af" }}>|</span> {formatDate(pub.publication_date)}
              </div>
              {pub.publication_link && (
                <a href={pub.publication_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#2563eb", textDecoration: "none" }}>
                  View Publication →
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Dynamic Sections */}
      {dynamicSections.map((section) => {
        const sectionData = sectionsData[section.SectionKey] || [];
        if (section.SectionKey === "tools_software") {
          return (
            <section key={section.SectionKey} style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px", fontWeight: 600 }}>
                {section.name}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {sectionData.map((entry: any, index: number) => {
                  const name = entry.tool_name || entry.name || "";
                  if (!name) return null;
                  return (
                    <span key={index} style={{ backgroundColor: "#f3f4f6", padding: "4px 10px", borderRadius: "16px", fontSize: "12px", color: "#374151", fontWeight: 500, border: "1px solid #e5e7eb" }}>
                      {name}
                    </span>
                  );
                })}
              </div>
            </section>
          );
        }

        return (
          <section key={section.SectionKey} style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "18px", color: "#2563eb", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px", fontWeight: 600 }}>
              {section.name}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sectionData.map((entry: any, index: number) => (
                <div key={index} style={{ marginBottom: index === sectionData.length - 1 ? 0 : "12px" }}>
                  {section.sectionHtml ? (
                    <div
                      style={{ fontSize: "13px", color: "#374151" }}
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
                          <li key={key} style={{ fontSize: "13px", color: "#374151" }}>
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
  );
};

export default ResumeTemplateClassic;
