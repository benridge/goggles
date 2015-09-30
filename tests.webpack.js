const context = require.context('./src', true, /Spec.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);