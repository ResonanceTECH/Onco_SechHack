import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-slate-600 hover:text-slate-900 mb-6 text-sm">
          ← На главную
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
