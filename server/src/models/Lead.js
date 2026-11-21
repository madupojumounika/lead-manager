import mongoose from 'mongoose';

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Social Media',
  'Advertisement',
  'Other'
];

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Lost'
];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [7, 'Phone number must be at least 7 characters'],
      maxlength: [20, 'Phone number cannot exceed 20 characters']
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [1, 'Company name is required'],
      maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    source: {
      type: String,
      required: [true, 'Lead source is required'],
      enum: {
        values: LEAD_SOURCES,
        message: '{VALUE} is not a valid lead source'
      },
      default: 'Website'
    },
    status: {
      type: String,
      required: [true, 'Lead status is required'],
      enum: {
        values: LEAD_STATUSES,
        message: '{VALUE} is not a valid lead status'
      },
      default: 'New'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for fast searching and filtering
leadSchema.index({ email: 1 }, { unique: true });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', company: 'text', email: 'text' });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
