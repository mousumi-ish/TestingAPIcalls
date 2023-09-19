import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { rest } from "msw";
import { setupServer } from "msw/node";

const charName = "Luke Skywalker Test";

const server = setupServer(
  rest.get(
    "https://swapi.dev/api/people/1",
    (
      req: any,
      res: (arg0: any) => any,
      ctx: { json: (arg0: { name: string }) => any }
    ) => {
      return res(
        ctx.json({
          name: charName,
        })
      );
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Check title is rendered correctly", () => {
  render(<App />);
  const textElement = screen.getByText("Starwars Character");
  expect(textElement).toBeInTheDocument();
});

test("Check character data is rendered correctly", async () => {
  render(<App />);

  await screen.findByText(/Name : Luke Skywalker Test/i);
  const textElement = screen.getByText("Name : Luke Skywalker Test");
  expect(textElement).toBeInTheDocument();
});

test("Check 500 error is rendered correctly", async () => {
  server.use(
    rest.get(
      "https://swapi.dev/api/people/1",
      (
        _req: any,
        res: (arg0: any) => any,
        ctx: { status: (arg0: number) => any }
      ) => {
        return res(ctx.status(500));
      }
    )
  );

  render(<App />);

  await screen.findByText("Oops... something went wrong, try again");
  const textElement = screen.getByText(
    "Oops... something went wrong, try again"
  );
  expect(textElement).toBeInTheDocument();
});

test("Check 418 error is rendered correctly", async () => {
  server.use(
    rest.get(
      "https://swapi.dev/api/people/1",
      (
        _req: any,
        res: (arg0: any) => any,
        ctx: { status: (arg0: number) => any }
      ) => {
        return res(ctx.status(418));
      }
    )
  );

  render(<App />);

  await screen.findByText("418 I'm a teapot");
  const textElement = screen.getByText("418 I'm a teapot");
  expect(textElement).toBeInTheDocument();
});
