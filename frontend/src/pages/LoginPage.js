import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Unable to connect to the backend server. Please ensure the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper animate-fade-in">
      <div className="glass-card login-card-new">
        <div className="login-header">
          <div className="login-logo">TMS</div>
          {/* <h1>System Portal</h1> */}
          <p>Secure Access to TMS Platform</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Corporate Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </div>

          <div className="form-group">
            <label>Security Token (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-premium login-submit">
            {loading ? 'AUTHENTICATING...' : 'SECURE LOGIN'}
          </button>
        </form>

        <div className="login-footer">
          <p>Protected by Enterprise Encryption</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
