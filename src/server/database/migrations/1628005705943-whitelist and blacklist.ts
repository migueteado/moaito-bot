import {MigrationInterface, QueryRunner} from "typeorm";

export class whitelistAndBlacklist1628005705943 implements MigrationInterface {
    name = 'whitelistAndBlacklist1628005705943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "word_blacklist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "response" text NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "PK_ef73a62a3a3cf33a7fd22e7902b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "link_whitelist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "response" text NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "PK_aea70f8639bf0961d0fdcbd6904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "built_in_command" DROP COLUMN "response"`);
        await queryRunner.query(`ALTER TABLE "built_in_command" DROP COLUMN "global_cooldown"`);
        await queryRunner.query(`CREATE TYPE "custom_command_reply-in_enum" AS ENUM('chat', 'whisper')`);
        await queryRunner.query(`ALTER TABLE "custom_command" ADD "reply-in" "custom_command_reply-in_enum" NOT NULL DEFAULT 'chat'`);
        await queryRunner.query(`ALTER TABLE "word_blacklist" ADD CONSTRAINT "FK_f7b90162e75fb2131b1ae7c4714" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link_whitelist" ADD CONSTRAINT "FK_13b0eb857a952610d0fc87f29c6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_whitelist" DROP CONSTRAINT "FK_13b0eb857a952610d0fc87f29c6"`);
        await queryRunner.query(`ALTER TABLE "word_blacklist" DROP CONSTRAINT "FK_f7b90162e75fb2131b1ae7c4714"`);
        await queryRunner.query(`ALTER TABLE "custom_command" DROP COLUMN "reply-in"`);
        await queryRunner.query(`DROP TYPE "custom_command_reply-in_enum"`);
        await queryRunner.query(`ALTER TABLE "built_in_command" ADD "global_cooldown" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "built_in_command" ADD "response" text NOT NULL`);
        await queryRunner.query(`DROP TABLE "link_whitelist"`);
        await queryRunner.query(`DROP TABLE "word_blacklist"`);
    }

}
