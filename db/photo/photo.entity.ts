import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import {PhotoInterface} from "./interfaces/photo.interface";
import {Users} from "../users/users.entity";

@Entity()
export class Photo implements PhotoInterface {
    @PrimaryKey()
    id: number;

    @Property()
    theme: string;

    @Property()
    user_id: number;

    @Property()
    filename: string;

    @Property()
    date: Date | string;

    @ManyToOne({ entity: () => Users })
    user: Users;
}
