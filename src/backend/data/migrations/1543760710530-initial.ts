/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1543760710530 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "passwordHash" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "fullName" character varying, "role" character varying NOT NULL, "accountVerificationCode" character varying, "forgotPasswordCode" character varying, "googleUserId" character varying, "googleToken" character varying, "facebookUserId" character varying, "facebookAccessToken" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "title" character varying NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "contentBase64" text NOT NULL, "slug" character varying NOT NULL, "postId" integer, "userId" integer, CONSTRAINT "REL_b2d8e683f020f61115edea206b" UNIQUE ("userId"), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_f0f2188b3e254ad31ba2b95ec4b" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_b2d8e683f020f61115edea206b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_b2d8e683f020f61115edea206b3"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_f0f2188b3e254ad31ba2b95ec4b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
