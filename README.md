<p align="center"><img src="https://github.com/siokas/siokas.github.io/blob/master/img/denomander.png" width="256"></p>
<p align="center">
<img alt="Travis (.com)" src="https://img.shields.io/travis/com/siokas/denomander">
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/siokas/denomander">
</p>

_Denomander_ is a solution for [Deno](https://deno.land) command-line interfaces. It is inspired from [commander.js](https://github.com/tj/commander.js) by [tj](https://github.com/tj) which is the node's version.

## Installation

```javascript
import Denomander from "https://raw.githubusercontent.com/siokas/denomander/master/mod.ts";
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

There are three option types: __commands__, __options__ and __required options__. To set an option just call the corresponding method passing __a) the sort and the long flag__ seperated by space and __b) the description__

```javascript
program
  .command("new [name]", "Generate a new file")
  .option("-a --address", "Define the address")
  .option("-p --port", "Define the port")
  .requiredOption("-s --server", "Server Name")
  .parse(Deno.args);

  if(program.address){
    server.name = program.server;
  }

  if(program.port){
    s = serve({ port: program.port });
  }

  if(program.new){
    console.log("Creating the file " + program.new);
  }
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
- [ ] description(), action() methods

## Used

* [Deno](https://deno.land)
* [Deno STD Libraries](https://deno.land/std/)
* [FlatIcon](https://www.flaticon.com/) for the logo 

## Release History

* 0.1.0
    * Initial Commit
    * Change Command of Default Options [help, version]
* 0.2.0
    * Custom help and version (program.on() method)

## Meta

Apostolos Siokas – [@siokas_](https://twitter.com/siokas_) – apostolossiokas@gmail.com

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

Distributed under the [MIT License](https://github.com/siokas/stacksearch/blob/master/LICENSE). 

[https://github.com/siokas/stacksearch](https://github.com/siokas/stacksearch)