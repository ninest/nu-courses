import { Router } from "oak";

export const sectionsRouter = new Router();

interface Params {
  term: string;
  crn: string;
}

sectionsRouter.get("/:term/:crn", (context) => {
  const { term, crn } = context.params as Params;

  context.response.body = { term, crn };
});
