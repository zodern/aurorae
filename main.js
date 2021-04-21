function show() {
  import('./client.js').then(({ showStories }) => {
    showStories();
  });
}

if (Meteor.isDevelopment && window.location.pathname === '/__meteor-aurorae') {
  show();
}

export const showStories = show;
