import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { WalletService } from '../wallet/wallet.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private walletService: WalletService, 

    private dataSource: DataSource, 
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // 1️⃣ Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 4️⃣ Create user within the transaction
      const user = queryRunner.manager.create(User, {
        email,
        password: hashedPassword,
      });
      const savedUser = await queryRunner.manager.save(user);

      // 5️⃣ Create wallet using the SAME transaction manager
      await this.walletService.create(
        { userId: savedUser.id },        // pass the newly created user ID
        queryRunner.manager              // 🔥 important: pass transaction manager
      );

      // 6️⃣ Commit transaction
      await queryRunner.commitTransaction();

      // 7️⃣ Return user without password
      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;

    } catch (err) {
      // 8️⃣ Rollback if anything fails
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Registration failed. Please try again.');
    } finally {
      // 9️⃣ Release queryRunner
      await queryRunner.release();
    }
  }

  // Helper method to find user by email (for login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
  }
}
