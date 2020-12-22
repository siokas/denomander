<p align="center"><img src="https://raw.githubusercontent.com/siokas/siokas.github.io/master/img/denomander.png" width="256"></p>
<p align="center">
<img alt="Github Actions" src="https://github.com/siokas/denomander/workflows/DenoCI/badge.svg?branch=master">
<img alt="deno version" src="https://img.shields.io/badge/deno-1.6.1-blue">
<a href="https://nest.land/package/denomander"><img src="https://nest.land/badge.svg" alt="Published on nest.land" /></a>
</p>

_Denomander_ is a solution for [Deno](https://deno.land) command-line interfaces. It is inspired from [commander.js](https://github.com/tj/commander.js) by [tj](https://github.com/tj) which is the node's version.

> [__Lizard__ 🦎](https://github.com/siokas/denomander/wiki/Lizard-%F0%9F%A6%8E): There is a new, much simpler and much cleaner, way to define you cli commands and options. It is called [__Lizard__ 🦎](https://github.com/siokas/denomander/wiki/Lizard-%F0%9F%A6%8E) and it is inspired by Laravel's Artisan commands. [For more, follow the instructions...](https://github.com/siokas/denomander/wiki/Lizard-%F0%9F%A6%8E) .

> Denomander is a [Deno](https://deno.land) project so it needs to have deno installed in your system. 
> If you don't there is a Dockerfile in the root of the project to create an image running deno
> To use it just build the Docker file `docker build -t deno .`
> Now you can run all the deno commands `docker run --rm -v $PWD:/app/ deno test`

## Installation

Using Nest Land
```javascript
import Denomander from "https://x.nest.land/denomander@0.7.0/mod.ts";
```

Using Deno Land
```javascript
import Denomander from "https://deno.land/x/denomander/mod.ts";
```

## Usage example

At first initialize the app and optionally you may pass the name, description and version of the app. If not you can change them afterwards by setting the __app_name__, __app_description__ and __app_version__ variables.

```javascript
const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1"
  }
);
```

There are three option types: __commands__, __options__ and __required options__.

### Options
To set an option just call the __option()__ method passing __a) the sort and the long flag__ seperated by space and __b) the description__. The value can be accessed as properties.

```javascript
program
  .command("serve", "Simple Server")
  .option("-a --address", "Define the address")
  .option("-p --port", "Define the port")
  .parse(Deno.args);

  if(program.address){
    const port = program.port || "8000";
    console.log(`Server is running on ${program.address}:${port}`);
  }
```

__You may define the option's short and long flags by seperating them with either with a) space, b) comma, or c) | (vertical bar or "pipe")__

```javascript
program
  .command("serve", "Start up the server")
  .option("-a, --address", "Define the address")
  .option("-p | --port", "Define the port")
  .parse(Deno.args);

console.log(`Server is running on ${program.address}:${program.port}`);
```

### Required Options
The implementation of required option is exactly same as the optional option but you have to call the __requiredOption()__ method instead.

```javascript
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
You have the option to define options which belong to all commands (global option) and options which belong to no command (base command option ex. --help, --version)

```javascript
program
  .baseOption("-q --quiet", "Do not output any message")
  .globalOption("-c --color", "Define the output color")
  .parse(Deno.args);
```

### Custom option processing

You may specify a function to do custom processing of option values. The callback function recieves a parameter of the pre-processed value.

```javascript
function parseInteger(value: string): number {
  return parseInt(value);
}

function upercase(text: string): string {
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
  .requiredOption("-m --message", "Commit Message", upercase)
  .action(() => {
    console.log(program.message);
  });
```

### Commands
There are two ways to implement the commands. The first is to use an action handler by calling the __action()__ method immediately after the command definition passing the callback function and the second is with custom one-line implementation. __Multiple command arguments are now supported!__

To define a command just call the .command() method and pass the command name (optionally you may also pass the description and a callback function but if not you may define them afterwards in their own methods). After the command you have the option to declare argument(s) inside brackets []. If you want a not required argument just append a question mark (?) after the name of the argument.

```javascript
program
 .command("mv [from] [to] [message?]", "Start the server")
 .action(({from, to, message}:any)=>{
   // Do your actions here
   console.log(`File is moved from ${from} to ${to}`);
   if(message){
     console.log("message")
   }
 });

program.parse(Deno.args);

// Command action calback is called in all 3 command names (actual command and two aliases)
```

#### Action Handler

> The argument(s) passed in the callback function is now an object so you may destructure the object and take your variable which has the same name with your command declaration!

```javascript
program
  .command("clone [foldername]")
  .description("clone a repo")
  .action(({foldername}:any) => {
    console.log("The repo is cloned into: " + foldername);
  });

program.parse(Deno.args);
```

#### Custom Implementation
```javascript
program.command("serve", "Start the server");

if(program.serve){
  console.log("The server has started...");
}

program.parse(Deno.args);
```

### Alias

After the command declaration you have the option to declare as many aliases as you want for this spesific command.

```javascript
program
 .command("serve", "Start the server")
 .alias("server", "start-server")
 .action(()=>{
   console.log("the server is started");
 });

program.parse(Deno.args);

// Command action calback is called in all 3 command names (actual command and two aliases)
```


### Option to change default commands (help, version)

In order to change the default commands (help, version) just call the corresponding method. In case of help pass the command and the description but in case of version you may also pass the actual version of the app and after that the command and the description. 

```javascript
 program.setVersion(
    "1.8.1",
    "-x --xversion",
    "Display the version of the app"
  );
  
  program.parse(args);
```

## Customize error messages

There are two ways to change the error messages. You may pass a fourth argument in new Denomander() constructor (errors object) or you may call the .errorMessages() method again passing the error messages in object.
1.
```javascript
const program = new Denomander(
  {
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
    }
  },
);
```
2.
```javascript
program.errorMessages({
  INVALID_RULE: "Invalid Rule",
  OPTION_NOT_FOUND: "Option not found!",
  COMMAND_NOT_FOUND: "Command not found!",
  REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
  REQUIRED_VALUE_NOT_FOUND: "Required command value is not specified!",
  TOO_MANY_PARAMS: "You have passed too many parameters",
});
```

## ToDo

-  [X] Custom option processing
-  [ ] More examples
-  [ ] More tests
-  [X] Easy Error Customization
-  [ ] Documentation
-  [ ] Chanage --help default output
-  [X] Command with multiple arguments

## Used

-  [Deno](https://deno.land)
-  [Deno STD Libraries](https://deno.land/std/)
-  [FlatIcon](https://www.flaticon.com/) for the logo 

## Meta

Apostolos Siokas – [@siokas_](https://twitter.com/siokas_) – apostolossiokas@gmail.com

## Contributing

Any kind of contribution is welcome!

## License

Distributed under the [MIT License](https://github.com/siokas/denomander/blob/master/LICENSE). 

[https://github.com/siokas/denomander](https://github.com/siokas/denomander)