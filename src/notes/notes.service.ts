import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './notes.schema';

@Injectable()
export class NotesService {

  private readonly logger = new Logger(NotesService.name);

  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>
  ) { }

  public async createNote(title: string, content: string, tags: string[]): Promise<Note> {
    const note = new this.noteModel({ title, content, tags })
    await note.save();
    return note;
  }

  public async getNotes(): Promise<NoteDocument[]> {
    const notes = await this.noteModel.find();
    return notes;
  }

  public async getNoteById(id: string): Promise<NoteDocument> {
    const note = await this.noteModel.findOne({ _id: id });
    return note;
  }

  public async getNotesByDate(date: Date): Promise<NoteDocument[]> {
    const notes = await this.noteModel.find({ createdAt: date.toLocaleDateString() });
    return notes;
  }

  public async deleteNote(id: string): Promise<boolean> {
    const result = await this.noteModel.deleteOne({ _id: id });
    return !!result?.deletedCount;
  }

}
