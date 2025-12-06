import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessagesSquare, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import styles from './Landing.module.css';

const Landing = () => {
    return (
        <div className={styles.landing}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <div className={`container ${styles.navContainer}`}>
                    <div className={styles.logo}>
                        Jansamvaad<span className={styles.dot}>.</span>
                    </div>
                    <div className={styles.navLinks}>
                        <Link to="/login" className="btn btn-primary">
                            Get Started <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>
                            Bridging the Gap Between <br />
                            <span className={styles.gradientText}>Citizens & Governance</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Empower your voice. Report issues directly to your elected representatives
                            and track real-time progress with AI-driven insights.
                        </p>
                        <div className={styles.heroActions}>
                            <Link to="/login" className="btn btn-primary">
                                File a Grievance
                            </Link>
                            <a href="#features" className="btn btn-outline">
                                Learn More
                            </a>
                        </div>
                    </div>
                    <div className={styles.heroVisual}>
                        {/* Abstract visual representation */}
                        <div className={styles.blob1}></div>
                        <div className={styles.blob2}></div>
                        <div className={styles.glassCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatar}></div>
                                <div>
                                    <div className={styles.lineLg}></div>
                                    <div className={styles.lineSm}></div>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.lineFull}></div>
                                <div className={styles.lineFull}></div>
                            </div>
                            <div className={styles.statusBadge}>
                                <ShieldCheck size={14} /> Resolved
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2>Why Jansamvaad?</h2>
                        <p>A smart, transparent, and efficient way to participate in democracy.</p>
                    </div>

                    <div className={styles.featureGrid}>
                        <FeatureCard
                            icon={<MessagesSquare size={32} />}
                            title="Direct Communication"
                            description="Connect instantly with your local MLA/MP without intermediaries."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={32} />}
                            title="AI Validation"
                            description="Smart AI filters ensure legitimate grievances are prioritized."
                        />
                        <FeatureCard
                            icon={<BarChart3 size={32} />}
                            title="Transparency"
                            description="Track complaint status and view public statistics in real-time."
                        />
                        <FeatureCard
                            icon={<FileText size={32} />}
                            title="Smart Filing"
                            description="Auto-categorization and constituency matching for effortless submission."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className="container">
                    <p>&copy; 2025 Jansamvaad. Empowering Democracy.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className={styles.featureCard}>
        <div className={styles.iconWrapper}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

export default Landing;
