import fs from 'fs';
import path from 'path';

export interface ChordPosition {
  chord: string;
  position: number;
}

export interface TabLine {
  chords: ChordPosition[];
  lyrics: string;
}

export interface TabSection {
  section: string;
  lines: TabLine[];
}

export interface TabData {
  title: string;
  artist: string;
  difficulty: string;
  tuning: string;
  capo: string;
  key: string;
  chords_required: string[];
  content: TabSection[];
  slug: string;
}

const TABS_DIRECTORY = path.join(process.cwd(), 'data/tabs');

export async function getAllTabs(): Promise<TabData[]> {
  const filenames = fs.readdirSync(TABS_DIRECTORY);
  
  return filenames
    .filter((filename) => filename.endsWith('.json'))
    .map((filename) => {
      const filePath = path.join(TABS_DIRECTORY, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      return {
        ...data,
        slug: filename.replace('.json', ''),
      };
    });
}

export async function getTabBySlug(slug: string): Promise<TabData | null> {
  const filePath = path.join(TABS_DIRECTORY, `${slug}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  return {
    ...data,
    slug: slug,
  };
}
