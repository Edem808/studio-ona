import React from 'react';
import SEO from '../components/SEO';
import './Legals.css';

const Cookies = () => {
    return (
        <div className="legals-page container">
            <SEO
                title="Politique de Cookies"
                description="Découvrez comment Studio Ona utilise les cookies sur son site internet pour améliorer votre expérience."
            />
            <h1 className="heading-lg text-sans" style={{ paddingTop: '150px', marginBottom: '1rem' }}>
                Politique de Cookies
            </h1>
            <p className="legals-date">Dernière mise à jour : 12 Mars 2026</p>

            <div className="legals-content text-sans">
                <section>
                    <h2>1. Qu'est-ce qu'un cookie ?</h2>
                    <p>
                        Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site ou de la consultation d'une publicité. Il a pour but de collecter des informations relatives à votre navigation et de vous adresser des services adaptés à votre terminal.
                    </p>
                </section>

                <section>
                    <h2>2. Les cookies utilisés par Studio Ona</h2>
                    <p>Nous utilisons différents types de cookies sur notre site :</p>
                    <ul>
                        <li><strong>Cookies strictement nécessaires :</strong> Ils sont indispensables au bon fonctionnement du site et ne peuvent pas être désactivés (ex: gestion du panier, connexion à votre compte).</li>
                        <li><strong>Cookies de performance et d'analyse :</strong> Ils nous permettent de recueillir des informations sur la manière dont les visiteurs utilisent le site (pages les plus visitées, messages d'erreur) afin d'en améliorer le fonctionnement (ex: Google Analytics).</li>
                        <li><strong>Cookies fonctionnels :</strong> Ils permettent de mémoriser vos choix et préférences pour vous offrir une expérience personnalisée.</li>
                        <li><strong>Cookies publicitaires :</strong> Ils sont utilisés pour vous présenter des publicités adaptées à vos centres d'intérêt sur notre site ou en dehors.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Durée de conservation</h2>
                    <p>
                        Les cookies sont conservés pour une durée maximale de 13 mois à compter de leur dépôt sur votre terminal. À l'expiration de ce délai, votre consentement sera à nouveau recueilli.
                    </p>
                </section>

                <section>
                    <h2>4. Gestion de vos préférences</h2>
                    <p>
                        Lors de votre première visite sur notre site, un bandeau d'information vous permet d'accepter ou de refuser l'utilisation de certains cookies. Vous pouvez modifier vos préférences à tout moment en ajustant les paramètres de votre navigateur web :
                    </p>
                    <ul>
                        <li><strong>Google Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies et autres données des sites.</li>
                        <li><strong>Mozilla Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de sites.</li>
                        <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Gérer les données du site web.</li>
                    </ul>
                    <p>
                        Veuillez noter que le refus ou la suppression des cookies peut altérer votre expérience de navigation sur notre site et vous empêcher d'accéder à certains services.
                    </p>
                </section>

                <section>
                    <h2>5. Contact</h2>
                    <p>
                        Pour toute question concernant notre politique de cookies, vous pouvez nous contacter à l'adresse email suivante : contactstudio.ona@gmail.com.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Cookies;
