import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id')
      .primary()
      .index('task_index')
      .notNullable();
    table.string('title', 256)
      .notNullable();
    table.integer('stage_id')
      .references('id')
      .inTable('project_stages')
      .notNullable()
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.integer('project_id')
      .references('id')
      .inTable('projects')
      .notNullable()
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    table.jsonb('content')
      .defaultTo('{}')
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('tasks');
}
