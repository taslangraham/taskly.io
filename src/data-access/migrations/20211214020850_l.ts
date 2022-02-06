import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('test', (table) => {
		table.increments('id').index('stage_id_index').primary();
		table.string('title', 60).notNullable();
		table.integer('project_id')
			.references('id')
			.inTable('projects')
			.notNullable()
			.onDelete('RESTRICT')
			.onUpdate('CASCADE');
		table.integer('created_by')
			.references('id')
			.inTable('users')
			.notNullable()
			.onDelete('RESTRICT')
			.onUpdate('CASCADE');
		table.timestamps(true, true);
		table.timestamp('deleted_at').nullable();
	});
}


export async function down(knex: Knex): Promise<void> {
}

