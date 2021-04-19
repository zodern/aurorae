import { _addStory, addComponentType } from './client.js';
import Story from './story.svelte';
import { activeStory } from './svelte-store.js';

addComponentType('svelte', {
  create(selected, contentEl) {
    import SvelteWrapper from './svelte-wrapper.svelte';

    activeStory.set(selected.name);
    return new SvelteWrapper({
      target: contentEl,
      props: {
        component: selected.component,
        props: selected.args,
        slots: selected.slots,
        wrapper: selected.wrapper
      }
    });
  },
  destroy(component) {
    activeStory.set(null);
    component.$destroy();
  }
});

export function addStory(name, component, args) {
  return _addStory({
    name,
    component,
    args,
    type: 'svelte'
  });
}

export { Story };
