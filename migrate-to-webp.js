import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateImages() {
    console.log("🚀 Lancement de la migration des images vers WebP...");

    // Fetch all products
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        return;
    }

    console.log(`Trouvé ${products.length} produits. Verification des images...`);

    for (const product of products) {
        let needsUpdate = false;
        const newVariants = [];

        if (!product.variants || !Array.isArray(product.variants)) {
            continue;
        }

        for (const variant of product.variants) {
            const newImages = [];

            for (const imgUrl of variant.images) {
                // Check if it's an image stored in our Supabase and not already WEBP
                if (imgUrl.includes('supabase.co') && !imgUrl.toLowerCase().endsWith('.webp')) {
                    try {
                        console.log(`[Produit ID ${product.id}] Conversion de l'image: ${imgUrl}`);

                        // 1. Download image
                        const response = await fetch(imgUrl);
                        if (!response.ok) throw new Error(`HTTP fetch error! status: ${response.status}`);
                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        // 2. Convert to WEBP
                        const webpBuffer = await sharp(buffer)
                            .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }) // Optional resize
                            .webp({ quality: 80 })
                            .toBuffer();

                        // 3. Upload to Supabase
                        const fileName = `${Math.random()}-${Date.now()}.webp`;
                        const { data: uploadData, error: uploadError } = await supabase.storage
                            .from('product-images')
                            .upload(fileName, webpBuffer, {
                                contentType: 'image/webp',
                                upsert: false
                            });

                        if (uploadError) {
                            console.error("Erreur d'upload Storage:", uploadError);
                            newImages.push(imgUrl); // Keep old URL if upload fails
                            continue;
                        }

                        // 4. Get new public URL
                        const { data: publicUrlData } = supabase.storage
                            .from('product-images')
                            .getPublicUrl(fileName);

                        const newUrl = publicUrlData.publicUrl;
                        console.log(` ✅ Transformé en: ${newUrl}`);

                        newImages.push(newUrl);
                        needsUpdate = true;

                        // (Optional: Delete the old image file here to save space)
                        // Extract old filename
                        // const oldFilename = imgUrl.split('/').pop().split('?')[0];
                        // await supabase.storage.from('product-images').remove([oldFilename]);

                    } catch (e) {
                        console.error(`❌ Erreur sur l'image ${imgUrl}:`, e.message);
                        newImages.push(imgUrl); // Keep old if fail
                    }
                } else {
                    // Jimmy Fairly CDN image or already webp
                    newImages.push(imgUrl);
                }
            }

            newVariants.push({ ...variant, images: newImages });
        }

        // 5. Update product in DB if necessary
        if (needsUpdate) {
            console.log(`[Produit ID ${product.id}] Mise à jour du produit en base de données...`);
            const { error: updateError } = await supabase
                .from('products')
                .update({ variants: newVariants })
                .eq('id', product.id);

            if (updateError) {
                console.error(`❌ Erreur de mise à jour du produit ${product.id}:`, updateError);
            } else {
                console.log(`✅ Produit ${product.id} mis à jour avec succès!`);
            }
        }
    }

    console.log("🎉 Migration terminée !");
}

migrateImages();
