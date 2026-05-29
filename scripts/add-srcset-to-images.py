"""
Add srcset to images that have multi-size WebP variants on disk.
Currently medical-office-new is the most common card image across 297
location pages, and it has 400w/600w/800w variants — perfect target.

This saves significant bytes on mobile (400w ≈ 12KB vs 800w ≈ 35KB).
"""

from pathlib import Path
import re

SITE = Path(r"c:/Users/Admin/Downloads/dorys")

# Mapping of base image → list of available widths
IMG_VARIANTS = {
    "medical-office-new": [
        ("/assets/images/services/medical-office-new-400w.webp", "400w"),
        ("/assets/images/services/medical-office-new-600w.webp", "600w"),
        ("/assets/images/services/medical-office-new.webp", "800w"),
    ],
}

# Build patterns: find <img src="/assets/images/services/{base}.webp" ...>
def make_pattern(base: str) -> re.Pattern:
    return re.compile(
        rf'(<img\s+src="/assets/images/services/{re.escape(base)}\.webp")'
        r"(?![^>]*\bsrcset=)"
        r'([^>]*?)(>)',
        re.IGNORECASE,
    )


PATTERNS = {base: make_pattern(base) for base in IMG_VARIANTS}


def make_replacement(base: str) -> str:
    variants = IMG_VARIANTS[base]
    srcset = ", ".join(f"{url} {w}" for url, w in variants)
    sizes = (
        '(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 30vw'
    )
    return rf'\1 srcset="{srcset}" sizes="{sizes}"\2\3'


EXCLUDE = {"build", "node_modules", "tmp", "workspace"}
files: list[Path] = []
for f in SITE.rglob("*.html"):
    if any(p in EXCLUDE for p in f.parts):
        continue
    files.append(f)

touched = 0
for f in files:
    try:
        text = f.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    new_text = text
    changed = False
    for base, pat in PATTERNS.items():
        repl = make_replacement(base)
        new_text2, n = pat.subn(repl, new_text)
        if n > 0:
            new_text = new_text2
            changed = True
    if changed:
        f.write_text(new_text, encoding="utf-8")
        touched += 1

print(f"Files modified: {touched}")
