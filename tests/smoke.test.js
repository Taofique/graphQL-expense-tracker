import mongoose from "mongoose";

it("connects to in-memory MongoDB", () => {
  expect(mongoose.connection.readyState).toBe(1);
});
