import {IsString, Length} from "class-validator";

export class ChangePhotoThemeDto {
    @IsString()
    @Length(1, 255)
    theme: string;
}
