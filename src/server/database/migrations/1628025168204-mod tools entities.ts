import {MigrationInterface, QueryRunner} from "typeorm";

export class modToolsEntities1628025168204 implements MigrationInterface {
    name = 'modToolsEntities1628025168204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link_blacklist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "response" text NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "PK_bd2461815135515f211067faf93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "caps_protection_punishment_enum" AS ENUM('timeout', 'ban')`);
        await queryRunner.query(`CREATE TYPE "caps_protection_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "caps_protection_user_level_enum" AS ENUM('all', 'owner', 'moderator', 'vip', 'subscriber')`);
        await queryRunner.query(`CREATE TABLE "caps_protection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "min" integer NOT NULL, "max" integer NOT NULL, "response-status" boolean NOT NULL DEFAULT true, "response" character varying NOT NULL, "punishment_time" integer NOT NULL, "punishment" "caps_protection_punishment_enum" NOT NULL DEFAULT 'timeout', "status" "caps_protection_status_enum" NOT NULL DEFAULT 'on', "user_level" "caps_protection_user_level_enum" NOT NULL DEFAULT 'owner', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_6934c54a4c369f60361402ceb5" UNIQUE ("user_id"), CONSTRAINT "PK_377349a01a668be63d5bb45b927" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "word_protection_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "word_protection_user_level_enum" AS ENUM('all', 'owner', 'moderator', 'vip', 'subscriber')`);
        await queryRunner.query(`CREATE TABLE "word_protection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "response-status" boolean NOT NULL DEFAULT true, "response" character varying NOT NULL, "status" "word_protection_status_enum" NOT NULL DEFAULT 'on', "user_level" "word_protection_user_level_enum" NOT NULL DEFAULT 'owner', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_feddfc1690f834a583ffdbb664" UNIQUE ("user_id"), CONSTRAINT "PK_bb45381d8ee4a10d20a88a92ae6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "symbol_protection_punishment_enum" AS ENUM('timeout', 'ban')`);
        await queryRunner.query(`CREATE TYPE "symbol_protection_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "symbol_protection_user_level_enum" AS ENUM('all', 'owner', 'moderator', 'vip', 'subscriber')`);
        await queryRunner.query(`CREATE TABLE "symbol_protection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "min" integer NOT NULL, "max" integer NOT NULL, "response-status" boolean NOT NULL DEFAULT true, "response" character varying NOT NULL, "punishment_time" integer NOT NULL, "punishment" "symbol_protection_punishment_enum" NOT NULL DEFAULT 'timeout', "status" "symbol_protection_status_enum" NOT NULL DEFAULT 'on', "user_level" "symbol_protection_user_level_enum" NOT NULL DEFAULT 'owner', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_70884b796ee78221f5bdc5b878" UNIQUE ("user_id"), CONSTRAINT "PK_1d88d786afe2edf4436a83f0da9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "link_protection_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "link_protection_user_level_enum" AS ENUM('all', 'owner', 'moderator', 'vip', 'subscriber')`);
        await queryRunner.query(`CREATE TABLE "link_protection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "response-status" boolean NOT NULL DEFAULT true, "response" character varying NOT NULL, "status" "link_protection_status_enum" NOT NULL DEFAULT 'on', "user_level" "link_protection_user_level_enum" NOT NULL DEFAULT 'owner', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_0604d3ed4331a7c502e6ae7ce1" UNIQUE ("user_id"), CONSTRAINT "PK_70fbee60c4b101dbaa104651ce6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "paragraph_protection_punishment_enum" AS ENUM('timeout', 'ban')`);
        await queryRunner.query(`CREATE TYPE "paragraph_protection_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "paragraph_protection_user_level_enum" AS ENUM('all', 'owner', 'moderator', 'vip', 'subscriber')`);
        await queryRunner.query(`CREATE TABLE "paragraph_protection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "max" integer NOT NULL, "response-status" boolean NOT NULL DEFAULT true, "response" character varying NOT NULL, "punishment_time" integer NOT NULL, "punishment" "paragraph_protection_punishment_enum" NOT NULL DEFAULT 'timeout', "status" "paragraph_protection_status_enum" NOT NULL DEFAULT 'on', "user_level" "paragraph_protection_user_level_enum" NOT NULL DEFAULT 'owner', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_a7210c1ddcec74f9c0dc972b5b" UNIQUE ("user_id"), CONSTRAINT "PK_0b3c6c7e78d6e2f5c525cf7e2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "link_blacklist" ADD CONSTRAINT "FK_40c8ec737a5081fa51486a68279" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "caps_protection" ADD CONSTRAINT "FK_6934c54a4c369f60361402ceb59" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "word_protection" ADD CONSTRAINT "FK_feddfc1690f834a583ffdbb6646" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "symbol_protection" ADD CONSTRAINT "FK_70884b796ee78221f5bdc5b8783" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link_protection" ADD CONSTRAINT "FK_0604d3ed4331a7c502e6ae7ce10" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paragraph_protection" ADD CONSTRAINT "FK_a7210c1ddcec74f9c0dc972b5ba" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paragraph_protection" DROP CONSTRAINT "FK_a7210c1ddcec74f9c0dc972b5ba"`);
        await queryRunner.query(`ALTER TABLE "link_protection" DROP CONSTRAINT "FK_0604d3ed4331a7c502e6ae7ce10"`);
        await queryRunner.query(`ALTER TABLE "symbol_protection" DROP CONSTRAINT "FK_70884b796ee78221f5bdc5b8783"`);
        await queryRunner.query(`ALTER TABLE "word_protection" DROP CONSTRAINT "FK_feddfc1690f834a583ffdbb6646"`);
        await queryRunner.query(`ALTER TABLE "caps_protection" DROP CONSTRAINT "FK_6934c54a4c369f60361402ceb59"`);
        await queryRunner.query(`ALTER TABLE "link_blacklist" DROP CONSTRAINT "FK_40c8ec737a5081fa51486a68279"`);
        await queryRunner.query(`DROP TABLE "paragraph_protection"`);
        await queryRunner.query(`DROP TYPE "paragraph_protection_user_level_enum"`);
        await queryRunner.query(`DROP TYPE "paragraph_protection_status_enum"`);
        await queryRunner.query(`DROP TYPE "paragraph_protection_punishment_enum"`);
        await queryRunner.query(`DROP TABLE "link_protection"`);
        await queryRunner.query(`DROP TYPE "link_protection_user_level_enum"`);
        await queryRunner.query(`DROP TYPE "link_protection_status_enum"`);
        await queryRunner.query(`DROP TABLE "symbol_protection"`);
        await queryRunner.query(`DROP TYPE "symbol_protection_user_level_enum"`);
        await queryRunner.query(`DROP TYPE "symbol_protection_status_enum"`);
        await queryRunner.query(`DROP TYPE "symbol_protection_punishment_enum"`);
        await queryRunner.query(`DROP TABLE "word_protection"`);
        await queryRunner.query(`DROP TYPE "word_protection_user_level_enum"`);
        await queryRunner.query(`DROP TYPE "word_protection_status_enum"`);
        await queryRunner.query(`DROP TABLE "caps_protection"`);
        await queryRunner.query(`DROP TYPE "caps_protection_user_level_enum"`);
        await queryRunner.query(`DROP TYPE "caps_protection_status_enum"`);
        await queryRunner.query(`DROP TYPE "caps_protection_punishment_enum"`);
        await queryRunner.query(`DROP TABLE "link_blacklist"`);
    }

}
