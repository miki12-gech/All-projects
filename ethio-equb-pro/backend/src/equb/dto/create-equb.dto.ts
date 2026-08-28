import { IsString, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateEqubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(100) // ትንሹ የኢቁብ መጠን 100 ብር ይሁን
  amount: number;

  @IsNumber()
  @Min(2) // ቢያንስ 2 ሰው ያስፈልጋል
  maxParticipants: number;
}
