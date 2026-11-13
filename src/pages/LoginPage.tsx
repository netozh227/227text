import { FormEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

export function LoginPage() {
  const { login, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    (location.state as { from?: string } | null)?.from ?? '/';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) navigate(returnTo, { replace: true });
  }, [isLoggedIn, navigate, returnTo]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.ok) navigate(returnTo, { replace: true });
    else setError(result.message);
  };

  return (
    <div className="page auth-page">
      <form className="auth-card card" onSubmit={onSubmit}>
        <h1>登录</h1>
        <p className="muted">
          模拟登录：账号与密码仅保存在本机浏览器，无真实服务端校验。
        </p>
        <label className="field">
          <span>用户名</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="field">
          <span>密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn primary wide">
          登录
        </button>
        <p className="auth-switch">
          还没有账号？<Link to="/register">注册</Link>
        </p>
      </form>
    </div>
  );
}
