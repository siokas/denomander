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

## ToDo

- [ ] program.on() method
- [ ] Custom option processing
- [X] ~~Option to change default commands (help, version)~~
- [ ] description(), action() methods

## Used

* [Deno](https://deno.land)
* [Deno STD Libraries](https://deno.land/std/)
* [FlatIcon](https://www.flaticon.com/) for the logo 

## Release History

* 0.1.0
    * Initial Commit

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