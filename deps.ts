export const test = Deno.test;
export { parse } from "https://deno.land/std@0.74.0/flags/mod.ts";
export {
  green,
  yellow,
  red,
  blue,
  bold,
} from "https://deno.land/std@0.74.0/fmt/colors.ts";
export {
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";
