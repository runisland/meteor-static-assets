# runisland:static-assets
Automatically load static assets (fonts, images…) from dependencies
(like `node_modules` or any directory) into your Meteor project, as if you
had copied them manually into your `public` folder.

[![GitHub releases](https://img.shields.io/github/release/runisland/meteor-static-assets.svg?label=GitHub)](https://github.com/runisland/meteor-static-assets/releases)

_Derived from [`mys:fonts`](https://github.com/jellyjs/meteor-fonts) package._



## Quick Guide

1. Add this package to your Meteor project: `meteor add runisland:static-assets`

2. Create a `static-assets.json` file at the root of your Meteor project.

3. List your static assets in the `"map"` hash map, following the convention:<br>
`"true/path/from/project/root/to/file.png": "target/path/in/public/folder/to/file.png"`

For example:

```json
{
    "map": {
        "node_modules/ionic-angular/fonts/": "fonts/"
    }
}
```

As you can notice, by default this package can scan all files in the specified folder
(but not recursively, i.e. it does not work if files are in sub-folders of the specified path).


## Configuration

| Option  | Type   | Default | Description |
| :------ | :----- | :------ | :---------- |
| **map** | `Object<String>` | `{}` | List of files and/or folders to load as static assets. Filtered by `extensions`. Not recursive for folders. |
| **extensions** | `Array<String>` | `["ttf", "woff", "png"]` | List of extensions to be considered. Any file in `"map"` with non-matching extension will be ignored. |
| **scanFolders** | `boolean` | `true` | Enable scanning files in folders specified in `"map"` (must contain the trailing slash `/`). The file name is kept intact and is appended to the target path (which must also include the trailing slash `/`). Not recursive (i.e. does not scan files in sub-folders of the specified path).
| **verbose** | `boolean` | `false` | Display loaded static assets in compiler console. |


## What about stylesheets?

For stylesheets, you can import them using `import "module-name/path/to/stylesheet.css";` simple statement,
provided that you have the `ecmascript` package in your Meteor project.
Meteor will automatically convert it into a dynamic stylesheet link.

Reference: https://guide.meteor.com/v1.3/using-npm-packages.html#npm-styles

You can also create a symlink or directly copy the file into your `client` folder,
so that it is compiled, bundled and minified with the rest of the stylesheets.

As for relative links to static assets, remember that Meteor will serve the stylesheet at the app root level
(even when dynamically linked), and remove any parent path (`../`).
Therefore, the target path that you specify in `static-assets.json` must match the original relative link,
without any parent level path (i.e. remove any `../`).


## What about scripts?

As of Meteor 1.3, you can directly use `import { member } from "module-name";` statement to use a script from an `npm` dependency.

Reference: https://guide.meteor.com/v1.3/using-npm-packages.html#using-npm



## Rationale

### Why not directly using Atmosphere packages?

Sometimes there is no wrapper in Atmosphere for your favorite library
 or they might not be up-to-date with their `npm` source (or whatever source).

This is even more true since Meteor 1.3, because we can now directly use `npm` modules.
Unfortunately, Meteor does not provide yet an out-of-the-box solution for
static assets which might be shipped with those modules.


### Difference with `mys:fonts` package

This package also matches files that are specified through their immediately
containing parent folder, whereas with `mys:fonts` you need to list each
file individually.


### Why not copying files with gulp, Jake, whatever?

Of course, you can use your method of choice to perform this task.

It could even be more efficient, since you would copy your static assets
only once to your `public` folder (or whenever your dependencies are updated),
whereas this Meteor package scans all files in your project and re-runs at
every build (because it is actually registered as a _compiler_ build plugin).

The main advantage of this Meteor package is that it is a very simple tool
to perform the task directly with Meteor build system, instead of having to pick,
possibly learn and setup another one.


## Limitations

Because this package is actually a Meteor _compiler_ build plugin,
it has to share file extensions with other compilers
(hence the requirement to explicitly specify file extensions in the first place).

Since you can have only 1 compiler per file extension, you should not try
to use this package to handle `js` and `css` extensions, and their derivatives
if applicable (`jsx`, `ts`, `coffee`, `scss`, etc.).


## License

[![license](https://img.shields.io/github/license/runisland/meteor-static-assets.svg)](LICENSE)

`runisland:static-assets` is distributed under the [MIT License](http://choosealicense.com/licenses/mit/) (Expat type), like `mys:fonts` and Meteor.
