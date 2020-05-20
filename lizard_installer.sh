#!/bin/sh

curl -sSf "https://deno.land/x/denomander/lizard.ts" -o ./lizard.ts
curl -sSf "https://deno.land/x/denomander/.lizard_installer.ts" -o ./.lizard_installer.ts

deno "install" "-f" "-n" "lizard" ".lizard_installer.ts"