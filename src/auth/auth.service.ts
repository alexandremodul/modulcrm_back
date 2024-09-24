import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from 'src/user/interfaces/user.entity';
import { UserService } from 'src/user/user.service';
import {LoginDto} from '../auth/dtos/login.dto';
import {compare} from 'bcrypt'
import { ReturnLogin } from './dtos/returnLogin.dto';
import { CreateUserDto } from 'src/user/dtos/createUser.dto';
import { LoginPayload } from './dtos/loginPayload.dto';
import {JwtService} from '@nestjs/jwt'
@Injectable()
export class AuthService {
    constructor (private readonly userService: UserService, private jwtService: JwtService){}

    async login(loginDto: LoginDto): Promise<ReturnLogin>  {
        const user: UserEntity | undefined = await this.userService.getUserByLogin(loginDto.login).catch(() => undefined)

        const isMatch = await compare(loginDto.password, user?.password || '')

        

        if(!user || isMatch){
            throw new NotFoundException('Dados Invalidos')
        }

        return {
            accessToken: this.jwtService.sign({ ...new LoginPayload(user) }), // Usando spread para converter em plain object
            user: new CreateUserDto(user),
        };
    }
}
