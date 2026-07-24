import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ImageObjectSchema {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface AuthorDetails {
  type: 'Person' | 'Organization';
  name: string;
  url?: string;
  image?: string;
  sameAs?: string[];
  jobTitle?: string;
  designation?: string;
  qualification?: string;
  linkedin?: string;
  experience?: string;
  profilePhoto?: string;
  bio?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

export interface SEOProps {
  // ─── Core meta ───────────────────────────────────────────────────
  title?: string;
  description?: string;
  author?: string;
  url?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  canonical?: string;
  publishDate?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterHandle?: string;

  // ─── AEO props ───────────────────────────────────────────────────
  aeoType?: 'WebPage' | 'Article' | 'BlogPosting' | 'Course' | 'FAQPage' | 'BreadcrumbList' | 'none';
  dateModified?: string;
  articleSection?: string;
  authorDetails?: AuthorDetails;
  imageDetails?: {
    width?: number;
    height?: number;
    caption?: string;
  };
  faqData?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
  speakableSelectors?: string[];
  /** Plain-text article body. Used for articleBody field + auto wordCount. */
  articleBody?: string;
  /** Comma-separated keywords for BlogPosting / Article */
  keywords?: string;
  /** Word count override; auto-computed from articleBody when omitted */
  wordCount?: number;
  /** Reading time string, e.g. "4 minutes" or "4 min read" */
  readingTime?: string;

  // ─── Backwards compatibility ─────────────────────────────────────
  structuredData?: Record<string, unknown>;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PROD_ORIGIN = 'https://encode.codeedu.co';
const ORG_ID      = `${PROD_ORIGIN}/#organization`;
const SITE_ID     = `${PROD_ORIGIN}/#website`;

// ─── Component ────────────────────────────────────────────────────────────────
const SEO: React.FC<SEOProps> = ({
  title       = 'CODE Edu - Creative | Learning | Network | AI-Driven Education Platform',
  description = 'CODE Edu empowers learners to design their own education through AI-driven, multidisciplinary, creative, and industry-connected learning for future readiness.',
  author      = 'CODE Edu',
  url,
  image       = `${PROD_ORIGIN}/img/logo/logo-light-full.png`,
  type        = 'website',
  noindex     = false,
  canonical,
  publishDate,
  twitterCard   = 'summary_large_image',
  twitterHandle = '@codeeduofficial',

  aeoType = 'WebPage',
  dateModified,
  articleSection,
  authorDetails,
  imageDetails,
  faqData,
  breadcrumbs,
  speakableSelectors,
  articleBody,
  keywords,
  wordCount,
  readingTime,

  structuredData,
}) => {
  const fullTitle =
    title.includes('enCODE') || title.includes('CODE Edu')
      ? title
      : `${title} | enCODE`;

  const location    = useLocation();
  const currentPath = location.pathname;

  // Always resolve to production domain
  const canonicalUrl = canonical || `${PROD_ORIGIN}${currentPath}`;
  const isArticle    = type === 'article' || aeoType === 'Article' || aeoType === 'BlogPosting';

  // Stable node @id references
  const imageId     = `${canonicalUrl}#primaryImage`;
  const personId    = `${canonicalUrl}#author`;
  const speakableId = `${canonicalUrl}#speakable`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const articleId   = `${canonicalUrl}#article`;
  const webpageId   = `${canonicalUrl}#webpage`;
  const faqId       = `${canonicalUrl}#faq`;
  const courseId    = `${canonicalUrl}#course`;

  // ─── 1. EducationalOrganization + Organization ────────────────────────────
  const organizationSchema = {
    "@type": ["EducationalOrganization", "Organization"],
    "@id": ORG_ID,
    "name": "CODE Edu",
    "url": PROD_ORIGIN,
    "description": "CODE Edu empowers learners through AI-driven, multidisciplinary, creative, and industry-connected education for future readiness.",
    "logo": {
      "@type": "ImageObject",
      "url": `${PROD_ORIGIN}/img/logo/logo-light-full.png`,
      "width": 112,
      "height": 28
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "enCODE Courses",
      "url": `${PROD_ORIGIN}/courses/all`
    },
    "sameAs": [
      "https://www.facebook.com/Codeeduservices",
      "https://x.com/codeeduofficial",
      "https://www.linkedin.com/company/code-edu-official",
      "https://www.instagram.com/codeedu",
      "https://www.youtube.com/@codeeduofficial"
    ]
  };

  // ─── 2. WebSite + SearchAction ────────────────────────────────────────────
  const webSiteSchema = {
    "@type": "WebSite",
    "@id": SITE_ID,
    "url": PROD_ORIGIN,
    "name": "enCODE",
    "description": "AI-powered education platform by CODE Edu.",
    "publisher": { "@id": ORG_ID },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${PROD_ORIGIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  // ─── 3. ImageObject — standalone @graph node ──────────────────────────────
  // Emitted whenever `image` is present so ImageObject appears in the graph.
  const imageObjectSchema: Record<string, unknown> = {
    "@type": "ImageObject",
    "@id": imageId,
    "url": image,
    "width":  imageDetails?.width  ?? 1200,
    "height": imageDetails?.height ?? 630,
    ...(imageDetails?.caption ? { "caption": imageDetails.caption } : {})
  };

  // ─── 4. SpeakableSpecification — standalone @graph node ──────────────────
  let speakableSchema: Record<string, unknown> | null = null;
  if (speakableSelectors && speakableSelectors.length > 0) {
    speakableSchema = {
      "@type": "SpeakableSpecification",
      "@id": speakableId,
      "cssSelector": speakableSelectors
    };
  }

  // ─── 5. WebPage ───────────────────────────────────────────────────────────
  const webPageSchema: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": webpageId,
    "url": canonicalUrl,
    "name": fullTitle,
    "description": description,
    "isPartOf": { "@id": SITE_ID },
    "publisher": { "@id": ORG_ID },
    // Reference ImageObject by @id
    "primaryImageOfPage": { "@id": imageId }
  };

  if (publishDate)  webPageSchema.datePublished = publishDate;
  if (dateModified) webPageSchema.dateModified  = dateModified;
  else if (publishDate) webPageSchema.dateModified = publishDate;

  // Reference SpeakableSpecification by @id
  if (speakableSchema) {
    webPageSchema.speakable = { "@id": speakableId };
  }

  // ─── 6. BreadcrumbList ────────────────────────────────────────────────────
  let breadcrumbSchema: Record<string, unknown> | null = null;
  if (breadcrumbs && breadcrumbs.length > 0) {
    const itemListElement = breadcrumbs.map((crumb, idx) => {
      const position = idx + 1;
      const itemUrl  = crumb.path
        ? (crumb.path.startsWith('http') ? crumb.path : `${PROD_ORIGIN}${crumb.path}`)
        : (position === breadcrumbs.length ? canonicalUrl : PROD_ORIGIN);
      return { "@type": "ListItem", "position": position, "name": crumb.name, "item": itemUrl };
    });

    breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      "itemListElement": itemListElement
    };

    webPageSchema.breadcrumb = { "@id": breadcrumbId };
  }

  // ─── 7. Person — standalone @graph node ──────────────────────────────────
  // Emitted when an author is a Person (via authorDetails or legacy string prop).
  let personSchema: Record<string, unknown> | null = null;

  if (authorDetails && authorDetails.type === 'Person') {
    const sameAsUrls = [
      ...(authorDetails.sameAs || []),
      ...(authorDetails.linkedin ? [authorDetails.linkedin] : [])
    ];
    personSchema = {
      "@type": "Person",
      "@id": personId,
      "name": authorDetails.name,
      "url": authorDetails.url || authorDetails.linkedin || undefined,
      "image": authorDetails.profilePhoto || authorDetails.image || undefined,
      "jobTitle": authorDetails.designation || authorDetails.jobTitle || undefined,
      "description": authorDetails.bio || authorDetails.experience || undefined,
      ...(sameAsUrls.length > 0 ? { "sameAs": sameAsUrls } : {}),
      ...(authorDetails.qualification ? { "knowsAbout": authorDetails.qualification } : {})
    };
  } else if (author && author !== 'CODE Edu') {
    personSchema = {
      "@type": "Person",
      "@id": personId,
      "name": author
    };
  }

  // Build author reference for Article / BlogPosting
  let authorRef: Record<string, unknown>;
  if (personSchema) {
    authorRef = {
      "@type": "Person",
      "@id": personId,
      "name": personSchema.name,
      ...(personSchema.url ? { "url": personSchema.url } : {}),
      ...(personSchema.image ? { "image": personSchema.image } : {}),
      ...(personSchema.jobTitle ? { "jobTitle": personSchema.jobTitle } : {})
    };
  } else {
    authorRef = {
      "@type": "Organization",
      "@id": ORG_ID,
      "name": "CODE Edu",
      "url": PROD_ORIGIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${PROD_ORIGIN}/img/logo/logo-light-full.png`
      }
    };
  }

  // ─── 8. Article / BlogPosting ─────────────────────────────────────────────
  let articleSchema: Record<string, unknown> | null = null;
  if (aeoType === 'Article' || aeoType === 'BlogPosting') {
    const resolvedWordCount: number | undefined =
      wordCount ?? (articleBody
        ? articleBody.trim().split(/\s+/).filter(Boolean).length
        : undefined);

    articleSchema = {
      "@type": aeoType,
      "@id": articleId,
      "isPartOf": { "@id": webpageId },
      "headline": fullTitle,
      "description": description,
      // Reference ImageObject by @id
      "image": { "@id": imageId },
      // Reference Person (or Organization fallback) by @id
      "author": authorRef,
      "publisher": {
        "@type": "Organization",
        "@id": ORG_ID,
        "name": "CODE Edu",
        "url": PROD_ORIGIN,
        "logo": {
          "@type": "ImageObject",
          "url": `${PROD_ORIGIN}/img/logo/logo-light-full.png`
        }
      },
      "mainEntityOfPage": canonicalUrl,
      "datePublished": publishDate || new Date().toISOString().split('T')[0],
      "dateModified":  dateModified || publishDate || new Date().toISOString().split('T')[0],
      "url": canonicalUrl
    };

    if (articleBody)       articleSchema.articleBody    = articleBody;
    if (keywords)          articleSchema.keywords       = keywords;
    if (articleSection)    articleSchema.articleSection = articleSection;
    if (resolvedWordCount) articleSchema.wordCount      = resolvedWordCount;

    if (readingTime) {
      const match = readingTime.match(/(\d+)/);
      const minutes = match ? match[0] : "4";
      articleSchema.timeRequired = `PT${minutes}M`;
    } else {
      articleSchema.timeRequired = "PT4M";
    }
  }

  // ─── 9. FAQPage ───────────────────────────────────────────────────────────
  let faqSchema: Record<string, unknown> | null = null;
  if (faqData && faqData.length > 0) {
    faqSchema = {
      "@type": "FAQPage",
      "@id": faqId,
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    };
  }

  // ─── 10. Course ───────────────────────────────────────────────────────────
  let courseSchema: Record<string, unknown> | null = null;
  if (aeoType === 'Course') {
    courseSchema = {
      "@type": "Course",
      "@id": courseId,
      "name": title,
      "description": description,
      "provider": { "@id": ORG_ID }
    };
  }

  // ─── Assemble unified @graph ──────────────────────────────────────────────
  // Order: foundational → supporting nodes → page-specific content
  const graphEntities: Record<string, unknown>[] = [
    organizationSchema,
    webSiteSchema,
    imageObjectSchema,   // ImageObject always present (image has a default)
  ];

  if (speakableSchema)  graphEntities.push(speakableSchema);   // SpeakableSpecification
  if (personSchema)     graphEntities.push(personSchema);       // Person
  graphEntities.push(webPageSchema);                           // WebPage
  if (breadcrumbSchema) graphEntities.push(breadcrumbSchema);   // BreadcrumbList
  if (articleSchema)    graphEntities.push(articleSchema);      // Article / BlogPosting
  if (faqSchema)        graphEntities.push(faqSchema);          // FAQPage
  if (courseSchema)     graphEntities.push(courseSchema);       // Course

  // Merge legacy structuredData without creating duplicate script tags
  if (structuredData) {
    if (structuredData["@graph"] && Array.isArray(structuredData["@graph"])) {
      graphEntities.push(...(structuredData["@graph"] as Record<string, unknown>[]));
    } else {
      graphEntities.push(structuredData);
    }
  }

  const unifiedSchema = {
    "@context": "https://schema.org",
    "@graph": graphEntities
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title"       content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="author"      content={author} />
      {publishDate && <meta name="publish_date" content={publishDate} />}
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }

      {/* Canonical */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      <meta property="og:site_name"   content="CODE Edu" />
      <meta property="og:locale"      content="en_US" />
      {isArticle && publishDate && (
        <meta property="article:published_time" content={publishDate} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card"        content={twitterCard} />
      <meta name="twitter:url"         content={canonicalUrl} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
      <meta name="twitter:creator"     content={twitterHandle} />
      <meta name="twitter:site"        content={twitterHandle} />
      {readingTime && (
        <>
          <meta name="twitter:label1" content="Reading time" />
          <meta name="twitter:data1" content={readingTime} />
        </>
      )}

      {/* Single unified JSON-LD block — zero duplicates */}
      <script type="application/ld+json">
        {JSON.stringify(unifiedSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
