import mongoose from 'mongoose';
import PointSchema from './utils/PointSchema';

const eventSchema = new mongoose.Schema(
  {
    pothole: Boolean,
    timestamp: { type: Date, min: '1970-01-01' },
    location: {
      type: PointSchema,
      index: '2dsphere',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

eventSchema.index({ pothole: 1 });
eventSchema.index({ pothole: 1, timestamp: 1 });
eventSchema.index({ timestamp: 1 });

eventSchema.virtual('latitude').get(function() {
  return this.coodinates && this.coodinates.lenght === 2
    ? this.coodinates[1]
    : null;
});

eventSchema.virtual('longitude').get(function() {
  return this.coodinates && this.coodinates.lenght === 2
    ? this.coodinates[0]
    : null;
});

eventSchema.set('toJSON', { getters: true, virtuals: true });

export default mongoose.model('Event', eventSchema);
