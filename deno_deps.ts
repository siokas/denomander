export const test = Deno.test;
export { parse } from "https://deno.land/std@v0.51.0/flags/mod.ts";
export {
  green,
  yellow,
  red,
  blue,
  bold,
} from "https://deno.land/std@v0.51.0/fmt/colors.ts";
export {
  assert,
  assertEquals,
  assertStrictEq,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@v0.51.0/testing/asserts.ts";
