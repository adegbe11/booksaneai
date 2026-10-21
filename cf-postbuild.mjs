// Works around an OpenNext bug: requirePage matches page files with a bare
// endsWith("app/page.js"), so e.g. /x/foo-app/page.js can resolve to
// the home page (seen on teaspill). Anchor every match on a leading slash.
import fs from "node:fs";
const f = ".open-next/server-functions/default/handler.mjs";
let s = fs.readFileSync(f, "utf8");
const before = s;
s = s.replace(/\.endsWith\("(app|pages|server)\//g, '.endsWith("/$1/');
fs.writeFileSync(f, s);
console.log("cf-postbuild: patched", before === s ? "nothing" : "page matchers");
