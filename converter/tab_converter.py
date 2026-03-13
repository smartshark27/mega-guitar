import pdfplumber
import json
import re
import os
import sys

def is_chord(text):
    # Basic chord regex - allows chords like G/F#, Cmaj7, Am7, etc.
    # Also handles chords in parentheses (G) and common suffixes
    clean_text = text.strip("()[]").replace("(","").replace(")","")
    if not clean_text:
        return False
    # Standard chord root
    root = r'[A-G][b#]?'
    # Common suffixes
    suffix = r'(m|maj|min|dim|aug|sus|add|2|4|5|6|7|8|9|11|13)*'
    # Optional bass note
    bass = r'(/[A-G][b#]?)?'
    chord_pattern = f'^{root}{suffix}{bass}$'
    return re.match(chord_pattern, clean_text) is not None

def parse_tab_pdf(pdf_path):
    data = {
        "title": "",
        "artist": "",
        "difficulty": "",
        "tuning": "",
        "capo": "",
        "key": "",
        "chords_required": set(),
        "content": []
    }

    with pdfplumber.open(pdf_path) as pdf:
        all_lines = []
        
        # Pre-process for metadata from Page 1 (before filtering)
        if len(pdf.pages) > 0:
            # Let's just use the first few lines of text
            p1_text = pdf.pages[0].extract_text()
            if p1_text:
                first_lines = p1_text.split("\n")
                for line in first_lines[:5]:
                    if " Chords by " in line:
                        parts = line.split(" Chords by ")
                        data["title"] = parts[0].strip()
                        artist_part = parts[1].split(" @")[0].strip()
                        if artist_part.lower().endswith("tabs"):
                            artist_part = artist_part[:-4].strip()
                        data["artist"] = artist_part
                        break
                    elif " by " in line and not data["title"]:
                        parts = line.split(" by ")
                        data["title"] = parts[0].strip()
                        artist_part = parts[1].strip()
                        if artist_part.lower().endswith("tabs"):
                            artist_part = artist_part[:-4].strip()
                        data["artist"] = artist_part
                        break

        for page_idx, page in enumerate(pdf.pages):
            words = page.extract_words()
            if not words: continue

            # Filter out header/footer
            height = float(page.height)
            words = [w for w in words if w['top'] > 30 and w['bottom'] < height - 35]
            if not words: continue

            # Group into lines
            words.sort(key=lambda w: (w['top'], w['x0']))
            page_lines = []
            current_line = [words[0]]
            for i in range(1, len(words)):
                if abs(words[i]['top'] - current_line[0]['top']) < 3:
                    current_line.append(words[i])
                else:
                    page_lines.append(current_line)
                    current_line = [words[i]]
            page_lines.append(current_line)

            # Column detection
            mid_gap_found = False
            mid_x = page.width / 2
            for line in page_lines:
                line.sort(key=lambda w: w['x0'])
                for j in range(len(line) - 1):
                    if line[j+1]['x0'] - line[j]['x1'] > 60:
                        mid_gap_found = True
                        break
                if mid_gap_found: break
            
            if mid_gap_found:
                left_words = [w for w in words if w['x0'] < mid_x - 10]
                right_words = [w for w in words if w['x0'] > mid_x - 10]
                for col_words in [left_words, right_words]:
                    if not col_words: continue
                    col_words.sort(key=lambda w: (w['top'], w['x0']))
                    col_lines = []
                    curr = [col_words[0]]
                    for i in range(1, len(col_words)):
                        if abs(col_words[i]['top'] - curr[0]['top']) < 3:
                            curr.append(col_words[i])
                        else:
                            col_lines.append(curr)
                            curr = [col_words[i]]
                    col_lines.append(curr)
                    all_lines.extend(col_lines)
            else:
                all_lines.extend(page_lines)

        # Process all lines
        current_section = None
        i = 0
        while i < len(all_lines):
            line_words = all_lines[i]
            line_text = " ".join([w['text'] for w in line_words])

            # Cleanup weird chars
            line_text = line_text.replace("Di!culty:", "Difficulty:")
            
            if line_text.startswith("Difficulty:"):
                data["difficulty"] = line_text.replace("Difficulty:", "").strip()
            elif line_text.startswith("Tuning:"):
                data["tuning"] = line_text.replace("Tuning:", "").strip()
            elif line_text.startswith("Capo:"):
                data["capo"] = line_text.replace("Capo:", "").strip()
            elif line_text.startswith("Key:"):
                data["key"] = line_text.replace("Key:", "").strip()
            elif line_text == "CHORDS":
                i += 1
                if i < len(all_lines):
                    for w in all_lines[i]:
                        if is_chord(w['text']):
                            data["chords_required"].add(w['text'])
            
            elif line_text.startswith("[") and line_text.endswith("]"):
                current_section = {"section": line_text[1:-1], "lines": []}
                data["content"].append(current_section)
            
            elif current_section is not None:
                chords_in_line = [w for w in line_words if is_chord(w['text'])]
                is_chord_line = len(chords_in_line) > 0 and (len(chords_in_line) >= len(line_words) * 0.7 or len(line_text.strip()) < 15)
                
                if any(x in line_text for x in ["STRUMMING", "bpm", "Difficulty", "Tuning", "Capo", "Key"]):
                    is_chord_line = False

                if is_chord_line:
                    chords_data = []
                    for w in chords_in_line:
                        chords_data.append({"chord": w['text'], "x0": w['x0']})
                        data["chords_required"].add(w['text'])
                    
                    next_i = i + 1
                    lyrics = ""
                    lyric_line_words = []
                    if next_i < len(all_lines):
                        test_next_words = all_lines[next_i]
                        test_next_text = " ".join([w['text'] for w in test_next_words])
                        next_chords = [w for w in test_next_words if is_chord(w['text'])]
                        next_is_chord_line = len(next_chords) > 0 and len(next_chords) >= len(test_next_words) * 0.7
                        
                        if not next_is_chord_line and not test_next_text.startswith("[") and not test_next_text == "CHORDS":
                            lyrics = test_next_text
                            lyric_line_words = test_next_words
                            i = next_i
                    
                    line_entry = {"chords": [], "lyrics": lyrics}
                    if lyrics and lyric_line_words:
                        for cd in chords_data:
                            char_pos = 0
                            found = False
                            curr_off = 0
                            for lw in lyric_line_words:
                                if cd['x0'] <= lw['x1']:
                                    rel = (cd['x0'] - lw['x0']) / (lw['x1'] - lw['x0']) if lw['x1'] != lw['x0'] else 0
                                    char_pos = max(0, curr_off + int(rel * len(lw['text'])))
                                    found = True
                                    break
                                curr_off += len(lw['text']) + 1
                            if not found: char_pos = len(lyrics)
                            line_entry["chords"].append({"chord": cd["chord"], "position": char_pos})
                    else:
                        for cd in chords_data:
                            line_entry["chords"].append({"chord": cd["chord"], "position": 0})
                    current_section["lines"].append(line_entry)
                elif line_text and not any(skip in line_text for skip in ["Page", "STRUMMING", "bpm", "1 & 2 &"]):
                    current_section["lines"].append({"chords": [], "lyrics": line_text})
            i += 1

    data["chords_required"] = sorted(list(data["chords_required"]))
    return data

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 tab_converter.py <pdf_path> [output_json]")
        return

    pdf_path = sys.argv[1]
    if len(sys.argv) > 2:
        output_path = sys.argv[2]
    else:
        # Default to data/tabs/ directory
        base_name = os.path.splitext(os.path.basename(pdf_path))[0]
        output_dir = "data/tabs"
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, base_name + ".json")

    print(f"Converting {pdf_path}...")
    result = parse_tab_pdf(pdf_path)
    
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    main()
