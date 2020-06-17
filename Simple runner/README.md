# Simple Deno runner

This is a simple concept running built using Deno *(TypeScript)*. On Linux you can easily run it using `run.sh`, if you can't use the run file, then run it manually using: `deno run --allow-read --allow-run ./runner.ts`

The handling of stdout is not really great at the moment, but it works, I will try to rework it later.

Permission handling is working well, but currently there is no way to save the selected choice.
