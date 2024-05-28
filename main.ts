import $ from "@david/dax";
import { load } from "@std/dotenv";
import { Command, Flag, Help, Name, Opt, Rest, Version } from "@classopt";

@Help("Run a command with dotenv file")
@Name("wenv")
@Version("0.1.0")
class Program extends Command {
  @Opt({ about: "dotenv file", short: true, multiple: true })
  file: string[] = [];

  @Flag({ about: "allow empty values" })
  allowEmpty = false;

  @Rest()
  args: string[] = [];

  async execute() {
    let env = {};
    if (this.file.length === 0) {
      this.file.push(".env");
    }
    for (const f of this.file) {
      const e = await load({
        envPath: f,
        examplePath: null,
        defaultsPath: null,
        allowEmptyValues: this.allowEmpty,
        export: false,
      });
      env = { ...env, ...e };
    }
    const ret = await $`${this.args}`
      .env(env)
      .stdout("inherit")
      .stderr("inherit")
      .noThrow();
    Deno.exit(ret.code);
  }
}

await Program.run(Deno.args);
