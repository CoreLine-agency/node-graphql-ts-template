/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class removeFullName1553905777423 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fullName" character varying`);
    }

}
