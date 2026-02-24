import React from 'react';
import { Link } from 'react-router-dom';
import './DoubleImageSection.css';

const DoubleImageSection = () => {
    return (
        <section className="double-image-section">
            <div className="double-image-box">
                {/* Remplace le src par ton image principale */}
                <img src="../../assets/images/camp.jpg" alt="Campagne" className="double-image-img" />
                <Link to="/shop" className="double-image-link">Acheter</Link>
            </div>
        </section>
    );
};

export default DoubleImageSection;
