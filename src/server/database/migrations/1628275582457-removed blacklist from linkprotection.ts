import {MigrationInterface, QueryRunner} from "typeorm";

export class removedBlacklistFromLinkprotection1628275582457 implements MigrationInterface {
    name = 'removedBlacklistFromLinkprotection1628275582457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_protection" DROP COLUMN "blacklist"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_protection" ADD "blacklist" text NOT NULL`);
    }

}
