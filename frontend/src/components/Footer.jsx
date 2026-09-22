import { MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <MessageCircle size={20} />
            <span>VOXA</span>
          </Link>
          <p className="footer-tagline">Speak freely. Understand everyone.</p>
        </div>

        <div className="footer-links">
          <Link to="/translator" className="footer-link">Translator</Link>
          <Link to="/conversation" className="footer-link">Conversation</Link>
          <Link to="/history" className="footer-link">History</Link>
          <Link to="/about" className="footer-link">About</Link>
        </div>

        <div className="footer-bottom">
          <p>
            Built with <Heart size={14} className="footer-heart" /> for breaking language barriers
          </p>
          <p className="footer-copyright">© {new Date().getFullYear()} VOXA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
