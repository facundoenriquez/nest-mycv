import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        // see if email is in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // hash the user password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create a new user and save it
        const user = await this.usersService.create(email, hashedPassword);

        // return the user
        return user;
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        if (await bcrypt.compare(password, user.password)) {
            return user;
        }

        throw new BadRequestException('password is incorrect');
    }
}