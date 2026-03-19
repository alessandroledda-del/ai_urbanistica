import React from 'react';
import { ChatInterface } from './components/ChatInterface';
import { DocumentUpload } from './components/DocumentUpload';
import { Map } from 'lucide-react';

function App() {
  return (
    <div className="app-container">
      {/* Sidebar - Admin & Context */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ padding: '8px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)', color: '#fff' }}>
            <Map size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', margin: 0 }}>AI Urbanistica</h1>
            <span className="text-muted" style={{ fontSize: '12px' }}>Assistente Normativo RAG</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
           <DocumentUpload />
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <p className="text-muted" style={{ fontSize: '12px', textAlign: 'center' }}>
            Il database normativo è aggiornato dagli utenti.
          </p>
        </div>
      </aside>

      {/* Main Chat Content */}
      <main className="main-content">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
