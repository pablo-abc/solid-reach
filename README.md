# Solid ReachUI

This is a port of [ReachUI](https://reach.tech) for Solid that (hopefully) will serve you as _The Accessible Foundation for Solid Apps and Design Systems_.

> **VERY EARLY DEVELOPMENT**: Tests and docs are missing, lots of bugs might be present.

There is no documentation for now but you can see the ported components in [our Storybook](https://pablo-abc.github.io/solid-reach).

## Installation

All components are published as individual packages under the `@solid-reach` namespace. If you wanted to use a dialog, for example, you'd need to install it individually from npm:

```sh
npm i -S @solid-reach/dialog

# yarn

yarn add @solid-reach/dialog
```

## Usage

Proper usage documentation is still missing, but for the components available already (listed below) we aim to have an identical API to the one used by [ReachUI](https://reach.tech). You may also check [Storybook for its usage](https://pablo-abc.github.io/solid-reach).

## Development Progress

The current objective is to get feature-parity with ReachUI. Ideally maintaining an equivalent interface.

✅ - Released<br/>
💪 - Working (missing tests)<br/>
🛠 - Building<br/>
📝 - Documented<br/>

| Status | Name            |
|--------|-----------------|
| 💪     | Accordion       |
| 💪     | Alert           |
| 💪     | Alert Dialog    |
| 🛠      | Checkbox        |
| 💪      | Combo Box       |
| 💪     | Dialog (Modal)  |
| 💪     | Disclosure      |
| 🛠      | Listbox         |
| 🛠      | Menu Button     |
| 🛠      | Slider          |
| 💪     | Portal          |
| 💪     | Skip Nav        |
| 💪      | Tabs            |
| 💪      | Tooltip         |
| 💪     | Visually Hidden |

We are also missing some dev goodies and warnings available in ReachUI.
