import { UsersInterface } from "./interfaces/users.interface";
import {Collection, Entity, OneToMany, PrimaryKey, Property} from "@mikro-orm/core";
import {Photo} from "../photo/photo.entity";

@Entity()
export class Users implements UsersInterface {
    @PrimaryKey()
    id: number;

    @Property()
    username: string;

    @Property()
    email: string;

    @Property()
    password: string;

    @Property({ nullable: true })
    avatar: string;

    @OneToMany({ entity: () => Photo, mappedBy: "user" })
    photo: Collection<Photo>;
}

