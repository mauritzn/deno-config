import { Functions as Funcs } from "./classes/Functions.ts";

function requestName() {
  return new Promise(async (resolve: (name: string) => void, reject) => {
    console.log("What is your name?");

    let buffer = new Uint8Array(100);
    const input = await Deno.stdin.read(buffer);
    if (input) {
      const answer = new TextDecoder().decode(buffer.subarray(0, input)).trim();
      if (answer.length > 0) {
        resolve(answer);
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
}

requestName()
  .then((name) => {
    console.log("\n== name entered ==");
    Funcs.greetUser(name);
  })
  .catch(() => {
    console.log("\n== name not entered ==");
    Funcs.greetUser("Adam");
  });
