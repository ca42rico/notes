import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note, NoteSchema } from './notes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }])],
  providers: [NotesService],
  controllers: [NotesController]
})
export class NotesModule { }
