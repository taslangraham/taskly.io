import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("project_statuses").del();

    // Inserts seed entries
    await knex("project_statuses").insert([
        { id: 1, name: "Open" },
        { id: 2, name: "Completed" },
        { id: 3, name: "Close" },
    ]);
};
