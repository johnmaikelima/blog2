import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';

// Função para gerar o sitemap usando a API nativa do Next.js
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectToDatabase();
  
  // Obter a URL base do site
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Data atual para lastmod
  const now = new Date();
  
  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: now,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: now,
      priority: 0.8,
    },
  ];
  
  // Buscar todas as categorias
  const categories = await CategoryModel.find({}).lean();
  
  // Mapear categorias para o formato do sitemap
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/categoria/${category.slug}`,
    lastModified: now,
    priority: 0.7,
  }));
  
  // Buscar todos os posts publicados
  const posts = await PostModel.find({ published: true }).lean();
  
  // Mapear posts para o formato do sitemap
  const postPages = posts.map(post => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    priority: 0.6,
  }));
  
  // Combinar todas as páginas
  return [...staticPages, ...categoryPages, ...postPages];
}
