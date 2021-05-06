import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsMongoId, IsDateString } from 'class-validator';

export class GetNotesByDateRequest {

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsDateString()
  date: string;

}

export class GetNoteRequest {

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  id: string;

}

export class AddNoteRequest {

  @ApiProperty({ type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [String], required: false })
  tags: string[];

}

export class GetNoteResponse {

  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public title: string;

  @ApiProperty({ type: String })
  public content: string;

  @ApiProperty({ type: [String] })
  public tags: string[];

  @ApiProperty({ type: String, default: "DD/MM/YYY" })
  public createdAt: string;

}
