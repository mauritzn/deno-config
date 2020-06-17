# deno-config
Repo for proposed Deno config used by a runner. The proposed config fields are not the only fields I think should be available, but rather the ones that are most important.

Relates to Deno issue [#1431](https://github.com/denoland/deno/issues/1431) and my original [Gist](https://gist.github.com/mauritzn/04d8a6e910d6612356d4daf231c7a6d1) version.

-----

**Basic concept Deno runners:**
  - [Simple Deno runner](https://gist.github.com/mauritzn/01f3bff3468e5540c193f6e4976be88b), created using Deno by [@mauritzn](https://github.com/mauritzn).
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

### packageProxies

Package proxies would be a way of allowing for centralized version management and would also make it easier to include a package in multiple files.

Import would use `@`, to show that you are accessing a proxy package.

**Example use-cases:**
  - You are using a package in multiple files and don't want to have to use a massive URL.
  - You are using a specific version of a package in multiple files and don't want to have to replace all occurrences of the import when you want to update the package version.