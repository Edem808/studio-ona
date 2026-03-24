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
                        <strong>Raison sociale :</strong> Studio Ona<br />
                        <strong>Forme juridique :</strong> Société par Actions Simplifiée Unipersonnelle (SASU)<br />
                        <strong>Capital social :</strong> 10 000 €<br />
                        <strong>SIRET :</strong> 123 456 789 00012<br />
                        <strong>N° TVA intracommunautaire :</strong> FR 12 123456789<br />
                        <strong>Siège social :</strong> 12 Rue des Lunetiers, 75003 Paris, France<br />
                        <strong>Téléphone :</strong> 01 23 45 67 89<br />
                        <strong>E-mail :</strong> contactstudio.ona@gmail.com
                    </p>
                    <p>
                        <strong>Activité réglementée :</strong> Opticien-lunetier. Inscription à l'Agence Nationale du DPC
                        (ANDPC) sous le numéro 1234567890 — Diplôme d'opticien-lunetier reconnu par l'État.
                    </p>
                </section>

                <section>
                    <h2>2. Directeur de la publication</h2>
                    <p>
                        Edem, en qualité de Président(e) de la SASU.
                    </p>
                </section>

                <section>
                    <h2>3. Hébergement du site</h2>
                    <p>
                        <strong>Hébergeur :</strong> Vercel Inc.<br />
                        <strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA<br />
                        <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
                    </p>
                </section>

                <section>
                    <h2>4. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des contenus publiés sur le site studio-ona.melissadesjardins.fr (textes,
                        photographies, illustrations, logos, vidéos) sont protégés par le droit de la propriété
                        intellectuelle et appartiennent à Studio Ona ou à leurs auteurs respectifs.
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
                        : contactstudio.ona@gmail.com.
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
                        CM2C<br />
                        14 rue Saint Jean 75017 Paris<br />
                        https://www.cm2c.net
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
