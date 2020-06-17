# deno-config
Repo for proposed Deno config used by a runner. The proposed config fields are not the only fields I think should be available, but rather the ones that are most important.

Relates to Deno issue [#1431](https://github.com/denoland/deno/issues/1431) and my original [Gist](https://gist.github.com/mauritzn/04d8a6e910d6612356d4daf231c7a6d1) version.

-----

**Basic concept Deno runners:**
  - [Simple Deno runner](https://github.com/mauritzn/deno-config/blob/master/Simple%20runner/runner.ts), created using Deno *(TypeScript)* by [@mauritzn](https://github.com/mauritzn).
  - [denorun](https://github.com/zinthose/denorun), created using Python by [@zinthose](https://github.com/zinthose).

-----

### name

The name of the project, could have similar restrictions as the name field for Node.js.

<br />

### description

Description of what the project is or does.

<br />

### version

Current version of the project. Semantic Versioning (MAJOR.MINOR.PATCH).

<br />

### author

Who the author of the project is, can be either an object, or a string.

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

<br />

### main *(required)*

Which file should be run.

<br />

### permissions

Which permissions the project requires to run. If this does not exist, then no permissions are assumed.

**Valid permissions:**
  - allow-env
  - allow-hrtime
  - allow-net / allow-net=URL1 / allow-net=URL1,URL2
  - allow-read
  - allow-run
  - allow-write

<br />

### imports

[Import maps](https://deno.land/manual/linking_to_external_code/import_maps), instead of having them in a separate config file.
