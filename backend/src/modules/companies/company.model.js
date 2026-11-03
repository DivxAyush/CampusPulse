import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    industry: {
      type: String,
      default: 'Technology',
    },
    companySize: {
      type: String,
      default: '50-200 employees',
    },
    companyType: {
      type: String,
      default: 'Product',
    },
    foundedYear: {
      type: String,
      default: '2020',
    },
    description: {
      type: String,
      default: '',
    },
    headquarters: {
      type: String,
      default: 'Bengaluru, India',
    },
    contactEmail: {
      type: String,
      default: '',
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Company = mongoose.model('Company', companySchema);
