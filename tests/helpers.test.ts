import { assertEquals, test } from "../deno_deps.ts";
import {
  stripDashes,
  containsBrackets,
  trimString,
} from "../src/helpers.ts";

test("strip_dashes", function () {
  assertEquals(stripDashes("--test"), "test");
});

test("contains_brackets", function () {
  assertEquals(containsBrackets("new [name]"), true);
  assertEquals(containsBrackets("start"), false);
});

test("trim_string", function () {
  const value = "  -- port  ";

  assertEquals(trimString(value), "--port");
});
