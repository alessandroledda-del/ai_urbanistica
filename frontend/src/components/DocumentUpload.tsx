import React, { useState } from 'react';
import { uploadDocument } from '../api';
import { UploadCloud, CheckCircle } from 'lucide-react';

export const DocumentUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<string>('nazionale');
  const [region, setRegion] = useState('');
  const [province, setProvince] = useState('');
  const [commune, setCommune] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    try {
      await uploadDocument(file, level, region, province, commune);
      setStatus('success');
      setMessage('Documento analizzato e caricato con successo!');
      setFile(null); // reset file
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage('Errore durante il caricamento del documento.');
    }
  };

  return (
    <div className="upload-card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <UploadCloud size={20} className="text-muted" /> Aggiungi Normativa
      </h2>
      <p className="text-muted" style={{ marginBottom: '8px' }}>
        Carica un nuovo documento di piano o normativa per aggiungerlo alla base di conoscenza AI.
      </p>

      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Livello Normativo</label>
          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option value="nazionale">Nazionale (es. Testo Unico Edilizia)</option>
            <option value="regionale">Regionale (es. Legge Regionale Urbanistica)</option>
            <option value="provinciale">Provinciale (es. PTCP)</option>
            <option value="comunale">Comunale (es. PGT, PRG)</option>
          </select>
        </div>

        {level === 'regionale' || level === 'provinciale' || level === 'comunale' ? (
          <div>
             <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Regione</label>
             <input type="text" placeholder="Es. Lombardia" value={region} onChange={e => setRegion(e.target.value)} required />
          </div>
        ) : null}

        {level === 'provinciale' || level === 'comunale' ? (
          <div>
             <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Provincia</label>
             <input type="text" placeholder="Es. Milano" value={province} onChange={e => setProvince(e.target.value)} required />
          </div>
        ) : null}

        {level === 'comunale' && (
          <div>
             <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>Comune</label>
             <input type="text" placeholder="Es. Corsico" value={commune} onChange={e => setCommune(e.target.value)} required />
          </div>
        )}

        <div>
          <label className="text-muted" style={{ display: 'block', marginBottom: '8px' }}>File Documento (.pdf, .txt)</label>
          <input 
            type="file" 
            accept=".pdf,.txt" 
            onChange={e => setFile(e.target.files?.[0] || null)} 
            style={{ padding: '8px', cursor: 'pointer' }}
          />
        </div>

        <button type="submit" className="btn" disabled={!file || status === 'uploading'}>
          {status === 'uploading' ? 'Caricamento in corso...' : 'Analizza e Carica'}
        </button>

        {status === 'success' && (
          <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <CheckCircle size={16} /> {message}
          </div>
        )}
      </form>
    </div>
  );
};
