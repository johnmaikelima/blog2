import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogSettings extends Document {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  defaultAuthorName: string;
  defaultAuthorEmail: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogSettingsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome para o blog'],
      trim: true,
      maxlength: [100, 'O nome não pode ter mais de 100 caracteres'],
      default: 'Meu Blog'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'A descrição não pode ter mais de 500 caracteres'],
      default: 'Um blog sobre diversos assuntos interessantes'
    },
    logo: {
      type: String,
      default: '/logo.png'
    },
    favicon: {
      type: String,
      default: '/favicon.ico'
    },
    defaultAuthorName: {
      type: String,
      default: 'Administrador'
    },
    defaultAuthorEmail: {
      type: String,
      default: 'admin@exemplo.com'
    },
    contactEmail: {
      type: String,
      default: 'contato@exemplo.com'
    },
    contactPhone: {
      type: String,
      default: ''
    },
    contactWhatsapp: {
      type: String,
      default: ''
    },
    socialMedia: {
      facebook: {
        type: String,
        default: ''
      },
      twitter: {
        type: String,
        default: ''
      },
      instagram: {
        type: String,
        default: ''
      },
      linkedin: {
        type: String,
        default: ''
      },
      youtube: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true,
  }
);

// Garantir que apenas um documento de configurações exista
BlogSettingsSchema.statics.findOneOrCreate = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  
  return this.create({});
};

export default mongoose.models.BlogSettings || mongoose.model<IBlogSettings>('BlogSettings', BlogSettingsSchema);
