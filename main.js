if (Meteor.isDevelopment && window.location.pathname === '/__meteor-aurorae') {
  import('./client.js').then(({ showStories }) => {
    showStories();
  });
}
