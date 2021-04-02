# Aurorae

Development environment for UI components, built for Meteor. Similar to [Storybook](https://storybook.js.org/).

Features:

- Simple API to define stories for React, Blaze, Svelte, and Vue
- Updates stories and components with HMR (Requires Meteor 2)
- Use Meteor packages and API's in your stories
- Runs as part of your Meteor app - no extra command to run

Meteor 2 or newer is recommended.

## Getting Started

Add `zodern:aurorae` with

```bash
meteor add zodern:aurorae
meteor npm install --save-dev svelte@3.31.2
```

Start your app and navigate to `/__meteor-aurorae` to view the stories in your app. For some apps, you might need to adjust the router to prevent redirecting away from `/__meteor-aurorae`.

Stories are defined in files with the `.stories.js` extension (for example, `button.stories.js`). These files are automatically imported in your app during development, and excluded when building for production.

## UI Frameworks

### React

Add story:

```js
import { addStory } from 'meteor/zodern:aurorae/react';
import Button './Button.jsx';

// addStory(name, component, props)
addStory(
  'Button - dark',
  Button,
  { title: 'Explore', theme: 'dark' }
);
```

If you want to wrap your component with another component, for example if it consumes react context or needs a parent element styled a certain way, you can add a wrapper by:

```js
addStory(
  'Button - light',
  Button,
  { title: 'Hide', theme: 'light' }
)
  // The wrapper function is given the children that should be rendered, and returns a react element
  .wrap(({ children }) => <DarkContainer>{children}</DarkContainer>);
```

### Svelte

Add story:

```js
import { addStory } from 'meteor/zodern:aurorae/svelte';
import Button './Button.svelte';

// addStory(name, component, props)
addStory(
  'Button - dark',
  Button,
  { title: 'Explore', theme: 'dark' }
);
```

If you want to wrap your component with another component, you can add a wrapper by:

```js
import Wrapper from './Wrapper.svelte';
addStory(
  'Button - light',
  Button,
  { title: 'Hide', theme: 'light' }
)
  // The wrapper component
  .wrap(Wrapper);
```

The wrapper component receives two props: `component` with the story component, and `props` with the props that should be passed to the component. For example, the wrapper could look like:

```html
<script>
  export let component;
  export let props;
</script>

<div>
  <svelte:component this={component} {...props}></svelte:component>
</div>

<style>
  div {
    max-width: 400px;
    padding: 20px;
    background: #EEE;
  }
</style>
```

### Blaze

Add story:

```js
import { addStory } from 'meteor/zodern:aurorae/blaze';
import './button.html';

// addStory(name, template/Blaze view, data)
addStory(
  'Button - dark',
  Template.button,
  { title: 'Explore', theme: 'dark' }
);
```

If you want to wrap your template with another template, you can add a wrapper by:

```js
import Wrapper from './Wrapper.svelte';
addStory(
  'Button - light',
  Template.button,
  { title: 'Hide', theme: 'light' }
)
  // The wrapper template
  .wrap(Template.storyWrapper);
```

The wrapper template should have an element with the `story-blaze-content` id. The story's template is rendered inside of that element. For example, the wrapper could look like:

```html
<template name="storyWrapper">
  <div id="story-blaze-content" style="background: black; padding: 100px;"></div>
</template>
```

### Vue

Add story:

```js
import { addStory } from 'meteor/zodern:aurorae/vue';
import Button from './button.vue';

// addStory(name, component, props)
addStory(
  'Button - dark',
  Button,
  { title: 'Explore', theme: 'dark' }
);
```

If you want to wrap your component with another component, you can add a wrapper by:

```js
import Wrapper from './wrapper.vue';
addStory(
  'Button - light',
  Button,
  { title: 'Hide', theme: 'light' }
)
  // The wrapper component
  .wrap(Wrapper);
```

The wrapper template should have a default slot. For example:

```html
<template>
  <div style="background: black; padding: 100px;">
    <slot></slot>
  </div>
</template>

<script>
  export default {};
</script>

```

## Group Stories

To group stories in the sidebar, you can include the group in the story name in the format `Group Name - Story Name`. For example, `Button - light` and `Button - dark` would both be in the `Button` group.

## Show Aurorae

Aurorae will automatically show itself if when the page loads the url is `/__meteor-aurorae`. You can also show Aurorae with:

```js
import { showStories } from 'meteor/zodern:aurorae';

showStories();
```

## Keyboard shortcuts

- `j` go to next story
- `k` go to previous story
