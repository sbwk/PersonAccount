import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVaultStore } from '@/hooks/useVaultStore';

export default function RequireUnlocked({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { status, bootstrap } = useVaultStore();

  useEffect(() => {
    if (status === 'loading') bootstrap();
  }, [bootstrap, status]);

  useEffect(() => {
    if (status === 'locked') {
      navigate('/unlock', { replace: true, state: { from: location.pathname } });
    }
  }, [location.pathname, navigate, status]);

  if (status !== 'unlocked') return null;
  return <>{children}</>;
}
