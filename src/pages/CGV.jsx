import React from 'react';
import SEO from '../components/SEO';
import './Legals.css'; // We'll use a shared CSS file for legal pages

const CGV = () => {
    return (
        <div className="legals-page container">
            <SEO
                title="Conditions Générales de Vente"
                description="Consultez les Conditions Générales de Vente de Studio Ona : commandes, livraison, paiement, droit de rétractation, garanties et politique de retour pour vos achats de lunettes."
            />
            <h1 className="heading-lg text-sans" style={{ paddingTop: '150px', marginBottom: '1rem' }}>
                Conditions Générales de Vente
            </h1>
            <p className="legals-date">Dernière mise à jour : 12 Mars 2026</p>

            <div className="legals-content text-sans">
                <section>
                    <h2>Article 1 – Identification du vendeur</h2>
                    <p>
                        Le présent site est exploité par la société [NOM DE LA SOCIÉTÉ], [FORME JURIDIQUE] au capital de
                        [MONTANT] €, immatriculée au Registre du Commerce et des Sociétés de [VILLE RCS] sous le numéro
                        SIRET [SIRET], dont le siège social est situé au [ADRESSE COMPLÈTE] (ci-après « Studio Ona »).
                    </p>
                    <p>Numéro de TVA intracommunautaire : [N° TVA]</p>
                    <p>Adresse e-mail : [EMAIL DE CONTACT]</p>
                </section>

                <section>
                    <h2>Article 2 – Champ d'application</h2>
                    <p>
                        Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à toute commande
                        passée sur le site studio-ona.melissadesjardins.fr par tout acheteur non professionnel (ci-après
                        « le Client »). Elles régissent exclusivement la vente de produits optiques, de lunettes, d'étuis
                        et d'accessoires optiques proposés par Studio Ona.
                    </p>
                    <p>
                        Toute commande implique l'acceptation sans réserve des présentes CGV. Studio Ona se réserve le droit
                        de les modifier à tout moment ; les CGV applicables sont celles en vigueur au jour de la commande.
                    </p>
                </section>

                <section>
                    <h2>Article 3 – Produits</h2>
                    <p>
                        Les produits proposés à la vente sont ceux figurant sur le site au moment de la consultation. Studio
                        Ona s'efforce de présenter les caractéristiques essentielles des produits (descriptions,
                        photographies) avec la plus grande exactitude possible. Les photographies sont fournies à titre
                        indicatif et ne sont pas contractuelles.
                    </p>
                    <p>
                        Studio Ona se réserve le droit de retirer tout produit du catalogue à tout moment et sans préavis.
                    </p>
                </section>

                <section>
                    <h2>Article 4 – Prix</h2>
                    <p>
                        Les prix sont indiqués en euros (€) toutes taxes comprises (TTC), hors frais de livraison. Studio
                        Ona se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est
                        celui indiqué sur le site au moment de la validation de la commande.
                    </p>
                    <p>
                        Les frais de livraison sont indiqués lors du processus de commande, avant validation définitive.
                    </p>
                </section>

                <section>
                    <h2>Article 5 – Commande</h2>
                    <p>
                        Le Client effectue sa commande en ajoutant les produits souhaités à son panier, en renseignant ses
                        informations de livraison et en validant son paiement. La commande est confirmée par un e-mail de
                        confirmation envoyé à l'adresse renseignée par le Client.
                    </p>
                    <p>
                        Studio Ona se réserve le droit de refuser toute commande pour des raisons légitimes, notamment en
                        cas de litige antérieur, de rupture de stock ou de suspicion de fraude.
                    </p>
                </section>

                <section>
                    <h2>Article 6 – Paiement</h2>
                    <p>
                        Le paiement est exigible immédiatement à la commande. Les paiements sont sécurisés et peuvent être
                        effectués par les moyens suivants : [carte bancaire Visa/Mastercard, PayPal, etc.].
                    </p>
                    <p>
                        Studio Ona utilise un système de paiement sécurisé conforme aux normes PCI-DSS. Les coordonnées
                        bancaires du Client ne sont pas stockées sur nos serveurs.
                    </p>
                </section>

                <section>
                    <h2>Article 7 – Livraison</h2>
                    <p>
                        Les produits sont livrés à l'adresse indiquée par le Client lors de la commande. Studio Ona livre en
                        France métropolitaine, dans les DOM-TOM, en Europe et à l'international.
                    </p>
                    <p>Les délais de livraison indicatifs sont les suivants :</p>
                    <ul>
                        <li>France métropolitaine : [X à Y jours ouvrés]</li>
                        <li>DOM-TOM : [X à Y jours ouvrés]</li>
                        <li>Europe : [X à Y jours ouvrés]</li>
                        <li>International : [X à Y jours ouvrés]</li>
                    </ul>
                    <p>
                        En cas de retard de livraison, Studio Ona en informera le Client dans les meilleurs délais. Le retard
                        ne pourra pas donner lieu à des dommages et intérêts au bénéfice du Client, sauf en cas de faute
                        grave de Studio Ona.
                    </p>
                    <p>Les risques liés aux produits sont transférés au Client à la livraison.</p>
                </section>

                <section>
                    <h2>Article 8 – Droit de rétractation</h2>
                    <p>
                        Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un délai de 14 jours
                        calendaires à compter de la réception des produits pour exercer son droit de rétractation, sans
                        avoir à justifier de motifs ni à payer de pénalités.
                    </p>
                    <p>
                        Pour exercer ce droit, le Client doit notifier sa décision à Studio Ona avant l'expiration du délai,
                        par courrier électronique à [EMAIL] ou par courrier à [ADRESSE], en utilisant le formulaire de
                        rétractation disponible en annexe ou par toute déclaration dénuée d'ambiguïté.
                    </p>
                    <p>
                        Les produits doivent être retournés dans leur état d'origine, non portés et dans leur emballage
                        d'origine, dans un délai de 14 jours après l'envoi de la notification. Les frais de retour sont à la
                        charge du Client.
                    </p>
                    <p>Le remboursement sera effectué dans un délai de 14 jours à compter de la réception des produits retournés.</p>
                    <p>
                        <strong>Exception :</strong> Le droit de rétractation ne s'applique pas aux produits personnalisés ou
                        fabriqués sur mesure selon les spécifications du Client (ex. : verres correcteurs à prescription).
                    </p>
                </section>

                <section>
                    <h2>Article 9 – Garanties</h2>
                    <p>
                        Tous les produits vendus par Studio Ona bénéficient de la garantie légale de conformité (articles
                        L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles
                        1641 et suivants du Code civil).
                    </p>
                    <p>
                        En cas de défaut de conformité constaté dans un délai de 2 ans à compter de la livraison, le Client
                        peut demander la réparation ou le remplacement du produit, ou, si cela est impossible, un
                        remboursement.
                    </p>
                </section>

                <section>
                    <h2>Article 10 – Responsabilité</h2>
                    <p>
                        Studio Ona ne saurait être tenue responsable des dommages résultant d'une mauvaise utilisation des
                        produits achetés, d'un cas de force majeure ou du fait d'un tiers. La responsabilité de Studio Ona est
                        limitée au montant de la commande concernée.
                    </p>
                </section>

                <section>
                    <h2>Article 11 – Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des éléments du site (textes, images, logos, marques) sont la propriété exclusive de
                        Studio Ona et sont protégés par le droit de la propriété intellectuelle. Toute reproduction, totale
                        ou partielle, est strictement interdite sans l'accord préalable écrit de Studio Ona.
                    </p>
                </section>

                <section>
                    <h2>Article 12 – Droit applicable et litiges</h2>
                    <p>
                        Les présentes CGV sont soumises au droit français. En cas de litige, le Client est invité à
                        contacter Studio Ona en priorité afin de trouver une solution amiable. À défaut, le Client peut
                        recourir à la médiation de la consommation en contactant le médiateur suivant : [NOM ET COORDONNÉES
                        DU MÉDIATEUR].
                    </p>
                    <p>
                        Conformément au Règlement européen n°524/2013, le Client peut également recourir à la plateforme de
                        résolution des litiges en ligne de la Commission européenne disponible sur :{' '}
                        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                            https://ec.europa.eu/consumers/odr
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CGV;
