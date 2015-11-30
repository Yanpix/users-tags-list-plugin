# users-tags-list-plugin

# Code Sample

Init
    
```javascript
var userList = $('#user-list').userTagList({
    url: '...',
    beforeAdd: function() {},
    afterAdd: function($row) {}, // method which called after the row added
    beforeRemove: function($row) {}, // method which called before the element going to be removed
    afterRemove: function() {},
    data: {} // default list where key = UserId, value = TagId
});
```
    
Get data

```javascript
userList.userTagList('data');
```