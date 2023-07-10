import { Injectable } from "@nestjs/common";
import {EntityRepository} from "@mikro-orm/mysql";
import {Users} from "./users.entity";
import {InjectRepository} from "@mikro-orm/nestjs";
import {UsersInterface} from "./interfaces/users.interface";

@Injectable()
export class UsersServiceDb {
    constructor(@InjectRepository(Users) private repository: EntityRepository<Users>) {}

    async getUserByUsernameOrEmail(username: string, email: string) {
        return await this.repository
            .createQueryBuilder()
            .select("*")
            .where("username = ?", [username])
            .orWhere("email = ?", [email])
            .getResult();
    }
    async saveUser(user: UsersInterface) {
        await this.repository.nativeInsert({ ...user });
    }
    async updateUserById(userId: number, newData: UsersInterface) {
        await this.repository.nativeUpdate({ id: userId }, { ...newData });
    }
    async getUserById(id: number) {
        return await this.repository.findOne({ id: id });
    }
}
