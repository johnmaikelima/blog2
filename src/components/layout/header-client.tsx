'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

interface HeaderClientProps {
  categories?: any[];
  blogSettings?: {
    name: string;
    description: string;
    logo: string;
  };
}

export default function HeaderClient({ categories = [], blogSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>(categories);
  const pathname = usePathname();

  // Efeito para detectar rolagem
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Buscar categorias se não forem fornecidas como props
  useEffect(() => {
    if (categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          if (response.ok) {
            const data = await response.json();
            setLocalCategories(data);
          }
        } catch (error) {
          console.error('Erro ao buscar categorias:', error);
        }
      };

      fetchCategories();
    } else {
      setLocalCategories(categories);
    }
  }, [categories]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={blogSettings?.logo || "/logo.png"}
              alt={`${blogSettings?.name || "Blog"} Logo`}
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-base font-medium transition-colors hover:text-blue-600 ${
                pathname === '/' ? 'text-blue-600' : 'text-gray-800'
              }`}
            >
              Início
            </Link>
            <Link
              href="/sobre"
              className={`text-base font-medium transition-colors hover:text-blue-600 ${
                pathname === '/sobre' ? 'text-blue-600' : 'text-gray-800'
              }`}
            >
              Sobre Nós
            </Link>
            
            {/* Dropdown de Categorias */}
            <div className="relative group">
              <button
                className={`flex items-center text-base font-medium transition-colors hover:text-blue-600 ${
                  pathname?.startsWith('/categorias') ? 'text-blue-600' : 'text-gray-800'
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Categorias
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {localCategories.length > 0 ? (
                    localCategories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/categorias/${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                        role="menuitem"
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-4 py-2 text-sm text-gray-500">
                      Nenhuma categoria
                    </span>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Botão do Menu Mobile */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={`text-base font-medium transition-colors hover:text-blue-600 ${
                  pathname === '/' ? 'text-blue-600' : 'text-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href="/sobre"
                className={`text-base font-medium transition-colors hover:text-blue-600 ${
                  pathname === '/sobre' ? 'text-blue-600' : 'text-gray-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nós
              </Link>
              
              {/* Categorias no Mobile */}
              <div>
                <button
                  className={`flex items-center text-base font-medium transition-colors hover:text-blue-600 ${
                    pathname?.startsWith('/categorias') ? 'text-blue-600' : 'text-gray-800'
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Categorias
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    {localCategories.length > 0 ? (
                      localCategories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categorias/${category.slug}`}
                          className="block text-sm text-gray-700 hover:text-blue-600"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <span className="block text-sm text-gray-500">
                        Nenhuma categoria
                      </span>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
