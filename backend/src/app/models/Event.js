import mongoose from 'mongoose';
import PointSchema from './utils/PointSchema';

const eventSchema = new mongoose.Schema(
  {
    pothole: { type: Boolean },
    timestamp: { type: Date, min: '1970-01-01', required: true },
    location: {
      type: PointSchema,
      index: '2dsphere',
      required: true,
    },
  },
  {
    collection: 'events',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    // { timestamps:true}
  }
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

/*
eventSchema.pre('save', function (next) {
  const doc = this
  doc.createdAt = Date.now()
  doc.updatedAt = Date.now()
  doc.secret = uuidv4() #const uuidv4 = require('uuid/v4')
  next()
})
*/

eventSchema.set('toJSON', { getters: true, virtuals: true });

export default mongoose.model('Event', eventSchema);
