export const test = Deno.test;
export { parse } from "https://deno.land/std@0.145.0/flags/mod.ts";
export {
  blue,
  bold,
  green,
  red,
  reset as resetColor,
  yellow,
} from "https://deno.land/std@0.145.0/fmt/colors.ts";
export {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.145.0/testing/asserts.ts";
