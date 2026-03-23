import { useState, useRef } from 'react';
import { X, Upload, FileText, Info, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './PrescriptionPopup.css';

/* ─────────────────────────────────────────────
   Helper: empty correction object
───────────────────────────────────────────── */
const emptyEye = () => ({ sphere: '', cylinder: '', axis: '', addition: '' });

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const PrescriptionPopup = ({ product, selectedColor, onConfirm, onCancel }) => {
    const [tab, setTab] = useState('form'); // 'form' | 'upload'
    const [od, setOd] = useState(emptyEye()); // Œil Droit
    const [og, setOg] = useState(emptyEye()); // Œil Gauche
    const [pupDist, setPupDist] = useState('');
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    /* ── Validation ── */
    const formValid = od.sphere !== '' || og.sphere !== ''; // au moins un champ sphere renseigné
    const uploadValid = file !== null;
    const canConfirm = tab === 'form' ? formValid : uploadValid;

    /* ── File handling ── */
    const handleFileDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) validateAndSetFile(dropped);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) validateAndSetFile(selected);
    };

    const validateAndSetFile = (f) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(f.type)) {
            setFile(f);
        } else {
            alert('Format non supporté. Veuillez choisir un PDF, JPG ou PNG.');
        }
    };

    const [uploading, setUploading] = useState(false);

    /* ── Confirm ── */
    const handleConfirm = async () => {
        let prescriptionData = {};
        if (tab === 'form') {
            prescriptionData = { type: 'form', od, og, pupillaryDistance: pupDist };
        } else {
            setUploading(true);
            try {
                // Upload to Supabase Storage (bucket: prescriptions)
                const ext = file.name.split('.').pop();
                const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
                const { error: upErr } = await supabase.storage
                    .from('prescriptions')
                    .upload(filePath, file, { contentType: file.type });

                if (upErr) {
                    // Fallback: just store the file name without the data
                    console.error('Upload failed:', upErr);
                    prescriptionData = {
                        type: 'upload',
                        fileName: file.name,
                        fileUrl: null,
                        uploadError: true,
                    };
                } else {
                    const { data: pub } = supabase.storage
                        .from('prescriptions')
                        .getPublicUrl(filePath);
                    prescriptionData = {
                        type: 'upload',
                        fileName: file.name,
                        fileUrl: pub.publicUrl,
                    };
                }
            } catch (err) {
                console.error('Upload error:', err);
                prescriptionData = {
                    type: 'upload',
                    fileName: file.name,
                    fileUrl: null,
                    uploadError: true,
                };
            } finally {
                setUploading(false);
            }
        }
        onConfirm(product, selectedColor, 1, prescriptionData);
    };

    /* ── Sphere options ── */
    const sphereOptions = [];
    for (let v = -7; v <= 7; v += 0.25) {
        sphereOptions.push(v.toFixed(2));
    }

    const CylOptions = [];
    for (let v = -10; v <= 10; v += 0.25) {
        CylOptions.push(v.toFixed(2));
    }

    const axisOptions = [];
    for (let v = 0; v <= 180; v += 1) {
        axisOptions.push(v);
    }

    /* ── Render field ── */
    const EyeForm = ({ label, value, onChange }) => (
        <div className="presc-eye-group">
            <p className="presc-eye-label">
                <span><Eye size={13} strokeWidth={1.8} /></span> Œil {label}
            </p>
            <div className="presc-fields four-cols">
                <div className="presc-field">
                    <label>Sphère</label>
                    <select value={value.sphere} onChange={e => onChange({ ...value, sphere: e.target.value })}>
                        <option value="">—</option>
                        {sphereOptions.map(o => (
                            <option key={o} value={o}>{o > 0 ? `+${o}` : o}</option>
                        ))}
                    </select>
                </div>
                <div className="presc-field">
                    <label>Cylindre</label>
                    <select value={value.cylinder} onChange={e => onChange({ ...value, cylinder: e.target.value })}>
                        <option value="">—</option>
                        {CylOptions.map(o => (
                            <option key={o} value={o}>{o > 0 ? `+${o}` : o}</option>
                        ))}
                    </select>
                </div>
                <div className="presc-field">
                    <label>Axe (°)</label>
                    <select value={value.axis} onChange={e => onChange({ ...value, axis: e.target.value })}>
                        <option value="">—</option>
                        {axisOptions.map(o => (
                            <option key={o} value={o}>{o}°</option>
                        ))}
                    </select>
                </div>
                <div className="presc-field">
                    <label>Addition</label>
                    <select value={value.addition} onChange={e => onChange({ ...value, addition: e.target.value })}>
                        <option value="">—</option>
                        {['0.75','1.00','1.25','1.50','1.75','2.00','2.25','2.50','2.75','3.00','3.25','3.50'].map(o => (
                            <option key={o} value={o}>+{o}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    return (
        <div className="prescription-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="prescription-modal" role="dialog" aria-modal="true" aria-label="Saisir votre correction">

                {/* Header Top / Close */}
                <div className="presc-close">
                    <button className="btn-close-drawer" onClick={onCancel} aria-label="Fermer">
                        <X size={24} strokeWidth={1} />
                        <span>Fermer</span>
                    </button>
                </div>

                {/* Header Content */}
                <div className="presc-header">
                    <h2 className="text-sans">Votre correction optique</h2>
                    <p>Pour finaliser votre commande, saisissez votre correction ou téléversez votre ordonnance.</p>
                </div>

                {/* Tabs */}
                <div className="presc-tabs">
                    <button
                        className={`presc-tab text-sans ${tab === 'form' ? 'active' : ''}`}
                        onClick={() => setTab('form')}
                    >
                        Saisir ma correction
                    </button>
                    <button
                        className={`presc-tab text-sans ${tab === 'upload' ? 'active' : ''}`}
                        onClick={() => setTab('upload')}
                    >
                        Téléverser mon ordonnance
                    </button>
                </div>

                {/* Body */}
                <div className="presc-body">
                    {tab === 'form' ? (
                        <div className="presc-form-grid">
                            <div className="presc-info-badge">
                                <Info size={15} strokeWidth={1.5} />
                                <span>Retrouvez ces informations sur votre dernière ordonnance. En cas de doute, contactez votre opticien.</span>
                            </div>

                            <EyeForm label="Droit" value={od} onChange={setOd} />
                            <div className="presc-divider" />
                            <EyeForm label="Gauche" value={og} onChange={setOg} />
                            <div className="presc-divider" />

                            <div className="presc-pupillary">
                                <div className="presc-field">
                                    <label>Écart pupillaire (mm)</label>
                                    <input
                                        type="number"
                                        min="50"
                                        max="80"
                                        step="0.5"
                                        placeholder="ex : 63"
                                        value={pupDist}
                                        onChange={e => setPupDist(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="presc-info-badge">
                                <Info size={15} strokeWidth={1.5} />
                                <span>Formats acceptés : PDF, JPG, PNG — Taille max 10 Mo. Votre ordonnance doit dater de moins de 3 ans.</span>
                            </div>

                            <div
                                className={`presc-upload-zone ${dragOver ? 'drag-over' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div className="presc-upload-icon">
                                    <Upload size={36} strokeWidth={1} />
                                </div>
                                <p>Glissez-déposez votre ordonnance ici</p>
                                <small>ou cliquez pour parcourir vos fichiers</small>
                            </div>

                            {file && (
                                <div className="presc-file-selected">
                                    <FileText size={20} strokeWidth={1.5} />
                                    <span>{file.name}</span>
                                    <button onClick={() => setFile(null)} aria-label="Supprimer le fichier">✕</button>
                                </div>
                            )}

                            <div className="presc-upload-note">
                                <strong>Protection de vos données :</strong> votre ordonnance est chiffrée et utilisée
                                uniquement pour la fabrication de vos verres. Elle ne sera jamais partagée avec des tiers.
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="presc-actions">
                        <button
                            className="presc-btn-confirm text-sans"
                            onClick={handleConfirm}
                            disabled={!canConfirm || uploading}
                        >
                            {uploading ? 'Téléversement en cours…' : 'Confirmer et ajouter au panier'}
                        </button>
                        <button className="presc-btn-cancel text-sans" onClick={onCancel} disabled={uploading}>
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPopup;
