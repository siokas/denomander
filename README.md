<p align="center"><img src="https://raw.githubusercontent.com/siokas/siokas.github.io/master/img/denomander.png" width="256"></p>
<p align="center">
<img alt="Github Actions" src="https://github.com/siokas/denomander/workflows/DenoCI/badge.svg?branch=master">
<img alt="deno version" src="https://img.shields.io/badge/deno-1.8.1-blue">
<a href="https://nest.land/package/denomander"><img src="https://nest.land/badge.svg" alt="Published on nest.land" /></a>
</p>

_Denomander_ is a solution for [Deno](https://deno.land) command-line
interfaces. It is inspired by [tj](https://github.com/tj)'s
[commander.js](https://github.com/tj/commander.js) for Node.js.

> Denomander is a [Deno](https://deno.land) project so deno must be
> [installed](https://deno.land/manual/getting_started/installation).

> Alternatively, there is a Dockerfile in the root of the project to create an
> image running deno. To use it just build the Docker file
> `docker build -t deno .` Now you can run all the deno commands
> `docker run --rm -v $PWD:/app/ deno test`

## Installation

Using deno.land

```typescript
import Denomander from "https://deno.land/x/denomander/mod.ts";
```

Using nest.land

```typescript
import Denomander from "https://x.nest.land/denomander/mod.ts";
```

## Usage Example

First, in your deno script, create a _program_, optionally passing a name,
description and version. If not you can change them afterwards by setting the
**app_name**, **app_description** and **app_version** variables.

```typescript
const program = new Denomander({
  app_name: "My App Name",
  app_description: "My App Description",
  app_version: "1.0.1",
});
```

There are three option types: **commands**, **options** and **required
options**.

### Options

To set an option just call the **option()** method passing the **short and long
flags** separated by a space and the **description**. The value can be accessed
as properties.

```typescript
program
  .command("serve", "Simple Server")
  .option("-a --address", "Define the address")
  .option("-p --port", "Define the port")
  .parse(Deno.args);

if (program.address) {
  const port = program.port || "8000";
  console.log(`Server is running on ${program.address}:${port}`);
}
```

You may define the option's short and long flags by separating them with a
**space**, **comma** or **| (vertical bar or "pipe")**.

```typescript
program
  .command("serve", "Start up the server")
  .option("-a, --address", "Define the address")
  .option("-p | --port", "Define the port")
  .parse(Deno.args);

console.log(`Server is running on ${program.address}:${program.port}`);
```

### Required Options

The implementation of required option is exactly same as the optional option but
you have to call the **requiredOption()** method instead.

```typescript
program
  .command("serve", "Start up the server")
  .requiredOption("-p --port", "Define the port")
  .option("-a --address", "Define the address")
  .parse(Deno.args);

// The port is required so it must have a value
let address = program.address || "localhost";
console.log(`Server run on ${address}:${program.port}`);
```

### Global Options and Base Command Options

You have the option to define options which belong to all commands (global
option) and options which belong to no command (base command option ex.
`--help`, `--version`).

```typescript
program
  .baseOption("-q --quiet", "Do not output any message")
  .globalOption("-c --color", "Define the output color")
  .parse(Deno.args);
```

#### Custom Option Processing

You may specify a function to do custom processing of option values. The
callback function receives a parameter of the pre-processed value.

```typescript
function parseInteger(value: string): number {
  return parseInt(value);
}

function uppercase(text: string): string {
  return text.toUpperCase();
}

program
  .command("multiply", "Multiply x and y options")
  .option("-x --xnumber", "First Number", parseInteger)
  .option("-y --ynumber", "First Number", parseInteger)
  .action(() => {
    console.log(program.xnumber * program.ynumber);
  });

program
  .command("commit", "Commit Description")
  .requiredOption("-m --message", "Commit Message", uppercase)
  .action(() => {
    console.log(program.message);
  });
```

#### Default Option Value

You may define a default value for options (in case no value is passed by the
user, the app returns the specified default value as the value of the option)

```typescript
program
  .command("foo", "Foo Test")
  .option("-d --default", "Default Value", uppercase, "bar")
  .action(() => {
    console.log(program.default);
  });
```

#### Option choices

You may define a list (array) of accepted choices for each option. If the user
enters anything that is not in this list, a validation error
(OPTION_CHOICE_ERROR) is thrown. To define accepted choices, you have to create
a custom option object and call the `choices()` method passing the array of the
accepted choices:

```typescript
const fruits = new Option({
  flags: "-f --fruits",
  description: "Choose one of accepted choices",
}).choices(["apple", "banana", "orange"]);

program
  .command("choose")
  .addOption(fruits)
  .action(() => {
    console.log(`You chose ${program.fruits}`);
  });
```

### Commands

There are two ways to implement the commands. The first is to use an action
handler by calling the **action()** method immediately after the command
definition passing the callback function and the second is with custom one-line
implementation. **Multiple command arguments are now supported!**

To define a command just call the .command() method and pass the command name
(optionally you may also pass the description and a callback function but if not
you may define them afterwards in their own methods). After the command you have
the option to declare argument(s) inside brackets []. If you want a not required
argument just append a question mark (?) after the name of the argument.

```typescript
program
  .command("mv [from] [to] [message?]", "Start the server")
  .action(({ from, to, message }: any) => {
    // Do your actions here
    console.log(`File is moved from ${from} to ${to}`);
    if (message) {
      console.log("message");
    }
  });

program.parse(Deno.args);

// Command action calback is called in all 3 command names (actual command and two aliases)
```

#### Action Handler

> The argument(s) passed in the callback function is now an object so you may
> destructure the object and take your variable which has the same name with
> your command declaration!

```typescript
program
  .command("clone [foldername]")
  .description("clone a repo")
  .action(({ foldername }: any) => {
    console.log("The repo is cloned into: " + foldername);
  });

program.parse(Deno.args);
```

#### Extra Parameters

> Any options available in the program are passed to the callback function.

```typescript
program
  .command("clone [foldername]")
  .description("clone a repo")
  .option("-b --branch", "Branch to clone")
  .action(({ foldername }: any, { branch }: any) => {
    console.log("Repo: " + foldername);
    console.log("Branch: " + branch);
  });

program
  .command("multiply", "Multiply x and y options")
  .option("-x --xnumber", "First Number", parseInteger)
  .option("-y --ynumber", "First Number", parseInteger)
  .action(({ xnumber, ynumber }: any) => {
    console.log(xnumber * ynumber);
  });

program.parse(Deno.args);
```

#### Custom Implementation

```typescript
program.command("serve", "Start the server");

if (program.serve) {
  console.log("The server has started...");
}

program.parse(Deno.args);
```

### Alias

After the command declaration you have the option to declare as many aliases as
you want for this spesific command.

```typescript
program
  .command("serve", "Start the server")
  .alias("server", "start-server")
  .action(() => {
    console.log("the server is started");
  });

program.parse(Deno.args);

// Command action calback is called in all 3 command names (actual command and two aliases)
```

### Option to Change Default Commands (help, version)

In order to change the default commands (help, version) just call the
corresponding method. In case of help pass the command and the description but
in case of version you may also pass the actual version of the app and after
that the command and the description.

```typescript
program.setVersion("1.8.1", "-x --xversion", "Display the version of the app");

program.parse(args);
```

## Customize Error Messages

There are two ways to change the error messages. You may pass a fourth argument
in new `Denomander()` constructor (errors object) or you may call the
`.errorMessages()` method again passing the error messages in object.

1.

```typescript
const program = new Denomander({
  app_name: "My MY App",
  app_description: "My MY Description",
  app_version: "1.0.1",
  errors: {
    INVALID_RULE: "Invalid Rule",
    OPTION_NOT_FOUND: "Option not found!",
    COMMAND_NOT_FOUND: "Command not found!",
    REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
    REQUIRED_VALUE_NOT_FOUND: "Required command value is not specified!",
    TOO_MANY_PARAMS: "You have passed too many parameters",
  },
});
```

2.

```typescript
program.errorMessages({
  INVALID_RULE: "Invalid Rule",
  OPTION_NOT_FOUND: "Option not found!",
  COMMAND_NOT_FOUND: "Command not found!",
  REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
  REQUIRED_VALUE_NOT_FOUND: "Required command value is not specified!",
  TOO_MANY_PARAMS: "You have passed too many parameters",
});
```

### Improved Error Experience (Option to Throw Errors)

From v0.8 by default Denomander app does not throw the errors but instead it
outputs the error message in the console and exits the app. If you want to throw
all the errors just pass the `throw_errors: true` option inside the AppDetails
in Denomander constructor.

```typescript
const program = new Denomander({
  app_name: "My App Name",
  app_description: "My App Description",
  app_version: "1.0.1",
  throw_errors: true,
});
```

## Used

- [Deno](https://deno.land)
- [Deno STD Libraries](https://deno.land/std/)
- [FlatIcon](https://www.flaticon.com/) for the logo

## Meta

Apostolos Siokas – [@siokas\_](https://twitter.com/siokas_) –
apostolossiokas@gmail.com

## Contributing

Any kind of contribution is welcome!

## License

Distributed under the
[MIT License](https://github.com/siokas/denomander/blob/master/LICENSE).

[https://github.com/siokas/denomander](https://github.com/siokas/denomander)
