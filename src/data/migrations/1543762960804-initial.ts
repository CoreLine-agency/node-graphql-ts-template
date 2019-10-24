/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1543762960804 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "contentBase64" text NOT NULL, "slug" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "passwordHash" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "role" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
