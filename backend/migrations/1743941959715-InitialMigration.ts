import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1743941959715 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE attraction (
              id VARCHAR(36) NOT NULL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              description TEXT NOT NULL,
              addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              rating JSON NOT NULL,
              photoUrl VARCHAR(255) NOT NULL,
              location VARCHAR(255) NOT NULL,
              latitude DOUBLE NOT NULL,
              longitude DOUBLE NOT NULL,
              mapLink VARCHAR(255) NOT NULL,
              isVisited BOOLEAN DEFAULT FALSE
            )
          `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE attractions`);
    }

}
