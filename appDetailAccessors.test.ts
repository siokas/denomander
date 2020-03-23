import { assertEquals, test } from "./test_deps.ts";
import AppDetailAccessors from "./AppDetailAccessors.ts";

test(function app_detail_accessors() {
  let program = new AppDetailAccessors();
  assertEquals(program.app_name, "My App"); // Default app name if not provided in constructor
  assertEquals(program.app_description, "My Description"); // Default description if not provided in constructor
  assertEquals(program.app_version, "0.0.1"); // Default version if not provided in constructor

  program.app_name = "New Name";
  assertEquals(program.app_name, "New Name");

  program.app_description = "New Description";
  assertEquals(program.app_description, "New Description");

  program.app_version = "2.5.0";
  assertEquals(program.app_version, "2.5.0");
});
