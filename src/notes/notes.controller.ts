import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import * as mongoose from 'mongoose';

import { NotesService } from './notes.service';
import { AddNoteRequest, GetNoteRequest, GetNoteResponse, GetNotesByDateRequest } from './notes.payloads';
import { Note } from './notes.schema';

@ApiTags("notes")
@Controller('notes')
export class NotesController {

  private readonly logger = new Logger(NotesController.name);

  constructor(private readonly noteService: NotesService) { }

  @Get("hello")
  @ApiResponse({ description: "Test controller", status: 200 })
  public hello() {

    return "🐧 Hello tux friend 🐧";

  }

  @Get()
  @ApiQuery({ type: String, name: "date", required: false })
  @ApiOkResponse({ type: [GetNoteResponse], description: "List of notes", status: 200 })
  @ApiResponse({ description: "Malformed request", status: 400 })
  public async getNotes(@Query() getNotesByDateRequest: GetNotesByDateRequest): Promise<GetNoteResponse[]> {

    const date = new Date(getNotesByDateRequest?.date);

    const notes = getNotesByDateRequest
      && getNotesByDateRequest.date
      ? await this.noteService.getNotesByDate(date)
      : await this.noteService.getNotes();

    const response: GetNoteResponse[] = notes.map((note): GetNoteResponse => ({
      id: note.id,
      content: note.content,
      tags: note.tags,
      title: note.title,
      createdAt: note.createdAt,
    }));

    return response;

  }

  @Get(":id")
  @ApiOkResponse({ type: GetNoteResponse, description: "Requested note", status: 200 })
  @ApiResponse({ description: "Note not found", status: 404 })
  @ApiResponse({ description: "Malformed request", status: 400 })
  public async getNote(@Param() getNoteRequest: GetNoteRequest): Promise<GetNoteResponse> {

    const note = await this.noteService.getNoteById(getNoteRequest.id);
    if (!note) throw new NotFoundException();

    const response: GetNoteResponse = {
      id: note.id,
      content: note.content,
      tags: note.tags,
      title: note.title,
      createdAt: note.createdAt,
    };

    return response;

  }

  @Post()
  @HttpCode(201)
  @ApiOkResponse({ description: "Added new note", status: 201 })
  @ApiResponse({ description: "Malformed request", status: 400 })
  public async addNote(@Body() addNoteRequest: AddNoteRequest): Promise<Note> {

    const note = await this.noteService.createNote(
      addNoteRequest.title, addNoteRequest.content, addNoteRequest.tags
    );
    return note;

  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOkResponse({ description: "Deleted note", status: 204 })
  @ApiResponse({ description: "Malformed request", status: 400 })
  @ApiResponse({ description: "Note not found", status: 404 })
  public async deleteNote(@Param("id") idNote: string) {

    if (!mongoose.Types.ObjectId.isValid(idNote))
      throw new BadRequestException("NOT_VALID_ID_TYPE");

    const note = await this.noteService.getNoteById(idNote);
    if (!note) throw new NotFoundException();

    await this.noteService.deleteNote(idNote);

  }

}
