/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";
import { hashPassword } from '../../utils/crypto';
import { UserRole } from '../enums/UserRole';

export class addDefaultAdmin1558426947213 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const passwordHash = await hashPassword('password');
        const email = 'admin@coreline.hr';
        const role: UserRole = UserRole.ADMIN;
        const firstName = 'Super';
        const lastName = 'Admin';

        await queryRunner.query(`
      INSERT INTO "user"("passwordHash", "email", "role", "firstName", "lastName")
      VALUES ('${passwordHash}', '${email}', '${role}', '${firstName}', '${lastName}');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}
