import { assertEquals, test } from "./test_deps.ts";
import AppDetailAccessors from "./AppDetailAccessors.ts";

test(function app_detail_accessors() {
  let app = new AppDetailAccessors();
  assertEquals(app.name, "My App"); // Default app name if not provided in constructor
  assertEquals(app.description, "My Description"); // Default description if not provided in constructor
  assertEquals(app.version, "0.0.1"); // Default version if not provided in constructor

  app.name = "New Name";
  assertEquals(app.name, "New Name");

  app.description = "New Description";
  assertEquals(app.description, "New Description");

  app.version = "2.5.0";
  assertEquals(app.version, "2.5.0");
});
