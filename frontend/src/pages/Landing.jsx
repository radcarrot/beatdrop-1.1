import { useState } from 'react';
import { Link } from 'react-router-dom';
import Atmosphere from '../components/Atmosphere';

const Logo = ({ size = 24 }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 4c2.5 0 4.5-1.5 5.5-3.5h-11c1 2 3 3.5 5.5 3.5z" />
    </svg>
);

const Landing = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="ld">
            <style>{`
                .ld{background:var(--bd-bg);color:var(--bd-text);font-family:var(--font-display);min-height:100vh;position:relative;overflow-x:hidden}
                .ld a{color:inherit}
                .ld .wrap{max-width:1180px;margin:0 auto;padding:0 32px}
                .ld .nav{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;padding:18px 32px;border-bottom:1px solid var(--bd-line);background:rgba(7,11,8,.7);backdrop-filter:blur(12px)}
                .ld .nav .brand{display:flex;align-items:center;gap:11px}
                .ld .nav .brand svg{color:var(--bd-signal);filter:drop-shadow(0 0 7px var(--bd-glow))}
                .ld .nav .brand b{letter-spacing:.28em;font-size:16px}
                .ld .nav-links{display:flex;gap:28px;align-items:center}
                .ld .nav-links a{font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--bd-muted)}
                .ld .nav-links a:hover{color:var(--bd-text)}
                .ld .burger{display:none;background:none;border:0;color:var(--bd-signal);cursor:pointer;padding:4px}
                .ld .mobile-menu{display:none;flex-direction:column;gap:12px;padding:18px 32px;border-bottom:1px solid var(--bd-line);background:rgba(7,11,8,.96)}
                .ld .mobile-menu a{font-family:var(--font-mono);font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--bd-muted)}

                .ld .hero{position:relative;overflow:hidden;border-bottom:1px solid var(--bd-line)}
                .ld .hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center;padding:96px 0 104px}
                .ld .hero h1{font-size:clamp(48px,8vw,92px);font-weight:700;line-height:.9;letter-spacing:-.04em;font-style:italic}
                .ld .pill{display:inline-flex;align-items:center;gap:9px;padding:7px 14px;border:1px solid var(--bd-line-2);border-radius:var(--r-sm);background:rgba(var(--bd-signal-rgb),.05);margin-bottom:28px}
                .ld .pill .d{width:7px;height:7px;border-radius:50%;background:var(--bd-signal);box-shadow:0 0 8px var(--bd-glow);animation:bd-blink 1.6s infinite}
                .ld .stat-num{font-size:26px;font-weight:700}
                .ld .preview{position:relative;background:var(--bd-surface);border:1px solid var(--bd-line-2);border-radius:var(--r-md);padding:22px;box-shadow:0 0 60px rgba(var(--bd-signal-rgb),.08),0 30px 80px rgba(0,0,0,.6)}
                .ld .preview .ribbon{position:absolute;top:0;right:0;background:var(--bd-signal);color:#04130a;font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:.12em;padding:4px 10px}
                .ld .pv-row{display:flex;gap:14px}
                .ld .pv-art{width:96px;height:96px;flex:0 0 auto}
                .ld .pv-meter{display:flex;gap:4px;margin-top:12px}
                .ld .pv-meter i{height:4px;border-radius:1px;background:var(--bd-elevated)}
                .ld .pv-meter i.on{background:var(--bd-signal);box-shadow:0 0 6px var(--bd-glow)}

                .ld .sec{padding:88px 0;border-bottom:1px solid var(--bd-line)}
                .ld .sec-head{margin-bottom:48px}
                .ld .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
                .ld .step{background:var(--bd-surface);border:1px solid var(--bd-line);border-radius:var(--r-md);padding:30px;position:relative}
                .ld .step .no{font-family:var(--font-mono);font-size:13px;color:var(--bd-signal-dim);letter-spacing:.2em;margin-bottom:20px}
                .ld .step h3{font-size:21px;font-weight:600;margin-bottom:10px}
                .ld .step p{color:var(--bd-muted);font-size:15px}
                .ld .feat{display:grid;grid-template-columns:1fr 1fr;gap:18px}
                .ld .fcard{background:var(--bd-surface);border:1px solid var(--bd-line);border-radius:var(--r-md);padding:30px;display:flex;gap:20px;align-items:flex-start;transition:border-color .2s}
                .ld .fcard:hover{border-color:var(--bd-line-2)}
                .ld .fcard .ic{width:42px;height:42px;flex:0 0 auto;border:1px solid var(--bd-line-2);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;color:var(--bd-signal)}
                .ld .fcard h4{font-size:17px;font-weight:600;margin-bottom:7px}
                .ld .fcard p{color:var(--bd-muted);font-size:14px}
                .ld .cta{position:relative;overflow:hidden;text-align:center;padding:104px 0}
                .ld .cta h2{font-size:clamp(34px,5vw,58px);font-weight:700;letter-spacing:-.03em;font-style:italic}
                .ld footer.pagefoot{padding:40px 0;text-align:center}

                @media(max-width:880px){
                  .ld .hero-grid{grid-template-columns:1fr;padding:64px 0}
                  .ld .steps{grid-template-columns:1fr}
                  .ld .feat{grid-template-columns:1fr}
                  .ld .nav-links{display:none}
                  .ld .burger{display:block}
                  .ld .mobile-menu{display:flex}
                }
            `}</style>

            <Atmosphere />

            <nav className="nav">
                <Link to="/" className="brand"><Logo /><b>BEATDROP</b></Link>
                <div className="nav-links">
                    <a href="#how">How it works</a>
                    <a href="#feat">Features</a>
                    <Link to="/login">Log in</Link>
                    <Link to="/register" className="bd-btn bd-btn--primary bd-btn--sm">Start tracking</Link>
                </div>
                <button className="burger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                    <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        {menuOpen
                            ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" d="M4 8h16M4 16h16" />}
                    </svg>
                </button>
            </nav>
            {menuOpen && (
                <div className="mobile-menu">
                    <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
                    <a href="#feat" onClick={() => setMenuOpen(false)}>Features</a>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
                    <Link to="/register" className="bd-btn bd-btn--primary bd-btn--sm" onClick={() => setMenuOpen(false)}>Start tracking</Link>
                </div>
            )}

            {/* HERO */}
            <header className="hero">
                <div className="bd-haze" style={{ width: 760, height: 760, top: -340, left: -160 }} />
                <div className="bd-haze" style={{ width: 520, height: 520, bottom: -280, right: -60, opacity: .45 }} />
                <div className="wrap hero-grid">
                    <div>
                        <div className="pill"><span className="d" /><span className="bd-mono" style={{ fontSize: 11, letterSpacing: '.16em', color: 'var(--bd-signal)' }}>SYSTEM STATUS · ONLINE</span></div>
                        <h1>TRACK<br />EVERY<br /><span className="neon-text">DROP</span><span className="bd-caret" style={{ height: '.8em' }} /></h1>
                        <p className="bd-body" style={{ color: 'var(--bd-muted)', maxWidth: '46ch', margin: '28px 0 36px' }}>
                            Your release radar for the underground and the mainstream. Tell BeatDrop which artists matter —
                            it maps every drop, show and session into one calendar, and syncs it to your real one.
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <Link to="/register" className="bd-btn bd-btn--primary">Start tracking</Link>
                            <Link to="/login" className="bd-btn bd-btn--ghost">See the radar</Link>
                        </div>
                        <div style={{ display: 'flex', gap: 30, marginTop: 44 }}>
                            <div><div className="bd-mono-num neon-text stat-num">12K+</div><div className="bd-label" style={{ marginTop: 4 }}>ARTISTS INDEXED</div></div>
                            <div><div className="bd-mono-num neon-text stat-num">98.6%</div><div className="bd-label" style={{ marginTop: 4 }}>DROP ACCURACY</div></div>
                            <div><div className="bd-mono-num neon-text stat-num">0</div><div className="bd-label" style={{ marginTop: 4 }}>MISSED RELEASES</div></div>
                        </div>
                    </div>

                    <div className="preview">
                        <div className="ribbon">NEW_SIGNAL</div>
                        <div className="bd-tag" style={{ marginBottom: 18 }}>INCOMING · 02:44:11</div>
                        <div className="pv-row">
                            <img className="pv-art" alt="Kiss Land album cover by The Weeknd"
                                src="https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1b/fe/ea/1bfeea22-0fd6-a2af-afa1-1db7ff9838e7/13UAAIM69536.rgb.jpg/600x600bb.jpg"
                                style={{ objectFit: 'cover', borderRadius: 'var(--r-sm)', border: '1px solid var(--bd-line)' }} />
                            <div style={{ flex: 1 }}>
                                <span className="bd-badge bd-cat-album"><span className="bd-dot" />Album</span>
                                <h3 className="bd-h3" style={{ margin: '12px 0 4px' }}>Kiss Land · Anniversary</h3>
                                <p className="bd-mono" style={{ fontSize: 12, color: 'var(--bd-muted)' }}>THE WEEKND</p>
                                <div className="pv-meter">
                                    <i className="on" style={{ width: 34 }} /><i className="on" style={{ width: 18 }} /><i style={{ width: 14 }} /><i style={{ width: 22 }} /><i style={{ width: 10 }} />
                                </div>
                            </div>
                        </div>
                        <hr className="bd-hair" style={{ margin: '20px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="bd-mono" style={{ fontSize: 11, color: 'var(--bd-dim)' }}>SYNCED · GOOGLE CALENDAR</span>
                            <span className="bd-mono neon-text" style={{ fontSize: 13 }}>17 OCT · 00:00</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* HOW */}
            <section className="sec" id="how">
                <div className="wrap">
                    <div className="sec-head">
                        <div className="bd-tag" style={{ marginBottom: 16 }}>PROTOCOL</div>
                        <h2 className="bd-h1" style={{ maxWidth: '18ch' }}>Three steps from noise to signal.</h2>
                    </div>
                    <div className="steps">
                        <div className="step"><div className="no">01 / TRACK</div><h3>Add your artists</h3><p>Search Spotify and follow anyone — indie, underground, mainstream. BeatDrop starts listening for them.</p></div>
                        <div className="step"><div className="no">02 / MAP</div><h3>Auto-built timeline</h3><p>Every upcoming single, album, show and session lands on a date-sorted calendar. No more scattered posters and tweets.</p></div>
                        <div className="step"><div className="no">03 / SYNC</div><h3>Push to your calendar</h3><p>One-tap Google Calendar sync with color-mapped categories. Your release radar, in the calendar you already live in.</p></div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="sec" id="feat">
                <div className="wrap">
                    <div className="sec-head">
                        <div className="bd-tag" style={{ marginBottom: 16 }}>CAPABILITIES</div>
                        <h2 className="bd-h1">One source of truth for your music world.</h2>
                    </div>
                    <div className="feat">
                        <div className="fcard"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="m21 21-4-4" strokeLinecap="round" /></svg></div><div><h4>Spotify-powered search</h4><p>Pull real artist metadata, art and release feeds straight from the source.</p></div></div>
                        <div className="fcard"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="4" width="18" height="18" rx="1" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg></div><div><h4>Month · Week · Radar</h4><p>Three views of the same truth — grid, timeline, or a live countdown feed.</p></div></div>
                        <div className="fcard"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2v20M2 12h20" strokeLinecap="round" /></svg></div><div><h4>Category color mapping</h4><p>Albums, singles, concerts and sessions each get their own signal hue.</p></div></div>
                        <div className="fcard"><div className="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 6v6l4 2" strokeLinecap="round" /><circle cx="12" cy="12" r="9" /></svg></div><div><h4>Countdown to every drop</h4><p>Down-to-the-second timers so you never miss a midnight release again.</p></div></div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta">
                <div className="bd-haze" style={{ width: 680, height: 520, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                <div className="wrap" style={{ position: 'relative' }}>
                    <div className="bd-tag" style={{ marginBottom: 22, justifyContent: 'center' }}>SYNC YOUR PULSE</div>
                    <h2>Never miss a drop<br />in the <span className="neon-text">fog</span> again.</h2>
                    <div style={{ marginTop: 36 }}><Link to="/register" className="bd-btn bd-btn--primary" style={{ padding: '17px 34px' }}>Start tracking — it's free</Link></div>
                </div>
            </section>

            <footer className="pagefoot">
                <p className="bd-label">BEATDROP © {new Date().getFullYear()} · LAT 34.0522°N · LON 118.2437°W · BUILD v1.0.0</p>
            </footer>
        </div>
    );
};

export default Landing;
