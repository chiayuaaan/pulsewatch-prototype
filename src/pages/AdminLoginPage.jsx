import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import BrandMark from '../components/BrandMark';

const prototypeCredentials = {
  userId: 'pulsewatch-admin',
  password: 'TonleSap2038!',
};

export default function AdminLoginPage({ onAuthenticate }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (userId.trim() === prototypeCredentials.userId && password === prototypeCredentials.password) {
      setError('');
      onAuthenticate();
      return;
    }
    setError('The user ID or password is incorrect.');
  };

  return (
    <div className="admin-login-page">
      <section className="admin-login-context" aria-label="PulseWatch authority workspace">
        <div className="admin-login-brand"><BrandMark /><span><strong>PulseWatch</strong><small>Authority workspace</small></span></div>
        <div className="admin-login-message">
          <span><i /> Restricted operations access</span>
          <h1>One trusted view of the flood pulse.</h1>
          <p>For authorised MRC teams, ministries, NGO partners and field coordinators.</p>
        </div>
        <div className="admin-login-network"><span>15 monitored locations</span><span>Live response priorities</span><span>Verified community evidence</span></div>
      </section>

      <section className="admin-login-panel">
        <form onSubmit={submit} noValidate>
          <span className="admin-login-kicker"><ShieldCheck size={16} /> Secure sign in</span>
          <h2>Authority access</h2>
          <p>Enter your assigned PulseWatch credentials.</p>

          <label htmlFor="admin-user-id">User ID</label>
          <div className="admin-login-field">
            <UserRound size={18} />
            <input
              id="admin-user-id"
              name="userId"
              autoComplete="username"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Enter your user ID"
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="admin-login-field">
            <LockKeyhole size={18} />
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="admin-login-error" role="alert">{error}</div>}
          <button className="admin-login-submit" type="submit">Enter command centre <ArrowRight size={17} /></button>
          <small className="admin-login-disclosure">Prototype sign-in only. Production access would use encrypted server authentication and organisation-managed accounts.</small>
        </form>
      </section>
    </div>
  );
}
