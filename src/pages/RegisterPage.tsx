import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

export function RegisterPage() {
  const { register, isLoggedIn } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn) navigate('/', { replace: true });
  }, [isLoggedIn, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await register(username, password, displayName);
    if (result.ok) navigate('/');
    else setError(result.message);
  };

  return (
    <div className="page auth-page">
      <form className="auth-card card" onSubmit={onSubmit}>
        <h1>注册</h1>
        <p className="muted">创建本地模拟账号，即可加入班级并上传影像。</p>
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
          <span>昵称</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="field">
          <span>密码</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={4}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn primary wide">
          注册并登录
        </button>
        <p className="auth-switch">
          已有账号？<Link to="/login">登录</Link>
        </p>
      </form>
    </div>
  );
}
