
# Report an Issue

Help us make AngularEditor better! If you think you might have found a bug, or some other weirdness, start by making sure
it hasn't already been reported. You can [search through existing @kolkov/angular-editor issues](https://github.com/kolkov/angular-editor/issues)
to see if someone's reported one similar to yours.

If not, then [create a plunkr](http://bit.ly/UIR-Plunk) that demonstrates the problem (try to use as little code
as possible: the more minimalist, the faster we can debug it).

Next, [create a new issue](https://github.com/kolkov/angular-editor/issues/new) that briefly explains the problem,
and provides a bit of background as to the circumstances that triggered it. Don't forget to include the link to
that plunkr you created!

**Note**: If you're unsure how a feature is used, or are encountering some unexpected behavior that you aren't sure
is a bug, it's best to talk it out on
[StackOverflow](http://stackoverflow.com/questions/ask?tags=angular,@kolkov/angular-editor) before reporting it. This
keeps development streamlined, and helps us focus on building great software.


Issues only! |
-------------|
Please keep in mind that the issue tracker is for *issues*. Please do *not* post an issue if you need help or support. Instead, use StackOverflow. |

# Contribute

**(1)** See the **[Developing](#developing)** section below, to get the development version of AngularEditor up and running on your local machine.

**(2)** Check out the [roadmap](https://github.com/kolkov/angular-editor/milestones) to see where the project is headed, and if your feature idea fits with where we're headed.

**(3)** If you're not sure, [open an RFC](https://github.com/kolkov/angular-editor/issues/new?title=RFC:%20My%20idea) to get some feedback on your idea.

**(4)** Finally, commit some code and open a pull request. Code & commits should abide by the following rules:

- *Always* have test coverage for new features (or regression tests for bug fixes), and *never* break existing tests
- Commits should represent one logical change each; if a feature goes through multiple iterations, squash your commits down to one
- Make sure to follow the [Angular commit message format](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format) so your change will appear in the changelog of the next release.
- Changes should always respect the coding style of the project



# Developing

`angular-editor` uses <code>Angular cli</code>, <code>npm</code> and <code>webpack</code>.

## Fetch the source code

The code for `angular-editor` is :

* [AngularEditor](https://github.com/kolkov/angular-editor) (`@kolkov/angular-editor` on npm)

Clone repository.

```
mkdir angular-editor
cd angular-editor
git clone https://github.com/kolkov/angular-editor.git
```

## Install dependencies

Use `npm` to install the development dependencies for the repository.

```
cd angular-editor
npm install
```

After executing these steps, your local copy of `@kolkov/angular-editor-app` will be built using your local copy of `@kolkov/angular-editor`
instead of the prebuilt version specified in `package.json`.

## Develop

* `npm run build and watch angular-editor`: Continuously builds the `@kolkov/angular-editor` code when sources change.
* `npm run start`: Continuously builds and runs Demo app when source or tests change.
