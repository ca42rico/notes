import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema()
export class Note {

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true, type: String, default: new Date().toLocaleDateString() })
  createdAt: string;

}

export const NoteSchema = SchemaFactory.createForClass(Note);
