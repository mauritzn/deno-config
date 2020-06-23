# deno-config
Repo for proposed Deno config used by a runner. The proposed config fields are not the only fields I think should be available, but rather the ones that are most important.

Relates to Deno issue [#1431](https://github.com/denoland/deno/issues/1431) and my original [Gist](https://gist.github.com/mauritzn/04d8a6e910d6612356d4daf231c7a6d1) version.

-----

**Basic concept Deno runners:**
  - [deno-runner](https://github.com/mauritzn/deno-runner), created using Deno *(TypeScript)* by [@mauritzn](https://github.com/mauritzn).
  - [denorun](https://github.com/zinthose/denorun), created using Python by [@zinthose](https://github.com/zinthose).

-----

### name

The name of the project, could have similar restrictions as the name field in [NPM's package.json](https://docs.npmjs.com/files/package.json#name). But since the name field is used more as metadata only, it might be better to not have a lot of restrictions on it.

<br />

### description

Description of what the project is or does.

<br />

### version

Current version of the project. Semantic Versioning (MAJOR.MINOR.PATCH).

<br />

### author

Who the author of the project is, can be either an object, or a string. Can include name, email and URL.

**String:** `"Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"`

**Object:**
```json
{
  "name": "Barney Rubble",
  "email": "b@rubble.com",
  "url": "http://barnyrubble.tumblr.com/"
}
```

<br />

### contributors

Would have the same format as author, but would be an array.

**Array:**
```json
[
  {
    "name": "Barney Rubble",
    "email": "b@rubble.com",
    "url": "https://barnyrubble.tumblr.com/"
  },
  "Jessica Hendersson <j@hendersson.com> (https://jessicahendersson.tumblr.com/)"
]
```

<br />

### main *(required)*

Which file should be run using Deno. This should be a relative path to the file to run.

**Example (src folder):**

In the example below, main would be `"src/index.ts"` or `"./src/index.ts"`.

```
my-project
  src
    index.ts
    utils.ts
  deno_config.json
  README.md
```

**Example (same folder):**

In the example below, main would be `"index.ts"` or `"./index.ts"`.

```
my-project
  index.ts
  deno_config.json
  README.md
```

<br />

### unstableFlag

Whether or not the project should run using Deno's `--unstable` flag. unstableFlag take a boolean value either `true` or `false`. If unstableFlag is not provided then it defaults to `false`. 

<br />

### permissions

Which permissions the project requires to run. If this does not exist, then no permissions are assumed.

**Valid permissions:**
  - allow-env
  - allow-hrtime
  - allow-net / allow-net=URL1 / allow-net=URL1,URL2
  - allow-read / allow-read=PATH1 / allow-read=PATH1,PATH2
  - allow-write / allow-write=PATH1 / allow-write=PATH1,PATH2
  - allow-run

<br />

### imports

[Import maps](https://deno.land/manual/linking_to_external_code/import_maps), instead of having them in a separate config file.
