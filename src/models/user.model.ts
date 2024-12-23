import { getModelForClass, prop } from '@typegoose/typegoose';

class Coordinates {
  @prop({ required: true })
  public lat!: number;

  @prop({ required: true })
  public lng!: number;
}

export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop()
  public address?: string;

  @prop({ _id: false })
  public coordinates?: Coordinates;
}

export const UserModel = getModelForClass(User);
