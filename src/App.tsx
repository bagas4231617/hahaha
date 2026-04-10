import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Server, 
  Shield, 
  Cpu, 
  Globe, 
  Terminal, 
  Award, 
  Briefcase, 
  Code2,
  ChevronRight,
  X,
  Mail,
  Linkedin,
  Github,
  Send,
  MessageSquare,
  Menu,
  Sun,
  Moon
} from 'lucide-react';

// Typing Animation Component
const TypingText = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className="typing-container">
      {currentText}
      {currentIndex < text.length && <span className="cursor"></span>}
    </span>
  );
};

export default function App() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-id-here"; // MASUKKAN_URL_FORMSPREE_DISINI

  // Toast Logic
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 5000);
  };

  // Theme Logic
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Scroll Reveal Logic
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const skills = [
    {
      category: "Networking",
      items: [
        { name: "Cisco Networking", level: 90 },
        { name: "Advanced MikroTik", level: 85 },
        { name: "Routing Protocols (OSPF, BGP)", level: 80 },
        { name: "VLAN & Trunking", level: 95 }
      ]
    },
    {
      category: "Server Administration",
      items: [
        { name: "Linux Server (Debian/Ubuntu)", level: 90 },
        { name: "Web & Database Server", level: 85 },
        { name: "Virtualization (VirtualBox/Proxmox)", level: 75 },
        { name: "Shell Scripting", level: 70 }
      ]
    },
    {
      category: "Tools & Security",
      items: [
        { name: "Wireshark", level: 80 },
        { name: "Nmap", level: 75 },
        { name: "PuTTY / SSH", level: 95 },
        { name: "Firewall Configuration", level: 85 }
      ]
    }
  ];

  const certificates = [
    {
      title: "Cisco Certified Network Associate (CCNA)",
      meta: "[Diperoleh saat kelas 11]",
      desc: "Sertifikasi profesional dari Cisco yang memvalidasi kemampuan dalam instalasi, konfigurasi, dan pengoperasian jaringan skala menengah."
    },
    {
      title: "MikroTik Certified Network Associate (MTCNA)",
      meta: "[Sedang dalam tahap persiapan ujian]",
      desc: "Fokus pada manajemen trafik, routing, dan troubleshooting menggunakan RouterOS MikroTik."
    },
    {
      title: "Praktik Kerja Lapangan - Sekolah Alam Depok",
      meta: "Pengalaman Kerja",
      desc: "Tugas meliputi:",
      tasks: [
        "Perawatan komputer dan infrastruktur jaringan.",
        "Bertugas sebagai Operator ANBK bersama rekan dan pembimbing.",
        "Administrasi ATK dan pengelolaan arsip kepegawaian/kesiswaan.",
        "Rekapitulasi keuangan sekolah."
      ]
    }
  ];

  const projects = [
    {
      title: "Desain & Implementasi Topologi Jaringan Skala Sekolah",
      desc: "Merancang dan melakukan konfigurasi jaringan kompleks tingkat lanjut dengan menerapkan routing protocol, VLAN, trunking, dan EtherChannel.",
      icon: <Network className="project-icon" size={32} />,
      image: "https://picsum.photos/seed/network-topology/1200/800",
      category: "Jaringan"
    },
    {
      title: "Konfigurasi & Manajemen Server Linux",
      desc: "Membangun infrastruktur server menggunakan sistem operasi Debian dan Ubuntu, mencakup instalasi Web Server, Database Server, serta WordPress Server.",
      icon: <Server className="project-icon" size={32} />,
      image: "https://picsum.photos/seed/linux-server/1200/800",
      category: "Server"
    },
    {
      title: "Perawatan Infrastruktur IT & Operator ANBK",
      desc: "Menjaga stabilitas infrastruktur jaringan dan hardware komputer, serta mengelola kelancaran teknis sebagai Operator pada pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK).",
      icon: <Shield className="project-icon" size={32} />,
      image: "https://picsum.photos/seed/it-maintenance/1200/800",
      category: "Keamanan"
    }
  ];

  const projectCategories = ['Semua', ...new Set(projects.map(p => p.category))];

  const filteredProjects = activeFilter === 'Semua' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    showToast("$ systemctl start sending_email...");

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus('success');
        showToast("$ status: 200 OK - Pesan Terkirim");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        showToast("$ status: 500 Error - Gagal Mengirim");
      }
    } catch (error) {
      setFormStatus('error');
      showToast("$ status: 500 Error - Koneksi Terputus");
    }
  };

  return (
    <div className="app-wrapper">
      <header>
        <div className="container">
          <nav>
            <div className="logo">MBMA_ROOT</div>
            <div className="nav-links">
              <a href="#profil">Profil</a>
              <a href="#sertifikat">Sertifikat</a>
              <a href="#proyek">Proyek</a>
              <a href="#kontak">Kontak</a>
              <button className="theme-toggle" onClick={toggleTheme} title="Ganti Tema">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </button>

            <div className="mobile-nav-links">
              <div className="mobile-terminal-header">root@mbma-mobile:~# ls -l ./navigasi</div>
              
              <a href="#profil" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="prompt-arrow">{">"}</span> ./profil.sh
              </a>
              <a href="#sertifikat" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="prompt-arrow">{">"}</span> ./sertifikat.sh
              </a>
              <a href="#proyek" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="prompt-arrow">{">"}</span> ./proyek.sh
              </a>
              <a href="#kontak" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="prompt-arrow">{">"}</span> ./kontak.sh
              </a>
              <button className="theme-toggle" onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }} style={{ marginTop: '1rem' }}>
                <span className="prompt-arrow">{">"}</span> ./switch_theme.sh --{theme}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.visible && (
          <motion.div 
            className="toast-container"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <div className="terminal-toast">
              <span className="toast-icon">_</span>
              <span className="toast-message">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="profil" className="hero">
          <div className="container">
            <p className="hero-greeting">Halo, saya</p>
            <h1 className="hero-name">Muhammad Bagas Malik Albani</h1>
            <p className="hero-tagline">
              <TypingText text="Network Engineer | Server Administrator | IT Infrastructure" delay={50} />
            </p>
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              Siswa kelas 12 jurusan Teknik Komputer dan Jaringan (TKJ) yang antusias dalam membangun topologi jaringan, mengonfigurasi perangkat, dan mengelola administrasi server.
            </motion.p>
            
            <motion.div 
              className="cta-group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <a href="#proyek" className="cta-button">[ ./lihat_proyek.sh ]</a>
              <a href="#kontak" className="cta-button">[ ./hubungi_saya.sh ]</a>
              <a href="/cv_bagas.pdf" download className="cta-button outline">[ ./download_cv.pdf ]</a>
            </motion.div>
            
            <motion.div 
              className="skills-container"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <h3 className="terminal-prompt">
                <span className="user-host">bagas@server:~$</span> cat ~/.skills<span className="blinking-cursor">_</span>
              </h3>
              
              {skills.map((category, catIndex) => (
                <div key={catIndex} className="skill-category">
                  <h4 className="skill-category-title">{category.category}</h4>
                  <div className="skills-grid-detailed">
                    {category.items.map((skill, index) => (
                      <motion.div 
                        key={index} 
                        className="skill-item"
                        variants={itemVariants}
                      >
                        <div className="skill-info">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="progress-bar-container">
                          <motion.div 
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Certificates Section */}
        <section id="sertifikat">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Award size={28} /> Sertifikat & Pelatihan
            </motion.h2>
            <motion.div 
              className="cert-list"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {certificates.map((cert, index) => (
                <motion.div 
                  key={index} 
                  className="cert-card"
                  variants={itemVariants}
                >
                  <div className="cert-title">{cert.title}</div>
                  <div className="cert-meta">{cert.meta}</div>
                  <div className="cert-desc">
                    {cert.desc}
                    {cert.tasks && (
                      <ul>
                        {cert.tasks.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="proyek">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Briefcase size={28} /> Proyek & Hasil Praktik
            </motion.h2>
            <div className="filter-group">
              {projectCategories.map(cat => (
                <button 
                  key={cat}
                  className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <motion.div 
              className="project-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project, index) => (
                  <motion.div 
                    key={project.title} 
                    layout
                    className="project-card" 
                    onClick={() => setSelectedProject(project)} 
                    style={{ cursor: 'pointer' }}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.icon}
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.desc}</p>
                    <div className="project-link">
                      Lihat detail <ChevronRight size={14} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="kontak">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <MessageSquare size={28} /> Kontak Saya
            </motion.h2>
            
            <div className="contact-grid">
              <motion.div 
                className="contact-info"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h3>Mari Terhubung</h3>
                <p>
                  Saya terbuka untuk peluang kerja, kolaborasi proyek, atau sekadar berdiskusi tentang teknologi jaringan dan server. Silakan hubungi saya melalui formulir atau media sosial.
                </p>
                
                <div className="social-links">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
                    <Github size={20} />
                  </a>
                  <a href="mailto:muhammadbagasmalikalbani@gmail.com" className="social-icon" title="Email">
                    <Mail size={20} />
                  </a>
                </div>
              </motion.div>

              <motion.form 
                className="contact-form" 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="form-group">
                  <label htmlFor="name">$ whoami --name</label>
                  <input type="text" id="name" name="name" placeholder="Nama Lengkap" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">$ mail --to</label>
                  <input type="email" id="email" name="email" placeholder="Alamat Email" required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">$ cat --message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Pesan Anda..." required></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={formStatus === 'submitting'}
                  style={formStatus === 'success' ? { background: '#0070f3', color: 'white' } : {}}
                >
                  <Send size={18} /> 
                  {formStatus === 'idle' && "Kirim Pesan"}
                  {formStatus === 'submitting' && "[ Mengirim data... ]"}
                  {formStatus === 'success' && "[ Pesan Terkirim! ]"}
                  {formStatus === 'error' && "[ Gagal Mengirim! ]"}
                </button>
              </motion.form>
            </div>
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="modal-overlay" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="modal-content" 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedProject(null)}>
                <X size={20} />
              </button>
              
              <div className="modal-body">
                <div className="modal-image-container">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    referrerPolicy="no-referrer"
                    onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                    style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
                  />
                </div>
                <div className="modal-info">
                  <h3 className="modal-title">{selectedProject.title}</h3>
                  <p className="modal-desc">{selectedProject.desc}</p>
                  
                  <div className="mini-terminal">
                    <div className="mini-terminal-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <div className="mini-terminal-body">
                      <p>$ fetching project_data...</p>
                      <p className="success">{">"} status: 200 OK</p>
                      <p>{">"} connection: secured</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Muhammad Bagas Malik Albani. Built with React & Terminal Aesthetics.</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <Terminal size={18} />
            <Globe size={18} />
            <Code2 size={18} />
            <Cpu size={18} />
          </div>
        </div>
      </footer>
    </div>
  );
}
