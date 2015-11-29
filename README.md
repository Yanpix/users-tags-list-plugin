# users-tags-list-plugin

# Code Sample

Init
    
```javascript
var userList = $('#user-list').userTagList({
    url: '...',
    beforeAdd: function() {},
    afterAdd: function() {}, // method which called after the row added
    beforeRemove: function($row) {}, // method which called before the element going to be removed
    afterRemove: function($row) {}
});
```
    
Get data

```javascript
userList.userTagList('data');
```