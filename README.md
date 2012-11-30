## jQuery UI Multiselect

My goal is to use CSS3 and other things and follow the jQuery plan to drop support for IE6, IE7, and IE8. I will only support modern browsers so do not file bugs for older browsers as I will not fix them.

### How to Use

```html
<select class="multiselect" multiple="multiple" name="countries[]">
  <option value="pickles">Pickles</option>
  <option value="cheese">Cheese</option>
  <option value="Lettuce">lettuce</option>
  <option value="Tomato">Tomato</option>
</select>
```

```javascript
$(function(){
  $('.multiselect').multiselect();
});
```

### Options
Defaults:
```javascript
{
    sort: function(a,b) {
      return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
    }
}
```

### License

Copyright 2012 Alex Rhea and other contributors
http://www.alexrhea.io/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.