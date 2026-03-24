import React from 'react';
import SEO from '../components/SEO';
import './Legals.css';

const CGU = () => {
    return (
        <div className="legals-page container">
            <SEO
                title="Conditions Générales d'Utilisation"
                description="Consultez les Conditions Générales d'Utilisation du site Studio Ona : accès au site, création de compte, propriété intellectuelle et responsabilité."
            />
            <h1 className="heading-lg text-sans" style={{ paddingTop: '150px', marginBottom: '1rem' }}>
                Conditions Générales d'Utilisation
            </h1>
            <p className="legals-date">Dernière mise à jour : 12 Mars 2026</p>

            <div className="legals-content text-sans">
                <section>
                    <h2>Article 1 – Objet</h2>
                    <p>
                        Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les
                        modalités et conditions d'utilisation du site internet studio-ona.melissadesjardins.fr (ci-après «
                        le Site »), ainsi que les droits et obligations des utilisateurs.
                    </p>
                    <p>Le Site est édité par Studio Ona, opticien-lunetier.</p>
                </section>

                <section>
                    <h2>Article 2 – Acceptation des CGU</h2>
                    <p>
                        L'accès au Site et son utilisation sont soumis à l'acceptation pleine et entière des présentes
                        CGU. En accédant au Site, l'utilisateur reconnaît avoir pris connaissance des présentes CGU et les
                        accepter sans réserve. Si l'utilisateur ne souhaite pas les accepter, il lui appartient de ne pas
                        utiliser le Site.
                    </p>
                </section>

                <section>
                    <h2>Article 3 – Accès au Site</h2>
                    <p>
                        Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Les frais
                        relatifs à l'accès au Site (connexion Internet, matériel informatique) sont à la charge exclusive
                        de l'utilisateur.
                    </p>
                    <p>
                        Studio Ona se réserve le droit de suspendre, modifier ou interrompre l'accès au Site, en tout ou
                        partie, à tout moment, notamment pour des raisons de maintenance ou de mise à jour, sans que
                        cette interruption puisse ouvrir droit à une quelconque indemnisation.
                    </p>
                </section>

                <section>
                    <h2>Article 4 – Création de compte</h2>
                    <p>
                        Pour passer une commande, l'utilisateur peut être invité à créer un compte personnel en renseignant
                        ses informations (nom, prénom, adresse e-mail, mot de passe). L'utilisateur s'engage à fournir
                        des informations exactes et à les maintenir à jour.
                    </p>
                    <p>
                        L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute
                        utilisation du compte depuis ses identifiants est présumée effectuée par l'utilisateur. En cas de
                        perte ou de vol de ses identifiants, l'utilisateur doit en informer Studio Ona sans délai.
                    </p>
                </section>

                <section>
                    <h2>Article 5 – Comportement de l'utilisateur</h2>
                    <p>
                        L'utilisateur s'engage à utiliser le Site de manière conforme à sa destination et aux lois et
                        règlements en vigueur. Il est notamment interdit :
                    </p>
                    <ul>
                        <li>d'utiliser le Site à des fins illicites ou frauduleuses ;</li>
                        <li>de diffuser des contenus offensants, diffamatoires ou contraires aux bonnes mœurs ;</li>
                        <li>de tenter de porter atteinte à la sécurité ou à l'intégrité du Site ;</li>
                        <li>de collecter des données personnelles d'autres utilisateurs sans leur consentement ;</li>
                        <li>d'utiliser des robots ou outils automatisés pour accéder au Site.</li>
                    </ul>
                </section>

                <section>
                    <h2>Article 6 – Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des contenus présents sur le Site (textes, images, photographies, logos, vidéos,
                        sons, données, bases de données, logiciels, noms de domaine) sont la propriété exclusive de
                        Studio Ona ou de ses partenaires et sont protégés par les lois françaises et internationales
                        relatives à la propriété intellectuelle.
                    </p>
                    <p>
                        Toute reproduction, représentation, diffusion ou exploitation de ces contenus, en tout ou partie,
                        sous quelque forme que ce soit, sans l'autorisation préalable et écrite de Studio Ona, est
                        strictement interdite et constituerait une contrefaçon sanctionnée par les articles L335-2 et
                        suivants du Code de la propriété intellectuelle.
                    </p>
                </section>

                <section>
                    <h2>Article 7 – Liens hypertextes</h2>
                    <p>
                        Le Site peut contenir des liens vers des sites internet tiers. Ces liens sont fournis à titre
                        d'information uniquement. Studio Ona n'exerce aucun contrôle sur ces sites et décline toute
                        responsabilité quant à leur contenu ou à leurs pratiques en matière de protection des données
                        personnelles.
                    </p>
                    <p>Toute création d'un lien hypertexte vers le Site est soumise à l'accord préalable et écrit de Studio Ona.</p>
                </section>

                <section>
                    <h2>Article 8 – Limitation de responsabilité</h2>
                    <p>
                        Studio Ona s'efforce de mettre à disposition des informations exactes et à jour sur son Site.
                        Toutefois, Studio Ona ne garantit pas l'exactitude, la complétude ou l'actualité des informations
                        diffusées. L'utilisation des informations contenues sur le Site est faite sous la seule
                        responsabilité de l'utilisateur.
                    </p>
                    <p>
                        Studio Ona ne saurait être tenue responsable des dommages directs ou indirects résultant de
                        l'utilisation du Site ou de l'impossibilité d'y accéder.
                    </p>
                </section>

                <section>
                    <h2>Article 9 – Modification des CGU</h2>
                    <p>
                        Studio Ona se réserve le droit de modifier les présentes CGU à tout moment. Les nouvelles CGU
                        seront publiées sur le Site avec mention de leur date de mise à jour. L'utilisateur est invité à
                        consulter régulièrement les CGU. La poursuite de l'utilisation du Site après modification vaut
                        acceptation des nouvelles CGU.
                    </p>
                </section>

                <section>
                    <h2>Article 10 – Droit applicable</h2>
                    <p>
                        Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou
                        exécution sera soumis aux juridictions compétentes du ressort du siège social de Studio Ona, sauf
                        dispositions légales contraires applicables aux consommateurs.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CGU;
