import {MigrationInterface, QueryRunner} from "typeorm";

export class responseStatusNowIsAnEnum1628053183452 implements MigrationInterface {
    name = 'responseStatusNowIsAnEnum1628053183452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "caps_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`CREATE TYPE "caps_protection_response-status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`ALTER TABLE "caps_protection" ADD "response-status" "caps_protection_response-status_enum" NOT NULL DEFAULT 'on'`);
        await queryRunner.query(`ALTER TABLE "word_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`CREATE TYPE "word_protection_response-status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`ALTER TABLE "word_protection" ADD "response-status" "word_protection_response-status_enum" NOT NULL DEFAULT 'on'`);
        await queryRunner.query(`ALTER TABLE "symbol_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`CREATE TYPE "symbol_protection_response-status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`ALTER TABLE "symbol_protection" ADD "response-status" "symbol_protection_response-status_enum" NOT NULL DEFAULT 'on'`);
        await queryRunner.query(`ALTER TABLE "paragraph_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`CREATE TYPE "paragraph_protection_response-status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`ALTER TABLE "paragraph_protection" ADD "response-status" "paragraph_protection_response-status_enum" NOT NULL DEFAULT 'on'`);
        await queryRunner.query(`ALTER TABLE "link_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`CREATE TYPE "link_protection_response-status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`ALTER TABLE "link_protection" ADD "response-status" "link_protection_response-status_enum" NOT NULL DEFAULT 'on'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`DROP TYPE "link_protection_response-status_enum"`);
        await queryRunner.query(`ALTER TABLE "link_protection" ADD "response-status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "paragraph_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`DROP TYPE "paragraph_protection_response-status_enum"`);
        await queryRunner.query(`ALTER TABLE "paragraph_protection" ADD "response-status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "symbol_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`DROP TYPE "symbol_protection_response-status_enum"`);
        await queryRunner.query(`ALTER TABLE "symbol_protection" ADD "response-status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "word_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`DROP TYPE "word_protection_response-status_enum"`);
        await queryRunner.query(`ALTER TABLE "word_protection" ADD "response-status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "caps_protection" DROP COLUMN "response-status"`);
        await queryRunner.query(`DROP TYPE "caps_protection_response-status_enum"`);
        await queryRunner.query(`ALTER TABLE "caps_protection" ADD "response-status" boolean NOT NULL DEFAULT true`);
    }

}
