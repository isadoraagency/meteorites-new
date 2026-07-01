"use client";

import "./Footer.scss";

interface FooterProps {
  isLoaded: boolean;
}

export default function Footer({ isLoaded }: FooterProps) {
  return (
    isLoaded && (
      <footer className="footer">
        <p className="mb-0">
          Made of Stardust by{" "}
          <a href="https://isadoradigitalagency.com" target="_blank" rel="noreferrer">
            <strong>Isadora Agency.</strong>
          </a>
        </p>
      </footer>
    )
  );
}
