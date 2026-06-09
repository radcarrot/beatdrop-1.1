import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Atmosphere from '../components/Atmosphere';

const Logo = ({ size = 24 }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 4c2.5 0 4.5-1.5 5.5-3.5h-11c1 2 3 3.5 5.5 3.5z" />
    </svg>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('Password must be at least 8 characters long and contain at least one letter and one number.');
            return;
        }
        try {
            await login(email, password);
            navigate('/dashboard');
            toast.success('Logged in successfully');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to login');
        }
    };

    return (
        <div className="auth-page">
            <style>{`
                .auth-page{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow-y:auto;position:relative;padding:88px 0 40px;gap:8px;background:var(--bd-bg);color:var(--bd-text);font-family:var(--font-display)}
                .auth-bg-art{position:fixed;inset:0;z-index:0;background:repeating-linear-gradient(135deg,rgba(var(--bd-signal-rgb),.04) 0 12px,transparent 12px 24px),radial-gradient(120% 80% at 70% 10%,rgba(var(--bd-signal-rgb),.08),transparent 55%),var(--bd-void)}
                .auth-bg-grad{position:fixed;inset:0;z-index:1;background:linear-gradient(180deg,var(--bd-bg),transparent 30%,transparent 70%,var(--bd-bg))}
                .auth-topnav{position:fixed;top:0;left:0;width:100%;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:22px 32px}
                .auth-topnav .brand{display:flex;align-items:center;gap:11px;color:var(--bd-text)}
                .auth-topnav .brand svg{color:var(--bd-signal);filter:drop-shadow(0 0 7px var(--bd-glow))}
                .auth-topnav .brand b{letter-spacing:.28em;font-size:15px}
                .auth-topnav .back{font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--bd-muted)}
                .auth-topnav .back:hover{color:var(--bd-text)}
                .auth-card{position:relative;z-index:10;width:100%;max-width:440px;margin:0 24px;background:rgba(8,12,9,.82);backdrop-filter:blur(18px);border:1px solid var(--bd-line-2);border-radius:var(--r-md);padding:44px 40px;box-shadow:0 0 0 1px rgba(var(--bd-signal-rgb),.05),0 40px 90px rgba(0,0,0,.7)}
                .auth-logo{display:flex;justify-content:center;margin-bottom:26px;color:var(--bd-signal);filter:drop-shadow(0 0 12px var(--bd-glow))}
                .auth-seg{display:flex;border:1px solid var(--bd-line-2);border-radius:var(--r-sm);overflow:hidden;margin-bottom:32px}
                .auth-seg a{flex:1;text-align:center;font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;padding:11px;color:var(--bd-muted);background:transparent;transition:all .16s}
                .auth-seg a.on{background:var(--bd-signal);color:#04130a}
                .auth-fld{margin-bottom:20px}
                .auth-fld .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
                .auth-ftr{margin-top:26px;text-align:center}
                .auth-foot{text-align:center;padding:22px 0 4px;position:relative;z-index:10}
            `}</style>

            <div className="auth-bg-art" />
            <div className="auth-bg-grad" />
            <Atmosphere />

            <div className="auth-topnav">
                <Link to="/" className="brand"><Logo /><b>BEATDROP</b></Link>
                <Link to="/" className="back">← Back</Link>
            </div>

            <main className="auth-card">
                <div className="auth-logo"><Logo size={46} /></div>

                <div className="auth-seg">
                    <Link to="/login" className="on">Log in</Link>
                    <Link to="/register">Register</Link>
                </div>

                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h1 className="bd-h2" style={{ fontSize: 21 }}>Access the network</h1>
                    <p className="bd-mono" style={{ fontSize: 12, color: 'var(--bd-muted)', marginTop: 8 }}>IDENTITY VERIFICATION REQUIRED</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="auth-fld">
                        <label className="bd-label" htmlFor="email">USER_ID / EMAIL</label>
                        <input className="bd-input" style={{ marginTop: 9 }} id="email" type="email"
                            placeholder="IDENTITY_REQUIRED" value={email}
                            onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="auth-fld">
                        <div className="row">
                            <label className="bd-label" htmlFor="password">PASSWORD</label>
                        </div>
                        <input className="bd-input" id="password" type="password"
                            placeholder="••••••••" value={password}
                            onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button className="bd-btn bd-btn--primary" style={{ width: '100%', marginTop: 8 }} type="submit">Log in</button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '26px 0' }}>
                    <hr className="bd-hair" style={{ flex: 1 }} />
                    <span className="bd-label" style={{ fontSize: 11 }}>OR</span>
                    <hr className="bd-hair" style={{ flex: 1 }} />
                </div>

                <a href="/api/auth/google" className="bd-btn bd-btn--ghost" style={{ width: '100%' }}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" width={16} height={16} />
                    Continue with Google
                </a>

                <div className="auth-ftr">
                    <p className="bd-mono" style={{ fontSize: 12, color: 'var(--bd-muted)' }}>
                        New to the network? <Link to="/register" style={{ color: 'var(--bd-signal)' }}>Register</Link>
                    </p>
                </div>
            </main>

            <footer className="auth-foot">
                <p className="bd-label" style={{ fontSize: 11, color: '#2c332b' }}>BEATDROP © {new Date().getFullYear()} · ENCRYPTED CHANNEL</p>
            </footer>
        </div>
    );
}
