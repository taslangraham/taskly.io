import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('issued_refresh_tokens', (table) => {
    table.increments('id').primary();
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.boolean('is_valid').notNullable();
    table.string('token').notNullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTableIfExists('ssued_refresh_tokens');
}
