import { assertEquals, test } from "../deno_deps.ts";
import {
  Helper,
} from "../src/Helper.ts";

test("strip_dashes", function () {
  assertEquals(Helper.stripDashes("--test"), "test");
});

test("contains_brackets", function () {
  assertEquals(Helper.containsBrackets("new [name]"), true);
  assertEquals(Helper.containsBrackets("start"), false);
});

test("trim_string", function () {
  const value = "  -- port  ";

  assertEquals(Helper.trimString(value), "--port");
});
