# Command Line Interface (CLI)

Users can view and manage Daiteap resources through Daiteap CLI tool. The tool is open-source and available at <a href="https://github.com/Daiteap/daiteapcli" target="_blank">Github</a>.

!!! note
    Make sure you have registration at Daiteap platform before start using Daiteap CLI tool.

### Get CLI

* You can build the binary from <a href="https://github.com/Daiteap/daiteapcli" target="_blank">Github source code</a> with this command
```
go build
```
* You can get latest binary version from <a href="https://github.com/Daiteap/daiteapcli/releases" target="_blank">Github</a>
* You can get latest binary version with this command
```
go install github.com/Daiteap/daiteapcli@latest
```

### CLI Usage

* First thing you should do is login into the platform when promted into the browser with this command
```
daiteapcli login
```

* After that you can execute other commands that are available. You can check available commands with help flag.
```
--help
```
!!! note
    Help flag show available subcommands and flags for every command.
