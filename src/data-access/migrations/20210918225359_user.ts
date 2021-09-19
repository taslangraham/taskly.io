import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable('users', (table) => {
			table.increments('id').primary().index('users_id_index');
			table.string('email').unique({ indexName: 'user_email_index' });
			table.string('firstName');
			table.string('lastName');
			table.timestamp('created_at').defaultTo(knex.fn.now());
			table.timestamp('updated_at').defaultTo(knex.fn.now());
			table.timestamp('delete_at', { precision: 6 });
			table.string('password').notNullable();
		});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema
		.dropTableIfExists('users');
}
