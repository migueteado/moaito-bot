import {MigrationInterface, QueryRunner} from "typeorm";

export class replyInRemoved1628013598503 implements MigrationInterface {
    name = 'replyInRemoved1628013598503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_command" DROP COLUMN "reply-in"`);
        await queryRunner.query(`DROP TYPE "public"."custom_command_reply-in_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."custom_command_reply-in_enum" AS ENUM('chat', 'whisper')`);
        await queryRunner.query(`ALTER TABLE "custom_command" ADD "reply-in" "custom_command_reply-in_enum" NOT NULL DEFAULT 'chat'`);
    }

}
