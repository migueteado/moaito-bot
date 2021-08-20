import {MigrationInterface, QueryRunner} from "typeorm";

export class first1627350272468 implements MigrationInterface {
    name = 'first1627350272468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "custom_command_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "custom_command_user_level_enum" AS ENUM('all', 'owner', 'moderator', 'vip', 'subscriber')`);
        await queryRunner.query(`CREATE TYPE "custom_command_type_enum" AS ENUM('simple', 'variant', 'chain')`);
        await queryRunner.query(`CREATE TABLE "custom_command" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "command" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "response" text NOT NULL, "global_cooldown" integer NOT NULL, "user_cooldown" integer NOT NULL, "aliases" character varying NOT NULL, "keywords" character varying NOT NULL, "status" "custom_command_status_enum" NOT NULL DEFAULT 'on', "user_level" "custom_command_user_level_enum" NOT NULL DEFAULT 'all', "type" "custom_command_type_enum" NOT NULL DEFAULT 'simple', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "uniqueCustomCommandNameUserId" UNIQUE ("command"), CONSTRAINT "PK_35d7a4969d94ed4d28f61468a2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "obs_source" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_3df29f59b6b20d48beed8cfa94" UNIQUE ("user_id"), CONSTRAINT "PK_8870d96b4e60a58c9e0406488be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "path" character varying(255) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "path" character varying(255) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying NOT NULL, CONSTRAINT "PK_9562215b41192ae4ccdf314a789" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "path" character varying(255) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying NOT NULL, CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reward" ("id" character varying NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying NOT NULL, "audio_id" uuid, "image_id" uuid, "video_id" uuid, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "timer_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TABLE "timer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "message" character varying(255) NOT NULL, "interval" integer NOT NULL, "chat-messages" integer NOT NULL, "status" "timer_status_enum" NOT NULL DEFAULT 'on', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "PK_b476163e854c74bff55b29d320a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "twitch_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "access_token" character varying(255) NOT NULL, "refresh_token" character varying(255) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying NOT NULL, CONSTRAINT "REL_29dff7c376fe29afbb63ea3383" UNIQUE ("user_id"), CONSTRAINT "PK_a522569485e659a468a88c40ad5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "chatbot_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TABLE "chatbot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "chatbot_status_enum" NOT NULL DEFAULT 'off', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "REL_7bf419f59ca470a3f438eada0e" UNIQUE ("user_id"), CONSTRAINT "PK_1ee1961e62c5cec278314f1d68e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "built_in_command_status_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TABLE "built_in_command" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "command" character varying(100) NOT NULL, "response" text NOT NULL, "global_cooldown" integer NOT NULL, "status" "built_in_command_status_enum" NOT NULL DEFAULT 'on', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying, CONSTRAINT "uniqueBuiltInCommandNameUserId" UNIQUE ("command"), CONSTRAINT "PK_3df752e116bf63edd8c3b7cf347" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "users_user_type_enum" AS ENUM('basic', 'admin', 'pro', 'supporter')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "login" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "user_type" "users_user_type_enum" NOT NULL DEFAULT 'basic', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(100) NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "user_id" character varying NOT NULL, CONSTRAINT "REL_e50ca89d635960fda2ffeb1763" UNIQUE ("user_id"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "custom_command" ADD CONSTRAINT "FK_d56545af0f188cd820a3a35be35" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "obs_source" ADD CONSTRAINT "FK_3df29f59b6b20d48beed8cfa942" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audio" ADD CONSTRAINT "FK_aa3b08bd9f87191cf8b6bf6ffe1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_0c06b8d2494611b35c67296356c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_ddce579c4f227f34c959fa6daf9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_c3f57e4849578ea874799e5515e" FOREIGN KEY ("audio_id") REFERENCES "audio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_e30ccaaa4e33a5d5b88cd8efcb8" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_9d74d822f5c3b1309d792656f70" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timer" ADD CONSTRAINT "FK_a1599e218db9a17a65c2d485788" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "twitch_token" ADD CONSTRAINT "FK_29dff7c376fe29afbb63ea33832" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatbot" ADD CONSTRAINT "FK_7bf419f59ca470a3f438eada0e3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "built_in_command" ADD CONSTRAINT "FK_d728e2654257a25e564d1c36a87" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`);
        await queryRunner.query(`ALTER TABLE "built_in_command" DROP CONSTRAINT "FK_d728e2654257a25e564d1c36a87"`);
        await queryRunner.query(`ALTER TABLE "chatbot" DROP CONSTRAINT "FK_7bf419f59ca470a3f438eada0e3"`);
        await queryRunner.query(`ALTER TABLE "twitch_token" DROP CONSTRAINT "FK_29dff7c376fe29afbb63ea33832"`);
        await queryRunner.query(`ALTER TABLE "timer" DROP CONSTRAINT "FK_a1599e218db9a17a65c2d485788"`);
        await queryRunner.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_9d74d822f5c3b1309d792656f70"`);
        await queryRunner.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_e30ccaaa4e33a5d5b88cd8efcb8"`);
        await queryRunner.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_c3f57e4849578ea874799e5515e"`);
        await queryRunner.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_ddce579c4f227f34c959fa6daf9"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_0c06b8d2494611b35c67296356c"`);
        await queryRunner.query(`ALTER TABLE "audio" DROP CONSTRAINT "FK_aa3b08bd9f87191cf8b6bf6ffe1"`);
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_b0b068a2be3e9a2ed6052786781"`);
        await queryRunner.query(`ALTER TABLE "obs_source" DROP CONSTRAINT "FK_3df29f59b6b20d48beed8cfa942"`);
        await queryRunner.query(`ALTER TABLE "custom_command" DROP CONSTRAINT "FK_d56545af0f188cd820a3a35be35"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "users_user_type_enum"`);
        await queryRunner.query(`DROP TABLE "built_in_command"`);
        await queryRunner.query(`DROP TYPE "built_in_command_status_enum"`);
        await queryRunner.query(`DROP TABLE "chatbot"`);
        await queryRunner.query(`DROP TYPE "chatbot_status_enum"`);
        await queryRunner.query(`DROP TABLE "twitch_token"`);
        await queryRunner.query(`DROP TABLE "timer"`);
        await queryRunner.query(`DROP TYPE "timer_status_enum"`);
        await queryRunner.query(`DROP TABLE "reward"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`DROP TABLE "audio"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "obs_source"`);
        await queryRunner.query(`DROP TABLE "custom_command"`);
        await queryRunner.query(`DROP TYPE "custom_command_type_enum"`);
        await queryRunner.query(`DROP TYPE "custom_command_user_level_enum"`);
        await queryRunner.query(`DROP TYPE "custom_command_status_enum"`);
    }

}
