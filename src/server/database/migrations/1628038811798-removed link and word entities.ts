import {MigrationInterface, QueryRunner} from "typeorm";

export class removedLinkAndWordEntities1628038811798 implements MigrationInterface {
    name = 'removedLinkAndWordEntities1628038811798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "word_protection" ADD "blacklist" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "link_protection" ADD "blacklist" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "link_protection" ADD "whitelist" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_protection" DROP COLUMN "whitelist"`);
        await queryRunner.query(`ALTER TABLE "link_protection" DROP COLUMN "blacklist"`);
        await queryRunner.query(`ALTER TABLE "word_protection" DROP COLUMN "blacklist"`);
    }

}
