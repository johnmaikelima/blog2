'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, FileText, Settings, Users, LogOut, ChevronDown, Palette, ChevronRight, Tag, Sparkles } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  submenu?: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: 'Posts',
    href: '/dashboard/posts',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Categorias',
    href: '/dashboard/categories',
    icon: <Tag className="h-5 w-5" />,
  },
  {
    name: 'IA',
    href: '/dashboard/ai',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    name: 'Usuários',
    href: '/dashboard/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Configurações',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        name: 'Temas',
        href: '/dashboard/settings/themes',
        icon: <Palette className="h-4 w-4" />,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('/dashboard/settings');

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '64px', padding: '0 24px', borderBottom: '1px solid #e5e7eb' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <span style={{ fontSize: '18px' }}>Blog Admin</span>
        </Link>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: pathname === item.href ? '#2563eb' : '#4b5563',
                backgroundColor: pathname === item.href ? '#f3f4f6' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
