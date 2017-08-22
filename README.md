# Intro
local-db is a fully pluggable persistent layer which provides basic key/value storage functionality
(get/set/remove/clear). It build on the top of HTML5 localstorage, so local-db has the saimilar api.

# Motivation
why I invented this, why not using localstorage? okay, cause localstorage has no **type**.
for example, when I want to save an object or boolean.

```
localStorage.setItem('bool', true)
localStorage.setItem('object', {a:'xxxx'})
localStorage.getItem('bool') // "true"
localStorage.getItem('object') // "[object Object]"
```
so we have to convert it before using. for example:

```
Boolean(localStorage.getItem('bool'))

// and you should also change the setting method to :
// localStorage.setItem('object', JSON.stringify({a:'xxxx'}))
JSON.parse(localStorage.getItem('object')) 

```

disgusting ... right?

# Install

```bash
 npm i local-db
```

```js
// Example store.js usage with npm
var store = require('local-db')
store.set('user', { name:'Marcus' })
store.get('user').name == 'Marcus'

```
# API

build-in type : ["boolean", "number", "string", "array", "date", "object", "moment"].
you can easily set and get, don't worry about the type converting.
and you'r welome to add more types, cause it's fully pluggable.

```
 get(key)
 set(key, value)
 clear()
 remove(key)
 
 ```
 
 # Using Plugins
 
 ```js
 // Example plugin usage:
var historyPlugin = require('store/plugins/history')
db.use(historyPlugin)
 
 ```
 
 # Write your own plugin
 
 plugin is a function that returns an object that gets added to the store. If any of the plugin functions overrides existing functions, 
 the plugin function can still call the original function using the first argument (super_fn).
 
 ```js
 // Example plugin that stores a version history of every value
var versionHistoryPlugin = function() {
	var historyStore = this.namespace('history')
	return {
		set: function(super_fn, key, value) {
			var history = historyStore.get(key) || []
			history.push(value)
			historyStore.set(key, history)
			return super_fn()
		},
		getHistory: function(key) {
			return historyStore.get(key)
		}
	}
}
db.use(versionHistoryPlugin)
store.set('foo', 'bar 1')
store.set('foo', 'bar 2')
store.getHistory('foo') == ['bar 1', 'bar 2']
 ```
 
 # middleware
 middleware is a function which take the params passed by user in , **do something** . your can log all the operations
 for example.
 
 # License
 MIT
