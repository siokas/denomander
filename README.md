<p align="center"><img src="https://raw.githubusercontent.com/siokas/siokas.github.io/master/img/denomander.png" width="256"></p>
<p align="center">
<a href="https://travis-ci.com/siokas/denomander"><img alt="Travis (.com)" src="https://travis-ci.com/siokas/denomander.svg?branch=master"></a>
<a href="https://github.styleci.io/repos/245916074"><img src="https://github.styleci.io/repos/245916074/shield?branch=master" alt="StyleCI"></a>
<a href="https://app.codacy.com/manual/apostolossiokas/denomander?utm_source=github.com&utm_medium=referral&utm_content=siokas/denomander&utm_campaign=Badge_Grade_Dashboard"> <img src="https://api.codacy.com/project/badge/Grade/b9b7465c7a7e40b5af20edc6c9eb5cdf"></a>
</p>

_Denomander_ is a solution for [Deno](https://deno.land) command-line interfaces. It is inspired from [commander.js](https://github.com/tj/commander.js) by [tj](https://github.com/tj) which is the node's version.

> Denomander is a [Deno](https://deno.land) project so it needs to have deno installed in your system. 
> If you don't there is a Dockerfile in the root of the project to create an image running deno
> To use it just build the Docker file `docker build -t deno .`
> Now you can run all the deno commands `docker run --rm -v $PWD:/app/ deno test`

## Installation

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
  .option("-a, --address", "Define the address")
  .option("-p | --port", "Define the port")
  .parse(Deno.args);

console.log(`Server is running on ${program.address}:${program.port}`);
```

### Required Options
The implementation of required option is exactly same as the optional option but you have to call the __requiredOption()__ method instead.

```javascript
program
  .option("-a --address", "Define the address")
  .requiredOption("-p --port", "Define the port")
  .parse(Deno.args);

  // The port is required so it must have a value
  let address = program.address || "localhost";
  console.log(`Server run on ${address}:${program.port}`);
```
#### Multiple short flags is supported (example from docker exec command)

You have the option to pass more than one short flags.

```javascript
program
  .option("-i --interactive ", "Keep STDIN open even if not attached")
  .option("-t --tty", "Allocate a pseudo-TTY")
  .parse(Deno.args);

  if(program.interactive){
    console.log('Interactive Mode');
  }

  if(program.tty){
    console.log('Pseudo-TTY');
  }

  // deno run example.ts -it 
  // The previous command passes true in both if statements therfore it prints out both console.log commands
```           

### Commands
There are two ways to implement the command options. The first is to use an action handler by calling the __action()__ method immediately after the command definition passing the callback function and the second is with custom one-line implementation.

#### Action Handler
```javascript
program
  .command("clone [foldername]")
  .description("clone a repo")
  .action((foldername) => {
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

### Option to change default commands (help, version)

In order to change the default commands (help, version) just call the corresponding method. In case of help pass the command and the description but in case of version you may also pass the actual version of the app and after that the command and the description. 

```javascript
 program.setVersion(
    "1.8.1",
    "-x --xversion",
    "Display the version of the app"
  );

  program.setHelp(
    "-c --customhelp",
    "Custom print help"
  );
  
  program.parse(args);
```

### Custom help and version

To customize the commands call on() method passing the command and the callback function.

> Must be before parse()

```javascript
program.on("--help", () => {
  console.log("New Help Screen");
  console.log("--- --- ---");
  console.log("-p --port Define port");
});

program.on("--version", () => {
  console.log("New version are coming next week");
  console.log("v1.5.6");
});

// Last command
program.parse(args);
```

## ToDo

-  [X] program.on() method
-  [ ] Custom option processing
-  [X] Option to change default commands (help, version)
-  [X] description(), action() methods
-  [X] Multiple short flags (-abc)
-  [ ] Long Flag alias

## Used

-  [Deno](https://deno.land)
-  [Deno STD Libraries](https://deno.land/std/)
-  [FlatIcon](https://www.flaticon.com/) for the logo 

## Meta

Apostolos Siokas – [@siokas_](https://twitter.com/siokas_) – apostolossiokas@gmail.com

## Contributing

1.  Fork it (<https://github.com/yourname/yourproject/fork>)

2.  Create your feature branch (`git checkout -b feature/fooBar`)

3.  Commit your changes (`git commit -am 'Add some fooBar'`)

4.  Push to the branch (`git push origin feature/fooBar`)

5.  Create a new Pull Request

## License

Distributed under the [MIT License](https://github.com/siokas/denomander/blob/master/LICENSE). 

[https://github.com/siokas/denomander](https://github.com/siokas/denomander)
