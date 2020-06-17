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

type Colors =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";
const logColors: { [colorName: string]: string } = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function colorLog(text: string | string[], color: Colors = "white") {
  const logColor = (color in logColors ? logColors[color] : logColors["white"]);
  if (typeof text === "string") {
    console.log(`${logColor}${text}\x1b[0m`);
  } else {
    console.log(`${logColor}${text[0]}\x1b[0m`, text[1]);
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
  `./demo_projects/stdin_testing`,
  `./demo_projects/denotrain`,
];

const projectFolder = testProjects[2];
const configFile = `deno-config.json`;
const fullPath = `${projectFolder}/${configFile}`;
const watchMode = false;
const watchFsEvents = [
  "create",
  "modify",
  "remove",
];

function permissionRequest(permissions: DenoPermission[]) {
  return new Promise(async (resolve, reject) => {
    if (permissions.length > 0) {
      let buffer = new Uint8Array(100);
      let formattedPermissions: string[] = [];
      permissions.map((permission) => {
        formattedPermissions.push(`  - ${permission}`);
      });

      colorLog(
        "The following permissions are required to run this project:",
        "yellow",
      );
      console.log(formattedPermissions.join("\n"));
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
        else colorLog(`!! Invalid permission: ${permission} !!`, "red");
      } else {
        colorLog(`!! Invalid permission: ${permission} !!`, "red");
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
        colorLog(["Run", `${projectFolder}/${execFile}\n`], "green");
        let process;
        runProject(runCommand, process);
      }).catch((err) => {
        colorLog(">> Permissions rejected! <<", "yellow");
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

async function runProject(
  runCommand: string[],
  process: Deno.Process | undefined,
) {
  process = Deno.run({
    cmd: runCommand,
    cwd: projectFolder,
    stdout: "piped",
  });

  if (watchMode) startWatcher(runCommand, process);

  let p = new Uint8Array(1);
  while (await process.stdout?.read(p) !== null) {
    Deno.stdout.writeSync(p);
    p = new Uint8Array(1);
  }
}

async function startWatcher(runCommand: string[], process: Deno.Process) {
  let lastEvent = 0;
  const watcher = Deno.watchFs(projectFolder);
  for await (const event of watcher) {
    const currentEvent = Date.now();
    if (
      watchFsEvents.includes(event.kind) &&
      (currentEvent - lastEvent > 100)
    ) {
      lastEvent = currentEvent;
      process.close();

      colorLog("\n>> Project change detected, restarting... <<", "cyan");
      runProject(runCommand, process);
      break;
    }
  }
}
