import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Studio Ona';
const DEFAULT_KEYWORDS = 'Studio Ona, lunettes créateur, lunettes design, montures minimalistes, eyewear, lunettes de soleil, lunettes optiques, opticien Paris, lunettes haut de gamme, essayage virtuel lunettes';

const SEO = ({
    title,
    description,
    keywords = '',
    canonical,
    ogTitle,
    ogDescription,
    ogImage = '/assets/images/og-ona.png',
    ogType = 'website',
    noindex = false,
}) => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Lunettes de Créateur à Paris`;
    const allKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || ''} />
            <meta name="keywords" content={allKeywords} />

            {/* Open Graph */}
            <meta property="og:title" content={ogTitle || fullTitle} />
            <meta property="og:description" content={ogDescription || description || ''} />
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="fr_FR" />
            <meta property="og:image" content={ogImage} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || fullTitle} />
            <meta name="twitter:description" content={ogDescription || description || ''} />
            <meta name="twitter:image" content={ogImage} />

            {/* Canonical */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}
        </Helmet>
    );
};

export default SEO;
