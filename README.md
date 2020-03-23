<p align="center"><img src="https://github.com/siokas/siokas.github.io/blob/master/img/denomander.png" width="256"></p>
<p align="center">
<img alt="Travis (.com)" src="https://img.shields.io/travis/com/siokas/denomander">
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/siokas/denomander">
</p>

_Denomander_ is a solution for [Deno](https://deno.land) command-line interfaces. It is inspired from [commander.js](https://github.com/tj/commander.js) by [tj](https://github.com/tj) which is the node's version.

## Installation

```javascript
import Denomander from "https://deno.land/x/denomander/mod.ts";
```

## Usage example

At first initialize the app and optionally you may pass the name, description and version of the app. If not you can change them afterwards by setting the __app_name__, __app_description__ and __app_version__ variables.

```javascript
let program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1"
  }
);
```

There are three option types: __commands__, __options__ and __required options__.

### Options
To set an option just call the **option()** method passing __a) the sort and the long flag__ seperated by space and __b) the description__. The value can be accessed as properties.

```javascript
program
  .option("-a --address", "Define the address")
  .option("-p --port", "Define the port")
  .parse(Deno.args);

  if(program.address){
    let port = program.port || "8000";
    console.log(`Server run on ${program.address}:${port}`);
  }
```

### Required Options
The implementation of required option is exactly same as the optional option but you have to call the **requiredOption()** method instead.

```javascript
program
  .option("-a --address", "Define the address")
  .requiredOption("-p --port", "Define the port")
  .parse(Deno.args);

  // The port is required so it must have a value
  let address = program.address || "localhost";
  console.log(`Server run on ${address}:${program.port}`);
```

### Commands
There are two ways to implement the command options. The first is to use an action handler by calling the **action()** method immediately after the command definition passing the callback function and the second is with custom one-line implementation.

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

- [X] program.on() method
- [ ] Custom option processing
- [X] Option to change default commands (help, version)
- [X] description(), action() methods
- [ ] Multiple short flags (-abc)

## Used

* [Deno](https://deno.land)
* [Deno STD Libraries](https://deno.land/std/)
* [FlatIcon](https://www.flaticon.com/) for the logo 

## Release History

* 0.1.0
    * Initial Commit
    * Change Command of Default Options [help, version]
    * Custom help and version (program.on() method)
* 0.2.0
    * Add description() and action() methods for commands
    

## Meta

Apostolos Siokas – [@siokas_](https://twitter.com/siokas_) – apostolossiokas@gmail.com

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

Distributed under the [MIT License](https://github.com/siokas/denomander/blob/master/LICENSE). 

[https://github.com/siokas/denomander](https://github.com/siokas/denomander)