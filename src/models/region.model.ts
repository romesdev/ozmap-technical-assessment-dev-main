import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { User } from './user.model';

@index({ geometry: '2dsphere' }) // Define o índice geoespacial
export class Region {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, type: mongoose.Schema.Types.Mixed })
  public geometry!: {
    type: 'Polygon';
    coordinates: number[][][];
  };

  @prop({ ref: () => User, required: true })
  public owner!: Ref<User>;
}

export const RegionModel = getModelForClass(Region);
