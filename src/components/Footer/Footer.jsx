import './Footer.scss';
export default function Footer({isLoaded}) {
  return (
    isLoaded &&
    <footer className="footer">
      <p>Made of Stardust by <a href="https://isadoradigitalagency.com" target="_blank"><strong>Isadora Agency.</strong></a></p>
    </footer>
  );
}
