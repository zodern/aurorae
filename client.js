import Sidebar from './sidebar.svelte';
import './styles.css';
import './hmr-integration';

let sidebarContainer;
let shadowContent;
let content;
let sidebar;

const styles = `
  :host {
    all: initial;
  }

  div {
    width: 100%;
    background: #EEE;
    height: 100%;
    font-size: 14px;
    overflow-y: auto;
  }

  h1 {
    padding-left: 20px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li.group {
    border-top: 2px solid #DDD;
    margin: 5px 0;
  }


  li.story {
    padding: 5px 20px;
    cursor: pointer;
    border-left: 4px solid transparent;
  }

  li.story:hover {
    background: #DBD8EA;
  }

  li.selected {
    font-weight: bold;
    border-left: 4px solid #8f84c4;
  }
`;

const stories = Object.create(null);
let selected = null;
let componentType = null;
let component = null;

const hashPrefix = '#story=';

const Types = Object.create(null);

function showSelected(story) {
  selected = story;
  history.replaceState(undefined, undefined, `${hashPrefix}${story.name}`);

  sidebar.$set({ selected })
  destroyComponent();
  createComponent();
}

function destroyComponent() {
  if (!component) {
    return;
  }

  if (componentType in Types) {
    Types[componentType].destroy(component, content);
  }

  component = null;
  componentType = null;
}

function createComponent() {
  componentType = selected.type;
  if (componentType in Types) {
    component = Types[componentType].create(selected, content);
  } else {
    console.log('Unknown story type', componentType);
  }
}

export function showStories() {
  if (sidebarContainer) {
    // already shown
    return;
  }

  sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'METEOR_STORIES-container'
  document.body.append(sidebarContainer);

  var sidebarWrapper = document.createElement('div');
  sidebarWrapper.id = "METEOR_STORIES-sidebar-wrapper";
  sidebarContainer.appendChild(sidebarWrapper);

  content = document.createElement('div');
  content.id = 'METEOR_STORIES-content';
  sidebarContainer.appendChild(content);

  shadowContent = document.createElement('div');
  shadowContent.classList.add('container');

  let shadow = sidebarWrapper.attachShadow({ mode: 'open' });
  shadow.appendChild(shadowContent);

  let style = document.createElement('style');
  style.textContent = styles;
  shadow.appendChild(style);

  sidebar = new Sidebar({
    target: shadowContent,
    props: {
      stories,
      onStory(story) {
        showSelected(story);
      },
      selected
    }
  });

  // Wait until all code has loaded, and any stories in `.stories.svelte`
  // files have registered
  Meteor.startup(() => {
    setTimeout(() => {
      Object.values(Types).forEach(config => {
        if (typeof config.setup === 'function') {
          config.setup();
        }
      });

      let toSelect;
      if (window.location.hash && window.location.hash.startsWith(hashPrefix)) {
        let selectedName = window.location.hash.slice(hashPrefix.length);
        selectedName = decodeURIComponent(selectedName);
        if (selectedName in stories) {
          toSelect = stories[selectedName];
        }
      }
      if (!toSelect) {
        toSelect = Object.values(stories)[0];
      }
      if (toSelect) {
        showSelected(toSelect);
      }
    }, 200);
  });
}

export function _addStory({ name, component, type, args }) {
  const config = {
    name,
    component,
    type,
    args,
    wrapper: null,
    slots: Object.create(null)
  };
  stories[name] = config;

  if (sidebar) {
    setTimeout(() => {
      sidebar.$set({ stories });
      if (selected && selected.name === name) {
        showSelected(config);
      }
    });
  }

  return {
    wrap(wrapper) {
      config.wrapper = wrapper;
    },
    slot(name, slot, slotProps) {
      config.slots[name] = {
        slot,
        props: slotProps
      };
    }
  };
}

export function addComponentType(type, { setup, create, destroy }) {
  Types[type] = { setup, create, destroy };
}

if (window.location.pathname === '/__meteor-aurorae') {
  showStories();
}
