function existsSync(filePath: string): boolean {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

type DenoPermission =
  | "allow-env"
  | "allow-hrtime"
  | "allow-net"
  | "allow-read"
  | "allow-run"
  | "allow-write";
interface DenoConfig {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  main?: string;
  permissions: DenoPermission[];
}

const validPermissions: DenoPermission[] = [
  "allow-env",
  "allow-hrtime",
  "allow-net",
  "allow-read",
  "allow-run",
  "allow-write",
];

// for testing only
const testProjects = [
  `./demo_projects/multi_file_testing`,
  `./demo_projects/denotrain`,
];

const projectFolder = testProjects[0];
const configFile = `deno-config.json`;
const fullPath = `${projectFolder}/${configFile}`;

function permissionRequest(permissions: DenoPermission[]) {
  return new Promise(async (resolve, reject) => {
    if (permissions.length > 0) {
      let buffer = new Uint8Array(100);
      let formattedPermissions: string[] = [];
      permissions.map((permission) => {
        formattedPermissions.push(`\n  - ${permission}`);
      });

      console.log(
        "The following permissions are required to run this project:",
        formattedPermissions.join(""),
      );
      console.log("\nContinue (y/N)?");

      const input = await Deno.stdin.read(buffer);
      if (input) {
        const answer = new TextDecoder().decode(buffer.subarray(0, input))
          .trim()
          .toLowerCase();

        switch (answer) {
          case "1":
          case "y":
          case "yes":
            // TODO: add question if answer should be remembered (unless permissions have changed)
            resolve();
            break;

          default:
            reject();
            break;
        }
      } else {
        reject();
      }
    } else {
      resolve();
    }
  });
}

if (existsSync(fullPath)) {
  const plainData = Deno.readTextFileSync(fullPath);
  try {
    const objData: DenoConfig = JSON.parse(plainData);
    let permissions = (objData.permissions ? objData.permissions : []);
    permissions = permissions.filter((permission) => {
      const splitPermission = permission.split("=");
      if (splitPermission.length <= 2) {
        const valid = validPermissions.includes(
          (splitPermission[0].toLowerCase() as DenoPermission),
        );
        if (valid) return true;
        else console.log(`!! Invalid permission: ${permission} !!`);
      } else {
        console.log(`!! Invalid permission: ${permission} !!`);
      }
      return false;
    });
    const permissionString = permissions.map((permission) => `--${permission}`)
      .join(" ").trim();

    if (objData.main) {
      const execFile = objData.main.trim().replace(/^[.][/]/i, "");
      let runCommand = ["deno", "run"];
      if (permissionString.length > 0) {
        runCommand.push(permissionString);
      }
      runCommand.push(execFile);

      permissionRequest(permissions).then(async () => {
        console.log(`Running: ${projectFolder}/${execFile}\n`);
        const process = Deno.run({
          cmd: runCommand,
          cwd: projectFolder,
          stdout: "piped",
        });

        let p = new Uint8Array(1);
        while (await process.stdout?.read(p) !== null) {
          Deno.stdout.writeSync(p);
          p = new Uint8Array(1);
        }
      }).catch(() => {
        console.log("> Permissions rejected!");
      });
    } else {
      throw new Error(`Missing main field!`);
    }
  } catch (err) {
    throw err;
  }
} else {
  throw new Error(
    `Could not find config file, please make sure the file exists (${fullPath}).`,
  );
}
