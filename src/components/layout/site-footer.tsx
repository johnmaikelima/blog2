'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type FooterProps = {
  themeSettings?: {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    footer: {
      showCopyright: boolean;
      copyrightText: string;
      showSocialLinks: boolean;
      socialLinks: Array<{
        platform: string;
        url: string;
        icon: string;
      }>;
      columns: Array<{
        title: string;
        links: Array<{
          label: string;
          url: string;
          isExternal: boolean;
        }>;
      }>;
    };
  };
};

export default function SiteFooter({ themeSettings }: FooterProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<FooterProps['themeSettings']>();

  // Carregar configurações do tema
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error);
      }
    };

    fetchThemeSettings();
    setMounted(true);
  }, []);

  // Use as configurações fornecidas ou as configurações padrão
  const footerSettings = settings?.footer || themeSettings?.footer || {
    showCopyright: true,
    copyrightText: '© 2025 Blog. Todos os direitos reservados.',
    showSocialLinks: true,
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
      { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    ],
    columns: [
      {
        title: 'Links Úteis',
        links: [
          { label: 'Home', url: '/', isExternal: false },
          { label: 'Blog', url: '/blog', isExternal: false },
          { label: 'Sobre', url: '/sobre', isExternal: false },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Termos de Uso', url: '/termos', isExternal: false },
          { label: 'Privacidade', url: '/privacidade', isExternal: false },
        ],
      },
    ],
  };

  const colors = settings?.colors || themeSettings?.colors || {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827',
  };

  // Evitar problemas de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: colors.background + '05',
        color: colors.text,
        borderTop: `1px solid ${colors.text}10`,
        padding: '2rem 0',
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '1rem' }}>
              Blog
            </h3>
            <p style={{ color: colors.text, marginBottom: '1rem' }}>
              Um blog simples e elegante para compartilhar suas ideias com o mundo.
            </p>
            {footerSettings.showSocialLinks && (
              <div className="flex gap-4">
                {footerSettings.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: colors.primary,
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: `1px solid ${colors.primary}`,
                    }}
                  >
                    {link.platform.charAt(0)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerSettings.columns.map((column, index) => (
            <div key={index}>
              <h3 style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '1rem' }}>
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.isExternal ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colors.text }}
                        className="hover:underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.url}
                        style={{ color: colors.text }}
                        className="hover:underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {footerSettings.showCopyright && (
          <div
            style={{
              borderTop: `1px solid ${colors.text}10`,
              marginTop: '2rem',
              paddingTop: '1rem',
              textAlign: 'center',
              color: colors.text + '80',
            }}
          >
            {footerSettings.copyrightText}
          </div>
        )}
      </div>
    </footer>
  );
}
