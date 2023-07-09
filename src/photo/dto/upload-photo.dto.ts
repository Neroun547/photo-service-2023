import {IsString, Length} from "class-validator";

export class UploadPhotoDto {

    @IsString()
    @Length(1, 255)
    theme: string;
}
