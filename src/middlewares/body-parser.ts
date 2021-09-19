import express, { Application } from "express";

/**
 * Configure body parser for Application.
 * You can make changes as necessary
 * @param app - Express Applocation instance
 */
export const loadBodyParser = (app: Application) => {
  // Used to parse JSON bodies
  app.use(express.urlencoded({ extended: true }));
  // Parse URL-encoded bodies
  app.use(express.json());
};
