'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create or update the JSON-LD script tag
    let script = document.querySelector<HTMLScriptElement>('#structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      // Clean up when component unmounts
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [data]);

  return null;
}

// Pre-configured structured data for Goatly
export function GoatlyStructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Goatly",
    "alternateName": "Goatly - مجتمع مفتوح المصدر للدراسة الجماعية",
    "url": "https://goatly.app",
    "logo": "https://goatly.app/goat.png",
    "description": "Goatly هو مجتمع مفتوح المصدر ومجاني للدراسة الجماعية. انضم لآلاف الطلاب للدراسة معاً، تحفيز بعضكم البعض، وتحقيق أهدافكم الأكاديمية معاً.",
    "founder": {
      "@type": "Person",
      "name": "Izzeldeenn"
    },
    "sameAs": [
      "https://github.com/izzeldeenn/goatly",
      "https://discord.gg/5wBNne8Z3f"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "community support",
      "availableLanguage": ["Arabic", "English"]
    }
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Goatly",
    "alternateName": "Goatly - مجتمع مفتوح المصدر للدراسة الجماعية",
    "url": "https://goatly.app",
    "description": "مجتمع مفتوح المصدر ومجاني للدراسة الجماعية مع آلاف الطلاب النشطين",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://goatly.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["ar", "en"]
  };

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Goatly",
    "operatingSystem": "Web",
    "applicationCategory": "EducationalApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "50000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "دراسة جماعية",
      "مجتمع طلابي مفتوح المصدر",
      "تحفيز أكاديمي",
      "تتبع التقدم الجماعي",
      "أهداف مشتركة",
      "سلاسل التركيز الجماعية"
    ],
    "description": "مجتمع مفتوح المصدر ومجاني للدراسة الجماعية يساعد الطلاب على الدراسة معاً وتحقيق أهدافهم الأكاديمية معاً"
  };

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "كيفية الانضمام لمجتمع Goatly للدراسة الجماعية",
    "description": "دليل شامل للانضمام لمجتمع Goatly المفتوح المصدر للدراسة الجماعية",
    "step": [
      {
        "@type": "HowToStep",
        "name": "انضم للمجتمع",
        "text": "أنشئ حساباً مجانياً في Goatly للانضمام لمجتمع الدراسة الجماعية"
      },
      {
        "@type": "HowToStep",
        "name": "ابدأ الدراسة معاً",
        "text": "انضم لجلسات دراسة جماعية مع طلاب آخرين"
      },
      {
        "@type": "HowToStep",
        "name": "حقق أهدافك معاً",
        "text": "حدد أهدافك المشتركة وتتبع تقدمك مع المجتمع"
      },
      {
        "@type": "HowToStep",
        "name": "ساهم في المجتمع",
        "text": "شارك معرفتك وحفز زملائك للنجاح معاً"
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "هل Goatly مجاني؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، Goatly مجاني بالكامل ومفتوح المصدر. لا توجد رسوم اشتراك أو ميزات مدفوعة. هو مجتمع للدراسة الجماعية."
        }
      },
      {
        "@type": "Question",
        "name": "ما هو Goatly؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Goatly هو مجتمع مفتوح المصدر ومجاني للدراسة الجماعية. يجمع آلاف الطلاب للدراسة معاً، تحفيز بعضهم البعض، وتحقيق أهدافهم الأكاديمية معاً."
        }
      },
      {
        "@type": "Question",
        "name": "هل يمكنني استخدام Goatly على هاتفي؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، Goatly يعمل على جميع الأجهزة بما في ذلك الهواتف والأجهزة اللوحية والحواسيب من خلال المتصفح."
        }
      },
      {
        "@type": "Question",
        "name": "كيف يساعدني Goatly في الدراسة؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Goatly يساعدك من خلال المجتمع الدراسي الجماعي، التحفيز المتبادل، تتبع التقدم الجماعي، ودعم الأقران للنجاح الأكاديمي معاً."
        }
      }
    ]
  };

  // Combine all structured data
  const combinedData = [organizationData, websiteData, softwareApplicationData, howToData, faqData];

  return <StructuredData data={combinedData} />;
}
