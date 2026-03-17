import React from 'react';
import SEO from '../components/SEO';
import './Legals.css';

const Confidentialite = () => {
    return (
        <div className="legals-page container">
            <SEO
                title="Politique de Confidentialité"
                description="Studio Ona s'engage à protéger vos données personnelles conformément au RGPD. Découvrez notre politique de confidentialité : données collectées, finalités, durées de conservation et vos droits."
            />
            <h1 className="heading-lg text-sans" style={{ paddingTop: '150px', marginBottom: '1rem' }}>
                Politique de Confidentialité
            </h1>
            <p className="legals-date">Dernière mise à jour : 12 Mars 2026</p>

            <div className="legals-content text-sans">
                <p>
                    Studio Ona s'engage à protéger la vie privée de ses clients et utilisateurs et à traiter leurs
                    données personnelles dans le strict respect du Règlement Général sur la Protection des Données (RGPD
                    – Règlement UE 2016/679) et de la loi Informatique et Libertés du 6 janvier 1978 modifiée.
                </p>

                <section>
                    <h2>1. Responsable du traitement</h2>
                    <p>
                        [NOM DE LA SOCIÉTÉ]<br />
                        [ADRESSE DU SIÈGE SOCIAL]<br />
                        E-mail : [EMAIL DE CONTACT]
                    </p>
                </section>

                <section>
                    <h2>2. Données collectées</h2>
                    <p>Studio Ona peut collecter les données personnelles suivantes vous concernant :</p>
                    <ul>
                        <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail, numéro de téléphone ;</li>
                        <li><strong>Données de livraison :</strong> adresse postale complète ;</li>
                        <li><strong>Données de paiement :</strong> informations de facturation (les données bancaires sont traitées directement par notre prestataire de paiement sécurisé et ne sont pas stockées par Studio Ona) ;</li>
                        <li><strong>Données de santé visuelle :</strong> ordonnance et prescription optique, le cas échéant ;</li>
                        <li><strong>Données de navigation :</strong> adresse IP, données de cookies, pages visitées, durée de visite ;</li>
                        <li><strong>Données commerciales :</strong> historique des commandes, préférences produits.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Finalités et bases légales des traitements</h2>
                    <div className="legals-table-container">
                        <table className="legals-table">
                            <thead>
                                <tr>
                                    <th>Finalité</th>
                                    <th>Base légale</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Traitement et suivi de vos commandes</td><td>Exécution du contrat</td></tr>
                                <tr><td>Gestion du service client et des retours</td><td>Exécution du contrat</td></tr>
                                <tr><td>Envoi de factures et gestion comptable</td><td>Obligation légale</td></tr>
                                <tr><td>Prévention de la fraude</td><td>Intérêt légitime</td></tr>
                                <tr><td>Envoi de newsletters et offres commerciales</td><td>Consentement</td></tr>
                                <tr><td>Analyse d'audience du site (Google Analytics)</td><td>Consentement</td></tr>
                                <tr><td>Publicité ciblée (Meta Pixel et autres)</td><td>Consentement</td></tr>
                                <tr><td>Amélioration de nos services et produits</td><td>Intérêt légitime</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2>4. Durées de conservation</h2>
                    <div className="legals-table-container">
                        <table className="legals-table">
                            <thead>
                                <tr>
                                    <th>Type de données</th>
                                    <th>Durée de conservation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Données de compte client</td><td>3 ans après la dernière commande ou contact</td></tr>
                                <tr><td>Données de commandes et factures</td><td>10 ans (obligation comptable)</td></tr>
                                <tr><td>Ordonnances optiques</td><td>3 ans (réglementation médicale)</td></tr>
                                <tr><td>Données de prospection commerciale</td><td>3 ans après le dernier contact</td></tr>
                                <tr><td>Données de cookies analytiques</td><td>13 mois maximum</td></tr>
                                <tr><td>Données de cookies publicitaires</td><td>Selon les politiques des tiers (Meta, Google)</td></tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2>5. Destinataires des données</h2>
                    <p>Vos données personnelles peuvent être communiquées aux catégories de destinataires suivantes :</p>
                    <ul>
                        <li>Prestataires de paiement ([Stripe, PayPal, etc.]) pour le traitement sécurisé des transactions ;</li>
                        <li>Transporteurs et sociétés de livraison pour l'acheminement de vos commandes ;</li>
                        <li>Prestataires techniques (hébergement, maintenance du site) ;</li>
                        <li>Outils d'analyse et de marketing (Google Analytics, Meta, etc.) sous réserve de votre consentement ;</li>
                        <li>Autorités compétentes en cas d'obligation légale.</li>
                    </ul>
                    <p>Studio Ona ne vend ni ne loue vos données personnelles à des tiers.</p>
                </section>

                <section>
                    <h2>6. Transferts hors Union Européenne</h2>
                    <p>
                        Certains de nos prestataires (notamment Google et Meta) sont établis en dehors de l'Union
                        Européenne, notamment aux États-Unis. Ces transferts sont encadrés par des mécanismes de protection
                        adéquats (clauses contractuelles types de la Commission européenne, certification Data Privacy Framework).
                    </p>
                </section>

                <section>
                    <h2>7. Vos droits</h2>
                    <p>Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :</p>
                    <ul>
                        <li><strong>Droit d'accès :</strong> obtenir confirmation que vos données sont traitées et en obtenir une copie ;</li>
                        <li><strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes ;</li>
                        <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données (sous réserve des obligations légales) ;</li>
                        <li><strong>Droit à la limitation :</strong> demander le gel temporaire du traitement de vos données ;</li>
                        <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible par machine ;</li>
                        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données, notamment à des fins de prospection commerciale ;</li>
                        <li><strong>Droit de retirer votre consentement</strong> à tout moment, sans que cela n'affecte la licéité du traitement antérieur ;</li>
                        <li><strong>Droit de définir des directives post-mortem</strong> relatives au sort de vos données après votre décès.</li>
                    </ul>
                    <p>
                        Pour exercer vos droits, contactez-nous à : [EMAIL DE CONTACT], en joignant une copie d'un
                        justificatif d'identité. Nous nous engageons à vous répondre dans un délai d'un mois.
                    </p>
                    <p>
                        En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la CNIL
                        (Commission Nationale de l'Informatique et des Libertés) — 3 Place de Fontenoy, TSA 80715, 75334
                        Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
                    </p>
                </section>

                <section>
                    <h2>8. Sécurité des données</h2>
                    <p>
                        Studio Ona met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos
                        données personnelles contre tout accès non autorisé, perte, destruction ou altération. L'ensemble
                        des données sensibles (paiements) sont traitées via des connexions HTTPS sécurisées.
                    </p>
                </section>

                <section>
                    <h2>9. Modifications de la politique de confidentialité</h2>
                    <p>
                        Studio Ona se réserve le droit de modifier la présente politique à tout moment. La version en
                        vigueur est celle accessible sur le Site à la date de votre visite. En cas de modification
                        substantielle, Studio Ona s'engage à vous en informer par e-mail ou par une notification visible sur
                        le Site.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Confidentialite;
