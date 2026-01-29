'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BrandLogo from '@/components/ui/BrandLogo'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (pathname === '/app/login') {
    return children
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(3, 7, 18, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BrandLogo />
        </div>

        <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
          <Link
            href="/app/companies"
            style={{
              color: pathname === '/app/companies' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s',
              background: pathname === '/app/companies' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              fontWeight: 500
            }}
          >
            Companies
          </Link>
          <Link
            href="/app/settings"
            style={{
              color: pathname === '/app/settings' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              transition: 'all 0.2s',
              background: pathname === '/app/settings' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              fontWeight: 500
            }}
          >
            Settings
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{user.email}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#FCA5A5',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem', position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      <style jsx global>{`
        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem !important;
          }
          
          .nav-links {
            width: 100%;
            justify-content: center;
            gap: 0.5rem !important;
          }

          main {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}