import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Mic,
  Users,
  Clock,
  Globe,
  Heart,
  GraduationCap,
  Car,
  Briefcase,
  Handshake,
  ArrowRight,
  Type,
  Volume2,
  Languages,
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <Type size={28} />,
      title: 'Text Translation',
      description: 'Translate messages instantly between multiple languages.',
    },
    {
      icon: <Mic size={28} />,
      title: 'Voice Translation',
      description: 'Speak naturally and convert your speech into another language.',
    },
    {
      icon: <Users size={28} />,
      title: 'Conversation Mode',
      description: 'Two people can communicate using different languages in the same conversation.',
    },
    {
      icon: <Clock size={28} />,
      title: 'Translation History',
      description: 'Review and revisit your previous translations anytime.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Speak or Type',
      description: 'Enter a message using your keyboard or tap the microphone to use your voice.',
    },
    {
      number: '02',
      title: 'VOXA Translates',
      description: 'VOXA instantly converts your message into the selected language.',
    },
    {
      number: '03',
      title: 'Communicate',
      description: 'The other person receives your translated message and can respond in their language.',
    },
  ];

  const useCases = [
    { icon: <Globe size={24} />, title: 'Travel', description: 'Navigate foreign countries with confidence.' },
    { icon: <Heart size={24} />, title: 'Healthcare', description: 'Communicate with patients and doctors across languages.' },
    { icon: <GraduationCap size={24} />, title: 'Students', description: 'Connect with international classmates and faculty.' },
    { icon: <Car size={24} />, title: 'Transportation', description: 'Communicate with drivers and passengers easily.' },
    { icon: <Briefcase size={24} />, title: 'Business', description: 'Break barriers in international business communication.' },
    { icon: <Handshake size={24} />, title: 'Everyday', description: 'Have natural conversations with anyone, anywhere.' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Languages size={16} />
            <span>Multilingual Communication Platform</span>
          </div>
          <h1 className="hero-title">VOXA</h1>
          <p className="hero-tagline">Speak freely. Understand everyone.</p>
          <p className="hero-description">
            Break language barriers with instant text and voice translation
            designed for real conversations.
          </p>
          <div className="hero-buttons">
            <Link to="/translator" className="btn btn-primary btn-lg">
              Start Translating
              <ArrowRight size={18} />
            </Link>
            <Link to="/conversation" className="btn btn-outline btn-lg">
              Try Conversation Mode
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card hero-visual-card-left">
            <div className="hero-visual-card-header">
              <span className="hero-visual-flag">🇬🇧</span>
              <span>English</span>
            </div>
            <p className="hero-visual-text">Where is the nearest hospital?</p>
          </div>
          <div className="hero-visual-connector">
            <MessageCircle size={24} className="hero-visual-icon" />
          </div>
          <div className="hero-visual-card hero-visual-card-right">
            <div className="hero-visual-card-header">
              <span className="hero-visual-flag">🇮🇳</span>
              <span>Telugu</span>
            </div>
            <p className="hero-visual-text">సమీపంలోని ఆసుపత్రి ఎక్కడ ఉంది?</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">
            Everything you need to communicate across languages.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-section">
        <div className="section-container">
          <h2 className="section-title">How VOXA Works</h2>
          <p className="section-subtitle">
            Three simple steps to break any language barrier.
          </p>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={index}>
                <span className="step-number">{step.number}</span>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section usecases-section">
        <div className="section-container">
          <h2 className="section-title">Real-World Use Cases</h2>
          <p className="section-subtitle">
            VOXA is designed for real situations where language barriers exist.
          </p>
          <div className="usecases-grid">
            {useCases.map((useCase, index) => (
              <div className="usecase-card" key={index}>
                <div className="usecase-icon">{useCase.icon}</div>
                <h3 className="usecase-title">{useCase.title}</h3>
                <p className="usecase-description">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="section-container cta-container">
          <h2 className="cta-title">Ready to break language barriers?</h2>
          <p className="cta-description">
            Start communicating across languages in seconds.
          </p>
          <div className="hero-buttons">
            <Link to="/conversation" className="btn btn-primary btn-lg">
              Start a Conversation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
