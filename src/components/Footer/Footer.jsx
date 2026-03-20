import './Footer.scss';
export default function Footer({isLoaded}) {
  return (
    isLoaded &&
    <footer className="footer">
      <p className="mb-0">Made of Stardust by <a href="https://isadoradigitalagency.com" target="_blank"><strong>Isadora Agency.</strong></a></p>
    </footer>
  );
}
