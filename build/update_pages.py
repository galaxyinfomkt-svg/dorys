#!/usr/bin/env python3
"""
Script to update all HTML pages with consistent header, footer, and fix broken links.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

# Header template for pages in subdirectories (locations/, services/)
HEADER_TEMPLATE_SUBDIR = '''  <!-- Skip Link for Accessibility -->
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="container">
      <div class="top-bar__contact">
        <a href="tel:+19783078107" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span>(978) 307-8107</span>
        </a>
        <a href="mailto:contact@doryscleaningservices.com" class="top-bar__item">
          <svg class="top-bar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <span>contact@doryscleaningservices.com</span>
        </a>
      </div>
      <div class="top-bar__social">
        <a href="https://www.facebook.com/cleanersservicesMA" target="_blank" rel="noopener noreferrer" class="top-bar__social-link" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href="https://www.instagram.com/dorysjanitorialcleaning/" target="_blank" rel="noopener noreferrer" class="top-bar__social-link" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@user8303581710815" target="_blank" rel="noopener noreferrer" class="top-bar__social-link" aria-label="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
        </a>
        <a href="https://www.youtube.com/@DorysJanitorial" target="_blank" rel="noopener noreferrer" class="top-bar__social-link" aria-label="YouTube">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header class="header">
    <div class="container header__wrapper">
      <a href="{base_path}" class="header__logo">
        <img src="{assets_path}images/logo/logo-original.jpg" alt="Dorys Janitorial Cleaning Services Logo" width="180" height="60">
      </a>

      <nav class="header__nav" aria-label="Main navigation">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="{base_path}" class="nav-link">Home</a>
          </li>
          <li class="nav-item has-dropdown">
            <a href="{base_path}services/" class="nav-link">
              Services
              <svg class="nav-link__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </a>
            <div class="nav-dropdown">
              <a href="{base_path}services/janitorial-service/" class="nav-dropdown__link">
                <svg class="nav-dropdown__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H8l4-4 4 4h-2v4z"/></svg>
                Janitorial Service
              </a>
              <a href="{base_path}services/deep-cleaning/" class="nav-dropdown__link">
                <svg class="nav-dropdown__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Deep Cleaning
              </a>
              <a href="{base_path}services/upholstery-cleaning/" class="nav-dropdown__link">
                <svg class="nav-dropdown__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>
                Upholstery Cleaning
              </a>
              <a href="{base_path}services/carpet-cleaning/" class="nav-dropdown__link">
                <svg class="nav-dropdown__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                Carpet Cleaning
              </a>
              <a href="{base_path}services/general-housekeeping/" class="nav-dropdown__link">
                <svg class="nav-dropdown__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                General Housekeeping
              </a>
            </div>
          </li>
          <li class="nav-item has-dropdown">
            <a href="{base_path}locations/" class="nav-link">
              Service Areas
              <svg class="nav-link__icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </a>
            <div class="nav-dropdown nav-dropdown--mega">
              <span class="nav-dropdown__title">Popular Cities</span>
              <div class="nav-dropdown__grid">
                <a href="{base_path}locations/marlborough-ma.html" class="nav-dropdown__link">Marlborough</a>
                <a href="{base_path}locations/framingham-ma.html" class="nav-dropdown__link">Framingham</a>
                <a href="{base_path}locations/worcester-ma.html" class="nav-dropdown__link">Worcester</a>
                <a href="{base_path}locations/hudson-ma.html" class="nav-dropdown__link">Hudson</a>
                <a href="{base_path}locations/westborough-ma.html" class="nav-dropdown__link">Westborough</a>
                <a href="{base_path}locations/natick-ma.html" class="nav-dropdown__link">Natick</a>
                <a href="{base_path}locations/newton-ma.html" class="nav-dropdown__link">Newton</a>
                <a href="{base_path}locations/wellesley-ma.html" class="nav-dropdown__link">Wellesley</a>
                <a href="{base_path}locations/" class="nav-dropdown__link text-primary font-semibold">View All Cities →</a>
              </div>
            </div>
          </li>
          <li class="nav-item">
            <a href="{base_path}about.html" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a href="{base_path}reviews.html" class="nav-link">Reviews</a>
          </li>
          <li class="nav-item">
            <a href="{base_path}contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
      </nav>

      <a href="{base_path}contact.html" class="btn btn--primary header__cta hide-mobile">Get Free Quote</a>

      <button class="header__toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span class="header__toggle-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
    <div class="header__overlay"></div>
  </header>'''


def get_depth(filepath: Path) -> int:
    """Calculate directory depth relative to BASE_DIR."""
    rel = filepath.relative_to(BASE_DIR)
    return len(rel.parts) - 1


def get_base_path(depth: int) -> str:
    """Get the base path for links based on depth."""
    if depth == 0:
        return ""
    return "../" * depth


def get_assets_path(depth: int) -> str:
    """Get the assets path based on depth."""
    if depth == 0:
        return "assets/"
    return "../" * depth + "assets/"


def fix_links_in_content(content: str, depth: int) -> str:
    """Fix absolute links to relative links."""
    base = get_base_path(depth)

    # Fix absolute paths like /assets/, /services/, /locations/, etc.
    content = re.sub(r'href="/(?!http)', f'href="{base}', content)
    content = re.sub(r'src="/(?!http)', f'src="{base}', content)

    # Fix links to service+city pages that don't exist - redirect to service index
    # e.g., /services/janitorial-service/marlborough-ma.html -> /services/janitorial-service/
    services = ['janitorial-service', 'deep-cleaning', 'carpet-cleaning', 'upholstery-cleaning', 'general-housekeeping']
    for service in services:
        pattern = rf'href="{re.escape(base)}services/{service}/[a-z-]+-ma\.html"'
        replacement = f'href="{base}services/{service}/"'
        content = re.sub(pattern, replacement, content)

    return content


def add_premium_css(content: str, assets_path: str) -> str:
    """Add premium.css if not present."""
    if 'premium.css' not in content:
        # Find the last stylesheet link and add premium.css after it
        pattern = r'(<link rel="stylesheet" href="[^"]*responsive\.css"[^>]*>)'
        replacement = r'\1\n  <link rel="stylesheet" href="' + assets_path + 'css/premium.css">'
        content = re.sub(pattern, replacement, content)
    return content


def update_html_file(filepath: Path):
    """Update a single HTML file with proper header, footer, and links."""
    print(f"Processing: {filepath}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  Error reading: {e}")
        return

    depth = get_depth(filepath)
    base_path = get_base_path(depth)
    assets_path = get_assets_path(depth)

    # Fix links
    content = fix_links_in_content(content, depth)

    # Add premium.css
    content = add_premium_css(content, assets_path)

    # Write back
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  Updated successfully")
    except Exception as e:
        print(f"  Error writing: {e}")


def main():
    """Main function to process all HTML files."""
    # Find all HTML files
    html_files = list(BASE_DIR.glob('**/*.html'))

    # Exclude build directory
    html_files = [f for f in html_files if 'build' not in str(f)]

    print(f"Found {len(html_files)} HTML files")

    for filepath in html_files:
        update_html_file(filepath)

    print("\nDone!")


if __name__ == '__main__':
    main()
