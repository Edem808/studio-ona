import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Legals.css';

const MentionsLegales = () => {
    return (
        <div className="legals-page container">
            <SEO
                title="Mentions Légales"
                description="Mentions légales du site Studio Ona : éditeur du site, directeur de la publication, hébergement, propriété intellectuelle et droit applicable."
            />
            <h1 className="heading-lg text-sans" style={{ paddingTop: '150px', marginBottom: '1rem' }}>
                Mentions Légales
            </h1>
            <p className="legals-date">Dernière mise à jour : 12 Mars 2026</p>

            <div className="legals-content text-sans">
                <section>
                    <h2>1. Éditeur du site</h2>
                    <p>
                        <strong>Raison sociale :</strong> [NOM DE LA SOCIÉTÉ]<br />
                        <strong>Forme juridique :</strong> Société par Actions Simplifiée Unipersonnelle (SASU)<br />
                        <strong>Capital social :</strong> [MONTANT] €<br />
                        <strong>SIRET :</strong> [NUMÉRO SIRET]<br />
                        <strong>N° TVA intracommunautaire :</strong> [N° TVA]<br />
                        <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
                        <strong>Téléphone :</strong> [NUMÉRO DE TÉLÉPHONE]<br />
                        <strong>E-mail :</strong> [ADRESSE E-MAIL]
                    </p>
                    <p>
                        <strong>Activité réglementée :</strong> Opticien-lunetier. Inscription à l'Agence Nationale du DPC
                        (ANDPC) sous le numéro [N° ANDPC] — Diplôme d'opticien-lunetier reconnu par l'État.
                    </p>
                </section>

                <section>
                    <h2>2. Directeur de la publication</h2>
                    <p>
                        [NOM DU/DE LA DIRIGEANT(E)], en qualité de Président(e) de la SASU.
                    </p>
                </section>

                <section>
                    <h2>3. Hébergement du site</h2>
                    <p>
                        <strong>Hébergeur :</strong> [NOM DE L'HÉBERGEUR]<br />
                        <strong>Adresse :</strong> [ADRESSE DE L'HÉBERGEUR]<br />
                        <strong>Site web :</strong> <a href="[URL DE L'HÉBERGEUR]" target="_blank" rel="noopener noreferrer">[URL DE L'HÉBERGEUR]</a>
                    </p>
                </section>

                <section>
                    <h2>4. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des contenus publiés sur le site studio-ona.melissadesjardins.fr (textes,
                        photographies, illustrations, logos, vidéos) sont protégés par le droit de la propriété
                        intellectuelle et appartiennent à [NOM DE LA SOCIÉTÉ] ou à leurs auteurs respectifs.
                    </p>
                    <p>
                        Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie de ces
                        éléments, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite
                        préalable.
                    </p>
                </section>

                <section>
                    <h2>5. Protection des données personnelles</h2>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et
                        Libertés, vous disposez de droits sur vos données personnelles. Pour en savoir plus, consultez notre{' '}
                        <Link to="/confidentialite">Politique de Confidentialité</Link>.
                    </p>
                    <p>
                        Pour exercer vos droits, vous pouvez contacter notre délégué à la protection des données à l'adresse
                        : [EMAIL DPO ou EMAIL DE CONTACT].
                    </p>
                </section>

                <section>
                    <h2>6. Cookies</h2>
                    <p>
                        Le Site utilise des cookies. Pour en savoir plus, consultez notre{' '}
                        <Link to="/cookies">Politique de Cookies</Link>.
                    </p>
                </section>

                <section>
                    <h2>7. Médiation de la consommation</h2>
                    <p>
                        En cas de litige non résolu amiablement, vous pouvez recourir à un médiateur de la
                        consommation. Studio Ona adhère au service de médiation suivant :
                    </p>
                    <p>
                        [NOM DU MÉDIATEUR]<br />
                        [ADRESSE]<br />
                        [SITE INTERNET]
                    </p>
                </section>

                <section>
                    <h2>8. Droit applicable</h2>
                    <p>
                        Le présent site est soumis au droit français. Tout litige relatif à son utilisation sera soumis à la
                        compétence exclusive des tribunaux français.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default MentionsLegales;
