'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Save, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import InputMask from 'react-input-mask';

interface BlogSettings {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  defaultAuthorName: string;
  defaultAuthorEmail: string;
  
  // Informações de contato
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  
  // Redes sociais
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<BlogSettings>({
    name: '',
    description: '',
    logo: '',
    favicon: '',
    defaultAuthorName: '',
    defaultAuthorEmail: '',
    contactEmail: '',
    contactPhone: '',
    contactWhatsapp: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar configurações ao montar o componente
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings/blog');
        if (!response.ok) {
          throw new Error('Erro ao carregar configurações');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Não foi possível carregar as configurações do blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Função para salvar as configurações
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar configurações');
      }

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para fazer upload da logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');
    
    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer upload da logo');
      }

      const data = await response.json();
      setSettings(prev => ({
        ...prev,
        logo: data.fileUrl
      }));
      
      toast.success('Logo enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload da logo');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para abrir o seletor de arquivo
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para atualizar campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Função para atualizar campos de redes sociais
  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const socialField = name.split('.')[1]; // Extrair o nome do campo após o ponto
    
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [socialField]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações Gerais</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Configure as informações básicas do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Blog</Label>
              <Input 
                id="name"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                placeholder="Nome do seu blog"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description"
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                placeholder="Uma breve descrição do seu blog"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>
              Configure as informações de contato que serão exibidas no seu blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input 
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleInputChange}
                placeholder="contato@seusite.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone</Label>
              <div className="relative">
                <InputMask
                  mask="99 9999-9999"
                  id="contactPhone"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  placeholder="00 0000-0000"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Formato: 00 0000-0000</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactWhatsapp">WhatsApp</Label>
              <div className="relative">
                <InputMask
                  mask="99 99999-9999"
                  id="contactWhatsapp"
                  name="contactWhatsapp"
                  value={settings.contactWhatsapp}
                  onChange={handleInputChange}
                  placeholder="00 00000-0000"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Formato: 00 00000-0000</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>
              Configure os links para suas redes sociais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input 
                id="facebook"
                name="socialMedia.facebook"
                value={settings.socialMedia.facebook}
                onChange={handleSocialMediaChange}
                placeholder="https://facebook.com/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input 
                id="instagram"
                name="socialMedia.instagram"
                value={settings.socialMedia.instagram}
                onChange={handleSocialMediaChange}
                placeholder="https://instagram.com/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input 
                id="twitter"
                name="socialMedia.twitter"
                value={settings.socialMedia.twitter}
                onChange={handleSocialMediaChange}
                placeholder="https://twitter.com/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin"
                name="socialMedia.linkedin"
                value={settings.socialMedia.linkedin}
                onChange={handleSocialMediaChange}
                placeholder="https://linkedin.com/in/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input 
                id="youtube"
                name="socialMedia.youtube"
                value={settings.socialMedia.youtube}
                onChange={handleSocialMediaChange}
                placeholder="https://youtube.com/c/seucanal"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo do Blog</CardTitle>
            <CardDescription>
              Faça upload da logo do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {settings.logo && (
                <div className="relative w-48 h-48 border rounded-md overflow-hidden">
                  <Image
                    src={settings.logo}
                    alt="Logo do blog"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              
              <Button 
                variant="outline" 
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {settings.logo ? 'Alterar Logo' : 'Fazer Upload da Logo'}
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-500">
                Formatos aceitos: JPG, PNG, SVG, WEBP, GIF. Tamanho máximo: 2MB.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
