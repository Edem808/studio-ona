export const products = [
    {
        id: 1,
        name: 'Ona Haze',
        price: '80€',
        category: 'Solaires',
        image: '/assets/images/products/ona-haze.jpg', // Placeholder path
        colors: ['Noir', 'Écaille', 'Blanc'],
        description: 'Lunettes de soleil oeil-de-chat aux verres jaune foncé de la collection Printemps Été 2026 de Studio Ona.',
        isNew: true
    },
    {
        id: 2,
        name: 'Ona Eclipse',
        price: '95€',
        category: 'Solaires',
        image: '/assets/images/products/ona-eclipse.jpg',
        colors: ['Noir', 'Gris'],
        description: 'Monture rectangulaire audacieuse pour un look affirmé.',
        isNew: false
    },
    {
        id: 3,
        name: 'Ona Flare',
        price: '85€',
        category: 'Optiques',
        image: '/assets/images/products/ona-flare.jpg',
        colors: ['Doré', 'Argent', 'Or Rose'],
        description: 'Lunettes de vue fines et élégantes en métal léger.',
        isNew: true
    },
    {
        id: 4,
        name: 'Ona Classic',
        price: '75€',
        category: 'Solaires',
        image: '/assets/images/products/ona-classic.jpg',
        colors: ['Écaille', 'Vert'],
        description: 'Le design intemporel revisité avec des matériaux recyclés.',
        isNew: false
    }
];

export const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
};
