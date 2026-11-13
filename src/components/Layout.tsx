import { Link, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppProvider';

export function Layout() {
  const { session, logout } = useApp();

  return (
    <div className="site">
      <header className="site-header">
        <MotionBar />
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden>
              档
            </span>
            <div>
              <strong>毕业照档案馆</strong>
              <small>班级影像 · 共同建设</small>
            </div>
          </Link>
          <nav className="nav-main" aria-label="主导航">
            <NavLink to="/" end>
              浏览档案
            </NavLink>
            <NavLink to="/my">我的班级</NavLink>
          </nav>
          <div className="header-auth">
            {session ? (
              <>
                <span className="user-pill">{session.displayName}</span>
                <button type="button" className="btn ghost" onClick={logout}>
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn ghost">
                  登录
                </Link>
                <Link to="/register" className="btn primary">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          毕业照档案馆 — 数据保存在您本机浏览器中，换设备需重新注册或导出（后续版本）。
        </p>
      </footer>
    </div>
  );
}

function MotionBar() {
  return <div className="header-strip" aria-hidden />;
}
