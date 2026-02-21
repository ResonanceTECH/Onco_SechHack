import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { ScrollToHash } from '../ScrollToHash';

export function LandingLayout() {
  return (
    <>
      <ScrollToHash />
      <div className="min-h-screen bg-white antialiased">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
