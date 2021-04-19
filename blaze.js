import { _addStory, addComponentType } from './client.js';

const Wrapper = Symbol('template-wrapper');

addComponentType('blaze', {
  setup() {
    addTemplates();
  },
  create(selected, contentEl) {
    import { Blaze } from 'meteor/blaze';
    let parent = contentEl;
    let wrapper;
    if (selected.wrapper) {
      wrapper = Blaze.render(
        selected.wrapper,
        parent
      );
      parent = document.getElementById('story-blaze-content');
      if (!parent) {
        console.error('Wrapper for Blaze stories must have an element with the "story-blaze-content" id');
      }
    }
    let component = Blaze.renderWithData(
      selected.component,
      selected.args,
      parent,
      null,
      wrapper,
    );
    component[Wrapper] = wrapper;
    return component;
  },
  destroy(component) {
    import { Blaze } from 'meteor/blaze';
    let wrapper = component[Wrapper];

    Blaze.remove(component);
    if (wrapper) {
      Blaze.remove(wrapper);
    }
  }
});

export function addStory(name, template, args) {
  return _addStory({
    name,
    component: template,
    args,
    type: 'blaze'
  });
}

let timeout = null;
const PREFIX = 'story--';

function addTemplates() {
  import { Template } from 'meteor/templating-runtime';
  Object.keys(Template).forEach(name => {
    if (name.startsWith(PREFIX)) {
      addStory(name.slice(PREFIX.length), Template[name]);
    }
  });
}

export function _autoAddStories() {
  if (timeout) {
    return;
  }

  timeout = setTimeout(() => {
    timeout = null;
    addTemplates();
  }, 10);
}
