import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import BlogSettingsModel from '@/models/blog-settings';

// Metadata será gerada dinamicamente com base nas configurações do blog
export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  
  try {
    // Buscar configurações do blog
    const settings = await BlogSettingsModel.findOne().lean() || { 
      name: 'Blog Moderno', 
      description: 'Um blog sobre tecnologia e desenvolvimento web' 
    };
    
    return {
      title: settings.name,
      description: settings.description,
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return {
      title: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
    };
  }
};

// Função para buscar categorias do MongoDB
async function getCategories() {
  await connectToDatabase();
  
  try {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    
    // Formatar as categorias para o frontend
    return categories.map((category: any) => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Função para buscar configurações do blog
async function getBlogSettings() {
  await connectToDatabase();
  
  try {
    // Buscar configurações ou usar valores padrão
    const settings = await BlogSettingsModel.findOne().lean() || {
      name: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
      logo: '/logo.png'
    };
    
    return {
      name: settings.name,
      description: settings.description,
      logo: settings.logo || '/logo.png'
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return {
      name: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
      logo: '/logo.png'
    };
  }
}

export default async function MainSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Buscar categorias e configurações do MongoDB
  const categories = await getCategories();
  const blogSettings = await getBlogSettings();
  
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Header categories={categories} blogSettings={blogSettings} />
      <main className="flex-grow pt-24 w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
      <Footer blogSettings={blogSettings} />
    </div>
  );
}
