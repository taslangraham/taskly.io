import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('project_statuses', (table) => {
      table.increments('id').primary().index('project_status_id_index');
      table.string('name', 60).unique();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('project_statuses');
}
