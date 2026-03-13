import Link from 'next/link';
import { getAllTabs } from '@/lib/tabs';

export default async function Home() {
  const tabs = await getAllTabs();

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Your Tabs</h2>
      
      {tabs.length === 0 ? (
        <p>No tabs found in <code>data/tabs</code>. Run the converter first!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tabs.map((tab) => (
            <li key={tab.slug} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <Link href={`/tabs/${encodeURIComponent(tab.slug)}`}>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{tab.title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{tab.artist} • {tab.difficulty}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
