export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Predefined high-quality FAQ registry for enCODE platform blogs.
 * Questions and answers are topic-specific and range from 50 to 150 words in length.
 */
const topicFAQs: Record<string, FAQItem[]> = {
  ai: [
    {
      question: "How does AI-driven personalization improve learning outcomes on enCODE?",
      answer: "Personalized learning at enCODE leverages machine learning models to analyze individual learning speeds, concept retention, and engagement styles. By understanding these metrics, our platform dynamically recommends custom reading paths, adjusts hands-on exercises, and serves practice challenges at the optimal level of difficulty. This customized feedback loop ensures students don't get bored by topics they have already mastered, nor do they get discouraged by advanced materials before they are ready, leading to significantly higher course completion rates."
    },
    {
      question: "Can enCODE's AI replace the value of human mentorship in education?",
      answer: "Absolutely not. enCODE uses AI to automate administrative grading, analyze data trends, and provide instant conceptual feedback. This actually frees up our industry mentors to spend high-value, quality time with students on deep-dive critiques, career direction, and complex problem-solving. AI serves as a powerful co-pilot that accelerates learning speed, but human mentors provide the crucial empathy, networking connections, and real-world guidance that machines cannot replicate."
    },
    {
      question: "What specific AI tools are integrated into the enCODE student workspace?",
      answer: "Students have access to an integrated AI assistant that operates within their coding, design, and writing workspaces. The assistant offers real-time syntax checking, interactive code explanations, design feedback based on UI principles, and writing suggestions. Furthermore, our AI helps students outline complex projects, identify performance bottlenecks in code, and simulate interview scenarios tailored to specific job descriptions from our industry partners."
    },
    {
      question: "How does the platform ensure that AI suggestions do not lead to plagiarism?",
      answer: "We emphasize AI as a learning facilitator rather than an automated content writer. The built-in AI workspace guides students through the problem-solving process by prompting them with structural questions and conceptual hints rather than direct solutions. Additionally, enCODE incorporates advanced code integrity check tools to ensure all submitted coursework represents original understanding and implementation by the student."
    },
    {
      question: "Are there prerequisites for students starting AI-powered courses on enCODE?",
      answer: "No, enCODE offers learning paths starting from absolute beginner levels. The platform's adaptive learning engine evaluates your background knowledge during onboarding and automatically configures foundation modules if needed. Advanced learners can test out of introductory concepts directly, allowing everyone to progress at their own comfortable and productive pace."
    }
  ],
  portfolio: [
    {
      question: "Why is a digital portfolio critical for modern creative professionals?",
      answer: "A digital portfolio serves as your dynamic, globally accessible proof of capability. Unlike traditional text-based resumes that only list job titles, a portfolio visually demonstrates your design process, problem-solving framework, and final execution. For creative fields like UI/UX design, software development, and digital marketing, employers prioritize seeing how you think and build. A polished portfolio built on enCODE highlights these exact competencies, giving recruiters immediate confidence in your readiness."
    },
    {
      question: "How does the enCODE portfolio builder differ from generic website builders?",
      answer: "The enCODE portfolio builder is tailored specifically for learners and tech professionals. It integrates directly with your course projects, verified certificates, and mentor recommendations. Instead of just static layouts, enCODE portfolios support interactive code embeds, project case study templates, and verified skills badges. This structured approach helps you build case studies that speak the language hiring managers expect to see."
    },
    {
      question: "Should I include unfinished or conceptual projects in my portfolio?",
      answer: "Yes, conceptual projects are highly valuable if you document your complete learning journey. Hiring managers love seeing the evolution of an idea from raw sketches and initial wireframes to the final polished product. By showing your wireframes, iteration history, and explaining why you made certain design decisions, you demonstrate critical thinking and resilience, which is often more impressive than a flawless, contextless final result."
    },
    {
      question: "How many projects should I showcase in my enCODE portfolio?",
      answer: "We recommend focusing on quality over quantity, ideally showcasing three to five outstanding projects. Each project should have a detailed case study explaining the challenge, your specific role, your step-by-step methodology, tools used, and the measurable outcomes. A few highly detailed, well-structured case studies are infinitely more effective at winning interviews than ten thin galleries without descriptions."
    },
    {
      question: "Can I share my enCODE portfolio link directly with external recruiters?",
      answer: "Yes. Every portfolio built on enCODE is fully optimized for external sharing with a clean, responsive layout. It generates a public, SEO-friendly link that loads instantly on mobile and desktop. You can add this URL to your resume, LinkedIn profile, and email signature to make it easy for prospective employers and clients to explore your work."
    }
  ],
  creative: [
    {
      question: "What is multidisciplinary learning and why is it important at enCODE?",
      answer: "Multidisciplinary learning breaks down traditional academic silos by combining design, technology, and business strategies into single projects. In the real world, a software developer needs to understand basic design systems, and a designer needs to understand developer constraints. enCODE's curriculum encourages cross-domain exploration, ensuring that students develop versatile skills that make them highly adaptable and valuable in modern digital product teams."
    },
    {
      question: "How does the project-based curriculum prepare students for the tech industry?",
      answer: "Instead of traditional memorization and standard exams, enCODE courses are built entirely around solving real-world project briefs. Students work on building actual web applications, creating brand identity guidelines, and launching marketing strategies. This practical methodology ensures that by the time you complete your learning path, you have a rich repository of practical skills and projects ready for industry deployment."
    },
    {
      question: "How does enCODE connect student projects with active industry partners?",
      answer: "We partner with leading startups, agencies, and tech corporations who submit actual business challenges as student project briefs. During the course, students receive direct feedback sessions and project evaluations from industry leads. Exceptional project submissions are highlighted to partner recruiting teams, often leading directly to internships, contract work, and full-time employment opportunities."
    },
    {
      question: "What support does enCODE offer to students who face technical roadblocks?",
      answer: "enCODE provides a multi-layered support network. You can ask questions in the community discussion forums, utilize the instant AI debugging assistant, or schedule one-on-one virtual office hours with our expert mentors. We ensure that no student stays stuck for long, keeping your learning momentum high throughout the course duration."
    },
    {
      question: "Are enCODE certificates recognized by global employers?",
      answer: "Yes. enCODE certificates are verified on the public ledger and backed by our accredited academic and corporate partners. More importantly, because your certificate is linked directly to your public enCODE portfolio containing your project case studies, employers can verify the exact codebase, design systems, and skills you mastered to earn that credential."
    }
  ]
};

