import { assertEquals, test } from "../deno_deps.ts";
import { Kernel } from "../src/Kernel.ts";

test("app_detail_accessors", function () {
  const program = new Kernel();
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

test("app_detail_accessors_passing_values_in_constructor", function () {
  const program = new Kernel({
    app_name: "New App",
    app_description: "New Description",
    app_version: "10.1.8",
  });

  assertEquals(program.app_name, "New App");
  assertEquals(program.app_description, "New Description");
  assertEquals(program.app_version, "10.1.8");
});
