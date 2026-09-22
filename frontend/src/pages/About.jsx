import {
  MessageCircle,
  Globe,
  Mic,
  Volume2,
  Users,
  Clock,
  Shield,
  Zap,
  Code,
  Database,
  Server,
  Smartphone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const features = [
    { icon: <Globe size={22} />, title: 'Multi-Language Support', description: '16+ languages including Indian, European, and Asian languages.' },
    { icon: <Mic size={22} />, title: 'Voice Input', description: 'Speak naturally and let VOXA convert your speech to text.' },
    { icon: <Volume2 size={22} />, title: 'Text-to-Speech', description: 'Listen to translations spoken in the target language.' },
    { icon: <Users size={22} />, title: 'Conversation Mode', description: 'Two people can chat in different languages seamlessly.' },
    { icon: <Clock size={22} />, title: 'Translation History', description: 'Review and search your past translations.' },
    { icon: <Shield size={22} />, title: 'Privacy First', description: 'API keys are never exposed. All translation happens through secure servers.' },
  ];

  const techStack = [
    { icon: <Code size={22} />, name: 'React.js', role: 'Frontend UI' },
    { icon: <Server size={22} />, name: 'Spring Boot', role: 'Backend API' },
    { icon: <Database size={22} />, name: 'MySQL', role: 'Database' },
    { icon: <Globe size={22} />, name: 'Translation API', role: 'Language Translation' },
    { icon: <Mic size={22} />, name: 'Web Speech API', role: 'Voice Features' },
    { icon: <Smartphone size={22} />, name: 'Responsive Design', role: 'All Devices' },
  ];

  return (
    <div className="about">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-container">
          <div className="about-hero-icon">
            <MessageCircle size={32} />
          </div>
          <h1 className="about-hero-title">Why VOXA?</h1>
          <p className="about-hero-quote">
            "Language should never be a barrier to communication."
          </p>
          <p className="about-hero-description">
            In a world with over 7,000 languages, millions of people face daily challenges
            communicating with those around them. Whether you're a traveler in a foreign country,
            a patient in a hospital, or a student in a new city — the inability to communicate
            can be isolating and even dangerous.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="about-section-title">Our Mission</h2>
          <div className="about-mission-card">
            <p>
              VOXA is built to bridge the gap between languages. Unlike basic translation tools,
              VOXA is designed as a <strong>communication platform</strong> — enabling two people
              who speak different languages to have natural, real-time conversations.
            </p>
            <p>
              We believe that technology should bring people together, not create more barriers.
              VOXA combines text translation, voice input, and conversational interfaces to create
              an experience that feels like talking to someone who speaks your language.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <h2 className="about-section-title">Features</h2>
          <div className="about-features-grid">
            {features.map((feature, index) => (
              <div className="about-feature-card" key={index}>
                <div className="about-feature-icon">{feature.icon}</div>
                <div>
                  <h3 className="about-feature-title">{feature.title}</h3>
                  <p className="about-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="about-section-title">How It Works</h2>
          <div className="about-architecture">
            <div className="about-arch-step">
              <Zap size={20} />
              <span>React Frontend</span>
            </div>
            <div className="about-arch-arrow">→</div>
            <div className="about-arch-step">
              <Server size={20} />
              <span>Spring Boot API</span>
            </div>
            <div className="about-arch-arrow">→</div>
            <div className="about-arch-step">
              <Globe size={20} />
              <span>Translation API</span>
            </div>
            <div className="about-arch-arrow">→</div>
            <div className="about-arch-step">
              <Database size={20} />
              <span>MySQL Database</span>
            </div>
          </div>
          <p className="about-arch-description">
            Your input goes from the React frontend to the Spring Boot backend, which securely
            communicates with the translation API. Translations are stored in MySQL for history.
            API keys are never exposed to the client.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="about-section about-section-alt">
        <div className="about-container">
          <h2 className="about-section-title">Technologies</h2>
          <div className="about-tech-grid">
            {techStack.map((tech, index) => (
              <div className="about-tech-card" key={index}>
                <div className="about-tech-icon">{tech.icon}</div>
                <h3 className="about-tech-name">{tech.name}</h3>
                <p className="about-tech-role">{tech.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section about-cta">
        <div className="about-container about-cta-content">
          <h2 className="about-cta-title">Try VOXA Today</h2>
          <p className="about-cta-description">
            Experience seamless multilingual communication.
          </p>
          <div className="about-cta-buttons">
            <Link to="/translator" className="btn btn-primary btn-lg">Open Translator</Link>
            <Link to="/conversation" className="btn btn-outline btn-lg">Start Conversation</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
