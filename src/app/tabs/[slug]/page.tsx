import { getTabBySlug, getAllTabs } from '@/lib/tabs';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const tabs = await getAllTabs();
  return tabs.map((tab) => ({
    slug: tab.slug,
  }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TabPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const tab = await getTabBySlug(decodedSlug);

  if (!tab) {
    notFound();
  }

  return (
    <div className="mono">
      <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)', textDecoration: 'none' }}>
        ← Back to list
      </Link>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{tab.title}</h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--muted)', marginTop: 0 }}>{tab.artist}</p>
        
        <div className="metadata">
          <div className="metadata-item"><b>Difficulty:</b> {tab.difficulty}</div>
          <div className="metadata-item"><b>Key:</b> {tab.key}</div>
          <div className="metadata-item"><b>Capo:</b> {tab.capo || 'None'}</div>
          <div className="metadata-item"><b>Tuning:</b> {tab.tuning}</div>
        </div>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          Chords used:
        </div>
        <div className="chords-required">
          {tab.chords_required.map((chord) => (
            <span key={chord} className="chord-badge">{chord}</span>
          ))}
        </div>
      </div>

      <div className="tab-content">
        {tab.content.map((section, sIdx) => (
          <div key={sIdx} className="section">
            <div className="section-title">{section.section}</div>
            {section.lines.map((line, lIdx) => (
              <div key={lIdx} className="line">
                <div className="chord-row">
                  {line.chords.map((chord, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="chord"
                      style={{ 
                        left: `${chord.position}ch`,
                      }}
                    >
                      {chord.chord}
                    </span>
                  ))}
                </div>
                <div className="lyrics">{line.lyrics || ' '}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem' }}>
        Play on!
      </div>
    </div>
  );
}
