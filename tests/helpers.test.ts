import { assertEquals, test } from "../deno_deps.ts";
import {
  stripDashes,
  containsBrackets,
  trimString
} from "../src/helpers.ts";

test(function strip_dashes() {
  assertEquals(stripDashes("--test"), "test");
});

test(function contains_brackets() {
  assertEquals(containsBrackets("new [name]"), true);
  assertEquals(containsBrackets("start"), false);
});

test(function trim_string() {
  const value = "  -- port  ";

  assertEquals(trimString(value), "--port");
});
