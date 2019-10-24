/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class makeAgentOptional1570907133418 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "talent" DROP CONSTRAINT "FK_bdc897d5e95b30a791b126bad39"`);
        await queryRunner.query(`ALTER TABLE "talent" ALTER COLUMN "agentId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "talent" ADD CONSTRAINT "FK_bdc897d5e95b30a791b126bad39" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "talent" DROP CONSTRAINT "FK_bdc897d5e95b30a791b126bad39"`);
        await queryRunner.query(`ALTER TABLE "talent" ALTER COLUMN "agentId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "talent" ADD CONSTRAINT "FK_bdc897d5e95b30a791b126bad39" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