/**
 * Resolves FAQ items for a blog post dynamically.
 * Priority:
 * 1. Explicitly passed faqs array in the blog/post object.
 * 2. Predefined FAQs from the topic registry based on title/tag match.
 * 3. Graceful fallback (returns undefined if no FAQs match/exist).
 */
export function getBlogFAQs(blog: any): FAQItem[] | undefined {
  if (!blog) return undefined;

  // 1. Check if the blog object already contains a valid faqs array
  if (Array.isArray(blog.faqs) && blog.faqs.length > 0) {
    return blog.faqs;
  }

  const title = (blog.title || '').toLowerCase();
  const tags = (blog.tag || '').toLowerCase();
  const description = (blog.description || '').toLowerCase();

  const combinedText = `${title} ${tags} ${description}`;

  // 2. Fuzzy match topics to serve relevant FAQs
  if (combinedText.includes('ai') || combinedText.includes('artificial') || combinedText.includes('machine learning') || combinedText.includes('chatgpt')) {
    return topicFAQs.ai;
  }
  if (combinedText.includes('portfolio') || combinedText.includes('resume') || combinedText.includes('career') || combinedText.includes('job') || combinedText.includes('interview')) {
    return topicFAQs.portfolio;
  }
  if (combinedText.includes('creative') || combinedText.includes('design') || combinedText.includes('learning') || combinedText.includes('course')) {
    return topicFAQs.creative;
  }

  // 3. Fallback to undefined to gracefully skip if no specific FAQ data is present
  return undefined;
}
