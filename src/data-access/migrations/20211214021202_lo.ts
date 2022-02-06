import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('sample', (table) => {
		table.increments('id').primary().index('project_id');
		table.string('title', 256);
		table.text('description');
		table
			.integer('created_by')
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('RESTRICT')
			.onUpdate('CASCADE');
		table
			.integer('status_id')
			.notNullable()
			.references('id')
			.inTable('project_statuses')
			.onDelete('RESTRICT')
			.onUpdate('CASCADE');
		table.timestamps(true, true);
		table.timestamp('deleted_at').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	knex.schema.dropTableIfExists('sample');
}
